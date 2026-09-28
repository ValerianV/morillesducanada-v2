import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { useI18n } from "@/i18n/context";

// Mobile : raccourci permanent vers le devis, après le premier écran.
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
      <Link
        to="/professionnels#devis"
        className="flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground font-medium tracking-wider uppercase text-sm rounded-sm shadow-gold"
      >
        <FileText className="w-4 h-4" />
        {t("floating.cta")}
      </Link>
    </div>
  );
};

export default FloatingCTA;
