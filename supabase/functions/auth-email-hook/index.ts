import { Webhook } from 'npm:standardwebhooks@1.0.0'
import { authVerifyUrl, buildAuthEmail, isAuthEmailType, type AuthEmailType } from '../_shared/authEmails.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
// Secret du hook « Send Email » (Dashboard → Auth → Hooks), format « v1,whsec_... »
const SEND_EMAIL_HOOK_SECRET = (Deno.env.get('SEND_EMAIL_HOOK_SECRET') ?? '').replace('v1,whsec_', '')
const FROM = 'Morilles du Canada <noreply@morillesducanada.com>'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sendResend(to: string, email: { subject: string; html: string; text: string }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject: email.subject, html: email.html, text: email.text }),
  })
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return (await res.json()) as { id?: string }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (!RESEND_API_KEY || !SEND_EMAIL_HOOK_SECRET) {
    console.error('RESEND_API_KEY or SEND_EMAIL_HOOK_SECRET not configured')
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Standard Webhooks : seul Supabase Auth, qui connaît le secret, peut déclencher un envoi.
  const payload = await req.text()
  let body: any
  try {
    const wh = new Webhook(SEND_EMAIL_HOOK_SECRET)
    body = wh.verify(payload, Object.fromEntries(req.headers))
  } catch (err) {
    console.warn('Invalid webhook signature', { error: err instanceof Error ? err.message : String(err) })
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Supabase auth hook payload format
  const { user, email_data } = body
  if (!user?.email || !email_data?.email_action_type) {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const emailType = email_data.email_action_type
  if (!isAuthEmailType(emailType)) {
    console.error('Unknown email type', { emailType })
    return new Response(JSON.stringify({ error: `Unknown email type: ${emailType}` }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const verifyUrl = (tokenHash: string | undefined, type: AuthEmailType) =>
    tokenHash && SUPABASE_URL
      ? authVerifyUrl({ supabaseUrl: SUPABASE_URL, tokenHash, type, redirectTo: email_data.redirect_to })
      : undefined

  // Changement d'email sécurisé : un lien pour l'adresse actuelle (token_hash) et un pour la nouvelle
  // (token_hash_new). Sinon, un seul envoi.
  const sends: Array<{ to: string; url?: string }> = []
  if (emailType === 'email_change' && user.new_email) {
    if (email_data.token_hash_new) {
      sends.push({ to: user.email, url: verifyUrl(email_data.token_hash, 'email_change') })
      sends.push({ to: user.new_email, url: verifyUrl(email_data.token_hash_new, 'email_change') })
    } else {
      sends.push({ to: user.new_email, url: verifyUrl(email_data.token_hash, 'email_change') })
    }
  } else {
    sends.push({ to: user.email, url: verifyUrl(email_data.token_hash, emailType) })
  }

  let result: { id?: string } = {}
  try {
    for (const send of sends) {
      const email = buildAuthEmail(emailType, {
        verifyUrl: send.url,
        token: email_data.token,
        email: user.email,
        newEmail: user.new_email,
      })
      result = await sendResend(send.to, email)
      console.log('Email sent', { id: result.id, type: emailType })
    }
  } catch (err) {
    console.error('Resend error', { error: err instanceof Error ? err.message : String(err) })
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true, id: result.id }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
