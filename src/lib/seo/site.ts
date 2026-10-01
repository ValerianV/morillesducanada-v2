// Domaine canonique : la production redirige l'apex vers www.
export const SITE_URL = "https://www.morillesducanada.com";
export const SITE_NAME = "Morilles du Canada";
export const CONTACT_EMAIL = "contact@morillesducanada.com";
export const CONTACT_PHONE = "+33782162708";

export interface SeoImage {
  url: string;
  width?: number;
  height?: number;
  alt: string;
}

// Généré par scripts/generate-seo-images.mjs à partir d'une photo de src/assets.
export const DEFAULT_OG_IMAGE: SeoImage = {
  url: `${SITE_URL}/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: "Morilles sauvages du Canada séchées, entières et équeutées",
};

export const LOGO_URL = `${SITE_URL}/logo.png`;

export const FOUNDER_NAME = "Valérian Vilane";

// Profils publics réels de l'entreprise (fiche Google, LinkedIn, Instagram…), à ajouter UN PAR UN
// quand le fondateur les a créés (voir docs/marketing/seo-geo.md). Vide tant qu'aucune URL réelle
// n'existe : le balisage Organization omet alors « sameAs ».
export const SAME_AS_URLS: readonly string[] = [];

// Date de dernière vérification de l'offre (prix, conditions) : dateModified des pages d'offre.
// À mettre à jour à chaque changement de grille ou de conditions.
export const OFFER_LAST_REVIEWED = "2026-10-01";

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.replace(/\/+$/, "")}`;
}
