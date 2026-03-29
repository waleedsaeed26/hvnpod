"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useSpring } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glare?: boolean;
}

const springConfig = { damping: 20, stiffness: 300 };

export function TiltCard({
  children,
  className = "",
  tiltAmount = 6,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const glareX = useSpring(50, springConfig);
  const glareY = useSpring(50, springConfig);

  function handleMouseMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    rotateX.set((y - 0.5) * -tiltAmount * 2);
    rotateY.set((x - 0.5) * tiltAmount * 2);
    glareX.set(x * 100);
    glareY.set(y * 100);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        willChange: "transform",
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `radial-gradient(600px circle at var(--gx) var(--gy), rgba(255,255,255,0.12), transparent 40%)`,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s",
          }}
          ref={(node) => {
            if (!node) return;
            const unsub1 = glareX.on("change", (v) =>
              node.style.setProperty("--gx", `${v}%`)
            );
            const unsub2 = glareY.on("change", (v) =>
              node.style.setProperty("--gy", `${v}%`)
            );
            return () => {
              unsub1();
              unsub2();
            };
          }}
        />
      )}
    </motion.div>
  );
}
