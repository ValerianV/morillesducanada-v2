import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, Loader2, CreditCard } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { items, updateQuantity, removeItem, totalItems, totalPrice } = useCartStore();
  const count = totalItems();
  const total = totalPrice();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckoutLoading(true);
    try {
      const lineItems = items.map((item) =>
        item.product.priceId
          ? {
              priceId: item.product.priceId,
              quantity: item.quantity,
            }
          : {
              quantity: item.quantity,
              unitAmountCents: Math.round(item.unitPrice * 100),
              name: `${item.product.name}${item.selectedWeightGrams ? ` ${item.selectedWeightGrams}g` : ""}`,
            }
      );

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { lineItems },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Erreur lors de la création du paiement", { position: "top-center" });
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative text-foreground hover:text-primary transition-colors">
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
          <SheetTitle className="font-serif text-gradient-gold">Votre Panier</SheetTitle>
          <SheetDescription>
            {count === 0 ? "Votre panier est vide" : `${count} article${count !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-light">Votre panier est vide</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 border border-gold/10 rounded-sm">
                    <div className="w-16 h-16 bg-secondary/20 rounded-sm overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm truncate">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.selectedWeightGrams ? `${item.selectedWeightGrams}g` : item.product.weight}</p>
                      <p className="text-sm text-primary font-medium mt-1">{item.unitPrice.toFixed(2)} €</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-3 w-3" />
                      </button>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 border border-gold/20 rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 border border-gold/20 rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex-shrink-0 space-y-4 pt-4 border-t border-gold/20">
                <div className="flex justify-between items-center">
                  <span className="font-serif text-lg">Total</span>
                  <span className="font-serif text-xl text-gradient-gold">{total.toFixed(2)} €</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || items.length === 0}
                  className="w-full py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" />Payer maintenant</>}
                </button>
                <p className="text-[10px] text-muted-foreground text-center font-light">Paiement sécurisé par Stripe · CB, Visa, Mastercard</p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
