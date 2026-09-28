import { describe, it, expect } from "vitest";
import {
  PRO_TIERS,
  PRO_STOCK_KG,
  PRO_MIN_KG,
  PRO_MAX_KG,
  PRO_KG_STEP,
  formatEurosLocale,
  formatKg,
  formatTierPrice,
  cheaperQuoteAtNextTier,
  isValidProQuantity,
  quote,
} from "@/lib/proPricing";

const plain = (s: string) => s.replace(/\s/g, " ");

describe("grille pro validée", () => {
  it("contient exactement les 4 paliers nets, à partir de 1 kg (pas de palier 500 g)", () => {
    expect(PRO_TIERS.map((t) => [t.id, t.minKg, t.priceCents])).toEqual([
      ["1kg", 1, 35000],
      ["3kg", 3, 33000],
      ["5kg", 5, 31000],
      ["10kg", 10, 29000],
    ]);
    expect(PRO_MIN_KG).toBe(1);
    expect(PRO_MAX_KG).toBe(45);
    expect(PRO_KG_STEP).toBe(0.5);
  });

  it("n'expose jamais un prix au kilo inférieur à 290 €", () => {
    for (const t of PRO_TIERS) expect(t.priceCents).toBeGreaterThanOrEqual(29000);
  });

  it("stock de 45 kg", () => {
    expect(PRO_STOCK_KG).toBe(45);
  });
});

describe("quote(kg)", () => {
  it("refuse 500 g : l'offre pro commence à 1 kg", () => {
    expect(quote(0.5)).toBeNull();
    expect(isValidProQuantity(0.5)).toBe(false);
    expect(quote(1)!.totalCents).toBe(35000);
    expect(quote(1.5)!.totalCents).toBe(52500);
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
    for (const kg of [0, 0.25, 0.5, 0.7, 1.2, -1, 45.5, 100, NaN, Infinity]) {
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
    for (let kg = 1; kg <= 45; kg += 0.5) {
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
    expect(plain(formatTierPrice(PRO_TIERS[0]))).toBe("350 €/kg");
    expect(plain(formatTierPrice(PRO_TIERS[3]))).toBe("290 €/kg");
    expect(plain(formatKg(1))).toBe("1 kg");
    expect(plain(formatKg(2.5))).toBe("2,5 kg");
  });

  it("formate en anglais", () => {
    expect(formatEurosLocale(155000, "en")).toBe("€1,550");
    expect(formatKg(2.5, "en")).toBe("2.5 kg");
  });
});
