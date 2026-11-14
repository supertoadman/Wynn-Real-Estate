"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { GlassCard, Icon, MagneticButton } from "@/components/ui";
import { useSectionScroll } from "@/hooks";
import {
  BED_OPTIONS,
  DEFAULT_FILTERS,
  filterProperties,
  PRICE_BANDS,
  subTypeOptions,
} from "@/lib/filters";
import { cn } from "@/lib/utils";
import type {
  Neighborhood,
  PriceBandId,
  Property,
  PropertyFilters,
  PropertySubType,
} from "@/types";
import { useListings } from "./ListingsContext";

interface PropertyFilterBarProps {
  properties: Property[];
  neighborhoods: Neighborhood[];
  /** Section to scroll to once the search is applied. */
  resultsSelector?: string;
  className?: string;
}

/**
 * Floating glass search bar. Edits a local draft, shows a live match count
 * on the submit button, then commits the filters to the shared listings
 * state and scrolls to the results.
 */
export function PropertyFilterBar({
  properties,
  neighborhoods,
  resultsSelector = "#listings",
  className,
}: PropertyFilterBarProps) {
  const { setFilters } = useListings();
  const scrollToSection = useSectionScroll();
  const [draft, setDraft] = useState<PropertyFilters>(DEFAULT_FILTERS);

  const matches = filterProperties(properties, draft).length;
  const update = (patch: Partial<PropertyFilters>) =>
    setDraft((current) => ({ ...current, ...patch }));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilters(draft);
    scrollToSection(resultsSelector);
  };

  return (
    <GlassCard className={cn("p-2", className)}>
      <form
        onSubmit={onSubmit}
        role="search"
        aria-label="Search residences"
        className="grid grid-cols-2 gap-px lg:grid-cols-[1.25fr_1fr_1fr_0.9fr_auto] lg:items-stretch"
      >
        <Field label="Neighborhood" icon={<Icon.MapPin />}>
          {(id) => (
            <Select
              id={id}
              value={draft.neighborhood}
              onChange={(value) => update({ neighborhood: value })}
            >
              <option value="all">All neighborhoods</option>
              {neighborhoods.map((neighborhood) => (
                <option key={neighborhood.slug} value={neighborhood.slug}>
                  {neighborhood.name}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label="Property type">
          {(id) => (
            <Select
              id={id}
              value={draft.subType}
              onChange={(value) =>
                update({ subType: value as PropertySubType | "all" })
              }
            >
              <option value="all">Any type</option>
              {subTypeOptions(properties).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label="Price">
          {(id) => (
            <Select
              id={id}
              value={draft.priceBand}
              onChange={(value) => update({ priceBand: value as PriceBandId })}
            >
              {PRICE_BANDS.map((band) => (
                <option key={band.id} value={band.id}>
                  {band.label}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <Field label="Bedrooms">
          {(id) => (
            <Select
              id={id}
              value={String(draft.minBeds)}
              onChange={(value) => update({ minBeds: Number(value) })}
            >
              {BED_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </Field>

        <div className="col-span-2 flex items-center p-1.5 lg:col-span-1 lg:pl-3">
          <MagneticButton
            type="submit"
            size="lg"
            strength={0.2}
            icon={<Icon.Search />}
            className="w-full lg:w-auto"
          >
            <span aria-live="polite" className="tabular-nums">
              {matches === 0
                ? "No matches"
                : `Show ${matches} ${matches === 1 ? "residence" : "residences"}`}
            </span>
          </MagneticButton>
        </div>
      </form>
    </GlassCard>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: ReactNode;
  children: (id: string) => ReactNode;
}) {
  const id = useId();

  return (
    <div className="group/field relative rounded-xl px-4 py-3 transition-colors duration-300 hover:bg-white/[0.06] focus-within:bg-white/[0.08] lg:px-5 lg:not-first:before:absolute lg:not-first:before:inset-y-3 lg:not-first:before:left-0 lg:not-first:before:w-px lg:not-first:before:bg-white/10">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-gold/80"
      >
        {icon && <span className="text-xs">{icon}</span>}
        {label}
      </label>
      {children(id)}
    </div>
  );
}

function Select({
  id,
  value,
  onChange,
  children,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative mt-1">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full cursor-pointer appearance-none truncate bg-transparent pr-6 text-[15px] font-medium text-alabaster outline-none [color-scheme:dark] [&>option]:bg-carbon [&>option]:text-alabaster"
      >
        {children}
      </select>
      <Icon.ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-base text-alabaster/50 transition-colors group-hover/field:text-gold" />
    </div>
  );
}
