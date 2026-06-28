"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export type AnimationVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "zoom-out"
  | "fade";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: AnimationVariant;
  margin?: string;
  once?: boolean;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  variant = "fade-up",
  margin = "-80px",
  once = true,
}: AnimatedSectionProps) {
  // Define variant configurations
  const getVariants = () => {
    switch (variant) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
      case "fade-down":
        return {
          initial: { opacity: 0, y: -40 },
          animate: { opacity: 1, y: 0 },
        };
      case "fade-left":
        return {
          initial: { opacity: 0, x: 40 },
          animate: { opacity: 1, x: 0 },
        };
      case "fade-right":
        return {
          initial: { opacity: 0, x: -40 },
          animate: { opacity: 1, x: 0 },
        };
      case "zoom-in":
        return {
          initial: { opacity: 0, scale: 0.92 },
          animate: { opacity: 1, scale: 1 },
        };
      case "zoom-out":
        return {
          initial: { opacity: 0, scale: 1.08 },
          animate: { opacity: 1, scale: 1 },
        };
      case "fade-up":
      default:
        return {
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
        };
    }
  };

  const anim = getVariants();

  return (
    <motion.div
      initial={anim.initial}
      whileInView={anim.animate}
      viewport={{ once, margin }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo ease curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
