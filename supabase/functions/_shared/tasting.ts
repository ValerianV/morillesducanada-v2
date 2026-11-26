// Dégustation en main propre (décision du fondateur, 2026-10-01) : le pot de 30 g offert est remis en main propre
// lors d'un passage de Valérian dans la zone du prospect. Le site ne déclenche jamais d'envoi postal ; un envoi
// reste possible au cas par cas, après échange avec Valérian (prospect démarché qui répond).
// Module pur, partagé par le site (src/lib/tasting.ts), l'edge function submit-pro-lead et les emails.
//
// POUR METTRE À JOUR LE CALENDRIER : modifier TASTING_TOUR ci-dessous, puis lancer les tests
// (src/test/tasting.test.ts) et déployer. Le site et les emails reprennent cette constante ;
// public/llms.txt, docs/business/offre.md et la plaquette pro sont à reporter à la main.

export interface TastingStop {
  id: string;
  zone: { fr: string; en: string };
  // Précision éventuelle sur les lieux couverts.
  places?: { fr: string; en: string };
  period: { fr: string; en: string };
  // Dates ISO indicatives (incluses) ; null = non borné. Elles servent à tester l'ordre du calendrier.
  from: string | null;
  to: string | null;
}

// 2026-11-26 : Valérian a quitté Chamonix et circule entre les stations des Alpes cet hiver, sans dates fixes ;
// les expéditions partent de Provence. Ne plus afficher de dates ni de stations précises sans accord du fondateur.
export const TASTING_TOUR: readonly TastingStop[] = [
  {
    id: "alpes",
    zone: { fr: "Stations des Alpes", en: "Alpine resorts" },
    period: {
      fr: "cet hiver, sans dates fixes : je vous préviens quand je passe près de chez vous",
      en: "this winter, no fixed dates: I let you know when I am near you",
    },
    from: null,
    to: null,
  },
];

export function tastingStopLabel(stop: TastingStop, locale: "fr" | "en"): string {
  const places = stop.places ? ` (${stop.places[locale]})` : "";
  return `${stop.zone[locale]}${places} : ${stop.period[locale]}`;
}

export function tastingTourLines(locale: "fr" | "en"): string[] {
  return TASTING_TOUR.map((stop) => tastingStopLabel(stop, locale));
}
