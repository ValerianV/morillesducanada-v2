import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fr } from "@/i18n/fr";
import { en } from "@/i18n/en";
import { buildLlmsFullTxt, buildLlmsTxt } from "@/lib/seo/llms";
import { ARTICLES } from "@/lib/seo/articles";

// Garde-fou éditorial : faits autorisés par le fondateur uniquement, sans affirmation invérifiable.
const FORBIDDEN = [
  /frère|brother/i,
  // Expédition : sous 5 jours ouvrés, jamais en 24/48 h (la réponse aux devis sous 48 h ouvrées est autorisée).
  /(exp[ée]di\w*|livr\w*|ship\w*|dispatch\w*)[^."]{0,40}(24|48|72) ?h/i,
  /\b24 ?h|24 hours/i,
  // Audit PM du 2026-09-28 : affirmations non validées par le fondateur.
  /fumé|smok/i,
  /triplent|triple in volume|×\s?[35]\b/i,
  /fruits à coque|tree nuts|valeurs nutritionnelles|nutritional values|PA\/PE|péremption/i,
  /origine traçable|qualité constante|stock constant/i,
  /or liquide|huile de truffe|truffle oil/i,
  /Colombie-Britannique & Yukon, Canada → France/,
  /Chine|chinois|China|Chinese/i,
  /monopole|monopoly|grossiste|wholesaler/i,
  /le soir même|same evening/i,
  /douane|customs/i,
  // Avignon n'est autorisé que pour le tribunal compétent des CGV (« ressort d'Avignon ») et pour la zone
  // de dégustation « Avignon et Provence » (décision du fondateur, 2026-10-01).
  /(?<!ressort d')Avignon(?! et Provence| and Provence)|Piolenc/i,
  /lot identifi|identified batch|traçabilité totale|full traceability/i,
];

const sources = [
  ["fr.ts", JSON.stringify(fr)],
  ["en.ts", JSON.stringify(en)],
  ...[
    "src/pages/PlaquettePro.tsx",
    "src/pages/GuideMorellesDeFeu.tsx",
    "src/pages/FicheTechnique.tsx",
    "src/pages/CGV.tsx",
    "src/pages/Livraison.tsx",
    "src/components/ContactSection.tsx",
  ].map(
    (path) => [path, readFileSync(path, "utf8")],
  ),
  ["llms.txt (généré)", buildLlmsTxt()],
  ["llms-full.txt (généré)", buildLlmsFullTxt()],
  ...ARTICLES.map((a) => [`${a.path} (page de contenu)`, JSON.stringify(a)] as const),
] as const;

describe("récit de marque", () => {
  it.each(sources)("%s ne contient aucune affirmation retirée", (_name, text) => {
    for (const pattern of FORBIDDEN) expect(text).not.toMatch(pattern);
  });

  it("raconte les trois saisons de Valérian en Colombie-Britannique et au Yukon", () => {
    const about = JSON.stringify(fr.about);
    expect(about).toContain("2022, 2023 et 2024");
    expect(about).toContain("Colombie-Britannique et au Yukon");
    expect(about).toContain("réseau de cueilleurs");
  });

  it("explique « Sauvage ou cultivée ? » sans nommer de pays", () => {
    expect(fr.wildVsCultivated.title).toBe("Sauvage ou cultivée\u00a0?");
    expect(fr.wildVsCultivated.cultivated.join(" ")).toContain("en serre ou en plein champ");
    expect(en.wildVsCultivated.wild.length).toBe(fr.wildVsCultivated.wild.length);
  });
});
