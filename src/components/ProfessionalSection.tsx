import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/i18n/context";
import { PRO_TIERS, formatEurosLocale } from "@/lib/proPricing";

// Fourchette de prix au kilo tirée de la grille (paliers au kilo uniquement).
function perKgRange(locale: "fr" | "en"): string {
  const perKg = PRO_TIERS.filter((tier) => tier.pricing === "perKg").map((tier) => tier.priceCents);
  const min = formatEurosLocale(Math.min(...perKg), locale);
  const max = formatEurosLocale(Math.max(...perKg), locale);
  return `${min} – ${max}/kg`;
}

const ProfessionalSection = () => {
  const { t, locale } = useI18n();

  const stats = [
    { value: t("professional.stockValue"), label: t("professional.stockLabel") },
    { value: perKgRange(locale), label: t("professional.priceLabel") },
    { value: t("professional.shippingValue"), label: t("professional.shippingLabel") },
  ];

  return (
    <section id="professionnels" className="py-24 md:py-28 bg-gradient-card">
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

        <ScrollReveal delay={0.2}>
          <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              to="/professionnels"
              className="inline-block text-center px-8 py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm"
            >
              {t("professional.ctaPrices")}
            </Link>
            <Link
              to="/professionnels#echantillon"
              className="inline-block text-center px-8 py-4 border border-primary/60 text-foreground font-medium tracking-widest uppercase text-sm hover:border-primary hover:text-primary transition-colors duration-300 rounded-sm"
            >
              {t("professional.ctaSample")}
            </Link>
            <a href="tel:+33782162708" className="inline-flex items-center gap-2 text-base text-foreground/90 hover:text-primary sm:ml-2">
              <Phone className="w-4 h-4 text-primary" />
              {t("professional.phoneCta")} · 07 82 16 27 08
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProfessionalSection;
