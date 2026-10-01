---
name: revue-site
description: Audit mensuel du site morillesducanada.com — bugs, SEO, performance, conversion (surtout sous vide et pros), cohérence de l'offre — avec rapport daté et corrections sur une branche.
---

# /revue-site

1. **Préparer** : lire `CLAUDE.md`, `docs/business/offre.md`, `docs/business/recit.md`
   et le dernier rapport dans `docs/audits/`.
2. **Qualité du code** : `npx tsc --noEmit -p tsconfig.app.json`, `npx vitest run`, `npm run build`, `npm run lint`.
3. **Site en ligne** (skill `/browse`, mobile 375 px et desktop) :
   - accueil ;
   - `/produits` et une fiche sous vide ;
   - panier jusqu'à la page Stripe (sans payer) ;
   - `/professionnels` (devis et dégustation, sans envoyer) ;
   - `/precommande-2027` ;
   - passage FR/EN ;
   - page 404 ;
   - erreurs dans la console.
4. **SEO** :
   - un seul H1 par page ;
   - title, description et canonical en www ;
   - JSON-LD valide et prix identiques à `offre.md` ;
   - `sitemap.xml` et `robots.txt` ;
   - HTML prérendu présent (`curl -s <url> | grep canonical`).
   Si le fondateur y a accès, consulter aussi Search Console : pages indexées, requêtes, erreurs.
5. **Performance** : taille des bundles (`npm run build`), poids des images ajoutées depuis le dernier audit.
6. **Conversion** : le sous vide et l'offre pro sont-ils visibles en moins de 5 secondes ?
   Les CTA sont-ils clairs ? Le formulaire pose-t-il des frictions ?
7. **Cohérence** : lancer `/verifier-coherence`.
8. **Rapport** dans `docs/audits/AAAA-MM-revue-site.md` : problèmes classés P0/P1/P2, avec fichier:ligne
   et correctif proposé. Faire les corrections sur une branche `fix/revue-AAAA-MM`, sans déployer.
   Mettre à jour le backlog de `docs/amelioration-continue.md`.
