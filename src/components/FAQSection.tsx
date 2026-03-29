import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/i18n/context";

const FAQSection = () => {
  const { t, translations } = useI18n();
  const items = translations.faq.items;

  return (
    <section className="py-24 md:py-32 bg-gradient-card" aria-label={t("faq.label")}>
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">{t("faq.label")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light">
              {t("faq.title")} <span className="italic text-gradient-gold">{t("faq.titleHighlight")}</span>
            </h2>
            <div className="divider-gold w-24 mx-auto mt-8" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {items.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}
                  className="border border-gold/10 rounded-sm px-6 data-[state=open]:border-gold/30 transition-colors"
                >
                  <AccordionTrigger className="text-left font-serif text-base md:text-lg font-light hover:no-underline hover:text-primary py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground font-light leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQSection;
