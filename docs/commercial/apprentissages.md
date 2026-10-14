# Apprentissages de la prospection

Mis à jour chaque lundi par `/suivi-commercial` (étape « Apprendre »). Chaque ligne : ce qu'on a mesuré, ce qu'on en
conclut, ce qu'on change. Un changement de règle passe par la validation de Valérian, puis `docs/decisions.md`.
Petits échantillons : une conclusion n'est solide qu'à partir d'environ 30 contacts par variante.

## Mesures au 2026-10-10 (carnet, 95 prospects contactés)

| Variante | Contactés | Réponses | Intéressés / RDV | Refus |
|---|---|---|---|---|
| Email de présentation (vagues 1-3, 29/09-03/10) | 44 | 3 (7 %) | 0 | 3 |
| Email « demande de rendez-vous » (vagues 4-5) | 45 | 4 (9 %) | 2 | 2 |
| WhatsApp « demande de rendez-vous » | 6 | 2 (33 %) | 0 | 1 |

- Les 2 intéressés (Cuisine Centr'Halles, Le Goût du Jour) : restaurants de chef indépendant, centre d'Avignon
  (≈ 1 km), email avec une phrase sur leur carte. Réponse dans les 2 à 4 heures après l'envoi.
- Refus motivés : « déjà un fournisseur » (grande maison, Fines Roches), « uniquement la morille française » (O'Rabasse,
  table de terroir truffe). Les tables étoilées et hôtels 5* n'ont encore rien répondu (0 sur 15).
- Vague 5 (09/10, 10 tables étoilées ou d'hôtel) : 0 réponse à J+1.

## Ce qu'on en conclut (confiance entre parenthèses)

1. **Demander un rendez-vous marche mieux que présenter le produit** : 2 intéressés contre 0 (moyenne).
2. **Les chefs-patrons indépendants proches répondent ; les grandes maisons non** : ils décident seuls, sans service
   achats ni fournisseur attitré (moyenne, 2 cas seulement).
3. **WhatsApp fait répondre, mais pas encore dire oui** : 0 intéressé sur 6 (faible, trop peu de messages).
4. **Le prix vient vite** : le premier intéressé a demandé les tarifs avant le rendez-vous ; le coût par couvert
   (1,45 € à 2,80 €) rassure (moyenne).

## Ce qu'on teste ensuite

| Test | Variante A | Variante B | Mesure | Échéance |
|---|---|---|---|---|
| Créneau précis | « dans les deux prochaines semaines » | « je suis à [ville] jeudi 15 entre 14 h et 16 h » | RDV pour 10 contacts | 2 vagues |
| Coût par couvert dans le premier message | absent | « environ 2 € par couvert » | réponses positives | 2 vagues |
| Preuve | aucune | « déjà servies au Simple Simon, à Avignon » (avec l'accord de Sven) | réponses positives | dès l'accord |
| Canal pour les fixes | email seul | appel 15 h – 17 h (fiche d'appels) | RDV pour 10 contacts | fin octobre |

## Journal

- 2026-10-10 : première mesure. Recentrer la cible sur les chefs-patrons indépendants autour d'Avignon ;
  tables étoilées et hôtels 5* en dernier.
- 2026-10-12 (courrier du matin) : la tâche planifiée n'a pas pu écrire dans le carnet (ArtifactData) ni mettre un fil DMARC à la corbeille — permission automatique refusée. Proposition : autoriser ces deux actions pour la tâche.
- 2026-10-12 (relances dues) : 34 fiches à J+4 le même jour (31 demandées le 07/10) → 9 WhatsApp + 24 appels + 1 email. Le plafond de 10 WhatsApp/jour et le créneau d'appel 15 h – 17 h obligent à étaler : les demandes envoyées en un seul lot créent un pic d'appels à J+4. Proposition : limiter les demandes de rendez-vous à ~12 par jour à l'envoi.
- 2026-10-12 : aucune nouvelle réponse depuis le 10/10 ; échantillons toujours < 30 par variante, pas de conclusion. 44 demandes de rendez-vous (07-09/10) : 2 intéressés, tous deux Avignon intra-muros. Proposition : relance courte limitée aux établissements à moins de 10 km, appels pour les fixes.
- 2026-10-12 (relance WhatsApp à J+5 d'un email resté sans réponse, 6 traiteurs et chefs à domicile) : 3 réponses en
  moins de 2 heures (1 intéressée, 1 « absent en octobre, recontacter en novembre », 1 refus « pas de champignons
  séchés », arrivé par email juste après le WhatsApp). L'email seul n'avait rien donné en 5 jours. Conclusion
  (confiance moyenne, 6 contacts) : pour les mobiles publiés, l'enchaînement email puis WhatsApp fait répondre ;
  l'intéressée dit avoir « bien eu le mail » sans y avoir répondu. À refaire sur les prochains J+4.
- 2026-10-12 : une réponse positive le jour même demande un pot disponible. Valérian était en déplacement sans
  stock : rendez-vous reporté. Garder des pots avec soi les jours d'envoi, ou envoyer les jours où il est sur place.
- 2026-10-13 : /courrier-du-matin — recherche Gmail en timeout au 1er essai, OK au 2e ; réessayer une fois avant de conclure à « rien ».
- 2026-10-13 (relances dues) : 27 relances J+12 le même jour, en majorité tables étoilées et hôtels 5* (Vague 2 et 3), cible que la mesure du 10/10 recommande de mettre en dernier ; 34 appels à étaler sur trois jours (J+4 du lot du 07/10 puis du 09/10). Pas de nouvelle mesure avant les réponses. Proposition : plafonner les envois initiaux à ~12 par jour pour lisser les J+5, J+12 et J+4.
- 2026-10-14 · courrier-du-matin : outils Gmail et Supabase absents de la session planifiée → rapport partiel (Resend + carnet seulement). Si cela se répète, vérifier l'autorisation du connecteur Gmail (confiance : faible, 1 occurrence).
- 2026-10-14 : premiers messages Instagram (relance J+7 d'un email, compte personnel de Valérian) : 6 envoyés, 1 refusé
  (le compte n'accepte pas les messages d'inconnus : Auberge des Carrières). Les messages d'un compte non suivi arrivent
  en « demandes » : à mesurer avant d'en faire un canal régulier. L'envoi en série a été bloqué par le contrôle de sécurité
  de la session après le 7e : prévoir une validation explicite de Valérian pour chaque lot Instagram.
- 2026-10-14 : les appels ne sont pas passés quand la liste est longue (47 à 71 numéros). Liste ramenée à 15 prioritaires
  (moins de 15 km, ouverts le jour même) ; mesurer si une liste courte est réellement appelée.
