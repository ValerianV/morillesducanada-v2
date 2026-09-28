import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import logo from "@/assets/logo.webp";
import { useI18n } from "@/i18n/context";

// Site réservé aux professionnels : ni panier ni compte client dans le menu.
// /auth et /admin restent accessibles au fondateur par leur adresse (noindex).
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, locale, setLocale } = useI18n();
  const isHome = location.pathname === "/";

  const toggleLocale = () => setLocale(locale === "fr" ? "en" : "fr");

  const links = [
    { href: "#origine", label: t("nav.story") },
    { href: "#offre", label: t("nav.products") },
    { href: "/recettes", label: t("nav.recipes"), isRoute: true },
    { href: "#contact", label: t("nav.contact") },
  ];

  const linkClass = "text-sm font-medium tracking-widest uppercase text-foreground/80 hover:text-primary transition-colors duration-300";
  const proLinkClass =
    "text-sm font-medium tracking-widest uppercase text-primary border border-primary/60 rounded-sm px-3 py-1.5 hover:bg-primary/10 hover:border-primary transition-colors duration-300";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-gold/20">
      <div className="container mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img src={logo} alt="Morilles du Canada" className="w-10 h-10 rounded-full" width={40} height={40} />
          <span className="font-serif text-lg sm:text-xl font-semibold text-gradient-gold tracking-wider">Morilles du Canada</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) =>
            link.isRoute ? (
              <Link key={link.href} to={link.href} className={linkClass}>{link.label}</Link>
            ) : (
              <a key={link.href} href={isHome ? link.href : `/${link.href}`} className={linkClass}>{link.label}</a>
            )
          )}
          <Link to="/professionnels" className={proLinkClass}>{t("nav.professionals")}</Link>
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors text-sm tracking-wider uppercase"
            title={locale === "fr" ? "Switch to English" : "Passer en français"}
          >
            <Globe size={16} />
            <span>{locale === "fr" ? "EN" : "FR"}</span>
          </button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLocale}
            className="text-foreground/80 hover:text-primary transition-colors p-2 text-sm tracking-wider"
            title={locale === "fr" ? "Switch to English" : "Passer en français"}
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-foreground p-2" aria-label="Menu" aria-expanded={isOpen}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-gold/20 animate-fade-in">
          <div className="container mx-auto px-5 py-4 flex flex-col gap-4">
            <Link to="/professionnels" onClick={() => setIsOpen(false)} className={`${proLinkClass} self-start`}>{t("nav.professionals")}</Link>
            {links.map((link) =>
              link.isRoute ? (
                <Link key={link.href} to={link.href} onClick={() => setIsOpen(false)} className={linkClass}>{link.label}</Link>
              ) : (
                <a key={link.href} href={isHome ? link.href : `/${link.href}`} onClick={() => setIsOpen(false)} className={linkClass}>{link.label}</a>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
