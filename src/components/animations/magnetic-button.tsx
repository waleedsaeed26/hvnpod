"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  as?: "button" | "a";
}

const springConfig = { damping: 15, stiffness: 300, mass: 0.5 };

export function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  as = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  function handleMouseMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    const maxOffset = 8;
    x.set(Math.max(-maxOffset, Math.min(maxOffset, distX * 0.3)));
    y.set(Math.max(-maxOffset, Math.min(maxOffset, distY * 0.3)));
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const Component = as === "a" ? motion.a : motion.button;

  return (
    <Component
      ref={ref as never}
      href={as === "a" ? href : undefined}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y, willChange: "transform" }}
      className={`inline-block ${className}`}
    >
      {children}
    </Component>
  );
}
