"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { PropertyStatusBadge, useListings } from "@/components/listings";
import { AnimatedNumber, Badge, Icon, SectionHeading } from "@/components/ui";
import { SAMPLE_DATA } from "@/data/sample";
import { EASE, wipe } from "@/lib/animations";
import {
  displayPrice,
  formatCompactCurrency,
  formatStreetAddress,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Neighborhood, Property } from "@/types";

interface MarketExplorerProps {
  neighborhoods: Neighborhood[];
  properties: Property[];
}

/**
 * Neighborhood explorer. Hovering, focusing or tapping a neighborhood
 * morphs the whole panel: the photograph wipes over, the market figures
 * count to their new values, the price-trend line redraws, and the
 * curated listings swap.
 */
export function MarketExplorer({ neighborhoods, properties }: MarketExplorerProps) {
  const { openQuickView } = useListings();
  const [activeSlug, setActiveSlug] = useState(neighborhoods[0]?.slug);

  const active =
    neighborhoods.find((neighborhood) => neighborhood.slug === activeSlug) ??
    neighborhoods[0];
  if (!active) return null;

  const curated = properties
    .filter((property) => property.neighborhoodSlug === active.slug)
    .slice(0, 2);

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;
    if (step === 0) return;
    event.preventDefault();
    const next = neighborhoods[(index + step + neighborhoods.length) % neighborhoods.length];
    setActiveSlug(next.slug);
    document.getElementById(`neighborhood-tab-${next.slug}`)?.focus();
  };

  const { market } = active;

  return (
    <section
      id="neighborhoods"
      className="relative isolate overflow-hidden bg-carbon py-24 text-alabaster md:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_100%_0%,rgb(245_183_0/0.10),transparent_70%),radial-gradient(50%_45%_at_0%_100%,rgb(200_16_46/0.16),transparent_70%)]"
      />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" />

      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <SectionHeading
          index="02"
          eyebrow="Neighborhood explorer"
          title={"Know the market\nbefore you *move.*"}
          description={
            SAMPLE_DATA
              ? "Sample neighborhoods and figures, shown to preview the layout. The areas we work in and Bright MLS market data will replace them."
              : "Choose a neighborhood to see what is selling, how quickly, and for how much."
          }
        />

        <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-14">
          {/* Neighborhood selector */}
          <div
            role="tablist"
            aria-label="Neighborhoods"
            className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:col-span-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
          >
            {neighborhoods.map((neighborhood, index) => {
              const selected = neighborhood.slug === active.slug;
              return (
                <button
                  key={neighborhood.slug}
                  type="button"
                  role="tab"
                  id={`neighborhood-tab-${neighborhood.slug}`}
                  aria-selected={selected}
                  aria-controls="neighborhood-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveSlug(neighborhood.slug)}
                  onFocus={() => setActiveSlug(neighborhood.slug)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setActiveSlug(neighborhood.slug);
                  }}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={cn(
                    "group relative shrink-0 rounded-full border px-5 py-3 text-left transition-colors duration-500",
                    "lg:flex lg:items-center lg:gap-6 lg:rounded-none lg:border-x-0 lg:border-t-0 lg:border-b lg:border-white/10 lg:px-0 lg:py-7 lg:pl-6",
                    selected
                      ? "border-gold/60 bg-gold/[0.08] lg:bg-transparent"
                      : "border-white/15 lg:hover:bg-white/[0.02]",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="neighborhood-marker"
                      transition={{ duration: 0.7, ease: EASE.outExpo }}
                      className="absolute inset-y-0 left-0 hidden w-[3px] bg-linear-to-b from-crimson to-gold lg:block"
                    />
                  )}

                  <span
                    className={cn(
                      "hidden text-xs font-semibold tabular-nums transition-colors duration-500 lg:block",
                      selected ? "text-gold" : "text-alabaster/35",
                    )}
                  >
                    0{index + 1}
                  </span>

                  <span className="lg:flex-1">
                    <span
                      className={cn(
                        "block font-display text-sm font-semibold tracking-[-0.01em] transition-colors duration-500 lg:text-[clamp(1.6rem,2.6vw,2.6rem)] lg:leading-none lg:tracking-[-0.035em]",
                        selected ? "text-alabaster" : "text-alabaster/45 group-hover:text-alabaster/80",
                      )}
                    >
                      {neighborhood.name}
                    </span>
                    <span className="mt-2 hidden text-sm text-alabaster/50 lg:block">
                      {neighborhood.tagline}
                    </span>
                  </span>

                  <span className="hidden text-right lg:block">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-alabaster/40">
                      Median
                    </span>
                    <span
                      className={cn(
                        "mt-1 block font-display text-lg font-semibold tabular-nums transition-colors duration-500",
                        selected ? "text-gold-bright" : "text-alabaster/55",
                      )}
                    >
                      {formatCompactCurrency(neighborhood.market.medianSalePrice)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Morphing preview */}
          <div
            id="neighborhood-panel"
            role="tabpanel"
            aria-labelledby={`neighborhood-tab-${active.slug}`}
            className="lg:col-span-7"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-graphite sm:aspect-[16/10]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active.slug}
                  variants={wipe}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <Image
                    src={active.heroImage.url}
                    alt={active.heroImage.alt}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-obsidian/90 via-obsidian/20 to-obsidian/40"
              />

              <div className="absolute inset-x-5 top-5 flex flex-wrap gap-2 md:inset-x-7 md:top-7">
                {active.character.map((trait) => (
                  <Badge key={`${active.slug}-${trait}`} tone="glass">
                    {trait}
                  </Badge>
                ))}
              </div>

              <div className="absolute inset-x-5 bottom-5 md:inset-x-7 md:bottom-7">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.7, ease: EASE.outExpo }}
                    className="flex items-end justify-between gap-6"
                  >
                    <div className="max-w-lg">
                      <h3 className="text-3xl font-semibold tracking-[-0.03em] md:text-5xl">
                        {active.name}
                      </h3>
                      <p className="mt-3 hidden text-sm leading-relaxed text-alabaster/75 sm:block md:text-[15px]">
                        {active.description}
                      </p>
                    </div>
                    <Sparkline values={market.trend} className="hidden w-44 shrink-0 md:block" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Market figures */}
            <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 lg:grid-cols-4">
              <Stat label="Median sale price">
                <AnimatedNumber
                  value={market.medianSalePrice / 1_000_000}
                  decimals={2}
                  prefix="$"
                  suffix="M"
                />
              </Stat>
              <Stat label="Year over year" accent>
                <Icon.TrendUp className="mr-1.5 inline-block text-[0.7em]" />
                <AnimatedNumber
                  value={market.medianPriceChangeYoY}
                  decimals={1}
                  prefix="+"
                  suffix="%"
                />
              </Stat>
              <Stat label="Days on market">
                <AnimatedNumber value={market.averageDaysOnMarket} />
              </Stat>
              <Stat label="Price per sq ft">
                <AnimatedNumber value={market.pricePerSqFt} prefix="$" />
              </Stat>
            </dl>

            {/* Curated listings */}
            <div className="mt-8">
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.26em] text-alabaster/55">
                <span className="h-px w-8 bg-gold" />
                On the market in {active.name}
                <span className="tabular-nums text-gold">· {market.activeListings} active</span>
              </p>

              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={active.slug}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                  className="mt-5 grid gap-3 sm:grid-cols-2"
                >
                  {curated.map((property) => (
                    <motion.li
                      key={property.listingKey}
                      variants={{
                        hidden: { opacity: 0, y: 18 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE.outExpo } },
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => openQuickView(property)}
                        data-cursor="View"
                        className="group flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition-colors duration-500 hover:border-gold/50 hover:bg-white/[0.06]"
                      >
                        <span className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-graphite">
                          {property.media[0] && (
                            <Image
                              src={property.media[0].mediaUrl}
                              alt=""
                              fill
                              sizes="80px"
                              className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-110"
                            />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <PropertyStatusBadge property={property} className="px-2 py-1 text-[9px]" />
                          <span className="mt-2 block font-display text-xl font-semibold tabular-nums tracking-[-0.02em]">
                            {formatCompactCurrency(displayPrice(property))}
                          </span>
                          <span className="block truncate text-[13px] text-alabaster/60">
                            {formatStreetAddress(property.address)}
                          </span>
                        </span>
                        <Icon.ArrowUpRight className="mr-1 shrink-0 text-xl text-alabaster/35 transition-colors duration-500 group-hover:text-gold" />
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  accent = false,
  children,
}: {
  label: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-carbon px-5 py-5 md:px-6 md:py-6">
      <dt className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-alabaster/45">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-2.5 font-display text-[clamp(1.5rem,2.1vw,2.1rem)] font-semibold leading-none tracking-[-0.03em] whitespace-nowrap",
          accent ? "text-gold-bright" : "text-alabaster",
        )}
      >
        {children}
      </dd>
    </div>
  );
}

const SPARK = { width: 176, height: 64, pad: 6 };

/** Twelve-month price trend. The path morphs between neighborhoods. */
function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((value, index) => {
    const x = SPARK.pad + (index / (values.length - 1)) * (SPARK.width - SPARK.pad * 2);
    const y = SPARK.height - SPARK.pad - ((value - min) / range) * (SPARK.height - SPARK.pad * 2);
    return [Number(x.toFixed(1)), Number(y.toFixed(1))] as const;
  });

  const line = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  const area = `${line} L${SPARK.width - SPARK.pad} ${SPARK.height} L${SPARK.pad} ${SPARK.height} Z`;
  const [lastX, lastY] = points[points.length - 1];
  const transition = { duration: 0.9, ease: EASE.outExpo };

  return (
    <figure className={className}>
      <figcaption className="mb-2 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-alabaster/55">
        12-month trend
      </figcaption>
      <svg
        viewBox={`0 0 ${SPARK.width} ${SPARK.height}`}
        className="w-full overflow-visible"
        role="img"
        aria-label="Median sale price over the last twelve months, trending upward"
      >
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5B700" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F5B700" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={area} animate={{ d: area }} initial={false} transition={transition} fill="url(#spark-fill)" />
        <motion.path
          d={line}
          animate={{ d: line }}
          initial={false}
          transition={transition}
          fill="none"
          stroke="#FFD000"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.circle
          r={3.5}
          cx={lastX}
          animate={{ cy: lastY }}
          initial={false}
          transition={transition}
          fill="#FFD000"
          stroke="#09090B"
          strokeWidth={1.5}
        />
      </svg>
    </figure>
  );
}
