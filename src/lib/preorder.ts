// Précommande saison 2027 côté front : règles et montants définis une seule fois dans
// supabase/functions/_shared/catalog.ts (create-preorder-checkout et stripe-webhook les importent aussi).
export {
  PREORDER_2027,
  PreorderValidationError,
  isValidPreorderKg,
  preorderAmounts,
} from "../../supabase/functions/_shared/catalog";
export type { PreorderAmounts } from "../../supabase/functions/_shared/catalog";

// Cycle de vie d'une précommande 2027 (colonne pre_orders.status).
export const PREORDER_STATUSES = ["acompte_paye", "solde_facture", "expediee", "livree", "rembourse", "annulee"] as const;
export type PreorderStatus = (typeof PREORDER_STATUSES)[number];

export const PREORDER_STATUS_LABELS: Record<PreorderStatus, string> = {
  acompte_paye: "Acompte payé",
  solde_facture: "Solde facturé",
  expediee: "Expédiée",
  livree: "Livrée",
  rembourse: "Remboursée",
  annulee: "Annulée",
};

const INACTIVE: readonly string[] = ["rembourse", "annulee"];

export interface PreorderRow {
  kg: number | null;
  acompte_cents: number | null;
  solde_cents: number | null;
  status: string;
}

// Compteur de l'onglet admin : kg réservés et montants, hors précommandes remboursées ou annulées.
export function preorderTotals(rows: readonly PreorderRow[]) {
  const active = rows.filter((r) => !INACTIVE.includes(r.status));
  return {
    count: active.length,
    kg: active.reduce((sum, r) => sum + (r.kg ?? 0), 0),
    depositCents: active.reduce((sum, r) => sum + (r.acompte_cents ?? 0), 0),
    balanceCents: active
      .filter((r) => r.status === "acompte_paye" || r.status === "solde_facture")
      .reduce((sum, r) => sum + (r.solde_cents ?? 0), 0),
  };
}
