import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { exportCsv } from "@/lib/csv";
import { formatEurosLocale } from "@/lib/proPricing";
import {
  PREORDER_2027,
  PREORDER_STATUSES,
  PREORDER_STATUS_LABELS,
  preorderTotals,
  type PreorderStatus,
} from "@/lib/preorder";

interface Preorder2027 {
  id: string;
  created_at: string;
  contact_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  kg: number | null;
  acompte_cents: number | null;
  solde_cents: number | null;
  status: string;
  shipping_address: { city?: string | null; postal_code?: string | null; country?: string | null } | null;
}

interface Props {
  refreshToken: number;
  onStatusChange: (id: string, oldStatus: string) => Promise<void>;
}

const eur = (cents: number | null) => formatEurosLocale(cents ?? 0, "fr");
const statusLabel = (status: string) => PREORDER_STATUS_LABELS[status as PreorderStatus] ?? status;

const Preorders2027Tab = ({ refreshToken, onStatusChange }: Props) => {
  const [rows, setRows] = useState<Preorder2027[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pre_orders")
      .select("id, created_at, contact_name, company_name, email, phone, kg, acompte_cents, solde_cents, status, shipping_address")
      .eq("saison", PREORDER_2027.season)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching pre-orders:", error);
      toast.error("Erreur lors du chargement des précommandes");
    } else {
      setRows((data ?? []) as unknown as Preorder2027[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshToken]);

  const totals = useMemo(() => preorderTotals(rows), [rows]);
  const filtered = statusFilter === "all" ? rows : rows.filter((r) => r.status === statusFilter);

  async function updateStatus(id: string, status: string) {
    const oldStatus = rows.find((r) => r.id === id)?.status ?? "";
    const { error } = await supabase.from("pre_orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) {
      toast.error("Erreur lors de la mise à jour");
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await onStatusChange(id, oldStatus);
  }

  const handleExport = () => {
    exportCsv(
      "precommandes-2027.csv",
      ["ID", "Date", "Client", "Société", "Email", "Téléphone", "Kg", "Acompte", "Solde", "Statut", "Ville", "Pays"],
      filtered.map((r) => [
        r.id,
        new Date(r.created_at).toLocaleDateString("fr-FR"),
        r.contact_name,
        r.company_name ?? "",
        r.email,
        r.phone ?? "",
        String(r.kg ?? ""),
        ((r.acompte_cents ?? 0) / 100).toFixed(2),
        ((r.solde_cents ?? 0) / 100).toFixed(2),
        statusLabel(r.status),
        r.shipping_address?.city ?? "",
        r.shipping_address?.country ?? "",
      ]),
    );
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Kg précommandés", value: `${totals.kg} kg` },
          { label: "Précommandes actives", value: String(totals.count) },
          { label: "Acomptes encaissés", value: eur(totals.depositCents) },
          { label: "Soldes à encaisser", value: eur(totals.balanceCents) },
        ].map((stat) => (
          <div key={stat.label} className="border border-gold/15 rounded-sm p-4 bg-background/50">
            <p className="text-xs text-muted-foreground font-light tracking-wider uppercase">{stat.label}</p>
            <p className="font-serif text-2xl text-gradient-gold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Saison {PREORDER_2027.season} · livraison en {PREORDER_2027.delivery.fr} · hors précommandes remboursées ou annulées.
      </p>

      <div className="flex items-center gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrer par statut"
          className="px-3 py-2 bg-secondary/30 border border-gold/15 rounded-sm text-sm text-foreground focus:outline-none focus:border-primary"
        >
          <option value="all">Tous les statuts</option>
          {PREORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{PREORDER_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-2 border border-gold/20 rounded-sm text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors"
        >
          <Download className="w-4 h-4" /> CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold/15 text-left text-xs text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Kg</th>
                <th className="py-3 px-3">Acompte</th>
                <th className="py-3 px-3">Solde</th>
                <th className="py-3 px-3">Livraison</th>
                <th className="py-3 px-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-muted-foreground font-light">Aucune précommande</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="border-b border-gold/10 hover:bg-secondary/10">
                  <td className="py-3 px-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString("fr-FR")}</td>
                  <td className="py-3 px-3">
                    <div className="font-medium">{r.contact_name}{r.company_name ? ` · ${r.company_name}` : ""}</div>
                    <div className="text-xs text-muted-foreground">{r.email}{r.phone ? ` · ${r.phone}` : ""}</div>
                  </td>
                  <td className="py-3 px-3">{r.kg} kg</td>
                  <td className="py-3 px-3 text-primary">{eur(r.acompte_cents)}</td>
                  <td className="py-3 px-3">{eur(r.solde_cents)}</td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {[r.shipping_address?.postal_code, r.shipping_address?.city, r.shipping_address?.country].filter(Boolean).join(" ")}
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      aria-label={`Statut de la précommande de ${r.contact_name}`}
                      className="px-2 py-1 bg-secondary/30 border border-gold/15 rounded-sm text-xs focus:outline-none focus:border-primary"
                    >
                      {!PREORDER_STATUSES.includes(r.status as PreorderStatus) && <option value={r.status}>{r.status}</option>}
                      {PREORDER_STATUSES.map((s) => <option key={s} value={s}>{PREORDER_STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Preorders2027Tab;
