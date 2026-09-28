# Offre commerciale — source de vérité

Dernière mise à jour : 2026-09-28. Toute modification doit être validée par le fondateur
et reportée dans `docs/decisions.md`, le code (`_shared/catalog.ts`, `_shared/proPricing.ts`,
`src/lib/products.ts`), Stripe et les emails (`docs/commercial/`). Lancer ensuite `/verifier-coherence`.

## Produit

- Morilles de feu **sauvages** du Canada (Colombie-Britannique, Yukon), cueillies sur forêts brûlées.
- Séchées, **entières et équeutées** (pied coupé : aucun poids perdu à la réhydratation).
- Variétés mélangées (brune, blonde, grise). Pas de vente par variété.
- Stock physiquement en France.

## Statut fiscal

Auto-entrepreneur en franchise de TVA. Mention obligatoire sur site, devis, factures :
**« Prix nets — TVA non applicable, art. 293 B du CGI »**.
Factures pro : SIRET, numéro, date, client, détail des produits.

## Détail (particuliers) — panier du site

| Format | Prix | €/kg | Stripe price |
|---|---|---|---|
| Pot 12 g | 12 € | 1 000 | `price_1TMjYzEQBCcpAKNI4vXm39ml` |
| Pot 30 g | 23 € | 767 | `price_1TMjYzEQBCcpAKNIH2MscUC7` |
| Pot 45 g | 29 € | 644 | `price_1TMjZ0EQBCcpAKNIPAdnkCjp` |
| Sous vide 100 g | 59 € | 590 | `price_1TMjZ1EQBCcpAKNInOHFVheb` |
| Sous vide 200 g | 110 € | 550 | `price_1TMjZ2EQBCcpAKNIsTdQpP5x` |
| Sous vide 500 g | 240 € | 480 | `price_1TMjZ2EQBCcpAKNI1I5ikvav` |
| Sous vide 1 kg | 420 € | 420 | `price_1TMjZ3EQBCcpAKNIY6emeuWP` |

Priorité commerciale : pousser les formats **sous vide** (500 g présélectionné, 1 kg = meilleur prix au kilo).

## Professionnels — à partir de 1 kg

| Quantité | Prix net | Lien de paiement (port inclus, France) |
|---|---|---|
| 1 kg | 350 €/kg | https://buy.stripe.com/3cI4gz2tn2tRegv3hmbQY02 |
| 3 kg et + | 330 €/kg | 3 kg : https://buy.stripe.com/5kQ00j2tn6K73BR19ebQY03 |
| 5 kg et + | 310 €/kg | 5 kg : https://buy.stripe.com/28E5kDgkd8Sf0pFf04bQY04 |
| 10 kg et + | 290 €/kg | 10 kg : https://buy.stripe.com/14A28rd814BZgoDaJObQY05 |

- Pas de 500 g pro (lien `plink_1UKcvEEQBCcpAKNIJkV9lilO` désactivé) : le 500 g reste un format grand public.
- Quantités intermédiaires : devis via `/professionnels` (de 1 à 45 kg par pas de 0,5 kg).
- **Prix plancher de négociation : voir `docs/interne/confidentiel.md` (non versionné). Jamais sur le site ni dans un email.**
- Livraison pros : **France uniquement**, port inclus.

## Précommande saison 2027 (pros et particuliers)

- 300 €/kg, **acompte 50 %** à la commande (150 €/kg), solde facturé avant expédition.
- 1 à 15 kg par précommande, par kg entier.
- **Livraison garantie en octobre 2027.**
- **Remboursement intégral de l'acompte** s'il est impossible de fournir.
- Stripe : produit `prod_VLJz63xzroGcDj`, prix acompte `price_1UKdLnEQBCcpAKNIOZmNqQ3A` (150 € × kg).
- L'acompte finance les cueilleurs : c'est la raison d'être du 50 %.

## Livraison (particuliers)

| Zone | Frais | Offert dès |
|---|---|---|
| France | 6,90 € | 50 € |
| Union européenne | 9,90 € | 100 € |

Expédition **sous 5 jours ouvrés**. Jamais « 48 h ».

## Échantillons pros

Un pot de **30 g** offert par établissement qualifié (formulaire `/professionnels`, 1 par société).

## Stock et coûts

Informations internes (stock par propriétaire, coûts d'achat, marges, plancher) :
`docs/interne/confidentiel.md`, **non versionné** (voir `.gitignore`). Demander au fondateur s'il est absent.
Stock de départ communicable : ≈ 45 kg en France (septembre 2026).
