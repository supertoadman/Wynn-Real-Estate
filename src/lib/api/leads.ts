import type { LeadForm } from "@/types";

/**
 * Lead delivery. Server-only — imported by `app/api/leads/route.ts`.
 *
 * Set `CRM_WEBHOOK_URL` (see `.env.example`) to forward every enquiry to a
 * CRM or automation platform. Without it, leads are logged to the server
 * console so the form is fully testable in development.
 */

export interface LeadRecord extends LeadForm {
  receivedAt: string;
}

export async function deliverLead(lead: LeadRecord): Promise<void> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;

  if (!webhookUrl) {
    console.info("[leads] CRM_WEBHOOK_URL not set — lead logged only:", lead);
    return;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.CRM_WEBHOOK_SECRET && {
        Authorization: `Bearer ${process.env.CRM_WEBHOOK_SECRET}`,
      }),
    },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`CRM webhook responded with ${response.status}`);
  }
}
