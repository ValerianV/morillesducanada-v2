# Offre commerciale — source de vérité

Dernière mise à jour : 2026-09-28. Toute modification doit être validée par le fondateur
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
- Épiceries fines : vrac sous vide uniquement, à reconditionner sous leur marque. Pas de pots revendeur.
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

## Commander

1. **Devis en ligne** sur `/professionnels` (SIRET obligatoire, clé de Luhn vérifiée) : réponse **sous 48 h ouvrées**.
2. **Paiement direct** par les liens Stripe ci-dessus (1, 3, 5 ou 10 kg).
3. **Virement sur facture** : par Stripe (IBAN dédié par client) ou sur les coordonnées bancaires indiquées
   sur la facture. Aucun IBAN dans le code, les docs ou les modèles d'email.

Paiement **à la commande** (carte ou virement). Pénalités de retard : 3 fois le taux d'intérêt légal ;
indemnité forfaitaire de recouvrement : 40 €. Pas de droit de rétractation (ventes entre professionnels).
Réclamation transport : sous 48 h à réception.

## Échantillon

Un **pot en verre de 30 g**, refermable, offert par établissement (formulaire `/professionnels`, un par SIRET).
Les pots de 12, 30 et 45 g (en verre, refermables) ne servent plus qu'aux échantillons.

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
