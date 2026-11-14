"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useListings } from "@/components/listings";
import { AnimatedNumber, Icon, MagneticButton, SectionHeading } from "@/components/ui";
import { fadeUp, inView } from "@/lib/animations";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import type { BrokerageMetric, LeadIntent, ServicePillar } from "@/types";

interface AboutWynnProps {
  metrics: BrokerageMetric[];
  pillars: ServicePillar[];
}

/** Words wrapped in asterisks are set in the serif gold accent. */
const MANIFESTO =
  "A home is the most personal asset you will ever own. We represent it that way — with absolute *discretion,* forensic market *intelligence,* and marketing engineered to command *attention.*";

/**
 * The firm: a manifesto that illuminates word by word as it scrolls, the
 * headline brokerage metrics counting up, and the Buy / Sell / Invest
 * pillars as an expanding triptych.
 */
export function AboutWynn({ metrics, pillars }: AboutWynnProps) {
  const manifesto = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.06,
            scrollTrigger: {
              trigger: manifesto.current,
              start: "top 85%",
              end: "bottom 50%",
              scrub: 0.4,
            },
          },
        );
      });
    },
    { scope: manifesto },
  );

  return (
    <section
      id="about"
      className="relative isolate overflow-hidden border-t border-white/10 bg-obsidian py-24 text-alabaster md:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40%_30%_at_50%_0%,rgb(245_183_0/0.08),transparent_70%)]"
      />

      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <SectionHeading
          index="03"
          eyebrow="The Wynn standard"
          title={"Quietly *relentless.*"}
        />

        {/* Scroll-scrubbed manifesto */}
        <p
          ref={manifesto}
          className="mt-12 max-w-[22ch] font-display text-[clamp(1.75rem,4.3vw,4.25rem)] font-medium leading-[1.1] tracking-[-0.035em] sm:max-w-none lg:max-w-[1300px]"
        >
          <span className="sr-only">{MANIFESTO.replace(/\*/g, "")}</span>
          <span aria-hidden>
            {MANIFESTO.split(" ").map((raw, index) => {
              const accent = raw.startsWith("*");
              return (
                <span
                  key={index}
                  data-word
                  className={cn(
                    "inline-block",
                    accent && "pr-[0.06em] font-serif font-normal italic text-gradient-gold",
                  )}
                >
                  {raw.replace(/\*/g, "")}
                  {" "}
                </span>
              );
            })}
          </span>
        </p>

        {/* Brokerage metrics */}
        <dl className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-28 lg:grid-cols-4 lg:gap-x-10">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              variants={fadeUp}
              custom={index * 0.08}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              className="relative pt-7"
            >
              <span aria-hidden className="hairline-gold absolute inset-x-0 top-0 h-px" />
              <dt className="text-[11px] font-bold uppercase tracking-[0.24em] text-alabaster/55">
                {metric.label}
              </dt>
              <dd className="mt-4">
                <AnimatedNumber
                  value={metric.value}
                  decimals={metric.decimals}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  duration={2.2}
                  className="font-display text-[clamp(2.75rem,6.4vw,6rem)] font-semibold leading-none tracking-[-0.05em] text-gradient-gold"
                />
                <p className="mt-4 max-w-[26ch] text-sm leading-relaxed text-alabaster/50">
                  {metric.description}
                </p>
              </dd>
            </motion.div>
          ))}
        </dl>

        <ServiceTriptych pillars={pillars} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function ServiceTriptych({ pillars }: { pillars: ServicePillar[] }) {
  const { setInquiry } = useListings();
  const [active, setActive] = useState<LeadIntent>(pillars[0]?.intent ?? "buy");

  return (
    <div className="mt-24 md:mt-32">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
        className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-alabaster/70"
      >
        <span className="h-px w-10 bg-white/25" />
        Three ways we work with you
      </motion.p>

      <div className="mt-8 flex flex-col gap-3 lg:h-[600px] lg:flex-row">
        {pillars.map((pillar, index) => {
          const open = pillar.intent === active;
          const panelId = `pillar-${pillar.intent}`;

          return (
            <motion.article
              key={pillar.intent}
              variants={fadeUp}
              custom={index * 0.1}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setActive(pillar.intent);
              }}
              className={cn(
                "group relative isolate flex min-w-0 flex-col overflow-hidden rounded-2xl border transition-[flex-grow,border-color] duration-[900ms] ease-out-expo lg:basis-0",
                open ? "border-gold/40 lg:grow-[2.6]" : "border-white/10 lg:grow",
              )}
            >
              <Image
                src={pillar.image.url}
                alt=""
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className={cn(
                  "-z-20 object-cover transition-[opacity,scale,filter] duration-[1400ms] ease-out-expo",
                  open ? "scale-100 opacity-55" : "scale-110 opacity-20 grayscale",
                )}
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-linear-to-t from-obsidian via-obsidian/75 to-obsidian/30"
              />

              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setActive(pillar.intent)}
                onFocus={() => setActive(pillar.intent)}
                className="flex w-full flex-1 flex-col justify-between gap-10 p-6 text-left md:p-9 lg:gap-0"
              >
                <span className="flex w-full items-center justify-between">
                  <span
                    className={cn(
                      "text-xs font-semibold tabular-nums transition-colors duration-500",
                      open ? "text-gold" : "text-alabaster/45",
                    )}
                  >
                    0{index + 1}
                  </span>
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-full border text-lg transition-[background-color,border-color,color,rotate] duration-700 ease-out-expo",
                      open
                        ? "rotate-0 border-gold bg-gold text-obsidian"
                        : "-rotate-90 border-white/20 text-alabaster/60",
                    )}
                  >
                    <Icon.ArrowDown />
                  </span>
                </span>

                <span className="block">
                  <span
                    className={cn(
                      "block font-display text-[clamp(2.75rem,5vw,5rem)] font-semibold leading-none tracking-[-0.05em] transition-colors duration-700",
                      open ? "text-alabaster" : "text-alabaster/55",
                    )}
                  >
                    {pillar.title}
                  </span>
                  <span
                    className={cn(
                      "mt-3 block text-sm font-medium transition-colors duration-700",
                      open ? "text-gold-bright" : "text-alabaster/40",
                    )}
                  >
                    {pillar.summary}
                  </span>
                </span>
              </button>

              {/* Detail: collapses to zero height when the pillar is closed. */}
              <div
                id={panelId}
                inert={!open}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-[900ms] ease-out-expo",
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  {/* Fixed width on desktop so copy doesn't reflow while the panel grows. */}
                  <div className="px-6 pb-6 md:px-9 md:pb-9 lg:w-[min(36rem,46vw)]">
                    <p className="text-[15px] leading-relaxed text-alabaster/75">
                      {pillar.description}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {pillar.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm text-alabaster/85">
                          <Icon.Check className="mt-0.5 shrink-0 text-base text-gold" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <MagneticButton
                      href={pillar.cta.href}
                      variant="gold"
                      strength={0.2}
                      onClick={() => setInquiry({ intent: pillar.intent })}
                      className="mt-7"
                    >
                      {pillar.cta.label}
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
