// Emails d'authentification envoyés par auth-email-hook (hook « Send Email » de Supabase Auth).
// Module pur (aucun import Deno/npm) : testé avec vitest (src/test/emails.test.ts).
import { BRAND, emailLink, emailParagraph, emailText, renderEmailLayout } from "./emailLayout.ts";
import { escapeHtml } from "./format.ts";

export const AUTH_EMAIL_TYPES = ["signup", "invite", "magiclink", "recovery", "email_change", "reauthentication"] as const;
export type AuthEmailType = (typeof AUTH_EMAIL_TYPES)[number];

export function isAuthEmailType(value: unknown): value is AuthEmailType {
  return typeof value === "string" && (AUTH_EMAIL_TYPES as readonly string[]).includes(value);
}

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

// Lien de vérification Supabase : sans token_hash, le bouton ne confirmerait rien (B8 de l'audit dev).
export function authVerifyUrl(opts: {
  supabaseUrl: string;
  tokenHash: string;
  type: AuthEmailType;
  redirectTo?: string | null;
}): string {
  const base = opts.supabaseUrl.replace(/\/+$/, "");
  const params = new URLSearchParams({
    token: opts.tokenHash,
    type: opts.type,
    redirect_to: opts.redirectTo || BRAND.siteUrl,
  });
  return `${base}/auth/v1/verify?${params.toString()}`;
}

interface AuthEmailInput {
  verifyUrl?: string;
  token?: string;
  email: string;
  newEmail?: string | null;
}

const IGNORE = "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.";

export function buildAuthEmail(type: AuthEmailType, input: AuthEmailInput): BuiltEmail {
  const url = input.verifyUrl ?? BRAND.siteUrl;
  let subject: string;
  let title: string;
  let preheader: string;
  let lines: string[];
  let cta: { label: string; url: string } | undefined;
  let footerNote = IGNORE;

  switch (type) {
    case "signup":
      subject = "Confirmez votre adresse email — Morilles du Canada";
      title = "Bienvenue chez Morilles du Canada";
      preheader = "Confirmez votre adresse email pour activer votre compte.";
      lines = [
        "Merci d'avoir créé votre compte.",
        `Pour l'activer, confirmez votre adresse email (${input.email}) avec le bouton ci-dessous.`,
      ];
      cta = { label: "Confirmer mon adresse", url };
      footerNote = "Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.";
      break;
    case "invite":
      subject = "Votre invitation — Morilles du Canada";
      title = "Vous êtes invité";
      preheader = "Acceptez l'invitation pour créer votre compte.";
      lines = ["Vous avez été invité à créer un compte sur morillesducanada.com.", "Le bouton ci-dessous vous permet d'accepter l'invitation."];
      cta = { label: "Accepter l'invitation", url };
      footerNote = "Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.";
      break;
    case "magiclink":
      subject = "Votre lien de connexion — Morilles du Canada";
      title = "Votre lien de connexion";
      preheader = "Connectez-vous en un clic. Ce lien expire rapidement.";
      lines = ["Le bouton ci-dessous vous connecte à votre compte. Ce lien expire rapidement et ne sert qu'une fois."];
      cta = { label: "Me connecter", url };
      break;
    case "recovery":
      subject = "Réinitialisation de votre mot de passe — Morilles du Canada";
      title = "Choisissez un nouveau mot de passe";
      preheader = "Vous avez demandé à réinitialiser votre mot de passe.";
      lines = ["Une demande de réinitialisation du mot de passe de votre compte a été reçue.", "Le bouton ci-dessous vous permet d'en choisir un nouveau."];
      cta = { label: "Choisir un mot de passe", url };
      footerNote = "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email : votre mot de passe reste inchangé.";
      break;
    case "email_change":
      subject = "Confirmez votre nouvelle adresse email — Morilles du Canada";
      title = "Changement d'adresse email";
      preheader = "Confirmez le changement d'adresse email de votre compte.";
      lines = [
        `Vous avez demandé à remplacer l'adresse ${input.email} par ${input.newEmail ?? "une nouvelle adresse"}.`,
        "Confirmez ce changement avec le bouton ci-dessous.",
      ];
      cta = { label: "Confirmer le changement", url };
      footerNote = "Si vous n'êtes pas à l'origine de cette demande, écrivez-moi sans attendre à contact@morillesducanada.com.";
      break;
    case "reauthentication":
      subject = "Votre code de vérification — Morilles du Canada";
      title = "Votre code de vérification";
      preheader = "Votre code de vérification.";
      lines = ["Saisissez ce code pour confirmer votre identité. Il expire rapidement."];
      break;
  }

  let body = lines.map((l) => emailText(l)).join("");
  if (type === "reauthentication") {
    body += `<p style="margin:8px 0 24px;font-family:'Courier New',Courier,monospace;font-size:30px;letter-spacing:0.3em;color:#d4a843;">${escapeHtml(input.token ?? "")}</p>`;
  }

  const html = renderEmailLayout({
    preheader,
    title,
    bodyHtml: body,
    cta,
    afterCtaHtml: cta
      ? emailParagraph(`Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>${emailLink(cta.url, cta.url, { breakAll: true })}`, {
          muted: true,
          small: true,
        })
      : undefined,
    footerNote,
  });

  const text = [
    title,
    "",
    ...lines,
    type === "reauthentication" ? `\nCode : ${input.token ?? ""}` : "",
    cta ? `\n${cta.label} : ${cta.url}` : "",
    "",
    footerNote,
    "",
    `${BRAND.name} · ${BRAND.siteLabel} · ${BRAND.contactEmail}`,
  ].join("\n");

  return { subject, html, text };
}
