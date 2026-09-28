// Catalogue côté serveur : seule source de vérité pour les montants facturés en ligne.
// Module pur (aucun import Deno/npm) pour être testable avec vitest depuis src/test.
// Depuis le 2026-09-28, le site est réservé aux professionnels : plus de vente au détail
// (create-checkout est neutralisée). Il ne reste que la précommande saison 2027 ; les commandes
// au kilo passent par devis (submit-pro-lead) ou par les liens de paiement Stripe (docs/business/offre.md).

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// ─── Précommande saison 2027 ────────────────────────────────────────────────
// 300 €/kg, acompte de 50 % payé à la commande (prix Stripe à 150 € l'unité, quantité = kg),
// solde facturé avant l'expédition d'octobre 2027. Acompte remboursé intégralement si la
// livraison est impossible. Réservée aux professionnels (SIRET obligatoire), livraison en France, port inclus.

export const PREORDER_2027 = {
  type: "preorder_2027",
  season: "2027",
  priceId: "price_1UKdLnEQBCcpAKNIOZmNqQ3A",
  pricePerKgCents: 30000,
  depositPerKgCents: 15000,
  minKg: 1,
  maxKg: 15,
  delivery: { fr: "octobre 2027", en: "October 2027" },
  countries: ["FR"] as readonly string[],
} as const;

export class PreorderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PreorderValidationError";
  }
}

export interface PreorderAmounts {
  kg: number;
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
  const totalCents = kg * PREORDER_2027.pricePerKgCents;
  const depositCents = kg * PREORDER_2027.depositPerKgCents;
  return { kg, totalCents, depositCents, balanceCents: totalCents - depositCents };
}

// Corps attendu par create-preorder-checkout : { kg }. Tout montant envoyé par le client est ignoré.
export function resolvePreorder(body: unknown): PreorderAmounts {
  if (!isRecord(body)) throw new PreorderValidationError("Requête invalide");
  return preorderAmounts(body.kg as number);
}
