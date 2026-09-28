import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { captureUtm } from "@/lib/utm";
import "./index.css";

// Avant tout rendu : une redirection (ex. /pre-commande) ne doit pas faire perdre les UTM.
captureUtm();

createRoot(document.getElementById("root")!).render(<App />);
