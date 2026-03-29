import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, X, UserCircle, LogOut, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.webp";
import { CartDrawer } from "@/components/CartDrawer";
import { useI18n, type Locale } from "@/i18n/context";
import type { Session } from "@supabase/supabase-js";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, locale, setLocale } = useI18n();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const toggleLocale = () => setLocale(locale === "fr" ? "en" : "fr");

  const links = [
    { href: "#origine", label: t("nav.story") },
    { href: "#produits", label: t("nav.products") },
    { href: "/recettes", label: t("nav.recipes"), isRoute: true },
    { href: "#professionnels", label: t("nav.professionals") },
    { href: "#contact", label: t("nav.contact") },
  ];

  const linkClass = "text-sm font-light tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors duration-300";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 supports-backdrop:bg-background/80 supports-backdrop:backdrop-blur-md border-b border-gold/20 safari-safe-layer">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img src={logo} alt="Morilles du Canada" className="w-10 h-10 rounded-full" width={40} height={40} />
          <span className="font-serif text-base sm:text-xl font-semibold text-gradient-gold tracking-wider">Morilles du Canada</span>
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

          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-xs font-light tracking-wider uppercase"
            title={locale === "fr" ? "Switch to English" : "Passer en français"}
          >
            <Globe size={16} />
            <span>{locale === "fr" ? "EN" : "FR"}</span>
          </button>

          {session ? (
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/profil")} className="text-muted-foreground hover:text-primary transition-colors" title={t("nav.profile")}>
                <UserCircle size={22} />
              </button>
              <button onClick={handleLogout} className="text-muted-foreground hover:text-primary transition-colors" title={t("nav.logout")}>
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-primary transition-colors" title={t("nav.login")}>
              <UserCircle size={22} />
            </button>
          )}
          <CartDrawer />
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleLocale}
            className="text-muted-foreground hover:text-primary transition-colors p-1 text-xs font-light tracking-wider"
          >
            {locale === "fr" ? "EN" : "FR"}
          </button>
          {session ? (
            <button onClick={() => navigate("/profil")} className="text-muted-foreground hover:text-primary transition-colors p-1" title={t("nav.profile")}>
              <UserCircle size={22} />
            </button>
          ) : (
            <button onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-primary transition-colors p-1" title={t("nav.login")}>
              <UserCircle size={22} />
            </button>
          )}
          <CartDrawer />
          <button onClick={() => setIsOpen(!isOpen)} className="text-foreground p-2" aria-label="Menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background/95 supports-backdrop:backdrop-blur-md border-b border-gold/20 animate-fade-in safari-safe-layer">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
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
