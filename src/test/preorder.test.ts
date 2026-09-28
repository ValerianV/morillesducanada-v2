import { describe, it, expect } from "vitest";
import {
  CATALOG,
  PREORDER_2027,
  PreorderValidationError,
  isValidPreorderKg,
  preorderAmounts,
  resolvePreorder,
} from "../../supabase/functions/_shared/catalog";
import {
  buildPreorderAdminEmail,
  buildPreorderConfirmationEmail,
  preorderReference,
} from "../../supabase/functions/_shared/preorderEmail";
import { preorderTotals } from "@/lib/preorder";
import { preorderSchema } from "@/lib/seo/schema";

const plain = (s: string) => s.replace(/\s/g, " ");

describe("précommande 2027 : catalogue serveur", () => {
  it("utilise le prix Stripe d'acompte à 150 € l'unité (quantité = kg)", () => {
    expect(PREORDER_2027).toMatchObject({
      type: "preorder_2027",
      season: "2027",
      priceId: "price_1UKdLnEQBCcpAKNIOZmNqQ3A",
      pricePerKgCents: 30000,
      depositPerKgCents: 15000,
      minKg: 1,
      maxKg: 15,
    });
    expect(PREORDER_2027.depositPerKgCents * 2).toBe(PREORDER_2027.pricePerKgCents);
    expect(Object.values(CATALOG).some((p) => p.kind === "fixed" && p.priceId === PREORDER_2027.priceId)).toBe(false);
  });

  it.each([
    [1, 30000, 15000, 15000],
    [4, 120000, 60000, 60000],
    [15, 450000, 225000, 225000],
  ])("%i kg : total %i c, acompte %i c, solde %i c", (kg, total, deposit, balance) => {
    expect(preorderAmounts(kg)).toEqual({ kg, totalCents: total, depositCents: deposit, balanceCents: balance });
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

  it("livre en France et dans l'Union européenne", () => {
    expect(PREORDER_2027.countries).toContain("FR");
    expect(PREORDER_2027.countries).toContain("DE");
    expect(PREORDER_2027.countries).not.toContain("CH");
    expect(PREORDER_2027.countries).toHaveLength(27);
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
    expect(text).toContain("Acompte payé : 450 €");
    expect(text).toContain("Solde restant : 450 €, facturé avant l'expédition");
    expect(text).toContain("octobre 2027");
    expect(text).toContain("intégralement remboursé");
    expect(text).toContain("TVA non applicable, art. 293 B du CGI");
    expect(mail.html).toContain("Jeanne &lt;b&gt;");
    expect(mail.html).not.toContain("Jeanne <b>");
  });

  it("existe en anglais", () => {
    const mail = buildPreorderConfirmationEmail({ ...input, locale: "en" });
    expect(mail.text).toContain("Deposit paid : €450");
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

  it("annonce une offre en précommande à 300 €/kg, de 1 à 15 kg", () => {
    const offer = preorderSchema().offers as Record<string, unknown>;
    expect(offer.price).toBe("300.00");
    expect(offer.availability).toBe("https://schema.org/PreOrder");
    expect(offer.eligibleQuantity).toMatchObject({ minValue: 1, maxValue: 15 });
  });
});
