// Commande professionnelle au kilo, avec ou sans pots en verre vides : session Stripe Checkout
// calculée pour la commande du client. Le client n'envoie que kg, fixed et autoSize ; les montants
// sont recalculés ici (grille _shared/proPricing.ts, pots _shared/potAllocation.ts).
// Rien n'est écrit en base ici : stripe-webhook crée la ligne orders après paiement.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import {
  POT_PRICE_CENTS,
  PRO_ORDER_TYPE,
  ProOrderValidationError,
  formatPreparationList,
  morelsLineName,
  parseProOrderRequest,
  potsLineName,
  quoteProOrder,
  serializePotCounts,
} from "../_shared/potAllocation.ts";
import { PRO_PACK_GRAMS, PRO_SHIPPING_BUSINESS_DAYS, PRO_TAX_MENTION } from "../_shared/proPricing.ts";

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Méthode non autorisée" }, 405);
  }

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      throw new ProOrderValidationError("Requête invalide");
    }

    const request = parseProOrderRequest(body);
    const { locale } = request;
    const order = quoteProOrder({ kg: request.kg, pots: request.pots });
    if (order.ok === false) {
      return jsonResponse({ error: order.error.message[locale], code: order.error.code }, 400);
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });
    const siteUrl = resolveSiteUrl(req.headers.get("origin"));

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: order.morelsCents,
          product_data: {
            name: morelsLineName(order, locale),
            description:
              locale === "en"
                ? `${order.bags} × ${PRO_PACK_GRAMS} g vacuum bags. Whole, stemless, mixed varieties.`
                : `${order.bags} sachets sous vide de ${PRO_PACK_GRAMS} g. Entières et équeutées, variétés mélangées.`,
          },
        },
      },
    ];
    if (order.pots) {
      line_items.push({
        quantity: order.pots.potCount,
        price_data: {
          currency: "eur",
          unit_amount: POT_PRICE_CENTS,
          product_data: {
            name: potsLineName(order.pots, locale),
            description:
              locale === "en"
                ? "Shipped empty and unlabelled, separately from the morels. You fill and label them yourself."
                : "Livrés vides et sans étiquette, à part des morilles. Vous les remplissez et les étiquetez vous-même.",
          },
        },
      });
    }

    // Métadonnées posées par le serveur : stripe-webhook les relit et recalcule le montant attendu.
    const metadata: Record<string, string> = {
      type: PRO_ORDER_TYPE,
      kg: String(order.kg),
      pots: order.pots ? serializePotCounts(order.pots.pots) : "",
      pot_count: String(order.pots?.potCount ?? 0),
      bulk_grams: String(order.pots?.bulkGrams ?? 0),
      morels_cents: String(order.morelsCents),
      pots_cents: String(order.potsCents),
      total_cents: String(order.totalCents),
      preparation: formatPreparationList(order.kg, order.pots?.pots ?? null),
      locale,
    };

    const terms =
      locale === "en"
        ? `Trade only. Delivery in France, shipping included, within ${PRO_SHIPPING_BUSINESS_DAYS} business days.${order.pots ? " Jars shipped empty and unlabelled, separately." : ""} ${PRO_TAX_MENTION.en}.`
        : `Réservé aux professionnels. Livraison en France, port inclus, sous ${PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés.${order.pots ? " Pots livrés vides et sans étiquette, à part." : ""} ${PRO_TAX_MENTION.fr}.`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale,
      line_items,
      shipping_address_collection: { allowed_countries: ["FR"] },
      phone_number_collection: { enabled: true },
      customer_creation: "always",
      // Vente réservée aux professionnels : société et SIRET obligatoires (contrôlés par stripe-webhook).
      custom_fields: [
        {
          key: "company",
          label: { type: "custom", custom: locale === "en" ? "Company" : "Société" },
          type: "text",
          optional: false,
          text: { minimum_length: 2, maximum_length: 120 },
        },
        {
          key: "siret",
          label: { type: "custom", custom: locale === "en" ? "SIRET (14 digits)" : "SIRET (14 chiffres)" },
          type: "numeric",
          optional: false,
          numeric: { minimum_length: 14, maximum_length: 14 },
        },
      ],
      custom_text: { submit: { message: terms } },
      metadata,
      payment_intent_data: {
        description: `Commande pro — ${metadata.preparation}`,
        metadata,
      },
      success_url: `${siteUrl}/paiement-reussi?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/professionnels#commander`,
    });

    if (session.amount_total !== null && session.amount_total !== order.totalCents) {
      console.error("Pro order total mismatch", {
        sessionId: session.id,
        expectedCents: order.totalCents,
        stripeTotalCents: session.amount_total,
      });
    }

    return jsonResponse({ url: session.url }, 200);
  } catch (error) {
    if (error instanceof ProOrderValidationError) {
      return jsonResponse({ error: error.message }, 400);
    }
    console.error("Pro checkout error:", error);
    return jsonResponse({ error: "Erreur lors de la création du paiement" }, 500);
  }
});
