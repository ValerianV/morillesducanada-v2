import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <JsonLdSchemas />
      <Navbar />
      <main>
        <HeroSection />
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
