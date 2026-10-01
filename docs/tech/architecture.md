# Architecture technique

## Vue d'ensemble

```
Navigateur ──► Vercel (SPA React prérendue, dist/)
    │
    ├─► Supabase (projet oeweykyazadobobjncfg)
    │     ├─ Postgres + RLS : orders, pre_orders, pro_leads, reviews, recipes, contact_messages, …
    │     ├─ Edge Functions (Deno) : voir tableau
    │     ├─ pg_cron + pgmq : file d'emails (process-email-queue, toutes les 5 min)
    │     │    + purge quotidienne de cron.job_run_details (nettoyage-journal-cron)
    │     └─ vault : SUPABASE_SERVICE_ROLE_KEY (utilisée par triggers et cron)
    ├─► Stripe Checkout (compte acct_1TAZxpEQBCcpAKNI, live)
    └─► Resend (emails transactionnels : morillesducanada.com ; prospection : pro.morillesducanada.com)
```

## Edge functions

| Fonction | Rôle | Auth |
|---|---|---|
| `create-checkout` | Ancien panier de détail : **fermé**, répond 410 avec un message clair | publique (anon) |
| `create-pro-checkout` | Commande pro en ligne : kg + pots en option (`_shared/potAllocation.ts`), session Stripe en `price_data` recalculée côté serveur, société et SIRET obligatoires, France uniquement, `metadata.type=pro_order` | publique (anon) |
| `create-preorder-checkout` | Précommande 2027 (pros) : acompte 50 %, 1–15 kg, société et SIRET obligatoires (champs Stripe) | publique (anon) |
| `stripe-webhook` | `checkout.session.completed` (commande pro en ligne, liens de paiement pros, précommande) → orders / pre_orders + emails (liste de préparation pour l'admin) ; enregistre société, SIRET, téléphone, kg, pots | signature Stripe |
| `submit-pro-lead` | Devis / dégustation en main propre pro (SIRET obligatoire, clé de Luhn) → `pro_leads` + alerte contact@ + accusé de réception | publique, honeypot, 5/h |
| `notify-order-status` | Emails de changement de statut | admin ou service_role |
| `notify-contact` | Alerte formulaire de contact | publique (à durcir, voir backlog) |
| `auth-email-hook` | Emails d'authentification via Resend (`_shared/authEmails.ts`) | signature Standard Webhooks |
| `generate-invoice` | Facture PDF/HTML | — |
| `process-email-queue` | Vide la file pgmq via Resend | service_role (cron) |

Code partagé : `supabase/functions/_shared/` (catalogue, grille pro, formatage, emails).

### Emails

Tous les emails passent par une seule mise en page, `_shared/emailLayout.ts` (fond sombre chaud, or,
texte crème, titres serif, logo `https://www.morillesducanada.com/logo.png`, 600 px, tables et styles
en ligne, bouton compatible Outlook, pied de page avec la mention fiscale sur les emails commerciaux).
Contenus : `_shared/proLead.ts` (devis, dégustation), `_shared/tasting.ts` (calendrier des dégustations), `_shared/preorderEmail.ts` (précommande),
`_shared/orderEmails.ts` (commande, statuts, contact), `_shared/authEmails.ts` (authentification,
lien de vérification Supabase construit avec `token_hash`). Modules purs, testés dans
`src/test/emails.test.ts`. Tout texte dynamique est échappé ; aucun emoji dans les objets.
Le front réexporte la grille via `src/lib/proPricing.ts` : **une seule source de prix**.

## Front

- `src/pages/` : pages (Index, Professionnels, Precommande2027, CGV, MentionsLegales, AdminDashboard…).
  Site réservé aux professionnels : ni panier ni fiches produits ; `/produits*` redirigé (vercel.json).
- `src/components/Seo.tsx` : balises par page ; `src/lib/seo/` : routes et JSON-LD.
  `src/lib/seo/articles.ts` : pages de contenu (une route prérendue chacune, `src/pages/ContentArticle.tsx`) ;
  `robots.ts`, `llms.ts` : `robots.txt`, `llms.txt` et `llms-full.txt` générés au build par le prérendu ;
  `scripts/indexnow.mjs` : soumission IndexNow après déploiement (clé publique dans `public/`). Voir `docs/marketing/seo-geo.md`.
- `scripts/prerender.mjs` : rendu SSR des routes publiques après `vite build` ; `dist/spa.html` pour les
  routes applicatives (`/auth`, `/admin`, `/journal`…, réécritures explicites dans `vercel.json`) ;
  `dist/404.html` servi par Vercel avec un vrai code 404 pour toute autre adresse. Le build échoue si
  une page légale contient un crochet.
- i18n : `src/i18n/{fr,en}.ts`, langue stockée côté navigateur (même URL en FR/EN, pas de hreflang).
- Tests : `src/test/` (vitest + jsdom, client Supabase simulé) — cohérence prix front/serveur,
  routes FR/EN, SIRET, SEO, formulaires, CGV et mentions légales.

## Pièges connus

- **Instance NANO (plan gratuit) : budget Disk IO très faible.** Incident du 2026-09-28 :
  `cron.job_run_details` (134 Mo, jamais purgé) a épuisé le budget, base injoignable ~2 h.
  Règles : aucun cron plus fréquent que toutes les 5 min sans justification ; toute table de
  journal doit avoir une purge ; surveiller Settings → Infrastructure → Disk IO. Un redémarrage
  ne suffit pas : il faut Pause puis Restore, puis supprimer la charge.

- Le bundle SSR ne doit pas toucher `window`/`localStorage` au rendu.
- `verify_jwt = true` refuse les clés `sb_secret_` : la clé du vault doit être le JWT legacy (`eyJ…`).
- Les anciennes migrations Lovable pointent vers l'ancien projet `eozbnwvirdilwslqnkab` :
  ne jamais les rejouer (voir `deploiement.md`).
