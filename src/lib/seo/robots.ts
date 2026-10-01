// robots.txt généré au build (scripts/prerender.mjs). Les robots des moteurs de recherche et des IA
// sont autorisés explicitement : un robot qui a son propre groupe ignore le groupe « * », les
// Disallow (admin, auth, paiement…) sont donc répétés dans chaque groupe.
// Rôle de chaque robot : docs/marketing/seo-geo.md.
export const SEARCH_AND_AI_BOTS = [
  // Moteurs de recherche
  "Googlebot",
  "Bingbot",
  // OpenAI : entraînement, recherche ChatGPT, requête d'un utilisateur
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic : entraînement, recherche Claude, requête d'un utilisateur
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  // Perplexity : index de recherche, requête d'un utilisateur
  "PerplexityBot",
  "Perplexity-User",
  // Jetons de contrôle (usage par les IA de Google et d'Apple)
  "Google-Extended",
  "Applebot-Extended",
] as const;

export function buildRobotsTxt(siteUrl: string, disallowPrefixes: readonly string[]): string {
  const rules = ["Allow: /", ...disallowPrefixes.map((prefix) => `Disallow: ${prefix}`)];
  return [
    "# Moteurs de recherche et robots d'IA autorisés explicitement (voir docs/marketing/seo-geo.md).",
    ...SEARCH_AND_AI_BOTS.map((bot) => `User-agent: ${bot}`),
    ...rules,
    "",
    "User-agent: *",
    ...rules,
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
}
