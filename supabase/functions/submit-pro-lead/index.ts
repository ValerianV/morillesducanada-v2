// Demandes professionnelles (devis au kilo, dégustation en main propre).
// Appelée depuis /professionnels avec la clé anon (verify_jwt = false dans config.toml).
// Validation, honeypot, limite de 5 envois par heure par email ou par IP, devis recalculé
// avec la grille partagée, insertion en service_role, puis 2 emails Resend.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import {
  CONTACT_EMAIL,
  SENDER,
  adminSubject,
  buildAdminEmail,
  buildProspectEmail,
  isHoneypotTriggered,
  validateProLead,
  type EmailContent,
} from "../_shared/proLead.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RATE_LIMIT_PER_HOUR = 5;
const MAX_BODY_BYTES = 20_000;

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}

function clientIp(req: Request): string | null {
  const direct = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-real-ip");
  if (direct) return direct.trim();
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() || null : null;
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sendResend(
  apiKey: string,
  to: string,
  replyTo: string,
  content: EmailContent,
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: SENDER,
      to: [to],
      reply_to: replyTo,
      subject: content.subject,
      html: content.html,
      text: content.text,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const declaredLength = Number(req.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) return json({ error: "payload_too_large" }, 413);

  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return json({ error: "payload_too_large" }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  // Robot : on répond comme un succès, sans rien enregistrer ni envoyer.
  if (isHoneypotTriggered(body)) {
    console.warn("submit-pro-lead: honeypot rempli, demande ignorée");
    return json({ ok: true }, 200);
  }

  const validation = validateProLead(body);
  if (!validation.ok) return json({ error: "validation", fields: validation.errors }, 400);
  const { lead, quote } = validation;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    console.error("submit-pro-lead: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant");
    return json({ error: "server_misconfigured" }, 500);
  }
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const ip = clientIp(req);
  const ipHash = ip
    ? await sha256Hex(`${Deno.env.get("PRO_LEAD_IP_SALT") ?? "morillesducanada-pro-leads"}:${ip}`)
    : null;

  // Limite : 5 demandes par heure par email, et par IP quand elle est connue.
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const byEmail = await admin
    .from("pro_leads")
    .select("id", { count: "exact", head: true })
    .eq("email", lead.email)
    .gte("created_at", since);
  if (byEmail.error) {
    console.error("submit-pro-lead: comptage email impossible", byEmail.error.message);
    return json({ error: "server_error" }, 500);
  }
  let recent = byEmail.count ?? 0;
  if (ipHash) {
    const byIp = await admin
      .from("pro_leads")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if (byIp.error) {
      console.error("submit-pro-lead: comptage IP impossible", byIp.error.message);
      return json({ error: "server_error" }, 500);
    }
    recent = Math.max(recent, byIp.count ?? 0);
  }
  if (recent >= RATE_LIMIT_PER_HOUR) return json({ error: "rate_limited" }, 429);

  const { data: inserted, error: insertError } = await admin
    .from("pro_leads")
    .insert({
      kind: lead.kind,
      company: lead.company,
      siret: lead.siret,
      contact_name: lead.contact_name,
      email: lead.email,
      phone: lead.phone,
      establishment_type: lead.establishment_type,
      city: lead.city,
      postal_code: lead.postal_code,
      address: lead.address,
      availability: lead.availability,
      kg: lead.kg,
      message: lead.message,
      utm: lead.utm,
      locale: lead.locale,
      price_tier: quote?.tier.id ?? null,
      unit_price_cents: quote?.unitPriceCents ?? null,
      total_cents: quote?.totalCents ?? null,
      ip_hash: ipHash,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("submit-pro-lead: insertion impossible", insertError?.message);
    return json({ error: "server_error" }, 500);
  }

  // La demande est enregistrée (visible dans l'admin) : un échec d'email ne la fait pas perdre.
  let emailed = false;
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.error("submit-pro-lead: RESEND_API_KEY manquant, emails non envoyés", adminSubject(lead));
  } else {
    const [adminResult, prospectResult] = await Promise.allSettled([
      sendResend(resendKey, CONTACT_EMAIL, lead.email, buildAdminEmail(lead, quote, inserted.id)),
      sendResend(resendKey, lead.email, CONTACT_EMAIL, buildProspectEmail(lead, quote)),
    ]);
    if (adminResult.status === "rejected") {
      console.error("submit-pro-lead: alerte admin non envoyée", String(adminResult.reason));
    } else {
      emailed = true;
      const { error } = await admin
        .from("pro_leads")
        .update({ admin_notified_at: new Date().toISOString() })
        .eq("id", inserted.id);
      if (error) console.warn("submit-pro-lead: admin_notified_at non enregistré", error.message);
    }
    if (prospectResult.status === "rejected") {
      console.error("submit-pro-lead: accusé de réception non envoyé", String(prospectResult.reason));
    }
  }

  return json(
    {
      ok: true,
      id: inserted.id,
      emailed,
      quote: quote
        ? { kg: quote.kg, tier: quote.tier.id, unitPriceCents: quote.unitPriceCents, totalCents: quote.totalCents }
        : null,
    },
    200,
  );
});
