"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { Icon, MagneticButton } from "@/components/ui";
import { primaryNav } from "@/data";
import { useAnchorClick, useScrollLock } from "@/hooks";
import { EASE, maskUp, stagger } from "@/lib/animations";
import { siteConfig } from "@/lib/site";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** Full-screen navigation for small viewports, revealed with a vertical wipe. */
export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const handleAnchorClick = useAnchorClick();
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          data-lenis-prevent
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.8, ease: EASE.inOutQuart }}
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-obsidian px-5 pb-8 pt-[104px] lg:hidden"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_100%_0%,rgb(200_16_46/0.28),transparent),radial-gradient(50%_40%_at_0%_100%,rgb(245_183_0/0.14),transparent)]"
          />

          <motion.ul
            variants={stagger(0.08, 0.25)}
            initial="hidden"
            animate="visible"
            className="relative flex flex-1 flex-col justify-center gap-1"
          >
            {primaryNav.map((item, index) => (
              <li key={item.href} className="overflow-hidden border-b border-white/10">
                <motion.div variants={maskUp}>
                  <Link
                    href={item.href}
                    onClick={(event) => {
                      handleAnchorClick(event, item.href);
                      onClose();
                    }}
                    className="group flex items-baseline justify-between gap-4 py-5"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="text-xs font-semibold tabular-nums text-gold">
                        0{index + 1}
                      </span>
                      <span className="font-display text-[clamp(2rem,9vw,3.25rem)] font-semibold leading-none tracking-[-0.03em] text-alabaster">
                        {item.label}
                      </span>
                    </span>
                    <Icon.ArrowUpRight className="text-2xl text-alabaster/40 transition-colors group-hover:text-gold" />
                  </Link>
                </motion.div>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: EASE.outExpo }}
            className="relative mt-10 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2 text-sm text-alabaster/70">
              <a href={siteConfig.contact.phoneHref} className="tabular-nums">
                {siteConfig.contact.phone}
              </a>
              <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
            </div>
            <MagneticButton href="/#contact" size="lg" onClick={onClose} className="w-full">
              Book a consultation
            </MagneticButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
