"use client";

import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { forwardRef } from "react";
import { useAnimatedIconControls } from "../useAnimatedIconControls";
import type { AnimatedIconComponentProps, AnimatedIconHandle } from "../types";

const SLICE_VARIANTS: Variants = {
  normal: { translateX: 0, translateY: 0 },
  animate: { translateX: 1.1, translateY: -1.1 },
};

export const ChartPieAnimatedIcon = forwardRef<
  AnimatedIconHandle,
  AnimatedIconComponentProps
>(({ size = 20, className }, ref) => {
  const controls = useAnimatedIconControls(ref);

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <motion.path
        d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"
        animate={controls}
        initial="normal"
        variants={SLICE_VARIANTS}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 15,
          bounce: 0.6,
        }}
      />
    </svg>
  );
});

ChartPieAnimatedIcon.displayName = "ChartPieAnimatedIcon";
