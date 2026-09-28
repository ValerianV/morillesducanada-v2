import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBandeau from "@/components/TrustBandeau";
import Footer from "@/components/Footer";
import JsonLdSchemas from "@/components/JsonLdSchemas";

const OriginSection = lazy(() => import("@/components/OriginSection"));
const ProductsSection = lazy(() => import("@/components/ProductsSection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const TrustBadges = lazy(() => import("@/components/TrustBadges"));
const WhySection = lazy(() => import("@/components/WhySection"));
const ProcessSection = lazy(() => import("@/components/ProcessSection"));
const GallerySection = lazy(() => import("@/components/GallerySection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const ProfessionalSection = lazy(() => import("@/components/ProfessionalSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const FloatingCTA = lazy(() => import("@/components/FloatingCTA"));

// Arrivée depuis une autre page sur /#produits, /#contact… : les sections sont chargées à la
// demande, donc absentes quand le navigateur tente le défilement natif vers l'ancre.
function useScrollToLazyAnchor() {
  const { hash } = useLocation();
  useEffect(() => {
    const id = decodeURIComponent(hash.slice(1));
    if (!id) return;
    const scroll = () => {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ block: "start" });
      return Boolean(target);
    };
    if (scroll()) return;
    const observer = new MutationObserver(() => {
      if (scroll()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timeout = window.setTimeout(() => observer.disconnect(), 5000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [hash]);
}

const Index = () => {
  useScrollToLazyAnchor();

  return (
    <div className="min-h-screen bg-background">
      <JsonLdSchemas />
      <Navbar />
      <main>
        <HeroSection />
        <TrustBandeau />
        <Suspense fallback={null}>
          <OriginSection />
          <ProductsSection />
          <ReviewsSection />
          <TrustBadges />
          <WhySection />
          <ProcessSection />
          <GallerySection />
          <AboutSection />
          <ProfessionalSection />
          <FAQSection />
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <FloatingCTA />
      </Suspense>
    </div>
  );
};

export default Index;
