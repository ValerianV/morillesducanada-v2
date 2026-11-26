// Grille professionnelle au kilo : unique source de vérité.
// Module pur (aucun import Deno/npm) : importé par le front via src/lib/proPricing.ts,
// par l'edge function submit-pro-lead, et testé avec vitest (src/test/proPricing.test.ts).
// Prix nets validés par le fondateur. Le plancher de négociation n'apparaît jamais ici.

// Stock de référence, déclaré par le fondateur le 2026-11-26 : 23 kg (9 kg + 4 kg en France,
// plus 10 kg qu'un partenaire peut lui céder).
// Sert au prérendu et de repli si la base ne répond pas. Le stock affiché en direct vient de
// la table public.stock_morilles (décomptée à chaque commande pro payée, modifiable dans /admin).
// Mettre à jour cette valeur quand le stock change beaucoup (achat, vente hors site).
export const PRO_STOCK_KG = 23;
export const PRO_STOCK_DATE = "2026-11-26";
// Plafond d'une commande, même avec plus de stock (contrainte SQL orders_kg_range).
export const PRO_ORDER_CAP_KG = 45;
// L'offre pro commence à 1 kg ; le sous vide 500 g reste un format grand public (catalogue).
export const PRO_MIN_KG = 1;
export const PRO_KG_STEP = 0.5;
// Quantité maximale commandable pour un stock donné : arrondie au pas de 0,5 kg inférieur.
export function maxOrderKg(stockKg: number): number {
  if (!Number.isFinite(stockKg) || stockKg <= 0) return 0;
  return Math.min(PRO_ORDER_CAP_KG, Math.floor(stockKg / PRO_KG_STEP + 1e-9) * PRO_KG_STEP);
}
export const PRO_MAX_KG = maxOrderKg(PRO_STOCK_KG);
// Indicateur de stock (décision du fondateur, 2026-11-26) : le chiffre affiché est toujours le stock
// réel. Sous ce seuil, le site affiche « Plus que N kg disponibles » ; à 0, « Épuisé ».
export const PRO_LOW_STOCK_KG = 25;

export type StockLevel = "available" | "low" | "soldOut";

export interface StockStatus {
  level: StockLevel;
  // Stock affiché, arrondi au pas de 0,5 kg inférieur (jamais plus que le stock réel).
  kg: number;
  // Quantité maximale commandable en ligne.
  maxKg: number;
}

export function stockStatus(stockKg: number): StockStatus {
  const maxKg = maxOrderKg(stockKg);
  const kg = !Number.isFinite(stockKg) || stockKg <= 0 ? 0 : Math.floor(stockKg / PRO_KG_STEP + 1e-9) * PRO_KG_STEP;
  // Moins que la commande minimale : plus rien à vendre en ligne.
  if (kg < PRO_MIN_KG) return { level: "soldOut", kg: 0, maxKg: 0 };
  return { level: kg <= PRO_LOW_STOCK_KG ? "low" : "available", kg, maxKg };
}

export function formatStockLabel(status: StockStatus, locale: "fr" | "en" = "fr"): string {
  if (status.level === "soldOut") return locale === "en" ? "Sold out" : "Épuisé";
  const kg = formatKg(status.kg, locale);
  if (status.level === "low") return locale === "en" ? `Only ${kg} left this season` : `Plus que ${kg} disponibles cette saison`;
  return locale === "en" ? `${kg} in stock` : `${kg} en stock`;
}
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

// maxKg : plafond structurel par défaut (45 kg) ; le stock est contrôlé à part (create-pro-checkout).
export function isValidProQuantity(kg: unknown, maxKg: number = PRO_ORDER_CAP_KG): kg is number {
  if (typeof kg !== "number" || !Number.isFinite(kg)) return false;
  if (kg < PRO_MIN_KG || kg > maxKg) return false;
  const steps = kg / PRO_KG_STEP;
  return Math.abs(steps - Math.round(steps)) < 1e-9;
}

// Devis indicatif pour une quantité en kg (de 1 à 45 kg par défaut, par pas de 500 g).
// Renvoie null si la quantité est invalide.
export function quote(kg: number, maxKg: number = PRO_ORDER_CAP_KG): ProQuote | null {
  if (!isValidProQuantity(kg, maxKg)) return null;
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
