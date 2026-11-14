import type {
  LeadFieldErrors,
  LeadForm,
  LeadIntent,
  LeadTimeline,
} from "@/types";

/**
 * Lead-form validation, shared by the browser (instant feedback) and the
 * API route (the check that actually counts).
 */

export const LEAD_INTENTS: Array<{ value: LeadIntent; label: string }> = [
  { value: "buy", label: "Buy" },
  { value: "sell", label: "Sell" },
  { value: "invest", label: "Invest" },
];

export const LEAD_TIMELINES: Array<{ value: LeadTimeline; label: string }> = [
  { value: "now", label: "Ready now" },
  { value: "3-months", label: "Within 3 months" },
  { value: "6-months", label: "Within 6 months" },
  { value: "exploring", label: "Just exploring" },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\-.\s\d]{7,20}$/;

const LIMITS = { fullName: 120, email: 254, message: 2_000, source: 80 };

export type LeadValidation =
  | { ok: true; data: LeadForm }
  | { ok: false; errors: LeadFieldErrors };

export function validateLead(input: unknown): LeadValidation {
  const raw = (input && typeof input === "object" ? input : {}) as Record<
    string,
    unknown
  >;
  const text = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim() : "";

  const errors: LeadFieldErrors = {};

  const fullName = text("fullName");
  if (fullName.length < 2) errors.fullName = "Please enter your name.";
  else if (fullName.length > LIMITS.fullName) errors.fullName = "That name is too long.";

  const email = text("email");
  if (!EMAIL.test(email) || email.length > LIMITS.email) {
    errors.email = "Please enter a valid email address.";
  }

  const phone = text("phone");
  if (phone && !PHONE.test(phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  const intent = LEAD_INTENTS.find((option) => option.value === raw.intent)?.value;
  if (!intent) errors.intent = "Please choose an option.";

  const timeline = LEAD_TIMELINES.find(
    (option) => option.value === raw.timeline,
  )?.value;
  if (!timeline) errors.timeline = "Please choose a timeline.";

  const message = text("message");
  if (message.length > LIMITS.message) {
    errors.message = `Please keep your message under ${LIMITS.message.toLocaleString("en-US")} characters.`;
  }

  if (Object.keys(errors).length > 0 || !intent || !timeline) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      intent,
      timeline,
      ...(phone && { phone }),
      ...(message && { message }),
      ...(text("listingKey") && { listingKey: text("listingKey").slice(0, 64) }),
      source: text("source").slice(0, LIMITS.source) || "website",
    },
  };
}
