import { Flame, Wind, SearchCheck, Package } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/i18n/context";

const stepIcons = [Flame, Wind, SearchCheck, Package];

const ProcessSection = () => {
  const { t, translations } = useI18n();
  const steps = translations.process.steps;

  return (
    <section className="py-24 md:py-32" aria-label={t("process.label")}>
      <div className="container mx-auto px-6">
        <ScrollReveal blur>
          <div className="text-center mb-20">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">{t("process.label")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light">
              {t("process.title")} <span className="italic text-gradient-gold">{t("process.titleHighlight")}</span>
            </h2>
            <div className="divider-gold w-24 mx-auto mt-8" />
          </div>
        </ScrollReveal>

        <div className="relative max-w-4xl mx-auto">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent -translate-x-1/2" />
          <div className="space-y-16 md:space-y-0">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              const Icon = stepIcons[i];
              return (
                <motion.div key={step.title}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                  className={`relative md:flex items-center md:min-h-[180px] ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className={`md:w-[calc(50%-40px)] ${isLeft ? "md:text-right md:pr-4" : "md:text-left md:pl-4"}`}>
                    <div className={`p-6 border border-gold/10 rounded-sm hover:border-gold/25 transition-colors duration-500 bg-background/30 ${isLeft ? "md:ml-auto" : "md:mr-auto"} max-w-md`}>
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? "md:justify-end" : ""}`}>
                        {isLeft && <span className="font-serif text-lg text-foreground">{step.title}</span>}
                        <Icon className="w-6 h-6 text-primary flex-shrink-0" />
                        {!isLeft && <span className="font-serif text-lg text-foreground">{step.title}</span>}
                      </div>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed">{step.description}</p>
                      <p className="text-xs text-primary/70 tracking-wider uppercase mt-3">{step.detail}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-primary/40 bg-background items-center justify-center z-10">
                    <span className="font-serif text-sm text-primary">{i + 1}</span>
                  </div>
                  <div className="md:hidden flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-full border border-primary/40 flex items-center justify-center text-xs text-primary font-serif">{i + 1}</span>
                    <div className="flex-1 h-px bg-gold/15" />
                  </div>
                  <div className="hidden md:block md:w-[calc(50%-40px)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
