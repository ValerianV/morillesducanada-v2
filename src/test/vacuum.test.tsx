import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { installBrowserStubs, renderAt, supabaseModule, supabaseLazyModule } from "./qaHarness";

vi.mock("@/integrations/supabase/client", () => supabaseModule);
vi.mock("@/integrations/supabase/lazy", () => supabaseLazyModule);

import { cheapestSmallFormat, getVacuumMorelPrice, pricePerKg, vacuumSaving } from "@/lib/products";
import { useCartStore } from "@/stores/cartStore";

const plain = (s: string | null | undefined) => (s ?? "").replace(/\s/g, " ");
const cartLines = () => useCartStore.getState().items.map((i) => [i.id, i.quantity, i.unitPrice]);

beforeEach(() => {
  installBrowserStubs();
  localStorage.clear();
  useCartStore.setState({ items: [] });
});
afterEach(() => cleanup());

describe("économie du sous vide", () => {
  it("se compare au petit format le moins cher au kilo (45 g) et arrondit vers le bas", () => {
    const ref = cheapestSmallFormat();
    expect(ref.product.id).toBe("morilles-45g");
    const input = { grams: ref.grams, price: ref.product.price };
    expect(vacuumSaving(1000, input)).toMatchObject({ perKg: 350, percent: 45, amount: 294 });
    expect(vacuumSaving(500, input)).toMatchObject({ perKg: 480, percent: 25, amount: 82 });
    expect(vacuumSaving(200, input)).toMatchObject({ perKg: 550, percent: 14, amount: 18 });
    expect(vacuumSaving(100, input)).toMatchObject({ perKg: 590, percent: 8, amount: 5 });
    expect(pricePerKg(getVacuumMorelPrice(1000), 1000)).toBe(350);
  });
});

describe("accueil : sous vide mis en avant", () => {
  it("présélectionne le 500 g, affiche prix au kilo, économie et lien pro, puis ajoute chaque format au panier", async () => {
    await renderAt("/", "fr");
    const section = await waitFor(() => {
      const el = document.getElementById("produits");
      expect(el).not.toBeNull();
      return el!;
    });
    await within(section).findByRole("radiogroup");
    const text = plain(section.textContent);

    const selected = within(section).getByRole("radio", { checked: true });
    expect(plain(selected.textContent)).toContain("500 g");
    expect(text).toContain("480 €/kg, soit 25 % de moins au kilo que le format 45 g : 82 € d'économie.");
    expect(text).toContain("Meilleur prix au kilo");
    expect(text).toContain("Conseillé");
    for (const perKg of ["590 €/kg", "550 €/kg", "480 €/kg", "350 €/kg", "1 000 €/kg", "766,67 €/kg", "644,44 €/kg"]) {
      expect(text).toContain(perKg);
    }
    expect(text).toContain("Au-delà, sur devis ou lien de paiement : 330 €/kg dès 3 kg, 310 €/kg dès 5 kg, 290 €/kg dès 10 kg.");
    expect(within(section).getByRole("link", { name: /Voir la grille au kilo/ })).toHaveAttribute("href", "/professionnels");
    expect(within(section).getByRole("link", { name: /Plus de 1 kg/ })).toHaveAttribute("href", "/professionnels");

    for (const format of ["100 g", "200 g", "500 g", "1 kg"]) {
      fireEvent.click(within(section).getByRole("radio", { name: new RegExp(`^${format}`) }));
      fireEvent.click(within(section).getByRole("button", { name: `Ajouter le ${format} au panier` }));
    }
    for (const button of within(section).getAllByRole("button", { name: "Ajouter au panier" })) fireEvent.click(button);

    expect(cartLines()).toEqual([
      ["morilles-sous-vide-100", 1, 59],
      ["morilles-sous-vide-200", 1, 110],
      ["morilles-sous-vide-500", 1, 240],
      ["morilles-sous-vide-1000", 1, 350],
      ["morilles-12g", 1, 12],
      ["morilles-30g", 1, 23],
      ["morilles-45g", 1, 29],
    ]);
    expect(useCartStore.getState().totalPrice()).toBe(823);
  });

  it("est traduit en anglais", async () => {
    await renderAt("/", "en");
    const section = await waitFor(() => {
      const el = document.getElementById("produits");
      expect(el).not.toBeNull();
      return el!;
    });
    await within(section).findByRole("radiogroup");
    const text = plain(section.textContent);
    expect(text).toContain("The best price per kilo");
    expect(text).toContain("25% less per kilo than the 45 g size");
    expect(text).not.toMatch(/Ajouter|Choisissez|au kilo|Petits formats/);
  });
});

describe("fiches produit", () => {
  it("sous vide : 500 g par défaut, prix au kilo, ajout du format choisi et lien pro", async () => {
    await renderAt("/produits/morilles-sous-vide", "fr");
    await screen.findByRole("radiogroup");
    expect(screen.getByRole("radio", { checked: true })).toHaveTextContent("500 g");
    fireEvent.click(screen.getByRole("radio", { name: /^1 kg/ }));
    expect(plain(document.body.textContent)).toContain("350 €/kg, soit 45 % de moins au kilo que le format 45 g : 294 € d'économie.");
    fireEvent.click(screen.getByRole("button", { name: "Ajouter le 1 kg au panier" }));
    expect(cartLines()).toEqual([["morilles-sous-vide-1000", 1, 350]]);
    expect(screen.getByRole("link", { name: /Voir la grille au kilo/ })).toHaveAttribute("href", "/professionnels");
  });

  it("petit format : prix au kilo et renvoi vers le sous vide avec l'économie chiffrée", async () => {
    await renderAt("/produits/decouverte-12g", "fr");
    await screen.findByRole("heading", { level: 1, name: /Découverte 12g$/ });
    const text = plain(document.body.textContent);
    expect(text).toContain("1 000 €/kg");
    expect(text).toContain("En sous vide 500 g, la morille revient à 480 €/kg, soit 52 % de moins au kilo qu'avec ce format.");
    expect(screen.getByRole("link", { name: /Voir le sous vide/ })).toHaveAttribute("href", "/produits/morilles-sous-vide");
  });
});

describe("/produits", () => {
  it("place le sous vide en premier avec son prix au kilo et renvoie les volumes vers /professionnels", async () => {
    await renderAt("/produits", "fr");
    const cards = await screen.findAllByRole("heading", { level: 2 });
    expect(cards[0]).toHaveTextContent("Morilles sous vide");
    expect(plain(document.body.textContent)).toContain("dès 350 €/kg");
    expect(screen.getByRole("link", { name: "Voir les tarifs pro" })).toHaveAttribute("href", "/professionnels");
  });
});
