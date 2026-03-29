"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useRef, useState, useEffect, useCallback, type MouseEvent } from "react";

const products = [
  {
    key: "one",
    capacity: "1",
    capacityLabel: "person",
    tier: "Solo Focus Pod",
    price: 85000,
    image: "/images/products/hvnpod-one-white.png",
  },
  {
    key: "duo",
    capacity: "2",
    capacityLabel: "persons",
    tier: "Collaboration Pod",
    price: 132000,
    image: "/images/products/hvnpod-one-blue.png",
  },
  {
    key: "meet",
    capacity: "4",
    capacityLabel: "persons",
    tier: "Team Meeting Pod",
    price: 187000,
    image: "/images/products/hvnpod-one-forest.png",
  },
];

function AnimatedPrice({ target, inView }: { target: number; inView: boolean }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplayed(current);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <>{formatPrice(displayed)}</>;
}

function ProductCard({
  product,
  index,
  t,
}: {
  product: (typeof products)[number];
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 30 });

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      rotateY.set(x * 6);
      rotateX.set(-y * 6);
    },
    [rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      }}
      className="group relative [perspective:1200px]"
    >
      <motion.div
        style={{ rotateX: springX, rotateY: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden rounded-3xl border border-hvn-mist/40 bg-hvn-white transition-shadow duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.10),0_0_0_1px_var(--color-hvn-neon-glow)]"
      >
        {/* Hover glow overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(600px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),var(--color-hvn-neon-glow),transparent_40%)]" />

        {/* Product visual area */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-hvn-cream via-hvn-pearl to-hvn-cream/60">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle, var(--color-hvn-forest) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }} />

          {/* Product image */}
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 + 0.3, duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={product.image}
              alt={t(`models.${product.key}.name`)}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          </motion.div>

          {/* Capacity badge */}
          <div className="absolute top-6 right-6">
            <div className="flex items-center gap-1.5 rounded-full bg-hvn-white/90 px-3 py-1.5 border border-hvn-mist/30">
              <Users className="h-3.5 w-3.5 text-hvn-forest" />
              <span className="text-xs font-medium text-hvn-charcoal">
                {product.capacity} {product.capacityLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-7 space-y-4">
          {/* Typography hierarchy */}
          <div className="space-y-1">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-hvn-forest">
              {product.tier}
            </p>
            <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-hvn-black whitespace-nowrap">
              {t(`models.${product.key}.name`)}
            </h3>
          </div>

          <p className="text-sm text-hvn-steel leading-relaxed line-clamp-2 min-h-[40px]">
            {t(`models.${product.key}.description`)}
          </p>

          {/* Price */}
          <div className="pt-3 border-t border-hvn-mist/50">
            <p className="text-[11px] font-medium tracking-wide uppercase text-hvn-silver">
              Starting from
            </p>
            <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-hvn-black mt-0.5">
              <AnimatedPrice target={product.price} inView={isInView} />
            </p>
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <Link
              href="/configure"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-hvn-neon px-5 py-3 text-sm font-semibold text-hvn-white transition-all duration-300 hover:bg-hvn-neon-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hvn-warm/50"
            >
              {t("products.configure")}
            </Link>
            <Link
              href="/contact"
              aria-label={`${t("nav.contact")} — ${t(`models.${product.key}.name`)}`}
              className="flex items-center justify-center rounded-xl border border-hvn-mist px-4 py-3 text-sm font-medium text-hvn-steel transition-all duration-300 hover:bg-hvn-cream hover:text-hvn-black hover:border-hvn-silver focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hvn-warm/50"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ProductLineup() {
  const t = useTranslations();

  return (
    <section className="py-32 lg:py-40 bg-hvn-cream/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="text-center mb-20"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs font-semibold tracking-[0.3em] uppercase text-hvn-forest mb-4"
          >
            The Collection
          </motion.p>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-hvn-black">
            {t("products.title")}
          </h2>
          <p className="mt-5 text-lg text-hvn-steel max-w-2xl mx-auto leading-relaxed">
            {t("products.subtitle")}
          </p>
        </motion.div>

        {/* Product cards grid */}
        <div className="grid gap-8 lg:gap-10 md:grid-cols-3">
          {products.map((product, i) => (
            <ProductCard key={product.key} product={product} index={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
