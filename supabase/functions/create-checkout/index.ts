// Ancien panier de vente au détail. Depuis le 2026-09-28, le site est réservé aux professionnels :
// cette fonction ne crée plus de session Stripe. Elle reste déployée pour répondre proprement aux
// onglets restés ouverts (410 Gone et message clair) au lieu d'une erreur réseau.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

export const RETAIL_CLOSED_MESSAGE =
  "La vente en ligne au détail est fermée : Morilles du Canada vend désormais aux professionnels, au kilo. Tarifs et devis : https://www.morillesducanada.com/professionnels";

serve((req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  return new Response(
    JSON.stringify({ error: RETAIL_CLOSED_MESSAGE, url: "https://www.morillesducanada.com/professionnels" }),
    { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
