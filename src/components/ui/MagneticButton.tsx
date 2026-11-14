"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import type { MouseEvent, PointerEvent, ReactNode } from "react";
import { useAnchorClick } from "@/hooks";
import { SPRING } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "./icons";

const MotionLink = motion.create(Link);

type Variant = "primary" | "gold" | "outline" | "dark";
type Size = "md" | "lg";

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** How far the button travels toward the cursor (0 disables the effect). */
  strength?: number;
  /** Trailing icon. Pass `null` for none; defaults to an arrow. */
  icon?: ReactNode;
  className?: string;
  "aria-label"?: string;
}

interface LinkProps extends CommonProps {
  href: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

interface ButtonProps extends CommonProps {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export type MagneticButtonProps = LinkProps | ButtonProps;

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-crimson text-white shadow-glow-crimson hover:bg-scarlet active:bg-crimson-deep",
  gold: "border border-gold/50 bg-gold/[0.06] text-gold-bright hover:border-gold hover:bg-gold hover:text-obsidian",
  outline:
    "border border-white/20 bg-white/[0.04] text-alabaster backdrop-blur-md hover:border-gold/70 hover:text-gold-bright",
  dark: "bg-obsidian text-alabaster hover:bg-crimson",
};

const SIZES: Record<Size, string> = {
  md: "h-12 gap-2.5 pl-6 pr-5 text-[13px]",
  lg: "h-14 gap-3 pl-8 pr-6 text-sm",
};

/**
 * Pill CTA that leans toward the cursor on a spring, with the label
 * travelling a little further than the shell for parallax depth.
 * Renders a Next `<Link>` when `href` is set, otherwise a `<button>`.
 */
export function MagneticButton(props: MagneticButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    strength = 0.32,
    icon,
    className,
  } = props;

  const handleAnchorClick = useAnchorClick();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING.magnetic);
  const springY = useSpring(y, SPRING.magnetic);
  const labelX = useTransform(springX, (value) => value * 0.4);
  const labelY = useTransform(springY, (value) => value * 0.4);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || strength === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(
    "group/button relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full font-semibold tracking-[0.04em] transition-colors duration-500 ease-out-expo",
    "disabled:pointer-events-none disabled:opacity-60",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  const content = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-linear-to-r from-transparent via-white/30 to-transparent group-hover/button:animate-sheen"
      />
      <motion.span
        style={{ x: labelX, y: labelY }}
        className="relative inline-flex items-center gap-[inherit]"
      >
        <span>{children}</span>
        {icon !== null && (
          <span className="grid size-6 place-items-center rounded-full bg-current/10 text-base transition-transform duration-500 ease-out-expo group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5">
            {icon ?? <ArrowUpRight />}
          </span>
        )}
      </motion.span>
    </>
  );

  const shared = {
    className: classes,
    style: { x: springX, y: springY },
    onPointerMove,
    onPointerLeave,
    "aria-label": props["aria-label"],
  };

  if (props.href !== undefined) {
    const { href, onClick } = props;
    return (
      <MotionLink
        {...shared}
        href={href}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          onClick?.(event);
          handleAnchorClick(event, href);
        }}
      >
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.button
      {...shared}
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {content}
    </motion.button>
  );
}
