---
name: qualite-traceabilite
description: Vérification, documentation et communication qualité/traçabilité d'un lot de morilles séchées — génère fiches lot, labels traçabilité, et textes de communication B2B/B2C
type: skill
---

# qualite-traceabilite — Qualité & Traçabilité Morilles du Canada

Documente un lot de morilles séchées et génère les supports associés : fiche lot interne, label traçabilité client, et texte de communication.

## Contexte qualité

- **Espèces principales :** Morilles de feu — *M. conica*, *M. brunnea*, *M. septimelata*, *M. sextelata* (brunes), *M. esculenta*, *M. prava*, *M. tomentosa*, *M. americana* (blondes)
- **Origine :** Colombie-Britannique et Yukon, Canada — forêts post-incendie
- **Récolte :** Cueillette à la main par des cueilleurs indépendants locaux
- **Traitement :** Séchage lent artisanal, tri et calibrage manuel, conditionnement sans queue
- **Conditionnement :** Pots en verre (12g, 30g, 45g) ou sachets sous vide (100g à 1kg)
- **TVA applicable :** 5,5% (denrée alimentaire, France)

## Usage

```
/qualite-traceabilite [action] [paramètres lot]
```

**Actions disponibles :**
```
/qualite-traceabilite fiche-lot [numéro-lot] [origine] [date-récolte] [poids-brut] [rendement]
/qualite-traceabilite label [numéro-lot] [format-conditionnement] [date-conditionnement]
/qualite-traceabilite communication [type: B2B|B2C|newsletter] [lot ou saison]
/qualite-traceabilite checklist [étape: réception|séchage|conditionnement|expédition]
/qualite-traceabilite audit [numéro-lot]
```

**Exemples :**
```
/qualite-traceabilite fiche-lot LOT-2026-BC-001 "Colombie-Britannique, secteur Kelowna" "juin 2026" 50kg 0.12
/qualite-traceabilite label LOT-2026-BC-001 "sous vide 500g" "2026-07-15"
/qualite-traceabilite communication B2B LOT-2026-BC-001
/qualite-traceabilite checklist conditionnement
```

## Workflow par action

### `fiche-lot` — Fiche interne d'un lot

Génère une fiche structurée avec :

```
FICHE LOT — Morilles du Canada
================================
Référence lot    : [ex: LOT-2026-BC-001]
Espèce(s)        : [brunes / blondes / mélange — préciser variétés si connues]
Origine          : [Province, secteur géographique]
Zone de récolte  : [Forêt post-incendie, année du feu si connu]
Date récolte     : [mois/année]
Cueilleur(s)     : [identifiant interne ou prénom si partenaire régulier]
Poids brut       : [kg]
Rendement séchage: [ratio, ex: 0.12 = 12% = 1kg sec pour 8.3kg frais]
Poids sec obtenu : [kg]
Calibre dominant : [petit <2cm / moyen 2-4cm / grand >4cm]
Couleur          : [brun foncé / brun clair / blonde]
Odeur            : [fumée intense / boisée / délicate]
Défauts constatés: [néant / % débris / % morilles creuses]
Décision qualité : [VALIDÉ / TRIÉ / REFUSÉ] — motif si non validé
Date séchage     : [date]
Date conditionnement: [date]
DLC indicative   : [24 mois après conditionnement = date]
Conditionnements : [ex: 20x sous vide 500g + 30x pot 45g]
Stock disponible : [unités par format]
Notes            : [libre]
================================
```

### `label` — Label traçabilité pour client

Génère le texte du label à apposer ou inclure dans l'envoi :

```
MORILLES DE FEU SÉCHÉES
Origine sauvage · Canada

Lot : [numéro]
Récolte : [mois année], [province]
Conditionnement : [date]
À consommer de préférence avant : [DLC]

Espèce : Morchella spp. (morilles de feu)
Zone : Forêt post-incendie, [province]
Récolte : À la main
Traitement : Séchage artisanal lent — sans additifs

Conservation : Lieu sec et frais, à l'abri de la lumière
Réhydratation : 20 min eau froide ou tiède — conserver l'eau de trempage filtrée

Morilles du Canada — contact@morillesducanada.com
```

### `communication` — Texte de communication

**B2B (email fournisseur/chef) :**
- Ton factuel et professionnel
- Met en avant : origine précise, calibre, profil aromatique, disponibilité volume
- Format : 3-4 lignes, prêt à insérer dans un email pro

**B2C (fiche produit site ou email client) :**
- Ton narratif, sensoriel, transparent
- Met en avant : lieu de récolte, geste de cueillette, saison, usage culinaire
- Format : 1 paragraphe de 5-6 lignes

**Newsletter :**
- Ton journal de bord — comme si on racontait la saison
- Peut inclure : conditions météo, densité des morilles, anecdote terrain
- Format : 150-250 mots, ton personnel mais professionnel

### `checklist` — Contrôle qualité par étape

**Réception lot frais :**
- [ ] Odeur : caractéristique (fumée, terre) — aucune odeur de moisi ou putréfaction
- [ ] Aspect : chapeau alvéolé intact, queue propre
- [ ] Contamination : absence de terre excessive, insectes, débris végétaux
- [ ] Humidité : taux estimé (frais = >80% eau)
- [ ] Pesée brute enregistrée
- [ ] Photo lot référencée

**Séchage :**
- [ ] Température séchoir : 40-50°C max (pas de cuisson)
- [ ] Durée : 8-12h selon taille
- [ ] Taux humidité final : <10% (test : morille sèche = cassante, pas souple)
- [ ] Pesée après séchage — calcul rendement
- [ ] Contrôle visuel : couleur homogène, pas de zones brûlées

**Conditionnement :**
- [ ] Tri final : retrait morilles cassées, débris, queues non coupées
- [ ] Calibrage : séparation tailles si besoin selon format cible
- [ ] Pesée unité par unité (tolérance ±5%)
- [ ] Soudure sous vide : test étanchéité sur 10% des sachets
- [ ] Apposition lot + DLC sur chaque unité
- [ ] Photo lot conditionné référencée

**Expédition :**
- [ ] Emballage protecteur adapté (morilles fragiles)
- [ ] Inclusion fiche traçabilité ou QR code lot
- [ ] Température transport : ambiante OK si <72h, sinon isolant
- [ ] Numéro de suivi enregistré contre la commande

### `audit` — Audit complet d'un lot

Lance les 4 checklists en séquence et génère un rapport d'audit :

```
AUDIT LOT [numéro]
Date audit : [aujourd'hui]
Étapes auditées : réception / séchage / conditionnement / expédition
Résultat : [CONFORME / CONFORME AVEC RÉSERVES / NON CONFORME]
Points de vigilance : [liste]
Actions correctives : [si applicable]
```

## Format de sortie par défaut

1. **Document principal** (fiche, label ou texte selon action)
2. **Résumé en 1 ligne** (pour copier dans un tableur ou CRM)
3. **Alerte qualité** si des paramètres semblent hors norme (rendement anormal, DLC incohérente, etc.)
