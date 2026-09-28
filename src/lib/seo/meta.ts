import { getVacuumMorelPrice, type Product } from "@/lib/products";
import { formatEurosLocale } from "@/lib/proPricing";
import { SITE_NAME } from "./site";
import { VACUUM_WEIGHTS_GRAMS } from "./schema";

const eur = (value: number) => formatEurosLocale(Math.round(value * 100), "fr");
const FACTS = "Stock en France, expédition sous 5 jours ouvrés.";

export function productMetaTitle(product: Product): string {
  if (product.weightPriceIds) return `Morilles sous vide, de 100 g à 1 kg | ${SITE_NAME}`;
  const range = product.name.replace(/\s*\d+\s*g$/i, "").trim().toLowerCase();
  return `Morilles séchées ${product.weight.replace(/(\d)g$/i, "$1 g")}, format ${range} | ${SITE_NAME}`;
}

export function productMetaDescription(product: Product): string {
  if (product.weightPriceIds) {
    const min = VACUUM_WEIGHTS_GRAMS[0];
    const max = VACUUM_WEIGHTS_GRAMS[VACUUM_WEIGHTS_GRAMS.length - 1];
    return `Morilles sous vide : morilles sauvages du Canada séchées, entières et équeutées. ${min} g à ${eur(getVacuumMorelPrice(min))}, 1 kg à ${eur(getVacuumMorelPrice(max))}. ${FACTS}`;
  }
  return `Morilles séchées sauvages du Canada, ${product.weight.replace(/(\d)g$/i, "$1 g")} à ${eur(product.price)} : entières, équeutées, variétés mélangées. ${FACTS}`;
}
