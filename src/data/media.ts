/**
 * Placeholder photography, hot-linked from Unsplash for the mock dataset.
 * Real listing media will come from the MLS feed's CDN — when it does, add
 * that hostname to `images.remotePatterns` in `next.config.ts`.
 */
export function stockPhoto(id: string, width = 2000): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`;
}
