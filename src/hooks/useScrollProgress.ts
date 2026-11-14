"use client";

import {
  useMotionValueEvent,
  useScroll,
  type MotionValue,
  type UseScrollOptions,
} from "motion/react";
import { useRef, type RefObject } from "react";

type ScrollOffset = NonNullable<UseScrollOptions["offset"]>;

interface ScrollProgress {
  /** 0 → 1 as a MotionValue, for `useTransform` and `style` bindings. */
  progress: MotionValue<number>;
  /** The same value in a ref, for per-frame readers such as WebGL scenes. */
  progressRef: RefObject<number>;
}

/**
 * Scroll progress of `target` through the viewport.
 * The default offset runs from the element's top reaching the viewport top
 * until its bottom reaches the viewport top — i.e. while it scrolls away.
 */
export function useScrollProgress(
  target: RefObject<HTMLElement | null>,
  offset: ScrollOffset = ["start start", "end start"],
): ScrollProgress {
  const { scrollYProgress } = useScroll({ target, offset });
  const progressRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    progressRef.current = latest;
  });

  return { progress: scrollYProgress, progressRef };
}
