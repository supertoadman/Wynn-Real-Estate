"use client";

import type { ComponentPropsWithoutRef, PointerEvent } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends ComponentPropsWithoutRef<"div"> {
  /** Gold highlight that follows the pointer across the panel. */
  spotlight?: boolean;
}

/** Frosted-glass surface with an optional pointer-tracked gold spotlight. */
export function GlassCard({
  spotlight = true,
  className,
  children,
  onPointerMove,
  ...props
}: GlassCardProps) {
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (!spotlight || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      {...props}
      onPointerMove={handlePointerMove}
      className={cn("glass group/glass relative isolate rounded-2xl", className)}
    >
      {spotlight && (
        <div
          aria-hidden
          className="spotlight pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-700 group-hover/glass:opacity-100"
        />
      )}
      {children}
    </div>
  );
}
