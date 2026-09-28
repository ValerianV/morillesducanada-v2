// Galerie : sélection de 20 photos terrain (audit PM, 2026-09-28). Les autres fichiers de
// src/assets/morels restent dans le dépôt mais ne sont plus affichés.
import morelsGolden from "@/assets/morels/morels-group-golden.webp";
import morelsTrio from "@/assets/morels/morels-trio-dark.webp";
import morelsCluster from "@/assets/morels/morels-cluster-charcoal.webp";
import morelBurnedLog from "@/assets/morels/morel-burned-log.webp";
import morelTallGreen from "@/assets/morels/morel-tall-green.webp";
import morilleSolBrule from "@/assets/morels/morille-sol-brule-ciel.webp";
import morilleCharbon from "@/assets/morels/morille-charbon-vegetation.webp";
import morilleChampignons from "@/assets/morels/morille-champignons-oranges.webp";
import morilleDoreeCharbonForet from "@/assets/morels/morille-doree-charbon-foret.webp";
import morilleVerticaleForetBrulee from "@/assets/morels/morille-verticale-foret-brulee.webp";
import morillesNoiresTroncBrule from "@/assets/morels/morilles-noires-tronc-brule.webp";
import morilleBrunePiedArbreBrule from "@/assets/morels/morille-brune-pied-arbre-brule.webp";
import trioMorillesLumiereSoir from "@/assets/morels/trio-morilles-lumiere-soir.webp";
import caissesRecolteMorillesCanada from "@/assets/morels/caisses-recolte-morilles-canada.webp";
import caisseVerteMorillesFraiches from "@/assets/morels/caisse-verte-morilles-fraiches.webp";
import morilleNoireJeunePluie from "@/assets/morels/morille-noire-jeune-pluie.webp";
import groupeMorillesNoiresTranslucides from "@/assets/morels/groupe-morilles-noires-translucides.webp";
import morilleBruneSolNoir from "@/assets/morels/morille-brune-sol-noir.webp";
import morilleBruneCharbonMacro from "@/assets/morels/morille-brune-charbon-macro.webp";
import trioMorillesGrisesVerticales from "@/assets/morels/trio-morilles-grises-verticales.webp";

export interface GalleryPhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  titleEn: string;
}

export const galleryPhotos: GalleryPhoto[] = [
  { src: morelsGolden, width: 600, height: 338, alt: "Groupe de morilles dorées sur sol brûlé en Colombie-Britannique", title: "Morilles dorées", titleEn: "Golden morels" },
  { src: morelsTrio, width: 600, height: 1067, alt: "Trio de morilles noires sur lit d'aiguilles de pin après feu de forêt", title: "Trio de morilles", titleEn: "Trio of morels" },
  { src: morelsCluster, width: 600, height: 338, alt: "Grappe de morilles sauvages sur charbon de bois au Yukon", title: "Grappe sur charbon", titleEn: "Cluster on charcoal" },
  { src: morelBurnedLog, width: 600, height: 800, alt: "Morille de feu poussant près d'un tronc brûlé en Colombie-Britannique", title: "Morille près d'un tronc", titleEn: "Morel by a burned log" },
  { src: morelTallGreen, width: 600, height: 1067, alt: "Grande morille noire entourée de verdure dans une forêt du Yukon", title: "Morille en verdure", titleEn: "Morel among greenery" },
  { src: morilleSolBrule, width: 600, height: 1067, alt: "Morille sur sol brûlé avec ciel bleu et forêt en arrière-plan au Canada", title: "Morille et ciel bleu", titleEn: "Morel and blue sky" },
  { src: morilleCharbon, width: 600, height: 338, alt: "Morille dorée sur charbon de bois entourée de feuillage naissant", title: "Charbon et feuillage", titleEn: "Charcoal and new leaves" },
  { src: morilleChampignons, width: 600, height: 338, alt: "Morille sauvage entourée de petits champignons oranges sur sol carbonisé", title: "Morille et champignons", titleEn: "Morel and orange mushrooms" },
  { src: morilleDoreeCharbonForet, width: 600, height: 338, alt: "Morille dorée isolée sur charbon et mousse dans une forêt brûlée du Canada", title: "Morille dorée sur charbon", titleEn: "Golden morel on charcoal" },
  { src: morilleVerticaleForetBrulee, width: 600, height: 1067, alt: "Morille brune dressée au cœur d'une forêt brûlée en régénération", title: "Morille dressée", titleEn: "Upright morel" },
  { src: morillesNoiresTroncBrule, width: 600, height: 1067, alt: "Deux morilles noires près d'un tronc calciné en forêt canadienne", title: "Morilles noires et tronc", titleEn: "Black morels by a burned trunk" },
  { src: morilleBrunePiedArbreBrule, width: 600, height: 338, alt: "Morille brune adossée à un arbre brûlé, en lumière naturelle", title: "Morille près de l'écorce", titleEn: "Morel against burned bark" },
  { src: trioMorillesLumiereSoir, width: 600, height: 1067, alt: "Trio de morilles dorées au soleil du soir sur sol forestier brûlé", title: "Trio de morilles dorées", titleEn: "Golden morels in evening light" },
  { src: caissesRecolteMorillesCanada, width: 600, height: 338, alt: "Cinq caisses de récolte remplies de morilles fraîches dans l'herbe", title: "Caisses de récolte", titleEn: "Harvest crates" },
  { src: caisseVerteMorillesFraiches, width: 600, height: 338, alt: "Caisse verte pleine de morilles fraîches triées après cueillette", title: "Caisse de morilles fraîches", titleEn: "Crate of fresh morels" },
  { src: morilleNoireJeunePluie, width: 600, height: 1067, alt: "Jeune morille noire sur tapis d'aiguilles dans une forêt humide", title: "Jeune morille noire", titleEn: "Young black morel" },
  { src: groupeMorillesNoiresTranslucides, width: 600, height: 1067, alt: "Groupe de morilles noires translucides en forêt brûlée", title: "Morilles noires translucides", titleEn: "Translucent black morels" },
  { src: morilleBruneSolNoir, width: 600, height: 1067, alt: "Morille brune sur sol noir carbonisé en forêt boréale", title: "Morille sur sol noir", titleEn: "Morel on black soil" },
  { src: morilleBruneCharbonMacro, width: 600, height: 1067, alt: "Gros plan macro d'une morille brune sur charbon de bois", title: "Macro morille brune", titleEn: "Brown morel, close-up" },
  { src: trioMorillesGrisesVerticales, width: 600, height: 1067, alt: "Trio de morilles grises dressées sur sol noir post-incendie", title: "Trois morilles grises dressées", titleEn: "Three grey morels" },
];

/** Returns `count` random photos from the gallery (Fisher-Yates shuffle) */
export function getRandomPhotos(count: number): GalleryPhoto[] {
  const shuffled = [...galleryPhotos];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
