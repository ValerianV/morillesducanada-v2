// Informations légales publiques : une seule source pour les mentions légales, les CGV,
// le bloc contact et la plaquette. Aucun crochet ni placeholder ne doit apparaître en ligne
// (test src/test/legal.test.tsx).

export const EDITEUR = {
  nom: "Valérian Vilane",
  forme: "Entrepreneur individuel (EI), micro-entreprise",
  adresse: "448 chemin de Patin, 84810 Aubignan, France",
  ville: "Aubignan (Vaucluse), France",
  siret: "802 861 948 00023",
  email: "contact@morillesducanada.com",
  telephone: "07 82 16 27 08",
  telephoneInternational: "+33 7 82 16 27 08",
  telephoneHref: "tel:+33782162708",
} as const;

export const HEBERGEUR = {
  nom: "Vercel Inc.",
  adresse: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  telephone: "+1 559 288 7060",
  site: "https://vercel.com",
} as const;

// Sous-traitants qui traitent des données personnelles pour le compte de l'éditeur.
export const SOUS_TRAITANTS = [
  { nom: "Supabase", role: "base de données et comptes clients" },
  { nom: "Stripe", role: "paiement en ligne" },
  { nom: "Resend", role: "envoi des emails" },
  { nom: "Vercel", role: "hébergement du site" },
] as const;

export interface Mediateur {
  nom: string;
  adresse: string;
  site: string;
}

// Médiateur de la consommation (art. L612-1 du Code de la consommation).
// À renseigner dès l'adhésion du fondateur ; tant que la valeur est null, les CGV affichent
// un texte neutre et exact, sans crochet.
export const MEDIATEUR: Mediateur | null = null;
