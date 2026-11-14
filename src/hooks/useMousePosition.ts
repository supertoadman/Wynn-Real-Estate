"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface MousePosition {
  /** Viewport pixels. */
  x: number;
  y: number;
  /** Normalised to -1 … 1 with the origin at the viewport centre; +y is up. */
  nx: number;
  ny: number;
}

/**
 * Tracks the pointer in a ref — no re-renders — so per-frame consumers
 * (WebGL scenes, GSAP tickers) can read it at 60fps for free.
 * Touch input is ignored so scenes stay composed while a finger scrolls.
 */
export function useMousePosition(): RefObject<MousePosition> {
  const position = useRef<MousePosition>({ x: 0, y: 0, nx: 0, ny: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const current = position.current;
      current.x = event.clientX;
      current.y = event.clientY;
      current.nx = (event.clientX / window.innerWidth) * 2 - 1;
      current.ny = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return position;
}
