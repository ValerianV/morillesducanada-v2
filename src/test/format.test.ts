import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  formatEuros,
  itemLineTotalCents,
  itemUnitAmountCents,
  safeHttpsUrl,
} from "../../supabase/functions/_shared/format";

describe("montants des lignes de commande", () => {
  it("lit unit_amount en centimes (format enregistré par stripe-webhook)", () => {
    const item = { name: "Classique 30g", quantity: 2, unit_amount: 2300 };
    expect(itemUnitAmountCents(item)).toBe(2300);
    expect(formatEuros(itemUnitAmountCents(item))).toBe("23.00 €");
    expect(formatEuros(itemLineTotalCents(item))).toBe("46.00 €");
  });

  it("n'affiche pas un prix unitaire multiplié par 100", () => {
    expect(formatEuros(itemUnitAmountCents({ unit_amount: 2300 }))).not.toBe("2300.00 €");
  });

  it("se replie sur price (euros) pour d'anciennes lignes", () => {
    expect(itemUnitAmountCents({ price: 12 })).toBe(1200);
  });

  it("retombe sur 0 et une quantité de 1 si les données manquent", () => {
    expect(itemUnitAmountCents({})).toBe(0);
    expect(itemLineTotalCents({ unit_amount: 500 })).toBe(500);
  });
});

describe("escapeHtml", () => {
  it("échappe les caractères HTML", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
    expect(escapeHtml(null)).toBe("");
  });
});

describe("safeHttpsUrl", () => {
  it("accepte uniquement https", () => {
    expect(safeHttpsUrl("https://www.laposte.fr/outils/suivre-vos-envois?code=1")).toBe(
      "https://www.laposte.fr/outils/suivre-vos-envois?code=1",
    );
    expect(safeHttpsUrl("javascript:alert(1)")).toBeNull();
    expect(safeHttpsUrl("http://example.com")).toBeNull();
    expect(safeHttpsUrl("pas une url")).toBeNull();
    expect(safeHttpsUrl(undefined)).toBeNull();
  });
});
