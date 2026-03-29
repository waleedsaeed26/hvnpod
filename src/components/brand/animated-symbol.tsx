"use client";

import { motion } from "framer-motion";

interface AnimatedSymbolProps {
  size?: number;
  className?: string;
  animate?: boolean;
  color?: string;
  strokeWidth?: number;
}

const rings = [
  { x: 5, y: 5, width: 90, height: 90, rx: 22 },
  { x: 15, y: 15, width: 70, height: 70, rx: 18 },
  { x: 25, y: 25, width: 50, height: 50, rx: 14 },
  { x: 35, y: 35, width: 30, height: 30, rx: 10 },
];

function getPerimeter(w: number, h: number, rx: number) {
  // Approximate perimeter of a rounded rectangle
  const straight = 2 * (w - 2 * rx) + 2 * (h - 2 * rx);
  const corners = 2 * Math.PI * rx;
  return straight + corners;
}

export function AnimatedSymbol({
  size = 100,
  className = "",
  animate = false,
  color = "currentColor",
  strokeWidth = 2,
}: AnimatedSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {rings.map((ring, i) => {
        const perimeter = getPerimeter(ring.width, ring.height, ring.rx);
        const isInner = i === rings.length - 1;
        const sw = strokeWidth + i * 0.3; // inner rings slightly thicker

        return (
          <motion.rect
            key={i}
            x={ring.x}
            y={ring.y}
            width={ring.width}
            height={ring.height}
            rx={ring.rx}
            stroke={color}
            strokeWidth={sw}
            fill="none"
            strokeDasharray={perimeter}
            {...(animate
              ? {
                  initial: { strokeDashoffset: perimeter, opacity: 0 },
                  animate: { strokeDashoffset: 0, opacity: 1 },
                  transition: {
                    strokeDashoffset: {
                      duration: 0.5,
                      delay: i * 0.15,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    },
                    opacity: {
                      duration: 0.1,
                      delay: i * 0.15,
                    },
                  },
                }
              : {
                  initial: { strokeDashoffset: 0 },
                })}
          />
        );
      })}

      {/* Inner pod fill — appears after all rings are drawn */}
      <motion.rect
        x={rings[3].x}
        y={rings[3].y}
        width={rings[3].width}
        height={rings[3].height}
        rx={rings[3].rx}
        fill="var(--color-hvn-forest)"
        stroke="none"
        {...(animate
          ? {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: {
                duration: 0.4,
                delay: rings.length * 0.15 + 0.3,
                ease: "easeOut",
              },
            }
          : {
              initial: { opacity: 1 },
            })}
      />
    </svg>
  );
}
