import { describe, it, expect } from "vitest";
import {
  POT_DEFAULT_AUTO_SIZE,
  POT_PRICE_CENTS,
  POT_SIZES_G,
  POT_STOCK,
  ProOrderValidationError,
  allocatePots,
  formatBags,
  formatPotLine,
  formatPotsSummary,
  formatPreparationList,
  morelsLineName,
  parseProOrderRequest,
  parsePotCounts,
  potsLineName,
  quoteProOrder,
  serializePotCounts,
  type PotAllocationResult,
  type ProOrderQuoteResult,
} from "@/lib/potAllocation";
import { formatEurosLocale, quote } from "@/lib/proPricing";
import { fr } from "@/i18n/fr";
import { en } from "@/i18n/en";

const plain = (s: string) => s.replace(/\s/g, " ");

function ok(result: PotAllocationResult) {
  if (result.ok === false) throw new Error(`échec inattendu : ${result.error.code}`);
  return result;
}

function okOrder(result: ProOrderQuoteResult) {
  if (result.ok === false) throw new Error(`échec inattendu : ${result.error.code}`);
  return result;
}

function errorCode(result: PotAllocationResult | ProOrderQuoteResult) {
  return result.ok === false ? result.error.code : null;
}

describe("constantes des pots", () => {
  it("trois formats, 1,50 € le pot, stock provisoire du fondateur, 30 g en automatique", () => {
    expect([...POT_SIZES_G]).toEqual([12, 30, 45]);
    expect(POT_PRICE_CENTS).toBe(150);
    expect(POT_STOCK).toEqual({ 12: 250, 30: 250, 45: 200 });
    expect(POT_DEFAULT_AUTO_SIZE).toBe(30);
  });
});

describe("allocatePots", () => {
  it("2 kg tout en 30 g : 66 pots et 20 g en vrac", () => {
    const r = ok(allocatePots({ totalGrams: 2000, fixed: {}, autoSize: 30 }));
    expect(r.pots).toEqual({ 12: 0, 30: 66, 45: 0 });
    expect(r.gramsInPots).toBe(1980);
    expect(r.bulkGrams).toBe(20);
    expect(r.potCount).toBe(66);
    expect(r.potsCents).toBe(9900);
  });

  it("2 kg avec 20 pots de 45 g et le reste en 30 g : 36 pots de 30 g et 20 g en vrac", () => {
    const r = ok(allocatePots({ totalGrams: 2000, fixed: { 45: 20 }, autoSize: 30 }));
    expect(r.pots).toEqual({ 12: 0, 30: 36, 45: 20 });
    expect(r.gramsInPots).toBe(1980);
    expect(r.bulkGrams).toBe(20);
    expect(r.potCount).toBe(56);
    expect(r.potsCents).toBe(8400);
  });

  it("ignore la saisie du format automatique : il est toujours calculé", () => {
    const r = ok(allocatePots({ totalGrams: 2000, fixed: { 30: 999, 45: 20 }, autoSize: 30 }));
    expect(r.pots[30]).toBe(36);
  });

  it("tout en 12 g ou tout en 45 g", () => {
    expect(ok(allocatePots({ totalGrams: 1000, fixed: {}, autoSize: 12 })).pots).toEqual({ 12: 83, 30: 0, 45: 0 });
    const r45 = ok(allocatePots({ totalGrams: 1000, fixed: {}, autoSize: 45 }));
    expect(r45.pots).toEqual({ 12: 0, 30: 0, 45: 22 });
    expect(r45.bulkGrams).toBe(10);
  });

  it("trois formats à la fois", () => {
    const r = ok(allocatePots({ totalGrams: 3000, fixed: { 12: 50, 45: 10 }, autoSize: 30 }));
    // 50 × 12 = 600 g, 10 × 45 = 450 g, reste 1 950 g = 65 pots de 30 g, 0 g en vrac.
    expect(r.pots).toEqual({ 12: 50, 30: 65, 45: 10 });
    expect(r.bulkGrams).toBe(0);
    expect(r.potCount).toBe(125);
    expect(r.potsCents).toBe(18750);
  });

  it("sans format automatique : seuls les pots saisis, le reste en vrac dans les sachets", () => {
    const r = ok(allocatePots({ totalGrams: 1000, fixed: { 30: 10 }, autoSize: null }));
    expect(r.pots).toEqual({ 12: 0, 30: 10, 45: 0 });
    expect(r.gramsInPots).toBe(300);
    expect(r.bulkGrams).toBe(700);
  });

  it("1 kg avec 0 pot", () => {
    const r = ok(allocatePots({ totalGrams: 1000, fixed: { 12: 0, 30: 0, 45: 0 }, autoSize: null }));
    expect(r.potCount).toBe(0);
    expect(r.potsCents).toBe(0);
    expect(r.bulkGrams).toBe(1000);
  });

  it("pots saisis qui remplissent exactement la quantité : 0 pot automatique, 0 g en vrac", () => {
    const r = ok(allocatePots({ totalGrams: 900, fixed: { 45: 20 }, autoSize: 30 }));
    expect(r.pots).toEqual({ 12: 0, 30: 0, 45: 20 });
    expect(r.bulkGrams).toBe(0);
  });

  it("reste inférieur à un pot automatique : 0 pot de ce format", () => {
    const r = ok(allocatePots({ totalGrams: 1000, fixed: { 45: 22 }, autoSize: 30 }));
    expect(r.pots[30]).toBe(0);
    expect(r.bulkGrams).toBe(10);
  });

  it("pots saisis supérieurs à la quantité : erreur claire", () => {
    const r = allocatePots({ totalGrams: 1000, fixed: { 45: 23 }, autoSize: 30 });
    expect(errorCode(r)).toBe("exceeds_total");
    if (r.ok === false) {
      expect(plain(r.error.message.fr)).toBe("Les pots saisis représentent 1 035 g, plus que la quantité commandée (1 000 g).");
      expect(r.error.message.en).toContain("1,035 g");
    }
  });

  it("plafond de stock : erreur sur le format saisi comme sur le format automatique", () => {
    const stock = { 12: null, 30: 40, 45: 10 };
    const fixedOver = allocatePots({ totalGrams: 2000, fixed: { 45: 11 }, autoSize: null, stock });
    expect(errorCode(fixedOver)).toBe("insufficient_stock");
    if (fixedOver.ok === false) {
      expect(fixedOver.error.size).toBe(45);
      expect(fixedOver.error.message.fr).toBe("Stock insuffisant en pots de 45 g : 10 disponibles, 11 demandés.");
    }
    const autoOver = allocatePots({ totalGrams: 2000, fixed: {}, autoSize: 30, stock });
    expect(errorCode(autoOver)).toBe("insufficient_stock");
    if (autoOver.ok === false) expect(autoOver.error.size).toBe(30);
    // Au plafond exact : accepté.
    const atCap = ok(allocatePots({ totalGrams: 2000, fixed: { 45: 20 }, autoSize: 30, stock: { 12: null, 30: 36, 45: 20 } }));
    expect(atCap.pots).toEqual({ 12: 0, 30: 36, 45: 20 });
    // Plafond à 0 : format indisponible.
    expect(errorCode(allocatePots({ totalGrams: 1000, fixed: { 12: 1 }, autoSize: null, stock: { 12: 0, 30: null, 45: null } }))).toBe(
      "insufficient_stock",
    );
  });

  it("refuse les quantités négatives ou non entières", () => {
    for (const bad of [-1, 1.5, NaN, Infinity]) {
      const r = allocatePots({ totalGrams: 1000, fixed: { 12: bad }, autoSize: 30 });
      expect(errorCode(r), String(bad)).toBe("invalid_count");
      if (r.ok === false) expect(r.error.size).toBe(12);
    }
    expect(errorCode(allocatePots({ totalGrams: 1000, fixed: { 30: "3" as unknown as number }, autoSize: null }))).toBe("invalid_count");
  });

  it("refuse une quantité totale invalide et un format inconnu", () => {
    for (const total of [0, -1000, 1000.5, NaN]) {
      expect(errorCode(allocatePots({ totalGrams: total, fixed: {}, autoSize: 30 })), String(total)).toBe("invalid_quantity");
    }
    expect(errorCode(allocatePots({ totalGrams: 1000, fixed: {}, autoSize: 50 as never }))).toBe("invalid_size");
    expect(errorCode(allocatePots({ totalGrams: 1000, fixed: { 50: 1 } as never, autoSize: null }))).toBe("invalid_size");
  });

  it("ne dépasse jamais la quantité et laisse toujours moins d'un pot en vrac (1 à 45 kg, chaque format)", () => {
    for (let kg = 1; kg <= 45; kg += 0.5) {
      for (const size of POT_SIZES_G) {
        const r = ok(allocatePots({ totalGrams: kg * 1000, fixed: {}, autoSize: size, stock: { 12: null, 30: null, 45: null } }));
        expect(r.gramsInPots + r.bulkGrams).toBe(kg * 1000);
        expect(r.bulkGrams).toBeGreaterThanOrEqual(0);
        expect(r.bulkGrams).toBeLessThan(size);
      }
    }
  });
});

describe("quoteProOrder", () => {
  it("2 kg, 20 pots de 45 g, le reste en 30 g : morilles 700 € + pots 84 € = 784 €", () => {
    const q = okOrder(quoteProOrder({ kg: 2, pots: { fixed: { 45: 20 }, autoSize: 30 } }));
    expect(q.bags).toBe(8);
    expect(q.morels.tier.id).toBe("1kg");
    expect(q.morelsCents).toBe(70000);
    expect(q.potsCents).toBe(8400);
    expect(q.totalCents).toBe(78400);
    expect(q.pots!.pots).toEqual({ 12: 0, 30: 36, 45: 20 });
  });

  it("réutilise la grille de quote() pour les morilles, à chaque palier", () => {
    for (const kg of [1, 2.5, 3, 5, 9.5, 10, 45]) {
      const q = okOrder(quoteProOrder({ kg, pots: null }));
      expect(q.morels).toEqual(quote(kg));
      expect(q.totalCents).toBe(quote(kg)!.totalCents);
      expect(q.bags).toBe(kg * 4);
    }
  });

  it("commande sans pots, ou avec 0 pot : pas de ligne pots", () => {
    const without = okOrder(quoteProOrder({ kg: 1 }));
    expect(without.pots).toBeNull();
    expect(without.totalCents).toBe(35000);
    const zero = okOrder(quoteProOrder({ kg: 1, pots: { fixed: { 12: 0, 30: 0, 45: 0 }, autoSize: null } }));
    expect(zero.pots).toBeNull();
    expect(zero.potsCents).toBe(0);
  });

  it("10 kg tout en 30 g : 333 pots, refusé avec le stock provisoire (250), accepté sans plafond", () => {
    const capped = quoteProOrder({ kg: 10, pots: { fixed: {}, autoSize: 30 } });
    expect(errorCode(capped)).toBe("insufficient_stock");
    if (capped.ok === false) expect(capped.error.message.fr).toBe("Stock insuffisant en pots de 30 g : 250 disponibles, 333 demandés.");
    const q = okOrder(quoteProOrder({ kg: 10, pots: { fixed: {}, autoSize: 30 }, stock: { 12: null, 30: null, 45: null } }));
    expect(q.pots!.potCount).toBe(333);
    expect(q.totalCents).toBe(290000 + 333 * 150);
  });

  it("stock provisoire : 200 pots de 45 g acceptés, 201 refusés", () => {
    expect(okOrder(quoteProOrder({ kg: 10, pots: { fixed: { 45: 200 }, autoSize: null } })).potsCents).toBe(30000);
    expect(errorCode(quoteProOrder({ kg: 10, pots: { fixed: { 45: 201 }, autoSize: null } }))).toBe("insufficient_stock");
    expect(errorCode(quoteProOrder({ kg: 5, pots: { fixed: { 12: 251 }, autoSize: null } }))).toBe("insufficient_stock");
  });

  it("propage les erreurs : quantité invalide, pots trop nombreux, stock", () => {
    expect(errorCode(quoteProOrder({ kg: 0.5 }))).toBe("invalid_quantity");
    expect(errorCode(quoteProOrder({ kg: 46 }))).toBe("invalid_quantity");
    expect(errorCode(quoteProOrder({ kg: 1.2 }))).toBe("invalid_quantity");
    expect(errorCode(quoteProOrder({ kg: 1, pots: { fixed: { 30: 34 }, autoSize: 45 } }))).toBe("exceeds_total");
    expect(
      errorCode(quoteProOrder({ kg: 1, pots: { fixed: {}, autoSize: 12 }, stock: { 12: 50, 30: null, 45: null } })),
    ).toBe("insufficient_stock");
  });
});

describe("parseProOrderRequest (create-pro-checkout)", () => {
  it("n'accepte que kg, fixed, autoSize et la langue", () => {
    expect(parseProOrderRequest({ kg: 2, pots: { fixed: { 45: 20 }, autoSize: 30 }, locale: "en", price: 1 })).toEqual({
      kg: 2,
      pots: { fixed: { 45: 20 }, autoSize: 30 },
      locale: "en",
    });
    expect(parseProOrderRequest({ kg: 1 })).toEqual({ kg: 1, pots: null, locale: "fr" });
    expect(parseProOrderRequest({ kg: 1.5, pots: { fixed: {}, autoSize: null } })).toEqual({
      kg: 1.5,
      pots: { fixed: {}, autoSize: null },
      locale: "fr",
    });
    // Clés JSON en texte : « "45": 20 ».
    expect(parseProOrderRequest(JSON.parse('{"kg":2,"pots":{"fixed":{"45":20,"12":0},"autoSize":30}}')).pots).toEqual({
      fixed: { 12: 0, 45: 20 },
      autoSize: 30,
    });
  });

  it.each([
    [null],
    ["2"],
    [{}],
    [{ kg: "2" }],
    [{ kg: 0.5 }],
    [{ kg: 45.5 }],
    [{ kg: 2, pots: "tous" }],
    [{ kg: 2, pots: [] }],
    [{ kg: 2, pots: { fixed: { 45: -1 }, autoSize: 30 } }],
    [{ kg: 2, pots: { fixed: { 45: 1.5 }, autoSize: 30 } }],
    [{ kg: 2, pots: { fixed: { 50: 1 }, autoSize: 30 } }],
    [{ kg: 2, pots: { fixed: {}, autoSize: 25 } }],
    [{ kg: 2, pots: { fixed: [1, 2], autoSize: 30 } }],
  ])("rejette %j", (body) => {
    expect(() => parseProOrderRequest(body)).toThrow(ProOrderValidationError);
  });
});

describe("libellés", () => {
  const order = okOrder(quoteProOrder({ kg: 2, pots: { fixed: { 45: 20 }, autoSize: 30 } }));

  it("récapitulatif du site", () => {
    expect(formatBags(2, 8)).toBe("2 kg de morilles (8 sachets de 250 g)");
    expect(formatBags(1.5, 6, "en")).toBe("1.5 kg of morels (6 × 250 g vacuum bags)");
    expect(formatPotsSummary(order.pots!.pots)).toBe("20 pots de 45 g + 36 pots de 30 g");
    expect(formatPotsSummary(order.pots!.pots, "en")).toBe("20 × 45 g jars + 36 × 30 g jars");
    expect(formatPotLine(1, 12)).toBe("1 pot de 12 g");
    expect(formatPotLine(0, 12)).toBe("0 pot de 12 g");
    expect(formatPotLine(1, 12, "en")).toBe("1 × 12 g jar");
  });

  it("liste de préparation du fondateur", () => {
    expect(formatPreparationList(2, order.pots!.pots)).toBe("2 kg = 8 sachets de 250 g · 20 pots de 45 g · 36 pots de 30 g · 0 pot de 12 g");
    expect(formatPreparationList(1, null)).toBe("1 kg = 4 sachets de 250 g · sans pots");
    expect(formatPreparationList(2.5, null)).toBe("2,5 kg = 10 sachets de 250 g · sans pots");
  });

  it("lignes Stripe", () => {
    expect(plain(morelsLineName(order))).toBe("Morilles de feu sauvages du Canada — 2 kg (palier 1 kg, 350 €/kg)");
    expect(plain(morelsLineName(okOrder(quoteProOrder({ kg: 12.5 }))))).toBe(
      "Morilles de feu sauvages du Canada — 12,5 kg (palier 10 kg et plus, 290 €/kg)",
    );
    expect(potsLineName(order.pots!)).toBe("Pots en verre vides, sans étiquette — 56 pots (0×12 g, 36×30 g, 20×45 g)");
    expect(potsLineName(order.pots!, "en")).toBe("Empty glass jars, unlabelled — 56 jars (0×12 g, 36×30 g, 20×45 g)");
  });

  it("métadonnées Stripe aller-retour", () => {
    const s = serializePotCounts({ 12: 0, 30: 36, 45: 20 });
    expect(s).toBe("12:0,30:36,45:20");
    expect(parsePotCounts(s)).toEqual({ 12: 0, 30: 36, 45: 20 });
    expect(parsePotCounts("")).toBeNull();
    expect(parsePotCounts("50:1")).toBeNull();
    expect(parsePotCounts("12:-1")).toBeNull();
    expect(parsePotCounts(undefined)).toBeNull();
  });
});

describe("textes du site", () => {
  it("annoncent le prix du pot défini dans POT_PRICE_CENTS, en FR et en EN", () => {
    const frPrice = plain(formatEurosLocale(POT_PRICE_CENTS, "fr"));
    const enPrice = formatEurosLocale(POT_PRICE_CENTS, "en");
    expect(plain(fr.pro.order.potsOption)).toContain(frPrice);
    expect(en.pro.order.potsOption).toContain(enPrice);
    const frPotsFaq = fr.pro.faq.items.find((i) => i.q.startsWith("Proposez-vous des pots"))!;
    const enPotsFaq = en.pro.faq.items.find((i) => i.q.startsWith("Do you offer jars"))!;
    expect(plain(frPotsFaq.a)).toContain(`${frPrice} le pot`);
    expect(enPotsFaq.a).toContain(`${enPrice} per jar`);
    for (const text of [JSON.stringify(fr), JSON.stringify(en)]) {
      expect(plain(text)).not.toMatch(/(^|[^,\d])1 € le pot|€1 per jar/);
    }
  });
});
