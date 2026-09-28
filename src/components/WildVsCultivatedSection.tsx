import ScrollReveal from "@/components/ScrollReveal";
import WildVsCultivated from "@/components/WildVsCultivated";

// Accueil : « Sauvage ou cultivée ? », seul argument de fond qui ne répète pas « Nées du feu ».
const WildVsCultivatedSection = () => (
  <section id="sauvage-ou-cultivee" className="py-20 md:py-28">
    <div className="container mx-auto px-6">
      <ScrollReveal blur>
        <WildVsCultivated className="max-w-4xl mx-auto" />
      </ScrollReveal>
    </div>
  </section>
);

export default WildVsCultivatedSection;
