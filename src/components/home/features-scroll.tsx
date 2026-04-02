"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { TextReveal } from "@/components/animations/text-reveal";
import { Counter } from "@/components/animations/counter";
import { FadeInView } from "@/components/animations/fade-in-view";

/* ─── Block 1: Focus — cinematic stat reveal ─── */
function FocusBlock({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-16">
      <div className="flex flex-col lg:flex-row items-start lg:items-end gap-10 lg:gap-20">
        {/* Giant number */}
        <FadeInView direction="left" duration={0.8}>
          <div className="flex items-baseline gap-2">
            <Counter
              target={30}
              className="font-[family-name:var(--font-heading)] text-8xl sm:text-9xl lg:text-[160px] font-bold leading-none tracking-tighter text-hvn-forest"
              duration={2.5}
            />
            <span className="font-[family-name:var(--font-mono)] text-2xl sm:text-3xl lg:text-4xl font-medium text-hvn-forest/50 -translate-y-2 lg:-translate-y-4">
              dB
            </span>
          </div>
        </FadeInView>

        {/* Text */}
        <FadeInView direction="right" delay={0.3} duration={0.7} className="lg:pb-4">
          <div className="space-y-4 max-w-md">
            <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold tracking-tight text-hvn-black">
              {t("focusHeadline")}
            </h3>
            <p className="text-base lg:text-lg leading-relaxed text-hvn-steel">
              {t("focusBody")}
            </p>
            <span className="inline-block font-[family-name:var(--font-mono)] text-xs tracking-wide text-hvn-forest/70">
              {t("focusSpec")}
            </span>
          </div>
        </FadeInView>
      </div>
    </div>
  );
}

/* ─── Block 2: Space — split with image ─── */
function SpaceBlock({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="bg-hvn-cream/40">
      <div className="mx-auto max-w-6xl px-6 lg:px-16 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Pod image */}
          <FadeInView direction="left" duration={0.8}>
            <div className="aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden">
              <Image
                src="/images/products/hvnpod-one-white.png"
                alt="HVNPOD One acoustic pod"
                width={500}
                height={667}
                className="w-full h-full object-cover"
              />
            </div>
          </FadeInView>

          {/* Text */}
          <FadeInView direction="right" delay={0.15} duration={0.7}>
            <div className="space-y-6">
              <h3 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight leading-tight text-hvn-black">
                {t("spaceHeadline")}
              </h3>
              <p className="text-base lg:text-lg leading-relaxed text-hvn-steel max-w-lg">
                {t("spaceBody")}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {[t("spaceSpec1"), t("spaceSpec2"), t("spaceSpec3")].map((spec) => (
                  <span
                    key={spec}
                    className="rounded-full border border-hvn-mist bg-hvn-white px-4 py-2 font-[family-name:var(--font-mono)] text-xs tracking-wide text-hvn-steel"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </FadeInView>
        </div>
      </div>
    </div>
  );
}

/* ─── Block 3: Craft — centered typographic statement ─── */
function CraftBlock({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-16 text-center">
      {/* Decorative line */}
      <div className="mx-auto mb-20 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-hvn-mist/60 to-transparent" />

      <TextReveal
        className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight text-hvn-black"
      >
        {t("craftHeadline")}
      </TextReveal>

      <FadeInView direction="up" delay={0.2} duration={0.6}>
        <p className="mt-8 mx-auto max-w-xl text-base lg:text-lg leading-relaxed text-hvn-steel">
          {t("craftBody")}
        </p>
        <span className="inline-block mt-6 font-[family-name:var(--font-mono)] text-xs tracking-wide text-hvn-forest/70">
          {t("craftSpec")}
        </span>
      </FadeInView>

      {/* Decorative line */}
      <div className="mx-auto mt-20 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-hvn-mist/60 to-transparent" />
    </div>
  );
}

/* ─── Main component ─── */
export function FeaturesScroll() {
  const t = useTranslations("whyHvnpod");

  return (
    <section aria-label={t("eyebrow")} className="bg-hvn-white">
      {/* Section header */}
      <div className="pt-24 lg:pt-32 pb-16 lg:pb-24 text-center mx-auto max-w-4xl px-6 lg:px-16">
        <FadeInView direction="up" duration={0.5}>
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-hvn-forest mb-6">
            {t("eyebrow")}
          </p>
        </FadeInView>
        <TextReveal
          className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-hvn-black"
        >
          {t("headline")}
        </TextReveal>
      </div>

      {/* Block 1: Focus */}
      <div className="pb-24 lg:pb-32">
        <FocusBlock t={t} />
      </div>

      {/* Block 2: Space */}
      <SpaceBlock t={t} />

      {/* Block 3: Craft */}
      <div className="py-24 lg:py-32">
        <CraftBlock t={t} />
      </div>
    </section>
  );
}
