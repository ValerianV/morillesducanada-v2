// Échantillon payant (décision du fondateur, 2026-11-26) : le pot de 30 g n'est plus offert.
// Il est vendu 20 € plus le port. Dès une commande d'au moins 1 kg, son prix est déduit
// (geste commercial) grâce à un code à usage unique envoyé au client après l'achat de l'échantillon.
// Module pur (aucun import Deno/npm) : importé par le front, create-sample-checkout et stripe-webhook.
import { PRO_SAMPLE_GRAMS, PRO_TIERS, formatEurosLocale } from "./proPricing.ts";

export const SAMPLE_ORDER_TYPE = "pro_sample";
export const PRO_SAMPLE_PRICE_CENTS = 2000;
// Frais de port de l'échantillon (France) : tarif France déjà créé dans Stripe (6,90 €), à confirmer par le fondateur.
export const PRO_SAMPLE_SHIPPING_CENTS = 690;
export const PRO_SAMPLE_TOTAL_CENTS = PRO_SAMPLE_PRICE_CENTS + PRO_SAMPLE_SHIPPING_CENTS;
// Le prix de l'échantillon est déduit d'une commande d'au moins 1 kg.
export const PRO_SAMPLE_CREDIT_MIN_KG = 1;
// Montant minimum de commande pour le code (Stripe) : le prix de 1 kg au premier palier.
export const PRO_SAMPLE_CREDIT_MIN_CENTS = PRO_TIERS[0].priceCents * PRO_SAMPLE_CREDIT_MIN_KG;
// Durée de validité du code de déduction.
export const PRO_SAMPLE_CREDIT_DAYS = 365;

// Code lisible, sans caractères ambigus (0/O, 1/I/L).
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function sampleCreditCode(random: () => number = Math.random): string {
  let out = "";
  for (let i = 0; i < 6; i++) out += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length) % CODE_ALPHABET.length];
  return `ECH-${out}`;
}

export function sampleOfferText(locale: "fr" | "en" = "fr"): string {
  const price = formatEurosLocale(PRO_SAMPLE_PRICE_CENTS, locale);
  const shipping = formatEurosLocale(PRO_SAMPLE_SHIPPING_CENTS, locale);
  return locale === "en"
    ? `${PRO_SAMPLE_GRAMS} g jar at ${price} + ${shipping} shipping, deducted from your first order of ${PRO_SAMPLE_CREDIT_MIN_KG} kg or more`
    : `Pot de ${PRO_SAMPLE_GRAMS} g à ${price} + ${shipping} de port, déduits de votre première commande d'au moins ${PRO_SAMPLE_CREDIT_MIN_KG} kg`;
}
