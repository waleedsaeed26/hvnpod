"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
// Note: isPaused uses ref instead of state to avoid RAF callback recreation
import { Shield, Wind, Plug, Award, Clock } from "lucide-react";

const specs = [
  { icon: Shield, key: "acoustics", numericValue: 30, unit: "dB", suffix: " Acoustics" },
  { icon: Wind, key: "ventilation", numericValue: null, unit: "", suffix: "" },
  { icon: Plug, key: "plugPlay", numericValue: null, unit: "", suffix: "" },
  { icon: Award, key: "warranty", numericValue: 2, unit: "-Year", suffix: " Warranty" },
  { icon: Clock, key: "leadTime", numericValue: 3, unit: " Week", suffix: " Lead Time" },
];

function CountUp({
  target,
  prefix,
  suffix,
  isInView,
}: {
  target: number;
  prefix?: string;
  suffix: string;
  isInView: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, target]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function SpecItem({
  icon: Icon,
  label,
  index,
  numericValue,
  unit,
  suffix,
  isInView,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  index: number;
  numericValue: number | null;
  unit: string;
  suffix: string;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 20, scale: 0.95 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      }}
      className="flex items-center gap-3.5 px-6 py-4 rounded-xl whitespace-nowrap shrink-0
        bg-hvn-white ring-1 ring-hvn-black/[0.08]
        hover:ring-hvn-forest-light/30 hover:bg-hvn-white
        transition-all duration-300"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-hvn-forest-light/10">
        <Icon className="h-4 w-4 text-hvn-forest-light" />
      </div>
      <span className="text-sm font-medium text-hvn-black tracking-wide">
        {numericValue !== null ? (
          <span className="font-[family-name:var(--font-mono)]">
            <CountUp
              target={numericValue}
              suffix={`${unit}${suffix}`}
              isInView={isInView}
            />
          </span>
        ) : (
          label
        )}
      </span>
    </motion.div>
  );
}

export function SpecsBar() {
  const t = useTranslations("specs");
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const animationRef = useRef<number | null>(null);
  const scrollPos = useRef(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Duplicate items for seamless loop
  const duplicatedSpecs = useMemo(() => [...specs, ...specs], []);

  const doScroll = useCallback(() => {
    if (!scrollRef.current || isPausedRef.current) {
      animationRef.current = requestAnimationFrame(doScroll);
      return;
    }

    scrollPos.current += 0.5; // pixels per frame

    const el = scrollRef.current;
    const halfWidth = el.scrollWidth / 2;

    if (scrollPos.current >= halfWidth) {
      scrollPos.current = 0;
    }

    el.style.transform = `translateX(-${scrollPos.current}px)`;
    animationRef.current = requestAnimationFrame(doScroll);
  }, []);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;
    // Start marquee after stagger animations finish
    const timer = setTimeout(() => {
      animationRef.current = requestAnimationFrame(doScroll);
    }, specs.length * 100 + 600);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isInView, doScroll, prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      aria-label="Product specifications"
      className="py-16 bg-hvn-cream relative overflow-hidden"
    >
      {/* Subtle top/bottom border lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-hvn-black/[0.08] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-hvn-black/[0.08] to-transparent" />

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-hvn-cream to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-hvn-cream to-transparent z-10 pointer-events-none" />

      <div
        className="relative"
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
      >
        <div
          ref={scrollRef}
          className="flex gap-5 px-4 will-change-transform"
          style={{ width: "max-content" }}
        >
          {(prefersReducedMotion ? specs : duplicatedSpecs).map((spec, i) => (
            <SpecItem
              key={`${spec.key}-${i}`}
              icon={spec.icon}
              label={t(spec.key)}
              index={i < specs.length ? i : 0}
              numericValue={spec.numericValue}
              unit={spec.unit}
              suffix={spec.suffix}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
