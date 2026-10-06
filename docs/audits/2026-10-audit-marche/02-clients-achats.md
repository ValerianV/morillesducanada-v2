# Audit marché — 02. Clients et comportements d'achat

Date : 2026-10-06. Périmètre : segments clients, façon de choisir un fournisseur, échec de l'email froid, classement pour ce vendeur.
Budget utilisé : 25 recherches web sur 25. Étiquettes : **[FAIT]** = relevé dans une source citée ; **[ESTIMATION]** = raisonnement ou ordre de grandeur de l'auteur, à valider sur le terrain.

Limite de l'audit : très peu de données publiques existent sur les achats de morilles séchées par segment (aucune étude chiffrée par type de client trouvée). Les volumes par client sont donc des estimations. Les études de comportement d'achat des chefs sont surtout anglo-saxonnes (États-Unis, Royaume-Uni, Canada) : elles indiquent une tendance, pas une mesure sur la France.

---

## 1. Le marché en une ligne : le volume ne manque pas, l'accès si

- **[FAIT]** Ventes de morilles séchées en France : 89 t en 2020, 116 t en 2022 ; Sabarot seul : 40 t en 2023 (article de Réussir du 29 août 2024). Source : https://www.reussir.fr/lesmarches/la-morille-detrone-t-elle-la-truffe. Périmètre exact des 116 t non précisé (tous circuits, gros industriels inclus ?) : à prendre comme ordre de grandeur.
- **Le stock de 45 kg = environ 0,04 % de ce marché.** **[ESTIMATION]** (45 kg / 116 000 kg). Il n'y a aucun problème de taille de marché ; le problème est de trouver 10 à 15 acheteurs qui font confiance à un vendeur inconnu.
- **[FAIT]** Les circuits « normaux » de la morille séchée sont déjà occupés : les grossistes CHR référencent des morilles séchées (Pomona/Champiland : https://cdn.api.groupe-pomona.fr/public/products/0189951/branch/es/medias/morille-speciale-sechee-en-boite-200-g-champiland_0189951_es_technical.pdf ; Picosa 1 kg : https://cdn.api.groupe-pomona.fr/public/products/0258812/branch/ch/medias/morilles-sachet-1kg-picosa_0258812_ch_technical.pdf), les spécialistes de Rungis aussi (NSR, champignons frais et secs : https://www.gillespudlowski.com/282698/produits/rungis-les-champignons-selon-nsr), et le marché de la restauration est dominé par les grossistes spécialisés (Pomona, Transgourmet, Sysco) : https://www.xerfi.com/presentationetude/les-fournisseurs-du-marche-food-service_dis43.
- **Point d'attention sur les sources.** L'article de Réussir cite aussi un prix moyen de 605 € HT/kg « aux marchés de Carpentras et Richerenches ». Ce sont des marchés aux truffes : ce chiffre est très probablement un prix de truffe noire et **ne doit pas être utilisé comme prix de la morille** (lecture non vérifiée sur l'article complet).

### Ce que le prix de 350 €/kg change réellement pour un restaurant

- **[FAIT]** Recettes grand public : environ 4 à 5 g de morilles séchées par personne pour une sauce, 12 g en accompagnement (sources de recettes : https://dubocalalassiette.fr/blog/sauce-aux-morilles-pour-volaille/ ; fiche Pomona/Champiland ci-dessus). Ordre de grandeur, pas une norme.
- **[ESTIMATION]** Coût matière par couvert : 5 g x 350 €/kg = **1,75 €** ; 10 g = 3,50 €. Face à une morille de marque à 267 €/kg HT (Plantin via Le Labo du Boucher, relevé dans `docs/business/etude-marche-2026-09.md`), l'écart est d'environ **0,40 € par assiette**. Pour un plat de bistronomie ou de table étoilée, **le prix au kilo n'est pas ce qui bloque l'achat**. Ce qui bloque : la confiance, l'habitude, la facilité de commande, et les papiers (voir point 5 du résumé).
- **[ESTIMATION]** Pour un traiteur ou un fabricant qui fait des centaines de couverts, 0,40 € x volume compte : la sensibilité au prix y est réelle.

---

## 2. Segments : comportements d'achat

Volumes en **kg de morilles séchées par client et par an**. Tous les volumes sont des **[ESTIMATION]** (calcul : 5-10 g par couvert x couverts vendus par an ; recoupé avec la colonne « volume typique » de `docs/commercial/strategie.md`).

| Segment | Volume / client / an | Qui décide | Critères d'achat | Fournisseurs habituels | Quand | Sensibilité prix | Meilleure approche |
|---|---|---|---|---|---|---|---|
| **Tables étoilées / gastronomiques** | 1 à 4 kg [ESTIMATION] | Chef de cuisine ou chef-propriétaire ; en groupe, le chef exécutif | Qualité (arôme, propreté, calibre régulier), unicité, régularité, fiabilité de livraison [FAIT, enquête chefs américains : https://extension.unr.edu/4h/pub.aspx?PubID=2226] | Grossiste CHR, Rungis, petits distributeurs de produits rares, producteurs en direct | Au changement de carte (automne, menus de fêtes, printemps pour la morille fraîche) [ESTIMATION] | Faible sur le kilo (voir calcul 1,75 €/couvert) ; forte sur la régularité | Visite en milieu de matinée ou entre services, échantillon en main, puis commande de 1 kg |
| **Bistronomie, restaurants à sauce morille** | 0,5 à 2 kg [ESTIMATION] | Chef-propriétaire | Prix par couvert, fiabilité, facilité de commande | Cash & carry (Metro), grossiste livreur | Toute l'année, pic de fêtes | Moyenne à forte (food cost) | Passage + échantillon ; très sensibles au « pourquoi changer de mon fournisseur actuel » |
| **Traiteurs haut de gamme** | 2 à 10 kg (rarement plus) [ESTIMATION] | Chef-propriétaire ou chef de production | Rendement, prix par portion, régularité, facture et fiche technique | Grossiste CHR, Metro | **Octobre à début décembre** (fêtes, mariages de fin d'année) [ESTIMATION] | Forte | Appel puis visite à l'atelier ; devis sous 48 h |
| **Épiceries fines** | 0,5 à 2 kg ; 5 kg exceptionnel [ESTIMATION] | Le patron (souvent seul décideur) | Marge (coefficient ~1,70 [FAIT, `docs/business/etude-marche-2026-09.md`]), histoire du produit, exclusivité locale, régularité ; référence souvent trouvée chez des confrères, sur salon ou plateforme [FAIT : https://modelesdebusinessplan.com/blogs/infos/grossiste-epicerie-fine] | Grossistes d'épicerie fine, marques connues (Plantin, Sabarot, Borde), Ankorstore | **Septembre à novembre** pour le stock de fêtes | Moyenne : ils regardent la marge à 580-1 000 €/kg de revente [FAIT, `docs/business/marche.md`] | Visite avec pot de 30 g ; le patron goûte et décide seul |
| **Fromagers** | 0,25 à 1 kg [ESTIMATION] | Le patron | Produit d'appel de fêtes, accord avec fromages | Grossistes, marchés | Novembre-décembre | Moyenne | Visite ; marginal en volume |
| **Cavistes-épiceries** | 0,25 à 1 kg [ESTIMATION] | Le patron | Cadeaux de fêtes, petits formats | Ankorstore, grossistes | Octobre-décembre | Moyenne | Visite ; marginal en volume |
| **Boutiques de truffes / produits de terroir de luxe** | 1 à 5 kg [ESTIMATION] | Patron | Cohérence avec la gamme luxe, tourisme et fêtes | Plantin, Sabarot, grossistes | **Mi-novembre à mars** (saison truffe) ; marchés de Carpentras (vendredi) et Richerenches (samedi) à partir de mi-novembre [FAIT : https://www.echodumardi.com/actualite/le-marche-aux-truffes-dhiver-est-de-retour-a-carpentras/?print=pdf ; https://www.jds.fr/valreas/foires-et-salons/marches/ban-des-truffes-a-richerenches-1312227_A] | Moyenne | Visite en Vaucluse pendant le séjour à Avignon |
| **Distributeurs spécialisés CHR (type Pomona, Transgourmet, Metro)** | Plusieurs dizaines de kg [ESTIMATION] | Acheteur catégorie | Référencement, fiche technique, régularité, assurance, prix | Marques établies | Appels d'offres annuels | Très forte (130-240 €/kg [FAIT, `docs/business/marche.md`]) | **Exclu**, hors de portée d'un vendeur seul |
| **Petits distributeurs de produits rares pour chefs** (modèle Terroirs d'Avenir : +250 producteurs en direct, +100 restaurants clients [FAIT : https://parisbymouth.com/terroirs-davenir/]) | 5 à 15 kg [ESTIMATION] | Acheteur/fondateur | Histoire du producteur, qualité, exclusivité, facilité | Producteurs en direct | Avant l'hiver | Moyenne : revendent aux chefs avec marge (revente aux pros haut de gamme vue à ~470 €/kg [FAIT, `docs/business/marche.md`]) | Appel puis échantillon (autorisé après échange téléphonique) |
| **Grossistes de Rungis en champignons** | 10 à 45 kg d'un coup | Négociant | Prix | Importateurs | Toute l'année | Extrême (130-200 €/kg [FAIT, `docs/business/marche.md`]) | **Exclu** : sous le coût |
| **Marketplaces B2B (Ankorstore…)** | 0,5 à 2 kg par détaillant | Détaillant, via catalogue | Petits formats avec marque, premier achat bas risque | — | Précommandes de fêtes dès l'été | Moyenne | Commission 24 % première commande, 12 % réassort (grille 2023, tarif 2026 non vérifié) [FAIT, `docs/business/etude-marche-2026-09.md`]. Demande des formats détail étiquetés : trop lent pour 2026 |
| **Conserveurs et fabricants (sauces, plats cuisinés)** | Industriels : très gros ; artisans : 5 à 20 kg [ESTIMATION] | Acheteur / dirigeant | Cahier des charges, analyses, DDM, régularité, prix | Importateurs, grossistes de volume | Selon la fabrication | Très forte | Industriels : exclus. Artisans conserveurs : un ou deux à tester, si le fondateur peut fournir les papiers |
| **Boutiques d'hôtels** | Très faible | Direction / concierge | Cadeaux, marque | Grossistes | Fêtes | Faible | Hors cible ; en revanche **la table de l'hôtel** relève du segment gastronomique |

**[FAIT]** La recherche n'a pas trouvé de données publiques sur les achats de morilles séchées par segment (traiteurs, fromagers, fabricants). Ces lignes sont des hypothèses de travail.

---

## 3. Ce que disent les sources sur le choix d'un fournisseur de produit rare

### Faits

- **[FAIT] La relation compte plus que la transaction.** Étude sur les chefs Relais & Châteaux : les chefs investissent du temps dans la relation avec les producteurs, certains la gardent après un déménagement ; la qualité et la relation passent avant le prix. Source : https://uwspace.uwaterloo.ca/items/cd55b01d-6922-4337-b55c-5a1904f73865 (étude canadienne, échantillon réduit).
- **[FAIT] Préférence pour la source directe.** Enquête auprès de chefs américains : 71 % préfèrent acheter directement auprès d'un producteur plutôt que via un courtier ; critères notés : qualité (4,97/5), unicité (4,48/5), fraîcheur et régularité (4,97 et 4,87/5) ; craintes : régularité de livraison, minimum de commande, saisonnalité, tarif. Source : https://extension.unr.edu/4h/pub.aspx?PubID=2226.
- **[FAIT] Le risque sanitaire pèse lourd sur les champignons sauvages.** Un chef de Boston : il n'achète pas à des cueilleurs inconnus car il ne peut pas « se porter garant » de leurs pratiques ; les chefs paient un supplément à un intermédiaire pour réduire le risque et sécuriser l'approvisionnement. Source : https://thecounter.org/morels-and-middlemen/ (marché américain ; Mikuni Wild Harvest, ~10 M$ de chiffre d'affaires, 38 salariés, des milliers de cueilleurs). Conséquence pour un vendeur seul : sans cadre de traçabilité visible, un chef prudent préfère un distributeur connu.
- **[FAIT] Le « bouche à oreille entre chefs » est la voie principale de découverte d'un cueilleur** (résumé de recherche, articles non relus en entier : https://onmilwaukee.com/articles/mushroommike ; https://restaurantbusinessonline.com/day-life-forager).
- **[FAIT] La provenance se raconte à table, mais « local » domine.** Enquête britannique auprès de 122 chefs : près de 8 sur 10 jugent que les clients valorisent la transparence sur les ingrédients ; 65 % classent « local » comme première allégation de provenance ; 71 % pensent pouvoir facturer plus pour une provenance vérifiée. Source : https://www.tepae.co.nz/news/before-the-first-bite-the-power-of-provenance-on-modern-menus. Un récit « Canada, forêts brûlées, cueilleur » est exotique, pas « local » : il joue sur le registre « sauvage, rare, vécu », pas sur le registre dominant.
- **[FAIT] Des produits rares atteignent les chefs par des distributeurs de confiance** : Terroirs d'Avenir est parti de quelques chefs de référence (Daniel Rose, Braden Perkins, Grégory Marchand) avant de fournir plus de 100 restaurants ; 100 % d'achats en direct aux producteurs. Sources : https://parisbymouth.com/terroirs-davenir/ ; https://frenchfoodcapital.com/en/participation/terroirs-davenir-2/.

### Poids réel du récit de cueilleur : lecture de l'auteur

**[ESTIMATION]** Le récit est un **départageur, pas un déclencheur**.

1. Le déclencheur est : un produit que le chef a eu en main et goûté, une personne identifiable, un risque d'achat faible (1 kg, facture normale), un prix acceptable par couvert.
2. Le récit de « trois saisons de cueillette 2022-2024 » est invérifiable par email et se copie en une ligne : un concurrent direct (Morilles Sauvages, cueilleur de Colombie-Britannique) tient le même discours (`docs/business/marche.md`). Il n'a de poids que porté par la personne en face du chef (visite, échantillon, anecdote).
3. Pour un épicier, l'histoire a de la valeur au rayon (étiquette, conversation avec le client) : c'est son principal argument de revente, plus que pour un chef qui l'utilise peu à table.
4. Pour un traiteur ou un fabricant, le récit pèse peu : rendement, régularité et papiers dominent.

---

## 4. Pourquoi l'email froid ne marche pas sur ces cibles

### Constats

- **[FAIT] 0 réponse sur 42 est statistiquement banal.** Taux de réponse moyen de l'email froid B2B : environ 3,4 % (https://lemlist.com/blog/cold-email-response-rate, tous secteurs). Avec 42 envois, la probabilité de n'avoir aucune réponse est d'environ **23 %** à 3,4 %, 43 % à 2 %. **[ESTIMATION]** (calcul 0,966^42 ; 0,98^42). Même un très bon résultat (3-4 %) donnerait 1 à 2 réponses, très loin des 10 à 15 clients nécessaires. Les relances (42 de plus) ne changent pas la nature du problème. Une source de génération de leads annonce 10 % pour la restauration, sans méthode publiée : non retenue.
- **[FAIT] Les chefs préfèrent le téléphone ou la visite pour un premier contact avec un producteur** : 51,6 % téléphone, 29 % email, 19,4 % visite (enquête américaine : https://extension.unr.edu/4h/pub.aspx?PubID=2226). L'email est préféré *après* l'établissement de la relation (69 % pour les mises à jour de disponibilité), même source.
- **[FAIT] Les bonnes pratiques de contact sont physiques** : visite en milieu de matinée (10 h-12 h), jamais pendant la préparation ni le service, échantillon étiqueté avec fiche de prix et QR/numéro, deux relances maximum (https://www.localline.co/blog/how-to-sell-to-restaurants). Créneaux d'appel cités : mardi à jeudi, 10 h-11 h 30 ou 15 h-17 h (https://www.mapsleads.co/fr/blog/leads-google-maps-restaurants, source commerciale, à prendre avec prudence).

### Causes probables **[ESTIMATION]**

1. **Le bon destinataire ne lit pas.** Les adresses publiques (contact@, info@, formulaire) sont lues par un gérant, un maître d'hôtel ou personne ; le chef ne les consulte pas.
2. **Un produit sensoriel ne se vend pas par texte.** La morille séchée se juge à l'arôme, à la propreté, à l'intégrité des chapeaux. Sans échantillon en main, la décision est aveugle.
3. **Aucune confiance préalable** : expéditeur inconnu, domaine neuf, promesse non vérifiable (voir point 3, risque sanitaire).
4. **Mauvais moment** : octobre est le plein de saison pour les restaurateurs et le début de saison de fêtes pour les épiciers ; un email non sollicité passe à la corbeille.
5. **Délivrabilité possiblement dégradée** : domaine d'envoi récent (`pro.morillesducanada.com`), vagues groupées, relances qui ressemblaient à un envoi automatisé (constat du fondateur le 6 octobre, `docs/commercial/emails-prospection.md` section 0). **À vérifier dans le tableau de bord Resend : rebonds, plaintes, ouvertures.** Si le taux d'ouverture est très bas, c'est la délivrabilité, pas le message.
6. **Concurrence installée** : Sabarot, Plantin, Borde et les marques en grossiste sont déjà chez le client ; il n'y a aucune urgence à changer.

### Alternatives qui ont fait leurs preuves pour de petits producteurs

| Méthode | Exemple ou preuve | Adaptation à ce vendeur |
|---|---|---|
| **Visite avec échantillon, milieu de matinée / entre services** | Pratique standard de vente aux chefs (https://www.localline.co/blog/how-to-sell-to-restaurants) ; seule vente réalisée à ce jour (Avignon, en personne) | Déjà la décision du 2026-10-01 (pot de 30 g en main propre) ; à systématiser |
| **Téléphone d'abord, échantillon ensuite** | Canal préféré des chefs (51,6 %, enquête américaine ci-dessus) | Le fondateur a déjà fixé la règle « envoi postal seulement après échange téléphonique » ; fait du téléphone le vrai point d'entrée |
| **Un chef de référence, puis le bouche à oreille** | Terroirs d'Avenir : quelques chefs fondateurs, puis plus de 100 restaurants (https://parisbymouth.com/terroirs-davenir/) ; forage de champignons : « la meilleure façon de trouver un cueilleur est le bouche à oreille entre chefs » | Viser 2-3 tables de référence à Avignon et en demander une recommandation à un confrère |
| **Distributeur de confiance comme relais** | Mikuni Wild Harvest côté nord-américain (https://thecounter.org/morels-and-middlemen/) ; Terroirs d'Avenir côté français | Un seul distributeur de produits rares qui accepte 10-15 kg vaut plusieurs dizaines de visites |
| **Salons professionnels** | Gourmet Sélection (épicerie fine, Paris, 7-8 juin 2026, 5 350 professionnels en 2025 : https://www.comexposium.com/en/?p=10507) ; Sirha Lyon, janvier 2027 (`docs/business/etude-marche-2026-09.md`) | Visiter, pas exposer : coût et délai trop élevés pour 45 kg. Utile pour la saison 2027 |
| **Plateformes régionales / marketplaces** | Ankorstore (commission 24 % puis 12 %), Gourming, OpenFood France | Pas adaptées à un vrac de 45 kg et aux nouvelles références sans marque ; priorité faible |

**[FAIT]** Aucun exemple chiffré de petit producteur de morilles séchées ayant gagné ses premiers clients par email froid n'a été trouvé.

---

## 5. Classement des segments pour CE vendeur

Contraintes : stock de 45 kg, un seul vendeur, présent à Avignon jusqu'au 7 novembre (environ 4 semaines), puis Chamonix, puis Maurienne en décembre. Vente en personne, sans équipe.

Tous les chiffres de ce tableau sont des **[ESTIMATION]** à confirmer sur les 10 premiers jours de visites.

| Rang | Segment | Zone / canal | Volume possible (total, saison 2026) | Probabilité de conversion par contact qualifié | Effort | Kg réalistes d'ici Noël |
|---|---|---|---|---|---|---|
| 1 | **Épiceries fines, fromagers, boutiques de truffes** (Avignon, Vaucluse, Luberon) | Visite avec pot de 30 g ; le patron décide seul | 1 à 2 kg par client | 15 à 25 % par visite avec dégustation | Faible à moyen : zone proche, visites courtes | **5 à 10 kg** |
| 2 | **Tables gastronomiques et bistronomie « produit »** (Avignon, Provence) | Visite en milieu de matinée ou entre services | 1 à 3 kg | 10 à 20 % par visite avec le chef présent | Moyen : trouver le chef, horaires contraints | **4 à 8 kg** |
| 3 | **Petit distributeur de produits rares pour chefs** | Appel puis échantillon (règle du 2026-10-01 respectée) | 5 à 15 kg d'un coup | 5 à 10 % par approche | Moyen : peu de cibles, appel à fort enjeu | **0 à 15 kg** (tout ou rien) |
| 4 | **Traiteurs haut de gamme** (Provence puis zone alpine) | Appel puis visite à l'atelier ; devis sous 48 h | 3 à 10 kg | 5 à 10 % | Moyen | **0 à 10 kg** |
| 5 | **Hôtels-restaurants de Chamonix et Maurienne** | Visite, entre saison ; avec réserve ci-dessous | 1 à 3 kg | Inconnue | Moyen à élevé | **0 à 5 kg** |
| 6 | **Précommande 2027** auprès de clients ayant goûté | Après première commande | 1 à 15 kg | Faible avant d'avoir un client réel | Faible une fois le client acquis | À traiter en 2027 |
| 7 | **Marketplaces B2B** (Ankorstore) | En ligne | 0,5 à 2 kg par détaillant | Faible, délai long | Élevé (étiquetage, formats détail, DDM) | ≈ 0 |
| 8 | **Grossistes de Rungis, distributeurs CHR généralistes, industriels** | — | Élevé | Élevée mais sous le coût | — | **À écarter** |

**Total réaliste : 15 à 30 kg d'ici Noël** **[ESTIMATION]**. Écouler les 45 kg d'ici Noël est improbable ; la morille séchée se conserve, la pression est surtout commerciale (fêtes, arrivée de la saison 2027).

### Réserves pratiques (calendrier)

- **Chamonix à partir du 8 novembre = entre-saison.** **[ESTIMATION, à vérifier auprès de l'office de tourisme]** De nombreux établissements d'altitude ferment entre la fin de l'automne et la mi-décembre ; une visite à Chamonix début-mi novembre risque de tomber sur des portes closes. En Maurienne, l'ouverture de la saison de ski se situe vers la mi-décembre ; les commandes de menus de fêtes se préparent en novembre-début décembre.
- **Vaucluse en novembre.** **[FAIT]** Les marchés aux truffes de Carpentras (vendredi) et Richerenches (samedi) ouvrent à la mi-novembre ; le « Ban des truffes » de Richerenches est le 5 décembre 2026 (sources ci-dessus). Les boutiques de truffes et de terroir de la zone sont à leur plus fort. **Décision pour le fondateur** : conserver l'option de rester en Provence 1 à 2 semaines de plus si les visites des deux premières semaines convertissent, plutôt que de partir le 8 novembre quoi qu'il arrive.

---

## 6. À vérifier avant la prochaine vague

1. Consulter les statistiques Resend (ouverture, rebond, plainte) des 42 + 42 envois : c'est la seule façon de distinguer « message inefficace » et « message jamais vu ».
2. **Papiers de traçabilité pour la revente.** Les épiciers qui reconditionnent et les traiteurs doivent pouvoir identifier le fournisseur et, pour la vente préemballée, apposer une date de durabilité minimale (DDM) et un numéro de lot ; la règle européenne de traçabilité « un pas en arrière, un pas en avant » s'applique à tout opérateur (règlement CE 178/2002, art. 18 : connaissance générale, non vérifiée dans cet audit). `docs/business/recit.md` interdit aujourd'hui de promettre lot, DDM, analyses ou origine précise. Ce n'est pas une promesse commerciale à inventer, mais un **point de blocage probable pour les épiciers et traiteurs** : à clarifier avec le fondateur (ce qu'il peut fournir réellement) avant la visite, pour répondre sans mentir à la question « et la DDM, le lot ? ».
3. Noter, pour chaque visite, le nom de l'établissement, le décideur, le volume actuel et le fournisseur actuel : après 20 visites, ces données remplaceront les estimations de ce document.

---

## Sources principales

- Réussir, « La morille détrône-t-elle la truffe ? » (29/08/2024) : https://www.reussir.fr/lesmarches/la-morille-detrone-t-elle-la-truffe
- The Counter, « When morels need a middleman » : https://thecounter.org/morels-and-middlemen/
- Univ. de Waterloo, chefs Relais & Châteaux : https://uwspace.uwaterloo.ca/items/cd55b01d-6922-4337-b55c-5a1904f73865
- Univ. du Nevada (extension), partenariats producteurs-chefs : https://extension.unr.edu/4h/pub.aspx?PubID=2226
- Local Line, vendre aux restaurants : https://www.localline.co/blog/how-to-sell-to-restaurants
- Tepae, enquête britannique sur la provenance : https://www.tepae.co.nz/news/before-the-first-bite-the-power-of-provenance-on-modern-menus
- Lemlist, taux de réponse email froid : https://lemlist.com/blog/cold-email-response-rate
- Terroirs d'Avenir : https://parisbymouth.com/terroirs-davenir/ ; https://frenchfoodcapital.com/en/participation/terroirs-davenir-2/
- Xerfi, fournisseurs du food service : https://www.xerfi.com/presentationetude/les-fournisseurs-du-marche-food-service_dis43
- Pomona, fiches morilles séchées : https://cdn.api.groupe-pomona.fr/public/products/0189951/branch/es/medias/morille-speciale-sechee-en-boite-200-g-champiland_0189951_es_technical.pdf
- Comexposium / Ankorstore / Gourmet Sélection : https://www.comexposium.com/en/?p=10507
- Épiceries fines, choix de fournisseurs : https://modelesdebusinessplan.com/blogs/infos/grossiste-epicerie-fine
- Marchés aux truffes : https://www.echodumardi.com/actualite/le-marche-aux-truffes-dhiver-est-de-retour-a-carpentras/?print=pdf ; https://www.jds.fr/valreas/foires-et-salons/marches/ban-des-truffes-a-richerenches-1312227_A
- Prix et concurrents : `docs/business/etude-marche-2026-09.md`, `docs/business/marche.md`
- Non lu (accès refusé, HTTP 403) : Slate, « Au Canada, la ruée vers les morilles de feu attire les Français » (https://www.slate.fr/story/266886/canada-morilles-de-feu-recolte-cueillette-aventure-foret-incendies-expedition-business-revente-champignon-nature) ; seuls les extraits de recherche ont été vus, non utilisés comme preuve.
