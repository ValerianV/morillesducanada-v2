// Pages privées ou transactionnelles : noindex (meta + en-tête X-Robots-Tag dans vercel.json)
// et Disallow dans robots.txt. Module sans dépendance : importé par App (bundle initial).
export const NOINDEX_PREFIXES = [
  "/admin",
  "/auth",
  "/profil",
  "/reset-password",
  "/paiement-",
  "/precommande-confirmee",
] as const;

export function isNoindexPath(path: string): boolean {
  return NOINDEX_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix.endsWith("-") ? prefix : `${prefix}/`));
}
