import { useI18n } from "@/i18n/context";
import { formatEurosLocale } from "@/lib/proPricing";
import {
  VACUUM_WEIGHTS,
  cheapestSmallFormat,
  formatGrams,
  getVacuumMorelPrice,
  vacuumSaving,
  type VacuumWeight,
} from "@/lib/products";

export const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));

const euros = (amount: number, locale: "fr" | "en") => formatEurosLocale(Math.round(amount * 100), locale);

const BADGES: Partial<Record<VacuumWeight, "vacuum.bestPerKg" | "vacuum.recommended">> = {
  1000: "vacuum.bestPerKg",
  500: "vacuum.recommended",
};

interface Props {
  value: VacuumWeight;
  onChange: (weight: VacuumWeight) => void;
  columns?: 2 | 4;
}

// Choix du format sous vide : prix, prix au kilo et économie face au petit format le moins cher au kilo.
const VacuumFormatPicker = ({ value, onChange, columns = 2 }: Props) => {
  const { t, locale } = useI18n();
  const reference = cheapestSmallFormat();
  const referenceInput = { grams: reference.grams, price: reference.product.price };
  const selected = vacuumSaving(value, referenceInput);

  return (
    <div>
      <p id="vacuum-format-label" className="text-xs text-muted-foreground mb-2 tracking-wider uppercase">
        {t("vacuum.choose")}
      </p>
      <div
        role="radiogroup"
        aria-labelledby="vacuum-format-label"
        className={`grid grid-cols-2 gap-2 ${columns === 4 ? "md:grid-cols-4" : ""}`}
      >
        {VACUUM_WEIGHTS.map((grams) => {
          const saving = vacuumSaving(grams, referenceInput);
          const active = value === grams;
          const badge = BADGES[grams];
          return (
            <button
              key={grams}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(grams)}
              className={`relative text-left px-3 pt-4 pb-3 border rounded-sm transition-all duration-200 ${
                active
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : badge
                    ? "border-primary/40 bg-secondary/20 hover:border-primary"
                    : "border-gold/20 bg-secondary/20 hover:border-gold/40"
              }`}
            >
              <span className="font-serif text-lg block text-foreground">{formatGrams(grams)}</span>
              {badge && (
                <span className="absolute -top-2 left-2 px-1.5 py-0.5 bg-primary text-primary-foreground text-[9px] font-medium tracking-wider uppercase rounded-sm whitespace-nowrap">
                  {t(badge)}
                </span>
              )}
              <span className="block text-primary font-medium">{euros(getVacuumMorelPrice(grams), locale)}</span>
              <span className="block text-[11px] text-muted-foreground">
                {fill(t("vacuum.perKg"), { price: euros(saving.perKg, locale) })}
              </span>
              {saving.percent > 0 && (
                <span className="block text-[11px] font-medium text-gold-light mt-0.5">
                  {fill(t("vacuum.optionSaving"), { percent: saving.percent })}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {selected.percent > 0 && (
        <p className="mt-3 text-xs text-foreground/80 leading-relaxed" aria-live="polite">
          {fill(t("vacuum.summary"), {
            perKg: fill(t("vacuum.perKg"), { price: euros(selected.perKg, locale) }),
            percent: selected.percent,
            ref: formatGrams(reference.grams),
            amount: euros(selected.amount, locale),
          })}
        </p>
      )}
    </div>
  );
};

export default VacuumFormatPicker;
