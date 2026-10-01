import LegalPage from "@/components/LegalPage";
import { EDITEUR, HEBERGEUR, SOUS_TRAITANTS } from "@/lib/legal";

const MentionsLegales = () => (
  <LegalPage
    title="Mentions"
    titleHighlight="légales"
    seoTitle="Mentions légales | Morilles du Canada"
    description="Mentions légales de Morilles du Canada : éditeur (entrepreneur individuel), hébergeur, données personnelles, sous-traitants, durées de conservation et droits."
    path="/mentions-legales"
    breadcrumb="Mentions légales"
  >
    <section>
      <h2>1. Éditeur du site</h2>
      <p>
        Le site <strong>morillesducanada.com</strong> est édité par <strong>{EDITEUR.nom}</strong>, entrepreneur individuel
        (EI), micro-entreprise.
      </p>
      <ul>
        <li>Adresse : {EDITEUR.adresse}</li>
        <li>SIRET : {EDITEUR.siret}</li>
        <li>TVA : non applicable, franchise en base (article 293 B du CGI)</li>
        <li>
          Téléphone : <a href={EDITEUR.telephoneHref}>{EDITEUR.telephone}</a>
        </li>
        <li>
          Email : <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>
        </li>
        <li>Directeur de la publication : {EDITEUR.nom}</li>
      </ul>
    </section>

    <section>
      <h2>2. Hébergement</h2>
      <p>
        <strong>{HEBERGEUR.nom}</strong>, {HEBERGEUR.adresse}. Téléphone : {HEBERGEUR.telephone}. Site :{" "}
        <a href={HEBERGEUR.site} target="_blank" rel="noopener noreferrer">
          vercel.com
        </a>
        .
      </p>
    </section>

    <section>
      <h2>3. Propriété intellectuelle</h2>
      <p>
        Les contenus du site (textes, photographies, logos) sont protégés par le droit d'auteur. Toute reproduction ou
        adaptation, totale ou partielle, est interdite sans autorisation écrite préalable.
      </p>
    </section>

    <section>
      <h2>4. Données personnelles</h2>
      <p>
        Le responsable du traitement est {EDITEUR.nom}. Les données sont collectées pour les finalités suivantes :
      </p>
      <ul>
        <li>demandes de devis et de dégustation (formulaire Professionnels) : mesures précontractuelles ;</li>
        <li>commandes, précommandes, facturation et livraison : exécution du contrat et obligations comptables ;</li>
        <li>messages du formulaire de contact : réponse à votre demande ;</li>
        <li>prospection commerciale auprès des professionnels : intérêt légitime, avec possibilité de s'y opposer à tout moment.</li>
      </ul>
      <p>Les données ne sont ni vendues ni cédées. Elles sont traitées par les sous-traitants suivants :</p>
      <ul>
        {SOUS_TRAITANTS.map((s) => (
          <li key={s.nom}>
            {s.nom} : {s.role}
          </li>
        ))}
      </ul>
      <p>
        Certains de ces prestataires sont établis aux États-Unis ; les transferts sont encadrés par les garanties prévues par
        le RGPD (clauses contractuelles types de la Commission européenne ou cadre de protection des données UE–États-Unis).
      </p>
      <p>Durées de conservation :</p>
      <ul>
        <li>demandes de devis, de dégustation et messages sans suite : 3 ans après le dernier contact ;</li>
        <li>données clients : pendant la relation commerciale, puis 3 ans ;</li>
        <li>factures et pièces comptables : 10 ans (article L123-22 du Code de commerce).</li>
      </ul>
      <p>
        Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité. Pour
        l'exercer : <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>. Vous pouvez aussi adresser une réclamation à la
        CNIL (
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
          cnil.fr
        </a>
        ).
      </p>
    </section>

    <section>
      <h2>5. Cookies</h2>
      <p>
        Le site n'utilise que des éléments techniques nécessaires à son fonctionnement (langue choisie, session de
        l'administration). Aucun cookie publicitaire ni de mesure d'audience n'est déposé.
      </p>
    </section>

    <section>
      <h2>6. Responsabilité</h2>
      <p>
        L'éditeur veille à l'exactitude des informations publiées mais ne peut être tenu responsable d'erreurs ou d'omissions.
        L'accès au site peut être interrompu pour maintenance.
      </p>
    </section>

    <section>
      <h2>7. Droit applicable</h2>
      <p>Les présentes mentions légales sont soumises au droit français.</p>
    </section>
  </LegalPage>
);

export default MentionsLegales;
