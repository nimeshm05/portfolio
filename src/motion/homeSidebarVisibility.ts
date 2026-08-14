"use client";

import { useEffect, useState, type RefObject } from "react";

const DEFAULT_THRESHOLD_PX = 200;

type UseHomeSidebarVisibilityOptions = {
  thresholdPx?: number;
  enabled?: boolean;
};

export function useHomeSidebarVisibility(
  targetRef: RefObject<HTMLElement | null>,
  {
    thresholdPx = DEFAULT_THRESHOLD_PX,
    enabled = true,
  }: UseHomeSidebarVisibilityOptions = {},
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }

    const target = targetRef.current;

    if (!target) {
      return;
    }

    let frameId = 0;

    const syncVisibility = () => {
      const nextVisible = target.getBoundingClientRect().top <= thresholdPx;

      setVisible((current) => (current === nextVisible ? current : nextVisible));
    };

    const scheduleSync = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        syncVisibility();
      });
    };

    syncVisibility();

    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, [enabled, targetRef, thresholdPx]);

  return visible;
}
