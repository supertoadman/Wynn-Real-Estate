"use client";

import { motion } from "motion/react";
import { fadeUp, inView } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { RevealText } from "./RevealText";

interface SectionHeadingProps {
  /** Two-digit section number shown before the eyebrow. */
  index?: string;
  eyebrow: string;
  /** Supports the `RevealText` syntax: `\n` breaks, `*accent*` words. */
  title: string;
  description?: string;
  /** `dark` for obsidian sections, `light` for alabaster ones. */
  tone?: "dark" | "light";
  className?: string;
  titleClassName?: string;
}

/** Numbered eyebrow, kinetic headline and optional standfirst. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  tone = "dark",
  className,
  titleClassName,
}: SectionHeadingProps) {
  const light = tone === "light";

  return (
    <div className={cn("max-w-3xl", className)}>
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
        className={cn(
          "flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em]",
          light ? "text-ink/70" : "text-alabaster/70",
        )}
      >
        {index && (
          <span className={cn("tabular-nums", light ? "text-crimson" : "text-gold")}>
            {index}
          </span>
        )}
        <span className={cn("h-px w-10", light ? "bg-ink/25" : "bg-white/25")} />
        {eyebrow}
      </motion.p>

      <RevealText
        as="h2"
        text={title}
        delay={0.1}
        accentClassName={cn(
          "font-serif font-normal italic",
          light ? "text-crimson" : "text-gradient-gold",
        )}
        className={cn(
          "mt-6 text-[clamp(2.25rem,5.2vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]",
          light ? "text-obsidian" : "text-alabaster",
          titleClassName,
        )}
      />

      {description && (
        <motion.p
          variants={fadeUp}
          custom={0.25}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className={cn(
            "mt-6 max-w-xl text-base leading-relaxed md:text-lg",
            light ? "text-ink/65" : "text-alabaster/60",
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
