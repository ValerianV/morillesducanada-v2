import { useState, useEffect } from "react";
import { Star, Send } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";

type Review = {
  id: string;
  first_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 transition-colors ${star <= rating ? "fill-primary text-primary" : "text-muted-foreground/30"} ${interactive ? "cursor-pointer hover:text-primary" : ""}`}
        onClick={() => interactive && onRate?.(star)}
      />
    ))}
  </div>
);

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [firstName, setFirstName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });
    if (data) setReviews(data as Review[]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || rating === 0 || !comment.trim()) {
      toast.error("Veuillez remplir tous les champs et donner une note.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      first_name: firstName.trim(),
      rating,
      comment: comment.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast.error("Erreur lors de l'envoi de votre avis.");
      return;
    }
    toast.success("Merci pour votre avis !");
    setFirstName("");
    setRating(0);
    setComment("");
    fetchReviews();
  }

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <section id="avis" className="py-12 md:py-16">
      <div className="container mx-auto px-6">
        <ScrollReveal blur>
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Témoignages</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light">
              Avis de nos <span className="italic text-gradient-gold">clients</span>
            </h2>
            <div className="divider-gold w-16 mx-auto mt-4" />
            {avgRating && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <StarRating rating={Math.round(Number(avgRating))} />
                <span className="text-sm text-muted-foreground font-light">{avgRating}/5 · {reviews.length} avis</span>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Reviews grid */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
            {reviews.slice(0, 6).map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="border border-gold/15 rounded-sm p-4 bg-background/50"
              >
                <StarRating rating={review.rating} />
                <p className="text-xs text-secondary-foreground/80 font-light leading-relaxed mt-2 mb-3">"{review.comment}"</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-primary">{review.first_name}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(review.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Review form */}
        <ScrollReveal delay={0.2}>
          <div className="max-w-md mx-auto border border-gold/15 rounded-sm p-6 bg-background/50">
            <h3 className="font-serif text-lg text-center mb-4">Laisser un avis</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-muted-foreground mb-1 tracking-wider uppercase">Prénom</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full bg-secondary/30 border border-gold/15 rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-muted-foreground mb-1 tracking-wider uppercase">Note</label>
                  <StarRating rating={rating} onRate={setRating} interactive />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-muted-foreground mb-1 tracking-wider uppercase">Votre avis</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={2}
                  className="w-full bg-secondary/30 border border-gold/15 rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Partagez votre expérience..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-xs hover:bg-gold-light transition-colors duration-300 rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? "Envoi..." : "Publier mon avis"}
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ReviewsSection;
