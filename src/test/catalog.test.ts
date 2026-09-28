import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import * as catalog from "../../supabase/functions/_shared/catalog";
import {
  PRO_PACK_GRAMS,
  PRO_PAYMENT_LINKS,
  PRO_QUOTE_REPLY_HOURS,
  PRO_TIERS,
  quote,
} from "../../supabase/functions/_shared/proPricing";
import { formatSiret, isValidSiret, normalizeSiret } from "../../supabase/functions/_shared/siret";

describe("site réservé aux professionnels (décision du 2026-09-28)", () => {
  it("le catalogue serveur n'a plus de vente au détail ni de frais de port particuliers", () => {
    const exported = Object.keys(catalog);
    for (const name of ["CATALOG", "resolveCart", "SHIPPING_ZONES", "computeShippingCents"]) {
      expect(exported, name).not.toContain(name);
    }
    expect(catalog.PREORDER_2027.countries).toEqual(["FR"]);
  });

  it("create-checkout répond 410 avec un message clair, sans créer de session Stripe", () => {
    const source = readFileSync("supabase/functions/create-checkout/index.ts", "utf8");
    expect(source).toContain("status: 410");
    expect(source).toContain("/professionnels");
    expect(source).not.toMatch(/stripe\.checkout|new Stripe/);
  });

  it("grille : 1 kg 350 €, 3 kg 330 €/kg, 5 kg 310 €/kg, 10 kg 290 €/kg, sachets de 250 g, devis sous 48 h ouvrées", () => {
    expect(PRO_TIERS.map((t) => [t.minKg, t.priceCents])).toEqual([
      [1, 35000],
      [3, 33000],
      [5, 31000],
      [10, 29000],
    ]);
    expect(quote(1)?.totalCents).toBe(35000);
    expect(quote(0.5)).toBeNull();
    expect(PRO_PACK_GRAMS).toBe(250);
    expect(PRO_QUOTE_REPLY_HOURS).toBe(48);
  });

  it("un lien de paiement Stripe par palier", () => {
    for (const tier of PRO_TIERS) expect(PRO_PAYMENT_LINKS[tier.id]).toMatch(/^https:\/\/buy\.stripe\.com\//);
  });
});

describe("SIRET", () => {
  it("valide la clé de Luhn sur 14 chiffres", () => {
    expect(isValidSiret("802 861 948 00023")).toBe(true);
    expect(isValidSiret("80286194800023")).toBe(true);
    expect(isValidSiret("80286194800024")).toBe(false);
    expect(isValidSiret("8028619480002")).toBe(false);
    expect(isValidSiret("")).toBe(false);
    expect(isValidSiret(null)).toBe(false);
    expect(isValidSiret("8028619480002a")).toBe(false);
  });

  it("accepte les établissements de La Poste (somme des chiffres multiple de 5)", () => {
    expect(isValidSiret("35600000000048")).toBe(true);
    expect(isValidSiret("35600000049837")).toBe(true);
  });

  it("normalise et met en forme", () => {
    expect(normalizeSiret(" 802.861.948-00023 ")).toBe("80286194800023");
    expect(formatSiret("80286194800023")).toBe("802 861 948 00023");
  });
});
