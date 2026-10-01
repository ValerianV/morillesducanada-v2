-- Échantillon remis en main propre uniquement (décision du fondateur, 2026-10-01) :
-- les demandes d'échantillon deviennent des demandes de dégustation (type « degustation »),
-- sans adresse de livraison, avec les disponibilités du prospect.
--
-- * Compatibilité : les lignes existantes (kind = 'echantillon', statut 'echantillon_envoye')
--   restent valides et lisibles dans l'admin. Rien n'est réécrit.
-- * Nouveau type « degustation », nouveaux statuts « degustation_planifiee » et « echantillon_remis ».
-- * Nouvelle colonne « availability » (disponibilités, 300 caractères maximum).
-- * Les index uniques « un échantillon par email / établissement / SIRET » ne visent que
--   kind = 'echantillon' : ils ne s'appliquent pas aux dégustations (plus d'envoi postal à limiter).
--
-- À appliquer AVANT de déployer submit-pro-lead. Idempotente : rejouable sans effet de bord.

ALTER TABLE public.pro_leads ADD COLUMN IF NOT EXISTS availability text;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pro_leads_availability_length') THEN
    ALTER TABLE public.pro_leads
      ADD CONSTRAINT pro_leads_availability_length CHECK (availability IS NULL OR char_length(availability) <= 300);
  END IF;
END $$;

ALTER TABLE public.pro_leads DROP CONSTRAINT IF EXISTS pro_leads_kind_check;
ALTER TABLE public.pro_leads
  ADD CONSTRAINT pro_leads_kind_check CHECK (kind IN ('devis', 'echantillon', 'degustation'));

ALTER TABLE public.pro_leads DROP CONSTRAINT IF EXISTS pro_leads_status_check;
ALTER TABLE public.pro_leads
  ADD CONSTRAINT pro_leads_status_check CHECK (
    status IN (
      'nouveau', 'contacte', 'devis_envoye',
      'degustation_planifiee', 'echantillon_remis',
      'echantillon_envoye',
      'gagne', 'perdu'
    )
  );
