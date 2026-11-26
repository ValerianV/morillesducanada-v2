import { describe, expect, it } from "vitest";
import {
  PRO_SAMPLE_CREDIT_MIN_CENTS,
  PRO_SAMPLE_PRICE_CENTS,
  PRO_SAMPLE_SHIPPING_CENTS,
  PRO_SAMPLE_TOTAL_CENTS,
  SAMPLE_ORDER_TYPE,
  sampleCreditCode,
  sampleOfferText,
} from "../../supabase/functions/_shared/sample";
import { buildSampleCreditEmail } from "../../supabase/functions/_shared/sampleEmail";
import { PRO_TIERS } from "../../supabase/functions/_shared/proPricing";

describe("échantillon payant", () => {
  it("vend le pot 20 € plus le port", () => {
    expect(PRO_SAMPLE_PRICE_CENTS).toBe(2000);
    expect(PRO_SAMPLE_TOTAL_CENTS).toBe(PRO_SAMPLE_PRICE_CENTS + PRO_SAMPLE_SHIPPING_CENTS);
    expect(SAMPLE_ORDER_TYPE).toBe("pro_sample");
  });

  it("ne déduit le prix que sur une commande d'au moins 1 kg", () => {
    expect(PRO_SAMPLE_CREDIT_MIN_CENTS).toBe(PRO_TIERS[0].priceCents);
  });

  it("produit des codes lisibles, sans caractères ambigus", () => {
    for (let i = 0; i < 200; i++) expect(sampleCreditCode()).toMatch(/^ECH-[A-HJKMNP-Z2-9]{6}$/);
    expect(sampleCreditCode(() => 0)).toBe("ECH-AAAAAA");
    expect(sampleCreditCode(() => 0.9999)).toBe("ECH-999999");
  });

  it("décrit l'offre sans jamais dire offert", () => {
    const fr = sampleOfferText("fr");
    expect(fr).toMatch(/^Pot de 30 g à 20\s€ \+ .+ de port, déduits de votre première commande d'au moins 1 kg$/);
    expect(fr).not.toMatch(/offert|gratuit/);
    expect(sampleOfferText("en")).toContain("deducted from your first order of 1 kg or more");
  });

  it("envoie le code par email, avec la mention fiscale", () => {
    const mail = buildSampleCreditEmail({ customerName: "Jean Dupont", code: "ECH-ABCDEF", expiresAt: new Date("2027-11-26"), locale: "fr" });
    expect(mail.subject).toContain("ECH-ABCDEF");
    expect(mail.text).toContain("ECH-ABCDEF");
    expect(mail.text).toContain("au moins 1 kg");
    expect(mail.text).toContain("26 novembre 2027");
    expect(mail.text).toContain("TVA non applicable");
    expect(mail.html).toContain("ECH-ABCDEF");
    const en = buildSampleCreditEmail({ customerName: "Jane", code: "ECH-ABCDEF", expiresAt: new Date("2027-11-26"), locale: "en" });
    expect(en.subject).toContain("off your first order");
  });
});
