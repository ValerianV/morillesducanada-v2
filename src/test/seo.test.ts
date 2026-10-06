import { describe, it, expect } from "vitest";
import { PRO_TIERS } from "@/lib/proPricing";
import { fr } from "@/i18n/fr";
import { absoluteUrl, clipDescription, fitTitle, FOUNDER_PATH, MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH, SITE_URL } from "@/lib/seo/site";
import {
  breadcrumbSchema,
  faqPageSchema,
  founderPerson,
  lowestProPricePerKg,
  organizationSchema,
  preorderSchema,
  profilePageSchema,
  proOfferSchema,
  recipeSchema,
  serializeJsonLd,
  websiteSchema,
} from "@/lib/seo/schema";
import { STATIC_ROUTES } from "@/lib/seo/routes";
import { isNoindexPath } from "@/lib/seo/noindex";

type Offer = { price: string; priceCurrency: string; eligibleCustomerType?: string; priceSpecification?: { price: string } };

describe("URLs canoniques", () => {
  it("utilisent le domaine www, sans slash final", () => {
    expect(SITE_URL).toBe("https://www.morillesducanada.com");
    expect(absoluteUrl("/")).toBe("https://www.morillesducanada.com/");
    expect(absoluteUrl("/professionnels/")).toBe("https://www.morillesducanada.com/professionnels");
    expect(absoluteUrl("https://cdn.example.com/a.jpg")).toBe("https://cdn.example.com/a.jpg");
  });
});

describe("site réservé aux professionnels", () => {
  it("n'a plus d'offre de détail : seulement l'offre au kilo et la précommande, pour les entreprises", () => {
    const pro = proOfferSchema() as { offers: Offer[]; description: string };
    const pre = preorderSchema() as { offers: Offer; description: string };
    pro.offers.forEach((o) => expect(o.eligibleCustomerType).toContain("Business"));
    expect(pre.offers.eligibleCustomerType).toContain("Business");
    expect(pro.description).toContain("réservée aux professionnels");
    expect(pre.description).toContain("Réservée aux professionnels");
    expect(JSON.stringify(organizationSchema())).toContain("réservée aux professionnels");
  });

  it("ne liste plus /produits dans le sitemap", () => {
    expect(STATIC_ROUTES.map((r) => r.path).some((p) => p.startsWith("/produits"))).toBe(false);
  });
});

describe("JSON-LD offre pro au kilo", () => {
  const schema = proOfferSchema();
  const offers = schema.offers as Offer[];

  it("a une offre par palier de proPricing, aux mêmes prix", () => {
    expect(offers).toHaveLength(PRO_TIERS.length);
    offers.forEach((offer, i) => {
      expect(Number(offer.price) * 100).toBe(PRO_TIERS[i].priceCents);
      expect(offer.priceSpecification?.price).toBe(offer.price);
      expect(offer.eligibleCustomerType).toContain("Business");
    });
  });

  it("commence à 1 kg, sans offre pro à 500 g", () => {
    const eligible = (schema.offers as { eligibleQuantity: { minValue: number; maxValue: number } }[]).map((o) => [
      o.eligibleQuantity.minValue,
      o.eligibleQuantity.maxValue,
    ]);
    expect(eligible).toEqual([
      [1, 2.5],
      [3, 4.5],
      [5, 9.5],
      [10, 45],
    ]);
    expect(offers.map((o) => Number(o.price))).toEqual([350, 330, 310, 290]);
  });

  it("annonce le plus bas prix au kilo de la grille", () => {
    expect(lowestProPricePerKg()).toBe(290);
  });
});

describe("aucune note ni avis inventés", () => {
  it("n'expose ni AggregateRating ni Review", () => {
    const all = JSON.stringify([
      organizationSchema(),
      websiteSchema(),
      proOfferSchema(),
      preorderSchema(),
    ]);
    expect(all).not.toMatch(/aggregateRating|"review"|Rating/i);
  });
});

describe("FAQPage et fil d'Ariane", () => {
  it("reprend exactement la FAQ affichée", () => {
    const schema = faqPageSchema(fr.pro.faq.items) as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(schema.mainEntity.map((q) => q.name)).toEqual(fr.pro.faq.items.map((i) => i.q));
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe(fr.pro.faq.items[0].a);
  });

  it("commence par l'accueil", () => {
    const schema = breadcrumbSchema([{ name: "Produits", path: "/produits" }]) as { itemListElement: { position: number; item: string }[] };
    expect(schema.itemListElement.map((i) => i.item)).toEqual([`${SITE_URL}/`, `${SITE_URL}/produits`]);
  });
});

describe("Recipe", () => {
  const base = {
    slug: "risotto",
    title: "Risotto aux morilles",
    description: "Un risotto.",
    chef_name: "Chef",
    prep_time: 20,
    cook_time: 25,
    servings: 4,
    ingredients: [{ quantity: "20", unit: "g", name: "morilles séchées" }],
    steps: [{ step: 1, title: "Réhydrater", description: "Tremper 20 min." }],
    tags: ["risotto"],
    created_at: "2026-03-01T10:00:00Z",
  };

  it("n'émet aucun JSON-LD Recipe sans image (Google l'exige, la page doit la montrer)", () => {
    expect(recipeSchema({ ...base, image_url: null })).toBeNull();
    expect(recipeSchema({ ...base, image_url: "" })).toBeNull();
  });

  it("calcule les durées ISO 8601, liste les ingrédients et porte l'image en URL absolue", () => {
    const schema = recipeSchema({
      slug: "risotto",
      title: "Risotto aux morilles",
      description: "Un risotto.",
      chef_name: "Chef",
      prep_time: 20,
      cook_time: 25,
      servings: 4,
      image_url: "/images/risotto.webp",
      ingredients: [{ quantity: "20", unit: "g", name: "morilles séchées" }],
      steps: [{ step: 1, title: "Réhydrater", description: "Tremper 20 min." }],
      tags: ["risotto"],
      created_at: "2026-03-01T10:00:00Z",
    });
    expect(schema).toMatchObject({
      totalTime: "PT45M",
      recipeIngredient: ["20 g morilles séchées"],
      datePublished: "2026-03-01",
      image: [`${SITE_URL}/images/risotto.webp`],
    });
  });
});

describe("titres et descriptions", () => {
  it("fitTitle n'ajoute la marque que si le titre reste sous la limite", () => {
    expect(fitTitle("Mentions légales")).toBe("Mentions légales | Morilles du Canada");
    const long = "Prix des morilles séchées au kilo pour les professionnels";
    expect(fitTitle(long)).toBe(long);
    expect(fitTitle("x".repeat(39)).length).toBeLessThanOrEqual(MAX_TITLE_LENGTH);
  });

  it("clipDescription coupe au dernier mot entier et reste sous la limite", () => {
    const text = "morille ".repeat(40).trim();
    const clipped = clipDescription(text);
    expect(clipped.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
    expect(clipped.endsWith("…")).toBe(true);
    expect(clipDescription("Courte.")).toBe("Courte.");
  });
});

describe("page fondateur", () => {
  it("la Person pointe vers /valerian-vilane et la page déclare un ProfilePage dont elle est l'entité principale", () => {
    const person = founderPerson();
    expect(person.url).toBe(`${SITE_URL}${FOUNDER_PATH}`);
    expect(FOUNDER_PATH).toBe("/valerian-vilane");
    const page = profilePageSchema({ path: FOUNDER_PATH, name: "x", description: "y", dateModified: "2026-10-07" }) as {
      "@type": string;
      mainEntity: { "@type": string; "@id": string; name: string };
    };
    expect(page["@type"]).toBe("ProfilePage");
    expect(page.mainEntity).toMatchObject({ "@type": "Person", "@id": `${SITE_URL}/#valerian-vilane`, name: "Valérian Vilane" });
  });
});

describe("sérialisation", () => {
  it("ne permet pas de fermer la balise script", () => {
    expect(serializeJsonLd({ name: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
});

describe("routes du sitemap", () => {
  it("ne contiennent aucune page noindex ni doublon", () => {
    const paths = STATIC_ROUTES.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
    paths.forEach((p) => expect(isNoindexPath(p)).toBe(false));
  });

  it("listent les trois pages ajoutées en octobre 2026", () => {
    const paths = STATIC_ROUTES.map((r) => r.path);
    for (const p of ["/valerian-vilane", "/morilles-sechees-traiteurs", "/zones-de-passage"]) expect(paths).toContain(p);
  });

  it("marque les pages privées en noindex", () => {
    ["/admin", "/auth", "/profil", "/paiement-reussi", "/paiement-annule", "/reset-password", "/journal"].forEach((p) =>
      expect(isNoindexPath(p)).toBe(true),
    );
    expect(isNoindexPath("/professionnels")).toBe(false);
  });
});
