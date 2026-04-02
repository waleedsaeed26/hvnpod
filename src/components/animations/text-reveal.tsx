"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface TextRevealProps {
  children: string;
  className?: string;
  mode?: "word" | "line";
}

export function TextReveal({
  children,
  className = "",
  mode = "word",
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.25"],
  });

  const segments =
    mode === "word"
      ? children.split(/\s+/).filter(Boolean)
      : children.split(/\n/).filter(Boolean);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <span className="flex flex-wrap">
        {segments.map((segment, i) => {
          const start = i / segments.length;
          const end = start + 1 / segments.length;

          return (
            <Word
              key={`${segment}-${i}`}
              progress={scrollYProgress}
              range={[start, end]}
              mode={mode}
            >
              {segment}
            </Word>
          );
        })}
      </span>
    </div>
  );
}

function Word({
  children,
  progress,
  range,
  mode,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  mode: "word" | "line";
}) {
  const opacity = useTransform(progress, range, [0.35, 1]);
  const y = useTransform(progress, range, [4, 0]);

  return (
    <motion.span
      style={{ opacity, y, willChange: "opacity, transform" }}
      className={mode === "word" ? "mr-[0.3em] inline-block" : "block"}
    >
      {children}
    </motion.span>
  );
}
