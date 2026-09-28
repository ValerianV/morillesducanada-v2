// Helpers purs partagés par les emails et la facture (testés dans src/test/format.test.ts).

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface OrderItemLike {
  name?: unknown;
  quantity?: unknown;
  unit_amount?: unknown;
  price?: unknown;
}

// Les commandes enregistrent `unit_amount` en centimes (stripe-webhook).
// `price` (en euros) n'est lu qu'en repli pour d'éventuelles lignes anciennes.
export function itemUnitAmountCents(item: OrderItemLike): number {
  if (typeof item.unit_amount === "number" && Number.isFinite(item.unit_amount)) {
    return Math.round(item.unit_amount);
  }
  if (typeof item.price === "number" && Number.isFinite(item.price)) {
    return Math.round(item.price * 100);
  }
  return 0;
}

export function itemQuantity(item: OrderItemLike): number {
  return typeof item.quantity === "number" && Number.isFinite(item.quantity) && item.quantity > 0
    ? item.quantity
    : 1;
}

export function itemLineTotalCents(item: OrderItemLike): number {
  return itemUnitAmountCents(item) * itemQuantity(item);
}

export function formatEuros(cents: number): string {
  return `${(cents / 100).toFixed(2)} €`;
}

// N'autorise que des liens https (bouton « Suivre mon colis »).
export function safeHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
