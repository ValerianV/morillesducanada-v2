import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const MentionsLegales = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link to="/" className="text-sm text-primary hover:text-gold-light transition-colors mb-8 inline-block">
            ← Retour à l'accueil
          </Link>

          <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">
            Mentions <span className="italic text-gradient-gold">légales</span>
          </h1>
          <div className="divider-gold w-24 mt-6 mb-12" />

          <div className="space-y-10 text-sm text-secondary-foreground/80 font-light leading-relaxed">
            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">1. Éditeur du site</h2>
              <p>
                Le site <strong className="text-foreground">morillesducanada.com</strong> est édité par :<br />
                [Nom / Raison sociale]<br />
                [Forme juridique — ex. : Auto-entrepreneur / SASU / EURL]<br />
                [Adresse du siège social]<br />
                [SIRET : XXX XXX XXX XXXXX]<br />
                [Numéro de TVA intracommunautaire, le cas échéant]<br />
                Email : contact@morillesducanada.com<br />
                Directeur de la publication : [Nom du responsable]
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">2. Hébergement</h2>
              <p>
                Le site est hébergé par :<br />
                Lovable (Lovable Technologies)<br />
                Site web : <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-gold-light transition-colors">lovable.dev</a>
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">3. Propriété intellectuelle</h2>
              <p>
                L'ensemble des contenus présents sur ce site (textes, images, photographies, vidéos, logos, illustrations) est protégé par le droit d'auteur et le droit de la propriété intellectuelle. Toute reproduction, représentation, modification ou adaptation, totale ou partielle, de ces contenus est interdite sans autorisation écrite préalable.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">4. Données personnelles</h2>
              <p>
                Les informations collectées via le formulaire de contact (nom, email, message) sont utilisées uniquement pour répondre à vos demandes. Elles ne sont ni cédées ni vendues à des tiers.
              </p>
              <p className="mt-2">
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition sur vos données personnelles. Pour exercer ces droits, contactez-nous à : <strong className="text-foreground">contact@morillesducanada.com</strong>.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">5. Cookies</h2>
              <p>
                Ce site utilise des cookies techniques strictement nécessaires à son fonctionnement (gestion du panier d'achat, session utilisateur). Aucun cookie publicitaire ou de suivi n'est déposé sans votre consentement explicite.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">6. Limitation de responsabilité</h2>
              <p>
                L'éditeur s'efforce de fournir des informations exactes et à jour mais ne saurait être tenu responsable des erreurs, omissions ou résultats obtenus suite à l'utilisation de ces informations. L'accès au site peut être interrompu à tout moment pour des raisons de maintenance ou de mise à jour.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl text-foreground mb-3">7. Droit applicable</h2>
              <p>
                Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentionsLegales;
