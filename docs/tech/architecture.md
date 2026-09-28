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
| `create-checkout` | Panier → session Stripe. Prix, port et pays recalculés côté serveur (`_shared/catalog.ts`) | publique (anon) |
| `create-preorder-checkout` | Précommande 2027 : acompte 50 %, 1–15 kg | publique (anon) |
| `stripe-webhook` | `checkout.session.completed` → orders / pre_orders + emails | signature Stripe |
| `submit-pro-lead` | Devis / échantillon pro → `pro_leads` + alerte contact@ + accusé de réception | publique, honeypot, 5/h |
| `notify-order-status` | Emails de changement de statut | admin ou service_role |
| `notify-contact` | Alerte formulaire de contact | publique (à durcir, voir backlog) |
| `auth-email-hook` | Emails d'authentification via Resend | signature Standard Webhooks |
| `generate-invoice` | Facture PDF/HTML | — |
| `process-email-queue` | Vide la file pgmq via Resend | service_role (cron) |

Code partagé : `supabase/functions/_shared/` (catalogue, grille pro, formatage, emails).
Le front réexporte la grille via `src/lib/proPricing.ts` : **une seule source de prix**.

## Front

- `src/pages/` : pages (Index, Professionnels, Precommande2027, ProductDetail, AdminDashboard…).
- `src/components/Seo.tsx` : balises par page ; `src/lib/seo/` : routes et JSON-LD.
- `scripts/prerender.mjs` : rendu SSR des routes publiques après `vite build` ; `dist/spa.html` en repli.
- i18n : `src/i18n/{fr,en}.ts`, langue stockée côté navigateur (même URL en FR/EN, pas de hreflang).
- Tests : `src/test/` (vitest + jsdom, client Supabase simulé) — cohérence prix front/serveur,
  routes FR/EN, panier, SEO, formulaires.

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
