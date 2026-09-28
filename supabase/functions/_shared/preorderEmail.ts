// Email de confirmation de la précommande 2027 (envoyé par stripe-webhook via la file Resend).
// Module pur (aucun import Deno/npm) : testé avec vitest (src/test/preorder.test.ts).
import { escapeHtml } from "./format.ts";
import { PREORDER_2027, type PreorderAmounts } from "./catalog.ts";
import { PRO_TAX_MENTION, formatEurosLocale } from "./proPricing.ts";
import { BRAND, emailDetails, emailHeading, emailPanel, emailText, renderEmailLayout } from "./emailLayout.ts";

export interface PreorderEmailInput {
  preorderId: string;
  customerName: string;
  amounts: PreorderAmounts;
  locale: "fr" | "en";
}

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

export function preorderReference(preorderId: string): string {
  return `PRE27-${preorderId.substring(0, 8).toUpperCase()}`;
}

export function buildPreorderConfirmationEmail({ preorderId, customerName, amounts, locale }: PreorderEmailInput): BuiltEmail {
  const en = locale === "en";
  const eur = (cents: number) => formatEurosLocale(cents, locale);
  const ref = preorderReference(preorderId);
  const delivery = PREORDER_2027.delivery[locale];

  const rows: [string, string][] = en
    ? [
        ["Reference", ref],
        ["Quantity", `${amounts.kg} kg of dried wild morels from Canada (${PREORDER_2027.season} season)`],
        ["Price", `${eur(PREORDER_2027.pricePerKgCents)}/kg, i.e. ${eur(amounts.totalCents)}`],
        ["Deposit paid", eur(amounts.depositCents)],
        ["Balance due", `${eur(amounts.balanceCents)}, invoiced before shipping`],
        ["Delivery", `Guaranteed in ${delivery}`],
      ]
    : [
        ["Référence", ref],
        ["Quantité", `${amounts.kg} kg de morilles sauvages du Canada séchées (saison ${PREORDER_2027.season})`],
        ["Prix", `${eur(PREORDER_2027.pricePerKgCents)}/kg, soit ${eur(amounts.totalCents)}`],
        ["Acompte payé", eur(amounts.depositCents)],
        ["Solde restant", `${eur(amounts.balanceCents)}, facturé avant l'expédition`],
        ["Livraison", `Garantie en ${delivery}`],
      ];

  const refund = en
    ? "If we are unable to supply your morels, your deposit will be refunded in full."
    : "S'il nous est impossible de fournir vos morilles, votre acompte vous sera intégralement remboursé.";
  const greeting = en ? `Hello ${customerName},` : `Bonjour ${customerName},`;
  const intro = en
    ? "Thank you for your pre-order. Your deposit has been received."
    : "Merci pour votre précommande. Votre acompte a bien été reçu.";
  const next = en
    ? `We will send you the balance invoice before shipping in ${delivery}. Any questions: contact@morillesducanada.com.`
    : `Nous vous enverrons la facture du solde avant l'expédition, en ${delivery}. Pour toute question : contact@morillesducanada.com.`;
  const tax = PRO_TAX_MENTION[locale];

  const html = renderEmailLayout({
    preheader: en
      ? `${amounts.kg} kg reserved for the ${PREORDER_2027.season} season. Deposit received: ${eur(amounts.depositCents)}.`
      : `${amounts.kg} kg réservés pour la saison ${PREORDER_2027.season}. Acompte reçu : ${eur(amounts.depositCents)}.`,
    title: en ? `Your ${PREORDER_2027.season} pre-order is confirmed` : `Votre précommande ${PREORDER_2027.season} est confirmée`,
    bodyHtml: [
      emailText(greeting),
      emailText(intro),
      emailHeading(en ? "Your pre-order" : "Votre précommande"),
      emailDetails(rows),
      emailPanel(en ? "Deposit guarantee" : "Garantie de l'acompte", escapeHtml(refund)),
      emailText(next),
    ].join(""),
    commercial: true,
    locale,
  });

  const text = [greeting, "", intro, "", ...rows.map(([l, v]) => `${l} : ${v}`), "", refund, next, "", `${tax}.`].join("\n");
  const subject = en
    ? `Your ${PREORDER_2027.season} pre-order is confirmed — ${amounts.kg} kg (${ref})`
    : `Votre précommande ${PREORDER_2027.season} est confirmée — ${amounts.kg} kg (${ref})`;

  return { subject, html, text };
}

export function buildPreorderAdminEmail(input: PreorderEmailInput & { email: string; phone: string | null; company: string | null }): BuiltEmail {
  const { amounts } = input;
  const eur = (cents: number) => formatEurosLocale(cents, "fr");
  const ref = preorderReference(input.preorderId);
  const rows: [string, string][] = [
    ["Référence", ref],
    ["Client", `${input.customerName}${input.company ? ` (${input.company})` : ""}`],
    ["Email", input.email],
    ["Téléphone", input.phone ?? "—"],
    ["Langue", input.locale.toUpperCase()],
    ["Quantité", `${amounts.kg} kg`],
    ["Acompte payé", eur(amounts.depositCents)],
    ["Solde à facturer avant expédition", eur(amounts.balanceCents)],
  ];
  const html = renderEmailLayout({
    preheader: `${amounts.kg} kg — ${input.customerName} — acompte ${eur(amounts.depositCents)} payé.`,
    title: `Nouvelle précommande ${PREORDER_2027.season}`,
    bodyHtml: [
      emailText(`${input.customerName} a précommandé ${amounts.kg} kg pour la saison ${PREORDER_2027.season}. L'acompte est payé.`),
      emailDetails(rows, { emphasizeLast: true }),
    ].join(""),
    cta: { label: "Ouvrir l'administration", url: `${BRAND.siteUrl}/admin` },
    footerNote: "Alerte interne envoyée après le paiement Stripe.",
    commercial: true,
  });
  return {
    subject: `[Précommande ${PREORDER_2027.season}] ${amounts.kg} kg — ${input.customerName} (${ref})`,
    html,
    text: rows.map(([l, v]) => `${l} : ${v}`).join("\n"),
  };
}
