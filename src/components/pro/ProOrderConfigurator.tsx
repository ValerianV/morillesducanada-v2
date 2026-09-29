import { useMemo, useState } from "react";
import { CreditCard, Loader2, Minus, Plus } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { loadSupabase } from "@/integrations/supabase/lazy";
import {
  PRO_KG_STEP,
  PRO_MAX_KG,
  PRO_MIN_KG,
  PRO_TAX_MENTION,
  cheaperQuoteAtNextTier,
  formatEurosLocale,
  formatKg,
  formatTierPrice,
  isValidProQuantity,
} from "@/lib/proPricing";
import {
  POT_DEFAULT_AUTO_SIZE,
  POT_PRICE_CENTS,
  POT_SIZES_G,
  POT_STOCK,
  formatBags,
  formatGrams,
  formatPotsSummary,
  quoteProOrder,
  type PotSize,
} from "@/lib/potAllocation";
import jarsPhoto from "@/assets/hero-jars.webp";

// Recadrage de la photo des trois pots (1440 × 960) : un pot par vignette, au format 7:10.
// Position horizontale du pot de 45, 30 et 12 g, de gauche à droite sur la photo.
const JAR_CROP_X: Record<PotSize, string> = { 45: "9.4%", 30: "47.2%", 12: "84.8%" };

const parseKg = (value: string): number | null => {
  const n = Number(value.replace(",", ".").replace(/\s|kg/gi, ""));
  return isValidProQuantity(n) ? n : null;
};

const clampKg = (kg: number) => Math.min(PRO_MAX_KG, Math.max(PRO_MIN_KG, Math.round(kg / PRO_KG_STEP) * PRO_KG_STEP));

type Auto = PotSize | "none";

// Configurateur de commande pro : quantité au kilo, option pots en verre vides, paiement Stripe.
// Le calcul affiché est celui du serveur (quoteProOrder, partagé avec create-pro-checkout).
const ProOrderConfigurator = () => {
  const { t, locale } = useI18n();
  const eur = (cents: number) => formatEurosLocale(cents, locale);
  const kgLabel = (kg: number) => formatKg(kg, locale);

  const [kg, setKg] = useState(2);
  const [kgDraft, setKgDraft] = useState<string | null>(null);
  const [withPots, setWithPots] = useState(false);
  const [counts, setCounts] = useState<Record<PotSize, string>>({ 12: "0", 30: "0", 45: "0" });
  const [auto, setAuto] = useState<Auto>(POT_DEFAULT_AUTO_SIZE);
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const autoSize = auto === "none" ? null : auto;
  const fixed = useMemo(() => {
    const out: Partial<Record<PotSize, number>> = {};
    for (const size of POT_SIZES_G) {
      if (size === autoSize) continue;
      const raw = counts[size].trim();
      out[size] = raw === "" ? 0 : Number(raw);
    }
    return out;
  }, [counts, autoSize]);

  const order = quoteProOrder({ kg, pots: withPots ? { fixed, autoSize } : null });
  const orderError = order.ok === false ? order.error : null;
  const cheaper = cheaperQuoteAtNextTier(kg);

  const step = (delta: number) => {
    setKg((current) => clampKg(current + delta));
    setKgDraft(null);
  };

  const handlePay = async () => {
    if (!order.ok) return;
    setLoading(true);
    setPayError(null);
    try {
      const supabase = await loadSupabase();
      // Le client n'envoie que la quantité et les pots demandés : le serveur recalcule tout.
      const { data, error } = await supabase.functions.invoke("create-pro-checkout", {
        body: { kg, pots: withPots ? { fixed, autoSize } : null, locale },
      });
      if (error) throw error;
      if (!data?.url) throw new Error("create-pro-checkout: URL de paiement absente");
      window.location.href = data.url;
    } catch (err) {
      console.error("Pro checkout error:", err);
      setPayError(t("pro.order.error"));
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 bg-background border border-gold/25 rounded-sm text-base text-foreground text-center tabular-nums focus:outline-none focus:border-primary";

  return (
    <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 lg:gap-8 items-start">
      <div className="space-y-6">
        <p className="text-base text-foreground/85 max-w-2xl">{t("pro.order.intro")}</p>

        {/* Quantité */}
        <div className="p-5 border border-gold/20 rounded-sm bg-card/40">
          <label htmlFor="order-kg" className="block font-serif text-xl text-foreground">
            {t("pro.order.quantity")}
          </label>
          <p id="order-kg-hint" className="mt-1 text-sm text-foreground/80">
            {t("pro.order.quantityHint")}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => step(-PRO_KG_STEP)}
              disabled={kg <= PRO_MIN_KG}
              aria-label={t("pro.order.decrease")}
              className="w-12 h-12 shrink-0 flex items-center justify-center border border-primary/50 rounded-sm text-foreground hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-primary/50 disabled:hover:text-foreground transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="relative w-28">
              <input
                id="order-kg"
                type="text"
                inputMode="decimal"
                aria-describedby="order-kg-hint"
                value={kgDraft ?? new Intl.NumberFormat(locale === "en" ? "en-IE" : "fr-FR").format(kg)}
                onChange={(e) => {
                  setKgDraft(e.target.value);
                  const parsed = parseKg(e.target.value);
                  if (parsed !== null) setKg(parsed);
                }}
                onBlur={() => setKgDraft(null)}
                className={`${inputClass} h-12 pr-9 font-serif text-2xl`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-foreground/70 pointer-events-none">kg</span>
            </div>
            <button
              type="button"
              onClick={() => step(PRO_KG_STEP)}
              disabled={kg >= PRO_MAX_KG}
              aria-label={t("pro.order.increase")}
              className="w-12 h-12 shrink-0 flex items-center justify-center border border-primary/50 rounded-sm text-foreground hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-primary/50 disabled:hover:text-foreground transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {order.ok && (
            <p className="mt-4 text-base text-foreground" aria-live="polite">
              <span className="text-primary font-medium">
                {t("pro.order.tier")
                  .replace("{tier}", order.morels.tier.label[locale])
                  .replace("{price}", formatTierPrice(order.morels.tier, locale))}
              </span>
              <span className="text-foreground/80"> · {formatBags(order.kg, order.bags, locale)}</span>
            </p>
          )}
          {cheaper && (
            <p className="mt-2 text-sm text-foreground/85">
              {t("pro.order.nextTierHint").replace("{kg}", kgLabel(cheaper.kg)).replace("{total}", eur(cheaper.totalCents))}
            </p>
          )}
        </div>

        {/* Option pots */}
        <div className="border border-gold/20 rounded-sm bg-card/40 overflow-hidden">
          <label className="flex items-start gap-3 p-5 cursor-pointer">
            <input
              type="checkbox"
              checked={withPots}
              onChange={(e) => setWithPots(e.target.checked)}
              className="mt-1 w-5 h-5 shrink-0 accent-[hsl(var(--primary))]"
            />
            <span>
              <span className="block font-serif text-xl text-foreground">{t("pro.order.potsOption")}</span>
              <span className="block mt-1 text-sm text-foreground/80 leading-relaxed">{t("pro.order.potsOptionHint")}</span>
            </span>
          </label>

          {withPots && (
            <div className="px-5 pb-5 space-y-5">
              <figure>
                <img
                  src={jarsPhoto}
                  alt={t("pro.order.potsPhotoAlt")}
                  width={1440}
                  height={960}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-[3/2] object-cover rounded-sm border border-gold/15"
                />
                <figcaption className="mt-2 text-sm text-foreground/75">{t("pro.order.potsPhotoCaption")}</figcaption>
              </figure>

              <fieldset>
                <legend className="font-serif text-lg text-foreground">{t("pro.order.potsLegend")}</legend>
                <p className="mt-1 text-sm text-foreground/80 leading-relaxed">{t("pro.order.potsHelp")}</p>
                <ul className="mt-4 space-y-3">
                  {POT_SIZES_G.map((size) => {
                    const isAuto = size === autoSize;
                    const computed = order.ok ? order.pots?.pots[size] ?? 0 : null;
                    return (
                      <li
                        key={size}
                        className={`grid grid-cols-[56px_minmax(0,1fr)_84px] items-center gap-3 p-3 rounded-sm border ${
                          isAuto ? "border-primary/60 bg-primary/5" : "border-gold/15"
                        }`}
                      >
                        <div
                          role="img"
                          aria-label={t("pro.order.potLabel").replace("{size}", String(size))}
                          className="w-14 aspect-[7/10] rounded-sm border border-gold/15 bg-no-repeat"
                          style={{
                            backgroundImage: `url(${jarsPhoto})`,
                            backgroundSize: "331.8% auto",
                            backgroundPosition: `${JAR_CROP_X[size]} 47%`,
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-serif text-lg text-foreground leading-tight whitespace-nowrap">
                            {t("pro.order.potLabel").replace("{size}", String(size))}
                          </p>
                          {POT_STOCK[size] !== null && (
                            <p className="text-xs text-foreground/70">
                              {t("pro.order.potStock").replace("{n}", String(POT_STOCK[size]))}
                            </p>
                          )}
                          <label className="mt-1.5 inline-flex items-center gap-2 text-sm text-foreground/85 cursor-pointer">
                            <input
                              type="radio"
                              name="pots-auto"
                              value={size}
                              checked={isAuto}
                              onChange={() => setAuto(size)}
                              className="w-4 h-4 accent-[hsl(var(--primary))]"
                            />
                            {t("pro.order.autoLabel")}
                          </label>
                        </div>
                        {isAuto ? (
                          <output
                            aria-label={t("pro.order.potCount").replace("{size}", String(size))}
                            className="block px-2 py-2 border border-primary/40 rounded-sm text-center bg-background/60"
                          >
                            <span className="block font-serif text-xl text-primary tabular-nums leading-tight">
                              {computed ?? "—"}
                            </span>
                            <span className="block text-[11px] uppercase tracking-wider text-foreground/70">{t("pro.order.autoValue")}</span>
                          </output>
                        ) : (
                          <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            max={POT_STOCK[size] ?? undefined}
                            step={1}
                            aria-label={t("pro.order.potCount").replace("{size}", String(size))}
                            value={counts[size]}
                            onChange={(e) => setCounts((prev) => ({ ...prev, [size]: e.target.value }))}
                            onFocus={(e) => e.target.select()}
                            className={`${inputClass} h-[54px] font-serif text-xl`}
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
                <label className="mt-3 flex items-center gap-2 text-sm text-foreground/85 cursor-pointer">
                  <input
                    type="radio"
                    name="pots-auto"
                    value="none"
                    checked={auto === "none"}
                    onChange={() => setAuto("none")}
                    className="w-4 h-4 accent-[hsl(var(--primary))]"
                  />
                  {t("pro.order.noAuto")}
                </label>
              </fieldset>
            </div>
          )}
        </div>
      </div>

      {/* Récapitulatif */}
      <aside className="lg:sticky lg:top-24 p-5 md:p-6 border border-primary/40 rounded-sm bg-primary/5" aria-labelledby="order-summary-title">
        <p id="order-summary-title" className="text-sm tracking-[0.25em] uppercase text-primary">
          {t("pro.order.summaryTitle")}
        </p>
        {order.ok ? (
          <div aria-live="polite">
            <ul className="mt-4 space-y-2 text-base text-foreground">
              <li>{formatBags(order.kg, order.bags, locale)}</li>
              {order.pots && (
                <>
                  <li>{formatPotsSummary(order.pots.pots, locale)}</li>
                  <li className="text-foreground/80">
                    {t("pro.order.inPots")
                      .replace("{inPots}", formatGrams(order.pots.gramsInPots, locale))
                      .replace("{bulk}", formatGrams(order.pots.bulkGrams, locale))}
                  </li>
                </>
              )}
            </ul>
            <dl className="mt-5 pt-4 border-t border-gold/20 space-y-1.5 text-base">
              <div className="flex justify-between gap-4">
                <dt className="text-foreground/85">{t("pro.order.morels")}</dt>
                <dd className="tabular-nums text-foreground whitespace-nowrap">{eur(order.morelsCents)}</dd>
              </div>
              {order.pots && (
                <div className="flex justify-between gap-4">
                  <dt className="text-foreground/85">
                    {t("pro.order.pots")} ({order.pots.potCount} × {eur(POT_PRICE_CENTS)})
                  </dt>
                  <dd className="tabular-nums text-foreground whitespace-nowrap">{eur(order.potsCents)}</dd>
                </div>
              )}
              <div className="flex justify-between items-baseline gap-4 pt-2">
                <dt className="font-medium text-foreground">{t("pro.order.total")}</dt>
                <dd className="font-serif text-3xl text-primary tabular-nums whitespace-nowrap">{eur(order.totalCents)}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <p role="alert" className="mt-4 text-base text-foreground bg-destructive/20 border border-destructive/40 rounded-sm px-3 py-2">
            {orderError?.message[locale]}
          </p>
        )}

        <div className="mt-5 space-y-1 text-sm text-foreground/85 leading-relaxed">
          <p>{PRO_TAX_MENTION[locale]}.</p>
          <p>{t("pro.order.delivery")}</p>
          {order.ok && order.pots && <p>{t("pro.order.potsDelivery")}</p>}
        </div>

        <button
          type="button"
          onClick={handlePay}
          disabled={!order.ok || loading}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-medium tracking-wider uppercase text-sm rounded-sm hover:bg-gold-light disabled:opacity-50 disabled:hover:bg-primary transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
          {loading ? t("pro.order.paying") : t("pro.order.pay")}
        </button>
        <p className="mt-2 text-xs text-foreground/70 text-center">{t("pro.order.secure")}</p>
        {payError && (
          <p role="alert" className="mt-3 text-sm text-foreground bg-destructive/20 border border-destructive/40 rounded-sm px-3 py-2">
            {payError}
          </p>
        )}
      </aside>
    </div>
  );
};

export default ProOrderConfigurator;
