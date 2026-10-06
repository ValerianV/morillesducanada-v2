# Journal des décisions

Le plus récent en haut. Chaque entrée : date, décision, raison. Une décision annulée donne lieu
à une nouvelle entrée ; on ne réécrit pas l'historique. Aucune donnée confidentielle ici
(coûts, plancher, fournisseurs) : elles vont dans `docs/interne/` (non versionné).

## 2026-10-07 — Démarchage : obtenir un rendez-vous, ne jamais visiter à l'improviste

- Règle du fondateur : « démarcher pour visiter oui, visiter pour démarcher non ». Une visite spontanée tombe
  toujours au mauvais moment. Le démarchage (téléphone, SMS, email, Instagram) a pour seul but d'obtenir un
  rendez-vous ; le pot de 30 g est remis lors de ce rendez-vous.
- Cibles prioritaires : restaurants de qualité, traiteurs et chefs à domicile. Fromagers et épiceries ne sont plus
  prospectés (3 refus sur 3 réponses le 06/10, tous venus de ce segment).
- Étiquettes : une étiquette permanente sans date ni lot, plus une mini-étiquette « lot + date de durabilité minimale »
  collée sous chaque pot. Les étiquettes Vistaprint de 2024 ne sont plus utilisables : date dépassée, mais aussi
  cuisson « au moins 5 minutes », nom et adresse de l'exploitant absents, superlatifs (« parmi les meilleures du marché »).
- Carnet de démarchage : statuts « RDV demandé » (relance à 4 jours) puis « RDV pris » et « Visité, pot remis ».

## 2026-10-06 — Emails de prospection : écrire comme une personne, pas comme un robot

- Retour du fondateur sur les relances J+5 : formule « répondez STOP », liens UTM visibles et précommande détaillée
  trahissaient l'envoi automatisé. Nouvelles règles d'écriture : `docs/commercial/emails-prospection.md`, section 0.
- La précommande 2027 n'est plus proposée à un prospect qui n'a pas encore eu le produit en main.
- Données structurées : image, délai d'expédition (sous 5 jours ouvrés, sans délai de transport promis) et politique
  de retour (pas de retour entre professionnels ; non-conformité remplacée ou remboursée) ajoutés aux Product.

## 2026-10-05 — « Échantillon en main propre » remplace « dégustation »

- Précision du fondateur : il n'y a pas de dégustation (réhydrater et cuisiner prend trop de temps). Il passe remettre
  en main propre un pot de 30 g de morilles séchées, avec une carte, au chef ou au directeur, et fait sa présentation
  commerciale. Le site, les emails et les relances disaient « dégustation » : tout est renommé « échantillon en main propre ».
- Identifiants techniques inchangés (`kind = "degustation"`, ancre `#degustation`, statut `degustation_planifiee`)
  pour ne pas casser les liens ni les données existantes.

## 2026-10-05 — Échantillon envoyé seulement après un appel

- Décision du fondateur : un pot de 30 g n'est envoyé par la poste qu'après un échange téléphonique avec le prospect
  (toujours un prospect contacté par nous, au cas par cas). Raison : éviter les demandes d'échantillon sans suite ;
  l'appel qualifie l'intérêt et c'est là que la vente se conclut. La remise en main propre lors d'une dégustation reste inchangée.

## 2026-10-05 — Le site parle à la première personne (« je »)

- Décision du fondateur : un seul narrateur, Valérian, à la première personne. Plus aucun « nous » (site FR et EN,
  pages, emails automatiques). Raison : il est seul, intermédiaire unique ; « nous » suggérait une équipe qui n'existe pas.
- Le nom « Valérian » reste à la troisième personne uniquement pour l'identifier (titres, légendes, libellés de contact,
  plaquette) et dans les contenus faits pour être cités hors contexte par les IA (`llms.txt`, réponses FAQ des articles,
  données structurées) : une phrase extraite doit garder son sujet.
- Nouvelle photo du fondateur (`src/assets/valerian-vilane-fondateur.webp`, 720×960, recadrée 3:4 ; version carrée
  `public/images/valerian-vilane-fondateur-morilles-du-canada.webp` déclarée comme `image` de la Person en JSON-LD).
- Titres en dégradé doré : marge interne pour ne plus couper le jambage des italiques (« f » de « professionnels »).

## 2026-10-05 — Emails : authentification vérifiée, réponses sécurisées

- Rapports DMARC (Google, Microsoft, 28/09 au 02/10) : 100 % des emails passent DMARC grâce à DKIM aligné.
  SPF non aligné sur le domaine principal : les enregistrements `send.morillesducanada.com` (MX et TXT Resend) sont
  absents du DNS. À rajouter chez IONOS avant de passer DMARC en `p=quarantine`.
- Les expéditeurs de prospection ne recevaient rien : redirection IONOS `valerian@morillesducanada.com` → contact@ créée le 05/10 ;
  les emails gardent `Reply-To: contact@`. Le sous-domaine `pro.` n'a pas de boîte : toujours mettre le Reply-To.
- contact@ est transféré vers le Gmail du fondateur (copie conservée chez IONOS).

## 2026-10-01 — SEO approfondi et GEO (être cité par les IA)

- Objectif du fondateur : être cité par ChatGPT, Claude, Perplexity et Gemini quand un professionnel cherche où acheter
  des morilles séchées. Plan hors site : `docs/marketing/seo-geo.md`.
- Site : robots.txt explicite pour les robots des moteurs et des IA (Disallow conservés) ; `llms.txt` et `llms-full.txt`
  générés au build ; 5 pages de contenu (acheter pour la restauration, prix au kilo, morille de feu ou de culture,
  réhydratation, épiceries fines) signées Valérian Vilane ; Organization (founder, knowsAbout, areaServed), Offer avec
  UnitPriceSpecification au kilo, FAQPage enrichie, dateModified ; IndexNow (`scripts/indexnow.mjs`, clé dans `public/`).
- Chiffres de marché : cités uniquement avec leur source (dossier de marché de septembre 2026), sans nommer de concurrent.
- `sameAs` volontairement vide : à remplir quand les profils publics réels existent (`SAME_AS_URLS`).

## 2026-10-01 — Échantillon remis en main propre uniquement

- Décision du fondateur : le pot de 30 g offert est **remis en main propre**, lors d'une dégustation, quand Valérian
  est dans la zone du prospect. Raison : on peut trop facilement usurper l'identité de plusieurs établissements
  pour obtenir plusieurs échantillons par la poste.
- Précision du même jour : un **envoi postal reste possible au cas par cas**, après échange avec Valérian, uniquement
  pour un établissement que nous avons démarché et qui répond. Le formulaire du site ne déclenche jamais d'envoi ;
  jamais « envoi gratuit sur simple demande ». Hors zones, le site dit : « contactez-nous, nous étudions chaque demande ».
- Calendrier : Avignon et Provence jusqu'au 7 novembre 2026 ; Chamonix et Mont-Blanc à partir du 8 novembre ;
  Maurienne (Val Cenis, Valloire) en décembre. Constante `TASTING_TOUR` (`supabase/functions/_shared/tasting.ts`).
- `/professionnels` : onglet « Dégustation en main propre » (ville, code postal, disponibilités ; plus d'adresse
  de livraison) et calendrier affiché. Ancre `#echantillon` conservée comme alias de `#degustation`.
- `submit-pro-lead` : type `degustation` (l'ancien type `echantillon`, envoyé par une page en cache, est accepté
  et traité comme une dégustation) ; emails d'alerte et d'accusé de réception réécrits (main propre, calendrier).
  La limite « un échantillon par SIRET / email » disparaît (plus d'envoi postal à limiter).
- Base : migration `20261001090000_pro_leads_degustation.sql` (colonne `availability`, type `degustation`, statuts
  `degustation_planifiee` et `echantillon_remis`). Les anciennes lignes (`echantillon`, `echantillon_envoye`) restent valides.
- Mis à jour : FAQ, plaquette pro, fiche technique, livraison, CGV (art. 11), mentions légales, docs/business/offre.md,
  textes de prospection (`docs/commercial/`). CGV : **à relire par le fondateur**.

## 2026-09-29 — Option pots en verre vides et commande en ligne

- Décision du fondateur : proposer, surtout aux épiceries, des **pots en verre vides, sans étiquette**
  (12, 30 et 45 g) avec la commande au kilo, à **1,50 € net le pot**, toutes tailles. Les morilles
  partent en sachets de 250 g, les pots à part ; l'épicerie remplit et étiquette.
- Stock de pots provisoire : 250 × 12 g, 250 × 30 g, 200 × 45 g ; tout dépassement refusé (site et serveur).
- Configurateur sur `/professionnels#commander` : 1 à 45 kg (pas de 0,5 kg), pots par format, un format
  complété automatiquement, reste en vrac ; paiement par une session Stripe calculée côté serveur
  (`create-pro-checkout`). Les quatre liens de paiement ne sont plus affichés sur le site.
- CGV (art. 3, 4, 5) mises à jour en conséquence, version du 29 septembre 2026 : **à relire par le fondateur**.
- Remplace « Épiceries fines : vrac sous vide uniquement » et « pots uniquement pour les échantillons » (2026-09-28).

## 2026-09-28 — Site 100 % professionnel

- Décision du fondateur : **le site ne vend plus qu'aux professionnels**. Raison : la vente aux
  consommateurs impose un médiateur de la consommation payant (art. L612-1 C. conso.), refusé.
- Conséquences : plus de panier, de pots ni de sous vide au détail ; `/produits` redirigé vers
  `/professionnels` ; `create-checkout` répond 410 ; compte client retiré du menu (`/auth` et
  `/admin` gardés pour le fondateur, en noindex) ; CGV professionnelles (sans rétractation ni
  médiateur, tribunaux d'Avignon) ; SIRET obligatoire au devis, à l'échantillon et à la précommande.
- Offre : 1 à 45 kg (pas de 0,5 kg), grille 350 / 330 / 310 / 290 €/kg, port inclus, France
  uniquement, expédition sous 5 jours ouvrés, sachets sous vide de 250 g.
- Commander : devis (réponse **sous 48 h ouvrées**, validé), liens de paiement Stripe, ou virement
  sur facture (Stripe ou coordonnées sur la facture ; aucun IBAN dans le code).
- Précommande 2027 : **pros uniquement**, SIRET obligatoire, port inclus en France.
- Épiceries fines : vrac sous vide uniquement, à reconditionner sous leur marque.
- Pots de 12, 30 et 45 g : en verre, refermables ; uniquement pour les échantillons (30 g).
- Goût « fumé » retiré partout ; photos : uniquement celles du dépôt.
- Avis Annabel, Brigitte, Nathalie : réels (vérifiés par le fondateur) ; gardés, discrets.

## 2026-09-28 — Audit PM (go / no-go prospection) : décisions du directeur

- Tout ce qui n'est pas validé est retiré : allergènes, valeurs nutritionnelles, DDM chiffrée,
  « date de péremption », « PA/PE », « origine traçable », « qualité constante », « stock
  constant », rendements chiffrés.
- « Sachet » → « pot en verre » pour 12, 30 et 45 g. Journal du cueilleur masqué (noindex, hors
  sitemap, liens retirés). Accueil allégé (« Pourquoi… différentes » et « Du sol brûlé à votre
  assiette » retirés). Mentions légales : EI, Aubignan, téléphone, Vercel, sous-traitants, CNIL.
- Plaquette lisible sur mobile, lisibilité AA (texte courant en 400, 15–16 px), galerie à 20 photos,
  image JPEG de 727 Ko remplacée par du WebP, vrai code 404.

## 2026-09-28 — Grille de prix unique : sous vide 1 kg à 350 €

(Remplacée le même jour par la décision « Site 100 % professionnel » : le détail est fermé.)


- Décision du fondateur : « Je ne peux pas proposer la même quantité à deux prix différents. »
  Le sous vide 1 kg passe de 420 € à **350 € pour tout le monde**, soit le prix du palier pro 1 kg.
- Grille publique unique : 100 g 59 €, 200 g 110 €, 500 g 240 €, 1 kg 350 € ; au-delà, sur devis
  ou lien de paiement : 3 kg et + 330 €/kg, 5 kg et + 310 €/kg, 10 kg et + 290 €/kg.
- Stripe : nouveau prix `price_1UKjo2EQBCcpAKNIMbIj8954` (350 €) ; l'ancien
  `price_1TMjZ3EQBCcpAKNIY6emeuWP` (420 €) sera archivé après le déploiement.

## 2026-09-28 — Emails transactionnels à l'identité de la marque

- Une mise en page unique pour tous les emails (`supabase/functions/_shared/emailLayout.ts`) :
  fond sombre chaud, or, texte crème, titres serif, logo, pied de page avec la mention fiscale
  sur les emails commerciaux. Aucun emoji dans les objets.

## 2026-09-28 — Incident Supabase : budget Disk IO épuisé

- Base injoignable environ 2 h. Cause : `cron.job_run_details` à 134 Mo (cron chaque minute, jamais purgé).
- Résolution : pause puis restauration du projet, purge du journal, cron des emails passé à 5 min,
  purge quotidienne programmée. Migration `20260928120000_cron_io_optimisation.sql`.
- Décision du fondateur : **rester sur le plan gratuit** et optimiser.

## 2026-09-28 — Relance du projet avec une équipe d'agents

**Stratégie**
- Objectif : écouler le stock actuel (≈ 45 kg) et lancer la précommande saison 2027.
- Positionnement premium sauvage ; le récit de cueillette est l'argument principal.
- Grossistes de volume exclus (prix d'achat incompatibles). Cibles : épiceries fines premium,
  traiteurs haut de gamme, tables gastronomiques. Pas de brasseries.

**Prix et conditions** (détail dans `docs/business/offre.md`)
- Grille pro : 1 kg 350 €/kg, 3 kg et plus 330, 5 kg et plus 310, 10 kg et plus 290.
- L'offre pro commence à 1 kg ; le 500 g reste un format grand public (lien pro 500 g désactivé).
- Pros : port inclus, France uniquement. Particuliers : Europe conservée.
- Port particuliers : France 6,90 € (offert dès 50 €), UE 9,90 € (offert dès 100 €).
- Précommande 2027 : 300 €/kg, acompte 50 %, 1 à 15 kg, livraison garantie en octobre 2027,
  remboursement intégral si impossible de fournir.
- Échantillon pro : pot de 30 g. Expédition sous 5 jours ouvrés.

**Récit et confidentialité**
- Faits : trois saisons de cueillette du fondateur (2022, 2023, 2024), Colombie-Britannique et Yukon ;
  réseau de cueilleurs sur place.
- Les partenaires au Canada ne sont jamais nommés ni montrés.
- Aucun document de douane publié.

**Opérations**
- Auto-entrepreneur, franchise de TVA, pas de comptable.
- Emails via Resend ; prospection depuis le sous-domaine `pro.morillesducanada.com`
  (DKIM, SPF, DMARC en place).

**Technique**
- Correctifs de sécurité (prix côté serveur, fonctions email authentifiées, email des avis masqué).
- Tunnel pro, précommande 2027, prérendu SEO, frais de port par zone.
- Projet documenté pour être repris par d'autres agents (`CLAUDE.md`, `docs/`, skills).
