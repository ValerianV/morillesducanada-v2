// Validation des demandes pro et contenu des emails (submit-pro-lead).
// Module pur (aucun import Deno/npm) : testé avec vitest (src/test/proLead.test.ts).

import { escapeHtml } from "./format.ts";
import {
  PRO_MAX_KG,
  PRO_SAMPLE_GRAMS,
  PRO_SHIPPING_BUSINESS_DAYS,
  PRO_TAX_MENTION,
  formatEurosLocale,
  formatKg,
  formatTierPrice,
  quote,
  type ProQuote,
} from "./proPricing.ts";

export const PRO_LEAD_KINDS = ["devis", "echantillon"] as const;
export type ProLeadKind = (typeof PRO_LEAD_KINDS)[number];

export const ESTABLISHMENT_TYPES = ["restaurant", "epicerie", "traiteur", "distributeur", "autre"] as const;
export type EstablishmentType = (typeof ESTABLISHMENT_TYPES)[number];

export const PRO_LEAD_STATUSES = [
  "nouveau",
  "contacte",
  "devis_envoye",
  "echantillon_envoye",
  "gagne",
  "perdu",
] as const;
export type ProLeadStatus = (typeof PRO_LEAD_STATUSES)[number];

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export interface ProLeadInput {
  kind: ProLeadKind;
  company: string;
  contact_name: string;
  email: string;
  phone: string | null;
  establishment_type: EstablishmentType;
  city: string;
  postal_code: string;
  address: string | null;
  kg: number | null;
  message: string | null;
  locale: "fr" | "en";
  utm: Record<string, string> | null;
}

export type ProLeadValidation =
  | { ok: true; lead: ProLeadInput; quote: ProQuote | null }
  | { ok: false; errors: Record<string, string> };

// Champ caché « website » : rempli uniquement par les robots.
export function isHoneypotTriggered(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const value = (body as Record<string, unknown>).website;
  return typeof value === "string" && value.trim() !== "";
}

// Texte sur une ligne : supprime retours à la ligne et caractères de contrôle.
function singleLine(value: unknown): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim()
    : "";
}

function multiLine(value: unknown): string {
  return typeof value === "string"
    ? value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, " ").trim()
    : "";
}

const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;
const PHONE_RE = /^[+0-9 ().-]{6,30}$/;
const POSTAL_RE = /^[A-Z0-9 -]{3,10}$/;

export function validateProLead(body: unknown): ProLeadValidation {
  const errors: Record<string, string> = {};
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  const kind = b.kind as ProLeadKind;
  if (!PRO_LEAD_KINDS.includes(kind)) errors.kind = "Type de demande invalide";

  const company = singleLine(b.company);
  if (company.length < 2 || company.length > 120) errors.company = "Nom de l'établissement requis (2 à 120 caractères)";

  const contact_name = singleLine(b.contact_name);
  if (contact_name.length < 2 || contact_name.length > 120) errors.contact_name = "Nom du contact requis (2 à 120 caractères)";

  const email = singleLine(b.email).toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) errors.email = "Adresse email invalide";

  const phoneRaw = singleLine(b.phone);
  const phone = phoneRaw === "" ? null : phoneRaw;
  if (phone !== null && !PHONE_RE.test(phone)) errors.phone = "Numéro de téléphone invalide";

  const establishment_type = b.establishment_type as EstablishmentType;
  if (!ESTABLISHMENT_TYPES.includes(establishment_type)) errors.establishment_type = "Type d'établissement invalide";

  const city = singleLine(b.city);
  if (city.length < 2 || city.length > 80) errors.city = "Ville requise";

  const postal_code = singleLine(b.postal_code).toUpperCase();
  if (!POSTAL_RE.test(postal_code)) errors.postal_code = "Code postal invalide";

  const addressRaw = singleLine(b.address);
  const address = addressRaw === "" ? null : addressRaw;
  if (address !== null && address.length > 200) errors.address = "Adresse trop longue";
  if (kind === "echantillon" && (address === null || address.length < 5)) {
    errors.address = "Adresse de livraison requise pour l'échantillon";
  }

  const messageRaw = multiLine(b.message);
  const message = messageRaw === "" ? null : messageRaw;
  if (message !== null && message.length > 2000) errors.message = "Message trop long (2 000 caractères maximum)";

  let kg: number | null = null;
  let leadQuote: ProQuote | null = null;
  if (kind === "devis") {
    const rawKg = typeof b.kg === "string" ? Number(b.kg.replace(",", ".")) : b.kg;
    leadQuote = typeof rawKg === "number" ? quote(rawKg) : null;
    if (!leadQuote) {
      errors.kg = `Quantité invalide : de 500 g à ${PRO_MAX_KG} kg, par multiple de 500 g`;
    } else {
      kg = leadQuote.kg;
    }
  }

  const locale = b.locale === "en" ? "en" : "fr";

  let utm: Record<string, string> | null = null;
  if (b.utm && typeof b.utm === "object") {
    const source = b.utm as Record<string, unknown>;
    const picked: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const v = singleLine(source[key]).slice(0, 200);
      if (v) picked[key] = v;
    }
    utm = Object.keys(picked).length > 0 ? picked : null;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    quote: leadQuote,
    lead: {
      kind,
      company,
      contact_name,
      email,
      phone,
      establishment_type,
      city,
      postal_code,
      address,
      kg,
      message,
      locale,
      utm,
    },
  };
}

// ─── Emails ────────────────────────────────────────────────────────────────

export const ESTABLISHMENT_LABELS: Record<EstablishmentType, { fr: string; en: string }> = {
  restaurant: { fr: "Restaurant", en: "Restaurant" },
  epicerie: { fr: "Épicerie fine", en: "Delicatessen" },
  traiteur: { fr: "Traiteur", en: "Caterer" },
  distributeur: { fr: "Distributeur", en: "Distributor" },
  autre: { fr: "Autre", en: "Other" },
};

export const CONTACT_EMAIL = "contact@morillesducanada.com";
export const CONTACT_PHONE_DISPLAY = "07 82 16 27 08";
export const CONTACT_PHONE_TEL = "+33782162708";
export const SENDER = "Morilles du Canada <noreply@morillesducanada.com>";
const SITE_URL = "https://www.morillesducanada.com";

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

function clip(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

export function adminSubject(lead: ProLeadInput): string {
  const who = `${lead.company} (${lead.city})`;
  const subject =
    lead.kind === "devis" && lead.kg !== null
      ? `[DEVIS] ${formatKg(lead.kg)} — ${who}`
      : `[ÉCHANTILLON] ${who}`;
  return clip(subject.replace(/\s+/g, " "), 200);
}

function quoteRows(q: ProQuote, locale: "fr" | "en"): Array<[string, string]> {
  const en = locale === "en";
  return [
    [en ? "Quantity" : "Quantité", formatKg(q.kg, locale)],
    [en ? "Price tier" : "Palier", q.tier.label[locale]],
    [en ? "Price" : "Prix", formatTierPrice(q.tier, locale)],
    [en ? "Estimated total" : "Total estimé", formatEurosLocale(q.totalCents, locale)],
  ];
}

function htmlTable(rows: Array<[string, string]>): string {
  return `<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:15px;">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="color:#555;padding-right:16px;vertical-align:top;">${escapeHtml(k)}</td><td style="color:#1a1612;"><strong>${escapeHtml(v)}</strong></td></tr>`,
    )
    .join("")}</table>`;
}

function textTable(rows: Array<[string, string]>): string {
  return rows.map(([k, v]) => `${k} : ${v}`).join("\n");
}

function layout(inner: string): string {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f2eb;font-family:Arial,Helvetica,sans-serif;color:#1a1612;line-height:1.6;"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:28px;border-top:3px solid #c9a84c;">${inner}</div></body></html>`;
}

export function buildAdminEmail(lead: ProLeadInput, q: ProQuote | null, leadId: string): EmailContent {
  const rows: Array<[string, string]> = [
    ["Type", lead.kind === "devis" ? "Devis au kilo" : `Échantillon (${PRO_SAMPLE_GRAMS} g)`],
    ["Établissement", lead.company],
    ["Type d'établissement", ESTABLISHMENT_LABELS[lead.establishment_type].fr],
    ["Contact", lead.contact_name],
    ["Email", lead.email],
    ["Téléphone", lead.phone ?? "—"],
    ["Adresse", lead.address ?? "—"],
    ["Ville", `${lead.postal_code} ${lead.city}`],
    ["Langue", lead.locale.toUpperCase()],
  ];
  if (q) rows.push(...quoteRows(q, "fr"));
  if (lead.utm) rows.push(["UTM", Object.entries(lead.utm).map(([k, v]) => `${k}=${v}`).join(" · ")]);

  const phoneLink = lead.phone
    ? `<p><a href="tel:${escapeHtml(lead.phone.replace(/[^+0-9]/g, ""))}" style="color:#8a6a1c;">Appeler ${escapeHtml(lead.phone)}</a></p>`
    : "";
  const messageBlock = lead.message
    ? `<h3 style="font-size:15px;margin:20px 0 6px;">Message</h3><p style="white-space:pre-wrap;margin:0;">${escapeHtml(lead.message)}</p>`
    : "";

  const html = layout(
    `<h2 style="font-size:20px;margin:0 0 16px;">${escapeHtml(adminSubject(lead))}</h2>${htmlTable(rows)}${
      q ? `<p style="font-size:13px;color:#555;">${escapeHtml(PRO_TAX_MENTION.fr)}. Estimation calculée par le site, à confirmer.</p>` : ""
    }${messageBlock}${phoneLink}<p><a href="${SITE_URL}/admin" style="color:#8a6a1c;">Ouvrir l'onglet Leads pro</a> · réf. ${escapeHtml(leadId)}</p><p style="font-size:13px;color:#555;">Répondre à cet email écrit directement au prospect.</p>`,
  );

  const text = [
    adminSubject(lead),
    "",
    textTable(rows),
    lead.message ? `\nMessage :\n${lead.message}` : "",
    "",
    `Admin : ${SITE_URL}/admin · réf. ${leadId}`,
  ].join("\n");

  return { subject: adminSubject(lead), html, text };
}

export function buildProspectEmail(lead: ProLeadInput, q: ProQuote | null): EmailContent {
  const en = lead.locale === "en";
  const name = lead.contact_name;
  const isQuote = lead.kind === "devis" && q !== null;

  const subject = isQuote
    ? en
      ? "Your quote request — Morilles du Canada"
      : "Votre demande de devis — Morilles du Canada"
    : en
      ? "Your sample request — Morilles du Canada"
      : "Votre demande d'échantillon — Morilles du Canada";

  const intro = isQuote
    ? en
      ? `We have received your quote request for ${formatKg(q!.kg, "en")} of wild Canadian morels, dried, whole and stemless.`
      : `Nous avons bien reçu votre demande de devis pour ${formatKg(q!.kg)} de morilles sauvages du Canada, séchées, entières et équeutées.`
    : en
      ? `We have received your request for a free ${PRO_SAMPLE_GRAMS} g sample jar (one per establishment).`
      : `Nous avons bien reçu votre demande d'échantillon gratuit : un pot de ${PRO_SAMPLE_GRAMS} g par établissement.`;

  const next = isQuote
    ? en
      ? `This estimate is indicative. Valérian will confirm your quote and payment terms personally. Orders ship within ${PRO_SHIPPING_BUSINESS_DAYS} business days.`
      : `Cette estimation est indicative : Valérian vous confirme personnellement le devis et les modalités de paiement. Expédition sous ${PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés à la commande.`
    : en
      ? "Valérian will contact you to confirm the shipment."
      : "Valérian vous recontacte pour confirmer l'envoi.";

  const greeting = en ? `Hello ${name},` : `Bonjour ${name},`;
  const recapTitle = en ? "Summary" : "Récapitulatif";
  const questions = en ? "Any questions?" : "Une question ?";
  const signature = en ? "Valérian — Morilles du Canada" : "Valérian — Morilles du Canada";
  const tax = PRO_TAX_MENTION[lead.locale];
  const rows = isQuote ? quoteRows(q!, lead.locale) : [];

  const html = layout(
    `<p>${escapeHtml(greeting)}</p><p>${escapeHtml(intro)}</p>${
      isQuote
        ? `<h3 style="font-size:16px;margin:20px 0 8px;">${escapeHtml(recapTitle)}</h3>${htmlTable(rows)}<p style="font-size:14px;color:#555;">${escapeHtml(tax)}.</p>`
        : ""
    }<p>${escapeHtml(next)}</p><p>${escapeHtml(questions)} <a href="tel:${CONTACT_PHONE_TEL}" style="color:#8a6a1c;">${CONTACT_PHONE_DISPLAY}</a> · <a href="mailto:${CONTACT_EMAIL}" style="color:#8a6a1c;">${CONTACT_EMAIL}</a></p><p>${escapeHtml(signature)}<br><a href="${SITE_URL}/professionnels" style="color:#8a6a1c;">morillesducanada.com/professionnels</a></p>`,
  );

  const text = [
    greeting,
    "",
    intro,
    isQuote ? `\n${recapTitle}\n${textTable(rows)}\n${tax}.` : "",
    "",
    next,
    "",
    `${questions} ${CONTACT_PHONE_DISPLAY} · ${CONTACT_EMAIL}`,
    "",
    signature,
    `${SITE_URL}/professionnels`,
  ].join("\n");

  return { subject, html, text };
}
