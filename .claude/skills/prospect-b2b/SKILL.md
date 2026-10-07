---
name: prospect-b2b
description: Préparer une vague de prospection B2B Morilles du Canada (restaurants de qualité, traiteurs haut de gamme, chefs à domicile) pour obtenir des rendez-vous — sélection des prospects, emails personnalisés, relances — sans jamais envoyer sans validation du fondateur.
---

# /prospect-b2b [segment] [nombre] [contexte]

Exemples : `/prospect-b2b traiteurs 20 "fêtes de fin d'année"`, `/prospect-b2b chefs 10 "carte d'hiver"`.

## Sources obligatoires (à lire avant d'écrire une ligne)

- `docs/business/offre.md` : prix, conditions, précommande. Ne jamais citer le prix plancher.
- `docs/business/recit.md` : faits autorisés et interdits. Aucun partenaire nommé.
- `docs/commercial/strategie.md` : cibles, exclusions, processus, cadre légal.
- `docs/commercial/emails-prospection.md` : séquences de référence par segment.
- `docs/commercial/demande-rdv.md` : modèles de demande de rendez-vous (email, WhatsApp, téléphone).
- Le carnet de démarchage (https://claude.ai/artifact/R9M8EhDc4rVHk6GQ5UQFiT) : seule base de prospects. Lire la collection `prospects` (ArtifactData) pour
  éviter les doublons et ne jamais recontacter un prospect « STOP » ou « Pas intéressé ».

## Étapes

1. **Sélection** : prospects du segment demandé, en priorité 1 d'abord, avec un email professionnel
   **public** vérifié sur leur propre site (jamais deviné). Exclure brasseries, bouchons, restauration à
   prix moyen, fromagers, épiceries, grossistes de volume et prospects hors de France.
2. **Personnalisation** : un fait vérifiable et récent sur l'établissement (plat à la carte, rayon,
   produit fabriqué), vérifié le jour même avec WebFetch.
3. **Email** : appliquer d'abord la **section 0 de `emails-prospection.md`** (un humain, pas un robot). En bref :
   - texte brut, 50 à 120 mots, ton parlé, une seule question ;
   - 1 ou 2 phrases propres au prospect (un plat, un rayon, son métier) ;
   - 1 phrase de récit (3 saisons de cueillette 2022–2024, Colombie-Britannique et Yukon ; morille sauvage) ;
   - prix seulement dans le premier email et sans tableau (« à partir de 290 €/kg selon la quantité, port inclus »),
     toujours avec « prix nets, TVA non applicable, art. 293 B du CGI » ;
   - aucun lien suivi : au plus `morillesducanada.com/professionnels`, en clair ;
   - échantillon en main propre (pot de 30 g sec) si le prospect est dans une zone du calendrier
     (`supabase/functions/_shared/tasting.ts`) ; hors zone, envoi postal seulement après un échange téléphonique ;
   - signature « Valérian » + téléphone ; porte de sortie humaine (« dites-le-moi, je ne vous relancerai pas »),
     jamais de ligne STOP ni de pied de page automatique.

   Relances J+5 et J+12 : vraies réponses dans le fil (« Re: » + message d'origine cité). Pas de précommande 2027
   tant que le prospect n'a pas eu le produit en main.
4. **Livrable** : `docs/commercial/vagueN.md` (une section par prospect : destinataire, objet, corps),
   plus la liste à part des prospects qui ne sont joignables que par téléphone ou formulaire.
5. **Validation** : présenter la vague au fondateur. **Aucun envoi sans son feu vert explicite.**
6. **Après validation** : envoi via Resend depuis `Valérian <valerian@morillesducanada.com>` (sans en-tête List-Unsubscribe, envois étalés),
   `reply_to: contact@morillesducanada.com`, 20 emails par jour au maximum, puis statut « RDV demandé » et texte envoyé
   écrits dans le carnet le jour même. WhatsApp : règles de `strategie.md`.

## Ton

Vouvoiement, sobre, concret, sans superlatifs creux ni emojis. Un email se lit en 30 secondes.
