-- Précommande saison 2027 (particuliers et professionnels).
--
-- La table pre_orders existe depuis 20260313201620 (précommandes pro « brune / blonde-grise »,
-- flux jamais branché). Les lignes 2027 sont créées uniquement par stripe-webhook, avec la clé
-- service_role, après paiement de l'acompte (checkout.session.completed, metadata
-- type = preorder_2027).
--
-- Colonnes ajoutées : saison, kg, acompte_cents, solde_cents, adresse et société facultative.
-- Le statut réutilise la colonne existante status :
--   acompte_paye → solde_facture → expediee → livree, ou rembourse / annulee.
--
-- Idempotente : ADD COLUMN IF NOT EXISTS, DROP ... IF EXISTS, CREATE INDEX IF NOT EXISTS.

ALTER TABLE public.pre_orders
  ADD COLUMN IF NOT EXISTS saison text,
  ADD COLUMN IF NOT EXISTS kg integer,
  ADD COLUMN IF NOT EXISTS acompte_cents integer,
  ADD COLUMN IF NOT EXISTS solde_cents integer,
  ADD COLUMN IF NOT EXISTS shipping_address jsonb,
  ADD COLUMN IF NOT EXISTS locale text;

-- Une précommande de particulier n'a ni société ni type de morille choisi.
ALTER TABLE public.pre_orders ALTER COLUMN company_name DROP NOT NULL;
ALTER TABLE public.pre_orders ALTER COLUMN morel_type DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pre_orders_kg_2027_check') THEN
    ALTER TABLE public.pre_orders
      ADD CONSTRAINT pre_orders_kg_2027_check
      CHECK (saison IS DISTINCT FROM '2027' OR (kg BETWEEN 1 AND 15 AND acompte_cents = kg * 15000 AND solde_cents = kg * 15000));
  END IF;
END $$;

-- Un paiement Stripe ne crée qu'une précommande (rejeu du webhook).
CREATE UNIQUE INDEX IF NOT EXISTS pre_orders_stripe_session_id_key
  ON public.pre_orders (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS pre_orders_saison_idx ON public.pre_orders (saison);

-- Plus d'insertion publique : seules les edge functions (service_role) écrivent dans la table.
DROP POLICY IF EXISTS "Anyone can create pre-orders" ON public.pre_orders;
