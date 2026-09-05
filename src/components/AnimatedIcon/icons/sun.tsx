"use client";

import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { forwardRef } from "react";
import { useAnimatedIconControls } from "../useAnimatedIconControls";
import type { AnimatedIconComponentProps, AnimatedIconHandle } from "../types";

const SUN_VARIANTS: Variants = {
  normal: { rotate: 0 },
  animate: {
    rotate: 45,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 16,
    },
  },
};

export const SunAnimatedIcon = forwardRef<
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
      variants={SUN_VARIANTS}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </motion.svg>
  );
});

SunAnimatedIcon.displayName = "SunAnimatedIcon";
