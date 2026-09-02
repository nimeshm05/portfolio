import type { Transition, Variants } from "motion/react";

export const workViewBlurVariants: Variants = {
  initial: { opacity: 0, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    transitionEnd: { filter: "none" },
  },
  exit: { opacity: 0, filter: "blur(8px)" },
};

export const workViewOpacityVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const workViewCardContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.07,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

export const workViewTransition: Transition = {
  duration: 0.22,
  ease: "easeInOut",
};

export const workViewReducedMotionTransition: Transition = {
  duration: 0.01,
  ease: "linear",
};

export function getWorkViewItemVariants(reduceMotion: boolean): Variants {
  return reduceMotion ? workViewOpacityVariants : workViewBlurVariants;
}

export function getWorkViewTransition(reduceMotion: boolean): Transition {
  return reduceMotion ? workViewReducedMotionTransition : workViewTransition;
}

export function getWorkViewCardContainerVariants(
  reduceMotion: boolean,
): Variants {
  if (reduceMotion) {
    return {
      initial: {},
      animate: {},
      exit: {},
    };
  }

  return workViewCardContainerVariants;
}
