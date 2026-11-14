import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/ui";
import { primaryNav } from "@/data";
import { siteConfig } from "@/lib/site";

/**
 * Reading the clock would block the statically prerendered shell, so the
 * year is rendered inside a cached component and refreshed daily.
 */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const { contact, legal, social } = siteConfig;

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-obsidian text-alabaster">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(50%_80%_at_50%_120%,rgb(200_16_46/0.22),transparent)]"
      />

      <div className="relative mx-auto max-w-[1680px] px-5 pt-20 md:px-10 md:pt-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-8 max-w-sm font-serif text-2xl italic leading-snug text-alabaster/85">
              {siteConfig.tagline}
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-alabaster/55">
              {siteConfig.description}
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">
              Explore
            </h2>
            <ul className="mt-6 space-y-3.5">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-alabaster/70 transition-colors hover:text-alabaster"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">
              Private office
            </h2>
            <address className="mt-6 space-y-3.5 text-sm not-italic text-alabaster/70">
              <p>
                {contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <p>
                <a
                  href={contact.phoneHref}
                  className="tabular-nums transition-colors hover:text-gold-bright"
                >
                  {contact.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${contact.email}`}
                  className="transition-colors hover:text-gold-bright"
                >
                  {contact.email}
                </a>
              </p>
              <p className="text-alabaster/45">{contact.hours}</p>
            </address>

            {social.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {social.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-alabaster/70 transition-colors hover:text-gold-bright"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Oversized wordmark, bleeding off the bottom edge. */}
        <p
          aria-hidden
          className="pointer-events-none mt-20 select-none bg-linear-to-b from-white/[0.14] to-white/0 bg-clip-text text-center font-display text-[clamp(5rem,21.5vw,24rem)] font-extrabold leading-[0.72] tracking-[-0.04em] whitespace-nowrap text-transparent"
        >
          WYNN
        </p>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-5 py-6 text-xs text-alabaster/45 md:flex-row md:items-center md:justify-between md:px-10">
          <p>
            © <CopyrightYear /> {legal.entity}. All rights reserved. {legal.license}
          </p>
          <p className="max-w-xl md:text-right">
            Equal Housing Opportunity. Listing information is deemed reliable but
            not guaranteed and is subject to change without notice.
          </p>
        </div>
      </div>
    </footer>
  );
}
