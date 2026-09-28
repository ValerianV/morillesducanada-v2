import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nProvider } from "@/i18n/context";
import { installBrowserStubs, supabaseModule } from "./qaHarness";

vi.mock("@/integrations/supabase/client", () => supabaseModule);

import { CartDrawer } from "@/components/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { products } from "@/lib/products";

const byId = (id: string) => products.find((p) => p.id === id)!;
const plain = (s: string | null | undefined) => (s ?? "").replace(/\s/g, " ");

function openCart() {
  render(
    <I18nProvider>
      <MemoryRouter>
        <CartDrawer />
      </MemoryRouter>
    </I18nProvider>,
  );
  fireEvent.click(screen.getByRole("button"));
  return screen.getByRole("dialog");
}

beforeEach(() => {
  installBrowserStubs();
  localStorage.clear();
  useCartStore.setState({ items: [] });
});
afterEach(() => cleanup());

describe("panier : frais de port alignés sur create-checkout", () => {
  it("facture 6,90 € sous 50 € et l'affiche dans le total", () => {
    act(() => useCartStore.getState().addItem(byId("morilles-30g"), 2));
    const dialog = openCart();
    const text = plain(dialog.textContent);
    expect(text).toContain("Sous-total46.00 €");
    expect(text).toContain("Livraison6.90 €");
    expect(text).toContain("Total52.90 €");
    expect(text).toContain("4.00 € restants");
  });

  it("offre la livraison dès 50 € (et pas seulement dès 80 €)", () => {
    act(() => {
      useCartStore.getState().addItem(byId("morilles-30g"));
      useCartStore.getState().addItem(byId("morilles-45g"));
    });
    const dialog = openCart();
    const text = plain(dialog.textContent);
    expect(within(dialog).getAllByText("Livraison offerte").length).toBeGreaterThan(0);
    expect(text).toContain("Total52.00 €");
    expect(text).not.toContain("restants");
  });
});
