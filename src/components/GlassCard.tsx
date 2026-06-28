"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
}: CardProps) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -8,
              borderColor: "rgba(46, 80, 231, 0.4)",
              boxShadow: "0 20px 30px rgba(46, 80, 231, 0.06), 0 4px 12px rgba(0, 0, 0, 0.02)",
            }
          : undefined
      }
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`premium-card p-6 md:p-8 transition-colors duration-300 ${
        hover ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
