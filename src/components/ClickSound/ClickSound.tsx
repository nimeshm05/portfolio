"use client";

import { useEffect } from "react";

const PAGE_TRANSITION_SOUND_SRC = "/assets/page-transition.mp3";

const PAGE_TRANSITION_SELECTOR = [
  ".project-card",
  'a.list-item[href^="/work/"]',
  ".sidebar-nav-back",
  ".project-back-mobile",
].join(", ");

/**
 * Elements that pick their own SND sound: `data-sound="<sound key>"`, e.g.
 * "button", "select", "transition_up". Everything else clickable taps.
 */
const SOUND_SELECTOR = "[data-sound]";

const CLICKABLE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  '[role="button"]',
  '[role="tab"]',
].join(", ");

/** Phones and tablets: taps there are frequent and close together, so the sounds grate. */
const TOUCH_DEVICE_QUERY = "(hover: none) and (pointer: coarse)";

/** SND's kits: 01 is soft and airy, 02 is piano-like, 03 is industrial. */
const SOUND_KIT = "01";
const SOUND_VOLUME = 0.6;

function playPageTransition() {
  const sound = new Audio(PAGE_TRANSITION_SOUND_SRC);
  sound.volume = 0.4;
  return sound.play();
}

export function ClickSound() {
  useEffect(() => {
    if (window.matchMedia(TOUCH_DEVICE_QUERY).matches) {
      return;
    }

    let cancelled = false;
    let play: ((key: string) => void) | null = null;

    // SND touches window on construction, so load it in the browser only.
    void import("snd-lib").then(async ({ default: Snd }) => {
      const snd = new Snd({ easySetup: false, preloadSoundKit: null });
      await snd.load(SOUND_KIT);
      if (cancelled) return;
      play = (key) => {
        // tap has five variants; playTap picks one so repeats don't drone.
        if (key === Snd.SOUNDS.TAP) snd.playTap({ volume: SOUND_VOLUME });
        else snd.play(key, { volume: SOUND_VOLUME });
      };
    });

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

      const custom = target.closest<HTMLElement>(SOUND_SELECTOR);
      if (custom?.dataset.sound) {
        play?.(custom.dataset.sound);
        return;
      }

      if (target.closest(CLICKABLE_SELECTOR)) {
        play?.("tap");
      }
    };

    document.addEventListener("pointerdown", onPointerDown, true);

    return () => {
      cancelled = true;
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, []);

  return null;
}
