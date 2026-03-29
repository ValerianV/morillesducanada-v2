import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SITE_NAME = "Morilles du Canada";
const SENDER_DOMAIN = "notify.morillesducanada.com";
const FROM_DOMAIN = "morillesducanada.com";

const STATUS_LABELS: Record<string, { fr: string; emoji: string }> = {
  paid: { fr: "Paiement confirmé", emoji: "✅" },
  shipped: { fr: "Expédiée", emoji: "📦" },
  delivered: { fr: "Livrée", emoji: "🎉" },
  cancelled: { fr: "Annulée", emoji: "❌" },
  confirmed: { fr: "Confirmée", emoji: "✅" },
};

function buildInvoiceTable(items: any[], totalAmount: number) {
  if (!Array.isArray(items) || items.length === 0) return "";

  const rows = items
    .map(
      (item: any) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #2a2520; color: #e8dcc8; font-size: 13px;">
          ${item.name || item.product?.name || "Morilles de feu séchées"}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #2a2520; color: #e8dcc8; font-size: 13px; text-align: center;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #2a2520; color: #e8dcc8; font-size: 13px; text-align: right;">
          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)} €
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

function buildOrderEmail(customerName: string, status: string, type: "order" | "preorder", details: string) {
  const statusInfo = STATUS_LABELS[status] || { fr: status, emoji: "📋" };
  const typeLabel = type === "order" ? "commande" : "pré-commande";

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
          <p style="font-size: 14px; color: #8a7e6b; margin: 0 0 8px;">Statut de votre ${typeLabel}</p>
          <p style="font-size: 24px; margin: 0; color: #cc9a2e;">
            ${statusInfo.emoji} ${statusInfo.fr}
          </p>
        </div>
        ${details}
        <p style="font-size: 14px; color: #8a7e6b; margin-top: 24px;">
          Si vous avez des questions, répondez directement à cet e-mail ou contactez-nous à contact@morillesducanada.com.
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) throw new Error("Missing Supabase config");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { type, record, old_status } = await req.json();
    if (!record || !type) throw new Error("Missing type or record");

    if (record.status === "pending" || record.status === old_status) {
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let customerEmail: string;
    let customerName: string;
    let details: string;

    if (type === "order") {
      customerEmail = record.email;
      customerName = record.customer_name;
      const total = (record.total_amount / 100).toFixed(2);
      const invoiceNumber = `FAC-${new Date(record.created_at).getFullYear()}-${record.id.substring(0, 8).toUpperCase()}`;

      details = `
        <p style="font-size: 14px; color: #e8dcc8;">
          <strong>Commande :</strong> ${record.id.substring(0, 8).toUpperCase()}<br/>
          <strong>Total :</strong> ${total} €
        </p>
      `;

      if (record.status === "paid") {
        details += buildInvoiceTable(record.items || [], record.total_amount || 0);
        details += `
          <div style="background: #2a2520; border: 1px solid #cc9a2e33; border-radius: 4px; padding: 16px; margin-top: 16px; text-align: center;">
            <p style="font-size: 13px; color: #8a7e6b; margin: 0 0 8px;">Facture N° ${invoiceNumber}</p>
            <p style="font-size: 13px; color: #e8dcc8; margin: 0;">
              Votre facture est disponible dans votre espace client.<br/>
              Connectez-vous à votre compte pour la télécharger.
            </p>
          </div>
        `;
      }

      if (record.status === "shipped") {
        const trackingInfo = record.tracking_number
          ? `
            <div style="background: #2a2520; border: 1px solid #cc9a2e33; border-radius: 4px; padding: 20px; margin-top: 16px;">
              <p style="font-size: 13px; color: #8a7e6b; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">Suivi de livraison</p>
              <p style="font-size: 16px; color: #e8dcc8; margin: 0 0 4px;">
                <strong>Transporteur :</strong> ${record.carrier || "—"}
              </p>
              <p style="font-size: 16px; color: #e8dcc8; margin: 0 0 12px;">
                <strong>N° de suivi :</strong> ${record.tracking_number}
              </p>
              ${record.tracking_url ? `<a href="${record.tracking_url}" style="display: inline-block; padding: 10px 24px; background: linear-gradient(135deg, #cc9a2e, #d4a843); color: #1a1714; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">Suivre mon colis</a>` : ""}
            </div>
          `
          : `<p style="font-size: 14px; color: #e8dcc8;">Votre colis est en route ! Vous recevrez un numéro de suivi prochainement.</p>`;
        details += trackingInfo;
      }
    } else {
      customerEmail = record.email;
      customerName = record.contact_name;
      const morelLabel = record.morel_type === "brune" ? "Morilles brunes" : "Morilles blondes";
      details = `
        <p style="font-size: 14px; color: #e8dcc8;">
          <strong>Pré-commande :</strong> ${record.id.substring(0, 8).toUpperCase()}<br/>
          <strong>Type :</strong> ${morelLabel}<br/>
          <strong>Quantité :</strong> ${record.quantity_kg} kg<br/>
          <strong>Total :</strong> ${record.total_amount} €
        </p>
      `;
    }

    const statusInfo = STATUS_LABELS[record.status] || { fr: record.status, emoji: "📋" };
    const typeLabel = type === "order" ? "commande" : "pré-commande";

    const html = buildOrderEmail(customerName, record.status, type, details);
    const text = `Bonjour ${customerName}, votre ${typeLabel} est maintenant au statut: ${statusInfo.fr}.`;
    const subject = `${statusInfo.emoji} Votre ${typeLabel} — ${statusInfo.fr}`;
    const ts = Date.now();
    const messageId = `order-status-${record.id}-${record.status}-${ts}`;

    // Get or create unsubscribe token for the customer email
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

    const customerUnsubToken = await getUnsubscribeToken(customerEmail);

    // Enqueue customer email via pgmq
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
        label: "order-status-notification",
        message_id: messageId,
        idempotency_key: messageId,
        unsubscribe_token: customerUnsubToken,
        queued_at: new Date().toISOString(),
      },
    });

    if (enqueueError) {
      console.error("Failed to enqueue customer email:", enqueueError);
      throw new Error(`Enqueue failed: ${enqueueError.message}`);
    }

    // Log pending status
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "order-status-notification",
      recipient_email: customerEmail,
      status: "pending",
    });

    // Also enqueue admin notification
    const adminMessageId = `admin-order-status-${record.id}-${record.status}-${ts}`;
    const adminHtml = `<p>La ${typeLabel} de <strong>${customerName}</strong> (${customerEmail}) est passée au statut <strong>${statusInfo.fr}</strong>.</p>`;
    const adminUnsubToken = await getUnsubscribeToken("contact@morillesducanada.com");

    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: "contact@morillesducanada.com",
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        sender_domain: SENDER_DOMAIN,
        subject: `[Admin] ${statusInfo.emoji} ${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)} ${record.id.substring(0, 8).toUpperCase()} → ${statusInfo.fr}`,
        html: adminHtml,
        text: `La ${typeLabel} de ${customerName} (${customerEmail}) est passée au statut ${statusInfo.fr}.`,
        purpose: "transactional",
        label: "admin-order-notification",
        message_id: adminMessageId,
        idempotency_key: adminMessageId,
        unsubscribe_token: adminUnsubToken,
        queued_at: new Date().toISOString(),
      },
    });

    await supabase.from("email_send_log").insert({
      message_id: adminMessageId,
      template_name: "admin-order-notification",
      recipient_email: "contact@morillesducanada.com",
      status: "pending",
    });

    console.log("Emails enqueued successfully", { customerEmail, status: record.status, messageId });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Notification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
