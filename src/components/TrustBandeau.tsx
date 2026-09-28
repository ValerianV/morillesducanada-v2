import { Flame, Users, Timer, MapPin } from "lucide-react";
import { useI18n } from "@/i18n/context";

const items = [
  { icon: Flame, key: "trustBar.seasons" },
  { icon: Users, key: "trustBar.direct" },
  { icon: Timer, key: "trustBar.drying" },
  { icon: MapPin, key: "trustBar.traceability" },
];

const TrustBandeau = () => {
  const { t } = useI18n();
  return (
    <div className="bg-primary/10 border-y border-primary/20 py-4">
      <div className="container mx-auto px-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {items.map(({ icon: Icon, key }) => (
            <li key={key} className="flex items-center gap-2 text-sm font-light tracking-wide text-foreground/80">
              <Icon className="w-4 h-4 text-primary flex-shrink-0" />
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrustBandeau;
