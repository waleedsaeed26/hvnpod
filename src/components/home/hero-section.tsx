"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const ease = [0.25, 0.4, 0.25, 1] as const;

const wordReveal = {
  hidden: {},
  visible: (i: number) => ({
    transition: { staggerChildren: 0.08, delayChildren: 0.6 + i * 0.25 },
  }),
};

const singleWord = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function HeroSection() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  /* ---------- Parallax / scroll-fade ---------- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);

  /* ---------- Split helpers ---------- */
  const titleWords = t("title").split(" ");
  const subtitleWords = t("subtitle").split(" ");
  const isAccentWord = (word: string) => word.toLowerCase().replace(/[.,!?]/, "") === "reimagined";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-hvn-white"
    >
      {/* ---- Background layers ---- */}
      <div className="absolute inset-0 bg-gradient-to-b from-hvn-white via-hvn-cream/40 to-hvn-white" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-hvn-silver) 1px, transparent 1px), linear-gradient(90deg, var(--color-hvn-silver) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ---- Content ---- */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-28 lg:py-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
          {/* ---- Left: text ---- */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 18 }}
              className="inline-flex items-center gap-2 rounded-full border border-hvn-mist/60 bg-hvn-cream px-5 py-2 text-xs tracking-widest uppercase text-hvn-steel mb-8"
            >
              <span className="relative inline-flex h-2 w-2 rounded-full bg-hvn-neon" />
              Now available in Egypt
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[0.92] text-hvn-black"
              initial="hidden"
              animate="visible"
              variants={wordReveal}
              custom={0}
            >
              {titleWords.map((word, i) => {
                const isAccent = isAccentWord(word);
                return (
                  <motion.span
                    key={`title-${i}`}
                    variants={singleWord}
                    className="inline-block mr-[0.28em] last:mr-0"
                  >
                    {isAccent ? (
                      <motion.span
                        className="inline-block bg-clip-text text-transparent"
                        style={{
                          backgroundImage: `linear-gradient(135deg, var(--color-hvn-forest-light), var(--color-pod-forest), var(--color-hvn-forest))`,
                          backgroundSize: "200% 200%",
                        }}
                        animate={
                          prefersReducedMotion
                            ? {}
                            : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
                        }
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { duration: 6, repeat: Infinity, ease: "easeInOut" }
                        }
                      >
                        {word}
                      </motion.span>
                    ) : (
                      word
                    )}
                  </motion.span>
                );
              })}

              <br />

              <motion.span
                className="block mt-3 text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-normal tracking-wide text-hvn-steel"
                initial="hidden"
                animate="visible"
                variants={wordReveal}
                custom={1}
              >
                {subtitleWords.map((word, i) => (
                  <motion.span
                    key={`sub-${i}`}
                    variants={singleWord}
                    className="inline-block mr-[0.28em] last:mr-0"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.7, ease }}
              className="mt-6 max-w-xl text-base sm:text-lg text-hvn-steel/80 leading-relaxed mx-auto lg:mx-0"
            >
              {t("description")}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.6, ease }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-8"
            >
              <Link
                href="/products"
                className="group relative flex items-center gap-2 overflow-hidden rounded-full btn-glow bg-hvn-neon px-8 py-3.5 text-sm font-semibold text-hvn-white transition-all duration-300 hover:bg-hvn-neon-bright hover:shadow-[0_0_30px_var(--color-hvn-neon-glow)]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="relative z-10 flex items-center gap-2">
                  {t("explorePods")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href="/contact"
                className="group relative flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium text-hvn-black transition-all duration-300"
              >
                <span className="pointer-events-none absolute inset-0 rounded-full border border-hvn-mist transition-colors duration-500 group-hover:border-hvn-steel" />
                <span className="pointer-events-none absolute inset-0 rounded-full bg-hvn-cream/0 transition-colors duration-500 group-hover:bg-hvn-cream/60" />
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  {t("bookTrial")}
                </span>
              </Link>
            </motion.div>
          </div>

          {/* ---- Right: product image ---- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.9, ease }}
            className="relative flex items-center justify-center"
            style={{ scale: imageScale }}
          >
            <Image
              src="/images/hero/hvnpod-one-hero.png"
              alt="HVNPOD One — premium acoustic pod"
              width={700}
              height={700}
              className="w-full max-w-md lg:max-w-none h-auto drop-shadow-2xl"
              priority
            />
            {/* Glow behind image */}
            <div
              className="absolute inset-0 -z-10 opacity-15 blur-[80px]"
              style={{
                background: "radial-gradient(circle at center, var(--color-hvn-forest-light), transparent 70%)",
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ---- Bottom fade ---- */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
