import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ShoppingCart } from "lucide-react";
import { useI18n } from "@/i18n/context";

const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden animate-fade-in grid grid-cols-2 gap-2">
      <a
        href="#produits"
        className="flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground font-medium tracking-wider uppercase text-sm rounded-sm shadow-gold"
      >
        <ShoppingCart className="w-4 h-4" />
        {t("floating.cta")}
      </a>
      <Link
        to="/professionnels"
        className="flex items-center justify-center gap-2 py-3.5 bg-background/95 border border-primary text-primary font-medium tracking-wider uppercase text-sm rounded-sm shadow-gold"
      >
        <Briefcase className="w-4 h-4" />
        {t("floating.proCta")}
      </Link>
    </div>
  );
};

export default FloatingCTA;
