// Pages de contenu (SEO et GEO) : une page prérendue par intention d'achat des professionnels.
// Chaque section commence par une réponse directe (c'est ce que les moteurs de réponse extraient),
// puis détaille. Faits autorisés uniquement (docs/business/recit.md et docs/business/offre.md) ;
// les prix viennent de la grille (proPricing.ts), jamais recopiés à la main.
// Les repères de marché ne sont cités qu'avec leur source (docs/business/marche.md).
//
// Marquage des liens dans le texte : [libellé](/chemin) ; gras : **texte**.
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
  quote,
} from "@/lib/proPricing";
import { PREORDER_2027 } from "@/lib/preorder";
import { POT_PRICE_CENTS, POT_SIZES_G } from "@/lib/potAllocation";
import { tastingTourLines } from "@/lib/tasting";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; caption: string; head: string[]; rows: string[][] };

export interface ArticleSection {
  id: string;
  // Question affichée en H2, telle qu'un acheteur la poserait.
  q: string;
  // Réponse directe, 2 à 3 phrases : reprise dans le JSON-LD FAQPage.
  answer: string;
  blocks?: ArticleBlock[];
}

export interface ArticleDef {
  path: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  // Réponse en une phrase ou deux, sous le H1.
  lead: string;
  datePublished: string;
  // À mettre à jour à chaque modification de fond : sert de <lastmod> dans le sitemap.
  dateModified: string;
  keywords: string[];
  sections: ArticleSection[];
  // Chemins des pages à proposer en fin d'article.
  related: string[];
  priority: number;
}

const eur = (cents: number) => formatEurosLocale(cents);
const TAX = PRO_TAX_MENTION.fr;
const lowest = Math.min(...PRO_TIERS.map((t) => t.priceCents));
const highest = Math.max(...PRO_TIERS.map((t) => t.priceCents));
const tierByKg = (kg: number) => {
  const q = quote(kg);
  if (!q) throw new Error(`quantité hors grille : ${kg}`);
  return q;
};
const potPrice = eur(POT_PRICE_CENTS);
const potSizes = POT_SIZES_G.join(", ");
const tastingLines = tastingTourLines("fr");

// Dose utilisée dans le guide et la FAQ : 5 à 8 g de morilles séchées par personne.
const DOSE_MIN_G = 5;
const DOSE_MAX_G = 8;
const costPerCover = (priceCents: number, grams: number) => eur(Math.round((priceCents * grams) / 1000));

const priceRows = PRO_TIERS.map((tier) => [
  tier.label.fr,
  formatTierPrice(tier),
  `${tier.minKg} kg : ${eur(tierByKg(tier.minKg).totalCents)}`,
]);

export const ARTICLES: readonly ArticleDef[] = [
  {
    path: "/acheter-morilles-sechees-restauration",
    metaTitle: "Acheter des morilles séchées pour la restauration | Morilles du Canada",
    metaDescription: `Où acheter des morilles séchées pour un restaurant, un traiteur ou une épicerie fine : morilles de feu sauvages du Canada, au kilo, de ${formatTierPrice(PRO_TIERS[PRO_TIERS.length - 1])} à ${formatTierPrice(PRO_TIERS[0])}, port inclus en France.`,
    eyebrow: "Guide pour les professionnels",
    h1: "Acheter des morilles séchées pour la restauration",
    lead: `Morilles du Canada vend aux restaurants, traiteurs, épiceries fines et distributeurs des morilles de feu sauvages du Canada, séchées, entières et équeutées, au kilo (de ${PRO_MIN_KG} à ${PRO_MAX_KG} kg), en sachets sous vide de ${PRO_PACK_GRAMS} g. ${eur(lowest)} à ${eur(highest)} le kilo net selon la quantité, port inclus en France, expédition sous ${PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés.`,
    datePublished: "2026-10-01",
    dateModified: "2026-10-01",
    keywords: ["acheter morilles séchées", "morilles séchées restaurant", "morilles séchées professionnels", "morilles de feu du Canada", "fournisseur morilles séchées"],
    related: ["/prix-morilles-sechees-kilo-professionnels", "/morille-de-feu-ou-morille-de-culture", "/rehydrater-morilles-sechees-guide-pro", "/morilles-sechees-epicerie-fine"],
    priority: 0.8,
    sections: [
      {
        id: "ou-acheter",
        q: "Où acheter des morilles séchées quand on est restaurateur ?",
        answer: `Auprès d'un fournisseur qui vend au kilo aux professionnels et qui indique l'origine du produit. Morilles du Canada vend aux restaurants, épiceries fines, traiteurs et distributeurs : la commande se fait en ligne sur la page [Professionnels](/professionnels) ou sur devis, avec le SIRET de l'établissement.`,
        blocks: [
          {
            type: "ul",
            items: [
              `**Commande en ligne** : quantité au choix de ${PRO_MIN_KG} à ${PRO_MAX_KG} kg, par pas de 500 g, paiement par carte sur une page Stripe sécurisée.`,
              `**Devis** : réponse personnelle de Valérian sous ${PRO_QUOTE_REPLY_HOURS} h ouvrées, paiement par virement sur facture possible.`,
              `**Téléphone ou email** : Valérian Vilane, fondateur, est votre interlocuteur unique.`,
            ],
          },
          { type: "p", text: `Le stock, ${PRO_STOCK_KG} kg environ, est physiquement en France. [Commander ou demander un devis](/professionnels#commander).` },
        ],
      },
      {
        id: "produit",
        q: "Que vend exactement Morilles du Canada ?",
        answer: "Des morilles de feu sauvages du Canada, cueillies à la main en Colombie-Britannique et au Yukon, séchées sur place, entières et équeutées (le pied est retiré), en variétés mélangées. Goût : arôme intense, chair ferme.",
        blocks: [
          {
            type: "ul",
            items: [
              "**Origine** : forêts canadiennes brûlées l'année précédente (Colombie-Britannique, Yukon).",
              "**Variétés** : mélange de morilles brunes, blondes et grises, sans tri par variété.",
              "**État** : entières et équeutées, vous achetez le chapeau alvéolé.",
              "**Stock** : en France, expédition sous 5 jours ouvrés.",
            ],
          },
          { type: "p", text: "Pour la différence avec une morille produite en serre ou en plein champ : [morille de feu ou morille de culture](/morille-de-feu-ou-morille-de-culture)." },
        ],
      },
      {
        id: "quantites",
        q: "Quelles quantités et quel conditionnement ?",
        answer: `De ${PRO_MIN_KG} kg à ${PRO_MAX_KG} kg, par pas de 500 g, dans la limite du stock. Les morilles sont livrées en sachets sous vide de ${PRO_PACK_GRAMS} g : par exemple, 3 kg = 12 sachets.`,
        blocks: [
          { type: "p", text: `Les épiceries fines peuvent reconditionner les morilles sous leur marque et ajouter, en option, des pots en verre vides de ${potSizes} g à ${potPrice} net le pot : [morilles séchées pour épiceries fines](/morilles-sechees-epicerie-fine).` },
        ],
      },
      {
        id: "conditions",
        q: "Quelles sont les conditions de commande et de livraison ?",
        answer: `Vente réservée aux professionnels, SIRET demandé. ${TAX}, port inclus, livraison en France uniquement, expédition sous ${PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés. Paiement à la commande, par carte ou par virement sur facture.`,
        blocks: [
          {
            type: "ul",
            items: [
              "Facture avec numéro SIRET pour chaque commande.",
              `Prix du palier atteint appliqué à toute la quantité : voir les [prix au kilo](/prix-morilles-sechees-kilo-professionnels).`,
              "Livraison en colis suivi.",
            ],
          },
        ],
      },
      {
        id: "gouter",
        q: "Puis-je avoir un échantillon avant de commander ?",
        answer: `Oui : un pot en verre de ${PRO_SAMPLE_GRAMS} g est offert et remis en main propre, quand Valérian passe dans votre zone. Hors de ces zones, contactez Valérian : il étudie chaque demande.`,
        blocks: [
          { type: "ul", items: tastingLines },
          { type: "p", text: "La demande se fait depuis l'onglet « Échantillon en main propre » de la page [Professionnels](/professionnels#degustation)." },
        ],
      },
      {
        id: "saison-2027",
        q: "Peut-on réserver la saison suivante ?",
        answer: `Oui, en précommande réservée aux professionnels : ${eur(PREORDER_2027.pricePerKgCents)} le kilo, acompte de 50 % à la commande, de ${PREORDER_2027.minKg} à ${PREORDER_2027.maxKg} kg. Livraison garantie en ${PREORDER_2027.delivery.fr}, en France, port inclus ; l'acompte est intégralement remboursé s'il est impossible de fournir.`,
        blocks: [{ type: "p", text: "Détails et paiement de l'acompte : [précommande saison 2027](/precommande-2027)." }],
      },
    ],
  },

  {
    path: "/prix-morilles-sechees-kilo-professionnels",
    metaTitle: "Prix des morilles séchées au kilo pour les professionnels | Morilles du Canada",
    metaDescription: `Prix des morilles séchées au kilo pour les professionnels : ${formatTierPrice(PRO_TIERS[0])} (1 kg) à ${formatTierPrice(PRO_TIERS[PRO_TIERS.length - 1])} (10 kg et plus), net, port inclus en France. Grille, exemples et repères de marché sourcés.`,
    eyebrow: "Guide pour les professionnels",
    h1: "Prix des morilles séchées au kilo pour les professionnels",
    lead: `Chez Morilles du Canada, les morilles de feu sauvages séchées coûtent ${formatTierPrice(PRO_TIERS[0])} pour 1 kg et ${formatTierPrice(PRO_TIERS[PRO_TIERS.length - 1])} à partir de 10 kg. ${TAX}, port inclus en France. Le prix du palier atteint s'applique à toute la quantité commandée.`,
    datePublished: "2026-10-01",
    dateModified: "2026-10-01",
    keywords: ["prix morilles séchées au kilo", "prix morilles séchées professionnels", "tarif morilles séchées", "morilles séchées prix kg", "coût morilles par couvert"],
    related: ["/acheter-morilles-sechees-restauration", "/morille-de-feu-ou-morille-de-culture", "/rehydrater-morilles-sechees-guide-pro", "/precommande-2027"],
    priority: 0.8,
    sections: [
      {
        id: "grille",
        q: "Quelle est la grille de prix au kilo ?",
        answer: `${PRO_TIERS.map((t) => `${t.label.fr} : ${formatTierPrice(t)}`).join(" ; ")}. Prix nets, de ${PRO_MIN_KG} à ${PRO_MAX_KG} kg par pas de 500 g, port inclus en France.`,
        blocks: [
          {
            type: "table",
            caption: "Grille professionnelle au kilo (prix nets, port inclus en France)",
            head: ["Quantité", "Prix net au kilo", "Exemple"],
            rows: priceRows,
          },
          { type: "p", text: `${TAX}. [Commander ou demander un devis](/professionnels#commander).` },
        ],
      },
      {
        id: "degressif",
        q: "Comment le prix dégressif est-il calculé ?",
        answer: "Le prix au kilo dépend de la quantité totale commandée : le palier atteint s'applique à toute la commande, pas seulement aux kilos au-delà du seuil.",
        blocks: [
          {
            type: "p",
            text: `Exemple : ${tierByKg(9.5).kg} kg sont facturés ${eur(tierByKg(9.5).totalCents)} (${formatTierPrice(tierByKg(9.5).tier)}), alors que ${tierByKg(10).kg} kg coûtent ${eur(tierByKg(10).totalCents)} (${formatTierPrice(tierByKg(10).tier)}). Au-dessus d'un seuil, commander un peu plus peut coûter moins cher.`,
          },
        ],
      },
      {
        id: "ht-ttc",
        q: "Le prix affiché est-il hors taxes ou toutes taxes comprises ?",
        answer: `Ni l'un ni l'autre au sens habituel : Morilles du Canada est une micro-entreprise en franchise de TVA. ${TAX} : le prix affiché est le prix final payé, sans TVA à ajouter ni à récupérer.`,
      },
      {
        id: "compris",
        q: "Que comprend le prix ?",
        answer: `Les morilles en sachets sous vide de ${PRO_PACK_GRAMS} g, le port en France et une facture avec numéro SIRET. La livraison se fait en France uniquement, l'expédition sous ${PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés.`,
        blocks: [
          { type: "p", text: `En option, des pots en verre vides de ${potSizes} g, sans étiquette, à ${potPrice} net le pot (livrés à part des sachets) : voir [morilles séchées pour épiceries fines](/morilles-sechees-epicerie-fine).` },
        ],
      },
      {
        id: "cout-couvert",
        q: "Combien coûte la morille par couvert ?",
        answer: `Avec ${DOSE_MIN_G} à ${DOSE_MAX_G} g de morilles séchées par personne, le coût matière des morilles va de ${costPerCover(lowest, DOSE_MIN_G)} (${DOSE_MIN_G} g à ${formatEurosLocale(lowest)}/kg) à ${costPerCover(highest, DOSE_MAX_G)} (${DOSE_MAX_G} g à ${formatEurosLocale(highest)}/kg) par couvert.`,
        blocks: [
          {
            type: "table",
            caption: `Coût des morilles séchées par couvert (net, hors autres ingrédients)`,
            head: ["Palier", `${DOSE_MIN_G} g par couvert`, `${DOSE_MAX_G} g par couvert`],
            rows: PRO_TIERS.map((t) => [t.label.fr, costPerCover(t.priceCents, DOSE_MIN_G), costPerCover(t.priceCents, DOSE_MAX_G)]),
          },
          { type: "p", text: "Les morilles gonflent nettement à la réhydratation : voir le [guide de réhydratation](/rehydrater-morilles-sechees-guide-pro)." },
        ],
      },
      {
        id: "marche",
        q: "Où se situe ce prix par rapport au marché ?",
        answer: `Les offres au kilo relevées en ligne vont de 155 à 260 € TTC le kilo pour des sachets de 1 à 5 kg dont l'origine est souvent non précisée, et de 267 à 320 € le kilo pour les conditionneurs de référence. La grille de Morilles du Canada (${eur(lowest)} à ${eur(highest)} net) concerne une morille de feu sauvage du Canada, entière et équeutée.`,
        blocks: [
          {
            type: "table",
            caption: "Repères de prix publics relevés en septembre 2026 (étude de marché interne de Morilles du Canada)",
            head: ["Offre relevée", "Prix"],
            rows: [
              ["Sachets pour professionnels, 1 à 5 kg, origine souvent non précisée", "155 à 260 €/kg TTC"],
              ["Conditionneurs de référence", "267 à 320 €/kg"],
              ["Revente aux professionnels haut de gamme", "environ 470 €/kg"],
              ["Petits formats au détail (épiceries, vente en ligne)", "580 à 1 000 €/kg"],
            ],
          },
          { type: "p", text: "Source : relevés de prix affichés sur des sites marchands français, septembre 2026, dossier de marché de Morilles du Canada. Les prix TTC incluent la TVA et ne se comparent pas directement à un prix net sans TVA. L'origine, l'état du produit (entier, équeuté) et le conditionnement font varier le prix : comparez à produit équivalent." },
        ],
      },
      {
        id: "pourquoi",
        q: "Pourquoi une morille de feu coûte-t-elle plus cher qu'une morille de culture ?",
        answer: "Parce qu'elle est rare : elle pousse d'elle-même une seule saison, sur des sols brûlés difficiles d'accès, et se cueille à la main. Une morille de culture est produite en serre ou en plein champ selon un calendrier de production.",
        blocks: [{ type: "p", text: "Détail de la comparaison : [morille de feu ou morille de culture](/morille-de-feu-ou-morille-de-culture)." }],
      },
      {
        id: "precommande",
        q: "Quel est le prix de la saison suivante en précommande ?",
        answer: `${eur(PREORDER_2027.pricePerKgCents)} le kilo en précommande saison ${PREORDER_2027.season}, avec un acompte de 50 % (${eur(PREORDER_2027.pricePerKgCents / 2)} le kilo) à la commande, de ${PREORDER_2027.minKg} à ${PREORDER_2027.maxKg} kg. Livraison garantie en ${PREORDER_2027.delivery.fr}, port inclus en France.`,
        blocks: [{ type: "p", text: "[Précommander la saison 2027](/precommande-2027)." }],
      },
    ],
  },

  {
    path: "/morille-de-feu-ou-morille-de-culture",
    metaTitle: "Morille de feu ou morille de culture : la différence | Morilles du Canada",
    metaDescription: "Morille de feu sauvage ou morille de culture : origine, pousse, récolte, disponibilité et prix. Ce qu'un professionnel doit demander à son fournisseur de morilles séchées.",
    eyebrow: "Guide pour les professionnels",
    h1: "Morille de feu ou morille de culture : la différence",
    lead: "La morille de feu est sauvage : elle pousse d'elle-même au printemps qui suit un feu de forêt et se cueille à la main. La morille de culture est produite en serre ou en plein champ, à partir de semis. La différence tient à l'origine, à la rareté et au prix.",
    datePublished: "2026-10-01",
    dateModified: "2026-10-01",
    keywords: ["morille de feu", "morille de culture", "morille sauvage ou cultivée", "différence morille de feu morille de culture", "fire morels"],
    related: ["/guide-morilles-de-feu", "/acheter-morilles-sechees-restauration", "/prix-morilles-sechees-kilo-professionnels", "/rehydrater-morilles-sechees-guide-pro"],
    priority: 0.8,
    sections: [
      {
        id: "morille-de-feu",
        q: "Qu'est-ce qu'une morille de feu ?",
        answer: "Une morille sauvage (en anglais fire morel ou burn morel) qui pousse au printemps sur les forêts brûlées l'année précédente. Personne ne la sème : elle se cueille à la main, à pied, dans la forêt brûlée.",
        blocks: [
          { type: "p", text: "Au Canada, les feux de forêt de l'été laissent des sols noirs de cendre ; le printemps suivant, les morilles y apparaissent d'elles-mêmes. La cueillette dépend donc des feux de l'année précédente et de la saison, et les zones changent d'une année à l'autre." },
        ],
      },
      {
        id: "morille-de-culture",
        q: "Qu'est-ce qu'une morille de culture ?",
        answer: "Une morille produite en serre ou en plein champ, à partir de semis, et récoltée selon un calendrier de production. Sa disponibilité est régulière.",
      },
      {
        id: "tableau",
        q: "Quelles sont les différences, point par point ?",
        answer: "Elles portent sur l'origine, la pousse, la récolte, la disponibilité et le prix : la morille de feu est sauvage et saisonnière, la morille de culture est produite selon un calendrier.",
        blocks: [
          {
            type: "table",
            caption: "Morille de feu et morille de culture",
            head: ["Critère", "Morille de feu (sauvage)", "Morille de culture"],
            rows: [
              ["Où elle pousse", "Forêt brûlée l'année précédente", "Serre ou plein champ"],
              ["Qui la fait pousser", "Personne : elle pousse d'elle-même", "Semée par le producteur"],
              ["Récolte", "Cueillette à la main, à pied", "Récolte selon un calendrier de production"],
              ["Disponibilité", "Liée aux feux et à la saison", "Régulière"],
              ["Pourquoi le prix diffère", "Rareté : une seule saison, sols brûlés difficiles d'accès, cueillette à la main", "Production en serre ou en plein champ"],
            ],
          },
        ],
      },
      {
        id: "pourquoi-cher",
        q: "Pourquoi la morille de feu est-elle plus chère ?",
        answer: "Elle pousse une seule saison, sur des sols brûlés difficiles d'accès, et se cueille à la main : cela explique à la fois sa rareté et son prix.",
        blocks: [
          { type: "p", text: `Les prix au kilo de Morilles du Canada, de ${eur(lowest)} à ${eur(highest)} net, et des repères de marché sourcés sont détaillés dans [le prix des morilles séchées au kilo](/prix-morilles-sechees-kilo-professionnels).` },
        ],
      },
      {
        id: "demander",
        q: "Que demander à son fournisseur pour savoir ce que l'on achète ?",
        answer: "Trois choses : l'origine géographique du produit, son mode de production (sauvage ou culture) et son état (entier ou brisures, avec ou sans pied). Pour une morille sauvage, demandez l'origine précise et le récit de cueillette.",
        blocks: [
          {
            type: "ul",
            items: [
              "**Origine** : pays et région de cueillette, pas seulement « morilles sauvages ».",
              "**Production** : sauvage ou cultivée, en toutes lettres.",
              "**État** : entières ou brisures, équeutées ou non, variétés mélangées ou triées.",
              "**Conditions** : conditionnement, port, délai d'expédition, facture avec SIRET.",
            ],
          },
        ],
      },
      {
        id: "notre-cueillette",
        q: "D'où viennent les morilles de Morilles du Canada ?",
        answer: "Du Canada : Colombie-Britannique et Yukon, sur des forêts brûlées l'année précédente. Valérian Vilane, fondateur, y a cueilli lui-même des morilles de feu pendant trois saisons (2022, 2023 et 2024) ; il travaille aujourd'hui avec un réseau de cueilleurs sur les feux canadiens, qui sèchent les morilles sur place.",
        blocks: [
          { type: "p", text: "Les morilles sont entières et équeutées, en variétés mélangées, et stockées en France. [Voir l'offre professionnelle](/professionnels) ou le [guide de la morille de feu](/guide-morilles-de-feu)." },
        ],
      },
    ],
  },

  {
    path: "/rehydrater-morilles-sechees-guide-pro",
    metaTitle: "Comment réhydrater des morilles séchées (guide pro) | Morilles du Canada",
    metaDescription: `Réhydrater des morilles séchées en cuisine professionnelle : eau tiède 30 à 40 °C, 20 à 30 minutes, jus de trempage filtré, dosage de ${DOSE_MIN_G} à ${DOSE_MAX_G} g par couvert, cuisson et conservation.`,
    eyebrow: "Guide pour les professionnels",
    h1: "Comment réhydrater des morilles séchées (guide pro)",
    lead: "Plongez les morilles séchées dans de l'eau tiède (30 à 40 °C, jamais bouillante) pendant 20 à 30 minutes, soulevez-les sans les presser, filtrez le jus de trempage et gardez-le pour vos sauces. Cuisez toujours bien les morilles : Tox Info Suisse recommande au moins 20 minutes.",
    datePublished: "2026-10-01",
    dateModified: "2026-10-01",
    keywords: ["réhydrater morilles séchées", "comment réhydrater des morilles", "dosage morilles séchées par personne", "jus de trempage morilles", "cuisson morilles séchées"],
    related: ["/recettes", "/acheter-morilles-sechees-restauration", "/prix-morilles-sechees-kilo-professionnels", "/guide-morilles-de-feu"],
    priority: 0.7,
    sections: [
      {
        id: "methode",
        q: "Comment réhydrater des morilles séchées, étape par étape ?",
        answer: "Eau tiède (30 à 40 °C), 20 à 30 minutes de trempage, puis égouttage délicat : les morilles retrouvent leur souplesse et le sable reste au fond du bol.",
        blocks: [
          {
            type: "ol",
            items: [
              "Placez les morilles dans un bol d'**eau tiède** (30 à 40 °C), jamais bouillante.",
              "Laissez tremper **20 à 30 minutes**, jusqu'à ce qu'elles soient souples.",
              "Soulevez-les délicatement, sans les presser, pour laisser le sable au fond.",
              "**Filtrez le jus de trempage** à travers un filtre à café ou un linge fin.",
              "Ouvrez chaque morille en deux pour vérifier qu'il ne reste ni sable ni aiguille dans le chapeau.",
            ],
          },
          { type: "p", text: "Vous pouvez aussi les réhydrater dans du vin blanc sec." },
        ],
      },
      {
        id: "eau-bouillante",
        q: "Peut-on utiliser de l'eau bouillante ?",
        answer: "Non. L'eau trop chaude abîme la texture alvéolée et les arômes de la morille : gardez une eau tiède, entre 30 et 40 °C.",
      },
      {
        id: "jus",
        q: "Que faire du jus de trempage ?",
        answer: "Le filtrer et le garder : il parfume les sauces, les risottos et les fonds. Il contient aussi des impuretés, d'où le filtre à café ou le linge fin.",
        blocks: [{ type: "p", text: "Des idées de préparations : [recettes aux morilles](/recettes)." }],
      },
      {
        id: "dosage",
        q: "Quelle quantité de morilles séchées compter par couvert ?",
        answer: `Comptez environ ${DOSE_MIN_G} à ${DOSE_MAX_G} g de morilles séchées par personne : elles gonflent nettement à la réhydratation.`,
        blocks: [
          {
            type: "table",
            caption: "Repères de quantité (produit sec, calculés à partir de 5 à 8 g par personne)",
            head: ["Couverts", "Morilles séchées"],
            rows: [10, 20, 50, 100].map((n) => [`${n} couverts`, `${n * DOSE_MIN_G} à ${n * DOSE_MAX_G} g`]),
          },
          { type: "p", text: `À ces doses, 1 kg de morilles séchées correspond à ${Math.floor(1000 / DOSE_MAX_G)} à ${Math.floor(1000 / DOSE_MIN_G)} couverts. Coût matière par couvert : voir le [prix des morilles séchées au kilo](/prix-morilles-sechees-kilo-professionnels).` },
        ],
      },
      {
        id: "cuisson",
        q: "Faut-il cuire les morilles ?",
        answer: "Oui, toujours : crues ou insuffisamment cuites, les morilles peuvent provoquer une intoxication. Tox Info Suisse recommande au moins 20 minutes de cuisson et des portions raisonnables (une dizaine de grammes de morilles séchées par personne au plus). Ne les servez jamais crues.",
        blocks: [
          { type: "p", text: "Attention aux fausses morilles : la vraie morille a un chapeau alvéolé creux à l'intérieur, alors que la fausse morille (Gyromitra esculenta) a un chapeau plissé irrégulièrement et n'est pas creuse." },
        ],
      },
      {
        id: "conservation",
        q: "Comment conserver les morilles séchées ?",
        answer: "Au sec, à l'abri de la lumière et de l'humidité, à température ambiante, dans leur sachet fermé ou un récipient hermétique. Ne les réfrigérez pas : l'humidité du réfrigérateur les détériore.",
        blocks: [
          { type: "p", text: `Les morilles de Morilles du Canada sont livrées en sachets sous vide de ${PRO_PACK_GRAMS} g. [Acheter des morilles séchées pour la restauration](/acheter-morilles-sechees-restauration) ou consulter les [tarifs et conditions](/professionnels).` },
        ],
      },
    ],
  },

  {
    path: "/morilles-sechees-epicerie-fine",
    metaTitle: "Morilles séchées pour épiceries fines : sachets et pots | Morilles du Canada",
    metaDescription: `Morilles de feu séchées pour épiceries fines : sachets sous vide de ${PRO_PACK_GRAMS} g à reconditionner sous votre marque, pots en verre vides de ${potSizes} g à ${potPrice} net le pot, prix nets au kilo.`,
    eyebrow: "Guide pour les professionnels",
    h1: "Morilles séchées pour épiceries fines : sachets sous vide et pots à remplir",
    lead: `Les épiceries fines reçoivent les morilles de feu en sachets sous vide de ${PRO_PACK_GRAMS} g, au prix au kilo de la grille (${eur(lowest)} à ${eur(highest)} net), et peuvent ajouter des pots en verre vides de ${potSizes} g, sans étiquette, à ${potPrice} net le pot, pour remplir et étiqueter sous leur marque.`,
    datePublished: "2026-10-01",
    dateModified: "2026-10-01",
    keywords: ["morilles séchées épicerie fine", "morilles séchées pots en verre", "reconditionner morilles séchées", "morilles séchées vrac sous vide", "fournisseur morilles épicerie"],
    related: ["/acheter-morilles-sechees-restauration", "/prix-morilles-sechees-kilo-professionnels", "/morille-de-feu-ou-morille-de-culture", "/fiche-technique"],
    priority: 0.7,
    sections: [
      {
        id: "reception",
        q: "Sous quelle forme une épicerie fine reçoit-elle les morilles ?",
        answer: `En sachets sous vide de ${PRO_PACK_GRAMS} g : par exemple, 3 kg = 12 sachets. Les morilles sont entières et équeutées, en variétés mélangées, et peuvent être reconditionnées sous la marque de l'épicerie.`,
        blocks: [{ type: "p", text: `Quantités de ${PRO_MIN_KG} à ${PRO_MAX_KG} kg par pas de 500 g, livraison en France, port inclus, expédition sous ${PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés. ${TAX}.` }],
      },
      {
        id: "pots",
        q: "Quels pots en verre sont proposés ?",
        answer: `Des pots en verre vides, refermables et sans étiquette, en ${potSizes} g, à ${potPrice} net le pot quelle que soit la taille. Ils sont livrés à part des sachets : l'épicerie les remplit et les étiquette elle-même.`,
        blocks: [
          { type: "p", text: "Les pots sont optionnels : la commande est possible sans pots. Le stock de pots est limité ; toute demande au-delà du stock disponible est refusée à la commande." },
        ],
      },
      {
        id: "combien",
        q: "Combien de pots un kilo de morilles remplit-il ?",
        answer: `Au maximum ${Math.floor(1000 / 45)} pots de 45 g, ${Math.floor(1000 / 30)} pots de 30 g ou ${Math.floor(1000 / 12)} pots de 12 g par kilo (calcul : grammes divisés par la taille du pot). Le reste de moins d'un pot est livré en vrac, dans les sachets.`,
        blocks: [
          {
            type: "p",
            text: `Exemple de commande : 2 kg = 20 pots de 45 g + 36 pots de 30 g, soit 56 pots, 1 980 g en pots et 20 g en vrac. Coût : ${eur(tierByKg(2).totalCents)} de morilles + ${eur(56 * POT_PRICE_CENTS)} de pots = ${eur(tierByKg(2).totalCents + 56 * POT_PRICE_CENTS)}, net.`,
          },
          { type: "p", text: "Sur la page [Professionnels](/professionnels#commander), le configurateur calcule les pots pour vous avant le paiement." },
        ],
      },
      {
        id: "prix",
        q: "Quel est le prix au kilo pour une épicerie fine ?",
        answer: `La grille est la même pour tous les professionnels : ${PRO_TIERS.map((t) => `${t.label.fr} ${formatTierPrice(t)}`).join(", ")}. Prix nets, port inclus en France.`,
        blocks: [{ type: "p", text: "Détail et exemples : [prix des morilles séchées au kilo](/prix-morilles-sechees-kilo-professionnels)." }],
      },
      {
        id: "gouter",
        q: "Peut-on avoir un échantillon avant de commander ?",
        answer: `Oui : un pot en verre de ${PRO_SAMPLE_GRAMS} g est offert et remis en main propre, quand Valérian passe dans votre zone. Hors de ces zones, contactez Valérian : il étudie chaque demande.`,
        blocks: [{ type: "ul", items: tastingLines }],
      },
      {
        id: "fiche",
        q: "Où trouver la fiche technique du produit ?",
        answer: "Sur la page [fiche technique](/fiche-technique) : caractéristiques du produit, conditionnement et conservation. La [plaquette professionnelle](/plaquette-pro) résume l'offre.",
      },
    ],
  },
];

export function getArticle(path: string): ArticleDef | undefined {
  return ARTICLES.find((a) => a.path === path);
}

// Titres courts des pages, pour les liens « à lire aussi » et le pied de page.
export const CONTENT_LINK_LABELS: Record<string, string> = {
  "/acheter-morilles-sechees-restauration": "Acheter des morilles séchées pour la restauration",
  "/prix-morilles-sechees-kilo-professionnels": "Prix des morilles séchées au kilo",
  "/morille-de-feu-ou-morille-de-culture": "Morille de feu ou morille de culture",
  "/rehydrater-morilles-sechees-guide-pro": "Réhydrater des morilles séchées",
  "/morilles-sechees-epicerie-fine": "Morilles séchées pour épiceries fines",
  "/guide-morilles-de-feu": "Guide de la morille de feu",
  "/recettes": "Recettes aux morilles",
  "/professionnels": "Tarifs et devis",
  "/precommande-2027": "Précommande saison 2027",
  "/fiche-technique": "Fiche technique",
  "/plaquette-pro": "Plaquette professionnelle",
};
