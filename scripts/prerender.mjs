// Prérendu HTML statique des routes publiques, lancé par `npm run build` après `vite build`.
//
// 1. Build SSR de src/entry-server.tsx (dist-ssr/, supprimé à la fin).
// 2. Rendu React de chaque route publique → dist/<route>/index.html, avec title, meta,
//    canonical, Open Graph et JSON-LD dans le <head>. Le client hydrate ce HTML (src/main.tsx).
// 3. dist/spa.html : coquille vide pour les routes non prérendues (vercel.json la sert en repli).
// 4. dist/sitemap.xml et dist/robots.txt générés depuis src/lib/seo.
//
// Les recettes viennent de Supabase : si VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY sont
// définies au build (Vercel), elles sont prérendues et ajoutées au sitemap ; sinon elles restent
// rendues côté client.
import { build, loadEnv } from "vite";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const distDir = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");
const today = new Date().toISOString().slice(0, 10);

const env = { ...loadEnv("production", root, "VITE_"), ...process.env };
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Le rendu serveur n'appelle jamais Supabase (les requêtes sont dans des useEffect), mais
// createClient() exige une URL valide au chargement du module.
if (!supabaseUrl) process.env.VITE_SUPABASE_URL = "https://prerender.supabase.co";
if (!supabaseKey) process.env.VITE_SUPABASE_PUBLISHABLE_KEY = "prerender";

// API navigateur minimale utilisée au chargement des modules (client Supabase, panier, langue).
function memoryStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    key: (i) => [...store.keys()][i] ?? null,
    get length() {
      return store.size;
    },
  };
}
for (const name of ["localStorage", "sessionStorage"]) {
  Object.defineProperty(globalThis, name, { value: memoryStorage(), configurable: true, writable: true });
}

async function buildServerEntry() {
  await build({
    root,
    logLevel: "warn",
    // Tout est embarqué : évite les soucis d'interopérabilité CommonJS/ESM de certaines dépendances.
    ssr: { noExternal: true },
    build: {
      ssr: "src/entry-server.tsx",
      outDir: ssrDir,
      emptyOutDir: true,
      copyPublicDir: false,
      rollupOptions: { output: { entryFileNames: "entry-server.mjs" } },
    },
  });
  return import(pathToFileURL(path.join(ssrDir, "entry-server.mjs")).href);
}

async function fetchRecipes() {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("[prerender] Variables Supabase absentes : recettes non prérendues.");
    return [];
  }
  const headers = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` };
  const endpoints = ["recipes?select=*&order=sort_order.asc", "recipes?select=*&order=created_at.asc"];
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, { headers, signal: AbortSignal.timeout(15000) });
      if (res.ok) {
        const rows = await res.json();
        return Array.isArray(rows) ? rows.filter((r) => typeof r?.slug === "string" && /^[a-z0-9-]+$/.test(r.slug)) : [];
      }
      console.warn(`[prerender] ${endpoint} : HTTP ${res.status}`);
    } catch (error) {
      console.warn(`[prerender] ${endpoint} : ${error.message}`);
    }
  }
  return [];
}

// Même sélection de colonnes que src/pages/Recettes.tsx.
const LIST_FIELDS = ["id", "slug", "title", "description", "chef_name", "chef_title", "difficulty", "prep_time", "cook_time", "servings", "image_url", "tags"];
const pick = (row, fields) => Object.fromEntries(fields.map((f) => [f, row[f] ?? null]));

function gitLastModified(sources) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...sources], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : today;
  } catch {
    return today;
  }
}

const escapeXml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const serializeData = (data) => JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

const APP_HTML = /<!--app-html-start-->[\s\S]*<!--app-html-end-->/;

function renderDocument(template, { html, helmet }, data) {
  if (!helmet) throw new Error("contexte Helmet vide");
  const head = [helmet.title, helmet.meta, helmet.link, helmet.script]
    .map((tags) => tags.toString().replace(/(\/?>)(?=<(title|meta|link|script)[\s>])/g, "$1\n    "))
    .filter(Boolean)
    .join("\n    ");
  const dataScript = data ? `\n    <script>window.__PRERENDER_DATA__=${serializeData(data)}</script>` : "";
  return template
    .replace(/\s*<!-- Titre par défaut[\s\S]*?-->/, "")
    .replace(/<title>[\s\S]*?<\/title>/, () => head + dataScript)
    .replace('<div id="root">', '<div id="root" data-prerendered>')
    .replace(APP_HTML, () => html);
}

// Garde-fous : un problème SEO sur une page publique fait échouer le build.
function checkPage(route, doc, siteUrl) {
  const expected = route === "/" ? `${siteUrl}/` : `${siteUrl}${route}`;
  const count = (re) => (doc.match(re) || []).length;
  const problems = [];
  if (count(/<title[\s>]/g) !== 1) problems.push("title absent ou en double");
  if (count(/<meta[^>]+name="description"/g) !== 1) problems.push("meta description absente ou en double");
  if (!doc.includes(`<link data-rh="true" rel="canonical" href="${expected}"/>`)) problems.push(`canonical ≠ ${expected}`);
  if (count(/<h1[\s>]/g) !== 1) problems.push(`${count(/<h1[\s>]/g)} balise(s) h1`);
  if (/name="robots" content="noindex/.test(doc)) problems.push("page publique en noindex");
  if (problems.length) throw new Error(`[prerender] ${route} : ${problems.join(", ")}`);
}

async function main() {
  // Relance sans `vite build` : dist/index.html est déjà prérendu, la coquille est dans spa.html.
  let template = await readFile(path.join(distDir, "index.html"), "utf8");
  if (!APP_HTML.test(template)) template = await readFile(path.join(distDir, "spa.html"), "utf8").catch(() => "");
  if (!APP_HTML.test(template)) throw new Error("index.html : marqueurs <!--app-html-start/end--> introuvables");
  await writeFile(path.join(distDir, "spa.html"), template);

  const server = await buildServerEntry();
  const recipes = await fetchRecipes();
  const listData = { [server.RECIPES_KEY]: recipes.map((r) => pick(r, LIST_FIELDS)) };

  const pages = [
    ...server.STATIC_ROUTES.map((route) => ({ route, data: route.path === "/recettes" && recipes.length ? listData : undefined })),
    ...server.PRODUCT_ROUTES.map((route) => ({ route })),
    ...recipes.map((recipe) => ({
      route: server.recipeRoute(recipe.slug),
      data: { [server.recipeKey(recipe.slug)]: recipe },
      lastmod: (recipe.updated_at || recipe.created_at || "").slice(0, 10) || undefined,
    })),
  ];

  const sitemap = [];
  for (const { route, data, lastmod } of pages) {
    const doc = renderDocument(template, await server.render(route.path, data), data);
    checkPage(route.path, doc, server.SITE_URL);
    const file = route.path === "/" ? path.join(distDir, "index.html") : path.join(distDir, route.path, "index.html");
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, doc);
    sitemap.push({
      loc: route.path === "/" ? `${server.SITE_URL}/` : `${server.SITE_URL}${route.path}`,
      lastmod: lastmod || gitLastModified(route.sources),
      changefreq: route.changefreq,
      priority: route.priority.toFixed(1),
    });
    console.log(`[prerender] ${route.path}`);
  }

  const sitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemap.map(
      (u) =>
        `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    ),
    "</urlset>",
    "",
  ].join("\n");
  await writeFile(path.join(distDir, "sitemap.xml"), sitemapXml);

  const robots = [
    "User-agent: *",
    "Allow: /",
    ...server.NOINDEX_PREFIXES.map((prefix) => `Disallow: ${prefix}`),
    "",
    `Sitemap: ${server.SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");
  await writeFile(path.join(distDir, "robots.txt"), robots);

  console.log(`[prerender] ${pages.length} pages, sitemap.xml (${sitemap.length} URL), robots.txt`);
}

try {
  await main();
} finally {
  await rm(ssrDir, { recursive: true, force: true });
}
