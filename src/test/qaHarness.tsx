import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { fr } from "@/i18n/fr";

// Client Supabase factice : aucune requête réseau, requêtes vides, utilisateur non connecté.
export const supabaseMock = {
  invoke: vi.fn(async () => ({ data: null, error: null })),
  getUser: vi.fn(async () => ({ data: { user: null }, error: null })),
  getSession: vi.fn(async () => ({ data: { session: null as unknown }, error: null })),
};

function queryBuilder(): unknown {
  const result = { data: [], error: null, count: 0 };
  const single = { data: null, error: null };
  const builder: Record<string, unknown> = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "then") return (resolve: (v: unknown) => unknown) => resolve(result);
        if (prop === "single" || prop === "maybeSingle") {
          return () => ({ then: (resolve: (v: unknown) => unknown) => resolve(single) });
        }
        return () => builder;
      },
    },
  );
  return builder;
}

export const supabaseModule = {
  supabase: {
    from: () => queryBuilder(),
    rpc: () => queryBuilder(),
    functions: { invoke: (...args: unknown[]) => (supabaseMock.invoke as (...a: unknown[]) => unknown)(...args) },
    storage: { from: () => ({ getPublicUrl: () => ({ data: { publicUrl: "" } }), upload: async () => ({ error: null }) }) },
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: () => supabaseMock.getSession(),
      getUser: () => supabaseMock.getUser(),
      signOut: async () => ({ error: null }),
    },
  },
};

export function installBrowserStubs() {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", IO);
  vi.stubGlobal("ResizeObserver", IO);
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

export async function renderAt(path: string, locale: "fr" | "en" = "fr") {
  localStorage.setItem("locale", locale);
  window.history.pushState({}, "", path);
  const { default: App } = await import("@/App");
  const utils = render(<App />);
  // Attend la fin du Suspense des routes chargées à la demande.
  await waitFor(() => expect((document.body.textContent ?? "").trim().length).toBeGreaterThan(20), { timeout: 5000 });
  return utils;
}

const NAMESPACES = Object.keys(fr).join("|");
// Une clé i18n non résolue ressort telle quelle : « products.addToCart », « pro.form.errors.email ».
export const RAW_KEY = new RegExp(`\\b(?:${NAMESPACES})(?:\\.[a-z][a-zA-Z0-9]*)+\\b`);
