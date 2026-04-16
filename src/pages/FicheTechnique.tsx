import { Download } from "lucide-react";
import logo from "@/assets/logo.webp";

const GOLD = "#c9a84c";
const DARK = "#1a1612";
const CREAM = "#fdfcf9";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 20 }}>
    <div
      style={{
        fontSize: 8,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: GOLD,
        borderBottom: `1px solid ${GOLD}`,
        paddingBottom: 4,
        marginBottom: 8,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div
    style={{
      display: "flex",
      gap: 12,
      marginBottom: 5,
      fontSize: 9,
      lineHeight: 1.5,
    }}
  >
    <div style={{ minWidth: 160, color: "rgba(255,255,255,0.55)", flexShrink: 0 }}>{label}</div>
    <div style={{ color: CREAM }}>{value}</div>
  </div>
);

const FicheTechnique = () => (
  <div style={{ backgroundColor: "#ddd9d0", minHeight: "100vh" }}>
    {/* Print button */}
    <div className="fixed top-6 right-6 z-50 print:hidden">
      <button
        onClick={() => window.print()}
        style={{ background: DARK, color: GOLD }}
        className="flex items-center gap-2 px-6 py-3 font-medium text-sm tracking-wider uppercase rounded shadow-xl hover:opacity-90 transition-opacity"
      >
        <Download className="w-4 h-4" />
        Télécharger PDF
      </button>
    </div>

    <div style={{ maxWidth: "210mm", margin: "0 auto" }}>
      <div
        className="page"
        style={{
          minHeight: "297mm",
          backgroundColor: DARK,
          color: CREAM,
          display: "flex",
          flexDirection: "column",
          padding: "40px 56px",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
            paddingBottom: 20,
            borderBottom: `1px solid rgba(201,168,76,0.3)`,
          }}
        >
          <img src={logo} alt="Morilles du Canada" style={{ height: 36, objectFit: "contain" }} />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 7, letterSpacing: "0.35em", textTransform: "uppercase", color: GOLD }}>
              Fiche Technique Produit
            </div>
            <div style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginTop: 3 }}>
              Saison 2026
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 22,
              fontWeight: 300,
              color: CREAM,
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            Morilles de feu séchées sauvages
          </h1>
          <div style={{ fontSize: 9, color: GOLD, marginTop: 6, letterSpacing: "0.15em" }}>
            Colombie-Britannique & Yukon — Canada
          </div>
        </div>

        {/* Identification */}
        <Section title="Identification">
          <Row label="Dénomination commerciale" value="Morilles de feu séchées sauvages" />
          <Row label="Famille botanique" value="Morchellaceae" />
          <Row
            label="Espèces (variété brune)"
            value={<span><em>Morchella conica, M. brunnea, M. snyderi</em></span>}
          />
          <Row
            label="Espèces (variété blonde & grise)"
            value={<span><em>M. americana, M. esculenta, M. prava, M. tomentosa</em></span>}
          />
          <Row label="Origine géographique" value="Colombie-Britannique / Yukon, Canada" />
          <Row label="Écosystème" value="Forêt boréale post-incendie (morilles de feu)" />
        </Section>

        {/* Récolte & Transformation */}
        <Section title="Récolte & Transformation">
          <Row label="Mode de récolte" value="Cueillette sauvage manuelle, forêt post-incendie" />
          <Row label="Séchage" value="Air chaud contrôlé, < 48h après récolte" />
          <Row label="Taux d'humidité résiduel" value="Entre 8 et 12% (séchage air chaud contrôlé sous vide)" />
          <Row label="Sans additifs ni conservateurs" value="Oui" />
        </Section>

        {/* Conditionnement */}
        <Section title="Conditionnement">
          <Row
            label="Formats disponibles"
            value="Sous vide : 12g · 30g · 45g · 100g · 200g · 500g · 1 kg"
          />
          <Row label="Matériau" value="Sachet sous vide (PA/PE)" />
          <Row label="Stockage" value="Température ambiante, sec et sombre" />
          <Row label="DLUO" value="24 mois à compter de la date de séchage (sous vide, à l'abri de la lumière)" />
          <Row
            label="Après ouverture"
            value="Consommer sous 6 mois en bocal hermétique"
          />
        </Section>

        {/* Utilisation */}
        <Section title="Utilisation">
          <Row
            label="Réhydratation"
            value="20 min dans eau tiède (70°C) — filtrer le jus de trempage et le réutiliser (très aromatique)"
          />
          <Row label="Rapport séché / frais" value="Environ 1 pour 8 à 10 en poids" />
        </Section>

        {/* Allergènes & Sécurité */}
        <Section title="Allergènes & Sécurité alimentaire">
          <Row label="Allergènes réglementaires" value="Aucun (produit naturel, non transformé)" />
          <Row
            label="Traces éventuelles"
            value="Peut contenir des traces de fruits secs et de fruits à coque (selon atelier de conditionnement)"
          />
          <Row
            label="Agréments / Certifications"
            value="Cueillette sauvage en forêt publique canadienne. Pas de certification bio (récolte hors agriculture). Traçabilité par lot via le cueilleur partenaire."
          />
        </Section>

        {/* Valeurs nutritionnelles indicatives */}
        <Section title="Valeurs nutritionnelles indicatives (pour 100g de produit séché)">
          <Row label="Énergie" value="300–340 kcal" />
          <Row label="Protéines" value="~28g" />
          <Row label="Lipides" value="~3g" />
          <Row label="Glucides" value="~35g" />
          <Row label="Fibres" value="~17g" />
          <div style={{ fontSize: 7, color: "rgba(255,255,255,0.35)", marginTop: 4, fontStyle: "italic" }}>
            Valeurs à titre indicatif — à compléter par une analyse officielle si requis par votre cahier des charges.
          </div>
        </Section>

        {/* Footer */}
        <div style={{ marginTop: "auto", paddingTop: 20, borderTop: `1px solid rgba(201,168,76,0.2)` }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              fontSize: 8,
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.4)" }}>
              <div>Valérian Vilane · SIRET 802 861 948 00023</div>
              <div>contact@morillesducanada.com · morillesducanada.com</div>
            </div>
            <div style={{ color: "rgba(255,255,255,0.25)", textAlign: "right", fontSize: 7 }}>
              Fiche technique — Saison 2026
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Print styles */}
    <style>{`
      @media print {
        @page { size: A4; margin: 0; }
        body { margin: 0; }
        .page { min-height: 297mm !important; page-break-after: always; }
      }
    `}</style>
  </div>
);

export default FicheTechnique;
