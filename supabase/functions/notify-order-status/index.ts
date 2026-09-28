import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { buildAdminStatusEmail, buildStatusEmail, type NotificationType, type StatusRecord } from "../_shared/orderEmails.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SITE_NAME = "Morilles du Canada";
const SENDER_DOMAIN = "notify.morillesducanada.com";
const FROM_DOMAIN = "morillesducanada.com";

const ADMIN_EMAIL = "contact@morillesducanada.com";

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
    if (!customerEmail) return jsonResponse({ error: "Record has no email" }, 422);

    const { subject, html, text } = buildStatusEmail(type, record as StatusRecord);
    const admin = buildAdminStatusEmail(type, record as StatusRecord);
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
    const adminUnsubToken = await getUnsubscribeToken(ADMIN_EMAIL);

    await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: ADMIN_EMAIL,
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        sender_domain: SENDER_DOMAIN,
        subject: admin.subject,
        html: admin.html,
        text: admin.text,
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
      recipient_email: ADMIN_EMAIL,
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
