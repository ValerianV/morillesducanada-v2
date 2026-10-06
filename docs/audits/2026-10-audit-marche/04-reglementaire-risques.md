# Audit réglementaire et risques — Morilles du Canada

Date : 2026-10-06. Périmètre : droit français et européen en vigueur en octobre 2026, activité décrite dans
`CLAUDE.md` et `docs/business/offre.md` (import du Canada, stockage en France, sachets sous vide de 250 g,
pots en verre vides de 12/30/45 g, pots de 30 g remis en main propre, vente aux professionnels, colis en France).

**Ce document n'est pas un avis juridique.** Les points marqués **[À VÉRIFIER]** doivent être confirmés par l'autorité
(DDPP/DDETSPP du Vaucluse, douane), un expert-comptable, un conseil en douane ou un avocat avant d'agir.

Convention : **[FAIT]** = vérifié dans une source consultée pendant l'audit (lien donné) ; **[FAIT\*]** = règle
établie que je connais, dont le texte officiel n'a pas pu être rouvert (EUR-Lex et Légifrance bloquent les robots) :
la référence est donnée, à relire avant de s'en servir pour un document externe ; **[À VÉRIFIER]** = incertain ou à confirmer.

---

## 0. Synthèse : ce qui est obligatoire et probablement pas encore fait

Classé par urgence (le premier point concerne une activité en cours : remise des pots jusqu'au 7 novembre en Provence).

| # | Action | Pourquoi | Échéance |
|---|---|---|---|
| 1 | Étiqueter chaque pot d'échantillon et chaque sachet : dénomination, quantité nette, lot, DDM, conservation, nom et adresse de l'exploitant, origine, mode d'emploi (cuisson) | INCO art. 8(7) et 9 ; un don est une « mise sur le marché » (178/2002 art. 3) | Avant la prochaine remise de pot |
| 2 | Aligner la cuisson sur la recommandation officielle : **au moins 20 minutes** (le site, la fiche technique et le guide disent 15 minutes) et retirer l'affirmation « hémolysine » non sourcée | Information de sécurité inférieure aux recommandations sanitaires | Cette semaine |
| 3 | Établir comment les ≈ 45 kg actuels sont entrés en France (déclaration en douane commerciale, droits, TVA à l'import, EORI) et conserver les preuves | `docs/business/recit.md` laisse entendre que les envois commerciaux ne commenceront qu'en 2027 | Avant de livrer une grosse commande |
| 4 | Souscrire une RC professionnelle **avec garantie produits livrés** (et, si possible, frais de retrait) | Importateur = « producteur » au sens de la responsabilité du fait des produits (art. 1245-5 C. civ.) | Avant la première livraison ou la prochaine remise de pot |
| 5 | Registre des lots (entrée, lot interne, sorties par client) et procédure de retrait | 178/2002 art. 18 et 19 | Avant la première vente |
| 6 | Écrire à la DDPP/DDETSPP du Vaucluse pour faire confirmer par écrit le statut de l'activité (enregistrement, pas d'agrément, local de conditionnement) | 852/2004 art. 6 ; le cerfa 13984 ne vise que les denrées animales | Ce mois-ci |
| 7 | Faire analyser les lots (pesticides, métaux lourds ; micro et radioactivité en option) et faire confirmer l'espèce | Précédent de rappel de morilles séchées pour pesticides (§ 3) | Avant de vendre à de gros comptes |
| 8 | Prospection : ajouter une ligne d'opposition et d'identification dans chaque email, et une notice RGPD courte | L34-5 CPCE, RGPD art. 14 et 21 ; **la règle du 2026-10-06 (« jamais de formule de désinscription ») est trop stricte** (§ 5) | Avant la vague 1 |
| 9 | Déclaration de conformité des pots en verre et des sachets sous vide (contact alimentaire) | 1935/2004 art. 15-17 | Avant d'expédier des pots vides |
| 10 | Surveiller : facturation électronique (réception depuis le 1er sept. 2026, émission le 1er sept. 2027), nouvelle directive produits défectueux (9 déc. 2026) | Calendrier | — |

---

## 1. Stocker, conditionner et vendre des champignons séchés

### 1.1 Déclaration d'activité, agrément, DDPP

- **[FAIT]** Le cerfa 13984 (déclaration d'activité auprès de la DDPP/DDETSPP) ne concerne que les établissements qui
  préparent, manipulent, entreposent ou vendent des denrées **animales ou d'origine animale**
  ([service-public, formulaire 13984](https://entreprendre.service-public.gouv.fr/vosdroits/R17520?lang=en)).
  Des morilles séchées seules (aucun produit animal) n'en relèvent pas.
- **[FAIT\*]** L'**agrément sanitaire** (règlement CE 853/2004, art. 4 ; arrêté du 8 juin 2006) ne vise que les
  établissements de produits d'origine animale. **Aucun agrément ni dérogation n'est nécessaire** pour des champignons secs.
  [Règlement 853/2004](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32004R0853).
- **[FAIT\*]** Mais le **paquet hygiène s'applique** : tout exploitant du secteur alimentaire, même de denrées végétales,
  doit notifier ses établissements à l'autorité compétente (règlement CE 852/2004, art. 6(2)), appliquer les bonnes
  pratiques d'hygiène et des procédures fondées sur les principes HACCP adaptées à sa taille (art. 5 et annexe II).
  [Règlement 852/2004](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32004R0852).
- **[À VÉRIFIER]** Comment cette notification se fait en France pour un opérateur 100 % végétal (pas de téléprocédure
  dédiée connue ; la DGCCRF contrôle ces denrées au sein des DD(ETS)PP). Action : un email à la DDPP du Vaucluse décrivant
  l'activité (import, stockage, conditionnement sous vide, remise de pots) et demandant une réponse écrite. Vérifier aussi
  que le code d'activité du SIRET (guichet unique des formalités) couvre le commerce de gros alimentaire et le conditionnement.
- **[À VÉRIFIER]** Lieu : l'adresse d'exploitation est à Aubignan (`src/lib/legal.ts`). Si le stockage ou la mise sous
  vide se fait dans un logement, l'annexe II chap. III du 852/2004 (locaux utilisés principalement comme habitation) impose
  une zone dédiée, propre, protégée des nuisibles et des animaux domestiques, et sans croisement avec l'usage privé.
  Le dire à la DDPP dans le même email.

### 1.2 Plan de maîtrise sanitaire (PMS) allégé

**[FAIT\*]** Pas de guide de bonnes pratiques spécifique aux champignons secs connu ; un PMS court suffit, sur une à deux
pages, tenu à jour : hygiène des mains et du poste, nettoyage et matériel, locaux (sec, ventilé, hors sol, hors lumière),
lutte contre les nuisibles (les champignons secs attirent les mites alimentaires), contrôle d'humidité à réception,
gestion des non-conformités, procédure de retrait. Le sous vide limite l'humidité et les nuisibles ; il ne remplace pas
le contrôle de l'humidité à l'entrée. Pas de chaîne du froid.

- **[À VÉRIFIER]** Formation à l'hygiène : l'obligation légale (formation spécifique d'une personne) vise la restauration
  commerciale, pas le négoce de denrées sèches. Une formation courte (≈ 14 h, ordre de grandeur 250 à 400 €, à confirmer)
  reste utile pour les audits clients.
- **[À VÉRIFIER]** Humidité et activité de l'eau du produit sec (cible bas, à faire mesurer sur un lot) et durée de vie
  réelle : elle fonde la DDM (§ 2.1). Aucune DDM chiffrée n'est validée dans le dépôt (`docs/business/recit.md`).

### 1.3 Traçabilité et registre des lots

- **[FAIT\*]** Règlement CE 178/2002, art. 18 : traçabilité « un pas en arrière, un pas en avant » (fournisseur,
  clients professionnels) ; art. 19 : retrait et information de l'autorité si un produit n'est pas sûr ; art. 14 : interdiction
  de mettre sur le marché une denrée dangereuse. [Règlement 178/2002](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32002R0178).
- **[FAIT\*]** Définition de la mise sur le marché (art. 3(8)) : elle inclut le fait de **transférer à titre gratuit**.
  Les pots d'échantillon remis en main propre y sont soumis comme une vente.
- Registre minimal (tableur, une ligne par mouvement) : date d'entrée, quantité, fournisseur (**interne, jamais publié**), numéro de
  lot interne, date de mise sous vide, DDM, analyses, puis chaque sortie (client, SIRET, date, lot, quantité, numéro de
  facture). Un lot par origine/fournisseur ; ne jamais mélanger deux lots dans un sachet sans nouveau numéro.
  La confidentialité des cueilleurs reste intacte : le registre est un document interne montré seulement aux autorités.
- **[À VÉRIFIER]** Durée de conservation : au moins la durée de vie du produit ; pratique sûre : 5 ans (les factures :
  10 ans, obligation comptable).
- Faire **un exercice de retrait à blanc** une fois (retrouver en moins de 24 h tous les clients d'un lot).

### 1.4 Pots d'échantillon et sachets sous vide

- Mettre sous vide ou remplir un pot **est du conditionnement** : l'étiquette est de la responsabilité de l'exploitant dont le
  nom figure dessus (INCO art. 8(1)), donc la tienne.
- **[FAIT\*]** Matériaux au contact (règlement CE 1935/2004, art. 15-17 ; bonnes pratiques de fabrication, règlement 2023/2006 ;
  plastiques, règlement UE 10/2011 pour les sachets sous vide) : conserver la **déclaration de conformité** du fournisseur de
  sachets, de pots et de couvercles, avec la traçabilité (référence, lot). Pots vendus vides : fournir la déclaration de
  conformité au client sur demande, pots neufs, sous emballage propre.
  [1935/2004](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32004R1935) ·
  [10/2011](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32011R0010).
- **[À VÉRIFIER]** Balance : les produits préemballés vendus au poids exigent une quantité nette exacte ; une balance servant
  à des transactions commerciales relève de la métrologie légale (instrument conforme, vérification périodique).
  Demander à la DDPP ou au service de métrologie (DREETS) si la balance utilisée doit être un instrument réglementé.
- **[À VÉRIFIER]** Espèce : le fonds de commerce repose sur « morilles de feu sauvages ». Faire confirmer par un mycologue
  ou un test ADN que les lots sont bien des *Morchella* (pas de fausses morilles, *Gyromitra* ou *Verpa*, toxiques), et
  conserver la preuve. Demander à la DDPP si un contrôle mycologique ou une liste d'espèces commercialisables s'applique aux
  champignons sauvages **séchés importés** (la réglementation sur les champignons sauvages frais relève d'arrêtés préfectoraux ;
  la DGCCRF a mené des enquêtes de traçabilité et d'origine).

---

## 2. Étiquetage (règlement INCO 1169/2011)

### 2.1 Ce qu'exige le texte pour une vente entre professionnels

**[FAIT]** Art. 8(7) : pour les denrées préemballées vendues à un stade antérieur au consommateur, ou à un restaurateur,
traiteur ou autre « collectivité » (mass caterer), les mentions obligatoires peuvent figurer sur l'emballage, l'étiquette
**ou les documents commerciaux** s'ils accompagnent ou précèdent la marchandise ; **mais** les mentions de l'art. 9(1)
points **a (dénomination), f (date de durabilité minimale), g (conditions de conservation), h (nom et adresse de
l'exploitant)** doivent figurer sur l'emballage extérieur. Art. 8(8) : informer l'acheteur professionnel de façon suffisante
pour qu'il respecte ses propres obligations.
Source consultée : [art. 8 INCO, texte repris par legislation.gov.uk](https://www.legislation.gov.uk/eur/2011/1169/article/8/2014-12-13) ;
texte en vigueur : [EUR-Lex 1169/2011](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:02011R1169-20180101).

Étiquette recommandée (sachet de 250 g et pot de 30 g), tout sur l'emballage, c'est plus simple et plus sûr :

| Mention | Détail | Statut |
|---|---|---|
| Dénomination | « Morilles séchées » + nom latin (*Morchella* spp., espèce à confirmer) ; « morille de feu » en mention complémentaire seulement si l'espèce est établie | **[À VÉRIFIER]** espèce |
| Ingrédients | Morilles (100 %) | [FAIT\*] |
| Allergènes | Aucun des 14 allergènes de l'annexe II n'est présent dans une morille seule ; ne rien affirmer sur des traces sans analyse | [FAIT\*] |
| Quantité nette | 250 g, 30 g (en g, balance exacte) | [FAIT\*] art. 9(1)(e) |
| DDM | « À consommer de préférence avant fin… » (mois/année si > 3 mois) ; durée à justifier par le fabricant (pas encore établie) | **[À VÉRIFIER]** |
| Conservation | « Conserver au sec, à l'abri de la lumière, à température ambiante » ; après ouverture : hermétique | [FAIT\*] art. 9(1)(g) |
| Exploitant | « Valérian Vilane EI, 448 chemin de Patin, 84810 Aubignan » (adresse de `src/lib/legal.ts`) | [FAIT] art. 9(1)(h) |
| Lot | « Lot L… » (peut être omis seulement si la DDM comporte jour et mois) | [FAIT\*] [directive 2011/91/UE](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32011L0091) |
| Origine | « Origine : Canada » (récolte). Le nom de marque « Morilles du Canada » est une allégation d'origine : elle doit être exacte pour chaque lot | [FAIT\*] art. 26 ; la mention est obligatoire quand son absence induirait en erreur |
| Mode d'emploi | « Réhydrater 20 à 30 min dans l'eau tiède, puis **cuire au moins 20 minutes**. Ne jamais consommer cru. » | Voir ci-dessous |
| Déclaration nutritionnelle | Pas exigée sur l'emballage B2B (art. 8(7)). **Exigée pour le consommateur** : l'épicerie qui reconditionne devra la produire ; lui fournir des valeurs moyennes validées (table Ciqual ou analyse) | [FAIT\*] art. 29-30 ; **[À VÉRIFIER]** si les champignons séchés sont dans les exemptions de l'annexe V (je ne le crois pas) |

**Mention « à consommer cuit »** : **[À VÉRIFIER]** aucun texte consulté ne la rend littéralement obligatoire pour les morilles,
mais l'art. 9(1)(j) INCO impose le mode d'emploi quand son absence rend l'usage difficile, et l'art. 14 du 178/2002
interdit une denrée dangereuse. Pour des morilles, la mention est **indispensable en pratique**.
Les recommandations sanitaires convergent : jamais crues, **cuisson d'au moins 20 minutes**, quantité raisonnable
([Tox Info Suisse](https://www.toxinfo.ch/morels_indulge_with_caution) : cuisson ≥ 20 min, jusqu'à 10 g de morilles séchées par personne ;
[e-santé, rappel des recommandations officielles françaises](https://www.e-sante.fr/morilles-toujours-bien-cuites/actualite/541) : 20 minutes au moins).
Le dépôt indique 15 minutes (`src/pages/FicheTechnique.tsx` l. 76, `src/i18n/fr.ts`, `src/lib/seo/articles.ts`
l. 409, `src/pages/GuideMorellesDeFeu.tsx`). La toxine de la morille n'est pas formellement identifiée selon Tox Info
Suisse : retirer « hémolysine » ou le reformuler. La dose de 5 à 8 g par couvert du site est compatible.

### 2.2 Quand le client reconditionne

- **[FAIT]** Art. 8(1) : l'exploitant « sous le nom duquel la denrée est commercialisée » est responsable de l'information. Une
  épicerie qui vend ces morilles sous sa marque porte seule l'étiquette consommateur (dénomination, ingrédients, quantité,
  DDM propre, lot, conservation, origine, nom, nutrition, taille de caractères minimale…) ; elle ne peut pas modifier
  l'information de façon trompeuse (art. 8(4)).
- **[FAIT]** Art. 8(8) : lui fournir de quoi s'étiqueter. Fiche technique : dénomination légale, espèce, origine, numéro de lot,
  DDM et conditions de conservation, mode d'emploi cuisson, valeurs nutritionnelles moyennes. Prévoir ces éléments dans le
  bon de livraison ou la facture avec le numéro de lot de chaque sachet. Le lot de la tienne doit rester lisible sur le carton.
- La DDM du pot reconditionné ne peut pas dépasser celle du sachet d'origine. Le client est responsable de l'hygiène de la
  remise en pot (pots neufs ou nettoyés, mains, plan de travail) et doit lui-même respecter le paquet hygiène.
- **Décision à documenter** : inscrire dans les CGV que le client reconditionneur devient responsable de l'étiquetage et de
  l'hygiène du produit reconditionné (art. 9 actuel : conformité du produit à sa description seulement). Faire relire par un
  avocat ou la CCI.

---

## 3. Import depuis le Canada

### 3.1 Douane, droits et TVA

- **[FAIT]** Droits : champignons séchés hors *Agaricus* (code 0712 39 00, TARIC 0712390031) : **12,8 % de droit
  tiers, 0 % pour le Canada au titre du CETA** sous réserve de la preuve de l'origine
  ([TARIC, thetradehub](https://www.thetradehub.eu/fr/customs/taric/0712390031) ; [CETA](https://trade.ec.europa.eu/access-to-markets/en/content/eu-canada-comprehensive-and-economic-trade-agreement)).
  **[À VÉRIFIER]** : la règle d'origine des produits de cette catégorie est « entièrement obtenus » : l'exportateur canadien doit
  fournir une déclaration d'origine (numéro d'exportateur enregistré) sur la facture, sinon 12,8 % sont dus.
- **[FAIT\*]** TVA à l'importation : due à la douane **même pour un opérateur en franchise** (art. 291 CGI) ; denrées
  alimentaires au taux de 5,5 % (art. 278-0 bis CGI, **[À VÉRIFIER]** pour les champignons séchés). Elle n'est pas récupérable en franchise de
  base : à intégrer dans le prix de revient. La mention « TVA non applicable, art. 293 B » reste valable pour les ventes.
- **[FAIT\*]** Un import commercial exige un **numéro EORI** et une déclaration en douane (en général par un commissionnaire en
  douane) (règlement UE 952/2013, art. 9). L'apport en bagage n'est admis que pour un usage personnel, pas pour revendre.
- **[À VÉRIFIER, point critique]** `docs/business/recit.md` (« À partir de la saison 2027, les envois depuis le Canada seront déclarés comme envois
  commerciaux ») laisse entendre que les saisons 2022 à 2024 et le stock actuel ne l'ont pas été. Si les ≈ 45 kg
  sont entrés comme effets personnels, par la poste sans déclaration commerciale, ou avec une valeur sous-évaluée, les droits, la TVA et
  la preuve d'importation manquent ; l'importation sans déclaration est une infraction douanière (Code des douanes, art. 414
  et suivants) avec amende proportionnelle à la valeur et confiscation possible. **Action** : reconstituer le chemin de
  chaque lot (dates, transporteur, documents, droits payés) ; demander à un conseil en douane si une **régularisation
  spontanée** est possible et à quelles conditions, avant d'écouler le stock au volume. Ne rien publier sur ce sujet
  (décision du 2026-09-28 : aucun document de douane publié).

### 3.2 Contrôles sanitaires et radioactivité

- **[FAIT]** Le règlement d'exécution (UE) 2020/1158 (césium-137, champignons sauvages) ne s'applique qu'aux pays de son annexe I :
  Albanie, Biélorussie, Bosnie-Herzégovine, Kosovo, Macédoine du Nord, Moldavie, Monténégro, Russie, Serbie, Suisse, Turquie,
  Ukraine (version consultée sur [legislation.gov.uk](https://www.legislation.gov.uk/eur/2020/1158/data.html) ; le texte UE en vigueur doit
  être relu pour d'éventuelles modifications). **Le Canada n'y figure pas** : pas de certificat césium ni de DSCE-D exigé à ce titre
  ([douane, contrôles sanitaires](https://www.douane.gouv.fr/professionnels/commerce-international/controles-sanitaires-et-de-qualite-des-aliments/vous-1)).
  La limite de 600 Bq/kg est un niveau de référence de la législation Euratom ; la citer comme repère si un client la demande.
- **[À VÉRIFIER]** Que ni les morilles ni le Canada ne figurent dans les annexes du règlement (UE) 2019/1793 (denrées
  soumises à contrôles renforcés) dans sa version consolidée actuelle. [2019/1793](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32019R1793).
  Les contrôles officiels aléatoires restent possibles (règlement 2017/625).

### 3.3 Contaminants et résidus

- **[FAIT\*]** Règlement (UE) 2023/915 (remplace 1881/2006) : teneurs maximales en cadmium et plomb pour les champignons
  sauvages. Une source consultée indique **0,5 mg/kg de cadmium** pour les champignons sauvages, inchangé par le règlement 2023/1510
  ([Agrolab](https://agrolab.com/en/news/food-news/4610-cadmium-mrls-radar-08-23-en.html)) ;
  le plomb a une teneur maximale distincte, **[À VÉRIFIER]** valeur exacte. Pour un produit **séché**, la limite s'applique au
  produit réhydraté avec un facteur de concentration à justifier. Les morilles accumulent les métaux lourds : une analyse
  est la seule façon de le savoir. [2023/915](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32023R0915).
- **[FAIT\*]** Pesticides : limite par défaut 0,01 mg/kg sans LMR spécifique (règlement 396/2005).
  [396/2005](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32005R0396).
- **[FAIT]** Précédent direct : rappel Metro Chef de morilles séchées (« queues » 500 g et « morille traiteur » 400 g) pour
  **chlorpyrifos-éthyl et anthraquinone** au-dessus des limites
  ([Rappel Conso, fiche 18147](https://rappel.conso.gouv.fr/fiche-rappel/18147/Interne), relayé par
  [CFS Hong Kong, 7 mai 2025](https://www.cfs.gov.hk/english/rc/subject/files/20250507_1.pdf)). L'origine de ces lots n'est pas connue.
  **[À VÉRIFIER]** L'anthraquinone peut venir d'un séchage à la fumée ou au feu : demander aux cueilleurs le mode de séchage.
- **[À VÉRIFIER]** Alertes RASFF sur les morilles : la recherche web n'a trouvé que ce rappel français. Interroger directement
  [RASFF Window](https://webgate.ec.europa.eu/rasff-window/screen/search) avec « morel » / « Morchella » / « dried mushrooms »
  sur 5 ans ; ce contrôle prend 15 minutes. Les produits de forêts brûlées peuvent aussi porter des HAP et des métaux : hypothèse
  non vérifiée, à intégrer au programme d'analyse.
- **Programme d'analyse proposé** (devis laboratoire, ordre de grandeur non vérifié) : 1 analyse multirésidus pesticides + métaux
  (Cd, Pb, Hg, As) par lot, microbiologie de base (flore, moisissures, *Salmonella*, *B. cereus*) et, optionnellement,
  spectrométrie gamma (Cs-137) si un grand compte l'exige. Les résultats sont à conserver et à fournir sur demande
  (sans nom de cueilleur).

---

## 4. Assurance responsabilité civile professionnelle et produits

- **[FAIT\*]** Aucune loi n'impose une RC professionnelle à un négociant en denrées (profession non réglementée), mais
  l'**importateur est responsable comme un producteur** (art. 1245-5 du Code civil, directive 85/374/CEE) : responsabilité sans faute pour
  les dommages causés par un produit défectueux, sur dix ans. Pour un champignon dont une cuisson insuffisante cause une
  intoxication, l'exposition est réelle (clients professionnels : restauration, épiceries).
- **[FAIT]** Évolution : la directive (UE) 2024/2853 remplace la directive 85/374 et doit être transposée **avant le
  9 décembre 2026** ; elle vise explicitement l'importateur
  ([Stibbe](https://www.stibbe.com/fr/publications-and-insights/nouvelles-regles-de-lue-sur-la-responsabilite-du-fait-des-produits)).
  **[À VÉRIFIER]** la loi française de transposition et son entrée en vigueur.
- **[FAIT\*]** L'EI est depuis 2022 à patrimoine professionnel séparé (loi du 14 février 2022), mais le patrimoine privé reste
  atteignable dans certains cas ; l'assurance reste la vraie protection.
- Garanties à demander : RC exploitation + **RC produits livrés** (après livraison), activité déclarée « import, conditionnement
  et négoce de denrées alimentaires », garantie **frais de retrait/rappel**, plafond ≥ 1 M€ pour dommages corporels, extension
  « produits importés » (certains contrats l'excluent ou exigent un PMS).
- Prix : les guides en ligne annoncent 50 à 200 € par an pour une micro-entreprise générique et 100 à 1 500 € selon l'activité
  ([LegalPlace](https://www.legalplace.fr/guides/assurance-rc-pro-auto-entrepreneur/), [LegalStart](https://www.legalstart.fr/fiches-pratiques/assurances/tarif-micro-entreprise/)).
  **Ordre de grandeur pour ce profil avec produits importés : 300 à 900 € par an (estimation, à confirmer par 2 ou 3 devis).**
  Prévoir aussi l'assurance du transport de marchandises (un kilo vaut 290 à 350 €, l'indemnisation standard des
  transporteurs est inférieure à la valeur : **[À VÉRIFIER]** plafonds du transporteur utilisé).

---

## 5. Prospection B2B par email, SMS et téléphone

### 5.1 Email

- **[FAIT]** CNIL : en prospection entre professionnels, **le consentement préalable n'est pas requis** si le message est en
  rapport avec l'activité du destinataire, à condition qu'il ait été informé que son adresse pourrait servir à la prospection
  et qu'il puisse s'y opposer simplement ; les adresses génériques (`contact@`, `info@`) relèvent de la personne morale
  et sortent de ces règles ([CNIL, prospection par courrier électronique](https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique)).
- **[FAIT\*]** Fondement : art. L34-5 du CPCE (consentement préalable pour les **personnes physiques**, sauf produits
  analogues déjà fournis ; chaque message doit permettre de cesser de le recevoir) et RGPD art. 6(1)(f) (intérêt légitime),
  13/14, 21(2)-(3) (opposition à tout moment, sans motif).
  [CPCE](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006070987).
- **Attention** : un restaurateur en entreprise individuelle écrivant depuis une adresse personnelle (gmail, orange) est une
  personne physique : **ne pas lui écrire sans consentement**. Dans `docs/commercial/prospects.csv`, aucune adresse de ce type n'apparaît
  (vérifié par recherche des fournisseurs courants) ; adresses génériques et téléphones principalement.
- **Minimum obligatoire dans chaque email** (cumulatif) :
  1. l'identité de l'expéditeur (nom, entreprise, adresse) et l'objet non trompeur ;
  2. un moyen **simple et gratuit de s'opposer**, valable à chaque message (une phrase « répondez à cet email pour ne plus
     être contacté » suffit ; un lien n'est pas imposé) ;
  3. dans le premier message, l'**information RGPD** (art. 14) : l'origine de l'adresse (« publiée sur votre site »), la finalité,
     le droit d'opposition, un contact et un renvoi vers une page de confidentialité ;
  4. une liste d'opposition tenue et appliquée **immédiatement** ;
  5. conservation limitée (usage CNIL : 3 ans après le dernier contact) et mention dans le registre des traitements (art. 30 RGPD).
- **Écart avec le dépôt** : `docs/commercial/emails-prospection.md` § 0 (décision du 2026-10-06) interdit « répondez STOP »,
  le pied de page légal et le `List-Unsubscribe`. Pour un envoi de 20 à 30 messages par jour, l'en-tête n'est pas obligatoire
  (les exigences Google d'envoi en masse visent plus de 5 000 messages par jour, **[À VÉRIFIER]**), mais **le moyen d'opposition, l'identification de l'expéditeur et
  l'information RGPD le sont**. Texte sobre, compatible avec le ton « personne » :
  « Je vous écris parce que votre adresse figure sur votre site. Si vous préférez que je ne vous écrive plus, dites-le simplement en répondant à cet
  email. Valérian Vilane, EI, Aubignan. Informations : morillesducanada.com/confidentialite. »
  Aucune page de confidentialité distincte n'existe dans `src/pages/` (les mentions légales citent la CNIL) : en créer une courte.
- Le formulaire du site (`submit-pro-lead`) collecte des données (SIRET, contact) : même notice, durée de conservation et base légale.

### 5.2 SMS

- **[FAIT\*]** L'art. L34-5 CPCE vise aussi les SMS/MMS. Mêmes règles que l'email pour les professionnels (rapport avec l'activité,
  information, opposition gratuite à chaque envoi, type « STOP » + numéro). Un numéro de **portable** de chef ou d'artisan est
  souvent personnel : consentement recommandé. **Conseil : ne pas utiliser le SMS en prospection à froid** ;
  `docs/commercial/strategie.md` n'en prévoit pas.

### 5.3 Téléphone

- **[FAIT]** Depuis le **11 août 2026**, le démarchage téléphonique **de consommateurs** est soumis au consentement préalable
  (loi n° 2025-594 du 30 juin 2025, art. 13, art. L223-1 C. conso.), amende administrative jusqu'à 375 000 € pour une personne morale
  (sources : [actu-juridique](https://www.actu-juridique.fr/affaires/droit-economique/reforme-du-demarchage-telephonique-mise-en-pratique-depuis-le-11-aout-2026/),
  [DGCCRF](https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/demarchage-telephonique-professionnels-mettez-vous-en-conformite-avec-la-reglementation) :
  pages **non ouvertes** (blocage), lues dans les extraits de recherche).
- **[À VÉRIFIER]** Application aux **prospects professionnels** : la règle protège le « consommateur » ; le B2B entre professionnels
  de la restauration et du commerce alimentaire ne devrait pas être concerné, sauf exceptions du Code de la consommation
  (petits professionnels hors de leur champ d'activité principal). Confirmer sur la fiche DGCCRF « démarchage téléphonique :
  professionnels, mettez-vous en conformité ». Dans le doute : appeler uniquement des numéros professionnels publiés, en lien avec
  l'activité, cesser immédiatement à la demande, noter l'opposition dans le CRM.

---

## 6. Les cinq risques principaux (gravité × probabilité, échelle 1 à 5)

| Rang | Risque | Domaine | G | P | Score | Parade |
|---|---|---|---|---|---|---|
| 1 | **Provenance et import du stock actuel** : entrée sans déclaration commerciale, droits et TVA non payés, absence de preuve présentable ; saisie ou amende, impossibilité de répondre à un audit client | Juridique | 4 | 4 (incertain) | **16** | Reconstituer l'historique de chaque lot, conseil en douane, régularisation si nécessaire, EORI et déclarations pour 2027 |
| 2 | **Intoxication d'un convive** (cuisson insuffisante, espèce non conforme, contaminant) ; plainte, rappel, réputation détruite | Sanitaire | 5 | 2 | **10** | Cuisson 20 min sur chaque étiquette et document, doses indiquées, identification de l'espèce, analyses de lot, registre de lots, RC produits |
| 3 | **Contamination chimique ou résidus** (pesticides, Cd/Pb, anthraquinone) menant à un rappel | Sanitaire, réputation | 4 | 2 à 3 | **8 à 12** | Analyse avant mise en vente, échantillons témoins conservés, procédure de retrait testée, assurance frais de retrait |
| 4 | **Non-conformité d'étiquetage, d'hygiène ou de prospection** relevée par DGCCRF/DDPP ou CNIL (mentions manquantes, mauvaise cuisson indiquée, opposition inexistante, pots sans lot ni DDM) ; amende, mise en demeure, tromperie (art. L441-1 C. conso., jusqu'à 2 ans et 300 000 € dans les cas graves) | Juridique | 3 | 4 | **12** | Étiquette conforme (§ 2.1), confirmation écrite DDPP, ligne d'opposition et page de confidentialité, registre des traitements |
| 5 | **Précommande 2027 et logistique** : acompte de 50 % encaissé pour une récolte incertaine (échec de saison, refus d'un fournisseur) ; remboursement intégral promis ; colis perdu, abîmé ou humide d'une valeur de 350 €/kg ; faux SIRET et usurpation d'identité pour obtenir des échantillons | Logistique, financier, réputation | 3 | 3 | **9** | Trésorerie réservée pour rembourser l'acompte, CGV claires sur la force majeure (articles précommande à relire), assurance transport, vérification du SIRET avant envoi, sachet sous vide + carton rigide + sachet déshydratant **[À VÉRIFIER]** |

Notes : (a) le rang 4 a un score numérique de 12 (plus que le rang 2 à 10) mais une gravité plus faible : le classement
privilégie la gravité quand la sanction est pénale ou sanitaire ; (b) les probabilités sont des jugements, pas des mesures.

Risque de réputation transversal : les avis publiés sont ceux de particuliers (`docs/amelioration-continue.md`) ; l'allégation
« sauvages » doit rester prouvable (preuves d'achat conservées) ; ne jamais nommer les cueilleurs.

---

## 7. Ce qui a pu changer en 2026 (à surveiller)

| Date | Changement | Impact |
|---|---|---|
| 2026-08-11 | Démarchage téléphonique de consommateurs : consentement préalable (loi 2025-594) | Pas d'impact B2B probable ; vérifier |
| 2026-09-01 | Facturation électronique : tout le monde doit pouvoir **recevoir** ; micro-entrepreneurs **émettent** à partir du 2027-09-01 ([La Fabrique du Net](https://www.lafabriquedunet.fr/logiciels/tendances/facture-electronique-auto-entrepreneur-2026), [Cegid](https://www.cegid.com/fr/facture-electronique-obligatoire/calendrier-facture-electronique/)) | Choisir une plateforme agréée avant la réception ; l'outil `~/Documents/Facturation/` devra émettre en Factur-X **[À VÉRIFIER]** |
| 2026-12-09 | Transposition de la directive (UE) 2024/2853 (produits défectueux) | Responsabilité de l'importateur, charge de la preuve allégée pour la victime |
| 2023 → | Règlement (UE) 2023/915 en vigueur pour les contaminants (remplace 1881/2006) | Teneurs maximales à jour dans les cahiers des charges d'analyse |

---

## 8. Plan d'action (propriétaire : Valérian ; aucune dépense sans accord)

1. **Cette semaine** : étiquette pot de 30 g (lot, DDM provisoire justifiée, conservation, exploitant, origine, cuisson 20 min) ;
   corriger « 15 minutes » et « hémolysine » (4 fichiers listés au § 2.1) ; liste des lots et de leur provenance douanière.
2. **Ce mois** : devis RC pro/produits (≥ 2 assureurs) ; email à la DDPP du Vaucluse ; conseil en douane pour le stock ;
   consultation RASFF ; EORI si absent.
3. **Avant la vague 1** : modifier la règle de l'email (ligne d'opposition + identification + renvoi RGPD) et créer la page
   de confidentialité ; décision à consigner dans `docs/decisions.md`.
4. **Avant de grosses commandes** : analyses de lot, confirmation de l'espèce, déclarations de conformité (sachets, pots),
   CGV relues (responsabilité du client reconditionneur ; art. 9).
5. **Plus tard** : PMS d'une page, exercice de retrait, formation hygiène, mise à jour annuelle (`/nouvelle-saison`).

## 9. Sources

Consultées pendant l'audit (liens ouverts ou extraits lus) : [art. 8 INCO](https://www.legislation.gov.uk/eur/2011/1169/article/8/2014-12-13),
[règlement 2020/1158](https://www.legislation.gov.uk/eur/2020/1158/data.html),
[douane : contrôles sanitaires](https://www.douane.gouv.fr/professionnels/commerce-international/controles-sanitaires-et-de-qualite-des-aliments/vous-1),
[TARIC 0712390031](https://www.thetradehub.eu/fr/customs/taric/0712390031),
[service-public, cerfa 13984](https://entreprendre.service-public.gouv.fr/vosdroits/R17520?lang=en),
[CNIL, prospection par email](https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique),
[Rappel Conso 18147 via CFS Hong Kong](https://www.cfs.gov.hk/english/rc/subject/files/20250507_1.pdf),
[Tox Info Suisse](https://www.toxinfo.ch/morels_indulge_with_caution),
[Agrolab, cadmium](https://agrolab.com/en/news/food-news/4610-cadmium-mrls-radar-08-23-en.html),
[Stibbe, directive 2024/2853](https://www.stibbe.com/fr/publications-and-insights/nouvelles-regles-de-lue-sur-la-responsabilite-du-fait-des-produits),
[e-santé](https://www.e-sante.fr/morilles-toujours-bien-cuites/actualite/541).
Textes cités de mémoire, à relire sur EUR-Lex/Légifrance : règlements 178/2002, 852/2004, 853/2004, 1935/2004, 2023/2006, 10/2011,
2023/915, 396/2005, 2019/1793, 2017/625, 952/2013 ; directive 2011/91/UE ; art. L34-5 CPCE ; art. 1245 C. civ. ; art. 291 et 278-0 bis CGI ; Code des douanes art. 414.
Limite de l'audit : 20 recherches web, EUR-Lex, Légifrance et economie.gouv.fr inaccessibles aux robots ; aucun avocat ni
autorité n'a été consulté.
