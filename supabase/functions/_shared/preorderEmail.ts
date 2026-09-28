// Email de confirmation de la précommande 2027 (envoyé par stripe-webhook via la file Resend).
// Module pur (aucun import Deno/npm) : testé avec vitest (src/test/preorder.test.ts).
import { escapeHtml } from "./format.ts";
import { PREORDER_2027, type PreorderAmounts } from "./catalog.ts";
import { PRO_TAX_MENTION, formatEurosLocale } from "./proPricing.ts";

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

  const table = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e8e0cf;color:#6b604c;font-size:13px;width:38%;">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #e8e0cf;color:#1a1612;font-size:14px;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f2eb;font-family:Arial,Helvetica,sans-serif;color:#1a1612;line-height:1.6;"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:28px;border-top:3px solid #c9a84c;">
<p style="font-family:Georgia,serif;font-size:20px;margin:0 0 16px;">Morilles du Canada</p>
<p style="margin:0 0 12px;">${escapeHtml(greeting)}</p>
<p style="margin:0 0 16px;">${escapeHtml(intro)}</p>
<table style="width:100%;border-collapse:collapse;margin:0 0 16px;">${table}</table>
<p style="margin:0 0 12px;"><strong>${escapeHtml(refund)}</strong></p>
<p style="margin:0 0 12px;">${escapeHtml(next)}</p>
<p style="margin:16px 0 0;font-size:12px;color:#6b604c;">${escapeHtml(tax)}.</p>
</div></body></html>`;

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
  const lines = [
    `Référence : ${ref}`,
    `Client : ${input.customerName}${input.company ? ` (${input.company})` : ""}`,
    `Email : ${input.email}`,
    `Téléphone : ${input.phone ?? "—"}`,
    `Quantité : ${amounts.kg} kg`,
    `Acompte payé : ${eur(amounts.depositCents)}`,
    `Solde à facturer avant expédition : ${eur(amounts.balanceCents)}`,
  ];
  return {
    subject: `[Précommande ${PREORDER_2027.season}] ${amounts.kg} kg — ${input.customerName} (${ref})`,
    html: `<p>${lines.map(escapeHtml).join("<br/>")}</p>`,
    text: lines.join("\n"),
  };
}
