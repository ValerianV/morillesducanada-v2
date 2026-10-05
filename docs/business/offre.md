# Offre commerciale — source de vérité

Dernière mise à jour : 2026-09-29. Toute modification doit être validée par le fondateur
et reportée dans `docs/decisions.md`, le code (`supabase/functions/_shared/proPricing.ts`,
`_shared/catalog.ts`), Stripe et les emails (`docs/commercial/`). Lancer ensuite `/verifier-coherence`.

## Vente réservée aux professionnels (décision du 2026-09-28)

Le site ne vend plus qu'aux professionnels : restaurants, épiceries fines, traiteurs, distributeurs.
Raison : la vente aux consommateurs impose l'adhésion à un médiateur de la consommation
(art. L612-1 du Code de la consommation), que le fondateur refuse de payer.

Mention visible sur le site : **« Vente réservée aux professionnels — SIRET demandé à la commande. »**
Plus de panier, plus de pots ni de sous vide au détail, plus de compte client public.

## Produit

- Morilles de feu **sauvages** du Canada (Colombie-Britannique, Yukon), cueillies sur forêts brûlées.
- Séchées, **entières et équeutées** (pied retiré).
- Variétés mélangées (brune, blonde, grise). Pas de vente par variété.
- Stock physiquement en France.
- Conditionnement des commandes : **sachets sous vide de 250 g** (par exemple, 3 kg = 12 sachets).
- Épiceries fines : sachets sous vide à reconditionner sous leur marque, avec en option des **pots en verre vides** (voir « Option pots »).
- Goût : arôme intense, chair ferme. **Aucune note « fumée »** (non validée).

## Statut fiscal

Entrepreneur individuel (EI), micro-entreprise en franchise de TVA. Mention obligatoire sur site,
devis, factures : **« Prix nets — TVA non applicable, art. 293 B du CGI »**.
Factures : SIRET du vendeur, numéro, date, client (raison sociale et SIRET), détail des produits.

## Grille au kilo

| Quantité | Prix net | Lien de paiement Stripe (port inclus, France) |
|---|---|---|
| 1 kg | 350 €/kg | https://buy.stripe.com/3cI4gz2tn2tRegv3hmbQY02 |
| 3 kg et + | 330 €/kg | 3 kg : https://buy.stripe.com/5kQ00j2tn6K73BR19ebQY03 |
| 5 kg et + | 310 €/kg | 5 kg : https://buy.stripe.com/28E5kDgkd8Sf0pFf04bQY04 |
| 10 kg et + | 290 €/kg | 10 kg : https://buy.stripe.com/14A28rd814BZgoDaJObQY05 |

- Minimum **1 kg**, par pas de **0,5 kg**, maximum **45 kg** (stock).
- Le prix du palier atteint s'applique à toute la quantité.
- **Port inclus, livraison en France uniquement.** Expédition **sous 5 jours ouvrés**. Jamais « 48 h ».
- Chaque lien de paiement doit demander la société et le SIRET (champs personnalisés Stripe
  `company` et `siret`) : réglage à faire côté Stripe par le directeur.
- **Prix plancher de négociation : voir `docs/interne/confidentiel.md` (non versionné). Jamais sur le site ni dans un email.**

## Option pots (décision du 2026-09-29)

Surtout pour les épiceries, qui remplissent et étiquettent elles-mêmes.

- Pots en verre **vides, sans étiquette**, refermables, en **12, 30 et 45 g**.
- **1,50 € net par pot, quelle que soit la taille** (TVA non applicable, art. 293 B). Morilles au prix de la grille.
- Les morilles partent en sachets sous vide de 250 g ; les pots partent **vides, à part**.
- Le client choisit sa quantité (1 à 45 kg, pas de 0,5 kg), puis le nombre de pots par format ;
  un format « compléter » se remplit automatiquement : floor((grammes − pots saisis) / taille).
  Le reste de moins d'un pot est livré **en vrac**, dans les sachets. Exemple : 2 kg = 20 pots de 45 g
  + 36 pots de 30 g = 56 pots, 1 980 g en pots, 20 g en vrac, **700 € + 84 € = 784 €**.
- Stock de pots **provisoire** : 250 × 12 g, 250 × 30 g, 200 × 45 g. Tout dépassement est refusé
  (site et serveur). Le stock n'est pas décompté automatiquement : mettre à jour `POT_STOCK` après les ventes.
- Commande possible sans pots.
- Code : `supabase/functions/_shared/potAllocation.ts` (`POT_PRICE_CENTS`, `POT_STOCK`, calcul),
  configurateur `src/components/pro/ProOrderConfigurator.tsx`, edge function `create-pro-checkout`.
- Jamais de prix d'achat des pots dans le code ni dans les docs versionnés.

## Commander

1. **Commande en ligne** sur `/professionnels#commander` : quantité au choix, pots en option, paiement par carte
   (session Stripe calculée par le serveur pour la commande ; société et SIRET obligatoires, France uniquement).
2. **Devis en ligne** sur `/professionnels` (SIRET obligatoire, clé de Luhn vérifiée) : réponse **sous 48 h ouvrées**.
3. **Liens de paiement** Stripe ci-dessus (1, 3, 5 ou 10 kg) : retirés du site, utilisables en envoi direct.
4. **Virement sur facture** : par Stripe (IBAN dédié par client) ou sur les coordonnées bancaires indiquées
   sur la facture. Aucun IBAN dans le code, les docs ou les modèles d'email.

Paiement **à la commande** (carte ou virement). Pénalités de retard : 3 fois le taux d'intérêt légal ;
indemnité forfaitaire de recouvrement : 40 €. Pas de droit de rétractation (ventes entre professionnels).
Réclamation transport : sous 48 h à réception.

## Échantillon : remis en main propre lors d'une dégustation (décisions du 2026-10-01)

Un **pot en verre de 30 g**, refermable, offert, **remis en main propre** lors d'une dégustation, quand le fondateur
est dans la zone du prospect. **Envoi possible au cas par cas, après un échange téléphonique avec Valérian**, uniquement à un
établissement que nous avons démarché et qui répond. Le formulaire du site ne déclenche **jamais** d'envoi, et
« envoi gratuit sur simple demande » ne doit apparaître nulle part. Raison : on peut trop facilement usurper
l'identité de plusieurs établissements pour obtenir plusieurs échantillons par la poste.

- Demande : onglet « Dégustation en main propre » de `/professionnels` (SIRET, ville, code postal, disponibilités ;
  plus d'adresse de livraison). Valérian recontacte le prospect pour convenir d'un rendez-vous.
- Calendrier 2026 (constante `TASTING_TOUR` dans `supabase/functions/_shared/tasting.ts`, à modifier à cet endroit) :
  **Avignon et Provence jusqu'au 7 novembre** ; **Chamonix et Mont-Blanc à partir du 8 novembre** ;
  **Maurienne (Val Cenis, Valloire) en décembre**. Hors de ces zones : « contactez-nous, nous étudions chaque demande ».
- Après modification du calendrier : `llms.txt` et `llms-full.txt` (générés au build) suivent automatiquement ; reporter à la main dans la plaquette pro si besoin.
- Les pots de 12, 30 et 45 g (en verre, refermables) servent aussi à l'option pots (livrés vides, voir plus haut).

## Précommande saison 2027 (professionnels uniquement)

- 300 €/kg, **acompte 50 %** à la commande (150 €/kg), solde facturé avant expédition.
- 1 à 15 kg par précommande, par kg entier. **Société et SIRET obligatoires** au paiement (Stripe).
- **Livraison garantie en octobre 2027, en France, port inclus.**
- **Remboursement intégral de l'acompte** s'il est impossible de fournir.
- Stripe : produit `prod_VLJz63xzroGcDj`, prix acompte `price_1UKdLnEQBCcpAKNIOZmNqQ3A` (150 € × kg).
- L'acompte finance la cueillette au printemps : c'est la raison d'être du 50 %.

## Anciens prix de détail (archivés)

Pots 12/30/45 g et sous vide 100 g à 1 kg : plus vendus. Les prix Stripe correspondants
(`price_1TMjYzEQBCcpAKNI4vXm39ml`, `price_1TMjYzEQBCcpAKNIH2MscUC7`, `price_1TMjZ0EQBCcpAKNIPAdnkCjp`,
`price_1TMjZ1EQBCcpAKNInOHFVheb`, `price_1TMjZ2EQBCcpAKNIsTdQpP5x`, `price_1TMjZ2EQBCcpAKNI1I5ikvav`,
`price_1TMjZ3EQBCcpAKNIY6emeuWP`, `price_1UKjo2EQBCcpAKNIMbIj8954`) sont à archiver après le déploiement.
`create-checkout` répond désormais 410.

## Stock et coûts

Informations internes (stock par propriétaire, coûts d'achat, marges, plancher) :
`docs/interne/confidentiel.md`, **non versionné** (voir `.gitignore`). Demander au fondateur s'il est absent.
Stock de départ communicable : ≈ 45 kg en France (septembre 2026).
