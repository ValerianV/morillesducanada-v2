import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Un arôme fumé d'une intensité que je n'avais jamais trouvé avec des morilles européennes. Mes clients les réclament à chaque saison.",
    name: "Chef Laurent M.",
    title: "Restaurant étoilé, Lyon",
  },
  {
    quote: "La qualité est remarquable : charnues, parfumées, sans queue. Elles se réhydratent parfaitement et gardent toute leur texture.",
    name: "Marie-Claire D.",
    title: "Traiteur gastronomique, Paris",
  },
  {
    quote: "Enfin un fournisseur transparent sur l'origine et le processus. On sait exactement d'où viennent nos morilles. Le rapport qualité-prix est imbattable.",
    name: "Thomas R.",
    title: "Amateur passionné, Bordeaux",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 md:py-32" aria-label="Témoignages clients">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Témoignages</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light">
            Ils en <span className="italic text-gradient-gold">parlent</span>
          </h2>
          <div className="divider-gold w-24 mx-auto mt-8" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-8 border border-gold/10 rounded-sm relative"
            >
              <Quote className="w-6 h-6 text-primary/30 absolute top-6 right-6" />
              <p className="text-sm text-secondary-foreground/80 font-light leading-relaxed italic mb-6">
                « {t.quote} »
              </p>
              <div>
                <p className="font-serif text-base text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground font-light">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
