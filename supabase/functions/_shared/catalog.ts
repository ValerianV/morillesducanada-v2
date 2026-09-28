// Catalogue côté serveur : seule source de vérité pour les prix facturés.
// Module pur (aucun import Deno/npm) pour être testable avec vitest depuis src/test.
// Toute modification de prix doit être faite ici ET dans Stripe (nouveau price ID),
// puis reportée dans src/lib/products.ts (le test catalog.test.ts vérifie la cohérence).

export interface CatalogPrice {
  priceId: string;
  unitAmountCents: number;
}

interface FixedCatalogProduct extends CatalogPrice {
  kind: "fixed";
  name: string;
}

interface WeightedCatalogProduct {
  kind: "weighted";
  name: string;
  minGrams: number;
  maxGrams: number;
  formats: Record<number, CatalogPrice>;
}

export type CatalogProduct = FixedCatalogProduct | WeightedCatalogProduct;

export const CATALOG: Record<string, CatalogProduct> = {
  "morilles-12g": {
    kind: "fixed",
    name: "Découverte 12g",
    priceId: "price_1TMjYzEQBCcpAKNI4vXm39ml",
    unitAmountCents: 1200,
  },
  "morilles-30g": {
    kind: "fixed",
    name: "Classique 30g",
    priceId: "price_1TMjYzEQBCcpAKNIH2MscUC7",
    unitAmountCents: 2300,
  },
  "morilles-45g": {
    kind: "fixed",
    name: "Prestige 45g",
    priceId: "price_1TMjZ0EQBCcpAKNIPAdnkCjp",
    unitAmountCents: 2900,
  },
  "morilles-sous-vide": {
    kind: "weighted",
    name: "Morilles sous vide",
    minGrams: 100,
    maxGrams: 1000,
    formats: {
      100: { priceId: "price_1TMjZ1EQBCcpAKNInOHFVheb", unitAmountCents: 5900 },
      200: { priceId: "price_1TMjZ2EQBCcpAKNIsTdQpP5x", unitAmountCents: 11000 },
      500: { priceId: "price_1TMjZ2EQBCcpAKNI1I5ikvav", unitAmountCents: 24000 },
      1000: { priceId: "price_1TMjZ3EQBCcpAKNIY6emeuWP", unitAmountCents: 42000 },
    },
  },
};

export const FREE_SHIPPING_THRESHOLD_CENTS = 5000;
export const SHIPPING_AMOUNT_CENTS = 690;
export const MAX_QUANTITY_PER_LINE = 50;
export const MAX_LINES = 20;

export class CartValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CartValidationError";
  }
}

export interface ResolvedLine {
  productId: string;
  weightGrams: number | null;
  name: string;
  priceId: string;
  unitAmountCents: number;
  quantity: number;
}

export interface ResolvedCart {
  lines: ResolvedLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseQuantity(raw: unknown): number {
  if (typeof raw !== "number" || !Number.isInteger(raw) || raw < 1 || raw > MAX_QUANTITY_PER_LINE) {
    throw new CartValidationError(`Quantité invalide (entier entre 1 et ${MAX_QUANTITY_PER_LINE})`);
  }
  return raw;
}

function resolveProductLine(productId: unknown, weightGrams: unknown, quantity: number): ResolvedLine {
  if (typeof productId !== "string" || !Object.prototype.hasOwnProperty.call(CATALOG, productId)) {
    throw new CartValidationError("Produit inconnu");
  }
  const product = CATALOG[productId];

  if (product.kind === "fixed") {
    if (weightGrams !== undefined && weightGrams !== null) {
      throw new CartValidationError(`Grammage non applicable au produit ${productId}`);
    }
    return {
      productId,
      weightGrams: null,
      name: product.name,
      priceId: product.priceId,
      unitAmountCents: product.unitAmountCents,
      quantity,
    };
  }

  if (
    typeof weightGrams !== "number" ||
    !Number.isInteger(weightGrams) ||
    weightGrams < product.minGrams ||
    weightGrams > product.maxGrams
  ) {
    throw new CartValidationError(
      `Grammage invalide pour ${productId} (entre ${product.minGrams} et ${product.maxGrams} g)`,
    );
  }
  const format = product.formats[weightGrams];
  if (!format) {
    throw new CartValidationError(
      `Grammage non proposé pour ${productId} (formats : ${Object.keys(product.formats).join(", ")} g)`,
    );
  }
  return {
    productId,
    weightGrams,
    name: `${product.name} ${weightGrams}g`,
    priceId: format.priceId,
    unitAmountCents: format.unitAmountCents,
    quantity,
  };
}

// Ancien contrat front ({ priceId, quantity }) : accepté uniquement si le priceId est au catalogue,
// pour ne pas casser les onglets ouverts pendant le déploiement.
function findByPriceId(priceId: unknown): { productId: string; weightGrams: number | null } | null {
  if (typeof priceId !== "string") return null;
  for (const [productId, product] of Object.entries(CATALOG)) {
    if (product.kind === "fixed" && product.priceId === priceId) {
      return { productId, weightGrams: null };
    }
    if (product.kind === "weighted") {
      for (const [grams, format] of Object.entries(product.formats)) {
        if (format.priceId === priceId) return { productId, weightGrams: Number(grams) };
      }
    }
  }
  return null;
}

export function computeShippingCents(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_AMOUNT_CENTS;
}

/**
 * Valide le panier envoyé par le navigateur et recalcule tous les montants côté serveur.
 * Accepte `{ items: [{ productId, weightGrams?, quantity }] }` (contrat actuel)
 * ou `{ lineItems: [{ priceId, quantity }] }` (ancien contrat, priceId du catalogue uniquement).
 * Tout prix, sous-total ou nom envoyé par le client est ignoré.
 */
export function resolveCart(body: unknown): ResolvedCart {
  if (!isRecord(body)) throw new CartValidationError("Requête invalide");

  const rawItems = Array.isArray(body.items) ? body.items : Array.isArray(body.lineItems) ? body.lineItems : null;
  const legacy = !Array.isArray(body.items);
  if (!rawItems || rawItems.length === 0) throw new CartValidationError("Panier vide");
  if (rawItems.length > MAX_LINES) throw new CartValidationError(`Trop d'articles (maximum ${MAX_LINES} lignes)`);

  const lines = rawItems.map((raw) => {
    if (!isRecord(raw)) throw new CartValidationError("Article invalide");
    const quantity = parseQuantity(raw.quantity);
    if (legacy) {
      const match = findByPriceId(raw.priceId);
      if (!match) throw new CartValidationError("Produit inconnu");
      return resolveProductLine(match.productId, match.weightGrams ?? undefined, quantity);
    }
    return resolveProductLine(raw.productId, raw.weightGrams, quantity);
  });

  const subtotalCents = lines.reduce((sum, line) => sum + line.unitAmountCents * line.quantity, 0);
  const shippingCents = computeShippingCents(subtotalCents);
  return { lines, subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents };
}
