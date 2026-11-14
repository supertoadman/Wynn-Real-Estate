import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "live" | "gold" | "crimson" | "glass" | "light" | "outline";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  /** Leading status dot; pulses when `tone` is `live`. */
  dot?: boolean;
  className?: string;
}

const TONES: Record<BadgeTone, string> = {
  live: "bg-obsidian/75 text-white ring-1 ring-white/15 backdrop-blur-md",
  gold: "bg-gold text-obsidian",
  crimson: "bg-crimson text-white",
  glass: "bg-obsidian/60 text-alabaster ring-1 ring-white/15 backdrop-blur-md",
  light: "bg-alabaster text-obsidian",
  outline: "text-current ring-1 ring-current/25",
};

const DOTS: Partial<Record<BadgeTone, string>> = {
  live: "text-gold-bright",
  glass: "text-white/70",
  outline: "text-crimson",
};

/** Compact status / label pill. */
export function Badge({ children, tone = "glass", dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10.5px] font-bold uppercase leading-none tracking-[0.16em] whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {dot && (
        <span className={cn("relative flex size-1.5", DOTS[tone])}>
          {tone === "live" && (
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-current" />
          )}
          <span className="relative size-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
