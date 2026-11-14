"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One place to register GSAP plugins. Import `gsap`, `ScrollTrigger` and
 * `useGSAP` from here — never from the packages directly — so registration
 * is guaranteed and happens exactly once.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** Media-query conditions for `gsap.matchMedia()`. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 1024px)";

export { gsap, ScrollTrigger, useGSAP };
