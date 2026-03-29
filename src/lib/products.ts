import product12g from "@/assets/product-12g.webp";
import product30g from "@/assets/product-30g.webp";
import product45g from "@/assets/product-45g.webp";
import productVacuumBag from "@/assets/product-vacuum-bag.webp";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
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
    description: "Pot de 12g de morilles de feu séchées. Idéal pour découvrir nos morilles sauvages du Canada. Parfait pour 2 personnes.",
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
    description: "Pot de 30g de morilles de feu séchées. Le format idéal pour un repas entre amis. Parfait pour 4-6 personnes.",
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
    description: "Pot de 45g de morilles de feu séchées. Format généreux pour les amateurs de morilles ou idéal en cadeau gastronomique.",
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
    description: "Conditionnement sous vide en grands formats. De 100g à 1kg.",
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
