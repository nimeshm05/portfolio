"use client";

import { useAnimation } from "motion/react";
import { useImperativeHandle, type ForwardedRef } from "react";
import type { AnimatedIconHandle } from "./types";

export function useAnimatedIconControls(ref: ForwardedRef<AnimatedIconHandle>) {
  const controls = useAnimation();

  useImperativeHandle(ref, () => ({
    startAnimation: () => controls.start("animate"),
    stopAnimation: () => controls.start("normal"),
  }));

  return controls;
}
