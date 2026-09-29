import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { I18nProvider } from "@/i18n/context";

const invoke = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke: (...args: unknown[]) => invoke(...args) },
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: () => Promise.resolve({ data: { session: null } }),
    },
  },
}));

import Professionnels from "@/pages/Professionnels";

const plain = (s: string | null) => (s ?? "").replace(/\s/g, " ");

function renderPage() {
  return render(
    <HelmetProvider>
      <I18nProvider>
        <MemoryRouter initialEntries={["/professionnels"]}>
          <Professionnels />
        </MemoryRouter>
      </I18nProvider>
    </HelmetProvider>,
  );
}

const submitButton = (name: string) =>
  screen.getAllByRole("button", { name }).find((b) => (b as HTMLButtonElement).type === "submit")!;

function fillCommon() {
  fireEvent.click(screen.getByRole("radio", { name: "Restaurant" }));
  fireEvent.change(screen.getByLabelText(/Établissement/), { target: { value: "Le Gourmet" } });
  fireEvent.change(screen.getByLabelText(/^SIRET/), { target: { value: "802 861 948 00023" } });
  fireEvent.change(screen.getByLabelText(/Nom et prénom/), { target: { value: "Jean Dupont" } });
  fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: "jean@restaurant.fr" } });
  fireEvent.change(screen.getByLabelText(/Code postal/), { target: { value: "69002" } });
  fireEvent.change(screen.getByLabelText(/^Ville/), { target: { value: "Lyon" } });
}

beforeEach(() => {
  invoke.mockReset();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe("page /professionnels", () => {
  it("affiche les sections dans l'ordre de la maquette", () => {
    renderPage();
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual([
      "Prix des morilles séchées au kilo",
      "Commander et payer en ligne",
      "Pour les professionnels de bouche",
      "Une morille sauvage, cueillie après le feu",
      "Pourquoi des morilles équeutées",
      "De la forêt brûlée à votre cuisine",
      "Goûtez avant de commander",
      "Précommandez la saison 2027",
      "Conditions de vente",
      "Votre demande",
      "Questions des professionnels",
    ]);
    expect(screen.getByText("45 kg en stock")).toBeInTheDocument();
  });

  it("affiche la grille nette et la mention fiscale, sans HT ni expédition en 48/72 h", () => {
    const { container } = renderPage();
    const text = plain(container.textContent);
    for (const price of ["350 €/kg", "330 €/kg", "310 €/kg", "290 €/kg"]) expect(text).toContain(price);
    // L'offre pro commence à 1 kg : plus de palier 500 g à 190 €.
    expect(text).not.toContain("190 €");
    expect(text).toContain("De 1 kg à 45 kg");
    expect(text).toContain("TVA non applicable, art. 293 B du CGI");
    expect(text).not.toMatch(/\bHT\b|5,5 ?%|280/);
    expect(text).not.toMatch(/(exp[ée]di\w*|livr\w*|ship\w*|dispatch\w*)[^.]{0,40}(24|48|72) ?h/i);
  });

  it("annonce la vente réservée aux professionnels, les sachets de 250 g et la commande en ligne", () => {
    const { container } = renderPage();
    const text = plain(container.textContent);
    expect(text).toContain("Vente réservée aux professionnels — SIRET demandé à la commande.");
    expect(text).toContain("sachets sous vide de 250 g");
    expect(text).toContain("Sous 48 h ouvrées.");
    expect(text).not.toMatch(/particuliers comme|sous vide 1 kg y coûte|420/);
    // Le configurateur remplace les liens de paiement à quantité fixe.
    const links = [...container.querySelectorAll("a")].filter((a) => a.href.startsWith("https://buy.stripe.com/"));
    expect(links).toHaveLength(0);
    expect(screen.getByRole("button", { name: "Valider et payer" })).toBeInTheDocument();
  });

  describe("configurateur de commande", () => {
    const summary = () => plain(screen.getByText("Récapitulatif").parentElement!.textContent);

    it("2 kg par défaut, palier et prix au kilo en direct, stepper de 0,5 kg", () => {
      renderPage();
      const input = screen.getByLabelText("Quantité de morilles") as HTMLInputElement;
      expect(input.value).toBe("2");
      expect(summary()).toContain("2 kg de morilles (8 sachets de 250 g)");
      expect(summary()).toContain("700 €");
      fireEvent.click(screen.getByRole("button", { name: "Ajouter 0,5 kg" }));
      expect(input.value).toBe("2,5");
      fireEvent.change(input, { target: { value: "3" } });
      expect(plain(document.body.textContent)).toContain("Palier 3 kg et plus · 330 €/kg");
      expect(summary()).toContain("990 €");
      fireEvent.change(input, { target: { value: "9,5" } });
      expect(plain(document.body.textContent)).toContain("le palier suivant est plus avantageux");
      fireEvent.change(input, { target: { value: "1" } });
      expect((screen.getByRole("button", { name: "Retirer 0,5 kg" }) as HTMLButtonElement).disabled).toBe(true);
    });

    it("pots : 20 pots de 45 g et le reste en 30 g, récapitulatif complet", () => {
      renderPage();
      expect(screen.queryByLabelText("Nombre de pots de 45 g")).not.toBeInTheDocument();
      fireEvent.click(screen.getByLabelText(/Ajouter des pots en verre vides/));
      expect(screen.getByAltText(/Pots en verre de 45, 30 et 12 g/)).toBeInTheDocument();
      // 30 g en automatique par défaut : tout en 30 g.
      expect(summary()).toContain("66 pots de 30 g");
      fireEvent.change(screen.getByLabelText("Nombre de pots de 45 g"), { target: { value: "20" } });
      const text = summary();
      expect(text).toContain("2 kg de morilles (8 sachets de 250 g)");
      expect(text).toContain("20 pots de 45 g + 36 pots de 30 g");
      expect(text).toContain("1 980 g en pots, 20 g en vrac");
      expect(text).toContain("700 €");
      expect(text).toContain("84 €");
      expect(text).toContain("784 €");
      expect(text).toContain("TVA non applicable, art. 293 B du CGI");
      expect(text).toContain("Livraison en France, port inclus, sous 5 jours ouvrés.");
      expect(text).toContain("Pots livrés vides et sans étiquette, à part.");
      // Le format automatique est en lecture seule.
      expect(screen.queryByRole("spinbutton", { name: "Nombre de pots de 30 g" })).not.toBeInTheDocument();
      expect(plain(screen.getByLabelText("Nombre de pots de 30 g").textContent)).toContain("36");
    });

    it("change de format automatique et signale les pots trop nombreux", () => {
      renderPage();
      fireEvent.click(screen.getByLabelText(/Ajouter des pots en verre vides/));
      const radios = screen.getAllByLabelText("Compléter");
      fireEvent.click(radios[2]); // 45 g
      expect(summary()).toContain("44 pots de 45 g");
      fireEvent.change(screen.getByLabelText("Nombre de pots de 30 g"), { target: { value: "70" } });
      expect(screen.getByRole("alert")).toHaveTextContent("Les pots saisis représentent 2 100 g, plus que la quantité commandée (2 000 g).");
      expect((screen.getByRole("button", { name: "Valider et payer" }) as HTMLButtonElement).disabled).toBe(true);
      fireEvent.click(screen.getByLabelText(/Ne rien compléter/));
      fireEvent.change(screen.getByLabelText("Nombre de pots de 30 g"), { target: { value: "10" } });
      expect(summary()).toContain("300 g en pots, 1 700 g en vrac");
    });

    it("refuse un dépassement du stock de pots avec un message clair", () => {
      renderPage();
      fireEvent.change(screen.getByLabelText("Quantité de morilles"), { target: { value: "10" } });
      fireEvent.click(screen.getByLabelText(/Ajouter des pots en verre vides/));
      expect(screen.getByRole("alert")).toHaveTextContent("Stock insuffisant en pots de 30 g : 250 disponibles, 333 demandés.");
      expect((screen.getByRole("button", { name: "Valider et payer" }) as HTMLButtonElement).disabled).toBe(true);
      fireEvent.click(screen.getByLabelText(/Ne rien compléter/));
      fireEvent.change(screen.getByLabelText("Nombre de pots de 45 g"), { target: { value: "201" } });
      expect(screen.getByRole("alert")).toHaveTextContent("Stock insuffisant en pots de 45 g : 200 disponibles, 201 demandés.");
      fireEvent.change(screen.getByLabelText("Nombre de pots de 45 g"), { target: { value: "200" } });
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("n'envoie que kg, pots et langue à create-pro-checkout, puis redirige vers Stripe", async () => {
      invoke.mockResolvedValue({ data: { url: "https://checkout.stripe.com/c/pay/cs_test" }, error: null });
      const assign = vi.fn();
      const original = window.location;
      Object.defineProperty(window, "location", { configurable: true, value: { ...original, set href(v: string) { assign(v); } } });
      renderPage();
      fireEvent.click(screen.getByLabelText(/Ajouter des pots en verre vides/));
      fireEvent.change(screen.getByLabelText("Nombre de pots de 45 g"), { target: { value: "20" } });
      fireEvent.click(screen.getByRole("button", { name: "Valider et payer" }));
      await waitFor(() => expect(assign).toHaveBeenCalledWith("https://checkout.stripe.com/c/pay/cs_test"));
      expect(invoke).toHaveBeenCalledWith("create-pro-checkout", {
        body: { kg: 2, pots: { fixed: { 12: 0, 45: 20 }, autoSize: 30 }, locale: "fr" },
      });
      Object.defineProperty(window, "location", { configurable: true, value: original });
    });

    it("commande sans pots : pots à null ; erreur affichée si la fonction échoue", async () => {
      invoke.mockResolvedValue({ data: null, error: new Error("500") });
      renderPage();
      fireEvent.click(screen.getByRole("button", { name: "Valider et payer" }));
      await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Le paiement n'a pas pu être lancé."));
      expect(invoke).toHaveBeenCalledWith("create-pro-checkout", { body: { kg: 2, pots: null, locale: "fr" } });
    });
  });

  it("refuse un SIRET invalide avant tout envoi", () => {
    renderPage();
    fillCommon();
    fireEvent.change(screen.getByLabelText(/^SIRET/), { target: { value: "12345678901234" } });
    fireEvent.click(submitButton("Envoyer ma demande de devis"));
    expect(invoke).not.toHaveBeenCalled();
    expect(screen.getByText(/SIRET invalide/)).toBeInTheDocument();
  });

  it("calcule l'estimation en direct avec quote()", () => {
    renderPage();
    fireEvent.change(screen.getByLabelText(/Quantité souhaitée/), { target: { value: "10" } });
    const estimate = screen.getByText("Estimation").parentElement!;
    expect(plain(estimate.textContent)).toContain("2 900 €");
    fireEvent.change(screen.getByLabelText(/Quantité souhaitée/), { target: { value: "9,5" } });
    expect(plain(screen.getByText("Estimation").parentElement!.textContent)).toContain("le palier suivant est plus avantageux");
  });

  it("n'appelle pas la fonction si le formulaire est incomplet", () => {
    renderPage();
    fireEvent.click(submitButton("Envoyer ma demande de devis"));
    expect(invoke).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Vérifiez les champs signalés.");
  });

  it("n'affiche le succès qu'après la réponse 200 de submit-pro-lead", async () => {
    let resolve!: (v: unknown) => void;
    invoke.mockReturnValue(new Promise((r) => (resolve = r)));
    renderPage();
    fillCommon();
    fireEvent.click(submitButton("Envoyer ma demande de devis"));

    expect(invoke).toHaveBeenCalledWith(
      "submit-pro-lead",
      expect.objectContaining({ body: expect.objectContaining({ kind: "devis", kg: 5, company: "Le Gourmet" }) }),
    );
    expect(screen.queryByText("Demande envoyée")).not.toBeInTheDocument();

    resolve({ data: { ok: true, id: "x" }, error: null });
    await waitFor(() => expect(screen.getByText("Demande envoyée")).toBeInTheDocument());
  });

  it("affiche une erreur et pas de succès si la fonction échoue", async () => {
    invoke.mockResolvedValue({
      data: null,
      error: { context: new Response(JSON.stringify({ error: "rate_limited" }), { status: 429 }) },
    });
    renderPage();
    fillCommon();
    fireEvent.click(submitButton("Envoyer ma demande de devis"));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Trop de demandes"));
    expect(screen.queryByText("Demande envoyée")).not.toBeInTheDocument();
  });

  it("onglet échantillon : adresse obligatoire, pas de quantité envoyée", async () => {
    invoke.mockResolvedValue({ data: { ok: true, id: "y" }, error: null });
    renderPage();
    const tab = screen.getByRole("tab", { name: "Échantillon gratuit" });
    fireEvent.mouseDown(tab);
    fireEvent.click(tab);
    await waitFor(() => expect(screen.getByLabelText(/Adresse de livraison/)).toBeInTheDocument());
    fillCommon();
    fireEvent.click(submitButton("Demander mon échantillon"));
    expect(invoke).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText(/Adresse de livraison/), { target: { value: "12 rue Mercière" } });
    fireEvent.click(submitButton("Demander mon échantillon"));
    await waitFor(() => expect(screen.getByText("Demande envoyée")).toBeInTheDocument());
    const body = invoke.mock.calls[0][1].body;
    expect(body.kind).toBe("echantillon");
    expect(body.kg).toBeUndefined();
    expect(within(document.body).queryByText(/Estimation/)).not.toBeInTheDocument();
  });
});
