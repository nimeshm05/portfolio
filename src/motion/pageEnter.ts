import type { Variants } from "motion/react";

/** Pixel offset — Motion cannot interpolate CSS variables smoothly. */
const PAGE_ENTER_OFFSET_PX = 80;
const PAGE_ENTER_STAGGER_S = 0.02;
const PAGE_ENTER_DURATION_S = 1;
const PAGE_ENTER_BLUR = "blur(8px)";

export const pageEnterEase = [0.16, 1, 0.3, 1] as const;

/**
 * When the home avatar drops in: the header's ~10 staggered text items have
 * started by ~0.2s and, with this ease-out, are mostly settled ~0.7s later.
 */
export const AVATAR_DROP_DELAY_MS = 900;

function enterTransition(index: number) {
  return {
    delay: index * PAGE_ENTER_STAGGER_S,
    duration: PAGE_ENTER_DURATION_S,
    ease: pageEnterEase,
  };
}

/**
 * Coming down from above, each line starts over the line before it, so they
 * all seemed to pour out of one spot. Holding the fade back until most of the
 * drop has happened (the ease-out covers ~70% of it by then) and fading in
 * quicker means each line only shows up close to its own place.
 */
const PAGE_RETURN_FADE_DELAY_S = 0.14;
const PAGE_RETURN_FADE_DURATION_S = 0.5;

function returnFadeTransition(index: number) {
  return {
    delay: index * PAGE_ENTER_STAGGER_S + PAGE_RETURN_FADE_DELAY_S,
    duration: PAGE_RETURN_FADE_DURATION_S,
    ease: "easeOut" as const,
  };
}

function itemVariants(
  offsetY: number,
  fadeTransition: (index: number) => object = enterTransition,
): Variants {
  return {
    initial: {
      opacity: 0,
      y: offsetY,
      filter: PAGE_ENTER_BLUR,
    },
    animate: (index: number = 0) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        opacity: fadeTransition(index),
        y: enterTransition(index),
        filter: enterTransition(index),
      },
      transitionEnd: { filter: "none" },
    }),
  };
}

/** Rises into place from below: a fresh visit. */
export const pageEnterItemVariants = itemVariants(PAGE_ENTER_OFFSET_PX);
/** Settles into place from above: coming back from another page. */
export const pageReturnItemVariants = itemVariants(
  -PAGE_ENTER_OFFSET_PX,
  returnFadeTransition,
);

/** Path of the last page that played its entrance in this tab; null until the first one. */
let lastEnteredPath: string | null = null;

/** True when arriving here by in-app navigation from a different page (not a fresh load). */
export function isReturnFromOtherPage(pathname: string) {
  return lastEnteredPath !== null && lastEnteredPath !== pathname;
}

export function markPageEntered(pathname: string) {
  lastEnteredPath = pathname;
}

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

export function getPageEnterItemVariants(
  reduceMotion: boolean,
  fromAbove = false,
): Variants {
  if (reduceMotion) {
    return pageEnterOpacityVariants;
  }

  return fromAbove ? pageReturnItemVariants : pageEnterItemVariants;
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
