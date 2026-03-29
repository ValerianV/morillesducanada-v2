import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
  blur?: boolean;
  scale?: boolean;
  stagger?: boolean;
}

const directionOffset = {
  up: { y: 50 },
  down: { y: -50 },
  left: { x: 60 },
  right: { x: -60 },
  none: {},
};

const ScrollReveal = ({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.7,
  once = true,
  blur = false,
  scale = false,
}: ScrollRevealProps) => {
  const offset = directionOffset[direction];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...offset,
      ...(scale ? { scale: 0.92 } : {}),
    },
    visible: {
      opacity: 1,
      ...("x" in offset ? { x: 0 } : {}),
      ...("y" in offset ? { y: 0 } : {}),
      ...(scale ? { scale: 1 } : {}),
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
