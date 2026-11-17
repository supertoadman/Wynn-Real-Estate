"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { useListings } from "@/components/listings";
import { Icon, MagneticButton, SectionHeading } from "@/components/ui";
import { EASE, fadeUp, inView } from "@/lib/animations";
import { formatStreetAddress } from "@/lib/formatters";
import { isStaticExport, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { LEAD_INTENTS, LEAD_TIMELINES, validateLead } from "@/lib/validation";
import type {
  LeadFieldErrors,
  LeadSubmissionResult,
  LeadTimeline,
} from "@/types";

const ASSURANCES = [
  "A reply within one business day",
  `Talk directly with the broker, ${siteConfig.broker.name}`,
  `${siteConfig.broker.languages.join(" and ")} spoken`,
];

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY = { fullName: "", email: "", phone: "", message: "", company: "" };

/**
 * Consultation / lead-capture section. Validates in the browser, posts to
 * `/api/leads`, and carries context from elsewhere on the page — the intent
 * chosen in a service pillar, or the listing a visitor asked to view.
 */
export function ContactCTA() {
  const { inquiry, setInquiry } = useListings();
  const [fields, setFields] = useState(EMPTY);
  const [timeline, setTimeline] = useState<LeadTimeline>("3-months");
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const intent = inquiry.intent ?? "buy";
  const listing = inquiry.property;
  const firstName = fields.fullName.trim().split(" ")[0];

  const setField = (name: keyof typeof EMPTY, value: string) => {
    setFields((current) => ({ ...current, [name]: value }));
    if (name in errors) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const payload = {
      ...fields,
      intent,
      timeline,
      listingKey: listing?.listingKey,
      source: listing ? "homepage:quick-view" : "homepage:consultation",
    };

    const check = validateLead(payload);
    if (!check.ok) {
      setErrors(check.errors);
      setStatus("idle");
      return;
    }

    setErrors({});

    if (isStaticExport) {
      // Nothing can receive the enquiry here, so say so rather than fail vaguely.
      setServerMessage(
        "This preview of the site isn't connected to an inbox yet, so your enquiry was not sent.",
      );
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as LeadSubmissionResult;

      if (result.ok) {
        setStatus("success");
        return;
      }
      if (result.errors) setErrors(result.errors);
      setServerMessage(result.message);
      setStatus("error");
    } catch {
      setServerMessage(
        `We couldn't send your enquiry. Please try again, or call ${siteConfig.contact.phone}.`,
      );
      setStatus("error");
    }
  };

  const reset = () => {
    setFields(EMPTY);
    setInquiry({ intent });
    setStatus("idle");
  };

  return (
    <section id="contact" className="relative bg-alabaster py-24 text-obsidian md:py-36">
      <div className="mx-auto grid max-w-[1680px] gap-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 lg:pr-10">
          <SectionHeading
            tone="light"
            index="04"
            eyebrow="Consultation"
            title={"Start with a\n*straight* conversation."}
            description="Tell us what you are considering. We'll come back with a clear view of the market, your options, and how we would approach it — whether you act this quarter or next year."
          />

          <motion.ul
            variants={fadeUp}
            custom={0.2}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="mt-10 space-y-4"
          >
            {ASSURANCES.map((line) => (
              <li key={line} className="flex items-start gap-3 text-[15px] text-ink/80">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-crimson text-xs text-white">
                  <Icon.Check strokeWidth={2.5} />
                </span>
                {line}
              </li>
            ))}
          </motion.ul>

          <motion.div
            variants={fadeUp}
            custom={0.3}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="mt-12 grid gap-6 border-t border-ink/15 pt-8 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2"
          >
            <ContactLine icon={<Icon.Phone />} label="Call the office">
              <a
                href={siteConfig.contact.phoneHref}
                className="tabular-nums transition-colors hover:text-crimson"
              >
                {siteConfig.contact.phone}
              </a>
            </ContactLine>
            <ContactLine icon={<Icon.Phone />} label={`Call or text ${siteConfig.broker.name}`}>
              <a
                href={siteConfig.broker.mobileHref}
                className="tabular-nums transition-colors hover:text-crimson"
              >
                {siteConfig.broker.mobile}
              </a>
            </ContactLine>
            <ContactLine icon={<Icon.Mail />} label="Write to us">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="break-words transition-colors hover:text-crimson"
              >
                {siteConfig.contact.email}
              </a>
            </ContactLine>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 1.1, ease: EASE.outExpo }}
          className="lg:col-span-6"
        >
          <div className="border-gradient-brand relative isolate overflow-hidden rounded-3xl bg-obsidian p-6 text-alabaster shadow-panel md:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_100%_0%,rgb(200_16_46/0.30),transparent_70%),radial-gradient(60%_45%_at_0%_100%,rgb(245_183_0/0.12),transparent_70%)]"
            />

            <AnimatePresence mode="wait" initial={false}>
              {status === "success" ? (
                <motion.div
                  key="success"
                  role="status"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: EASE.outExpo }}
                  className="flex min-h-[460px] flex-col items-start justify-center"
                >
                  <span className="grid size-16 place-items-center rounded-full bg-gold text-3xl text-obsidian shadow-glow-gold">
                    <Icon.Check strokeWidth={2} />
                  </span>
                  <h3 className="mt-8 text-4xl font-semibold tracking-[-0.03em]">
                    Thank you{firstName ? `, ${firstName}` : ""}.
                  </h3>
                  <p className="mt-4 max-w-md text-alabaster/70">
                    Your enquiry is with our office. We will be in touch within
                    one business day.
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-8 text-sm font-semibold text-gold-bright underline-offset-4 hover:underline"
                  >
                    Send another enquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={onSubmit}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                      Request a consultation
                    </h3>
                    {listing && (
                      <span className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/[0.08] py-1.5 pl-3 pr-1.5 text-xs font-semibold text-gold-bright">
                        Re: {formatStreetAddress(listing.address)}
                        <button
                          type="button"
                          onClick={() => setInquiry({ intent })}
                          aria-label="Remove this listing from the enquiry"
                          className="grid size-5 place-items-center rounded-full bg-gold/20 text-xs transition-colors hover:bg-gold hover:text-obsidian"
                        >
                          <Icon.Close />
                        </button>
                      </span>
                    )}
                  </div>

                  {/* Intent */}
                  <fieldset>
                    <legend className="text-[10px] font-bold uppercase tracking-[0.22em] text-alabaster/55">
                      I would like to
                    </legend>
                    <div className="mt-2 grid grid-cols-3 gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
                      {LEAD_INTENTS.map((option) => {
                        const selected = option.value === intent;
                        return (
                          <label
                            key={option.value}
                            className={cn(
                              "relative cursor-pointer rounded-full py-2.5 text-center text-sm font-semibold transition-colors duration-300 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gold-bright",
                              selected ? "text-obsidian" : "text-alabaster/70 hover:text-alabaster",
                            )}
                          >
                            <input
                              type="radio"
                              name="intent"
                              value={option.value}
                              checked={selected}
                              onChange={() => setInquiry({ ...inquiry, intent: option.value })}
                              className="sr-only"
                            />
                            {selected && (
                              <motion.span
                                layoutId="intent-pill"
                                transition={{ duration: 0.5, ease: EASE.outExpo }}
                                className="absolute inset-0 rounded-full bg-gold"
                              />
                            )}
                            <span className="relative">{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField
                      label="Full name"
                      name="name"
                      autoComplete="name"
                      required
                      value={fields.fullName}
                      error={errors.fullName}
                      onChange={(value) => setField("fullName", value)}
                    />
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={fields.email}
                      error={errors.email}
                      onChange={(value) => setField("email", value)}
                    />
                    <TextField
                      label="Phone"
                      name="tel"
                      type="tel"
                      autoComplete="tel"
                      optional
                      value={fields.phone}
                      error={errors.phone}
                      onChange={(value) => setField("phone", value)}
                    />
                    <FieldShell label="Timeline" error={errors.timeline}>
                      {(id) => (
                        <div className="relative">
                          <select
                            id={id}
                            value={timeline}
                            onChange={(event) => setTimeline(event.target.value as LeadTimeline)}
                            className={cn(INPUT, "cursor-pointer appearance-none pr-10 [&>option]:bg-carbon")}
                          >
                            {LEAD_TIMELINES.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <Icon.ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-alabaster/50" />
                        </div>
                      )}
                    </FieldShell>
                  </div>

                  <FieldShell label="How can we help?" optional error={errors.message}>
                    {(id, describedBy) => (
                      <textarea
                        id={id}
                        rows={4}
                        value={fields.message}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={describedBy}
                        onChange={(event) => setField("message", event.target.value)}
                        placeholder={
                          listing
                            ? `I'd like to arrange a private showing of ${formatStreetAddress(listing.address)}.`
                            : "A neighborhood, a budget, a property you'd like valued…"
                        }
                        className={cn(INPUT, "h-auto resize-none py-3.5 leading-relaxed")}
                      />
                    )}
                  </FieldShell>

                  {/* Honeypot: hidden from people, irresistible to bots. */}
                  <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
                    <label>
                      Company
                      <input
                        type="text"
                        name="company"
                        tabIndex={-1}
                        autoComplete="off"
                        value={fields.company}
                        onChange={(event) => setField("company", event.target.value)}
                      />
                    </label>
                  </div>

                  {status === "error" && (
                    <p
                      role="alert"
                      className="rounded-xl border border-scarlet/50 bg-scarlet/10 px-4 py-3 text-sm text-alabaster"
                    >
                      {serverMessage}
                    </p>
                  )}

                  <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <MagneticButton
                      type="submit"
                      size="lg"
                      strength={0.2}
                      disabled={status === "submitting"}
                    >
                      {status === "submitting" ? "Sending…" : "Request my consultation"}
                    </MagneticButton>
                    <p className="max-w-[30ch] text-xs leading-relaxed text-alabaster/45">
                      By submitting, you agree to be contacted by {siteConfig.name} about
                      your enquiry.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

const INPUT =
  "h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-[15px] text-alabaster outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-alabaster/30 hover:border-white/25 focus:border-gold focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgb(245_183_0/0.14)] aria-invalid:border-scarlet";

function FieldShell({
  label,
  optional = false,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: (id: string, describedBy: string | undefined) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-baseline justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-alabaster/55"
      >
        {label}
        {optional && <span className="font-medium normal-case tracking-normal text-alabaster/35">Optional</span>}
      </label>
      {children(id, error ? errorId : undefined)}
      {error && (
        <p id={errorId} className="mt-2 text-xs font-medium text-scarlet">
          {error}
        </p>
      )}
    </div>
  );
}

function TextField({
  label,
  name,
  type = "text",
  autoComplete,
  required = false,
  optional = false,
  value,
  error,
  onChange,
}: {
  label: string;
  name: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  required?: boolean;
  optional?: boolean;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <FieldShell label={label} optional={optional} error={error}>
      {(id, describedBy) => (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          className={INPUT}
        />
      )}
    </FieldShell>
  );
}

function ContactLine({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/15 text-lg text-crimson">
        {icon}
      </span>
      {/* min-w-0 lets a long email wrap instead of widening the page. */}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink/50">{label}</p>
        <p className="mt-1 font-display text-lg font-semibold tracking-[-0.02em]">{children}</p>
      </div>
    </div>
  );
}
