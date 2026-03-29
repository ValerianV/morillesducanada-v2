import { Flame, Mountain, Leaf, Award, Timer, ShieldCheck } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/i18n/context";

const icons = [Flame, Mountain, Timer, Leaf, Award, ShieldCheck];

const WhySection = () => {
  const { t, translations } = useI18n();
  const reasons = translations.why.reasons;
  const rows = translations.why.rows;

  return (
    <section id="pourquoi" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <ScrollReveal blur>
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">{t("why.label")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light">
              {t("why.title")} <span className="italic text-gradient-gold">{t("why.titleHighlight")}</span>
            </h2>
            <div className="divider-gold w-24 mx-auto mt-8" />
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, i) => {
            const Icon = icons[i];
            return (
              <ScrollReveal key={reason.title} delay={i * 0.1} direction="up" blur>
                <div className="p-8 border border-gold/10 rounded-sm hover:border-gold/30 hover:shadow-[0_0_40px_hsl(40_60%_50%/0.1)] hover:-translate-y-2 transition-all duration-500 group cursor-default">
                  <div className="inline-block transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                    <Icon className="w-8 h-8 text-primary mb-6" />
                  </div>
                  <h3 className="font-serif text-xl mb-3">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">{reason.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.2} blur>
          <div className="mt-20 max-w-4xl mx-auto">
            <h3 className="font-serif text-2xl text-center mb-10">{t("why.compTitle")}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/20">
                    <th className="text-left py-4 px-4 font-light tracking-widest uppercase text-muted-foreground text-xs"></th>
                    <th className="py-4 px-4 font-light tracking-widest uppercase text-primary text-xs whitespace-pre-line">{translations.why.headers[1]}</th>
                    <th className="py-4 px-4 font-light tracking-widest uppercase text-muted-foreground text-xs whitespace-pre-line">{translations.why.headers[2]}</th>
                    <th className="py-4 px-4 font-light tracking-widest uppercase text-muted-foreground text-xs whitespace-pre-line">{translations.why.headers[3]}</th>
                  </tr>
                </thead>
                <tbody className="font-light">
                  {rows.map(([label, fire, euro, china]) => (
                    <tr key={label} className="border-b border-gold/10">
                      <td className="py-3 px-2 md:px-4 text-muted-foreground whitespace-nowrap">{label}</td>
                      <td className="py-3 px-2 md:px-4 text-center text-foreground">{fire}</td>
                      <td className="py-3 px-2 md:px-4 text-center text-muted-foreground">{euro}</td>
                      <td className="py-3 px-2 md:px-4 text-center text-muted-foreground">{china}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default WhySection;
