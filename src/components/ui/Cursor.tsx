"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MEDIA, useMediaQuery } from "@/hooks";
import { SPRING } from "@/lib/animations";

type CursorMode = "idle" | "link" | "view" | "hidden";

interface CursorState {
  mode: CursorMode;
  label: string;
}

const INTERACTIVE = "a, button, [role='button'], [role='tab'], summary";
const FIELDS = "input, textarea, select";

const SIZE: Record<CursorMode, number> = {
  idle: 14,
  link: 46,
  view: 92,
  hidden: 0,
};

/**
 * Gold cursor companion. Trails the native pointer on a spring, swells over
 * links, and becomes a labelled disc over any element with `data-cursor`
 * (e.g. `data-cursor="View"` on listing cards). Mouse-only; never rendered
 * on touch devices or when reduced motion is requested.
 */
export function Cursor() {
  const finePointer = useMediaQuery(MEDIA.finePointer);
  const reducedMotion = useMediaQuery(MEDIA.reducedMotion);

  if (!finePointer || reducedMotion) return null;
  return <CursorFollower />;
}

function CursorFollower() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, SPRING.cursor);
  const springY = useSpring(y, SPRING.cursor);

  const [state, setState] = useState<CursorState>({ mode: "hidden", label: "" });
  const current = useRef(state);

  useEffect(() => {
    const update = (next: CursorState) => {
      if (next.mode === current.current.mode && next.label === current.current.label) return;
      current.current = next;
      setState(next);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);

      const target = event.target instanceof Element ? event.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");

      if (target?.closest(FIELDS)) update({ mode: "hidden", label: "" });
      else if (labelled) update({ mode: "view", label: labelled.dataset.cursor ?? "" });
      else if (target?.closest(INTERACTIVE)) update({ mode: "link", label: "" });
      else update({ mode: "idle", label: "" });
    };

    const onLeave = () => update({ mode: "hidden", label: "" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  const size = SIZE[state.mode];
  const filled = state.mode === "view";

  return (
    <motion.div
      aria-hidden
      style={{ x: springX, y: springY }}
      className="pointer-events-none fixed left-0 top-0 z-[90]"
    >
      <motion.div
        animate={{
          width: size,
          height: size,
          backgroundColor: filled ? "rgba(245, 183, 0, 1)" : "rgba(245, 183, 0, 0.08)",
          borderColor: filled ? "rgba(245, 183, 0, 0)" : "rgba(245, 183, 0, 0.75)",
        }}
        transition={{ type: "spring", ...SPRING.panel }}
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center overflow-hidden rounded-full border"
      >
        <motion.span
          animate={{ opacity: filled ? 1 : 0, scale: filled ? 1 : 0.6 }}
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-obsidian"
        >
          {state.label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
