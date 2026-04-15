---
name: prospect-b2b
description: Prospection B2B restaurants gastronomiques, épiceries fines, chefs étoilés — génère emails personnalisés, séquences de suivi et relance pour vendre des morilles séchées sauvages du Canada en France
type: skill
---

# prospect-b2b — Prospection B2B Morilles du Canada

Génère des emails de prospection ciblés pour les restaurants gastronomiques, chefs étoilés, épiceries fines et traiteurs haut de gamme en France.

## Contexte produit

- **Produit :** Morilles de feu sauvages séchées, cueillette main, Colombie-Britannique & Yukon, Canada
- **Formats disponibles :** 12g (10€), 30g (20€), 45g (25€), sous vide 100g-1kg (45€/100g dégressif jusqu'à 40€/100g à partir de 500g)
- **Différenciation :** Morilles de feu (post-incendie) — profil aromatique unique vs morilles ordinaires. Calibrage rigoureux, sans queue, réhydratation nette, chair ferme.
- **Plaquette pro imprimable :** https://www.morillesducanada.com/plaquette-pro
- **Contact direct :** 07 82 16 27 08 — contact@morillesducanada.com

## Usage

```
/prospect-b2b [type de cible] [nom établissement] [chef si connu] [contexte optionnel]
```

**Exemples :**
```
/prospect-b2b restaurant Paris "Le Clarence" "Christophe Pelé"
/prospect-b2b epicerie-fine Lyon "La Grande Epicerie de Lyon"
/prospect-b2b chef-etoile "Pierre Gagnaire" "approche directe"
/prospect-b2b traiteur Bordeaux "Traiteur Dubois" "mariage haut de gamme"
```

## Workflow

### 1. Identifier le profil de la cible

Adapter le message selon le segment :

| Segment | Accroche principale | Format recommandé |
|---------|--------------------|--------------------|
| Restaurant 1-2 étoiles | Constance d'approvisionnement, calibrage chef | Sous vide 200-500g |
| Restaurant gastronomique sans étoile | Différenciation carte, traçabilité | Sous vide 100-200g + pot 45g test |
| Épicerie fine / caviste | Produit rare, storytelling origine | Pots 12g + 30g + 45g |
| Chef privé / traiteur | Volumes flexibles, réactivité | Sous vide 200-500g |
| Hôtel 5* / palace | Fiabilité, conditionnement professionnel | Sous vide 500g-1kg |

### 2. Générer l'email de prospection (Email 1)

**Structure :**
- Objet : court, factuel, pas de majuscules excessives — max 60 caractères
- Accroche : 1 phrase sur leur cuisine ou leur carte (montre que tu as cherché)
- Corps : 3-4 phrases max — produit, différenciation, invitation à tester
- CTA : échantillon gratuit ou commande découverte, ou appel téléphonique
- Signature : sobre, sans fioritures

**Ton :** professionnel, direct. Pas de "je me permets", pas de "j'espère que vous allez bien". Parler cuisine, pas commerce.

### 3. Séquence de relance (si pas de réponse)

**Relance J+7 (Email 2) :**
- Objet différent — angle recette ou saisonnalité
- 2 phrases max — rappel de l'email précédent + nouvelle accroche (ex: recette suggestion, saison morilles)
- Pas de "sans nouvelles de vous"

**Relance J+14 (Email 3 — dernière) :**
- Objet : angle fermeture — "dernière occasion saison 2026"
- Court : on ferme la boucle proprement, on laisse la porte ouverte
- Option : proposer la plaquette pro en pièce jointe

### 4. Suivi CRM minimal

Après génération, demander :
- Date d'envoi prévu
- Canal (email / LinkedIn / téléphone)
- Statut attendu (attendre réponse / relance à planifier)

Sortir un bloc de suivi formaté :

```
PROSPECT: [Nom établissement]
CONTACT: [Nom chef/acheteur si connu]
DATE ENVOI: [date]
STATUT: En attente — relance J+7 le [date]
FORMAT PROPOSÉ: [format produit]
NOTES: [contexte spécifique]
```

## Exemples de formulations efficaces

**Accroches qui marchent :**
- "Votre travail autour des champignons sauvages sur la carte d'automne m'a donné envie de vous contacter."
- "Vous avez la réputation de sourcer vos matières premières hors du circuit habituel — c'est exactement là qu'on se situe."
- "Morilles de feu, post-incendie, Colombie-Britannique. Profil aromatique que vous ne trouverez pas chez les négociants habituels."

**À éviter :**
- "Je me permets de vous contacter..."
- "Notre entreprise propose..."
- "N'hésitez pas à me contacter..."
- Tout ce qui ressemble à un mail de masse

## Format de sortie

Pour chaque demande, produire :

1. **Email 1** (complet, prêt à envoyer)
2. **Email 2 — Relance J+7** (complet)
3. **Email 3 — Dernière relance J+14** (complet)
4. **Bloc suivi CRM**
5. **Note tactique** : 1-2 points spécifiques à la cible (ex: "vérifier si chef présent le mardi", "établissement vient d'ouvrir")
