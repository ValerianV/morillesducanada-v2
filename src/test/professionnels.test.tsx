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

  it("annonce la vente réservée aux professionnels, les sachets de 250 g et les liens de paiement", () => {
    const { container } = renderPage();
    const text = plain(container.textContent);
    expect(text).toContain("Vente réservée aux professionnels — SIRET demandé à la commande.");
    expect(text).toContain("sachets sous vide de 250 g");
    expect(text).toContain("Sous 48 h ouvrées.");
    expect(text).not.toMatch(/particuliers comme|sous vide 1 kg y coûte|420/);
    const links = [...container.querySelectorAll("a")].filter((a) => a.href.startsWith("https://buy.stripe.com/"));
    expect(links).toHaveLength(4);
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
