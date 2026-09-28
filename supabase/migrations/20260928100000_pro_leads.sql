-- Leads professionnels (devis au kilo et demandes d'échantillon).
--
-- * Insertion uniquement par l'edge function submit-pro-lead (service_role) :
--   aucun accès direct pour anon, aucune policy INSERT/DELETE.
-- * Lecture et changement de statut réservés aux admins (public.has_role).
--   Les admins ne peuvent modifier que la colonne status (updated_at est posé par trigger).
-- * Un échantillon par établissement : index uniques partiels (email, puis société + code postal).
-- * Prix recalculés côté serveur (supabase/functions/_shared/proPricing.ts), stockés en centimes.
--
-- Idempotente : peut être rejouée sans erreur.

CREATE TABLE IF NOT EXISTS public.pro_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  kind text NOT NULL,
  status text NOT NULL DEFAULT 'nouveau',
  company text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  establishment_type text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL,
  address text,
  kg numeric(4,1),
  message text,
  utm jsonb,
  locale text NOT NULL DEFAULT 'fr',
  price_tier text,
  unit_price_cents integer,
  total_cents integer,
  ip_hash text,
  admin_notified_at timestamptz,
  CONSTRAINT pro_leads_kind_check CHECK (kind IN ('devis', 'echantillon')),
  CONSTRAINT pro_leads_status_check CHECK (
    status IN ('nouveau', 'contacte', 'devis_envoye', 'echantillon_envoye', 'gagne', 'perdu')
  ),
  CONSTRAINT pro_leads_establishment_check CHECK (
    establishment_type IN ('restaurant', 'epicerie', 'traiteur', 'distributeur', 'autre')
  ),
  CONSTRAINT pro_leads_kg_check CHECK (kg IS NULL OR (kg >= 0.5 AND kg <= 45)),
  CONSTRAINT pro_leads_devis_kg_check CHECK (kind <> 'devis' OR kg IS NOT NULL),
  CONSTRAINT pro_leads_lengths_check CHECK (
    char_length(company) BETWEEN 2 AND 120
    AND char_length(contact_name) BETWEEN 2 AND 120
    AND char_length(email) BETWEEN 3 AND 254
    AND char_length(city) BETWEEN 2 AND 80
    AND char_length(postal_code) BETWEEN 3 AND 10
    AND (phone IS NULL OR char_length(phone) <= 30)
    AND (address IS NULL OR char_length(address) <= 200)
    AND (message IS NULL OR char_length(message) <= 2000)
  ),
  CONSTRAINT pro_leads_locale_check CHECK (locale IN ('fr', 'en'))
);

CREATE INDEX IF NOT EXISTS pro_leads_created_at_idx ON public.pro_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS pro_leads_email_created_idx ON public.pro_leads (lower(email), created_at);
CREATE INDEX IF NOT EXISTS pro_leads_ip_created_idx ON public.pro_leads (ip_hash, created_at) WHERE ip_hash IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS pro_leads_one_sample_per_email
  ON public.pro_leads (lower(email)) WHERE kind = 'echantillon';
CREATE UNIQUE INDEX IF NOT EXISTS pro_leads_one_sample_per_establishment
  ON public.pro_leads (lower(company), postal_code) WHERE kind = 'echantillon';

CREATE OR REPLACE FUNCTION public.pro_leads_touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pro_leads_touch_updated_at ON public.pro_leads;
CREATE TRIGGER pro_leads_touch_updated_at
  BEFORE UPDATE ON public.pro_leads
  FOR EACH ROW EXECUTE FUNCTION public.pro_leads_touch_updated_at();

ALTER TABLE public.pro_leads ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.pro_leads FROM anon;
REVOKE ALL ON TABLE public.pro_leads FROM authenticated;
GRANT SELECT ON TABLE public.pro_leads TO authenticated;
GRANT UPDATE (status) ON TABLE public.pro_leads TO authenticated;
GRANT ALL ON TABLE public.pro_leads TO service_role;

DROP POLICY IF EXISTS "Admins can read pro leads" ON public.pro_leads;
CREATE POLICY "Admins can read pro leads" ON public.pro_leads
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update pro leads" ON public.pro_leads;
CREATE POLICY "Admins can update pro leads" ON public.pro_leads
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
