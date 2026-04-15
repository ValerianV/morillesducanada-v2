import { useRef } from "react";
import { Download } from "lucide-react";
import logo from "@/assets/logo.webp";

const VAT_RATE = 0.055; // 5.5% for food products in France

// Prix TTC du site convertis en HT (÷ 1.055 pour TVA 5.5%)
const productsHT = [
  { name: "Morilles de feu séchées — Pot 12g", ref: "MDF-12G", unitHT: 9.48, format: "Pot verre 12g" },
  { name: "Morilles de feu séchées — Pot 30g", ref: "MDF-30G", unitHT: 18.96, format: "Pot verre 30g" },
  { name: "Morilles de feu séchées — Pot 45g", ref: "MDF-45G", unitHT: 23.70, format: "Pot verre 45g" },
  { name: "Morilles de feu séchées — Sous vide 100g", ref: "MDF-SV100", unitHT: 42.65, format: "Sachet sous vide 100g" },
  { name: "Morilles de feu séchées — Sous vide 200g", ref: "MDF-SV200", unitHT: 85.31, format: "Sachet sous vide 200g" },
  { name: "Morilles de feu séchées — Sous vide 500g", ref: "MDF-SV500", unitHT: 189.57, format: "Sachet sous vide 500g" },
  { name: "Morilles de feu séchées — Sous vide 1kg", ref: "MDF-SV1K", unitHT: 379.15, format: "Sachet sous vide 1kg" },
];

const preorderOptions = [
  { type: "Morilles brunes", desc: "Arôme fumé intense, notes profondes et boisées, reflets jaunes. Variétés : M. conica, M. brunnea, M. snyderi.", priceKg: 350 },
  { type: "Morilles blondes", desc: "Plus douces, arôme délicat et subtil. Variétés : M. americana, M. esculenta, M. prava.", priceKg: 350 },
];

const PlaquettePro = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print button - hidden on print */}
      <div className="fixed top-6 right-6 z-50 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-[#1a1612] text-[#c9a84c] font-medium text-sm tracking-wider uppercase rounded hover:bg-[#2a2218] transition-colors shadow-lg"
        >
          <Download className="w-4 h-4" />
          Télécharger / Imprimer
        </button>
      </div>

      <div ref={printRef} className="max-w-[210mm] mx-auto bg-white text-[#1a1612] print:max-w-none">
        {/* Page 1: Cover + Products */}
        <div className="p-10 md:p-16 print:p-12">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#c9a84c] pb-8 mb-10">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Morilles du Canada" className="h-14 w-auto" />
              <div>
                <h1 className="text-2xl font-serif font-semibold tracking-wide text-[#1a1612]">Morilles du Canada</h1>
                <p className="text-xs tracking-[0.25em] uppercase text-[#8a7a5a] mt-0.5">Morilles de feu sauvages · Colombie-Britannique & Yukon</p>
              </div>
            </div>
            <div className="text-right text-xs text-[#6a6a6a]">
              <p>Catalogue professionnel</p>
              <p className="font-medium text-[#1a1612]">Saison 2026</p>
            </div>
          </div>

          {/* Intro */}
          <div className="mb-10">
            <h2 className="text-xl font-serif mb-3 text-[#1a1612]">Un produit d'exception pour les professionnels de la gastronomie</h2>
            <p className="text-sm leading-relaxed text-[#4a4a4a] max-w-[600px]">
              Nos morilles de feu sont récoltées à la main dans les forêts boréales calcinées du Canada. Achetées directement aux cueilleurs le soir même, séchées le jour de la récolte dans un séchoir professionnel sur place. Sans queue, sans traitement chimique, sans intermédiaire. Un circuit ultra-court qui garantit une <strong>fraîcheur et une traçabilité totales</strong>.
            </p>
          </div>

          {/* Key differentiators */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { title: "Séchées le jour J", desc: "Achat en forêt chaque soir, séchage professionnel immédiat" },
              { title: "Circuit ultra-court", desc: "3 cueilleurs de confiance, pas de grossiste ni de distributeur" },
              { title: "100% sauvages", desc: "Aucun pesticide, aucune culture. Variétés rares de feu" },
            ].map((item) => (
              <div key={item.title} className="bg-[#faf8f3] border border-[#e8e0cc] p-4 rounded">
                <h4 className="font-semibold text-sm text-[#1a1612] mb-1">{item.title}</h4>
                <p className="text-xs text-[#6a6a6a] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Products table */}
          <h3 className="text-lg font-serif mb-4 text-[#1a1612] border-b border-[#e8e0cc] pb-2">Tarifs détail — Prix HT</h3>
          <table className="w-full text-sm mb-10">
            <thead>
              <tr className="border-b border-[#c9a84c]/40 text-left">
                <th className="py-3 font-medium text-xs tracking-wider uppercase text-[#8a7a5a]">Référence</th>
                <th className="py-3 font-medium text-xs tracking-wider uppercase text-[#8a7a5a]">Produit</th>
                <th className="py-3 font-medium text-xs tracking-wider uppercase text-[#8a7a5a]">Conditionnement</th>
                <th className="py-3 font-medium text-xs tracking-wider uppercase text-[#8a7a5a] text-right">Prix HT</th>
                <th className="py-3 font-medium text-xs tracking-wider uppercase text-[#8a7a5a] text-right">Prix TTC*</th>
              </tr>
            </thead>
            <tbody>
              {productsHT.map((p, i) => {
                const ttc = (p.unitHT * (1 + VAT_RATE)).toFixed(2);
                return (
                  <tr key={p.ref} className={`border-b border-[#f0ece3] ${i % 2 === 0 ? "bg-[#fdfcf9]" : ""}`}>
                    <td className="py-3 font-mono text-xs text-[#8a7a5a]">{p.ref}</td>
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-[#6a6a6a]">{p.format}</td>
                    <td className="py-3 text-right font-semibold">{p.unitHT.toFixed(2)} €</td>
                    <td className="py-3 text-right text-[#6a6a6a]">{ttc} €</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-[#8a7a5a] mb-2">* TVA applicable : 5,5% (produits alimentaires). Prix en euros, hors frais de livraison.</p>
          <p className="text-xs text-[#8a7a5a] mb-10">Formats sous vide au-delà de 500g : tarif dégressif à 400 €/kg HT. En dessous de 500g : 450 €/kg HT.</p>

          {/* Pre-order section */}
          <div className="page-break-before print:break-before-page">
            <h3 className="text-lg font-serif mb-4 text-[#1a1612] border-b border-[#e8e0cc] pb-2">Pré-commandes saison 2026 — Prix HT</h3>
            <p className="text-sm text-[#4a4a4a] mb-6 leading-relaxed">
              Réservez votre approvisionnement pour la saison de cueillette 2026 (juin-juillet). La récolte étant limitée et imprévisible, la pré-commande avec paiement intégral à l'avance est le seul moyen de <strong>garantir votre stock</strong>. Vous bénéficiez d'une priorité de livraison et d'un lot garanti.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {preorderOptions.map((opt) => (
                <div key={opt.type} className="border-2 border-[#c9a84c]/30 rounded p-6 bg-[#fdfcf9]">
                  <h4 className="font-serif text-lg font-semibold text-[#1a1612] mb-2">{opt.type}</h4>
                  <p className="text-xs text-[#6a6a6a] leading-relaxed mb-4">{opt.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif font-bold text-[#c9a84c]">{opt.priceKg}</span>
                    <span className="text-sm text-[#8a7a5a]">€/kg HT</span>
                  </div>
                  <p className="text-xs text-[#8a7a5a] mt-1">Soit {(opt.priceKg * (1 + VAT_RATE)).toFixed(2)} €/kg TTC</p>
                  <p className="text-xs text-[#8a7a5a] mt-2">Minimum : 0,5 kg · Pas de maximum</p>
                </div>
              ))}
            </div>

            {/* Morel varieties info */}
            <div className="bg-[#faf8f3] border border-[#e8e0cc] p-6 rounded mb-8">
              <h4 className="font-semibold text-sm mb-2 text-[#1a1612]">Les morilles de feu — un produit unique au monde</h4>
              <p className="text-xs text-[#4a4a4a] leading-relaxed mb-3">
                Nos morilles poussent exclusivement sur les sols calcinés des forêts boréales canadiennes, le printemps suivant un incendie. 
                Elles développent un arôme fumé et boisé impossible à reproduire en culture. On distingue deux grandes familles selon la couleur :
              </p>
              <ul className="text-xs text-[#4a4a4a] leading-relaxed space-y-1">
                <li>• <strong>Morilles brunes</strong> : M. conica, M. brunnea, M. snyderi — arôme puissant, notes fumées profondes, reflets jaunes</li>
                <li>• <strong>Morilles blondes</strong> : M. americana, M. esculenta, M. prava — arôme plus doux et délicat</li>
                <li>• <strong>Morilles grises</strong> : M. tomentosa — surface veloutée à poils fins, notes fumées douces</li>
                <li>• <strong>Morilles vertes</strong> : M. sextelata, M. septimelata — espèces rares de haute altitude, arôme profond</li>
              </ul>
              <p className="text-xs text-[#4a4a4a] leading-relaxed mt-3">
                Toutes sont vendues séchées, sans queue, sans traitement chimique. Elles se conservent 2 ans minimum en conditions sèches et triplent de volume à la réhydratation.
              </p>
            </div>

            {/* Process / Trust */}
            <h3 className="text-lg font-serif mb-4 text-[#1a1612] border-b border-[#e8e0cc] pb-2">Notre engagement qualité</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-10 text-sm">
              {[
                { title: "Achat direct aux cueilleurs", desc: "3 cueilleurs de confiance, amis et partenaires de longue date de Valérian. Pas de grossiste, pas de distributeur." },
                { title: "Séchage professionnel le jour J", desc: "Les morilles sont achetées en forêt chaque soir et immédiatement séchées dans un séchoir professionnel sur place." },
                { title: "Traçabilité complète", desc: "Chaque lot est tracé du cueilleur au client final. Nous connaissons personnellement chaque personne de la chaîne." },
                { title: "Approvisionnement garanti", desc: "Les pré-commandes sont honorées en priorité. En cas d'annulation de saison (météo), remboursement intégral garanti." },
              ].map((item) => (
                <div key={item.title}>
                  <h4 className="font-semibold text-[#1a1612] mb-1">{item.title}</h4>
                  <p className="text-xs text-[#6a6a6a] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="border-t-2 border-[#c9a84c] pt-8 mt-10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#1a1612] mb-2">Commander ou pré-commander</h3>
                  <p className="text-sm text-[#4a4a4a] mb-4 max-w-md">
                    Pour passer commande, demander un devis personnalisé ou réserver votre lot pour la saison 2026, contactez-nous directement.
                  </p>
                  <div className="space-y-1 text-sm text-[#4a4a4a]">
                    <p>📧 <strong>contact@morillesducanada.com</strong></p>
                    <p>🌐 <strong>morillesducanada.com</strong></p>
                    <p>📞 Sur demande</p>
                  </div>
                </div>
                <div className="text-right text-xs text-[#8a7a5a]">
                  <p className="mb-1">Morilles du Canada</p>
                  <p>Valérian · Fondateur</p>
                  <p className="mt-3 italic">« Du sol brûlé à votre assiette,</p>
                  <p className="italic">la chaîne est courte et transparente. »</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default PlaquettePro;
