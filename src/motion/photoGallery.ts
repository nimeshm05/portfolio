import type { Transition, Variants } from "motion/react";

export const photoGalleryEase = [0.16, 1, 0.3, 1] as const;

export const photoGalleryTransition: Transition = {
  duration: 0.4,
  ease: photoGalleryEase,
};

export const photoGalleryReducedMotionTransition: Transition = {
  duration: 0.2,
  ease: "linear",
};

export const photoGallerySheetVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 },
};

export const photoGalleryReducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function getPhotoGallerySheetVariants(reduceMotion: boolean): Variants {
  return reduceMotion
    ? photoGalleryReducedMotionVariants
    : photoGallerySheetVariants;
}

export function getPhotoGalleryTransition(reduceMotion: boolean): Transition {
  return reduceMotion
    ? photoGalleryReducedMotionTransition
    : photoGalleryTransition;
}
