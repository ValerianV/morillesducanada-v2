import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { ArrowLeft, Flame, TreePine, ChefHat, AlertTriangle, Thermometer, Clock } from "lucide-react";

const guideJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Guide complet des morilles de feu du Canada",
  description:
    "Tout savoir sur les morilles de feu (fire morels) : origine, différences avec les morilles cultivées, comment les préparer, les conserver et les cuisiner.",
  author: { "@type": "Organization", name: "Morilles du Canada" },
  publisher: { "@type": "Organization", name: "Morilles du Canada" },
  mainEntityOfPage: "https://morillesducanada.lovable.app/guide-morilles-de-feu",
  datePublished: "2025-01-01",
  dateModified: new Date().toISOString().split("T")[0],
};

const GuideMorellesDeFeu = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Guide complet des morilles de feu du Canada | Morilles du Canada</title>
        <meta
          name="description"
          content="Tout savoir sur les morilles de feu (fire morels) du Canada : origine, variétés, différences avec les morilles cultivées, conservation, préparation et recettes."
        />
        <meta name="keywords" content="morille de feu, fire morel, morilles Canada, morilles séchées, morilles sauvages, Morchella tomentosa, champignon sauvage, morilles boréales" />
        <link rel="canonical" href="https://morillesducanada.lovable.app/guide-morilles-de-feu" />
        <script type="application/ld+json">{JSON.stringify(guideJsonLd)}</script>
      </Helmet>

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
                Tout ce qu'il faut savoir sur ce champignon sauvage d'exception : origine, variétés, préparation, conservation et utilisation en cuisine.
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
                  La <strong>morille de feu</strong> (en anglais <em>fire morel</em> ou <em>burn morel</em>) est un champignon sauvage du genre <em>Morchella</em> qui pousse exclusivement sur les <strong>sols calcinés</strong> après un feu de forêt. C'est un phénomène naturel fascinant : l'été, d'immenses incendies ravagent les forêts boréales du Canada. Le printemps suivant, des morilles surgissent par milliers des cendres.
                </p>
                <p>
                  Ce lien avec le feu n'est pas un hasard. Le mycélium de la morille, présent dans le sol forestier, est stimulé par le choc thermique et les nutriments libérés par la combustion. Le résultat : des champignons d'une <strong>taille exceptionnelle</strong> et d'un <strong>arôme fumé unique</strong>, impossible à reproduire en culture ou dans d'autres environnements.
                </p>
                <p>
                  La saison de cueillette est extrêmement courte : <strong>4 à 6 semaines par an</strong>, généralement entre fin mai et début juillet, selon les conditions météorologiques. Cette rareté, combinée à la qualité gustative exceptionnelle, fait de la morille de feu l'un des champignons les plus prisés au monde par les gastronomes et les chefs.
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
                  Les forêts boréales du Canada abritent plusieurs espèces de morilles qui poussent après un feu. Nos récoltes sont un <strong>mélange naturel</strong> de ces variétés sauvages :
                </p>
                <ul className="space-y-2">
                  <li className="font-medium text-foreground mt-2">Morilles brunes :</li>
                  <li><strong><em>Morchella conica</em></strong> — La morille conique. Chapeau allongé et alvéoles régulières. Arôme boisé prononcé.</li>
                  <li><strong><em>Morchella brunnea</em></strong> — La morille brune. Grande taille, couleur foncée. Saveur riche et terreuse.</li>
                  <li><strong><em>Morchella septimelata</em></strong> et <strong><em>M. sextelata</em></strong> — Espèces plus rares, spécifiques aux zones de haute altitude.</li>
                  <li className="font-medium text-foreground mt-2">Morilles blondes :</li>
                  <li><strong><em>Morchella esculenta</em></strong> — La morille commune blonde. Goût délicat avec des notes de noisette.</li>
                  <li><strong><em>Morchella prava</em></strong> — Espèce blonde délicate, arôme subtil.</li>
                  <li><strong><em>Morchella tomentosa</em></strong> — La « morille grise de feu ». Surface veloutée et grisâtre. Très parfumée.</li>
                  <li><strong><em>Morchella americana</em></strong> — La morille blonde. Plus claire, souvent la plus grande.</li>
                </ul>
                <p>
                  Ce mélange de variétés est un atout : il offre une <strong>complexité aromatique</strong> que l'on ne retrouve pas avec une seule espèce. C'est la signature gustative des morilles de feu canadiennes.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Section 3: Comparaison */}
          <ScrollReveal>
            <section className="mb-16" id="comparaison">
              <h2 className="font-serif text-2xl md:text-3xl font-light mb-6">Morilles de feu vs. morilles cultivées vs. morilles européennes</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-primary/20">
                      <th className="text-left py-3 px-4 font-serif font-light text-foreground"></th>
                      <th className="text-left py-3 px-4 font-serif font-light text-primary">Morilles de feu (Canada)</th>
                      <th className="text-left py-3 px-4 font-serif font-light text-foreground">Morilles sauvages (Europe)</th>
                      <th className="text-left py-3 px-4 font-serif font-light text-foreground">Morilles cultivées (Chine)</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50"><td className="py-3 px-4 font-medium text-foreground">Arôme</td><td className="py-3 px-4">Fumé, intense, boisé</td><td className="py-3 px-4">Terreux, délicat</td><td className="py-3 px-4">Neutre, fade</td></tr>
                    <tr className="border-b border-border/50"><td className="py-3 px-4 font-medium text-foreground">Taille</td><td className="py-3 px-4">Grande à très grande</td><td className="py-3 px-4">Petite à moyenne</td><td className="py-3 px-4">Variable</td></tr>
                    <tr className="border-b border-border/50"><td className="py-3 px-4 font-medium text-foreground">Texture</td><td className="py-3 px-4">Charnue, ferme</td><td className="py-3 px-4">Fine, fragile</td><td className="py-3 px-4">Spongieuse</td></tr>
                    <tr className="border-b border-border/50"><td className="py-3 px-4 font-medium text-foreground">Saison</td><td className="py-3 px-4">4-6 semaines/an</td><td className="py-3 px-4">~2 mois/an</td><td className="py-3 px-4">Toute l'année</td></tr>
                    <tr className="border-b border-border/50"><td className="py-3 px-4 font-medium text-foreground">Traitement</td><td className="py-3 px-4">Aucun</td><td className="py-3 px-4">Aucun</td><td className="py-3 px-4">Souvent traité</td></tr>
                    <tr><td className="py-3 px-4 font-medium text-foreground">Rareté</td><td className="py-3 px-4">Très rare</td><td className="py-3 px-4">Rare</td><td className="py-3 px-4">Abondant</td></tr>
                  </tbody>
                </table>
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
                  Nos morilles sont séchées lentement à <strong>basse température</strong> pour préserver leurs arômes. Une fois séchées, elles se conservent facilement :
                </p>
                <ul className="space-y-2">
                  <li><strong>Durée</strong> : 2 ans minimum sans perte d'arôme</li>
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
                  La morille de feu a un arôme <strong>fumé et boisé</strong> qui se marie parfaitement avec des ingrédients doux et crémeux. Voici les accords classiques :
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
                Prêt à goûter la <span className="italic text-gradient-gold">différence</span> ?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Découvrez nos morilles de feu séchées du Canada, récoltées à la main et livrées directement chez vous.
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
