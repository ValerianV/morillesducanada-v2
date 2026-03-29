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
  image: string;
  servings: string;
  inStock: boolean;
  stock: number;
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
    price: 10,
    priceId: "price_1TAc73EQBCcpAKNIN0IPxabl",
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
    price: 20,
    priceId: "price_1TAc7PEQBCcpAKNIjfQGkL1a",
    image: product30g,
    servings: "4-6 personnes",
    inStock: true,
    stock: 50,
  },
  {
    id: "morilles-45g",
    name: "Prestige 45g",
    slug: "prestige-45g",
    description: "Format pour les coups de feu. Quarante-cinq grammes permettent de travailler en quantité sans rationner. Idéal en carte ou menu dégustation quand la morille est en position centrale.",
    descriptionEn: "For high-volume service. Forty-five grams to work with without rationing. Ideal for à la carte or tasting menus where morel is the lead ingredient.",
    weight: "45g",
    price: 25,
    priceId: "price_1TAc7hEQBCcpAKNI5ZheSa9k",
    image: product45g,
    servings: "6-8 personnes",
    inStock: true,
    stock: 50,
  },
  {
    id: "morilles-sous-vide",
    name: "Morilles sous vide",
    slug: "morilles-sous-vide",
    description: "Conditionnement professionnel. De 100g à 1kg selon le volume de service. Tarif dégressif à partir de 500g. Pour les cuisines qui travaillent la morille en régulier.",
    descriptionEn: "Professional packaging. From 100g to 1kg depending on service volume. Tiered pricing from 500g. For kitchens that use morel on a regular basis.",
    weight: "100g à 1kg",
    price: 45,
    image: productVacuumBag,
    servings: "Format pro & passionnés",
    inStock: true,
    stock: 50,
    variableWeight: {
      minGrams: 100,
      maxGrams: 1000,
      stepGrams: 50,
    },
  },
];

export function getVacuumMorelPrice(weightGrams: number): number {
  const kiloRate = weightGrams >= 500 ? 400 : 450;
  return Number(((weightGrams / 1000) * kiloRate).toFixed(2));
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
