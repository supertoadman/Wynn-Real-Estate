import type { GeoPoint } from "./property";

/** Rolling market statistics for one neighborhood. */
export interface MarketSnapshot {
  medianSalePrice: number;
  /** Year-over-year change in median sale price, in percent (e.g. `6.8`). */
  medianPriceChangeYoY: number;
  averageDaysOnMarket: number;
  pricePerSqFt: number;
  activeListings: number;
  /** Sale price as a percentage of list price (e.g. `101.2`). */
  saleToListRatio: number;
  /** Median sale price for each of the trailing 12 months, oldest first. */
  trend: number[];
}

export interface Neighborhood {
  slug: string;
  name: string;
  /** One-line positioning shown beside the name. */
  tagline: string;
  description: string;
  heroImage: {
    url: string;
    alt: string;
  };
  coordinates: GeoPoint;
  /** Short descriptors rendered as chips. */
  character: string[];
  market: MarketSnapshot;
}
