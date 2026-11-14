import type { Transition, Variants } from "motion/react";

/**
 * Shared motion language. Components import presets from here rather than
 * hard-coding curves, so the whole site can be re-timed in one place.
 */

/** Cubic-bézier curves, mirrored as `--ease-*` tokens in globals.css. */
export const EASE = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuint: [0.22, 1, 0.36, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
} as const satisfies Record<string, [number, number, number, number]>;

/** GSAP ease names with the same character as the curves above. */
export const GSAP_EASE = {
  out: "expo.out",
  inOut: "power4.inOut",
  scrub: "none",
} as const;

export const DURATION = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
  cinematic: 1.6,
} as const;

/** Spring presets for pointer-driven motion. */
export const SPRING = {
  magnetic: { stiffness: 220, damping: 16, mass: 0.6 },
  cursor: { stiffness: 520, damping: 40, mass: 0.5 },
  panel: { stiffness: 260, damping: 32, mass: 0.9 },
} as const;

export const transition = {
  base: { duration: DURATION.base, ease: EASE.outExpo },
  slow: { duration: DURATION.slow, ease: EASE.outExpo },
} as const satisfies Record<string, Transition>;

/** Fade + rise, for copy blocks and cards. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE.outExpo, delay },
  }),
};

/** Parent that staggers `fadeUp` / `maskUp` children. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Word rising out of an overflow-hidden mask — the kinetic type reveal. */
export const maskUp: Variants = {
  hidden: { y: "115%", rotate: 4 },
  visible: {
    y: "0%",
    rotate: 0,
    transition: { duration: DURATION.cinematic, ease: EASE.outExpo },
  },
};

/** Image wipe used by the neighborhood explorer and gallery. */
export const wipe: Variants = {
  enter: { clipPath: "inset(0% 0% 100% 0%)", scale: 1.12 },
  center: {
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE.inOutQuart },
  },
  exit: {
    opacity: 0.4,
    scale: 1.04,
    transition: { duration: DURATION.slow, ease: EASE.inOutQuart },
  },
};

/** Viewport options for scroll-triggered `whileInView` reveals. */
export const inView = { once: true, margin: "0px 0px -12% 0px" } as const;
