# Journal des décisions

Le plus récent en haut. Chaque entrée : date, décision, raison. Une décision annulée donne lieu
à une nouvelle entrée ; on ne réécrit pas l'historique. Aucune donnée confidentielle ici
(coûts, plancher, fournisseurs) : elles vont dans `docs/interne/` (non versionné).

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
