import type { Transition, Variants } from "motion/react";

export const iconSwapTransition: Transition = {
  duration: 0.2,
  ease: "easeInOut",
};

const iconSwapVariants: Variants = {
  initial: { opacity: 0, filter: "blur(0.5rem)" },
  animate: { opacity: 1, filter: "blur(0rem)" },
  exit: { opacity: 0, filter: "blur(0.5rem)" },
};

const iconSwapReducedMotionVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function getIconSwapVariants(reduceMotion: boolean): Variants {
  return reduceMotion ? iconSwapReducedMotionVariants : iconSwapVariants;
}
