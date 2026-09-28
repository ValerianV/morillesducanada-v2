import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { breadcrumbSchema } from "@/lib/seo/schema";

interface Props {
  title: string;
  titleHighlight: string;
  seoTitle: string;
  description: string;
  path: string;
  breadcrumb: string;
  intro?: ReactNode;
  children: ReactNode;
}

// Mise en page commune des pages légales (CGV, mentions légales, livraison) : texte lisible,
// 16 px, contraste élevé.
const LegalPage = ({ title, titleHighlight, seoTitle, description, path, breadcrumb, intro, children }: Props) => (
  <div className="min-h-screen bg-background">
    <Seo title={seoTitle} description={description} path={path} jsonLd={breadcrumbSchema([{ name: breadcrumb, path }])} />
    <Navbar />
    <main className="pt-28 md:pt-32 pb-24">
      <div className="container mx-auto px-5 sm:px-6 max-w-3xl">
        <Link to="/" className="text-base text-primary hover:text-gold-light transition-colors mb-8 inline-block">
          ← Retour à l'accueil
        </Link>
        <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">
          {title} <span className="italic text-gradient-gold">{titleHighlight}</span>
        </h1>
        <div className="divider-gold w-24 mt-6 mb-10" />
        {intro && <div className="mb-10 text-base text-foreground/90 leading-relaxed">{intro}</div>}
        <div className="space-y-10 text-base text-foreground/85 leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_h2]:mb-3 [&_strong]:text-foreground [&_strong]:font-medium [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_p+p]:mt-3 [&_a]:text-primary [&_a:hover]:text-gold-light">
          {children}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default LegalPage;
