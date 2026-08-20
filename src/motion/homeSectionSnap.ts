"use client";

import { useEffect } from "react";

const FREE_SCROLL_CLASS = "home-page--free-scroll";
const RELEASE_PX = 64;
const PROFILE_RESUME_RATIO = 0.5;

export function useHomeSectionSnap(root: HTMLElement | null) {
  useEffect(() => {
    if (!root?.isConnected) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const profile = root.querySelector<HTMLElement>(".site-header-profile");
    const lower = root.querySelector<HTMLElement>(".home-lower");
    const scroller = document.documentElement;

    if (!profile || !lower) {
      return;
    }

    let frameId = 0;
    let freeScroll = false;

    const applySnap = (released: boolean) => {
      root.classList.toggle(FREE_SCROLL_CLASS, released);
      scroller.style.scrollSnapType = released ? "none" : "";
    };

    const syncSnap = () => {
      if (motionQuery.matches) {
        freeScroll = true;
        applySnap(true);
        return;
      }

      const profileBottom = profile.getBoundingClientRect().bottom;
      const lowerTop = lower.getBoundingClientRect().top;

      if (profileBottom > window.innerHeight * PROFILE_RESUME_RATIO) {
        freeScroll = false;
      } else if (lowerTop <= RELEASE_PX) {
        freeScroll = true;
      }

      applySnap(freeScroll);
    };

    const scheduleSync = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        syncSnap();
      });
    };

    syncSnap();

    scroller.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    motionQuery.addEventListener("change", scheduleSync);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      applySnap(false);
      scroller.style.scrollSnapType = "";
      scroller.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      motionQuery.removeEventListener("change", scheduleSync);
    };
  }, [root]);
}
