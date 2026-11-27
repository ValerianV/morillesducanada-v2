// Échantillon payant (décision du fondateur, 2026-11-26) : session Stripe Checkout pour le pot de 30 g,
// à prix fixe plus le port (_shared/sample.ts). Le client n'envoie que sa langue.
// Rien n'est écrit en base ici : stripe-webhook crée la ligne orders après paiement, puis crée et envoie
// le code à usage unique qui déduit le prix de l'échantillon d'une commande d'au moins 1 kg.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { PRO_SAMPLE_GRAMS, PRO_SHIPPING_BUSINESS_DAYS, PRO_TAX_MENTION } from "../_shared/proPricing.ts";
import {
  PRO_SAMPLE_CREDIT_MIN_KG,
  PRO_SAMPLE_PRICE_CENTS,
  PRO_SAMPLE_SHIPPING_CENTS,
  PRO_SAMPLE_TOTAL_CENTS,
  SAMPLE_ORDER_TYPE,
} from "../_shared/sample.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DEFAULT_SITE_URL = "https://www.morillesducanada.com";

// Les URLs de retour Stripe ne doivent jamais pointer vers un domaine choisi par l'appelant.
function resolveSiteUrl(origin: string | null): string {
  if (!origin) return DEFAULT_SITE_URL;
  if (/^https:\/\/(www\.)?morillesducanada\.com$/.test(origin)) return origin;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return origin;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  return DEFAULT_SITE_URL;
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Méthode non autorisée" }, 405);

  try {
    const body = await req.json().catch(() => ({}));
    const locale: "fr" | "en" = body && (body as { locale?: unknown }).locale === "en" ? "en" : "fr";
    const en = locale === "en";

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });
    const siteUrl = resolveSiteUrl(req.headers.get("origin"));

    const metadata: Record<string, string> = {
      type: SAMPLE_ORDER_TYPE,
      grams: String(PRO_SAMPLE_GRAMS),
      sample_cents: String(PRO_SAMPLE_PRICE_CENTS),
      shipping_cents: String(PRO_SAMPLE_SHIPPING_CENTS),
      total_cents: String(PRO_SAMPLE_TOTAL_CENTS),
      locale,
    };

    const terms = en
      ? `Trade only. Shipped in France within ${PRO_SHIPPING_BUSINESS_DAYS} business days. After payment, you receive by email a single-use code that deducts the jar price from your first order of ${PRO_SAMPLE_CREDIT_MIN_KG} kg or more. ${PRO_TAX_MENTION.en}.`
      : `Réservé aux professionnels. Expédition en France sous ${PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés. Après le paiement, vous recevez par email un code à usage unique qui déduit le prix du pot de votre première commande d'au moins ${PRO_SAMPLE_CREDIT_MIN_KG} kg. ${PRO_TAX_MENTION.fr}.`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: PRO_SAMPLE_PRICE_CENTS,
            product_data: {
              name: en ? `Morel sample, ${PRO_SAMPLE_GRAMS} g jar` : `Échantillon de morilles, pot de ${PRO_SAMPLE_GRAMS} g`,
              description: en
                ? "Resealable glass jar. Whole, stemless, mixed varieties."
                : "Pot en verre refermable. Entières et équeutées, variétés mélangées.",
            },
          },
        },
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: PRO_SAMPLE_SHIPPING_CENTS,
            product_data: { name: en ? "Shipping (France)" : "Frais de port (France)" },
          },
        },
      ],
      shipping_address_collection: { allowed_countries: ["FR"] },
      phone_number_collection: { enabled: true },
      customer_creation: "always",
      // Vente réservée aux professionnels : société et SIRET obligatoires.
      custom_fields: [
        {
          key: "company",
          label: { type: "custom", custom: en ? "Company" : "Société" },
          type: "text",
          optional: false,
          text: { minimum_length: 2, maximum_length: 120 },
        },
        {
          key: "siret",
          label: { type: "custom", custom: en ? "SIRET (14 digits)" : "SIRET (14 chiffres)" },
          type: "numeric",
          optional: false,
          numeric: { minimum_length: 14, maximum_length: 14 },
        },
      ],
      custom_text: { submit: { message: terms } },
      metadata,
      payment_intent_data: { description: `Échantillon ${PRO_SAMPLE_GRAMS} g`, metadata },
      success_url: `${siteUrl}/paiement-reussi?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/professionnels#degustation`,
    });

    return jsonResponse({ url: session.url }, 200);
  } catch (error) {
    console.error("Sample checkout error:", error);
    return jsonResponse({ error: "Erreur lors de la création du paiement" }, 500);
  }
});
