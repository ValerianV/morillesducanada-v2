-- Commandes pros payées en ligne (create-pro-checkout) avec l'option « pots en verre vides »
-- (décision du fondateur, 2026-09-29). stripe-webhook enregistre la société, le SIRET, le téléphone,
-- la quantité en kg et le détail des pots de chaque commande.
-- À appliquer AVANT de déployer stripe-webhook, qui écrit ces colonnes.
-- Idempotente : ADD COLUMN IF NOT EXISTS, contraintes créées seulement si elles manquent.

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_type text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS siret text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS kg numeric(5, 1);
-- Nombre de pots par format : {"12": 0, "30": 36, "45": 20}. NULL = commande sans pots.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pots jsonb;
-- Reste de moins d'un pot, livré en vrac dans les sachets.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS bulk_grams integer;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_siret_format') THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_siret_format CHECK (siret IS NULL OR siret ~ '^[0-9]{14}$');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_kg_range') THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_kg_range CHECK (kg IS NULL OR (kg >= 1 AND kg <= 45));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_bulk_grams_positive') THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_bulk_grams_positive CHECK (bulk_grams IS NULL OR bulk_grams >= 0);
  END IF;
END $$;
