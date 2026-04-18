import { motion } from "framer-motion";
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
    <section id="origine" className="py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6">

        {/* Bloc A — Titre + baseline, même pattern que toutes les autres sections */}
        <ScrollReveal blur>
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">
              {t("origin.label")}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
              {t("origin.title")}{" "}
              <span className="italic text-gradient-gold">{t("origin.titleHighlight")}</span>
            </h2>
            <div className="divider-gold w-24 mx-auto mt-8 mb-8" />
            <p className="font-serif text-xl md:text-2xl text-foreground/80 font-light leading-relaxed">
              {t("origin.baseline")}
            </p>
          </div>
        </ScrollReveal>

        {/* Bloc B — Trois couplets */}
        <div className="max-w-xl mx-auto mb-20">
          {couplets.map((couplet, i) => (
            <div key={i}>
              {i > 0 && (
                <div className="flex justify-center py-10">
                  <div className="w-px h-12 bg-gradient-to-b from-primary/30 to-transparent" />
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <span className="block font-serif text-xs text-primary/50 tracking-[0.35em] uppercase mb-5">
                  {"0" + (i + 1)}
                </span>
                <p className="font-serif text-lg md:text-xl font-semibold text-foreground leading-relaxed">
                  {couplet.bold}
                </p>
                <div className="w-8 h-px bg-primary/25 mx-auto my-4" />
                <p className="font-serif text-base md:text-lg italic text-muted-foreground font-light leading-relaxed">
                  {couplet.italic}
                </p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Bloc C — Photo */}
        <ScrollReveal delay={0.05}>
          <figure className="mb-20 max-w-5xl mx-auto">
            <div className="aspect-video rounded-sm overflow-hidden shadow-gold border border-gold/10">
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
            <figcaption className="text-center mt-4 text-xs italic text-muted-foreground/50 font-light tracking-wider">
              {t("origin.caption")}
            </figcaption>
          </figure>
        </ScrollReveal>

        {/* Bloc D — Transition + CTA, bouton style identique au Hero */}
        <ScrollReveal delay={0.05}>
          <div className="text-center max-w-xl mx-auto">
            <div className="divider-gold w-16 mx-auto mb-8" />
            <p className="font-serif text-xl md:text-2xl font-light text-foreground/90 mb-8">
              {t("origin.transition")}
            </p>
            <motion.button
              onClick={scrollToProducts}
              className="inline-flex items-center gap-2 px-10 py-4 border border-primary/40 text-foreground font-light tracking-widest uppercase text-sm rounded-sm"
              whileHover={{ borderColor: "hsl(40 60% 50%)", color: "hsl(40 60% 50%)", scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.3 }}
            >
              {t("origin.cta")}
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default OriginSection;
