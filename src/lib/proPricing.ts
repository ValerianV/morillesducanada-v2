// Grille pro au kilo côté front. La grille et quote() sont définies une seule fois dans
// supabase/functions/_shared/proPricing.ts, que l'edge function submit-pro-lead importe aussi :
// le prix estimé affiché est donc exactement celui que le serveur recalcule.
export {
  PRO_STOCK_KG,
  PRO_MIN_KG,
  PRO_MAX_KG,
  PRO_KG_STEP,
  PRO_SAMPLE_GRAMS,
  PRO_SHIPPING_BUSINESS_DAYS,
  PRO_QUOTE_REPLY_HOURS,
  PRO_PACK_GRAMS,
  PRO_ONLY_MENTION,
  PRO_TAX_MENTION,
  PRO_TIERS,
  PRO_PAYMENT_LINKS,
  quote,
  cheaperQuoteAtNextTier,
  isValidProQuantity,
  formatEurosLocale,
  formatKg,
  formatTierPrice,
} from "../../supabase/functions/_shared/proPricing";
export type { ProTier, ProTierId, ProQuote } from "../../supabase/functions/_shared/proPricing";
