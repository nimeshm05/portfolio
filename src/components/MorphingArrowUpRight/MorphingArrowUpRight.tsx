"use client";

import { motion } from "motion/react";
import "./MorphingArrowUpRight.css";

/**
 * Chevron-right split at its vertex so each arm can morph into a segment of
 * Lucide arrow-up-right (same two-point line topology on paths 1 & 2).
 */
const CHEVRON_LOWER = "M9 18 L15 12";
const CHEVRON_UPPER = "M15 12 L9 6";

const ARROW_DIAGONAL = "M7 17 L17 7";
const ARROW_HORIZONTAL = "M7 7 L17 7";
const ARROW_VERTICAL = "M17 7 L17 17";

const MORPH_TRANSITION = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

type MorphingArrowUpRightProps = {
  showArrow: boolean;
};

export function MorphingArrowUpRight({ showArrow }: MorphingArrowUpRightProps) {
  return (
    <svg
      className="morphing-arrow-up-right"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        initial={false}
        animate={{ d: showArrow ? ARROW_DIAGONAL : CHEVRON_LOWER }}
        transition={MORPH_TRANSITION}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        initial={false}
        animate={{ d: showArrow ? ARROW_HORIZONTAL : CHEVRON_UPPER }}
        transition={MORPH_TRANSITION}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d={ARROW_VERTICAL}
        initial={false}
        animate={{
          pathLength: showArrow ? 1 : 0,
          opacity: showArrow ? 1 : 0,
        }}
        transition={MORPH_TRANSITION}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
