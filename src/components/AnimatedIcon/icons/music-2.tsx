"use client";

import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { forwardRef } from "react";
import { useAnimatedIconControls } from "../useAnimatedIconControls";
import type { AnimatedIconComponentProps, AnimatedIconHandle } from "../types";

const NOTE_VARIANTS: Variants = {
  normal: { rotate: 0, transformOrigin: "8px 18px" },
  animate: {
    rotate: [0, -8, 4, 0],
    transition: {
      duration: 0.55,
      ease: "easeInOut" as const,
    },
  },
};

export const Music2AnimatedIcon = forwardRef<
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
      <circle cx="8" cy="18" r="4" />
      <motion.path
        d="M12 18V2l7 4"
        animate={controls}
        initial="normal"
        variants={NOTE_VARIANTS}
      />
    </svg>
  );
});

Music2AnimatedIcon.displayName = "Music2AnimatedIcon";
