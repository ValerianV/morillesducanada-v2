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
3. **Prospection** : dans `docs/commercial/prospects.csv`, lister les relances dues (J+5, J+12)
   et les prospects qui ont répondu. Préparer les relances (sans les envoyer).
4. **Stock** : kg vendus cumulés et kg restants (stock de départ : voir `offre.md`).
5. **Rapport au fondateur** : 10 lignes maximum. Chiffres clés, 3 actions prioritaires de la semaine,
   décisions à prendre.
6. Consigner les nouveaux apprentissages (objections fréquentes, segments qui répondent)
   dans `docs/commercial/strategie.md`.

Aucun email n'est envoyé sans validation explicite du fondateur.
