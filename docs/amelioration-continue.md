# Amélioration continue

## Rituels

| Fréquence | Skill | Sortie |
|---|---|---|
| Chaque semaine (lundi) | `/suivi-commercial` | point pipeline : leads, devis, relances dues, kg vendus / restants |
| Chaque mois | `/revue-site` | rapport `docs/audits/AAAA-MM-revue-site.md` + corrections sur une branche |
| Après chaque changement d'offre | `/verifier-coherence` | prix et mentions identiques partout |
| Chaque année (février–mars) | `/nouvelle-saison` | étude de marché, grille, précommande, récit à jour |

## Indicateurs à suivre

- Kg vendus / kg en stock ; kg précommandés 2027 (objectif à fixer avec le fondateur).
- Leads pros reçus, taux de réponse par vague, taux devis → commande.
- Taux de conversion du panier, part du sous vide dans le chiffre d'affaires.
- Pages indexées (Search Console), positions sur « morilles séchées », « morilles sauvages du Canada ».

## Backlog (priorisé)

### P1
- [ ] Surveiller le budget Disk IO chaque semaine (`/suivi-commercial`) ; alerte si > 50 % consommé.
- [ ] Activer une sauvegarde : le plan gratuit n'en fait aucune — exporter la base chaque semaine (`supabase db dump`) tant qu'on reste en gratuit.
- [ ] Mettre en production la branche `feat/tunnel-pro` (sécurité + tunnel pro + SEO + précommande) — `docs/tech/deploiement.md`.
- [ ] Vérifier le domaine Resend `pro.morillesducanada.com` puis envoyer la vague 1 après validation.
- [ ] Google Search Console + sitemap.
- [ ] Stock réel dans une table Supabase (aujourd'hui « 45 kg » est une constante) et décompte automatique.
- [ ] Colonne `statut` dans `docs/commercial/prospects.csv` ou CRM (à décider).

### P2
- [ ] Lien du hook d'authentification sans jeton de vérification (B8 de l'audit dev).
- [ ] Durcir `notify-contact` (public, HTML non échappé) ; insertion anonyme `pre_orders` ;
      `reviews.approved` vrai par défaut ; index unique sur `orders.stripe_session_id` ; CORS `*`.
- [ ] Collecter les premiers avis (email post-achat) puis réafficher la section avis.
- [ ] Fiche technique harmonisée (délais de séchage, conservation, rendement) — données à fournir par le fondateur.
- [ ] Vrais PDF pour la plaquette pro et la fiche technique.
- [ ] Traçabilité 2027 : envois commerciaux déclarés, preuve de provenance présentable.

### P3
- [ ] URLs `/en/…` + hreflang pour indexer l'anglais.
- [ ] Nettoyer les images inutilisées de `public/images` (≈ 1 Mo), `react-query` et double système de toasts.
- [ ] Vente pros hors de France (TVA intracommunautaire, douane Suisse) si la demande existe.
