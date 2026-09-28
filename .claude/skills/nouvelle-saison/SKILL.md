---
name: nouvelle-saison
description: Préparation annuelle d'une saison de morilles de feu (fin d'hiver) — étude de marché, stock, grille de prix, précommande, récit et site mis à jour. À lancer vers février-mars chaque année.
---

# /nouvelle-saison

1. **Bilan de la saison écoulée** : kg vendus par canal et par format, prix moyen obtenu, stock
   restant, précommandes livrées ou remboursées. Sources : Supabase (`orders`, `pre_orders`,
   `pro_leads`) et Stripe.
2. **Étude de marché** : refaire les relevés de `docs/business/marche.md` (prix de gros et de détail
   par origine, concurrents, surfaces brûlées au Canada l'année précédente, qui annoncent
   l'abondance de la saison). Chaque prix doit être sourcé par une URL. Écrire le résultat dans
   `docs/business/etude-marche-AAAA-MM.md` et mettre à jour la synthèse.
3. **Questions au fondateur** (ne rien supposer) :
   - volumes disponibles et coûts d'approvisionnement ;
   - dates de cueillette et de livraison ;
   - conditions de la précommande (prix, acompte, plafond, garantie) ;
   - nouveaux faits pour le récit.
4. **Proposition de grille** avec marges, puis validation du fondateur. Entrée dans `docs/decisions.md`.
5. **Mise à jour** : `docs/business/offre.md`, `docs/business/recit.md` ; code (catalogue, grille,
   saison de précommande, textes, SEO) sur une branche ; produits et prix Stripe (en archivant les
   anciens, jamais en les supprimant).
6. `/verifier-coherence` puis `/deployer`.
7. Préparer la campagne de précommande (`/prospect-b2b`) et la présenter au fondateur pour validation.
