# Emails de prospection B2B — Morilles du Canada (saison 2026)

Document de travail. Rien n'a été envoyé. Version révisée du 28/09/2026 : grille pro à partir de 1 kg, récit corrigé, précommande 2027 ajoutée.

---

## 1. Cadre commun (à respecter dans tous les envois)

**Récit : faits autorisés, et seulement ceux-là**
- Valérian a cueilli lui-même des morilles de feu pendant trois saisons (2022, 2023, 2024), en Colombie-Britannique et au Yukon, sur des forêts brûlées.
- Il travaille avec un réseau de cueilleurs présents sur les feux canadiens, qui sèchent les morilles sur place. Ne jamais nommer une autre personne.
- Ce sont des morilles sauvages, sans rapport avec la morille de culture.
- Les morilles sont entières et équeutées, en variétés mélangées (brune, blonde, grise), et le stock est en France.

Formulation de référence (une ou deux phrases, sans superlatif) :

> J'ai cueilli moi-même des morilles de feu pendant trois saisons, en 2022, 2023 et 2024, sur des forêts brûlées de Colombie-Britannique et du Yukon. Aujourd'hui, je travaille avec un réseau de cueilleurs présents sur les feux canadiens, qui sèchent les morilles sur place.

**Grille pro (prix nets, TVA non applicable, art. 293 B du CGI, port inclus, livraison en France uniquement)**

| Quantité | Prix |
|---|---|
| 1 kg | 350 €/kg |
| 3 kg et plus | 330 €/kg |
| 5 kg et plus | 310 €/kg |
| 10 kg et plus | 290 €/kg |

Formulation à reprendre telle quelle :

> Tarifs nets, port inclus, livraison en France (TVA non applicable, art. 293 B du CGI) : 350 €/kg pour 1 kg, 330 €/kg dès 3 kg, 310 €/kg dès 5 kg, 290 €/kg dès 10 kg.

**Précommande saison 2027 (une phrase, dans les relances)**

> Pour la saison 2027, vous pouvez aussi précommander de 1 à 15 kg à 300 €/kg avec un acompte de 50 % : livraison garantie en octobre 2027, remboursement intégral si nous ne pouvons pas fournir. Détails : https://www.morillesducanada.com/precommande-2027?utm_source=prospection&utm_medium=email&utm_campaign=vague1-[segment]

**Autres conditions**
- Commande minimum : 1 kg.
- Expédition sous 5 jours ouvrés.
- Dégustation en main propre : un pot de 30 g offert, remis en main propre lors d'un passage de Valérian dans la zone du prospect (calendrier dans `supabase/functions/_shared/tasting.ts`). Hors zone : envoi possible au cas par cas, seulement après échange avec Valérian avec un prospect démarché qui répond ; jamais « envoi gratuit sur simple demande ».

**Ne jamais écrire**
- « Je suis sur le terrain pendant la cueillette » ou toute présence actuelle sur le terrain. Seules les trois saisons 2022-2024 sont vérifiées.
- « Chaque lot est identifié », « lot tracé », « fiche du lot » ou toute promesse de traçabilité lot par lot.
- Le nom d'un cueilleur ou d'un partenaire.
- Un format de moins de 1 kg (plus de sachet de 500 g), ou une livraison hors de France.
- Un prix plancher, un prix minimum acceptable ou une marge de négociation.
- Une expédition « sous 48 h » ou tout délai plus court que 5 jours ouvrés.
- Un calibre chiffré (en cm ou en mm).
- Des superlatifs sans preuve (« exceptionnel », « unique au monde », « le meilleur »).

**Envoi (Resend, sous-domaine dédié à la prospection)**
- Expéditeur : `Valérian <valerian@pro.morillesducanada.com>`.
- Reply-To : `contact@morillesducanada.com`.
- Vérifier SPF, DKIM et DMARC sur `pro.morillesducanada.com` avant le premier envoi.
- Ajouter l'en-tête `List-Unsubscribe` (mailto vers contact@morillesducanada.com) et tenir une liste d'opposition : toute demande « STOP » est retirée avant la relance suivante.
- B2B, cadre CNIL : écrire uniquement à des adresses professionnelles publiées par l'établissement, avec un message en rapport avec son activité. Chaque email identifie l'expéditeur et propose une désinscription simple.
- Envoyer par petits lots (20 à 30 par jour), sans pièce jointe au premier email.
- Ne rien envoyer tant que les pages /professionnels et /precommande-2027 ne sont pas en ligne.

**Liens de suivi par segment**

| Segment | Page pro | Page précommande 2027 |
|---|---|---|
| A – Distributeurs premium | https://www.morillesducanada.com/professionnels?utm_source=prospection&utm_medium=email&utm_campaign=vague1-distributeurs | https://www.morillesducanada.com/precommande-2027?utm_source=prospection&utm_medium=email&utm_campaign=vague1-distributeurs |
| B – Épiceries fines | https://www.morillesducanada.com/professionnels?utm_source=prospection&utm_medium=email&utm_campaign=vague1-epiceries | https://www.morillesducanada.com/precommande-2027?utm_source=prospection&utm_medium=email&utm_campaign=vague1-epiceries |
| C – Restaurants | https://www.morillesducanada.com/professionnels?utm_source=prospection&utm_medium=email&utm_campaign=vague1-restaurants | https://www.morillesducanada.com/precommande-2027?utm_source=prospection&utm_medium=email&utm_campaign=vague1-restaurants |
| D – Traiteurs et fabricants | https://www.morillesducanada.com/professionnels?utm_source=prospection&utm_medium=email&utm_campaign=vague1-traiteurs | https://www.morillesducanada.com/precommande-2027?utm_source=prospection&utm_medium=email&utm_campaign=vague1-traiteurs |

Dans les modèles, `[LIEN PRO]` et `[LIEN PRÉCOMMANDE]` désignent les liens du segment.

**Pied de message obligatoire (tous les emails)**

```
Valérian — Morilles du Canada — contact@morillesducanada.com
morillesducanada.com

Vous recevez ce message parce que [Établissement] [raison : vend des champignons secs / sert des morilles à sa carte / fabrique des produits aux morilles].
Si vous ne souhaitez plus recevoir de messages de notre part, répondez simplement « STOP » : nous vous retirerons de notre liste.
```

**Champs à personnaliser**
- `[Établissement]`, `[Madame/Monsieur Nom]` (seulement si le nom est publié par l'établissement, sinon « Madame, Monsieur »).
- `[Détail observé]` : une phrase précise tirée de la colonne `fit` du CSV (plat à la carte, produit vendu, spécialité).

---

## 2. Segment B — Épiceries fines et crèmeries (priorité n°1, fenêtre de Noël octobre-novembre)

### Email 1 — premier contact

**Objet :** Morilles sauvages du Canada pour votre rayon de fin d'année

Bonjour [Madame/Monsieur Nom],

[Détail observé — ex. : Vous proposez déjà des morilles séchées dans votre rayon champignons.] Je vous écris pour vous présenter des morilles de feu sauvages du Canada en vue des fêtes.

J'ai cueilli moi-même des morilles de feu pendant trois saisons, en 2022, 2023 et 2024, sur des forêts brûlées de Colombie-Britannique et du Yukon. Aujourd'hui, je travaille avec un réseau de cueilleurs présents sur les feux canadiens, qui sèchent les morilles sur place. C'est une histoire simple et vraie que vos vendeurs peuvent raconter.

Ce sont des morilles sauvages, sans rapport avec la morille de culture. Elles sont entières et équeutées, donc sans pied perdu à la réhydratation, en variétés mélangées (brune, blonde, grise). Le stock est en France et l'expédition se fait sous 5 jours ouvrés.

Tarifs nets, port inclus, livraison en France (TVA non applicable, art. 293 B du CGI) : 350 €/kg pour 1 kg, 330 €/kg dès 3 kg, 310 €/kg dès 5 kg, 290 €/kg dès 10 kg.

Présentation complète : [LIEN PRO]

Je peux vous remettre en main propre un pot de 30 g pour que vous jugiez sur pièce, lors de mon passage à [ZONE] ([PÉRIODE]). Quelles sont vos disponibilités ?

Valérian — Morilles du Canada — contact@morillesducanada.com
[pied de message obligatoire]

### Relance J+5

**Objet :** Re : morilles de feu — dégustation pour [Établissement]

Bonjour,

Je reviens vers vous au sujet des morilles de feu sauvages du Canada, entières et équeutées, stockées en France. Pour un rayon de Noël, les commandes se décident en ce moment : si une dégustation vous intéresse, je peux passer vous remettre un pot de 30 g en main propre lors de mon passage à [ZONE] ([PÉRIODE]). Indiquez-moi vos disponibilités et le nom de la personne qui s'occupe des achats.

Pour la saison 2027, vous pouvez aussi précommander de 1 à 15 kg à 300 €/kg avec un acompte de 50 % : livraison garantie en octobre 2027, remboursement intégral si nous ne pouvons pas fournir ([LIEN PRÉCOMMANDE]).

Valérian — Morilles du Canada — contact@morillesducanada.com
[pied de message obligatoire]

### Relance J+12

**Objet :** Dernier message au sujet des morilles pour les fêtes

Bonjour,

Je ne reviendrai pas vers vous après ce message. Le stock actuel reste disponible dès 1 kg, port inclus, expédié sous 5 jours ouvrés : [LIEN PRO]

Si vous préférez anticiper, la précommande saison 2027 est ouverte de 1 à 15 kg à 300 €/kg (acompte de 50 %, livraison garantie en octobre 2027 ou remboursement intégral) : [LIEN PRÉCOMMANDE]

Si quelqu'un d'autre gère les achats chez [Établissement], merci de m'indiquer son nom.

Valérian — Morilles du Canada — contact@morillesducanada.com
[pied de message obligatoire]

---

## 3. Segment D — Traiteurs haut de gamme et fabricants (priorité n°1, production de fin d'année)

### Email 1 — premier contact

**Objet :** Morilles de feu entières et équeutées pour vos préparations de fêtes

Bonjour [Madame/Monsieur Nom],

[Détail observé — ex. : Votre boudin blanc aux morilles / votre pâté en croûte aux morilles.] Pour ce type de préparation, je vous propose des morilles de feu sauvages du Canada.

J'ai cueilli moi-même des morilles de feu pendant trois saisons, de 2022 à 2024, sur des forêts brûlées de Colombie-Britannique et du Yukon. Je travaille aujourd'hui avec un réseau de cueilleurs sur les feux canadiens, qui sèchent les morilles sur place.

Ce sont des morilles sauvages, pas des morilles de culture. Elles sont entières et équeutées : tout le poids acheté se retrouve dans la préparation, sans pied à retirer. Les variétés sont mélangées (brune, blonde, grise). Le stock est en France et l'expédition se fait sous 5 jours ouvrés, ce qui convient à des plannings de production de novembre.

Tarifs nets, port inclus, livraison en France (TVA non applicable, art. 293 B du CGI) : 350 €/kg pour 1 kg, 330 €/kg dès 3 kg, 310 €/kg dès 5 kg, 290 €/kg dès 10 kg.

Présentation complète : [LIEN PRO]

Je vous propose d'abord un pot de 30 g pour un essai en laboratoire. Voulez-vous que je vous l'envoie ?

Valérian — Morilles du Canada — contact@morillesducanada.com
[pied de message obligatoire]

### Relance J+5

**Objet :** Re : morilles pour [Établissement] — essai en laboratoire

Bonjour,

Je reviens vers vous au sujet de l'essai de morilles de feu entières et équeutées. Un pot de 30 g suffit pour vérifier la réhydratation et le rendement dans votre recette ; indiquez-moi simplement l'adresse de l'atelier.

Pour sécuriser vos volumes de l'an prochain, la précommande saison 2027 est ouverte de 1 à 15 kg à 300 €/kg avec un acompte de 50 %, livraison garantie en octobre 2027 ou remboursement intégral ([LIEN PRÉCOMMANDE]).

Valérian — Morilles du Canada — contact@morillesducanada.com
[pied de message obligatoire]

### Relance J+12

**Objet :** Morilles pour la production de fin d'année — dernier message

Bonjour,

C'est mon dernier message sur ce sujet. Si vos besoins pour les fêtes sont couverts, le stock actuel reste disponible dès 1 kg pour un complément d'hiver : [LIEN PRO]

Et pour l'automne prochain, la précommande 2027 (1 à 15 kg, 300 €/kg, acompte de 50 %, livraison garantie en octobre 2027 ou remboursement intégral) est ici : [LIEN PRÉCOMMANDE]

Si la personne en charge des achats est une autre, je vous remercie de me donner son nom.

Valérian — Morilles du Canada — contact@morillesducanada.com
[pied de message obligatoire]

---

## 4. Segment C — Tables gastronomiques et chefs de cueillette

### Email 1 — premier contact

**Objet :** Morilles de feu sauvages du Canada pour [plat observé / votre cuisine]

Bonjour [Chef / Madame, Monsieur],

[Détail observé — ex. : Votre volaille de Bresse aux morilles / votre cuisine de cueillette.] Je vous écris pour vous proposer des morilles de feu sauvages du Canada, en dehors de la saison fraîche.

J'ai cueilli moi-même des morilles de feu pendant trois saisons, en 2022, 2023 et 2024, sur des forêts brûlées de Colombie-Britannique et du Yukon. Je travaille aujourd'hui avec un réseau de cueilleurs sur les feux canadiens, qui sèchent les morilles sur place. Je peux vous raconter ce terrain de vive voix.

Ce sont des morilles sauvages, rien à voir avec la morille de culture. Elles sont entières et équeutées, sans pied à parer après réhydratation, en variétés mélangées (brune, blonde, grise). Stock en France, expédition sous 5 jours ouvrés.

Tarifs nets, port inclus, livraison en France (TVA non applicable, art. 293 B du CGI) : 350 €/kg pour 1 kg, 330 €/kg dès 3 kg, 310 €/kg dès 5 kg, 290 €/kg dès 10 kg.

Présentation complète : [LIEN PRO]

Je peux remettre en main propre un pot de 30 g en cuisine pour un essai, lors de mon passage à [ZONE] ([PÉRIODE]). Si ce message n'arrive pas à la bonne personne, pouvez-vous me dire à qui le transmettre ?

Valérian — Morilles du Canada — contact@morillesducanada.com
[pied de message obligatoire]

### Relance J+5

**Objet :** Re : morilles de feu — essai pour la cuisine de [Établissement]

Bonjour,

Je reviens vers vous au sujet d'une dégustation de morilles de feu sauvages. Un pot de 30 g, remis en main propre lors de mon passage à [ZONE] ([PÉRIODE]), permet de juger la tenue à la réhydratation et le goût en sauce ; il me suffit de vos disponibilités et du nom de la personne en cuisine.

Pour la carte du printemps et de l'automne prochains, la précommande saison 2027 est ouverte de 1 à 15 kg à 300 €/kg avec un acompte de 50 %, livraison garantie en octobre 2027 ou remboursement intégral ([LIEN PRÉCOMMANDE]).

Valérian — Morilles du Canada — contact@morillesducanada.com
[pied de message obligatoire]

### Relance J+12

**Objet :** Morilles de feu pour votre cuisine — dernier message

Bonjour,

Je ne vous relancerai plus après ce message. Le stock actuel reste disponible dès 1 kg, port inclus : [LIEN PRO]

La précommande 2027 (1 à 15 kg, 300 €/kg, acompte de 50 %, livraison garantie en octobre 2027 ou remboursement intégral) reste ouverte ici : [LIEN PRÉCOMMANDE]

Merci pour votre attention.

Valérian — Morilles du Canada — contact@morillesducanada.com
[pied de message obligatoire]

---

## 5. Segment A — Distributeurs premium (chefs et épiceries fines)

À n'envoyer qu'aux distributeurs qui revendent avec une forte valeur ajoutée.

### Email 1 — premier contact

**Objet :** Morilles de feu sauvages du Canada — stock en France pour votre gamme

Bonjour [Madame/Monsieur Nom],

[Détail observé — ex. : Vous proposez des champignons secs et des truffes à une clientèle de chefs et d'épiceries fines.] Je vous écris pour vous proposer des morilles de feu sauvages du Canada pour compléter votre gamme.

J'ai cueilli moi-même des morilles de feu pendant trois saisons, de 2022 à 2024, sur des forêts brûlées de Colombie-Britannique et du Yukon, et je travaille aujourd'hui avec un réseau de cueilleurs sur les feux canadiens, qui sèchent sur place. Vos clients reçoivent une origine claire, racontée par quelqu'un qui a fait la cueillette.

Ce sont des morilles sauvages, pas de culture, entières et équeutées, en variétés mélangées (brune, blonde, grise). Le stock est déjà en France et l'expédition se fait sous 5 jours ouvrés.

Tarifs nets, port inclus, livraison en France (TVA non applicable, art. 293 B du CGI) : 350 €/kg pour 1 kg, 330 €/kg dès 3 kg, 310 €/kg dès 5 kg, 290 €/kg dès 10 kg.

Présentation complète : [LIEN PRO]

Je peux vous adresser un pot de 30 g pour évaluation. Qui est la bonne personne aux achats ?

Valérian — Morilles du Canada — contact@morillesducanada.com
[pied de message obligatoire]

### Relance J+5

**Objet :** Re : morilles de feu — évaluation

Bonjour,

Je reviens vers vous au sujet des morilles de feu sauvages stockées en France. Si vous souhaitez évaluer le produit, je vous envoie un pot de 30 g : pouvez-vous me donner le nom de l'acheteur concerné ?

Pour planifier l'an prochain, la précommande saison 2027 est ouverte de 1 à 15 kg à 300 €/kg avec un acompte de 50 %, livraison garantie en octobre 2027 ou remboursement intégral ([LIEN PRÉCOMMANDE]).

Valérian — Morilles du Canada — contact@morillesducanada.com
[pied de message obligatoire]

### Relance J+12

**Objet :** Morilles de feu du Canada — dernier message

Bonjour,

C'est mon dernier message à ce sujet. Le stock actuel reste disponible dès 1 kg, expédié sous 5 jours ouvrés ([LIEN PRO]), et la précommande 2027 (1 à 15 kg, 300 €/kg, acompte de 50 %, livraison garantie en octobre 2027 ou remboursement intégral) est ouverte ici : [LIEN PRÉCOMMANDE]

Valérian — Morilles du Canada — contact@morillesducanada.com
[pied de message obligatoire]

---

## 6. Variantes pour les prospects joignables uniquement par téléphone ou formulaire

**Formulaire de contact (texte court, 600 caractères environ)**

> Bonjour, je suis Valérian, de Morilles du Canada. J'ai cueilli des morilles de feu pendant trois saisons (2022-2024) sur les forêts brûlées de Colombie-Britannique et du Yukon, et je travaille avec un réseau de cueilleurs sur les feux canadiens. Je propose aux professionnels des morilles sauvages entières et équeutées, stockées en France, dès 1 kg, port inclus. [Détail observé.] Je peux vous remettre un pot de 30 g en main propre à [ZONE] ([PÉRIODE]) : [LIEN PRO]. À qui m'adresser pour les achats ? Valérian — contact@morillesducanada.com. Si vous ne souhaitez pas être recontacté, dites-le-moi simplement en réponse.

**Appel au standard (30 secondes, pour obtenir le bon interlocuteur)**

> Bonjour, Valérian, de Morilles du Canada. Je fournis des morilles de feu sauvages aux professionnels : j'en ai cueilli moi-même pendant trois saisons au Canada. J'aimerais proposer une dégustation en main propre à la personne qui gère les achats [épicerie / cuisine / production]. Pouvez-vous me donner son nom et la meilleure adresse email pour lui écrire ?

Noter ensuite le nom et l'adresse obtenus dans le CSV, puis envoyer l'Email 1 du segment.

---

## 7. Suivi minimal (à reporter pour chaque prospect)

```
PROSPECT : [Établissement] — segment [A/B/C/D] — priorité [1-3]
CONTACT : [nom si obtenu] — [email / téléphone]
EMAIL 1 : [date]      RELANCE J+5 : [date]      RELANCE J+12 : [date]
DÉGUSTATION 30 g : [demandée / remise en main propre le ... / retour]
PRÉCOMMANDE 2027 : [non / intéressé / acompte reçu]
STATUT : [en attente / intéressé / refus / STOP (ne plus contacter)]
NOTES : [plat, produit ou besoin observé]
```
