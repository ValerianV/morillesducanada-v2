import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fr } from "@/i18n/fr";
import { en } from "@/i18n/en";

// Garde-fou éditorial : faits autorisés par le fondateur uniquement, sans affirmation invérifiable.
const FORBIDDEN = [
  /frère|brother/i,
  /\b24 ?h|24 hours|48 ?h/i,
  /Chine|chinois|China|Chinese/i,
  /monopole|monopoly|grossiste|wholesaler/i,
  /le soir même|same evening/i,
  /douane|customs/i,
  /Avignon|Piolenc/i,
  /lot identifi|identified batch|traçabilité totale|full traceability/i,
];

const sources = [
  ["fr.ts", JSON.stringify(fr)],
  ["en.ts", JSON.stringify(en)],
  ...["src/pages/PlaquettePro.tsx", "src/pages/GuideMorellesDeFeu.tsx", "src/pages/FicheTechnique.tsx", "src/lib/productDetails.ts", "public/llms.txt"].map(
    (path) => [path, readFileSync(path, "utf8")],
  ),
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
