import Seo from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { absoluteUrl, DEFAULT_OG_IMAGE, LOGO_URL, SITE_NAME } from "@/lib/seo/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import WildVsCultivated from "@/components/WildVsCultivated";
import { Link } from "react-router-dom";
import { ArrowLeft, Flame, TreePine, ChefHat, AlertTriangle, Thermometer, Clock, Mountain } from "lucide-react";

const guideJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Guide complet des morilles de feu du Canada",
  description:
    "Tout savoir sur les morilles de feu (fire morels) : origine, cueillette sauvage, différence avec les morilles de culture, préparation, conservation et cuisine.",
  author: { "@type": "Organization", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: LOGO_URL } },
  mainEntityOfPage: absoluteUrl("/guide-morilles-de-feu"),
  image: DEFAULT_OG_IMAGE.url,
  inLanguage: "fr-FR",
  datePublished: "2026-01-01",
};

const GuideMorellesDeFeu = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Morilles de feu du Canada : le guide complet | Morilles du Canada"
        description="Tout savoir sur les morilles de feu du Canada : cueillette sauvage après incendie, différence avec la morille de culture, conservation, préparation et recettes."
        path="/guide-morilles-de-feu"
        type="article"
        jsonLd={[guideJsonLd, breadcrumbSchema([{ name: "Guide des morilles de feu", path: "/guide-morilles-de-feu" }])]}
      />

      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-10 text-sm tracking-wider uppercase">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>

          <ScrollReveal>
            <header className="mb-16 text-center">
              <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Guide complet</p>
              <h1 className="font-serif text-4xl md:text-6xl font-light mb-6">
                Les morilles de feu <span className="italic text-gradient-gold">du Canada</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Ce qu'il faut savoir sur ce champignon sauvage : origine, cueillette, différence avec la morille de culture, préparation, conservation et utilisation en cuisine.
              </p>
              <div className="divider-gold w-24 mx-auto mt-8" />
            </header>
          </ScrollReveal>

          {/* Section 1: Qu'est-ce qu'une morille de feu */}
          <ScrollReveal>
            <section className="mb-16" id="definition">
              <div className="flex items-center gap-3 mb-6">
                <Flame className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl font-light">Qu'est-ce qu'une morille de feu ?</h2>
              </div>
              <div className="prose prose-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  La <strong>morille de feu</strong> (en anglais <em>fire morel</em> ou <em>burn morel</em>) est une morille sauvage, du genre <em>Morchella</em>, qui pousse au printemps sur les <strong>forêts brûlées l'année précédente</strong>. Au Canada, les feux de forêt de l'été laissent des sols noirs de cendre ; le printemps suivant, les morilles y apparaissent d'elles-mêmes.
                </p>
                <p>
                  Personne ne la sème : elle se cueille à la main, à pied, dans la forêt brûlée. La cueillette dépend donc des feux de l'année précédente et de la saison, et les zones changent d'une année à l'autre.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Section 2: Variétés */}
          <ScrollReveal>
            <section className="mb-16" id="varietes">
              <div className="flex items-center gap-3 mb-6">
                <TreePine className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl font-light">Les variétés de morilles de feu</h2>
              </div>
              <div className="prose prose-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Plusieurs espèces de morilles poussent après un feu de forêt au Canada, en morilles noires, brunes, blondes ou grises. Nos morilles sont vendues en <strong>variétés mélangées</strong>, sans tri par espèce, <strong>entières et équeutées</strong> : le pied est retiré, vous achetez le chapeau alvéolé.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Section 3: Sauvage ou cultivée */}
          <ScrollReveal>
            <section className="mb-16" id="comparaison">
              <h2 className="font-serif text-2xl md:text-3xl font-light mb-6">Morille sauvage ou morille de culture</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Une morille séchée peut venir de la nature ou d'une culture. La différence tient à son origine : cueillette après incendie d'un côté, production en serre ou en plein champ de l'autre.
              </p>
              <WildVsCultivated />
            </section>
          </ScrollReveal>

          {/* Section 3 bis: Notre cueillette */}
          <ScrollReveal>
            <section className="mb-16" id="cueillette">
              <div className="flex items-center gap-3 mb-6">
                <Mountain className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl font-light">D'où viennent nos morilles</h2>
              </div>
              <div className="prose prose-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Valérian, fondateur de Morilles du Canada, a cueilli lui-même des morilles de feu pendant <strong>trois saisons</strong>, en 2022, 2023 et 2024, en Colombie-Britannique et au Yukon, sur des forêts brûlées l'année précédente.
                </p>
                <p>
                  Il travaille aujourd'hui avec un <strong>réseau de cueilleurs</strong> sur les feux de forêt canadiens, qui sèchent les morilles sur place. Le stock est en France, d'où les commandes sont expédiées sous 5 jours ouvrés.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Section 4: Conservation */}
          <ScrollReveal>
            <section className="mb-16" id="conservation">
              <div className="flex items-center gap-3 mb-6">
                <Thermometer className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl font-light">Conservation des morilles séchées</h2>
              </div>
              <div className="prose prose-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  Nos morilles sont séchées sur place par les cueilleurs. Une fois séchées, elles se conservent facilement :
                </p>
                <ul className="space-y-2">
                  <li><strong>Contenant</strong> : Récipient hermétique (bocal en verre, boîte métallique ou sachet zip refermable)</li>
                  <li><strong>Lieu</strong> : À l'abri de la lumière et de l'humidité, à température ambiante</li>
                  <li><strong>À éviter</strong> : Ne pas réfrigérer (l'humidité du frigo les détériore)</li>
                </ul>
              </div>
            </section>
          </ScrollReveal>

          {/* Section 5: Préparation */}
          <ScrollReveal>
            <section className="mb-16" id="preparation">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl font-light">Comment préparer les morilles séchées</h2>
              </div>
              <div className="prose prose-lg text-muted-foreground leading-relaxed space-y-4">
                <h3 className="font-serif text-xl text-foreground font-light">Réhydratation</h3>
                <ol className="space-y-2">
                  <li>Placez les morilles dans un bol d'<strong>eau tiède</strong> (30-40°C — jamais bouillante)</li>
                  <li>Laissez tremper <strong>20 à 30 minutes</strong> jusqu'à ce qu'elles soient souples</li>
                  <li>Soulevez-les délicatement (ne pas presser) pour laisser le sable au fond</li>
                  <li><strong>Filtrez le jus de trempage</strong> à travers un filtre à café ou un linge fin — c'est de l'or liquide pour vos sauces</li>
                  <li>Ouvrez chaque morille en deux pour vérifier l'absence de résidus à l'intérieur</li>
                </ol>

                <h3 className="font-serif text-xl text-foreground font-light mt-8">Dosage</h3>
                <ul className="space-y-2">
                  <li><strong>5 à 8 g</strong> de morilles séchées par personne</li>
                  <li>Les morilles <strong>triplent de volume</strong> à la réhydratation</li>
                  <li>Sachet de 12 g → 2 personnes | 30 g → 4-6 personnes | 45 g → 6-8 personnes</li>
                </ul>
              </div>
            </section>
          </ScrollReveal>

          {/* Section 6: Précautions */}
          <ScrollReveal>
            <section className="mb-16" id="precautions">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl font-light">Précautions importantes</h2>
              </div>
              <div className="bg-card border border-primary/20 rounded-sm p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Ne jamais consommer de morilles crues.</strong> Toutes les morilles contiennent de l'<strong>hémolysine</strong>, une toxine thermolabile détruite uniquement par la cuisson. Faites cuire vos morilles <strong>minimum 15 minutes à feu moyen</strong>.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Ne jamais utiliser d'eau bouillante</strong> pour la réhydratation. L'eau trop chaude détruit la texture alvéolée et les arômes délicats de la morille.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Attention aux fausses morilles.</strong> Le <em>Gyromitra esculenta</em> (fausse morille) est un champignon toxique qui ressemble superficiellement à la morille. La vraie morille a un chapeau alvéolé creux à l'intérieur, alors que la fausse morille a un chapeau plissé irrégulièrement et n'est pas creuse.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Section 7: En cuisine */}
          <ScrollReveal>
            <section className="mb-16" id="cuisine">
              <div className="flex items-center gap-3 mb-6">
                <ChefHat className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-2xl md:text-3xl font-light">En cuisine : accords et recettes</h2>
              </div>
              <div className="prose prose-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  La morille se marie avec des ingrédients doux et crémeux. Voici les accords classiques :
                </p>
                <ul className="space-y-2">
                  <li><strong>Matières grasses</strong> : Beurre, crème fraîche épaisse, huile de truffe</li>
                  <li><strong>Alcools</strong> : Cognac, vin blanc sec (Chablis), vin jaune du Jura, Madère</li>
                  <li><strong>Aromates</strong> : Échalotes, thym, ciboulette, persil plat, noix de muscade</li>
                  <li><strong>Viandes</strong> : Bœuf, veau, poulet fermier, pintade</li>
                  <li><strong>Féculents</strong> : Riz arborio (risotto), pâtes fraîches, pommes de terre grenaille</li>
                  <li><strong>Fromages</strong> : Parmesan affiné, comté, Gruyère suisse</li>
                </ul>
                <p className="mt-6">
                  <Link to="/recettes" className="text-primary hover:text-primary/80 underline underline-offset-4">
                    Découvrez toutes nos recettes aux morilles de feu →
                  </Link>
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal>
            <div className="text-center mt-20 p-10 bg-gradient-card rounded-sm border border-primary/10">
              <h2 className="font-serif text-2xl md:text-3xl font-light mb-4">
                Goûtez la <span className="italic text-gradient-gold">morille sauvage</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Morilles de feu sauvages du Canada, cueillies à la main, séchées sur place, entières et équeutées. Stock en France.
              </p>
              <a
                href="/#produits"
                className="inline-block px-10 py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm rounded-sm hover:bg-primary/90 transition-colors"
              >
                Découvrir nos morilles
              </a>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GuideMorellesDeFeu;
