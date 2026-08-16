"use client";

import { motion } from "motion/react";
import { coffeeSteamVariants } from "@/motion/connectPrompt";
import "./AnimatedCoffeeIcon.css";

type AnimatedCoffeeIconProps = {
  className?: string;
  size?: number;
};

export function AnimatedCoffeeIcon({
  className,
  size = 18,
}: AnimatedCoffeeIconProps) {
  return (
    <svg
      className={
        className
          ? `animated-coffee-icon ${className}`
          : "animated-coffee-icon"
      }
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d="M10 2v2"
        variants={coffeeSteamVariants}
        initial="normal"
        animate="animate"
        custom={0.2}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <motion.path
        d="M14 2v2"
        variants={coffeeSteamVariants}
        initial="normal"
        animate="animate"
        custom={0.4}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <motion.path
        d="M6 2v2"
        variants={coffeeSteamVariants}
        initial="normal"
        animate="animate"
        custom={0}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <path
        d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}
