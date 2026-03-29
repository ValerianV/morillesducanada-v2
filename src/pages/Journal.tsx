import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { BookOpen } from "lucide-react";

const Journal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <ScrollReveal blur>
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Blog</p>
              <h1 className="font-serif text-4xl md:text-5xl font-light">
                Le journal du <span className="italic text-gradient-gold">cueilleur</span>
              </h1>
              <div className="divider-gold w-24 mx-auto mt-8" />
            </div>
          </ScrollReveal>

          <div className="max-w-2xl mx-auto text-center py-20">
            <BookOpen className="w-16 h-16 text-primary/30 mx-auto mb-8" />
            <h2 className="font-serif text-2xl font-light mb-4 text-foreground">
              Les premières histoires arrivent bientôt…
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed max-w-lg mx-auto">
              Récits de cueillette, rencontres en forêt, conseils de cuisine et photos du terrain — 
              ce journal racontera l'aventure de la morille de feu, saison après saison.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Journal;
