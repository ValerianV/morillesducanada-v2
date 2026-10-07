---
name: suivi-commercial
description: Revue hebdomadaire du pipeline commercial Morilles du Canada — leads pros du site, réponses à la prospection, relances dues, précommandes 2027, kg vendus et restants. À lancer chaque lundi.
---

# /suivi-commercial

Contexte : `docs/commercial/strategie.md`, `docs/business/offre.md`.

1. **Leads du site** (Supabase, lecture) : `pro_leads` de la semaine (type, kg, statut).
   Signaler tout lead sans réponse depuis plus de 24 h ouvrées.
2. **Ventes** : `orders` payées de la semaine (kg, montant, format), et `pre_orders` saison 2027
   (kg engagés, acomptes encaissés, total précommandé par rapport au plafond).
   Recouper avec Stripe (MCP, lecture) si un écart apparaît.
3. **Prospection** : lire le carnet (https://claude.ai/artifact/R9M8EhDc4rVHk6GQ5UQFiT, collection `prospects`) : relances dues (J+5, J+12,
   RDV demandé depuis plus de 4 jours), rendez-vous pris, visites sans SMS de suivi. Chercher les réponses dans
   Gmail (contact@ y est transféré : `to:contact@morillesducanada.com newer_than:7d`) et les rebonds dans Resend.
   Mettre à jour le carnet (statut, notes) pour chaque réponse. Préparer les relances, sans les envoyer.
   Exporter le carnet en CSV dans `docs/interne/prospection/` (sauvegarde).
4. **Stock** : kg vendus cumulés et kg restants (stock de départ : voir `offre.md`).
5. **Rapport au fondateur** : 10 lignes maximum. Chiffres clés, 3 actions prioritaires de la semaine,
   décisions à prendre.
6. Consigner les nouveaux apprentissages (objections fréquentes, segments qui répondent)
   dans `docs/commercial/strategie.md`.

Aucun email n'est envoyé sans validation explicite du fondateur.
