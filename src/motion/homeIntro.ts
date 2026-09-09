"use client";

import { useEffect, useState } from "react";
import type { Variants } from "motion/react";
import { pageEnterEase } from "@/motion/pageEnter";

/** Pixel offset — Motion cannot interpolate CSS variables smoothly. */
const HOME_INTRO_OFFSET_PX = 80;
const HOME_INTRO_STAGGER_S = 0.02;
const HOME_INTRO_DURATION_S = 1;
const HOME_INTRO_BLUR = "blur(8px)";

let homeIntroConsumed = false;

export function useHomeFirstLoadIntro() {
  const [isFirstLoad] = useState(() => !homeIntroConsumed);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      homeIntroConsumed = true;
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return isFirstLoad;
}

function introTransition(index: number) {
  return {
    delay: index * HOME_INTRO_STAGGER_S,
    duration: HOME_INTRO_DURATION_S,
    ease: pageEnterEase,
  };
}

export const homeIntroItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: HOME_INTRO_OFFSET_PX,
    filter: HOME_INTRO_BLUR,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      opacity: introTransition(index),
      y: introTransition(index),
      filter: introTransition(index),
    },
    transitionEnd: { filter: "none" },
  }),
};

export const homeIntroOpacityVariants: Variants = {
  initial: { opacity: 0 },
  animate: (index: number) => ({
    opacity: 1,
    transition: introTransition(index),
  }),
};

export function getHomeIntroItemVariants(reduceMotion: boolean): Variants {
  return reduceMotion ? homeIntroOpacityVariants : homeIntroItemVariants;
}
