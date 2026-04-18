import { useState } from "react";
import { Mail, MapPin, Loader2, CheckCircle, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n/context";

const ContactSection = () => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({ name: "", email: "", type: "particulier", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const { error: insertError } = await supabase
        .from("contact_messages")
        .insert({ name: formData.name, email: formData.email, type: formData.type, message: formData.message });
      if (insertError) throw insertError;

      // Trigger email notification to admin
      supabase.functions.invoke("notify-contact", { body: { record: { name: formData.name, email: formData.email, type: formData.type, message: formData.message, created_at: new Date().toISOString() } } }).catch((err) => {
        console.error("Failed to invoke notify-contact:", err);
      });

      setIsSuccess(true);
      setFormData({ name: "", email: "", type: "particulier", message: "" });
    } catch (err: any) {
      console.error("Contact form error:", err);
      setError(t("contact.form.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">{t("contact.label")}</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light">
            <span className="italic text-gradient-gold">{t("contact.title")}</span>{t("contact.titleSuffix")}
          </h2>
          <div className="divider-gold w-24 mx-auto mt-8" />
        </div>

        <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <div className="space-y-8">
            <p className="text-secondary-foreground/80 font-light leading-relaxed">{t("contact.description")}</p>
            <div className="space-y-4">
              <a href="tel:+33782162708" className="flex items-center gap-4 group">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground font-light group-hover:text-primary transition-colors">07 82 16 27 08</span>
              </a>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground font-light">contact@morillesducanada.com</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground font-light">Colombie-Britannique & Yukon, Canada → France</span>
              </div>
            </div>
            <div className="p-6 border border-gold/15 rounded-sm">
              <p className="font-serif text-lg mb-2">{t("contact.proTitle")}</p>
              <p className="text-sm text-muted-foreground font-light mb-4">{t("contact.proDesc")}</p>
              <a
                href="tel:+33782162708"
                className="inline-flex items-center gap-2 text-primary hover:text-gold-light transition-colors duration-300 font-medium text-sm"
              >
                <Phone className="w-4 h-4" />
                {t("contact.phoneLabel")} — 07 82 16 27 08
              </a>
            </div>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4 p-8 border border-gold/15 rounded-sm">
              <CheckCircle className="w-12 h-12 text-primary" />
              <p className="font-serif text-xl">{t("contact.form.successTitle")}</p>
              <p className="text-sm text-muted-foreground font-light">{t("contact.form.successDesc")}</p>
              <button onClick={() => setIsSuccess(false)} className="text-sm text-primary underline underline-offset-4 hover:text-gold-light transition-colors">
                {t("contact.form.another")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">{t("contact.form.name")}</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-secondary/50 border border-gold/15 rounded-sm px-4 py-3 text-sm text-foreground font-light focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">{t("contact.form.email")}</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-secondary/50 border border-gold/15 rounded-sm px-4 py-3 text-sm text-foreground font-light focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">{t("contact.form.type")}</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-secondary/50 border border-gold/15 rounded-sm px-4 py-3 text-sm text-foreground font-light focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="particulier">{t("contact.form.typeOptions.individual")}</option>
                  <option value="professionnel">{t("contact.form.typeOptions.professional")}</option>
                  <option value="precommande-2026">{t("contact.form.typeOptions.preorder")}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-muted-foreground mb-2">{t("contact.form.message")}</label>
                <textarea rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-secondary/50 border border-gold/15 rounded-sm px-4 py-3 text-sm text-foreground font-light focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder={t("contact.form.placeholder")} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button type="submit" disabled={isSubmitting}
                className="w-full py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (<><Loader2 className="w-4 h-4 animate-spin" />{t("contact.form.sending")}</>) : t("contact.form.submit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
