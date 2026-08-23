"use client";

import { useEffect } from "react";

const CLICK_SOUND_SRC = "/assets/click-prompt.wav";
const PAGE_TRANSITION_SOUND_SRC = "/assets/page-transition.mp3";

const PAGE_TRANSITION_SELECTOR = [
  ".project-card",
  'a.list-item[href^="/work/"]',
  ".sidebar-nav-back",
  ".project-back-mobile",
].join(", ");

function playSound(src: string, volume = 1) {
  const sound = new Audio(src);
  sound.volume = volume;
  return sound.play();
}

export function ClickSound() {
  useEffect(() => {
    // Warm the browser cache so the first gesture plays promptly.
    const clickWarm = new Audio(CLICK_SOUND_SRC);
    const transitionWarm = new Audio(PAGE_TRANSITION_SOUND_SRC);
    clickWarm.preload = "auto";
    transitionWarm.preload = "auto";

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const isPageTransition = Boolean(
        target.closest(PAGE_TRANSITION_SELECTOR),
      );
      const src = isPageTransition
        ? PAGE_TRANSITION_SOUND_SRC
        : CLICK_SOUND_SRC;

      void playSound(src, isPageTransition ? 0.4 : 1).catch(() => {
        // Ignore autoplay / interrupted play rejections.
      });
    };

    document.addEventListener("pointerdown", onPointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, []);

  return null;
}
