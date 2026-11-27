-- Stock de morilles affiché sur le site (décision du fondateur, 2026-11-26).
--
-- * Une seule ligne (id = 1) : le stock réel restant à vendre, en kg (stock en France et lots réservés).
-- * Lecture publique (anon) : le site affiche « Plus que N kg disponibles » et limite la
--   quantité commandable en ligne. Le chiffre affiché doit toujours être le stock réel.
-- * Modification réservée aux admins (/admin), colonnes remaining_kg et note seulement.
-- * Décompte automatique : chaque commande pro payée en ligne (orders.order_type = 'pro_order',
--   écrite par stripe-webhook) retire sa quantité. Les ventes hors site (virement, liens de
--   paiement, main propre) se corrigent à la main dans /admin.
-- * Valeur initiale : 23 kg (9 kg + 4 kg + 10 kg cédables par un partenaire, déclarés le 2026-11-26). Jamais écrasée si la ligne existe.
--
-- Idempotente : peut être rejouée sans erreur.

CREATE TABLE IF NOT EXISTS public.stock_morilles (
  id smallint PRIMARY KEY DEFAULT 1,
  remaining_kg numeric(5, 1) NOT NULL,
  note text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT stock_morilles_single_row CHECK (id = 1),
  CONSTRAINT stock_morilles_remaining_range CHECK (remaining_kg >= 0 AND remaining_kg <= 1000),
  CONSTRAINT stock_morilles_note_length CHECK (note IS NULL OR char_length(note) <= 200)
);

INSERT INTO public.stock_morilles (id, remaining_kg, note)
VALUES (1, 23, 'Stock déclaré le 2026-11-26')
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.stock_morilles_touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS stock_morilles_touch_updated_at ON public.stock_morilles;
CREATE TRIGGER stock_morilles_touch_updated_at
  BEFORE UPDATE ON public.stock_morilles
  FOR EACH ROW EXECUTE FUNCTION public.stock_morilles_touch_updated_at();

ALTER TABLE public.stock_morilles ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.stock_morilles FROM anon;
REVOKE ALL ON TABLE public.stock_morilles FROM authenticated;
GRANT SELECT ON TABLE public.stock_morilles TO anon, authenticated;
GRANT UPDATE (remaining_kg, note) ON TABLE public.stock_morilles TO authenticated;
GRANT ALL ON TABLE public.stock_morilles TO service_role;

DROP POLICY IF EXISTS "Stock lisible par tous" ON public.stock_morilles;
CREATE POLICY "Stock lisible par tous" ON public.stock_morilles
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins peuvent corriger le stock" ON public.stock_morilles;
CREATE POLICY "Admins peuvent corriger le stock" ON public.stock_morilles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Décompte à l'enregistrement d'une commande pro payée. Jamais sous 0 : un dépassement
-- (deux paiements simultanés sur le dernier kilo) est tracé dans les logs Postgres.
CREATE OR REPLACE FUNCTION public.stock_morilles_on_pro_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  before_kg numeric;
BEGIN
  IF NEW.order_type = 'pro_order' AND NEW.kg IS NOT NULL AND NEW.status = 'paid' THEN
    SELECT remaining_kg INTO before_kg FROM public.stock_morilles WHERE id = 1 FOR UPDATE;
    IF before_kg IS NULL THEN
      RETURN NEW;
    END IF;
    IF NEW.kg > before_kg THEN
      RAISE WARNING 'stock_morilles : commande % de % kg pour % kg en stock', NEW.id, NEW.kg, before_kg;
    END IF;
    UPDATE public.stock_morilles
      SET remaining_kg = GREATEST(0, remaining_kg - NEW.kg),
          note = 'Commande en ligne ' || left(NEW.id::text, 8) || ' : -' || NEW.kg || ' kg'
      WHERE id = 1;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.stock_morilles_on_pro_order() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS stock_morilles_on_pro_order ON public.orders;
CREATE TRIGGER stock_morilles_on_pro_order
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.stock_morilles_on_pro_order();
