import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Users, Lightbulb, ArrowLeft, Leaf } from "lucide-react";

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
  ingredients: string[];
  steps: string[];
  tips: string | null;
  tags: string[];
  created_at: string;
}

const RecetteDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("recipes")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data }) => {
        setRecipe(data as Recipe | null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6 max-w-3xl animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-24 text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">Recette introuvable</h1>
          <Link to="/recettes" className="text-primary hover:text-gold-light transition-colors">
            ← Retour aux recettes
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const totalTime = recipe.prep_time + recipe.cook_time;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    author: { "@type": "Person", name: recipe.chef_name },
    prepTime: `PT${recipe.prep_time}M`,
    cookTime: `PT${recipe.cook_time}M`,
    totalTime: `PT${totalTime}M`,
    recipeYield: `${recipe.servings} portions`,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
    recipeCategory: "Plat principal",
    recipeCuisine: "Française",
    keywords: recipe.tags?.join(", "),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{recipe.title} | Recettes Morilles du Canada</title>
        <meta name="description" content={recipe.description} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link
            to="/recettes"
            className="text-sm text-primary hover:text-gold-light transition-colors mb-8 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Toutes les recettes
          </Link>

          {/* Header */}
          <ScrollReveal>
            <div className="mb-12">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-4">
                {recipe.title}
              </h1>
              <p className="text-secondary-foreground/70 font-light text-lg leading-relaxed mb-6">
                {recipe.description}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Prépa {recipe.prep_time} min</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Cuisson {recipe.cook_time} min</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{recipe.servings} personnes</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                  {recipe.difficulty}
                </span>
              </div>

              {recipe.tags?.includes("vegan") && (
                <div className="flex items-center gap-2 p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
                  <Leaf className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="font-medium text-green-300">Recette vegan</p>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Ingredients */}
          <ScrollReveal>
            <div className="mb-12">
              <h2 className="font-serif text-2xl text-foreground mb-6">Ingrédients</h2>
              <div className="bg-card border border-border rounded-lg p-6">
                <ul className="space-y-3">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-secondary-foreground/80 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Steps */}
          <ScrollReveal>
            <div className="mb-12">
              <h2 className="font-serif text-2xl text-foreground mb-6">Préparation</h2>
              <div className="space-y-6">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                      {i + 1}
                    </div>
                    <p className="text-sm text-secondary-foreground/80 font-light leading-relaxed pt-1">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Tips */}
          {recipe.tips && (
            <ScrollReveal>
              <div className="mb-12 bg-card border border-primary/20 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-lg text-foreground mb-2">
                      Conseil de préparation
                    </h3>
                    <p className="text-sm text-secondary-foreground/80 font-light leading-relaxed">
                      {recipe.tips}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* CTA */}
          <ScrollReveal>
            <div className="text-center bg-card border border-border rounded-lg p-10">
              <p className="font-serif text-2xl text-foreground mb-3">
                Envie de préparer cette recette ?
              </p>
              <p className="text-sm text-muted-foreground mb-6 font-light">
                Commandez nos morilles de feu séchées pour un résultat exceptionnel.
              </p>
              <a
                href="/#produits"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm hover:bg-gold-light transition-colors rounded-sm"
              >
                Voir nos morilles
              </a>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecetteDetail;
