// Point d'entrée du prérendu (scripts/prerender.mjs) : jamais chargé par le navigateur.
import { renderToPipeableStream } from "react-dom/server";
import { Writable } from "node:stream";
import type { HelmetServerState } from "react-helmet-async";
import App from "./App";
import { setPrerenderData } from "@/lib/prerenderData";

export { STATIC_ROUTES, recipeRoute } from "@/lib/seo/routes";
export { NOINDEX_PREFIXES } from "@/lib/seo/noindex";
export { buildRobotsTxt } from "@/lib/seo/robots";
export { ARTICLES } from "@/lib/seo/articles";
export { buildLlmsTxt, buildLlmsFullTxt } from "@/lib/seo/llms";
export { SITE_URL } from "@/lib/seo/site";
export { RECIPES_KEY, recipeKey } from "@/lib/prerenderData";

export interface RenderResult {
  html: string;
  helmet: HelmetServerState | undefined;
}

// Attend que toutes les frontières Suspense (routes et sections lazy) soient résolues.
export async function render(url: string, data?: Record<string, unknown>): Promise<RenderResult> {
  setPrerenderData(data);
  const helmetContext: { helmet?: HelmetServerState } = {};
  try {
    const html = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const writable = new Writable({
        write(chunk, _encoding, callback) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          callback();
        },
        final(callback) {
          resolve(Buffer.concat(chunks).toString("utf8"));
          callback();
        },
      });
      const stream = renderToPipeableStream(<App ssrPath={url} helmetContext={helmetContext} />, {
        onAllReady() {
          stream.pipe(writable);
        },
        onShellError: reject,
        onError(error) {
          reject(error);
        },
      });
    });
    return { html, helmet: helmetContext.helmet };
  } finally {
    setPrerenderData(undefined);
  }
}
