import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Hide the wordmark and show only the monogram. */
  markOnly?: boolean;
}

/** Wynn monogram: a framed “W” drawn as one crimson and one gold stroke. */
export function Logo({ className, markOnly = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <svg
        viewBox="0 0 40 40"
        className="size-9 shrink-0"
        fill="none"
        aria-hidden
      >
        <rect
          x="0.75"
          y="0.75"
          width="38.5"
          height="38.5"
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="1"
        />
        <path
          d="M8 11.5 14.5 28.5 20 14.5"
          stroke="#E61938"
          strokeWidth="2.2"
          strokeLinecap="square"
        />
        <path
          d="M20 14.5 25.5 28.5 32 11.5"
          stroke="#F5B700"
          strokeWidth="2.2"
          strokeLinecap="square"
        />
      </svg>
      {!markOnly && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[19px] font-bold tracking-[0.22em]">
            WYNN
          </span>
          <span className="mt-1 text-[8.5px] font-semibold tracking-[0.46em] opacity-60">
            REAL ESTATE
          </span>
        </span>
      )}
    </span>
  );
}
