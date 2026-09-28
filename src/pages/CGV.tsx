import Seo from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { SHIPPING_ZONES } from "@/lib/products";
import { PREORDER_2027 } from "@/lib/preorder";
import { formatEurosLocale } from "@/lib/proPricing";

const eur = (cents: number) => formatEurosLocale(cents, "fr");

const CGV = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Conditions générales de vente | Morilles du Canada"
        description="Conditions générales de vente de Morilles du Canada : prix nets (TVA non applicable, art. 293 B du CGI), frais de port France et Union européenne, précommande, paiement, rétractation et réclamations."
        path="/cgv"
        jsonLd={breadcrumbSchema([{ name: "CGV", path: "/cgv" }])}
      />
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link to="/" className="text-sm text-primary hover:text-gold-light transition-colors mb-8 inline-block">
            ← Retour à l'accueil
          </Link>

          <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">
            Conditions générales <span className="italic text-gradient-gold">de vente</span>
          </h1>
          <div className="divider-gold w-24 mt-6 mb-12" />

          <div className="space-y-10 text-sm text-secondary-foreground/80 font-light leading-relaxed">
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 1 — Objet</h2>
              <p>
                Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre le vendeur, Valérian Vilane, entrepreneur individuel (micro-entreprise), SIRET 802 861 948 00023, 448 chemin de Patin, 84810 Aubignan, France, et tout acheteur (ci-après « le Client ») passant commande sur le site <strong className="text-foreground">morillesducanada.com</strong>.
              </p>
              <p className="mt-2">
                Toute commande implique l'acceptation pleine et entière des présentes CGV.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 2 — Produits</h2>
              <p>
                Les produits proposés à la vente sont des morilles sauvages du Canada, cueillies à la main sur des forêts brûlées l'année précédente, séchées, vendues entières et équeutées, en variétés mélangées. Les photographies et descriptions sont aussi fidèles que possible mais ne constituent pas un engagement contractuel. Les morilles étant un produit naturel, de légères variations de taille, de forme et de couleur sont possibles.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 3 — Prix</h2>
              <p>
                Les prix sont indiqués en euros (€). <strong className="text-foreground">Prix nets — TVA non applicable, art. 293 B du CGI.</strong> Le vendeur bénéficie de la franchise en base de TVA : aucune TVA n'est facturée ni récupérable.
              </p>
              <p className="mt-2">
                Frais de port pour les particuliers : France, {eur(SHIPPING_ZONES.FR.amountCents)}, offerts dès {eur(SHIPPING_ZONES.FR.freeFromCents)} d'achats ; Union européenne, {eur(SHIPPING_ZONES.EU.amountCents)}, offerts dès {eur(SHIPPING_ZONES.EU.freeFromCents)} d'achats. Les frais de port sont indiqués au panier avant la validation de la commande. Les commandes professionnelles au kilo sont livrées en France, port inclus.
              </p>
              <p className="mt-2">
                Le vendeur se réserve le droit de modifier ses prix à tout moment ; les produits sont facturés au prix en vigueur au moment de la commande.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 4 — Commande</h2>
              <p>
                Le Client passe commande via le site internet. La commande est confirmée par l'envoi d'un email de confirmation. Le vendeur se réserve le droit de refuser ou d'annuler toute commande en cas de problème de stock, d'anomalie ou de litige avec le Client.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 5 — Paiement</h2>
              <p>
                Le paiement s'effectue en ligne par carte bancaire via la plateforme de paiement sécurisée Stripe. Le paiement est débité au moment de la commande. Toutes les transactions sont sécurisées et chiffrées.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 6 — Livraison</h2>
              <p>
                Les produits sont expédiés en France métropolitaine et dans les pays de l'Union européenne. Le Client choisit la zone de livraison (France ou Union européenne) dans le panier ; seule une adresse située dans la zone choisie peut être saisie au paiement. Les commandes sont expédiées sous 5 jours ouvrés après la confirmation du paiement. Le vendeur ne saurait être tenu responsable des retards imputables au transporteur.
              </p>
              <p className="mt-2">
                Les produits sont envoyés en colis suivi. En cas de colis endommagé à la réception, le Client doit émettre des réserves auprès du transporteur et nous contacter dans les 48 heures.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 6 bis — Précommande saison {PREORDER_2027.season}</h2>
              <p>
                La précommande porte sur des morilles de la saison {PREORDER_2027.season}, au prix de {eur(PREORDER_2027.pricePerKgCents)} le kilo, de {PREORDER_2027.minKg} à {PREORDER_2027.maxKg} kg par précommande, par kilo entier. Elle est ouverte aux particuliers et aux professionnels.
              </p>
              <p className="mt-2">
                Un acompte de 50 %, soit {eur(PREORDER_2027.depositPerKgCents)} par kilo, est payé en ligne à la commande. Le solde est facturé avant l'expédition. La livraison est garantie en {PREORDER_2027.delivery.fr}, en France ou dans l'Union européenne.
              </p>
              <p className="mt-2">
                S'il est impossible au vendeur de fournir tout ou partie de la quantité précommandée, l'acompte correspondant est intégralement remboursé.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 7 — Droit de rétractation</h2>
              <p>
                Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les denrées alimentaires périssables ou susceptibles de se détériorer rapidement.
              </p>
              <p className="mt-2">
                Toutefois, si le produit reçu est défectueux ou non conforme à la commande, le Client peut nous contacter dans les 14 jours suivant la réception pour obtenir un échange ou un remboursement.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 8 — Garantie et responsabilité</h2>
              <p>
                Le vendeur garantit la conformité des produits aux réglementations sanitaires françaises et européennes en vigueur. Les morilles séchées doivent être conservées dans un endroit sec, à l'abri de la lumière. Le vendeur décline toute responsabilité en cas de mauvaise conservation par le Client.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 9 — Réclamations</h2>
              <p>
                Toute réclamation doit être adressée par email à <strong className="text-foreground">contact@morillesducanada.com</strong> dans un délai de 14 jours suivant la réception du produit, accompagnée de photos le cas échéant.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 10 — Médiation</h2>
              <p>
                En cas de litige non résolu à l'amiable, le Client peut recourir gratuitement au service de médiation de la consommation. Conformément à l'article L612-1 du Code de la consommation, le médiateur compétent est : [Nom du médiateur / plateforme de médiation].
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 11 — Droit applicable</h2>
              <p>
                Les présentes CGV sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents du ressort du siège social du vendeur.
              </p>
            </section>

            <p className="pt-6 border-t border-gold/10 text-xs text-muted-foreground">
              Dernière mise à jour : septembre 2026
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CGV;
