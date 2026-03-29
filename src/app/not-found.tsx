"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function NotFound() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="min-h-screen bg-hvn-white flex items-center justify-center relative overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-hvn-silver) 1px, transparent 1px), linear-gradient(90deg, var(--color-hvn-silver) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-hvn-cream/30 via-transparent to-hvn-white" />

      {/* Background symbol */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/images/logo/hvnpod-symbol-light.png"
          alt=""
          width={120}
          height={120}
          className="opacity-[0.08] select-none"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 text-center px-4">
        {/* Floating 404 */}
        <motion.h1
          className="font-[family-name:var(--font-heading)] text-8xl sm:text-[12rem] lg:text-[16rem] font-bold leading-none tracking-tighter text-hvn-mist select-none"
          animate={prefersReducedMotion ? {} : { y: [0, -12, 0] }}
          transition={prefersReducedMotion ? { duration: 0 } : {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-semibold text-hvn-black -mt-4 sm:-mt-8 mb-4">
            This space is empty.
          </h2>

          <p className="text-hvn-steel text-sm sm:text-base max-w-md mx-auto mb-10">
            The page you&apos;re looking for doesn&apos;t exist &mdash; or has
            been relocated.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-hvn-neon px-8 py-3.5 text-sm font-semibold text-hvn-white transition-all hover:bg-hvn-neon-bright"
          >
            Back to home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
