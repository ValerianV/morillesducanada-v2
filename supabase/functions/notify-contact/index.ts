import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

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

    const typeLabel = type === 'professionnel' ? '🏢 Professionnel' : '👤 Particulier';
    const date = new Date(created_at).toLocaleString('fr-FR', {
      dateStyle: 'long',
      timeStyle: 'short',
    });

    const SITE_NAME = "Morilles du Canada";
    const SENDER_DOMAIN = "notify.morillesducanada.com";
    const FROM_DOMAIN = "morillesducanada.com";

    const htmlContent = `
      <div style="font-family: 'Raleway', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; color: #1a1714; font-size: 28px; margin: 0;">
            Nouveau message de contact
          </h1>
          <p style="color: #cc9a2e; font-size: 14px; margin-top: 4px;">${typeLabel}</p>
        </div>
        
        <div style="background: white; border-radius: 8px; padding: 24px; border: 1px solid #e8e4df;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #8a7e6b; font-size: 13px; width: 100px;">Nom</td>
              <td style="padding: 8px 0; color: #1a1714; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #8a7e6b; font-size: 13px;">Email</td>
              <td style="padding: 8px 0; color: #1a1714;">
                <a href="mailto:${email}" style="color: #cc9a2e; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #8a7e6b; font-size: 13px;">Date</td>
              <td style="padding: 8px 0; color: #1a1714;">${date}</td>
            </tr>
          </table>
          
          <hr style="border: none; border-top: 1px solid #e8e4df; margin: 16px 0;" />
          
          <div style="color: #1a1714; line-height: 1.6; white-space: pre-wrap;">${message}</div>
        </div>
        
        <p style="text-align: center; color: #8a7e6b; font-size: 12px; margin-top: 24px;">
          Morilles du Canada — Notification automatique
        </p>
      </div>
    `;

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

    const subject = `📩 Nouveau message de ${name} (${typeLabel})`;
    const text = `Nouveau message de ${name} (${email}) - ${typeLabel}: ${message}`;

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
