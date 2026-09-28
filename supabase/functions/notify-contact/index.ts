import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { buildContactNotificationEmail } from "../_shared/orderEmails.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) throw new Error("Missing Supabase config");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const record = body.record;

    if (!record) {
      throw new Error('No record in payload');
    }

    const { name, email, message, type, created_at } = record;

    // Le trigger SQL (insert contact_messages) et l'appel direct du front notifient le même message :
    // un seul envoi par couple email + message sur 10 minutes (migration 20260928090000).
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(`${String(email ?? "").toLowerCase()}\n${String(message ?? "")}`),
    );
    const dedupKey = `contact:${Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
    const { data: claimed, error: claimError } = await supabase.rpc("claim_notification", { _key: dedupKey });
    if (claimError) {
      console.warn("claim_notification unavailable, sending without dedup:", claimError.message);
    } else if (claimed === false) {
      return new Response(JSON.stringify({ skipped: true, reason: "duplicate" }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const SITE_NAME = "Morilles du Canada";
    const SENDER_DOMAIN = "notify.morillesducanada.com";
    const FROM_DOMAIN = "morillesducanada.com";

    // Contenu échappé (nom, email et message viennent d'un formulaire public).
    const { subject, html: htmlContent, text } = buildContactNotificationEmail({
      id: record.id,
      name,
      email,
      message,
      type,
      created_at,
    });

    // Get or create unsubscribe token
    async function getUnsubscribeToken(recipientEmail: string): Promise<string> {
      const { data: existing } = await supabase
        .from("email_unsubscribe_tokens")
        .select("token")
        .eq("email", recipientEmail)
        .is("used_at", null)
        .maybeSingle();
      if (existing?.token) return existing.token;
      const token = crypto.randomUUID();
      await supabase.from("email_unsubscribe_tokens").insert({ email: recipientEmail, token });
      return token;
    }

    const adminEmail = "contact@morillesducanada.com";
    const ts = Date.now();
    const messageId = `contact-notification-${record.id}-${ts}`;
    const unsubToken = await getUnsubscribeToken(adminEmail);


    // Enqueue via pgmq
    const { error: enqueueError } = await supabase.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        to: adminEmail,
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        sender_domain: SENDER_DOMAIN,
        subject,
        html: htmlContent,
        text,
        purpose: "transactional",
        label: "contact-notification",
        message_id: messageId,
        idempotency_key: messageId,
        unsubscribe_token: unsubToken,
        queued_at: new Date().toISOString(),
      },
    });

    if (enqueueError) {
      console.error("Failed to enqueue contact notification:", enqueueError);
      throw new Error(`Enqueue failed: ${enqueueError.message}`);
    }

    // Log pending
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: "contact-notification",
      recipient_email: adminEmail,
      status: "pending",
    });

    console.log("Contact notification enqueued:", messageId);

    return new Response(JSON.stringify({ success: true, messageId }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending notification email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
