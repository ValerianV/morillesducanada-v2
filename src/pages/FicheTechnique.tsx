import type { ReactNode } from "react";
import Seo from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { Download } from "lucide-react";
import logo from "@/assets/logo.webp";
import { EDITEUR } from "@/lib/legal";
import { PRO_PACK_GRAMS, PRO_SAMPLE_GRAMS } from "@/lib/proPricing";

// Fiche technique : uniquement les faits validés par le fondateur (docs/business/recit.md).
// Rien d'autre : ni allergènes, ni analyses, ni rendement ou date chiffrés tant qu'ils ne sont pas fournis.

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-sm tracking-[0.2em] uppercase text-[#d4b25c] border-b border-[#d4b25c]/60 pb-2 mb-3">{title}</h2>
    <dl className="space-y-3">{children}</dl>
  </section>
);

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="grid sm:grid-cols-[200px_minmax(0,1fr)] gap-x-6 gap-y-1 text-base leading-relaxed">
    <dt className="text-[#f4efe4]/75">{label}</dt>
    <dd className="text-[#f4efe4]">{value}</dd>
  </div>
);

const FicheTechnique = () => (
  <div className="bg-[#ddd9d0] min-h-screen">
    <Seo
      title="Fiche technique : morilles séchées sauvages | Morilles du Canada"
      description="Fiche technique des morilles séchées sauvages du Canada pour les professionnels : origine, entières et équeutées, variétés mélangées, conditionnement, réhydratation et conservation."
      path="/fiche-technique"
      jsonLd={breadcrumbSchema([
        { name: "Professionnels", path: "/professionnels" },
        { name: "Fiche technique", path: "/fiche-technique" },
      ])}
    />

    <div className="mx-auto w-full max-w-[210mm]">
      <div className="fiche-page bg-[#1a1612] text-[#f4efe4] px-5 sm:px-12 py-10 sm:py-12">
        <header className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-[#d4b25c]/40">
          <img src={logo} alt="Morilles du Canada" className="h-12 w-12 rounded-full" />
          <div className="text-right">
            <p className="text-sm tracking-[0.2em] uppercase text-[#d4b25c]">Fiche technique produit</p>
            <p className="text-sm text-[#f4efe4]/75">Saison 2026</p>
          </div>
        </header>

        <div className="mb-10">
          <h1 className="font-serif text-3xl sm:text-4xl font-light">Morilles de feu séchées, sauvages</h1>
          <p className="mt-2 text-base text-[#d4b25c]">Forêts brûlées du Canada — cueillette sauvage</p>
        </div>

        <Section title="Produit">
          <Row label="Dénomination" value="Morilles séchées sauvages (morilles de feu)" />
          <Row label="Espèces" value={<span><em>Morchella</em> spp., variétés sauvages mélangées (brune, blonde, grise), sans tri par variété</span>} />
          <Row label="Présentation" value="Entières et équeutées (pied retiré)" />
          <Row label="Origine" value="Canada : Colombie-Britannique et Yukon, forêts brûlées l'année précédente" />
          <Row label="Récolte" value="Cueillette sauvage, à la main, au printemps" />
          <Row label="Séchage" value="Sur place, par les cueilleurs" />
        </Section>

        <Section title="Conditionnement">
          <Row label="Commandes au kilo" value={`Sachets sous vide de ${PRO_PACK_GRAMS} g (par exemple, 3 kg = 12 sachets)`} />
          <Row label="Échantillon" value={`Pot en verre refermable de ${PRO_SAMPLE_GRAMS} g, remis en main propre lors d'une dégustation`} />
          <Row label="Stock" value="En France" />
        </Section>

        <Section title="Conservation">
          <Row label="Stockage" value="Au sec, à l'abri de la lumière" />
          <Row label="Date" value="Indiquée sur l'emballage" />
          <Row label="Après ouverture" value="Refermer le sachet ou transvaser en récipient hermétique, au sec et à l'abri de la lumière" />
        </Section>

        <Section title="Utilisation">
          <Row label="Réhydratation" value="20 à 30 minutes dans une eau tiède (30 à 40 °C). Filtrer le jus de trempage et le réutiliser en sauce ou en fond. Les morilles gonflent nettement." />
          <Row label="Cuisson" value="Toujours bien cuire les morilles (Tox Info Suisse recommande au moins 20 minutes). Ne jamais les consommer crues." />
        </Section>

        <p className="text-base text-[#f4efe4]/85 mb-10">Informations complémentaires sur demande : {EDITEUR.email}.</p>

        <footer className="pt-5 border-t border-[#d4b25c]/30 flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-[#f4efe4]/75">
          <div>
            <p>{EDITEUR.nom}, EI · SIRET {EDITEUR.siret}</p>
            <p>{EDITEUR.email} · morillesducanada.com</p>
          </div>
          <p>Fiche technique — Saison 2026</p>
        </footer>
      </div>
    </div>

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
        body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .fiche-page { min-height: 297mm; }
      }
    `}</style>
  </div>
);

export default FicheTechnique;
