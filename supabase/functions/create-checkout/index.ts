import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Free shipping threshold in cents
const FREE_SHIPPING_THRESHOLD_CENTS = 5000; // 50€
const SHIPPING_AMOUNT_CENTS = 690; // 6.90€

// All EU countries + Switzerland + Norway
const ALLOWED_COUNTRIES = [
  "FR", "BE", "LU", "CH", "DE", "IT", "ES", "PT", "NL", "AT",
  "PL", "CZ", "SK", "HU", "RO", "BG", "HR", "SI", "EE", "LV",
  "LT", "DK", "SE", "FI", "IE", "GR", "CY", "MT", "NO",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lineItems, subtotalCents } = await req.json();

    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      throw new Error("No line items provided");
    }

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

    // Build Stripe line items — handle both priceId-based and custom price items
    const stripeLineItems = lineItems.map((item: {
      priceId?: string;
      quantity: number;
      unitAmountCents?: number;
      name?: string;
    }) => {
      if (item.priceId) {
        return { price: item.priceId, quantity: item.quantity };
      }
      return {
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: item.unitAmountCents ?? 0,
          product_data: { name: item.name || "Morilles de feu séchées" },
        },
      };
    });

    // Add shipping fee if below threshold
    const needsShipping = typeof subtotalCents === "number"
      ? subtotalCents < FREE_SHIPPING_THRESHOLD_CENTS
      : false;

    if (needsShipping) {
      stripeLineItems.push({
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: SHIPPING_AMOUNT_CENTS,
          product_data: { name: "Frais de livraison" },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: stripeLineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ALLOWED_COUNTRIES as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      success_url: `${req.headers.get("origin")}/paiement-reussi`,
      cancel_url: `${req.headers.get("origin")}/paiement-annule`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
