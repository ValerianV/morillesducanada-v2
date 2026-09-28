import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { PRO_TAX_MENTION, PRO_TIERS, formatEurosLocale, formatKg, formatTierPrice, quote } from "@/lib/proPricing";
import { getVacuumMorelPrice, smallVacuumFormatsText } from "@/lib/products";
import { fill } from "@/components/VacuumFormatPicker";

const ProPriceTable = () => {
  const { t, locale } = useI18n();

  return (
    <div>
      <div className="border border-gold/20 rounded-sm overflow-hidden">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-gold/20 bg-secondary/40 text-left">
              <th scope="col" className="py-3 px-4 text-sm font-medium tracking-wider uppercase text-foreground/80">
                {t("pro.pricing.colQuantity")}
              </th>
              <th scope="col" className="py-3 px-4 text-sm font-medium tracking-wider uppercase text-foreground/80 text-right">
                {t("pro.pricing.colPrice")}
              </th>
              <th scope="col" className="py-3 px-4 text-sm font-medium tracking-wider uppercase text-foreground/80 text-right hidden sm:table-cell">
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
                  <td className="py-4 px-4 text-right text-foreground/80 hidden sm:table-cell whitespace-nowrap">
                    {example ? `${formatKg(example.kg, locale)} = ${formatEurosLocale(example.totalCents, locale)}` : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-base text-foreground">{PRO_TAX_MENTION[locale]}.</p>
      <p className="mt-1 text-base text-foreground/80">
        {t("pro.pricing.intro")} {t("pro.pricing.minNote")}
      </p>
      <p className="mt-3 text-base text-foreground/80">
        {fill(t("pro.pricing.sameGrid"), {
          price: formatEurosLocale(getVacuumMorelPrice(1000) * 100, locale),
          small: smallVacuumFormatsText(locale),
        })}{" "}
        <Link
          to="/produits/morilles-sous-vide"
          className="inline-flex items-center gap-1 text-primary hover:text-gold-light underline underline-offset-4"
        >
          {t("pro.pricing.sameGridCta")} <ArrowRight className="w-4 h-4" />
        </Link>
      </p>
    </div>
  );
};

export default ProPriceTable;
