"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Queries used across the site. */
export const MEDIA = {
  desktop: "(min-width: 1024px)",
  tablet: "(min-width: 768px)",
  finePointer: "(hover: hover) and (pointer: fine)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;

/**
 * Subscribe to a CSS media query. Returns `serverFallback` during SSR and
 * hydration, then the live value — without a state-in-effect re-render.
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(MEDIA.reducedMotion);
}
