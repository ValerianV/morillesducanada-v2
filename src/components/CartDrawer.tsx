import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, Loader2, CreditCard } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { loadSupabase } from "@/integrations/supabase/lazy";
import { toast } from "sonner";
import { MAX_QUANTITY_PER_LINE, SHIPPING_ZONES, computeShippingCents, formatGrams, localizeProduct, type ShippingZone } from "@/lib/products";
import { useI18n } from "@/i18n/context";
import { formatEurosLocale } from "@/lib/proPricing";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { t, locale } = useI18n();
  const formatPrice = (euros: number) => formatEurosLocale(Math.round(euros * 100), locale);
  const { items, updateQuantity, removeItem, totalItems, totalPrice, shippingZone, setShippingZone } = useCartStore();
  // Le HTML prérendu n'a pas de panier : le badge n'apparaît qu'après l'hydratation.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const count = hydrated ? totalItems() : 0;
  const total = totalPrice();
  const shipping = computeShippingCents(Math.round(total * 100), shippingZone) / 100;
  const freeShippingThreshold = SHIPPING_ZONES[shippingZone].freeFromCents / 100;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckoutLoading(true);
    try {
      // Le serveur recalcule prix et frais de port : on n'envoie que produit, grammage et quantité.
      const checkoutItems = items.map((item) => ({
        productId: item.product.id,
        ...(item.selectedWeightGrams ? { weightGrams: item.selectedWeightGrams } : {}),
        quantity: item.quantity,
      }));

      const supabase = await loadSupabase();
      // La zone fixe le tarif et les pays de livraison proposés par Stripe (vérifiés côté serveur).
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { items: checkoutItems, shippingZone },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("create-checkout: URL de paiement absente");
      window.location.href = data.url;
      setIsOpen(false);
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(t("cart.checkoutError"), { position: "top-center" });
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative text-foreground hover:text-primary transition-colors" aria-label={t("cart.open")}>
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-medium">
              {count}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-background border-l border-gold/20">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-serif text-gradient-gold">{t("cart.title")}</SheetTitle>
          <SheetDescription>
            {count === 0 ? t("cart.empty") : t(count === 1 ? "cart.itemsOne" : "cart.itemsOther").replace("{count}", String(count))}
          </SheetDescription>
        </SheetHeader>
        {items.length > 0 && shipping > 0 && (
          <div className="px-1 pt-4 pb-2">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
              <span>{t("cart.freeShippingFrom").replace("{amount}", formatPrice(freeShippingThreshold))}</span>
              <span className="text-primary font-medium">{t("cart.remaining").replace("{amount}", formatPrice(freeShippingThreshold - total))}</span>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }} />
            </div>
          </div>
        )}
        {items.length > 0 && shipping === 0 && (
          <p className="text-[10px] text-primary text-center pt-3 pb-1 font-medium tracking-wide">{t("cart.freeShipping")}</p>
        )}
        <div className="flex flex-col flex-1 pt-4 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-light">{t("cart.empty")}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-4">
                {items.map((item) => {
                  const name = localizeProduct(item.product, locale).name;
                  return (
                  <div key={item.id} className="flex gap-4 p-3 border border-gold/10 rounded-sm">
                    <div className="w-16 h-16 bg-secondary/20 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm truncate">{name}</h4>
                      <p className="text-xs text-muted-foreground">{item.selectedWeightGrams ? formatGrams(item.selectedWeightGrams) : item.product.weight}</p>
                      <p className="text-sm text-primary font-medium mt-1">{formatPrice(item.unitPrice)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button onClick={() => removeItem(item.id)} aria-label={t("cart.remove")} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-3 w-3" />
                      </button>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={t("cart.decrease")} className="w-6 h-6 border border-gold/20 rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={t("cart.increase")} disabled={item.quantity >= MAX_QUANTITY_PER_LINE} className="w-6 h-6 border border-gold/20 rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
              <div className="flex-shrink-0 space-y-4 pt-4 border-t border-gold/20">
                <fieldset>
                  <legend className="text-xs text-muted-foreground mb-2">{t("cart.destination")}</legend>
                  <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t("cart.destination")}>
                    {(Object.keys(SHIPPING_ZONES) as ShippingZone[]).map((zone) => {
                      const rule = SHIPPING_ZONES[zone];
                      const selected = zone === shippingZone;
                      return (
                        <button
                          key={zone}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setShippingZone(zone)}
                          className={`px-3 py-2 border rounded-sm text-left text-xs transition-colors ${
                            selected ? "border-primary bg-primary/10 text-foreground" : "border-gold/20 text-muted-foreground hover:border-gold/40"
                          }`}
                        >
                          <span className="block font-medium">{rule.label[locale]}</span>
                          <span className="block text-[10px] mt-0.5">
                            {t("cart.zoneRate")
                              .replace("{amount}", formatPrice(rule.amountCents / 100))
                              .replace("{free}", formatPrice(rule.freeFromCents / 100))}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5">{t(shippingZone === "FR" ? "cart.zoneHintFR" : "cart.zoneHintEU")}</p>
                </fieldset>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>{t("cart.subtotal")}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>{t("cart.shipping")}</span>
                    <span>{shipping === 0 ? t("cart.shippingFree") : formatPrice(shipping)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-serif text-lg">{t("cart.total")}</span>
                  <span className="font-serif text-xl text-gradient-gold">{formatPrice(total + shipping)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || items.length === 0}
                  className="w-full py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" />{t("cart.checkout")}</>}
                </button>
                <p className="text-[10px] text-muted-foreground text-center font-light">{t("cart.secure")}</p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
