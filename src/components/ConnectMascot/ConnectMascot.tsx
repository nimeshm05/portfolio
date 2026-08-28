"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import {
  mascotEnterPose,
  mascotEyeTiltDeg,
  mascotEyeTransition,
  mascotHiddenBelow,
  mascotIdleBlinkMs,
  mascotPresenceTransition,
  mascotWinkScaleY,
  mascotWinkTransition,
} from "@/motion/connectPrompt";
import "./ConnectMascot.css";

type ConnectMascotProps = {
  eyesTilted: boolean;
  blinkKey: number;
};

export function ConnectMascot({ eyesTilted, blinkKey }: ConnectMascotProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const leftScaleY = useMotionValue(1);
  const rightScaleY = useMotionValue(1);
  const eyeRotate =
    reduceMotion || !eyesTilted ? 0 : mascotEyeTiltDeg;

  const playBlink = (left: boolean, right: boolean) => {
    const frames = [1, mascotWinkScaleY, 1] as const;
    const options = {
      duration: mascotWinkTransition.duration,
      ease: mascotWinkTransition.ease,
      times: [...mascotWinkTransition.times],
    };

    if (left) {
      leftScaleY.set(1);
      animate(leftScaleY, [...frames], options);
    }
    if (right) {
      rightScaleY.set(1);
      animate(rightScaleY, [...frames], options);
    }
  };

  useEffect(() => {
    if (blinkKey === 0 || reduceMotion) {
      rightScaleY.set(1);
      return;
    }

    playBlink(false, true);
  }, [blinkKey, reduceMotion, rightScaleY]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      playBlink(true, true);
    }, mascotIdleBlinkMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [reduceMotion, leftScaleY, rightScaleY]);

  return (
    <motion.span
      className="connect-mascot"
      aria-hidden="true"
      initial={reduceMotion ? { opacity: 0, y: 0 } : mascotHiddenBelow}
      animate={mascotEnterPose}
      exit={reduceMotion ? { opacity: 0, y: 0 } : mascotHiddenBelow}
      transition={
        reduceMotion ? { duration: 0 } : mascotPresenceTransition
      }
    >
      <svg
        className="connect-mascot-svg"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M10.5 1.4434A3 3 0 0 1 13.5 1.4434L20.3923 5.4227A3 3 0 0 1 21.8923 8.0208L21.8923 15.9792A3 3 0 0 1 20.3923 18.5773L13.5 22.5566A3 3 0 0 1 10.5 22.5566L3.6077 18.5773A3 3 0 0 1 2.1077 15.9792L2.1077 8.0208A3 3 0 0 1 3.6077 5.4227Z"
          fill="#72A751"
        />
        <path
          d="M9 18.7236C9 18.3912 9.34986 18.1749 9.64721 18.3236L11.2918 19.1459C11.7376 19.3688 12.2624 19.3688 12.7082 19.1459L14.3528 18.3236C14.6501 18.1749 15 18.3912 15 18.7236C15 18.893 14.9043 19.0479 14.7528 19.1236L12.8944 20.0528C12.3314 20.3343 11.6686 20.3343 11.1056 20.0528L9.24721 19.1236C9.0957 19.0479 9 18.893 9 18.7236Z"
          fill="white"
        />
        <motion.g
          className="connect-mascot-eye-turn"
          style={{ originX: 0.5, originY: 0.5 }}
          initial={false}
          animate={{ rotate: eyeRotate }}
          transition={
            reduceMotion ? { duration: 0 } : mascotEyeTransition
          }
        >
          <motion.rect
            className="connect-mascot-eye"
            x="6"
            y="7"
            width="3"
            height="6"
            rx="1"
            fill="white"
            style={{ originX: 0.5, originY: 0.5, scaleY: leftScaleY }}
          />
        </motion.g>
        <motion.g
          className="connect-mascot-eye-turn"
          style={{ originX: 0.5, originY: 0.5 }}
          initial={false}
          animate={{ rotate: eyeRotate }}
          transition={
            reduceMotion ? { duration: 0 } : mascotEyeTransition
          }
        >
          <motion.rect
            className="connect-mascot-eye"
            x="15"
            y="7"
            width="3"
            height="6"
            rx="1"
            fill="white"
            style={{ originX: 0.5, originY: 0.5, scaleY: rightScaleY }}
          />
        </motion.g>
      </svg>
    </motion.span>
  );
}
