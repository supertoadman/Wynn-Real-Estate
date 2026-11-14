"use client";

import Image from "next/image";
import { Icon } from "@/components/ui";
import {
  displayPrice,
  formatCityLine,
  formatCurrency,
  formatStreetAddress,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Property } from "@/types";
import { useListings } from "./ListingsContext";
import { PropertySpecs } from "./PropertySpecs";
import { PropertyStatusBadge } from "./PropertyStatusBadge";

interface PropertyCardProps {
  property: Property;
  neighborhoodName?: string;
  /** Tailwind aspect-ratio class for the image frame. */
  aspectClassName?: string;
  /** `sizes` hint for the responsive image. */
  sizes?: string;
  className?: string;
}

/**
 * Listing card. Hovering cross-fades to the second photo with a slow push-in
 * and raises the quick-view prompt; clicking opens the quick-view drawer.
 *
 * The image layer carries `data-parallax` so a parent section can drift it
 * inside its frame on scroll (see FeaturedListings).
 */
export function PropertyCard({
  property,
  neighborhoodName,
  aspectClassName = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  className,
}: PropertyCardProps) {
  const { openQuickView } = useListings();
  const [primary, secondary] = property.media;
  const street = formatStreetAddress(property.address);
  const sold = property.standardStatus === "Closed";

  return (
    <article className={cn("group/card", className)}>
      <button
        type="button"
        onClick={() => openQuickView(property)}
        data-cursor="View"
        aria-label={`Quick view: ${street}, ${formatCurrency(displayPrice(property))}`}
        className="block w-full text-left"
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-md bg-bone shadow-card",
            aspectClassName,
          )}
        >
          <div data-parallax className="absolute -inset-y-[7%] inset-x-0">
            {primary && (
              <Image
                src={primary.mediaUrl}
                alt={primary.shortDescription}
                fill
                sizes={sizes}
                className="object-cover transition-transform duration-[1600ms] ease-out-expo group-hover/card:scale-[1.04]"
              />
            )}
            {secondary && (
              <Image
                src={secondary.mediaUrl}
                alt=""
                fill
                sizes={sizes}
                className="scale-110 object-cover opacity-0 transition-[opacity,transform] duration-[1100ms] ease-out-expo group-hover/card:scale-100 group-hover/card:opacity-100"
              />
            )}
          </div>

          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-obsidian/70 via-obsidian/0 to-obsidian/25"
          />

          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
            <PropertyStatusBadge property={property} />
            <span className="flex items-center gap-1.5 rounded-full bg-obsidian/60 px-2.5 py-1.5 text-[11px] font-semibold tabular-nums text-white backdrop-blur-md">
              <Icon.Camera className="text-sm" />
              {property.media.length}
            </span>
          </div>

          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
            <p className="max-w-[75%] translate-y-3 text-sm font-medium leading-snug text-white opacity-0 transition-[opacity,translate] duration-700 ease-out-expo group-hover/card:translate-y-0 group-hover/card:opacity-100 group-has-[:focus-visible]/card:translate-y-0 group-has-[:focus-visible]/card:opacity-100">
              {property.headline}
            </p>
            <span className="grid size-11 shrink-0 translate-y-3 place-items-center rounded-full bg-gold text-lg text-obsidian opacity-0 transition-[opacity,translate] delay-75 duration-700 ease-out-expo group-hover/card:translate-y-0 group-hover/card:opacity-100">
              <Icon.ArrowUpRight />
            </span>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-display text-[1.65rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-obsidian">
              {formatCurrency(displayPrice(property))}
              {sold && (
                <span className="ml-2 align-middle text-[11px] font-bold uppercase tracking-[0.16em] text-crimson">
                  Sold
                </span>
              )}
            </p>
            {neighborhoodName && (
              <p className="shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] text-crimson">
                {neighborhoodName}
              </p>
            )}
          </div>

          {/* Rule that redraws in brand colours on hover. */}
          <div className="relative mt-4 h-px bg-ink/15">
            <span className="absolute inset-0 origin-left scale-x-0 bg-linear-to-r from-crimson to-gold transition-transform duration-700 ease-out-expo group-hover/card:scale-x-100" />
          </div>

          <p className="mt-4 text-[15px] font-semibold text-obsidian">{street}</p>
          <p className="mt-0.5 text-[13px] text-ink/60">{formatCityLine(property.address)}</p>
          <PropertySpecs property={property} className="mt-3.5 text-ink" />
        </div>
      </button>
    </article>
  );
}
