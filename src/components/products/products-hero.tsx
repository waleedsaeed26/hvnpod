"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import Image from "next/image";

const CATEGORY_IMAGES: Record<string, string> = {
  "acoustic-pods": "/images/hero/hvnpod-range.png",
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  comingSoon: boolean;
  order: number;
};

const wordReveal = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const wordChild = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

function TiltCard({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTransform(
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    );
  };

  const handleMouseLeave = () => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  const inner = (
    <div
      ref={ref}
      className={className}
      style={{ transform, transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}

export default function ProductsHero({ categories }: { categories: Category[] }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  const activeCategories = categories.filter((c) => !c.comingSoon);
  const comingSoonCategories = categories.filter((c) => c.comingSoon);

  return (
    <div className="min-h-screen bg-hvn-white">
      {/* Cinematic Hero */}
      <section className="relative pt-40 pb-28 overflow-hidden">
        {/* Ambient gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-hvn-forest/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-hvn-forest/[0.03] rounded-full blur-[100px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-hvn-silver) 1px, transparent 1px), linear-gradient(90deg, var(--color-hvn-silver) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div ref={heroRef} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-hvn-mist/60 px-5 py-2 text-xs text-hvn-silver mb-12 bg-hvn-cream"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-hvn-neon animate-pulse" />
            The HVNPOD Collection
          </motion.div>

          {/* Word reveal heading */}
          <motion.h1
            variants={wordReveal}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            className="font-[family-name:var(--font-heading)] text-6xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold tracking-tight text-hvn-black leading-[0.9] mb-8"
          >
            <motion.span variants={wordChild} className="inline-block mr-4 lg:mr-6">
              The
            </motion.span>
            <motion.span variants={wordChild} className="inline-block mr-4 lg:mr-6">
              HVNPOD
            </motion.span>
            <br />
            <motion.span
              variants={wordChild}
              className="inline-block text-hvn-silver"
            >
              Range
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-lg sm:text-xl text-hvn-steel leading-relaxed max-w-2xl mb-6"
          >
            Premium workspace solutions engineered for focus, privacy, and
            presence. Each category is designed to transform how you work —
            without construction, without disruption.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-16 flex items-center gap-3 text-xs text-hvn-steel"
          >
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border border-hvn-mist flex items-start justify-center p-1.5"
            >
              <div className="w-1 h-1.5 rounded-full bg-hvn-silver" />
            </motion.div>
            Scroll to explore
          </motion.div>
        </div>
      </section>

      {/* Active Categories - Featured Grid */}
      {activeCategories.length > 0 && (
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h2 className="font-[family-name:var(--font-heading)] text-sm font-medium text-hvn-forest-light uppercase tracking-[0.2em]">
                Available Now
              </h2>
            </motion.div>

            <div
              ref={gridRef}
              className={`grid grid-cols-1 ${
                activeCategories.length === 1
                  ? "lg:grid-cols-1 max-w-3xl"
                  : activeCategories.length === 2
                  ? "lg:grid-cols-2"
                  : "sm:grid-cols-2 lg:grid-cols-3"
              } gap-5 lg:gap-8`}
            >
              {activeCategories.map((category, i) => (
                <motion.div
                  key={category.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate={gridInView ? "visible" : "hidden"}
                >
                  <TiltCard
                    href={`/products/${category.slug}`}
                    className="group relative flex flex-col rounded-2xl border border-hvn-mist/60 bg-hvn-cream overflow-hidden hover:border-hvn-forest/60 transition-colors duration-500"
                  >
                    {/* Accent line */}
                    <div className="h-[2px] w-full bg-gradient-to-r from-hvn-forest via-hvn-forest-light to-hvn-forest" />

                    {/* Hover glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-hvn-forest/0 to-hvn-forest/0 group-hover:from-hvn-forest/[0.06] group-hover:to-transparent transition-all duration-700 pointer-events-none" />

                    {/* Image area */}
                    <div className="aspect-[16/10] bg-gradient-to-br from-hvn-pearl to-hvn-cream flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-hvn-forest/5 to-transparent" />
                      {CATEGORY_IMAGES[category.slug] ? (
                        <Image
                          src={CATEGORY_IMAGES[category.slug]}
                          alt={category.name}
                          fill
                          className="object-contain p-4 relative z-10"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="relative z-10">
                          <div className="mx-auto h-24 w-20 rounded-xl border border-hvn-forest/30 bg-hvn-forest/10 flex items-center justify-center">
                            <span className="font-[family-name:var(--font-heading)] text-xs text-hvn-forest-light font-medium tracking-wider">
                              POD
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-7 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-hvn-black leading-tight">
                          {category.name}
                        </h3>
                        <span className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full bg-hvn-forest/15 border border-hvn-forest/25 px-3 py-1 text-[11px] font-medium text-hvn-forest-light">
                          <Sparkles className="h-3 w-3" />
                          Available
                        </span>
                      </div>

                      {category.description && (
                        <p className="text-sm text-hvn-steel leading-relaxed flex-1">
                          {category.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 pt-3 text-sm font-medium text-hvn-forest-light group-hover:text-hvn-black transition-colors duration-300">
                        Explore Range
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Coming Soon Categories - Muted/Smaller */}
      {comingSoonCategories.length > 0 && (
        <section className="pb-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="font-[family-name:var(--font-heading)] text-sm font-medium text-hvn-steel uppercase tracking-[0.2em]">
                Coming Soon
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {comingSoonCategories.map((category, i) => (
                <motion.div
                  key={category.id}
                  custom={i + activeCategories.length}
                  variants={cardVariants}
                  initial="hidden"
                  animate={gridInView ? "visible" : "hidden"}
                >
                  <div className="group relative flex flex-col rounded-xl border border-hvn-mist/40 bg-hvn-cream/60 overflow-hidden">
                    {/* Greyed top line */}
                    <div className="h-px w-full bg-hvn-mist/50" />

                    {/* Image area - smaller */}
                    <div className="aspect-[16/9] bg-gradient-to-br from-hvn-mist/30 to-hvn-cream/40 flex items-center justify-center relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="mx-auto h-16 w-14 rounded-lg border border-hvn-mist/40 bg-hvn-mist/20 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-hvn-steel" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-[family-name:var(--font-heading)] text-base font-semibold text-hvn-steel leading-tight">
                          {category.name}
                        </h3>
                        {/* Glass-morphism badge */}
                        <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium text-hvn-steel bg-hvn-mist/50 border border-hvn-mist/60">
                          <Clock className="h-2.5 w-2.5" />
                          Soon
                        </span>
                      </div>

                      {category.description && (
                        <p className="text-xs text-hvn-steel leading-relaxed flex-1 line-clamp-2">
                          {category.description}
                        </p>
                      )}

                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-1.5 pt-1 text-xs font-medium text-hvn-silver hover:text-hvn-black transition-colors"
                      >
                        Join Waitlist
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
