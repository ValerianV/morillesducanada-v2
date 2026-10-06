import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import Seo from "@/components/Seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTENT_LINK_LABELS } from "@/lib/seo/articles";
import { breadcrumbSchema, profilePageSchema } from "@/lib/seo/schema";
import { FOUNDER_NAME, FOUNDER_PATH } from "@/lib/seo/site";
import { EDITEUR } from "@/lib/legal";
import { PRO_QUOTE_REPLY_HOURS, PRO_SHIPPING_BUSINESS_DAYS } from "@/lib/proPricing";

// Page d'identité du fondateur (audit SEO d'octobre 2026, contenu C3). Faits de docs/business/recit.md uniquement :
// trois saisons de cueillette (2022, 2023, 2024), jamais de nom de cueilleur ou d'acheteur partenaire.
const TITLE = `${FOUNDER_NAME}, fondateur de Morilles du Canada`;
const DESCRIPTION =
  "Valérian Vilane a cueilli des morilles de feu de 2022 à 2024 en Colombie-Britannique et au Yukon. Il vend aujourd'hui ses morilles séchées aux pros.";
const DATE_MODIFIED = "2026-10-07";

const PHOTO_PATH = "/images/valerian-vilane-fondateur-morilles-du-canada.webp";
const LINK = "text-primary hover:text-gold-light underline underline-offset-4";

const GUIDES = [
  "/morille-de-feu-ou-morille-de-culture",
  "/guide-morilles-de-feu",
  "/acheter-morilles-sechees-restauration",
  "/morilles-sechees-traiteurs",
  "/zones-de-passage",
  "/fiche-technique",
];

const Fondateur = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title={TITLE}
      description={DESCRIPTION}
      path={FOUNDER_PATH}
      type="article"
      jsonLd={[
        profilePageSchema({ path: FOUNDER_PATH, name: TITLE, description: DESCRIPTION, dateModified: DATE_MODIFIED }),
        breadcrumbSchema([{ name: FOUNDER_NAME, path: FOUNDER_PATH }]),
      ]}
    />
    <Navbar />

    <main className="pt-28 pb-20">
      <article className="container mx-auto px-5 sm:px-6 max-w-3xl">
        <Link to="/professionnels" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-10 text-sm tracking-wider uppercase">
          <ArrowLeft className="w-4 h-4" /> Tarifs et devis
        </Link>

        <header className="mb-12 grid sm:grid-cols-[minmax(0,1fr)_200px] gap-8 items-start">
          <div>
            <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4">Qui je suis</p>
            <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-6">{FOUNDER_NAME}, ancien cueilleur de morilles de feu</h1>
            <p className="text-xl text-foreground leading-relaxed">
              J'ai cueilli moi-même des morilles de feu pendant trois saisons, de 2022 à 2024, en Colombie-Britannique et au Yukon.
              Aujourd'hui, je vends ces morilles, séchées, aux professionnels.
            </p>
          </div>
          <img
            src={PHOTO_PATH}
            alt={`${FOUNDER_NAME}, fondateur de Morilles du Canada`}
            width={600}
            height={600}
            className="w-full max-w-[200px] sm:max-w-none aspect-square object-cover rounded-sm border border-gold/15"
          />
        </header>

        <section id="qui-je-suis" className="mb-12 scroll-mt-28">
          <h2 className="font-serif text-2xl md:text-3xl font-light mb-4">Qui est Valérian Vilane ?</h2>
          <div className="space-y-4 text-lg text-foreground/85 leading-relaxed">
            <p>
              Je m'appelle {FOUNDER_NAME}. Je suis le fondateur de Morilles du Canada, une micro-entreprise (entrepreneur individuel)
              basée à Aubignan, dans le Vaucluse. Je suis votre interlocuteur unique, de la demande de devis à l'expédition.
            </p>
          </div>
        </section>

        <section id="trois-saisons" className="mb-12 scroll-mt-28">
          <h2 className="font-serif text-2xl md:text-3xl font-light mb-4">Trois saisons de cueillette, de 2022 à 2024</h2>
          <div className="space-y-4 text-lg text-foreground/85 leading-relaxed">
            <p>
              En 2022, 2023 et 2024, j'ai cueilli moi-même des morilles de feu en Colombie-Britannique et au Yukon, sur des forêts
              brûlées l'année précédente. Une morille de feu pousse d'elle-même, une seule saison, au printemps qui suit un incendie de forêt,
              sur des sols brûlés difficiles d'accès, et se cueille à la main.
            </p>
            <p>
              Cette morille sauvage n'a rien à voir avec la morille de culture, produite en serre ou en plein champ :{" "}
              <Link to="/morille-de-feu-ou-morille-de-culture" className={LINK}>
                morille de feu ou morille de culture
              </Link>
              , ou le{" "}
              <Link to="/guide-morilles-de-feu" className={LINK}>
                guide de la morille de feu
              </Link>
              .
            </p>
          </div>
        </section>

        <section id="aujourd-hui" className="mb-12 scroll-mt-28">
          <h2 className="font-serif text-2xl md:text-3xl font-light mb-4">Comment je travaille aujourd'hui</h2>
          <div className="space-y-4 text-lg text-foreground/85 leading-relaxed">
            <p>
              Je travaille avec un réseau de cueilleurs sur les feux canadiens, qui sèchent les morilles sur place. Les morilles sont
              sauvages, entières et équeutées, en variétés mélangées. Le stock est en France, d'où j'expédie sous {PRO_SHIPPING_BUSINESS_DAYS} jours
              ouvrés.
            </p>
          </div>
        </section>

        <section id="professionnels" className="mb-12 scroll-mt-28">
          <h2 className="font-serif text-2xl md:text-3xl font-light mb-4">Pourquoi je vends aux professionnels</h2>
          <div className="space-y-4 text-lg text-foreground/85 leading-relaxed">
            <p>
              Je vends aux restaurants, aux épiceries fines, aux traiteurs et aux distributeurs : ce sont eux qui peuvent raconter à leurs clients
              l'histoire de cette morille, de la forêt brûlée à l'assiette. La vente est réservée aux professionnels, SIRET demandé à la commande ;
              je ne vends pas aux particuliers.
            </p>
            <p>
              Selon votre activité :{" "}
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
              .
            </p>
          </div>
        </section>

        <section id="contact" className="mb-12 scroll-mt-28">
          <h2 className="font-serif text-2xl md:text-3xl font-light mb-4">Comment me joindre</h2>
          <div className="space-y-4 text-lg text-foreground/85 leading-relaxed">
            <p>
              Un appel ou un email suffit. Pour un devis, je réponds sous {PRO_QUOTE_REPLY_HOURS} h ouvrées : demandez-le depuis la page{" "}
              <Link to="/professionnels#devis" className={LINK}>
                Professionnels
              </Link>
              . Pour voir le produit avant de commander, je passe sur rendez-vous vous remettre un pot : voir les{" "}
              <Link to="/zones-de-passage" className={LINK}>
                zones et dates de passage
              </Link>
              , où je remets un pot de 30 g en main propre.
            </p>
            <ul className="space-y-2">
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
            <p className="text-base text-foreground/75">
              {EDITEUR.nom}, EI · SIRET {EDITEUR.siret} · {EDITEUR.ville} ·{" "}
              <Link to="/mentions-legales" className={LINK}>
                mentions légales
              </Link>
              .
            </p>
          </div>
        </section>

        <section aria-labelledby="related-title">
          <h2 id="related-title" className="font-serif text-xl mb-4">À lire aussi</h2>
          <ul className="space-y-2 text-lg">
            {GUIDES.map((path) => (
              <li key={path}>
                <Link to={path} className={LINK}>
                  {CONTENT_LINK_LABELS[path]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>

    <Footer />
  </div>
);

export default Fondateur;
