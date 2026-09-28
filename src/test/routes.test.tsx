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

describe("pages de retour Stripe", () => {
  it("/paiement-annule : traduite, rassure et renvoie vers les produits et l'offre pro", async () => {
    await renderAt("/paiement-annule", "en");
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Payment cancelled");
    expect(screen.getByText(/You have not been charged/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to products" })).toHaveAttribute("href", "/produits");
    expect(screen.getByRole("link", { name: "trade prices and quotes" })).toHaveAttribute("href", "/professionnels");
  });

  it("/paiement-reussi : un client sans compte n'est pas envoyé vers /profil", async () => {
    await renderAt("/paiement-reussi", "fr");
    expect(await screen.findByRole("link", { name: "Continuer mes achats" })).toHaveAttribute("href", "/produits");
    expect(screen.queryByRole("link", { name: "Voir ma commande" })).toBeNull();
  });
});
