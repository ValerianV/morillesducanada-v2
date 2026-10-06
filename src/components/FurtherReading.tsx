import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/context";
import { CONTENT_LINK_LABELS, FURTHER_READING_PATHS } from "@/lib/seo/articles";

// Bloc « Pour aller plus loin » du corps de l'accueil et de /professionnels : relie les guides, la fiche
// technique, la plaquette, la page du fondateur et les zones de passage (audit SEO d'octobre 2026, T1).
const FurtherReading = ({ id }: { id: string }) => {
  const { t } = useI18n();

  return (
    <nav aria-labelledby={id}>
      <h2 id={id} className="font-serif text-2xl md:text-3xl text-foreground mb-2">
        {t("furtherReading.title")}
      </h2>
      <p className="text-base text-foreground/80 mb-5 max-w-2xl">{t("furtherReading.intro")}</p>
      <ul lang="fr" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-2 text-lg">
        {FURTHER_READING_PATHS.map((path) => (
          <li key={path}>
            <Link to={path} className="text-primary hover:text-gold-light underline underline-offset-4">
              {CONTENT_LINK_LABELS[path]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FurtherReading;
