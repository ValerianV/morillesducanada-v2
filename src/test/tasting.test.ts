import { describe, it, expect } from "vitest";
import { TASTING_TOUR, tastingTourLines } from "@/lib/tasting";

describe("calendrier des dégustations en main propre", () => {
  it("Maurienne en décembre, puis stations des Alpes sans dates fixes (2026-11-26)", () => {
    expect(TASTING_TOUR.map((s) => s.id)).toEqual(["maurienne", "alpes"]);
    expect(TASTING_TOUR[0].period.fr).toBe("en décembre 2026");
    expect(TASTING_TOUR[1].period.fr).toContain("sans dates fixes");
    expect(TASTING_TOUR[1].from! > TASTING_TOUR[0].to!).toBe(true);
  });

  it("ne promet plus Chamonix", () => {
    const all = [...tastingTourLines("fr"), ...tastingTourLines("en")].join(" ");
    expect(all).not.toMatch(/Chamonix|Mont-Blanc|novembre|November/);
  });

  it("chaque zone a un libellé FR et EN", () => {
    for (const locale of ["fr", "en"] as const) {
      const lines = tastingTourLines(locale);
      expect(lines).toHaveLength(TASTING_TOUR.length);
      for (const line of lines) expect(line.length).toBeGreaterThan(10);
    }
  });
});
