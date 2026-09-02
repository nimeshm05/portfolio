"use client";

import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { forwardRef } from "react";
import { useAnimatedIconControls } from "../useAnimatedIconControls";
import type { AnimatedIconComponentProps, AnimatedIconHandle } from "../types";

function tickVariants(delay: number): Variants {
  return {
    normal: { y: 0 },
    animate: {
      y: [0, -1.5, 0],
      transition: {
        duration: 0.35,
        ease: "easeInOut",
        delay,
      },
    },
  };
}

export const GalleryThumbnailsAnimatedIcon = forwardRef<
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
      <rect width="18" height="14" x="3" y="3" rx="2" />
      <motion.path
        d="M4 21h1"
        animate={controls}
        initial="normal"
        variants={tickVariants(0)}
      />
      <motion.path
        d="M9 21h1"
        animate={controls}
        initial="normal"
        variants={tickVariants(0.06)}
      />
      <motion.path
        d="M14 21h1"
        animate={controls}
        initial="normal"
        variants={tickVariants(0.12)}
      />
      <motion.path
        d="M19 21h1"
        animate={controls}
        initial="normal"
        variants={tickVariants(0.18)}
      />
    </svg>
  );
});

GalleryThumbnailsAnimatedIcon.displayName = "GalleryThumbnailsAnimatedIcon";
