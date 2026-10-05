import type { ReactNode } from "react";
import Seo from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { Download } from "lucide-react";
import logo from "@/assets/logo.webp";
import landscapeCanada from "@/assets/landscape-canada.webp";
import productVacuumBag from "@/assets/product-vacuum-bag.webp";
import valerianPortrait from "@/assets/valerian-vilane-fondateur.webp";
import terrainPhoto from "@/assets/morels/morilles-groupe-foret-brulee.webp";
import { EDITEUR } from "@/lib/legal";
import { PREORDER_2027 } from "@/lib/preorder";
import { POT_PRICE_CENTS, POT_SIZES_G } from "@/lib/potAllocation";
import {
  PRO_MAX_KG,
  PRO_MIN_KG,
  PRO_ONLY_MENTION,
  PRO_PACK_GRAMS,
  PRO_QUOTE_REPLY_HOURS,
  PRO_SAMPLE_GRAMS,
  PRO_SHIPPING_BUSINESS_DAYS,
  PRO_STOCK_KG,
  PRO_TAX_MENTION,
  PRO_TIERS,
  formatEurosLocale,
  formatKg,
  formatTierPrice,
  quote,
} from "@/lib/proPricing";

// Plaquette professionnelle : lisible sur téléphone (une colonne), imprimable en A4 (une page par bloc).
// Toutes les valeurs chiffrées viennent de proPricing, preorder et legal.

const Page = ({ dark = false, children }: { dark?: boolean; children: ReactNode }) => (
  <section
    className={`plaquette-page relative overflow-hidden ${dark ? "bg-[#1a1612] text-[#f4efe4]" : "bg-[#fdfcf9] text-[#1a1612]"}`}
  >
    {children}
  </section>
);

const Band = ({ label }: { label: string }) => (
  <div className="bg-[#1a1612] px-5 sm:px-12 py-3 flex items-center justify-between gap-4">
    <p className="text-xs tracking-[0.25em] uppercase text-[#d4b25c]">{label}</p>
    <p className="text-xs text-[#f4efe4]/70 tracking-wider whitespace-nowrap">Saison 2026</p>
  </div>
);

const Eyebrow = ({ children, light = false }: { children: ReactNode; light?: boolean }) => (
  <p className={`text-xs tracking-[0.25em] uppercase mb-3 ${light ? "text-[#d4b25c]" : "text-[#8a6a1c]"}`}>{children}</p>
);

const PlaquettePro = () => (
  <div className="bg-[#ddd9d0] min-h-screen">
    <Seo
      title="Plaquette pro : morilles séchées au kilo | Morilles du Canada"
      description="Plaquette professionnelle Morilles du Canada : morilles sauvages du Canada séchées, entières et équeutées, au kilo en sachets sous vide de 250 g, tarifs nets, stock en France."
      path="/plaquette-pro"
      jsonLd={breadcrumbSchema([
        { name: "Professionnels", path: "/professionnels" },
        { name: "Plaquette professionnelle", path: "/plaquette-pro" },
      ])}
    />

    <div className="mx-auto w-full max-w-[210mm] shadow-xl">
      {/* 1. Couverture */}
      <Page dark>
        <img src={landscapeCanada} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1612]/30 via-[#1a1612]/60 to-[#1a1612]/95" />
        <div className="relative px-5 sm:px-12 py-10 sm:py-14 flex flex-col gap-12 min-h-[80vh] print:min-h-[297mm] justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Morilles du Canada" className="h-12 w-12 rounded-full" />
            <div>
              <p className="font-serif text-xl">Morilles du Canada</p>
              <p className="text-xs tracking-[0.25em] uppercase text-[#d4b25c]">Plaquette professionnelle</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm tracking-[0.25em] uppercase text-[#d4b25c] mb-5">Forêts brûlées du Canada</p>
            <h1 className="font-serif font-light leading-tight text-4xl sm:text-6xl">
              Morilles de feu
              <span className="block italic text-[#d4b25c]">séchées, sauvages</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-[#f4efe4]/90 max-w-md mx-auto leading-relaxed">
              Cueillies à la main, séchées sur place, entières et équeutées. Au kilo, pour les professionnels, en stock en France.
            </p>
          </div>
          <ul className="grid sm:grid-cols-3 gap-3 text-center">
            {["Restaurants et chefs", "Épiceries fines", "Traiteurs et distributeurs"].map((label) => (
              <li key={label} className="border border-[#d4b25c]/50 rounded-sm px-4 py-3 font-serif text-lg">
                {label}
              </li>
            ))}
          </ul>
        </div>
      </Page>

      {/* 2. Histoire et origine */}
      <Page>
        <Band label="Morilles du Canada · Origine et qualité" />
        <div className="px-5 sm:px-12 py-10 space-y-10">
          <div className="grid sm:grid-cols-[180px_minmax(0,1fr)] gap-8 items-start">
            <figure>
              <img src={valerianPortrait} alt="Valérian Vilane, fondateur de Morilles du Canada" className="w-full max-w-[220px] aspect-[3/4] object-cover rounded-sm" />
              <figcaption className="mt-3 text-sm text-[#4a4a4a]">
                <strong className="font-serif text-base text-[#1a1612]">Valérian</strong>, fondateur. Trois saisons de cueillette
                (2022, 2023, 2024) en Colombie-Britannique et au Yukon.
              </figcaption>
            </figure>
            <div>
              <Eyebrow>Mon histoire</Eyebrow>
              <h2 className="font-serif text-3xl font-light leading-snug mb-4">Une morille sauvage, cueillie après le feu.</h2>
              <div className="space-y-3 text-base leading-relaxed text-[#3a3a3a]">
                <p>
                  Pendant trois saisons, en 2022, 2023 et 2024, j'ai cueilli moi-même des morilles de feu en Colombie-Britannique
                  et au Yukon, sur des forêts brûlées l'année précédente.
                </p>
                <p>
                  Aujourd'hui, je travaille avec un réseau de cueilleurs sur les feux de forêt canadiens, qui sèchent les morilles
                  sur place. Le stock est en France, d'où je vous expédie.
                </p>
                <p>Une morille sauvage, cueillie à la main, sans rapport avec la morille de culture : c'est cette histoire que vous pouvez raconter à vos clients.</p>
              </div>
            </div>
          </div>

          <div>
            <Eyebrow>Ce qui me différencie</Eyebrow>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { t: "Cueillette sauvage", d: "À la main, au printemps, sur des forêts canadiennes brûlées l'année précédente. Jamais semées ni cultivées." },
                { t: "Séchées sur place", d: "Les cueilleurs sèchent les morilles sur place, près des zones de cueillette." },
                { t: "Sauvage, pas cultivée", d: "La morille de culture est produite en serre ou en plein champ. La nôtre pousse d'elle-même après un incendie." },
                { t: "Entières et équeutées", d: "Le poids payé est du chapeau, la partie qui porte l'arôme. Variétés sauvages mélangées." },
              ].map((item) => (
                <div key={item.t} className="border-l-2 border-[#c9a84c] pl-4">
                  <p className="font-serif text-lg mb-1">{item.t}</p>
                  <p className="text-base text-[#3a3a3a] leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>

          <img src={terrainPhoto} alt="Morilles de feu sur un sol brûlé, au Canada" className="w-full h-56 object-cover rounded-sm" />
        </div>
      </Page>

      {/* 3. L'offre au kilo */}
      <Page>
        <Band label="Morilles du Canada · L'offre au kilo" />
        <div className="px-5 sm:px-12 py-10 space-y-10">
          <div className="grid sm:grid-cols-[minmax(0,1fr)_180px] gap-8 items-start">
            <div>
              <Eyebrow>Sachets sous vide de {PRO_PACK_GRAMS} g</Eyebrow>
              <h2 className="font-serif text-3xl font-light leading-snug mb-4">Au kilo, en stock en France</h2>
              <p className="text-base leading-relaxed text-[#3a3a3a]">
                {PRO_STOCK_KG} kg disponibles. Commandes de {formatKg(PRO_MIN_KG)} à {formatKg(PRO_MAX_KG)}, par tranche de 500 g,
                livrées en sachets sous vide de {PRO_PACK_GRAMS} g (par exemple, 3 kg = 12 sachets), en France, port inclus,
                sous {PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés.
              </p>
            </div>
            <img src={productVacuumBag} alt="Morilles séchées en sachet sous vide" className="w-full max-w-[200px] aspect-[4/5] object-cover rounded-sm" />
          </div>

          <div>
            <Eyebrow>Tarifs au kilo — prix nets</Eyebrow>
            <table className="w-full text-base border-collapse">
              <thead>
                <tr className="border-b border-[#c9a84c]/50 text-left">
                  <th className="py-2 text-sm font-medium uppercase tracking-wider text-[#6b5a36]">Quantité</th>
                  <th className="py-2 text-sm font-medium uppercase tracking-wider text-[#6b5a36] text-right">Prix net</th>
                  <th className="py-2 text-sm font-medium uppercase tracking-wider text-[#6b5a36] text-right hidden sm:table-cell">Exemple</th>
                </tr>
              </thead>
              <tbody>
                {PRO_TIERS.map((tier) => {
                  const example = quote(tier.minKg);
                  return (
                    <tr key={tier.id} className="border-b border-[#ece6d8]">
                      <td className="py-3 font-serif text-lg">{tier.label.fr}</td>
                      <td className="py-3 text-right font-serif text-lg text-[#8a6a1c] font-semibold whitespace-nowrap">{formatTierPrice(tier)}</td>
                      <td className="py-3 text-right text-[#3a3a3a] hidden sm:table-cell whitespace-nowrap">
                        {example ? `${formatKg(example.kg)} = ${formatEurosLocale(example.totalCents)}` : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-3 text-sm text-[#3a3a3a]">
              {PRO_TAX_MENTION.fr}. Le prix du palier atteint s'applique à toute la quantité commandée. Port inclus en France.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { t: "Chefs et restaurants", d: "Pas de pied à retirer en cuisine. Le prix au kilo baisse dès 3 kg." },
              {
                t: "Épiceries fines",
                d: `Morilles en sachets sous vide, à reconditionner sous votre marque. En option : pots en verre vides de ${POT_SIZES_G.join(", ").replace(/, (\d+)$/, " ou $1")} g, sans étiquette, à ${formatEurosLocale(POT_PRICE_CENTS)} le pot, livrés à part.`,
              },
              { t: "Traiteurs et distributeurs", d: "Un prix net connu à l'avance pour chiffrer vos prestations, jusqu'à 45 kg." },
            ].map((c) => (
              <div key={c.t} className="bg-[#f5f2eb] border-l-2 border-[#c9a84c] px-4 py-3">
                <p className="font-serif text-lg mb-1">{c.t}</p>
                <p className="text-base text-[#3a3a3a] leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#1a1612] text-[#f4efe4] rounded-sm p-5">
              <Eyebrow light>Dégustation en main propre</Eyebrow>
              <p className="text-base leading-relaxed">
                Un pot en verre de {PRO_SAMPLE_GRAMS} g offert, remis en main propre lors de mon passage dans votre zone, pour goûter avant de commander. Envoi possible au cas par cas, après un échange avec moi.
              </p>
            </div>
            <div className="bg-[#1a1612] text-[#f4efe4] rounded-sm p-5">
              <Eyebrow light>Précommande saison {PREORDER_2027.season}</Eyebrow>
              <p className="text-base leading-relaxed">
                {formatEurosLocale(PREORDER_2027.pricePerKgCents)}/kg, acompte de 50 %, de {PREORDER_2027.minKg} à {PREORDER_2027.maxKg} kg,
                livraison garantie en {PREORDER_2027.delivery.fr}, port inclus en France.
              </p>
            </div>
          </div>
        </div>
      </Page>

      {/* 4. Commander */}
      <Page dark>
        <div className="px-5 sm:px-12 py-12 space-y-10">
          <div className="text-center">
            <Eyebrow light>Commander · Goûter · Précommander</Eyebrow>
            <h2 className="font-serif text-4xl font-light">Travaillons ensemble</h2>
            <p className="mt-4 text-base text-[#f4efe4]/85 max-w-md mx-auto leading-relaxed">
              Un appel ou un email suffit pour un devis, une commande ou une dégustation. Je suis votre interlocuteur unique.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { label: "Téléphone", value: EDITEUR.telephone, href: EDITEUR.telephoneHref },
              { label: "Email", value: EDITEUR.email, href: `mailto:${EDITEUR.email}` },
              { label: "Devis et dégustation", value: "morillesducanada.com/professionnels", href: "/professionnels" },
            ].map((c) => (
              <div key={c.label} className="border-t border-[#d4b25c]/40 pt-4">
                <p className="text-xs tracking-[0.25em] uppercase text-[#d4b25c] mb-2">{c.label}</p>
                <a href={c.href} className="text-base font-medium break-words hover:text-[#d4b25c]">
                  {c.value}
                </a>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#d4b25c] mb-4">Comment commander</p>
            <ol className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { t: "Devis", d: `Réponse sous ${PRO_QUOTE_REPLY_HOURS} h ouvrées` },
                { t: "Ou commande en ligne", d: "Quantité au choix, pots en option" },
                { t: "Paiement", d: "À la commande : carte (paiement Stripe) ou virement sur facture" },
                { t: "Expédition", d: `Sous ${PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés, port inclus` },
              ].map((s, i) => (
                <li key={s.t} className="text-center">
                  <p className="font-serif text-2xl text-[#d4b25c]">{i + 1}</p>
                  <p className="text-base font-medium mt-1">{s.t}</p>
                  <p className="text-sm text-[#f4efe4]/80 mt-1">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="border border-[#d4b25c]/30 rounded-sm px-5 py-4 text-sm text-[#f4efe4]/85 leading-relaxed">
            {PRO_ONLY_MENTION.fr} {PRO_TAX_MENTION.fr}. Facture avec numéro SIRET. Livraison en France uniquement.
          </div>

          <p className="text-center text-sm text-[#f4efe4]/75">
            © 2026 Morilles du Canada · {EDITEUR.nom}, EI · {EDITEUR.ville}
          </p>
        </div>
      </Page>
    </div>

    {/* Téléchargement : en bas de page, jamais par-dessus le contenu. */}
    <div className="py-8 flex justify-center print:hidden">
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 px-6 py-3 bg-[#1a1612] text-[#d4b25c] font-medium text-sm tracking-wider uppercase rounded shadow-xl hover:opacity-90 transition-opacity"
      >
        <Download className="w-4 h-4" />
        Télécharger en PDF
      </button>
    </div>

    <style>{`
      @media print {
        @page { size: A4; margin: 0; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; margin: 0; }
        nav, footer { display: none !important; }
        .plaquette-page { break-after: page; min-height: 297mm; }
      }
    `}</style>
  </div>
);

export default PlaquettePro;
