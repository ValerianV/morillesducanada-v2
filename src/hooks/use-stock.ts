import { useEffect, useState } from "react";
import { loadSupabase } from "@/integrations/supabase/lazy";
import { PRO_STOCK_KG, stockStatus, type StockStatus } from "@/lib/proPricing";

// Stock réel restant, lu dans la table stock_morilles après le premier rendu.
// Le prérendu et le premier rendu utilisent le stock de référence (PRO_STOCK_KG) ;
// si la base ne répond pas, cette valeur reste affichée.
export function useStock(): StockStatus & { live: boolean } {
  const [stockKg, setStockKg] = useState(PRO_STOCK_KG);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = await loadSupabase();
        const { data, error } = await supabase
          .from("stock_morilles")
          .select("remaining_kg")
          .eq("id", 1)
          .maybeSingle();
        if (cancelled || error || !data) return;
        const kg = Number(data.remaining_kg);
        if (Number.isFinite(kg)) {
          setStockKg(kg);
          setLive(true);
        }
      } catch {
        // Hors ligne ou table absente : on garde le stock de référence.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...stockStatus(stockKg), live };
}
