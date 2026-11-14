"use client";

import { motion, useTransform } from "motion/react";
import { useRef } from "react";
import { HeroCanvas } from "@/components/canvas/HeroCanvas";
import { PropertyFilterBar } from "@/components/listings";
import { MagneticButton, RevealText } from "@/components/ui";
import { useMousePosition, useScrollProgress } from "@/hooks";
import { EASE } from "@/lib/animations";
import { siteConfig } from "@/lib/site";
import type { Neighborhood, Property } from "@/types";

interface HeroProps {
  properties: Property[];
  neighborhoods: Neighborhood[];
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.1, ease: EASE.outExpo, delay },
});

/**
 * Full-viewport opening: the WebGL residence study behind kinetic type, a
 * pair of magnetic CTAs and the floating glass search bar. As the visitor
 * scrolls, the copy lifts away while the model explodes into a blueprint.
 */
export function Hero({ properties, neighborhoods }: HeroProps) {
  const section = useRef<HTMLElement>(null);
  const pointer = useMousePosition();
  const { progress, progressRef } = useScrollProgress(section);

  const copyY = useTransform(progress, [0, 1], [0, -150]);
  const copyOpacity = useTransform(progress, [0, 0.55], [1, 0]);
  const sceneScale = useTransform(progress, [0, 1], [1, 1.07]);

  return (
    <section
      ref={section}
      id="top"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-obsidian"
    >
      {/* Backdrop: crimson and gold atmosphere behind the model. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30 bg-[radial-gradient(55%_60%_at_78%_38%,rgb(200_16_46/0.20),transparent_70%),radial-gradient(40%_45%_at_92%_70%,rgb(245_183_0/0.13),transparent_70%),radial-gradient(60%_50%_at_10%_100%,rgb(200_16_46/0.14),transparent_70%)]"
      />

      <motion.div style={{ scale: sceneScale }} className="absolute inset-0 -z-20">
        <HeroCanvas pointer={pointer} progress={progressRef} className="absolute inset-0" />
      </motion.div>

      {/* Scrims keep the copy legible wherever the model sits. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-t from-obsidian via-obsidian/65 to-obsidian/30 lg:bg-linear-to-r lg:from-obsidian/95 lg:via-obsidian/35 lg:to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-linear-to-t from-obsidian to-transparent"
      />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.07]" />

      <DrawingAnnotations />

      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col px-5 pt-[104px] md:px-10"
      >
        <div className="flex flex-1 flex-col justify-end pb-10 lg:justify-center lg:pb-14">
          <motion.p
            {...rise(0.2)}
            className="flex items-center gap-2.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-alabaster/75 sm:gap-3 sm:text-[11px] sm:tracking-[0.32em]"
          >
            <span className="hidden h-px w-10 bg-gold sm:block" />
            Luxury brokerage
            <span className="text-gold">·</span>
            Private advisory
          </motion.p>

          <RevealText
            as="h1"
            trigger="mount"
            delay={0.4}
            step={0.11}
            text={"Where legacy\nfinds its *address.*"}
            className="mt-7 text-[clamp(3rem,8.4vw,8.5rem)] font-semibold leading-[0.93] tracking-[-0.05em] text-alabaster"
          />

          <motion.p
            {...rise(1.05)}
            className="mt-8 max-w-xl text-base leading-relaxed text-alabaster/70 md:text-lg"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div {...rise(1.2)} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton href="/#listings" size="lg">
              Explore residences
            </MagneticButton>
            <MagneticButton href="/#contact" size="lg" variant="outline">
              Book a private consultation
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div {...rise(1.45)} className="pb-6 md:pb-9">
          <PropertyFilterBar properties={properties} neighborhoods={neighborhoods} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/** Title-block notes and a scroll cue, styled after an architect's drawing sheet. */
function DrawingAnnotations() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, delay: 1.8 }}
      className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
    >
      <div className="absolute right-10 top-[108px] border-l border-gold/40 pl-4 text-[10px] font-semibold uppercase leading-[1.9] tracking-[0.28em] text-alabaster/45">
        <p className="text-gold/80">Fig. 01 — Residence study</p>
        <p>Exploded axonometric</p>
        <p className="tabular-nums">Scale 1 : 200</p>
      </div>

      <div className="absolute bottom-[190px] right-10 flex flex-col items-center gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-alabaster/50 [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="relative block h-16 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-0 animate-scroll-cue bg-gold" />
        </span>
      </div>
    </motion.div>
  );
}
