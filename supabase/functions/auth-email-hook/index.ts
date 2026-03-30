import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { SignupEmail } from '../_shared/email-templates/signup.tsx'
import { InviteEmail } from '../_shared/email-templates/invite.tsx'
import { MagicLinkEmail } from '../_shared/email-templates/magic-link.tsx'
import { RecoveryEmail } from '../_shared/email-templates/recovery.tsx'
import { EmailChangeEmail } from '../_shared/email-templates/email-change.tsx'
import { ReauthenticationEmail } from '../_shared/email-templates/reauthentication.tsx'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const FROM = 'Morilles du Canada <noreply@morillesducanada.com>'
const SITE_NAME = 'Morilles du Canada'
const SITE_URL = 'https://morillesducanada.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const EMAIL_SUBJECTS: Record<string, string> = {
  signup: 'Confirmez votre adresse e-mail',
  invite: 'Vous êtes invité(e)',
  magiclink: 'Votre lien de connexion',
  recovery: 'Réinitialisation du mot de passe',
  email_change: 'Confirmez votre nouvelle adresse e-mail',
  reauthentication: 'Votre code de vérification',
}

const EMAIL_TEMPLATES: Record<string, React.ComponentType<any>> = {
  signup: SignupEmail,
  invite: InviteEmail,
  magiclink: MagicLinkEmail,
  recovery: RecoveryEmail,
  email_change: EmailChangeEmail,
  reauthentication: ReauthenticationEmail,
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured')
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
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
  const EmailTemplate = EMAIL_TEMPLATES[emailType]
  if (!EmailTemplate) {
    console.error('Unknown email type', { emailType })
    return new Response(JSON.stringify({ error: `Unknown email type: ${emailType}` }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const templateProps = {
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    recipient: user.email,
    confirmationUrl: email_data.redirect_to || SITE_URL,
    token: email_data.token,
    email: user.email,
    newEmail: user.new_email,
  }

  const html = await renderAsync(React.createElement(EmailTemplate, templateProps))
  const text = await renderAsync(React.createElement(EmailTemplate, templateProps), { plainText: true })

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: user.email,
      subject: EMAIL_SUBJECTS[emailType] || 'Notification',
      html,
      text,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Resend error', { status: res.status, error: err })
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const result = await res.json()
  console.log('Email sent', { id: result.id, to: user.email, type: emailType })

  return new Response(JSON.stringify({ success: true, id: result.id }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
