import { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Loader2, Minus, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { useI18n } from "@/i18n/context";
import { loadSupabase } from "@/integrations/supabase/lazy";
import { breadcrumbSchema, preorderSchema, webPageSchema } from "@/lib/seo/schema";
import { OFFER_LAST_REVIEWED } from "@/lib/seo/site";
import { PREORDER_2027, preorderAmounts } from "@/lib/preorder";
import { PRO_ONLY_MENTION, PRO_TAX_MENTION, formatEurosLocale } from "@/lib/proPricing";
import harvestPhoto from "@/assets/morels/caisses-recolte-morilles-canada.webp";

const KG_OPTIONS = Array.from(
  { length: PREORDER_2027.maxKg - PREORDER_2027.minKg + 1 },
  (_, i) => PREORDER_2027.minKg + i,
);

const Precommande2027 = () => {
  const { t, translations, locale } = useI18n();
  const copy = translations.preorder;
  const [kg, setKg] = useState<number>(PREORDER_2027.minKg);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amounts = preorderAmounts(kg);
  const eur = (cents: number) => formatEurosLocale(cents, locale);
  const setClamped = (next: number) =>
    setKg(Math.min(PREORDER_2027.maxKg, Math.max(PREORDER_2027.minKg, Math.round(next))));

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = await loadSupabase();
      // Le serveur revalide la quantité (1 à 15 kg) et fixe le montant de l'acompte.
      const { data, error: invokeError } = await supabase.functions.invoke("create-preorder-checkout", {
        body: { kg, locale },
      });
      if (invokeError) throw invokeError;
      if (!data?.url) throw new Error("create-preorder-checkout: URL de paiement absente");
      window.location.href = data.url;
    } catch (err) {
      console.error("Pre-order checkout error:", err);
      setError(t("preorder.error"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={t("preorder.metaTitle")}
        description={t("preorder.metaDescription")}
        path="/precommande-2027"
        jsonLd={[
          webPageSchema({
            path: "/precommande-2027",
            name: t("preorder.metaTitle"),
            description: t("preorder.metaDescription"),
            dateModified: OFFER_LAST_REVIEWED,
          }),
          preorderSchema(),
          breadcrumbSchema([{ name: "Précommande saison 2027", path: "/precommande-2027" }]),
        ]}
      />
      <Navbar />

      <main className="pt-28 pb-24">
        <div className="container mx-auto px-5 sm:px-6 max-w-[1100px]">
          <section className="py-8 md:py-12 grid md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 items-center">
            <div>
              <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4">{copy.label}</p>
              <h1 className="font-serif text-4xl md:text-6xl font-light leading-tight mb-6">
                {copy.title} <span className="italic text-gradient-gold">{copy.titleHighlight}</span>
              </h1>
              <p className="text-lg text-foreground/90 leading-relaxed">{copy.intro}</p>
              <p className="mt-4 text-base font-medium text-primary">{PRO_ONLY_MENTION[locale]}</p>
            </div>
            <img
              src={harvestPhoto}
              alt="Caisses de morilles fraîches cueillies au Canada"
              width={600}
              height={338}
              loading="eager"
              className="w-full rounded-sm border border-gold/15 object-cover"
            />
          </section>

          <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 py-8 border-t border-gold/10">
            <section>
              <h2 className="font-serif text-3xl text-foreground mb-8">{copy.termsTitle}</h2>
              <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
                {copy.terms.map((item) => (
                  <div key={item.title} className="border-l-2 border-primary/50 pl-4">
                    <dt className="font-serif text-lg text-foreground mb-1">{item.title}</dt>
                    <dd className="text-base text-foreground/85 leading-relaxed">{item.text}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 text-base text-foreground/85">{PRO_TAX_MENTION[locale]}.</p>
            </section>

            <section aria-labelledby="precommande-form" className="p-6 md:p-8 border border-primary/40 rounded-sm bg-card/40 h-fit">
              <h2 id="precommande-form" className="font-serif text-2xl text-foreground mb-6">{copy.formTitle}</h2>

              <label htmlFor="precommande-kg" className="block text-sm text-foreground/80 mb-2">
                {copy.quantity}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setClamped(kg - 1)}
                  disabled={kg <= PREORDER_2027.minKg || loading}
                  aria-label={copy.decrease}
                  className="w-11 h-11 border border-gold/30 rounded-sm flex items-center justify-center hover:border-primary disabled:opacity-40"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <select
                  id="precommande-kg"
                  value={kg}
                  onChange={(e) => setClamped(Number(e.target.value))}
                  disabled={loading}
                  aria-describedby="precommande-kg-hint"
                  className="h-11 px-4 bg-secondary/30 border border-gold/30 rounded-sm font-serif text-lg text-foreground focus:outline-none focus:border-primary"
                >
                  {KG_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n} kg</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setClamped(kg + 1)}
                  disabled={kg >= PREORDER_2027.maxKg || loading}
                  aria-label={copy.increase}
                  className="w-11 h-11 border border-gold/30 rounded-sm flex items-center justify-center hover:border-primary disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p id="precommande-kg-hint" className="mt-2 text-sm text-foreground/70">{copy.quantityHint}</p>

              <dl className="mt-6 space-y-2 text-base" aria-live="polite">
                <div className="flex justify-between gap-4">
                  <dt className="text-foreground/80">{copy.total}</dt>
                  <dd className="text-foreground">{eur(amounts.totalCents)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-foreground/80">{copy.balance}</dt>
                  <dd className="text-foreground">{eur(amounts.balanceCents)}</dd>
                </div>
                <div className="flex justify-between gap-4 pt-3 border-t border-gold/15">
                  <dt className="font-serif text-lg text-foreground">{copy.deposit}</dt>
                  <dd className="font-serif text-2xl text-gradient-gold">{eur(amounts.depositCents)}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="mt-6 w-full py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> {copy.redirecting}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" /> {copy.submit.replace("{amount}", eur(amounts.depositCents))}
                  </>
                )}
              </button>
              {error && (
                <p role="alert" className="mt-3 text-sm text-red-400">
                  {error}
                </p>
              )}
              <p className="mt-3 text-sm text-foreground/80">{copy.secure}</p>
            </section>
          </div>

          <section className="mt-12 py-10 border-t border-gold/10 md:flex md:items-center md:justify-between gap-8">
            <div>
              <h2 className="font-serif text-2xl text-foreground mb-2">{copy.stockTitle}</h2>
              <p className="text-base text-foreground/85 max-w-xl">{copy.stockText}</p>
            </div>
            <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/professionnels"
                className="px-6 py-3 border border-primary/60 text-foreground text-sm tracking-wider uppercase rounded-sm hover:border-primary hover:text-primary transition-colors text-center"
              >
                {copy.stockPro}
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Precommande2027;
