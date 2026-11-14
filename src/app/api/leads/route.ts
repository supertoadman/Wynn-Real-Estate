import { deliverLead } from "@/lib/api/leads";
import { siteConfig } from "@/lib/site";
import { validateLead } from "@/lib/validation";
import type { LeadSubmissionResult } from "@/types";

const THANKS = "Thank you. A senior advisor will be in touch within one business day.";

function json(body: LeadSubmissionResult, status = 200) {
  return Response.json(body, { status });
}

/**
 * POST /api/leads — receives the consultation form.
 *
 * Validates the payload again on the server (never trust the browser), then
 * hands it to `deliverLead`, which forwards to the CRM webhook when one is
 * configured. Before launch, add rate limiting (e.g. per-IP at the edge) and
 * a CAPTCHA or Turnstile check here.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: "The request could not be read." }, 400);
  }

  // Honeypot: real visitors never see or fill the `company` field. Answer
  // bots with a success so they don't learn to avoid it, and drop the lead.
  const honeypot = (body as { company?: unknown } | null)?.company;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return json({ ok: true, message: THANKS });
  }

  const result = validateLead(body);
  if (!result.ok) {
    return json(
      {
        ok: false,
        message: "Please check the highlighted fields and try again.",
        errors: result.errors,
      },
      422,
    );
  }

  try {
    await deliverLead({ ...result.data, receivedAt: new Date().toISOString() });
  } catch (error) {
    console.error("[leads] delivery failed:", error);
    return json(
      {
        ok: false,
        message: `We couldn't send your enquiry just now. Please try again, or call ${siteConfig.contact.phone}.`,
      },
      502,
    );
  }

  return json({ ok: true, message: THANKS });
}
