import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { galleryPhotos } from "@/lib/galleryPhotos";

const Galerie = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Galerie Photos de Morilles Sauvages | Morilles du Canada</title>
        <meta name="description" content="Découvrez nos plus belles photos de morilles sauvages cueillies en Colombie-Britannique et au Yukon. Morilles de feu, morilles noires et blondes dans leur habitat naturel." />
        <link rel="canonical" href="https://morillesducanada.lovable.app/galerie" />
        <meta property="og:title" content="Galerie Photos de Morilles Sauvages | Morilles du Canada" />
        <meta property="og:description" content="Photos authentiques de morilles sauvages cueillies dans les forêts brûlées du Canada." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://morillesducanada.lovable.app/galerie" />
      </Helmet>

      <Navbar />

      <main className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <ScrollReveal blur>
            <div className="mb-6">
              <Link to="/#galerie" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Retour à l'accueil
              </Link>
            </div>
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">Galerie</p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light">
                Nos morilles <span className="italic text-gradient-gold">en forêt</span>
              </h1>
              <div className="divider-gold w-24 mx-auto mt-8" />
              <p className="text-muted-foreground font-light mt-6 max-w-2xl mx-auto">
                Chaque photo témoigne de l'authenticité de notre cueillette sauvage dans les forêts brûlées de Colombie-Britannique et du Yukon. Des morilles de feu, rares et précieuses, capturées dans leur habitat naturel.
              </p>
            </div>
          </ScrollReveal>

          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 max-w-7xl mx-auto">
            {galleryPhotos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02, zIndex: 10 }}
                className="mb-3 md:mb-4 break-inside-avoid group relative overflow-hidden rounded-sm cursor-pointer"
                onClick={() => setSelectedPhoto(i)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  title={photo.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.p
                  className="absolute bottom-3 left-3 right-3 text-xs font-light text-foreground/90"
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {photo.title}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/95 supports-backdrop:backdrop-blur-md flex items-center justify-center p-6 cursor-pointer safari-safe-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Fermer"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              src={galleryPhotos[selectedPhoto].src}
              alt={galleryPhotos[selectedPhoto].alt}
              title={galleryPhotos[selectedPhoto].title}
              className="max-w-full max-h-[85vh] object-contain rounded-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.p
              className="absolute bottom-8 text-sm text-muted-foreground font-light"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {galleryPhotos[selectedPhoto].alt}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Galerie;
