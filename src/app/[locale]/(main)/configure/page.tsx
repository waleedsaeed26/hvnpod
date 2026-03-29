"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Check, ChevronRight, Minus, Plus, ArrowRight, Sparkles } from "lucide-react";
import { useConfiguratorStore } from "@/stores/configurator-store";
import { calculateTotal, formatPrice, getVolumeDiscount } from "@/lib/utils";
import { QuoteModal } from "@/components/configurator/quote-modal";

// ─── Data ───────────────────────────────────────────────────────────────────

type ModelKey = "ONE" | "DUO" | "MEET";
type TierKey = "CORE" | "PLUS" | "SIGNATURE";

interface ModelData {
  name: string;
  capacity: string;
  description: string;
  basePrice: Record<TierKey, number>;
}

const MODELS: Record<ModelKey, ModelData> = {
  ONE: {
    name: "HVNPOD One",
    capacity: "1 person",
    description: "Perfect for solo focus, calls, and deep work",
    basePrice: { CORE: 85000, PLUS: 112000, SIGNATURE: 145000 },
  },
  DUO: {
    name: "HVNPOD Duo",
    capacity: "2 persons",
    description: "Ideal for 1:1 meetings, interviews, and mentoring",
    basePrice: { CORE: 132000, PLUS: 168000, SIGNATURE: 210000 },
  },
  MEET: {
    name: "HVNPOD Meet",
    capacity: "4 persons",
    description: "Team huddles, client calls, presentations",
    basePrice: { CORE: 187000, PLUS: 235000, SIGNATURE: 295000 },
  },
};

const TIER_FEATURES: Record<TierKey, string[]> = {
  CORE: [
    "30dB acoustic reduction",
    "LED lighting",
    "Power outlets x2",
    "Ventilation system",
    "Acoustic panels",
  ],
  PLUS: [
    "Everything in Core",
    "Smart lighting control",
    "USB-C charging x4",
    "Enhanced ventilation",
    "Premium fabric interior",
  ],
  SIGNATURE: [
    "Everything in Plus",
    "Motorized privacy glass",
    "Climate control",
    "Video conferencing setup",
    "Custom color options",
  ],
};

const TIER_LABELS: Record<TierKey, string> = {
  CORE: "Core",
  PLUS: "Plus",
  SIGNATURE: "Signature",
};

const TIER_SUBTITLES: Record<TierKey, string> = {
  CORE: "Essential acoustic privacy",
  PLUS: "Smart features & comfort",
  SIGNATURE: "The full HVNPOD experience",
};

interface PodColor {
  key: string;
  name: string;
  hex: string;
  textClass: string;
}

const MODEL_IMAGES: Record<ModelKey, string> = {
  ONE: "/images/products/hvnpod-one-white.png",
  DUO: "/images/products/hvnpod-one-studio.png",
  MEET: "/images/products/hvnpod-one-beige.png",
};

const COLORS: PodColor[] = [
  { key: "cream", name: "Cream", hex: "#E8E0D4", textClass: "text-hvn-black" },
  { key: "charcoal", name: "Charcoal", hex: "#3A3A3A", textClass: "text-hvn-black" },
  { key: "forest", name: "Forest", hex: "#2D5A40", textClass: "text-hvn-black" },
  { key: "blue", name: "Blue", hex: "#5B8A9A", textClass: "text-hvn-black" },
];

// ─── Animated Number ─────────────────────────────────────────────────────────

function AnimatedPrice({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 120, damping: 20 });
  const display = useTransform(spring, (v) => formatPrice(Math.round(v)));
  const [displayed, setDisplayed] = useState(formatPrice(value));

  useEffect(() => {
    spring.set(value);
    const unsub = display.on("change", (v) => setDisplayed(v));
    return unsub;
  }, [value, spring, display]);

  return <span className="font-[family-name:var(--font-mono)]">{displayed}</span>;
}

// ─── Step Wrapper ─────────────────────────────────────────────────────────────

function StepContainer({
  step,
  title,
  subtitle,
  isActive,
  isCompleted,
  children,
}: {
  step: number;
  title: string;
  subtitle?: string;
  isActive: boolean;
  isCompleted: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
      className="rounded-2xl border border-hvn-mist/60 bg-hvn-cream overflow-hidden"
    >
      {/* Step header */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-hvn-mist/50">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
            isCompleted
              ? "bg-hvn-neon text-hvn-white"
              : isActive
              ? "border-2 border-hvn-forest text-hvn-black"
              : "border border-hvn-mist text-hvn-steel"
          }`}
        >
          {isCompleted ? <Check className="h-4 w-4" /> : step}
        </div>
        <div>
          <h3
            className={`font-[family-name:var(--font-heading)] text-sm font-semibold tracking-wide uppercase ${
              isActive || isCompleted ? "text-hvn-black" : "text-hvn-steel"
            }`}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-hvn-steel mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Step content */}
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

// ─── Model Card ───────────────────────────────────────────────────────────────

function ModelCard({
  modelKey,
  data,
  isSelected,
  onSelect,
  currentTier,
}: {
  modelKey: ModelKey;
  data: ModelData;
  isSelected: boolean;
  onSelect: () => void;
  currentTier: TierKey | null;
}) {
  const price = currentTier ? data.basePrice[currentTier] : data.basePrice.CORE;

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      aria-label={`Select ${data.name}`}
      aria-pressed={isSelected}
      className={`relative w-full rounded-xl border p-5 text-left transition-all duration-200 cursor-pointer group ${
        isSelected
          ? "border-hvn-forest bg-hvn-forest/10 shadow-[0_0_0_1px_var(--color-hvn-forest)]"
          : "border-hvn-mist/60 bg-hvn-pearl/40 hover:border-hvn-steel/60 hover:bg-hvn-pearl/60"
      }`}
    >
      {isSelected && (
        <motion.div
          layoutId="model-selection-ring"
          className="absolute inset-0 rounded-xl border-2 border-hvn-forest pointer-events-none"
          initial={false}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      <div className="flex items-start gap-4">
        {/* Model image */}
        <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-hvn-mist/20">
          <Image
            src={MODEL_IMAGES[modelKey]}
            alt={data.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span
              className={`font-[family-name:var(--font-heading)] text-lg font-semibold ${
                isSelected ? "text-hvn-black" : "text-hvn-pearl"
              }`}
            >
              {data.name}
            </span>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase ${
                isSelected
                  ? "bg-hvn-forest/30 text-hvn-forest-light"
                  : "bg-hvn-mist/50 text-hvn-steel"
              }`}
            >
              {data.capacity}
            </span>
          </div>
          <p className="text-sm text-hvn-steel leading-relaxed">
            {data.description}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div
            className={`text-base font-semibold font-[family-name:var(--font-mono)] ${
              isSelected ? "text-hvn-black" : "text-hvn-silver"
            }`}
          >
            {formatPrice(price)}
          </div>
          <div className="text-[10px] text-hvn-steel mt-0.5">starting at</div>
        </div>
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-hvn-neon"
        >
          <Check className="h-3 w-3 text-hvn-black" />
        </motion.div>
      )}
    </motion.button>
  );
}

// ─── Tier Card ────────────────────────────────────────────────────────────────

function TierCard({
  tierKey,
  price,
  isSelected,
  onSelect,
}: {
  tierKey: TierKey;
  price: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const features = TIER_FEATURES[tierKey];
  const isSignature = tierKey === "SIGNATURE";

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      aria-label={`Select ${TIER_LABELS[tierKey]} tier`}
      aria-pressed={isSelected}
      className={`relative w-full rounded-xl border p-5 text-left transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-hvn-forest bg-hvn-forest/10 shadow-[0_0_0_1px_var(--color-hvn-forest)]"
          : isSignature
          ? "border-hvn-mist/80 bg-hvn-mist/10 hover:border-hvn-steel/60"
          : "border-hvn-mist/60 bg-hvn-pearl/40 hover:border-hvn-steel/60 hover:bg-hvn-pearl/60"
      }`}
    >
      {isSelected && (
        <motion.div
          layoutId="tier-selection-ring"
          className="absolute inset-0 rounded-xl border-2 border-hvn-forest pointer-events-none"
          initial={false}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {isSignature && !isSelected && (
        <div className="absolute -top-2.5 left-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-hvn-mist px-2.5 py-0.5 text-[10px] font-medium text-hvn-silver uppercase tracking-wider">
            <Sparkles className="h-2.5 w-2.5" />
            Best Experience
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div
            className={`font-[family-name:var(--font-heading)] text-base font-semibold ${
              isSelected ? "text-hvn-black" : "text-hvn-pearl"
            }`}
          >
            {TIER_LABELS[tierKey]}
          </div>
          <div className="text-xs text-hvn-steel mt-0.5">
            {TIER_SUBTITLES[tierKey]}
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-sm font-semibold font-[family-name:var(--font-mono)] ${
              isSelected ? "text-hvn-black" : "text-hvn-silver"
            }`}
          >
            {formatPrice(price)}
          </div>
          <div className="text-[10px] text-hvn-steel">per unit</div>
        </div>
      </div>

      <ul className="space-y-1.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-xs">
            <div
              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                isSelected ? "bg-hvn-neon" : "bg-hvn-mist"
              }`}
            />
            <span className={isSelected ? "text-hvn-steel" : "text-hvn-steel"}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-hvn-neon"
        >
          <Check className="h-3 w-3 text-hvn-black" />
        </motion.div>
      )}
    </motion.button>
  );
}

// ─── Color Swatch ─────────────────────────────────────────────────────────────

function ColorSwatch({
  color,
  isSelected,
  onSelect,
}: {
  color: PodColor;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      aria-label={`Select ${color.name} color`}
      aria-pressed={isSelected}
      className={`relative rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-hvn-forest shadow-[0_0_0_1px_var(--color-hvn-forest)]"
          : "border-hvn-mist/60 hover:border-hvn-steel/60"
      }`}
    >
      <div
        className="h-14 w-full rounded-lg mb-3"
        style={{ backgroundColor: color.hex }}
      />
      <div
        className={`text-xs font-medium text-center ${
          isSelected ? "text-hvn-black" : "text-hvn-steel"
        }`}
      >
        {color.name}
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-hvn-neon"
        >
          <Check className="h-3 w-3 text-hvn-black" />
        </motion.div>
      )}
    </motion.button>
  );
}

// ─── Summary Panel ────────────────────────────────────────────────────────────

function SummaryPanel({
  model,
  tier,
  color,
  quantity,
  basePrice,
  onOpenModal,
}: {
  model: ModelKey | null;
  tier: TierKey | null;
  color: string | null;
  quantity: number;
  basePrice: number;
  onOpenModal: () => void;
}) {
  const discount = getVolumeDiscount(quantity);
  const total = calculateTotal(basePrice, quantity);
  const selectedColor = COLORS.find((c) => c.key === color);
  const isConfigured = model && tier && color;

  return (
    <div className="rounded-2xl border border-hvn-mist/60 bg-hvn-cream overflow-hidden sticky top-8">
      {/* Header */}
      <div className="px-6 py-5 border-b border-hvn-mist/50">
        <h2 className="font-[family-name:var(--font-heading)] text-sm font-semibold tracking-widest uppercase text-hvn-silver">
          Your Configuration
        </h2>
      </div>

      {/* Config lines */}
      <div className="px-6 py-5 space-y-3 border-b border-hvn-mist/50">
        <SummaryLine
          label="Model"
          value={model ? MODELS[model].name : undefined}
        />
        <SummaryLine
          label="Tier"
          value={tier ? TIER_LABELS[tier] : undefined}
        />
        <SummaryLine
          label="Color"
          value={selectedColor?.name}
          colorHex={selectedColor?.hex}
        />
      </div>

      {/* Pricing */}
      <div className="px-6 py-5 space-y-3 border-b border-hvn-mist/50">
        <div className="flex justify-between text-sm">
          <span className="text-hvn-steel">Unit price</span>
          <span className="text-hvn-steel font-medium">
            {basePrice ? formatPrice(basePrice) : "—"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-hvn-steel">Quantity</span>
          <span className="text-hvn-steel font-medium">{quantity}</span>
        </div>
        {discount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex justify-between text-sm"
          >
            <span className="text-hvn-forest-light">Volume discount</span>
            <span className="text-hvn-forest-light font-medium">
              -{Math.round(discount * 100)}%
            </span>
          </motion.div>
        )}
      </div>

      {/* Total */}
      <div className="px-6 py-5 border-b border-hvn-mist/50">
        <div className="flex items-end justify-between">
          <span className="text-sm text-hvn-silver font-medium">Total</span>
          <span className="font-[family-name:var(--font-heading)] text-2xl font-bold text-hvn-black">
            {isConfigured ? <AnimatedPrice value={total} /> : "—"}
          </span>
        </div>
        {discount > 0 && (
          <div className="mt-1 text-right text-xs text-hvn-forest-light">
            You save {formatPrice(basePrice * quantity - total)}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 py-5">
        <motion.button
          onClick={onOpenModal}
          disabled={!isConfigured}
          whileHover={isConfigured ? { scale: 1.01 } : {}}
          whileTap={isConfigured ? { scale: 0.99 } : {}}
          className={`group w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 ${
            isConfigured
              ? "bg-hvn-cream text-hvn-black hover:bg-hvn-white cursor-pointer shadow-[0_0_0_0_rgba(255,255,255,0)] hover:shadow-[0_0_24px_rgba(232,224,212,0.15)]"
              : "bg-hvn-mist/40 text-hvn-steel cursor-not-allowed"
          }`}
        >
          Request Quote
          {isConfigured && (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </motion.button>

        {!isConfigured && (
          <p className="mt-3 text-center text-xs text-hvn-steel">
            Complete all steps to request a quote
          </p>
        )}

        <p className="mt-4 text-center text-xs text-hvn-steel leading-relaxed">
          No payment required. Our team will contact you within 24 hours.
        </p>
      </div>
    </div>
  );
}

function SummaryLine({
  label,
  value,
  colorHex,
}: {
  label: string;
  value?: string;
  colorHex?: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-hvn-steel">{label}</span>
      <AnimatePresence mode="wait">
        {value ? (
          <motion.span
            key={value}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-hvn-steel font-medium"
          >
            {colorHex && (
              <span
                className="h-3 w-3 rounded-full border border-hvn-mist"
                style={{ backgroundColor: colorHex }}
              />
            )}
            {value}
          </motion.span>
        ) : (
          <motion.span
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-hvn-mist"
          >
            —
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConfiguratorPage() {
  const {
    model,
    tier,
    color,
    quantity,
    basePrice,
    setModel,
    setTier,
    setColor,
    setQuantity,
    setBasePrice,
  } = useConfiguratorStore();

  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const quantityRef = useRef<HTMLDivElement>(null);

  const typedModel = model as ModelKey | null;
  const typedTier = tier as TierKey | null;

  // Sync base price when model or tier changes
  useEffect(() => {
    if (typedModel && typedTier) {
      setBasePrice(MODELS[typedModel].basePrice[typedTier]);
    }
  }, [typedModel, typedTier, setBasePrice]);

  const handleModelSelect = (key: ModelKey) => {
    setModel(key);
    // Reset tier and color when model changes
    setTier(null as unknown as string);
    setColor(null as unknown as string);
  };

  const handleTierSelect = (key: TierKey) => {
    setTier(key);
    if (typedModel) {
      setBasePrice(MODELS[typedModel].basePrice[key]);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const next = Math.max(1, Math.min(99, quantity + delta));
    setQuantity(next);
  };

  const currentPrice = typedModel && typedTier
    ? MODELS[typedModel].basePrice[typedTier]
    : 0;

  const total = calculateTotal(currentPrice, quantity);
  const discount = getVolumeDiscount(quantity);

  return (
    <>
      {/* Background */}
      <div className="min-h-screen bg-hvn-white relative">
        {/* Subtle grid */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-hvn-silver) 1px, transparent 1px), linear-gradient(90deg, var(--color-hvn-silver) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Radial glow top */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-hvn-forest/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-hvn-mist px-4 py-1.5 text-xs text-hvn-steel mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-hvn-neon animate-pulse" />
              Build your HVNPOD
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl lg:text-6xl font-bold text-hvn-black tracking-tight">
              Configure Your Pod
            </h1>
            <p className="mt-4 text-hvn-steel text-lg max-w-xl mx-auto leading-relaxed">
              Choose your model, tier, and finish. We&apos;ll handle the rest.
            </p>
          </motion.div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Steps */}
            <div className="lg:col-span-2 space-y-6">

              {/* ── Step 1: Model ── */}
              <StepContainer
                step={1}
                title="Choose Model"
                subtitle="Select the pod size that fits your team"
                isActive={true}
                isCompleted={!!typedModel}
              >
                <div className="space-y-3">
                  {(Object.keys(MODELS) as ModelKey[]).map((key) => (
                    <ModelCard
                      key={key}
                      modelKey={key}
                      data={MODELS[key]}
                      isSelected={typedModel === key}
                      onSelect={() => handleModelSelect(key)}
                      currentTier={typedTier}
                    />
                  ))}
                </div>
              </StepContainer>

              {/* ── Step 2: Tier ── */}
              <AnimatePresence>
                {typedModel && (
                  <StepContainer
                    step={2}
                    title="Select Tier"
                    subtitle="Pick your feature level"
                    isActive={!typedTier}
                    isCompleted={!!typedTier}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(Object.keys(TIER_FEATURES) as TierKey[]).map((key) => (
                        <TierCard
                          key={key}
                          tierKey={key}
                          price={MODELS[typedModel].basePrice[key]}
                          isSelected={typedTier === key}
                          onSelect={() => handleTierSelect(key)}
                        />
                      ))}
                    </div>
                  </StepContainer>
                )}
              </AnimatePresence>

              {/* ── Step 3: Color ── */}
              <AnimatePresence>
                {typedModel && typedTier && (
                  <StepContainer
                    step={3}
                    title="Choose Color"
                    subtitle="Select your exterior finish"
                    isActive={!color}
                    isCompleted={!!color}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {COLORS.map((c) => (
                        <ColorSwatch
                          key={c.key}
                          color={c}
                          isSelected={color === c.key}
                          onSelect={() => setColor(c.key)}
                        />
                      ))}
                    </div>
                  </StepContainer>
                )}
              </AnimatePresence>

              {/* ── Step 4: Quantity & Message ── */}
              <AnimatePresence>
                {typedModel && typedTier && color && (
                  <StepContainer
                    step={4}
                    title="Quantity & Notes"
                    subtitle="How many pods, and anything else we should know"
                    isActive={true}
                    isCompleted={false}
                  >
                    <div className="space-y-6" ref={quantityRef}>
                      {/* Quantity control */}
                      <div>
                        <label className="block text-xs text-hvn-steel font-medium uppercase tracking-wider mb-3">
                          Number of pods
                        </label>
                        <div className="flex items-center gap-0">
                          <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                            className="flex h-11 w-11 items-center justify-center rounded-l-xl border border-hvn-mist bg-hvn-pearl/60 text-hvn-steel transition-all hover:bg-hvn-mist/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hvn-warm/50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <div className="flex h-11 w-20 items-center justify-center border-y border-hvn-mist bg-hvn-pearl/40 text-lg font-semibold text-hvn-black font-[family-name:var(--font-heading)]">
                            {quantity}
                          </div>
                          <button
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= 99}
                            aria-label="Increase quantity"
                            className="flex h-11 w-11 items-center justify-center rounded-r-xl border border-hvn-mist bg-hvn-pearl/60 text-hvn-steel transition-all hover:bg-hvn-mist/40 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hvn-warm/50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <div className="ml-4">
                            {discount > 0 ? (
                              <motion.div
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-1.5 rounded-full bg-hvn-forest/20 border border-hvn-forest/30 px-3 py-1"
                              >
                                <span className="text-xs font-semibold text-hvn-forest-light">
                                  {Math.round(discount * 100)}% off
                                </span>
                                <span className="text-xs text-hvn-steel">volume discount</span>
                              </motion.div>
                            ) : (
                              <span className="text-xs text-hvn-steel">
                                Order 3+ for volume discounts
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Volume discount tiers */}
                        <div className="mt-4 flex items-center gap-3 flex-wrap">
                          {[
                            { label: "3–5 units", pct: "5%" },
                            { label: "6–9 units", pct: "8%" },
                            { label: "10+ units", pct: "12%" },
                          ].map(({ label, pct }) => (
                            <div
                              key={label}
                              className="flex items-center gap-1.5 text-xs text-hvn-steel"
                            >
                              <ChevronRight className="h-3 w-3 text-hvn-mist" />
                              <span>{label}:</span>
                              <span className="text-hvn-steel font-medium">{pct} off</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs text-hvn-steel font-medium uppercase tracking-wider mb-3">
                          Additional notes{" "}
                          <span className="normal-case text-hvn-mist font-normal">(optional)</span>
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                          placeholder="Installation requirements, timeline, space dimensions, or any other notes..."
                          className="w-full rounded-xl border border-hvn-mist bg-hvn-pearl/40 px-4 py-3 text-sm text-hvn-steel placeholder:text-hvn-silver focus:outline-none focus:border-hvn-steel transition-colors resize-none"
                        />
                      </div>

                      {/* Mobile CTA */}
                      <div className="lg:hidden">
                        <motion.button
                          onClick={() => setIsModalOpen(true)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="group w-full flex items-center justify-center gap-2 rounded-xl bg-hvn-cream py-3.5 text-sm font-semibold text-hvn-black transition-all hover:bg-hvn-white cursor-pointer"
                        >
                          Request Quote
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </motion.button>
                        <p className="mt-3 text-center text-xs text-hvn-steel">
                          Total: <AnimatedPrice value={total} />
                          {discount > 0 && (
                            <span className="ml-2 text-hvn-forest-light">
                              ({Math.round(discount * 100)}% off)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </StepContainer>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Summary (desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <SummaryPanel
                model={typedModel}
                tier={typedTier}
                color={color}
                quantity={quantity}
                basePrice={currentPrice}
                onOpenModal={() => setIsModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        config={{
          model: typedModel ? MODELS[typedModel].name : "",
          tier: typedTier ? TIER_LABELS[typedTier] : "",
          color: COLORS.find((c) => c.key === color)?.name ?? "",
          quantity,
          price: total,
          message,
        }}
      />
    </>
  );
}
