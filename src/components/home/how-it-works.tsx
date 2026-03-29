"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Step icons — clean, geometric, minimal                             */
/* ------------------------------------------------------------------ */

function StepIcon({ index }: { index: number }) {
  const icons = [
    // Step 1: Pod selection — three nested squares
    <svg key="1" viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <rect x="8" y="14" width="10" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" className="text-hvn-forest" />
      <rect x="19" y="10" width="12" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" className="text-hvn-forest/70" />
      <rect x="32" y="6" width="14" height="36" rx="3" stroke="currentColor" strokeWidth="1.5" className="text-hvn-forest/40" />
    </svg>,
    // Step 2: Tier config — stacked layers
    <svg key="2" viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <rect x="6" y="30" width="36" height="8" rx="4" stroke="currentColor" strokeWidth="1.5" className="text-hvn-forest" />
      <rect x="10" y="20" width="28" height="8" rx="4" stroke="currentColor" strokeWidth="1.5" className="text-hvn-forest/70" />
      <rect x="14" y="10" width="20" height="8" rx="4" stroke="currentColor" strokeWidth="1.5" className="text-hvn-forest/40" />
    </svg>,
    // Step 3: Site assess — crosshair/location
    <svg key="3" viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.5" className="text-hvn-forest/30" />
      <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.5" className="text-hvn-forest/60" />
      <circle cx="24" cy="24" r="3" fill="currentColor" className="text-hvn-forest" />
      <line x1="24" y1="4" x2="24" y2="14" stroke="currentColor" strokeWidth="1.5" className="text-hvn-forest/40" />
      <line x1="24" y1="34" x2="24" y2="44" stroke="currentColor" strokeWidth="1.5" className="text-hvn-forest/40" />
      <line x1="4" y1="24" x2="14" y2="24" stroke="currentColor" strokeWidth="1.5" className="text-hvn-forest/40" />
      <line x1="34" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="1.5" className="text-hvn-forest/40" />
    </svg>,
    // Step 4: Delivery — checkmark in box
    <svg key="4" viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <rect x="8" y="12" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" className="text-hvn-forest" />
      <polyline points="17,24 22,29 31,20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hvn-forest" />
      <line x1="16" y1="8" x2="16" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-hvn-forest/50" />
      <line x1="32" y1="8" x2="32" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-hvn-forest/50" />
    </svg>,
  ];
  return icons[index];
}

/* ------------------------------------------------------------------ */
/*  Step data                                                          */
/* ------------------------------------------------------------------ */

const steps = [
  { key: "step1", duration: "Day 1" },
  { key: "step2", duration: "Day 2-3" },
  { key: "step3", duration: "Week 1" },
  { key: "step4", duration: "Week 2-3" },
];

/* ------------------------------------------------------------------ */
/*  Single Step Card                                                   */
/* ------------------------------------------------------------------ */

function StepCard({
  step,
  index,
  t,
}: {
  step: (typeof steps)[number];
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative"
    >
      {/* Connector line (not on last) */}
      {index < steps.length - 1 && (
        <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] right-[-calc(50%-40px)] h-[1px] z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-hvn-forest/30 to-hvn-forest/10"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: index * 0.15 + 0.5, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      )}

      {/* Card */}
      <div className="relative flex flex-col items-center text-center">
        {/* Icon container */}
        <motion.div
          className="relative mb-8"
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Glow ring */}
          <div className="absolute -inset-3 rounded-full bg-hvn-forest/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

          {/* Icon circle */}
          <div className="relative w-20 h-20 rounded-full border border-hvn-mist bg-hvn-white flex items-center justify-center group-hover:border-hvn-forest/30 transition-colors duration-500">
            <div className="w-10 h-10">
              <StepIcon index={index} />
            </div>
          </div>

          {/* Step number */}
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-hvn-neon flex items-center justify-center">
            <span className="text-[10px] font-bold text-hvn-white">
              {index + 1}
            </span>
          </div>
        </motion.div>

        {/* Timeline badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-hvn-forest/[0.06] text-[10px] font-semibold tracking-[0.2em] uppercase text-hvn-forest">
            {step.duration}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-[family-name:var(--font-heading)] text-xl lg:text-2xl font-bold text-hvn-black tracking-tight mb-3">
          {t(`${step.key}Title`)}
        </h3>

        {/* Description */}
        <p className="text-sm text-hvn-steel leading-relaxed max-w-[240px] mx-auto">
          {t(step.key)}
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });

  // Animate the connecting line width
  const lineWidth = useTransform(scrollYProgress, [0, 0.6], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      className="py-32 lg:py-40 bg-hvn-white relative overflow-hidden"
    >
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-hvn-forest) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-24 lg:mb-32"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[11px] font-semibold tracking-[0.3em] uppercase text-hvn-forest mb-4"
          >
            The Process
          </motion.p>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-hvn-black">
            {t("title")}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-5 text-lg text-hvn-steel max-w-lg mx-auto leading-relaxed"
          >
            From choosing your pod to walking in — we handle everything.
          </motion.p>
        </motion.div>

        {/* Desktop: Horizontal timeline with connecting line */}
        <div className="hidden lg:block relative">
          {/* Connecting line background */}
          <div className="absolute top-10 left-[12%] right-[12%] h-[1px] bg-hvn-mist" />
          {/* Connecting line animated fill */}
          <motion.div
            className="absolute top-10 left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-hvn-forest via-hvn-forest-light to-hvn-forest origin-left"
            style={{ scaleX: lineWidth }}
          />

          {/* Steps */}
          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <StepCard key={step.key} step={step} index={i} t={t} />
            ))}
          </div>
        </div>

        {/* Mobile/Tablet: Vertical timeline */}
        <div className="lg:hidden relative">
          {/* Vertical line */}
          <div className="absolute left-10 top-0 bottom-0 w-[1px] bg-hvn-mist" />
          <motion.div
            className="absolute left-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-hvn-forest to-hvn-forest-light origin-top"
            style={{ scaleY: lineWidth }}
          />

          {/* Steps */}
          <div className="space-y-16">
            {steps.map((step, i) => (
              <MobileStepCard key={step.key} step={step} index={i} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Step Card                                                   */
/* ------------------------------------------------------------------ */

function MobileStepCard({
  step,
  index,
  t,
}: {
  step: (typeof steps)[number];
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="relative flex gap-8 pl-4"
    >
      {/* Node on the vertical line */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full border border-hvn-mist bg-hvn-white flex items-center justify-center z-10 relative">
          <div className="w-6 h-6">
            <StepIcon index={index} />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-hvn-neon flex items-center justify-center">
          <span className="text-[9px] font-bold text-hvn-white">
            {index + 1}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="pt-1">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-hvn-forest/[0.06] text-[9px] font-semibold tracking-[0.2em] uppercase text-hvn-forest mb-2">
          {step.duration}
        </span>
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-hvn-black tracking-tight mb-2">
          {t(`${step.key}Title`)}
        </h3>
        <p className="text-sm text-hvn-steel leading-relaxed">
          {t(step.key)}
        </p>
      </div>
    </motion.div>
  );
}
