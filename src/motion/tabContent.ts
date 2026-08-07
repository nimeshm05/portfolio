"use client";

import { createContext, useContext } from "react";

export const tabContentBlurVariants = {
  initial: { opacity: 0, filter: "blur(8px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(8px)" },
};

export const tabContentTransition = {
  duration: 0.1,
  ease: "easeInOut" as const,
};

const TabContentMotionContext = createContext(false);

export const TabContentMotionProvider = TabContentMotionContext.Provider;

export function useTabContentMotion() {
  return useContext(TabContentMotionContext);
}
