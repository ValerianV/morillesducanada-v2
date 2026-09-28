import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { XCircle, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartStore } from "@/stores/cartStore";

const PaymentCancelled = () => {
  const count = useCartStore((state) => state.totalItems());

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Paiement interrompu | Morilles du Canada" robots="noindex, nofollow" />
      <Navbar />
      <main className="pt-24 pb-16 flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-lg px-6">
          <XCircle className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-serif text-3xl md:text-4xl font-light mb-4">
            Paiement <span className="italic text-gradient-gold">interrompu</span>
          </h1>
          <p className="text-muted-foreground font-light mb-8">
            Aucun montant n'a été débité.{" "}
            {count > 0
              ? "Votre panier est conservé : vous pouvez reprendre la commande depuis l'icône panier en haut de la page."
              : "Vous pouvez reprendre votre sélection à tout moment."}
          </p>

          <div className="flex items-start gap-3 p-4 border border-gold/15 rounded-sm bg-card text-left mb-8">
            <ShoppingCart className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground font-light">
              Un souci pendant le paiement, ou une commande professionnelle au kilo ? Écrivez-nous à{" "}
              <a href="mailto:contact@morillesducanada.com" className="text-primary hover:underline">
                contact@morillesducanada.com
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/produits"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm"
            >
              Retour aux produits
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

export default PaymentCancelled;
