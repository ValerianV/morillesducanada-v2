import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { products, getVacuumMorelPrice } from "@/lib/products";
import { useCartStore } from "@/stores/cartStore";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/i18n/context";

const ProductsSection = () => {
  const addItem = useCartStore((state) => state.addItem);
  const { t } = useI18n();
  const [vacuumWeight, setVacuumWeight] = useState(100);

  const handleAddToCart = (product: (typeof products)[0], e: React.MouseEvent) => {
    e.stopPropagation();

    if (product.id === "morilles-sous-vide") {
      const price = getVacuumMorelPrice(vacuumWeight);
      addItem(product, 1, { selectedWeightGrams: vacuumWeight, unitPriceOverride: price });
      toast.success(t("products.addedToCart"), {
        description: `${product.name} · ${vacuumWeight}g`,
        position: "top-center",
      });
      return;
    }

    addItem(product);
    toast.success(t("products.addedToCart"), { description: product.name, position: "top-center" });
  };

  return (
    <section id="produits" className="py-24 md:py-32 bg-gradient-card">
      <div className="container mx-auto px-6">
        <ScrollReveal blur>
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">{t("products.label")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light">
              {t("products.title")} <span className="italic text-gradient-gold">{t("products.titleHighlight")}</span>
            </h2>
            <div className="divider-gold w-24 mx-auto mt-8" />
            <p className="text-muted-foreground font-light mt-6 max-w-xl mx-auto">{t("products.description")}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {products.map((product, i) => {
            const isVacuum = product.id === "morilles-sous-vide";
            const currentVacuumPrice = isVacuum ? getVacuumMorelPrice(vacuumWeight) : product.price;

            return (
              <ScrollReveal key={product.id} delay={i * 0.1} direction="up">
              <div
                className="relative border border-gold/15 rounded-sm bg-background/50 hover:border-gold/40 hover:shadow-gold hover:-translate-y-1.5 transition-all duration-500 group overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-lg mb-1">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{product.servings}</p>
                  <p className="font-serif text-2xl text-gradient-gold mb-3">{currentVacuumPrice.toFixed(2)} €</p>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4 line-clamp-2">{product.description}</p>

                  {isVacuum && (
                    <div className="mb-4">
                      <label className="block text-xs text-muted-foreground mb-2">Sélectionner la quantité souhaitée</label>
                      <select
                        value={vacuumWeight}
                        onChange={(e) => setVacuumWeight(Number(e.target.value))}
                        className="w-full bg-secondary text-secondary-foreground border border-border rounded-sm px-3 py-2 text-sm"
                      >
                        {Array.from({ length: 19 }, (_, index) => 100 + index * 50).filter((g) => g !== 450).map((grams) => (
                          <option key={grams} value={grams}>
                            {grams}g · {getVacuumMorelPrice(grams).toFixed(2)} €
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={!product.inStock}
                    className="w-full py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-xs hover:bg-gold-light transition-colors duration-300 rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {t("products.addToCart")}
                  </button>
                </div>
              </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="text-center mt-16">
            <a
              href="#contact"
              className="inline-block px-10 py-4 border border-primary/40 text-foreground font-light tracking-widest uppercase text-sm hover:border-primary hover:text-primary transition-colors duration-300 rounded-sm"
            >
              {t("products.bulkCta")}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProductsSection;
