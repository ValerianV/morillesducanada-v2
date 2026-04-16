import { Link } from "react-router-dom";
import { CheckCircle, Package, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartStore } from "@/stores/cartStore";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-lg px-6">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="font-serif text-3xl md:text-4xl font-light mb-4">
            Merci pour votre <span className="italic text-gradient-gold">commande</span>
          </h1>
          <p className="text-muted-foreground font-light mb-8">
            Votre paiement a été confirmé. Un email de confirmation vient d'être envoyé avec le détail de votre commande et votre facture.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left">
            <div className="flex items-start gap-3 p-4 border border-gold/15 rounded-sm bg-card">
              <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Email de confirmation</p>
                <p className="text-xs text-muted-foreground font-light mt-0.5">Vérifiez votre boîte de réception (et vos spams).</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border border-gold/15 rounded-sm bg-card">
              <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Suivi de commande</p>
                <p className="text-xs text-muted-foreground font-light mt-0.5">Vous recevrez un email dès l'expédition avec le numéro de suivi.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/profil"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm"
            >
              Voir ma commande
            </Link>
            <Link
              to="/"
              className="inline-block px-8 py-3 border border-gold/20 text-foreground font-light tracking-widest uppercase text-sm hover:border-primary hover:text-primary transition-colors duration-300 rounded-sm"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
