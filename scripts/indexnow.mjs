// Soumet les URLs du sitemap à IndexNow (Bing, Yandex, Naver, Seznam ; ChatGPT Search s'appuie sur Bing).
// À lancer APRÈS un déploiement en production, jamais avant : les moteurs viennent relire les pages.
//
//   node scripts/indexnow.mjs            # lit https://www.morillesducanada.com/sitemap.xml et soumet
//   node scripts/indexnow.mjs --dry-run  # affiche ce qui serait envoyé, sans rien envoyer
//   node scripts/indexnow.mjs --local    # lit dist/sitemap.xml (après `npm run build`) au lieu du site en ligne
//   node scripts/indexnow.mjs --urls /professionnels,/cgv   # soumet seulement ces chemins
//
// La clé IndexNow est publique par conception : le fichier public/<clé>.txt prouve la propriété du site.
// Voir docs/tech/deploiement.md (section « Après la mise en ligne »).
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const SITE = "https://www.morillesducanada.com";
const HOST = new URL(SITE).host;
const ENDPOINT = "https://api.indexnow.org/IndexNow";
const root = process.cwd();

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

// La clé est le nom du seul fichier public/<32 caractères hexadécimaux>.txt dont le contenu est la clé.
async function findKey() {
  const files = (await readdir(path.join(root, "public"))).filter((f) => /^[a-f0-9]{32}\.txt$/.test(f));
  if (files.length !== 1) throw new Error(`Une seule clé attendue dans public/ (trouvé : ${files.length}).`);
  const key = files[0].replace(/\.txt$/, "");
  const content = (await readFile(path.join(root, "public", files[0]), "utf8")).trim();
  if (content !== key) throw new Error(`public/${files[0]} doit contenir exactement la clé « ${key} ».`);
  return key;
}

async function sitemapUrls() {
  const xml = flag("--local")
    ? await readFile(path.join(root, "dist", "sitemap.xml"), "utf8")
    : await fetch(`${SITE}/sitemap.xml`, { signal: AbortSignal.timeout(20000) }).then((r) => {
        if (!r.ok) throw new Error(`sitemap.xml : HTTP ${r.status}`);
        return r.text();
      });
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const key = await findKey();
  const explicit = option("--urls");
  const urls = explicit
    ? explicit.split(",").map((p) => `${SITE}${p.trim().startsWith("/") ? "" : "/"}${p.trim()}`)
    : await sitemapUrls();

  const foreign = urls.filter((u) => new URL(u).host !== HOST);
  if (foreign.length > 0) throw new Error(`URL hors ${HOST} : ${foreign.join(", ")}`);
  if (urls.length === 0) throw new Error("Aucune URL à soumettre.");

  const body = { host: HOST, key, keyLocation: `${SITE}/${key}.txt`, urlList: urls };
  console.log(`[indexnow] ${urls.length} URL(s) pour ${HOST}`);
  for (const u of urls) console.log(`  ${u}`);

  if (flag("--dry-run")) {
    console.log(`[indexnow] --dry-run : rien envoyé (clé ${body.keyLocation}).`);
    return;
  }

  // Vérifie d'abord que le fichier de clé est en ligne : sans lui, IndexNow répond 403.
  const keyCheck = await fetch(body.keyLocation, { signal: AbortSignal.timeout(20000) });
  if (!keyCheck.ok || (await keyCheck.text()).trim() !== key) {
    throw new Error(`Fichier de clé introuvable en ligne (${body.keyLocation}) : déployez d'abord le site.`);
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  // 200 : reçu ; 202 : reçu, clé en cours de validation ; 400/403/422/429 : voir le runbook.
  console.log(`[indexnow] HTTP ${res.status} ${res.statusText}`);
  if (res.status !== 200 && res.status !== 202) {
    console.error((await res.text()).slice(0, 300));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`[indexnow] ${error.message}`);
  process.exitCode = 1;
});
