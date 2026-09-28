import { useI18n } from "@/i18n/context";
import {
  PRO_ONLY_MENTION,
  PRO_PAYMENT_LINKS,
  PRO_TAX_MENTION,
  PRO_TIERS,
  formatEurosLocale,
  formatKg,
  formatTierPrice,
  quote,
} from "@/lib/proPricing";

// Grille au kilo (source : supabase/functions/_shared/proPricing.ts), avec le lien de paiement
// Stripe de chaque palier pour la quantité de seuil (port inclus, France).
const ProPriceTable = ({ showPayLinks = true }: { showPayLinks?: boolean }) => {
  const { t, locale } = useI18n();

  return (
    <div>
      <div className="border border-gold/20 rounded-sm overflow-hidden">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-gold/20 bg-secondary/40 text-left">
              <th scope="col" className="py-3 px-4 text-sm font-medium tracking-wider uppercase text-foreground/85">
                {t("pro.pricing.colQuantity")}
              </th>
              <th scope="col" className="py-3 px-4 text-sm font-medium tracking-wider uppercase text-foreground/85 text-right">
                {t("pro.pricing.colPrice")}
              </th>
              <th scope="col" className="py-3 px-4 text-sm font-medium tracking-wider uppercase text-foreground/85 text-right hidden sm:table-cell">
                {t("pro.pricing.colExample")}
              </th>
            </tr>
          </thead>
          <tbody>
            {PRO_TIERS.map((tier) => {
              const example = quote(tier.minKg);
              return (
                <tr key={tier.id} className="border-b border-gold/10 last:border-0">
                  <td className="py-4 px-4 text-foreground">{tier.label[locale]}</td>
                  <td className="py-4 px-4 text-right font-serif text-xl text-primary whitespace-nowrap">
                    {formatTierPrice(tier, locale)}
                  </td>
                  <td className="py-4 px-4 text-right text-foreground/85 hidden sm:table-cell whitespace-nowrap">
                    {example ? `${formatKg(example.kg, locale)} = ${formatEurosLocale(example.totalCents, locale)}` : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-base text-foreground">{PRO_TAX_MENTION[locale]}.</p>
      <p className="mt-1 text-base text-foreground/85">
        {t("pro.pricing.intro")} {t("pro.pricing.minNote")}
      </p>
      <p className="mt-1 text-base text-foreground/85">{t("pro.pricing.packaging")}</p>
      <p className="mt-1 text-base text-foreground/85">{PRO_ONLY_MENTION[locale]}</p>

      {showPayLinks && (
        <div className="mt-6 p-5 border border-gold/20 rounded-sm bg-secondary/20">
          <p className="font-serif text-xl text-foreground">{t("pro.pricing.payTitle")}</p>
          <p className="mt-1 text-base text-foreground/85">{t("pro.pricing.payText")}</p>
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRO_TIERS.map((tier) => {
              const example = quote(tier.minKg);
              if (!example) return null;
              return (
                <li key={tier.id}>
                  <a
                    href={PRO_PAYMENT_LINKS[tier.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center px-3 py-3 border border-primary/50 rounded-sm text-center hover:bg-primary/10 hover:border-primary transition-colors"
                  >
                    <span className="text-base font-medium text-foreground">{formatKg(example.kg, locale)}</span>
                    <span className="text-sm text-primary">{formatEurosLocale(example.totalCents, locale)}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProPriceTable;
