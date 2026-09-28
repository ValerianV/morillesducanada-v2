---
name: prospect-b2b
description: Préparer une vague de prospection B2B Morilles du Canada (épiceries fines premium, traiteurs haut de gamme, tables gastronomiques) — sélection des prospects, emails personnalisés, relances — sans jamais envoyer sans validation du fondateur.
---

# /prospect-b2b [segment] [nombre] [contexte]

Exemples : `/prospect-b2b epiceries 20 "fêtes de fin d'année"`, `/prospect-b2b chefs 10 "précommande 2027"`.

## Sources obligatoires (à lire avant d'écrire une ligne)

- `docs/business/offre.md` : prix, conditions, précommande. Ne jamais citer le prix plancher.
- `docs/business/recit.md` : faits autorisés et interdits. Aucun partenaire nommé.
- `docs/commercial/strategie.md` : cibles, exclusions, processus, cadre légal.
- `docs/commercial/emails-prospection.md` : séquences de référence par segment.
- `docs/commercial/prospects.csv` : base de prospects (ne pas recontacter ceux qui ont dit STOP).

## Étapes

1. **Sélection** : prospects du segment demandé, en priorité 1 d'abord, avec un email professionnel
   **public** vérifié sur leur propre site (jamais deviné). Exclure brasseries, bouchons, restauration à
   prix moyen, grossistes de volume et prospects hors de France.
2. **Personnalisation** : un fait vérifiable et récent sur l'établissement (plat à la carte, rayon,
   produit fabriqué), vérifié le jour même avec WebFetch.
3. **Email** (modèle dans `emails-prospection.md`) :
   - objet concret ;
   - 1 phrase de personnalisation ;
   - 2 phrases de récit : 3 saisons de cueillette du fondateur (2022–2024, Colombie-Britannique et
     Yukon), réseau de cueilleurs, sauvage et non de culture ;
   - produit : entières, équeutées, stock en France, 5 jours ouvrés ;
   - grille nette avec la mention art. 293 B ;
   - lien `/professionnels` avec UTM ;
   - proposition d'échantillon de 30 g ;
   - signature et ligne STOP.

   Relances J+5 et J+12, dont une qui cite la précommande 2027.
4. **Livrable** : `docs/commercial/vagueN.md` (une section par prospect : destinataire, objet, corps),
   plus la liste à part des prospects qui ne sont joignables que par téléphone ou formulaire.
5. **Validation** : présenter la vague au fondateur. **Aucun envoi sans son feu vert explicite.**
6. **Après validation** : envoi via Resend depuis `Valérian <valerian@pro.morillesducanada.com>`,
   `reply_to: contact@morillesducanada.com`, 20 emails par jour au maximum, puis statut mis à jour
   dans `prospects.csv`.

## Ton

Vouvoiement, sobre, concret, sans superlatifs creux ni emojis. Un email se lit en 30 secondes.
