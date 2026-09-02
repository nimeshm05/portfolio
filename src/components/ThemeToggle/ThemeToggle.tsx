"use client";

import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { ContrastAnimatedIcon } from "@/components/AnimatedIcon/icons/contrast";
import { Icon } from "@/components/Icon/Icon";
import type { AnimatedIconHandle } from "@/components/AnimatedIcon/types";
import { useTheme } from "@/theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const reduceMotion = useReducedMotion() ?? false;
  const iconRef = useRef<AnimatedIconHandle>(null);
  const nextTheme = theme === "dark" ? "light" : "dark";

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
      {reduceMotion ? (
        <Icon name="contrast" size={20} className="site-control-icon" />
      ) : (
        <ContrastAnimatedIcon
          ref={iconRef}
          size={20}
          className="site-control-icon"
        />
      )}
    </button>
  );
}
