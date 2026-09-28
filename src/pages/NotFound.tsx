import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { useI18n } from "@/i18n/context";

const NotFound = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Page introuvable | Morilles du Canada" robots="noindex, follow" />
      <Navbar />
      <main className="pt-24 pb-16 flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-lg px-6">
          <p className="font-serif text-6xl text-gradient-gold mb-4">404</p>
          <h1 className="font-serif text-3xl md:text-4xl font-light mb-4">{t("notFound.title")}</h1>
          <p className="text-muted-foreground font-light mb-8">{t("notFound.text")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/produits"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm"
            >
              {t("notFound.products")}
            </Link>
            <Link
              to="/"
              className="inline-block px-8 py-3 border border-gold/20 text-foreground font-light tracking-widest uppercase text-sm hover:border-primary hover:text-primary transition-colors duration-300 rounded-sm"
            >
              {t("notFound.home")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
