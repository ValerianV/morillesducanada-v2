import { ChevronDown } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/i18n/context";

const OriginSection = () => {
  const { t } = useI18n();

  const couplets = [
    { bold: t("origin.couplet1Bold"), italic: t("origin.couplet1Italic") },
    { bold: t("origin.couplet2Bold"), italic: t("origin.couplet2Italic") },
    { bold: t("origin.couplet3Bold"), italic: t("origin.couplet3Italic") },
  ];

  const scrollToProducts = () => {
    document.getElementById("produits")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="origine" className="py-28 md:py-40 overflow-hidden">
      <div className="container mx-auto px-6">

        {/* Bloc A — Titre + baseline */}
        <ScrollReveal blur>
          <div className="text-center mb-24 md:mb-32 max-w-2xl mx-auto">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-5">
              {t("origin.label")}
            </p>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-8">
              {t("origin.title")}{" "}
              <span className="italic text-gradient-gold">{t("origin.titleHighlight")}</span>
            </h2>
            <div className="divider-gold w-20 mx-auto mb-8" />
            <p className="font-serif text-xl md:text-2xl text-foreground/90 font-medium leading-relaxed">
              {t("origin.baseline")}
            </p>
          </div>
        </ScrollReveal>

        {/* Bloc B — Trois couplets */}
        <div className="max-w-xl mx-auto mb-24 md:mb-32 space-y-16 md:space-y-24">
          {couplets.map((couplet, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="text-center space-y-2">
                <p className="font-serif text-lg md:text-xl font-semibold text-foreground leading-relaxed">
                  {couplet.bold}
                </p>
                <p className="font-serif text-base md:text-lg italic text-muted-foreground font-light leading-relaxed">
                  {couplet.italic}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bloc C — Photo */}
        <ScrollReveal delay={0.05}>
          <figure className="mb-24 md:mb-32 max-w-5xl mx-auto">
            <div className="aspect-video rounded-sm overflow-hidden shadow-gold">
              <picture>
                <source srcSet="/images/nees-du-feu-hero.webp" type="image/webp" />
                <img
                  src="/images/nees-du-feu-hero.jpg"
                  alt="Morille de feu dans une forêt brûlée de Colombie-Britannique"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </picture>
            </div>
            <figcaption className="text-center mt-4 text-xs italic text-muted-foreground/50 font-light">
              {t("origin.caption")}
            </figcaption>
          </figure>
        </ScrollReveal>

        {/* Bloc D — Transition vers les produits */}
        <ScrollReveal delay={0.05}>
          <div className="text-center max-w-xl mx-auto">
            <p className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-8">
              {t("origin.transition")}
            </p>
            <button
              onClick={scrollToProducts}
              className="inline-flex items-center gap-2 text-primary hover:text-gold-light transition-colors duration-300 text-xs tracking-[0.25em] uppercase font-medium"
            >
              {t("origin.cta")}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default OriginSection;
