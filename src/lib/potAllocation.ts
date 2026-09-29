// Option « pots en verre vides » côté front. Le calcul est défini une seule fois dans
// supabase/functions/_shared/potAllocation.ts, que create-pro-checkout et stripe-webhook importent
// aussi : le récapitulatif affiché est exactement celui que le serveur recalcule.
export {
  POT_SIZES_G,
  POT_PRICE_CENTS,
  POT_STOCK,
  POT_DEFAULT_AUTO_SIZE,
  PRO_ORDER_TYPE,
  allocatePots,
  quoteProOrder,
  parseProOrderRequest,
  ProOrderValidationError,
  isPotSize,
  emptyPotCounts,
  formatGrams,
  formatPotLine,
  formatPotsSummary,
  formatBags,
  formatPreparationList,
  morelsLineName,
  potsLineName,
  serializePotCounts,
  parsePotCounts,
} from "../../supabase/functions/_shared/potAllocation";
export type {
  PotSize,
  PotCounts,
  PotAllocation,
  PotAllocationError,
  PotAllocationErrorCode,
  PotAllocationResult,
  PotRequest,
  ProOrderQuote,
  ProOrderQuoteResult,
} from "../../supabase/functions/_shared/potAllocation";
