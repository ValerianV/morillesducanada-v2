---
name: relances-dues
description: Tâche quotidienne (lundi–samedi matin) — lister les relances dues dans le carnet de démarchage (J+5, J+12, rendez-vous demandé depuis 4 jours, SMS de suivi après visite) et préparer les messages pour validation, sans rien envoyer.
---

# /relances-dues

Contexte : `docs/commercial/strategie.md` (ordre des canaux, règles WhatsApp), `docs/commercial/demande-rdv.md`,
`docs/commercial/emails-prospection.md` (section 0). Carnet : https://claude.ai/artifact/R9M8EhDc4rVHk6GQ5UQFiT.

1. Lire la collection `prospects`. Sont dues aujourd'hui (ou en retard) :
   - statut `contacte` et `relance_j5` ≤ aujourd'hui ; statut `relance_1` et `relance_j12` ≤ aujourd'hui ;
   - statut `rdv_demande` et `date_demande` + 4 jours ≤ aujourd'hui → relance par un AUTRE canal (WhatsApp si un mobile
     est publié, sinon appel à faire par Valérian) ;
   - statut `visite` et `date_visite` + 3 jours ≤ aujourd'hui → SMS de suivi « avez-vous pu les essayer ? ».
   Ignorer `stop`, `perdu`, `client` et les fiches dont la note signale une fermeture en cours.
2. Rédiger chaque message au ton validé : relance email = vraie réponse dans le fil (« Re: » + message d'origine cité,
   repris de `email_texte`), sans lien suivi, sans précommande, sans formule STOP. WhatsApp : un message court, jamais
   le même jour qu'un email.
3. Écrire la liste dans `docs/interne/relances/AAAA-MM-JJ.md` : pour chaque prospect, canal, destinataire, texte, et
   la liste des appels à passer (numéro, meilleur créneau 15 h – 17 h, accroche de la fiche).
4. Rapport de 5 lignes : nombre de relances par canal, appels à passer, rien d'autre.

Interdit : envoyer quoi que ce soit. L'envoi se fait seulement après le feu vert explicite de Valérian, par une tâche
ponctuelle ou dans la conversation.
