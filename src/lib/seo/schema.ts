// Données structurées schema.org (JSON-LD). Fonctions pures, testées dans src/test/seo.test.ts.
// Aucun AggregateRating/Review : il n'existe pas encore d'avis réels publiés.
import { getVacuumMorelPrice, type Product } from "@/lib/products";
import {
  PRO_MAX_KG,
  PRO_SHIPPING_BUSINESS_DAYS,
  PRO_STOCK_KG,
  PRO_TAX_MENTION,
  PRO_TIERS,
} from "@/lib/proPricing";
import {
  absoluteUrl,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  LOGO_URL,
  SITE_NAME,
  SITE_URL,
} from "./site";

export type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const IN_STOCK = "https://schema.org/InStock";
const OUT_OF_STOCK = "https://schema.org/OutOfStock";
const NEW_CONDITION = "https://schema.org/NewCondition";
const BUSINESS_CUSTOMER = "http://purl.org/goodrelations/v1#Business";

export const VACUUM_WEIGHTS_GRAMS = [100, 200, 500, 1000] as const;

const euros = (value: number) => value.toFixed(2);
const orgRef = { "@id": ORG_ID };

export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: { "@type": "ImageObject", url: LOGO_URL, width: 300, height: 300 },
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    description:
      "Morilles sauvages du Canada séchées, entières et équeutées, en stock en France. Vente aux particuliers et aux professionnels.",
    areaServed: { "@type": "Country", name: "France" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      availableLanguage: ["French", "English"],
    },
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: "fr-FR",
    publisher: orgRef,
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  const trail = [{ name: "Accueil", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageSchema(items: readonly { q: string; a: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function productUrl(product: Product): string {
  return absoluteUrl(`/produits/${product.slug}`);
}

function gramsOf(product: Product): number | undefined {
  const match = /^(\d+)\s*g$/i.exec(product.weight.trim());
  return match ? Number(match[1]) : undefined;
}

export function formatGrams(grams: number): string {
  return grams >= 1000 ? `${grams / 1000} kg` : `${grams} g`;
}

// Offres d'un produit, avec les prix de src/lib/products.ts (les mêmes que le panier).
export function productOffers(product: Product): JsonLd[] {
  const availability = product.inStock ? IN_STOCK : OUT_OF_STOCK;
  const base = {
    "@type": "Offer",
    priceCurrency: "EUR",
    availability,
    itemCondition: NEW_CONDITION,
    url: productUrl(product),
    seller: orgRef,
  };
  if (product.weightPriceIds) {
    return VACUUM_WEIGHTS_GRAMS.map((g) => ({
      ...base,
      name: `${product.name} ${formatGrams(g)}`,
      sku: `${product.id}-${g}`,
      price: euros(getVacuumMorelPrice(g)),
      eligibleQuantity: { "@type": "QuantitativeValue", value: g, unitCode: "GRM" },
    }));
  }
  return [{ ...base, sku: product.id, price: euros(product.price) }];
}

export function productSchema(product: Product, description: string): JsonLd {
  const grams = gramsOf(product);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl(product)}#product`,
    name: `${product.name} — morilles séchées sauvages du Canada`,
    sku: product.id,
    description,
    image: [absoluteUrl(product.image)],
    url: productUrl(product),
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Champignons séchés",
    countryOfOrigin: { "@type": "Country", name: "Canada" },
    ...(grams ? { weight: { "@type": "QuantitativeValue", value: grams, unitCode: "GRM" } } : {}),
    offers: productOffers(product),
  };
}

export function productListSchema(list: Product[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Morilles séchées — tous les formats",
    url: absoluteUrl("/produits"),
    itemListElement: list.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: productUrl(p),
      name: p.name,
    })),
  };
}

const cents = (value: number) => euros(value / 100);

// Offre professionnelle au kilo : une Offer par palier de la grille src/lib/proPricing.ts.
export function proOfferSchema(): JsonLd {
  const offers = PRO_TIERS.map((tier, i) => {
    const next = PRO_TIERS[i + 1];
    const maxKg = next ? next.minKg - 0.5 : PRO_MAX_KG;
    return {
      "@type": "Offer",
      name: `Palier ${tier.label.fr}`,
      price: cents(tier.priceCents),
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: cents(tier.priceCents),
        priceCurrency: "EUR",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "KGM" },
      },
      eligibleQuantity: { "@type": "QuantitativeValue", minValue: tier.minKg, maxValue: maxKg, unitCode: "KGM" },
      eligibleCustomerType: BUSINESS_CUSTOMER,
      availability: IN_STOCK,
      itemCondition: NEW_CONDITION,
      inventoryLevel: { "@type": "QuantitativeValue", value: PRO_STOCK_KG, unitCode: "KGM" },
      url: absoluteUrl("/professionnels"),
      seller: orgRef,
      areaServed: { "@type": "Country", name: "France" },
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${absoluteUrl("/professionnels")}#offre-pro`,
    name: "Morilles séchées au kilo — offre professionnelle",
    description: `Morilles sauvages du Canada, séchées, entières et équeutées, variétés mélangées. ${PRO_STOCK_KG} kg en stock en France, expédition sous ${PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés. ${PRO_TAX_MENTION.fr}.`,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Champignons séchés",
    countryOfOrigin: { "@type": "Country", name: "Canada" },
    url: absoluteUrl("/professionnels"),
    offers,
  };
}

export function lowestProPricePerKg(): number {
  return Math.min(...PRO_TIERS.map((t) => t.priceCents)) / 100;
}

export interface RecipeSchemaInput {
  slug: string;
  title: string;
  description: string;
  chef_name: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  image_url: string | null;
  ingredients: { quantity: string; unit: string; name: string }[];
  steps: { step: number; title: string; description: string }[];
  tags: string[] | null;
  created_at?: string | null;
}

export function recipeSchema(recipe: RecipeSchemaInput): JsonLd {
  const url = absoluteUrl(`/recettes/${recipe.slug}`);
  const prep = Number(recipe.prep_time) || 0;
  const cook = Number(recipe.cook_time) || 0;
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "@id": `${url}#recipe`,
    name: recipe.title,
    description: recipe.description,
    url,
    ...(recipe.image_url ? { image: [absoluteUrl(recipe.image_url)] } : {}),
    author: { "@type": "Person", name: recipe.chef_name },
    publisher: orgRef,
    ...(recipe.created_at ? { datePublished: recipe.created_at.slice(0, 10) } : {}),
    prepTime: `PT${prep}M`,
    cookTime: `PT${cook}M`,
    totalTime: `PT${prep + cook}M`,
    recipeYield: `${recipe.servings} portions`,
    recipeIngredient: recipe.ingredients.map((ing) =>
      `${ing.quantity ?? ""}${ing.unit ? ` ${ing.unit}` : ""} ${ing.name}`.trim(),
    ),
    recipeInstructions: recipe.steps.map((step) => ({
      "@type": "HowToStep",
      position: step.step,
      name: step.title,
      text: step.description,
    })),
    ...(recipe.tags?.length ? { keywords: recipe.tags.join(", ") } : {}),
  };
}

// Sérialisation sûre dans une balise <script> (pas de « </script> » possible dans une valeur).
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
