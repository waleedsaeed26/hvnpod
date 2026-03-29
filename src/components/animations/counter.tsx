"use client";

import { useEffect, useRef } from "react";
import { useInView, useSpring, useMotionValue } from "framer-motion";

interface CounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

export function Counter({
  target,
  suffix = "",
  prefix = "",
  className = "",
  duration = 2,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    damping: 30 + duration * 5,
    stiffness: 80 / duration,
  });
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, motionValue, target]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        const display = Number.isInteger(target)
          ? Math.round(latest)
          : latest.toFixed(1);
        ref.current.textContent = `${prefix}${display}${suffix}`;
      }
    });
    return unsubscribe;
  }, [spring, prefix, suffix, target]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
