"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoverType, setHoverType] = useState<"default" | "link" | "image">(
    "default"
  );

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  useEffect(() => {
    // Only show on devices with fine pointer (no touch) and no reduced-motion preference
    const mq = window.matchMedia("(pointer: fine)");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches || prefersReducedMotion.matches) return;

    setIsVisible(true);
    document.body.classList.add("cursor-none");

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest("a, button, [role='button'], input, textarea, select, label");
      const img = target.closest("img, picture, video, [data-cursor='crosshair']");

      if (el) {
        setHoverType("link");
      } else if (img) {
        setHoverType("image");
      } else {
        setHoverType("default");
      }
    };

    const handleLeave = () => {
      mouseX.set(-100);
      mouseY.set(-100);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      document.body.classList.remove("cursor-none");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  const outerSize =
    hoverType === "link" ? 48 : hoverType === "image" ? 40 : 32;

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-hvn-cream"
        style={{
          x: mouseX,
          y: mouseY,
          width: 8,
          height: 8,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{
          x: springX,
          y: springY,
          width: outerSize,
          height: outerSize,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: outerSize,
          height: outerSize,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {hoverType === "image" ? (
          /* Crosshair mode */
          <svg
            width={outerSize}
            height={outerSize}
            viewBox="0 0 40 40"
            className="opacity-50"
          >
            {/* Top line */}
            <line
              x1="20"
              y1="4"
              x2="20"
              y2="14"
              stroke="var(--color-hvn-cream)"
              strokeWidth="1"
            />
            {/* Bottom line */}
            <line
              x1="20"
              y1="26"
              x2="20"
              y2="36"
              stroke="var(--color-hvn-cream)"
              strokeWidth="1"
            />
            {/* Left line */}
            <line
              x1="4"
              y1="20"
              x2="14"
              y2="20"
              stroke="var(--color-hvn-cream)"
              strokeWidth="1"
            />
            {/* Right line */}
            <line
              x1="26"
              y1="20"
              x2="36"
              y2="20"
              stroke="var(--color-hvn-cream)"
              strokeWidth="1"
            />
          </svg>
        ) : (
          /* Ring mode */
          <motion.div
            className="h-full w-full rounded-full"
            style={{
              border:
                hoverType === "link"
                  ? "1px solid var(--color-hvn-forest)"
                  : "1px solid var(--color-hvn-cream)",
              opacity: hoverType === "link" ? 0.6 : 0.4,
            }}
          />
        )}
      </motion.div>
    </>
  );
}
