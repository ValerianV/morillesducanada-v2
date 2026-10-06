import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schema";
import { EDITEUR } from "@/lib/legal";
import { PRO_SAMPLE_GRAMS } from "@/lib/proPricing";
import { TASTING_TOUR } from "@/lib/tasting";

// Zones et dates de passage (audit SEO d'octobre 2026, contenu C5). Les zones et les périodes viennent de
// TASTING_TOUR (supabase/functions/_shared/tasting.ts) : une seule source pour le site, les emails et llms.txt.
const PATH = "/zones-de-passage";
const TITLE = "Zones de passage et échantillon de morilles séchées";
const DESCRIPTION = `Où et quand je remets en main propre un échantillon de ${PRO_SAMPLE_GRAMS} g de morilles aux professionnels : ${TASTING_TOUR.map((stop) => stop.zone.fr).join(", ")}.`;
const DATE_MODIFIED = "2026-10-07";
const LINK = "text-primary hover:text-gold-light underline underline-offset-4";

const ZonesDePassage = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      jsonLd={[
        webPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION, dateModified: DATE_MODIFIED }),
        breadcrumbSchema([{ name: "Zones de passage", path: PATH }]),
      ]}
    />
    <Navbar />

    <main className="pt-28 pb-20">
      <article className="container mx-auto px-5 sm:px-6 max-w-3xl">
        <Link to="/professionnels" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-10 text-sm tracking-wider uppercase">
          <ArrowLeft className="w-4 h-4" /> Tarifs et devis
        </Link>

        <header className="mb-12">
          <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4">Échantillon en main propre</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-6">Zones et dates de passage pour l'échantillon de {PRO_SAMPLE_GRAMS} g</h1>
          <p className="text-xl text-foreground leading-relaxed">
            Quand je passe dans votre zone, je vous remets en main propre un pot en verre refermable de {PRO_SAMPLE_GRAMS} g de mes morilles, offert,
            pour juger sur pièce avant de commander. C'est réservé aux professionnels, et il faut convenir d'un rendez-vous.
          </p>
        </header>

        <section id="calendrier" className="mb-12 scroll-mt-28">
          <h2 className="font-serif text-2xl md:text-3xl font-light mb-4">Où et quand je passe ?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-base border-collapse">
              <caption className="text-left text-sm text-foreground/75 mb-2">Calendrier des passages, saison 2026</caption>
              <thead>
                <tr className="border-b border-gold/30">
                  <th scope="col" className="text-left font-medium text-foreground py-2 pr-4">Zone</th>
                  <th scope="col" className="text-left font-medium text-foreground py-2 pr-4">Lieux</th>
                  <th scope="col" className="text-left font-medium text-foreground py-2 pr-4">Période</th>
                </tr>
              </thead>
              <tbody>
                {TASTING_TOUR.map((stop) => (
                  <tr key={stop.id} className="border-b border-gold/10 align-top">
                    <td className="py-2 pr-4 text-foreground">{stop.zone.fr}</td>
                    <td className="py-2 pr-4 text-foreground/85">{stop.places ? stop.places.fr : "Sur rendez-vous"}</td>
                    <td className="py-2 pr-4 text-foreground/85">{stop.period.fr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-lg text-foreground/85 leading-relaxed">
            Hors de ces zones, contactez-moi : j'étudie chaque demande. Un envoi reste possible au cas par cas, après un échange téléphonique avec moi.
          </p>
        </section>

        <section id="obtenir" className="mb-12 scroll-mt-28">
          <h2 className="font-serif text-2xl md:text-3xl font-light mb-4">Comment obtenir l'échantillon ?</h2>
          <ol className="list-decimal pl-6 space-y-2 text-lg text-foreground/85 leading-relaxed">
            <li>
              Faites la demande depuis l'onglet « Échantillon en main propre » de la page{" "}
              <Link to="/professionnels#degustation" className={LINK}>
                Professionnels
              </Link>{" "}
              : SIRET, ville, code postal et vos disponibilités.
            </li>
            <li>Je vous recontacte pour convenir d'un rendez-vous, avant toute visite.</li>
            <li>Je vous remets le pot de {PRO_SAMPLE_GRAMS} g en main propre, lors de mon passage.</li>
          </ol>
        </section>

        <section id="apres" className="mb-12 scroll-mt-28">
          <h2 className="font-serif text-2xl md:text-3xl font-light mb-4">Et ensuite ?</h2>
          <p className="text-lg text-foreground/85 leading-relaxed">
            Si les morilles vous conviennent, vous pouvez{" "}
            <Link to="/professionnels#commander" className={LINK}>
              commander en ligne ou demander un devis
            </Link>
            . Selon votre activité :{" "}
            <Link to="/acheter-morilles-sechees-restauration" className={LINK}>
              restauration
            </Link>
            ,{" "}
            <Link to="/morilles-sechees-traiteurs" className={LINK}>
              traiteurs
            </Link>{" "}
            ou{" "}
            <Link to="/morilles-sechees-epicerie-fine" className={LINK}>
              épiceries fines
            </Link>
            . Pour savoir qui vous recevra : <Link to="/valerian-vilane" className={LINK}>Valérian Vilane, fondateur</Link>.
          </p>
        </section>

        <aside className="p-8 bg-gradient-card rounded-sm border border-primary/10">
          <h2 className="font-serif text-2xl font-light mb-4">Me contacter</h2>
          <ul className="space-y-2 text-lg">
            <li>
              <a href={EDITEUR.telephoneHref} className="inline-flex items-center gap-3 text-foreground hover:text-primary">
                <Phone className="w-5 h-5 text-primary" /> {EDITEUR.telephone}
              </a>
            </li>
            <li>
              <a href={`mailto:${EDITEUR.email}`} className="inline-flex items-center gap-3 text-foreground hover:text-primary break-all">
                <Mail className="w-5 h-5 text-primary shrink-0" /> {EDITEUR.email}
              </a>
            </li>
          </ul>
        </aside>
      </article>
    </main>

    <Footer />
  </div>
);

export default ZonesDePassage;
