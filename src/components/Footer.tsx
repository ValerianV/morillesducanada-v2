import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/context";

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="py-12 border-t border-gold/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-serif text-xl text-gradient-gold">Morilles du Canada</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground font-light tracking-wider">
            <Link to="/mentions-legales" className="hover:text-primary transition-colors">{t("footer.legal")}</Link>
            <span className="hidden md:inline">·</span>
            <Link to="/cgv" className="hover:text-primary transition-colors">{t("footer.terms")}</Link>
            <span className="hidden md:inline">·</span>
            <Link to="/livraison" className="hover:text-primary transition-colors">{t("footer.delivery")}</Link>
            <span className="hidden md:inline">·</span>
            <Link to="/recettes" className="hover:text-primary transition-colors">{t("footer.recipes")}</Link>
            <span className="hidden md:inline">·</span>
            <Link to="/journal" className="hover:text-primary transition-colors">{t("footer.blog")}</Link>
            <span className="hidden md:inline">·</span>
            <span>© {new Date().getFullYear()} Morilles du Canada</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
