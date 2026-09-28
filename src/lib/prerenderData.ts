// Données chargées au build par scripts/prerender.mjs (recettes Supabase) et injectées dans le
// HTML prérendu : le premier rendu client est identique au HTML serveur (hydratation sans écart).
declare global {
  interface Window {
    __PRERENDER_DATA__?: Record<string, unknown>;
  }
}

let serverData: Record<string, unknown> | undefined;

export function setPrerenderData(data: Record<string, unknown> | undefined): void {
  serverData = data;
}

export function getPrerenderData<T>(key: string): T | undefined {
  const source = serverData ?? (typeof window !== "undefined" ? window.__PRERENDER_DATA__ : undefined);
  return source?.[key] as T | undefined;
}

export const RECIPES_KEY = "recipes";
export const recipeKey = (slug: string) => `recipe:${slug}`;
