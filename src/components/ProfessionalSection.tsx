import { Link } from "react-router-dom";
import { Package, Phone, Gift, CalendarClock } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import ProPriceTable from "@/components/pro/ProPriceTable";
import { useI18n } from "@/i18n/context";
import { EDITEUR } from "@/lib/legal";
import { PRO_TIERS, formatEurosLocale } from "@/lib/proPricing";

// Fourchette de prix au kilo tirée de la grille.
function perKgRange(locale: "fr" | "en"): string {
  const perKg = PRO_TIERS.map((tier) => tier.priceCents);
  const min = formatEurosLocale(Math.min(...perKg), locale);
  const max = formatEurosLocale(Math.max(...perKg), locale);
  return `${min} – ${max}/kg`;
}

// Accueil : l'offre au kilo (grille, conditionnement, échantillon, précommande), réservée aux professionnels.
const ProfessionalSection = () => {
  const { t, locale } = useI18n();

  const stats = [
    { value: t("professional.stockValue"), label: t("professional.stockLabel") },
    { value: perKgRange(locale), label: t("professional.priceLabel") },
    { value: t("professional.shippingValue"), label: t("professional.shippingLabel") },
  ];

  const cards = [
    { icon: Package, title: t("professional.packTitle"), text: t("professional.packText") },
    { icon: Gift, title: t("professional.sampleTitle"), text: t("professional.sampleText"), to: "/professionnels#echantillon", cta: t("professional.ctaSample") },
    { icon: CalendarClock, title: t("professional.preorderTitle"), text: t("professional.preorderText"), to: "/precommande-2027", cta: t("professional.preorderCta") },
  ];

  return (
    <section id="offre" className="py-24 md:py-28 bg-gradient-card scroll-mt-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <ScrollReveal>
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">{t("professional.label")}</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground">{t("professional.title")}</h2>
          <p className="text-lg text-foreground/90 mt-6 max-w-3xl leading-relaxed">{t("professional.description")}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <dl className="grid sm:grid-cols-3 gap-6 mt-12">
            {stats.map((stat) => (
              <div key={stat.label} className="border-t-2 border-primary/50 pt-4">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-serif text-3xl text-primary whitespace-nowrap">{stat.value}</dd>
                <dd className="text-base text-foreground/85 mt-1">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-12 max-w-3xl">
            <ProPriceTable />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <ul className="mt-12 grid md:grid-cols-3 gap-6">
            {cards.map(({ icon: Icon, title, text, to, cta }) => (
              <li key={title} className="p-6 border border-gold/20 rounded-sm bg-background/40 flex flex-col">
                <Icon className="w-6 h-6 text-primary mb-4" aria-hidden />
                <h3 className="font-serif text-xl text-foreground mb-2">{title}</h3>
                <p className="text-base text-foreground/85 leading-relaxed flex-1">{text}</p>
                {to && cta && (
                  <Link to={to} className="mt-4 text-base text-primary hover:text-gold-light underline underline-offset-4">
                    {cta}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              to="/professionnels#devis"
              className="inline-block text-center px-8 py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm"
            >
              {t("professional.ctaQuote")}
            </Link>
            <Link
              to="/professionnels"
              className="inline-block text-center px-8 py-4 border border-primary/60 text-foreground font-medium tracking-widest uppercase text-sm hover:border-primary hover:text-primary transition-colors duration-300 rounded-sm"
            >
              {t("professional.ctaPrices")}
            </Link>
            <a href={EDITEUR.telephoneHref} className="inline-flex items-center gap-2 text-base text-foreground/90 hover:text-primary sm:ml-2">
              <Phone className="w-4 h-4 text-primary" />
              {t("professional.phoneCta")} · {locale === "en" ? EDITEUR.telephoneInternational : EDITEUR.telephone}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProfessionalSection;
