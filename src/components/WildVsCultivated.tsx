import { useI18n } from "@/i18n/context";

// Bloc « Sauvage ou cultivée ? » : différence d'origine, sans comparaison de goût ni pays nommé.
const WildVsCultivated = ({ className = "" }: { className?: string }) => {
  const { translations } = useI18n();
  const copy = translations.wildVsCultivated;

  return (
    <div className={className}>
      <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-3">{copy.title}</h3>
      <p className="text-base text-foreground/85 leading-relaxed mb-6 max-w-2xl">{copy.intro}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-5 border border-primary/40 rounded-sm bg-primary/5">
          <p className="font-serif text-lg text-foreground mb-3">{copy.wildTitle}</p>
          <ul className="space-y-2 text-sm text-foreground/85 leading-relaxed list-disc pl-5">
            {copy.wild.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="p-5 border border-gold/15 rounded-sm">
          <p className="font-serif text-lg text-foreground/80 mb-3">{copy.cultivatedTitle}</p>
          <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
            {copy.cultivated.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WildVsCultivated;
