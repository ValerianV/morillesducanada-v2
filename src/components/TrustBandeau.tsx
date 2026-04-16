import { Flame, Users, Timer, MapPin } from "lucide-react";

const items = [
  { icon: Flame, label: "3 saisons sur le terrain" },
  { icon: Users, label: "Achat direct aux cueilleurs" },
  { icon: Timer, label: "Séchage dans les 24h" },
  { icon: MapPin, label: "Traçabilité totale — lot identifié" },
];

const TrustBandeau = () => (
  <div className="bg-primary/10 border-y border-primary/20 py-4">
    <div className="container mx-auto px-6">
      <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-sm font-light tracking-wide text-foreground/80">
            <Icon className="w-4 h-4 text-primary flex-shrink-0" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default TrustBandeau;
