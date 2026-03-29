"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  Users,
  CheckCircle2,
  Zap,
  User,
  UsersRound,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

const MODEL_IMAGES: Record<string, string> = {
  ONE: "/images/products/hvnpod-one-white.png",
  DUO: "/images/products/hvnpod-one-studio.png",
  MEET: "/images/products/hvnpod-one-beige.png",
};

type ProductWithImages = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  model: string | null;
  tier: string | null;
  price: number;
  capacity: string | null;
  specs: string | null;
  features: string | null;
  images: { id: string; url: string; alt: string | null; order: number }[];
};

type ModelGroup = {
  model: string;
  products: ProductWithImages[];
  corePrice: number;
  capacity: string;
  tagline: string;
  idealFor: string;
  keySpecs: string[];
};

const TIER_ORDER = ["Core", "Plus", "Signature"];

const TIER_DESCRIPTIONS: Record<string, string> = {
  Core: "Essential acoustic performance with clean finish",
  Plus: "Enhanced features with premium materials and smart tech",
  Signature: "The pinnacle of design, materials, and integrated technology",
};

const MODEL_ICONS: Record<string, typeof User> = {
  One: User,
  Duo: Users,
  Meet: UsersRound,
};

const heroFeatures = [
  "30 dB Isolation",
  "Plug & Play Setup",
  "2-3 Week Lead Time",
  "2-Year Warranty",
];

/* ---- Word reveal animation ---- */
const wordReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const wordChild = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

/* ---- Stagger features ---- */
const specStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};
const specItem = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

/* ---- Model section component ---- */
function ModelSection({
  group,
  index,
}: {
  group: ModelGroup;
  index: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const IconComponent = MODEL_ICONS[group.model] ?? Users;

  return (
    <div
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-center"
    >
      {/* Background number watermark */}
      <div className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 pointer-events-none select-none">
        <span className="font-[family-name:var(--font-heading)] text-[12rem] lg:text-[18rem] font-bold text-hvn-cream/60 leading-none">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div
          className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
            index % 2 === 1 ? "lg:[direction:rtl]" : ""
          }`}
        >
          {/* Visual side */}
          <motion.div
            style={{ y: imageY }}
            className={`relative aspect-[4/3] lg:aspect-square ${
              index % 2 === 1 ? "lg:[direction:ltr]" : ""
            }`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full h-full rounded-3xl border border-hvn-mist/40 bg-gradient-to-br from-hvn-pearl to-hvn-cream overflow-hidden"
            >
              {/* Ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-hvn-forest/[0.06] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-hvn-white/40 to-transparent" />

              {/* Product image */}
              {MODEL_IMAGES[group.model] ? (
                <Image
                  src={MODEL_IMAGES[group.model]}
                  alt={`HVNPOD ${group.model}`}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="mx-auto h-32 w-24 rounded-2xl border-2 border-dashed border-hvn-mist/60 flex items-center justify-center bg-hvn-mist/20">
                      <div className="text-center space-y-2">
                        <IconComponent className="h-10 w-10 text-hvn-steel mx-auto" />
                        <span className="font-[family-name:var(--font-heading)] text-[10px] text-hvn-steel block tracking-widest uppercase">
                          HVNPOD
                        </span>
                      </div>
                    </div>
                    <span className="font-[family-name:var(--font-heading)] text-2xl font-bold text-hvn-steel/60 tracking-wide">
                      {group.model}
                    </span>
                  </div>
                </div>
              )}

              {/* Capacity badge */}
              <div className="absolute top-6 left-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-hvn-mist/50 border border-hvn-mist/60 px-4 py-1.5 text-xs text-hvn-silver">
                  <IconComponent className="h-3.5 w-3.5" />
                  {group.capacity}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Content side */}
          <div className={index % 2 === 1 ? "lg:[direction:ltr]" : ""}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xs font-medium text-hvn-forest-light uppercase tracking-[0.25em] mb-4">
                HVNPOD {group.model}
              </p>
              <h2 className="font-[family-name:var(--font-heading)] text-4xl lg:text-5xl xl:text-6xl font-bold text-hvn-black tracking-tight mb-3">
                {group.model}
              </h2>
              <p className="text-xl text-hvn-steel mb-8">{group.tagline}</p>
            </motion.div>

            {/* Animated price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-baseline gap-3 mb-8"
            >
              <span className="text-xs text-hvn-steel uppercase tracking-wider">
                Starting from
              </span>
              <span className="font-[family-name:var(--font-mono)] text-4xl lg:text-5xl font-bold text-hvn-black">
                {formatPrice(group.corePrice)}
              </span>
            </motion.div>

            {group.idealFor && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-2.5 text-sm text-hvn-steel mb-8"
              >
                <Zap className="h-4 w-4 text-hvn-forest-light flex-shrink-0" />
                {group.idealFor}
              </motion.div>
            )}

            {/* Staggered specs */}
            {group.keySpecs.length > 0 && (
              <motion.ul
                variants={specStagger}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="space-y-3 mb-10"
              >
                {group.keySpecs.map((spec) => (
                  <motion.li
                    key={spec}
                    variants={specItem}
                    className="flex items-center gap-3 text-sm text-hvn-steel"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-hvn-forest-light flex-shrink-0" />
                    {spec}
                  </motion.li>
                ))}
              </motion.ul>
            )}

            {/* Premium CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/configure"
                className="group relative flex items-center justify-center gap-2.5 rounded-xl bg-hvn-neon px-8 py-4 text-sm font-semibold text-hvn-white transition-all duration-300 hover:bg-hvn-neon-bright hover:scale-[1.02]"
              >
                Configure Your Pod
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="group flex items-center justify-center gap-2 rounded-xl border border-hvn-mist px-8 py-4 text-sm font-medium text-hvn-steel transition-all duration-300 hover:border-hvn-steel hover:text-hvn-black hover:bg-hvn-mist/20"
              >
                Request Quote
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Tier cards row */}
        {group.products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {group.products.map((product, pi) => (
              <div
                key={product.id}
                className={`group/tier relative rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                  product.tier === "Signature"
                    ? "border-hvn-forest/40 bg-hvn-cream hover:border-hvn-forest/70 hover:shadow-[0_0_30px_var(--color-hvn-neon-glow)]"
                    : "border-hvn-mist/40 bg-hvn-cream/80 hover:border-hvn-mist/60"
                }`}
              >
                {product.tier === "Signature" && (
                  <div className="absolute -top-px left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-hvn-forest-light to-transparent" />
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="font-[family-name:var(--font-heading)] text-sm font-semibold text-hvn-black">
                    {product.tier}
                  </span>
                  {product.tier === "Signature" && (
                    <span className="text-[10px] font-medium text-hvn-forest-light uppercase tracking-wider">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="font-[family-name:var(--font-mono)] text-2xl font-bold text-hvn-black mb-2">
                  {formatPrice(product.price)}
                </div>

                <p className="text-xs text-hvn-steel leading-relaxed mb-4">
                  {product.shortDesc ||
                    TIER_DESCRIPTIONS[product.tier ?? ""] ||
                    ""}
                </p>

                <Link
                  href={`/products/${product.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs text-hvn-silver hover:text-hvn-black transition-colors group/link"
                >
                  View details
                  <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                </Link>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ---- Main showcase ---- */
export default function AcousticPodsShowcase({
  modelGroups,
}: {
  modelGroups: ModelGroup[];
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const tableRef = useRef<HTMLDivElement>(null);
  const tableInView = useInView(tableRef, { once: true, margin: "-50px" });

  return (
    <div className="min-h-screen bg-hvn-white">
      {/* ====== Hero ====== */}
      <section className="relative pt-40 pb-28 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-hvn-forest/[0.03] rounded-full blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-hvn-silver) 1px, transparent 1px), linear-gradient(90deg, var(--color-hvn-silver) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div
          ref={heroRef}
          className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-xs text-hvn-steel mb-12"
          >
            <Link
              href="/products"
              className="hover:text-hvn-steel transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-hvn-silver">Acoustic Pods</span>
          </motion.nav>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-hvn-mist/60 px-5 py-2 text-xs text-hvn-silver mb-10 bg-hvn-cream"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-hvn-neon animate-pulse" />
              Now available in Egypt
            </motion.div>

            {/* Word reveal heading */}
            <motion.h1
              variants={wordReveal}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              className="font-[family-name:var(--font-heading)] text-6xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold tracking-tight text-hvn-black leading-[0.9] mb-8"
            >
              <motion.span
                variants={wordChild}
                className="inline-block mr-4 lg:mr-6"
              >
                Acoustic
              </motion.span>
              <br />
              <motion.span
                variants={wordChild}
                className="inline-block text-hvn-silver"
              >
                Privacy Pods
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="text-lg sm:text-xl text-hvn-steel leading-relaxed max-w-2xl mb-12"
            >
              Three models engineered for different team sizes — all
              delivering 30 dB of acoustic isolation, plug-and-play
              installation, and a premium finish that elevates any workspace.
            </motion.p>

            {/* Feature badges */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap gap-4"
            >
              {heroFeatures.map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
                  className="flex items-center gap-2 rounded-full bg-hvn-cream border border-hvn-mist/50 px-4 py-2 text-sm text-hvn-steel"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-hvn-forest-light flex-shrink-0" />
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== Sticky model sections ====== */}
      <section className="pb-24">
        <div className="space-y-32 lg:space-y-48">
          {modelGroups.map((group, i) => (
            <ModelSection key={group.model} group={group} index={i} />
          ))}
        </div>
      </section>

      {/* ====== Comparison table ====== */}
      <section ref={tableRef} className="pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-hvn-black tracking-tight mb-5">
              Compare All Tiers
            </h2>
            <p className="text-hvn-steel max-w-2xl mx-auto text-lg">
              Every pod is available in three tiers. Choose what matters most
              to you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="overflow-x-auto rounded-2xl border border-hvn-mist/40 bg-hvn-cream"
          >
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-hvn-mist/40">
                  <th className="px-8 py-5 text-left text-xs font-medium text-hvn-steel uppercase tracking-[0.15em]">
                    Model / Tier
                  </th>
                  {TIER_ORDER.map((tier) => (
                    <th
                      key={tier}
                      className="px-8 py-5 text-left text-xs font-medium text-hvn-silver uppercase tracking-[0.15em]"
                    >
                      {tier}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modelGroups.map((group, i) => (
                  <tr
                    key={group.model}
                    className="border-b border-hvn-mist/30 transition-colors duration-200 hover:bg-hvn-mist/20"
                  >
                    <td className="px-8 py-6">
                      <div className="font-[family-name:var(--font-heading)] font-semibold text-hvn-black text-sm">
                        HVNPOD {group.model}
                      </div>
                      <div className="text-xs text-hvn-steel mt-1">
                        {group.capacity}
                      </div>
                    </td>
                    {TIER_ORDER.map((tierName) => {
                      const product = group.products.find(
                        (p) => p.tier === tierName
                      );
                      return (
                        <td key={tierName} className="px-8 py-6">
                          {product ? (
                            <div>
                              <div className="font-[family-name:var(--font-mono)] text-hvn-black font-bold text-lg">
                                {formatPrice(product.price)}
                              </div>
                              <Link
                                href={`/products/${product.slug}`}
                                className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-hvn-steel hover:text-hvn-silver transition-colors group/link"
                              >
                                Details
                                <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                              </Link>
                            </div>
                          ) : (
                            <span className="text-xs text-hvn-mist">
                              --
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Bottom CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/configure"
              className="group relative flex items-center gap-2.5 rounded-full bg-hvn-neon px-10 py-4 text-sm font-semibold text-hvn-white transition-all duration-300 hover:bg-hvn-neon-bright hover:scale-[1.02]"
            >
              Configure Your Pod
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="group flex items-center gap-2 rounded-full border border-hvn-mist px-10 py-4 text-sm font-medium text-hvn-black transition-all duration-300 hover:border-hvn-steel hover:bg-hvn-cream"
            >
              Request Quote
              <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
