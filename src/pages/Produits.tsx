import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { products, getVacuumMorelPrice, localizeProduct } from "@/lib/products";
import { useI18n } from "@/i18n/context";
import { ArrowRight } from "lucide-react";

const Produits = () => {
  const { t, locale } = useI18n();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Morilles de feu séchées — Morilles du Canada",
    description: "Sélection de morilles de feu séchées récoltées au Canada après feux de forêt naturels. Formats particulier et professionnel.",
    url: "https://www.morillesducanada.com/produits",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.morillesducanada.com/produits/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Morilles de feu séchées — Tous les formats | Morilles du Canada</title>
        <meta
          name="description"
          content="Morilles de feu sauvages séchées du Canada. Formats 12g, 30g, 45g et sous vide professionnel 100g–1kg. Livraison France et Europe."
        />
        <link rel="canonical" href="https://www.morillesducanada.com/produits" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

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
            {products.map((product, i) => {
              const isVacuum = product.id === "morilles-sous-vide";
              const label = localizeProduct(product, locale);
              const displayPrice = isVacuum
                ? t("productPage.from").replace("{price}", `${getVacuumMorelPrice(100)} €`)
                : `${product.price.toFixed(2)} €`;

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
                        loading="lazy"
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
                      <p className="font-serif text-2xl text-gradient-gold mb-3">{displayPrice}</p>
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
              <a
                href="/#contact"
                className="inline-block px-8 py-3 border border-primary/40 text-foreground font-medium tracking-widest uppercase text-sm hover:border-primary hover:text-primary transition-colors rounded-sm"
              >
                {t("productsPage.bulkCta")}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Produits;
