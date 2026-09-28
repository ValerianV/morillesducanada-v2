// Emails des commandes (stripe-webhook, notify-order-status) et du formulaire de contact (notify-contact).
// Module pur (aucun import Deno/npm) : testé avec vitest (src/test/emails.test.ts).
import { escapeHtml, itemLineTotalCents, itemQuantity, safeHttpsUrl, type OrderItemLike } from "./format.ts";
import { PREORDER_2027 } from "./catalog.ts";
import { formatSiret } from "./siret.ts";
import { formatEurosLocale } from "./proPricing.ts";
import {
  BRAND,
  emailDetails,
  emailHeading,
  emailItemsTable,
  emailLines,
  emailLink,
  emailPanel,
  emailParagraph,
  emailText,
  renderEmailLayout,
  type EmailItemLine,
  type EmailRow,
} from "./emailLayout.ts";

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

export interface ShippingAddressLike {
  name?: string | null;
  line1?: string | null;
  line2?: string | null;
  postal_code?: string | null;
  city?: string | null;
  country?: string | null;
}

const eur = (cents: number) => formatEurosLocale(cents, "fr");
const SHIPPING_PREFIX = "Frais de livraison";

export function orderReference(orderId: string): string {
  return String(orderId).substring(0, 8).toUpperCase();
}

export function invoiceNumber(orderId: string, createdAt: Date | string = new Date()): string {
  return `FAC-${new Date(createdAt).getFullYear()}-${orderReference(orderId)}`;
}

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

// Les frais de port sont une ligne Stripe (« Frais de livraison — France ») : on les affiche dans les totaux.
function splitItems(items: OrderItemLike[]) {
  const products: EmailItemLine[] = [];
  let productsCents = 0;
  let shippingLabel: string | null = null;
  let shippingCents = 0;
  for (const item of Array.isArray(items) ? items : []) {
    const name = typeof item.name === "string" && item.name.trim() ? item.name.trim() : "Morilles de feu séchées";
    const cents = itemLineTotalCents(item);
    if (name.startsWith(SHIPPING_PREFIX)) {
      const zone = name.slice(SHIPPING_PREFIX.length).replace(/^\s*[—-]\s*/, "").trim();
      shippingLabel = zone ? `Livraison (${zone})` : "Livraison";
      shippingCents += cents;
      continue;
    }
    productsCents += cents;
    products.push({ name, quantity: itemQuantity(item), amount: eur(cents) });
  }
  const shipping = shippingLabel ? { label: shippingLabel, cents: shippingCents } : null;
  return { products, productsCents, shipping };
}

function orderItemsHtml(items: OrderItemLike[], totalCents: number): { html: string; text: string } {
  const { products, productsCents, shipping } = splitItems(items);
  if (products.length === 0) {
    return { html: emailDetails([["Total net", eur(totalCents)]], { emphasizeLast: true }), text: `Total net : ${eur(totalCents)}` };
  }
  const totals: EmailRow[] = [];
  if (shipping) {
    totals.push(["Sous-total", eur(productsCents)], [shipping.label, eur(shipping.cents)]);
  }
  totals.push(["Total net", eur(totalCents)]);
  const html = emailItemsTable(products, totals, { product: "Produit", quantity: "Qté", amount: "Montant" });
  const text = [
    ...products.map((p) => `- ${p.name} × ${p.quantity} : ${p.amount}`),
    ...totals.map(([l, v]) => `${l} : ${v}`),
  ].join("\n");
  return { html, text };
}

function countryName(code: string | null | undefined): string {
  if (!code) return "";
  try {
    return new Intl.DisplayNames(["fr"], { type: "region" }).of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

function addressLines(address: ShippingAddressLike | null | undefined): string[] {
  if (!address || !address.line1) return [];
  return [
    address.name ?? "",
    address.line1 ?? "",
    address.line2 ?? "",
    `${address.postal_code ?? ""} ${address.city ?? ""}`.trim(),
    countryName(address.country),
  ].filter((l) => l.trim() !== "");
}

// ─── Confirmation de commande (client) ─────────────────────────────────────

export interface OrderConfirmationInput {
  orderId: string;
  customerName: string;
  items: OrderItemLike[];
  totalCents: number;
  shippingAddress?: ShippingAddressLike | null;
  createdAt?: Date | string;
  // Liens de paiement pros : champs personnalisés Stripe.
  company?: string | null;
  siret?: string | null;
}

function businessRows(input: { company?: string | null; siret?: string | null }): EmailRow[] {
  const rows: EmailRow[] = [];
  if (input.company) rows.push(["Société", input.company]);
  if (input.siret) rows.push(["SIRET", formatSiret(input.siret)]);
  return rows;
}

export function buildOrderConfirmationEmail(input: OrderConfirmationInput): BuiltEmail {
  const ref = orderReference(input.orderId);
  const createdAt = input.createdAt ?? new Date();
  const invoice = invoiceNumber(input.orderId, createdAt);
  const items = orderItemsHtml(input.items, input.totalCents);
  const address = addressLines(input.shippingAddress);

  const greeting = `Bonjour ${input.customerName},`;
  const intro = "Merci pour votre commande. Votre paiement est confirmé et nous préparons votre colis.";
  const shippingNote =
    "Votre colis sera expédié sous 5 jours ouvrés, en colis suivi. Vous recevrez un email avec le numéro de suivi dès son départ.";
  const invoiceNote = `Votre facture ${invoice}, avec notre numéro SIRET, vous est envoyée par email.`;

  const body = [
    emailText(greeting),
    emailText(intro),
    emailText(shippingNote),
    emailDetails([
      ["Commande", ref],
      ["Date", formatDate(createdAt)],
      ["Facture", invoice],
      ...businessRows(input),
    ]),
    emailHeading("Votre commande"),
    items.html,
    address.length ? emailPanel("Adresse de livraison", emailLines(address)) : "",
    emailText(invoiceNote, { muted: true, small: true }),
    emailParagraph(`Une question : ${emailLink(BRAND.contactEmail, `mailto:${BRAND.contactEmail}`)}`, { muted: true, small: true }),
  ].join("");

  const html = renderEmailLayout({
    preheader: `Commande ${ref} confirmée — ${eur(input.totalCents)}. Expédition sous 5 jours ouvrés.`,
    title: "Votre commande est confirmée",
    bodyHtml: body,
    commercial: true,
  });

  const text = [
    greeting,
    "",
    intro,
    "",
    `Commande : ${ref}`,
    `Facture : ${invoice}`,
    "",
    items.text,
    address.length ? `\nAdresse de livraison :\n${address.join("\n")}` : "",
    "",
    shippingNote,
    invoiceNote,
    "",
    `Une question : ${BRAND.contactEmail}`,
    "",
    `${BRAND.taxMention}.`,
  ].join("\n");

  return { subject: `Votre commande ${ref} est confirmée — Morilles du Canada`, html, text };
}

// ─── Nouvelle commande (admin) ─────────────────────────────────────────────

export function buildAdminNewOrderEmail(input: OrderConfirmationInput & { customerEmail: string }): BuiltEmail {
  const ref = orderReference(input.orderId);
  const items = orderItemsHtml(input.items, input.totalCents);
  const address = addressLines(input.shippingAddress);
  const body = [
    emailText(`${input.customerName} vient de payer une commande de ${eur(input.totalCents)}. À expédier sous 5 jours ouvrés.`),
    emailDetails([
      ["Commande", ref],
      ["Client", input.customerName],
      ["Email", input.customerEmail],
      ...businessRows(input),
    ]),
    items.html,
    address.length ? emailPanel("Adresse de livraison", emailLines(address)) : "",
  ].join("");
  const html = renderEmailLayout({
    preheader: `${input.customerName} · ${eur(input.totalCents)} · commande ${ref}`,
    title: `Nouvelle commande ${ref}`,
    bodyHtml: body,
    cta: { label: "Ouvrir l'administration", url: `${BRAND.siteUrl}/admin` },
    footerNote: "Alerte interne envoyée après le paiement Stripe.",
    commercial: true,
  });
  return {
    subject: `[Commande] ${ref} — ${eur(input.totalCents)} — ${input.customerName}`,
    html,
    text: [
      `Nouvelle commande ${ref} de ${input.customerName} (${input.customerEmail}).`,
      "",
      items.text,
      address.length ? `\nAdresse de livraison :\n${address.join("\n")}` : "",
    ].join("\n"),
  };
}

// ─── Changement de statut (client et admin) ────────────────────────────────

export type NotificationType = "order" | "preorder";

export const STATUS_LABELS: Record<string, string> = {
  paid: "Paiement confirmé",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  // Précommande saison 2027
  acompte_paye: "Acompte payé",
  solde_facture: "Solde facturé",
  expediee: "Expédiée",
  livree: "Livrée",
  rembourse: "Acompte remboursé",
  annulee: "Annulée",
};

// Titre et phrase d'introduction de l'email client selon le statut.
const STATUS_COPY: Record<string, { title: string; intro: string }> = {
  paid: { title: "Paiement confirmé", intro: "Votre paiement est confirmé. Nous préparons votre colis, expédié sous 5 jours ouvrés." },
  confirmed: { title: "Commande confirmée", intro: "Votre commande est confirmée. Elle sera expédiée sous 5 jours ouvrés." },
  shipped: { title: "Votre colis est en route", intro: "Votre commande vient d'être expédiée, en colis suivi." },
  delivered: { title: "Votre commande est livrée", intro: "Votre commande est indiquée comme livrée. Nous espérons que vos morilles vous donneront satisfaction." },
  cancelled: { title: "Commande annulée", intro: "Votre commande a été annulée. Pour toute question, écrivez-nous." },
  acompte_paye: { title: "Acompte reçu", intro: "Nous avons bien reçu l'acompte de votre précommande." },
  solde_facture: { title: "Solde de votre précommande", intro: "Le solde de votre précommande vous a été facturé, avant l'expédition." },
  expediee: { title: "Votre précommande est en route", intro: "Vos morilles viennent d'être expédiées, en colis suivi." },
  livree: { title: "Votre précommande est livrée", intro: "Votre précommande est indiquée comme livrée." },
  rembourse: { title: "Acompte remboursé", intro: "Votre acompte vous a été intégralement remboursé." },
  annulee: { title: "Précommande annulée", intro: "Votre précommande a été annulée. Pour toute question, écrivez-nous." },
};

export interface StatusRecord {
  id: string;
  status: string;
  email?: string | null;
  created_at?: string | null;
  // Commande
  customer_name?: string | null;
  total_amount?: number | null;
  items?: OrderItemLike[] | null;
  carrier?: string | null;
  tracking_number?: string | null;
  tracking_url?: string | null;
  // Précommande
  contact_name?: string | null;
  saison?: string | null;
  kg?: number | null;
  acompte_cents?: number | null;
  solde_cents?: number | null;
  quantity_kg?: number | null;
  morel_type?: string | null;
}

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function statusCustomerName(type: NotificationType, record: StatusRecord): string {
  return (type === "order" ? record.customer_name : record.contact_name) || record.email || "";
}

// Référence affichée : PRE27-XXXXXXXX pour une précommande de la saison en cours, comme à la confirmation.
function statusReference(type: NotificationType, record: StatusRecord): string {
  const ref = orderReference(record.id);
  return type === "preorder" && record.saison === PREORDER_2027.season ? `PRE${PREORDER_2027.season.slice(2)}-${ref}` : ref;
}

export function buildStatusEmail(type: NotificationType, record: StatusRecord): BuiltEmail {
  const ref = statusReference(type, record);
  const name = statusCustomerName(type, record);
  const label = statusLabel(record.status);
  const copy = STATUS_COPY[record.status] ?? { title: label, intro: `Nouveau statut : ${label}.` };
  const typeLabel = type === "order" ? "commande" : "précommande";
  const blocks: string[] = [emailText(`Bonjour ${name},`), emailText(copy.intro)];
  const textLines: string[] = [`Bonjour ${name},`, "", copy.intro, ""];
  let cta: { label: string; url: string } | undefined;
  let commercial = false;

  if (type === "order") {
    const total = record.total_amount ?? 0;
    const rows: EmailRow[] = [
      ["Commande", ref],
      ["Statut", label],
      ["Total", eur(total)],
    ];
    blocks.push(emailDetails(rows));
    textLines.push(...rows.map(([l, v]) => `${l} : ${v}`));
    commercial = true;

    if (record.status === "paid" && Array.isArray(record.items) && record.items.length) {
      const items = orderItemsHtml(record.items, total);
      blocks.push(emailHeading("Votre commande"), items.html);
      blocks.push(
        emailText(
          `Votre facture ${invoiceNumber(record.id, record.created_at ?? new Date())}, avec notre numéro SIRET, vous est envoyée par email.`,
          { muted: true, small: true },
        ),
      );
      textLines.push("", items.text);
    }

    if (record.status === "shipped") {
      const trackingUrl = safeHttpsUrl(record.tracking_url);
      if (record.tracking_number) {
        const tracking: EmailRow[] = [
          ["Transporteur", record.carrier || "—"],
          ["Numéro de suivi", record.tracking_number],
        ];
        blocks.push(emailHeading("Suivi du colis"), emailDetails(tracking));
        textLines.push("", ...tracking.map(([l, v]) => `${l} : ${v}`));
        if (trackingUrl) {
          cta = { label: "Suivre mon colis", url: trackingUrl };
          textLines.push(`Suivre mon colis : ${trackingUrl}`);
        }
      } else {
        const note = "Le numéro de suivi vous sera communiqué très prochainement.";
        blocks.push(emailText(note));
        textLines.push("", note);
      }
    }
  } else if (record.saison === PREORDER_2027.season) {
    const rows: EmailRow[] = [
      ["Précommande", ref],
      ["Statut", label],
      ["Quantité", `${record.kg ?? record.quantity_kg ?? "—"} kg`],
      ["Acompte payé", eur(record.acompte_cents ?? 0)],
      ["Solde", `${eur(record.solde_cents ?? 0)}, facturé avant l'expédition`],
      ["Livraison", `Garantie en ${PREORDER_2027.delivery.fr}`],
    ];
    blocks.push(emailDetails(rows));
    textLines.push(...rows.map(([l, v]) => `${l} : ${v}`));
    if (record.status !== "rembourse" && record.status !== "annulee") {
      const guarantee = "S'il nous est impossible de fournir vos morilles, votre acompte vous est intégralement remboursé.";
      blocks.push(emailPanel("Garantie de l'acompte", emailLines([guarantee])));
      textLines.push("", guarantee);
    }
    commercial = true;
  } else {
    // Anciennes précommandes (avant la saison 2027).
    const rows: EmailRow[] = [
      ["Précommande", ref],
      ["Statut", label],
      ["Quantité", `${record.quantity_kg ?? "—"} kg`],
    ];
    blocks.push(emailDetails(rows));
    textLines.push(...rows.map(([l, v]) => `${l} : ${v}`));
  }

  const help = "Une question : répondez à cet email ou écrivez-nous à";
  blocks.push(emailParagraph(`${help} ${emailLink(BRAND.contactEmail, `mailto:${BRAND.contactEmail}`)}.`, { muted: true, small: true }));
  textLines.push("", `${help} ${BRAND.contactEmail}.`);
  if (commercial) textLines.push("", `${BRAND.taxMention}.`);

  const html = renderEmailLayout({
    preheader: `${type === "order" ? "Commande" : "Précommande"} ${ref} : ${label}.`,
    title: copy.title,
    bodyHtml: blocks.join(""),
    cta,
    commercial,
  });

  return { subject: `Votre ${typeLabel} ${ref} — ${label}`, html, text: textLines.join("\n") };
}

export function buildAdminStatusEmail(type: NotificationType, record: StatusRecord): BuiltEmail {
  const ref = statusReference(type, record);
  const name = statusCustomerName(type, record);
  const label = statusLabel(record.status);
  const typeLabel = type === "order" ? "Commande" : "Précommande";
  const sentence = `La ${typeLabel.toLowerCase()} ${ref} de ${name} (${record.email ?? "—"}) est passée au statut « ${label} ». Le client a été prévenu.`;
  const html = renderEmailLayout({
    preheader: `${typeLabel} ${ref} → ${label}`,
    title: `${typeLabel} ${ref} : ${label}`,
    bodyHtml: emailText(sentence),
    cta: { label: "Ouvrir l'administration", url: `${BRAND.siteUrl}/admin` },
    footerNote: "Alerte interne envoyée au changement de statut.",
  });
  return { subject: `[${typeLabel}] ${ref} → ${label}`, html, text: sentence };
}

// ─── Formulaire de contact (admin) ─────────────────────────────────────────

export interface ContactMessageInput {
  id?: string;
  name: unknown;
  email: unknown;
  message: unknown;
  type: unknown;
  created_at?: unknown;
}

export function buildContactNotificationEmail(input: ContactMessageInput): BuiltEmail {
  const name = String(input.name ?? "").trim() || "Anonyme";
  const email = String(input.email ?? "").trim();
  const message = String(input.message ?? "");
  const typeLabel = input.type === "professionnel" ? "Professionnel" : "Particulier";
  const date = new Date(typeof input.created_at === "string" ? input.created_at : Date.now()).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  });
  const validEmail = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(email);

  const rows: EmailRow[] = [
    ["Nom", name],
    ["Email", email || "—"],
    ["Profil", typeLabel],
    ["Date", date],
  ];
  const body = [
    emailText(`${name} vous a écrit depuis le formulaire de contact du site.`),
    emailDetails(rows),
    emailPanel("Message", message.trim() ? escapeHtml(message.trim()).replace(/\r?\n/g, "<br>") : "—"),
  ].join("");

  const html = renderEmailLayout({
    preheader: `${typeLabel} · ${message.replace(/\s+/g, " ").slice(0, 90)}`,
    title: "Nouveau message de contact",
    bodyHtml: body,
    cta: validEmail ? { label: "Répondre par email", url: `mailto:${email}` } : undefined,
    footerNote: "Alerte interne envoyée par le formulaire de contact.",
  });
  const subject = `[Contact] ${name} (${typeLabel})`.replace(/\s+/g, " ").slice(0, 200);
  const text = [`Nouveau message de ${name} (${email || "—"}) — ${typeLabel}, ${date}`, "", message].join("\n");
  return { subject, html, text };
}
