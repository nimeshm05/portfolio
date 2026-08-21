"use client";

import { motion } from "motion/react";
import "./MorphingChevron.css";

const CHEVRON_DOWN = "M6 9 L12 15 L18 9";
const CHEVRON_UP = "M6 15 L12 9 L18 15";

type MorphingChevronProps = {
  isOpen: boolean;
};

export function MorphingChevron({ isOpen }: MorphingChevronProps) {
  return (
    <svg
      className="morphing-chevron"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d={CHEVRON_DOWN}
        initial={false}
        animate={{ d: isOpen ? CHEVRON_UP : CHEVRON_DOWN }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
