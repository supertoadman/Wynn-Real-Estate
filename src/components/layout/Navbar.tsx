"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Icon, Logo, MagneticButton } from "@/components/ui";
import { primaryNav } from "@/data";
import { useAnchorClick } from "@/hooks";
import { EASE } from "@/lib/animations";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { MobileDrawer } from "./MobileDrawer";

/**
 * Sticky header. Transparent over the hero, frosted once the page scrolls,
 * and tucked away while scrolling down so content gets the full viewport.
 */
export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleAnchorClick = useAnchorClick();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    setHidden(latest > 480 && latest > previous);
  });

  return (
    <>
      <motion.header
        initial={{ y: "-100%" }}
        // Fade as well as slide, so the CTA's glow doesn't linger below the fold line.
        animate={
          hidden && !drawerOpen ? { y: "-100%", opacity: 0 } : { y: "0%", opacity: 1 }
        }
        transition={{ duration: 0.7, ease: EASE.outExpo }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "border-b transition-[background-color,border-color,backdrop-filter] duration-500",
            scrolled || drawerOpen
              ? "glass-solid"
              : "border-transparent bg-transparent",
          )}
        >
          <nav
            aria-label="Primary"
            className="mx-auto flex h-[72px] max-w-[1680px] items-center justify-between gap-6 px-5 md:px-10"
          >
            <Link
              href="/"
              aria-label={`${siteConfig.name} — home`}
              onClick={(event) => handleAnchorClick(event, "/#top")}
              className="text-alabaster"
            >
              <Logo />
            </Link>

            <ul className="hidden items-center gap-9 lg:flex">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(event) => handleAnchorClick(event, item.href)}
                    className="group relative py-2 text-[13px] font-medium tracking-[0.06em] text-alabaster/75 transition-colors duration-300 hover:text-alabaster"
                  >
                    {item.label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-gold transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 md:gap-5">
              <a
                href={siteConfig.contact.phoneHref}
                className="hidden items-center gap-2 text-[13px] font-medium tabular-nums tracking-[0.04em] text-alabaster/75 transition-colors hover:text-gold-bright xl:flex"
              >
                <Icon.Phone className="text-base text-gold" />
                {siteConfig.contact.phone}
              </a>

              <MagneticButton
                href="/#contact"
                size="md"
                className="hidden sm:inline-flex"
              >
                Book a consultation
              </MagneticButton>

              <button
                type="button"
                aria-label={drawerOpen ? "Close menu" : "Open menu"}
                aria-expanded={drawerOpen}
                aria-controls="mobile-menu"
                onClick={() => setDrawerOpen((open) => !open)}
                className="relative grid size-11 place-items-center rounded-full border border-white/15 text-alabaster transition-colors hover:border-gold/60 lg:hidden"
              >
                <span
                  className={cn(
                    "absolute h-px w-[18px] bg-current transition-transform duration-500 ease-out-expo",
                    drawerOpen ? "rotate-45" : "-translate-y-[3.5px]",
                  )}
                />
                <span
                  className={cn(
                    "absolute h-px w-[18px] bg-current transition-transform duration-500 ease-out-expo",
                    drawerOpen ? "-rotate-45" : "translate-y-[3.5px]",
                  )}
                />
              </button>
            </div>
          </nav>
        </div>

        {/* Reading progress, crimson → gold. */}
        <motion.div
          aria-hidden
          style={{ scaleX: scrollYProgress }}
          className={cn(
            "h-px origin-left bg-linear-to-r from-crimson via-scarlet to-gold transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
      </motion.header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
