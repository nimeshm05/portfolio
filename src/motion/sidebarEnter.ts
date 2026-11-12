import type { Variants } from "motion/react";

/** Pixel offsets: do not use CSS vars here; Motion cannot interpolate them smoothly. */
const SIDEBAR_ENTER_OFFSET_PX = 60;
const SIDEBAR_ENTER_BLUR = "blur(8px)";

export const sidebarEnterEase = [0.33, 1, 0.68, 1] as const;

/** Loose, underdamped spring: items rise past their slot and settle back. */
export const sidebarEnterRise = {
  type: "spring",
  stiffness: 80,
  damping: 8,
  mass: 0.6,
} as const;

/* Each item rises from below on a bouncy spring while it fades in and its
   blur clears. Opacity and blur ease rather than spring: a spring would
   overshoot the blur below 0px. */
export const sidebarEnterItemVariants: Variants = {
  initial: { opacity: 0, y: SIDEBAR_ENTER_OFFSET_PX, filter: SIDEBAR_ENTER_BLUR },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      y: sidebarEnterRise,
      opacity: { duration: 0.35, ease: sidebarEnterEase },
      filter: { duration: 0.35, ease: sidebarEnterEase },
    },
  },
  exit: {
    opacity: 0,
    y: SIDEBAR_ENTER_OFFSET_PX,
    filter: SIDEBAR_ENTER_BLUR,
    transition: {
      opacity: { duration: 0.25, ease: sidebarEnterEase },
      filter: { duration: 0.25, ease: sidebarEnterEase },
      y: { duration: 0.32, ease: sidebarEnterEase },
    },
  },
};

export const sidebarEnterOpacityVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const sidebarEnterContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.03,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

export function getSidebarEnterItemVariants(reduceMotion: boolean): Variants {
  return reduceMotion ? sidebarEnterOpacityVariants : sidebarEnterItemVariants;
}

export function getSidebarEnterContainerVariants(
  reduceMotion: boolean,
): Variants {
  if (reduceMotion) {
    return {
      initial: {},
      animate: {},
      exit: {},
    };
  }

  return sidebarEnterContainerVariants;
}
