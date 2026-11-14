"use client";

import { useLenis } from "lenis/react";
import { useEffect } from "react";

/** Freeze page scrolling while an overlay (drawer, modal) is open. */
export function useScrollLock(locked: boolean): void {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;

    lenis?.stop();
    root.style.overflow = "hidden";

    return () => {
      root.style.overflow = previousOverflow;
      lenis?.start();
    };
  }, [locked, lenis]);
}
