import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { loadSupabase } from "@/integrations/supabase/lazy";

// Échantillon payant (pot de 30 g, prix et port dans _shared/sample.ts) : le serveur crée la session Stripe.
const SampleCheckoutButton = ({ className }: { className?: string }) => {
  const { t, locale } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = await loadSupabase();
      const { data, error: invokeError } = await supabase.functions.invoke("create-sample-checkout", { body: { locale } });
      if (invokeError) throw invokeError;
      if (!data?.url) throw new Error("create-sample-checkout: URL de paiement absente");
      window.location.href = data.url;
    } catch (err) {
      console.error("Sample checkout error:", err);
      setError(t("pro.sample.error"));
      setLoading(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={pay} disabled={loading} className={className}>
        {loading ? t("pro.sample.paying") : t("pro.sample.cta")}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

export default SampleCheckoutButton;
