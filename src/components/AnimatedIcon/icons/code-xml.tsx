"use client";

import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { forwardRef } from "react";
import { useAnimatedIconControls } from "../useAnimatedIconControls";
import type { AnimatedIconComponentProps, AnimatedIconHandle } from "../types";

const LEFT_BRACKET_VARIANTS: Variants = {
  normal: { x: 0 },
  animate: {
    x: [-1, -2, -1],
    transition: { duration: 0.45, ease: "easeInOut" as const },
  },
};

const RIGHT_BRACKET_VARIANTS: Variants = {
  normal: { x: 0 },
  animate: {
    x: [1, 2, 1],
    transition: { duration: 0.45, ease: "easeInOut" as const },
  },
};

const SLASH_VARIANTS: Variants = {
  normal: { rotate: 0, transformOrigin: "12px 12px" },
  animate: {
    rotate: [0, 6, -4, 0],
    transition: { duration: 0.5, ease: "easeInOut" as const, delay: 0.05 },
  },
};

export const CodeXmlAnimatedIcon = forwardRef<
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
      <motion.path
        d="m18 16 4-4-4-4"
        animate={controls}
        initial="normal"
        variants={RIGHT_BRACKET_VARIANTS}
      />
      <motion.path
        d="m6 8-4 4 4 4"
        animate={controls}
        initial="normal"
        variants={LEFT_BRACKET_VARIANTS}
      />
      <motion.path
        d="m14.5 4-5 16"
        animate={controls}
        initial="normal"
        variants={SLASH_VARIANTS}
      />
    </svg>
  );
});

CodeXmlAnimatedIcon.displayName = "CodeXmlAnimatedIcon";
