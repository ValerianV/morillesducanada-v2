import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { CartValidationError, resolveCart } from "../_shared/catalog.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// All EU countries + Switzerland + Norway
const ALLOWED_COUNTRIES = [
  "FR", "BE", "LU", "CH", "DE", "IT", "ES", "PT", "NL", "AT",
  "PL", "CZ", "SK", "HU", "RO", "BG", "HR", "SI", "EE", "LV",
  "LT", "DK", "SE", "FI", "IE", "GR", "CY", "MT", "NO",
];

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

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      throw new CartValidationError("Requête invalide");
    }

    // Prix, sous-total et frais de port sont recalculés ici à partir du catalogue serveur.
    const cart = resolveCart(body);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Try to get authenticated user email
    let customerEmail: string | undefined;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? ""
      );
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      customerEmail = data.user?.email;
    }

    // Check if Stripe customer exists
    let customerId: string | undefined;
    if (customerEmail) {
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.lines.map((line) => ({
      price: line.priceId,
      quantity: line.quantity,
    }));

    if (cart.shippingCents > 0) {
      stripeLineItems.push({
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: cart.shippingCents,
          product_data: { name: "Frais de livraison" },
        },
      });
    }

    const siteUrl = resolveSiteUrl(req.headers.get("origin"));

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: stripeLineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ALLOWED_COUNTRIES as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      metadata: {
        source: "site",
        expected_subtotal_cents: String(cart.subtotalCents),
        expected_shipping_cents: String(cart.shippingCents),
      },
      success_url: `${siteUrl}/paiement-reussi`,
      cancel_url: `${siteUrl}/paiement-annule`,
    });

    // Le montant facturé vient des prix Stripe : on signale tout écart avec le catalogue serveur.
    if (session.amount_total !== null && session.amount_total !== cart.totalCents) {
      console.error("Catalog/Stripe price mismatch", {
        sessionId: session.id,
        expectedTotalCents: cart.totalCents,
        stripeTotalCents: session.amount_total,
      });
    }

    return jsonResponse({ url: session.url }, 200);
  } catch (error) {
    if (error instanceof CartValidationError) {
      return jsonResponse({ error: error.message }, 400);
    }
    console.error("Checkout error:", error);
    return jsonResponse({ error: "Erreur lors de la création du paiement" }, 500);
  }
});
