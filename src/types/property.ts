/**
 * Listing types.
 *
 * Field names follow the RESO Data Dictionary (the schema MLS / IDX feeds
 * publish) in camelCase, so a feed adapter in `lib/api` is a rename rather
 * than a remodel. The RESO name is noted wherever ours differs.
 */

/** RESO `StandardStatus`. */
export type ListingStatus =
  | "Active"
  | "ComingSoon"
  | "ActiveUnderContract"
  | "Pending"
  | "Closed";

/** RESO `PropertyType`. */
export type PropertyType =
  | "Residential"
  | "ResidentialIncome"
  | "Land"
  | "CommercialSale";

/** RESO `PropertySubType` (subset used by the brokerage). */
export type PropertySubType =
  | "SingleFamilyResidence"
  | "Estate"
  | "Condominium"
  | "Penthouse"
  | "Townhouse"
  | "MultiFamily";

export interface PropertyAddress {
  streetNumber: string;
  streetName: string;
  unitNumber?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

/** RESO `Media` resource. */
export interface PropertyMedia {
  mediaKey: string;
  mediaUrl: string;
  mediaCategory: "Photo" | "Video" | "FloorPlan" | "VirtualTour";
  /** Sort order; 0 is the primary photo. */
  order: number;
  /** Used as image alt text. RESO `ShortDescription`. */
  shortDescription: string;
}

/** RESO `Member` resource (listing agent). */
export interface ListingAgent {
  memberKey: string;
  fullName: string;
  title: string;
  phone: string;
  email: string;
  photoUrl?: string;
  licenseNumber?: string;
}

/** RESO `OpenHouse` resource. ISO 8601 timestamps. */
export interface OpenHouse {
  startTime: string;
  endTime: string;
}

/** Income-property figures, present when `propertyType` is `ResidentialIncome`. */
export interface InvestmentProfile {
  capRate: number;
  grossAnnualIncome: number;
  unitsTotal: number;
}

export interface Property {
  /** Stable unique key from the MLS. RESO `ListingKey`. */
  listingKey: string;
  /** Human-facing MLS number. RESO `ListingId`. */
  listingId: string;
  /** URL segment for `/listings/[slug]`. Not a RESO field. */
  slug: string;

  standardStatus: ListingStatus;
  listPrice: number;
  closePrice?: number;

  address: PropertyAddress;
  coordinates: GeoPoint;
  /** Joins to `Neighborhood.slug`. */
  neighborhoodSlug: string;

  propertyType: PropertyType;
  propertySubType: PropertySubType;

  bedroomsTotal: number;
  bathroomsFull: number;
  bathroomsHalf: number;
  /** Interior square feet. RESO `LivingArea`. */
  livingArea: number;
  lotSizeAcres?: number;
  yearBuilt: number;
  garageSpaces?: number;

  /** Short marketing line shown on cards. Not a RESO field. */
  headline: string;
  publicRemarks: string;
  features: string[];
  media: PropertyMedia[];

  listAgent: ListingAgent;
  /** ISO date the listing agreement began. */
  listingContractDate: string;
  daysOnMarket: number;
  /** ISO timestamp of the last feed update. */
  modificationTimestamp: string;

  /** Curated onto the homepage. Not a RESO field. */
  isFeatured: boolean;
  openHouse?: OpenHouse;
  virtualTourUrl?: string;
  investment?: InvestmentProfile;
}

/** Identifier of a price band defined in `lib/filters`. */
export type PriceBandId = "any" | "under-5m" | "5m-10m" | "over-10m";

/** UI search state. `"all"` / `"any"` / `0` mean "no constraint". */
export interface PropertyFilters {
  neighborhood: string;
  subType: PropertySubType | "all";
  priceBand: PriceBandId;
  minBeds: number;
}
