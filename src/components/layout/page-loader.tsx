"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSymbol } from "@/components/brand/animated-symbol";

export function PageLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only show on first visit per session
    try {
      const hasVisited = sessionStorage.getItem("hvnpod-loaded");
      if (!hasVisited) {
        setShow(true);
        sessionStorage.setItem("hvnpod-loaded", "1");

        // Auto-dismiss after animation completes
        const timer = setTimeout(() => {
          setShow(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // sessionStorage may be unavailable (SSR, private browsing)
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-hvn-white"
        >
          <AnimatedSymbol size={80} animate={true} color="var(--color-hvn-charcoal)" strokeWidth={1.5} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
