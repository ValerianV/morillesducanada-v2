import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, Mail, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProPriceTable from "@/components/pro/ProPriceTable";
import ProLeadForm from "@/components/pro/ProLeadForm";
import ProOrderConfigurator from "@/components/pro/ProOrderConfigurator";
import WildVsCultivated from "@/components/WildVsCultivated";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/i18n/context";
import type { ProLeadKind } from "@/lib/proLead";
import productVacuumBag from "@/assets/product-vacuum-bag.webp";
import valerianPortrait from "@/assets/valerian-portrait.webp";
import terrainPhoto from "@/assets/morels/morels-group-golden.webp";
import closeUpPhoto from "@/assets/morels/gros-plan-alveoles-morille.webp";
import Seo from "@/components/Seo";
import { breadcrumbSchema, faqPageSchema, lowestProPricePerKg, proOfferSchema } from "@/lib/seo/schema";
import { PRO_ONLY_MENTION, formatEurosLocale } from "@/lib/proPricing";
import { EDITEUR } from "@/lib/legal";

const SectionHeading = ({ label, title }: { label: string; title: string }) => (
  <div className="mb-8">
    <p className="text-sm tracking-[0.25em] uppercase text-primary mb-3">{label}</p>
    <h2 className="font-serif text-3xl md:text-4xl text-foreground">{title}</h2>
  </div>
);

const Professionnels = () => {
  const { t, translations, locale } = useI18n();
  const pro = translations.pro;
  const location = useLocation();
  const [kind, setKind] = useState<ProLeadKind>(location.hash === "#echantillon" ? "echantillon" : "devis");

  useEffect(() => {
    if (location.hash === "#echantillon") setKind("echantillon");
    if (location.hash === "#devis") setKind("devis");
    if (location.hash) {
      const target = document.getElementById(location.hash === "#echantillon" ? "devis" : location.hash.slice(1));
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  const goToForm = (next: ProLeadKind) => {
    setKind(next);
    document.getElementById("devis")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const section = "py-16 md:py-20 border-t border-gold/10";

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={t("pro.metaTitle")}
        description={t("pro.metaDescription").replace("{minPrice}", formatEurosLocale(lowestProPricePerKg() * 100, locale))}
        path="/professionnels"
        preloadImage={productVacuumBag}
        jsonLd={[
          proOfferSchema(),
          faqPageSchema(pro.faq.items),
          breadcrumbSchema([{ name: "Professionnels", path: "/professionnels" }]),
        ]}
      />
      <Navbar />

      <main className="pt-24">
        <div className="container mx-auto px-5 sm:px-6 max-w-[1100px]">
          {/* 1. Hero pro */}
          <section className="py-12 md:py-16 grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 items-center">
            <div>
              <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4">{pro.hero.label}</p>
              <h1 className="font-serif text-4xl md:text-6xl font-light leading-tight mb-6">
                {pro.hero.title} <span className="italic text-gradient-gold">{pro.hero.titleHighlight}</span>
              </h1>
              <ul className="flex flex-wrap gap-2 mb-6" aria-label={pro.hero.facts.join(", ")}>
                {pro.hero.facts.map((fact) => (
                  <li
                    key={fact}
                    className="px-3 py-1.5 border border-primary/50 rounded-sm text-base font-medium text-foreground bg-primary/10"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
              <p className="text-lg text-foreground/90 leading-relaxed mb-4 max-w-2xl">{pro.hero.description}</p>
              <p className="text-base font-medium text-primary mb-8">{PRO_ONLY_MENTION[locale]}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => goToForm("devis")}
                  className="px-8 py-4 bg-primary text-primary-foreground font-medium tracking-wider uppercase text-sm rounded-sm hover:bg-gold-light transition-colors"
                >
                  {pro.hero.ctaQuote}
                </button>
                <button
                  type="button"
                  onClick={() => goToForm("echantillon")}
                  className="px-8 py-4 border border-primary/60 text-foreground font-medium tracking-wider uppercase text-sm rounded-sm hover:border-primary hover:text-primary transition-colors"
                >
                  {pro.hero.ctaSample}
                </button>
              </div>
              <p className="mt-6 text-base text-foreground/80">
                {pro.hero.contact} ·{" "}
                <a href={EDITEUR.telephoneHref} className="text-primary hover:underline whitespace-nowrap">
                  {locale === "en" ? EDITEUR.telephoneInternational : EDITEUR.telephone}
                </a>
              </p>
            </div>
            <img
              src={productVacuumBag}
              alt="Morilles séchées entières et équeutées"
              className="w-full max-w-sm mx-auto aspect-[4/5] object-cover rounded-sm border border-gold/15"
              width={600}
              height={900}
              loading="eager"
            />
          </section>

          {/* 2. Tarifs */}
          <section id="tarifs" className={section}>
            <SectionHeading label={pro.pricing.label} title={pro.pricing.title} />
            <div className="max-w-3xl">
              <ProPriceTable showOrderLink={false} />
            </div>
          </section>

          {/* Commande en ligne : quantité, pots en option, paiement Stripe */}
          <section id="commander" className={`${section} scroll-mt-24`}>
            <SectionHeading label={pro.order.label} title={pro.order.title} />
            <ProOrderConfigurator />
          </section>

          {/* 3. Pour qui */}
          <section className={section}>
            <SectionHeading label={pro.audience.label} title={pro.audience.title} />
            <div className="grid md:grid-cols-3 gap-6">
              {pro.audience.items.map((item) => (
                <div key={item.title} className="p-6 border border-gold/15 rounded-sm bg-card/40">
                  <h3 className="font-serif text-xl mb-3 text-foreground">{item.title}</h3>
                  <p className="text-base text-foreground/85 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Récit : cueillette sauvage */}
          <section id="histoire" className={section}>
            <SectionHeading label={pro.story.label} title={pro.story.title} />
            <div className="grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 items-start">
              <div className="space-y-4 text-lg text-foreground/90 leading-relaxed">
                <p>{pro.story.p1}</p>
                <p>{pro.story.p2}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <figure>
                  <img
                    src={valerianPortrait}
                    alt="Valérian, fondateur de Morilles du Canada"
                    width={400}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-[3/4] object-cover object-top rounded-sm border border-gold/15"
                  />
                  <figcaption className="mt-2 text-sm text-foreground/80">Valérian, fondateur</figcaption>
                </figure>
                <figure>
                  <img
                    src={terrainPhoto}
                    alt="Morilles de feu sur sol brûlé en Colombie-Britannique"
                    width={600}
                    height={338}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-[3/4] object-cover rounded-sm border border-gold/15"
                  />
                  <figcaption className="mt-2 text-sm text-foreground/80">Colombie-Britannique</figcaption>
                </figure>
              </div>
            </div>
            <WildVsCultivated className="mt-10 max-w-4xl" />
          </section>

          {/* 4. Pourquoi équeutées */}
          <section className={section}>
            <SectionHeading label={pro.stemless.label} title={pro.stemless.title} />
            <div className="grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 items-start">
              <div className="space-y-4 text-lg text-foreground/90 leading-relaxed">
                <p>{pro.stemless.p1}</p>
                <p>{pro.stemless.p2}</p>
              </div>
              <img
                src={closeUpPhoto}
                alt="Gros plan sur les alvéoles du chapeau d'une morille sauvage"
                width={600}
                height={1067}
                loading="lazy"
                decoding="async"
                className="w-full max-w-xs aspect-[4/5] object-cover rounded-sm border border-gold/15"
              />
            </div>
          </section>

          {/* 5. Traçabilité */}
          <section className={section}>
            <SectionHeading label={pro.traceability.label} title={pro.traceability.title} />
            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pro.traceability.steps.map((step, i) => (
                <li key={step.title} className="border-t-2 border-primary/50 pt-4">
                  <p className="font-serif text-2xl text-primary mb-2">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="font-serif text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="text-base text-foreground/85 leading-relaxed">{step.text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/fiche-technique"
                className="inline-flex items-center gap-2 text-base text-primary hover:text-gold-light underline underline-offset-4"
              >
                <FileText className="w-4 h-4" /> {pro.traceability.sheet}
              </Link>
              <Link
                to="/plaquette-pro"
                className="inline-flex items-center gap-2 text-base text-primary hover:text-gold-light underline underline-offset-4"
              >
                <FileText className="w-4 h-4" /> {pro.traceability.brochure}
              </Link>
            </div>
          </section>

          {/* 6. Échantillon */}
          <section id="offre-echantillon" className={section}>
            <div className="p-6 md:p-10 border border-primary/40 rounded-sm bg-primary/5 md:flex md:items-center md:justify-between gap-8">
              <div>
                <p className="text-sm tracking-[0.25em] uppercase text-primary mb-3">{pro.sample.label}</p>
                <h2 className="font-serif text-3xl text-foreground mb-3">{pro.sample.title}</h2>
                <p className="text-lg text-foreground/90 max-w-xl">{pro.sample.text}</p>
              </div>
              <button
                type="button"
                onClick={() => goToForm("echantillon")}
                className="mt-6 md:mt-0 shrink-0 px-8 py-4 bg-primary text-primary-foreground font-medium tracking-wider uppercase text-sm rounded-sm hover:bg-gold-light transition-colors"
              >
                {pro.sample.cta}
              </button>
            </div>
          </section>

          {/* Précommande saison 2027 */}
          <section id="precommande" className={section}>
            <div className="p-6 md:p-10 border border-gold/25 rounded-sm bg-card/40 md:flex md:items-center md:justify-between gap-8">
              <div>
                <p className="text-sm tracking-[0.25em] uppercase text-primary mb-3">{pro.preorder.label}</p>
                <h2 className="font-serif text-3xl text-foreground mb-3">{pro.preorder.title}</h2>
                <p className="text-lg text-foreground/90 max-w-xl">{pro.preorder.text}</p>
              </div>
              <Link
                to="/precommande-2027"
                className="mt-6 md:mt-0 shrink-0 inline-block px-8 py-4 border border-primary/60 text-foreground font-medium tracking-wider uppercase text-sm rounded-sm hover:border-primary hover:text-primary transition-colors"
              >
                {pro.preorder.cta}
              </Link>
            </div>
          </section>

          {/* 7. Conditions */}
          <section className={section}>
            <SectionHeading label={pro.conditions.label} title={pro.conditions.title} />
            <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-6 max-w-4xl">
              {pro.conditions.items.map((item) => (
                <div key={item.title} className="border-l-2 border-primary/50 pl-4">
                  <dt className="font-serif text-lg text-foreground mb-1">{item.title}</dt>
                  <dd className="text-base text-foreground/85 leading-relaxed">{item.text}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 8. Formulaire */}
          <section id="devis" className={`${section} scroll-mt-24`}>
            <SectionHeading label={pro.form.label} title={pro.form.title} />
            <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-10">
              <div>
                <p className="text-base text-foreground/85 mb-6">{pro.form.intro}</p>
                <ProLeadForm kind={kind} onKindChange={setKind} />
              </div>
              <aside className="lg:pt-12">
                <div className="p-6 border border-gold/15 rounded-sm bg-card/40 space-y-4">
                  <p className="font-serif text-lg text-foreground">{pro.hero.contact}</p>
                  <a href={EDITEUR.telephoneHref} className="flex items-center gap-3 text-base text-foreground hover:text-primary">
                    <Phone className="w-5 h-5 text-primary" /> {locale === "en" ? EDITEUR.telephoneInternational : EDITEUR.telephone}
                  </a>
                  <a
                    href="mailto:contact@morillesducanada.com"
                    className="flex items-center gap-3 text-base text-foreground hover:text-primary break-all"
                  >
                    <Mail className="w-5 h-5 text-primary shrink-0" /> contact@morillesducanada.com
                  </a>
                </div>
              </aside>
            </div>
          </section>

          {/* 9. FAQ pro */}
          <section className={`${section} pb-24`}>
            <SectionHeading label={pro.faq.label} title={pro.faq.title} />
            <Accordion type="single" collapsible className="space-y-3 max-w-3xl">
              {pro.faq.items.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`pro-faq-${i}`}
                  className="border border-gold/15 rounded-sm px-5 data-[state=open]:border-gold/40"
                >
                  <AccordionTrigger className="text-left font-serif text-lg text-foreground hover:no-underline hover:text-primary py-4">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-foreground/85 leading-relaxed pb-5">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Professionnels;
