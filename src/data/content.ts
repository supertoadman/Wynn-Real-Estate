import { siteConfig } from "@/lib/site";
import type { BrokerageFact, NavItem, ServicePillar } from "@/types";
import { stockPhoto } from "./media";

export const primaryNav: NavItem[] = [
  {
    label: "Listings",
    href: "/#listings",
    description: "Homes for sale",
  },
  {
    label: "Neighborhoods",
    href: "/#neighborhoods",
    description: "The areas we work in",
  },
  {
    label: "About",
    href: "/#about",
    description: "Who we are and how we work",
  },
  {
    label: "Contact",
    href: "/#contact",
    description: "Start a conversation",
  },
];

/**
 * Credentials the broker confirmed. Pennsylvania only allows closed sales to
 * be advertised (49 Pa. Code § 35.307), and she chose to show years of
 * experience only, so no sales figures appear here.
 */
export const brokerageFacts: BrokerageFact[] = [
  {
    id: "experience",
    label: "Experience",
    value: 20,
    suffix: "+",
    description: `Years ${siteConfig.broker.name} has held a real estate license.`,
  },
  {
    id: "license",
    label: "License",
    text: "Broker",
    description: `${siteConfig.broker.licenseState} license ${siteConfig.broker.licenseNumber}.`,
  },
  {
    id: "realtor",
    label: "Membership",
    text: "REALTOR®",
    description: "Member of the National Association of REALTORS®.",
  },
  {
    id: "mls",
    label: "Listing service",
    text: "Bright MLS",
    description: "Listings are shared through the region's multiple listing service.",
  },
];

/** Copy is limited to services and claims the broker confirmed in her intake answers. */
export const servicePillars: ServicePillar[] = [
  {
    intent: "buy",
    title: "Buy",
    summary: "The right home, without the guesswork",
    description:
      "First homes, bigger homes, new construction and moves from out of the area. We know these neighborhoods, and we tell you what we really think of a house before you commit to it.",
    points: [
      "New construction and work with builders",
      "Help for buyers moving here from elsewhere",
      "Introductions to inspectors, attorneys and lenders",
    ],
    cta: { label: "Start your search", href: "/#contact" },
    image: {
      url: stockPhoto("1613977257363-707ba9348227"),
      alt: "White contemporary villa with pool",
    },
  },
  {
    intent: "sell",
    title: "Sell",
    summary: "Priced honestly, negotiated hard",
    description:
      "A straight opinion on price, a listing on Bright MLS, and a tough negotiator on your side of the table until the day you close.",
    points: [
      "Honest advice on price and preparation",
      "Your home listed on Bright MLS",
      "Patient help with downsizing and retirement moves",
    ],
    cta: { label: "Talk about selling", href: "/#contact" },
    image: {
      url: stockPhoto("1600047509358-9dc75507daeb"),
      alt: "Modern residence with timber detailing",
    },
  },
  {
    intent: "invest",
    title: "Invest",
    summary: "Property that has to earn its keep",
    description:
      "Rentals, commercial property and land, looked at as investments first: what it costs, what it earns, and what it is worth when you sell.",
    points: [
      "Investment and cash-flow figures prepared for you",
      "Help with 1031 exchanges",
      "Rentals, commercial property and land",
    ],
    cta: { label: "Discuss an investment", href: "/#contact" },
    image: {
      url: stockPhoto("1486406146926-c627a92ad1ab"),
      alt: "Glass towers seen from street level",
    },
  },
];

export const marqueePhrases = [
  "Buying",
  "Selling",
  "Rentals",
  "Investment property",
  "New construction",
  "Commercial",
  "Land",
  "1031 exchanges",
];
