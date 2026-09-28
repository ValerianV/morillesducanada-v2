import { useId, useMemo, useState, type ReactNode } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PRO_TAX_MENTION,
  cheaperQuoteAtNextTier,
  formatEurosLocale,
  formatKg,
  formatTierPrice,
  quote,
  type ProQuote,
} from "@/lib/proPricing";
import { ESTABLISHMENT_TYPES, validateProLead, type EstablishmentType, type ProLeadKind } from "@/lib/proLead";
import { getUtm } from "@/lib/utm";

interface Props {
  kind: ProLeadKind;
  onKindChange: (kind: ProLeadKind) => void;
}

const QUICK_KG = [1, 3, 5, 10];

const inputClass =
  "w-full px-4 py-3 bg-secondary/40 border border-gold/20 rounded-sm text-base text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors";
const labelClass = "block text-sm font-medium text-foreground/90 mb-2";

const emptyForm = {
  establishment_type: "" as EstablishmentType | "",
  company: "",
  contact_name: "",
  email: "",
  phone: "",
  postal_code: "",
  city: "",
  address: "",
  kg: "5",
  message: "",
  website: "",
};

type FormState = typeof emptyForm;

function parseKg(value: string): number {
  return Number(value.replace(",", ".").trim());
}

const ProLeadForm = ({ kind, onKindChange }: Props) => {
  const { t, locale } = useI18n();
  const formId = useId();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<{ kind: ProLeadKind; email: string; quote: ProQuote | null } | null>(null);

  const liveQuote = useMemo(() => quote(parseKg(form.kg)), [form.kg]);
  const betterQuote = useMemo(() => cheaperQuoteAtNextTier(parseKg(form.kg)), [form.kg]);

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const errorText = (field: string): string | null => {
    if (!errors[field]) return null;
    if (field === "kg") return t("pro.form.errors.quantity");
    if (field === "email") return t("pro.form.errors.email");
    if (field === "phone" || field === "postal_code") return t("pro.form.errors.invalid");
    return t("pro.form.errors.required");
  };

  const field = (name: keyof FormState, label: string, input: ReactNode, required = false) => {
    const err = errorText(name);
    return (
      <div>
        <label htmlFor={`${formId}-${name}`} className={labelClass}>
          {label}
          {required && <span className="text-primary"> *</span>}
        </label>
        {input}
        {err && (
          <p id={`${formId}-${name}-error`} className="mt-1.5 text-sm text-red-400">
            {err}
          </p>
        )}
      </div>
    );
  };

  const textInput = (
    name: keyof FormState,
    opts: { type?: string; autoComplete?: string; placeholder?: string; inputMode?: "numeric" | "decimal" | "tel" | "email" } = {},
  ) => (
    <input
      id={`${formId}-${name}`}
      name={name}
      type={opts.type ?? "text"}
      autoComplete={opts.autoComplete}
      inputMode={opts.inputMode}
      placeholder={opts.placeholder}
      value={form[name]}
      onChange={(e) => update(name, e.target.value)}
      aria-invalid={Boolean(errors[name])}
      aria-describedby={errors[name] ? `${formId}-${name}-error` : undefined}
      className={`${inputClass} ${errors[name] ? "border-red-400/70" : ""}`}
    />
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const payload = {
      kind,
      company: form.company,
      contact_name: form.contact_name,
      email: form.email,
      phone: form.phone,
      establishment_type: form.establishment_type,
      city: form.city,
      postal_code: form.postal_code,
      address: form.address,
      kg: kind === "devis" ? parseKg(form.kg) : undefined,
      message: form.message,
      locale,
      utm: getUtm(),
      website: form.website,
    };

    const validation = validateProLead(payload);
    if ("errors" in validation) {
      setErrors(validation.errors);
      setFormError(t("pro.form.errors.validation"));
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-pro-lead", { body: payload });
      if (error) {
        let code: string | undefined;
        let fields: Record<string, string> | undefined;
        const context = (error as { context?: unknown }).context;
        if (context instanceof Response) {
          try {
            const body = await context.json();
            code = body?.error;
            fields = body?.fields;
          } catch {
            // réponse non JSON
          }
        }
        if (code === "validation" && fields) {
          setErrors(fields);
          setFormError(t("pro.form.errors.validation"));
        } else if (code === "rate_limited") {
          setFormError(t("pro.form.errors.rateLimited"));
        } else if (code === "sample_already_requested") {
          setFormError(t("pro.form.errors.sampleExists"));
        } else {
          setFormError(t("pro.form.errors.generic"));
        }
        return;
      }
      if (!data?.ok) {
        setFormError(t("pro.form.errors.generic"));
        return;
      }
      setSuccess({ kind, email: validation.lead.email, quote: validation.quote });
      setForm(emptyForm);
      setErrors({});
    } catch (err) {
      console.error("submit-pro-lead:", err);
      setFormError(t("pro.form.errors.generic"));
    } finally {
      setSending(false);
    }
  };

  if (success) {
    return (
      <div className="border border-primary/40 rounded-sm p-8 bg-background/60" role="status">
        <CheckCircle className="w-10 h-10 text-primary mb-4" />
        <h3 className="font-serif text-2xl mb-3">{t("pro.form.successTitle")}</h3>
        <p className="text-base text-foreground/90 leading-relaxed">
          {success.kind === "devis" ? t("pro.form.successQuote") : t("pro.form.successSample")}
        </p>
        {success.quote && (
          <p className="mt-4 text-base text-foreground">
            {formatKg(success.quote.kg, locale)} · {formatTierPrice(success.quote.tier, locale)} ·{" "}
            <strong className="text-primary">{formatEurosLocale(success.quote.totalCents, locale)}</strong>
          </p>
        )}
        <p className="mt-4 text-base text-foreground/80">
          {t("pro.form.successEmail")} <span className="text-foreground">{success.email}</span>.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(null)}
          className="mt-6 text-base text-primary hover:text-gold-light underline underline-offset-4"
        >
          {t("pro.form.another")}
        </button>
      </div>
    );
  }

  const commonFields = (
    <>
      <fieldset>
        <legend className={labelClass}>
          {t("pro.form.establishmentType")}
          <span className="text-primary"> *</span>
        </legend>
        <div className="flex flex-wrap gap-2" role="radiogroup">
          {ESTABLISHMENT_TYPES.map((type) => {
            const selected = form.establishment_type === type;
            return (
              <button
                key={type}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => update("establishment_type", type)}
                className={`px-4 py-2 rounded-sm border text-base transition-colors ${
                  selected
                    ? "border-primary bg-primary/15 text-foreground"
                    : "border-gold/20 bg-secondary/30 text-foreground/85 hover:border-gold/50"
                }`}
              >
                {t(`pro.form.types.${type}`)}
              </button>
            );
          })}
        </div>
        {errors.establishment_type && <p className="mt-1.5 text-sm text-red-400">{t("pro.form.errors.required")}</p>}
      </fieldset>

      <div className="grid md:grid-cols-2 gap-4">
        {field("company", t("pro.form.company"), textInput("company", { autoComplete: "organization" }), true)}
        {field("contact_name", t("pro.form.contactName"), textInput("contact_name", { autoComplete: "name" }), true)}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {field("email", t("pro.form.email"), textInput("email", { type: "email", autoComplete: "email", inputMode: "email" }), true)}
        {field("phone", t("pro.form.phone"), textInput("phone", { type: "tel", autoComplete: "tel", inputMode: "tel" }))}
      </div>
    </>
  );

  const locationFields = (requireAddress: boolean) => (
    <>
      {requireAddress &&
        field(
          "address",
          t("pro.form.address"),
          textInput("address", { autoComplete: "street-address", placeholder: t("pro.form.addressPlaceholder") }),
          true,
        )}
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4">
        {field("postal_code", t("pro.form.postalCode"), textInput("postal_code", { autoComplete: "postal-code" }), true)}
        {field("city", t("pro.form.city"), textInput("city", { autoComplete: "address-level2" }), true)}
      </div>
    </>
  );

  const messageField = (placeholder: string) =>
    field(
      "message",
      t("pro.form.message"),
      <textarea
        id={`${formId}-message`}
        name="message"
        rows={3}
        value={form.message}
        placeholder={placeholder}
        onChange={(e) => update("message", e.target.value)}
        className={`${inputClass} resize-y`}
      />,
    );

  const submitButton = (label: string) => (
    <div className="space-y-3">
      {formError && (
        <p className="text-base text-red-400" role="alert">
          {formError}
        </p>
      )}
      <button
        type="submit"
        disabled={sending}
        className="w-full py-4 bg-primary text-primary-foreground font-medium tracking-wider uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {sending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> {t("pro.form.sending")}
          </>
        ) : (
          label
        )}
      </button>
      <p className="text-sm text-foreground/70">
        <span className="text-primary">*</span> {t("pro.form.requiredNote")}
      </p>
    </div>
  );

  // Champ piège : invisible pour les visiteurs, rempli par les robots.
  const honeypot = (
    <div aria-hidden="true" className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden">
      <label htmlFor={`${formId}-website`}>Website</label>
      <input
        id={`${formId}-website`}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={(e) => update("website", e.target.value)}
      />
    </div>
  );

  return (
    <Tabs value={kind} onValueChange={(v) => onKindChange(v as ProLeadKind)}>
      <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-secondary/50 border border-gold/20 rounded-sm">
        <TabsTrigger
          value="devis"
          className="py-3 text-base rounded-sm text-foreground/75 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          {t("pro.form.tabQuote")}
        </TabsTrigger>
        <TabsTrigger
          value="echantillon"
          className="py-3 text-base rounded-sm text-foreground/75 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          {t("pro.form.tabSample")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="devis" className="mt-6">
        <form onSubmit={handleSubmit} noValidate className="relative space-y-6">
          {honeypot}
          {commonFields}

          <div>
            <label htmlFor={`${formId}-kg`} className={labelClass}>
              {t("pro.form.quantity")}
              <span className="text-primary"> *</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                id={`${formId}-kg`}
                name="kg"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={form.kg}
                onChange={(e) => update("kg", e.target.value)}
                aria-invalid={Boolean(errors.kg)}
                aria-describedby={`${formId}-kg-hint`}
                className={`${inputClass.replace("w-full", "w-28")} text-center font-serif text-lg ${errors.kg ? "border-red-400/70" : ""}`}
              />
              {QUICK_KG.map((kg) => (
                <button
                  key={kg}
                  type="button"
                  onClick={() => update("kg", String(kg))}
                  className={`px-3 py-2 rounded-sm border text-base transition-colors ${
                    parseKg(form.kg) === kg
                      ? "border-primary bg-primary/15 text-foreground"
                      : "border-gold/20 text-foreground/85 hover:border-gold/50"
                  }`}
                >
                  {formatKg(kg, locale)}
                </button>
              ))}
            </div>
            <p id={`${formId}-kg-hint`} className="mt-2 text-sm text-foreground/70">
              {t("pro.form.quantityHint")}
            </p>
            {errors.kg && <p className="mt-1.5 text-sm text-red-400">{t("pro.form.errors.quantity")}</p>}

            <div className="mt-4 p-4 border border-gold/20 rounded-sm bg-background/50" aria-live="polite">
              {liveQuote ? (
                <>
                  <p className="text-sm font-medium uppercase tracking-wider text-foreground/70">{t("pro.form.estimate")}</p>
                  <p className="mt-1 text-base text-foreground">
                    {formatKg(liveQuote.kg, locale)} · {t("pro.form.tier")} {liveQuote.tier.label[locale]} ·{" "}
                    {formatTierPrice(liveQuote.tier, locale)}
                  </p>
                  <p className="mt-2 text-base text-foreground">
                    {t("pro.form.total")} :{" "}
                    <span className="font-serif text-2xl text-primary">
                      {formatEurosLocale(liveQuote.totalCents, locale)}
                    </span>
                  </p>
                  {betterQuote && (
                    <p className="mt-2 text-base text-foreground/85">
                      {t("pro.form.nextTierHint")
                        .replace("{kg}", formatKg(betterQuote.kg, locale))
                        .replace("{total}", formatEurosLocale(betterQuote.totalCents, locale))}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-foreground/70">{PRO_TAX_MENTION[locale]}.</p>
                </>
              ) : (
                <p className="text-base text-foreground/80">{t("pro.form.errors.quantity")}</p>
              )}
            </div>
          </div>

          {locationFields(false)}
          {messageField(t("pro.form.messageQuotePlaceholder"))}
          {submitButton(t("pro.form.submitQuote"))}
        </form>
      </TabsContent>

      <TabsContent value="echantillon" className="mt-6">
        <form onSubmit={handleSubmit} noValidate className="relative space-y-6">
          {honeypot}
          <p className="text-base text-foreground/90">{t("pro.form.sampleInfo")}</p>
          {commonFields}
          {locationFields(true)}
          {messageField(t("pro.form.messageSamplePlaceholder"))}
          {submitButton(t("pro.form.submitSample"))}
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default ProLeadForm;
