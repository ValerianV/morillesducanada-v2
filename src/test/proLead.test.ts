import { describe, it, expect } from "vitest";
import {
  adminSubject,
  buildAdminEmail,
  buildProspectEmail,
  isHoneypotTriggered,
  validateProLead,
} from "../../supabase/functions/_shared/proLead";

const base = {
  kind: "devis",
  company: "Le Gourmet",
  contact_name: "Jean Dupont",
  email: " Jean@Restaurant.FR ",
  phone: "+33 6 12 34 56 78",
  establishment_type: "restaurant",
  city: "Lyon",
  postal_code: "69002",
  kg: 5,
  message: "Livraison le mardi si possible.",
  locale: "fr",
  utm: { utm_source: "linkedin", utm_medium: "social", other: "ignored" },
};

describe("validateProLead", () => {
  it("accepte un devis et recalcule le prix côté serveur", () => {
    const r = validateProLead({ ...base, unitPriceCents: 1, totalCents: 1 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.lead.email).toBe("jean@restaurant.fr");
    expect(r.lead.kg).toBe(5);
    expect(r.quote?.unitPriceCents).toBe(31000);
    expect(r.quote?.totalCents).toBe(155000);
    expect(r.lead.utm).toEqual({ utm_source: "linkedin", utm_medium: "social" });
  });

  it("accepte une quantité en texte avec virgule", () => {
    const r = validateProLead({ ...base, kg: "2,5" });
    expect(r.ok && r.quote?.totalCents).toBe(87500);
  });

  it("refuse un devis sans quantité valide, et au-delà du stock", () => {
    for (const kg of [undefined, 0, 0.3, 46, "abc"]) {
      const r = validateProLead({ ...base, kg });
      expect(r.ok, String(kg)).toBe(false);
      if ("errors" in r) expect(r.errors.kg).toBeDefined();
    }
  });

  it("accepte 30 kg (plus de plafond à 20 kg)", () => {
    expect(validateProLead({ ...base, kg: 30 }).ok).toBe(true);
  });

  it("exige une adresse pour l'échantillon et ignore la quantité", () => {
    const missing = validateProLead({ ...base, kind: "echantillon", kg: 3 });
    expect(missing.ok).toBe(false);
    if ("errors" in missing) expect(missing.errors.address).toBeDefined();

    const ok = validateProLead({ ...base, kind: "echantillon", kg: 3, address: "12 rue Mercière" });
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.lead.kg).toBeNull();
      expect(ok.quote).toBeNull();
    }
  });

  it("refuse les champs invalides", () => {
    const r = validateProLead({
      kind: "commande",
      company: "x",
      contact_name: "",
      email: "pas-un-email",
      phone: "appelez-moi",
      establishment_type: "boulangerie",
      city: "",
      postal_code: "<script>",
      message: "a".repeat(2001),
    });
    expect(r.ok).toBe(false);
    if ("errors" in r) {
      expect(Object.keys(r.errors).sort()).toEqual(
        ["city", "company", "contact_name", "email", "establishment_type", "kind", "message", "phone", "postal_code"].sort(),
      );
    }
    expect(validateProLead(null).ok).toBe(false);
  });

  it("met les champs sur une ligne (pas d'injection dans le sujet)", () => {
    const r = validateProLead({ ...base, company: "Le\r\nBcc: x@y.z Gourmet" });
    expect(r.ok && r.lead.company).toBe("Le Bcc: x@y.z Gourmet");
  });
});

describe("honeypot", () => {
  it("détecte le champ website rempli", () => {
    expect(isHoneypotTriggered({ ...base, website: "http://spam" })).toBe(true);
    expect(isHoneypotTriggered({ ...base, website: "" })).toBe(false);
    expect(isHoneypotTriggered(base)).toBe(false);
    expect(isHoneypotTriggered(null)).toBe(false);
  });
});

describe("emails", () => {
  const valid = validateProLead(base);
  if (!valid.ok) throw new Error("fixture invalide");

  it("sujet admin devis et échantillon", () => {
    expect(adminSubject(valid.lead)).toBe("[DEVIS] 5 kg — Le Gourmet (Lyon)");
    const oneAndHalf = validateProLead({ ...base, kg: 1.5 });
    expect(oneAndHalf.ok && adminSubject(oneAndHalf.lead)).toBe("[DEVIS] 1,5 kg — Le Gourmet (Lyon)");
    expect(validateProLead({ ...base, kg: 0.5 }).ok).toBe(false);
    const sample = validateProLead({ ...base, kind: "echantillon", address: "12 rue Mercière" });
    expect(sample.ok && adminSubject(sample.lead)).toBe("[ÉCHANTILLON] Le Gourmet (Lyon)");
  });

  it("échappe le HTML saisi par le prospect", () => {
    const r = validateProLead({ ...base, company: `<img src=x onerror=alert(1)>`, message: `<b>"hi"</b>` });
    if (!r.ok) throw new Error("fixture invalide");
    const mail = buildAdminEmail(r.lead, r.quote, "abc");
    expect(mail.html).not.toContain("<img src=x");
    expect(mail.html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(mail.html).toContain("&lt;b&gt;&quot;hi&quot;&lt;/b&gt;");
  });

  it("accusé de réception FR avec le récapitulatif et la mention fiscale", () => {
    const mail = buildProspectEmail(valid.lead, valid.quote);
    const text = mail.text.replace(/\s/g, " ");
    expect(mail.subject).toBe("Votre demande de devis — Morilles du Canada");
    expect(text).toContain("5 kg");
    expect(text).toContain("310 €/kg");
    expect(text).toContain("1 550 €");
    expect(text).toContain("TVA non applicable, art. 293 B du CGI");
    expect(text).toContain("5 jours ouvrés");
    expect(text).not.toMatch(/48 ?h|72 ?h|HT|5,5/);
  });

  it("accusé de réception EN pour l'échantillon", () => {
    const r = validateProLead({ ...base, kind: "echantillon", address: "1 Main St", locale: "en" });
    if (!r.ok) throw new Error("fixture invalide");
    const mail = buildProspectEmail(r.lead, r.quote);
    expect(mail.subject).toBe("Your sample request — Morilles du Canada");
    expect(mail.text).toContain("30 g");
  });
});
