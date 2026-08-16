import type { Variants } from "motion/react";

/** Pixel offset — Motion cannot interpolate CSS variables smoothly. */
const PAGE_ENTER_OFFSET_PX = 40;
const PAGE_ENTER_BLUR = "blur(8px)";

export const pageEnterEase = [0.16, 1, 0.3, 1] as const;

export const pageEnterItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: PAGE_ENTER_OFFSET_PX,
    filter: PAGE_ENTER_BLUR,
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      opacity: { duration: 1, ease: pageEnterEase },
      y: { duration: 1, ease: pageEnterEase },
      filter: { duration: 1, ease: pageEnterEase },
    },
  },
};

export const pageEnterOpacityVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const pageEnterContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.07,
    },
  },
};

export function getPageEnterItemVariants(reduceMotion: boolean): Variants {
  return reduceMotion ? pageEnterOpacityVariants : pageEnterItemVariants;
}

export function getPageEnterContainerVariants(
  reduceMotion: boolean,
): Variants {
  if (reduceMotion) {
    return {
      initial: {},
      animate: {},
    };
  }

  return pageEnterContainerVariants;
}
