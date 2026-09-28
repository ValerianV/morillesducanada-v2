// Validation partagée avec l'edge function submit-pro-lead (même module, mêmes règles).
export {
  ESTABLISHMENT_TYPES,
  PRO_LEAD_KINDS,
  PRO_LEAD_STATUSES,
  validateProLead,
} from "../../supabase/functions/_shared/proLead";
export type {
  EstablishmentType,
  ProLeadKind,
  ProLeadStatus,
  ProLeadInput,
} from "../../supabase/functions/_shared/proLead";
