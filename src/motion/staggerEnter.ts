"use client";

import { useMemo } from "react";
import { useReducedMotion, type Variants } from "motion/react";

/**
 * Staggered entrance: items arrive one after another, each sliding in from
 * an offset on a loose spring that overshoots and settles, while it fades in
 * and its blur clears. The desktop project sidebar is the reference.
 *
 * Put `container` on the parent and `item` on each child, then drive the
 * parent with the variant names "initial" | "animate" | "exit":
 *
 *   const { container, item } = useStaggerEnter({ from: "right" });
 *   <motion.ul variants={container} initial="initial" animate="animate">
 *     {rows.map((row) => <motion.li key={row.id} variants={item} />)}
 *   </motion.ul>
 */

export type StaggerFrom = "below" | "above" | "left" | "right";

export type StaggerEnterOptions = {
  /** Where items slide in from. Default "below". */
  from?: StaggerFrom;
  /** Slide distance in px. Default 60. Pixels, not CSS vars: Motion can't
      interpolate variables smoothly. */
  distance?: number;
  /** Starting blur in px; 0 turns the blur off. Default 8. */
  blur?: number;
  /** Seconds between items. Default 0.03. */
  stagger?: number;
  /** Seconds before the first item starts. Default 0.04. */
  delay?: number;
  /** Opacity-only fallback. useStaggerEnter fills this in from the OS. */
  reduceMotion?: boolean;
};

export const staggerEnterEase = [0.33, 1, 0.68, 1] as const;

/** Loose, underdamped spring: items travel past their slot and settle back. */
export const staggerEnterSpring = {
  type: "spring",
  stiffness: 80,
  damping: 8,
  mass: 0.6,
} as const;

const OFFSETS: Record<StaggerFrom, { axis: "x" | "y"; sign: 1 | -1 }> = {
  below: { axis: "y", sign: 1 },
  above: { axis: "y", sign: -1 },
  right: { axis: "x", sign: 1 },
  left: { axis: "x", sign: -1 },
};

const fadeOnly: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function getStaggerEnter({
  from = "below",
  distance = 60,
  blur = 8,
  stagger = 0.03,
  delay = 0.04,
  reduceMotion = false,
}: StaggerEnterOptions = {}): { container: Variants; item: Variants } {
  if (reduceMotion) {
    return {
      container: { initial: {}, animate: {}, exit: {} },
      item: fadeOnly,
    };
  }

  const { axis, sign } = OFFSETS[from];
  const offset = { [axis]: distance * sign };
  const hidden = blur > 0 ? { filter: `blur(${blur}px)` } : {};
  const shown = blur > 0 ? { filter: "blur(0px)" } : {};

  return {
    container: {
      initial: {},
      animate: {
        transition: { delayChildren: delay, staggerChildren: stagger },
      },
      // Leaves in reverse, last item first
      exit: { transition: { staggerChildren: stagger, staggerDirection: -1 } },
    },
    item: {
      initial: { opacity: 0, ...offset, ...hidden },
      animate: {
        opacity: 1,
        [axis]: 0,
        ...shown,
        // Opacity and blur ease rather than spring: a spring would overshoot
        // the blur below 0px
        transition: {
          [axis]: staggerEnterSpring,
          opacity: { duration: 0.35, ease: staggerEnterEase },
          filter: { duration: 0.35, ease: staggerEnterEase },
        },
        // A filter left on an element, even at 0px, stops any glass
        // (backdrop-filter) inside it from blurring what's behind, so it's
        // dropped once the blur has cleared
        ...(blur > 0 ? { transitionEnd: { filter: "none" } } : {}),
      },
      exit: {
        opacity: 0,
        ...offset,
        ...hidden,
        transition: {
          opacity: { duration: 0.25, ease: staggerEnterEase },
          filter: { duration: 0.25, ease: staggerEnterEase },
          [axis]: { duration: 0.32, ease: staggerEnterEase },
        },
      },
    },
  };
}

/** getStaggerEnter with reduced motion taken from the OS, kept stable
    across renders */
export function useStaggerEnter(
  options: Omit<StaggerEnterOptions, "reduceMotion"> = {},
) {
  const reduceMotion = useReducedMotion() ?? false;
  const { from, distance, blur, stagger, delay } = options;

  return useMemo(
    () =>
      getStaggerEnter({ from, distance, blur, stagger, delay, reduceMotion }),
    [from, distance, blur, stagger, delay, reduceMotion],
  );
}
