// /llms.txt et /llms-full.txt : faits clairs et citables pour les moteurs de réponse (ChatGPT, Claude,
// Perplexity, Gemini). Générés au build (scripts/prerender.mjs) depuis les mêmes constantes que le site,
// pour qu'aucun prix ni aucune date ne dérive. Faits autorisés uniquement (docs/business/recit.md et offre.md).
// Format : llmstxt.org (titre H1, résumé en citation, faits, puis sections H2 de liens).
import {
  PRO_MAX_KG,
  PRO_MIN_KG,
  PRO_PACK_GRAMS,
  PRO_QUOTE_REPLY_HOURS,
  PRO_SAMPLE_GRAMS,
  PRO_SHIPPING_BUSINESS_DAYS,
  PRO_STOCK_KG,
  PRO_TAX_MENTION,
  PRO_TIERS,
  formatEurosLocale,
  formatTierPrice,
} from "@/lib/proPricing";
import { PREORDER_2027 } from "@/lib/preorder";
import { POT_PRICE_CENTS, POT_SIZES_G } from "@/lib/potAllocation";
import { tastingTourLines } from "@/lib/tasting";
import { ARTICLES, CONTENT_LINK_LABELS, type ArticleBlock } from "@/lib/seo/articles";
import { fr } from "@/i18n/fr";
import { absoluteUrl, CONTACT_EMAIL, FOUNDER_NAME, OFFER_LAST_REVIEWED, SITE_NAME, SITE_URL } from "@/lib/seo/site";

const eur = (cents: number) => formatEurosLocale(cents);
const grid = PRO_TIERS.map((t) => `${t.label.fr} = ${formatTierPrice(t)}`).join(" ; ");
const url = (path: string) => absoluteUrl(path);
const PHONE = "07 82 16 27 08";

// [libellé](/chemin) → « libellé (https://…/chemin) » ; gras retiré.
export function plainText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, (_m, label: string, path: string) => `${label} (${url(path)})`)
    .replace(/\*\*/g, "");
}

function blockText(block: ArticleBlock): string {
  switch (block.type) {
    case "p":
      return plainText(block.text);
    case "ul":
      return block.items.map((i) => `- ${plainText(i)}`).join("\n");
    case "ol":
      return block.items.map((i, n) => `${n + 1}. ${plainText(i)}`).join("\n");
    case "table":
      return [
        block.caption,
        `| ${block.head.join(" | ")} |`,
        `| ${block.head.map(() => "---").join(" | ")} |`,
        ...block.rows.map((r) => `| ${r.join(" | ")} |`),
      ].join("\n");
  }
}

const facts = (): string[] => [
  `- **Qui** : ${SITE_NAME}, micro-entreprise française (entrepreneur individuel) fondée par ${FOUNDER_NAME}, ancien cueilleur : trois saisons de cueillette de morilles de feu (2022, 2023 et 2024) en Colombie-Britannique et au Yukon.`,
  `- **Quoi** : morilles de feu sauvages du Canada, séchées, entières et équeutées (pied retiré), variétés sauvages mélangées (brune, blonde, grise), sans tri par variété.`,
  `- **Origine** : Canada (Colombie-Britannique et Yukon), forêts brûlées l'année précédente ; cueillette à la main au printemps ; séchage sur place par un réseau de cueilleurs.`,
  `- **Stock** : environ ${PRO_STOCK_KG} kg, en France (septembre 2026).`,
  `- **Clients** : professionnels uniquement (restaurants, épiceries fines, traiteurs, distributeurs) ; SIRET demandé à la commande ; aucune vente aux particuliers.`,
  `- **Prix au kilo** (${PRO_TAX_MENTION.fr}) : ${grid}. Le prix du palier atteint s'applique à toute la quantité. De ${PRO_MIN_KG} à ${PRO_MAX_KG} kg, par pas de 500 g.`,
  `- **Conditionnement** : sachets sous vide de ${PRO_PACK_GRAMS} g (par exemple, 3 kg = 12 sachets). Option pots : pots en verre vides de ${POT_SIZES_G.join(", ")} g, sans étiquette, ${eur(POT_PRICE_CENTS)} net le pot, livrés à part (l'épicerie les remplit et les étiquette).`,
  `- **Livraison** : France uniquement, port inclus, expédition sous ${PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés, colis suivi.`,
  `- **Commande** : en ligne (carte, page Stripe sécurisée) ou sur devis (réponse sous ${PRO_QUOTE_REPLY_HOURS} h ouvrées, virement sur facture possible) : ${url("/professionnels")}`,
  `- **Échantillon** : un pot en verre de ${PRO_SAMPLE_GRAMS} g offert, remis en main propre quand Valérian passe dans la zone du professionnel ; envoi possible au cas par cas, après échange téléphonique. Zones et dates : ${tastingTourLines("fr").join(" ; ")}.`,
  `- **Précommande saison ${PREORDER_2027.season}** : professionnels uniquement, ${eur(PREORDER_2027.pricePerKgCents)}/kg, acompte de 50 %, de ${PREORDER_2027.minKg} à ${PREORDER_2027.maxKg} kg ; livraison garantie en ${PREORDER_2027.delivery.fr}, en France, port inclus ; acompte intégralement remboursé s'il est impossible de fournir : ${url("/precommande-2027")}`,
  `- **Contact** : ${CONTACT_EMAIL} · ${PHONE} · ${FOUNDER_NAME}, interlocuteur unique. Éditeur : ${FOUNDER_NAME}, EI, SIRET 802 861 948 00023, Aubignan (Vaucluse), France.`,
];

export function buildLlmsTxt(): string {
  const guides = ARTICLES.map((a) => `- [${CONTENT_LINK_LABELS[a.path]}](${url(a.path)}): ${a.metaDescription}`);
  return [
    `# ${SITE_NAME}`,
    "",
    `> Morilles de feu sauvages du Canada, séchées, entières et équeutées, en stock en France. Vente au kilo réservée aux professionnels (restaurants, épiceries fines, traiteurs, distributeurs) : ${grid}, prix nets, port inclus en France.`,
    "",
    `Dernière mise à jour des informations : ${OFFER_LAST_REVIEWED}. Version détaillée, avec les questions et réponses des guides : ${SITE_URL}/llms-full.txt`,
    "",
    ...facts(),
    "",
    "## Offre et commande",
    "",
    `- [Tarifs, devis et commande en ligne](${url("/professionnels")}): grille au kilo, configurateur de commande, pots en option, demande de devis, dégustation en main propre, FAQ des professionnels`,
    `- [Précommande saison ${PREORDER_2027.season}](${url("/precommande-2027")}): ${eur(PREORDER_2027.pricePerKgCents)}/kg, acompte de 50 %, livraison en ${PREORDER_2027.delivery.fr}`,
    `- [Conditions générales de vente](${url("/cgv")}): conditions professionnelles`,
    `- [Livraison](${url("/livraison")}): France uniquement, port inclus`,
    "",
    "## Guides pour les professionnels",
    "",
    ...guides,
    `- [${CONTENT_LINK_LABELS["/guide-morilles-de-feu"]}](${url("/guide-morilles-de-feu")}): origine, cueillette après incendie, préparation et conservation`,
    "",
    "## Produit",
    "",
    `- [Fiche technique](${url("/fiche-technique")}): produit, conditionnement, conservation`,
    `- [Plaquette professionnelle](${url("/plaquette-pro")}): l'offre en résumé`,
    "",
    "## Optional",
    "",
    `- [Recettes aux morilles](${url("/recettes")}): recettes de chefs`,
    `- [Galerie](${url("/galerie")}): photos des zones de cueillette`,
    `- [Mentions légales](${url("/mentions-legales")}): éditeur et données personnelles`,
    `- [llms-full.txt](${SITE_URL}/llms-full.txt): version détaillée de ce fichier`,
    "",
  ].join("\n");
}

export function buildLlmsFullTxt(): string {
  const out: string[] = [
    `# ${SITE_NAME} : informations détaillées`,
    "",
    `> Morilles de feu sauvages du Canada, séchées, entières et équeutées, en stock en France, vendues au kilo aux professionnels. Dernière mise à jour des informations : ${OFFER_LAST_REVIEWED}. Site : ${SITE_URL}/`,
    "",
    "## Faits clés",
    "",
    ...facts(),
    "",
    "## Sauvage ou cultivée ?",
    "",
    `- Morille sauvage (la nôtre) : ${fr.wildVsCultivated.wild.join(" ; ")}.`,
    `- Morille de culture : ${fr.wildVsCultivated.cultivated.join(" ; ")}.`,
    "",
    "## Questions des professionnels",
    "",
  ];
  for (const item of fr.pro.faq.items) out.push(`### ${item.q}`, "", item.a, "");
  for (const article of ARTICLES) {
    out.push(
      `## ${article.h1}`,
      "",
      `Page : ${url(article.path)} · publié le ${article.datePublished}, mis à jour le ${article.dateModified} · auteur : ${FOUNDER_NAME}, fondateur de ${SITE_NAME} et ancien cueilleur.`,
      "",
      plainText(article.lead),
      "",
    );
    for (const section of article.sections) {
      out.push(`### ${section.q}`, "", plainText(section.answer), "");
      for (const block of section.blocks ?? []) out.push(blockText(block), "");
    }
  }
  out.push(
    "## Pages du site",
    "",
    ...[
      "/",
      "/professionnels",
      "/precommande-2027",
      ...ARTICLES.map((a) => a.path),
      "/guide-morilles-de-feu",
      "/fiche-technique",
      "/plaquette-pro",
      "/recettes",
      "/livraison",
      "/cgv",
      "/mentions-legales",
    ].map((p) => `- ${url(p)}`),
    "",
  );
  return out.join("\n");
}
