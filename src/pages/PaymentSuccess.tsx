import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
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
        <div className="text-center max-w-md px-6">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="font-serif text-3xl md:text-4xl font-light mb-4">
            Merci pour votre <span className="italic text-gradient-gold">commande</span>
          </h1>
          <p className="text-muted-foreground font-light mb-8">
            Votre paiement a été confirmé. Vous recevrez un e-mail de confirmation avec les détails de votre commande et le suivi de livraison.
          </p>
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

export default PaymentSuccess;
