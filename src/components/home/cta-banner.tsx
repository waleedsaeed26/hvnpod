"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTABanner() {
  const t = useTranslations("cta");

  return (
    <section className="py-24 lg:py-32 bg-hvn-white relative overflow-hidden">
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-hvn-silver) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-hvn-black">
            {t("readyTitle")}
          </h2>
          <p className="text-lg text-hvn-steel">{t("readySubtitle")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group flex items-center gap-2 rounded-full bg-hvn-black px-8 py-3.5 text-sm font-semibold text-hvn-white transition-all hover:bg-hvn-charcoal"
            >
              {t("bookTrial")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/configure"
              className="flex items-center gap-2 rounded-full border border-hvn-mist px-8 py-3.5 text-sm font-medium text-hvn-black transition-all hover:border-hvn-steel"
            >
              {t("requestQuote")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
