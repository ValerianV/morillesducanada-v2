import { Link } from "react-router-dom";
import LegalPage from "@/components/LegalPage";
import { EDITEUR } from "@/lib/legal";
import { PREORDER_2027 } from "@/lib/preorder";
import { PRO_PACK_GRAMS, PRO_SHIPPING_BUSINESS_DAYS } from "@/lib/proPricing";

// Livraison des commandes professionnelles : France uniquement, port inclus.
const Livraison = () => (
  <LegalPage
    title="Livraison"
    titleHighlight="et réclamations"
    seoTitle="Livraison des morilles au kilo, port inclus | Morilles du Canada"
    description={`Commandes professionnelles livrées en France, port inclus, en sachets sous vide de ${PRO_PACK_GRAMS} g, expédiées sous ${PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés en colis suivi. Réclamation sous 48 h.`}
    path="/livraison"
    breadcrumb="Livraison"
  >
    <section>
      <h2>Zone et frais</h2>
      <p>
        Les commandes sont livrées <strong>en France uniquement</strong>, <strong>port inclus</strong> : le prix au kilo
        de la grille est votre coût final, sans frais de livraison à ajouter.
      </p>
    </section>

    <section>
      <h2>Délai et suivi</h2>
      <p>
        Le stock est en France. Chaque commande est expédiée <strong>sous {PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés</strong>{" "}
        après réception du paiement, en colis suivi. Le numéro de suivi vous est envoyé par email à l'expédition.
      </p>
    </section>

    <section>
      <h2>Conditionnement</h2>
      <p>
        Les morilles sont livrées en <strong>sachets sous vide de {PRO_PACK_GRAMS} g</strong> : par exemple, 3 kg = 12
        sachets. Produit sec, sans chaîne du froid.
        L'échantillon offert (pot en verre de 30 g) n'est pas expédié : il est remis en main propre lors d'une dégustation.
      </p>
    </section>

    <section>
      <h2>Réception et réclamations</h2>
      <p>
        Vérifiez le colis à la réception. En cas d'avarie ou de manquant, émettez des réserves précises auprès du transporteur
        et écrivez-nous <strong>dans les 48 heures</strong> à <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>, avec
        des photos. Nous vous proposerons un renvoi ou un remboursement.
      </p>
    </section>

    <section>
      <h2>Précommande saison {PREORDER_2027.season}</h2>
      <p>
        Les précommandes sont livrées en {PREORDER_2027.delivery.fr}, en France, port inclus. Voir la page{" "}
        <Link to="/precommande-2027">Précommande 2027</Link>.
      </p>
    </section>

    <section>
      <h2>Conditions complètes</h2>
      <p>
        Voir les <Link to="/cgv">conditions générales de vente aux professionnels</Link>.
      </p>
    </section>
  </LegalPage>
);

export default Livraison;
