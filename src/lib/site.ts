/**
 * Single source of truth for brokerage details.
 * PLACEHOLDER contact and licence values — replace before launch.
 */
export const siteConfig = {
  name: "Wynn Real Estate",
  shortName: "Wynn",
  tagline: "Where legacy finds its address.",
  description:
    "Wynn Real Estate represents the region's most significant residences — pairing discreet, data-driven advisory with marketing that moves markets.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en-US",
  /** Fixed zone so dates render identically on the server and in the browser. */
  timeZone: "America/Los_Angeles",
  contact: {
    phone: "(555) 010-2400",
    phoneHref: "tel:+15550102400",
    email: "private@wynnrealestate.example",
    addressLines: ["One Meridian Plaza, Suite 4000", "Port Sterling, CA 92602"],
    hours: "Private appointments daily, 8am – 8pm",
  },
  legal: {
    license: "Brokerage Lic. #00000000",
    entity: "Wynn Real Estate",
  },
  /** Add `{ label, href }` entries to surface social links in the footer. */
  social: [] as Array<{ label: string; href: string }>,
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * True in the GitHub Pages build: a static export with no server behind it,
 * so `/api/leads` does not exist there.
 */
export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
