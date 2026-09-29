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
- Leads pros → commandes (devis, liens de paiement, virements) ; échantillons envoyés → commandes.
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
- [ ] Option pots : stock définitif et décompte automatique (aujourd'hui `POT_STOCK` est une constante provisoire) ; relecture des CGV du 29 septembre 2026 par le fondateur.
- [ ] `supabase/config.toml` : `create-preorder-checkout` absent (verify_jwt par défaut), à aligner sur `create-pro-checkout`.

### P2
- [x] Lien du hook d'authentification sans jeton de vérification (B8 de l'audit dev) : corrigé
      sur `feat/finitions` (`_shared/authEmails.ts`), à vérifier en production (inscription, mot de passe oublié).
- [ ] Changement d'email sécurisé (`email_change` avec `token_hash_new`) : non testé, la fonction n'est
      pas proposée sur le site. À tester avant de l'ouvrir.
- [ ] Durcir `notify-contact` (public ; HTML désormais échappé via `_shared/orderEmails.ts`) ; insertion anonyme `pre_orders` ;
      `reviews.approved` vrai par défaut ; index unique sur `orders.stripe_session_id` ; CORS `*`.
- [ ] Avis de professionnels (email après livraison) ; les trois avis actuels viennent de particuliers.
- [ ] Journal du cueilleur : 3 récits (2022, 2023, 2024) avant de le réafficher (aujourd'hui noindex).
- [ ] Photos : sachet sous vide de 250 g avec repère d'échelle, gros plan de morilles sèches équeutées,
      colis prêt à partir (sans partenaire visible).
- [ ] Liens de paiement Stripe : champs `company` et `siret` obligatoires (directeur).
- [ ] Archiver les anciens prix Stripe de détail après le déploiement.
- [ ] Fiche technique : DDM, numéro de lot, lieu de conditionnement et allergènes à confirmer par écrit
      par le fondateur avant de les publier ; rendement mesuré à la réhydratation.
- [ ] Vrais PDF pour la plaquette pro et la fiche technique.
- [ ] Traçabilité 2027 : envois commerciaux déclarés, preuve de provenance présentable.

### P3
- [ ] URLs `/en/…` + hreflang pour indexer l'anglais.
- [ ] Nettoyer les images inutilisées de `public/images` (≈ 1 Mo), `react-query` et double système de toasts.
- [ ] Vente pros hors de France (TVA intracommunautaire, douane Suisse) si la demande existe.
