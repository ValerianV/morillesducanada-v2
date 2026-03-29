import { Link } from "react-router-dom";
import { CheckCircle, CalendarClock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PreOrderSuccess = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-lg px-6">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="font-serif text-3xl md:text-4xl font-light mb-4">
            Pré-commande <span className="italic text-gradient-gold">confirmée</span>
          </h1>
          <p className="text-muted-foreground font-light mb-6">
            Votre pré-commande de morilles de feu pour la saison 2026 a été enregistrée et votre paiement confirmé.
          </p>
          <div className="flex items-start gap-3 text-sm text-muted-foreground font-light mb-8 text-left border border-gold/15 p-4 rounded-sm">
            <CalendarClock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p>Vous recevrez un e-mail de confirmation avec les détails de votre réservation. Nous vous contacterons dès que la récolte sera disponible pour organiser la livraison (été 2026).</p>
          </div>
          <Link
            to="/"
            className="inline-block px-10 py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm"
          >
            Retour à l'accueil
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PreOrderSuccess;
