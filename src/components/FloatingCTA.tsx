import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
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
    <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden animate-fade-in">
      <a href="#produits" className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm rounded-sm shadow-gold">
        <ShoppingCart className="w-4 h-4" />
        {t("floating.cta")}
      </a>
    </div>
  );
};

export default FloatingCTA;
