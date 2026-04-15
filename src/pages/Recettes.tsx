import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Users, ArrowRight, Leaf } from "lucide-react";

interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  chef_name: string;
  chef_title: string | null;
  difficulty: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  image_url: string | null;
  tags: string[];
}

const difficultyColor: Record<string, string> = {
  Facile: "bg-green-900/40 text-green-300",
  Intermédiaire: "bg-primary/20 text-primary",
  Avancé: "bg-ember/20 text-orange-300",
};

const Recettes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("recipes")
      .select("id, slug, title, description, chef_name, chef_title, difficulty, prep_time, cook_time, servings, image_url, tags")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("Error fetching recipes:", error);
        setRecipes((data as Recipe[]) || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Recettes aux morilles de feu | Morilles du Canada</title>
        <meta
          name="description"
          content="Découvrez nos recettes de chefs pour sublimer les morilles de feu séchées du Canada : risotto, velouté, pâtes, filet de bœuf en croûte et plus encore."
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Recettes aux morilles de feu",
            description: "Collection de recettes gastronomiques aux morilles de feu séchées du Canada",
            url: "https://morillesducanada.com/recettes",
          })}
        </script>
      </Helmet>

      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <Link to="/" className="text-sm text-primary hover:text-gold-light transition-colors mb-8 inline-block">
            ← Retour à l'accueil
          </Link>

          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.3em] uppercase text-primary/80 mb-4">
                Inspirations culinaires
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-4">
                Recettes aux{" "}
                <span className="italic text-gradient-gold">morilles de feu</span>
              </h1>
              <p className="text-secondary-foreground/70 font-light text-lg max-w-2xl mx-auto leading-relaxed">
                Découvrez nos meilleures recettes pour sublimer
                l'arôme fumé unique de nos morilles sauvages canadiennes.
              </p>
              <div className="divider-gold w-24 mx-auto mt-6" />
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {recipes.map((recipe, i) => (
                <ScrollReveal key={recipe.id} delay={i * 0.1}>
                  <Link
                    to={`/recettes/${recipe.slug}`}
                    className="group block bg-card border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-gold h-full"
                  >
                    <div className="p-7 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColor[recipe.difficulty] || "bg-muted text-muted-foreground"}`}>
                          {recipe.difficulty}
                        </span>
                        {recipe.tags?.includes("vegan") && (
                          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-green-900/40 text-green-300">
                            <Leaf className="w-3 h-3" />
                            Vegan
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {recipe.prep_time + recipe.cook_time} min
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="w-3 h-3" />
                          {recipe.servings} pers.
                        </div>
                      </div>

                      <h2 className="font-serif text-xl md:text-2xl text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                        {recipe.title}
                      </h2>

                      <p className="text-sm text-secondary-foreground/70 font-light leading-relaxed mb-5 flex-1">
                        {recipe.description}
                      </p>

                      <div className="flex items-center justify-end mt-auto pt-4 border-t border-border">
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Recettes;
