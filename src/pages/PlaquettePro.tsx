import Seo from "@/components/Seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { Download } from "lucide-react";
import logo from "@/assets/logo.webp";
import landscapeCanada from "@/assets/landscape-canada.webp";
import heroMorels from "@/assets/hero-morels.webp";
import heroJars from "@/assets/hero-jars.webp";
import productVacuumBag from "@/assets/product-vacuum-bag.webp";
import valerianPortrait from "@/assets/valerian-portrait.webp";
import landscapeFireweed from "@/assets/landscape-fireweed.webp";
import {
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

const GOLD = "#c9a84c";
const DARK = "#1a1612";
const CREAM = "#fdfcf9";

const band = (label: string) => (
  <div
    style={{
      backgroundColor: DARK,
      padding: "13px 56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
    }}
  >
    <div style={{ fontSize: 8, letterSpacing: "0.38em", textTransform: "uppercase", color: GOLD }}>
      {label}
    </div>
    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", letterSpacing: "0.18em" }}>
      Saison 2026
    </div>
  </div>
);

const PlaquettePro = () => (
  <div style={{ backgroundColor: "#ddd9d0", minHeight: "100vh" }}>
    <Seo
      title="Plaquette pro : morilles séchées au kilo | Morilles du Canada"
      description="Catalogue professionnel Morilles du Canada : morilles sauvages du Canada séchées, entières et équeutées, tarifs nets au kilo, stock en France et conditions de vente."
      path="/plaquette-pro"
      jsonLd={breadcrumbSchema([
        { name: "Professionnels", path: "/professionnels" },
        { name: "Plaquette professionnelle", path: "/plaquette-pro" },
      ])}
    />
    {/* Download button */}
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

      {/* ═══════════════════════════════════════════════
          PAGE 1 — COUVERTURE
      ═══════════════════════════════════════════════ */}
      <div
        className="page"
        style={{
          minHeight: "297mm",
          backgroundColor: DARK,
          color: "white",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <img
          src={landscapeCanada}
          alt=""
          aria-hidden
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: 0.42,
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(160deg, rgba(26,22,18,0.25) 0%, rgba(26,22,18,0.55) 45%, rgba(26,22,18,0.9) 100%)",
          }}
        />

        <div
          className="relative"
          style={{
            flex: 1, display: "flex", flexDirection: "column",
            justifyContent: "space-between", padding: "48px 56px", minHeight: "297mm",
          }}
        >
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img src={logo} alt="Morilles du Canada" style={{ height: 46, width: "auto" }} />
              <div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 600, letterSpacing: "0.02em" }}>
                  Morilles du Canada
                </div>
                <div style={{ fontSize: 8, letterSpacing: "0.35em", textTransform: "uppercase", color: GOLD, marginTop: 4 }}>
                  Morilles de feu sauvages
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Catalogue professionnel
              </div>
              <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: "0.12em", marginTop: 5 }}>
                Saison 2026
              </div>
            </div>
          </div>

          {/* Center title block */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.45em", textTransform: "uppercase", color: GOLD, marginBottom: 20 }}>
              Colombie-Britannique &amp; Yukon, Canada
            </div>
            <h1 style={{ margin: 0, fontWeight: 300 }}>
              <span style={{ display: "block", fontFamily: "Georgia, serif", fontSize: 54, fontWeight: 300, lineHeight: 1.1, marginBottom: 10 }}>
                Morilles de Feu
              </span>
              <span style={{ display: "block", fontFamily: "Georgia, serif", fontSize: 54, fontWeight: 300, fontStyle: "italic", color: GOLD, lineHeight: 1.1, marginBottom: 36 }}>
                séchées sauvages
              </span>
            </h1>
            <div style={{ width: 60, height: 1, backgroundColor: GOLD, margin: "0 auto 30px" }} />
            <div style={{ fontSize: 12, fontWeight: 300, letterSpacing: "0.07em", color: "rgba(255,255,255,0.7)", maxWidth: 380, margin: "0 auto", lineHeight: 1.8 }}>
              Achetées directement aux cueilleurs · Séchées le jour de la récolte ·
              Sans intermédiaire — du sol brûlé à votre assiette.
            </div>
          </div>

          {/* Bottom: two client segments */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {[
              {
                label: "Restaurateurs & Chefs",
                desc: `Au kilo, de 500 g à ${PRO_STOCK_KG} kg · Entières et équeutées · ${PRO_STOCK_KG} kg en stock en France`,
              },
              {
                label: "Épiceries & Cavistes",
                desc: "Pots verre premium 3 formats · Packaging storytelling · Revente au détail",
              },
            ].map((seg) => (
              <div
                key={seg.label}
                style={{ border: `1px solid ${GOLD}45`, padding: "20px 24px", borderRadius: 2 }}
              >
                <div style={{ fontSize: 8, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, marginBottom: 9 }}>
                  Pour les
                </div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 15, marginBottom: 9 }}>
                  {seg.label}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
                  {seg.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          PAGE 2 — HISTOIRE & SOURCING
      ═══════════════════════════════════════════════ */}
      <div
        className="page"
        style={{ minHeight: "297mm", backgroundColor: CREAM, color: DARK, display: "flex", flexDirection: "column" }}
      >
        {band("Morilles du Canada · Sourcing & Engagement qualité")}

        <div style={{ flex: 1, padding: "44px 56px" }}>
          {/* Portrait + story */}
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 40, marginBottom: 38 }}>
            <div>
              <img
                src={valerianPortrait}
                alt="Valérian, fondateur de Morilles du Canada"
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", borderRadius: 2 }}
              />
              <div style={{ borderTop: `1px solid ${GOLD}45`, paddingTop: 12, marginTop: 12 }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 600 }}>Valérian</div>
                <div style={{ fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase", color: "#8a7a5a", marginTop: 4 }}>
                  Fondateur · Morilles du Canada
                </div>
                <div style={{ fontSize: 9, color: "#6a6a6a", marginTop: 9, lineHeight: 1.7 }}>
                  3 saisons de cueillette en Colombie-Britannique et au Yukon · 2 ans de vente directe sur les marchés
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 8, letterSpacing: "0.38em", textTransform: "uppercase", color: GOLD, marginBottom: 13 }}>
                Notre histoire
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 300, lineHeight: 1.3, marginBottom: 18 }}>
                Pas un importateur.<br />Un cueilleur devenu fournisseur.
              </div>
              <div style={{ width: 36, height: 1, backgroundColor: GOLD, marginBottom: 22 }} />
              <div style={{ fontSize: 11, color: "#4a4a4a", lineHeight: 1.85, marginBottom: 13 }}>
                J'ai passé trois printemps dans les forêts brûlées du Canada — à marcher dans les cendres,
                dormir sous la tente, ramasser les morilles aux côtés de cueilleurs que je considère
                aujourd'hui comme des amis. Ce n'est pas un projet de bureau : j'y étais, sur le terrain.
              </div>
              <div style={{ fontSize: 11, color: "#4a4a4a", lineHeight: 1.85, marginBottom: 13 }}>
                Ce terrain m'a appris deux choses. D'abord, la morille de feu canadienne n'a aucun
                équivalent — ni en Europe, ni en culture. Ensuite, les cueilleurs méritent mieux
                que les prix cassés que leur proposent les grossistes asiatiques.
              </div>
              <div style={{ fontSize: 11, color: "#4a4a4a", lineHeight: 1.85 }}>
                Morilles du Canada, c'est ce lien direct : j'achète juste, je sèche dans les 24h,
                j'expédie sans intermédiaire. Vous recevez un produit dont je connais l'origine
                à la forêt près — et vous pouvez la raconter.
              </div>
            </div>
          </div>

          {/* 4 differentiators */}
          <div style={{ borderTop: `1px solid ${GOLD}28`, paddingTop: 30 }}>
            <div style={{ fontSize: 8, letterSpacing: "0.38em", textTransform: "uppercase", color: GOLD, marginBottom: 22 }}>
              Ce qui nous différencie réellement
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 44px" }}>
              {[
                {
                  n: "01",
                  t: "Séchage dans les 24h après récolte",
                  d: "Les morilles sont achetées en forêt chaque soir et séchées le lendemain dans un séchoir professionnel sur place en Colombie-Britannique.",
                },
                {
                  n: "02",
                  t: "3 cueilleurs de confiance, pas de grossiste",
                  d: "Je connais personnellement chaque cueilleur — des amis côtoyés pendant trois saisons. Pas de négociant intermédiaire, pas de chambre froide collective, pas de mélange de lots.",
                },
                {
                  n: "03",
                  t: "Traçabilité totale, lot par lot",
                  d: "Chaque lot est identifiable : zone de récolte, date de séchage. Vous pouvez raconter cette histoire à vos clients — c'est un argument de vente en soi.",
                },
                {
                  n: "04",
                  t: "Entières et équeutées",
                  d: "Morilles vendues sans pied : le poids payé est du chapeau, la partie qui porte l'arôme. Variétés sauvages mélangées.",
                },
              ].map((item) => (
                <div key={item.n} style={{ display: "flex", gap: 14 }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 20, color: GOLD, fontWeight: 300, flexShrink: 0, lineHeight: 1, paddingTop: 2, opacity: 0.8 }}>
                    {item.n}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 6, color: DARK }}>
                      {item.t}
                    </div>
                    <div style={{ fontSize: 10, color: "#6a6a6a", lineHeight: 1.7 }}>
                      {item.d}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pull quote */}
          <div
            style={{
              marginTop: 30, padding: "20px 28px",
              backgroundColor: DARK, borderRadius: 2,
              borderLeft: `3px solid ${GOLD}`,
            }}
          >
            <div style={{ fontFamily: "Georgia, serif", fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.82)", lineHeight: 1.75 }}>
              « Entre les cueilleurs qui risquent tout sur le terrain et les chefs qui paient le prix fort,
              il manquait un lien juste. C'est ce que j'ai décidé de créer. »
            </div>
            <div style={{ fontSize: 8, color: GOLD, letterSpacing: "0.22em", textTransform: "uppercase", marginTop: 11 }}>
              — Valérian, fondateur
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          PAGE 3 — RESTAURATEURS & CHEFS
      ═══════════════════════════════════════════════ */}
      <div
        className="page"
        style={{ minHeight: "297mm", backgroundColor: CREAM, color: DARK, display: "flex", flexDirection: "column" }}
      >
        {band("Morilles du Canada · Restaurateurs & Chefs")}

        <div style={{ flex: 1, padding: "40px 56px" }}>
          {/* Header with image */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 185px", gap: 32, marginBottom: 34, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 8, letterSpacing: "0.38em", textTransform: "uppercase", color: GOLD, marginBottom: 13 }}>
                Conditionnement professionnel sous vide
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 300, lineHeight: 1.25, marginBottom: 16 }}>
                Pour les cuisines qui travaillent la morille en régulier
              </div>
              <div style={{ fontSize: 11, color: "#4a4a4a", lineHeight: 1.85 }}>
                Sachets sous vide thermoscellés. Morilles entières sans queue, triées à la main,
                séchées à basse température. Vendues au kilo, de 500 g à {PRO_STOCK_KG} kg.
                Conservation 2 ans minimum en conditions sèches.
                Les morilles triplent de volume à la réhydratation.
              </div>
            </div>
            <img
              src={productVacuumBag}
              alt="Sachet sous vide morilles de feu"
              style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", borderRadius: 2 }}
            />
          </div>

          {/* Grille pro au kilo (source : src/lib/proPricing.ts) */}
          <div style={{ marginBottom: 30 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD, marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${GOLD}28` }}>
              Tarifs professionnels au kilo — prix nets
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${GOLD}22`, textAlign: "left" }}>
                  {[
                    { l: "Quantité", r: false },
                    { l: "Prix net", r: true },
                    { l: "Exemple", r: true },
                  ].map(({ l, r }) => (
                    <th
                      key={l}
                      style={{
                        padding: "9px 0", fontWeight: 500, fontSize: 8,
                        letterSpacing: "0.22em", textTransform: "uppercase",
                        color: "#8a7a5a", textAlign: r ? "right" : "left",
                      }}
                    >
                      {l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRO_TIERS.map((tier, i) => {
                  const example = quote(tier.minKg);
                  return (
                    <tr
                      key={tier.id}
                      style={{
                        borderBottom: "1px solid #f0ece3",
                        backgroundColor: i % 2 === 0 ? "#fdfcf9" : "transparent",
                      }}
                    >
                      <td style={{ padding: "11px 0", fontFamily: "Georgia, serif", fontSize: 14 }}>{tier.label.fr}</td>
                      <td style={{ padding: "11px 0", textAlign: "right", color: GOLD, fontWeight: 700, fontFamily: "Georgia, serif", fontSize: 14 }}>
                        {formatTierPrice(tier)}
                      </td>
                      <td style={{ padding: "11px 0", textAlign: "right", color: "#4a4a4a" }}>
                        {example ? `${formatKg(example.kg)} = ${formatEurosLocale(example.totalCents)}` : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ fontSize: 10, color: "#4a4a4a", marginTop: 10, lineHeight: 1.65 }}>
              {PRO_TAX_MENTION.fr}. Le prix du palier atteint s'applique à toute la quantité commandée.
            </div>
          </div>

          {/* Offre en stock */}
          <div style={{ backgroundColor: DARK, borderRadius: 2, padding: "26px 30px", color: "white" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, alignItems: "start" }}>
              <div>
                <div style={{ fontSize: 8, letterSpacing: "0.38em", textTransform: "uppercase", color: GOLD, marginBottom: 11 }}>
                  En stock en France
                </div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 300, lineHeight: 1.35, marginBottom: 14 }}>
                  {PRO_STOCK_KG} kg disponibles, entières et équeutées
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", lineHeight: 1.75 }}>
                  Morilles sauvages du Canada, séchées, variétés mélangées.
                  Expédition sous {PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés, en colis suivi.
                </div>
              </div>
              <div>
                <div style={{ fontSize: 8, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 11 }}>
                  Échantillon offert
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: 12 }}>
                  Un pot de {PRO_SAMPLE_GRAMS} g par établissement, pour goûter avant de commander.
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", lineHeight: 1.75 }}>
                  Devis et échantillon : <strong style={{ color: GOLD }}>morillesducanada.com/professionnels</strong>
                  <br />
                  Téléphone : <strong style={{ color: GOLD }}>07 82 16 27 08</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          PAGE 4 — ÉPICERIES FINES & CAVISTES
      ═══════════════════════════════════════════════ */}
      <div
        className="page"
        style={{ minHeight: "297mm", backgroundColor: CREAM, color: DARK, display: "flex", flexDirection: "column" }}
      >
        {band("Morilles du Canada · Épiceries fines & Cavistes")}

        <div style={{ flex: 1, padding: "40px 56px" }}>
          {/* Header with jars image */}
          <div style={{ display: "grid", gridTemplateColumns: "185px 1fr", gap: 32, marginBottom: 34, alignItems: "start" }}>
            <img
              src={heroJars}
              alt="Pots de morilles de feu du Canada"
              style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 2 }}
            />
            <div>
              <div style={{ fontSize: 8, letterSpacing: "0.38em", textTransform: "uppercase", color: GOLD, marginBottom: 13 }}>
                Gamme pots verre premium
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 300, lineHeight: 1.25, marginBottom: 16 }}>
                Un produit qui se vend<br />en se racontant
              </div>
              <div style={{ fontSize: 11, color: "#4a4a4a", lineHeight: 1.85 }}>
                Nos pots verre bouchon or s'imposent en rayon sans avoir besoin d'être poussés.
                L'histoire — trois saisons de cueillette au Canada, sourcing direct, séchage artisanal —
                est sur l'étiquette et dans la bouche du vendeur.
                Les amateurs de produits rares les reconnaissent immédiatement. Les chefs amateurs les offrent.
              </div>
            </div>
          </div>

          {/* Jar pricing table */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD, marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${GOLD}28` }}>
              Gamme pots verre — Prix publics (site morillesducanada.com)
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${GOLD}22`, textAlign: "left" }}>
                  {[
                    { l: "Référence", r: false },
                    { l: "Format", r: false },
                    { l: "Usage", r: false },
                    { l: "Prix public", r: true },
                  ].map(({ l, r }) => (
                    <th
                      key={l}
                      style={{
                        padding: "9px 0", fontWeight: 500, fontSize: 8,
                        letterSpacing: "0.22em", textTransform: "uppercase",
                        color: "#8a7a5a", textAlign: r ? "right" : "left",
                      }}
                    >
                      {l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { ref: "MDF-12G", name: "Découverte 12g", usage: "Vente d'impulsion · Offrir · Tester", price: 12 },
                  { ref: "MDF-30G", name: "Classique 30g", usage: "Format cœur de gamme · Usage cuisine", price: 23 },
                  { ref: "MDF-45G", name: "Prestige 45g", usage: "Cadeau premium · Coffret gastronomique", price: 29 },
                ].map((p, i) => (
                  <tr
                    key={p.ref}
                    style={{
                      borderBottom: "1px solid #f0ece3",
                      backgroundColor: i % 2 === 0 ? "#fdfcf9" : "transparent",
                    }}
                  >
                    <td style={{ padding: "11px 0", fontFamily: "monospace", fontSize: 9, color: "#8a7a5a" }}>{p.ref}</td>
                    <td style={{ padding: "11px 0", fontFamily: "Georgia, serif", fontSize: 13 }}>{p.name}</td>
                    <td style={{ padding: "11px 0", fontSize: 9, color: "#8a7a5a" }}>{p.usage}</td>
                    <td style={{ padding: "11px 0", textAlign: "right", fontWeight: 700, color: GOLD, fontFamily: "Georgia, serif" }}>
                      {p.price},00 €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontSize: 8, color: "#8a7a5a", marginTop: 8, lineHeight: 1.65 }}>
              {PRO_TAX_MENTION.fr}. Prix publics de vente sur morillesducanada.com.
              Tarif revendeur et conditions de référencement sur devis.
            </div>
          </div>

          {/* 4 selling arguments for épiceries */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
            {[
              {
                t: "Storytelling clé en main",
                d: "Chaque pot porte l'étiquette avec territoire, variété, mode de séchage. Vos vendeurs ont tout pour argumenter sans effort de formation.",
              },
              {
                t: "Gamme 3 formats cohérente",
                d: "12g, 30g et 45g couvrent impulsion, usage courant et coffret. Un seul fournisseur pour tout le rayon morilles.",
              },
              {
                t: "Packaging premium identifiable",
                d: "Pot verre, bouchon or mat, étiquette sobre et précise. S'intègre dans un rayon épicerie fine ou truffes sans détonner.",
              },
              {
                t: "Rareté réelle, pas marketing",
                d: "4 à 6 semaines de cueillette par an, stock limité. Ce n'est pas un argument inventé — c'est le calendrier de la forêt brûlée canadienne.",
              },
            ].map((a) => (
              <div
                key={a.t}
                style={{ backgroundColor: "#f5f2eb", padding: "14px 18px", borderRadius: 2, borderLeft: `2px solid ${GOLD}60` }}
              >
                <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 6, color: DARK }}>{a.t}</div>
                <div style={{ fontSize: 10, color: "#6a6a6a", lineHeight: 1.65 }}>{a.d}</div>
              </div>
            ))}
          </div>

          {/* Fireweed landscape strip */}
          <div style={{ borderRadius: 2, overflow: "hidden", height: 72, position: "relative" }}>
            <img
              src={landscapeFireweed}
              alt="Forêt de Colombie-Britannique"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%" }}
            />
            <div
              style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to right, rgba(26,22,18,0.75), rgba(26,22,18,0.3))",
                display: "flex", alignItems: "center", padding: "0 26px",
              }}
            >
              <div style={{ fontFamily: "Georgia, serif", fontSize: 14, fontStyle: "italic", color: "white", fontWeight: 300 }}>
                « Du sol brûlé à votre rayon — la chaîne est courte et transparente. »
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          PAGE 5 — CONTACT & COMMANDER
      ═══════════════════════════════════════════════ */}
      <div
        className="page"
        style={{
          minHeight: "297mm", backgroundColor: DARK,
          color: "white", display: "flex", flexDirection: "column",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Background morilles */}
        <img
          src={heroMorels}
          alt=""
          aria-hidden
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "55%",
            width: "100%", objectFit: "cover", objectPosition: "center 30%", opacity: 0.28,
          }}
        />
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "65%",
            background: "linear-gradient(to bottom, rgba(26,22,18,0.1) 0%, rgba(26,22,18,0.9) 80%, #1a1612 100%)",
          }}
        />

        <div
          className="relative"
          style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 56px 44px", minHeight: "297mm" }}
        >
          {/* Logo top */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={logo} alt="Morilles du Canada" style={{ height: 38, width: "auto" }} />
            <div style={{ fontSize: 8, letterSpacing: "0.35em", textTransform: "uppercase", color: GOLD }}>
              Morilles du Canada · Catalogue professionnel 2026
            </div>
          </div>

          {/* Center CTA */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.45em", textTransform: "uppercase", color: GOLD, marginBottom: 18 }}>
              Commander · S'approvisionner · Goûter
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 42, fontWeight: 300, lineHeight: 1.15, marginBottom: 14 }}>
              Travaillons ensemble
            </div>
            <div style={{ width: 52, height: 1, backgroundColor: GOLD, margin: "0 auto 26px" }} />
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", maxWidth: 400, margin: "0 auto", lineHeight: 1.85 }}>
              Un appel suffit pour un devis au kilo, une commande ou un échantillon.
              Valérian est votre interlocuteur unique.
            </div>
          </div>

          {/* Bottom contact block */}
          <div>
            {/* 3 contact points */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 36 }}>
              {[
                { label: "Téléphone", value: "07 82 16 27 08", sub: "Valérian · Fondateur" },
                { label: "Email", value: "contact@morillesducanada.com", sub: "Réponse personnelle de Valérian" },
                { label: "Devis & échantillon", value: "morillesducanada.com/professionnels", sub: "Tarifs au kilo · Échantillon offert" },
              ].map((c) => (
                <div key={c.label} style={{ borderTop: `1px solid ${GOLD}38`, paddingTop: 16 }}>
                  <div style={{ fontSize: 8, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, marginBottom: 9 }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>{c.value}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", marginTop: 5 }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Process steps */}
            <div style={{ borderTop: `1px solid rgba(201,168,76,0.18)`, paddingTop: 22, marginBottom: 28 }}>
              <div style={{ fontSize: 8, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>
                Comment commander
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                {[
                  { n: "1", t: "Contactez-nous", d: "Téléphone ou email" },
                  { n: "2", t: "Devis", d: "Prix net selon la grille" },
                  { n: "3", t: "Paiement", d: "Virement ou CB en ligne" },
                  { n: "4", t: "Expédition", d: `Sous ${PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés · Colis suivi` },
                ].map((s) => (
                  <div key={s.n} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: GOLD, marginBottom: 8, opacity: 0.65 }}>{s.n}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 5 }}>{s.t}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.38)" }}>{s.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions */}
            <div
              style={{
                padding: "14px 20px", border: `1px solid ${GOLD}22`,
                borderRadius: 2, marginBottom: 24, fontSize: 9, color: "rgba(255,255,255,0.45)", lineHeight: 1.7,
              }}
            >
              {PRO_TAX_MENTION.fr} · Expédition sous {PRO_SHIPPING_BUSINESS_DAYS} jours ouvrés ·
              Paiement par virement ou carte bancaire · Livraison France et Europe.
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
                © 2026 Morilles du Canada · Colombie-Britannique &amp; Yukon, Canada
              </div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
                Document professionnel · Usage confidentiel · morillesducanada.com
              </div>
              <div style={{ fontSize: 8, color: GOLD, letterSpacing: "0.1em" }}>
                <a
                  href="/fiche-technique"
                  style={{ color: GOLD, textDecoration: "none" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fiche technique produit →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <style>{`
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; margin: 0; }
        .print\\:hidden { display: none !important; }
        @page { size: A4 portrait; margin: 0; }
        .page { page-break-after: always; break-after: page; }
        .page:last-of-type { page-break-after: avoid; break-after: avoid; }
        .relative { position: relative; }
      }
      @media screen {
        .page { margin-bottom: 24px; box-shadow: 0 4px 28px rgba(0,0,0,0.22); }
      }
    `}</style>
  </div>
);

export default PlaquettePro;
