import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImage from "@/assets/hero-jars.webp";
import { useI18n } from "@/i18n/context";

const HeroSection = () => {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent;
    setIsSafari(/Safari/i.test(ua) && !/Chrome|CriOS|Chromium|Android|Edg|FxiOS/i.test(ua));
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.5, 0.9]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={sectionRef} className="relative flex items-center justify-center overflow-hidden min-h-screen safari-safe-layer" style={{ WebkitBackfaceVisibility: "hidden" as any }}>
      <motion.div className="absolute inset-0 safari-safe-layer" style={isSafari ? undefined : { y: imageY, scale: imageScale, willChange: "transform", WebkitBackfaceVisibility: "hidden" as any }}>
        <img src={heroImage} alt="Morilles de feu séchées canadiennes" className="w-full h-full object-cover" fetchPriority="high" decoding="async" />
      </motion.div>
      <motion.div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background safari-safe-layer" style={isSafari ? undefined : { opacity: overlayOpacity }} />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
          />
        ))}
      </div>

      <motion.div className="relative z-10 container mx-auto px-4 sm:px-6 text-center max-w-4xl safari-safe-layer" style={isSafari ? undefined : { y: contentY, opacity: contentOpacity }}>
        <motion.p className="text-sm tracking-[0.4em] uppercase text-primary/80 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
        >{t("hero.subtitle")}</motion.p>

        <motion.h1 className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-6 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {t("hero.title")}
          <motion.span className="block text-gradient-gold italic mt-2"
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
          >{t("hero.titleHighlight")}</motion.span>
        </motion.h1>

        <motion.p className="text-lg md:text-xl text-foreground/90 font-light max-w-2xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >{t("hero.description")}</motion.p>

        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <motion.a href="#produits"
            className="px-10 py-4 bg-primary text-primary-foreground font-medium tracking-widest uppercase text-sm rounded-sm relative overflow-hidden group"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10">{t("hero.cta")}</span>
            <motion.div className="absolute inset-0 bg-gold-light" initial={{ x: "-100%" }} whileHover={{ x: "0%" }} transition={{ duration: 0.3 }} />
          </motion.a>
          <motion.a href="#origine"
            className="px-10 py-4 border border-primary/40 text-foreground font-light tracking-widest uppercase text-sm rounded-sm"
            whileHover={{ borderColor: "hsl(40 60% 50%)", color: "hsl(40 60% 50%)", scale: 1.03 }}
            whileTap={{ scale: 0.97 }} transition={{ duration: 0.3 }}
          >{t("hero.story")}</motion.a>
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <motion.div className="w-px h-16 bg-gradient-to-b from-primary/60 to-transparent mx-auto"
          animate={{ scaleY: [1, 0.6, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
