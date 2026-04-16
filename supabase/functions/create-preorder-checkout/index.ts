import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Tarifs synchronisés avec PreOrder.tsx (getPricePerKg)
// brune : 360€/kg (< 5kg), 340€/kg (≥ 5kg)
// blonde-grise : 390€/kg (< 5kg), 370€/kg (≥ 5kg)
function getPricePerKgCents(morelType: string, quantityKg: number): number {
  if (morelType === "brune") {
    return quantityKg >= 5 ? 34000 : 36000;
  }
  return quantityKg >= 5 ? 37000 : 39000;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName, contactName, email, phone, morelType, quantityKg, notes } = await req.json();

    if (!companyName || !contactName || !email || !morelType || !quantityKg) {
      throw new Error("Missing required fields");
    }

    if (!["brune", "blonde-grise"].includes(morelType)) {
      throw new Error("Invalid morel type");
    }

    if (quantityKg <= 0 || quantityKg > 20) {
      throw new Error("Invalid quantity");
    }

    const totalAmountCents = Math.round(quantityKg * getPricePerKgCents(morelType, quantityKg));
    const totalAmountEuros = totalAmountCents / 100;

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Create or find customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email,
        name: `${contactName} - ${companyName}`,
        phone,
      });
      customerId = customer.id;
    }

    // Save pre-order to database
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: preOrder, error: dbError } = await supabaseAdmin
      .from("pre_orders")
      .insert({
        company_name: companyName,
        contact_name: contactName,
        email,
        phone: phone || null,
        morel_type: morelType,
        quantity_kg: quantityKg,
        total_amount: totalAmountEuros,
        notes: notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Create Stripe checkout session
    const morelLabel = morelType === "brune" ? "Morilles brunes" : "Morilles blondes & grises";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Pré-commande ${morelLabel} — ${quantityKg} kg`,
              description: `Pré-commande professionnelle saison 2026. ${morelLabel}, ${quantityKg} kg.`,
            },
            unit_amount: totalAmountCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        pre_order_id: preOrder.id,
        morel_type: morelType,
        quantity_kg: String(quantityKg),
      },
      success_url: `${req.headers.get("origin")}/precommande-confirmee?id=${preOrder.id}`,
      cancel_url: `${req.headers.get("origin")}/pre-commande`,
    });

    // Update pre-order with Stripe session ID
    await supabaseAdmin
      .from("pre_orders")
      .update({ stripe_session_id: session.id })
      .eq("id", preOrder.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Pre-order checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
