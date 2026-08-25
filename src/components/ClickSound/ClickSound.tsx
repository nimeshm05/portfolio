"use client";

import { useEffect } from "react";
import { bind, play } from "cuelume";

const PAGE_TRANSITION_SOUND_SRC = "/assets/page-transition.mp3";

const PAGE_TRANSITION_SELECTOR = [
  ".project-card",
  'a.list-item[href^="/work/"]',
  ".sidebar-nav-back",
  ".project-back-mobile",
].join(", ");

const CUELUME_SELECTOR = "[data-cuelume-press], [data-cuelume-toggle]";

const CLICKABLE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  '[role="button"]',
  '[role="tab"]',
].join(", ");

function playPageTransition() {
  const sound = new Audio(PAGE_TRANSITION_SOUND_SRC);
  sound.volume = 0.4;
  return sound.play();
}

export function ClickSound() {
  useEffect(() => {
    bind();

    const transitionWarm = new Audio(PAGE_TRANSITION_SOUND_SRC);
    transitionWarm.preload = "auto";

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest(PAGE_TRANSITION_SELECTOR)) {
        void playPageTransition().catch(() => {
          // Ignore autoplay / interrupted play rejections.
        });
        return;
      }

      if (target.closest(CUELUME_SELECTOR)) {
        return;
      }

      if (target.closest(CLICKABLE_SELECTOR)) {
        play("press");
      }
    };

    document.addEventListener("pointerdown", onPointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, []);

  return null;
}
