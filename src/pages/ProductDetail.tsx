import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { ShoppingCart, ArrowLeft, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getProductBySlug, getVacuumMorelPrice, products } from "@/lib/products";
import { getProductPageContent } from "@/lib/productDetails";
import { useCartStore } from "@/stores/cartStore";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const addItem = useCartStore((state) => state.addItem);

  const product = slug ? getProductBySlug(slug) : undefined;
  const detail = product ? getProductPageContent(product.id) : undefined;

  const isVacuum = product?.id === "morilles-sous-vide";
  const [vacuumWeight, setVacuumWeight] = useState<100 | 200 | 500 | 1000>(100);
  const [rehydrationOpen, setRehydrationOpen] = useState(false);

  if (!product || !detail) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-24 text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">Produit introuvable</h1>
          <Link to="/produits" className="text-primary hover:text-gold-light transition-colors">
            ← Retour aux produits
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const currentPrice = isVacuum ? getVacuumMorelPrice(vacuumWeight) : product.price;

  const handleAddToCart = () => {
    if (isVacuum) {
      addItem(product, 1, { selectedWeightGrams: vacuumWeight, unitPriceOverride: currentPrice });
      toast.success("Ajouté au panier", {
        description: `${product.name} · ${vacuumWeight}g`,
        position: "top-center",
      });
    } else {
      addItem(product);
      toast.success("Ajouté au panier", {
        description: product.name,
        position: "top-center",
      });
    }
  };

  const relatedProducts = products.filter((p) =>
    detail.relatedProductIds.includes(p.id)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: detail.longDescription[0],
    image: `https://www.morillesducanada.com${product.image}`,
    brand: { "@type": "Brand", name: "Morilles du Canada" },
    offers: isVacuum
      ? ([100, 200, 500, 1000] as const).map((g) => ({
          "@type": "Offer",
          price: getVacuumMorelPrice(g).toFixed(2),
          priceCurrency: "EUR",
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          name: `${product.name} ${g >= 1000 ? "1kg" : `${g}g`}`,
          url: `https://www.morillesducanada.com/produits/${product.slug}`,
        }))
      : {
          "@type": "Offer",
          price: product.price.toFixed(2),
          priceCurrency: "EUR",
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `https://www.morillesducanada.com/produits/${product.slug}`,
        },
    additionalProperty: detail.highlights.map((h) => ({
      "@type": "PropertyValue",
      name: h.label,
      value: h.value,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{product.name} — Morilles de feu séchées | Morilles du Canada</title>
        <meta
          name="description"
          content={`${detail.tagline} ${detail.longDescription[0].slice(0, 120)}…`}
        />
        <link rel="canonical" href={`https://www.morillesducanada.com/produits/${product.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <Link
            to="/produits"
            className="text-sm text-primary hover:text-gold-light transition-colors mb-8 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Tous les produits
          </Link>

          {/* Hero grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Image */}
            <ScrollReveal direction="left">
              <div className="relative aspect-square rounded-sm overflow-hidden border border-gold/15">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-medium tracking-widest uppercase rounded-sm">
                    {product.badge}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Info & buy */}
            <ScrollReveal direction="right">
              <div className="flex flex-col h-full justify-center">
                <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">
                  Morilles de feu séchées
                </p>
                <h1 className="font-serif text-3xl md:text-4xl font-light mb-3 leading-tight">
                  {product.name}
                </h1>
                <p className="text-secondary-foreground/70 font-light mb-6 leading-relaxed">
                  {detail.tagline}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <p className="font-serif text-4xl text-gradient-gold">
                    {currentPrice.toFixed(2)} €
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{product.servings}</p>
                </div>

                {/* Vacuum weight selector */}
                {isVacuum && (
                  <div className="mb-6">
                    <label className="block text-xs text-muted-foreground mb-2 tracking-wider uppercase">
                      Choisir le format
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {([100, 200, 500, 1000] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() => setVacuumWeight(g)}
                          className={`py-3 border rounded-sm text-xs transition-all duration-200 ${
                            vacuumWeight === g
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-gold/20 bg-secondary/20 text-muted-foreground hover:border-gold/40"
                          }`}
                        >
                          <span className="font-serif block">{g >= 1000 ? "1kg" : `${g}g`}</span>
                          <span className="text-primary font-medium">{getVacuumMorelPrice(g)} €</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Ajouter au panier
                </button>
                <p className="text-[10px] text-muted-foreground text-center font-light">
                  Paiement sécurisé · Livraison France &amp; Europe · 24h–72h
                </p>

                {/* Quick highlights */}
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {detail.highlights.slice(0, 4).map((h) => (
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
              <h2 className="font-serif text-2xl text-foreground mb-6">À propos de ce format</h2>
              <div className="space-y-5">
                {detail.longDescription.map((para, i) => (
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
              <h2 className="font-serif text-2xl text-foreground mb-6">Ce format est fait pour vous si…</h2>
              <ul className="space-y-3">
                {detail.idealFor.map((item, i) => (
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
                  <p className="font-serif text-lg text-foreground">Guide de réhydratation et de cuisson</p>
                  <p className="text-xs text-muted-foreground font-light mt-0.5">
                    Comment libérer les arômes de la morille de feu
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
                    {detail.rehydrationGuide.map((step, i) => (
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
                      <span className="font-medium text-primary">Conservation après ouverture : </span>
                      {detail.conservation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* All highlights */}
          <ScrollReveal>
            <div className="mb-16">
              <h2 className="font-serif text-2xl text-foreground mb-6">Caractéristiques</h2>
              <div className="border border-gold/15 rounded-sm overflow-hidden">
                {detail.highlights.map((h, i) => (
                  <div
                    key={h.label}
                    className={`flex items-center justify-between px-6 py-4 ${
                      i !== detail.highlights.length - 1 ? "border-b border-gold/10" : ""
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
                <h2 className="font-serif text-2xl text-foreground mb-6">Autres formats disponibles</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {relatedProducts.map((rp) => (
                    <Link
                      key={rp.id}
                      to={`/produits/${rp.slug}`}
                      className="group flex gap-4 p-5 border border-gold/15 rounded-sm hover:border-gold/40 hover:shadow-gold transition-all duration-300"
                    >
                      <div className="w-20 h-20 rounded-sm overflow-hidden flex-shrink-0">
                        <img
                          src={rp.image}
                          alt={rp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base text-foreground group-hover:text-primary transition-colors mb-1">
                          {rp.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-light mb-2">{rp.servings}</p>
                        <p className="font-serif text-lg text-gradient-gold">
                          {rp.id === "morilles-sous-vide"
                            ? `dès ${getVacuumMorelPrice(100)} €`
                            : `${rp.price.toFixed(2)} €`}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* CTA recettes */}
          <ScrollReveal>
            <div className="text-center bg-card border border-border rounded-sm p-10">
              <p className="font-serif text-2xl text-foreground mb-3">
                Comment cuisiner ce format ?
              </p>
              <p className="text-sm text-muted-foreground mb-6 font-light">
                Découvrez nos recettes développées pour sublimer les morilles de feu — risotto, velouté, sauce forestière, fondue et plus encore.
              </p>
              <Link
                to="/recettes"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors rounded-sm"
              >
                Voir les recettes
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
