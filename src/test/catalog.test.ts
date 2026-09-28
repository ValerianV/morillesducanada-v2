import { describe, it, expect } from "vitest";
import {
  CATALOG,
  CartValidationError,
  FREE_SHIPPING_THRESHOLD_CENTS,
  SHIPPING_AMOUNT_CENTS,
  EU_COUNTRIES_EXCEPT_FR,
  SHIPPING_ZONES,
  computeShippingCents,
  resolveCart,
  shippingZoneForCountry,
} from "../../supabase/functions/_shared/catalog";
import { products, getVacuumMorelPrice } from "@/lib/products";
import { PRO_TIERS, quote } from "../../supabase/functions/_shared/proPricing";

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
        lineItems: [{ priceId: "price_1UKjo2EQBCcpAKNIMbIj8954", quantity: 1 }],
        subtotalCents: 1,
      });
      expect(cart.lines[0]).toMatchObject({ productId: "morilles-sous-vide", weightGrams: 1000, unitAmountCents: 35000 });
    });

    it("rejette l'ancien prix du sous vide 1 kg à 420 € (archivé après le déploiement)", () => {
      expect(() => resolveCart({ lineItems: [{ priceId: "price_1TMjZ3EQBCcpAKNIY6emeuWP", quantity: 1 }] })).toThrow(
        CartValidationError,
      );
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

describe("frais de port par zone (France / Union européenne)", () => {
  it("France : 6,90 €, offerts dès 50 €", () => {
    expect(computeShippingCents(4999, "FR")).toBe(690);
    expect(computeShippingCents(5000, "FR")).toBe(0);
  });

  it("Union européenne : 9,90 €, offerts dès 100 €", () => {
    expect(computeShippingCents(5000, "EU")).toBe(990);
    expect(computeShippingCents(9999, "EU")).toBe(990);
    expect(computeShippingCents(10000, "EU")).toBe(0);
  });

  it("la zone France n'autorise qu'une adresse en France", () => {
    const cart = resolveCart({ items: [{ productId: "morilles-30g", quantity: 1 }], shippingZone: "FR" });
    expect(cart.allowedCountries).toEqual(["FR"]);
    expect(cart.shippingCents).toBe(690);
  });

  it("la zone UE couvre les 26 autres pays de l'Union, sans la France ni la Suisse ou la Norvège", () => {
    const cart = resolveCart({ items: [{ productId: "morilles-30g", quantity: 3 }], shippingZone: "EU" });
    expect(cart.subtotalCents).toBe(6900);
    expect(cart.shippingCents).toBe(990);
    expect(cart.totalCents).toBe(7890);
    expect(cart.allowedCountries).toHaveLength(26);
    expect(cart.allowedCountries).not.toContain("FR");
    expect(cart.allowedCountries).not.toContain("CH");
    expect(cart.allowedCountries).not.toContain("NO");
    expect(new Set(EU_COUNTRIES_EXCEPT_FR).size).toBe(26);
  });

  it("sans zone (ancien front) : tarif France et livraison en France uniquement", () => {
    const cart = resolveCart({ items: [{ productId: "morilles-12g", quantity: 1 }] });
    expect(cart.shippingZone).toBe("FR");
    expect(cart.allowedCountries).toEqual(["FR"]);
  });

  it.each([["DE"], ["fr"], [""], [1], [{}]])("rejette la zone %s", (shippingZone) => {
    expect(() => resolveCart({ items: [{ productId: "morilles-12g", quantity: 1 }], shippingZone })).toThrow(
      CartValidationError,
    );
  });

  it("ignore un montant de port envoyé par le client", () => {
    const cart = resolveCart({ items: [{ productId: "morilles-12g", quantity: 1 }], shippingZone: "EU", shippingCents: 0 });
    expect(cart.shippingCents).toBe(SHIPPING_ZONES.EU.amountCents);
  });

  it("retrouve la zone d'un pays de livraison", () => {
    expect(shippingZoneForCountry("FR")).toBe("FR");
    expect(shippingZoneForCountry("de")).toBe("EU");
    expect(shippingZoneForCountry("CH")).toBeNull();
    expect(shippingZoneForCountry(undefined)).toBeNull();
  });
});

describe("grille unique (décision du 2026-09-28)", () => {
  it("le sous vide 1 kg coûte le même prix au panier, au catalogue serveur et au palier pro 1 kg", () => {
    const vacuum = CATALOG["morilles-sous-vide"];
    if (vacuum.kind !== "weighted") throw new Error("sous vide attendu");
    expect(vacuum.formats[1000].unitAmountCents).toBe(35000);
    expect(getVacuumMorelPrice(1000) * 100).toBe(35000);
    expect(quote(1)?.totalCents).toBe(35000);
  });

  it("grille publique : 100 g 59 €, 200 g 110 €, 500 g 240 €, 1 kg 350 €, puis 330, 310 et 290 €/kg", () => {
    expect([100, 200, 500, 1000].map(getVacuumMorelPrice)).toEqual([59, 110, 240, 350]);
    expect(PRO_TIERS.map((t) => [t.minKg, t.priceCents])).toEqual([
      [1, 35000],
      [3, 33000],
      [5, 31000],
      [10, 29000],
    ]);
  });

  it("le prix au kilo ne remonte jamais quand la quantité augmente", () => {
    const perKg = [100, 200, 500, 1000].map((g) => (getVacuumMorelPrice(g) * 1000) / g);
    const all = [...perKg, ...PRO_TIERS.map((t) => t.priceCents / 100)];
    for (let i = 1; i < all.length; i++) expect(all[i]).toBeLessThanOrEqual(all[i - 1]);
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
