import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, screen } from "@testing-library/react";
import { installBrowserStubs, renderAt, supabaseModule } from "./qaHarness";

vi.mock("@/integrations/supabase/client", () => supabaseModule);

beforeEach(() => {
  installBrowserStubs();
  localStorage.clear();
});
afterEach(() => cleanup());

describe("page 404", () => {
  it("est traduite, garde la navigation et ne logue pas d'erreur console", async () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    await renderAt("/page-inexistante", "en");
    expect(await screen.findByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See our morels" })).toHaveAttribute("href", "/produits");
    expect(document.querySelector("nav")).not.toBeNull();
    expect(errors.mock.calls.filter((c) => String(c[0]).includes("404"))).toEqual([]);
    errors.mockRestore();
  });
});
