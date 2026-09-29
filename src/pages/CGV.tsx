import { Link } from "react-router-dom";
import LegalPage from "@/components/LegalPage";
import { EDITEUR } from "@/lib/legal";
import { PREORDER_2027 } from "@/lib/preorder";
import { POT_PRICE_CENTS, POT_SIZES_G } from "@/lib/potAllocation";
import {
  PRO_KG_STEP,
  PRO_MAX_KG,
  PRO_MIN_KG,
  PRO_PACK_GRAMS,
  PRO_QUOTE_REPLY_HOURS,
  PRO_SAMPLE_GRAMS,
  PRO_SHIPPING_BUSINESS_DAYS,
  PRO_TAX_MENTION,
  PRO_TIERS,
  formatEurosLocale,
  formatKg,
  formatTierPrice,
} from "@/lib/proPricing";

const eur = (cents: number) => formatEurosLocale(cents, "fr");

// Conditions générales de vente aux professionnels (site réservé aux professionnels depuis le 2026-09-28).
// Aucun crochet ni placeholder : test src/test/legal.test.tsx.
const CGV = () => (
  <LegalPage
    title="Conditions générales"
    titleHighlight="de vente professionnelles"
    seoTitle="Conditions générales de vente aux professionnels | Morilles du Canada"
    description="CGV de Morilles du Canada, vente réservée aux professionnels : commande sur devis ou lien de paiement, prix nets (art. 293 B du CGI), paiement à la commande, livraison en France port inclus."
    path="/cgv"
    breadcrumb="CGV"
    intro={<p>Version du 29 septembre 2026. Les ventes de Morilles du Canada sont réservées aux professionnels.</p>}
  >
    <section>
      <h2>Article 1 — Vendeur et champ d'application</h2>
      <p>
        Le vendeur est <strong>{EDITEUR.nom}</strong>, entrepreneur individuel (EI) en micro-entreprise, SIRET {EDITEUR.siret},
        {" "}{EDITEUR.adresse} (ci-après « Morilles du Canada »). Contact : <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>,
        {" "}{EDITEUR.telephone}.
      </p>
      <p>
        Les présentes conditions générales de vente s'appliquent exclusivement aux ventes conclues avec des professionnels
        (restaurants, épiceries fines, traiteurs, distributeurs et plus généralement toute personne agissant pour les besoins
        de son activité professionnelle), qui disposent d'un numéro SIRET ou d'un identifiant équivalent. Conformément à
        l'article L441-1 du Code de commerce, elles constituent le socle unique de la négociation commerciale et prévalent sur
        tout autre document du client, sauf accord écrit de Morilles du Canada.
      </p>
      <p>Morilles du Canada ne vend pas aux consommateurs. Toute commande emporte l'acceptation des présentes conditions.</p>
    </section>

    <section>
      <h2>Article 2 — Produits</h2>
      <p>
        Morilles sauvages du Canada, séchées, entières et équeutées, en variétés mélangées, sans tri par variété. Les commandes
        au kilo sont livrées en sachets sous vide de {PRO_PACK_GRAMS} g (par exemple, 3 kg = 12 sachets). Les produits sont
        vendus dans la limite du stock disponible en France. La date est indiquée sur chaque emballage.
      </p>
    </section>

    <section>
      <h2>Article 3 — Commande</h2>
      <p>Une commande peut être passée de trois façons :</p>
      <ul>
        <li>
          <strong>sur devis</strong>, demandé sur la page <Link to="/professionnels">Professionnels</Link> : Morilles du Canada
          confirme le devis sous {PRO_QUOTE_REPLY_HOURS} h ouvrées ; la commande est ferme à l'acceptation du devis par le client ;
        </li>
        <li>
          <strong>en ligne</strong>, sur la page <Link to="/professionnels">Professionnels</Link>, pour la quantité choisie et,
          en option, des pots en verre vides (article 4), ou <strong>par lien de paiement</strong> : la commande est ferme au
          paiement ;
        </li>
        <li>
          <strong>en précommande</strong> pour la saison {PREORDER_2027.season} (article 10).
        </li>
      </ul>
      <p>
        Les quantités vont de {formatKg(PRO_MIN_KG)} à {formatKg(PRO_MAX_KG)}, par tranche de {PRO_KG_STEP * 1000} g. Le
        client indique la raison sociale et le numéro SIRET de son établissement ; Morilles du Canada peut refuser une commande
        qui ne comporte pas ces informations.
      </p>
    </section>

    <section>
      <h2>Article 4 — Prix</h2>
      <p>Les prix sont exprimés en euros, au kilo, selon la quantité totale commandée :</p>
      <ul>
        {PRO_TIERS.map((tier) => (
          <li key={tier.id}>
            {tier.label.fr} : {formatTierPrice(tier)}
          </li>
        ))}
      </ul>
      <p>
        Le prix du palier atteint s'applique à toute la quantité commandée. <strong>{PRO_TAX_MENTION.fr}.</strong> Les prix
        comprennent la livraison en France. Le prix applicable est celui du devis accepté ou de la commande payée en ligne.
      </p>
      <p>
        Option pots : pots en verre vides de {POT_SIZES_G.join(", ")} g, sans étiquette, à {formatEurosLocale(POT_PRICE_CENTS)} net
        le pot, quelle que soit la taille. Ils sont livrés vides, à part des sachets ; le client les remplit et les étiquette
        lui-même. La quantité de morilles ne change pas : le reste de moins d&apos;un pot est livré en vrac.
      </p>
    </section>

    <section>
      <h2>Article 5 — Paiement</h2>
      <p>
        Le paiement est dû à la commande : par carte bancaire sur la page de paiement sécurisée Stripe (commande en ligne ou lien de paiement), ou par virement
        sur les coordonnées bancaires indiquées sur la facture émise après devis. La commande est expédiée après réception du paiement. Une facture
        mentionnant le numéro SIRET du vendeur est établie pour chaque commande.
      </p>
    </section>

    <section>
      <h2>Article 6 — Retard de paiement</h2>
      <p>
        Tout retard de paiement entraîne de plein droit, sans rappel préalable, des pénalités de retard calculées au taux égal
        à trois fois le taux d'intérêt légal, ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 € (articles
        L441-10 et D441-5 du Code de commerce). Morilles du Canada peut suspendre toute livraison jusqu'au paiement complet.
      </p>
    </section>

    <section>
      <h2>Article 7 — Livraison et transfert des risques</h2>
      <p>
        Les produits sont livrés en France uniquement, port inclus, en colis suivi. Ils sont expédiés sous{" "}
        {PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés après réception du paiement. Le numéro de suivi est transmis par email à
        l'expédition. Les risques sont transférés au client à la remise du colis à l'adresse de livraison qu'il a indiquée.
      </p>
    </section>

    <section>
      <h2>Article 8 — Réception et réclamations</h2>
      <p>
        Le client vérifie le colis à sa réception. En cas d'avarie ou de manquant dû au transport, il émet des réserves
        précises auprès du transporteur et adresse une réclamation écrite à{" "}
        <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a> dans les 48 heures suivant la réception, avec des photos.
        Passé ce délai, aucune réclamation relative au transport ne pourra être acceptée.
      </p>
    </section>

    <section>
      <h2>Article 9 — Conformité</h2>
      <p>
        Morilles du Canada garantit la conformité des produits à la description de l'article 2. Toute non-conformité est
        signalée par écrit, avec photos, dans les 48 heures suivant la réception. Après vérification, Morilles du Canada
        remplace les produits non conformes ou les rembourse. La garantie des vices cachés des articles 1641 et suivants du
        Code civil s'applique dans les conditions du droit commun.
      </p>
    </section>

    <section>
      <h2>Article 10 — Précommande saison {PREORDER_2027.season}</h2>
      <p>
        La précommande, réservée aux professionnels (SIRET obligatoire), porte sur des morilles de la saison{" "}
        {PREORDER_2027.season}, au prix de {eur(PREORDER_2027.pricePerKgCents)} le kilo, de {PREORDER_2027.minKg} à{" "}
        {PREORDER_2027.maxKg} kg par précommande, par kilo entier. Un acompte de 50 %, soit{" "}
        {eur(PREORDER_2027.depositPerKgCents)} par kilo, est payé en ligne à la commande ; le solde est facturé avant
        l'expédition. La livraison est garantie en {PREORDER_2027.delivery.fr}, en France, port inclus. S'il est impossible
        de fournir les morilles, l'acompte est intégralement remboursé.
      </p>
    </section>

    <section>
      <h2>Article 11 — Échantillons</h2>
      <p>
        Un pot en verre de {PRO_SAMPLE_GRAMS} g est offert par établissement, sur demande depuis la page Professionnels, dans
        la limite des stocks et sans obligation d'achat.
      </p>
    </section>

    <section>
      <h2>Article 12 — Absence de droit de rétractation</h2>
      <p>
        Les ventes étant conclues entre professionnels, le droit de rétractation prévu par le Code de la consommation ne
        s'applique pas.
      </p>
    </section>

    <section>
      <h2>Article 13 — Données personnelles</h2>
      <p>
        Les données transmises lors d'une commande ou d'une demande de devis sont traitées selon les{" "}
        <Link to="/mentions-legales">mentions légales</Link>.
      </p>
    </section>

    <section>
      <h2>Article 14 — Loi applicable et tribunal compétent</h2>
      <p>
        Les présentes conditions sont soumises au droit français. À défaut d'accord amiable, tout litige relatif à leur
        interprétation ou à leur exécution relève de la compétence exclusive des tribunaux du ressort d'Avignon.
      </p>
    </section>
  </LegalPage>
);

export default CGV;
