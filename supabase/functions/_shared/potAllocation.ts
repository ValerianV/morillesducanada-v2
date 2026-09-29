// Option « pots en verre vides » des commandes au kilo : unique source de vérité.
// Module pur (aucun import Deno/npm) : importé par le front via src/lib/potAllocation.ts,
// par les edge functions create-pro-checkout et stripe-webhook, et testé avec vitest
// (src/test/potAllocation.test.ts).
//
// Les morilles partent en sachets sous vide de 250 g ; les pots partent vides, sans étiquette,
// à part. Le client les remplit et les étiquette lui-même. Le calcul indique combien de pots
// de chaque format sa quantité permet de remplir, et le reste (moins d'un pot) en vrac.
import { PRO_PACK_GRAMS, formatEurosLocale, isValidProQuantity, quote, type ProQuote } from "./proPricing.ts";

export const POT_SIZES_G = [12, 30, 45] as const;
export type PotSize = (typeof POT_SIZES_G)[number];
export type PotCounts = Record<PotSize, number>;

// 1,50 € net par pot, quelle que soit la taille (décision du fondateur, 2026-09-29).
export const POT_PRICE_CENTS = 150;

// Pots disponibles par format (chiffres provisoires du fondateur, 2026-09-29). null = pas de plafond.
// Tout dépassement est refusé, sur le site comme dans create-pro-checkout.
export const POT_STOCK: Record<PotSize, number | null> = { 12: 250, 30: 250, 45: 200 };

export const POT_DEFAULT_AUTO_SIZE: PotSize = 30;

export const PRO_ORDER_TYPE = "pro_order";

export function isPotSize(value: unknown): value is PotSize {
  return typeof value === "number" && (POT_SIZES_G as readonly number[]).includes(value);
}

export const emptyPotCounts = (): PotCounts => ({ 12: 0, 30: 0, 45: 0 });

export type PotAllocationErrorCode =
  | "invalid_quantity"
  | "invalid_count"
  | "invalid_size"
  | "exceeds_total"
  | "insufficient_stock";

export interface PotAllocationError {
  code: PotAllocationErrorCode;
  size?: PotSize;
  message: { fr: string; en: string };
}

export interface PotAllocation {
  pots: PotCounts;
  gramsInPots: number;
  bulkGrams: number;
  potCount: number;
  potsCents: number;
}

export type PotAllocationResult = ({ ok: true } & PotAllocation) | { ok: false; error: PotAllocationError };

export interface PotAllocationInput {
  totalGrams: number;
  // Pots saisis par le client. Le format autoSize est ignoré ici : il est calculé.
  fixed: Partial<Record<PotSize, number>>;
  // Format rempli automatiquement avec la quantité restante ; null = aucun.
  autoSize: PotSize | null;
  // Remplaçable dans les tests ; POT_STOCK par défaut.
  stock?: Record<PotSize, number | null>;
}

const nf = (locale: "fr" | "en") => new Intl.NumberFormat(locale === "en" ? "en-IE" : "fr-FR");

export function formatGrams(value: number, locale: "fr" | "en" = "fr"): string {
  return `${nf(locale).format(value)} g`;
}

function fail(code: PotAllocationErrorCode, message: { fr: string; en: string }, size?: PotSize): PotAllocationResult {
  return { ok: false, error: { code, message, ...(size ? { size } : {}) } };
}

export function allocatePots(input: PotAllocationInput): PotAllocationResult {
  const { totalGrams, fixed, autoSize } = input;
  const stock = input.stock ?? POT_STOCK;

  if (typeof totalGrams !== "number" || !Number.isInteger(totalGrams) || totalGrams <= 0) {
    return fail("invalid_quantity", {
      fr: "La quantité de morilles est invalide.",
      en: "The morel quantity is invalid.",
    });
  }
  if (autoSize !== null && !isPotSize(autoSize)) {
    return fail("invalid_size", { fr: "Format de pot inconnu.", en: "Unknown jar size." });
  }
  if (fixed === null || typeof fixed !== "object") {
    return fail("invalid_count", { fr: "Nombre de pots invalide.", en: "Invalid number of jars." });
  }
  for (const key of Object.keys(fixed)) {
    if (!isPotSize(Number(key))) {
      return fail("invalid_size", { fr: "Format de pot inconnu.", en: "Unknown jar size." });
    }
  }

  const pots = emptyPotCounts();
  for (const size of POT_SIZES_G) {
    if (size === autoSize) continue;
    const count = fixed[size] ?? 0;
    if (typeof count !== "number" || !Number.isInteger(count) || count < 0) {
      return fail(
        "invalid_count",
        {
          fr: `Nombre de pots de ${size} g invalide : indiquez un nombre entier, 0 ou plus.`,
          en: `Invalid number of ${size} g jars: enter a whole number, 0 or more.`,
        },
        size,
      );
    }
    pots[size] = count;
  }

  const fixedGrams = POT_SIZES_G.reduce((sum, size) => sum + pots[size] * size, 0);
  if (fixedGrams > totalGrams) {
    return fail("exceeds_total", {
      fr: `Les pots saisis représentent ${formatGrams(fixedGrams, "fr")}, plus que la quantité commandée (${formatGrams(totalGrams, "fr")}).`,
      en: `The jars entered hold ${formatGrams(fixedGrams, "en")}, more than the quantity ordered (${formatGrams(totalGrams, "en")}).`,
    });
  }

  if (autoSize !== null) {
    pots[autoSize] = Math.floor((totalGrams - fixedGrams) / autoSize);
  }

  for (const size of POT_SIZES_G) {
    const available = stock[size];
    if (available !== null && available !== undefined && pots[size] > available) {
      return fail(
        "insufficient_stock",
        {
          fr: `Stock insuffisant en pots de ${size} g : ${available} disponibles, ${pots[size]} demandés.`,
          en: `Not enough ${size} g jars in stock: ${available} available, ${pots[size]} requested.`,
        },
        size,
      );
    }
  }

  const gramsInPots = POT_SIZES_G.reduce((sum, size) => sum + pots[size] * size, 0);
  const potCount = POT_SIZES_G.reduce((sum, size) => sum + pots[size], 0);
  return {
    ok: true,
    pots,
    gramsInPots,
    bulkGrams: totalGrams - gramsInPots,
    potCount,
    potsCents: potCount * POT_PRICE_CENTS,
  };
}

// ─── Commande complète : morilles au kilo + pots ───────────────────────────

export interface PotRequest {
  fixed: Partial<Record<PotSize, number>>;
  autoSize: PotSize | null;
}

export interface ProOrderQuote {
  kg: number;
  totalGrams: number;
  // Nombre de sachets sous vide de 250 g.
  bags: number;
  morels: ProQuote;
  morelsCents: number;
  // null si le client ne veut pas de pots (ou 0 pot).
  pots: PotAllocation | null;
  potsCents: number;
  totalCents: number;
}

export type ProOrderQuoteResult = ({ ok: true } & ProOrderQuote) | { ok: false; error: PotAllocationError };

export function quoteProOrder(input: {
  kg: number;
  pots?: PotRequest | null;
  stock?: Record<PotSize, number | null>;
}): ProOrderQuoteResult {
  const morels = isValidProQuantity(input.kg) ? quote(input.kg) : null;
  if (!morels) {
    return {
      ok: false,
      error: {
        code: "invalid_quantity",
        message: {
          fr: "Quantité invalide : de 1 à 45 kg, par pas de 0,5 kg.",
          en: "Invalid quantity: 1 to 45 kg, in 0.5 kg steps.",
        },
      },
    };
  }
  const totalGrams = Math.round(morels.kg * 1000);
  let pots: PotAllocation | null = null;
  if (input.pots) {
    const allocation = allocatePots({
      totalGrams,
      fixed: input.pots.fixed,
      autoSize: input.pots.autoSize,
      stock: input.stock,
    });
    if (allocation.ok === false) return allocation;
    const { pots: counts, gramsInPots, bulkGrams, potCount, potsCents } = allocation;
    pots = potCount > 0 ? { pots: counts, gramsInPots, bulkGrams, potCount, potsCents } : null;
  }
  const potsCents = pots?.potsCents ?? 0;
  return {
    ok: true,
    kg: morels.kg,
    totalGrams,
    bags: Math.round(totalGrams / PRO_PACK_GRAMS),
    morels,
    morelsCents: morels.totalCents,
    pots,
    potsCents,
    totalCents: morels.totalCents + potsCents,
  };
}

// ─── Requête reçue par create-pro-checkout ─────────────────────────────────

export class ProOrderValidationError extends Error {}

// Le client n'envoie que kg, fixed et autoSize ; tout le reste est recalculé.
export function parseProOrderRequest(body: unknown): { kg: number; pots: PotRequest | null; locale: "fr" | "en" } {
  if (!body || typeof body !== "object") throw new ProOrderValidationError("Requête invalide");
  const raw = body as { kg?: unknown; pots?: unknown; locale?: unknown };
  if (typeof raw.kg !== "number" || !isValidProQuantity(raw.kg)) {
    throw new ProOrderValidationError("Quantité invalide : de 1 à 45 kg, par pas de 0,5 kg.");
  }
  const locale = raw.locale === "en" ? "en" : "fr";
  if (raw.pots === null || raw.pots === undefined) return { kg: raw.kg, pots: null, locale };
  if (typeof raw.pots !== "object" || Array.isArray(raw.pots)) throw new ProOrderValidationError("Pots invalides");
  const p = raw.pots as { fixed?: unknown; autoSize?: unknown };
  const autoSize = p.autoSize === null || p.autoSize === undefined ? null : p.autoSize;
  if (autoSize !== null && !isPotSize(autoSize)) throw new ProOrderValidationError("Format de pot inconnu");
  const fixed: Partial<Record<PotSize, number>> = {};
  if (p.fixed !== undefined && p.fixed !== null) {
    if (typeof p.fixed !== "object" || Array.isArray(p.fixed)) throw new ProOrderValidationError("Pots invalides");
    for (const [key, value] of Object.entries(p.fixed as Record<string, unknown>)) {
      const size = Number(key);
      if (!isPotSize(size)) throw new ProOrderValidationError("Format de pot inconnu");
      if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
        throw new ProOrderValidationError(`Nombre de pots de ${size} g invalide`);
      }
      fixed[size] = value;
    }
  }
  return { kg: raw.kg, pots: { fixed, autoSize: autoSize as PotSize | null }, locale };
}

// ─── Libellés partagés (site, Stripe, emails, administration) ──────────────

// « 20 pots de 45 g », « 1 pot de 12 g », « 0 pot de 30 g ».
export function formatPotLine(count: number, size: PotSize, locale: "fr" | "en" = "fr"): string {
  if (locale === "en") return `${nf(locale).format(count)} × ${size} g jar${count === 1 ? "" : "s"}`;
  return `${nf(locale).format(count)} pot${count > 1 ? "s" : ""} de ${size} g`;
}

// Formats demandés, du plus grand au plus petit : « 20 pots de 45 g + 36 pots de 30 g ».
export function formatPotsSummary(pots: PotCounts, locale: "fr" | "en" = "fr"): string {
  return [...POT_SIZES_G]
    .reverse()
    .filter((size) => pots[size] > 0)
    .map((size) => formatPotLine(pots[size], size, locale))
    .join(" + ");
}

// « 2 kg de morilles (8 sachets de 250 g) ».
export function formatBags(kg: number, bags: number, locale: "fr" | "en" = "fr"): string {
  const kgLabel = `${nf(locale).format(kg)} kg`;
  if (locale === "en") return `${kgLabel} of morels (${bags} × ${PRO_PACK_GRAMS} g vacuum bag${bags > 1 ? "s" : ""})`;
  return `${kgLabel} de morilles (${bags} sachet${bags > 1 ? "s" : ""} de ${PRO_PACK_GRAMS} g)`;
}

// Liste de préparation du fondateur :
// « 2 kg = 8 sachets de 250 g · 20 pots de 45 g · 36 pots de 30 g · 0 pot de 12 g ».
export function formatPreparationList(kg: number, pots: PotCounts | null): string {
  const bags = Math.round((kg * 1000) / PRO_PACK_GRAMS);
  const parts = [`${nf("fr").format(kg)} kg = ${bags} sachet${bags > 1 ? "s" : ""} de ${PRO_PACK_GRAMS} g`];
  if (pots) {
    for (const size of [...POT_SIZES_G].reverse()) parts.push(formatPotLine(pots[size], size, "fr"));
  } else {
    parts.push("sans pots");
  }
  return parts.join(" · ");
}

// Ligne Stripe des morilles : « Morilles de feu sauvages du Canada — 2 kg (palier 1 kg, 350 €/kg) ».
export function morelsLineName(order: Pick<ProOrderQuote, "kg" | "morels">, locale: "fr" | "en" = "fr"): string {
  const kg = `${nf(locale).format(order.kg)} kg`;
  const price = `${formatEurosLocale(order.morels.unitPriceCents, locale)}/kg`;
  const tier = order.morels.tier.label[locale];
  return locale === "en"
    ? `Wild fire morels from Canada — ${kg} (tier ${tier}, ${price})`
    : `Morilles de feu sauvages du Canada — ${kg} (palier ${tier}, ${price})`;
}

// Ligne Stripe des pots : « Pots en verre vides, sans étiquette — 56 pots (0×12 g, 36×30 g, 20×45 g) ».
export function potsLineName(pots: PotAllocation, locale: "fr" | "en" = "fr"): string {
  const detail = POT_SIZES_G.map((size) => `${pots.pots[size]}×${size} g`).join(", ");
  const n = nf(locale).format(pots.potCount);
  return locale === "en"
    ? `Empty glass jars, unlabelled — ${n} jar${pots.potCount > 1 ? "s" : ""} (${detail})`
    : `Pots en verre vides, sans étiquette — ${n} pot${pots.potCount > 1 ? "s" : ""} (${detail})`;
}

// Métadonnées Stripe : « 12:0,30:36,45:20 » ↔ { 12: 0, 30: 36, 45: 20 }.
export function serializePotCounts(pots: PotCounts): string {
  return POT_SIZES_G.map((size) => `${size}:${pots[size]}`).join(",");
}

export function parsePotCounts(value: unknown): PotCounts | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const pots = emptyPotCounts();
  for (const part of value.split(",")) {
    const match = /^\s*(\d+)\s*:\s*(\d+)\s*$/.exec(part);
    if (!match) return null;
    const size = Number(match[1]);
    if (!isPotSize(size)) return null;
    pots[size] = Number(match[2]);
  }
  return pots;
}
