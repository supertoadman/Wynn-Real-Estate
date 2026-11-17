/**
 * Single source of truth for brokerage details.
 *
 * Values come from the broker's intake answers (November 2026). Still to be
 * confirmed against the Pennsylvania license record before launch: the exact
 * business name on the brokerage license, and the year of first licensure.
 */
export const siteConfig = {
  name: "Wynn Real Estate",
  shortName: "Wynn",
  tagline: "Local knowledge. Lasting relationships.",
  description:
    "Wynn Real Estate is a broker-led office in Huntingdon Valley, Pennsylvania. Broker Irina Wynn has been licensed for more than 20 years, helping people buy, sell, rent and invest with straight answers and steady negotiation.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en-US",
  /** Fixed zone so dates render identically on the server and in the browser. */
  timeZone: "America/New_York",
  broker: {
    name: "Irina Wynn",
    title: "Broker",
    /** Member of the National Association of REALTORS, so the mark may be used. */
    realtor: true,
    licenseNumber: "RM420352",
    licenseState: "Pennsylvania",
    languages: ["English", "Russian"],
    /** Direct line; the broker is happy to be texted on it. */
    mobile: "(215) 421-7867",
    mobileHref: "tel:+12154217867",
  },
  contact: {
    /** The office's main line. */
    phone: "(215) 938-1777",
    phoneHref: "tel:+12159381777",
    email: "wynnrealestate@hotmail.com",
    addressLines: ["2327 Huntingdon Pike", "Huntingdon Valley, PA 19006"],
    hours: "By appointment only",
  },
  legal: {
    entity: "Wynn Real Estate",
    license: "Irina Wynn, Broker, REALTOR®. Licensed in Pennsylvania, license RM420352.",
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
