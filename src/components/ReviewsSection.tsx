import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/i18n/context";

type Review = {
  id: string;
  first_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

// Avis réels, vérifiés par le fondateur le 2026-09-28 (docs/business/recit.md).
// Les commentaires sont parfois enregistrés entre guillemets : on les retire avant d'ajouter « ».
export function cleanReviewComment(comment: string): string {
  return comment.trim().replace(/^["“”«»\s]+|["“”«»\s]+$/g, "").trim();
}

const StarRating = ({ rating, label }: { rating: number; label: string }) => (
  <div className="flex gap-1" role="img" aria-label={label}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        aria-hidden
        className={`w-4 h-4 ${star <= rating ? "fill-primary text-primary" : "text-muted-foreground/60"}`}
      />
    ))}
  </div>
);

const ReviewsSection = () => {
  const { t, locale } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("reviews")
      .select("id, first_name, rating, comment, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled && data) setReviews(data as Review[]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Pas d'avis publié : la section entière est masquée (y compris pendant le chargement).
  if (reviews.length === 0) return null;

  const dateLocale = locale === "en" ? "en-GB" : "fr-FR";

  return (
    <section id="avis" className="py-16 md:py-20">
      <div className="container mx-auto px-6">
        <ScrollReveal blur>
          <div className="text-center mb-10">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-3">{t("reviews.label")}</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light">
              {t("reviews.title")} <span className="italic text-gradient-gold">{t("reviews.titleHighlight")}</span>
            </h2>
            <div className="divider-gold w-16 mx-auto mt-4" />
            {locale === "en" && <p className="mt-4 text-sm text-muted-foreground">{t("reviews.originalLanguage")}</p>}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {reviews.slice(0, 6).map((review, i) => (
            <motion.figure
              key={review.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="border border-gold/15 rounded-sm p-5 bg-background/50"
            >
              <StarRating rating={review.rating} label={t("reviews.rating").replace("{rating}", String(review.rating))} />
              <blockquote className="text-base text-foreground/90 leading-relaxed mt-3 mb-4">
                « {cleanReviewComment(review.comment)} »
              </blockquote>
              <figcaption className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-primary">{review.first_name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString(dateLocale, { month: "long", year: "numeric" })}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
