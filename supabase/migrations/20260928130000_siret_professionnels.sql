-- Site réservé aux professionnels (décision du fondateur, 2026-09-28) : SIRET enregistré
-- avec chaque demande pro (submit-pro-lead) et chaque précommande 2027 (stripe-webhook).
-- À appliquer AVANT de déployer submit-pro-lead et stripe-webhook, qui écrivent la colonne.
-- Idempotente : ADD COLUMN IF NOT EXISTS, contrainte et index créés seulement s'ils manquent.

ALTER TABLE public.pro_leads ADD COLUMN IF NOT EXISTS siret text;
ALTER TABLE public.pre_orders ADD COLUMN IF NOT EXISTS siret text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pro_leads_siret_format') THEN
    ALTER TABLE public.pro_leads
      ADD CONSTRAINT pro_leads_siret_format CHECK (siret IS NULL OR siret ~ '^[0-9]{14}$');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pre_orders_siret_format') THEN
    ALTER TABLE public.pre_orders
      ADD CONSTRAINT pre_orders_siret_format CHECK (siret IS NULL OR siret ~ '^[0-9]{14}$');
  END IF;
END $$;

-- Un échantillon par établissement : aussi par SIRET (les index sur email et société restent).
CREATE UNIQUE INDEX IF NOT EXISTS pro_leads_one_sample_per_siret
  ON public.pro_leads (siret)
  WHERE kind = 'echantillon' AND siret IS NOT NULL;
