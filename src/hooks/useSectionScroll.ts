"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useCallback, type MouseEvent } from "react";

/**
 * Smooth-scroll to an in-page target through Lenis, falling back to native
 * scrolling if the smooth-scroll provider isn't mounted.
 */
export function useSectionScroll() {
  const lenis = useLenis();

  return useCallback(
    (selector: string) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) return;

      if (lenis) {
        lenis.scrollTo(element, { duration: 1.5 });
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
    [lenis],
  );
}

/**
 * Click handler for links such as `/#contact`. When the link points at a
 * section of the current page it scrolls there smoothly; otherwise it stays
 * out of the way and lets the router navigate.
 */
export function useAnchorClick() {
  const pathname = usePathname();
  const scrollToSection = useSectionScroll();

  return useCallback(
    (event: MouseEvent<HTMLElement>, href: string) => {
      const [path, hash] = href.split("#");
      if (!hash || event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      if (path !== "" && path !== pathname) return;

      event.preventDefault();
      scrollToSection(`#${hash}`);
    },
    [pathname, scrollToSection],
  );
}
