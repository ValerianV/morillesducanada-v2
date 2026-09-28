import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

// Les pages chargent leurs sections à la demande : sur une machine chargée, 1 s ne suffit pas toujours.
configure({ asyncUtilTimeout: 5000 });

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
