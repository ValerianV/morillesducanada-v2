// Validation des demandes pro et contenu des emails (submit-pro-lead).
// Module pur (aucun import Deno/npm) : testé avec vitest (src/test/proLead.test.ts).

import { escapeHtml } from "./format.ts";
import { formatSiret, isValidSiret, normalizeSiret } from "./siret.ts";
import {
  emailDetails,
  emailHeading,
  emailLink,
  emailPanel,
  emailParagraph,
  emailText,
  renderEmailLayout,
} from "./emailLayout.ts";
import {
  PRO_MAX_KG,
  PRO_MIN_KG,
  PRO_SAMPLE_GRAMS,
  PRO_QUOTE_REPLY_HOURS,
  PRO_SHIPPING_BUSINESS_DAYS,
  PRO_TAX_MENTION,
  formatEurosLocale,
  formatKg,
  formatTierPrice,
  quote,
  type ProQuote,
} from "./proPricing.ts";
import { TASTING_TOUR, tastingTourLines } from "./tasting.ts";

// Demandes acceptées depuis le 2026-10-01 : devis au kilo ou dégustation en main propre.
export const PRO_LEAD_KINDS = ["devis", "degustation"] as const;
export type ProLeadKind = (typeof PRO_LEAD_KINDS)[number];
// Ancien type (échantillon posté), encore présent dans la base et envoyé par une page en cache :
// accepté et traité comme une dégustation.
export const LEGACY_SAMPLE_KIND = "echantillon";
export type StoredProLeadKind = ProLeadKind | typeof LEGACY_SAMPLE_KIND;

export const ESTABLISHMENT_TYPES = ["restaurant", "epicerie", "traiteur", "distributeur", "autre"] as const;
export type EstablishmentType = (typeof ESTABLISHMENT_TYPES)[number];

// Statuts proposés dans l'admin.
export const PRO_LEAD_STATUSES = [
  "nouveau",
  "contacte",
  "devis_envoye",
  "degustation_planifiee",
  "echantillon_remis",
  "gagne",
  "perdu",
] as const;
// Statut hérité de l'envoi postal (avant 2026-10-01) : valide en base, plus proposé.
export const LEGACY_LEAD_STATUSES = ["echantillon_envoye"] as const;
export type ProLeadStatus = (typeof PRO_LEAD_STATUSES)[number] | (typeof LEGACY_LEAD_STATUSES)[number];

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export interface ProLeadInput {
  kind: ProLeadKind;
  company: string;
  // 14 chiffres, clé de Luhn vérifiée (site réservé aux professionnels).
  siret: string;
  contact_name: string;
  email: string;
  phone: string | null;
  establishment_type: EstablishmentType;
  city: string;
  postal_code: string;
  // Jamais demandée : la dégustation se fait en main propre. Reste null (anciennes lignes seulement).
  address: string | null;
  // Disponibilités pour la dégustation (obligatoires, sauf pour une ancienne page en cache).
  availability: string | null;
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

  const legacySample = b.kind === LEGACY_SAMPLE_KIND;
  const kind = (legacySample ? "degustation" : b.kind) as ProLeadKind;
  if (!PRO_LEAD_KINDS.includes(kind)) errors.kind = "Type de demande invalide";

  const company = singleLine(b.company);
  if (company.length < 2 || company.length > 120) errors.company = "Nom de l'établissement requis (2 à 120 caractères)";

  const siret = normalizeSiret(singleLine(b.siret));
  if (!isValidSiret(siret)) errors.siret = "SIRET invalide : 14 chiffres";

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

  // Plus d'adresse de livraison : l'échantillon est remis en main propre.
  const address = null;

  const availabilityRaw = singleLine(b.availability);
  let availability: string | null = null;
  if (kind === "degustation") {
    availability = availabilityRaw === "" ? null : availabilityRaw;
    if (availability !== null && availability.length > 300) {
      errors.availability = "Disponibilités trop longues (300 caractères maximum)";
    }
    if (availability === null && !legacySample) errors.availability = "Indiquez vos disponibilités";
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
      errors.kg = `Quantité invalide : de ${PRO_MIN_KG} kg à ${PRO_MAX_KG} kg, par tranche de 500 g`;
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
      siret,
      contact_name,
      email,
      phone,
      establishment_type,
      city,
      postal_code,
      address,
      availability,
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
      : `[DÉGUSTATION] ${who}`;
  return clip(subject.replace(/\s+/g, " "), 200);
}

function quoteRows(q: ProQuote, locale: "fr" | "en"): Array<[string, string]> {
  const en = locale === "en";
  return [
    [en ? "Quantity" : "Quantité", formatKg(q.kg, locale)],
    [en ? "Price tier" : "Palier", q.tier.label[locale]],
    [en ? "Price per kilo" : "Prix au kilo", formatTierPrice(q.tier, locale)],
    [en ? "Estimated total" : "Total estimé", formatEurosLocale(q.totalCents, locale)],
  ];
}

function textTable(rows: Array<[string, string]>): string {
  return rows.map(([k, v]) => `${k} : ${v}`).join("\n");
}

export function buildAdminEmail(lead: ProLeadInput, q: ProQuote | null, leadId: string): EmailContent {
  const rows: Array<[string, string]> = [
    ["Type", lead.kind === "devis" ? "Devis au kilo" : `Dégustation en main propre (pot de ${PRO_SAMPLE_GRAMS} g)`],
    ["Établissement", lead.company],
    ["SIRET", formatSiret(lead.siret)],
    ["Type d'établissement", ESTABLISHMENT_LABELS[lead.establishment_type].fr],
    ["Contact", lead.contact_name],
    ["Email", lead.email],
    ["Téléphone", lead.phone ?? "—"],
    ["Ville", `${lead.postal_code} ${lead.city}`],
    ...(lead.kind === "degustation" ? ([["Disponibilités", lead.availability ?? "—"]] as Array<[string, string]>) : []),
    ["Langue", lead.locale.toUpperCase()],
  ];
  if (lead.utm) rows.push(["UTM", Object.entries(lead.utm).map(([k, v]) => `${k}=${v}`).join(" · ")]);
  const quoteTable = q ? quoteRows(q, "fr") : [];

  const phoneLine = lead.phone
    ? emailParagraph(`Appeler : ${emailLink(lead.phone, `tel:${lead.phone.replace(/[^+0-9]/g, "")}`)}`)
    : "";
  const body = [
    emailText(
      lead.kind === "devis"
        ? `${lead.contact_name} (${lead.company}, ${lead.city}) demande un devis depuis /professionnels.`
        : `${lead.contact_name} (${lead.company}, ${lead.city}) demande une dégustation en main propre (pot de ${PRO_SAMPLE_GRAMS} g). Rien à expédier : à planifier lors d'un passage dans sa zone.`,
    ),
    q ? emailHeading("Devis estimé") + emailDetails(quoteTable, { emphasizeLast: true }) : "",
    q ? emailText("Estimation calculée par le site avec la grille publique, à confirmer.", { muted: true, small: true }) : "",
    emailHeading("Demandeur"),
    emailDetails(rows),
    lead.message ? emailPanel("Message", escapeHtml(lead.message).replace(/\r?\n/g, "<br>")) : "",
    phoneLine,
    emailText(`Répondre à cet email écrit directement au prospect. Réf. ${leadId}`, { muted: true, small: true }),
  ].join("");

  const subject = adminSubject(lead);
  const html = renderEmailLayout({
    preheader: q
      ? `${lead.company} (${lead.city}) · ${formatKg(q.kg)} · ${formatEurosLocale(q.totalCents)}`
      : `${lead.company} (${lead.city}) · dégustation en main propre`,
    title: lead.kind === "devis" ? "Nouvelle demande de devis" : "Nouvelle demande de dégustation",
    bodyHtml: body,
    cta: { label: "Ouvrir les leads pro", url: `${SITE_URL}/admin` },
    footerNote: "Alerte interne envoyée par le formulaire /professionnels.",
    commercial: q !== null,
  });

  const text = [
    subject,
    "",
    q ? `Devis estimé\n${textTable(quoteTable)}\n${PRO_TAX_MENTION.fr}. Estimation à confirmer.\n` : "",
    textTable(rows),
    lead.message ? `\nMessage :\n${lead.message}` : "",
    "",
    `Admin : ${SITE_URL}/admin · réf. ${leadId}`,
  ].join("\n");

  return { subject, html, text };
}

export function buildProspectEmail(lead: ProLeadInput, q: ProQuote | null): EmailContent {
  const en = lead.locale === "en";
  const locale = lead.locale;
  const name = lead.contact_name;
  const isQuote = lead.kind === "devis" && q !== null;

  const subject = isQuote
    ? en
      ? "Your quote request — Morilles du Canada"
      : "Votre demande de devis — Morilles du Canada"
    : en
      ? "Your tasting request — Morilles du Canada"
      : "Votre demande de dégustation — Morilles du Canada";

  const intro = isQuote
    ? en
      ? `We have received your quote request for ${formatKg(q!.kg, "en")} of wild Canadian morels, dried, whole and stemless.`
      : `Nous avons bien reçu votre demande de devis pour ${formatKg(q!.kg)} de morilles sauvages du Canada, séchées, entières et équeutées.`
    : en
      ? `We have received your tasting request. The free ${PRO_SAMPLE_GRAMS} g jar is handed over in person at a tasting, when Valérian visits your area. Shipping is possible case by case, after a conversation with him.`
      : `Nous avons bien reçu votre demande de dégustation. Le pot de ${PRO_SAMPLE_GRAMS} g offert est remis en main propre lors d'une dégustation, quand Valérian passe dans votre zone. Un envoi est possible au cas par cas, après échange avec lui.`;

  const next = isQuote
    ? en
      ? `This estimate is indicative. Valérian will confirm your quote and payment terms personally within ${PRO_QUOTE_REPLY_HOURS} business hours. Orders ship within ${PRO_SHIPPING_BUSINESS_DAYS} business days, in 250 g vacuum packs, shipping included in France.`
      : `Cette estimation est indicative : Valérian vous confirme personnellement le devis et les modalités de paiement sous ${PRO_QUOTE_REPLY_HOURS} h ouvrées. Expédition sous ${PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés à la commande, en sachets sous vide de 250 g, port inclus en France.`
    : en
      ? "Valérian will contact you to arrange a time that suits you."
      : "Valérian vous recontacte pour convenir d'un rendez-vous selon vos disponibilités.";
  const tourTitle = en ? "Where Valérian is visiting" : "Où Valérian passe";
  const tourRows = TASTING_TOUR.map(
    (stop) => [stop.zone[locale] + (stop.places ? ` (${stop.places[locale]})` : ""), stop.period[locale]] as [string, string],
  );
  const availabilityRows: Array<[string, string]> = [
    [en ? "Your area" : "Votre ville", `${lead.postal_code} ${lead.city}`],
    [en ? "Your availability" : "Vos disponibilités", lead.availability ?? "—"],
  ];
  const showAvailability = !isQuote && lead.availability !== null;

  const greeting = en ? `Hello ${name},` : `Bonjour ${name},`;
  const recapTitle = en ? "Summary" : "Récapitulatif";
  const questions = en ? "Any questions?" : "Une question ?";
  const signature = "Valérian — Morilles du Canada";
  const tax = PRO_TAX_MENTION[locale];
  const rows = isQuote ? quoteRows(q!, locale) : [];

  const body = [
    emailText(greeting),
    emailText(intro),
    isQuote ? emailHeading(recapTitle) + emailDetails(rows, { emphasizeLast: true }) : "",
    showAvailability ? emailHeading(recapTitle) + emailDetails(availabilityRows) : "",
    emailText(next),
    !isQuote ? emailHeading(tourTitle) + emailDetails(tourRows) : "",
  ].join("");
  const closing = [
    emailParagraph(
      `${escapeHtml(questions)} ${emailLink(CONTACT_PHONE_DISPLAY, `tel:${CONTACT_PHONE_TEL}`)} · ${emailLink(CONTACT_EMAIL, `mailto:${CONTACT_EMAIL}`)}`,
    ),
    emailParagraph(`<span style="font-family:Georgia,serif;font-style:italic;">${escapeHtml(signature)}</span>`, { muted: true }),
  ].join("");

  const html = renderEmailLayout({
    preheader: isQuote
      ? en
        ? `${formatKg(q!.kg, "en")} at ${formatTierPrice(q!.tier, "en")}: estimated total ${formatEurosLocale(q!.totalCents, "en")}.`
        : `${formatKg(q!.kg)} à ${formatTierPrice(q!.tier)} : total estimé ${formatEurosLocale(q!.totalCents)}.`
      : en
        ? `Your ${PRO_SAMPLE_GRAMS} g jar is handed over in person: Valérian will contact you to arrange a time.`
        : `Votre pot de ${PRO_SAMPLE_GRAMS} g est remis en main propre : Valérian vous recontacte pour convenir d'un rendez-vous.`,
    title: isQuote
      ? en ? "Your quote request" : "Votre demande de devis"
      : en ? "Your tasting request" : "Votre demande de dégustation",
    bodyHtml: body,
    cta: { label: en ? "See per-kilo prices" : "Voir la grille au kilo", url: `${SITE_URL}/professionnels` },
    afterCtaHtml: `<div style="height:12px;line-height:12px;font-size:12px;">&nbsp;</div>${closing}`,
    commercial: isQuote,
    locale,
  });

  const text = [
    greeting,
    "",
    intro,
    isQuote ? `\n${recapTitle}\n${textTable(rows)}\n${tax}.` : "",
    showAvailability ? `\n${recapTitle}\n${textTable(availabilityRows)}` : "",
    "",
    next,
    !isQuote ? `\n${tourTitle}\n${tastingTourLines(locale).join("\n")}` : "",
    "",
    `${questions} ${CONTACT_PHONE_DISPLAY} · ${CONTACT_EMAIL}`,
    "",
    signature,
    `${SITE_URL}/professionnels`,
  ].join("\n");

  return { subject, html, text };
}
