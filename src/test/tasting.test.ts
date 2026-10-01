import { describe, it, expect } from "vitest";
import { TASTING_TOUR, tastingTourLines } from "@/lib/tasting";

describe("calendrier des dégustations en main propre", () => {
  it("couvre Avignon et Provence, Chamonix et Mont-Blanc, puis la Maurienne", () => {
    expect(TASTING_TOUR.map((s) => s.id)).toEqual(["provence", "mont-blanc", "maurienne"]);
    expect(TASTING_TOUR[0].period.fr).toContain("7 novembre 2026");
    expect(TASTING_TOUR[1].period.fr).toContain("8 novembre 2026");
    expect(TASTING_TOUR[2].places?.fr).toBe("Val Cenis, Valloire");
    expect(TASTING_TOUR[2].period.fr).toContain("décembre");
  });

  it("les périodes se suivent sans chevauchement", () => {
    expect(TASTING_TOUR[0].to).toBe("2026-11-07");
    expect(TASTING_TOUR[1].from).toBe("2026-11-08");
    expect(TASTING_TOUR[2].from! > TASTING_TOUR[1].from!).toBe(true);
  });

  it("chaque zone a un libellé FR et EN", () => {
    for (const locale of ["fr", "en"] as const) {
      const lines = tastingTourLines(locale);
      expect(lines).toHaveLength(TASTING_TOUR.length);
      for (const line of lines) expect(line.length).toBeGreaterThan(10);
    }
  });
});
