/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

const LOGO_URL = 'https://eozbnwvirdilwslqnkab.supabase.co/storage/v1/object/public/email-assets/logo.png'

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Réinitialisez votre mot de passe — {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt={siteName} width="140" height="auto" style={logo} />
        <Heading style={h1}>Réinitialisation du mot de passe</Heading>
        <Text style={text}>
          Nous avons reçu une demande de réinitialisation de votre mot de passe pour {siteName}. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Réinitialiser le mot de passe
        </Button>
        <Text style={footer}>
          Si vous n'avez pas fait cette demande, vous pouvez ignorer cet e-mail. Votre mot de passe restera inchangé.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

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
const button = {
  backgroundColor: '#cc9a2e',
  color: '#1a1714',
  fontSize: '14px',
  fontWeight: '600' as const,
  borderRadius: '8px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'block',
  textAlign: 'center' as const,
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0', textAlign: 'center' as const }
