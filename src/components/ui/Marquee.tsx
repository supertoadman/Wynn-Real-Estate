import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
}

/**
 * Infinite ticker. The list is rendered twice and the track slides exactly
 * half its width, so the loop is seamless at any viewport size.
 */
export function Marquee({ items, className }: MarqueeProps) {
  const track = (hidden: boolean) => (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <Fragment key={item}>
          <span
            className={cn(
              "px-8 font-display text-[clamp(1.75rem,4vw,3.5rem)] font-semibold uppercase tracking-[-0.02em] whitespace-nowrap",
              index % 2 === 1 ? "text-outline text-alabaster/45" : "text-alabaster",
            )}
          >
            {item}
          </span>
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-gold" aria-hidden>
            <path
              fill="currentColor"
              d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z"
            />
          </svg>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div className={cn("group/marquee flex overflow-hidden", className)}>
      <div className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused]">
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
