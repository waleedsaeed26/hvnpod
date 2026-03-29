"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-hvn-white flex items-center justify-center relative overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-hvn-silver) 1px, transparent 1px), linear-gradient(90deg, var(--color-hvn-silver) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-hvn-cream/30 via-transparent to-hvn-white" />

      <div className="relative z-10 text-center px-4">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-hvn-mist bg-hvn-cream">
          <span className="font-[family-name:var(--font-heading)] text-2xl font-bold text-hvn-steel">
            !
          </span>
        </div>

        <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-hvn-black mb-4">
          Something went wrong
        </h1>

        <p className="text-hvn-steel text-sm sm:text-base max-w-md mx-auto mb-10">
          An unexpected error occurred. Please try again, and if the issue
          persists, contact our support team.
        </p>

        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-lg bg-hvn-black px-8 py-3.5 text-sm font-semibold text-hvn-white transition-all hover:bg-hvn-charcoal hover:shadow-elevated cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
