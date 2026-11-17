"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { PropertyCard, useListings } from "@/components/listings";
import { Icon, MagneticButton, SectionHeading } from "@/components/ui";
import { SAMPLE_DATA } from "@/data/sample";
import { EASE, inView } from "@/lib/animations";
import {
  BED_OPTIONS,
  countActiveFilters,
  filterProperties,
  PRICE_BANDS,
} from "@/lib/filters";
import { formatSubType } from "@/lib/formatters";
import { DESKTOP, gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import type { Neighborhood, Property } from "@/types";

interface FeaturedListingsProps {
  properties: Property[];
  neighborhoods: Neighborhood[];
}

/**
 * Editorial grid rhythm: one wide + one square card, then rows of three.
 * `drift` is each card's scroll-parallax speed, so neighbours travel at
 * different rates and the grid reads as layered rather than flat.
 */
const LAYOUT = [
  { span: "lg:col-span-7", aspect: "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[7/5]", sizes: "(min-width: 1024px) 58vw, 100vw", drift: 0 },
  { span: "lg:col-span-5", aspect: "aspect-[4/5] sm:aspect-[4/3] lg:aspect-square", sizes: "(min-width: 1024px) 42vw, 100vw", drift: 1 },
  { span: "lg:col-span-4", aspect: "aspect-[4/5]", sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", drift: 0.35 },
  { span: "lg:col-span-4", aspect: "aspect-[4/5]", sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", drift: 1.1 },
  { span: "lg:col-span-4", aspect: "aspect-[4/5]", sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", drift: 0.6 },
  { span: "lg:col-span-4", aspect: "aspect-[4/5]", sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", drift: 0.9 },
  { span: "lg:col-span-4", aspect: "aspect-[4/5]", sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", drift: 0.2 },
  { span: "lg:col-span-4", aspect: "aspect-[4/5]", sizes: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", drift: 0.75 },
] as const;

/** Pixels of vertical travel per unit of `drift`. */
const DRIFT_DISTANCE = 56;

export function FeaturedListings({ properties, neighborhoods }: FeaturedListingsProps) {
  const { filters, resetFilters, setInquiry } = useListings();
  const grid = useRef<HTMLDivElement>(null);

  const activeFilters = countActiveFilters(filters);
  const visible =
    activeFilters > 0
      ? filterProperties(properties, filters)
      : properties.filter((property) => property.isFeatured);
  const visibleKey = visible.map((property) => property.listingKey).join("|");

  const neighborhoodName = (slug: string) =>
    neighborhoods.find((neighborhood) => neighborhood.slug === slug)?.name;

  const chips = [
    filters.neighborhood !== "all" && neighborhoodName(filters.neighborhood),
    filters.subType !== "all" && formatSubType(filters.subType),
    filters.priceBand !== "any" &&
      PRICE_BANDS.find((band) => band.id === filters.priceBand)?.label,
    filters.minBeds > 0 &&
      BED_OPTIONS.find((option) => option.value === filters.minBeds)?.label,
  ].filter((chip): chip is string => Boolean(chip));

  // Scroll choreography: photos drift inside their frames, and on desktop
  // the cards themselves travel at different speeds.
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add({ motion: MOTION_OK, desktop: DESKTOP }, (context) => {
        if (!context.conditions?.motion) return;

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((image) => {
          gsap.fromTo(
            image,
            { yPercent: -5.5 },
            {
              yPercent: 5.5,
              ease: "none",
              scrollTrigger: {
                trigger: image.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        if (!context.conditions.desktop) return;

        gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((card) => {
          const distance = Number(card.dataset.drift) * DRIFT_DISTANCE;
          if (distance === 0) return;
          gsap.fromTo(
            card,
            { y: distance },
            {
              y: -distance,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );
        });
      });

      // The grid's height changes with the filters; re-measure everything below.
      ScrollTrigger.refresh();
    },
    { scope: grid, dependencies: [visibleKey], revertOnUpdate: true },
  );

  return (
    <section
      id="listings"
      className="relative z-10 rounded-t-[2rem] bg-alabaster py-24 text-obsidian md:rounded-t-[3rem] md:py-36"
    >
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            tone="light"
            index="01"
            eyebrow="Featured listings"
            title={"Homes on the\nmarket *now.*"}
            description={
              SAMPLE_DATA
                ? "Sample listings, shown to preview the layout. Our current Bright MLS listings will replace them."
                : "Our current listings, shared through Bright MLS."
            }
          />

          <div className="flex flex-col items-start gap-3 lg:items-end" aria-live="polite">
            <p className="text-sm text-ink/60">
              <span className="font-display text-3xl font-semibold tabular-nums tracking-[-0.03em] text-obsidian">
                {String(visible.length).padStart(2, "0")}
              </span>{" "}
              {activeFilters > 0 ? "matching your search" : SAMPLE_DATA ? "sample listings" : "listings"}
            </p>

            {chips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink"
                  >
                    {chip}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 rounded-full bg-obsidian px-3 py-1.5 text-xs font-semibold text-alabaster transition-colors hover:bg-crimson"
                >
                  <Icon.Close className="text-sm" />
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          ref={grid}
          className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-24"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((property, index) => {
              const slot = LAYOUT[index % LAYOUT.length];
              return (
                <motion.div
                  key={property.listingKey}
                  initial={{ opacity: 0, y: 48 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.3 } }}
                  viewport={inView}
                  transition={{
                    duration: 1.1,
                    ease: EASE.outExpo,
                    delay: (index % 3) * 0.08,
                  }}
                  className={cn("min-w-0", slot.span)}
                >
                  <div data-drift={slot.drift}>
                    <PropertyCard
                      property={property}
                      neighborhoodName={neighborhoodName(property.neighborhoodSlug)}
                      aspectClassName={slot.aspect}
                      sizes={slot.sizes}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {visible.length === 0 && (
            <div className="col-span-full flex flex-col items-center rounded-2xl border border-dashed border-ink/20 px-6 py-20 text-center">
              <p className="font-display text-3xl font-semibold tracking-[-0.03em]">
                Nothing matches that search.
              </p>
              <p className="mt-3 max-w-md text-ink/60">
                Clear your search, or tell us what you are looking for and we
                will keep an eye out for it.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-8 rounded-full bg-obsidian px-6 py-3 text-sm font-semibold text-alabaster transition-colors hover:bg-crimson"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-8 border-t border-ink/15 pt-10 md:mt-28 md:flex-row md:items-center">
          <p className="max-w-2xl font-serif text-2xl italic leading-snug text-ink/85 md:text-3xl">
            Most of our business comes from past clients and the people they send us.
          </p>
          <MagneticButton
            href="/#contact"
            variant="dark"
            size="lg"
            onClick={() => setInquiry({ intent: "buy" })}
          >
            Tell us what you need
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
