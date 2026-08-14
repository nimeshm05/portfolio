import type { Transition, Variants } from "motion/react";

/** Pixel offset — do not use CSS vars here; Motion cannot interpolate them smoothly. */
const SIDEBAR_ENTER_OFFSET_PX = 40;

export const sidebarEnterEase = [0.16, 1, 0.3, 1] as const;

export const sidebarEnterItemVariants: Variants = {
  initial: { opacity: 0, y: SIDEBAR_ENTER_OFFSET_PX },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.4, ease: sidebarEnterEase },
      y: { duration: 0.52, ease: sidebarEnterEase },
    },
  },
  exit: {
    opacity: 0,
    y: SIDEBAR_ENTER_OFFSET_PX,
    transition: {
      opacity: { duration: 0.28, ease: sidebarEnterEase },
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
      delayChildren: 0.05,
      staggerChildren: 0.065,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.045,
      staggerDirection: -1,
    },
  },
};

export const sidebarEnterTransition: Transition = {
  duration: 0.52,
  ease: sidebarEnterEase,
};

export const sidebarEnterReducedMotionTransition: Transition = {
  duration: 0,
  ease: "linear",
};

export function getSidebarEnterItemVariants(reduceMotion: boolean): Variants {
  return reduceMotion ? sidebarEnterOpacityVariants : sidebarEnterItemVariants;
}

export function getSidebarEnterTransition(reduceMotion: boolean): Transition {
  return reduceMotion
    ? sidebarEnterReducedMotionTransition
    : sidebarEnterTransition;
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
