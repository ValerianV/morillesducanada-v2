/**
 * Extended editorial content for each product page.
 * Keyed by product.id from products.ts.
 */
export interface ProductPageContent {
  productId: string;
  tagline: string;
  longDescription: string[];
  highlights: { label: string; value: string }[];
  idealFor: string[];
  rehydrationGuide: string[];
  conservation: string;
  relatedProductIds: string[];
  recipeTags: string[];
}

const content: ProductPageContent[] = [
  {
    productId: "morilles-12g",
    tagline: "Le format pour décider avant de s'engager.",
    longDescription: [
      "La morille de feu n'est pas un champignon ordinaire. Son arôme — boisé, légèrement fumé, avec une profondeur que peu d'ingrédients atteignent — se révèle différemment selon la qualité du lot. Ce format de 12g existe pour que vous puissiez le vérifier vous-même avant tout achat en volume.",
      "Douze grammes suffisent pour construire une sauce légère pour deux personnes, aromatiser un fond, ou tester la réhydratation. Vous verrez le gonflement, sentirez l'arôme libéré dans l'eau de trempage, et jugerez la fermeté de la chair après cuisson.",
      "Nos morilles de feu sont récoltées au Canada après les feux de forêt naturels qui déclenchent leur fructification. Séchées dans les 24h suivant la cueillette pour fixer les arômes, triées à la main, conditionnées par lot traçable. Ce sachet représente la même qualité que nos formats professionnels.",
    ],
    highlights: [
      { label: "Poids net", value: "12g" },
      { label: "Origine", value: "Canada — zones post-feu" },
      { label: "Séchage", value: "Artisanal, < 24h après cueillette" },
      { label: "Rendement réhydraté", value: "~60–70g" },
      { label: "Pour", value: "2 personnes (1 sauce légère)" },
      { label: "Conservation", value: "24 mois au sec et à l'abri de la lumière" },
    ],
    idealFor: [
      "Premier achat — découvrir la morille de feu avant de commander en volume",
      "Test comparatif avec un lot déjà en stock",
      "Cuisinier amateur souhaitant explorer une nouvelle saveur",
      "Cadeau gastronomique d'initiation",
    ],
    rehydrationGuide: [
      "Rincez brièvement les morilles sous eau froide pour éliminer les résidus de séchage.",
      "Faites tremper 20 à 30 minutes dans de l'eau tiède (pas bouillante — la chaleur détruit une partie des arômes volatils). Le ratio : 1 volume de morilles pour 4 volumes d'eau.",
      "Conservez précieusement l'eau de trempage. Filtrée sur une étamine ou un papier filtre, elle concentre l'essentiel des arômes solubles — c'est elle qui va parfumer votre sauce ou votre fond.",
      "Faites revenir les morilles réhydratées à feu vif dans du beurre clarifié ou de l'huile neutre. L'évaporation rapide fixe les arômes dans la chair. Évitez de les noyer dans une sauce froide — elles doivent chauffer fort en premier.",
      "Incorporez l'eau de trempage filtrée en fin de cuisson ou dans votre fond, laissez réduire. C'est à ce moment que la morille de feu exprime le mieux sa signature fumée.",
    ],
    conservation:
      "Conserver dans un endroit sec, à l'abri de la lumière et de l'humidité. Ne pas réfrigérer avant ouverture. Une fois ouvert, reconditionner dans un bocal hermétique. Durée de conservation : 24 mois.",
    relatedProductIds: ["morilles-30g", "morilles-45g"],
    recipeTags: ["sauce", "entrée"],
  },
  {
    productId: "morilles-30g",
    tagline: "Le format de référence — assez pour travailler sérieusement.",
    longDescription: [
      "Trente grammes, c'est le format que la majorité de nos clients choisissent dès le deuxième achat. Suffisant pour construire une sauce pour six, aromatiser un fond de veau, ou composer un risotto généreux. Pas de rationnement, pas de calcul au gramme près.",
      "La morille de feu séchée a une densité aromatique bien supérieure à la morille de culture. Cela tient au terroir — ces champignons poussent sur des sols brûlés, riches en minéraux libérés par les cendres, dans des conditions qui n'existent pas en culture contrôlée. Le séchage artisanal dans les 24h après la cueillette fixe cet arôme au lieu de le dissiper.",
      "Ce format est conditionné dans un sachet refermable pour faciliter une utilisation en plusieurs fois. À chaque ouverture, l'arôme libéré confirme que rien n'a été perdu. Le lot est identifiable sur l'emballage — traçabilité jusqu'à la zone de récolte.",
    ],
    highlights: [
      { label: "Poids net", value: "30g" },
      { label: "Origine", value: "Canada — zones post-feu" },
      { label: "Séchage", value: "Artisanal, < 24h après cueillette" },
      { label: "Rendement réhydraté", value: "~150–180g" },
      { label: "Pour", value: "4 à 6 personnes (sauce, risotto, fond)" },
      { label: "Conservation", value: "24 mois au sec et à l'abri de la lumière" },
    ],
    idealFor: [
      "Cuisinier amateur passionné — morilles plusieurs fois par saison",
      "Dîner de fête ou repas gastronomique à domicile",
      "Restaurant avec morilles à la carte occasionnellement",
      "Format polyvalent : sauce, risotto, fond, garniture",
    ],
    rehydrationGuide: [
      "Rincez brièvement les morilles sous eau froide pour éliminer les résidus de séchage.",
      "Faites tremper 20 à 30 minutes dans de l'eau tiède (pas bouillante — la chaleur détruit une partie des arômes volatils). Le ratio : 1 volume de morilles pour 4 volumes d'eau.",
      "Conservez précieusement l'eau de trempage. Filtrée sur une étamine ou un papier filtre, elle concentre l'essentiel des arômes solubles — c'est elle qui va parfumer votre sauce ou votre fond.",
      "Faites revenir les morilles réhydratées à feu vif dans du beurre clarifié ou de l'huile neutre. L'évaporation rapide fixe les arômes dans la chair. Évitez de les noyer dans une sauce froide — elles doivent chauffer fort en premier.",
      "Incorporez l'eau de trempage filtrée en fin de cuisson ou dans votre fond, laissez réduire. C'est à ce moment que la morille de feu exprime le mieux sa signature fumée.",
    ],
    conservation:
      "Conserver dans un endroit sec, à l'abri de la lumière et de l'humidité. Ne pas réfrigérer avant ouverture. Une fois ouvert, reconditionner dans un bocal hermétique. Durée de conservation : 24 mois.",
    relatedProductIds: ["morilles-12g", "morilles-45g", "morilles-sous-vide"],
    recipeTags: ["sauce", "risotto", "plat"],
  },
  {
    productId: "morilles-45g",
    tagline: "Pour les cuisines qui mettent la morille en position centrale.",
    longDescription: [
      "Quarante-cinq grammes pour ne jamais être à court. Ce format s'adresse aux cuisiniers qui font de la morille un élément structurant de leur assiette — pas une touche décorative, mais l'ingrédient principal autour duquel tout s'organise. Risotto où les morilles dominent, filet en croûte avec une sauce morille concentrée, menu dégustation avec un temps fort champignon.",
      "Au prix de 29€, ce format offre le meilleur rapport qualité-quantité de nos sachets. Les 15g supplémentaires par rapport au Classique font une différence réelle en cuisine : vous pouvez garnir généreusement, goûter en cours de préparation, ajuster sans compter.",
      "La morille de feu développe ses arômes en deux temps : une première note boisée et légèrement terrienne à la réhydratation, puis la signature fumée caractéristique qui se révèle à la chaleur dans le beurre ou l'huile. C'est cette complexité en deux actes qui distingue la morille post-feu de toute autre variété.",
    ],
    highlights: [
      { label: "Poids net", value: "45g" },
      { label: "Origine", value: "Canada — zones post-feu" },
      { label: "Séchage", value: "Artisanal, < 24h après cueillette" },
      { label: "Rendement réhydraté", value: "~220–270g" },
      { label: "Pour", value: "6 à 8 personnes (plat principal, morille centrale)" },
      { label: "Conservation", value: "24 mois au sec et à l'abri de la lumière" },
    ],
    idealFor: [
      "Repas gastronomique où la morille est l'ingrédient vedette",
      "Menu dégustation avec un temps fort champignon",
      "Restaurant étoilé ou bistronomique avec morilles en carte régulière",
      "Traiteur préparant un événement sur-mesure",
    ],
    rehydrationGuide: [
      "Rincez brièvement les morilles sous eau froide pour éliminer les résidus de séchage.",
      "Faites tremper 20 à 30 minutes dans de l'eau tiède (pas bouillante — la chaleur détruit une partie des arômes volatils). Le ratio : 1 volume de morilles pour 4 volumes d'eau.",
      "Conservez précieusement l'eau de trempage. Filtrée sur une étamine ou un papier filtre, elle concentre l'essentiel des arômes solubles — c'est elle qui va parfumer votre sauce ou votre fond.",
      "Faites revenir les morilles réhydratées à feu vif dans du beurre clarifié ou de l'huile neutre. L'évaporation rapide fixe les arômes dans la chair. Évitez de les noyer dans une sauce froide — elles doivent chauffer fort en premier.",
      "Incorporez l'eau de trempage filtrée en fin de cuisson ou dans votre fond, laissez réduire. C'est à ce moment que la morille de feu exprime le mieux sa signature fumée.",
    ],
    conservation:
      "Conserver dans un endroit sec, à l'abri de la lumière et de l'humidité. Ne pas réfrigérer avant ouverture. Une fois ouvert, reconditionner dans un bocal hermétique. Durée de conservation : 24 mois.",
    relatedProductIds: ["morilles-30g", "morilles-sous-vide"],
    recipeTags: ["plat", "sauce"],
  },
  {
    productId: "morilles-sous-vide",
    tagline: "Le conditionnement professionnel pour les cuisines qui travaillent en régulier.",
    longDescription: [
      "Quatre formats — 100g, 200g, 500g, 1kg — sous vide pour une conservation optimale et un usage en cuisine professionnelle. Le sous vide élimine l'oxydation et la prise d'humidité qui dégradent progressivement les arômes dans les sachets simples. C'est le choix logique quand la morille est un ingrédient permanent de votre cuisine.",
      "Pour les restaurants, ce format réduit la fréquence des commandes et garantit un stock constant. Pour les épiceries fines, il permet une rotation maîtrisée avec une date de péremption clairement identifiable. Pour les cuisiniers passionnés qui consomment régulièrement, c'est l'option la plus économique au gramme.",
      "Le 1kg représente une économie significative par rapport aux achats fractionnés. La qualité est identique à notre gamme en sachet — même lot, même séchage, même traçabilité. Seul l'emballage change pour s'adapter aux volumes professionnels.",
    ],
    highlights: [
      { label: "Formats disponibles", value: "100g · 200g · 500g · 1kg" },
      { label: "Conditionnement", value: "Sous vide — conservation prolongée" },
      { label: "Origine", value: "Canada — zones post-feu" },
      { label: "Séchage", value: "Artisanal, < 24h après cueillette" },
      { label: "Rendement réhydraté", value: "~5× le poids sec" },
      { label: "Conservation", value: "36 mois sous vide non ouvert" },
    ],
    idealFor: [
      "Restaurant gastronomique ou bistronomique avec morilles à la carte en continu",
      "Épicerie fine ou caviste avec rayon champignons séchés premium",
      "Traiteur ou chef à domicile travaillant sur commandes récurrentes",
      "Cuisinier passionné consommant régulièrement — meilleur coût au gramme",
    ],
    rehydrationGuide: [
      "Rincez brièvement les morilles sous eau froide pour éliminer les résidus de séchage.",
      "Faites tremper 20 à 30 minutes dans de l'eau tiède (pas bouillante — la chaleur détruit une partie des arômes volatils). Le ratio : 1 volume de morilles pour 4 volumes d'eau.",
      "Conservez précieusement l'eau de trempage. Filtrée sur une étamine ou un papier filtre, elle concentre l'essentiel des arômes solubles — c'est elle qui va parfumer votre sauce ou votre fond.",
      "Faites revenir les morilles réhydratées à feu vif dans du beurre clarifié ou de l'huile neutre. L'évaporation rapide fixe les arômes dans la chair. Évitez de les noyer dans une sauce froide — elles doivent chauffer fort en premier.",
      "Incorporez l'eau de trempage filtrée en fin de cuisson ou dans votre fond, laissez réduire. C'est à ce moment que la morille de feu exprime le mieux sa signature fumée.",
    ],
    conservation:
      "Sous vide non ouvert : 36 mois à l'abri de la lumière. Une fois ouvert, reconditionner dans un bocal hermétique et utiliser dans les 6 mois. Ne pas réfrigérer avant ouverture.",
    relatedProductIds: ["morilles-45g", "morilles-30g"],
    recipeTags: ["sauce", "risotto", "plat"],
  },
];

type LocalizedFields = Pick<ProductPageContent, "tagline" | "longDescription" | "highlights" | "idealFor" | "rehydrationGuide" | "conservation">;

const rehydrationGuideEn = [
  "Rinse the morels briefly under cold water to remove any drying residue.",
  "Soak for 20 to 30 minutes in lukewarm water (not boiling — heat destroys some of the volatile aromas). Ratio: 1 volume of morels to 4 volumes of water.",
  "Keep the soaking water. Strained through muslin or a paper filter, it holds most of the soluble aromas — this is what will flavour your sauce or stock.",
  "Sauté the rehydrated morels over high heat in clarified butter or a neutral oil. Fast evaporation locks the aromas into the flesh. Don't drown them in a cold sauce — they need to get hot first.",
  "Add the strained soaking water at the end of cooking or to your stock, and let it reduce. This is when the fire morel best expresses its smoky signature.",
];

const pouchConservationEn =
  "Store in a dry place, away from light and humidity. Do not refrigerate before opening. Once opened, transfer to an airtight jar. Shelf life: 24 months.";

const originEn = { label: "Origin", value: "Canada — post-fire areas" };
const dryingEn = { label: "Drying", value: "Artisanal, < 24h after picking" };
const pouchStorageEn = { label: "Storage", value: "24 months, dry and away from light" };

const contentEn: Record<string, LocalizedFields> = {
  "morilles-12g": {
    tagline: "The size to decide before you commit.",
    longDescription: [
      "The fire morel is no ordinary mushroom. Its aroma — woody, lightly smoky, with a depth few ingredients reach — shows differently depending on the quality of the batch. This 12g size exists so you can check it for yourself before buying in volume.",
      "Twelve grams are enough for a light sauce for two, to flavour a stock, or to test rehydration. You will see the morels swell, smell the aroma released into the soaking water, and judge how firm the flesh is after cooking.",
      "Our fire morels are harvested in Canada after the natural forest fires that trigger their fruiting. Dried within 24 hours of picking to lock in the aromas, sorted by hand, packed by traceable batch. This pouch is the same quality as our professional sizes.",
    ],
    highlights: [
      { label: "Net weight", value: "12g" },
      originEn,
      dryingEn,
      { label: "Rehydrated yield", value: "~60–70g" },
      { label: "Serves", value: "2 people (1 light sauce)" },
      pouchStorageEn,
    ],
    idealFor: [
      "First purchase — discover the fire morel before ordering in volume",
      "Side-by-side test against a batch you already stock",
      "Home cook keen to explore a new flavour",
      "An introductory gourmet gift",
    ],
    rehydrationGuide: rehydrationGuideEn,
    conservation: pouchConservationEn,
  },
  "morilles-30g": {
    tagline: "The reference size — enough to cook seriously.",
    longDescription: [
      "Thirty grams is the size most of our customers choose from their second order. Enough for a sauce for six, to flavour a veal stock, or for a generous risotto. No rationing, no counting every gram.",
      "Dried fire morels have a far greater aromatic density than cultivated morels. It comes down to terroir — these mushrooms grow on burned soil, rich in minerals released by the ash, in conditions that do not exist in controlled cultivation. Artisanal drying within 24 hours of picking locks that aroma in instead of letting it fade.",
      "This size comes in a resealable pouch so you can use it over several sessions. Each time you open it, the aroma confirms nothing has been lost. The batch is identified on the packaging — traceable back to the harvest area.",
    ],
    highlights: [
      { label: "Net weight", value: "30g" },
      originEn,
      dryingEn,
      { label: "Rehydrated yield", value: "~150–180g" },
      { label: "Serves", value: "4 to 6 people (sauce, risotto, stock)" },
      pouchStorageEn,
    ],
    idealFor: [
      "Passionate home cook — morels several times a season",
      "Celebration dinner or gourmet meal at home",
      "Restaurant with morels on the menu from time to time",
      "Versatile size: sauce, risotto, stock, garnish",
    ],
    rehydrationGuide: rehydrationGuideEn,
    conservation: pouchConservationEn,
  },
  "morilles-45g": {
    tagline: "For kitchens that put the morel centre stage.",
    longDescription: [
      "Forty-five grams so you never run short. This size is for cooks who make the morel a structuring element of the plate — not a decorative touch, but the main ingredient everything is built around. A risotto where the morels dominate, a fillet en croûte with a concentrated morel sauce, a tasting menu with a mushroom highlight.",
      "At €29, this size offers the best value of our pouches. The extra 15g over the Classic make a real difference in the kitchen: you can garnish generously, taste as you go, and adjust without counting.",
      "The fire morel develops its aromas in two stages: a first woody, slightly earthy note on rehydration, then the characteristic smoky signature that emerges with heat in butter or oil. This two-act complexity is what sets the post-fire morel apart from any other variety.",
    ],
    highlights: [
      { label: "Net weight", value: "45g" },
      originEn,
      dryingEn,
      { label: "Rehydrated yield", value: "~220–270g" },
      { label: "Serves", value: "6 to 8 people (main course, morel centre stage)" },
      pouchStorageEn,
    ],
    idealFor: [
      "Gourmet meal with the morel as the star ingredient",
      "Tasting menu with a mushroom highlight",
      "Starred or bistronomy restaurant with morels regularly on the menu",
      "Caterer preparing a bespoke event",
    ],
    rehydrationGuide: rehydrationGuideEn,
    conservation: pouchConservationEn,
  },
  "morilles-sous-vide": {
    tagline: "Professional packaging for kitchens that cook with morels regularly.",
    longDescription: [
      "Four sizes — 100g, 200g, 500g, 1kg — vacuum-packed for optimal storage and professional kitchen use. Vacuum packing eliminates the oxidation and moisture uptake that gradually degrade aromas in ordinary pouches. It is the logical choice when the morel is a permanent ingredient in your kitchen.",
      "For restaurants, this format means fewer orders and a steady stock. For delicatessens, it allows controlled rotation with a clearly identifiable best-before date. For passionate cooks who use morels regularly, it is the most economical option per gram.",
      "The 1kg represents a significant saving compared with buying smaller packs. The quality is identical to our pouch range — same batch, same drying, same traceability. Only the packaging changes to suit professional volumes.",
    ],
    highlights: [
      { label: "Sizes available", value: "100g · 200g · 500g · 1kg" },
      { label: "Packaging", value: "Vacuum-packed — extended storage" },
      originEn,
      dryingEn,
      { label: "Rehydrated yield", value: "~5× the dry weight" },
      { label: "Storage", value: "36 months, vacuum-sealed and unopened" },
    ],
    idealFor: [
      "Gourmet or bistronomy restaurant with morels on the menu continuously",
      "Delicatessen or wine shop with a premium dried mushroom shelf",
      "Caterer or private chef working on recurring orders",
      "Passionate cook who uses morels regularly — best cost per gram",
    ],
    rehydrationGuide: rehydrationGuideEn,
    conservation:
      "Unopened vacuum pack: 36 months away from light. Once opened, transfer to an airtight jar and use within 6 months. Do not refrigerate before opening.",
  },
};

export function getProductPageContent(productId: string, locale: "fr" | "en" = "fr"): ProductPageContent | undefined {
  const base = content.find((c) => c.productId === productId);
  if (!base || locale === "fr") return base;
  const en = contentEn[productId];
  return en ? { ...base, ...en } : base;
}
