// Précommande saison 2027 : session Stripe Checkout pour l'acompte de 50 %.
// Rien n'est écrit en base ici : stripe-webhook crée la ligne pre_orders après paiement.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { PREORDER_2027, PreorderValidationError, resolvePreorder } from "../_shared/catalog.ts";

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
      throw new PreorderValidationError("Requête invalide");
    }

    // Quantité validée ici (1 à 15 kg, kilo entier) ; montants recalculés à partir du catalogue.
    const amounts = resolvePreorder(body);
    const locale = (body as { locale?: unknown }).locale === "en" ? "en" : "fr";

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const siteUrl = resolveSiteUrl(req.headers.get("origin"));
    const metadata = {
      type: PREORDER_2027.type,
      season: PREORDER_2027.season,
      kg: String(amounts.kg),
      total_cents: String(amounts.totalCents),
      deposit_cents: String(amounts.depositCents),
      balance_cents: String(amounts.balanceCents),
      locale,
    };

    const terms =
      locale === "en"
        ? `Professionals only. 50% deposit paid today. Balance of €${amounts.balanceCents / 100} invoiced before shipping. Delivery in France, shipping included, guaranteed in ${PREORDER_2027.delivery.en}. Full refund of the deposit if we cannot supply.`
        : `Réservé aux professionnels. Acompte de 50 % payé aujourd'hui. Solde de ${amounts.balanceCents / 100} € facturé avant expédition. Livraison en France, port inclus, garantie en ${PREORDER_2027.delivery.fr}. Acompte intégralement remboursé s'il m'est impossible de fournir.`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale,
      line_items: [{ price: PREORDER_2027.priceId, quantity: amounts.kg }],
      shipping_address_collection: {
        allowed_countries: [...PREORDER_2027.countries] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      phone_number_collection: { enabled: true },
      customer_creation: "always",
      // Précommande réservée aux professionnels : société et SIRET obligatoires (contrôlés par stripe-webhook).
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
        description: `Acompte précommande saison ${PREORDER_2027.season} — ${amounts.kg} kg`,
        metadata,
      },
      success_url: `${siteUrl}/precommande-confirmee?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/precommande-2027`,
    });

    // Le montant facturé vient du prix Stripe : on signale tout écart avec le catalogue serveur.
    if (session.amount_total !== null && session.amount_total !== amounts.depositCents) {
      console.error("Preorder deposit mismatch", {
        sessionId: session.id,
        expectedDepositCents: amounts.depositCents,
        stripeTotalCents: session.amount_total,
      });
    }

    return jsonResponse({ url: session.url }, 200);
  } catch (error) {
    if (error instanceof PreorderValidationError) {
      return jsonResponse({ error: error.message }, 400);
    }
    console.error("Pre-order checkout error:", error);
    return jsonResponse({ error: "Erreur lors de la création du paiement" }, 500);
  }
});
