import type { LeadIntent } from "./lead";

export interface NavItem {
  label: string;
  href: string;
  /** Optional supporting line shown in the mobile drawer. */
  description?: string;
  external?: boolean;
  children?: NavItem[];
}

/** A headline brokerage statistic rendered by the animated counter. */
export interface BrokerageMetric {
  id: string;
  label: string;
  description: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
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
