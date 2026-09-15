import type { Variants } from "motion/react";

/** Pixel offset — Motion cannot interpolate CSS variables smoothly. */
const PAGE_ENTER_OFFSET_PX = 80;
const PAGE_ENTER_STAGGER_S = 0.02;
const PAGE_ENTER_DURATION_S = 1;
const PAGE_ENTER_BLUR = "blur(8px)";

export const pageEnterEase = [0.16, 1, 0.3, 1] as const;

function enterTransition(index: number) {
  return {
    delay: index * PAGE_ENTER_STAGGER_S,
    duration: PAGE_ENTER_DURATION_S,
    ease: pageEnterEase,
  };
}

export const pageEnterItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: PAGE_ENTER_OFFSET_PX,
    filter: PAGE_ENTER_BLUR,
  },
  animate: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      opacity: enterTransition(index),
      y: enterTransition(index),
      filter: enterTransition(index),
    },
    transitionEnd: { filter: "none" },
  }),
};

export const pageEnterOpacityVariants: Variants = {
  initial: { opacity: 0 },
  animate: (index: number = 0) => ({
    opacity: 1,
    transition: enterTransition(index),
  }),
};

export const pageEnterContainerVariants: Variants = {
  initial: {},
  animate: {},
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
