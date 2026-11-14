import { cacheLife } from "next/cache";
import { neighborhoods, properties } from "@/data";
import type { Neighborhood, Property } from "@/types";

/**
 * Listing data access.
 *
 * Pages and sections only ever call these functions — never `@/data`
 * directly. To go live, replace each body with a call to the MLS / IDX
 * provider (or a CMS) and map the response onto the `Property` and
 * `Neighborhood` types. Nothing above this layer needs to change.
 *
 * Each function is cached with `use cache`, so a slow upstream feed is
 * fetched at most once per `cacheLife` window instead of on every request.
 */

export async function getProperties(): Promise<Property[]> {
  "use cache";
  cacheLife("hours");
  return properties;
}

export async function getFeaturedProperties(): Promise<Property[]> {
  "use cache";
  cacheLife("hours");
  return properties.filter((property) => property.isFeatured);
}

export async function getPropertyBySlug(
  slug: string,
): Promise<Property | undefined> {
  "use cache";
  cacheLife("hours");
  return properties.find((property) => property.slug === slug);
}

export async function getNeighborhoods(): Promise<Neighborhood[]> {
  "use cache";
  cacheLife("days");
  return neighborhoods;
}
