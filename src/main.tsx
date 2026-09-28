import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import { captureUtm } from "@/lib/utm";
import "./index.css";

// Avant tout rendu : une redirection (ex. /pre-commande) ne doit pas faire perdre les UTM.
captureUtm();

const container = document.getElementById("root")!;

// Pages prérendues au build (scripts/prerender.mjs) : on hydrate le HTML existant.
// Les autres routes (spa.html) sont rendues côté client.
if (container.hasAttribute("data-prerendered")) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
