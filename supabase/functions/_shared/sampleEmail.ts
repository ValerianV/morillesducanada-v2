// Email envoyé après l'achat de l'échantillon : le code à usage unique qui déduit son prix
// d'une commande d'au moins 1 kg. Module pur : testé avec vitest (src/test/sample.test.ts).
import { escapeHtml } from "./format.ts";
import { PRO_SAMPLE_GRAMS, PRO_TAX_MENTION, formatEurosLocale } from "./proPricing.ts";
import { PRO_SAMPLE_CREDIT_MIN_KG, PRO_SAMPLE_PRICE_CENTS } from "./sample.ts";
import { emailButton, emailPanel, emailText, renderEmailLayout } from "./emailLayout.ts";
import type { BuiltEmail } from "./preorderEmail.ts";

export interface SampleCreditEmailInput {
  customerName: string;
  code: string;
  expiresAt: Date;
  locale: "fr" | "en";
  siteUrl?: string;
}

export function buildSampleCreditEmail({ customerName, code, expiresAt, locale, siteUrl }: SampleCreditEmailInput): BuiltEmail {
  const en = locale === "en";
  const amount = formatEurosLocale(PRO_SAMPLE_PRICE_CENTS, locale);
  const until = new Intl.DateTimeFormat(en ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(expiresAt);
  const orderUrl = `${siteUrl ?? "https://www.morillesducanada.com"}/professionnels#commander`;

  const greeting = en ? `Hello ${customerName},` : `Bonjour ${customerName},`;
  const intro = en
    ? `Thank you for ordering the ${PRO_SAMPLE_GRAMS} g sample. I ship it within 5 business days.`
    : `Merci pour votre commande de l'échantillon de ${PRO_SAMPLE_GRAMS} g. Je l'expédie sous 5 jours ouvrés.`;
  const how = en
    ? `When you order ${PRO_SAMPLE_CREDIT_MIN_KG} kg or more on the website, enter this code on the payment page: ${amount} is deducted. Single use, valid until ${until}.`
    : `Quand vous commanderez au moins ${PRO_SAMPLE_CREDIT_MIN_KG} kg sur le site, saisissez ce code sur la page de paiement : ${amount} sont déduits. Usage unique, valable jusqu'au ${until}.`;
  const quote = en
    ? "For an order on quote or by bank transfer, just mention the code in your request."
    : "Pour une commande sur devis ou par virement, indiquez simplement le code dans votre demande.";
  const tax = PRO_TAX_MENTION[locale];

  const html = renderEmailLayout({
    preheader: en ? `Your code: ${code}, ${amount} off an order of 1 kg or more.` : `Votre code : ${code}, ${amount} déduits dès 1 kg commandé.`,
    title: en ? "Your sample is deducted from your first order" : "Votre échantillon est déduit de votre première commande",
    bodyHtml: [
      emailText(greeting),
      emailText(intro),
      emailPanel(en ? "Your code" : "Votre code", `<strong style="font-size:20px;letter-spacing:2px">${escapeHtml(code)}</strong>`),
      emailText(how),
      emailText(quote),
      emailButton({ label: en ? "Order by the kilo" : "Commander au kilo", url: orderUrl }),
    ].join(""),
    commercial: true,
    locale,
  });

  const text = [greeting, "", intro, "", `${en ? "Your code" : "Votre code"} : ${code}`, how, quote, "", orderUrl, "", `${tax}.`].join("\n");
  const subject = en
    ? `Your code ${code}: ${amount} off your first order of 1 kg`
    : `Votre code ${code} : ${amount} déduits de votre première commande d'1 kg`;
  return { subject, html, text };
}
