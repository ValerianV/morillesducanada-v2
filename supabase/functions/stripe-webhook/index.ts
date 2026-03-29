import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

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

function buildInvoiceTable(items: any[], totalAmount: number) {
  if (!Array.isArray(items) || items.length === 0) return "";

  const rows = items
    .map(
      (item: any) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #2a2520; color: #e8dcc8; font-size: 13px;">
          ${item.name || "Morilles de feu séchées"}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #2a2520; color: #e8dcc8; font-size: 13px; text-align: center;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #2a2520; color: #e8dcc8; font-size: 13px; text-align: right;">
          ${(((item.unit_amount || 0) * (item.quantity || 1)) / 100).toFixed(2)} €
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <thead>
        <tr style="border-bottom: 2px solid #cc9a2e;">
          <th style="padding: 8px 12px; text-align: left; font-size: 11px; color: #8a7e6b; text-transform: uppercase; letter-spacing: 0.05em;">Produit</th>
          <th style="padding: 8px 12px; text-align: center; font-size: 11px; color: #8a7e6b; text-transform: uppercase;">Qté</th>
          <th style="padding: 8px 12px; text-align: right; font-size: 11px; color: #8a7e6b; text-transform: uppercase;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding: 12px; text-align: right; font-size: 14px; color: #8a7e6b; font-weight: 600;">Total TTC</td>
          <td style="padding: 12px; text-align: right; font-size: 18px; color: #cc9a2e; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600;">${(totalAmount / 100).toFixed(2)} €</td>
        </tr>
      </tfoot>
    </table>
  `;
}

function buildConfirmationEmail(customerName: string, orderId: string, items: any[], totalAmount: number, shippingAddress: any) {
  const shortId = orderId.substring(0, 8).toUpperCase();
  const invoiceNumber = `FAC-${new Date().getFullYear()}-${shortId}`;
  const invoiceTable = buildInvoiceTable(items, totalAmount);

  const shippingBlock = shippingAddress
    ? `
      <div style="background: #2a2520; border: 1px solid #cc9a2e33; border-radius: 4px; padding: 16px; margin-top: 16px;">
        <p style="font-size: 11px; color: #8a7e6b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;">Adresse de livraison</p>
        <p style="font-size: 14px; color: #e8dcc8; margin: 0; line-height: 1.5;">
          ${shippingAddress.name || ""}<br/>
          ${shippingAddress.line1 || ""}${shippingAddress.line2 ? "<br/>" + shippingAddress.line2 : ""}<br/>
          ${shippingAddress.postal_code || ""} ${shippingAddress.city || ""}<br/>
          ${shippingAddress.country || ""}
        </p>
      </div>
    `
    : "";

  return `
    <div style="font-family: 'Raleway', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1714; padding: 0;">
      <div style="background: linear-gradient(135deg, #cc9a2e, #d4a843); padding: 32px; text-align: center;">
        <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; color: #1a1714; font-size: 28px; margin: 0;">
          Morilles du Canada
        </h1>
      </div>
      <div style="padding: 32px; color: #e8dcc8;">
        <p style="font-size: 16px; margin-bottom: 24px;">Bonjour ${customerName},</p>
        <div style="background: #2a2520; border: 1px solid #cc9a2e33; border-radius: 4px; padding: 24px; margin-bottom: 24px;">
          <p style="font-size: 14px; color: #8a7e6b; margin: 0 0 8px;">Statut de votre commande</p>
          <p style="font-size: 24px; margin: 0; color: #cc9a2e;">
            ✅ Paiement confirmé
          </p>
        </div>
        <p style="font-size: 14px; color: #e8dcc8;">
          Merci pour votre commande ! Votre paiement a été confirmé avec succès.
        </p>
        <p style="font-size: 14px; color: #e8dcc8;">
          <strong>Commande :</strong> ${shortId}<br/>
          <strong>Total :</strong> ${(totalAmount / 100).toFixed(2)} €
        </p>
        ${invoiceTable}
        <div style="background: #2a2520; border: 1px solid #cc9a2e33; border-radius: 4px; padding: 16px; margin-top: 16px; text-align: center;">
          <p style="font-size: 13px; color: #8a7e6b; margin: 0 0 8px;">Facture N° ${invoiceNumber}</p>
          <p style="font-size: 13px; color: #e8dcc8; margin: 0;">
            Votre facture est disponible dans votre espace client.<br/>
            Connectez-vous à votre compte pour la télécharger.
          </p>
        </div>
        ${shippingBlock}
        <p style="font-size: 14px; color: #8a7e6b; margin-top: 24px;">
          Vous recevrez un e-mail dès que votre commande sera expédiée.<br/>
          Si vous avez des questions, contactez-nous à contact@morillesducanada.com.
        </p>
      </div>
      <div style="padding: 16px 32px; text-align: center; border-top: 1px solid #cc9a2e1a;">
        <p style="color: #8a7e6b; font-size: 11px; margin: 0;">
          © ${new Date().getFullYear()} Morilles du Canada · Morilles de feu séchées du Canada
        </p>
      </div>
    </div>
  `;
}

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

async function sendOrderConfirmationEmail(
  orderId: string,
  customerEmail: string,
  customerName: string,
  items: any[],
  totalAmount: number,
  shippingAddress: any
) {
  const html = buildConfirmationEmail(customerName, orderId, items, totalAmount, shippingAddress);
  const text = `Bonjour ${customerName}, merci pour votre commande ! Votre paiement de ${(totalAmount / 100).toFixed(2)} € a été confirmé. Commande : ${orderId.substring(0, 8).toUpperCase()}.`;
  const subject = `✅ Confirmation de votre commande — Morilles du Canada`;
  const ts = Date.now();
  const messageId = `order-confirmation-${orderId}-${ts}`;

  const unsubToken = await getUnsubscribeToken(customerEmail);

  // Enqueue customer confirmation email
  const { error: enqueueError } = await supabase.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      to: customerEmail,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: "transactional",
      label: "order-confirmation",
      message_id: messageId,
      idempotency_key: messageId,
      unsubscribe_token: unsubToken,
      queued_at: new Date().toISOString(),
    },
  });

  if (enqueueError) {
    console.error("Failed to enqueue order confirmation email:", enqueueError);
    return;
  }

  await supabase.from("email_send_log").insert({
    message_id: messageId,
    template_name: "order-confirmation",
    recipient_email: customerEmail,
    status: "pending",
  });

  // Enqueue admin notification
  const adminMessageId = `admin-new-order-${orderId}-${ts}`;
  const adminUnsubToken = await getUnsubscribeToken("contact@morillesducanada.com");
  const adminHtml = `
    <p>Nouvelle commande reçue de <strong>${customerName}</strong> (${customerEmail}).</p>
    <p><strong>Commande :</strong> ${orderId.substring(0, 8).toUpperCase()}<br/>
    <strong>Total :</strong> ${(totalAmount / 100).toFixed(2)} €</p>
  `;

  await supabase.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      to: "contact@morillesducanada.com",
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject: `[Admin] 🛒 Nouvelle commande ${orderId.substring(0, 8).toUpperCase()} — ${(totalAmount / 100).toFixed(2)} €`,
      html: adminHtml,
      text: `Nouvelle commande de ${customerName} (${customerEmail}). Total: ${(totalAmount / 100).toFixed(2)} €.`,
      purpose: "transactional",
      label: "admin-new-order",
      message_id: adminMessageId,
      idempotency_key: adminMessageId,
      unsubscribe_token: adminUnsubToken,
      queued_at: new Date().toISOString(),
    },
  });

  await supabase.from("email_send_log").insert({
    message_id: adminMessageId,
    template_name: "admin-new-order",
    recipient_email: "contact@morillesducanada.com",
    status: "pending",
  });

  console.log("Order confirmation emails enqueued", { customerEmail, orderId, messageId });
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
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Only handle payment mode sessions
    if (session.mode !== "payment") {
      return new Response(JSON.stringify({ received: true }), { status: 200 });
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

    const items = lineItems.data.map((item) => ({
      name: item.description,
      quantity: item.quantity,
      unit_amount: item.price?.unit_amount,
      price_id: item.price?.id,
    }));

    // Get shipping address
    const shipping = session.shipping_details;
    const shippingAddress = shipping
      ? {
          name: shipping.name,
          line1: shipping.address?.line1,
          line2: shipping.address?.line2,
          city: shipping.address?.city,
          postal_code: shipping.address?.postal_code,
          country: shipping.address?.country,
        }
      : null;

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
      await sendOrderConfirmationEmail(orderId, customerEmail, customerName, items, session.amount_total || 0, shippingAddress);
    } catch (emailErr) {
      console.error("Failed to send confirmation email (non-blocking):", emailErr);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});