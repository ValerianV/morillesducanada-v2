---
name: verifier-coherence
description: Vérifier que prix, frais de port, délais, mentions fiscales et affirmations du récit sont identiques partout (docs, code, site en ligne, Stripe, emails de prospection). À lancer après tout changement d'offre ou de texte.
---

# /verifier-coherence

La source de vérité est `docs/business/offre.md` (prix, port, précommande) et `docs/business/recit.md`
(faits autorisés et interdits). Tout écart doit être signalé, jamais corrigé en silence dans la
source de vérité.

## Contrôles

1. **Code** : `supabase/functions/_shared/catalog.ts`, `_shared/proPricing.ts`, `src/lib/products.ts`
   correspondent à `offre.md`. Lancer `npx vitest run` (les tests de cohérence doivent passer).
2. **Stripe live** (MCP Stripe, lecture) : les prix actifs référencés dans le code existent et ont le bon
   montant ; les liens de paiement pros actifs correspondent à la grille ; le lien 500 g est inactif.
3. **Site** : rechercher dans `src/` et dans le HTML prérendu (`dist/`) :
   - des prix qui ne sont pas dans `offre.md` (`grep -rnE "[0-9]+ ?€"`) ;
   - « 48 h », « 48h », « 72 h », « HT », « TVA 5,5 » ;
   - le prix plancher (280) ;
   - les affirmations interdites listées dans `recit.md` ;
   - l'absence de la mention « TVA non applicable, art. 293 B » près des prix.
4. **Emails** : `docs/commercial/*.md`, avec les mêmes recherches.
5. **Confidentialité** : aucun nom de partenaire au Canada dans `src/`, `docs/commercial/` ou `public/`.

## Sortie

Tableau des écarts (fichier:ligne, trouvé, attendu), puis proposition de correctifs sur une branche.
Toute nouvelle règle ou décision va dans `docs/decisions.md`.
