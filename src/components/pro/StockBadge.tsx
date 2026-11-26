import { useI18n } from "@/i18n/context";
import { useStock } from "@/hooks/use-stock";
import { formatStockLabel } from "@/lib/proPricing";

// Indicateur de stock réel : « Plus que 23 kg disponibles cette saison », ou « Épuisé ».
// Le chiffre vient de la table stock_morilles (jamais un chiffre inventé pour créer l'urgence).
const StockBadge = ({ className = "" }: { className?: string }) => {
  const { locale } = useI18n();
  const stock = useStock();
  const soldOut = stock.level === "soldOut";
  return (
    <p
      role="status"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border text-base font-medium ${
        soldOut ? "border-destructive/60 text-destructive bg-destructive/10" : "border-primary/60 text-foreground bg-primary/10"
      } ${className}`}
    >
      <span aria-hidden="true" className={`w-2 h-2 rounded-full ${soldOut ? "bg-destructive" : "bg-primary animate-pulse"}`} />
      {formatStockLabel(stock, locale)}
    </p>
  );
};

export default StockBadge;
