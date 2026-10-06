# Audit SEO et GEO — Morilles du Canada (2026-10-06)

Périmètre : site en ligne https://www.morillesducanada.com (26 URL du sitemap), concurrence dans les résultats, contenus à créer,
visibilité dans les IA, actions hors site, plan en 3 horizons. Aucune modification du code, aucun envoi : c'est un audit.
Point de départ : `docs/marketing/seo-geo.md` (ce qui est livré), `docs/audits/2026-10-audit-marche/03-visibilite-recit.md`,
`docs/business/recit.md`, `src/lib/seo/`. Ce qui y est déjà documenté n'est pas refait.

Légende : **[FAIT]** = vérifié (commande ou lien indiqué) ; **[ESTIMATION]** = jugement du consultant, à confirmer avec Search Console.

Budget utilisé : 22 recherches web sur 30, 5 lectures de pages, 0 capture d'écran.

## Limites de cet audit (à lire d'abord)

- **[FAIT]** Aucun accès à Search Console ni à Bing Webmaster : on ne voit ni impressions, ni positions, ni pages indexées. Les positions ci-dessous sont des
  **estimations** sauf mention contraire.
- **[FAIT]** L'outil de recherche disponible est américain. Une seule liste de résultats français réelle a pu être obtenue (DuckDuckGo en français, qui s'appuie sur Bing, requête
  « morilles séchées professionnel », le 2026-10-06). Les autres requêtes s'appuient sur les résultats de l'outil de recherche (concurrents qui remontent, pas leur rang exact).
  Refaire l'analyse de rang dans Search Console (onglet Performances) après 4 semaines.
- **[FAIT]** Sondage d'indexation (outil de recherche, 2 requêtes limitées au domaine) : seule l'**accueil** ressort ; aucune des 5 pages de contenu n'est ressortie.
  Sondage unique, non concluant, cohérent avec l'état annoncé (8 demandes d'indexation faites le 5 octobre).

## 1. Audit technique du site en ligne

Méthode : `curl` sur les 26 URL du sitemap (`https://www.morillesducanada.com/sitemap.xml`), extraction des titres, descriptions, h1, canoniques, liens, JSON-LD, poids.

### 1.1 Ce qui est correct (ne pas y toucher)

| Contrôle | Résultat | Preuve |
|---|---|---|
| Redirections domaine | **[FAIT]** `http://` et apex redirigent en 308 vers `https://www.` ; slash final redirigé en 308 vers l'URL sans slash | `curl -sI http://morillesducanada.com/` → 308 |
| Canoniques | **[FAIT]** 26 pages sur 26 : une canonique absolue en `https://www.`, sans slash, identique à l'URL | extraction des `<link rel="canonical">` |
| Un h1 par page | **[FAIT]** 26 sur 26 (la page Galerie n'a aucun h2, voir 1.3) | extraction |
| Contenu dans le HTML | **[FAIT]** pages prérendues : titre, description, JSON-LD et texte sont dans la réponse HTML, sans exécuter de JavaScript | `curl` |
| robots.txt | **[FAIT]** 12 robots (moteurs + IA) autorisés, Disallow des pages privées répétés dans chaque groupe, ligne Sitemap | `curl /robots.txt` |
| Sitemap | **[FAIT]** 26 URL, `lastmod` réels, toutes en 200 | `curl /sitemap.xml` |
| llms.txt, llms-full.txt | **[FAIT]** 200, structure conforme llmstxt.org, prix et dates identiques au site | `curl /llms.txt` |
| 404 | **[FAIT]** URL inconnue : vrai code 404, `noindex, follow` | `curl -s -o /dev/null -w "%{http_code}" /page-inexistante-xyz` |
| Clé IndexNow | **[FAIT]** fichier servi à la racine, contenu = la clé | `curl /6a1b5a11f9def9e6fe5f2b31ff4074de.txt` |
| Temps de réponse | **[FAIT]** 80 à 390 ms (première octet), HTML de 5 à 12 Ko compressé par page | mesure `curl -w %{time_starttransfer}` |
| Poids | **[FAIT]** accueil : JS 105 Ko + 47 Ko (react) + 8 Ko (router) compressés, CSS 14 Ko, images 28 à 117 Ko chacune (webp), cache immuable d'un an sur `/assets/*` | `curl` des ressources |
| Balisage | **[FAIT]** Organization, WebSite, WebPage, FAQPage, BreadcrumbList, Article (6 pages), Product avec Offer au kilo (2 pages), Recipe (10 pages) | extraction des `application/ld+json` |
| Images | **[FAIT]** aucune image sans attribut `alt` sur les 26 pages | extraction |

### 1.2 Défauts réels, par gravité

| # | Gravité | Page(s) | Défaut | Correction | Qui |
|---|---|---|---|---|---|
| T1 | Haute | Les 5 pages de contenu, le guide, les recettes | **[FAIT]** Les pages de contenu ne sont liées que depuis le **pied de page**. Ni l'en-tête (Morille de feu, L'offre, Recettes, Contact, Tarifs et devis), ni le corps de l'accueil, ni le corps de `/professionnels` ne les citent. Or seule l'accueil est indexée : un robot qui arrive par l'accueil reçoit des liens de pied de page, signal faible. | Ajouter dans le corps de l'accueil et de `/professionnels` un bloc « Guides pour les professionnels » (5 liens avec ancres descriptives) et une entrée « Guides » dans l'en-tête. Dans chaque recette, un lien contextuel vers `/rehydrater-morilles-sechees-guide-pro` et `/acheter-morilles-sechees-restauration`. | Claude (code) |
| T2 | Haute | `/fiche-technique`, `/plaquette-pro` | **[FAIT]** Culs-de-sac : `/fiche-technique` a **0 lien** (ni en-tête ni pied de page), `/plaquette-pro` en a **1**. Ce sont les deux pages que les acheteurs pros téléchargent ou transmettent. Une page sans lien sortant ne transmet rien et ne ramène pas au devis. | Ajouter lien retour `/professionnels#devis`, lien vers les guides, coordonnées. Garder la mise en page imprimable (masquer en `@media print`). | Claude |
| T3 | Haute | `/recettes/<n'importe quoi>` | **[FAIT]** Une URL de recette inexistante renvoie **HTTP 200** avec la coquille SPA (titre générique de l'accueil, pas de `noindex`) : soft 404 indexable. Cause : la réécriture `/recettes/:slug` → `/spa.html` dans `vercel.json`. `curl -s -o /dev/null -w "%{http_code}" https://www.morillesducanada.com/recettes/inexistant-xyz` → 200. | Supprimer la réécriture (les 10 recettes sont prérendues) ou faire répondre 404 aux slugs inconnus ; à défaut `noindex` dans la coquille. | Claude |
| T4 | Moyenne | Toutes (EN) | **[FAIT]** La version anglaise n'existe pas comme page : le bouton EN lit `localStorage`, `/en` répond 404, `/?lang=en` répond 200 avec le HTML français. Aucun `hreflang`, aucune URL EN, `llms.txt` et pages de contenu en français seulement. Les requêtes anglaises (IA comprises) ne peuvent donc pas atteindre le site en anglais. | Choisir : (a) supprimer le bouton EN (cible = professionnels français) ou (b) créer une page EN dédiée avec `hreflang` (voir contenu C8). Ne pas laisser un bouton qui ne change pas l'URL. | Fondateur décide, Claude exécute |
| T5 | Moyenne | `Recipe` (10 recettes) | **[FAIT]** Le JSON-LD Recipe n'a pas de champ `image` (clés : name, description, url, author, publisher, datePublished, temps, recipeIngredient, recipeInstructions, keywords). Google exige `image` pour l'affichage enrichi Recipe. Auteur `Valérian` sans `@id` (n'est pas relié à la Person). | Ajouter `image` (photo de la recette ou de `src/assets/morels/`), `author: {"@id": ".../#valerian-vilane"}`. | Claude |
| T6 | Moyenne | Organization / Person | **[FAIT]** Organization sans `sameAs` (attendu, aucun profil), sans `legalName` ni `identifier` (SIRET public dans les mentions légales). `Person.url` pointe vers `/professionnels`, pas vers une page qui présente Valérian : il n'existe aucune page « À propos ». C'est le premier signal d'entité pour la question « Qui est Morilles du Canada ? ». | Créer la page fondateur (contenu C3), pointer `Person.url` dessus, ajouter `legalName` et `identifier` (SIRET), `sameAs` au fur et à mesure des profils. | Claude |
| T7 | Moyenne | Accueil | **[FAIT]** Titre de 89 caractères (tronqué à environ 60 dans Google) : « Morilles séchées sauvages du Canada au kilo, pour les professionnels \| Morilles du Canada ». Description de 190 caractères (tronquée vers 155). Le chiffre « 45 kg en stock » est écrit en dur dans la description : il deviendra faux à la première vente. Idem `/professionnels` (meta + Product). | Titre ≤ 60 : « Morilles de feu séchées au kilo, pros \| Morilles du Canada ». Description ≤ 155, sans stock chiffré (le stock reste dans la page et dans `llms.txt`, ou à générer depuis `PRO_STOCK_KG`). | Claude |
| T8 | Moyenne | 8 pages | **[FAIT]** Titres de 70 à 78 caractères sur les 5 articles (`/prix-…` 78, `/morilles-sechees-epicerie-fine` 76) et descriptions de 176 à 190 caractères (articles, `/cgv` 190, `/fiche-technique` 181). Google les réécrira ou tronquera. | Raccourcir à 60 (titre) et 155 (description), mot-clé en tête. Le suffixe « \| Morilles du Canada » coûte 21 caractères : le garder sur l'accueil seulement ou passer à « \| MdC » n'est pas souhaitable (marque) ; préférer des titres courts. | Claude |
| T9 | Moyenne | `/guide-morilles-de-feu`, `/morille-de-feu-ou-morille-de-culture`, accueil | **[ESTIMATION]** Trois pages visent « morille de feu » et « sauvage ou culture » (le guide, l'article comparatif, la section de l'accueil). Risque de cannibalisation : Google en choisit une, pas forcément la meilleure. | Donner un rôle distinct : le **guide** = « qu'est-ce que la morille de feu » (origine, cueillette, saison) ; l'**article** = « sauvage vs culture, ce que demande un pro » ; l'accueil = renvoi. Liens croisés avec ancres différentes. | Claude |
| T10 | Basse | `/recettes` | **[FAIT]** Description « Recettes de **chefs** aux morilles… » (et `llms.txt` : « recettes de chefs ») : l'affirmation n'est pas dans `recit.md`. 10 recettes de ton grand public (« repas en famille », vegan), descriptions courtes (85 à 121 caractères). | Remplacer « de chefs » par « de Valérian » ou « pas à pas » ; ne pas investir plus dans ces pages (voir C6 pour une version professionnelle). | Claude |
| T11 | Basse | `/images/*`, `/og-image.jpg`, `/logo.png` | **[FAIT]** `cache-control: public, max-age=0, must-revalidate` (images non hachées). Photo du fondateur et héro (193 Ko) revalidées à chaque visite. | Dans `vercel.json`, `Cache-Control: public, max-age=604800` pour `/images/*`, `/og-image.jpg`, `/logo.png`. | Claude |
| T12 | Basse | Accueil | **[FAIT]** « Morille sauvage (la nôtre) » dans le tableau comparatif : la règle de voix est « je », jamais « nous ». | « la mienne » ou « celle que je vends ». | Claude |
| T13 | Basse | Product (`/professionnels`) | **[ESTIMATION]** Quatre `Offer` au palier, sans `priceValidUntil` ; Google privilégie `AggregateOffer` (lowPrice 290, highPrice 350) pour une grille au kilo. Le balisage actuel est valide (corrigé le 6 octobre) ; ne pas y toucher avant d'avoir vu un retour de Search Console. | Option : ajouter `priceValidUntil`. | Claude, plus tard |
| T14 | Info | FAQPage | **[FAIT]** Google a supprimé les résultats enrichis FAQ (annonce : retrait de l'apparence « FAQ » et du rapport en juin 2026), sauf rares sites officiels ; les 8 + 15 questions du site n'affichent donc plus rien dans Google. Source : https://www.searchenginejournal.com/google-drops-faq-rich-results/574429/ (extrait de recherche). Le balisage ne nuit pas, et les réponses visibles restent utiles aux IA : le conserver, ne pas y investir. | Aucune. | — |
| T15 | Info | robots.txt | **[FAIT]** Les pages `noindex` (admin, auth…) sont aussi en `Disallow` : un robot ne lit alors pas le `noindex`. Sans conséquence ici (aucun lien externe vers ces pages). | Aucune. | — |

Pages au contenu mince (mots visibles, **[FAIT]** extraction) : `/fiche-technique` 212, `/galerie` 188 (aucun h2), `/livraison` 304, `/precommande-2027` 370. Les 5 articles font 740 à 1 070 mots, l'accueil 990, `/professionnels` 1 430 : correct pour le sujet.

### 1.3 Les 3 défauts les plus graves

1. **T1** Maillage interne : les pages qui doivent être citées ne sont liées que depuis le pied de page.
2. **T3** Soft 404 indexable sur `/recettes/<slug inconnu>` (200 + titre de l'accueil).
3. **T2** `/fiche-technique` et `/plaquette-pro` : pages sans liens, c'est-à-dire des culs-de-sac pour le document que les acheteurs transmettent.

Aucun défaut bloquant l'indexation n'a été trouvé : canoniques, redirections, robots et sitemap sont corrects. Le retard d'indexation vient du jeune âge du domaine et de la
correction récente de la canonique, pas d'une erreur technique restante **[ESTIMATION]**.

## 2. Concurrence dans les résultats

### 2.1 Les acteurs qui reviennent

| Acteur | Type | Ce qu'il fait que le site ne fait pas | Preuve |
|---|---|---|---|
| Aux Trésors des Bois (auxtresorsdesbois.fr) | Revendeur-grossiste | Page « achat morilles séchées en gros et demi-gros » : 3 formats (détail 25-400 g, demi-gros 500 g-5 kg, gros 5 kg et plus), calibre « 3/5 cm » en vente, FAQ, échantillons, livraison 24-48 h France et Suisse romande. **Pas de prix au kilo publié.** Plusieurs pages classées pour « grossiste morilles séchée ». | **[FAIT]** lecture de la page ; SERP DuckDuckGo FR du 06/10 |
| Eurovanille / Vanifolia | Épicerie pro | Page « morilles séchées sans queues pour professionnels » | **[FAIT]** SERP du 06/10 |
| Jaeger-pro, Sodistri, La Bovida, Le Labo du Boucher | Grossistes et revendeurs CHR | Fiches « morilles traiteur » et « spéciales » 500 g (marques Plantin, Champiland) | **[FAIT]** SERP du 06/10 |
| Sabarot | Industriel | Fiches techniques PDF détaillées : humidité inférieure à 14 %, hauteur de chapeau, taux de brisures, DLC de 5 ans ; conditionné en Haute-Loire | **[FAIT]** résultats de recherche, https://www.sabarot.com/en/morels/25-dried-extra-morels-250g-3111950322900.html |
| Plantin | Marque truffe/morille | Gamme 25 g à 500 g, positionnement restaurants du monde | **[FAIT]** https://www.truffe-plantin.com/en/dried-morels/99-dried-wild-morels-50-g.html |
| Pomona / Champiland, Metro | Distributeurs CHR | Référencement dans les fiches de commande des restaurants ; fiches techniques PDF | **[FAIT]** https://cdn.api.groupe-pomona.fr/public/products/0044630/branch/es/medias/morille-extra-sechee-en-boite-500-g-champiland_0044630_es_technical.pdf |
| Nutrada, EspaceAgro, Alibaba/Accio | Places de marché | Pages « fournisseurs de morilles, vente en gros et en vrac », annonces d'achat (« détaillant cherche morille ») ; prix de 39 à 350 €/kg selon origine | **[FAIT]** https://nutrada.com/fr/produits/champignons/morilles-en-gros |
| North Spore, Gourmet Sauvage, Qualifirst, Épices du Guerrier | Vendeurs nord-américains | Domination de « morilles sauvages du Canada séchées » côté acheteur individuel | **[FAIT]** résultats de recherche du 06/10 |
| Slate, Université Laval | Presse et université | Dominent « morille de feu » (informationnel) | **[FAIT]** https://www.slate.fr/story/266886/canada-morilles-de-feu-recolte-cueillette-aventure-foret-incendies-expedition-business-revente-champignon-nature |

À retenir **[ESTIMATION]** : les concurrents sérieux **n'affichent pas leurs prix au kilo** et vendent des calibres chiffrés avec fiche technique PDF. Le site est le seul de la liste à publier
une grille au kilo avec port inclus et mention fiscale : c'est un avantage de requête (« prix morilles séchées kilo »). Il est en revanche **sans fiche technique chiffrée** (calibre, humidité), que
`recit.md` interdit tant que ces valeurs ne sont pas mesurées : c'est le défaut commercial le plus visible face à Sabarot et Aux Trésors des Bois.

### 2.2 Requêtes cibles : qui sort, pourquoi, où se placer

Rang réaliste = position visée sur Google.fr à 3 à 6 mois **si** les corrections de la section 1 et les contenus de la section 3 sont faits **[ESTIMATION]**. Les volumes sont ceux du
précédent audit (non mesurés).

| # | Requête | Qui sort en premier **[FAIT]** sauf mention | Pourquoi | Rang réaliste du site | Page à pousser |
|---|---|---|---|---|---|
| 1 | morilles séchées professionnel | Eurovanille, Aux Trésors des Bois (2 pages), Andesol, Jaeger-pro, Sodistri, La Bovida, Le Labo du Boucher (SERP 06/10) | Pages produit avec « professionnel » dans le titre, formats 500 g à 1 kg, domaines anciens | 8 à 15 **[ESTIMATION]** | `/professionnels`, `/acheter-morilles-sechees-restauration` |
| 2 | acheter morilles séchées restaurant | Nutrada, fiches Pomona (PDF), Sabarot, Plantin, EspaceAgro | Annuaires et catalogues CHR ; peu de pages « où acheter » rédigées | 5 à 12 | `/acheter-morilles-sechees-restauration` (déjà ciblée) |
| 3 | fournisseur morilles séchées | Nutrada, EspaceAgro, Sabarot, Aux Trésors des Bois | Places de marché B2B | 10 à 20 : requête dominée par les annuaires ; viser les inscriptions (section 5) | `/professionnels` |
| 4 | morilles séchées en gros | Nutrada, EspaceAgro (grossiste), Accio/Alibaba, Aux Trésors des Bois | « En gros » = tonnes, marketplaces | Hors de portée (45 kg) ; ne pas viser | — |
| 5 | morille de feu | Slate, Université Laval, pages encyclopédiques, annonces EspaceAgro | Informationnel, presse, autorité de domaine | Tête de requête : hors de portée. Longue traîne (« morille de feu séchée », « morille de feu Canada acheter ») : 3 à 8 | `/guide-morilles-de-feu`, `/morille-de-feu-ou-morille-de-culture` |
| 6 | morilles sauvages du Canada | North Spore, Gourmet Sauvage, Qualifirst, Épices du Guerrier, Slate | Vendeurs canadiens en anglais ; peu de vendeurs français ciblant les pros | 3 à 8 : meilleure chance | accueil, `/morille-de-feu-ou-morille-de-culture` |
| 7 | prix morilles séchées kilo | Accio, Alibaba, EspaceAgro, fiches Pomona | Prix de plateformes ; **aucun fournisseur français ne publie une grille claire** | 1 à 5 : meilleure chance **[ESTIMATION]** | `/prix-morilles-sechees-kilo-professionnels` |
| 8 | morilles séchées traiteur | Jaeger-pro, Sodistri, Plantin « traiteurs » 500 g, Le Labo du Boucher (SERP 06/10) | « Morilles traiteur » est une appellation de catalogue (qualité « traiteur ») | 8 à 15, **seulement avec une page dédiée** (C1) | à créer |
| 9 | morilles Vaucluse | Aucun vendeur de morilles séchées ; résultats de tourisme et de produits locaux ; le Domaine aux Morilles (Tarn-et-Garonne) revient pour « morilles aux restaurateurs » | Pas de concurrent direct local | 1 à 3 si une page « zones de passage » existe ; volume proche de zéro | à créer (C5) |
| 10 | morilles séchées chef à domicile | Aucune page ciblée ; résultats sur les traiteurs eux-mêmes | Intention très rare | 1 à 5 avec une page dédiée (C2), volume très faible | à créer |
| 11 | dried fire morels France supplier / wholesale | Sabarot EN, Plantin EN, Fine & Wild, Nutrada EN, North Spore | Sites avec versions anglaises | Impossible sans page EN (T4) | à créer (C8), basse priorité |
| 12 | morille de feu précommande 2027 | Aucun concurrent | Requête créée par le site | 1 | `/precommande-2027` |

Lecture : le site peut **gagner** sur le prix publié (7), sur « Canada sauvage » côté professionnel (6) et sur la longue traîne (5, 12). Il **ne peut pas** gagner sur les
requêtes de volume et de grossistes (4, 5 en tête). Le gain principal n'est pas le trafic (le marché est de quelques dizaines de recherches par mois) mais d'être **nommé**
quand un acheteur ou une IA demande un fournisseur.

## 3. Contenus à créer ou renforcer (8 propositions)

Règles : uniquement des faits de `docs/business/recit.md` et `docs/business/offre.md` ; prix, doses (5 à 8 g par couvert) et conditions repris des constantes existantes
(`proPricing.ts`) ; vouvoiement, « je » ; aucun calibre, aucune humidité, aucun avis, aucun rendement chiffré à la réhydratation, aucun partenaire nommé. Chaque page : réponse directe en tête,
puis détail, JSON-LD Article + BreadcrumbList, lien vers `/professionnels#devis`.

| # | Page | Requête visée | Plan de page | Priorité |
|---|---|---|---|---|
| C1 | `/morilles-sechees-traiteurs` | « morilles séchées traiteur », « morilles pour traiteur événementiel » | 1. Réponse directe : ce que je vends à un traiteur (sachets sous vide de 250 g, de 1 à 45 kg, prix nets). 2. Dosage par couvert : 5 à 8 g, donc 20 couverts = 100 à 160 g, 100 couverts = 500 à 800 g (calcul de la dose existante). 3. Coût par couvert issu de la grille (comme dans l'article « prix »). 4. Réhydrater en volume : eau tiède, 20 à 30 min, jus filtré (faits de `articles.ts`). 5. Commande, devis sous 48 h ouvrées, rendez-vous pour l'échantillon de 30 g. 6. FAQ : minimum, facturation, expédition sous 5 jours ouvrés. | 1 |
| C2 | `/morilles-sechees-chef-a-domicile` | « morilles séchées chef à domicile », « acheter morilles séchées petite quantité professionnel » | Cible la plus petite : à partir de 1 kg (350 €/kg net). Dose, coût par couvert, comment commander avec le SIRET, échantillon en main propre sur rendez-vous, zones de passage. À différencier de C1 (même grille, autre cible, autres exemples) pour éviter le doublon. | 2 |
| C3 | `/valerian-vilane` (ou `/a-propos`) | « Morilles du Canada » (marque), « Valérian Vilane morilles » ; alimente « Qui est… » côté IA | Page entité : qui est Valérian, trois saisons 2022-2024 en Colombie-Britannique et au Yukon, comment je travaille (réseau de cueilleurs, séchage sur place, stock en France, expédition depuis la France), ce que je ne fais pas (pas de vente aux particuliers). Photo existante du fondateur, 3 liens vers les guides. Coordonnées et SIRET. Branche `Person.url` et `Organization.founder`. Aucun nom de partenaire. | 1 |
| C4 | Renforcer `/fiche-technique` | « fiche technique morilles séchées » | Ajouter en-tête, pied de page, liens (T2), le PDF téléchargeable. **Blocage commercial** : les fiches de Sabarot donnent humidité, calibre, brisures. Tant que le fondateur n'a pas **mesuré** son lot (hauteur de chapeau, brisures, humidité par laboratoire), `recit.md` interdit de les publier ; une ligne « autres caractéristiques sur demande » est la seule option honnête. Décision du fondateur : faire mesurer un échantillon (coût d'analyse à demander à un laboratoire), puis `/qualite-traceabilite`. | 2 |
| C5 | `/zones-de-passage` (une seule page, pas une page par commune) | « morilles séchées Vaucluse », « morilles Chamonix restaurant », « morilles Maurienne » | Calendrier de passage (constante `TASTING_TOUR`) : Avignon et Provence jusqu'au 7 novembre 2026, Chamonix et Mont-Blanc à partir du 8 novembre, Maurienne en décembre ; comment obtenir un rendez-vous (téléphone, email) ; ce que contient l'échantillon (pot de 30 g). Contenu **unique** (dates et conditions), pas de texte répété entre départements : c'est ce qui évite la page « porte d'entrée ». URL à donner à la fiche Google Business Profile. | 2 |
| C6 | `/cuisiner-morilles-seches-brigade` (guide cuisine pro) | « sauce aux morilles professionnel », « cuisiner morilles séchées pour 50 couverts », « réhydratation morilles cuisine pro » | Remplacer la logique grand public de `/recettes` : fiches de production pour 20, 50, 100 couverts (dosage 5 à 8 g multiplié, aucun rendement chiffré), sauce forestière et risotto de la collection existante transposés, conservation du jus de trempage, cuisson d'au moins 20 minutes (Tox Info Suisse, déjà sur le site). Complète `/rehydrater-morilles-sechees-guide-pro` : renvoyer l'un vers l'autre, ne pas dupliquer. | 3 |
| C7 | Renforcer `/guide-morilles-de-feu` | « morille de feu », « morille de feu Canada », « morille de feu saison » | Rôle : page de référence informationnelle (T9). Ajouter une section datée « La saison en cours » (feux, cueillette, stock) à partir de faits validés seulement, une source externe (carte publique des feux du Canada), des liens vers C3, C1 et le comparatif. Cadrer sans polémique l'angle d'actualité « ruée vers les morilles de feu » (Slate) : « je l'ai fait de 2022 à 2024 ». | 3 |
| C8 | `/en/dried-fire-morels-france` | « dried fire morels France supplier », « wild morels wholesale France restaurant » | Une page anglaise unique avec `hreflang` fr/en, mêmes faits que `llms.txt` (prix, conditions, origine), FAQ en anglais. Utile aux IA anglophones et aux acheteurs étrangers en France ; basse priorité tant que la cible reste les restaurants français. | 4 |

Pages à **ne pas** créer : une page par commune ou par département (risque de pages à contenu quasi identique) ; une page « morilles fraîches » ; une page « avis clients »
(les 3 avis réels viennent de particuliers, `recit.md`) ; de nouvelles recettes grand public.

### Les 3 contenus à créer en premier

1. C3, page fondateur / entité (signal d'identité pour les moteurs et les IA, relie les profils futurs).
2. C1, page traiteurs (requête « morilles traiteur » sans page dédiée, cible commerciale prioritaire).
3. C5, page zones de passage (donne un contenu local réel, sert de page d'atterrissage à la fiche Google).

## 4. Visibilité dans les IA

### 4.1 Ce qui détermine d'être cité

- **[FAIT]** Un moteur de réponse cite d'abord ce que **son index de recherche retrouve** : ChatGPT Search s'appuie sur Bing, Copilot sur Bing, Gemini et les AI Overviews sur Google,
  Perplexity sur son propre index. Une page non indexée ne peut pas être citée. Sources : `docs/marketing/seo-geo.md` (section 5), https://seranking.com/blog/chatgpt-vs-perplexity-vs-google-vs-bing-comparison-research/.
- **[FAIT]** L'autorité de domaine n'est pas un prérequis : dans l'étude SE Ranking, 46,6 % des URL citées reçoivent 0 à 50 visites ; Bing Copilot cite souvent des domaines de moins de 5 ans. Un petit site neuf peut donc être cité s'il répond précisément. (Étude d'un éditeur d'outils SEO, à prendre comme ordre de grandeur.)
- **[FAIT]** Les moteurs se recoupent peu : une source citée par ChatGPT n'est reprise par Perplexity que dans 44 % des cas (étude d'éditeur, https://frase.io/blog/which-ai-engines-cite-which-sources). Il faut être présent partout, pas seulement sur un moteur.
- **[ESTIMATION]** Les critères qui reviennent : réponse directe extractible (déjà fait), faits chiffrés cohérents entre toutes les sources, fraîcheur datée, mentions sur d'autres sites (annuaires, presse, avis) qui confirment l'entité, balisage clair.
- **[FAIT]** `llms.txt` : aucun effet mesuré. Google ne le prend pas en charge ; une étude citée par Search Engine Land et SE Ranking (300 000 sites) ne trouve aucun lien entre sa présence et les citations ; 97 % des fichiers
  n'auraient jamais été demandés par un robot IA (étude Ahrefs rapportée par des revues). Sources : https://searchengineland.com/does-llms-txt-matter-467740. Le garder (coût nul), ne plus y investir.
- **[FAIT]** Bing Webmaster propose depuis février 2026 un rapport « AI Performance » (citations Copilot par page et requêtes de recherche, export CSV). Source : https://www.searchinfluence.com/blog/bing-ai-performance-report-copilot-citations/. C'est le seul instrument de mesure direct disponible ; l'ouvrir chaque mois.

### 4.2 État actuel du site

| Élément | État |
|---|---|
| Robots IA autorisés (GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, etc.) | **[FAIT]** en place |
| llms.txt, llms-full.txt | **[FAIT]** en place (effet attendu faible) |
| Données structurées (Organization, Product, Article, Recipe, FAQ) | **[FAIT]** en place ; trous : T5, T6 |
| Page d'identité du fondateur | **[FAIT]** absente (C3) |
| Présence Bing | **[FAIT]** Bing Webmaster validé le 5 octobre, sitemap envoyé. **[FAIT, sondage unique]** seule l'accueil ressort dans l'outil de recherche : indexation incomplète |
| Profils externes (`sameAs`) | **[FAIT]** aucun : `SAME_AS_URLS` est vide |
| Mentions tierces (annuaires, presse, avis) | **[FAIT]** aucune trouvée dans les recherches (recherche « morillesducanada.com » : aucune page tierce) |
| Langue | **[FAIT]** français seulement (T4) |

### 4.3 Les 5 actions qui augmentent le plus la probabilité d'être cité

1. **Faire indexer les 26 pages dans Bing et Google** : corriger T1 à T3, relancer `node scripts/indexnow.mjs`, demander l'indexation des 5 pages de contenu dans les deux consoles, contrôler au bout de 2 semaines (Search Console, Bing « Explorer »).
2. **Créer 3 à 5 mentions tierces cohérentes** (fiche Google, Bing Places, 3 annuaires CHR, LinkedIn) avec le même nom, le même texte descriptif et le même site (section 5) : c'est ce qui permet à une IA de recouper l'entité.
3. **Publier la page fondateur** (C3) et enrichir Organization/Person (T6) : répond à « Qui est Morilles du Canada ? », vérifie l'exactitude des faits repris par les IA.
4. **Combler les trous d'intention** : C1 (traiteurs), C2 (chefs à domicile), C4 (fiche technique) ; chaque page répond à une question qu'un acheteur pose, avec chiffres issus de la grille.
5. **Garder les faits identiques et datés partout** : prix, stock, conditions, calendrier (site, `llms.txt`, plaquette, fiche Google, annuaires) ; mettre à jour `dateModified` et relancer IndexNow à chaque changement. Une IA qui trouve deux prix différents cite l'ancienne source ou aucune.

Mesure : le test mensuel de `docs/marketing/seo-geo.md` section 4 (9 questions, 5 outils) plus le rapport Bing AI Performance. Commencer avant les corrections pour avoir un point de départ (semaine 1), puis refaire à 4 et 8 semaines.

## 5. Hors site : liens et mentions réalistes pour un vendeur seul

Classement par impact / effort. Rappel : aucun envoi presse ou de prospection sans feu vert du fondateur (`CLAUDE.md`).

| Rang | Action | Impact | Effort | Remarques |
|---|---|---|---|---|
| 1 | **Google Business Profile**, entreprise à zone de service, adresse masquée | Élevé (Google Maps, entité, avis) | 1 h + vérification vidéo | Détail dans `seo-geo.md` 2.3. **[ESTIMATION]** Google peut refuser une fiche « grossiste sans local » : se présenter comme fournisseur qui rend visite aux professionnels (zones de passage, C5) et choisir la catégorie proposée la plus proche. Site web : `/zones-de-passage` ou `/professionnels`. |
| 2 | **Annuaires CHR** : fournisseurs-chr.fr, lesannonceschr.com, chr.fr | Moyen (liens et recoupement d'entité) | 2 h | **[FAIT]** les trois sites répondent (HTTP 200, 06/10) ; conditions de gratuité et de catégorie à vérifier avant inscription. |
| 3 | **Recoupement par des clients pros** : une phrase d'un restaurant, d'un traiteur ou d'un chef à domicile, avec son accord écrit, avec nom et lien | Très élevé (preuve + lien) | Dépend de la première vente | Le meilleur lien qu'un vendeur seul puisse obtenir. Aucun nom de partenaire du Canada ; seulement des clients français consentants. |
| 4 | **Presse locale et métier** : La Provence, Le Dauphiné Libéré, Le Messager, presse de la restauration | Élevé et durable (les IA citent la presse) | 3 h par pitch | Angle vrai : ancien cueilleur qui fournit désormais tables et traiteurs ; actualité : la « ruée vers les morilles de feu » traitée par Slate. Une demi-douzaine de contacts, pas un envoi en masse. Titres métier de l'audit 03 non revérifiés ici. |
| 5 | **Bing Places** (fiche créée à la main, adresse masquée) | Moyen (Bing, Copilot, ChatGPT Search) | 30 min | `seo-geo.md` 2.4. |
| 6 | **EspaceAgro** : annonce de fournisseur sur la place de marché B2B (les acheteurs y postent « détaillant cherche morille ») | Moyen | 1 h | **[FAIT]** le site existe et référence « morilles de feu séchées » (accès bloqué à `curl`, lu via recherche). Conditions et coût à vérifier ; ne pas payer un « pack ». |
| 7 | **Avis Google de clients pros** après livraison | Moyen, croissant | 10 min par client | Jamais en échange d'une remise (`seo-geo.md` 2.8). Pas de balisage `aggregateRating`. |
| 8 | **LinkedIn (page entreprise)** puis Instagram, avec archives 2022-2024 sans tiers reconnaissables | Moyen | 1 h puis 30 min par semaine | Pas de profil vide. Ajouter l'URL dans `SAME_AS_URLS`. |
| 9 | Annuaire hôtelier TendanceHôtellerie (fiche de base gratuite, version payante 300 € HT par an) | Faible (cible hôtellerie) | 30 min | **[FAIT]** fiche de base gratuite selon la page d'inscription ; ne pas prendre l'offre payante. |
| 10 | Nutrada (annuaire de fournisseurs en vrac) | Faible (marché de tonnes) | 30 min | Peu adapté à 45 kg ; à tenter seulement si la fiche est gratuite. |
| — | À éviter | — | — | Packs SEO, échanges de liens, annuaires généralistes payants, avis achetés, faux profils, promotion non sollicitée dans des forums de cuisine. |

### Les 3 actions hors site les plus rentables

1. Google Business Profile (zone de service) plus Bing Places.
2. Une phrase de client pro (avec accord écrit) publiée sur le site et reprise sur LinkedIn, dès la première vente.
3. Les trois annuaires CHR vérifiés, avec exactement le même texte et le même NAP.

## 6. Plan d'action en trois horizons

Qui : **C** = Claude sur le code (branche, tests, build, déploiement validé par le fondateur) ; **F** = fondateur dans un compte. Effort : S moins de 1 h, M 1 à 4 h, L plus de 4 h.

### Cette semaine (6 au 12 octobre)

| # | Action | Qui | Effort | Impact attendu |
|---|---|---|---|---|
| 1 | Corriger T3 (soft 404 recettes) et T2 (liens de la fiche technique et de la plaquette) | C | S | Moyen, supprime un risque d'indexation parasite |
| 2 | Corriger T1 : bloc « Guides pour les professionnels » dans le corps de l'accueil et de `/professionnels`, entrée « Guides » dans l'en-tête, liens contextuels dans les recettes | C | M | Élevé (indexation et poids interne des 6 pages) |
| 3 | Raccourcir titres et descriptions (T7, T8), retirer « 45 kg » des métas | C | S | Moyen |
| 4 | Après déploiement validé : `node scripts/indexnow.mjs`, puis « Demander l'indexation » des 5 pages de contenu (Google), « Envoyer des URL » (Bing) | F | S | Élevé |
| 5 | Premier test de citation IA (9 questions, base de référence) et ouvrir le rapport AI Performance de Bing | F | M | Mesure |
| 6 | Créer la fiche Google Business Profile et lancer la vérification | F | M | Élevé |
| 7 | Créer Bing Places | F | S | Moyen |

### Ce mois-ci (octobre à début novembre)

| # | Action | Qui | Effort | Impact attendu |
|---|---|---|---|---|
| 8 | C3 : page fondateur ; T6 : Organization et Person enrichis | C (texte à valider par F) | M | Élevé (entité, « Qui est… ») |
| 9 | C1 : page traiteurs ; C2 : page chefs à domicile | C (texte à valider par F) | L | Élevé (cible commerciale) |
| 10 | C5 : page zones de passage ; l'URL est donnée à la fiche Google | C | M | Moyen |
| 11 | T5 (Recipe image), T9 (rôle des 3 pages « morille de feu »), T10, T11, T12 | C | M | Faible à moyen |
| 12 | 3 inscriptions d'annuaires CHR vérifiées ; LinkedIn ; ajouter les URL dans `SAME_AS_URLS` | F (puis C pour `SAME_AS_URLS`) | M | Moyen |
| 13 | Pitch presse locale (un titre pour la zone de passage en cours), avec feu vert | F | M | Élevé et durable |
| 14 | Décision : mesurer un échantillon du lot (calibre, humidité) pour pouvoir publier une fiche technique complète (C4) | F | M (hors site : laboratoire) | Élevé en B2B, bloquant face à Sabarot |
| 15 | Mettre à jour les faits partout après chaque changement (prix, stock, calendrier) ; relancer IndexNow | C et F | S, récurrent | Moyen |

### D'ici la saison 2027 (novembre 2026 à octobre 2027)

| # | Action | Qui | Effort | Impact attendu |
|---|---|---|---|---|
| 16 | Test de citation IA mensuel, rapport Bing AI Performance, Search Console : noter requêtes et pages dans `docs/marketing/` | F | S par mois | Pilotage |
| 17 | Après 4 semaines de données : réviser les titres selon les requêtes réelles (Search Console, onglet Performances) | C | S | Moyen |
| 18 | C6 (cuisine pro, 20/50/100 couverts) et C7 (guide morille de feu, section saison) | C | L | Moyen |
| 19 | Premiers avis Google et citations de clients pros publiées avec accord écrit | F | S par client | Très élevé |
| 20 | Décider de la page anglaise (C8, T4) selon les premières demandes étrangères | F décide, C exécute | M | Faible à moyen |
| 21 | Février-mars 2027 : mise à jour saison avec `/nouvelle-saison` (dates, stock, précommande, `dateModified`, IndexNow) | C | M | Moyen |
| 22 | Visiter Sirha Lyon (21-25 janvier 2027) et Gourmet Sélection (13-14 juin 2027) comme visiteur (audit 03) ; contacts utilisables pour mentions | F | L | Moyen |

## 7. Points à trancher par le fondateur

- Garder ou supprimer le bouton EN tant qu'il n'existe pas de page anglaise (T4).
- Valider le texte des pages C1, C2, C3, C5 avant publication (voix « je », faits de `recit.md` seulement).
- Accepter de mesurer un échantillon de lot pour publier calibre et humidité (C4) ; sinon laisser « sur demande ».
- Autoriser l'ouverture de la fiche Google Business Profile et des profils (LinkedIn, Instagram) avec les photos de `src/assets/morels/`.
- Valider chaque pitch presse avant envoi.

## Sources principales

- Constat technique : `curl` des 26 URL du sitemap le 2026-10-06 (extraction des titres, descriptions, h1, canoniques, liens, JSON-LD, poids).
- Concurrence : SERP DuckDuckGo France du 2026-10-06 (requête 1) ; pages lues : https://auxtresorsdesbois.fr/blogs/infos/achat-morilles-sechees-gros-demi-gros, https://nutrada.com/fr/produits/champignons/morilles-en-gros ; résultats de recherche (Sabarot, Plantin, Pomona, North Spore, Qualifirst, EspaceAgro).
- IA et GEO : https://seranking.com/blog/chatgpt-vs-perplexity-vs-google-vs-bing-comparison-research/ · https://searchengineland.com/does-llms-txt-matter-467740 · https://www.searchinfluence.com/blog/bing-ai-performance-report-copilot-citations/ · https://www.searchenginejournal.com/google-drops-faq-rich-results/574429/ · https://frase.io/blog/which-ai-engines-cite-which-sources.
- Annuaires CHR : contrôle de réponse HTTP (06/10) de lesannonceschr.com, fournisseurs-chr.fr, chr.fr, tendancehotellerie.fr.
