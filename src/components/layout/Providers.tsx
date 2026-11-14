"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { ListingsProvider } from "@/components/listings/ListingsContext";
import { SmoothScroll } from "./SmoothScroll";

/**
 * Client-side providers for the whole app, composed once in the root layout.
 * Add future providers (auth session, saved-homes store, analytics) here.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <ListingsProvider>{children}</ListingsProvider>
      </SmoothScroll>
    </MotionConfig>
  );
}
