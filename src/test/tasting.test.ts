import { describe, it, expect } from "vitest";
import { TASTING_TOUR, tastingTourLines } from "@/lib/tasting";

describe("calendrier des dégustations en main propre", () => {
  it("stations des Alpes cet hiver, sans dates fixes ni stations précises (2026-11-26)", () => {
    expect(TASTING_TOUR.map((s) => s.id)).toEqual(["alpes"]);
    expect(TASTING_TOUR[0].period.fr).toContain("sans dates fixes");
    expect(TASTING_TOUR[0].places).toBeUndefined();
    expect(TASTING_TOUR[0].from).toBeNull();
    expect(TASTING_TOUR[0].to).toBeNull();
  });

  it("ne promet plus Chamonix ni la Maurienne", () => {
    const all = [...tastingTourLines("fr"), ...tastingTourLines("en")].join(" ");
    expect(all).not.toMatch(/Chamonix|Mont-Blanc|Maurienne|Val Cenis|Valloire|novembre|décembre|November|December/);
  });

  it("chaque zone a un libellé FR et EN", () => {
    for (const locale of ["fr", "en"] as const) {
      const lines = tastingTourLines(locale);
      expect(lines).toHaveLength(TASTING_TOUR.length);
      for (const line of lines) expect(line.length).toBeGreaterThan(10);
    }
  });
});
