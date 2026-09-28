import { describe, it, expect } from "vitest";
import { products, getVacuumMorelPrice } from "@/lib/products";
import { PRO_TIERS } from "@/lib/proPricing";
import { fr } from "@/i18n/fr";
import { absoluteUrl, SITE_URL } from "@/lib/seo/site";
import {
  breadcrumbSchema,
  faqPageSchema,
  lowestProPricePerKg,
  organizationSchema,
  productOffers,
  productSchema,
  proOfferSchema,
  recipeSchema,
  serializeJsonLd,
  websiteSchema,
} from "@/lib/seo/schema";
import { productMetaDescription, productMetaTitle } from "@/lib/seo/meta";
import { PRODUCT_ROUTES, STATIC_ROUTES } from "@/lib/seo/routes";
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

describe("JSON-LD produits", () => {
  it("reprend les prix de src/lib/products.ts", () => {
    for (const product of products) {
      const offers = productOffers(product) as unknown as Offer[];
      if (product.weightPriceIds) {
        expect(offers.map((o) => Number(o.price))).toEqual([100, 200, 500, 1000].map(getVacuumMorelPrice));
      } else {
        expect(offers).toHaveLength(1);
        expect(Number(offers[0].price)).toBe(product.price);
      }
      offers.forEach((o) => expect(o.priceCurrency).toBe("EUR"));
    }
  });

  it("pointe vers la page produit www", () => {
    const schema = productSchema(products[0], "desc");
    expect(schema.url).toBe(`${SITE_URL}/produits/${products[0].slug}`);
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
      ...products.map((p) => productSchema(p, "x")),
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
  it("calcule les durées ISO 8601 et liste les ingrédients", () => {
    const schema = recipeSchema({
      slug: "risotto",
      title: "Risotto aux morilles",
      description: "Un risotto.",
      chef_name: "Chef",
      prep_time: 20,
      cook_time: 25,
      servings: 4,
      image_url: null,
      ingredients: [{ quantity: "20", unit: "g", name: "morilles séchées" }],
      steps: [{ step: 1, title: "Réhydrater", description: "Tremper 20 min." }],
      tags: ["risotto"],
      created_at: "2026-03-01T10:00:00Z",
    });
    expect(schema).toMatchObject({ totalTime: "PT45M", recipeIngredient: ["20 g morilles séchées"], datePublished: "2026-03-01" });
    expect(schema).not.toHaveProperty("image");
  });
});

describe("sérialisation", () => {
  it("ne permet pas de fermer la balise script", () => {
    expect(serializeJsonLd({ name: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
});

describe("meta produits", () => {
  it("titres et descriptions de longueur raisonnable, avec le prix", () => {
    for (const product of products) {
      expect(productMetaTitle(product).length).toBeLessThanOrEqual(65);
      const description = productMetaDescription(product);
      expect(description.length).toBeLessThanOrEqual(170);
      if (!product.weightPriceIds) expect(description).toContain(`${product.price}`);
    }
  });
});

describe("routes du sitemap", () => {
  it("ne contiennent aucune page noindex ni doublon", () => {
    const paths = [...STATIC_ROUTES, ...PRODUCT_ROUTES].map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
    paths.forEach((p) => expect(isNoindexPath(p)).toBe(false));
  });

  it("marque les pages privées en noindex", () => {
    ["/admin", "/auth", "/profil", "/paiement-reussi", "/paiement-annule", "/reset-password"].forEach((p) =>
      expect(isNoindexPath(p)).toBe(true),
    );
    expect(isNoindexPath("/professionnels")).toBe(false);
  });
});
