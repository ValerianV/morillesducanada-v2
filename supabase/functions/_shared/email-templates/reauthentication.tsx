/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

const LOGO_URL = 'https://eozbnwvirdilwslqnkab.supabase.co/storage/v1/object/public/email-assets/logo.png'

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Votre code de vérification</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="Morilles du Canada" width="140" height="auto" style={logo} />
        <Heading style={h1}>Confirmez votre identité</Heading>
        <Text style={text}>Utilisez le code ci-dessous pour confirmer votre identité :</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          Ce code expirera sous peu. Si vous n'avez pas fait cette demande, vous pouvez ignorer cet e-mail en toute sécurité.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Raleway', Arial, sans-serif" }
const container = { padding: '40px 30px', maxWidth: '480px', margin: '0 auto' }
const logo = { margin: '0 auto 30px', display: 'block' }
const h1 = {
  fontSize: '24px',
  fontWeight: '600' as const,
  color: '#1a1714',
  margin: '0 0 20px',
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  textAlign: 'center' as const,
}
const text = {
  fontSize: '14px',
  color: '#7a6f60',
  lineHeight: '1.6',
  margin: '0 0 25px',
}
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#1a1714',
  margin: '0 0 30px',
  textAlign: 'center' as const,
  letterSpacing: '4px',
  backgroundColor: '#f8f6f3',
  padding: '16px',
  borderRadius: '8px',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0', textAlign: 'center' as const }
