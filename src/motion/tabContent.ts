"use client";

import { createContext, useContext } from "react";

export const tabContentBlurVariants = {
  initial: { opacity: 0, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
    transitionEnd: { filter: "none" },
  },
  exit: { opacity: 0, filter: "blur(8px)" },
};

export const tabContentOpacityVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const tabContentTransition = {
  duration: 0.2,
  ease: "easeInOut" as const,
};

const TabContentMotionContext = createContext(false);

export const TabContentMotionProvider = TabContentMotionContext.Provider;

export function useTabContentMotion() {
  return useContext(TabContentMotionContext);
}
