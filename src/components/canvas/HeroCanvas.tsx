"use client";

import { useInView } from "motion/react";
import dynamic from "next/dynamic";
import { useRef, useState, type RefObject } from "react";
import { usePrefersReducedMotion, type MousePosition } from "@/hooks";
import { cn } from "@/lib/utils";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";

// Three.js is ~150 kB gzipped and needs `window`: load it in the browser
// only, after the hero's text has painted.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

interface HeroCanvasProps {
  pointer: RefObject<MousePosition>;
  progress: RefObject<number>;
  className?: string;
}

/**
 * SSR-safe host for the hero WebGL scene. Fades the canvas in once the GL
 * context exists, pauses rendering while the hero is off screen, and falls
 * back to nothing (the CSS backdrop) if WebGL is unavailable.
 */
export function HeroCanvas({ pointer, progress, className }: HeroCanvasProps) {
  const container = useRef<HTMLDivElement>(null);
  const onScreen = useInView(container);
  const reducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  return (
    <div
      ref={container}
      aria-hidden
      className={cn(
        "transition-opacity duration-[1800ms] ease-out",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <CanvasErrorBoundary>
        <HeroScene
          pointer={pointer}
          progress={progress}
          active={onScreen}
          reducedMotion={reducedMotion}
          onReady={() => setReady(true)}
        />
      </CanvasErrorBoundary>
    </div>
  );
}
