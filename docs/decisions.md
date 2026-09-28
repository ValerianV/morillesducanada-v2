# Journal des décisions

Le plus récent en haut. Chaque entrée : date, décision, raison. Une décision annulée donne lieu
à une nouvelle entrée ; on ne réécrit pas l'historique. Aucune donnée confidentielle ici
(coûts, plancher, fournisseurs) : elles vont dans `docs/interne/` (non versionné).

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
