import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { PRO_TIERS, formatTierPrice } from "@/lib/proPricing";
import { fr } from "@/i18n/fr";
import { ARTICLES } from "@/lib/seo/articles";
import { buildLlmsFullTxt, buildLlmsTxt, plainText } from "@/lib/seo/llms";
import { buildRobotsTxt, SEARCH_AND_AI_BOTS } from "@/lib/seo/robots";
import { NOINDEX_PREFIXES } from "@/lib/seo/noindex";
import { STATIC_ROUTES } from "@/lib/seo/routes";
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH, OFFER_LAST_REVIEWED, SITE_URL } from "@/lib/seo/site";
import { articleSchema, founderPerson, organizationSchema, proOfferSchema, webPageSchema } from "@/lib/seo/schema";

describe("robots.txt", () => {
  const robots = buildRobotsTxt(SITE_URL, NOINDEX_PREFIXES);

  it("autorise explicitement les robots des moteurs et des IA", () => {
    for (const bot of [
      "Googlebot", "Bingbot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot",
      "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended",
    ]) {
      expect(SEARCH_AND_AI_BOTS).toContain(bot);
      expect(robots).toContain(`User-agent: ${bot}`);
    }
  });

  it("garde les Disallow existants dans chaque groupe et déclare le sitemap", () => {
    const groups = robots.split(/\n\n/).filter((g) => /User-agent:/.test(g));
    expect(groups).toHaveLength(2);
    for (const group of groups) {
      expect(group).toContain("Allow: /");
      for (const prefix of NOINDEX_PREFIXES) expect(group).toContain(`Disallow: ${prefix}`);
    }
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
    expect(robots).toContain("Disallow: /admin");
    expect(robots).toContain("Disallow: /auth");
  });
});

describe("llms.txt et llms-full.txt", () => {
  const short = buildLlmsTxt();
  const full = buildLlmsFullTxt();

  it("suivent le format llmstxt.org : H1, citation, puis sections H2 de liens", () => {
    expect(short.startsWith("# Morilles du Canada\n\n> ")).toBe(true);
    expect(short).toMatch(/\n## Offre et commande\n/);
    expect(short).toMatch(/- \[[^\]]+\]\(https:\/\/www\.morillesducanada\.com\/[^)]*\): /);
    expect(short).toContain("## Optional");
  });

  it("donnent la grille au kilo, la mention fiscale, le stock et les conditions", () => {
    for (const text of [short, full]) {
      for (const tier of PRO_TIERS) expect(text).toContain(formatTierPrice(tier));
      expect(text).toContain("TVA non applicable, art. 293 B du CGI");
      expect(text).toContain("professionnels uniquement");
      expect(text).toContain("France uniquement");
      expect(text).toContain("5 jours ouvrés");
      expect(text).toContain("sachets sous vide de 250 g");
      expect(text).toContain("Valérian Vilane");
      expect(text).toContain("2022, 2023 et 2024");
    }
  });

  it("indiquent les zones et dates de dégustation du calendrier", () => {
    for (const text of [short, full]) {
      expect(text).toContain("Avignon et Provence : jusqu'au 7 novembre 2026");
      expect(text).toContain("Chamonix et Mont-Blanc : à partir du 8 novembre 2026");
      expect(text).toContain("Maurienne (Val Cenis, Valloire) : en décembre 2026");
      expect(text).toContain("au cas par cas");
    }
  });

  it("n'ont que des URLs absolues du site et reprennent chaque page de contenu", () => {
    for (const text of [short, full]) {
      expect(text).not.toMatch(/\]\(\//);
      expect(text).not.toMatch(/\]\(\)/);
      for (const a of ARTICLES) expect(text).toContain(`${SITE_URL}${a.path}`);
    }
    for (const a of ARTICLES) for (const s of a.sections) expect(full).toContain(`### ${s.q}`);
  });

  it("transforme les liens internes en URLs absolues", () => {
    expect(plainText("Voir [Professionnels](/professionnels#commander) et **gras**.")).toBe(
      `Voir Professionnels (${SITE_URL}/professionnels#commander) et gras.`,
    );
  });

  it("ne mentionnent jamais d'envoi gratuit sur simple demande", () => {
    for (const text of [short, full]) expect(text).not.toMatch(/envoi gratuit|recevoir un échantillon|sample sent/i);
  });
});

describe("pages de contenu", () => {
  const knownPaths = new Set(STATIC_ROUTES.map((r) => r.path));
  const linksIn = (text: string) => [...text.matchAll(/\]\((\/[^)#]*)(?:#[^)]*)?\)/g)].map((m) => m[1]);

  it("ont chacune un chemin unique, dans le sitemap, avec lastmod = dateModified", () => {
    expect(ARTICLES.length).toBeGreaterThanOrEqual(4);
    expect(new Set(ARTICLES.map((a) => a.path)).size).toBe(ARTICLES.length);
    for (const article of ARTICLES) {
      const route = STATIC_ROUTES.find((r) => r.path === article.path);
      expect(route?.lastmod).toBe(article.dateModified);
      expect(article.dateModified >= article.datePublished).toBe(true);
      expect(article.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("répondent d'abord : réponse directe courte en tête de chaque section, titres sans doublon", () => {
    for (const article of ARTICLES) {
      expect(article.h1.length).toBeGreaterThan(10);
      expect(article.metaDescription.length).toBeLessThanOrEqual(240);
      expect(new Set(article.sections.map((s) => s.id)).size).toBe(article.sections.length);
      for (const section of article.sections) {
        const words = plainText(section.answer).split(/\s+/).length;
        expect(words, `${article.path} #${section.id}`).toBeGreaterThanOrEqual(10);
        expect(words, `${article.path} #${section.id}`).toBeLessThanOrEqual(80);
        expect(section.q.endsWith("?")).toBe(true);
      }
    }
  });

  it("ne mènent qu'à des pages existantes, et renvoient vers /professionnels", () => {
    for (const article of ARTICLES) {
      const text = JSON.stringify(article);
      for (const link of [...linksIn(text), ...article.related]) expect(knownPaths.has(link), `${article.path} → ${link}`).toBe(true);
      expect(text).toContain("](/professionnels");
    }
  });

  it("citent les prix de la grille, sans les recopier à la main", () => {
    const price = ARTICLES.find((a) => a.path === "/prix-morilles-sechees-kilo-professionnels")!;
    const text = JSON.stringify(price);
    for (const tier of PRO_TIERS) expect(text).toContain(formatTierPrice(tier));
    expect(text).toContain("TVA non applicable, art. 293 B du CGI");
  });

  it("ne citent des chiffres de marché qu'avec leur source", () => {
    const price = JSON.stringify(ARTICLES.find((a) => a.path === "/prix-morilles-sechees-kilo-professionnels"));
    expect(price).toContain("155 à 260");
    expect(price).toContain("septembre 2026");
    expect(price).toContain("dossier de marché");
    for (const a of ARTICLES.filter((x) => x.path !== "/prix-morilles-sechees-kilo-professionnels")) {
      expect(JSON.stringify(a)).not.toMatch(/155|267|470 €|1 000 €\/kg/);
    }
  });

  it("n'ont aucune répétition de la mention fiscale", () => {
    for (const text of [JSON.stringify(ARTICLES), buildLlmsTxt(), buildLlmsFullTxt()]) {
      expect(text).not.toMatch(/Prix nets[^.]{0,12}Prix nets/);
    }
  });

  it("ne dénigrent aucun concurrent nominativement ni ne promettent l'impossible", () => {
    const all = JSON.stringify(ARTICLES);
    expect(all).not.toMatch(/Plantin|Sabarot|Borde|Adler|Gina|Chef Morel|Maison Masse|Ankorstore|Metro|Terres/i);
    expect(all).not.toMatch(/meilleur|le moins cher|unique au monde|exceptionnel|fumé/i);
  });
});

describe("pages ajoutées en octobre 2026", () => {
  const short = buildLlmsTxt();
  const full = buildLlmsFullTxt();

  it("titres ≤ 60 caractères et descriptions ≤ 155 pour toutes les pages de contenu, sans stock chiffré", () => {
    for (const a of ARTICLES) {
      expect(a.metaTitle.length, a.metaTitle).toBeLessThanOrEqual(MAX_TITLE_LENGTH);
      expect(a.metaDescription.length, a.metaDescription).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
      expect(a.metaDescription).not.toMatch(/45 kg/);
    }
  });

  it("la page traiteurs reprend la grille, les sachets de 250 g, la dose par couvert et les règles de l'échantillon", () => {
    const article = ARTICLES.find((a) => a.path === "/morilles-sechees-traiteurs")!;
    expect(article).toBeDefined();
    const text = JSON.stringify(article);
    for (const tier of PRO_TIERS) expect(text).toContain(formatTierPrice(tier));
    expect(text).toContain("TVA non applicable, art. 293 B du CGI");
    expect(text).toContain("sachets sous vide de 250 g");
    expect(text).toContain("5 à 8 g");
    expect(text).toContain("5 jours ouvrés");
    expect(text).toContain("port inclus");
    expect(text).toContain("en main propre");
    expect(text).toContain("](/zones-de-passage)");
    expect(article.sections.length).toBeGreaterThanOrEqual(5);
    expect(STATIC_ROUTES.find((r) => r.path === article.path)?.lastmod).toBe(article.dateModified);
  });

  it("llms.txt et llms-full.txt listent les trois pages, sans « recettes de chefs »", () => {
    for (const text of [short, full]) {
      for (const p of ["/morilles-sechees-traiteurs", "/valerian-vilane", "/zones-de-passage"]) expect(text).toContain(`${SITE_URL}${p}`);
      expect(text).not.toMatch(/recettes de chefs/i);
    }
    expect(short).toContain("## Qui et où");
  });

  it("aucune page ne nomme de partenaire ni ne cite de prix plancher", () => {
    expect(`${short}${full}`).not.toMatch(/plancher|cueilleurs? partenaires?/i);
  });
});

describe("données structurées GEO", () => {
  it("Article : auteur Person (fondateur, ancien cueilleur), éditeur Organization, dates", () => {
    const a = ARTICLES[0];
    const schema = articleSchema({
      path: a.path,
      headline: a.h1,
      description: a.metaDescription,
      datePublished: a.datePublished,
      dateModified: a.dateModified,
    }) as {
      "@type": string;
      author: { "@type": string; name: string; description: string; jobTitle: string };
      publisher: { "@type": string };
      datePublished: string;
      dateModified: string;
    };
    expect(schema["@type"]).toBe("Article");
    expect(schema.author["@type"]).toBe("Person");
    expect(schema.author.name).toBe("Valérian Vilane");
    expect(schema.author.jobTitle).toBe("Fondateur de Morilles du Canada");
    expect(schema.author.description).toContain("2022 à 2024");
    expect(schema.author.description).toContain("Colombie-Britannique et au Yukon");
    expect(schema.publisher["@type"]).toBe("Organization");
    expect(schema.datePublished).toBe(a.datePublished);
    expect(schema.dateModified).toBe(a.dateModified);
  });

  it("Organization : founder, areaServed France, knowsAbout, sameAs absent tant qu'aucune URL réelle", () => {
    const org = organizationSchema() as Record<string, unknown>;
    expect(org.founder).toMatchObject({ "@type": "Person", name: "Valérian Vilane" });
    expect(org.areaServed).toMatchObject({ name: "France" });
    expect(org.knowsAbout).toEqual(expect.arrayContaining(["Morilles de feu", "Morilles séchées"]));
    expect(org).not.toHaveProperty("sameAs");
    expect(founderPerson()["@id"]).toBe(`${SITE_URL}/#valerian-vilane`);
  });

  it("Offer : UnitPriceSpecification au kilo, sans TVA, livraison gratuite en France", () => {
    const offers = proOfferSchema().offers as {
      priceSpecification: {
        "@type": string;
        unitCode: string;
        valueAddedTaxIncluded: boolean;
        referenceQuantity: { value: number; unitCode: string };
      };
      shippingDetails: { shippingRate: { value: number }; shippingDestination: { addressCountry: string } };
    }[];
    for (const offer of offers) {
      expect(offer.priceSpecification["@type"]).toBe("UnitPriceSpecification");
      expect(offer.priceSpecification.unitCode).toBe("KGM");
      expect(offer.priceSpecification.valueAddedTaxIncluded).toBe(false);
      expect(offer.priceSpecification.referenceQuantity).toEqual({ "@type": "QuantitativeValue", value: 1, unitCode: "KGM" });
      expect(offer.shippingDetails.shippingRate.value).toBe(0);
      expect(offer.shippingDetails.shippingDestination.addressCountry).toBe("FR");
    }
  });

  it("WebPage : dateModified de la dernière vérification de l'offre", () => {
    expect(OFFER_LAST_REVIEWED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const page = webPageSchema({ path: "/professionnels", name: "x", description: "y", dateModified: OFFER_LAST_REVIEWED });
    expect(page.dateModified).toBe(OFFER_LAST_REVIEWED);
    expect(page["@type"]).toBe("WebPage");
  });

  it("FAQ des professionnels enrichie : prix de la grille, origine, livraison, précommande, dégustation", () => {
    const text = JSON.stringify(fr.pro.faq.items);
    expect(fr.pro.faq.items.length).toBeGreaterThanOrEqual(14);
    for (const tier of PRO_TIERS) expect(text).toContain(`${tier.priceCents / 100} €/kg`);
    expect(text).toContain("Où acheter des morilles séchées");
    expect(text).toContain("Livrez-vous hors de France");
    expect(text).toContain("au cas par cas");
  });
});

describe("IndexNow", () => {
  it("un seul fichier de clé dans public/, dont le contenu est la clé", () => {
    const keyFiles = readdirSync("public").filter((f) => /^[a-f0-9]{32}\.txt$/.test(f));
    expect(keyFiles).toHaveLength(1);
    expect(readFileSync(`public/${keyFiles[0]}`, "utf8").trim()).toBe(keyFiles[0].replace(".txt", ""));
  });
});
