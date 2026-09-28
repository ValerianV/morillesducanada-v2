import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  escapeHtml,
  formatEuros,
  itemLineTotalCents,
  itemQuantity,
  safeHttpsUrl,
  type OrderItemLike,
} from "../_shared/format.ts";

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

type NotificationType = "order" | "preorder";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  if (ab.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i];
  return diff === 0;
}

function buildInvoiceTable(items: OrderItemLike[], totalAmount: number) {
  if (!Array.isArray(items) || items.length === 0) return "";

  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #2a2520; color: #e8dcc8; font-size: 13px;">
          ${escapeHtml(item.name || "Morilles de feu séchées")}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #2a2520; color: #e8dcc8; font-size: 13px; text-align: center;">
          ${itemQuantity(item)}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #2a2520; color: #e8dcc8; font-size: 13px; text-align: right;">
          ${formatEuros(itemLineTotalCents(item))}
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
          <td style="padding: 12px; text-align: right; font-size: 18px; color: #cc9a2e; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 600;">${formatEuros(totalAmount)}</td>
        </tr>
      </tfoot>
    </table>
  `;
}

function buildOrderEmail(customerName: string, status: string, type: NotificationType, details: string) {
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
        <p style="font-size: 16px; margin-bottom: 24px;">Bonjour ${escapeHtml(customerName)},</p>
        <div style="background: #2a2520; border: 1px solid #cc9a2e33; border-radius: 4px; padding: 24px; margin-bottom: 24px;">
          <p style="font-size: 14px; color: #8a7e6b; margin: 0 0 8px;">Statut de votre ${typeLabel}</p>
          <p style="font-size: 24px; margin: 0; color: #cc9a2e;">
            ${statusInfo.emoji} ${escapeHtml(statusInfo.fr)}
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

    // Authentification : clé service_role (triggers SQL) ou JWT d'un utilisateur admin.
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : "";
    if (!token) return jsonResponse({ error: "Unauthorized" }, 401);

    const isServiceRole = timingSafeEqual(token, supabaseServiceKey);
    if (!isServiceRole) {
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (userError || !userData?.user) return jsonResponse({ error: "Unauthorized" }, 401);
      const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      if (roleError || isAdmin !== true) return jsonResponse({ error: "Forbidden" }, 403);
    }

    // Le contenu de l'email est relu en base : le corps de la requête ne sert qu'à identifier la ligne.
    const body = await req.json().catch(() => null);
    const type = body?.type as NotificationType | undefined;
    const id = typeof body?.id === "string" ? body.id : body?.record?.id;
    const oldStatus = typeof body?.old_status === "string" ? body.old_status : undefined;
    if ((type !== "order" && type !== "preorder") || typeof id !== "string") {
      return jsonResponse({ error: "Missing or invalid type/id" }, 400);
    }

    const { data: record, error: recordError } = await supabase
      .from(type === "order" ? "orders" : "pre_orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (recordError) throw new Error(`Record lookup failed: ${recordError.message}`);
    if (!record) return jsonResponse({ error: "Record not found" }, 404);

    if (record.status === "pending" || record.status === oldStatus) {
      return jsonResponse({ skipped: true });
    }

    // Le trigger SQL et l'admin peuvent notifier le même changement : un seul envoi par version de la ligne.
    const dedupKey = `${type}:${record.id}:${record.status}:${record.updated_at ?? ""}`;
    const { data: claimed, error: claimError } = await supabase.rpc("claim_notification", { _key: dedupKey });
    if (claimError) {
      console.warn("claim_notification unavailable, sending without dedup:", claimError.message);
    } else if (claimed === false) {
      return jsonResponse({ skipped: true, reason: "duplicate" });
    }

    const customerEmail: string = record.email;
    let customerName: string;
    let details: string;
    const shortId = escapeHtml(String(record.id).substring(0, 8).toUpperCase());

    if (type === "order") {
      customerName = record.customer_name;
      const invoiceNumber = `FAC-${new Date(record.created_at).getFullYear()}-${shortId}`;

      details = `
        <p style="font-size: 14px; color: #e8dcc8;">
          <strong>Commande :</strong> ${shortId}<br/>
          <strong>Total :</strong> ${formatEuros(record.total_amount || 0)}
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
        const trackingUrl = safeHttpsUrl(record.tracking_url);
        const trackingInfo = record.tracking_number
          ? `
            <div style="background: #2a2520; border: 1px solid #cc9a2e33; border-radius: 4px; padding: 20px; margin-top: 16px;">
              <p style="font-size: 13px; color: #8a7e6b; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">Suivi de livraison</p>
              <p style="font-size: 16px; color: #e8dcc8; margin: 0 0 4px;">
                <strong>Transporteur :</strong> ${escapeHtml(record.carrier || "—")}
              </p>
              <p style="font-size: 16px; color: #e8dcc8; margin: 0 0 12px;">
                <strong>N° de suivi :</strong> ${escapeHtml(record.tracking_number)}
              </p>
              ${trackingUrl ? `<a href="${escapeHtml(trackingUrl)}" style="display: inline-block; padding: 10px 24px; background: linear-gradient(135deg, #cc9a2e, #d4a843); color: #1a1714; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">Suivre mon colis</a>` : ""}
            </div>
          `
          : `<p style="font-size: 14px; color: #e8dcc8;">Votre colis est en route ! Vous recevrez un numéro de suivi prochainement.</p>`;
        details += trackingInfo;
      }
    } else {
      customerName = record.contact_name;
      const morelLabel = record.morel_type === "brune" ? "Morilles brunes" : "Morilles blondes";
      details = `
        <p style="font-size: 14px; color: #e8dcc8;">
          <strong>Pré-commande :</strong> ${shortId}<br/>
          <strong>Type :</strong> ${morelLabel}<br/>
          <strong>Quantité :</strong> ${escapeHtml(record.quantity_kg)} kg<br/>
          <strong>Total :</strong> ${escapeHtml(record.total_amount)} €
        </p>
      `;
    }

    if (!customerEmail) return jsonResponse({ error: "Record has no email" }, 422);

    const statusInfo = STATUS_LABELS[record.status] || { fr: record.status, emoji: "📋" };
    const typeLabel = type === "order" ? "commande" : "pré-commande";

    const html = buildOrderEmail(customerName, record.status, type, details);
    const text = `Bonjour ${customerName}, votre ${typeLabel} est maintenant au statut: ${statusInfo.fr}.`;
    const subject = `${statusInfo.emoji} Votre ${typeLabel} — ${statusInfo.fr}`;
    const ts = Date.now();
    const messageId = `order-status-${record.id}-${record.status}-${ts}`;

    async function getUnsubscribeToken(email: string): Promise<string> {
      const { data: existing } = await supabase
        .from("email_unsubscribe_tokens")
        .select("token")
        .eq("email", email)
        .is("used_at", null)
        .maybeSingle();

      if (existing?.token) return existing.token;

      const newToken = crypto.randomUUID();
      await supabase.from("email_unsubscribe_tokens").insert({ email, token: newToken });
      return newToken;
    }

    const customerUnsubToken = await getUnsubscribeToken(customerEmail);

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

    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "order-status-notification",
      recipient_email: customerEmail,
      status: "pending",
    });

    const adminMessageId = `admin-order-status-${record.id}-${record.status}-${ts}`;
    const adminHtml = `<p>La ${typeLabel} de <strong>${escapeHtml(customerName)}</strong> (${escapeHtml(customerEmail)}) est passée au statut <strong>${escapeHtml(statusInfo.fr)}</strong>.</p>`;
    const adminUnsubToken = await getUnsubscribeToken("contact@morillesducanada.com");

    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: "contact@morillesducanada.com",
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        sender_domain: SENDER_DOMAIN,
        subject: `[Admin] ${statusInfo.emoji} ${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)} ${String(record.id).substring(0, 8).toUpperCase()} → ${statusInfo.fr}`,
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

    console.log("Emails enqueued successfully", {
      caller: isServiceRole ? "service_role" : "admin",
      status: record.status,
      messageId,
    });

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Notification error:", error);
    return jsonResponse({ error: "Notification failed" }, 500);
  }
});
