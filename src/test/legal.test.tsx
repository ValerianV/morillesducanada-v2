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

  it("annonce des prix nets, sans TTC ni plateforme de paiement erronée", () => {
    expect(text).toContain("Prix nets — TVA non applicable, art. 293 B du CGI.");
    expect(text).not.toMatch(/TTC|toutes taxes comprises|Shopify/);
    expect(text).toContain("Stripe");
    expect(text).not.toContain("[Nom / Raison sociale]");
  });

  it("reprend les frais de port France et Union européenne", () => {
    expect(text).toContain("France, 6,90 €, offerts dès 50 €");
    expect(text).toContain("Union européenne, 9,90 €, offerts dès 100 €");
  });

  it("décrit la précommande 2027 : acompte, solde, livraison, remboursement", () => {
    expect(text).toContain("300 € le kilo, de 1 à 15 kg");
    expect(text).toContain("150 € par kilo");
    expect(text).toContain("octobre 2027");
    expect(text).toContain("intégralement remboursé");
  });
});

describe("auth-email-hook", () => {
  it("renvoie vers le domaine canonique www", () => {
    const url = authVerifyUrl({ supabaseUrl: "https://x.supabase.co", tokenHash: "t", type: "signup" });
    expect(new URL(url).searchParams.get("redirect_to")).toBe("https://www.morillesducanada.com");
  });
});
