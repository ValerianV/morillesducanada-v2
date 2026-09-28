import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import type { OrderItemLike } from "../_shared/format.ts";
import { PREORDER_2027, preorderAmounts } from "../_shared/catalog.ts";
import { isValidSiret, normalizeSiret } from "../_shared/siret.ts";
import { buildPreorderAdminEmail, buildPreorderConfirmationEmail } from "../_shared/preorderEmail.ts";
import { buildAdminNewOrderEmail, buildOrderConfirmationEmail, type ShippingAddressLike } from "../_shared/orderEmails.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const SITE_NAME = "Morilles du Canada";
const SENDER_DOMAIN = "notify.morillesducanada.com";
const FROM_DOMAIN = "morillesducanada.com";
const ADMIN_EMAIL = "contact@morillesducanada.com";

async function getUnsubscribeToken(email: string): Promise<string> {
  const { data: existing } = await supabase
    .from("email_unsubscribe_tokens")
    .select("token")
    .eq("email", email)
    .is("used_at", null)
    .maybeSingle();

  if (existing?.token) return existing.token;

  const token = crypto.randomUUID();
  await supabase.from("email_unsubscribe_tokens").insert({ email, token });
  return token;
}

// Champs personnalisés Stripe (liens de paiement pros et précommande) : société et SIRET.
function customField(session: Stripe.Checkout.Session, key: string): string | null {
  const field = session.custom_fields?.find((f: Stripe.Checkout.Session.CustomField) => f.key === key);
  const value = field?.text?.value ?? field?.numeric?.value ?? field?.dropdown?.value ?? null;
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function sessionBusiness(session: Stripe.Checkout.Session) {
  const company = customField(session, "company") ?? session.customer_details?.business_name ?? null;
  const rawSiret = customField(session, "siret");
  const siret = rawSiret ? normalizeSiret(rawSiret) : null;
  if (siret && !isValidSiret(siret)) {
    console.warn("SIRET invalide (clé de Luhn) saisi au paiement", { sessionId: session.id });
  }
  return { company, siret };
}

async function sendOrderConfirmationEmail(
  orderId: string,
  customerEmail: string,
  customerName: string,
  items: OrderItemLike[],
  totalAmount: number,
  shippingAddress: ShippingAddressLike | null,
  business: { company: string | null; siret: string | null },
) {
  const input = { orderId, customerName, items, totalCents: totalAmount, shippingAddress, ...business };
  if (customerEmail) {
    await enqueueTransactional(customerEmail, "order-confirmation", `order-confirmation-${orderId}`, buildOrderConfirmationEmail(input));
  }
  await enqueueTransactional(
    ADMIN_EMAIL,
    "admin-new-order",
    `admin-new-order-${orderId}`,
    buildAdminNewOrderEmail({ ...input, customerEmail }),
  );
  console.log("Order confirmation emails enqueued", { orderId });
}


// API Stripe >= 2025-03-31.basil : l'adresse est dans collected_information.shipping_details.
// Repli sur l'ancien champ de premier niveau (sessions créées avec une version d'API antérieure).
type ShippingDetails = Stripe.Checkout.Session.CollectedInformation.ShippingDetails;
function sessionShippingAddress(session: Stripe.Checkout.Session) {
  const legacyShipping = (session as unknown as { shipping_details?: ShippingDetails | null }).shipping_details;
  const shipping: ShippingDetails | null = session.collected_information?.shipping_details ?? legacyShipping ?? null;
  return {
    shipping,
    address: shipping
      ? {
          name: shipping.name,
          line1: shipping.address?.line1,
          line2: shipping.address?.line2,
          city: shipping.address?.city,
          postal_code: shipping.address?.postal_code,
          country: shipping.address?.country,
        }
      : null,
  };
}

async function enqueueTransactional(to: string, label: string, messageId: string, email: { subject: string; html: string; text: string }) {
  const unsubscribeToken = await getUnsubscribeToken(to);
  const { error } = await supabase.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      to,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject: email.subject,
      html: email.html,
      text: email.text,
      purpose: "transactional",
      label,
      message_id: messageId,
      idempotency_key: messageId,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  });
  if (error) {
    console.error(`Failed to enqueue ${label}:`, error);
    return;
  }
  await supabase.from("email_send_log").insert({
    message_id: messageId,
    template_name: label,
    recipient_email: to,
    status: "pending",
  });
}

// Précommande 2027 : une ligne pre_orders par session payée, puis emails client et admin.
async function handlePreorderSession(session: Stripe.Checkout.Session): Promise<Response> {
  const ok = () => new Response(JSON.stringify({ received: true }), { status: 200 });

  if (session.payment_status !== "paid") {
    console.warn("Preorder session not paid yet:", session.id, session.payment_status);
    return ok();
  }

  const { data: existing } = await supabase
    .from("pre_orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();
  if (existing) {
    console.log("Pre-order already exists for session:", session.id);
    return ok();
  }

  // La quantité fait foi côté Stripe (ligne unique au prix d'acompte) ; les métadonnées ne servent qu'au contrôle.
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 });
  const depositLine = lineItems.data.find((item: Stripe.LineItem) => item.price?.id === PREORDER_2027.priceId);
  const kg = depositLine?.quantity ?? Number(session.metadata?.kg);
  let amounts;
  try {
    amounts = preorderAmounts(kg);
  } catch (err) {
    console.error("Invalid pre-order quantity", { sessionId: session.id, kg, err: String(err) });
    return new Response(JSON.stringify({ error: "Invalid pre-order quantity" }), { status: 500 });
  }
  if (session.amount_total !== amounts.depositCents) {
    console.error("Preorder deposit mismatch", {
      sessionId: session.id,
      expectedDepositCents: amounts.depositCents,
      stripeTotalCents: session.amount_total,
    });
  }

  const { shipping, address } = sessionShippingAddress(session);
  const email = session.customer_details?.email || session.customer_email || "";
  const customerName = session.customer_details?.name || shipping?.name || email;
  const phone = session.customer_details?.phone ?? null;
  const { company, siret } = sessionBusiness(session);
  const locale = session.metadata?.locale === "en" ? "en" : "fr";
  const preorderId = crypto.randomUUID();

  const { error: insertError } = await supabase.from("pre_orders").insert({
    id: preorderId,
    saison: PREORDER_2027.season,
    kg: amounts.kg,
    acompte_cents: amounts.depositCents,
    solde_cents: amounts.balanceCents,
    quantity_kg: amounts.kg,
    total_amount: amounts.totalCents / 100,
    company_name: company,
    siret,
    contact_name: customerName,
    email,
    phone,
    shipping_address: address,
    locale,
    stripe_session_id: session.id,
    stripe_payment_intent:
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null,
    status: "acompte_paye",
  });

  if (insertError) {
    // Violation d'unicité : un rejeu concurrent a déjà créé la ligne.
    if ((insertError as { code?: string }).code === "23505") return ok();
    console.error("Failed to insert pre-order:", insertError);
    return new Response(JSON.stringify({ error: "Failed to create pre-order" }), { status: 500 });
  }
  console.log("Pre-order created for session:", session.id);

  try {
    if (email) {
      const confirmation = buildPreorderConfirmationEmail({ preorderId, customerName, amounts, locale });
      await enqueueTransactional(email, "preorder-confirmation", `preorder-confirmation-${preorderId}`, confirmation);
    }
    const admin = buildPreorderAdminEmail({ preorderId, customerName, amounts, locale, email, phone, company, siret });
    await enqueueTransactional(ADMIN_EMAIL, "admin-new-preorder", `admin-new-preorder-${preorderId}`, admin);
  } catch (emailErr) {
    console.error("Failed to send pre-order emails (non-blocking):", emailErr);
  }

  return ok();
}

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Webhook signature verification failed:", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Only handle payment mode sessions
    if (session.mode !== "payment") {
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    if (session.metadata?.type === PREORDER_2027.type) {
      return await handlePreorderSession(session);
    }

    // Check if order already exists for this session
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (existing) {
      console.log("Order already exists for session:", session.id);
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    // Retrieve line items from Stripe
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    const items = lineItems.data.map((item: Stripe.LineItem) => ({
      name: item.description,
      quantity: item.quantity,
      unit_amount: item.price?.unit_amount,
      price_id: item.price?.id,
    }));

    const { shipping, address: shippingAddress } = sessionShippingAddress(session);

    // Garde-fou : Stripe limite déjà les pays à la zone payée ; on trace tout écart éventuel.
    // Liens de paiement pros : livraison en France uniquement, port inclus.
    if (shippingAddress?.country && shippingAddress.country !== "FR") {
      console.error("Adresse de livraison hors de France", { sessionId: session.id, country: shippingAddress.country });
    }

    // Get customer email & name
    const customerEmail = session.customer_details?.email || session.customer_email || "";
    const customerName = session.customer_details?.name || shipping?.name || customerEmail;

    // Try to find user_id from email
    let userId: string | null = null;
    if (customerEmail) {
      const { data: authData } = await supabase.auth.admin.listUsers();
      const matchedUser = authData?.users?.find(
        (u) => u.email?.toLowerCase() === customerEmail.toLowerCase()
      );
      if (matchedUser) {
        userId = matchedUser.id;
      }
    }

    // Generate order ID to use for both insert and email
    const orderId = crypto.randomUUID();

    const { error: insertError } = await supabase.from("orders").insert({
      id: orderId,
      email: customerEmail,
      customer_name: customerName,
      items,
      total_amount: session.amount_total || 0,
      currency: session.currency || "eur",
      shipping_address: shippingAddress,
      stripe_session_id: session.id,
      stripe_payment_intent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null,
      status: "paid",
      user_id: userId,
    });

    if (insertError) {
      console.error("Failed to insert order:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
      });
    }

    console.log("Order created for session:", session.id);

    // Send confirmation email (non-blocking — don't fail the webhook on email error)
    try {
      await sendOrderConfirmationEmail(orderId, customerEmail, customerName, items, session.amount_total || 0, shippingAddress, sessionBusiness(session));
    } catch (emailErr) {
      console.error("Failed to send confirmation email (non-blocking):", emailErr);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});