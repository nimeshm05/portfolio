import type { Transition, Variants } from "motion/react";

export type PhotoSlideshowDirection = 1 | -1;

const SLIDE_OFFSET = "2rem";
const SLIDE_BLUR = "0.5rem";

export const photoSlideshowEase = [0.16, 1, 0.3, 1] as const;

export const photoSlideshowTransition: Transition = {
  duration: 0.4,
  ease: photoSlideshowEase,
};

export const photoSlideshowReducedMotionTransition: Transition = {
  duration: 0.2,
  ease: "linear",
};

export const photoSlideshowSwapTransition: Transition = {
  duration: 0.2,
  ease: "easeInOut",
};

export const photoSlideshowOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const photoSlideshowSwapVariants: Variants = {
  initial: { opacity: 0, filter: "blur(0.5rem)" },
  animate: { opacity: 1, filter: "blur(0rem)" },
  exit: { opacity: 0, filter: "blur(0.5rem)" },
};

export const photoSlideshowSwapReducedMotionVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const photoSlideshowImageVariants: Variants = {
  initial: (direction: PhotoSlideshowDirection) => ({
    opacity: 0,
    filter: `blur(${SLIDE_BLUR})`,
    x: direction > 0 ? `-${SLIDE_OFFSET}` : SLIDE_OFFSET,
  }),
  animate: {
    opacity: 1,
    filter: "blur(0rem)",
    x: 0,
  },
  exit: (direction: PhotoSlideshowDirection) => ({
    opacity: 0,
    filter: `blur(${SLIDE_BLUR})`,
    x: direction > 0 ? SLIDE_OFFSET : `-${SLIDE_OFFSET}`,
  }),
};

export const photoSlideshowImageReducedMotionVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function getPhotoSlideshowOverlayTransition(
  reduceMotion: boolean,
): Transition {
  return reduceMotion
    ? photoSlideshowReducedMotionTransition
    : photoSlideshowTransition;
}

export function getPhotoSlideshowSwapVariants(reduceMotion: boolean): Variants {
  return reduceMotion
    ? photoSlideshowSwapReducedMotionVariants
    : photoSlideshowSwapVariants;
}

export function getPhotoSlideshowImageVariants(reduceMotion: boolean): Variants {
  return reduceMotion
    ? photoSlideshowImageReducedMotionVariants
    : photoSlideshowImageVariants;
}

export function getPhotoSlideshowImageTransition(
  reduceMotion: boolean,
): Transition {
  return reduceMotion
    ? photoSlideshowReducedMotionTransition
    : photoSlideshowTransition;
}
