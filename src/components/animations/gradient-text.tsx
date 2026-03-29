"use client";

import { motion, useReducedMotion } from "framer-motion";

interface GradientTextProps {
  children: string;
  className?: string;
  from?: string;
  to?: string;
}

export function GradientText({
  children,
  className = "",
  from = "var(--color-hvn-silver)",
  to = "var(--color-hvn-pearl)",
}: GradientTextProps) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${from}, ${to}, ${from})`,
        backgroundSize: "200% 100%",
      }}
      animate={prefersReducedMotion ? {} : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={prefersReducedMotion ? { duration: 0 } : {
        duration: 6,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      {children}
    </motion.span>
  );
}
