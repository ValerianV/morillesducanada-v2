import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string; // e.g. "100%", "3-4", "0"
  className?: string;
}

const AnimatedCounter = ({ value, className }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayed, setDisplayed] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    // Parse numeric part
    const match = value.match(/^(\d+)/);
    if (!match) {
      setDisplayed(value);
      return;
    }

    const target = parseInt(match[1], 10);
    const suffix = value.slice(match[1].length); // e.g. "%" or "-4"

    if (target === 0) {
      setDisplayed(value);
      return;
    }

    const steps = Math.min(target, 40);
    const stepDuration = 800 / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += Math.ceil(target / steps);
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setDisplayed(`${current}${suffix}`);
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {displayed}
    </motion.span>
  );
};

export default AnimatedCounter;
