export type LeadIntent = "buy" | "sell" | "invest";

export type LeadTimeline = "now" | "3-months" | "6-months" | "exploring";

/** Payload captured by the consultation form and posted to `/api/leads`. */
export interface LeadForm {
  fullName: string;
  email: string;
  phone?: string;
  intent: LeadIntent;
  timeline: LeadTimeline;
  message?: string;
  /** Set when the enquiry started from a specific listing. */
  listingKey?: string;
  /** Where on the site the lead was captured, for CRM attribution. */
  source: string;
}

export type LeadFieldErrors = Partial<Record<keyof LeadForm, string>>;

export type LeadSubmissionResult =
  | { ok: true; message: string }
  | { ok: false; message: string; errors?: LeadFieldErrors };
