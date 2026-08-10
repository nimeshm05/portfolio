"use client";

import { motion } from "motion/react";
import "./MorphingConnectIcon.css";

const TRANSITION = {
  duration: 0.2,
  ease: "easeInOut" as const,
};

const WORKFLOW_PRIMARY_PATH = "M7 11v4a2 2 0 0 0 2 2h4";
const SEND_TO_BACK_PRIMARY_PATH = "M7 14v1a2 2 0 0 0 2 2h1";
const SEND_TO_BACK_SECONDARY_PATH = "M14 7h1a2 2 0 0 1 2 2v1";
/** Approximate length of the secondary elbow in viewBox units. */
const SECONDARY_PATH_LENGTH = 10;

type MorphingConnectIconProps = {
  variant: "workflow" | "send-to-back";
};

export function MorphingConnectIcon({ variant }: MorphingConnectIconProps) {
  const isSendToBack = variant === "send-to-back";

  return (
    <svg
      className="morphing-connect-icon"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <motion.rect
        width={8}
        height={8}
        rx={2}
        initial={false}
        animate={{
          x: isSendToBack ? 2 : 3,
          y: isSendToBack ? 2 : 3,
        }}
        transition={TRANSITION}
        stroke="currentColor"
        strokeWidth={2}
      />
      <motion.rect
        width={8}
        height={8}
        rx={2}
        initial={false}
        animate={{
          x: isSendToBack ? 14 : 13,
          y: isSendToBack ? 14 : 13,
        }}
        transition={TRANSITION}
        stroke="currentColor"
        strokeWidth={2}
      />
      <motion.path
        initial={false}
        animate={{
          d: isSendToBack ? SEND_TO_BACK_PRIMARY_PATH : WORKFLOW_PRIMARY_PATH,
        }}
        transition={TRANSITION}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <motion.path
        d={SEND_TO_BACK_SECONDARY_PATH}
        initial={false}
        animate={{
          strokeDashoffset: isSendToBack ? 0 : SECONDARY_PATH_LENGTH,
        }}
        transition={TRANSITION}
        style={{ strokeDasharray: SECONDARY_PATH_LENGTH }}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
