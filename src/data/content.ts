import type { BrokerageMetric, NavItem, ServicePillar } from "@/types";
import { stockPhoto } from "./media";

export const primaryNav: NavItem[] = [
  {
    label: "Residences",
    href: "/#listings",
    description: "The current portfolio",
  },
  {
    label: "Neighborhoods",
    href: "/#neighborhoods",
    description: "Live market intelligence",
  },
  {
    label: "The Firm",
    href: "/#about",
    description: "How we represent you",
  },
  {
    label: "Contact",
    href: "/#contact",
    description: "Begin a private conversation",
  },
];

/**
 * PLACEHOLDER FIGURES — replace with the brokerage's audited numbers before
 * launch. Performance claims in real-estate advertising must be verifiable.
 */
export const brokerageMetrics: BrokerageMetric[] = [
  {
    id: "volume",
    label: "Sales volume",
    description: "Closed residential and investment transactions to date.",
    value: 2.4,
    decimals: 1,
    prefix: "$",
    suffix: "B",
  },
  {
    id: "days",
    label: "Avg. days on market",
    description: "From launch to accepted offer across Wynn listings.",
    value: 21,
  },
  {
    id: "ratio",
    label: "Sale-to-list price",
    description: "Average closing price relative to asking.",
    value: 103,
    suffix: "%",
  },
  {
    id: "satisfaction",
    label: "Client satisfaction",
    description: "Clients who return or refer within five years.",
    value: 98,
    suffix: "%",
  },
];

export const servicePillars: ServicePillar[] = [
  {
    intent: "buy",
    title: "Buy",
    summary: "Access before the market",
    description:
      "A third of what we sell never reaches the open market. We source quietly, benchmark every offer against live comparables, and negotiate as though the capital were our own.",
    points: [
      "Private and pre-market inventory",
      "Valuation brief on every shortlist home",
      "Inspection, legal and lending concierge",
    ],
    cta: { label: "Start your search", href: "/#listings" },
    image: {
      url: stockPhoto("1613977257363-707ba9348227"),
      alt: "White contemporary villa with pool",
    },
  },
  {
    intent: "sell",
    title: "Sell",
    summary: "Marketing that moves markets",
    description:
      "Editorial photography, cinematic film and a launch plan built around the few hundred buyers who can actually act. Positioned precisely, a home doesn't linger — it competes.",
    points: [
      "Pricing strategy from sold, not listed, data",
      "Film, editorial and global syndication",
      "Private previews for qualified buyers",
    ],
    cta: { label: "Request a valuation", href: "/#contact" },
    image: {
      url: stockPhoto("1600047509358-9dc75507daeb"),
      alt: "Modern residence with timber detailing",
    },
  },
  {
    intent: "invest",
    title: "Invest",
    summary: "Portfolios built to compound",
    description:
      "From boutique multi-family to development sites, we underwrite every opportunity on yield, risk and exit — then manage the acquisition end to end.",
    points: [
      "Underwriting and cash-flow modelling",
      "Off-market income properties",
      "1031 exchange and entity coordination",
    ],
    cta: { label: "Discuss your portfolio", href: "/#contact" },
    image: {
      url: stockPhoto("1486406146926-c627a92ad1ab"),
      alt: "Glass towers seen from street level",
    },
  },
];

export const marqueePhrases = [
  "Private sales",
  "Estate advisory",
  "New development",
  "Investment portfolios",
  "Global relocation",
  "Off-market access",
];
