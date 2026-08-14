"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  excitementLegStaggerSeconds,
  excitementLegTransition,
  excitementSmokeTransition,
  excitementYayDrawTransition,
  excitementYayFillTransition,
} from "@/motion/connectPrompt";
import { EXCITEMENT_YAY_PATH } from "./excitementYayPath";
import "./ConnectExcitement.css";

export type ExcitementExitMode = "reverse" | "smoke";

type ConnectExcitementProps = {
  exitMode: ExcitementExitMode;
};

const LEGS = [
  { x1: 13.9427, y1: 35.5, x2: 22.9566, y2: 51.1125 },
  { x1: 68.2106, y1: 51.1125, x2: 77.2245, y2: 35.5 },
  { x1: 0.707107, y1: 45.2164, x2: 13.8601, y2: 58.3694 },
  { x1: 75.3696, y1: 58.4458, x2: 88.5225, y2: 45.2929 },
] as const;

const drawn = { pathLength: 1, opacity: 1 };
const undrawn = { pathLength: 0, opacity: 1 };

export function ConnectExcitement({ exitMode }: ConnectExcitementProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const smokeOut = exitMode === "smoke";

  return (
    <motion.span
      className="connect-prompt-excitement"
      aria-hidden="true"
      initial={
        reduceMotion
          ? { opacity: 0, filter: "blur(0px)" }
          : { opacity: 1, filter: "blur(0px)" }
      }
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={
        smokeOut || reduceMotion
          ? {
              opacity: 0,
              filter: reduceMotion ? "blur(0px)" : "blur(8px)",
            }
          : { opacity: 1, filter: "blur(0px)" }
      }
      transition={
        smokeOut || reduceMotion
          ? excitementSmokeTransition
          : excitementLegTransition
      }
    >
      <svg
        className="connect-prompt-excitement-svg"
        viewBox="0 0 90 60"
        fill="none"
      >
        {LEGS.map((leg, index) => (
          <motion.line
            key={`${leg.x1}-${leg.y1}`}
            x1={leg.x1}
            y1={leg.y1}
            x2={leg.x2}
            y2={leg.y2}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            initial={reduceMotion ? drawn : undrawn}
            animate={drawn}
            exit={smokeOut || reduceMotion ? drawn : undrawn}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    ...excitementLegTransition,
                    delay: smokeOut
                      ? 0
                      : index * excitementLegStaggerSeconds,
                  }
            }
          />
        ))}
        <motion.path
          className="connect-prompt-excitement-word"
          d={EXCITEMENT_YAY_PATH}
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="currentColor"
          initial={
            reduceMotion
              ? { pathLength: 1, fillOpacity: 1 }
              : { pathLength: 0, fillOpacity: 0 }
          }
          animate={{ pathLength: 1, fillOpacity: 1 }}
          exit={
            smokeOut || reduceMotion
              ? { pathLength: 1, fillOpacity: 1 }
              : { pathLength: 0, fillOpacity: 0 }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  pathLength: {
                    ...excitementYayDrawTransition,
                    delay: smokeOut
                      ? 0
                      : LEGS.length * excitementLegStaggerSeconds,
                  },
                  fillOpacity: {
                    ...excitementYayFillTransition,
                    delay: smokeOut
                      ? 0
                      : excitementYayFillTransition.delay +
                        LEGS.length * excitementLegStaggerSeconds,
                  },
                }
          }
        />
      </svg>
    </motion.span>
  );
}
