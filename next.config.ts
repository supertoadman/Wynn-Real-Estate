import type { NextConfig } from "next";

/**
 * GitHub Pages can only serve files, so its deploy workflow builds a static
 * export instead of a server build. The workflow sets these two variables;
 * leave them unset everywhere else.
 */
const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  ...(staticExport
    ? {
        output: "export" as const,
        // Next refuses to combine Cache Components with a static export, so this
        // build enables only the `"use cache"` directive the data layer uses.
        // The flag is deprecated: re-check it when upgrading Next.
        experimental: { useCache: true },
      }
    : { cacheComponents: true, partialPrefetching: true }),
  // A project site lives under `/<repository>`, not at the domain root.
  basePath,
  images: {
    // Mock listing photography is hot-linked from Unsplash. When the MLS/IDX
    // feed is wired up, add its media CDN hostname here.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    // The image optimizer needs a server; a static export sizes images at the
    // photo CDN instead.
    ...(staticExport && {
      loader: "custom" as const,
      loaderFile: "./src/lib/image-loader.ts",
    }),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
