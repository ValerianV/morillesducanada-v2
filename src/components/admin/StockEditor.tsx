import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PRO_LOW_STOCK_KG, formatKg, formatStockLabel, stockStatus } from "@/lib/proPricing";

// Stock réel affiché sur le site (table stock_morilles). Les commandes pros payées en ligne
// le décomptent seules ; les ventes hors site (virement, main propre) se corrigent ici.
const StockEditor = () => {
  const [remainingKg, setRemainingKg] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("stock_morilles")
        .select("remaining_kg, note, updated_at")
        .eq("id", 1)
        .maybeSingle();
      if (error || !data) {
        console.error("stock_morilles:", error);
        return;
      }
      setRemainingKg(Number(data.remaining_kg));
      setDraft(String(data.remaining_kg).replace(".", ","));
      setNote(data.note);
      setUpdatedAt(data.updated_at);
    })();
  }, []);

  const parsed = Number(draft.replace(",", ".").replace(/\s|kg/gi, ""));
  const valid = draft.trim() !== "" && Number.isFinite(parsed) && parsed >= 0 && parsed <= 1000;

  async function save() {
    if (!valid) return;
    setSaving(true);
    const value = Math.round(parsed * 10) / 10;
    const { data, error } = await supabase
      .from("stock_morilles")
      .update({ remaining_kg: value, note: `Correction manuelle : ${formatKg(value)}` })
      .eq("id", 1)
      .select("remaining_kg, note, updated_at")
      .maybeSingle();
    setSaving(false);
    if (error || !data) {
      console.error("stock_morilles update:", error);
      toast.error("Stock non enregistré");
      return;
    }
    setRemainingKg(Number(data.remaining_kg));
    setNote(data.note);
    setUpdatedAt(data.updated_at);
    toast.success(`Stock enregistré : ${formatKg(Number(data.remaining_kg))}`);
  }

  const preview = valid ? formatStockLabel(stockStatus(parsed)) : "—";

  return (
    <div className="border border-gold/20 rounded-sm p-5 bg-background/50 mb-6">
      <p className="text-sm text-foreground/80 tracking-wider uppercase">Stock affiché sur le site</p>
      <div className="mt-2 flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="block text-sm text-foreground/80 mb-1">Stock réel restant (kg)</span>
          <input
            type="text"
            inputMode="decimal"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={remainingKg === null}
            className="w-32 px-3 py-2 bg-background border border-gold/25 rounded-sm text-base tabular-nums focus:outline-none focus:border-primary"
          />
        </label>
        <button
          type="button"
          onClick={save}
          disabled={!valid || saving || remainingKg === null}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer
        </button>
        <p className="text-base text-foreground">
          Le site affichera : <strong className="text-primary">{preview}</strong>
        </p>
      </div>
      <p className="text-sm text-foreground/75 mt-2">
        Toujours le stock réel. Sous {PRO_LOW_STOCK_KG} kg, le site affiche « Plus que N kg disponibles cette saison » ;
        à 0, « Épuisé » et la commande en ligne se ferme. Les commandes payées en ligne sont décomptées seules.
        {updatedAt && ` Dernière mise à jour : ${new Date(updatedAt).toLocaleString("fr-FR")}${note ? ` (${note})` : ""}.`}
      </p>
    </div>
  );
};

export default StockEditor;
