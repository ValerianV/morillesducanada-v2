import { describe, it, expect } from "vitest";
import {
  CATALOG,
  CartValidationError,
  FREE_SHIPPING_THRESHOLD_CENTS,
  SHIPPING_AMOUNT_CENTS,
  computeShippingCents,
  resolveCart,
} from "../../supabase/functions/_shared/catalog";
import { products, getVacuumMorelPrice } from "@/lib/products";

describe("resolveCart", () => {
  it("prend le prix du catalogue serveur pour un produit fixe", () => {
    const cart = resolveCart({ items: [{ productId: "morilles-30g", quantity: 2 }] });
    expect(cart.lines).toEqual([
      {
        productId: "morilles-30g",
        weightGrams: null,
        name: "Classique 30g",
        priceId: "price_1TMjYzEQBCcpAKNIH2MscUC7",
        unitAmountCents: 2300,
        quantity: 2,
      },
    ]);
    expect(cart.subtotalCents).toBe(4600);
  });

  it("ignore prix, sous-total et nom envoyés par le client", () => {
    const cart = resolveCart({
      items: [{ productId: "morilles-45g", quantity: 1, unitAmountCents: 1, price: 0.01, name: "hack" }],
      subtotalCents: 999999,
    });
    expect(cart.subtotalCents).toBe(2900);
    expect(cart.shippingCents).toBe(SHIPPING_AMOUNT_CENTS);
    expect(cart.lines[0].name).toBe("Prestige 45g");
  });

  it("résout le sous vide à partir du grammage validé", () => {
    const cart = resolveCart({ items: [{ productId: "morilles-sous-vide", weightGrams: 500, quantity: 1 }] });
    expect(cart.lines[0].priceId).toBe("price_1TMjZ2EQBCcpAKNI1I5ikvav");
    expect(cart.lines[0].unitAmountCents).toBe(24000);
    expect(cart.lines[0].name).toBe("Morilles sous vide 500g");
    expect(cart.shippingCents).toBe(0);
  });

  it.each([
    [undefined],
    [50],
    [99],
    [1001],
    [5000],
    [150],
    [100.5],
    ["500"],
  ])("rejette le grammage %s pour le sous vide", (weightGrams) => {
    expect(() =>
      resolveCart({ items: [{ productId: "morilles-sous-vide", weightGrams, quantity: 1 }] }),
    ).toThrow(CartValidationError);
  });

  it("rejette un grammage sur un produit à format fixe", () => {
    expect(() => resolveCart({ items: [{ productId: "morilles-12g", weightGrams: 500, quantity: 1 }] })).toThrow(
      CartValidationError,
    );
  });

  it.each([["inconnu"], ["__proto__"], ["constructor"], [42], [undefined]])(
    "rejette le produit inconnu %s",
    (productId) => {
      expect(() => resolveCart({ items: [{ productId, quantity: 1 }] })).toThrow(CartValidationError);
    },
  );

  it.each([[0], [-1], [1.5], [51], ["2"], [undefined]])("rejette la quantité %s", (quantity) => {
    expect(() => resolveCart({ items: [{ productId: "morilles-12g", quantity }] })).toThrow(CartValidationError);
  });

  it("rejette un panier vide, absent ou trop long", () => {
    expect(() => resolveCart({ items: [] })).toThrow(CartValidationError);
    expect(() => resolveCart({})).toThrow(CartValidationError);
    expect(() => resolveCart(null)).toThrow(CartValidationError);
    expect(() => resolveCart("x")).toThrow(CartValidationError);
    const many = Array.from({ length: 21 }, () => ({ productId: "morilles-12g", quantity: 1 }));
    expect(() => resolveCart({ items: many })).toThrow(CartValidationError);
  });

  describe("ancien contrat { lineItems: [{ priceId }] }", () => {
    it("accepte un priceId du catalogue et recalcule le montant", () => {
      const cart = resolveCart({
        lineItems: [{ priceId: "price_1TMjZ3EQBCcpAKNIY6emeuWP", quantity: 1 }],
        subtotalCents: 1,
      });
      expect(cart.lines[0]).toMatchObject({ productId: "morilles-sous-vide", weightGrams: 1000, unitAmountCents: 42000 });
    });

    it("rejette un article sans priceId (ancien price_data client)", () => {
      expect(() =>
        resolveCart({ lineItems: [{ quantity: 10, unitAmountCents: 1, name: "Morilles" }] }),
      ).toThrow(CartValidationError);
    });

    it("rejette un priceId hors catalogue", () => {
      expect(() => resolveCart({ lineItems: [{ priceId: "price_1TAc7old", quantity: 1 }] })).toThrow(
        CartValidationError,
      );
    });
  });
});

describe("computeShippingCents", () => {
  it("facture le port sous le seuil et l'offre à partir du seuil", () => {
    expect(computeShippingCents(FREE_SHIPPING_THRESHOLD_CENTS - 1)).toBe(SHIPPING_AMOUNT_CENTS);
    expect(computeShippingCents(FREE_SHIPPING_THRESHOLD_CENTS)).toBe(0);
  });

  it("se base sur le sous-total recalculé", () => {
    const below = resolveCart({ items: [{ productId: "morilles-30g", quantity: 2 }] });
    expect(below.subtotalCents).toBe(4600);
    expect(below.totalCents).toBe(4600 + SHIPPING_AMOUNT_CENTS);
    const above = resolveCart({ items: [{ productId: "morilles-30g", quantity: 1 }, { productId: "morilles-45g", quantity: 1 }] });
    expect(above.subtotalCents).toBe(5200);
    expect(above.totalCents).toBe(5200);
  });
});

describe("cohérence front / catalogue serveur", () => {
  it("chaque produit du front existe au catalogue avec le même prix et le même price ID", () => {
    for (const product of products) {
      const entry = CATALOG[product.id];
      expect(entry, product.id).toBeDefined();
      if (entry.kind === "fixed") {
        expect(entry.unitAmountCents).toBe(Math.round(product.price * 100));
        expect(entry.priceId).toBe(product.priceId);
      } else {
        expect(Object.keys(entry.formats).map(Number).sort((a, b) => a - b)).toEqual(
          Object.keys(product.weightPriceIds ?? {}).map(Number).sort((a, b) => a - b),
        );
        for (const [grams, format] of Object.entries(entry.formats)) {
          expect(format.unitAmountCents).toBe(Math.round(getVacuumMorelPrice(Number(grams)) * 100));
          expect(format.priceId).toBe(product.weightPriceIds?.[Number(grams)]);
        }
      }
    }
  });
});
