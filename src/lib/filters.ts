import type {
  PriceBandId,
  Property,
  PropertyFilters,
  PropertySubType,
} from "@/types";
import { displayPrice, formatSubType } from "./formatters";

/**
 * Pure listing-search logic, shared by the hero filter bar today and the
 * `/listings` index + API route tomorrow.
 */

export const DEFAULT_FILTERS: PropertyFilters = {
  neighborhood: "all",
  subType: "all",
  priceBand: "any",
  minBeds: 0,
};

export const PRICE_BANDS: Array<{
  id: PriceBandId;
  label: string;
  min: number;
  max: number;
}> = [
  { id: "any", label: "Any price", min: 0, max: Infinity },
  { id: "under-5m", label: "Under $5M", min: 0, max: 5_000_000 },
  { id: "5m-10m", label: "$5M – $10M", min: 5_000_000, max: 10_000_000 },
  { id: "over-10m", label: "$10M +", min: 10_000_000, max: Infinity },
];

export const BED_OPTIONS = [
  { value: 0, label: "Any beds" },
  { value: 3, label: "3+ beds" },
  { value: 4, label: "4+ beds" },
  { value: 5, label: "5+ beds" },
  { value: 6, label: "6+ beds" },
];

/** Sub-type options present in a dataset, in a stable order. */
export function subTypeOptions(
  properties: Property[],
): Array<{ value: PropertySubType; label: string }> {
  const seen = new Set(properties.map((property) => property.propertySubType));
  return [...seen].map((value) => ({ value, label: formatSubType(value) }));
}

export function filterProperties(
  properties: Property[],
  filters: PropertyFilters,
): Property[] {
  const band =
    PRICE_BANDS.find((candidate) => candidate.id === filters.priceBand) ??
    PRICE_BANDS[0];

  return properties.filter((property) => {
    if (
      filters.neighborhood !== "all" &&
      property.neighborhoodSlug !== filters.neighborhood
    ) {
      return false;
    }
    if (
      filters.subType !== "all" &&
      property.propertySubType !== filters.subType
    ) {
      return false;
    }
    const price = displayPrice(property);
    if (price < band.min || price >= band.max) return false;
    if (property.bedroomsTotal < filters.minBeds) return false;
    return true;
  });
}

export function countActiveFilters(filters: PropertyFilters): number {
  return (Object.keys(DEFAULT_FILTERS) as Array<keyof PropertyFilters>).filter(
    (key) => filters[key] !== DEFAULT_FILTERS[key],
  ).length;
}
