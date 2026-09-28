# Audit UX/UI B2B — morillesducanada.com

**Date :** 28 septembre 2026
**Point de vue :** acheteur professionnel (chef, gérant d'épicerie fine, acheteur grossiste)
**Objectif business :** écouler 45 kg de morilles séchées en commandes au kilo
**Méthode :** site en production (navigateur gstack, 1440×900 et 390×844) et lecture du code (`src/pages`, `src/components`, `src/i18n/fr.ts`, `src/lib/products.ts`, `src/lib/productDetails.ts`). Aucun fichier du repo n'a été modifié.

**Captures :** `scratchpad/shots/`
| Fichier | Contenu |
|---|---|
| `home-desktop-fold.png` / `m-home-fold.png` | Hero desktop / mobile |
| `m-home-menu.png` | Menu mobile |
| `home-below-hero.png` | Section « Nées du feu » |
| `home-produits-1.png`, `home-produits-2.png` | Section produits et CTA devis |
| `home-avis.png` | Section avis (vide) |
| `home-professionnels-1.png`, `home-professionnels-2.png` | Section Professionnels desktop |
| `m-pro-1/2/3.png` | Section Professionnels mobile (+ CTA flottant) |
| `home-contact-1.png`, `m-contact.png` | Formulaire de contact |
| `precommande-desktop-fold.png`, `m-precommande-fold.png`, `m-precommande-form.png` | Page précommande |
| `plaquette-desktop-fold.png`, `plaquette-p3-tarifs.png`, `plaquette-p5-contact.png`, `m-plaquette.png` | Plaquette pro |
| `fiche-desktop-fold.png` | Fiche technique |
| `produits-fold.png`, `produits-bottom.png` | Page /produits |
| `pdp-sousvide-desktop-fold.png`, `pdp-sousvide-desktop-2.png` | Fiche produit sous vide |

> Note : les captures pleine page (`*-full.png`) sont vides sous le hero, car le contenu n'apparaît qu'au scroll (`ScrollReveal`, `whileInView`). Les captures utiles sont prises section par section.

---

## Verdict en 5 secondes

Un chef qui arrive sur l'accueil voit un pot en verre, « Un trésor rare… pour les palais les plus exigeants » et deux boutons : « Découvrir nos morilles » et « Notre histoire ». **Rien ne lui dit qu'il peut acheter au kilo, à quel prix, ni que le stock est disponible maintenant.** Le seul chemin pro est le lien « Professionnels » du menu. C'est une ancre qui descend à 10 359 px sur desktop (75 % de la page) et à 16 119 px sur 21 693 px sur mobile, soit environ 19 écrans de scroll. Arrivé là, l'offre qu'il trouve est une **précommande « Pré-commander pour l'été 2026 »**, avec « Réservation avant cueillette » et « Délai 6 à 8 semaines ». Or on est fin septembre et le produit est en stock.

Le site a une vraie identité (sombre, or, serif), et la page précommande est le meilleur actif pro existant (tableau de prix, calcul en direct). Mais le parcours pro est **enterré, périmé et contradictoire sur les chiffres**. C'est ce dernier point qui coûte le plus cher avec un acheteur professionnel.

---

## Problèmes classés par impact sur la conversion pro

### P0 — Bloquants (à corriger avant toute prospection)

#### P0-1. L'offre pro est une précommande d'été 2026 périmée, alors que 45 kg sont en stock
- **Pages :** accueil section Professionnels, `/pre-commande`, `/plaquette-pro`
- **Captures :** `home-professionnels-2.png`, `precommande-desktop-fold.png`, `plaquette-p3-tarifs.png`
- **Problème :** tout le discours pro porte sur une réservation avant cueillette : « Sourcing direct saison 2026 », « Pré-commander pour l'été 2026 », « Réservation avant cueillette », « Délai 6 à 8 semaines », « Paiement intégral à la réservation », « Aucun réassort possible en cours de saison ». Un acheteur lit « pas avant novembre, payé d'avance, à l'aveugle ». Le vrai argument du moment est l'inverse : **stock disponible, expédition immédiate**.
- **Changement :**
  - Titre de section et de page : **« Morilles de feu séchées — stock disponible, vente au kilo »**
  - Sous-titre : **« Récolte 2026 séchée, triée et conditionnée. Expédition sous 48 h ouvrées depuis Avignon, à partir de 1 kg. »** [délai à valider]
  - CTA principal : **« Demander un devis au kilo »** (remplace « Pré-commander pour l'été 2026 »)
  - Remplacer les 3 cartes « Fonctionnement » par : **1. « En stock » / « Récolte printemps 2026, séchée sur place. » — 2. « Devis sous 24 h » / « Prix net, facture systématique. » — 3. « Expédié sous 48 h » / « Sous vide, colis suivi, France et Europe. »**
  - Conditions : supprimer « Paiement intégral à la réservation » et « Aucun réassort possible en cours de saison », et les remplacer par **« Paiement par virement à réception de facture » [modalités à valider] · « Stock limité à la récolte 2026 : pas de réassort avant la saison 2027 »**. La rareté devient un argument au lieu d'être une contrainte.
  - Garder la précommande 2027 comme bloc secondaire en bas de page : « Réserver un lot saison 2027 ».
  - Techniquement : `src/i18n/fr.ts` (`professional.preorder*`, `preorder.*`), `src/pages/PreOrder.tsx` (tableaux et conditions codés en dur), `src/pages/PlaquettePro.tsx`.

#### P0-2. Les prix et la TVA se contredisent d'une page à l'autre
- **Pages :** accueil Pro, `/pre-commande`, `/plaquette-pro`, `/produits/morilles-sous-vide`
- **Captures :** `home-professionnels-2.png`, `plaquette-p3-tarifs.png`, `pdp-sousvide-desktop-fold.png`
- **Problème :** un acheteur compare toujours les documents. Il trouve :
  | Source | Ce qui est écrit |
  |---|---|
  | Accueil / précommande | « TVA non applicable (art. 293 B CGI) », prix nets 360 / 390 €/kg |
  | Plaquette p.3 | « **Tarifs HT** — Pré-commande » + colonne « €/kg HT » calculée avec une TVA de 5,5 % (`VAT = 0.055` : 1 kg = 420 € TTC → 398,10 € HT) |
  | Plaquette p.5 | « **TVA 5,5 % sur produits alimentaires** » |
  | Fiche sous vide | 1 kg = 420 € « Prix net » |
  | Précommande | Brune 360 €/kg, « Blonde & Grise » 390 €/kg (2 lignes) |
  | Plaquette | Brune / Blonde / « Grise & Verte » (3 lignes), « Pas de maximum » |
  | Formulaire précommande | « maximum 20 kg » |

  Avec deux régimes de TVA et deux grilles de variétés, le sérieux du fournisseur est mis en doute.
- **Changement :**
  - Créer **une seule source de vérité** `src/lib/proPricing.ts` (variétés, paliers, mention fiscale), consommée par `ProfessionalSection`, `PreOrder`, `PlaquettePro`, `FicheTechnique` et la future page `/professionnels`.
  - Mention fiscale unique, placée sous chaque tableau : **« Prix nets. Pas de TVA facturée (franchise en base, art. 293 B du CGI) : le prix affiché est votre coût final. »** Supprimer `VAT = 0.055`, la colonne « HT » et la ligne « TVA 5,5 % » de la plaquette. Le régime fiscal lui-même reste à confirmer avec le comptable.
  - Une seule nomenclature de variétés partout : **Brune · Blonde & grise · Verte (sur demande)**.
  - Expliquer l'écart retail/pro : sur la fiche sous vide 1 kg (420 €), ajouter **« Professionnel ? Tarif au kilo dès 360 € → »** avec un lien vers `/professionnels`.

#### P0-3. Le chemin pro est invisible au-dessus de la ligne de flottaison et enterré dans la page
- **Pages :** accueil (hero, nav), mobile
- **Captures :** `home-desktop-fold.png`, `m-home-fold.png`, `m-home-menu.png`, `m-pro-2.png`
- **Problème :**
  - Le hero parle uniquement au particulier. CTA « Découvrir nos morilles » (→ panier B2C) et « Notre histoire ».
  - « Professionnels » dans la nav est un lien texte gris de même poids que « Recettes ». C'est une ancre `#professionnels` qui arrive après l'origine, les produits, les avis, le pourquoi, le processus, la galerie et l'à-propos.
  - Sur mobile, le bouton flottant « Commander » (`FloatingCTA`) renvoie vers `#produits`, les pots B2C, y compris quand l'utilisateur lit la section Pro (`m-pro-2.png`).
- **Changement :**
  - **Hero :**
    - Surtitre : « Morilles de feu sauvages · Colombie-Britannique & Yukon »
    - H1 : « Morilles de Feu *du Canada* » (inchangé)
    - Paragraphe : **« Séchées sur place, sans queue, lot tracé. Récolte 2026 en stock : vente au kilo pour restaurants, épiceries fines et distributeurs. »**
    - CTA 1 (plein, or) : **« Tarifs pro au kilo »** → `/professionnels`
    - CTA 2 (contour) : **« Acheter en pot »** → `#produits`
    - Micro-ligne sous les CTA (12 px, 70 % d'opacité) : **« Dès 360 €/kg · Prix nets · Expédition 48 h · Échantillon sur demande »**
  - **Nav :** « Professionnels » devient une vraie route `/professionnels`, rendue comme un bouton contour or **« Espace pro »**, placé en dernier avant les icônes. Même chose en tête du menu mobile.
  - **Bandeau d'annonce** au-dessus de la nav (nouveau `ProAnnouncementBar.tsx`, masquable) : **« Professionnels : récolte 2026 disponible au kilo — tarifs et échantillon → »**
  - **`FloatingCTA`** : rendre le bouton contextuel. Dans ou après `#professionnels`, afficher « Devis au kilo » → `/professionnels#devis`. Envisager aussi un bouton double sur mobile « Pots | Au kilo ».
  - **Ordre de l'accueil :** insérer juste après `TrustBandeau` une bande **`ProStrip`** (voir P1-6) pour que le pro ait sa porte d'entrée au 2e écran.

#### P0-4. La plaquette et la fiche technique ne sont pas des PDF, et ce sont des culs-de-sac
- **Pages :** `/plaquette-pro`, `/fiche-technique`
- **Captures :** `plaquette-desktop-fold.png`, `m-plaquette.png`, `fiche-desktop-fold.png`
- **Problème :** le bouton « Télécharger la plaquette » ouvre une page HTML A4, et son bouton « Télécharger PDF » lance `window.print()`. Un chef sur iPhone ne peut pas l'enregistrer ni la transmettre à son associé. Il n'y a ni nav, ni retour, ni CTA de devis sur le web. Sur mobile, le bouton « Télécharger PDF » recouvre le logo (« Mor… »). La fiche technique est en corps de 9 px blanc sur noir, illisible à l'écran et très gourmande en encre à l'impression.
- **Changement :**
  - Générer deux vrais fichiers statiques, `public/docs/morilles-du-canada-catalogue-pro-2026.pdf` et `public/docs/fiche-technique-morilles-de-feu-2026.pdf` (par exemple via `/make-pdf`). Les lier en `download`, avec le libellé **« Catalogue pro 2026 — PDF, 5 pages, 2 Mo »** et **« Fiche technique — PDF, 1 page »**.
  - Garder les pages HTML, mais y ajouter la `Navbar` et un pied fixe : **« Commander au kilo → Demander un devis »**.
  - Fiche technique : fond clair (crème, texte `#1a1612`), corps à 11 pt minimum.
  - Mobile : déplacer le bouton de téléchargement en bas (sticky bottom) au lieu de le mettre en `top-6 right-6`.

#### P0-5. Les données techniques se contredisent (séchage, DLUO, réhydratation, rendement)
- **Pages :** fiche technique, FAQ, fiche produit, bandeau, plaquette
- **Captures :** `fiche-desktop-fold.png`, `pdp-sousvide-desktop-fold.png`, `home-below-hero.png`
- **Problème :** un acheteur qualité ou un chef compare ces chiffres entre eux :
  | Donnée | Valeurs trouvées |
  |---|---|
  | Délai de séchage | « le jour même » (processus, couverture plaquette) · « dans les 24 h » (bandeau, PDP) · « séchées le lendemain » (plaquette p.2) · « < 48 h » (fiche technique) |
  | Conservation | « 24 mois » (fiche technique, PDP 45 g) · « 36 mois sous vide » (PDP sous vide) · « 2 ans minimum » (FAQ) |
  | Réhydratation | « eau tiède (70 °C) » (fiche) · « 30-40 °C » (FAQ) |
  | Rendement | « 1 pour 8 à 10 en poids » (fiche) · « ~5× le poids sec » (PDP) · « triplent de volume » (FAQ) |
  | Calibre | « morilles entières, calibrées » (section Pro), mais **aucun calibre indiqué nulle part** |
  | Cueilleur | « Je garde leur identité pour moi » (À propos) · « Chaque lot est identifiable : variété, **cueilleur**… » (plaquette) |
  | Allergènes | « Peut contenir des traces de fruits à coque (selon atelier de conditionnement) », une formule vague qui inquiète un restaurateur |
- **Changement :** créer `src/lib/productSpecs.ts` comme référentiel unique, et remplir la fiche avec des valeurs vérifiées. Le reste du site affiche ces valeurs sans les réécrire. Champs à ajouter ou préciser [valeurs à fournir par le producteur] :
  - **Calibre :** « Têtes entières, 3 à 7 cm, brisures < 5 % » (exemple de format)
  - **Humidité résiduelle :** « < 12 % » (supprimer « sous vide » de cette ligne)
  - **DLUO :** une seule valeur, datée à partir du séchage, avec le **n° de lot imprimé sur chaque sachet** (montrer une photo de l'étiquette avec le lot)
  - **Allergènes :** soit supprimer la ligne sur les fruits à coque si elle n'est pas fondée, soit nommer l'atelier et la procédure
  - **Contrôles :** tri manuel, absence de sable ou d'insectes, analyse microbiologique si disponible (sinon ne rien promettre)

### P1 — Forte friction

#### P1-1. Le formulaire de contact est pensé pour le particulier
- **Page :** accueil `#contact`
- **Captures :** `home-contact-1.png`, `m-contact.png`
- **Problème :** 4 champs (Nom, Email, « Vous êtes » = **Particulier par défaut**, Message). Il n'y a ni établissement, ni téléphone, ni quantité. Le bloc de gauche demande au pro de « précis[er] « Professionnel » dans votre message ». Le seuil annoncé ici est « volumes supérieurs à 200 g », contre « Quantités supérieures à 1Kg » sous les produits. Le bouton « Envoyer » ne promet rien. Le succès indique « dans les plus brefs délais ».
- **Changement :**
  - Remplacer le select par des **boutons radio en tête de formulaire** : « Particulier » / « Professionnel ». Si « Professionnel » est choisi, afficher Établissement, Téléphone et Quantité (puces 1 kg / 2-4 kg / 5-9 kg / 10 kg et +).
  - Pré-sélectionner « Professionnel » quand l'utilisateur arrive depuis un CTA pro (`/#contact?type=pro`).
  - Libellé du bouton : **« Recevoir ma réponse sous 24 h »**. Succès : **« Merci. Valérian vous répond personnellement sous 24 h ouvrées. »**
  - Supprimer la consigne « précisez Professionnel dans votre message ».
  - Mieux : faire pointer tous les CTA « devis » vers le formulaire dédié de `/professionnels#devis` (voir P1-2).

#### P1-2. Le formulaire de précommande freine les gros volumes et engage trop tôt
- **Page :** `/pre-commande`
- **Captures :** `m-precommande-form.png`, `precommande-desktop-fold.png`
- **Problème :** c'est le bon socle (établissement, calcul du prix en direct). Mais :
  - Le **plafond de 20 kg** bloque précisément l'acheteur grossiste qui pourrait prendre 10 à 45 kg (`toast.error("Quantité maximale : 20 kg…")`).
  - « Paiement intégral à la réservation » apparaît avant même le devis.
  - Aucun champ ville ou code postal (nécessaire pour estimer le transport), SIRET ou demande d'échantillon.
  - « Facture disponible sur demande » : pour un pro, une facture n'est pas une option.
  - Le CTA « Envoyer ma demande de réservation » et le délai de réponse « sous 48 h » paraissent lents.
- **Changement :**
  - Supprimer le maximum. Au-delà de 20 kg, afficher **« Volume distributeur : Valérian vous rappelle sous 24 h avec un tarif dédié. »**
  - Ajouter une case **« Je souhaite d'abord un échantillon (20 g) »** et un champ **Code postal de livraison**. Le SIRET est facultatif.
  - Remplacer « Facture disponible sur demande » par **« Facture émise pour chaque commande — SIRET 802 861 948 00023 »**.
  - CTA : **« Recevoir mon devis — sans engagement »**. Réassurance sous le bouton : **« Aucun paiement à cette étape. Réponse sous 24 h ouvrées. »**
  - Afficher le total avec les milliers et la virgule : « 1 800,00 € » (et non « 1800.00 € »).

#### P1-3. Aucune preuve sociale : la section avis est vide
- **Page :** accueil `#avis`
- **Capture :** `home-avis.png`, `home-produits-2.png`
- **Problème :** « Avis de nos clients » ne contient **aucun avis**, seulement le formulaire « Laisser un avis ». Juste à côté, la section Pro revendique « Deux ans de retours clients enthousiastes » et « retours unanimes ». Aucun chef, restaurant ou épicerie n'est cité. Pour un acheteur pro, le décalage entre la promesse et la preuve absente compte davantage qu'une simple absence d'avis.
- **Changement :**
  - Masquer la section tant qu'il y a moins de 3 avis publiés (`reviews.length < 3`) et déplacer le formulaire sur `/profil` ou dans l'email post-achat.
  - Créer `ProReferences.tsx` : 2 ou 3 citations de chefs ou d'épiceries avec établissement et ville (avec leur accord écrit). À défaut, une ligne factuelle : **« Vendues depuis 2024 sur les marchés de Provence — X clients, Y kg livrés »** [chiffres réels à fournir].
  - Proposer un **échantillon pro** en échange d'un retour : c'est aussi le moyen le plus rapide d'obtenir des références.

#### P1-4. Pas d'offre d'échantillon pro
- **Pages :** toutes
- **Problème :** un chef n'achète pas 2 kg à 360 €/kg sans goûter. Le seul « test » est le pot Découverte 12 g à 12 €, présenté comme « Format d'évaluation » mais vendu en B2C (panier, frais de port).
- **Changement :** composant `SampleRequest.tsx` sur `/professionnels` :
  - Titre : **« Goûtez avant de commander »**
  - Texte : **« Échantillon de 20 g envoyé aux restaurants, épiceries fines et distributeurs. Déduit de votre première commande au kilo. »** [politique à valider : gratuit ou frais de port]
  - CTA : **« Recevoir un échantillon »**
  - Champs : Établissement, Adresse, Email, Téléphone.

#### P1-5. Réassurance B2B : ce qui manque
| Élément attendu | Présent ? | Où / proposition |
|---|---|---|
| Origine | Oui, partout | OK |
| N° de lot visible | Annoncé (« lot identifié ») mais jamais montré | Photo d'étiquette avec n° de lot, date de séchage et DLUO |
| Fiche technique | Oui, mais HTML seulement et incohérente | PDF + référentiel unique (P0-4, P0-5) |
| Calibre | Non | Ligne « Calibre » + photo sur règle graduée |
| Humidité | Oui (8-12 %) | Valeur max unique |
| DLUO | 3 valeurs différentes | Une seule valeur |
| Conditionnement | Oui (sous vide 100 g-1 kg) | Préciser le **sachet pro de 500 g et 1 kg** comme unité de vente au kilo |
| Délais | 6-8 semaines (périmé) · « 24h-72h » (PDP) | « Expédition sous 48 h ouvrées » |
| Facturation | « Facture disponible sur demande » | « Facture systématique » + mention fiscale unique |
| Paiement | « Paiement intégral à la réservation » | Virement à réception de facture [à valider] |
| Échantillon | Non | P1-4 |
| Références chefs | Non | P1-3 |
| Identité légale | SIRET uniquement sur la fiche technique | SIRET et adresse de l'entreprise dans le footer et sur `/professionnels` |
| Transport / franco | Rien pour le pro | « Livraison offerte dès 2 kg en France métropolitaine » [à valider] |

#### P1-6. La section Pro de l'accueil est un gabarit générique à 3 icônes
- **Page :** accueil `#professionnels`
- **Captures :** `home-professionnels-2.png`, `m-pro-2.png`, `m-pro-3.png`
- **Problème :** trois pictos lucide (toque, camion, téléphone) sur trois colonnes centrées, avec des textes creux (« Qualité éprouvée », « Livraison adaptée », « Ligne directe »). Le prix, la seule information décisive, est noyé en corps 14 px, graisse 300, dans un paragraphe (`dangerouslySetInnerHTML`). Il y a 4 CTA de poids voisins : Appelez-moi, Pré-commander, Télécharger, Demander un devis. Sur mobile, la section fait environ 3 écrans avant d'arriver au prix.
- **Changement :** remplacer la section par un **`ProStrip`** compact, placé en 2e position sur l'accueil :
  ```
  [surtitre]  PROFESSIONNELS
  [H2]        Morilles de feu au kilo, en stock
  [3 chiffres en ligne, serif 32px or]
      360 €/kg          48 h                 1 kg
      brune, prix net   expédition           minimum
  [CTA plein]    Voir les tarifs pro      → /professionnels
  [lien texte]   ou appeler Valérian · 07 82 16 27 08
  ```
  Tout le détail passe sur `/professionnels`.

### P2 — Hiérarchie, typographie, signes de design générique

#### P2-1. Le même motif de section, répété partout
- **Captures :** `home-produits-1.png`, `home-professionnels-1.png`, `home-contact-1.png`
- **Problème :** chaque section suit le même gabarit : surtitre en capitales espacées, H2 serif avec un mot en italique doré (« Morilles séchées *premium* », « Pour les *chefs d'exception* », « Questions *fréquentes* », « *Contactez*-nous »), filet or de 24 px, paragraphe centré gris clair. S'y ajoutent des particules dorées flottantes dans le hero, des cartes qui se soulèvent au survol et des phrases toutes faites (« Un trésor rare… pour les palais les plus exigeants », « Aucun concurrent ne peut garantir ça »). C'est la signature d'un template « luxe » généré, qui dilue le sérieux recherché.
- **Changement :**
  - Garder le mot doré en italique **uniquement dans le hero**. Ailleurs, H2 en serif droit et titres informatifs (« Tarifs au kilo », « Fiche technique », « Nous contacter »).
  - Supprimer les particules du hero (`HeroSection.tsx`, boucle `[...Array(6)]`).
  - Aligner à gauche les sections informatives (prix, fiche, formulaire) ; le centré reste pour les sections éditoriales.
  - Supprimer les superlatifs non prouvables (« Aucun concurrent ne peut garantir ça », « arôme garanti », « retours unanimes »).

#### P2-2. Lisibilité : texte fin et gris sur fond sombre
- **Captures :** `home-professionnels-2.png`, `fiche-desktop-fold.png`
- **Problème :** le corps de texte est en `font-light` (300) et `text-sm`, en `text-muted-foreground`, sur fond `#1a1612`. Les infos clés (prix, conditions) ont un contraste faible. La nav est aussi en capitales fines grises. La fiche technique descend à 7-9 px.
- **Changement :** corps de texte en 400 et 16 px sur toutes les pages pro. Prix et conditions en `text-foreground`. Réserver le `font-light` aux titres display. Viser un contraste AA (4,5:1) pour tout texte informatif.

#### P2-3. Formatage des prix non français
- **Captures :** `produits-fold.png`, `pdp-sousvide-desktop-fold.png`
- **Problème :** « 12.00 € », « 59.00 € », « 360.00 € » (`toFixed(2)`).
- **Changement :** `new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })` pour obtenir « 12,00 € » et « 1 800,00 € », avec « €/kg » pour les prix pro.

#### P2-4. Page d'accueil trop longue pour un pro
- **Problème :** 13 745 px sur desktop, 21 693 px sur mobile. Onze sections, dont trois narratives (Nées du feu, Galerie, À propos) passent avant la section Pro.
- **Changement :** ordre proposé : Hero → TrustBandeau → **ProStrip** → Produits → Pourquoi (tableau comparatif) → Processus → À propos → Galerie → FAQ → Contact. Masquer la section Avis tant qu'elle est vide.

#### P2-5. La page /produits et la fiche produit n'orientent pas le pro
- **Captures :** `produits-bottom.png`, `pdp-sousvide-desktop-fold.png`
- **Problème :** le bloc « Vous travaillez en volume ? » en bas de `/produits` renvoie vers `/#contact`, le formulaire générique. La fiche sous vide affiche 1 kg à 420 € sans signaler le tarif pro à 360 €/kg. Un pro qui l'achète paie 60 € de trop, puis le découvre.
- **Changement :** sur la PDP sous vide, sous les formats, ajouter un encart **« Vous êtes professionnel ? Au kilo dès 360 €/kg, prix net, facture. → Tarifs pro »**. En bas de `/produits`, le CTA devient **« Voir les tarifs pro au kilo »** → `/professionnels`.

---

## Maquette textuelle — page `/professionnels`

Nouvelle route `src/pages/Professionnels.tsx`. Elle remplace l'ancre `#professionnels` comme destination de la nav, et `/pre-commande` redirige vers `/professionnels#devis`. La page réutilise `Navbar` et `Footer`, avec des sections alignées à gauche, un corps à 16 px et une largeur maximale de 1100 px.

```
┌────────────────────────────────────────────────────────────────────┐
│ 1. HERO PRO  (fond sombre, photo sachet 1 kg sous vide à droite)   │
│   Surtitre : RESTAURANTS · ÉPICERIES FINES · DISTRIBUTEURS         │
│   H1 : Morilles de feu séchées, au kilo.                           │
│   Sous-titre : Récolte 2026 en stock. Têtes entières sans queue,   │
│   séchées sur place en Colombie-Britannique, lot tracé.            │
│   Expédition sous 48 h.                                            │
│   [Demander un devis]  (plein or → #devis)                         │
│   [Recevoir un échantillon]  (contour → #echantillon)              │
│   Ligne réassurance : Prix nets · Facture systématique ·           │
│   Réponse sous 24 h · 07 82 16 27 08                               │
│   Jauge StockGauge : « Récolte 2026 : 45 kg disponibles »          │
│   (optionnel, mis à jour à la main)                                │
├────────────────────────────────────────────────────────────────────┤
│ 2. TARIFS AU KILO  (composant ProPriceTable, source proPricing.ts) │
│   H2 : Tarifs au kilo                                              │
│   Tableau :      1–4 kg     5–9 kg     10 kg et +                  │
│     Brune        360 €/kg   340 €/kg   Sur devis                   │
│     Blonde&grise 390 €/kg   370 €/kg   Sur devis                   │
│     Verte        Sur demande, selon disponibilité                  │
│   Sous le tableau : Prix nets. Pas de TVA facturée (art. 293 B     │
│   CGI) : le prix affiché est votre coût final. Minimum 1 kg par    │
│   variété. Sachets sous vide de 500 g ou 1 kg.                     │
│   Lien : Comparer : 1 kg en boutique = 420 € → 360 € en pro.       │
├────────────────────────────────────────────────────────────────────┤
│ 3. POUR QUI  (3 colonnes, texte, pas d'icône décorative)           │
│   Restaurants : sachet 1 kg sous vide, réouverture en bocal,       │
│     rendement ×8 à 10 [valeur unique à valider].                   │
│   Épiceries fines : pots verre 12 / 30 / 45 g étiquetés, prix      │
│     revendeur → « Recevoir la grille revendeur ».                  │
│   Distributeurs : 10 kg et plus, tarif dédié, rappel sous 24 h.    │
├────────────────────────────────────────────────────────────────────┤
│ 4. FICHE TECHNIQUE  (ProSpecSheet, grille 2 col., source           │
│    productSpecs.ts)                                                │
│   Espèces · Origine · Récolte 2026 · Séchage (1 valeur) ·          │
│   Humidité < 12 % · Calibre 3–7 cm · Sans queue · DLUO (1 valeur)  │
│   · Allergènes · Conditionnement.                                  │
│   Photo : étiquette sachet avec n° de lot + morilles sur règle.    │
│   [Télécharger la fiche technique — PDF, 1 page]                   │
│   [Télécharger le catalogue pro 2026 — PDF, 5 pages]               │
├────────────────────────────────────────────────────────────────────┤
│ 5. TRAÇABILITÉ EN 4 ÉTAPES  (frise horizontale, reprise de         │
│    ProcessSection)                                                 │
│   Cueillette (zone brûlée, date) → Achat le soir aux cueilleurs →  │
│   Séchage sur place → Mise sous vide, lot n° MDC-26-XXX.           │
│   Une phrase : « Chaque sachet porte un numéro de lot qui renvoie  │
│   à la zone et à la date de récolte. »                             │
├────────────────────────────────────────────────────────────────────┤
│ 6. ÉCHANTILLON  (#echantillon, SampleRequest)                      │
│   H2 : Goûtez avant de commander                                   │
│   Échantillon 20 g pour les professionnels, déduit de la première  │
│   commande. [Recevoir un échantillon]                              │
├────────────────────────────────────────────────────────────────────┤
│ 7. ILS TRAVAILLENT NOS MORILLES  (ProReferences — masqué si vide)  │
│   2–3 citations : nom du chef, établissement, ville.               │
├────────────────────────────────────────────────────────────────────┤
│ 8. CONDITIONS  (liste courte, 2 colonnes)                          │
│   Commande : dès 1 kg · Devis sous 24 h                            │
│   Expédition : sous 48 h, sous vide, colis suivi, France & UE      │
│   Livraison : offerte dès 2 kg en France [à valider]               │
│   Paiement : virement à réception de facture [à valider]           │
│   Facture : systématique · SIRET 802 861 948 00023                 │
│   Stock : récolte 2026 limitée, pas de réassort avant 2027         │
├────────────────────────────────────────────────────────────────────┤
│ 9. DEVIS  (#devis, ProQuoteForm, 2 colonnes : formulaire + carte   │
│    Valérian)                                                       │
│   Gauche — formulaire en 1 écran :                                 │
│     Vous êtes : (Restaurant)(Épicerie fine)(Traiteur)              │
│                 (Distributeur)(Autre)                              │
│     Établissement* · Email* · Téléphone                            │
│     Variété : (Brune)(Blonde & grise)(Je ne sais pas encore)       │
│     Quantité : (1 kg)(2–4 kg)(5–9 kg)(10 kg +)                     │
│       → estimation live « ≈ 1 800 € »                              │
│     Code postal de livraison                                       │
│     [ ] Je souhaite d'abord un échantillon                         │
│     Message (facultatif)                                           │
│     [Recevoir mon devis — sans engagement]                         │
│     Aucun paiement à cette étape. Réponse sous 24 h ouvrées.       │
│   Droite — carte contact : portrait Valérian, « Votre              │
│     interlocuteur unique », 07 82 16 27 08 (tel:),                 │
│     contact@morillesducanada.com (mailto:), lien WhatsApp          │
│     [à valider].                                                   │
├────────────────────────────────────────────────────────────────────┤
│ 10. FAQ PRO  (accordéon, 5 questions)                              │
│   Puis-je récupérer la TVA ? · Quel rendement après                │
│   réhydratation ? · Comment conserver un sachet de 1 kg ouvert ? · │
│   Livrez-vous en Belgique / Suisse ? · Pouvez-vous réserver du     │
│   stock pour la saison prochaine ? (→ précommande 2027)            │
├────────────────────────────────────────────────────────────────────┤
│ 11. BLOC FINAL  (sticky mobile)                                    │
│   Mobile : barre fixe bas en 2 boutons [Appeler] [Devis]           │
└────────────────────────────────────────────────────────────────────┘
```

**Composants et fichiers à créer :**
| Fichier | Rôle |
|---|---|
| `src/pages/Professionnels.tsx` | Page ci-dessus + `Helmet` (title « Morilles de feu séchées au kilo — Tarifs professionnels \| Morilles du Canada ») |
| `src/lib/proPricing.ts` | Variétés, paliers, mention fiscale, minimum ; consommé partout |
| `src/lib/productSpecs.ts` | Séchage, humidité, calibre, DLUO, rendement, allergènes ; consommé par fiche, PDP, FAQ |
| `src/components/pro/ProPriceTable.tsx` | Tableau responsive (cartes empilées < 640 px) |
| `src/components/pro/ProSpecSheet.tsx` | Grille de spécifications + liens PDF |
| `src/components/pro/ProQuoteForm.tsx` | Formulaire devis (réutilise l'insert `contact_messages` + `notify-contact` de `PreOrder.tsx`) |
| `src/components/pro/SampleRequest.tsx` | Demande d'échantillon |
| `src/components/pro/ProReferences.tsx` | Citations pros (rendu nul si vide) |
| `src/components/pro/StockGauge.tsx` | « X kg disponibles » (optionnel) |
| `src/components/ProStrip.tsx` | Bande pro compacte pour l'accueil |
| `src/components/ProAnnouncementBar.tsx` | Bandeau d'annonce au-dessus de la nav |
| `public/docs/*.pdf` | Catalogue et fiche technique en vrais PDF |

Modifications : `App.tsx` (route `/professionnels`, redirection de `/pre-commande`), `Navbar.tsx` (bouton « Espace pro »), `HeroSection.tsx` (CTA), `FloatingCTA.tsx` (contextuel), `Index.tsx` (ordre des sections), `ContactSection.tsx` (radio Particulier/Pro), `i18n/fr.ts` et `en.ts`.

---

## Récapitulatif des 8 changements prioritaires

1. **Passer de « précommande été 2026 » à « en stock, au kilo, expédié sous 48 h »** sur la section Pro, `/pre-commande` et la plaquette (P0-1).
2. **Unifier les prix et la mention fiscale** (supprimer la TVA 5,5 % et la colonne HT de la plaquette ; une seule grille de variétés) via `proPricing.ts` (P0-2).
3. **Rendre le chemin pro visible dès le hero** : CTA « Tarifs pro au kilo », micro-ligne « Dès 360 €/kg · Prix nets · Expédition 48 h », bouton nav « Espace pro », bandeau d'annonce, `FloatingCTA` contextuel (P0-3).
4. **Créer la page `/professionnels`** selon la maquette ci-dessus (tarifs, fiche, échantillon, conditions, devis) et y faire pointer tous les CTA pro.
5. **Livrer de vrais PDF** (catalogue, fiche technique) et ajouter nav et CTA aux pages HTML correspondantes (P0-4).
6. **Harmoniser la fiche technique** : séchage, DLUO, réhydratation, rendement, calibre, allergènes, numéro de lot visible, via `productSpecs.ts` (P0-5).
7. **Refaire le formulaire de devis** : sans plafond de 20 kg, sans paiement préalable, avec échantillon et code postal, CTA « Recevoir mon devis — sans engagement », réponse sous 24 h. Côté contact, radio Particulier/Pro (P1-1, P1-2).
8. **Remplacer la preuve sociale absente par de la preuve réelle** : masquer la section avis vide, ajouter une offre d'échantillon pro et 2-3 références de chefs ou d'épiceries (P1-3, P1-4).
