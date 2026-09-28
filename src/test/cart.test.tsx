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

  it("est traduit en anglais, y compris le nom des produits et le grammage", () => {
    localStorage.setItem("locale", "en");
    act(() => useCartStore.getState().addItem(byId("morilles-sous-vide"), 1, { selectedWeightGrams: 1000, unitPriceOverride: 420 }));
    const dialog = openCart();
    const text = plain(dialog.textContent);
    expect(text).toContain("Your cart");
    expect(text).toContain("Vacuum-packed morels");
    expect(text).toContain("1 kg");
    expect(text).toContain("Subtotal420.00 €");
    expect(text).not.toMatch(/Panier|Livraison|Sous-total|Payer/);
  });
});

describe("panier persisté", () => {
  it("remplace la copie produit stockée par le catalogue courant (image, prix) et écarte les lignes invalides", async () => {
    const stale = {
      state: {
        items: [
          { id: "morilles-30g", product: { ...byId("morilles-30g"), image: "/assets/ancien-hash.webp", price: 1 }, quantity: 2, unitPrice: 1 },
          { id: "morilles-sous-vide-500", product: byId("morilles-sous-vide"), quantity: 1, selectedWeightGrams: 500, unitPrice: 1 },
          { id: "morilles-sous-vide-300", product: byId("morilles-sous-vide"), quantity: 1, selectedWeightGrams: 300, unitPrice: 1 },
          { id: "retire", product: { id: "produit-retire" }, quantity: 1, unitPrice: 5 },
          { id: "morilles-12g", product: byId("morilles-12g"), quantity: 999, unitPrice: 12 },
        ],
      },
      version: 0,
    };
    localStorage.setItem("morilles-cart", JSON.stringify(stale));
    await useCartStore.persist.rehydrate();
    const items = useCartStore.getState().items;
    expect(items.map((i) => [i.id, i.quantity, i.unitPrice, i.product.image])).toEqual([
      ["morilles-30g", 2, 23, byId("morilles-30g").image],
      ["morilles-sous-vide-500", 1, 240, byId("morilles-sous-vide").image],
      ["morilles-12g", 50, 12, byId("morilles-12g").image],
    ]);
  });

  it("plafonne la quantité par ligne à la limite de create-checkout (50)", () => {
    act(() => useCartStore.getState().addItem(byId("morilles-12g"), 49));
    act(() => useCartStore.getState().addItem(byId("morilles-12g"), 5));
    expect(useCartStore.getState().items[0].quantity).toBe(50);
    act(() => useCartStore.getState().updateQuantity("morilles-12g", 51));
    expect(useCartStore.getState().items[0].quantity).toBe(50);
  });
});
