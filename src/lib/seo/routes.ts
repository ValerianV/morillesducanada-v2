export type ChangeFreq = "daily" | "weekly" | "monthly" | "yearly";

import { ARTICLES } from "./articles";

export interface IndexableRoute {
  path: string;
  priority: number;
  changefreq: ChangeFreq;
  // Date <lastmod> imposée (articles : leur dateModified) ; sinon dernier commit des fichiers sources.
  lastmod?: string;
  // Fichiers dont la date du dernier commit sert de <lastmod> dans le sitemap.
  sources: string[];
}

// Routes publiques prérendues au build et listées dans le sitemap.
export const STATIC_ROUTES: IndexableRoute[] = [
  { path: "/", priority: 1, changefreq: "weekly", sources: ["src/pages/Index.tsx", "src/components", "src/i18n/fr.ts", "supabase/functions/_shared/proPricing.ts"] },
  { path: "/professionnels", priority: 0.9, changefreq: "weekly", sources: ["src/pages/Professionnels.tsx", "src/components/pro", "src/i18n/fr.ts", "supabase/functions/_shared/proPricing.ts"] },
  { path: "/precommande-2027", priority: 0.8, changefreq: "weekly", sources: ["src/pages/Precommande2027.tsx", "src/i18n/fr.ts", "supabase/functions/_shared/catalog.ts"] },
  ...ARTICLES.map((article): IndexableRoute => ({
    path: article.path,
    priority: article.priority,
    changefreq: "monthly",
    lastmod: article.dateModified,
    sources: ["src/lib/seo/articles.ts", "src/pages/ContentArticle.tsx"],
  })),
  { path: "/guide-morilles-de-feu", priority: 0.7, changefreq: "monthly", sources: ["src/pages/GuideMorellesDeFeu.tsx"] },
  { path: "/recettes", priority: 0.7, changefreq: "weekly", sources: ["src/pages/Recettes.tsx"] },
  { path: "/fiche-technique", priority: 0.6, changefreq: "monthly", sources: ["src/pages/FicheTechnique.tsx"] },
  { path: "/plaquette-pro", priority: 0.6, changefreq: "monthly", sources: ["src/pages/PlaquettePro.tsx", "supabase/functions/_shared/proPricing.ts"] },
  { path: "/galerie", priority: 0.5, changefreq: "monthly", sources: ["src/pages/Galerie.tsx", "src/lib/galleryPhotos.ts"] },
  { path: "/livraison", priority: 0.4, changefreq: "monthly", sources: ["src/pages/Livraison.tsx"] },
  { path: "/cgv", priority: 0.2, changefreq: "yearly", sources: ["src/pages/CGV.tsx"] },
  { path: "/mentions-legales", priority: 0.2, changefreq: "yearly", sources: ["src/pages/MentionsLegales.tsx"] },
];

export function recipeRoute(slug: string): IndexableRoute {
  return { path: `/recettes/${slug}`, priority: 0.6, changefreq: "monthly", sources: ["src/pages/RecetteDetail.tsx"] };
}
