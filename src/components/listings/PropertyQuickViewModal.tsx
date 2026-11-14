"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon, MagneticButton } from "@/components/ui";
import { MEDIA, useMediaQuery, useScrollLock, useSectionScroll } from "@/hooks";
import { EASE, SPRING, wipe } from "@/lib/animations";
import {
  displayPrice,
  formatAcres,
  formatBaths,
  formatCityLine,
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  formatOpenHouse,
  formatPercent,
  formatStreetAddress,
  formatSubType,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Property } from "@/types";
import { useListings } from "./ListingsContext";
import { PropertyStatusBadge } from "./PropertyStatusBadge";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Listing quick view: a drawer that slides in from the right (a bottom sheet
 * on phones) without leaving the page. Rendered once by the root layout and
 * opened from any `PropertyCard` through the listings context.
 */
export function PropertyQuickViewModal() {
  const { quickView, closeQuickView } = useListings();
  useScrollLock(quickView !== null);

  return (
    <AnimatePresence>
      {quickView && (
        <QuickViewPanel
          key={quickView.listingKey}
          property={quickView}
          onClose={closeQuickView}
        />
      )}
    </AnimatePresence>
  );
}

function QuickViewPanel({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  const { setInquiry } = useListings();
  const scrollToSection = useSectionScroll();
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Side drawer on tablets and up; bottom sheet on phones.
  const wide = useMediaQuery(MEDIA.tablet);
  const offscreen = wide ? { x: "100%", y: "0%" } : { x: "0%", y: "100%" };

  const street = formatStreetAddress(property.address);
  const activeMedia = property.media[activeIndex] ?? property.media[0];
  const sold = property.standardStatus === "Closed";

  // Move focus into the dialog, and hand it back to the trigger on close.
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    closeButton.current?.focus({ preventScroll: true });
    return () => trigger?.focus?.({ preventScroll: true });
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panel.current) return;

    // Keep keyboard focus inside the dialog.
    const focusable = panel.current.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  const requestShowing = () => {
    setInquiry({
      property,
      intent: property.propertyType === "ResidentialIncome" ? "invest" : "buy",
    });
    onClose();
    // Let the drawer release the scroll lock before travelling.
    requestAnimationFrame(() => scrollToSection("#contact"));
  };

  const facts: Array<[label: string, value: string]> = [
    ["Bedrooms", String(property.bedroomsTotal)],
    ["Bathrooms", formatBaths(property.bathroomsFull, property.bathroomsHalf)],
    ["Interior", `${formatNumber(property.livingArea)} sq ft`],
    ...(property.lotSizeAcres
      ? ([["Lot", formatAcres(property.lotSizeAcres)]] as Array<[string, string]>)
      : []),
    ["Built", String(property.yearBuilt)],
    ["Type", formatSubType(property.propertySubType)],
    ...(property.investment
      ? ([
          ["Cap rate", formatPercent(property.investment.capRate)],
          ["Gross income", `${formatCompactCurrency(property.investment.grossAnnualIncome)} / yr`],
        ] as Array<[string, string]>)
      : []),
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-end md:items-stretch"
      onKeyDown={onKeyDown}
    >
      <motion.div
        aria-hidden
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-obsidian/70 backdrop-blur-sm"
      />

      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        data-lenis-prevent
        initial={offscreen}
        animate={{ x: "0%", y: "0%" }}
        exit={offscreen}
        transition={{ type: "spring", ...SPRING.panel }}
        className="relative flex max-h-[92svh] w-full flex-col overflow-y-auto overscroll-contain rounded-t-3xl bg-carbon text-alabaster shadow-panel md:max-h-none md:w-[min(620px,92vw)] md:rounded-none"
      >
        {/* Gallery */}
        <div className="relative aspect-[16/11] shrink-0 overflow-hidden bg-graphite">
          <AnimatePresence initial={false}>
            <motion.div
              key={activeMedia.mediaKey}
              variants={wipe}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <Image
                src={activeMedia.mediaUrl}
                alt={activeMedia.shortDescription}
                fill
                sizes="(min-width: 768px) 620px, 100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-carbon via-transparent to-obsidian/40"
          />

          <div className="absolute inset-x-5 top-5 flex items-center justify-between">
            <PropertyStatusBadge property={property} />
            <button
              ref={closeButton}
              type="button"
              onClick={onClose}
              aria-label="Close quick view"
              className="grid size-11 place-items-center rounded-full bg-obsidian/70 text-xl text-white backdrop-blur-md transition-colors hover:bg-crimson"
            >
              <Icon.Close />
            </button>
          </div>

          <div className="absolute inset-x-5 bottom-4 flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {property.media.map((media, index) => (
                <button
                  key={media.mediaKey}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show photo ${index + 1}: ${media.shortDescription}`}
                  aria-current={index === activeIndex}
                  className={cn(
                    "relative h-12 w-16 overflow-hidden rounded-sm ring-1 transition-[opacity,box-shadow] duration-300",
                    index === activeIndex
                      ? "opacity-100 ring-2 ring-gold"
                      : "opacity-60 ring-white/20 hover:opacity-100",
                  )}
                >
                  <Image src={media.mediaUrl} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold tabular-nums text-white/80">
              {activeIndex + 1} / {property.media.length}
            </span>
          </div>
        </div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: EASE.outExpo }}
          className="flex flex-1 flex-col gap-8 p-6 md:p-9"
        >
          <header>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
              Listing {property.listingId}
            </p>
            <h2
              id="quick-view-title"
              className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl"
            >
              {street}
            </h2>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-alabaster/60">
              <Icon.MapPin className="text-base text-crimson" />
              {formatCityLine(property.address)}
            </p>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
              <p className="font-display text-4xl font-semibold tracking-[-0.03em] tabular-nums text-gradient-gold md:text-5xl">
                {formatCurrency(displayPrice(property))}
              </p>
              <p className="text-xs tabular-nums text-alabaster/55">
                {sold
                  ? `Listed at ${formatCurrency(property.listPrice)}`
                  : `${formatCurrency(Math.round(property.listPrice / property.livingArea))} / sq ft`}
                {" · "}
                {property.daysOnMarket === 0
                  ? "Pre-market"
                  : `${property.daysOnMarket} days on market`}
              </p>
            </div>
          </header>

          {property.openHouse && (
            <p className="flex items-center gap-3 rounded-xl border border-gold/30 bg-gold/[0.07] px-4 py-3 text-sm">
              <Icon.Calendar className="shrink-0 text-lg text-gold" />
              <span>
                <span className="font-semibold text-gold-bright">Open house</span>{" "}
                <span className="tabular-nums text-alabaster/80">
                  {formatOpenHouse(property.openHouse.startTime, property.openHouse.endTime)}
                </span>
              </span>
            </p>
          )}

          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10">
            {facts.map(([label, value]) => (
              <div key={label} className="bg-carbon px-4 py-4">
                <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-alabaster/45">
                  {label}
                </dt>
                <dd className="mt-1.5 text-[15px] font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="font-serif text-xl italic leading-snug text-alabaster/90">
              {property.headline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-alabaster/65">
              {property.publicRemarks}
            </p>
          </div>

          <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {property.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-alabaster/80">
                <Icon.Check className="mt-0.5 shrink-0 text-base text-gold" />
                {feature}
              </li>
            ))}
          </ul>

          <footer className="mt-auto flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              <p className="font-semibold">{property.listAgent.fullName}</p>
              <a
                href={`tel:${property.listAgent.phone.replace(/[^\d+]/g, "")}`}
                className="tabular-nums text-alabaster/60 transition-colors hover:text-gold-bright"
              >
                {property.listAgent.phone}
              </a>
            </div>
            <MagneticButton onClick={requestShowing} size="lg" strength={0.2}>
              {sold ? "Find a home like this" : "Request a private showing"}
            </MagneticButton>
          </footer>
        </motion.div>
      </motion.div>
    </div>
  );
}
