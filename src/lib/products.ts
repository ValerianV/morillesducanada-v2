import product12g from "@/assets/product-12g.webp";
import product30g from "@/assets/product-30g.webp";
import product45g from "@/assets/product-45g.webp";
import productVacuumBag from "@/assets/product-vacuum-bag.webp";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  descriptionEn: string;
  weight: string;
  price: number;
  priceId?: string;
  weightPriceIds?: Record<number, string>;
  image: string;
  servings: string;
  inStock: boolean;
  stock: number;
  badge?: string;
  variableWeight?: {
    minGrams: number;
    maxGrams: number;
    stepGrams: number;
  };
}

export const products: Product[] = [
  {
    id: "morilles-12g",
    name: "Découverte 12g",
    slug: "decouverte-12g",
    description: "Format d'évaluation. Douze grammes suffisent pour tester le produit sur une sauce, un bouillon réduit, une garniture. Qualité constante, origine traçable. Pour décider avant de commander en volume.",
    descriptionEn: "Evaluation format. Twelve grams — enough to test on a sauce, a reduced stock, a garnish. Consistent quality, traceable origin. To decide before ordering in volume.",
    weight: "12g",
    price: 12,
    priceId: "price_1TMjYzEQBCcpAKNI4vXm39ml",
    image: product12g,
    servings: "2 personnes",
    inStock: true,
    stock: 50,
  },
  {
    id: "morilles-30g",
    name: "Classique 30g",
    slug: "classique-30g",
    description: "Le format de service courant. Trente grammes de morilles de feu séchées — assez pour travailler une sauce pour six couverts ou parfumer un fond. Réhydratation nette, chair ferme, arôme concentré.",
    descriptionEn: "Standard service format. Thirty grams of dried fire morels — enough to build a sauce for six, or to deepen a stock. Clean rehydration, firm texture, concentrated aroma.",
    weight: "30g",
    price: 23,
    priceId: "price_1TMjYzEQBCcpAKNIH2MscUC7",
    image: product30g,
    servings: "4-6 personnes",
    inStock: true,
    stock: 50,
    badge: "Populaire",
  },
  {
    id: "morilles-45g",
    name: "Prestige 45g",
    slug: "prestige-45g",
    description: "Format pour les coups de feu. Quarante-cinq grammes permettent de travailler en quantité sans rationner. Idéal en carte ou menu dégustation quand la morille est en position centrale.",
    descriptionEn: "For high-volume service. Forty-five grams to work with without rationing. Ideal for à la carte or tasting menus where morel is the lead ingredient.",
    weight: "45g",
    price: 29,
    priceId: "price_1TMjZ0EQBCcpAKNIPAdnkCjp",
    image: product45g,
    servings: "6-8 personnes",
    inStock: true,
    stock: 50,
  },
  {
    id: "morilles-sous-vide",
    name: "Morilles sous vide",
    slug: "morilles-sous-vide",
    description: "Conditionnement professionnel. 4 formats disponibles : 100g, 200g, 500g ou 1kg. Pour les cuisines qui travaillent la morille en régulier.",
    descriptionEn: "Professional packaging. 4 sizes: 100g, 200g, 500g or 1kg. For kitchens that use morel on a regular basis.",
    weight: "100g à 1kg",
    price: 59,
    weightPriceIds: {
      100: "price_1TMjZ1EQBCcpAKNInOHFVheb",
      200: "price_1TMjZ2EQBCcpAKNIsTdQpP5x",
      500: "price_1TMjZ2EQBCcpAKNI1I5ikvav",
      1000: "price_1TMjZ3EQBCcpAKNIY6emeuWP",
    },
    image: productVacuumBag,
    servings: "Format pro & passionnés",
    inStock: true,
    stock: 50,
  },
];

const vacuumPrices: Record<number, number> = { 100: 59, 200: 110, 500: 240, 1000: 420 };

export function getVacuumMorelPrice(weightGrams: number): number {
  return vacuumPrices[weightGrams] ?? 59;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
