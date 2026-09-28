import { ArrowRight, Check, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DEFAULT_VACUUM_WEIGHT,
  fixedProductGrams,
  formatGrams,
  getVacuumMorelPrice,
  localizeProduct,
  pricePerKg,
  products,
  type Product,
  type VacuumWeight,
} from "@/lib/products";
import { formatEurosLocale } from "@/lib/proPricing";
import { useCartStore } from "@/stores/cartStore";
import ScrollReveal from "@/components/ScrollReveal";
import VacuumFormatPicker, { fill } from "@/components/VacuumFormatPicker";
import { useI18n } from "@/i18n/context";

const vacuumProduct = products.find((p) => p.weightPriceIds)!;
const smallFormats = products.filter((p) => !p.weightPriceIds);

const ProductsSection = () => {
  const addItem = useCartStore((state) => state.addItem);
  const { t, locale, translations } = useI18n();
  const [vacuumWeight, setVacuumWeight] = useState<VacuumWeight>(DEFAULT_VACUUM_WEIGHT);
  const vacuumLabel = localizeProduct(vacuumProduct, locale);

  const addVacuum = () => {
    addItem(vacuumProduct, 1, { selectedWeightGrams: vacuumWeight, unitPriceOverride: getVacuumMorelPrice(vacuumWeight) });
    toast.success(t("products.addedToCart"), {
      description: `${vacuumLabel.name} · ${formatGrams(vacuumWeight)}`,
      position: "top-center",
    });
  };

  const addSmallFormat = (product: Product) => {
    addItem(product);
    toast.success(t("products.addedToCart"), { description: localizeProduct(product, locale).name, position: "top-center" });
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

        {/* Sous vide : format mis en avant */}
        <ScrollReveal>
          <div className="max-w-6xl mx-auto border border-primary/40 rounded-sm bg-background/60 shadow-gold overflow-hidden grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="relative aspect-[4/3] lg:aspect-auto">
              <img
                src={vacuumProduct.image}
                alt={vacuumLabel.name}
                width={600}
                height={900}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-medium tracking-widest uppercase rounded-sm">
                {t("vacuum.label")}
              </span>
            </div>
            <div className="p-6 md:p-10">
              <h3 className="font-serif text-3xl md:text-4xl font-light mb-3">
                {t("vacuum.title")} <span className="italic text-gradient-gold">{t("vacuum.titleHighlight")}</span>
              </h3>
              <p className="text-sm text-foreground/85 font-light leading-relaxed mb-4">{t("vacuum.intro")}</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mb-6">
                {translations.vacuum.facts.map((fact) => (
                  <li key={fact} className="flex items-center gap-1.5 text-xs text-foreground/80">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    {fact}
                  </li>
                ))}
              </ul>

              <VacuumFormatPicker value={vacuumWeight} onChange={setVacuumWeight} columns={4} />

              <div className="mt-6 flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="sm:flex-1">
                  <p className="font-serif text-3xl text-gradient-gold">
                    {formatEurosLocale(getVacuumMorelPrice(vacuumWeight) * 100, locale)}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t("products.netPrice")}</p>
                </div>
                <button
                  type="button"
                  onClick={addVacuum}
                  disabled={!vacuumProduct.inStock}
                  className="sm:flex-1 py-4 px-6 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-xs hover:bg-gold-light transition-colors duration-300 rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {fill(t("vacuum.add"), { format: formatGrams(vacuumWeight) })}
                </button>
              </div>

              <div className="mt-6 pt-5 border-t border-gold/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-foreground/85">
                  <span className="font-medium text-foreground">{t("vacuum.proTitle")}</span> {t("vacuum.proText")}
                </p>
                <Link
                  to="/professionnels"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-gold-light font-medium whitespace-nowrap"
                >
                  {t("vacuum.proCta")} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <Link
                to={`/produits/${vacuumProduct.slug}`}
                className="mt-4 inline-block text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {t("products.viewDetail")}
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Petits formats */}
        <ScrollReveal>
          <div className="text-center mt-20 mb-10">
            <h3 className="font-serif text-2xl md:text-3xl font-light">{t("vacuum.smallFormats")}</h3>
            <p className="text-sm text-muted-foreground font-light mt-2">{t("vacuum.smallFormatsIntro")}</p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {smallFormats.map((product, i) => {
            const label = localizeProduct(product, locale);
            const grams = fixedProductGrams(product);

            return (
              <ScrollReveal key={product.id} delay={i * 0.1} direction="up">
                <div className="relative border border-gold/15 rounded-sm bg-background/50 hover:border-gold/40 hover:shadow-gold hover:-translate-y-1.5 transition-all duration-500 group overflow-hidden h-full flex flex-col">
                  {label.badge && (
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-medium tracking-widest uppercase rounded-sm">
                      {label.badge}
                    </div>
                  )}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={label.name}
                      width={600}
                      height={900}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="font-serif text-lg mb-1">{label.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{label.servings}</p>
                    <div className="mb-3">
                      <p className="font-serif text-2xl text-gradient-gold">{formatEurosLocale(product.price * 100, locale)}</p>
                      {grams && (
                        <p className="text-[11px] text-muted-foreground">
                          {fill(t("vacuum.perKg"), { price: formatEurosLocale(Math.round(pricePerKg(product.price, grams) * 100), locale) })}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-0.5">{t("products.netPrice")}</p>
                    </div>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed mb-3 line-clamp-2">{label.description}</p>

                    <Link
                      to={`/produits/${product.slug}`}
                      className="text-xs text-primary hover:text-gold-light transition-colors font-medium mb-4 inline-block"
                    >
                      {t("products.viewDetail")}
                    </Link>

                    <button
                      type="button"
                      onClick={() => addSmallFormat(product)}
                      disabled={!product.inStock}
                      className="mt-auto w-full py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-xs hover:bg-gold-light transition-colors duration-300 rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
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
            <Link
              to="/professionnels"
              className="inline-block px-10 py-4 border border-primary/40 text-foreground font-light tracking-widest uppercase text-sm hover:border-primary hover:text-primary transition-colors duration-300 rounded-sm"
            >
              {t("products.bulkCta")}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProductsSection;
