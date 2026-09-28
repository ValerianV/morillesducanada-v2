import { Helmet } from "react-helmet-async";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME, type SeoImage } from "@/lib/seo/site";
import { serializeJsonLd, type JsonLd } from "@/lib/seo/schema";

interface SeoProps {
  title: string;
  description?: string;
  // Chemin canonique (« /professionnels »), converti en URL absolue www.
  path?: string;
  image?: SeoImage;
  type?: "website" | "article" | "product";
  // « noindex, nofollow » pour les pages privées ; « noindex, follow » pour une page vide.
  robots?: string;
  jsonLd?: JsonLd | JsonLd[];
  // Image LCP à précharger (hero).
  preloadImage?: string;
}

const Seo = ({ title, description, path, image = DEFAULT_OG_IMAGE, type = "website", robots, jsonLd, preloadImage }: SeoProps) => {
  const canonical = path ? absoluteUrl(path) : undefined;
  const imageUrl = absoluteUrl(image.url);
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {robots && <meta name="robots" content={robots} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {preloadImage && <link rel="preload" as="image" href={preloadImage} {...{ fetchpriority: "high" }} />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={imageUrl} />
      {image.width && <meta property="og:image:width" content={String(image.width)} />}
      {image.height && <meta property="og:image:height" content={String(image.height)} />}
      <meta property="og:image:alt" content={image.alt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={image.alt} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {serializeJsonLd(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
