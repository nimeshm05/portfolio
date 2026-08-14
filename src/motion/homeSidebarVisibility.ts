"use client";

import { useEffect, useState } from "react";

const DEFAULT_THRESHOLD_PX = 200;

type UseHomeSidebarVisibilityOptions = {
  thresholdPx?: number;
  enabled?: boolean;
};

function isContentInSidebarVicinity(
  target: HTMLElement,
  thresholdPx: number,
): boolean {
  const rect = target.getBoundingClientRect();
  const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;

  return inViewport && rect.top <= thresholdPx;
}

export function useHomeSidebarVisibility(
  target: HTMLElement | null,
  {
    thresholdPx = DEFAULT_THRESHOLD_PX,
    enabled = true,
  }: UseHomeSidebarVisibilityOptions = {},
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || !target?.isConnected) {
      setVisible(false);
      return;
    }

    let frameId = 0;

    const syncVisibility = () => {
      const nextVisible = isContentInSidebarVicinity(target, thresholdPx);

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

    const observer = new IntersectionObserver(scheduleSync);

    observer.observe(target);
    syncVisibility();

    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      observer.disconnect();
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, [enabled, target, thresholdPx]);

  return visible;
}
