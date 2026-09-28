// Grille professionnelle au kilo : unique source de vérité.
// Module pur (aucun import Deno/npm) : importé par le front via src/lib/proPricing.ts,
// par l'edge function submit-pro-lead, et testé avec vitest (src/test/proPricing.test.ts).
// Prix nets validés par le fondateur. Le plancher de négociation n'apparaît jamais ici.

export const PRO_STOCK_KG = 45;
export const PRO_MIN_KG = 0.5;
export const PRO_MAX_KG = PRO_STOCK_KG;
export const PRO_KG_STEP = 0.5;
export const PRO_SAMPLE_GRAMS = 30;
export const PRO_SHIPPING_BUSINESS_DAYS = 5;

export const PRO_TAX_MENTION = {
  fr: "Prix nets — TVA non applicable, art. 293 B du CGI",
  en: "Net prices — VAT not applicable, art. 293 B of the French Tax Code (CGI)",
} as const;

export type ProTierId = "500g" | "1kg" | "3kg" | "5kg" | "10kg";

export interface ProTier {
  id: ProTierId;
  minKg: number;
  // "flat" : prix du format entier (500 g) ; "perKg" : prix au kilo appliqué à toute la quantité.
  pricing: "flat" | "perKg";
  priceCents: number;
  label: { fr: string; en: string };
}

export const PRO_TIERS: readonly ProTier[] = [
  { id: "500g", minKg: 0.5, pricing: "flat", priceCents: 19000, label: { fr: "500 g", en: "500 g" } },
  { id: "1kg", minKg: 1, pricing: "perKg", priceCents: 35000, label: { fr: "1 kg", en: "1 kg" } },
  { id: "3kg", minKg: 3, pricing: "perKg", priceCents: 33000, label: { fr: "3 kg et plus", en: "3 kg and more" } },
  { id: "5kg", minKg: 5, pricing: "perKg", priceCents: 31000, label: { fr: "5 kg et plus", en: "5 kg and more" } },
  { id: "10kg", minKg: 10, pricing: "perKg", priceCents: 29000, label: { fr: "10 kg et plus", en: "10 kg and more" } },
];

export interface ProQuote {
  kg: number;
  tier: ProTier;
  // Prix au kilo effectivement appliqué (380 €/kg pour le format 500 g).
  unitPriceCents: number;
  totalCents: number;
}

export function isValidProQuantity(kg: unknown): kg is number {
  if (typeof kg !== "number" || !Number.isFinite(kg)) return false;
  if (kg < PRO_MIN_KG || kg > PRO_MAX_KG) return false;
  const steps = kg / PRO_KG_STEP;
  return Math.abs(steps - Math.round(steps)) < 1e-9;
}

// Devis indicatif pour une quantité en kg (multiple de 500 g, de 0,5 à 45 kg).
// Renvoie null si la quantité est invalide.
export function quote(kg: number): ProQuote | null {
  if (!isValidProQuantity(kg)) return null;
  const normalized = Math.round(kg / PRO_KG_STEP) * PRO_KG_STEP;
  let tier = PRO_TIERS[0];
  for (const candidate of PRO_TIERS) {
    if (normalized >= candidate.minKg) tier = candidate;
  }
  if (tier.pricing === "flat") {
    return {
      kg: normalized,
      tier,
      unitPriceCents: Math.round(tier.priceCents / normalized),
      totalCents: tier.priceCents,
    };
  }
  return {
    kg: normalized,
    tier,
    unitPriceCents: tier.priceCents,
    totalCents: Math.round(tier.priceCents * normalized),
  };
}

// Avec des paliers dégressifs, une quantité juste sous un seuil peut coûter plus cher que
// le seuil lui-même (9,5 kg à 310 € > 10 kg à 290 €). Renvoie alors le devis du seuil.
export function cheaperQuoteAtNextTier(kg: number): ProQuote | null {
  const current = quote(kg);
  if (!current) return null;
  const next = PRO_TIERS.find((t) => t.minKg > current.kg);
  if (!next) return null;
  const atNext = quote(next.minKg);
  return atNext && atNext.totalCents <= current.totalCents ? atNext : null;
}

export function formatEurosLocale(cents: number, locale: "fr" | "en" = "fr"): string {
  const euros = cents / 100;
  return new Intl.NumberFormat(locale === "en" ? "en-IE" : "fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(euros) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(euros);
}

export function formatKg(kg: number, locale: "fr" | "en" = "fr"): string {
  if (kg === 0.5) return "500 g";
  const n = new Intl.NumberFormat(locale === "en" ? "en-IE" : "fr-FR", { maximumFractionDigits: 1 }).format(kg);
  return `${n} kg`;
}

// Libellé du prix d'un palier : « 190 € » pour le format 500 g, « 350 €/kg » sinon.
export function formatTierPrice(tier: ProTier, locale: "fr" | "en" = "fr"): string {
  const price = formatEurosLocale(tier.priceCents, locale);
  return tier.pricing === "flat" ? price : `${price}/kg`;
}
