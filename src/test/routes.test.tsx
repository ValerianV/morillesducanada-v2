import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import { RAW_KEY, installBrowserStubs, renderAt, supabaseMock, supabaseModule, supabaseLazyModule } from "./qaHarness";

vi.mock("@/integrations/supabase/client", () => supabaseModule);
vi.mock("@/integrations/supabase/lazy", () => supabaseLazyModule);

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
    expect([...document.querySelectorAll("main a")].find((a) => a.textContent === "Prices & quotes")).toHaveAttribute("href", "/professionnels");
    expect(document.querySelector("nav")).not.toBeNull();
    expect(errors.mock.calls.filter((c) => String(c[0]).includes("404"))).toEqual([]);
    errors.mockRestore();
  });
});

describe("pages de retour Stripe", () => {
  it("/paiement-annule : traduite, rassure et renvoie vers l'offre pro", async () => {
    await renderAt("/paiement-annule", "en");
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Payment cancelled");
    expect(screen.getByText(/You have not been charged/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "prices and quotes" })).toHaveAttribute("href", "/professionnels");
  });

  it("/paiement-reussi : renvoie vers l'offre pro, jamais vers un compte client", async () => {
    await renderAt("/paiement-reussi", "fr");
    await screen.findByRole("heading", { level: 1 });
    expect([...document.querySelectorAll("main a")].find((a) => a.textContent === "Tarifs et devis")).toHaveAttribute("href", "/professionnels");
    expect(document.querySelector('a[href="/profil"]')).toBeNull();
  });
});

describe("espaces protégés sans connexion", () => {
  it("/admin redirige vers /auth en remplaçant l'entrée d'historique, avec retour prévu vers /admin", async () => {
    // renderAt ajoute l'entrée /admin ; la redirection doit la remplacer, pas en empiler une autre.
    const historyLengthWithAdmin = window.history.length + 1;
    await renderAt("/admin", "fr");
    await waitFor(() => expect(window.location.pathname).toBe("/auth"));
    expect(window.location.search).toBe("?redirect=%2Fadmin");
    expect(window.history.length).toBe(historyLengthWithAdmin);
  });

  it("une fois connecté, /auth renvoie vers la page demandée et ignore une URL externe", async () => {
    supabaseMock.getSession.mockResolvedValue({ data: { session: { user: { id: "u1" } } }, error: null });
    await renderAt("/auth?redirect=%2Fprofessionnels", "fr");
    await waitFor(() => expect(window.location.pathname).toBe("/professionnels"));
    cleanup();
    await renderAt("/auth?redirect=%2F%2Fevil.example", "fr");
    await waitFor(() => expect(window.location.pathname).toBe("/"));
    supabaseMock.getSession.mockResolvedValue({ data: { session: null }, error: null });
  });
});

describe("langue", () => {
  it("applique lang=\"en\" dès le chargement quand l'anglais est mémorisé", async () => {
    document.documentElement.lang = "fr";
    await renderAt("/professionnels", "en");
    expect(document.documentElement.lang).toBe("en");
  });
});

const ROUTES = [
  "/", "/auth", "/reset-password", "/mentions-legales", "/cgv", "/livraison", "/recettes", "/recettes/inconnue",
  "/profil", "/guide-morilles-de-feu", "/professionnels", "/pre-commande", "/paiement-reussi", "/paiement-annule",
  "/precommande-confirmee", "/precommande-2027", "/admin", "/galerie", "/journal", "/plaquette-pro", "/fiche-technique", "/produits",
  "/produits/morilles-sous-vide", "/page-inexistante",
];

// Avertissements React propres au mode développement / à jsdom, absents du build de production.
const DEV_ONLY = /not wrapped in act|React does not recognize the `%s` prop|fetchPriority/;

describe("toutes les routes de App.tsx", () => {
  for (const locale of ["fr", "en"] as const) {
    for (const route of ROUTES) {
      it(`${locale} ${route} : rendu sans erreur ni clé i18n brute`, async () => {
        const errors: string[] = [];
        const spy = vi.spyOn(console, "error").mockImplementation((...args) => {
          const message = args.map(String).join(" ");
          if (!DEV_ONLY.test(message)) errors.push(message);
        });
        await renderAt(route, locale);
        await new Promise((resolve) => setTimeout(resolve, 50));
        const text = document.body.textContent ?? "";
        expect(text.match(new RegExp(RAW_KEY, "g"))).toBeNull();
        expect(errors).toEqual([]);
        spy.mockRestore();
      });
    }
  }
});

const FRENCH_LEFTOVERS = /Voir le détail|Retour aux|Prix nets|Tarifs et devis|Demander un devis|Témoignages|Voir toute la galerie|Paiement interrompu|Aucun montant|Nous contacter|Page introuvable|réservée aux professionnels/;

describe("version anglaise des pages clés", () => {
  for (const route of ["/", "/professionnels", "/precommande-2027", "/precommande-confirmee", "/paiement-annule", "/galerie", "/page-inexistante"]) {
    it(`${route} : aucun libellé d'interface resté en français`, async () => {
      await renderAt(route, "en");
      if (route === "/") await waitFor(() => expect(document.getElementById("offre")).not.toBeNull());
      expect((document.body.textContent ?? "").match(FRENCH_LEFTOVERS)).toBeNull();
    });
  }
});

describe("redirection /pre-commande", () => {
  it("arrive sur la page de précommande saison 2027", async () => {
    await renderAt("/pre-commande", "fr");
    await waitFor(() => expect(window.location.pathname).toBe("/precommande-2027"));
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Précommande saison 2027");
  });
});

describe("page /precommande-2027", () => {
  it("calcule l'acompte de 50 % et envoie seulement la quantité au serveur", async () => {
    await renderAt("/precommande-2027", "fr");
    const select = await screen.findByLabelText("Quantité (kg)");
    expect(select).toHaveValue("1");
    expect(screen.getByRole("button", { name: /Payer l'acompte de 150/ })).toBeInTheDocument();
    fireEvent.change(select, { target: { value: "4" } });
    expect(screen.getByRole("button", { name: /Payer l'acompte de 600/ })).toBeInTheDocument();
    const text = (document.body.textContent ?? "").replace(/\s/g, " ");
    expect(text).toContain("1 200 €");
    expect(text).toContain("octobre 2027");
    expect(screen.getByRole("button", { name: "Retirer un kilo" })).not.toBeDisabled();
    fireEvent.change(select, { target: { value: "15" } });
    expect(screen.getByRole("button", { name: "Ajouter un kilo" })).toBeDisabled();

    supabaseMock.invoke.mockClear();
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    fireEvent.click(screen.getByRole("button", { name: /Payer l'acompte de 2/ }));
    await waitFor(() => expect(supabaseMock.invoke).toHaveBeenCalled());
    expect(supabaseMock.invoke).toHaveBeenCalledWith("create-preorder-checkout", { body: { kg: 15, locale: "fr" } });
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    errors.mockRestore();
  });

  it("est reliée depuis /professionnels", async () => {
    await renderAt("/professionnels", "fr");
    expect(await screen.findByRole("link", { name: "Précommander" })).toHaveAttribute("href", "/precommande-2027");
  });
});

describe("menu mobile", () => {
  it("s'ouvre, propose les tarifs et les sections, sans panier ni compte, puis se referme", async () => {
    await renderAt("/guide-morilles-de-feu", "fr");
    expect(screen.queryByRole("button", { name: /panier/i })).toBeNull();
    expect(document.querySelector('[title="Se connecter"]')).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    const nav = document.querySelector("nav")!;
    const proLinks = [...nav.querySelectorAll("a")].filter((a) => a.textContent === "Tarifs et devis");
    expect(proLinks.length).toBe(2);
    const mobileRecipes = [...nav.querySelectorAll("a")].find((a) => a.textContent === "Recettes" && a.closest(".md\\:hidden"))!;
    expect([...nav.querySelectorAll("a")].some((a) => a.textContent === "L'offre" && a.getAttribute("href") === "/#offre")).toBe(true);
    fireEvent.click(mobileRecipes);
    await waitFor(() => expect(window.location.pathname).toBe("/recettes"));
    expect([...document.querySelector("nav")!.querySelectorAll("a")].filter((a) => a.textContent === "Tarifs et devis").length).toBe(1);
  });
});

describe("vente au détail fermée", () => {
  it("/produits et les anciennes fiches renvoient vers /professionnels", async () => {
    await renderAt("/produits/morilles-sous-vide", "fr");
    await waitFor(() => expect(window.location.pathname).toBe("/professionnels"));
  });
});

describe("ancres de l'accueil depuis une autre page", () => {
  it("/#offre défile jusqu'à l'offre au kilo une fois chargée", async () => {
    const scrolled: string[] = [];
    await renderAt("/guide-morilles-de-feu", "fr");
    cleanup();
    window.HTMLElement.prototype.scrollIntoView = vi.fn(function (this: HTMLElement) {
      scrolled.push(this.id);
    });
    await renderAt("/#offre", "fr");
    await waitFor(() => expect(scrolled).toContain("offre"));
  });
});
