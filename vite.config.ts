import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Bibliothèques stables regroupées pour un cache navigateur long.
// framer-motion n'y figure pas : Rollup le répartit entre le hero (LazyMotion) et les
// sections chargées à la demande, au lieu d'un bloc unique chargé sur toutes les pages.
const VENDOR_CHUNKS: Record<string, RegExp> = {
  react: /[\\/]node_modules[\\/](react|react-dom|scheduler|tslib)[\\/]/,
  router: /[\\/]node_modules[\\/](react-router|react-router-dom|@remix-run[\\/]router)[\\/]/,
  supabase: /[\\/]node_modules[\\/]@supabase[\\/]/,
};

export default defineConfig(({ isSsrBuild }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            manualChunks(id: string) {
              // Aides partagées (tslib, commonjsHelpers, preload-helper) : avec le socle React, chargé
              // partout, sinon Rollup les place dans le bloc Supabase qui devient bloquant.
              if (id.startsWith("\0")) return "react";
              for (const [name, pattern] of Object.entries(VENDOR_CHUNKS)) {
                if (pattern.test(id)) return name;
              }
              return undefined;
            },
          },
        },
  },
}));
