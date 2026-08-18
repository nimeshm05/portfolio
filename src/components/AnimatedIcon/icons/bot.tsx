"use client";

import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { forwardRef } from "react";
import { useAnimatedIconControls } from "../useAnimatedIconControls";
import type { AnimatedIconComponentProps, AnimatedIconHandle } from "../types";

const EYE_VARIANTS: Variants = {
  normal: { y1: 13, y2: 15 },
  animate: {
    y1: [13, 14, 13],
    y2: [15, 14, 15],
    transition: {
      duration: 0.5,
      ease: "easeInOut" as const,
      delay: 0.2,
    },
  },
};

export const BotAnimatedIcon = forwardRef<
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
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <motion.line
        x1={15}
        x2={15}
        animate={controls}
        initial="normal"
        variants={EYE_VARIANTS}
      />
      <motion.line
        x1={9}
        x2={9}
        animate={controls}
        initial="normal"
        variants={EYE_VARIANTS}
      />
    </svg>
  );
});

BotAnimatedIcon.displayName = "BotAnimatedIcon";
