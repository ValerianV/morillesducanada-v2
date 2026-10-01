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

export const TASTING_TOUR: readonly TastingStop[] = [
  {
    id: "provence",
    zone: { fr: "Avignon et Provence", en: "Avignon and Provence" },
    period: { fr: "jusqu'au 7 novembre 2026", en: "until 7 November 2026" },
    from: null,
    to: "2026-11-07",
  },
  {
    id: "mont-blanc",
    zone: { fr: "Chamonix et Mont-Blanc", en: "Chamonix and Mont-Blanc" },
    period: { fr: "à partir du 8 novembre 2026", en: "from 8 November 2026" },
    from: "2026-11-08",
    to: null,
  },
  {
    id: "maurienne",
    zone: { fr: "Maurienne", en: "Maurienne" },
    places: { fr: "Val Cenis, Valloire", en: "Val Cenis, Valloire" },
    period: { fr: "en décembre 2026", en: "in December 2026" },
    from: "2026-12-01",
    to: "2026-12-31",
  },
];

export function tastingStopLabel(stop: TastingStop, locale: "fr" | "en"): string {
  const places = stop.places ? ` (${stop.places[locale]})` : "";
  return `${stop.zone[locale]}${places} : ${stop.period[locale]}`;
}

export function tastingTourLines(locale: "fr" | "en"): string[] {
  return TASTING_TOUR.map((stop) => tastingStopLabel(stop, locale));
}
