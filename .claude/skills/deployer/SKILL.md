---
name: deployer
description: Mettre en production Morilles du Canada (migrations Supabase, edge functions, site Vercel) dans le bon ordre, avec contrôles avant et après. Utiliser pour toute livraison en production.
---

# /deployer

Runbook complet : `docs/tech/deploiement.md`. Cette skill l'exécute pas à pas.

1. **Lire** `docs/tech/deploiement.md` et `CLAUDE.md`. Identifier la branche à livrer et ce qu'elle
   change : `git log main..<branche> --oneline`, puis `git diff --stat main..<branche> -- supabase/`.
2. **Vérifier la branche** : `npx tsc --noEmit -p tsconfig.app.json && npx vitest run && npm run build`,
   ainsi que `deno check` sur chaque fonction modifiée. Si quelque chose échoue, on arrête.
3. **Lister précisément** au fondateur ce qui va partir : migrations (ordre), fonctions, secrets requis,
   impact visible. **Attendre son feu vert explicite.**
4. Exécuter dans l'ordre : secrets/vault → migrations → edge functions → push de la branche →
   preview Vercel vérifiée → fusion dans `main`.
5. Lancer les contrôles de la section 5 du runbook et consigner les résultats (commande + sortie).
6. En cas d'échec : retour arrière (section « Retour arrière »), puis rapport au fondateur.
7. Ajouter une entrée datée dans `docs/decisions.md` (ce qui a été livré) et cocher le backlog
   dans `docs/amelioration-continue.md`.

Ne jamais déployer le site avant les fonctions. Ne jamais lancer `supabase db push` sur une base
où des migrations Lovable ne sont pas marquées comme appliquées.
