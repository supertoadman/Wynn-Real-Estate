import type { Neighborhood } from "@/types";
import { stockPhoto } from "./media";

/**
 * MOCK NEIGHBORHOODS — fictional placeholder areas and market statistics.
 * Replace with the brokerage's real service areas and a market-data feed.
 */
export const neighborhoods: Neighborhood[] = [
  {
    slug: "crown-ridge",
    name: "Crown Ridge",
    tagline: "Gated hillside estates",
    description:
      "The region's most coveted elevation: architect-designed estates on acre-plus lots, private gates, and views that run from the skyline to the sea.",
    heroImage: {
      url: stockPhoto("1416331108676-a22ccb276e35"),
      alt: "Hillside estate with pool at twilight in Crown Ridge",
    },
    coordinates: { latitude: 33.6431, longitude: -117.8394 },
    character: ["Gated", "Panoramic views", "Acre+ lots"],
    market: {
      medianSalePrice: 9_850_000,
      medianPriceChangeYoY: 8.4,
      averageDaysOnMarket: 38,
      pricePerSqFt: 1_420,
      activeListings: 14,
      saleToListRatio: 98.6,
      trend: [8.9, 9.0, 9.05, 9.2, 9.15, 9.3, 9.45, 9.4, 9.6, 9.7, 9.78, 9.85],
    },
  },
  {
    slug: "harbor-point",
    name: "Harbor Point",
    tagline: "Waterfront & private docks",
    description:
      "A protected peninsula of contemporary waterfront homes, where deep-water docks and sunset terraces come standard and inventory rarely lasts a month.",
    heroImage: {
      url: stockPhoto("1499793983690-e29da59ef1c2"),
      alt: "Waterfront residence over calm water at Harbor Point",
    },
    coordinates: { latitude: 33.6058, longitude: -117.9041 },
    character: ["Waterfront", "Private docks", "Walkable marina"],
    market: {
      medianSalePrice: 7_200_000,
      medianPriceChangeYoY: 11.2,
      averageDaysOnMarket: 19,
      pricePerSqFt: 1_610,
      activeListings: 6,
      saleToListRatio: 102.3,
      trend: [6.3, 6.35, 6.5, 6.48, 6.6, 6.75, 6.7, 6.85, 6.95, 7.0, 7.12, 7.2],
    },
  },
  {
    slug: "meridian-district",
    name: "Meridian District",
    tagline: "Skyline penthouses",
    description:
      "Downtown's cultural core, defined by full-service towers, private clubs and penthouses with terraces the size of gardens.",
    heroImage: {
      url: stockPhoto("1480714378408-67cf0d13bc1b"),
      alt: "Meridian District skyline in evening light",
    },
    coordinates: { latitude: 33.6172, longitude: -117.8756 },
    character: ["Full-service towers", "Arts & dining", "Lock-and-leave"],
    market: {
      medianSalePrice: 3_450_000,
      medianPriceChangeYoY: 4.1,
      averageDaysOnMarket: 46,
      pricePerSqFt: 1_180,
      activeListings: 31,
      saleToListRatio: 97.4,
      trend: [3.3, 3.32, 3.28, 3.35, 3.38, 3.36, 3.4, 3.42, 3.39, 3.44, 3.43, 3.45],
    },
  },
  {
    slug: "old-vine",
    name: "Old Vine",
    tagline: "Heritage manors",
    description:
      "Century-old estates on canopy-lined lanes. Old Vine trades quietly, often off-market, and rewards buyers who value provenance over novelty.",
    heroImage: {
      url: stockPhoto("1449844908441-8829872d2607"),
      alt: "Tree-lined lane and heritage home in Old Vine",
    },
    coordinates: { latitude: 33.6641, longitude: -117.8117 },
    character: ["Historic", "Canopy streets", "Off-market trades"],
    market: {
      medianSalePrice: 5_600_000,
      medianPriceChangeYoY: 6.3,
      averageDaysOnMarket: 29,
      pricePerSqFt: 985,
      activeListings: 9,
      saleToListRatio: 100.8,
      trend: [5.2, 5.25, 5.22, 5.3, 5.36, 5.4, 5.38, 5.45, 5.5, 5.52, 5.57, 5.6],
    },
  },
  {
    slug: "sablewood",
    name: "Sablewood",
    tagline: "Garden estates on acreage",
    description:
      "Room to breathe within twenty minutes of downtown: multi-acre garden estates, new-build farmhouses and the area's top-ranked schools.",
    heroImage: {
      url: stockPhoto("1564013799919-ab600027ffc6"),
      alt: "Garden estate with pool in Sablewood",
    },
    coordinates: { latitude: 33.6889, longitude: -117.7862 },
    character: ["Multi-acre lots", "Top schools", "New construction"],
    market: {
      medianSalePrice: 3_900_000,
      medianPriceChangeYoY: 9.7,
      averageDaysOnMarket: 24,
      pricePerSqFt: 760,
      activeListings: 17,
      saleToListRatio: 101.5,
      trend: [3.5, 3.52, 3.58, 3.6, 3.66, 3.7, 3.72, 3.78, 3.8, 3.84, 3.88, 3.9],
    },
  },
];
