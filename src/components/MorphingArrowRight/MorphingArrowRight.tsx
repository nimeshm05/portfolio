"use client";

import { motion, useReducedMotion } from "motion/react";
import "./MorphingArrowRight.css";

const PHASE_DURATION = 0.2;

const SHAFT = "M5 12 L19 12";
const RIGHT_HEAD_UPPER = "M19 12 L12 5";
const RIGHT_HEAD_LOWER = "M19 12 L12 19";
const LEFT_HEAD_UPPER = "M5 12 L12 5";
const LEFT_HEAD_LOWER = "M5 12 L12 19";

type MorphingArrowRightProps = {
  variant: "right" | "left";
};

export function MorphingArrowRight({ variant }: MorphingArrowRightProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const isLeft = variant === "left";
  const duration = reduceMotion ? 0 : PHASE_DURATION;
  const delay = reduceMotion ? 0 : PHASE_DURATION;

  return (
    <svg
      className="morphing-arrow-right"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={SHAFT}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d={RIGHT_HEAD_UPPER}
        initial={false}
        animate={{ pathLength: isLeft ? 0 : 1, opacity: isLeft ? 0 : 1 }}
        transition={{
          duration,
          delay: isLeft ? 0 : delay,
          ease: "easeInOut",
        }}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d={RIGHT_HEAD_LOWER}
        initial={false}
        animate={{ pathLength: isLeft ? 0 : 1, opacity: isLeft ? 0 : 1 }}
        transition={{
          duration,
          delay: isLeft ? 0 : delay,
          ease: "easeInOut",
        }}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d={LEFT_HEAD_UPPER}
        initial={false}
        animate={{ pathLength: isLeft ? 1 : 0, opacity: isLeft ? 1 : 0 }}
        transition={{
          duration,
          delay: isLeft ? delay : 0,
          ease: "easeInOut",
        }}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d={LEFT_HEAD_LOWER}
        initial={false}
        animate={{ pathLength: isLeft ? 1 : 0, opacity: isLeft ? 1 : 0 }}
        transition={{
          duration,
          delay: isLeft ? delay : 0,
          ease: "easeInOut",
        }}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
