"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  Minus,
  Square,
  Layers,
  Shield,
  Zap,
  Eye,
  Target,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";

/* ── Data ─────────────────────────────────────────────────────────── */

const values = [
  {
    icon: Square,
    title: "Architectural Minimalism",
    description:
      "Every element earns its place. If it does not serve a structural, acoustic, or user-experience function, it is removed.",
  },
  {
    icon: Layers,
    title: "Tactile Premium",
    description:
      "Materials and finishes communicate quality through touch and sight before a single word is read.",
  },
  {
    icon: Zap,
    title: "Functional Elegance",
    description:
      "Beauty that serves a purpose — never decorative for its own sake.",
  },
  {
    icon: Eye,
    title: "Confident Restraint",
    description:
      "Knowing what to leave out is as important as what to include.",
  },
];

const stats = [
  { value: 30, suffix: "dB", label: "Noise Reduction" },
  { value: 3, suffix: "Wk", label: "Lead Time" },
  { value: 2, suffix: "Yr", label: "Warranty" },
  { value: 3, suffix: "", label: "Pod Models" },
];

const comingProducts = [
  {
    name: "HVNDESK",
    description:
      "Height-adjustable acoustic workstations with integrated cable management.",
    eta: "Coming 2026",
  },
  {
    name: "HVNCHAIR",
    description:
      "Postural seating engineered for sustained deep work sessions.",
    eta: "Coming 2026",
  },
  {
    name: "HVNCAPSULE",
    description: "Modular micro-living units. Architecture at human scale.",
    eta: "Coming 2027",
  },
];

const misconceptions = [
  {
    myth: "\u201CIt\u2019s a phone booth\u201D",
    truth: "It is an architectural acoustic environment.",
  },
  {
    myth: "\u201CIt\u2019s a cheap solution\u201D",
    truth: "Premium engineering, materials, and acoustic performance.",
  },
  {
    myth: "\u201CIt\u2019s just for open offices\u201D",
    truth:
      "Studios, clinics, hotels, homes \u2014 anywhere acoustic privacy matters.",
  },
  {
    myth: "\u201CIt\u2019s a permanent construction\u201D",
    truth:
      "Deployed, not built. Relocated, reconfigured, or removed. No permits.",
  },
  {
    myth: "\u201CIt\u2019s a tech gadget\u201D",
    truth:
      "Technology serves acoustic function. Defined by what it does to your environment.",
  },
];

const brandVoiceWords = ["Quiet.", "Confident.", "Precise."];

const heroWords = ["Designed", "Around", "You."];

/* ── Animated Counter Component ───────────────────────────────────── */

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { duration: 2000, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionVal.set(value);
    }
  }, [isInView, motionVal, value]);

  useEffect(() => {
    const unsub = springVal.on("change", (v) => {
      setDisplay(Math.round(v));
    });
    return unsub;
  }, [springVal]);

  return (
    <span ref={ref}>
      {display}
      {suffix && <span className="text-hvn-forest-light ml-1">{suffix}</span>}
    </span>
  );
}

/* ── 3D Tilt Value Card ───────────────────────────────────────────── */

function ValueCard({
  value,
  index,
}: {
  value: (typeof values)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = value.icon;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className="group relative rounded-2xl bg-hvn-cream p-8 transition-shadow duration-300 hover:shadow-elevated cursor-default"
    >
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 rounded-2xl border border-hvn-mist/50 group-hover:border-transparent transition-colors duration-500" />
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(135deg, var(--color-hvn-neon-glow) 0%, transparent 40%, transparent 60%, var(--color-hvn-neon-glow) 100%)",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            WebkitMaskComposite: "xor",
            padding: "1px",
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-hvn-mist bg-hvn-mist/50 group-hover:border-hvn-forest/40 group-hover:bg-hvn-forest/10 transition-all duration-300">
          <Icon className="h-5 w-5 text-hvn-silver group-hover:text-hvn-forest-light transition-colors duration-300" />
        </div>

        <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-hvn-black mb-3 tracking-tight">
          {value.title}
        </h3>
        <p className="text-sm text-hvn-silver leading-relaxed">
          {value.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Section Reveal Wrapper ───────────────────────────────────────── */

function SectionReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────── */

export default function AboutPage() {
  const shouldReduceMotion = useReducedMotion();
  const dividerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: dividerProgress } = useScroll({
    target: dividerRef,
    offset: ["start end", "end start"],
  });
  const dividerHeight = useTransform(dividerProgress, [0, 0.6], ["0%", "100%"]);

  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end center"],
  });
  const timelineHeight = useTransform(
    timelineProgress,
    [0, 1],
    ["0%", "100%"]
  );

  return (
    <div className="min-h-screen bg-hvn-white overflow-hidden">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 20% 50%, var(--color-hvn-neon-glow) 0%, transparent 70%)",
              animation: shouldReduceMotion ? "none" : "heroGlow 8s ease-in-out infinite alternate",
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 80% 60%, var(--color-hvn-neon-glow) 0%, transparent 60%)",
              animation: shouldReduceMotion ? "none" : "heroGlow 12s ease-in-out infinite alternate-reverse",
            }}
          />
        </div>

        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-hvn-silver) 1px, transparent 1px), linear-gradient(90deg, var(--color-hvn-silver) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Accent line */}
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-hvn-forest/40 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-5xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 mb-10"
            >
              <Minus className="h-4 w-4 text-hvn-forest-light" />
              <span className="text-xs uppercase tracking-[0.3em] text-hvn-steel font-medium">
                About HVNPOD
              </span>
            </motion.div>

            {/* Headline — word by word reveal */}
            <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-[0.9] break-words mb-10">
              {heroWords.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4 + i * 0.2,
                    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                  }}
                  className={`inline-block mr-[0.3em] ${
                    i === 1 ? "text-hvn-mist" : "text-hvn-black"
                  }`}
                >
                  {word}
                  {i < heroWords.length - 1 && <br className="hidden lg:block" />}
                </motion.span>
              ))}
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-lg sm:text-xl lg:text-2xl text-hvn-silver leading-relaxed max-w-2xl mb-14"
            >
              Open offices promised collaboration. What they delivered was noise.
              HVNPOD exists to give that stolen focus back — through architecture,
              not compromise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="flex items-center gap-6"
            >
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-hvn-cream px-8 py-3.5 text-sm font-semibold text-hvn-black transition-all hover:bg-hvn-white hover:shadow-elevated"
              >
                Explore Pods
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="text-sm text-hvn-silver hover:text-hvn-black transition-colors underline underline-offset-4"
              >
                Get in touch
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-hvn-white to-transparent" />

        {/* Glow animation keyframes */}
        <style>{`
          @keyframes heroGlow {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(30px, -20px) scale(1.1); }
          }
        `}</style>
      </section>

      {/* ── Our Story ────────────────────────────────────────────── */}
      <section className="py-24 lg:py-36 border-t border-hvn-mist/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Text column */}
            <div className="space-y-10">
              <SectionReveal>
                <div className="flex items-center gap-3 mb-6">
                  <Minus className="h-4 w-4 text-hvn-forest-light" />
                  <span className="text-xs uppercase tracking-[0.3em] text-hvn-steel font-medium">
                    Our Story
                  </span>
                </div>

                <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-hvn-black tracking-tight leading-tight">
                  Conceived in Cairo.
                  <br />
                  <span className="text-hvn-silver">Built for the future.</span>
                </h2>
              </SectionReveal>

              <div className="space-y-8">
                {[
                  "HVNPOD began with a single, honest observation: the modern workplace had optimised for optics over output. Glass walls and open floors signalled transparency — but they had quietly eroded the conditions in which real work happens.",
                  "Our founders, a team of architects and product engineers based in Cairo, set out to design an answer that didn\u2019t feel like a concession. No foam panels tacked to plywood. No flimsy curtained booths. An acoustic environment worthy of the work done inside it.",
                  "What emerged was HVNPOD — a line of precision-engineered acoustic enclosures that sit at the intersection of industrial design and architectural thinking. Designed for Egypt. Made for the world.",
                ].map((paragraph, i) => {
                  const ParagraphReveal = () => {
                    const pRef = useRef<HTMLParagraphElement>(null);
                    const pInView = useInView(pRef, {
                      once: true,
                      margin: "-50px",
                    });
                    return (
                      <motion.p
                        ref={pRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={pInView ? { opacity: 1, y: 0 } : {}}
                        transition={{
                          duration: 0.7,
                          delay: i * 0.1,
                          ease: "easeOut",
                        }}
                        className="text-hvn-steel leading-relaxed text-base lg:text-lg"
                      >
                        {paragraph}
                      </motion.p>
                    );
                  };
                  return <ParagraphReveal key={i} />;
                })}
              </div>

              <SectionReveal>
                <div className="flex items-center gap-2 text-sm text-hvn-forest-light font-medium">
                  <span className="h-1 w-8 bg-hvn-forest-light rounded" />
                  Founded 2024, Cairo, Egypt
                </div>
              </SectionReveal>
            </div>

            {/* Pull quote column */}
            <div className="space-y-12 lg:pt-24">
              <SectionReveal>
                <blockquote className="relative pl-8 border-l-2 border-hvn-forest/40">
                  <p className="font-[family-name:var(--font-heading)] text-2xl lg:text-3xl font-bold text-hvn-black leading-snug tracking-tight">
                    &ldquo;The modern workplace had optimised for optics over
                    output.&rdquo;
                  </p>
                </blockquote>
              </SectionReveal>

              {/* Pod interior image */}
              <SectionReveal>
                <div className="relative">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-hvn-mist/50 relative">
                    <Image
                      src="/images/detail/pod-front-warm.png"
                      alt="HVNPOD warm wood interior"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 left-4 h-6 w-6 border-t border-l border-hvn-forest/40" />
                    <div className="absolute top-4 right-4 h-6 w-6 border-t border-r border-hvn-forest/40" />
                    <div className="absolute bottom-4 left-4 h-6 w-6 border-b border-l border-hvn-forest/40" />
                    <div className="absolute bottom-4 right-4 h-6 w-6 border-b border-r border-hvn-forest/40" />
                  </div>

                  <div className="absolute -bottom-4 -left-4 rounded-lg border border-hvn-mist bg-hvn-cream px-5 py-3">
                    <p className="text-xs text-hvn-steel">Designed in</p>
                    <p className="text-sm font-semibold text-hvn-black">
                      Cairo, Egypt
                    </p>
                  </div>
                </div>
              </SectionReveal>

              {/* Craftsmanship details */}
              <SectionReveal>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-hvn-mist/50">
                    <Image
                      src="/images/detail/acoustic-panel.png"
                      alt="HVNPOD acoustic panel detail"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-hvn-mist/50">
                    <Image
                      src="/images/detail/handle-detail.png"
                      alt="HVNPOD handle craftsmanship detail"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </div>
              </SectionReveal>

              {/* Brand badge */}
              <SectionReveal>
                <div className="flex justify-center mt-8">
                  <Image
                    src="/images/products/hvnpod-badge-3d.png"
                    alt="HVNPOD 3D chrome badge"
                    width={160}
                    height={160}
                    className="opacity-80"
                  />
                </div>
              </SectionReveal>

              <SectionReveal>
                <blockquote className="relative pl-8 border-l-2 border-hvn-mist/60">
                  <p className="font-[family-name:var(--font-heading)] text-xl lg:text-2xl text-hvn-silver leading-snug tracking-tight">
                    &ldquo;An acoustic environment worthy of the work done inside
                    it.&rdquo;
                  </p>
                </blockquote>
              </SectionReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────── */}
      <section className="py-24 lg:py-36 bg-hvn-cream/30 border-t border-hvn-mist/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="mb-16 space-y-4">
              <div className="flex items-center gap-3">
                <Minus className="h-4 w-4 text-hvn-forest-light" />
                <span className="text-xs uppercase tracking-[0.3em] text-hvn-steel font-medium">
                  Design Philosophy
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-hvn-black tracking-tight">
                Design Principles
              </h2>
            </div>
          </SectionReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <ValueCard key={value.title} value={value} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Voice ──────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-hvn-mist/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 lg:gap-24 mb-8">
            {brandVoiceWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.3,
                  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                }}
                className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-8xl font-bold text-hvn-black tracking-tight"
              >
                {word}
              </motion.span>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-sm uppercase tracking-[0.3em] text-hvn-steel"
          >
            The brand voice in three words.
          </motion.p>
        </div>
      </section>

      {/* ── What HVNPOD Is Not ─────────────────────────────────── */}
      <section className="py-24 lg:py-36 bg-hvn-cream border-t border-hvn-mist/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Minus className="h-4 w-4 text-hvn-forest-light" />
                <span className="text-xs uppercase tracking-[0.3em] text-hvn-steel font-medium">
                  Clarity
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-hvn-black tracking-tight">
                What HVNPOD is not.
              </h2>
            </div>
          </SectionReveal>

          <div className="space-y-0">
            {misconceptions.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 py-7 border-b border-hvn-mist/50 first:border-t"
              >
                <div className="flex items-center gap-3">
                  <span className="text-hvn-steel line-through decoration-red-500/60 decoration-2 text-base lg:text-lg">
                    {item.myth}
                  </span>
                </div>
                <p className="text-hvn-black font-semibold text-base lg:text-lg leading-relaxed">
                  {item.truth}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-hvn-mist/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="mb-16 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Minus className="h-4 w-4 text-hvn-forest-light" />
                <span className="text-xs uppercase tracking-[0.3em] text-hvn-steel font-medium">
                  Why HVNPOD
                </span>
                <Minus className="h-4 w-4 text-hvn-forest-light" />
              </div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-hvn-black tracking-tight">
                Numbers that matter
              </h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-hvn-mist/30 rounded-2xl overflow-hidden border border-hvn-mist/40">
            {stats.map((stat, i) => (
              <SectionReveal key={stat.label}>
                <div className="bg-hvn-cream px-8 py-14 text-center">
                  <div className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-7xl font-bold text-hvn-black mb-3 tracking-tighter">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-hvn-steel uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────────────────────── */}
      <section
        ref={dividerRef}
        className="py-24 lg:py-36 border-t border-hvn-mist/40 bg-hvn-cream/30"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <Minus className="h-4 w-4 text-hvn-forest-light" />
                <span className="text-xs uppercase tracking-[0.3em] text-hvn-steel font-medium">
                  Purpose
                </span>
              </div>
            </div>
          </SectionReveal>

          <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-0">
            {/* Vertical divider that draws itself */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
              <div className="absolute inset-0 bg-hvn-mist/20" />
              <motion.div
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-hvn-forest-light to-hvn-forest/30"
                style={{ height: dividerHeight }}
              />
              {/* Glow dot at the drawing tip */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-hvn-forest-light shadow-[0_0_12px_var(--color-hvn-neon-glow)]"
                style={{ top: dividerHeight }}
              />
            </div>

            {/* Mission */}
            <SectionReveal className="lg:pr-16">
              <div className="rounded-2xl border border-hvn-forest/30 bg-hvn-forest/5 p-10 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-hvn-forest/60 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-hvn-forest/60 to-transparent" />

                <div className="mb-4">
                  <span className="text-xs uppercase tracking-[0.3em] text-hvn-forest-light font-medium">
                    Mission
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl lg:text-4xl font-bold text-hvn-black tracking-tight mb-6 leading-tight">
                  Restore the conditions for deep work.
                </h3>
                <p className="text-hvn-steel leading-relaxed text-base lg:text-lg">
                  We build acoustic environments that honour the work done inside
                  them. Not booths. Not tents. Precision-engineered spaces that
                  elevate concentration and professional dignity in equal measure.
                </p>
              </div>
            </SectionReveal>

            {/* Vision */}
            <SectionReveal className="lg:pl-16">
              <div className="rounded-2xl border border-hvn-mist/50 bg-hvn-cream p-10 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-hvn-mist to-transparent" />

                <div className="mb-4">
                  <span className="text-xs uppercase tracking-[0.3em] text-hvn-steel font-medium">
                    Vision
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl lg:text-4xl font-bold text-hvn-black tracking-tight mb-6 leading-tight">
                  A workspace world built with intention.
                </h3>
                <p className="text-hvn-steel leading-relaxed text-base lg:text-lg">
                  We envision offices, homes, and public spaces where every
                  acoustic decision is made deliberately — where privacy and
                  openness coexist without friction. HVNPOD is the first product in
                  that world.
                </p>
              </div>
            </SectionReveal>
          </div>

          {/* Symbol meaning */}
          <SectionReveal className="mt-20">
            <div className="flex items-center justify-center gap-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-hvn-mist/50" />
              <div className="flex items-center gap-4">
                <div className="relative h-10 w-10">
                  <div className="absolute inset-0 border border-hvn-forest/40 rounded-sm" />
                  <div className="absolute inset-[5px] border border-hvn-forest/30 rounded-sm" />
                  <div className="absolute inset-[10px] border border-hvn-forest/20 rounded-sm" />
                </div>
                <p className="text-sm text-hvn-steel max-w-md leading-relaxed">
                  The concentric squares represent a room within a room —
                  personal boundaries defined by design.
                </p>
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-hvn-mist/50" />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── What's Next / Roadmap ─────────────────────────────────── */}
      <section className="py-24 lg:py-36 border-t border-hvn-mist/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="mb-20 space-y-4">
              <div className="flex items-center gap-3">
                <Minus className="h-4 w-4 text-hvn-forest-light" />
                <span className="text-xs uppercase tracking-[0.3em] text-hvn-steel font-medium">
                  The Roadmap
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-hvn-black tracking-tight">
                What&apos;s next
              </h2>
              <p className="text-hvn-silver max-w-xl leading-relaxed text-lg">
                The pod is the beginning. We&apos;re building a complete ecosystem
                of precision workplace objects — each designed with the same
                architectural discipline.
              </p>
            </div>
          </SectionReveal>

          {/* Timeline */}
          <div ref={timelineRef} className="relative">
            {/* Animated connecting line */}
            <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px lg:-translate-x-1/2">
              <div className="absolute inset-0 bg-hvn-mist/20" />
              <motion.div
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-hvn-forest-light via-hvn-forest/50 to-transparent"
                style={{ height: timelineHeight }}
              />
            </div>

            <div className="space-y-16 lg:space-y-24">
              {comingProducts.map((product, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <SectionReveal key={product.name}>
                    <div
                      className={`relative flex flex-col lg:flex-row items-start lg:items-center gap-8 ${
                        isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                      }`}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-6 lg:left-1/2 top-0 lg:top-1/2 -translate-x-1/2 lg:-translate-y-1/2 z-10">
                        <div className="h-3 w-3 rounded-full bg-hvn-forest-light shadow-[0_0_16px_var(--color-hvn-neon-glow)]" />
                      </div>

                      {/* Spacer for left side on mobile */}
                      <div className="lg:hidden w-12" />

                      {/* Card */}
                      <div
                        className={`flex-1 pl-12 lg:pl-0 ${
                          isLeft ? "lg:pr-20 lg:text-right" : "lg:pl-20"
                        }`}
                      >
                        <div className="relative rounded-2xl border border-hvn-mist/40 p-8 lg:p-10 overflow-hidden bg-hvn-cream">
                          {/* Glass-morphism effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-hvn-silver/[0.03] to-transparent pointer-events-none" />
                          <div className="absolute inset-0 rounded-2xl border border-hvn-silver/[0.05] pointer-events-none" />

                          <div className="relative z-10">
                            <div
                              className={`flex items-center gap-4 mb-4 ${
                                isLeft ? "lg:justify-end" : ""
                              }`}
                            >
                              <div className="h-10 w-10 rounded-full border border-hvn-mist bg-hvn-mist/50 flex items-center justify-center">
                                <Target className="h-4 w-4 text-hvn-steel" />
                              </div>
                              <span className="text-[10px] uppercase tracking-widest text-hvn-forest-light border border-hvn-forest/30 px-3 py-1 rounded-full">
                                {product.eta}
                              </span>
                            </div>

                            <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-hvn-black tracking-tight mb-3">
                              {product.name}
                            </h3>
                            <p className="text-sm lg:text-base text-hvn-silver leading-relaxed">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Empty flex spacer for the other side */}
                      <div className="hidden lg:block flex-1" />
                    </div>
                  </SectionReveal>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <SectionReveal>
            <div className="mt-24 text-center">
              <p className="text-hvn-steel mb-6 text-sm">
                Want early access when new products launch?
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full border border-hvn-mist px-8 py-3.5 text-sm font-medium text-hvn-black transition-all hover:border-hvn-steel hover:bg-hvn-cream"
              >
                Get notified
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
