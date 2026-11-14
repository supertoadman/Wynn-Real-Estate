import type { ImageLoaderProps } from "next/image";

/**
 * Image loader for the static export (GitHub Pages), where Next's own image
 * optimizer isn't available. Unsplash resizes on its CDN, so ask it for the
 * width the browser needs; any other host is linked as-is.
 */
export default function staticImageLoader({ src, width, quality }: ImageLoaderProps) {
  if (!src.startsWith("https://images.unsplash.com/")) return src;

  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  return url.toString();
}
