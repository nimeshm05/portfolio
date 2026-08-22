"use client";

import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { forwardRef } from "react";
import { useAnimatedIconControls } from "../useAnimatedIconControls";
import type { AnimatedIconComponentProps, AnimatedIconHandle } from "../types";

const ARROW_VARIANTS: Variants = {
  normal: { x: 0, y: 0 },
  animate: {
    x: [0, 2, 0],
    y: [0, -2, 0],
    transition: {
      duration: 0.4,
      ease: "easeInOut" as const,
    },
  },
};

export const ArrowUpRightAnimatedIcon = forwardRef<
  AnimatedIconHandle,
  AnimatedIconComponentProps
>(({ size = 20, className }, ref) => {
  const controls = useAnimatedIconControls(ref);

  return (
    <motion.svg
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
      animate={controls}
      initial="normal"
      variants={ARROW_VARIANTS}
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </motion.svg>
  );
});

ArrowUpRightAnimatedIcon.displayName = "ArrowUpRightAnimatedIcon";
