import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { I18nProvider } from "@/i18n/context";
import { supabaseModule, supabaseLazyModule } from "./qaHarness";

vi.mock("@/integrations/supabase/client", () => supabaseModule);
vi.mock("@/integrations/supabase/lazy", () => supabaseLazyModule);

import { authVerifyUrl } from "../../supabase/functions/_shared/authEmails";
import CGV from "@/pages/CGV";
import MentionsLegales from "@/pages/MentionsLegales";

const plain = (s: string | null) => (s ?? "").replace(/\s/g, " ");

describe("CGV", () => {
  const { container } = render(
    <HelmetProvider>
      <I18nProvider>
        <MemoryRouter>
          <CGV />
        </MemoryRouter>
      </I18nProvider>
    </HelmetProvider>,
  );
  const text = plain(container.textContent);

  it("annonce des prix nets, sans TTC ni placeholder", () => {
    expect(text).toContain("Prix nets — TVA non applicable, art. 293 B du CGI.");
    expect(text).not.toMatch(/TTC|toutes taxes comprises|Shopify/);
    expect(text).toContain("Stripe");
    expect(text).not.toMatch(/[[\]]/);
  });

  it("vend uniquement aux professionnels : pas de rétractation ni de médiateur de la consommation", () => {
    expect(text).toContain("exclusivement aux ventes conclues avec des professionnels");
    expect(text).toContain("L441-1 du Code de commerce");
    expect(text).toContain("ne vend pas aux consommateurs");
    expect(text).toContain("le droit de rétractation prévu par le Code de la consommation ne s'applique pas");
    expect(text).not.toMatch(/médiat/i);
  });

  it("prévoit paiement à la commande, pénalités de retard et indemnité de 40 €", () => {
    expect(text).toContain("Le paiement est dû à la commande, par carte bancaire ou par virement");
    expect(text).toContain("trois fois le taux d'intérêt légal");
    expect(text).toContain("indemnité forfaitaire pour frais de recouvrement de 40 €");
  });

  it("livre en France, port inclus, sous 5 jours ouvrés, réclamation sous 48 heures, tribunal d'Avignon", () => {
    expect(text).toContain("livrés en France uniquement, port inclus");
    expect(text).toContain("sous 5 jours ouvrés");
    expect(text).toContain("dans les 48 heures suivant la réception");
    expect(text).toContain("tribunaux du ressort d'Avignon");
  });

  it("reprend la grille au kilo", () => {
    for (const price of ["350 €/kg", "330 €/kg", "310 €/kg", "290 €/kg"]) expect(text).toContain(price);
  });

  it("décrit la précommande 2027 : acompte, solde, livraison, remboursement", () => {
    expect(text).toContain("300 € le kilo, de 1 à 15 kg");
    expect(text).toContain("150 € par kilo");
    expect(text).toContain("octobre 2027, en France, port inclus");
    expect(text).toContain("intégralement remboursé");
  });
});

describe("mentions légales", () => {
  const { container } = render(
    <HelmetProvider>
      <I18nProvider>
        <MemoryRouter>
          <MentionsLegales />
        </MemoryRouter>
      </I18nProvider>
    </HelmetProvider>,
  );
  const text = plain(container.textContent);

  it("identifie l'éditeur (EI), son adresse, son téléphone et l'hébergeur", () => {
    expect(text).toContain("entrepreneur individuel (EI)");
    expect(text).toContain("448 chemin de Patin, 84810 Aubignan");
    expect(text).toContain("802 861 948 00023");
    expect(text).toContain("07 82 16 27 08");
    expect(text).toContain("Vercel Inc.");
    expect(text).not.toMatch(/Colombie-Britannique & Yukon|→ France/);
    expect(text).not.toMatch(/[[\]]/);
  });

  it("liste les sous-traitants, les durées de conservation et la CNIL", () => {
    for (const name of ["Supabase", "Stripe", "Resend"]) expect(text).toContain(name);
    expect(text).toContain("3 ans après le dernier contact");
    expect(text).toContain("10 ans");
    expect(text).toContain("CNIL");
  });
});

describe("auth-email-hook", () => {
  it("renvoie vers le domaine canonique www", () => {
    const url = authVerifyUrl({ supabaseUrl: "https://x.supabase.co", tokenHash: "t", type: "signup" });
    expect(new URL(url).searchParams.get("redirect_to")).toBe("https://www.morillesducanada.com");
  });
});
