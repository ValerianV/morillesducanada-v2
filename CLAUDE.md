# CLAUDE.md — Morilles du Canada

Lu automatiquement par chaque agent. Court par design : le détail est dans `docs/`.
Toute décision nouvelle du fondateur → `docs/decisions.md` d'abord, puis le doc concerné.

## Mission

Vendre des morilles de feu **sauvages** du Canada, séchées, **aux professionnels uniquement**
(chefs gastronomiques, épiceries fines, traiteurs haut de gamme, distributeurs ; SIRET demandé
à la commande), via https://www.morillesducanada.com. Aucune vente aux particuliers depuis le
2026-09-28 (pas de médiateur de la consommation). Deux objectifs :

1. Écouler le stock actuel (≈ 45 kg séchés, en France).
2. Vendre la saison suivante en **précommande** (saison 2027, livraison octobre 2027).

Fondateur : Valérian Vilane (auto-entrepreneur). Il valide prix, promesses commerciales,
envois de prospection et déploiements en production.

## Sources de vérité (ne jamais dupliquer un chiffre ailleurs sans le relier ici)

| Sujet | Doc | Code |
|---|---|---|
| Offre, prix, livraison, TVA, précommande | `docs/business/offre.md` | `supabase/functions/_shared/proPricing.ts` (réexporté par `src/lib/proPricing.ts`), `supabase/functions/_shared/catalog.ts` (précommande) |
| Mentions légales, CGV | `docs/business/offre.md` | `src/lib/legal.ts`, `src/pages/CGV.tsx`, `src/pages/MentionsLegales.tsx` |
| Récit de marque, faits autorisés / interdits | `docs/business/recit.md` | textes i18n `src/i18n/*.ts` |
| Marché et positionnement prix | `docs/business/marche.md` | — |
| Cibles, prospection, suivi commercial | `docs/commercial/strategie.md` | table `pro_leads` |
| SEO et GEO (robots, llms.txt, pages de contenu, IndexNow, plan hors site) | `docs/marketing/seo-geo.md` | `src/lib/seo/` (articles, schema, robots, llms), `scripts/indexnow.mjs` |
| Calendrier des dégustations en main propre | `docs/business/offre.md` | `supabase/functions/_shared/tasting.ts` |
| Architecture technique | `docs/tech/architecture.md` | — |
| Déploiement (runbook) | `docs/tech/deploiement.md` | — |
| Accès et services externes | `docs/tech/acces.md` (jamais de secret en clair) | — |
| Journal des décisions | `docs/decisions.md` | — |
| Backlog d'amélioration | `docs/amelioration-continue.md` | — |

## Règles non négociables

- **Aucune promesse inventée.** Seuls les faits de `docs/business/recit.md` et `docs/business/offre.md`
  peuvent apparaître sur le site, dans un email ou un devis. Pas d'avis, de chiffres, de labels,
  de calibre chiffré ou de délai non validés.
- **Confidentialité fournisseurs.** Ne jamais nommer ni montrer les cueilleurs ou acheteurs
  partenaires au Canada. Le fondateur reste l'unique intermédiaire.
- **Prix plancher de négociation** : dans `docs/business/offre.md`, **jamais** sur le site ni dans un email.
- **Mention fiscale** partout où un prix apparaît : « Prix nets — TVA non applicable, art. 293 B du CGI ».
- **Expédition : sous 5 jours ouvrés.** Jamais « 48 h » (seule la réponse aux devis est « sous 48 h ouvrées »).
- **Professionnels uniquement** : pas de panier, pas de prix de détail, pas de médiateur ni de rétractation dans les CGV.
- **Aucun email de prospection envoyé sans feu vert explicite du fondateur, vague par vague.**
- **Production** (déploiement Supabase/Vercel, Stripe live, DNS) : suivre `docs/tech/deploiement.md`
  et obtenir la validation du fondateur.
- Prix côté serveur uniquement : le client n'envoie jamais de montant. La grille n'existe qu'une
  fois (`_shared/proPricing.ts`), testée dans `src/test/catalog.test.ts`.

## Conventions de développement

- Stack : React 18 + Vite + TypeScript + Tailwind/shadcn · Supabase (Postgres + RLS + Edge Functions Deno)
  · Stripe Checkout · Resend · Vercel (prérendu SSR des routes publiques au build).
- Avant tout commit : `git config user.email valerian.vilane@gmail.com` (sinon Vercel bloque le déploiement).
- Travailler sur une branche, jamais directement sur `main`. Messages de commit en français, préfixés
  (`feat`, `fix`, `perf`, `content`, `docs`, `chore`).
- Vérifications obligatoires avant de déclarer un travail terminé :
  `npx tsc --noEmit -p tsconfig.app.json` · `npx vitest run` · `npm run build` (inclut le prérendu)
  · `deno check` sur les edge functions modifiées.
- Migrations SQL : idempotentes, datées, jamais `supabase db push` à l'aveugle (anciennes migrations
  Lovable présentes — voir `docs/tech/deploiement.md`).
- Textes : vouvoiement, sobre, premium, sans superlatifs creux ni emojis. FR prioritaire, EN via i18n.
  Narrateur : « je » (Valérian), jamais « nous » ; le nom à la troisième personne seulement pour l'identifier
  ou dans un contenu fait pour être cité par les IA (voir `docs/decisions.md`, 2026-10-05).
- Navigation web : skill `/browse` (gstack) pour les tests en local ; navigateur intégré pour les
  dashboards où le fondateur est connecté.

## Skills du projet (`.claude/skills/`)

| Commande | Usage |
|---|---|
| `/deployer` | Mise en production pas à pas (Supabase puis Vercel) avec contrôles |
| `/verifier-coherence` | Vérifie que prix, promesses et mentions sont identiques partout (site, Stripe, docs, emails) |
| `/prospect-b2b` | Prépare une vague de prospection ciblée (sans l'envoyer) |
| `/suivi-commercial` | Revue hebdomadaire : leads, devis, relances, stock restant |
| `/revue-site` | Audit mensuel QA + SEO + conversion, avec rapport dans `docs/audits/` |
| `/nouvelle-saison` | Mise à jour annuelle : saison, stock, prix, précommande, récit |
| `/qualite-traceabilite` | Fiches lot, checklists qualité |

## Économie de tokens (appliquée par tous les agents)

Agent dédié : `econome-tokens` (`.claude/agents/econome-tokens.md`). Le consulter avant une mission coûteuse
et après une session. Règles, les plus rentables en premier :

1. **Modèle adapté** : `opus` pour l'architecture, la sécurité, les données et les arbitrages ; `sonnet` pour le
   développement bien spécifié, la rédaction, la recherche web et la QA ; `haiku` pour les tâches mécaniques.
2. **Contexte par référence** : les briefs pointent vers ce fichier et `docs/`, ils ne recopient pas l'offre ni l'historique.
3. **Captures d'écran** : uniquement pour une question visuelle, en viewport, à échelle réduite, une par problème.
   Pour un texte, lire le HTML (`curl | grep`, `get_page_text`).
4. **Budget explicite** dans chaque brief : nombre de recherches web et de captures ; arrêt dès le livrable atteint.
5. **Sorties filtrées** (`head`, `grep`, extraction des champs) ; jamais de JSON brut volumineux.
6. **Reprendre un agent existant** (SendMessage) plutôt qu'en créer un, surtout après une coupure de quota.
7. **Rapports courts** (20 lignes maximum), le détail dans un fichier.
8. **Pas d'agent pour une tâche de moins de 5 minutes.**

Ces règles ne touchent jamais aux garde-fous qualité : tests, build, vérification des faits, validations du fondateur.

## En fin de session significative

1. Mettre à jour `docs/decisions.md` (décisions prises, avec date) et `docs/amelioration-continue.md`.
2. Laisser la branche dans un état propre (build + tests verts) et dire clairement ce qui reste à faire.
