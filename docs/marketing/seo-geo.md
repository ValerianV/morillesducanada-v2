# SEO et GEO : être trouvé et cité par les IA

Objectif : quand un professionnel demande à ChatGPT, Claude, Perplexity ou Gemini « où acheter des morilles
séchées pour mon restaurant », Morilles du Canada est cité. Dernière mise à jour : 2026-10-01.

Ce document liste **ce que le site fait déjà** et, surtout, **ce que seul le fondateur peut faire hors du site**,
par ordre d'impact. Rien ici ne promet un classement : les moteurs de réponse citent des sources qu'ils
retrouvent, comprennent et recoupent ailleurs sur le web.

## 1. Ce que le site fait déjà (livré sur la branche `feat/seo-geo`)

| Élément | Où | Rôle |
|---|---|---|
| robots.txt explicite | `src/lib/seo/robots.ts` (généré au build) | Autorise Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended ; garde les Disallow (admin, auth, paiement…) |
| llms.txt et llms-full.txt | `src/lib/seo/llms.ts` (générés au build) | Faits citables : qui, quoi, origine, grille, conditions, zones de dégustation. Prix et dates viennent des mêmes constantes que le site |
| 5 pages de contenu | `src/lib/seo/articles.ts`, `src/pages/ContentArticle.tsx` | Une page prérendue par intention d'achat, réponses directes en tête de section, JSON-LD Article (auteur Person Valérian Vilane), FAQPage, BreadcrumbList |
| Données structurées | `src/lib/seo/schema.ts` | Organization (founder, areaServed France, knowsAbout), Offer + UnitPriceSpecification au kilo, FAQPage enrichie (15 questions pro), BreadcrumbList, dateModified |
| IndexNow | `public/<clé>.txt`, `scripts/indexnow.mjs` | Prévient Bing (donc ChatGPT Search) et Yandex d'un changement, à lancer après chaque déploiement |
| Sitemap | généré au build | 26 URL, lastmod réel (date de modification des pages de contenu) |

À savoir :

- Les robots d'**entraînement** (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended) servent à entraîner les modèles ;
  les robots de **recherche** (OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot, Bingbot) rendent le site
  éligible aux citations ; les robots **utilisateur** (ChatGPT-User, Claude-User, Perplexity-User) lisent une page
  quand une personne le demande. Le fondateur a choisi de tout autoriser. Pour bloquer l'entraînement seulement,
  retirer GPTBot, ClaudeBot, Google-Extended et Applebot-Extended de `SEARCH_AND_AI_BOTS`.
- **llms.txt** : aucun moteur ne garantit l'utiliser. Il coûte peu et reste utile aux agents qui le lisent ; ne pas
  en attendre d'effet mesurable seul. Le levier principal reste le contenu clair, la cohérence entre sources et les
  mentions externes (section 2).
- Les pages de contenu sont en français uniquement. Les mettre à jour à chaque changement de prix (elles lisent
  la grille) et modifier `dateModified` dans `articles.ts` quand le fond change.
- `sameAs` (Organization) reste vide tant qu'aucun profil public réel n'existe : après chaque création de profil
  ci-dessous, ajouter l'URL dans `SAME_AS_URLS` (`src/lib/seo/site.ts`).

## 2. Actions hors site, par ordre d'impact

### 1. Google Search Console (30 min, gratuit)

1. Aller sur search.google.com/search-console, « Ajouter une propriété », type **Domaine**, saisir `morillesducanada.com`.
2. Valider par l'enregistrement TXT DNS (chez le registrar, voir `docs/tech/acces.md`).
3. Menu « Sitemaps » : ajouter `sitemap.xml`.
4. « Inspection de l'URL » puis « Demander une indexation » pour : `/`, `/professionnels`, `/precommande-2027` et les 5 nouvelles pages de contenu.
5. Une fois par mois : onglet « Performances », noter les requêtes qui apportent des impressions.

### 2. Bing Webmaster Tools (15 min, gratuit) : prioritaire pour ChatGPT

ChatGPT Search s'appuie sur l'index de Bing.

1. bing.com/webmasters : « Importer depuis Google Search Console » (reprend la validation et le sitemap).
2. Vérifier que `https://www.morillesducanada.com/sitemap.xml` apparaît dans « Sitemaps » (ne pas le soumettre en double).
3. Après chaque déploiement : lancer IndexNow (`node scripts/indexnow.mjs`, voir `docs/tech/deploiement.md`).
4. Une fois par mois : rapport « AI Performance » (si disponible sur le compte) : il indique combien de fois les pages sont citées par Copilot et Bing, et pour quelles requêtes.

### 3. Fiche Google Business Profile (1 h + vérification)

L'activité est à domicile : déclarer une **entreprise sans local client** (zone de service), adresse masquée.

1. business.google.com : créer la fiche « Morilles du Canada ».
2. Type d'établissement : « Entreprise proposant des services à domicile » (zone de service) ; adresse saisie pour la vérification mais **masquée** au public.
3. Zone de service : les communes ou départements où Valérian passe (Vaucluse et Provence, Haute-Savoie et Mont-Blanc, Savoie et Maurienne).
4. Catégorie principale : une catégorie de fournisseur alimentaire pour les professionnels, choisie dans la liste proposée par Google (par exemple celle d'un fournisseur ou grossiste alimentaire) ; ajouter « Épicerie fine » en secondaire seulement si Google la propose.
5. Site web : `https://www.morillesducanada.com/professionnels`. Téléphone et email : exactement ceux de la section « Cohérence NAP ».
6. Description : reprendre la première phrase de `public/llms.txt` (morilles de feu sauvages du Canada, séchées, entières et équeutées, au kilo pour les professionnels, en stock en France). Aucune promesse hors `docs/business/recit.md`.
7. Photos : uniquement celles de `src/assets/morels/` (jamais les cueilleurs partenaires).
8. Vérification : par vidéo ou courrier ; prévoir de montrer des sachets, une facture et la pièce d'identité d'entrepreneur. Ne jamais utiliser de boîte postale ou de domiciliation.
9. Une fois validée, ajouter l'URL de la fiche dans `SAME_AS_URLS`.

### 4. Bing Places (30 min, gratuit)

1. bingplaces.com : l'import depuis Google **ne fonctionne pas** quand l'adresse est masquée ; créer la fiche à la main.
2. Saisir la même adresse que pour Google, puis choisir de la masquer (zone de service). Même nom, téléphone, site.
3. Vérifier par le code envoyé (téléphone ou courrier).

### 5. Cohérence nom, adresse, téléphone (NAP)

Un moteur de réponse recoupe les sources : les écarts le font hésiter. Utiliser **partout** exactement :

- Nom : `Morilles du Canada` (éditeur : Valérian Vilane, entrepreneur individuel).
- Commune : Aubignan (Vaucluse), France ; adresse complète seulement là où elle est obligatoire (mentions légales, factures).
- Téléphone : `07 82 16 27 08` (format international `+33 7 82 16 27 08`).
- Email : `contact@morillesducanada.com`. Site : `https://www.morillesducanada.com`.
- Description : une seule phrase, la même partout (voir `public/llms.txt`, première ligne).

À contrôler : fiche Google, Bing Places, annuaires, réseaux sociaux, factures, signature d'email, mentions légales du site.

### 6. Annuaires professionnels (2 h, gratuits)

Choisir des annuaires ciblés restauration et épicerie fine, sans paiement ni lien retour obligatoire. Pistes relevées
en octobre 2026 (à vérifier avant inscription : conditions, gratuité, sérieux) :

- annuaire des fournisseurs CHR de lesannonceschr.com (inscription gratuite par catégorie) ;
- fournisseurs-chr.fr (répertoire gratuit des fournisseurs CHR) ;
- chr.fr (annuaire des fournisseurs des cafés, hôtels, restaurants).

Pas-à-pas : ouvrir l'annuaire, choisir la catégorie (produits frais ou épicerie fine), « Inscrire son entreprise »,
coller la description unique, le NAP, le lien vers `/professionnels`. Noter chaque inscription dans le tableau de la section 4.
Éviter les annuaires généralistes payants ou les « packs SEO ».

### 7. Mentions dans la presse locale et métier (en continu)

Les moteurs de réponse citent volontiers des articles de presse. Angle vrai et simple : un ancien cueilleur de
morilles de feu (trois saisons, 2022 à 2024, Colombie-Britannique et Yukon) qui fournit désormais restaurants et épiceries.

1. Liste courte : presse locale des zones de passage (Vaucluse, Haute-Savoie, Savoie : par exemple La Provence, Le Dauphiné Libéré, Le Messager), presse professionnelle de la restauration et de l'épicerie fine.
2. Écrire un email de 6 lignes à la rédaction : qui (Valérian), quoi (morilles de feu, rares, une saison), pourquoi maintenant (dégustations en main propre, calendrier de passage), contact. Joindre 2 photos de `src/assets/morels/`.
3. Chaque mention obtenue : l'ajouter à `docs/marketing/` (date, média, lien) et, si elle est vérifiable, la citer sur le site avec la source.
4. Aucun email de prospection de masse sans feu vert (règle `CLAUDE.md`).

### 8. Avis Google des clients professionnels (en continu)

1. Après une livraison réussie, un email personnel de Valérian avec le lien d'avis de la fiche Google (bouton « Obtenir plus d'avis » de la fiche).
2. Demander un avis honnête, jamais en échange d'une remise ; ne jamais écrire d'avis soi-même ni en faire écrire.
3. Répondre à chaque avis (remerciement, sobre).
4. Ne **pas** ajouter de balisage `aggregateRating` sur le site : seuls des avis réels, affichés sur la page, justifieraient un balisage (règle `docs/business/recit.md`).

### 9. Réseaux sociaux (1 h de mise en place)

1. LinkedIn (page entreprise) : le canal des acheteurs professionnels ; nom, description et lien identiques au NAP.
2. Instagram (compte professionnel) : photos terrain de `src/assets/morels/`, une publication par semaine pendant la saison de vente, lien vers `/professionnels`.
3. Ajouter chaque URL dans `SAME_AS_URLS` (`src/lib/seo/site.ts`) après création. Pas de profil vide : un profil sans publication nuit à la crédibilité.

## 3. Calendrier conseillé

| Quand | Action |
|---|---|
| Jour du déploiement | Search Console, Bing Webmaster Tools, `node scripts/indexnow.mjs` |
| Semaine 1 | Google Business Profile (lancer la vérification), Bing Places, NAP |
| Semaine 2 | Annuaires (3 inscriptions), LinkedIn |
| Semaines 3 à 4 | Premier test de citation (section 4, base de référence), email presse locale |
| Chaque mois | Test de citation, Search Console, Bing AI Performance, avis |

## 4. Tester chaque mois si les IA citent le site

Méthode : 20 minutes, le même jour du mois, **en navigation privée** et sans être connecté quand c'est possible
(les réponses changent selon le compte). Activer la recherche web quand l'outil le propose.

Outils à tester : ChatGPT (recherche activée), Claude (recherche web activée), Perplexity, Gemini, Microsoft Copilot.

Questions types (à poser telles quelles, une conversation neuve par question) :

1. Où acheter des morilles séchées pour mon restaurant ?
2. Quel est le prix des morilles séchées au kilo pour un professionnel ?
3. Fournisseur de morilles de feu du Canada en France.
4. Morille de feu ou morille de culture : quelle différence ?
5. Comment réhydrater des morilles séchées en cuisine professionnelle ?
6. Où trouver des morilles séchées à reconditionner en pots pour une épicerie fine ?
7. Morilles séchées sauvages pour un traiteur, livraison en France.
8. Qui est Morilles du Canada ? (vérifie l'exactitude : prix, conditions, origine, fondateur)
9. Where can I buy wild dried fire morels in France for a restaurant?

Pour chaque réponse, noter dans un tableau (une ligne par outil et par question) :

| Date | Outil | Question n° | Cité (oui/non) | Page citée | Concurrents cités | Faits exacts (oui/non, lesquels sont faux) |
|---|---|---|---|---|---|---|

Lecture :

- **Cité = non** pendant 2 mois : vérifier l'indexation (Search Console, Bing), renforcer les sections 2.3 à 2.7 (fiche, annuaires, presse).
- **Faits faux** (prix périmé, conditions inexactes) : corriger la page ou le `llms.txt` concerné, mettre à jour `dateModified`, relancer IndexNow. Le fondateur valide toute correction de prix.
- **Concurrents cités** : relever ce que leurs pages contiennent que les nôtres n'ont pas (question précise, tableau, source) et ajouter une section de réponse directe, sans dénigrer personne.
- Ne tirer aucune conclusion d'un seul test : les réponses des IA varient d'un jour à l'autre. Comparer l'évolution sur 3 mois.

## 5. Sources consultées (recherche du 2026-10-01, 12 requêtes web)

- Bonnes pratiques GEO 2026 : réponses directes en tête de section, FAQPage et Article schema, noms d'entités cohérents, relecture trimestrielle de la fraîcheur.
- Robots d'IA : un robot par usage (entraînement, recherche, requête utilisateur) ; chaque jeton a sa propre directive.
- IndexNow : fichier `<clé>.txt` à la racine, envoi jusqu'à 10 000 URL ; Bing en tire ChatGPT Search.
- Format llmstxt.org : H1, citation de résumé, puis sections de liens.
- Google Business Profile : entreprise à domicile = zone de service, adresse masquée ; Bing Places n'importe pas une fiche à adresse masquée.
- Bing Webmaster Tools : import depuis Search Console, rapport AI Performance (citations Copilot).
