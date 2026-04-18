import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Loader2, CheckCircle, Clock, Leaf, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/i18n/context";

const varieties = [
  {
    color: "Brune",
    value: "brune" as const,
    species: "M. conica, M. brunnea, M. snyderi",
    profile: "Arôme fumé intense, notes profondes et boisées, reflets jaunes",
    availability: "Bonne disponibilité",
    rare: false,
    onRequestOnly: false,
  },
  {
    color: "Blonde & Grise",
    value: "blonde-grise" as const,
    species: "M. americana, M. esculenta, M. prava, M. tomentosa",
    profile: "Arôme délicat dominant avec notes fumées douces de la grise",
    availability: "Disponibilité correcte",
    rare: false,
    onRequestOnly: false,
  },
  {
    color: "Verte",
    value: "verte" as const,
    species: "M. sextelata, M. septimelata",
    profile: "Espèces rares de haute altitude, arôme profond et complexe",
    availability: "Sur demande — selon récolte, non garantie",
    rare: true,
    onRequestOnly: true,
  },
];

function getPricePerKg(variety: "brune" | "blonde-grise", quantityKg: number): number {
  if (variety === "brune") {
    return quantityKg >= 5 ? 340 : 360;
  }
  return quantityKg >= 5 ? 370 : 390;
}

const PreOrder = () => {
  const { t } = useI18n();
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    variety: "brune" as "brune" | "blonde-grise",
    quantityKg: 1,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const pricePerKg = getPricePerKg(form.variety, form.quantityKg);
  const totalHT = form.quantityKg * pricePerKg;

  const update = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.contactName || !form.email || form.quantityKg < 1) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (form.quantityKg > 20) {
      toast.error("Quantité maximale : 20 kg. Contactez-nous directement pour les commandes supérieures.");
      return;
    }
    setLoading(true);
    try {
      const selectedVariety = varieties.find(v => v.value === form.variety);
      const isPriority = form.quantityKg >= 15;
      const messageBody = `Sourcing direct saison 2026 — Demande de réservation
Horodatage : ${new Date().toISOString()}

Variété : ${selectedVariety?.color ?? form.variety} (${selectedVariety?.species ?? ""})
Quantité : ${form.quantityKg} kg
Prix indicatif : ${pricePerKg} €/kg · Total estimé : ${totalHT.toFixed(2)} € nets (TVA non applicable — art. 293 B CGI)
Téléphone : ${form.phone || "Non renseigné"}
${form.notes ? `\nNotes : ${form.notes}` : ""}`;
      const message = isPriority ? `[PRIORITÉ HAUTE] ${messageBody}` : messageBody;

      const { error: insertError } = await supabase
        .from("contact_messages")
        .insert({
          name: `${form.contactName} — ${form.companyName}`,
          email: form.email,
          type: "professionnel",
          message,
        });

      if (insertError) throw insertError;

      supabase.functions.invoke("notify-contact", { body: { record: { name: `${form.contactName} — ${form.companyName}`, email: form.email, type: "professionnel", message, created_at: new Date().toISOString() } } }).catch(() => {});

      setSuccess(true);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi. Réessayez ou contactez-nous directement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link
            to="/#professionnels"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>

          {/* Header */}
          <ScrollReveal blur>
            <div className="mb-14">
              <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">{t("preorder.label")}</p>
              <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">
                {t("preorder.title")} <span className="italic text-gradient-gold">{t("preorder.titleHighlight")}</span>
              </h1>
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                {t("preorder.subtitle")}
              </p>
              <p className="text-sm text-muted-foreground/70 font-light mt-1">
                {t("preorder.subtitleSub")}
              </p>
              <div className="divider-gold w-20 mt-8" />
            </div>
          </ScrollReveal>

          {/* Fonctionnement */}
          <ScrollReveal delay={0.05}>
            <section className="mb-14">
              <h2 className="font-serif text-2xl font-light mb-6">{t("preorder.howItWorks")}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: PackageCheck,
                    title: "Réservation avant cueillette",
                    desc: "Vous réservez votre lot avant la saison. Nous achetons directement aux cueilleurs pendant la récolte.",
                  },
                  {
                    icon: Leaf,
                    title: "Séchage sur place",
                    desc: "Séchage artisanal et conditionnement immédiatement après récolte, en Colombie-Britannique.",
                  },
                  {
                    icon: Clock,
                    title: "Délai 6 à 8 semaines",
                    desc: "Livraison sous vide 6 à 8 semaines après confirmation d'achat.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="border border-gold/15 rounded-sm p-5 bg-background/50">
                    <Icon className="w-6 h-6 text-primary mb-3" />
                    <h3 className="font-serif text-base mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-light mt-5">
                Commande minimum : <span className="text-foreground">1 kg par variété.</span>
              </p>
            </section>
          </ScrollReveal>

          {/* Variétés */}
          <ScrollReveal delay={0.08}>
            <section className="mb-14">
              <h2 className="font-serif text-2xl font-light mb-6">{t("preorder.varieties")}</h2>
              <div className="border border-gold/15 rounded-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold/15 bg-background/80">
                      <th className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-muted-foreground font-light">Couleur</th>
                      <th className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-muted-foreground font-light hidden sm:table-cell">Espèce</th>
                      <th className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-muted-foreground font-light">Profil aromatique</th>
                      <th className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-muted-foreground font-light hidden md:table-cell">Disponibilité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {varieties.map((v, i) => (
                      <tr
                        key={v.color}
                        className={`border-b border-gold/10 last:border-0 ${i % 2 === 0 ? "bg-background/30" : "bg-background/10"}`}
                      >
                        <td className="py-3 px-4">
                          <span className="font-serif text-foreground">{v.color}</span>
                          {v.rare && (
                            <span className="ml-2 text-[10px] tracking-wider uppercase text-primary/70 border border-primary/30 rounded-sm px-1.5 py-0.5">rare</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground font-light italic hidden sm:table-cell">{v.species}</td>
                        <td className="py-3 px-4 text-muted-foreground font-light">{v.profile}</td>
                        <td className="py-3 px-4 text-muted-foreground font-light hidden md:table-cell">{v.availability}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </ScrollReveal>

          {/* Tarifs */}
          <ScrollReveal delay={0.1}>
            <section className="mb-14">
              <h2 className="font-serif text-2xl font-light mb-2">{t("preorder.pricing")}</h2>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground font-light">{t("preorder.pricingNote")}</p>
                <Link
                  to="/fiche-technique"
                  className="text-xs text-primary hover:text-gold-light transition-colors font-medium flex-shrink-0 ml-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("preorder.technicalSheet")}
                </Link>
              </div>
              <div className="border border-gold/15 rounded-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold/15 bg-background/80">
                      <th className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-muted-foreground font-light">Volume</th>
                      <th className="text-right py-3 px-4 text-xs tracking-[0.2em] uppercase text-muted-foreground font-light">Brune</th>
                      <th className="text-right py-3 px-4 text-xs tracking-[0.2em] uppercase text-muted-foreground font-light">Blonde &amp; Grise</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gold/10 bg-background/30">
                      <td className="py-3 px-4 font-light">1 – 4 kg</td>
                      <td className="py-3 px-4 text-right font-serif text-foreground">360 €/kg</td>
                      <td className="py-3 px-4 text-right font-serif text-foreground">390 €/kg</td>
                    </tr>
                    <tr className="bg-background/10">
                      <td className="py-3 px-4 font-light">5 kg et +</td>
                      <td className="py-3 px-4 text-right font-serif text-gradient-gold">340 €/kg</td>
                      <td className="py-3 px-4 text-right font-serif text-gradient-gold">370 €/kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground/60 font-light mt-3 italic">
                {t("preorder.vatNote")}
              </p>
            </section>
          </ScrollReveal>

          {/* Conditions */}
          <ScrollReveal delay={0.12}>
            <section className="mb-14">
              <h2 className="font-serif text-2xl font-light mb-6">{t("preorder.conditions")}</h2>
              <ul className="space-y-3 text-sm text-muted-foreground font-light">
                {[
                  "Paiement intégral à la réservation",
                  "Délai : 6 à 8 semaines à compter de l'achat aux cueilleurs",
                  "La variété verte est proposée sur demande uniquement, sans garantie de disponibilité",
                  "Aucun réassort possible en cours de saison",
                ].map((cond) => (
                  <li key={cond} className="flex items-start gap-3">
                    <span className="text-primary mt-0.5 flex-shrink-0">—</span>
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </section>
          </ScrollReveal>

          <div className="divider-gold w-full mb-14 opacity-30" />

          {/* Formulaire de réservation */}
          <ScrollReveal delay={0.15}>
            <section>
              <h2 className="font-serif text-2xl font-light mb-2">{t("preorder.form.title")}</h2>
              <p className="text-sm text-muted-foreground font-light mb-8">
                {t("preorder.form.subtitle")}{" "}
                <a href="mailto:contact@morillesducanada.com" className="text-primary hover:underline">
                  contact@morillesducanada.com
                </a>
              </p>

              {success ? (
                <div className="border border-primary/30 rounded-sm p-8 text-center bg-background/40">
                  <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-serif text-xl mb-2">{t("preorder.form.success.title")}</h3>
                  <p className="text-sm text-muted-foreground font-light">
                    {t("preorder.form.success.desc")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 font-light">
                        {t("preorder.form.company")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.companyName}
                        onChange={(e) => update("companyName", e.target.value)}
                        className="w-full px-4 py-3 bg-secondary/30 border border-gold/15 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                        placeholder="Restaurant Le Gourmet"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 font-light">
                        {t("preorder.form.contact")} *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.contactName}
                        onChange={(e) => update("contactName", e.target.value)}
                        className="w-full px-4 py-3 bg-secondary/30 border border-gold/15 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                        placeholder="Jean Dupont"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 font-light">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="w-full px-4 py-3 bg-secondary/30 border border-gold/15 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                        placeholder="contact@restaurant.fr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 font-light">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="w-full px-4 py-3 bg-secondary/30 border border-gold/15 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>

                  {/* Variety */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 font-light">
                      {t("preorder.form.variety")} *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {varieties.filter(v => !v.onRequestOnly).map((v) => (
                        <button
                          key={v.value}
                          type="button"
                          onClick={() => update("variety", v.value)}
                          className={`p-3 border rounded-sm text-left transition-all duration-300 ${
                            form.variety === v.value
                              ? "border-primary bg-primary/10"
                              : "border-gold/15 bg-secondary/20 hover:border-gold/40"
                          }`}
                        >
                          <span className="font-serif text-sm block">{v.color}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground font-light mt-3">
                      {t("preorder.form.verteNote")}{" "}
                      <a href="mailto:contact@morillesducanada.com" className="text-primary hover:underline">
                        contact@morillesducanada.com
                      </a>{" "}
                      {t("preorder.form.verteNoteEnd")}
                    </p>
                  </div>

                  {/* Quantity + price preview */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 font-light">
                      {t("preorder.form.quantity")} * — {t("preorder.form.quantityNote")}
                    </label>
                    <div className="flex items-center gap-4 flex-wrap">
                      <input
                        type="number"
                        min={1}
                        max={20}
                        step={0.5}
                        required
                        value={form.quantityKg}
                        onChange={(e) => update("quantityKg", parseFloat(e.target.value) || 1)}
                        className="w-28 px-4 py-3 bg-secondary/30 border border-gold/15 rounded-sm text-foreground focus:outline-none focus:border-primary transition-colors text-center font-serif text-lg"
                      />
                      <span className="text-muted-foreground font-light text-sm">
                        kg × {pricePerKg} €/kg =
                      </span>
                      <span className="font-serif text-xl text-gradient-gold">
                        {totalHT.toFixed(2)} €
                      </span>
                    </div>
                    {form.quantityKg >= 5 && form.quantityKg < 15 && (
                      <p className="text-xs text-primary/70 mt-2 font-light">
                        {t("preorder.form.discountApplied")}
                      </p>
                    )}
                    {form.quantityKg >= 15 && (
                      <p className="text-xs text-primary/70 mt-2 font-light">
                        {t("preorder.form.discountApplied")} · {t("preorder.form.quantityInfo15")}
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 font-light">
                      {t("preorder.form.notes")}
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-secondary/30 border border-gold/15 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder={t("preorder.form.notesPlaceholder")}
                    />
                  </div>

                  <div className="flex items-start gap-3 text-xs text-muted-foreground font-light">
                    <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p>{t("preorder.form.vatInfo")}</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || form.quantityKg < 1}
                    className="w-full py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      t("preorder.form.submit")
                    )}
                  </button>
                </form>
              )}
            </section>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PreOrder;
