"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

interface FadeInViewProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const offsets: Record<string, { x: number; y: number }> = {
  up: { x: 0, y: 20 },
  down: { x: 0, y: -20 },
  left: { x: 20, y: 0 },
  right: { x: -20, y: 0 },
  none: { x: 0, y: 0 },
};

export function FadeInView({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
  threshold = 0.05,
}: FadeInViewProps) {
  const { x, y } = offsets[direction];

  const variants: Variants = {
    hidden: { opacity: 0, x, y, willChange: "opacity, transform" },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      willChange: "auto",
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold, margin: "100px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
