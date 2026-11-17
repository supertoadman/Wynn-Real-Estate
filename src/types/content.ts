import type { LeadIntent } from "./lead";

export interface NavItem {
  label: string;
  href: string;
  /** Optional supporting line shown in the mobile drawer. */
  description?: string;
  external?: boolean;
  children?: NavItem[];
}

/**
 * A headline fact about the brokerage: either a number, which counts up, or
 * a short piece of text such as a credential.
 */
export interface BrokerageFact {
  id: string;
  label: string;
  description: string;
  /** Numeric facts animate; give `value` or `text`, not both. */
  value?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  text?: string;
}

/** One of the Buy / Sell / Invest service pillars. */
export interface ServicePillar {
  intent: LeadIntent;
  title: string;
  summary: string;
  description: string;
  points: string[];
  cta: {
    label: string;
    href: string;
  };
  image: {
    url: string;
    alt: string;
  };
}
