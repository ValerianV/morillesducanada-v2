// Catalogue côté serveur : seule source de vérité pour les montants facturés en ligne.
// Module pur (aucun import Deno/npm) pour être testable avec vitest depuis src/test.
// Depuis le 2026-09-28, le site est réservé aux professionnels : plus de vente au détail
// (create-checkout est neutralisée). Il ne reste que la précommande saison 2027 ; les commandes
// au kilo passent par devis (submit-pro-lead) ou par les liens de paiement Stripe (docs/business/offre.md).

import { PRO_TIERS, formatEurosLocale, quote, type ProTier } from "./proPricing.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// ─── Précommande saison 2027 ────────────────────────────────────────────────
// Décision du fondateur (2026-11-27) : la précommande suit la grille au kilo de la vente directe
// (_shared/proPricing.ts : 350 €/kg dès 1 kg, 330 € dès 3 kg, 310 € dès 5 kg, 290 € dès 10 kg).
// Acompte de 50 % payé à la commande (ligne Stripe à prix calculé, quantité = kg), solde facturé avant
// l'expédition d'octobre 2027. Acompte remboursé intégralement si la livraison est impossible.
// Réservée aux professionnels (SIRET obligatoire), livraison en France, port inclus.

export const PREORDER_2027 = {
  type: "preorder_2027",
  season: "2027",
  // Produit Stripe de l'acompte ; le prix unitaire (acompte par kilo) est calculé à chaque session.
  productId: "prod_VLJz63xzroGcDj",
  depositPercent: 50,
  minKg: 1,
  maxKg: 15,
  delivery: { fr: "octobre 2027", en: "October 2027" },
  countries: ["FR"] as readonly string[],
} as const;

// Paliers applicables à la précommande (ceux qui commencent sous le maximum de 15 kg).
export const PREORDER_TIERS: readonly ProTier[] = PRO_TIERS.filter((t) => t.minKg <= PREORDER_2027.maxKg);
export const PREORDER_MIN_PRICE_CENTS = Math.min(...PREORDER_TIERS.map((t) => t.priceCents));
export const PREORDER_MAX_PRICE_CENTS = Math.max(...PREORDER_TIERS.map((t) => t.priceCents));

export class PreorderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PreorderValidationError";
  }
}

export interface PreorderAmounts {
  kg: number;
  // Prix au kilo du palier atteint, et acompte par kilo (50 %).
  unitPriceCents: number;
  depositPerKgCents: number;
  totalCents: number;
  depositCents: number;
  balanceCents: number;
}

export function isValidPreorderKg(kg: unknown): kg is number {
  return (
    typeof kg === "number" &&
    Number.isInteger(kg) &&
    kg >= PREORDER_2027.minKg &&
    kg <= PREORDER_2027.maxKg
  );
}

export function preorderAmounts(kg: number): PreorderAmounts {
  if (!isValidPreorderKg(kg)) {
    throw new PreorderValidationError(
      `Quantité invalide : de ${PREORDER_2027.minKg} à ${PREORDER_2027.maxKg} kg, par kilo entier`,
    );
  }
  const unitPriceCents = quote(kg, PREORDER_2027.maxKg)!.unitPriceCents;
  const depositPerKgCents = Math.round((unitPriceCents * PREORDER_2027.depositPercent) / 100);
  const totalCents = kg * unitPriceCents;
  const depositCents = kg * depositPerKgCents;
  return { kg, unitPriceCents, depositPerKgCents, totalCents, depositCents, balanceCents: totalCents - depositCents };
}

// Corps attendu par create-preorder-checkout : { kg }. Tout montant envoyé par le client est ignoré.
export function resolvePreorder(body: unknown): PreorderAmounts {
  if (!isRecord(body)) throw new PreorderValidationError("Requête invalide");
  return preorderAmounts(body.kg as number);
}

// « 350 €/kg dès 1 kg, 330 €/kg dès 3 kg, 310 €/kg dès 5 kg, 290 €/kg dès 10 kg ».
export function preorderPriceSummary(locale: "fr" | "en" = "fr"): string {
  return PREORDER_TIERS.map((t) =>
    locale === "en"
      ? `${formatEurosLocale(t.priceCents, "en")}/kg from ${t.minKg} kg`
      : `${formatEurosLocale(t.priceCents, "fr")}/kg dès ${t.minKg} kg`,
  ).join(", ");
}
