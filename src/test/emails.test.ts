import { describe, it, expect } from "vitest";
import { renderEmailLayout, emailButton, safeEmailUrl } from "../../supabase/functions/_shared/emailLayout";
import {
  buildAdminNewOrderEmail,
  buildAdminStatusEmail,
  buildContactNotificationEmail,
  buildOrderConfirmationEmail,
  buildStatusEmail,
} from "../../supabase/functions/_shared/orderEmails";
import { authVerifyUrl, buildAuthEmail, AUTH_EMAIL_TYPES } from "../../supabase/functions/_shared/authEmails";
import { buildAdminEmail, buildProspectEmail, type ProLeadInput } from "../../supabase/functions/_shared/proLead";
import { buildPreorderAdminEmail, buildPreorderConfirmationEmail } from "../../supabase/functions/_shared/preorderEmail";
import { preorderAmounts } from "../../supabase/functions/_shared/catalog";
import { quote } from "../../supabase/functions/_shared/proPricing";

const TAX = "Prix nets — TVA non applicable, art. 293 B du CGI";
// Pictogrammes et emojis (✅, 🛒, 📦, 📩…) interdits dans les objets.
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const plain = (s: string) => s.replace(/\s/g, " ");

const lead: ProLeadInput = {
  kind: "devis",
  company: "Bistrot <script>",
  siret: "80286194800023",
  contact_name: "Jeanne <b>",
  email: "jeanne@example.com",
  phone: "06 12 34 56 78",
  establishment_type: "restaurant",
  city: "Lyon",
  postal_code: "69002",
  address: null,
  availability: null,
  kg: 5,
  message: "Ligne 1\n<img src=x>",
  locale: "fr",
  utm: null,
};

const orderId = "3f9a2c7e-1b44-4d0a-9c1e-5a7b8c9d0e1f";
const items = [
  { name: "Classique 30g", quantity: 2, unit_amount: 2300 },
  { name: "Frais de livraison — France", quantity: 1, unit_amount: 690 },
];
const address = { name: "Jeanne", line1: "1 rue <X>", postal_code: "69002", city: "Lyon", country: "FR" };

function allEmails() {
  const amounts = preorderAmounts(3);
  const q = quote(5);
  const auth = AUTH_EMAIL_TYPES.map((type) =>
    buildAuthEmail(type, { verifyUrl: "https://example.supabase.co/auth/v1/verify?token=t", token: "123456", email: "a@b.fr", newEmail: "c@d.fr" }),
  );
  return [
    buildAdminEmail(lead, q, "id-1"),
    buildProspectEmail(lead, q),
    buildProspectEmail({ ...lead, kind: "degustation", kg: null, availability: "Mardi après-midi", locale: "en" }, null),
    buildPreorderConfirmationEmail({ preorderId: "abcdef12-3", customerName: "Jeanne", amounts, locale: "fr" }),
    buildPreorderAdminEmail({ preorderId: "abcdef12-3", customerName: "Jeanne", amounts, locale: "fr", email: "j@x.fr", phone: null, company: null }),
    buildOrderConfirmationEmail({ orderId, customerName: "Jeanne", items, totalCents: 5290, shippingAddress: address }),
    buildAdminNewOrderEmail({ orderId, customerName: "Jeanne", customerEmail: "j@x.fr", items, totalCents: 5290 }),
    buildStatusEmail("order", { id: orderId, status: "shipped", email: "j@x.fr", customer_name: "Jeanne", total_amount: 5290 }),
    buildAdminStatusEmail("order", { id: orderId, status: "delivered", email: "j@x.fr", customer_name: "Jeanne" }),
    buildContactNotificationEmail({ name: "Jeanne", email: "j@x.fr", message: "Bonjour", type: "professionnel" }),
    ...auth,
  ];
}

describe("mise en page des emails", () => {
  it("rend un HTML compatible clients mail : 600 px, tables, préheader, logo, pied de page", () => {
    const html = renderEmailLayout({ preheader: "Aperçu <b>", title: "Titre & co", bodyHtml: "<p>corps</p>" });
    expect(html).toMatch(/^<!DOCTYPE html>/);
    expect(html).toContain("max-width:600px");
    expect(html).toContain('role="presentation"');
    expect(html).toContain('name="color-scheme" content="dark"');
    expect(html).toContain("https://www.morillesducanada.com/logo.png");
    expect(html).toContain("Aperçu &lt;b&gt;");
    expect(html).toContain("<title>Titre &amp; co</title>");
    expect(html).toContain("contact@morillesducanada.com");
    expect(html).toContain("#1a1714");
    expect(html).not.toContain(TAX);
  });

  it("ajoute la mention fiscale aux emails commerciaux", () => {
    expect(renderEmailLayout({ preheader: "", title: "t", bodyHtml: "", commercial: true })).toContain(TAX);
  });

  it("bouton bulletproof (VML Outlook) et refus des liens non https", () => {
    const button = emailButton({ label: "Payer <maintenant>", url: "https://www.morillesducanada.com/a?b=1&c=2" });
    expect(button).toContain("v:roundrect");
    expect(button).toContain("Payer &lt;maintenant&gt;");
    expect(button).toContain("a?b=1&amp;c=2");
    expect(emailButton({ label: "x", url: "javascript:alert(1)" })).toBe("");
    expect(safeEmailUrl("http://example.com")).toBeNull();
    expect(safeEmailUrl("mailto:contact@morillesducanada.com")).toBe("mailto:contact@morillesducanada.com");
  });
});

describe("tous les emails", () => {
  it("utilisent la mise en page de la marque et n'ont aucun emoji dans l'objet", () => {
    for (const mail of allEmails()) {
      expect(mail.subject, mail.subject).not.toMatch(EMOJI);
      expect(mail.html).toContain("max-width:600px");
      expect(mail.html).toContain("Morilles du Canada");
      expect(mail.text.length).toBeGreaterThan(10);
    }
  });

  it("n'annoncent jamais une expédition en 24/48/72 h ni de TVA à ajouter", () => {
    for (const mail of allEmails()) {
      expect(plain(mail.text + mail.html)).not.toMatch(/(exp[ée]di\w*|livr\w*|ship\w*|dispatch\w*)[^.]{0,40}(24|48|72) ?h/i);
      expect(plain(mail.text + mail.html)).not.toMatch(/\bTTC\b|\bHT\b/);
    }
  });
});

describe("emails de commande", () => {
  it("confirmation : articles, livraison séparée, total net, adresse échappée et mention fiscale", () => {
    const mail = buildOrderConfirmationEmail({ orderId, customerName: "Jeanne <b>", items, totalCents: 5290, shippingAddress: address });
    const html = plain(mail.html);
    expect(mail.subject).toBe("Votre commande 3F9A2C7E est confirmée — Morilles du Canada");
    expect(html).toContain("Classique 30g");
    expect(html).toContain("46 €");
    expect(html).toContain("Livraison (France)");
    expect(html).toContain("6,90 €");
    expect(html).toContain("52,90 €");
    expect(html).toContain("1 rue &lt;X&gt;");
    expect(html).toContain("France");
    expect(html).toContain("Jeanne &lt;b&gt;");
    expect(html).not.toContain("Jeanne <b>");
    expect(html).toContain("5 jours ouvrés");
    expect(html).toContain(TAX);
    expect(plain(mail.text)).toContain("Total net : 52,90 €");
  });

  it("commande pro avec pots : colis détaillé côté client, liste de préparation côté admin", () => {
    const proItems = [
      { name: "Morilles de feu sauvages du Canada — 2 kg (palier 1 kg, 350 €/kg)", quantity: 1, unit_amount: 70000 },
      { name: "Pots en verre vides, sans étiquette — 56 pots (0×12 g, 36×30 g, 20×45 g)", quantity: 56, unit_amount: 150 },
    ];
    const proOrder = { kg: 2, pots: { 12: 0, 30: 36, 45: 20 }, bulkGrams: 20 };
    const input = { orderId, customerName: "Jeanne", items: proItems, totalCents: 78400, shippingAddress: address, company: "Épicerie <Fine>", siret: "80286194800023", phone: "+33612345678", proOrder };

    const client = buildOrderConfirmationEmail(input);
    const html = plain(client.html).replace(/&nbsp;/g, " ");
    expect(html).toContain("Votre colis");
    expect(html).toContain("8 sachets sous vide de 250 g (2 kg de morilles).");
    expect(html).toContain("Pots en verre vides, sans étiquette, livrés à part : 20 pots de 45 g + 36 pots de 30 g.");
    expect(html).toContain("Vos pots contiendront 1 980 g ; reste en vrac : 20 g.");
    expect(html).toContain("84 €");
    expect(html).toContain("784 €");
    expect(html).toContain("Épicerie &lt;Fine&gt;");
    expect(html).toContain("802 861 948 00023");
    expect(html).toContain(TAX);
    expect(plain(client.text)).toContain("Votre colis :");

    const admin = buildAdminNewOrderEmail({ ...input, customerEmail: "j@x.fr" });
    const adminHtml = plain(admin.html);
    expect(adminHtml).toContain("Liste de préparation");
    expect(adminHtml).toContain("2 kg = 8 sachets de 250 g<br>20 pots de 45 g<br>36 pots de 30 g<br>0 pot de 12 g");
    expect(adminHtml).toContain("Reste en vrac : 20 g.");
    expect(adminHtml).toContain("+33612345678");
    expect(plain(admin.text)).toContain("Liste de préparation : 2 kg = 8 sachets de 250 g · 20 pots de 45 g · 36 pots de 30 g · 0 pot de 12 g");
  });

  it("commande pro sans pots : sachets seulement", () => {
    const proItems = [{ name: "Morilles de feu sauvages du Canada — 3 kg (palier 3 kg et plus, 330 €/kg)", quantity: 1, unit_amount: 99000 }];
    const input = { orderId, customerName: "Jeanne", items: proItems, totalCents: 99000, proOrder: { kg: 3, pots: null, bulkGrams: 0 } };
    const client = plain(buildOrderConfirmationEmail(input).html);
    expect(client).toContain("12 sachets sous vide de 250 g (3 kg de morilles).");
    expect(client).not.toContain("Pots en verre");
    const admin = buildAdminNewOrderEmail({ ...input, customerEmail: "j@x.fr" });
    expect(plain(admin.text)).toContain("Liste de préparation : 3 kg = 12 sachets de 250 g · sans pots");
  });

  it("statut expédié : suivi et bouton seulement pour une URL https", () => {
    const base = { id: orderId, status: "shipped", email: "j@x.fr", customer_name: "Jeanne", total_amount: 5290, carrier: "Colissimo", tracking_number: "6A1" };
    const withUrl = buildStatusEmail("order", { ...base, tracking_url: "https://suivi.example/6A1" });
    expect(withUrl.subject).toBe("Votre commande 3F9A2C7E — Expédiée");
    expect(withUrl.html).toContain("Suivre mon colis");
    expect(withUrl.html).toContain("6A1");
    const unsafe = buildStatusEmail("order", { ...base, tracking_url: "javascript:alert(1)" });
    expect(unsafe.html).not.toContain("javascript:");
    expect(unsafe.html).not.toContain("Suivre mon colis");
  });

  it("statut de précommande 2027 : référence PRE27 et garantie de l'acompte", () => {
    const mail = buildStatusEmail("preorder", {
      id: "abcdef12-3",
      status: "solde_facture",
      email: "j@x.fr",
      contact_name: "Jeanne",
      saison: "2027",
      kg: 3,
      acompte_cents: 45000,
      solde_cents: 45000,
    });
    expect(mail.subject).toBe("Votre précommande PRE27-ABCDEF12 — Solde facturé");
    expect(plain(mail.html)).toContain("octobre 2027");
    expect(plain(mail.html)).toContain("intégralement remboursé");
  });

  it("contact : nom, email et message échappés, bouton de réponse", () => {
    const mail = buildContactNotificationEmail({
      name: "<script>x</script>",
      email: "j@x.fr",
      message: "a\n<img src=x onerror=alert(1)>",
      type: "particulier",
      created_at: "2026-09-28T14:32:00Z",
    });
    expect(mail.html).not.toContain("<script>x");
    expect(mail.html).not.toContain("<img src=x");
    expect(mail.html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(mail.html).toContain("mailto:j@x.fr");
    expect(mail.subject).toBe("[Contact] <script>x</script> (Particulier)");
  });
});

describe("emails d'authentification", () => {
  it("construit le lien de vérification Supabase avec le jeton (B8)", () => {
    const url = authVerifyUrl({
      supabaseUrl: "https://oeweykyazadobobjncfg.supabase.co/",
      tokenHash: "abc123",
      type: "recovery",
      redirectTo: "https://www.morillesducanada.com/reset-password",
    });
    expect(url).toBe(
      "https://oeweykyazadobobjncfg.supabase.co/auth/v1/verify?token=abc123&type=recovery&redirect_to=https%3A%2F%2Fwww.morillesducanada.com%2Freset-password",
    );
  });

  it("met le lien dans le bouton et en lien de secours, et le code pour la réauthentification", () => {
    const signup = buildAuthEmail("signup", { verifyUrl: "https://x.supabase.co/auth/v1/verify?token=t&type=signup", email: "a@b.fr" });
    expect(signup.subject).toBe("Confirmez votre adresse email — Morilles du Canada");
    expect(signup.html.match(/verify\?token=t&amp;type=signup/g)?.length).toBeGreaterThanOrEqual(3);
    const code = buildAuthEmail("reauthentication", { token: "482913", email: "a@b.fr" });
    expect(code.html).toContain("482913");
    expect(code.text).toContain("482913");
  });
});
