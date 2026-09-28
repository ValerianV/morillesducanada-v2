// Mise en page commune de tous les emails (transactionnels, alertes admin, authentification).
// Module pur (aucun import Deno/npm) : testé avec vitest (src/test/emailLayout.test.ts).
// Compatible clients mail : tables, styles en ligne, 600 px max, bouton « bulletproof » (VML pour Outlook),
// thème sombre natif déclaré (color-scheme) pour que Gmail et Apple Mail ne l'inversent pas.
// Les helpers échappent eux-mêmes le texte ; `bodyHtml` doit déjà être du HTML sûr.
import { escapeHtml } from "./format.ts";

export const BRAND = {
  name: "Morilles du Canada",
  siteUrl: "https://www.morillesducanada.com",
  siteLabel: "morillesducanada.com",
  contactEmail: "contact@morillesducanada.com",
  logoUrl: "https://www.morillesducanada.com/logo.png",
  taxMention: "Prix nets — TVA non applicable, art. 293 B du CGI",
} as const;

// Palette du site.
export const EMAIL_COLORS = {
  page: "#1a1714",
  card: "#2a2520",
  panel: "#221e1a",
  border: "#3d352c",
  gold: "#cc9a2e",
  goldLight: "#d4a843",
  cream: "#e8dcc8",
  muted: "#b3a58c",
  faint: "#8a7e6b",
} as const;

const SERIF = "Georgia, 'Cormorant Garamond', 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const C = EMAIL_COLORS;

export interface EmailCta {
  label: string;
  url: string;
}

export interface EmailLayoutInput {
  preheader: string;
  title: string;
  bodyHtml: string;
  cta?: EmailCta;
  // HTML sûr affiché sous le bouton (lien de secours, remarque).
  afterCtaHtml?: string;
  footerNote?: string;
  // Emails commerciaux (prix, commande, devis) : mention fiscale en pied de page.
  commercial?: boolean;
  locale?: "fr" | "en";
}

// Seuls les liens https, mailto: et tel: sont acceptés dans un bouton.
export function safeEmailUrl(url: string): string | null {
  const value = url.trim();
  if (/^(mailto:|tel:)/i.test(value)) return value;
  try {
    return new URL(value).protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

export function emailButton(cta: EmailCta): string {
  const url = safeEmailUrl(cta.url);
  if (!url) return "";
  const href = escapeHtml(url);
  const label = escapeHtml(cta.label);
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;"><tr><td align="left">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:48px;v-text-anchor:middle;width:280px;" arcsize="6%" stroke="f" fillcolor="${C.gold}"><w:anchorlock/><center style="color:${C.page};font-family:Arial,sans-serif;font-size:14px;font-weight:bold;letter-spacing:1px;">${label}</center></v:roundrect><![endif]-->
<!--[if !mso]><!-- --><a href="${href}" target="_blank" style="display:inline-block;background-color:${C.gold};color:${C.page};font-family:${SANS};font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;line-height:48px;padding:0 32px;border-radius:3px;mso-hide:all;">${label}</a><!--<![endif]-->
</td></tr></table>`;
}

export function emailParagraph(html: string, opts: { muted?: boolean; small?: boolean } = {}): string {
  const color = opts.muted ? C.muted : C.cream;
  const size = opts.small ? 13 : 15;
  return `<p class="mdc-text" style="margin:0 0 16px;font-family:${SANS};font-size:${size}px;line-height:1.65;color:${color};">${html}</p>`;
}

// Paragraphe en texte brut, échappé.
export function emailText(text: string, opts: { muted?: boolean; small?: boolean } = {}): string {
  return emailParagraph(escapeHtml(text), opts);
}

export function emailHeading(text: string): string {
  return `<p style="margin:28px 0 10px;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${C.gold};">${escapeHtml(text)}</p>`;
}

export type EmailRow = [label: string, value: string];

// Tableau libellé / valeur (récapitulatif de devis, de commande, d'alerte). Texte échappé.
export function emailDetails(rows: EmailRow[], opts: { emphasizeLast?: boolean } = {}): string {
  const body = rows
    .map(([label, value], i) => {
      const last = i === rows.length - 1;
      const strong = opts.emphasizeLast && last;
      const border = last ? "" : `border-bottom:1px solid ${C.border};`;
      return `<tr><td valign="top" style="padding:11px 16px;${border}font-family:${SANS};font-size:13px;line-height:1.5;color:${C.muted};width:40%;">${escapeHtml(label)}</td><td valign="top" style="padding:11px 16px;${border}font-family:${strong ? SERIF : SANS};font-size:${strong ? 19 : 14}px;line-height:1.5;color:${strong ? C.goldLight : C.cream};${strong ? "" : "font-weight:600;"}">${escapeHtml(value)}</td></tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;background-color:${C.panel};border:1px solid ${C.border};border-radius:4px;margin:0 0 20px;">${body}</table>`;
}

export interface EmailItemLine {
  name: string;
  quantity: number;
  amount: string;
}

// Tableau d'articles (produit, quantité, montant) avec lignes de totaux. Texte échappé.
export function emailItemsTable(
  lines: EmailItemLine[],
  totals: EmailRow[],
  labels: { product: string; quantity: string; amount: string },
): string {
  const th = (text: string, align: string) =>
    `<th align="${align}" style="padding:10px 16px;border-bottom:1px solid ${C.gold};font-family:${SANS};font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${C.gold};text-align:${align};">${escapeHtml(text)}</th>`;
  const rows = lines
    .map(
      (line) =>
        `<tr><td style="padding:12px 16px;border-bottom:1px solid ${C.border};font-family:${SANS};font-size:14px;line-height:1.45;color:${C.cream};">${escapeHtml(line.name)}</td><td align="center" style="padding:12px 8px;border-bottom:1px solid ${C.border};font-family:${SANS};font-size:14px;color:${C.cream};text-align:center;">${escapeHtml(line.quantity)}</td><td align="right" style="padding:12px 16px;border-bottom:1px solid ${C.border};font-family:${SANS};font-size:14px;color:${C.cream};text-align:right;white-space:nowrap;">${escapeHtml(line.amount)}</td></tr>`,
    )
    .join("");
  const foot = totals
    .map(([label, value], i) => {
      const last = i === totals.length - 1;
      return `<tr><td colspan="2" align="right" style="padding:${last ? "14px" : "10px"} 8px ${last ? "14px" : "4px"} 16px;font-family:${SANS};font-size:${last ? 14 : 13}px;font-weight:${last ? 700 : 400};color:${last ? C.cream : C.muted};text-align:right;">${escapeHtml(label)}</td><td align="right" style="padding:${last ? "14px" : "10px"} 16px ${last ? "14px" : "4px"} 8px;font-family:${last ? SERIF : SANS};font-size:${last ? 22 : 13}px;color:${last ? C.goldLight : C.muted};text-align:right;white-space:nowrap;">${escapeHtml(value)}</td></tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background-color:${C.panel};border:1px solid ${C.border};margin:0 0 20px;"><thead><tr>${th(labels.product, "left")}${th(labels.quantity, "center")}${th(labels.amount, "right")}</tr></thead><tbody>${rows}</tbody><tfoot>${foot}</tfoot></table>`;
}

// Encadré (adresse, facture, message). `html` doit être sûr.
export function emailPanel(title: string, html: string): string {
  return `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:${C.panel};border:1px solid ${C.border};border-left:2px solid ${C.gold};margin:0 0 20px;"><tr><td style="padding:16px 18px;"><p style="margin:0 0 8px;font-family:${SANS};font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${C.gold};">${escapeHtml(title)}</p><div style="font-family:${SANS};font-size:14px;line-height:1.6;color:${C.cream};">${html}</div></td></tr></table>`;
}

// Lignes de texte brut, échappées, séparées par des retours à la ligne.
export function emailLines(lines: Array<string | null | undefined>): string {
  return lines.filter((l): l is string => typeof l === "string" && l.trim() !== "").map(escapeHtml).join("<br>");
}

export function emailLink(label: string, url: string, opts: { breakAll?: boolean } = {}): string {
  const safe = safeEmailUrl(url);
  if (!safe) return escapeHtml(label);
  const wrap = opts.breakAll ? "word-break:break-all;overflow-wrap:anywhere;" : "";
  return `<a href="${escapeHtml(safe)}" style="color:${C.goldLight};text-decoration:underline;${wrap}">${escapeHtml(label)}</a>`;
}

// Texte invisible en tête (aperçu dans la boîte de réception), suivi d'espaces pour ne pas afficher le corps.
function preheaderHtml(text: string): string {
  const filler = "&#8199;&#65279;&#847; ".repeat(60);
  return `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;color:${C.page};">${escapeHtml(text)}${filler}</div>`;
}

export function renderEmailLayout(input: EmailLayoutInput): string {
  const lang = input.locale ?? "fr";
  const title = escapeHtml(input.title);
  const tax = input.commercial
    ? `<p style="margin:10px 0 0;font-family:${SANS};font-size:11px;line-height:1.6;color:${C.muted};">${escapeHtml(BRAND.taxMention)}</p>`
    : "";
  const note = input.footerNote
    ? `<p style="margin:10px 0 0;font-family:${SANS};font-size:11px;line-height:1.6;color:${C.faint};">${escapeHtml(input.footerNote)}</p>`
    : "";

  // Espace fine insécable (séparateur de milliers fr-FR) : absente de Georgia, remplacée par une insécable.
  return `<!DOCTYPE html>
<html lang="${lang}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${title}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
:root { color-scheme: dark; supported-color-schemes: dark; }
body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: ${C.page}; }
table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
a { color: ${C.goldLight}; }
a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
@media (prefers-color-scheme: dark) {
  .mdc-page { background-color: ${C.page} !important; }
  .mdc-card { background-color: ${C.card} !important; }
  .mdc-text { color: ${C.cream} !important; }
}
[data-ogsc] .mdc-text { color: ${C.cream} !important; }
[data-ogsb] .mdc-page { background-color: ${C.page} !important; }
[data-ogsb] .mdc-card { background-color: ${C.card} !important; }
@media only screen and (max-width: 620px) {
  .mdc-pad { padding-left: 22px !important; padding-right: 22px !important; }
  .mdc-title { font-size: 25px !important; }
}
</style>
</head>
<body class="mdc-page" style="margin:0;padding:0;background-color:${C.page};">
${preheaderHtml(input.preheader)}
<table role="presentation" class="mdc-page" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="${C.page}" style="background-color:${C.page};">
<tr><td align="center" style="padding:36px 12px 28px;">
<!--[if mso]><table role="presentation" width="600" border="0" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;">
<tr><td align="center" style="padding:0 0 24px;">
<a href="${BRAND.siteUrl}" target="_blank" style="text-decoration:none;"><img src="${BRAND.logoUrl}" width="64" height="64" alt="" style="display:block;width:64px;height:64px;margin:0 auto 12px;"></a>
<a href="${BRAND.siteUrl}" target="_blank" style="text-decoration:none;font-family:${SERIF};font-size:22px;letter-spacing:0.04em;color:${C.cream};">${BRAND.name}</a>
<p style="margin:6px 0 0;font-family:${SANS};font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:${C.gold};">Morilles de feu sauvages</p>
</td></tr>
<tr><td class="mdc-card mdc-pad" bgcolor="${C.card}" style="background-color:${C.card};border:1px solid ${C.border};border-top:2px solid ${C.gold};border-radius:4px;padding:36px 40px 32px;">
<h1 class="mdc-title mdc-text" style="margin:0 0 20px;font-family:${SERIF};font-size:28px;font-weight:400;line-height:1.25;color:${C.cream};">${title}</h1>
${input.bodyHtml}
${input.cta ? emailButton(input.cta) : ""}
${input.afterCtaHtml ?? ""}
</td></tr>
<tr><td align="center" class="mdc-pad" style="padding:24px 40px 0;">
<p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.7;color:${C.muted};"><a href="${BRAND.siteUrl}" target="_blank" style="color:${C.muted};text-decoration:none;">${BRAND.name}</a> · <a href="${BRAND.siteUrl}" target="_blank" style="color:${C.muted};text-decoration:none;">${BRAND.siteLabel}</a> · <a href="mailto:${BRAND.contactEmail}" style="color:${C.muted};text-decoration:none;">${BRAND.contactEmail}</a></p>
${tax}${note}
</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`.replace(/\u202f/g, "&nbsp;");
}
