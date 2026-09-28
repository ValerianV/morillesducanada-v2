# Journal des décisions

Le plus récent en haut. Chaque entrée : date, décision, raison. Une décision annulée donne lieu
à une nouvelle entrée ; on ne réécrit pas l'historique. Aucune donnée confidentielle ici
(coûts, plancher, fournisseurs) : elles vont dans `docs/interne/` (non versionné).

## 2026-09-28 — Grille de prix unique : sous vide 1 kg à 350 €

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
