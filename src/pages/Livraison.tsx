import Seo from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Package, MapPin, ShieldCheck, Truck, RotateCcw, Thermometer, HelpCircle } from "lucide-react";
import { SHIPPING_ZONES } from "@/lib/products";
import { formatEurosLocale } from "@/lib/proPricing";
import ScrollReveal from "@/components/ScrollReveal";

// Tarifs issus du catalogue serveur (create-checkout) : une seule source de vérité.
const euros = (cents: number) => formatEurosLocale(cents, "fr");

const deliveryZones = [
  {
    zone: "France métropolitaine",
    price: `${euros(SHIPPING_ZONES.FR.amountCents)} · offerts dès ${euros(SHIPPING_ZONES.FR.freeFromCents)} d'achats`,
  },
  {
    zone: "Union européenne (particuliers)",
    price: `${euros(SHIPPING_ZONES.EU.amountCents)} · offerts dès ${euros(SHIPPING_ZONES.EU.freeFromCents)} d'achats`,
  },
];

const commitments = [
  {
    icon: Package,
    title: "Stock en France",
    description:
      "Les morilles sont stockées en France : votre commande est préparée et expédiée sous 5 jours ouvrés après la confirmation du paiement.",
  },
  {
    icon: Thermometer,
    title: "Produit séché, pas fragile",
    description:
      "Les morilles séchées ne demandent ni chaîne du froid ni emballage isotherme.",
  },
  {
    icon: ShieldCheck,
    title: "Colis suivi",
    description:
      "Chaque envoi dispose d'un numéro de suivi, transmis par email au moment de l'expédition.",
  },
  {
    icon: Truck,
    title: "Zone choisie au panier",
    description:
      "Vous choisissez France ou Union européenne dans le panier. Le paiement propose ensuite uniquement les pays de la zone choisie.",
  },
];

const faqItems = [
  {
    q: "Puis-je modifier mon adresse après commande ?",
    a: "Oui, contactez-nous dans l'heure suivant votre commande à contact@morillesducanada.com et nous ferons le nécessaire.",
  },
  {
    q: "Que faire si mon colis est endommagé ?",
    a: "Émettez des réserves auprès du transporteur à la réception et contactez-nous sous 48 heures avec des photos. Nous vous enverrons un nouveau colis.",
  },
  {
    q: "Livrez-vous hors de l'Union européenne ?",
    a: "Pas pour le moment : la boutique livre la France et les pays de l'Union européenne.",
  },
  {
    q: "La livraison est-elle vraiment offerte ?",
    a: `Oui : dès ${euros(SHIPPING_ZONES.FR.freeFromCents)} d'achats en France et dès ${euros(SHIPPING_ZONES.EU.freeFromCents)} dans l'Union européenne. Le montant affiché au panier est le montant final.`,
  },
  {
    q: "Et pour les professionnels ?",
    a: "Les commandes au kilo sont livrées en France, port inclus. Voir la page Professionnels.",
  },
];

const Livraison = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Livraison des morilles séchées et retours | Morilles du Canada"
        description="Livraison des morilles séchées en France (6,90 €, offerte dès 50 €) et dans l'Union européenne (9,90 €, offerte dès 100 €). Expédition sous 5 jours ouvrés depuis la France."
        path="/livraison"
        jsonLd={breadcrumbSchema([{ name: "Livraison et retours", path: "/livraison" }])}
      />
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link
            to="/"
            className="text-sm text-primary hover:text-gold-light transition-colors mb-8 inline-block"
          >
            ← Retour à l'accueil
          </Link>

          {/* Header */}
          <ScrollReveal>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-4">
              Livraison{" "}
              <span className="italic text-gradient-gold">& Retours</span>
            </h1>
            <p className="text-secondary-foreground/70 font-light text-lg max-w-2xl leading-relaxed">
              Stock en France, expédition sous 5 jours ouvrés, en France et
              dans l'Union européenne.
            </p>
            <div className="divider-gold w-24 mt-6 mb-16" />
          </ScrollReveal>

          {/* Delivery Zones */}
          <ScrollReveal>
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                  Zones & délais de livraison
                </h2>
              </div>
              <div className="grid gap-4">
                {deliveryZones.map((zone) => (
                  <div
                    key={zone.zone}
                    className="bg-card border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">
                        {zone.zone}
                      </h3>
                      <p className="text-sm text-primary font-medium mt-1">
                        {zone.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Prix nets — TVA non applicable, art. 293 B du CGI. Les commandes sont expédiées sous 5 jours ouvrés après la confirmation du paiement ; vous recevez un email avec le numéro de suivi dès l'expédition.
              </p>
            </div>
          </ScrollReveal>

          {/* Commitments */}
          <ScrollReveal>
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                  Nos engagements
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {commitments.map((item) => (
                  <div
                    key={item.title}
                    className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors group"
                  >
                    <item.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-serif text-lg text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-secondary-foreground/70 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Returns Policy */}
          <ScrollReveal>
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <RotateCcw className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                  Politique de retours
                </h2>
              </div>
              <div className="bg-card border border-border rounded-lg p-8 space-y-6">
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-2">
                    Denrées alimentaires
                  </h3>
                  <p className="text-sm text-secondary-foreground/70 font-light leading-relaxed">
                    Conformément à l'article L221-28 du Code de la consommation,
                    le droit de rétractation ne s'applique pas aux denrées
                    alimentaires périssables ou susceptibles de se détériorer
                    rapidement. Nos morilles séchées, bien que très stables,
                    entrent dans cette catégorie légale.
                  </p>
                </div>
                <div className="divider-gold" />
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-2">
                    Produit non conforme ou endommagé
                  </h3>
                  <p className="text-sm text-secondary-foreground/70 font-light leading-relaxed">
                    Si vous constatez un défaut ou une non-conformité à la
                    réception de votre commande, contactez-nous sous{" "}
                    <strong className="text-foreground">14 jours</strong> à{" "}
                    <a
                      href="mailto:contact@morillesducanada.com"
                      className="text-primary hover:text-gold-light transition-colors"
                    >
                      contact@morillesducanada.com
                    </a>{" "}
                    avec des photos du produit et de l'emballage. Nous vous
                    proposerons un renvoi ou un remboursement intégral.
                  </p>
                </div>
                <div className="divider-gold" />
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-2">
                    Notre engagement qualité
                  </h3>
                  <p className="text-sm text-secondary-foreground/70 font-light leading-relaxed">
                    Si vous n'êtes pas satisfait de la qualité de vos morilles,
                    écrivez-nous : nous étudierons chaque demande avec attention.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* FAQ */}
          <ScrollReveal>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                  Questions fréquentes
                </h2>
              </div>
              <div className="space-y-4">
                {faqItems.map((item) => (
                  <div
                    key={item.q}
                    className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors"
                  >
                    <h3 className="font-medium text-foreground mb-2">
                      {item.q}
                    </h3>
                    <p className="text-sm text-secondary-foreground/70 font-light leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal>
            <div className="text-center bg-card border border-border rounded-lg p-10">
              <p className="font-serif text-2xl text-foreground mb-3">
                Une question sur votre commande ?
              </p>
              <p className="text-sm text-muted-foreground mb-6 font-light">
                Écrivez-nous, nous vous répondons personnellement.
              </p>
              <a
                href="mailto:contact@morillesducanada.com"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors rounded-sm"
              >
                Nous contacter
              </a>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Livraison;
