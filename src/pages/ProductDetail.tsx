import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { breadcrumbSchema, productSchema } from "@/lib/seo/schema";
import { productMetaDescription, productMetaTitle } from "@/lib/seo/meta";
import { toast } from "sonner";
import { ShoppingCart, ArrowLeft, ArrowRight, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  DEFAULT_VACUUM_WEIGHT,
  fixedProductGrams,
  formatGrams,
  getProductBySlug,
  getVacuumMorelPrice,
  localizeProduct,
  pricePerKg,
  products,
  vacuumSaving,
  type VacuumWeight,
} from "@/lib/products";
import { formatEurosLocale } from "@/lib/proPricing";
import VacuumFormatPicker, { fill } from "@/components/VacuumFormatPicker";
import { useI18n } from "@/i18n/context";
import { getProductPageContent } from "@/lib/productDetails";
import { useCartStore } from "@/stores/cartStore";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const { t, locale } = useI18n();

  const product = slug ? getProductBySlug(slug) : undefined;
  // `detail` (FR) alimente les balises head et le JSON-LD ; `view` est le contenu affiché dans la langue choisie.
  const detail = product ? getProductPageContent(product.id) : undefined;
  const view = product ? getProductPageContent(product.id, locale) : undefined;

  const isVacuum = product?.id === "morilles-sous-vide";
  const [vacuumWeight, setVacuumWeight] = useState<VacuumWeight>(DEFAULT_VACUUM_WEIGHT);
  const [rehydrationOpen, setRehydrationOpen] = useState(false);

  if (!product || !detail || !view) {
    return (
      <div className="min-h-screen bg-background">
        <Seo title="Produit introuvable | Morilles du Canada" robots="noindex, follow" />
        <Navbar />
        <main className="pt-32 pb-24 text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">{t("productPage.notFound")}</h1>
          <Link to="/produits" className="text-primary hover:text-gold-light transition-colors">
            {t("productPage.backToProducts")}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const currentPrice = isVacuum ? getVacuumMorelPrice(vacuumWeight) : product.price;
  const label = localizeProduct(product, locale);
  const currentGrams = isVacuum ? vacuumWeight : fixedProductGrams(product);
  const fixedGrams = fixedProductGrams(product);
  const upsell = fixedGrams ? vacuumSaving(DEFAULT_VACUUM_WEIGHT, { grams: fixedGrams, price: product.price }) : null;

  const handleAddToCart = () => {
    if (isVacuum) {
      addItem(product, 1, { selectedWeightGrams: vacuumWeight, unitPriceOverride: currentPrice });
      toast.success(t("products.addedToCart"), {
        description: `${label.name} · ${formatGrams(vacuumWeight)}`,
        position: "top-center",
      });
    } else {
      addItem(product);
      toast.success(t("products.addedToCart"), {
        description: label.name,
        position: "top-center",
      });
    }
  };

  const relatedProducts = products.filter((p) =>
    detail.relatedProductIds.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={productMetaTitle(product)}
        description={productMetaDescription(product)}
        path={`/produits/${product.slug}`}
        type="product"
        preloadImage={product.image}
        jsonLd={[
          productSchema(product, detail.longDescription[0]),
          breadcrumbSchema([
            { name: "Produits", path: "/produits" },
            { name: product.name, path: `/produits/${product.slug}` },
          ]),
        ]}
      />

      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <Link
            to="/produits"
            className="text-sm text-primary hover:text-gold-light transition-colors mb-8 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("productPage.back")}
          </Link>

          {/* Hero grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Image */}
            <ScrollReveal direction="left">
              <div className="relative aspect-square rounded-sm overflow-hidden border border-gold/15">
                <img
                  src={product.image}
                  alt={label.name}
                  width={600}
                  height={900}
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
                {label.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-medium tracking-widest uppercase rounded-sm">
                    {label.badge}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Info & buy */}
            <ScrollReveal direction="right">
              <div className="flex flex-col h-full justify-center">
                <h1 className="font-serif text-3xl md:text-4xl font-light mb-3 leading-tight">
                  <span className="block font-normal text-xs tracking-[0.3em] uppercase text-primary mb-3" style={{ fontFamily: "Raleway, sans-serif" }}>
                    {t("productPage.eyebrow")}
                  </span>{" "}
                  {label.name}
                </h1>
                <p className="text-secondary-foreground/70 font-light mb-6 leading-relaxed">
                  {view.tagline}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <p className="font-serif text-4xl text-gradient-gold">
                    {currentPrice.toFixed(2)} €
                  </p>
                  {currentGrams && (
                    <p className="text-sm text-foreground/80 mt-1">
                      {fill(t("vacuum.perKg"), { price: formatEurosLocale(Math.round(pricePerKg(currentPrice, currentGrams) * 100), locale) })}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{t("products.netPrice")}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label.servings}</p>
                </div>

                {isVacuum && (
                  <div className="mb-6">
                    <VacuumFormatPicker value={vacuumWeight} onChange={setVacuumWeight} />
                  </div>
                )}

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isVacuum ? fill(t("vacuum.add"), { format: formatGrams(vacuumWeight) }) : t("products.addToCart")}
                </button>
                <p className="text-[10px] text-muted-foreground text-center font-light">
                  {t("productPage.reassurance")}
                </p>

                {isVacuum ? (
                  <div className="mt-6 p-4 border border-primary/30 rounded-sm bg-primary/5 text-sm">
                    <p className="text-foreground/85">
                      <span className="font-medium text-foreground">{t("vacuum.proTitle")}</span> {t("vacuum.proText")}
                    </p>
                    <Link
                      to="/professionnels"
                      className="mt-2 inline-flex items-center gap-1.5 text-primary hover:text-gold-light font-medium"
                    >
                      {t("vacuum.proCta")} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  upsell && (
                    <div className="mt-6 p-4 border border-primary/30 rounded-sm bg-primary/5 text-sm">
                      <p className="font-medium text-foreground mb-1">{t("vacuum.upsellTitle")}</p>
                      <p className="text-foreground/85">
                        {fill(t("vacuum.upsell"), {
                          format: formatGrams(DEFAULT_VACUUM_WEIGHT),
                          perKg: fill(t("vacuum.perKg"), { price: formatEurosLocale(Math.round(upsell.perKg * 100), locale) }),
                          percent: upsell.percent,
                        })}
                      </p>
                      <Link
                        to="/produits/morilles-sous-vide"
                        className="mt-2 inline-flex items-center gap-1.5 text-primary hover:text-gold-light font-medium"
                      >
                        {t("vacuum.upsellCta")} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )
                )}

                {/* Quick highlights */}
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {view.highlights.slice(0, 4).map((h) => (
                    <div key={h.label} className="p-3 border border-gold/10 rounded-sm bg-card">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{h.label}</p>
                      <p className="text-sm text-foreground font-medium">{h.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Long description */}
          <ScrollReveal>
            <div className="mb-16 max-w-3xl">
              <h2 className="font-serif text-2xl text-foreground mb-6">{t("productPage.about")}</h2>
              <div className="space-y-5">
                {view.longDescription.map((para, i) => (
                  <p key={i} className="text-secondary-foreground/80 font-light leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Ideal for */}
          <ScrollReveal>
            <div className="mb-16">
              <h2 className="font-serif text-2xl text-foreground mb-6">{t("productPage.idealFor")}</h2>
              <ul className="space-y-3">
                {view.idealFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-secondary-foreground/80 font-light leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Rehydration guide — accordion */}
          <ScrollReveal>
            <div className="mb-16 border border-gold/15 rounded-sm overflow-hidden">
              <button
                onClick={() => setRehydrationOpen((v) => !v)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-card/50 transition-colors"
              >
                <div>
                  <p className="font-serif text-lg text-foreground">{t("productPage.rehydrationTitle")}</p>
                  <p className="text-xs text-muted-foreground font-light mt-0.5">
                    {t("productPage.rehydrationSubtitle")}
                  </p>
                </div>
                {rehydrationOpen ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </button>
              {rehydrationOpen && (
                <div className="px-6 pb-6 border-t border-gold/10">
                  <ol className="space-y-4 mt-4">
                    {view.rehydrationGuide.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">
                          {i + 1}
                        </div>
                        <p className="text-sm text-secondary-foreground/80 font-light leading-relaxed pt-0.5">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/15 rounded-sm">
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      <span className="font-medium text-primary">{t("productPage.conservationAfterOpening")}</span>
                      {view.conservation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* All highlights */}
          <ScrollReveal>
            <div className="mb-16">
              <h2 className="font-serif text-2xl text-foreground mb-6">{t("productPage.specs")}</h2>
              <div className="border border-gold/15 rounded-sm overflow-hidden">
                {view.highlights.map((h, i) => (
                  <div
                    key={h.label}
                    className={`flex items-center justify-between px-6 py-4 ${
                      i !== view.highlights.length - 1 ? "border-b border-gold/10" : ""
                    }`}
                  >
                    <span className="text-sm text-muted-foreground font-light">{h.label}</span>
                    <span className="text-sm text-foreground font-medium text-right max-w-xs">{h.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <ScrollReveal>
              <div className="mb-16">
                <h2 className="font-serif text-2xl text-foreground mb-6">{t("productPage.related")}</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {relatedProducts.map((rp) => {
                    const rpLabel = localizeProduct(rp, locale);
                    return (
                    <Link
                      key={rp.id}
                      to={`/produits/${rp.slug}`}
                      className="group flex gap-4 p-5 border border-gold/15 rounded-sm hover:border-gold/40 hover:shadow-gold transition-all duration-300"
                    >
                      <div className="w-20 h-20 rounded-sm overflow-hidden flex-shrink-0">
                        <img
                          src={rp.image}
                          alt={rpLabel.name}
                          width={600}
                          height={900}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base text-foreground group-hover:text-primary transition-colors mb-1">
                          {rpLabel.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-light mb-2">{rpLabel.servings}</p>
                        <p className="font-serif text-lg text-gradient-gold">
                          {rp.id === "morilles-sous-vide"
                            ? t("productPage.from").replace("{price}", `${getVacuumMorelPrice(100)} €`)
                            : `${rp.price.toFixed(2)} €`}
                        </p>
                      </div>
                    </Link>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* CTA recettes */}
          <ScrollReveal>
            <div className="text-center bg-card border border-border rounded-sm p-10">
              <p className="font-serif text-2xl text-foreground mb-3">
                {t("productPage.recipesTitle")}
              </p>
              <p className="text-sm text-muted-foreground mb-6 font-light">
                {t("productPage.recipesText")}
              </p>
              <Link
                to="/recettes"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors rounded-sm"
              >
                {t("productPage.recipesCta")}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
