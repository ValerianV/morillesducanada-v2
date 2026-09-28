import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { breadcrumbSchema, productListSchema } from "@/lib/seo/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  VACUUM_WEIGHTS,
  fixedProductGrams,
  getVacuumMorelPrice,
  localizeProduct,
  pricePerKg,
  products,
} from "@/lib/products";
import { formatEurosLocale } from "@/lib/proPricing";
import { fill } from "@/components/VacuumFormatPicker";
import { useI18n } from "@/i18n/context";
import { ArrowRight } from "lucide-react";

// Le sous vide (meilleur prix au kilo) en tête de la grille ; le JSON-LD garde l'ordre du catalogue.
const displayOrder = [...products].sort((a, b) => Number(Boolean(b.weightPriceIds)) - Number(Boolean(a.weightPriceIds)));
const bestVacuumPerKg = Math.min(...VACUUM_WEIGHTS.map((g) => pricePerKg(getVacuumMorelPrice(g), g)));

const TITLE = "Acheter des morilles séchées et sous vide | Morilles du Canada";
const DESCRIPTION =
  "Morilles séchées sauvages du Canada en formats 12 g, 30 g et 45 g, et morilles sous vide de 100 g à 1 kg. Entières, équeutées, expédiées sous 5 jours ouvrés.";

const Produits = () => {
  const { t, locale } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={TITLE}
        description={DESCRIPTION}
        path="/produits"
        jsonLd={[productListSchema(products), breadcrumbSchema([{ name: "Produits", path: "/produits" }])]}
      />

      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <Link to="/" className="text-sm text-primary hover:text-gold-light transition-colors mb-8 inline-block">
            {t("productsPage.backHome")}
          </Link>

          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">{t("productsPage.label")}</p>
              <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">
                {t("productsPage.title")}{" "}
                <span className="italic text-gradient-gold">{t("productsPage.titleHighlight")}</span>
              </h1>
              <p className="text-secondary-foreground/70 font-light text-lg max-w-2xl mx-auto leading-relaxed">
                {t("productsPage.intro")}
              </p>
              <div className="divider-gold w-24 mx-auto mt-6" />
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-8">
            {displayOrder.map((product, i) => {
              const isVacuum = product.id === "morilles-sous-vide";
              const label = localizeProduct(product, locale);
              const displayPrice = isVacuum
                ? t("productPage.from").replace("{price}", `${getVacuumMorelPrice(100)} €`)
                : `${product.price.toFixed(2)} €`;
              const grams = fixedProductGrams(product);
              const perKg = isVacuum
                ? fill(t("vacuum.from"), { price: formatEurosLocale(Math.round(bestVacuumPerKg * 100), locale) })
                : grams
                  ? fill(t("vacuum.perKg"), { price: formatEurosLocale(Math.round(pricePerKg(product.price, grams) * 100), locale) })
                  : null;

              return (
                <ScrollReveal key={product.id} delay={i * 0.1}>
                  <Link
                    to={`/produits/${product.slug}`}
                    className="group block border border-gold/15 rounded-sm bg-background/50 hover:border-gold/40 hover:shadow-gold transition-all duration-500 overflow-hidden h-full"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={product.image}
                        alt={label.name}
                        width={600}
                        height={900}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {label.badge && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-medium tracking-widest uppercase rounded-sm">
                          {label.badge}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h2 className="font-serif text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
                        {label.name}
                      </h2>
                      <p className="text-xs text-muted-foreground mb-3">{label.servings}</p>
                      <div className="mb-3">
                        <p className="font-serif text-2xl text-gradient-gold">{displayPrice}</p>
                        {perKg && <p className="text-xs text-muted-foreground mt-0.5">{perKg}</p>}
                        {isVacuum && <p className="text-xs font-medium text-gold-light mt-0.5">{t("vacuum.bestPerKg")}</p>}
                      </div>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-5 line-clamp-2">
                        {label.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                        <span className="text-xs text-primary font-medium tracking-wider uppercase">
                          {t("productsPage.viewProduct")}
                        </span>
                        <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-16 text-center border border-gold/15 rounded-sm p-10 bg-card">
              <p className="font-serif text-2xl text-foreground mb-3">
                {t("productsPage.bulkTitle")}
              </p>
              <p className="text-sm text-muted-foreground mb-6 font-light max-w-lg mx-auto">
                {t("productsPage.bulkText")}
              </p>
              <Link
                to="/professionnels"
                className="inline-block px-8 py-3 border border-primary/40 text-foreground font-medium tracking-widest uppercase text-sm hover:border-primary hover:text-primary transition-colors rounded-sm"
              >
                {t("productsPage.bulkCta")}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Produits;
