

## Plan d'implementation

Ce plan couvre 4 axes : section professionnelle saison 2026, responsive mobile, SEO, et suggestions d'amelioration.

---

### 1. Section Professionnels — Pre-commande Saison Ete 2026

**Fichier : `src/components/ProfessionalSection.tsx`**

Ajouter un encart visuellement distinct (banniere avec bordure doree et icone calendrier) entre les 3 cartes et le bouton CTA existant :

- Titre : "Saison 2026 — Reservez votre approvisionnement"
- Texte expliquant que la saison de cueillette est courte (juin-juillet), les quantites limitees, et qu'il est conseille de pre-commander pour garantir son stock
- Mention des avantages : tarifs degresses, priorite de livraison, lot garanti
- CTA vers `#contact` avec label "Pre-commander pour l'ete 2026"

Ajouter aussi dans le formulaire de contact (`ContactSection.tsx`) une option "Pre-commande saison 2026" dans le select "Vous etes".

---

### 2. Responsive Mobile

Modifications transversales sur tous les composants :

- **Navbar** : Deja responsive, mais reduire la taille du logo/texte sur mobile (`text-lg` au lieu de `text-xl`)
- **HeroSection** : Reduire les tailles de texte (`text-3xl` sur mobile au lieu de `text-5xl`), ajuster les paddings, s'assurer que l'image couvre bien
- **OriginSection** : Passer la grid en colonne unique sur mobile (deja `md:grid-cols-2`), reduire la hauteur des photos sous la video (`h-24` au lieu de `h-32`), corriger le texte duplique
- **ProductsSection** : Forcer `grid-cols-1` sur petit ecran (deja fait), verifier les paddings
- **WhySection** : Le tableau comparatif — ajouter un wrapper scrollable horizontal (deja `overflow-x-auto`), reduire les paddings des cellules sur mobile
- **GallerySection** : Reduire a `columns-1 sm:columns-2` sur mobile au lieu de `columns-2`
- **ProfessionalSection** : Grid en colonne unique sur petit ecran (deja `md:grid-cols-3`)
- **ContactSection** : Grid deja responsive, verifier les inputs
- **Footer** : Deja responsive

Correction bug : dans `OriginSection.tsx`, le texte du premier paragraphe est duplique (le contenu apparait deux fois). Corriger ce bug.

---

### 3. SEO

**Fichier : `index.html`**
- Ajouter des balises meta supplementaires : `keywords`, `geo.region`, `geo.placename`
- Ajouter le balisage JSON-LD (schema.org) pour : `Organization`, `Product` (morilles sechees), `WebSite` avec `SearchAction`
- Ajouter `<link rel="canonical">` vers l'URL publiee

**Fichier : `src/pages/Index.tsx`**
- Ajouter un composant `<Helmet>` ou utiliser `document.title` (pas de react-helmet installe, on utilisera les balises directement dans index.html)

**Fichiers composants** — Ameliorer la semantique HTML :
- Utiliser `<article>`, `<main>`, `<header>`, `<footer>` de maniere appropriee
- Ajouter des attributs `aria-label` sur les sections
- S'assurer que toutes les images ont des `alt` descriptifs et riches en mots-cles (deja fait en grande partie)

**Fichier : `public/robots.txt`** — Ajouter un `Sitemap` pointant vers l'URL du site

---

### 4. Suggestions d'amelioration (qualite, attractivite, credibilite)

Voici les recommandations concretes que j'implementerai :

1. **Temoignages / avis clients** — Ajouter une section "Ils en parlent" avec 3-4 citations de chefs ou clients, meme fictives pour le moment comme placeholders, avec nom, titre et photo
2. **Badges de confiance** — Ajouter sous les produits ou dans le footer des badges : "Cueillette sauvage certifiee", "Livraison France", "Paiement securise", "Expedition sous 48h"
3. **FAQ** — Ajouter une section FAQ avec accordeon (composant deja installe) pour repondre aux questions courantes : conservation, preparation, difference avec les morilles cultivees
4. **Chiffres cles animes** — Les chiffres "100% / 3-4 / 0" dans la section Origine pourraient avoir une animation de compteur au scroll
5. **Call-to-action flottant** — Bouton sticky en bas de page sur mobile pour "Commander" qui mene a la section produits

---

### Detail technique

**Fichiers a creer :**
- `src/components/TestimonialsSection.tsx` — Section temoignages
- `src/components/FAQSection.tsx` — Section FAQ avec accordeon
- `src/components/TrustBadges.tsx` — Bandeau de badges de confiance
- `src/components/FloatingCTA.tsx` — Bouton flottant mobile

**Fichiers a modifier :**
- `src/components/ProfessionalSection.tsx` — Ajout encart pre-commande 2026
- `src/components/ContactSection.tsx` — Option pre-commande dans le formulaire
- `src/components/HeroSection.tsx` — Ajustements responsive
- `src/components/OriginSection.tsx` — Fix texte duplique + responsive
- `src/components/GallerySection.tsx` — Responsive mobile
- `src/components/Navbar.tsx` — Taille logo mobile
- `src/components/Footer.tsx` — Badges de confiance
- `src/pages/Index.tsx` — Integration des nouvelles sections + balise `<main>`
- `index.html` — Balises SEO, JSON-LD, canonical

