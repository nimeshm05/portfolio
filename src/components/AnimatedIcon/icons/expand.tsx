"use client";

import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { forwardRef } from "react";
import { useAnimatedIconControls } from "../useAnimatedIconControls";
import type { AnimatedIconComponentProps, AnimatedIconHandle } from "../types";

const CORNER_TRANSITION = {
  duration: 0.4,
  ease: "easeInOut" as const,
};

const topLeftVariants: Variants = {
  normal: { x: 0, y: 0 },
  animate: {
    x: [0, -1.5, 0],
    y: [0, -1.5, 0],
    transition: CORNER_TRANSITION,
  },
};

const topRightVariants: Variants = {
  normal: { x: 0, y: 0 },
  animate: {
    x: [0, 1.5, 0],
    y: [0, -1.5, 0],
    transition: CORNER_TRANSITION,
  },
};

const bottomLeftVariants: Variants = {
  normal: { x: 0, y: 0 },
  animate: {
    x: [0, -1.5, 0],
    y: [0, 1.5, 0],
    transition: CORNER_TRANSITION,
  },
};

const bottomRightVariants: Variants = {
  normal: { x: 0, y: 0 },
  animate: {
    x: [0, 1.5, 0],
    y: [0, 1.5, 0],
    transition: CORNER_TRANSITION,
  },
};

export const ExpandAnimatedIcon = forwardRef<
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
      <motion.g
        variants={topRightVariants}
        initial="normal"
        animate={controls}
      >
        <path d="m15 9 6-6" />
        <path d="M21 8V3h-5" />
      </motion.g>
      <motion.g
        variants={bottomRightVariants}
        initial="normal"
        animate={controls}
      >
        <path d="m15 15 6 6" />
        <path d="M21 16v5h-5" />
      </motion.g>
      <motion.g
        variants={bottomLeftVariants}
        initial="normal"
        animate={controls}
      >
        <path d="M3 16v5h5" />
        <path d="m3 21 6-6" />
      </motion.g>
      <motion.g
        variants={topLeftVariants}
        initial="normal"
        animate={controls}
      >
        <path d="M3 8V3h5" />
        <path d="M9 9 3 3" />
      </motion.g>
    </svg>
  );
});

ExpandAnimatedIcon.displayName = "ExpandAnimatedIcon";
