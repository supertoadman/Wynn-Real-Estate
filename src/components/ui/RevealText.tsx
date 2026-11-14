"use client";

import { motion } from "motion/react";
import { Fragment, useMemo, type ElementType } from "react";
import { inView, maskUp, stagger } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface RevealTextProps {
  /**
   * Copy to reveal. Use `\n` for a forced line break and wrap words in
   * `*asterisks*` to style them as the accent (serif italic by default).
   */
  text: string;
  as?: ElementType;
  className?: string;
  accentClassName?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between words. */
  step?: number;
  /** `mount` plays immediately (hero); `inView` waits until scrolled to. */
  trigger?: "mount" | "inView";
}

interface Word {
  text: string;
  accent: boolean;
}

function parse(text: string): Word[][] {
  let accent = false;
  return text.split("\n").map((line) =>
    line
      .split(" ")
      .filter(Boolean)
      .map((raw) => {
        const opens = raw.startsWith("*");
        const closes = raw.endsWith("*") && raw.length > 1;
        if (opens) accent = true;
        const word = { text: raw.replace(/^\*|\*$/g, ""), accent };
        if (closes) accent = false;
        return word;
      }),
  );
}

/**
 * Kinetic typography: each word rises out of its own mask in sequence.
 * Screen readers get the plain sentence; the animated copy is hidden from them.
 */
export function RevealText({
  text,
  as: Tag = "p",
  className,
  accentClassName = "font-serif font-normal italic text-gradient-gold",
  delay = 0,
  step = 0.07,
  trigger = "inView",
}: RevealTextProps) {
  const lines = useMemo(() => parse(text), [text]);
  const plain = text.replace(/\*/g, "").replace(/\n/g, " ");

  return (
    <Tag className={className}>
      <span className="sr-only">{plain}</span>
      <motion.span
        aria-hidden
        className="block"
        variants={stagger(step, delay)}
        initial="hidden"
        {...(trigger === "mount"
          ? { animate: "visible" }
          : { whileInView: "visible", viewport: inView })}
      >
        {lines.map((words, lineIndex) => (
          <span key={lineIndex} className="block">
            {words.map((word, wordIndex) => (
              <Fragment key={wordIndex}>
                {/* Padding keeps descenders and italic overhang inside the mask. */}
                <span className="-mb-[0.18em] -mr-[0.06em] inline-block overflow-hidden pb-[0.18em] pr-[0.06em] align-bottom">
                  <motion.span
                    variants={maskUp}
                    className={cn(
                      "inline-block origin-bottom-left will-change-transform",
                      word.accent && accentClassName,
                      word.accent && "pr-[0.1em]",
                    )}
                  >
                    {word.text}
                  </motion.span>
                </span>
                {wordIndex < words.length - 1 && " "}
              </Fragment>
            ))}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
