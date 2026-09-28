// Grille professionnelle au kilo : unique source de vérité.
// Module pur (aucun import Deno/npm) : importé par le front via src/lib/proPricing.ts,
// par l'edge function submit-pro-lead, et testé avec vitest (src/test/proPricing.test.ts).
// Prix nets validés par le fondateur. Le plancher de négociation n'apparaît jamais ici.

export const PRO_STOCK_KG = 45;
// L'offre pro commence à 1 kg ; le sous vide 500 g reste un format grand public (catalogue).
export const PRO_MIN_KG = 1;
export const PRO_MAX_KG = PRO_STOCK_KG;
export const PRO_KG_STEP = 0.5;
export const PRO_SAMPLE_GRAMS = 30;
export const PRO_SHIPPING_BUSINESS_DAYS = 5;
// Réponse aux devis : sous 48 h ouvrées (validé par le fondateur le 2026-09-28).
export const PRO_QUOTE_REPLY_HOURS = 48;
// Conditionnement des commandes au kilo : sachets sous vide de 250 g.
export const PRO_PACK_GRAMS = 250;
// Vente réservée aux professionnels.
export const PRO_ONLY_MENTION = {
  fr: "Vente réservée aux professionnels — SIRET demandé à la commande.",
  en: "Trade only — SIRET number required when ordering.",
} as const;

export const PRO_TAX_MENTION = {
  fr: "Prix nets — TVA non applicable, art. 293 B du CGI",
  en: "Net prices — VAT not applicable, art. 293 B of the French Tax Code (CGI)",
} as const;

export type ProTierId = "1kg" | "3kg" | "5kg" | "10kg";

export interface ProTier {
  id: ProTierId;
  minKg: number;
  // Prix au kilo appliqué à toute la quantité commandée.
  priceCents: number;
  label: { fr: string; en: string };
}

// Liens de paiement Stripe (port inclus, France) : une quantité fixe par palier (docs/business/offre.md).
// Chaque lien doit demander la société et le SIRET (champs personnalisés « company » et « siret »).
export const PRO_PAYMENT_LINKS: Record<ProTierId, string> = {
  "1kg": "https://buy.stripe.com/3cI4gz2tn2tRegv3hmbQY02",
  "3kg": "https://buy.stripe.com/5kQ00j2tn6K73BR19ebQY03",
  "5kg": "https://buy.stripe.com/28E5kDgkd8Sf0pFf04bQY04",
  "10kg": "https://buy.stripe.com/14A28rd814BZgoDaJObQY05",
};

export const PRO_TIERS: readonly ProTier[] = [
  { id: "1kg", minKg: 1, priceCents: 35000, label: { fr: "1 kg", en: "1 kg" } },
  { id: "3kg", minKg: 3, priceCents: 33000, label: { fr: "3 kg et plus", en: "3 kg and more" } },
  { id: "5kg", minKg: 5, priceCents: 31000, label: { fr: "5 kg et plus", en: "5 kg and more" } },
  { id: "10kg", minKg: 10, priceCents: 29000, label: { fr: "10 kg et plus", en: "10 kg and more" } },
];

export interface ProQuote {
  kg: number;
  tier: ProTier;
  unitPriceCents: number;
  totalCents: number;
}

export function isValidProQuantity(kg: unknown): kg is number {
  if (typeof kg !== "number" || !Number.isFinite(kg)) return false;
  if (kg < PRO_MIN_KG || kg > PRO_MAX_KG) return false;
  const steps = kg / PRO_KG_STEP;
  return Math.abs(steps - Math.round(steps)) < 1e-9;
}

// Devis indicatif pour une quantité en kg (de 1 à 45 kg, par pas de 500 g).
// Renvoie null si la quantité est invalide.
export function quote(kg: number): ProQuote | null {
  if (!isValidProQuantity(kg)) return null;
  const normalized = Math.round(kg / PRO_KG_STEP) * PRO_KG_STEP;
  let tier = PRO_TIERS[0];
  for (const candidate of PRO_TIERS) {
    if (normalized >= candidate.minKg) tier = candidate;
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
  const n = new Intl.NumberFormat(locale === "en" ? "en-IE" : "fr-FR", { maximumFractionDigits: 1 }).format(kg);
  return `${n} kg`;
}

// Libellé du prix d'un palier : « 350 €/kg ».
export function formatTierPrice(tier: ProTier, locale: "fr" | "en" = "fr"): string {
  return `${formatEurosLocale(tier.priceCents, locale)}/kg`;
}
