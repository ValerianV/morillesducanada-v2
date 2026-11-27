import { describe, it, expect } from "vitest";
import {
  PREORDER_2027,
  PreorderValidationError,
  isValidPreorderKg,
  PREORDER_TIERS,
  preorderAmounts,
  preorderPriceSummary,
  resolvePreorder,
} from "../../supabase/functions/_shared/catalog";
import { PRO_TIERS } from "../../supabase/functions/_shared/proPricing";
import {
  buildPreorderAdminEmail,
  buildPreorderConfirmationEmail,
  preorderReference,
} from "../../supabase/functions/_shared/preorderEmail";
import { preorderTotals } from "@/lib/preorder";
import { preorderSchema } from "@/lib/seo/schema";

const plain = (s: string) => s.replace(/\s/g, " ");

describe("précommande 2027 : catalogue serveur", () => {
  it("suit la grille au kilo de la vente directe, acompte de 50 % (décision du 2026-11-27)", () => {
    expect(PREORDER_2027).toMatchObject({
      type: "preorder_2027",
      season: "2027",
      productId: "prod_VLJz63xzroGcDj",
      depositPercent: 50,
      minKg: 1,
      maxKg: 15,
    });
    expect(PREORDER_TIERS.map((t) => t.priceCents)).toEqual(PRO_TIERS.map((t) => t.priceCents));
    expect(plain(preorderPriceSummary("fr"))).toBe("350 €/kg dès 1 kg, 330 €/kg dès 3 kg, 310 €/kg dès 5 kg, 290 €/kg dès 10 kg");
  });

  it.each([
    [1, 35000, 35000, 17500, 17500],
    [2, 35000, 70000, 35000, 35000],
    [3, 33000, 99000, 49500, 49500],
    [4, 33000, 132000, 66000, 66000],
    [5, 31000, 155000, 77500, 77500],
    [10, 29000, 290000, 145000, 145000],
    [15, 29000, 435000, 217500, 217500],
  ])("%i kg : %i c/kg, total %i c, acompte %i c, solde %i c", (kg, unit, total, deposit, balance) => {
    expect(preorderAmounts(kg)).toEqual({
      kg,
      unitPriceCents: unit,
      depositPerKgCents: unit / 2,
      totalCents: total,
      depositCents: deposit,
      balanceCents: balance,
    });
  });

  it("accepte uniquement de 1 à 15 kg par kilo entier", () => {
    for (let kg = 1; kg <= 15; kg++) expect(isValidPreorderKg(kg)).toBe(true);
    for (const kg of [0, -1, 16, 20, 1.5, 0.5, NaN, Infinity, "3", null, undefined]) {
      expect(isValidPreorderKg(kg), String(kg)).toBe(false);
      expect(() => preorderAmounts(kg as number)).toThrow(PreorderValidationError);
    }
  });

  it("resolvePreorder ignore tout montant envoyé par le client", () => {
    expect(resolvePreorder({ kg: 2, depositCents: 1, totalCents: 1 })).toEqual(preorderAmounts(2));
    expect(() => resolvePreorder({ kg: 16 })).toThrow(PreorderValidationError);
    expect(() => resolvePreorder({})).toThrow(PreorderValidationError);
    expect(() => resolvePreorder(null)).toThrow(PreorderValidationError);
    expect(() => resolvePreorder([3])).toThrow(PreorderValidationError);
  });

  it("livre en France uniquement (professionnels, port inclus)", () => {
    expect(PREORDER_2027.countries).toEqual(["FR"]);
  });
});

describe("précommande 2027 : email de confirmation", () => {
  const input = { preorderId: "abcdef12-0000-0000-0000-000000000000", customerName: "Jeanne <b>", amounts: preorderAmounts(3), locale: "fr" as const };

  it("récapitule kg, acompte payé, solde, livraison en octobre 2027 et remboursement", () => {
    const mail = buildPreorderConfirmationEmail(input);
    const text = plain(mail.text);
    expect(mail.subject).toContain("3 kg");
    expect(mail.subject).toContain("PRE27-ABCDEF12");
    expect(text).toContain("3 kg");
    expect(text).toContain("Prix : 330 €/kg (grille au kilo), soit 990 €");
    expect(text).toContain("Acompte payé : 495 €");
    expect(text).toContain("Solde restant : 495 €, facturé avant l'expédition");
    expect(text).toContain("octobre 2027");
    expect(text).toContain("intégralement remboursé");
    expect(text).toContain("TVA non applicable, art. 293 B du CGI");
    expect(mail.html).toContain("Jeanne &lt;b&gt;");
    expect(mail.html).not.toContain("Jeanne <b>");
  });

  it("existe en anglais", () => {
    const mail = buildPreorderConfirmationEmail({ ...input, locale: "en" });
    expect(mail.text).toContain("Deposit paid : €495");
    expect(mail.text).toContain("October 2027");
    expect(mail.text).toContain("refunded in full");
  });

  it("prévient l'admin avec le téléphone et la société", () => {
    const mail = buildPreorderAdminEmail({ ...input, email: "j@x.fr", phone: "+33600000000", company: "Bistrot" });
    expect(mail.subject).toBe("[Précommande 2027] 3 kg — Jeanne <b> (PRE27-ABCDEF12)");
    expect(mail.html).toContain("Bistrot");
    expect(mail.html).not.toContain("<b>)");
    expect(preorderReference("12345678-aaaa")).toBe("PRE27-12345678");
  });
});

describe("précommande 2027 : compteur admin et JSON-LD", () => {
  it("compte les kg hors précommandes remboursées ou annulées", () => {
    const totals = preorderTotals([
      { kg: 3, acompte_cents: 45000, solde_cents: 45000, status: "acompte_paye" },
      { kg: 2, acompte_cents: 30000, solde_cents: 30000, status: "solde_facture" },
      { kg: 5, acompte_cents: 75000, solde_cents: 75000, status: "expediee" },
      { kg: 4, acompte_cents: 60000, solde_cents: 60000, status: "rembourse" },
      { kg: 1, acompte_cents: 15000, solde_cents: 15000, status: "annulee" },
    ]);
    expect(totals).toEqual({ count: 3, kg: 10, depositCents: 150000, balanceCents: 75000 });
  });

  it("annonce une offre par palier de la grille au kilo, de 1 à 15 kg", () => {
    const offers = preorderSchema().offers as Array<Record<string, unknown>>;
    expect(offers.map((o) => o.price)).toEqual(["350.00", "330.00", "310.00", "290.00"]);
    expect(offers.every((o) => o.availability === "https://schema.org/PreOrder")).toBe(true);
    expect(offers[0].eligibleQuantity).toMatchObject({ minValue: 1, maxValue: 2 });
    expect(offers[3].eligibleQuantity).toMatchObject({ minValue: 10, maxValue: 15 });
  });
});
