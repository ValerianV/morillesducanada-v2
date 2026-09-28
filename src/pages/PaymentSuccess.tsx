import { Link } from "react-router-dom";
import { CheckCircle, Package, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useI18n } from "@/i18n/context";

const PaymentSuccess = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-lg px-6">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="font-serif text-3xl md:text-4xl font-light mb-4">
            {t("paymentSuccess.title")} <span className="italic text-gradient-gold">{t("paymentSuccess.titleHighlight")}</span>
          </h1>
          <p className="text-base text-foreground/85 mb-8">
            {t("paymentSuccess.text")}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8 text-left">
            <div className="flex items-start gap-3 p-4 border border-gold/15 rounded-sm bg-card">
              <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{t("paymentSuccess.emailTitle")}</p>
                <p className="text-sm text-foreground/80 mt-0.5">{t("paymentSuccess.emailText")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border border-gold/15 rounded-sm bg-card">
              <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{t("paymentSuccess.trackingTitle")}</p>
                <p className="text-sm text-foreground/80 mt-0.5">{t("paymentSuccess.trackingText")}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/professionnels"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm"
            >
              {t("paymentSuccess.continue")}
            </Link>
            <Link
              to="/"
              className="inline-block px-8 py-3 border border-gold/20 text-foreground font-medium tracking-widest uppercase text-sm hover:border-primary hover:text-primary transition-colors duration-300 rounded-sm"
            >
              {t("paymentSuccess.home")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
