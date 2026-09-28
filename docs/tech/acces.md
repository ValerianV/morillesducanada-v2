# Accès et services externes

**Aucun secret en clair dans ce dépôt.** Les secrets vivent dans Supabase (secrets des edge functions
et vault), Vercel (variables d'environnement), et chez le fondateur.

| Service | Identifiant | Comment un agent y accède |
|---|---|---|
| GitHub | `ValerianV/morillesducanada-v2` (privé), branche de prod `main` | `git push` depuis le dépôt local |
| Vercel | équipe `valerianvs-projects`, projet `morillesducanada-v2` (`prj_DDNtpNfN4E9glJO6RCUzUHCvDiOD`) | intégration GitHub (push sur `main` = production), API/CLI avec token du fondateur |
| Supabase | projet `oeweykyazadobobjncfg` | MCP Supabase (OAuth via `/mcp` dans un terminal `claude`) ou dashboard dans le navigateur intégré |
| Stripe | compte `acct_1TAZxpEQBCcpAKNI` (live) | MCP Stripe (lecture/écriture autorisées dans `.claude/settings.local.json`) |
| Resend | domaines `morillesducanada.com` (transactionnel) et `pro.morillesducanada.com` (prospection) | API avec clé du fondateur |
| DNS | IONOS, `morillesducanada.com` | navigateur intégré (compte du fondateur) — modification = validation du fondateur |
| Email | `contact@morillesducanada.com` | boîte du fondateur |

## Secrets attendus (noms uniquement)

- Supabase edge functions : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`,
  `SEND_EMAIL_HOOK_SECRET` (format `v1,whsec_…`), `PRO_LEAD_IP_SALT`.
- Supabase vault : `SUPABASE_SERVICE_ROLE_KEY` (JWT legacy).
- Vercel (build) : `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (publiques).

## Mode automatique et permissions

En mode automatique, Claude Code refuse certaines actions (déploiement production, DNS,
modification de ses propres permissions) même si l'utilisateur les demande dans la conversation.
Le fondateur doit alors : valider l'action, ou ajouter une règle dans
`.claude/settings.local.json`, ou passer la session en mode « demander ».
