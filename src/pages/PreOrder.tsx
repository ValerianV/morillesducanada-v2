import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Loader2, CheckCircle, Clock, Leaf, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

// Source: /plaquette-pro pour brune et blonde. Grise et verte = taxonomie BC/Yukon,
// non documentées dans la plaquette — à valider avec le fournisseur.
const varieties = [
  {
    color: "Brune",
    species: "M. conica, M. brunnea, M. snyderi",
    profile: "Arôme fumé intense, notes profondes et boisées, reflets jaunes",
    availability: "Bonne disponibilité",
    rare: false,
  },
  {
    color: "Blonde",
    species: "M. americana, M. esculenta, M. prava",
    profile: "Arôme délicat et subtil, plus douce en bouche",
    availability: "Disponibilité correcte",
    rare: false,
  },
  {
    color: "Grise",
    species: "M. tomentosa",
    profile: "Surface veloutée à poils fins, notes fumées douces et terreuses",
    availability: "Stock limité — allocation prioritaire",
    rare: true,
  },
  {
    color: "Verte",
    species: "M. sextelata, M. septimelata",
    profile: "Espèces rares de haute altitude, arôme profond et complexe",
    availability: "Très limitée — sur demande uniquement",
    rare: true,
  },
];

function getPricePerKg(variety: string, quantityKg: number): number {
  if (variety === "brune") {
    return quantityKg >= 5 ? 340 : 360;
  }
  return quantityKg >= 5 ? 370 : 390;
}

const PreOrder = () => {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    variety: "brune" as "brune" | "blonde" | "grise" | "verte",
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
    setLoading(true);
    try {
      const message = `Sourcing direct saison 2026 — Demande de réservation

Variété : ${form.variety} (${varieties.find(v => v.color.toLowerCase() === form.variety)?.species ?? ""})
Quantité : ${form.quantityKg} kg
Prix indicatif : ${pricePerKg} €/kg HT · Total estimé : ${totalHT.toFixed(2)} € HT
Téléphone : ${form.phone || "Non renseigné"}
${form.notes ? `\nNotes : ${form.notes}` : ""}`;

      const { data: insertData, error: insertError } = await supabase
        .from("contact_messages")
        .insert({
          name: `${form.contactName} — ${form.companyName}`,
          email: form.email,
          type: "professionnel",
          message,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      supabase.functions.invoke("notify-contact", { body: { record: insertData } }).catch(() => {});

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
              <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Professionnels</p>
              <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">
                Sourcing direct <span className="italic text-gradient-gold">saison 2026</span>
              </h1>
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                Morilles de feu séchées — Colombie-Britannique & Yukon
              </p>
              <p className="text-sm text-muted-foreground/70 font-light mt-1">
                Achat aux cueilleurs · Séchage artisanal · Expédition sous vide
              </p>
              <div className="divider-gold w-20 mt-8" />
            </div>
          </ScrollReveal>

          {/* Fonctionnement */}
          <ScrollReveal delay={0.05}>
            <section className="mb-14">
              <h2 className="font-serif text-2xl font-light mb-6">Fonctionnement</h2>
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
              <h2 className="font-serif text-2xl font-light mb-6">Variétés disponibles</h2>
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
              <h2 className="font-serif text-2xl font-light mb-2">Tarifs HT — saison 2026</h2>
              <p className="text-sm text-muted-foreground font-light mb-6">Paiement à la commande. Facture pro disponible.</p>
              <div className="border border-gold/15 rounded-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold/15 bg-background/80">
                      <th className="text-left py-3 px-4 text-xs tracking-[0.2em] uppercase text-muted-foreground font-light">Volume</th>
                      <th className="text-right py-3 px-4 text-xs tracking-[0.2em] uppercase text-muted-foreground font-light">Brune</th>
                      <th className="text-right py-3 px-4 text-xs tracking-[0.2em] uppercase text-muted-foreground font-light">Blonde · Grise · Verte</th>
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
            </section>
          </ScrollReveal>

          {/* Conditions */}
          <ScrollReveal delay={0.12}>
            <section className="mb-14">
              <h2 className="font-serif text-2xl font-light mb-6">Conditions</h2>
              <ul className="space-y-3 text-sm text-muted-foreground font-light">
                {[
                  "Paiement intégral à la réservation",
                  "Délai : 6 à 8 semaines à compter de l'achat aux cueilleurs",
                  "Les variétés rares (grise, verte) sont allouées par ordre de commande",
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
              <h2 className="font-serif text-2xl font-light mb-2">Réservation et devis</h2>
              <p className="text-sm text-muted-foreground font-light mb-8">
                Remplissez le formulaire ou contactez-nous directement à{" "}
                <a href="mailto:contact@morillesducanada.com" className="text-primary hover:underline">
                  contact@morillesducanada.com
                </a>
              </p>

              {success ? (
                <div className="border border-primary/30 rounded-sm p-8 text-center bg-background/40">
                  <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-serif text-xl mb-2">Demande envoyée</h3>
                  <p className="text-sm text-muted-foreground font-light">
                    Nous reviendrons vers vous sous 48h pour confirmer votre réservation et les modalités de paiement.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 font-light">
                        Entreprise / Établissement *
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
                        Nom du contact *
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
                      Variété *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {varieties.map((v) => (
                        <button
                          key={v.color}
                          type="button"
                          onClick={() => update("variety", v.color.toLowerCase())}
                          className={`p-3 border rounded-sm text-left transition-all duration-300 ${
                            form.variety === v.color.toLowerCase()
                              ? "border-primary bg-primary/10"
                              : "border-gold/15 bg-secondary/20 hover:border-gold/40"
                          }`}
                        >
                          <span className="font-serif text-sm block">{v.color}</span>
                          {v.rare && (
                            <span className="text-[10px] text-primary/70 tracking-wider uppercase">rare</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity + price preview */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 font-light">
                      Quantité (kg) * — minimum 1 kg
                    </label>
                    <div className="flex items-center gap-4 flex-wrap">
                      <input
                        type="number"
                        min={1}
                        max={500}
                        step={0.5}
                        required
                        value={form.quantityKg}
                        onChange={(e) => update("quantityKg", parseFloat(e.target.value) || 1)}
                        className="w-28 px-4 py-3 bg-secondary/30 border border-gold/15 rounded-sm text-foreground focus:outline-none focus:border-primary transition-colors text-center font-serif text-lg"
                      />
                      <span className="text-muted-foreground font-light text-sm">
                        kg × {pricePerKg} €/kg HT =
                      </span>
                      <span className="font-serif text-xl text-gradient-gold">
                        {totalHT.toFixed(2)} € HT
                      </span>
                    </div>
                    {form.quantityKg >= 5 && (
                      <p className="text-xs text-primary/70 mt-2 font-light">
                        Tarif dégressif appliqué (5 kg et +)
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 font-light">
                      Précisions / Notes
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-secondary/30 border border-gold/15 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Calibrage souhaité, dates de livraison, demande de devis formel…"
                    />
                  </div>

                  <div className="flex items-start gap-3 text-xs text-muted-foreground font-light">
                    <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p>
                      En soumettant ce formulaire, vous recevrez une confirmation et les modalités de paiement sous 48h.
                      En cas d'annulation de saison (météo, récolte insuffisante), remboursement intégral garanti.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || form.quantityKg < 1}
                    className="w-full py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Envoyer ma demande de réservation"
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
