---
name: sante-technique
description: Tâche hebdomadaire (dimanche soir) — contrôler le site en production, Supabase (disque, tâches cron, erreurs des fonctions), les envois d'emails, Stripe et les rapports DMARC ; n'alerter que s'il y a un problème.
---

# /sante-technique

Contexte : `docs/tech/architecture.md`, `docs/tech/deploiement.md`, `docs/decisions.md` (incidents passés).
Lecture seule partout : aucune correction en production sans le feu vert de Valérian.

1. **Site** : `curl` des pages clés (/, /professionnels, /precommande-2027, /valerian-vilane, /sitemap.xml, /llms.txt) :
   code 200 attendu ; `/recettes/inexistante` doit répondre 404 ; redirection 308 de `morillesducanada.com` vers www.
2. **Supabase** (projet `oeweykyazadobobjncfg`, MCP) : taille des 10 plus grosses tables, `cron.job` (actifs, horaires),
   derniers `cron.job_run_details` en échec, nombre d'appels HTTP de la semaine (`net._http_response`), logs d'erreurs des
   edge functions. Alerte si `cron.job_run_details` > 5 000 lignes ou si une tâche échoue.
3. **Emails** : Resend (clé dans `docs/interne/secrets.env`, en-tête `User-Agent`) — domaines vérifiés, taux de rebond
   de la semaine. DMARC : rapports reçus dans Gmail cette semaine (`dmarc newer_than:7d`) ; signaler toute source qui échoue.
4. **Stripe** (lecture) : paiements de la semaine, litiges, échecs.
5. **Rapport** dans `docs/interne/sante/AAAA-MM-JJ.md` : « tout va bien » en une ligne, ou la liste des problèmes avec
   la cause probable et la correction proposée.
