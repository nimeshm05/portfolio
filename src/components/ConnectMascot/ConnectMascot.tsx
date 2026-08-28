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
  const rightScaleY = useMotionValue(1);
  const eyeRotate =
    reduceMotion || !eyesTilted ? 0 : mascotEyeTiltDeg;

  useEffect(() => {
    if (blinkKey === 0 || reduceMotion) {
      rightScaleY.set(1);
      return;
    }

    rightScaleY.set(1);
    const wink = animate(rightScaleY, [1, mascotWinkScaleY, 1], {
      duration: mascotWinkTransition.duration,
      ease: mascotWinkTransition.ease,
      times: [...mascotWinkTransition.times],
    });

    return () => {
      wink.stop();
    };
  }, [blinkKey, reduceMotion, rightScaleY]);

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
          d="M11 0.57735C11.6188 0.220084 12.3812 0.220085 13 0.57735L21.3923 5.42265C22.0111 5.77992 22.3923 6.44017 22.3923 7.1547V16.8453C22.3923 17.5598 22.0111 18.2201 21.3923 18.5774L13 23.4226C12.3812 23.7799 11.6188 23.7799 11 23.4226L2.6077 18.5774C1.98889 18.2201 1.6077 17.5598 1.6077 16.8453V7.1547C1.6077 6.44017 1.98889 5.77992 2.6077 5.42265L11 0.57735Z"
          fill="#72A751"
        />
        <path
          d="M9 18.7236C9 18.3912 9.34986 18.1749 9.64721 18.3236L11.2918 19.1459C11.7376 19.3688 12.2624 19.3688 12.7082 19.1459L14.3528 18.3236C14.6501 18.1749 15 18.3912 15 18.7236C15 18.893 14.9043 19.0479 14.7528 19.1236L12.8944 20.0528C12.3314 20.3343 11.6686 20.3343 11.1056 20.0528L9.24721 19.1236C9.0957 19.0479 9 18.893 9 18.7236Z"
          fill="white"
        />
        <motion.rect
          className="connect-mascot-eye"
          x="6"
          y="7"
          width="3"
          height="6"
          rx="1"
          fill="white"
          style={{ originX: 0.5, originY: 0.5 }}
          initial={false}
          animate={{ rotate: eyeRotate }}
          transition={
            reduceMotion ? { duration: 0 } : mascotEyeTransition
          }
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
