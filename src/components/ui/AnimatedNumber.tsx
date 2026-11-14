"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MEDIA } from "@/hooks";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Seconds. */
  duration?: number;
  /** Hold at zero until scrolled into view, then count up once. */
  startOnView?: boolean;
  className?: string;
}

/**
 * Tabular-figure counter. Counts up from zero on first view, then tweens
 * between values whenever `value` changes. Writes straight to the DOM node,
 * so a running count never re-renders React.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.8,
  startOnView = true,
  className,
}: AnimatedNumberProps) {
  const element = useRef<HTMLSpanElement>(null);
  const counter = useRef({ value: 0, started: false });

  const format = (amount: number) =>
    `${prefix}${amount.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useGSAP(
    () => {
      const node = element.current;
      if (!node) return;
      const state = counter.current;

      if (window.matchMedia(MEDIA.reducedMotion).matches) {
        state.value = value;
        node.textContent = format(value);
        return;
      }

      const isFirstRun = !state.started;
      state.started = true;
      if (isFirstRun) node.textContent = format(0);

      gsap.to(state, {
        value,
        duration: isFirstRun ? duration : duration * 0.5,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => {
          node.textContent = format(state.value);
        },
        scrollTrigger:
          isFirstRun && startOnView
            ? { trigger: node, start: "top 92%", once: true }
            : undefined,
      });
    },
    { dependencies: [value, decimals, prefix, suffix] },
  );

  // Server render and no-JS fallback show the final figure.
  return (
    <span ref={element} className={cn("tabular-nums", className)}>
      {format(value)}
    </span>
  );
}
