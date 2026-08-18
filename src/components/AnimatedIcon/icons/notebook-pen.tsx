"use client";

import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { forwardRef } from "react";
import { useAnimatedIconControls } from "../useAnimatedIconControls";
import type { AnimatedIconComponentProps, AnimatedIconHandle } from "../types";

const PEN_VARIANTS: Variants = {
  normal: { rotate: 0, x: 0, y: 0, transformOrigin: "18px 6px" },
  animate: {
    rotate: [0, -10, 4, 0],
    x: [0, -0.5, 0.25, 0],
    y: [0, 0.5, -0.25, 0],
    transition: {
      duration: 0.55,
      ease: "easeInOut" as const,
    },
  },
};

export const NotebookPenAnimatedIcon = forwardRef<
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
      <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
      <path d="M2 6h4" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
      <path d="M2 18h4" />
      <motion.path
        d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
        animate={controls}
        initial="normal"
        variants={PEN_VARIANTS}
      />
    </svg>
  );
});

NotebookPenAnimatedIcon.displayName = "NotebookPenAnimatedIcon";
