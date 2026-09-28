import { describe, it, expect } from "vitest";
import {
  PRO_TIERS,
  PRO_STOCK_KG,
  formatEurosLocale,
  formatKg,
  formatTierPrice,
  cheaperQuoteAtNextTier,
  isValidProQuantity,
  quote,
} from "@/lib/proPricing";

const plain = (s: string) => s.replace(/\s/g, " ");

describe("grille pro validée", () => {
  it("contient exactement les 5 paliers nets", () => {
    expect(PRO_TIERS.map((t) => [t.id, t.minKg, t.pricing, t.priceCents])).toEqual([
      ["500g", 0.5, "flat", 19000],
      ["1kg", 1, "perKg", 35000],
      ["3kg", 3, "perKg", 33000],
      ["5kg", 5, "perKg", 31000],
      ["10kg", 10, "perKg", 29000],
    ]);
  });

  it("n'expose jamais un prix au kilo inférieur à 290 €", () => {
    for (const t of PRO_TIERS) {
      const perKg = t.pricing === "flat" ? t.priceCents / t.minKg : t.priceCents;
      expect(perKg).toBeGreaterThanOrEqual(29000);
    }
  });

  it("stock de 45 kg", () => {
    expect(PRO_STOCK_KG).toBe(45);
  });
});

describe("quote(kg)", () => {
  it("500 g = 190 € (soit 380 €/kg)", () => {
    const q = quote(0.5)!;
    expect(q.tier.id).toBe("500g");
    expect(q.totalCents).toBe(19000);
    expect(q.unitPriceCents).toBe(38000);
  });

  it.each([
    [1, "1kg", 35000, 35000],
    [2.5, "1kg", 35000, 87500],
    [3, "3kg", 33000, 99000],
    [4.5, "3kg", 33000, 148500],
    [5, "5kg", 31000, 155000],
    [9.5, "5kg", 31000, 294500],
    [10, "10kg", 29000, 290000],
    [45, "10kg", 29000, 1305000],
  ])("%s kg → palier %s, %i c/kg, total %i c", (kg, tierId, unit, total) => {
    const q = quote(kg)!;
    expect(q.kg).toBe(kg);
    expect(q.tier.id).toBe(tierId);
    expect(q.unitPriceCents).toBe(unit);
    expect(q.totalCents).toBe(total);
  });

  it("rejette les quantités invalides", () => {
    for (const kg of [0, 0.25, 0.7, 1.2, -1, 45.5, 100, NaN, Infinity]) {
      expect(quote(kg), String(kg)).toBeNull();
    }
    expect(isValidProQuantity("5")).toBe(false);
    expect(isValidProQuantity(null)).toBe(false);
  });

  it("accepte plus de 20 kg (pas d'ancien plafond)", () => {
    expect(quote(20.5)).not.toBeNull();
    expect(quote(30)!.totalCents).toBe(870000);
  });

  it("signale le seuil plus avantageux quand le total baisse en passant de palier", () => {
    const drops: number[] = [];
    let previous = 0;
    for (let kg = 0.5; kg <= 45; kg += 0.5) {
      const q = quote(kg)!;
      if (q.totalCents < previous) drops.push(kg);
      previous = q.totalCents;
    }
    // Seule baisse de la grille validée : 9,5 kg (2 945 €) → 10 kg (2 900 €).
    expect(drops).toEqual([10]);
    expect(cheaperQuoteAtNextTier(9.5)!.kg).toBe(10);
    expect(cheaperQuoteAtNextTier(9)).toBeNull();
    expect(cheaperQuoteAtNextTier(2.5)).toBeNull();
    expect(cheaperQuoteAtNextTier(20)).toBeNull();
  });
});

describe("formatage", () => {
  it("formate en français", () => {
    expect(plain(formatEurosLocale(19000))).toBe("190 €");
    expect(plain(formatEurosLocale(155000))).toBe("1 550 €");
    expect(plain(formatEurosLocale(87550))).toBe("875,50 €");
    expect(plain(formatTierPrice(PRO_TIERS[0]))).toBe("190 €");
    expect(plain(formatTierPrice(PRO_TIERS[1]))).toBe("350 €/kg");
    expect(formatKg(0.5)).toBe("500 g");
    expect(plain(formatKg(2.5))).toBe("2,5 kg");
  });

  it("formate en anglais", () => {
    expect(formatEurosLocale(155000, "en")).toBe("€1,550");
    expect(formatKg(2.5, "en")).toBe("2.5 kg");
  });
});
