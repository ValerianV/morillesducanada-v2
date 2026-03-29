import { Helmet } from "react-helmet-async";

const siteUrl = "https://morillesducanada.lovable.app";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Morilles du Canada",
  url: siteUrl,
  logo: `${siteUrl}/favicon.ico`,
  description:
    "Morilles sauvages de feu séchées, récoltées à la main dans les forêts boréales du Canada (Colombie-Britannique et Yukon). Vente directe aux particuliers et professionnels en France.",
  foundingLocation: {
    "@type": "Place",
    name: "Colombie-Britannique & Yukon, Canada",
  },
  areaServed: { "@type": "Country", name: "France" },
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Morilles du Canada",
  url: siteUrl,
  description:
    "Achetez des morilles de feu séchées du Canada. Morilles sauvages récoltées à la main, sans pesticide, livrées en France.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/recettes?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const productSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Morilles de feu séchées — Découverte 12g",
    description:
      "Sachet de 12g de morilles de feu séchées du Canada. Morilles sauvages sans queue, séchées à basse température. Idéal pour 2 personnes.",
    brand: { "@type": "Brand", name: "Morilles du Canada" },
    category: "Champignons séchés",
    countryOfOrigin: { "@type": "Country", name: "Canada" },
    material: "Morilles sauvages de feu (Morchella sp.)",
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Morilles du Canada" },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Morilles de feu séchées — Classique 30g",
    description:
      "Sachet de 30g de morilles de feu séchées du Canada. Morilles sauvages sans queue, séchées à basse température. Idéal pour 4-6 personnes.",
    brand: { "@type": "Brand", name: "Morilles du Canada" },
    category: "Champignons séchés",
    countryOfOrigin: { "@type": "Country", name: "Canada" },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Morilles de feu séchées — Prestige 45g",
    description:
      "Pot de 45g de morilles de feu séchées du Canada. Morilles sauvages sans queue, séchées à basse température. Idéal pour 6-8 personnes ou en cadeau.",
    brand: { "@type": "Brand", name: "Morilles du Canada" },
    category: "Champignons séchés",
    countryOfOrigin: { "@type": "Country", name: "Canada" },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Comment conserver les morilles séchées ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Conservez-les dans un récipient hermétique, à l'abri de la lumière et de l'humidité, à température ambiante. Elles se conservent ainsi pendant 2 ans minimum sans perte d'arôme.",
      },
    },
    {
      "@type": "Question",
      name: "Comment réhydrater les morilles ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Plongez-les dans de l'eau tiède (pas bouillante) pendant 20 à 30 minutes. Conservez l'eau de trempage : c'est un bouillon précieux pour vos sauces et risottos.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle est la différence entre morille de feu et morille cultivée ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les morilles de feu poussent naturellement sur les sols brûlés des forêts boréales canadiennes. Elles développent un arôme fumé intense impossible à reproduire en culture. Les morilles cultivées (principalement chinoises) sont produites en serre et ont un goût beaucoup plus neutre.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle quantité de morilles séchées pour un plat ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Comptez environ 5 à 8 g de morilles séchées par personne (elles triplent de volume à la réhydratation). Les sachets de 12 g conviennent pour 2 personnes, ceux de 30 g pour 4 à 6 personnes.",
      },
    },
    {
      "@type": "Question",
      name: "Les morilles de feu sont-elles sauvages et naturelles ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, 100% sauvages. Elles poussent spontanément sur les sols brûlés après un feu de forêt, sans aucune culture, pesticide ou traitement chimique. Elles sont cueillies à la main dans les forêts boréales du Canada.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on manger des morilles crues ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non, jamais. Les morilles crues contiennent de l'hémolysine, une toxine détruite uniquement par la cuisson. Il faut les cuire minimum 15 minutes à feu moyen avant consommation.",
      },
    },
    {
      "@type": "Question",
      name: "Qu'est-ce qu'une morille de feu (fire morel) ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Une morille de feu est un champignon sauvage du genre Morchella qui pousse exclusivement sur les sols calcinés après un feu de forêt, principalement dans les forêts boréales du Canada. Elle se distingue par son arôme fumé intense, sa grande taille et sa texture charnue. Les brunes incluent M. conica, M. brunnea, M. septimelata et M. sextelata ; les blondes incluent M. esculenta, M. prava, M. tomentosa et M. americana.",
      },
    },
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment préparer des morilles séchées",
  description:
    "Guide étape par étape pour réhydrater et préparer des morilles de feu séchées du Canada.",
  totalTime: "PT35M",
  supply: [
    { "@type": "HowToSupply", name: "Morilles de feu séchées" },
    { "@type": "HowToSupply", name: "Eau tiède" },
  ],
  tool: [
    { "@type": "HowToTool", name: "Bol" },
    { "@type": "HowToTool", name: "Filtre à café ou linge fin" },
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Réhydratation",
      text: "Plongez les morilles séchées dans un bol d'eau tiède (30-40°C, pas bouillante) pendant 20 à 30 minutes jusqu'à ce qu'elles soient souples.",
    },
    {
      "@type": "HowToStep",
      name: "Égouttage",
      text: "Soulevez délicatement les morilles sans les presser. Filtrez le jus de trempage à travers un filtre à café — ce liquide est un concentré de saveur à conserver.",
    },
    {
      "@type": "HowToStep",
      name: "Nettoyage",
      text: "Ouvrez chaque morille en deux et rincez-les rapidement sous un filet d'eau pour éliminer tout résidu de sable ou de terre.",
    },
    {
      "@type": "HowToStep",
      name: "Cuisson",
      text: "Cuisez les morilles au minimum 15 minutes à feu moyen. Ne jamais consommer de morilles crues ou insuffisamment cuites.",
    },
  ],
};

const JsonLdSchemas = () => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify(organizationSchema)}
    </script>
    <script type="application/ld+json">
      {JSON.stringify(websiteSchema)}
    </script>
    {productSchemas.map((schema, i) => (
      <script key={i} type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    ))}
    <script type="application/ld+json">
      {JSON.stringify(faqSchema)}
    </script>
    <script type="application/ld+json">
      {JSON.stringify(howToSchema)}
    </script>
  </Helmet>
);

export default JsonLdSchemas;
