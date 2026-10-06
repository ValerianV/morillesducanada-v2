import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/context";
import { EDITEUR } from "@/lib/legal";
import { PRO_TAX_MENTION } from "@/lib/proPricing";
import { ARTICLES, CONTENT_LINK_LABELS } from "@/lib/seo/articles";

const LINKS = [
  { to: "/professionnels", key: "footer.pro" },
  { to: "/precommande-2027", key: "footer.preorder" },
  { to: "/fiche-technique", key: "footer.sheet" },
  { to: "/plaquette-pro", key: "footer.brochure" },
  { to: "/guide-morilles-de-feu", key: "footer.guide" },
  { to: "/valerian-vilane", key: "footer.founder" },
  { to: "/zones-de-passage", key: "footer.zones" },
  { to: "/recettes", key: "footer.recipes" },
  { to: "/livraison", key: "footer.delivery" },
  { to: "/cgv", key: "footer.terms" },
  { to: "/mentions-legales", key: "footer.legal" },
] as const;

const Footer = () => {
  const { t, locale } = useI18n();

  return (
    <footer className="py-12 border-t border-gold/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="font-serif text-xl text-gradient-gold">Morilles du Canada</p>
            <p className="mt-2 text-sm text-foreground/80">{t("footer.proOnly")}</p>
            <p className="mt-1 text-sm text-foreground/80">
              <a href={EDITEUR.telephoneHref} className="hover:text-primary transition-colors">
                {locale === "en" ? EDITEUR.telephoneInternational : EDITEUR.telephone}
              </a>{" "}
              ·{" "}
              <a href={`mailto:${EDITEUR.email}`} className="hover:text-primary transition-colors">
                {EDITEUR.email}
              </a>
            </p>
          </div>
          <nav aria-label="Pied de page" className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-3 text-sm text-foreground/80 max-w-2xl">
            {LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-primary transition-colors">
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>
        <nav aria-label={t("footer.guides")} className="mt-8 text-center md:text-left">
          <p className="text-sm tracking-[0.2em] uppercase text-foreground/70 mb-3">{t("footer.guides")}</p>
          <ul lang="fr" className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-foreground/80">
            {ARTICLES.map((article) => (
              <li key={article.path}>
                <Link to={article.path} className="hover:text-primary transition-colors">
                  {CONTENT_LINK_LABELS[article.path]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-8 text-center md:text-left text-sm text-foreground/70">
          {PRO_TAX_MENTION[locale]} · © {new Date().getFullYear()} Morilles du Canada · {EDITEUR.ville}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
