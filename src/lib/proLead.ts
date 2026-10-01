// Validation partagée avec l'edge function submit-pro-lead (même module, mêmes règles).
export {
  ESTABLISHMENT_TYPES,
  PRO_LEAD_KINDS,
  LEGACY_LEAD_STATUSES,
  LEGACY_SAMPLE_KIND,
  PRO_LEAD_STATUSES,
  validateProLead,
} from "../../supabase/functions/_shared/proLead";
export type {
  EstablishmentType,
  ProLeadKind,
  ProLeadStatus,
  ProLeadInput,
  StoredProLeadKind,
} from "../../supabase/functions/_shared/proLead";
