import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const CGV = () => {
  return (
    <div className="min-h-screen bg-background">
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
                Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre le vendeur, [Nom / Raison sociale], et tout acheteur (ci-après « le Client ») passant commande sur le site <strong className="text-foreground">morillesducanada.com</strong>.
              </p>
              <p className="mt-2">
                Toute commande implique l'acceptation pleine et entière des présentes CGV.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 2 — Produits</h2>
              <p>
                Les produits proposés à la vente sont des morilles de feu séchées, cueillies à la main dans les forêts boréales du Canada (Colombie-Britannique et Yukon). Les photographies et descriptions sont aussi fidèles que possible mais ne constituent pas un engagement contractuel. Les morilles étant un produit naturel, de légères variations de taille, de forme et de couleur sont possibles.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 3 — Prix</h2>
              <p>
                Les prix sont indiqués en euros (€) toutes taxes comprises (TTC). Les frais de livraison sont indiqués avant la validation de la commande. Le vendeur se réserve le droit de modifier ses prix à tout moment ; les produits seront facturés au prix en vigueur au moment de la commande.
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
                Le paiement s'effectue en ligne par carte bancaire via la plateforme sécurisée Shopify Payments. Le paiement est débité au moment de la commande. Toutes les transactions sont sécurisées et chiffrées.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 6 — Livraison</h2>
              <p>
                Les produits sont expédiés en France métropolitaine et dans l'Union Européenne. Les délais de livraison sont donnés à titre indicatif (généralement 3 à 7 jours ouvrés pour la France). Le vendeur ne saurait être tenu responsable des retards imputables au transporteur.
              </p>
              <p className="mt-2">
                Les produits sont conditionnés sous vide et envoyés en colis suivi. En cas de colis endommagé à la réception, le Client doit émettre des réserves auprès du transporteur et nous contacter dans les 48 heures.
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
                En cas de litige non résolu à l'amiable, le Client peut recourir gratuitement au service de médiation de la consommation. Conformément à l'article L612-1 du Code de la consommation, le médiateur compétent est : [Nom du médiateur / plateforme de médiation]. Le Client peut également utiliser la plateforme européenne de règlement en ligne des litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-gold-light transition-colors">ec.europa.eu/consumers/odr</a>.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">Article 11 — Droit applicable</h2>
              <p>
                Les présentes CGV sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents du ressort du siège social du vendeur.
              </p>
            </section>

            <p className="pt-6 border-t border-gold/10 text-xs text-muted-foreground">
              Dernière mise à jour : mars 2026
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CGV;
