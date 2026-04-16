import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Package, Clock, MapPin, ShieldCheck, Truck, RotateCcw, Thermometer, HelpCircle } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const deliveryZones = [
  {
    zone: "France métropolitaine",
    delay: "3 à 5 jours ouvrés",
    price: "Offerts dès 50 € · Sinon 6,90 €",
    icon: "🇫🇷",
  },
  {
    zone: "Belgique & Luxembourg",
    delay: "4 à 7 jours ouvrés",
    price: "Offerts dès 80 € · Sinon 9,90 €",
    icon: "🇧🇪",
  },
  {
    zone: "Suisse",
    delay: "5 à 8 jours ouvrés",
    price: "Offerts dès 100 € · Sinon 12,90 €",
    icon: "🇨🇭",
  },
  {
    zone: "Union Européenne",
    delay: "5 à 10 jours ouvrés",
    price: "Offerts dès 100 € · Sinon 12,90 €",
    icon: "🇪🇺",
  },
];

const commitments = [
  {
    icon: Package,
    title: "Conditionnement soigné",
    description:
      "Chaque pot est emballé individuellement dans du papier de soie et calé dans un carton renforcé pour éviter tout choc pendant le transport.",
  },
  {
    icon: Thermometer,
    title: "Produit séché, pas fragile",
    description:
      "Nos morilles sont séchées naturellement. Elles ne nécessitent ni chaîne du froid ni conditionnement isotherme, et conservent toute leur qualité pendant le transport.",
  },
  {
    icon: ShieldCheck,
    title: "Colis suivi & assuré",
    description:
      "Chaque envoi dispose d'un numéro de suivi. Vous êtes informé par email à chaque étape : préparation, expédition, livraison.",
  },
  {
    icon: Truck,
    title: "Transporteur de confiance",
    description:
      "Nous travaillons avec Colissimo et Chronopost pour la France, et DHL / La Poste pour l'international, garantissant fiabilité et rapidité.",
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
    q: "Livrez-vous hors Europe ?",
    a: "Pas pour le moment. Les réglementations douanières sur les denrées alimentaires rendent l'expédition complexe. Nous y travaillons.",
  },
  {
    q: "La livraison est-elle vraiment offerte ?",
    a: "Oui, à partir du montant indiqué pour chaque zone. Aucun frais caché, le montant affiché au panier est le montant final.",
  },
];

const Livraison = () => {
  return (
    <div className="min-h-screen bg-background">
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
              De la forêt boréale à votre cuisine : nous prenons soin de chaque
              commande comme si c'était la nôtre.
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
                    <span className="text-2xl">{zone.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">
                        {zone.zone}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {zone.delay}
                        </span>
                        <span className="text-sm text-primary font-medium">
                          {zone.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                * Délais indicatifs à compter de l'expédition. Les commandes sont préparées et expédiées dans les 2 à 5 jours ouvrés suivant la confirmation du paiement. Vous recevrez un email avec votre numéro de suivi dès l'expédition.
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
                    En tant qu'ancien cueilleur, je sélectionne personnellement
                    chaque lot. Si pour quelque raison que ce soit vous n'êtes
                    pas satisfait de la qualité de vos morilles, écrivez-nous.
                    Nous trouverons toujours une solution.
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
                Notre équipe vous répond sous 24 heures.
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
