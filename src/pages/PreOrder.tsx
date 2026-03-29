import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PRICE_PER_KG = 350;

const PreOrder = () => {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    morelType: "brune" as "brune" | "blonde",
    quantityKg: 1,
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const totalPrice = form.quantityKg * PRICE_PER_KG;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.contactName || !form.email || form.quantityKg <= 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-preorder-checkout", {
        body: form,
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création du paiement");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-2xl">
          <Link to="/#professionnels" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>

          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Professionnels</p>
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">
              Pré-commande <span className="italic text-gradient-gold">saison 2026</span>
            </h1>
            <p className="text-muted-foreground font-light max-w-lg mx-auto">
              Réservez vos morilles de feu pour la saison 2026. Tarif fixe de <strong className="text-primary">350 €/kg</strong>, paiement intégral à l'avance requis pour garantir votre approvisionnement.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-light tracking-wider uppercase text-muted-foreground mb-2">
                  Nom de l'entreprise *
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
                <label className="block text-sm font-light tracking-wider uppercase text-muted-foreground mb-2">
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
                <label className="block text-sm font-light tracking-wider uppercase text-muted-foreground mb-2">
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
                <label className="block text-sm font-light tracking-wider uppercase text-muted-foreground mb-2">
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

            {/* Morel type */}
            <div>
              <label className="block text-sm font-light tracking-wider uppercase text-muted-foreground mb-3">
                Type de morilles *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "brune", label: "Morilles brunes", desc: "Arôme intense, notes fumées profondes" },
                  { value: "blonde", label: "Morilles blondes", desc: "Plus douces, arôme délicat et boisé" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update("morelType", option.value)}
                    className={`p-4 border rounded-sm text-left transition-all duration-300 ${
                      form.morelType === option.value
                        ? "border-primary bg-primary/10"
                        : "border-gold/15 bg-secondary/20 hover:border-gold/40"
                    }`}
                  >
                    <span className="font-serif text-base block mb-1">{option.label}</span>
                    <span className="text-xs text-muted-foreground font-light">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-light tracking-wider uppercase text-muted-foreground mb-2">
                Quantité (kg) *
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={0.5}
                  max={100}
                  step={0.5}
                  required
                  value={form.quantityKg}
                  onChange={(e) => update("quantityKg", parseFloat(e.target.value) || 0)}
                  className="w-32 px-4 py-3 bg-secondary/30 border border-gold/15 rounded-sm text-foreground focus:outline-none focus:border-primary transition-colors text-center font-serif text-lg"
                />
                <span className="text-muted-foreground font-light">kg × 350 €/kg =</span>
                <span className="font-serif text-2xl text-gradient-gold">{totalPrice.toFixed(2)} €</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-light tracking-wider uppercase text-muted-foreground mb-2">
                Notes / Précisions
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-secondary/30 border border-gold/15 rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Dates de livraison souhaitées, calibrage, etc."
              />
            </div>

            {/* Summary */}
            <div className="border border-primary/30 rounded-sm p-6 bg-background/40">
              <h3 className="font-serif text-xl mb-4">Récapitulatif</h3>
              <div className="space-y-2 text-sm font-light">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span>{form.morelType === "brune" ? "Morilles brunes" : "Morilles blondes"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantité</span>
                  <span>{form.quantityKg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix unitaire</span>
                  <span>350 €/kg</span>
                </div>
                <div className="divider-gold my-3" />
                <div className="flex justify-between text-base">
                  <span className="font-serif">Total à régler</span>
                  <span className="font-serif text-xl text-gradient-gold">{totalPrice.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-muted-foreground font-light">
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p>Le paiement intégral est requis pour valider votre réservation. Paiement sécurisé par Stripe. En cas d'annulation de la saison de cueillette, vous serez intégralement remboursé.</p>
            </div>

            <button
              type="submit"
              disabled={loading || form.quantityKg <= 0}
              className="w-full py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors duration-300 rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Procéder au paiement"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PreOrder;
