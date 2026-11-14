"use client";

import "lenis/dist/lenis.css";

import type { LenisOptions } from "lenis";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const OPTIONS: LenisOptions = {
  // GSAP's ticker drives Lenis (below) so scroll and animation share a frame.
  autoRaf: false,
  lerp: 0.085,
  wheelMultiplier: 0.9,
  // Native momentum already feels right on touch devices.
  syncTouch: false,
};

/**
 * Site-wide inertial scrolling. Lenis is stepped from GSAP's ticker and
 * reports every scroll to ScrollTrigger, keeping scrubbed animations locked
 * to the smoothed position. Lenis itself falls back to native scrolling for
 * visitors who prefer reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={OPTIONS}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}

function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}
