import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/i18n/context";
import { getRandomPhotos, type GalleryPhoto } from "@/lib/galleryPhotos";

const DISPLAY_COUNT = 6;

const GallerySection = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const { t } = useI18n();

  // Random selection on each mount / page refresh
  const photos: GalleryPhoto[] = useMemo(() => getRandomPhotos(DISPLAY_COUNT), []);

  return (
    <section id="galerie" className="py-24 md:py-32 overflow-x-hidden">
      <div className="container mx-auto px-6">
        <ScrollReveal blur>
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-4">{t("gallery.label")}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light">
              {t("gallery.title")} <span className="italic text-gradient-gold">{t("gallery.titleHighlight")}</span>
            </h2>
            <div className="divider-gold w-24 mx-auto mt-8" />
            <p className="text-secondary-foreground/70 font-light mt-6 max-w-xl mx-auto">{t("gallery.description")}</p>
          </div>
        </ScrollReveal>

        <div className="columns-1 sm:columns-2 md:columns-3 gap-3 md:gap-4 max-w-5xl mx-auto">
          {photos.map((photo, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              className="mb-3 md:mb-4 break-inside-avoid group relative overflow-hidden rounded-sm cursor-pointer"
              onClick={() => setSelectedPhoto(i)}
            >
              <img src={photo.src} alt={photo.alt} title={photo.title} loading={i < 2 ? "eager" : "lazy"} decoding="async" className="w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <motion.div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
              <motion.p className="absolute bottom-3 left-3 right-3 text-xs font-light text-foreground/90" initial={{ opacity: 0, y: 10 }} whileHover={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>{photo.title}</motion.p>
            </motion.div>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center mt-12">
            <Link
              to="/galerie"
              className="inline-flex items-center gap-2 px-8 py-3 border border-primary/30 text-primary hover:bg-primary/10 rounded-sm transition-all duration-300 font-light tracking-wide text-sm"
            >
              Voir toute la galerie
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div className="fixed inset-0 z-50 bg-background/95 supports-backdrop:backdrop-blur-md flex items-center justify-center p-6 cursor-pointer safari-safe-layer"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.img src={photos[selectedPhoto].src} alt={photos[selectedPhoto].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-sm"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.p className="absolute bottom-8 text-sm text-muted-foreground font-light"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >{photos[selectedPhoto].alt}</motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
