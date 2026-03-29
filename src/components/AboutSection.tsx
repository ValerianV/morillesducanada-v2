import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import valerianPortrait from "@/assets/valerian-portrait.webp";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/i18n/context";

const AboutSection = () => {
  const { t } = useI18n();

  return (
    <section id="a-propos" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <ScrollReveal blur>
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">{t("about.label")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light">
              {t("about.title")} <span className="italic text-gradient-gold">{t("about.titleHighlight")}</span>
            </h2>
            <div className="divider-gold w-24 mx-auto mt-8" />
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          <ScrollReveal direction="left" delay={0.1}>
            <div className="relative rounded-sm overflow-hidden shadow-gold aspect-[3/4] max-h-[480px] mx-auto max-w-sm">
              <img
                src={valerianPortrait}
                alt="Valérian, fondateur de Morilles du Canada"
                loading="lazy"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <div className="space-y-6">
              <h3 className="font-serif text-2xl md:text-3xl font-light leading-relaxed">{t("about.heading")}</h3>
              <p className="text-secondary-foreground/80 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: t("about.p1") }} />
              <p className="text-secondary-foreground/80 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: t("about.p2") }} />
              <p className="text-secondary-foreground/80 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: t("about.p3") }} />
              
              <div className="pt-4">
                <Link
                  to="/journal"
                  className="inline-flex items-center gap-2 text-primary hover:text-gold-light transition-colors duration-300 font-light tracking-wider text-sm uppercase"
                >
                  {t("about.blogLink")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
