import { products } from "@/lib/products";

export type ChangeFreq = "daily" | "weekly" | "monthly" | "yearly";

export interface IndexableRoute {
  path: string;
  priority: number;
  changefreq: ChangeFreq;
  // Fichiers dont la date du dernier commit sert de <lastmod> dans le sitemap.
  sources: string[];
}

const PRODUCT_SOURCES = ["src/lib/products.ts", "src/lib/productDetails.ts", "src/pages/ProductDetail.tsx"];

// Routes publiques prérendues au build et listées dans le sitemap.
export const STATIC_ROUTES: IndexableRoute[] = [
  { path: "/", priority: 1, changefreq: "weekly", sources: ["src/pages/Index.tsx", "src/components", "src/i18n/fr.ts", "src/lib/products.ts"] },
  { path: "/professionnels", priority: 0.9, changefreq: "weekly", sources: ["src/pages/Professionnels.tsx", "src/components/pro", "src/i18n/fr.ts", "supabase/functions/_shared/proPricing.ts"] },
  { path: "/produits", priority: 0.9, changefreq: "weekly", sources: ["src/pages/Produits.tsx", "src/lib/products.ts"] },
  { path: "/guide-morilles-de-feu", priority: 0.7, changefreq: "monthly", sources: ["src/pages/GuideMorellesDeFeu.tsx"] },
  { path: "/recettes", priority: 0.7, changefreq: "weekly", sources: ["src/pages/Recettes.tsx"] },
  { path: "/fiche-technique", priority: 0.6, changefreq: "monthly", sources: ["src/pages/FicheTechnique.tsx"] },
  { path: "/plaquette-pro", priority: 0.6, changefreq: "monthly", sources: ["src/pages/PlaquettePro.tsx", "supabase/functions/_shared/proPricing.ts"] },
  { path: "/galerie", priority: 0.5, changefreq: "monthly", sources: ["src/pages/Galerie.tsx", "src/lib/galleryPhotos.ts"] },
  { path: "/livraison", priority: 0.4, changefreq: "monthly", sources: ["src/pages/Livraison.tsx"] },
  { path: "/cgv", priority: 0.2, changefreq: "yearly", sources: ["src/pages/CGV.tsx"] },
  { path: "/mentions-legales", priority: 0.2, changefreq: "yearly", sources: ["src/pages/MentionsLegales.tsx"] },
];

export const PRODUCT_ROUTES: IndexableRoute[] = products.map((p) => ({
  path: `/produits/${p.slug}`,
  priority: 0.8,
  changefreq: "weekly",
  sources: PRODUCT_SOURCES,
}));

export function recipeRoute(slug: string): IndexableRoute {
  return { path: `/recettes/${slug}`, priority: 0.6, changefreq: "monthly", sources: ["src/pages/RecetteDetail.tsx"] };
}
