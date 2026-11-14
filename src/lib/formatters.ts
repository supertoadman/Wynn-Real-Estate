import type {
  ListingStatus,
  Property,
  PropertyAddress,
  PropertySubType,
} from "@/types";
import { siteConfig } from "./site";

const { locale, timeZone } = siteConfig;

const currency = new Intl.NumberFormat(locale, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const integer = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });

const openHouseDay = new Intl.DateTimeFormat(locale, {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone,
});

const openHouseTime = new Intl.DateTimeFormat(locale, {
  hour: "numeric",
  minute: "2-digit",
  timeZone,
});

/** `12750000` → `$12,750,000` */
export function formatCurrency(value: number): string {
  return currency.format(value);
}

/** `12750000` → `$12.75M`, `742000` → `$742K` */
export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000_000) return `$${trim(value / 1_000_000_000)}B`;
  if (value >= 1_000_000) return `$${trim(value / 1_000_000)}M`;
  if (value >= 1_000) return `$${trim(value / 1_000, 0)}K`;
  return currency.format(value);
}

/** `9840` → `9,840` */
export function formatNumber(value: number): string {
  return integer.format(value);
}

/** `9840` → `9,840 sq ft` */
export function formatSqFt(value: number): string {
  return `${integer.format(value)} sq ft`;
}

/** `1.8` → `1.8 acres` */
export function formatAcres(value: number): string {
  return `${trim(value)} ${value === 1 ? "acre" : "acres"}`;
}

/** `8.4` → `+8.4%` */
export function formatPercent(
  value: number,
  { signed = false, digits = 1 }: { signed?: boolean; digits?: number } = {},
): string {
  const sign = signed && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

/** Full + half baths as a single figure: `7` full, `2` half → `8` ; `5`,`1` → `5.5` */
export function formatBaths(full: number, half: number): string {
  return trim(full + half * 0.5, 1);
}

/** `8 Blackstone Court` / `200 Meridian Avenue, PH 4201` */
export function formatStreetAddress(address: PropertyAddress): string {
  const street = `${address.streetNumber} ${address.streetName}`;
  return address.unitNumber ? `${street}, ${address.unitNumber}` : street;
}

/** `Port Sterling, CA 92601` */
export function formatCityLine(address: PropertyAddress): string {
  return `${address.city}, ${address.stateOrProvince} ${address.postalCode}`;
}

/** `Sat, Nov 21 · 1:00 PM – 4:00 PM` */
export function formatOpenHouse(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  return `${openHouseDay.format(start)} · ${openHouseTime.format(start)} – ${openHouseTime.format(end)}`;
}

const STATUS_LABELS: Record<ListingStatus, string> = {
  Active: "For sale",
  ComingSoon: "Coming soon",
  ActiveUnderContract: "Under contract",
  Pending: "Sale pending",
  Closed: "Sold",
};

/** Buyer-facing label for a listing, e.g. `Just listed`, `Open house`, `Sold`. */
export function formatListingStatus(property: Property): string {
  if (property.standardStatus === "Active") {
    if (property.openHouse) return "Open house";
    if (property.daysOnMarket <= 7) return "Just listed";
  }
  return STATUS_LABELS[property.standardStatus];
}

const SUB_TYPE_LABELS: Record<PropertySubType, string> = {
  SingleFamilyResidence: "Residence",
  Estate: "Estate",
  Condominium: "Condominium",
  Penthouse: "Penthouse",
  Townhouse: "Townhouse",
  MultiFamily: "Multi-family",
};

export function formatSubType(subType: PropertySubType): string {
  return SUB_TYPE_LABELS[subType];
}

/** The price to headline: closing price for sold homes, list price otherwise. */
export function displayPrice(property: Property): number {
  return property.standardStatus === "Closed" && property.closePrice
    ? property.closePrice
    : property.listPrice;
}

function trim(value: number, maxDigits = 2): string {
  return Number(value.toFixed(maxDigits)).toString();
}
