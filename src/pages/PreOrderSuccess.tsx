import { Link } from "react-router-dom";
import { CheckCircle, CalendarClock, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { useI18n } from "@/i18n/context";

// Page de retour Stripe après paiement de l'acompte (noindex : voir src/lib/seo/noindex.ts).
const PreOrderSuccess = () => {
  const { translations } = useI18n();
  const copy = translations.preorderSuccess;

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Précommande confirmée | Morilles du Canada" robots="noindex, nofollow" />
      <Navbar />
      <main className="pt-24 pb-16 flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-lg px-6">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="font-serif text-3xl md:text-4xl font-light mb-4">
            {copy.title} <span className="italic text-gradient-gold">{copy.titleHighlight}</span>
          </h1>
          <p className="text-muted-foreground font-light mb-6">{copy.text}</p>
          <div className="space-y-3 mb-8 text-left">
            <div className="flex items-start gap-3 text-sm text-muted-foreground font-light border border-gold/15 p-4 rounded-sm">
              <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p>
                <strong className="text-foreground font-medium">{copy.emailTitle}.</strong> {copy.emailText}
              </p>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted-foreground font-light border border-gold/15 p-4 rounded-sm">
              <CalendarClock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p>
                <strong className="text-foreground font-medium">{copy.nextTitle}.</strong> {copy.nextText}
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-block px-10 py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm"
          >
            {copy.home}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PreOrderSuccess;
