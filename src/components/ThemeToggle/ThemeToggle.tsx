"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MoonAnimatedIcon } from "@/components/AnimatedIcon/icons/moon";
import { SunAnimatedIcon } from "@/components/AnimatedIcon/icons/sun";
import { Icon } from "@/components/Icon/Icon";
import type { AnimatedIconHandle } from "@/components/AnimatedIcon/types";
import {
  getPhotoSlideshowSwapVariants,
  photoSlideshowSwapTransition,
} from "@/motion/photoSlideshow";
import { useTheme } from "@/theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const reduceMotion = useReducedMotion() ?? false;
  const iconRef = useRef<AnimatedIconHandle>(null);
  const nextTheme = theme === "dark" ? "light" : "dark";
  const variants = getPhotoSlideshowSwapVariants(reduceMotion);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="site-control"
      aria-label={`Switch to ${nextTheme} mode`}
      onClick={toggleTheme}
      onPointerEnter={() => {
        if (!reduceMotion) {
          iconRef.current?.startAnimation();
        }
      }}
      onPointerLeave={() => {
        if (!reduceMotion) {
          iconRef.current?.stopAnimation();
        }
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          className="site-control-icon-swap"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={photoSlideshowSwapTransition}
        >
          {isDark ? (
            reduceMotion ? (
              <Icon name="sun" size={20} className="site-control-icon" />
            ) : (
              <SunAnimatedIcon
                ref={iconRef}
                size={20}
                className="site-control-icon"
              />
            )
          ) : reduceMotion ? (
            <Icon name="moon" size={20} className="site-control-icon" />
          ) : (
            <MoonAnimatedIcon
              ref={iconRef}
              size={20}
              className="site-control-icon"
            />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
