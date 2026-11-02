"use client";

import { useCallback, useEffect, useRef, type MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { animate, stagger, useReducedMotion } from "motion/react";
import { pageEnterEase } from "@/motion/pageEnter";

/** Pixel offset — Motion cannot interpolate CSS variables smoothly. */
const PAGE_EXIT_OFFSET_PX = 64;
const PAGE_EXIT_DURATION_S = 0.32;
const PAGE_EXIT_STAGGER_S = 0.04;
const PAGE_EXIT_BLUR = "blur(8px)";

/**
 * The same pieces that staggered in on the way in. The sidebar and the content
 * each run their own stagger side by side, so a long sidebar doesn't hold up
 * the content.
 */
const PROJECT_EXIT_GROUPS = [
  ".project-body .page-enter-item",
  ".project-sidebar .sidebar-nav-motion-item, .project-back-mobile",
];

/** Same reasoning as the entrance: phones can't repaint a full-page blur smoothly. */
function isTouchScreen() {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

function isOnScreen(element: Element) {
  const { top, bottom } = element.getBoundingClientRect();
  return bottom > 0 && top < window.innerHeight;
}

/**
 * Items on screen, top to bottom. Off-screen ones would only add wait before
 * the page changes, and an item inside another already moves with it.
 */
function getExitItems(selector: string) {
  const items = [...document.querySelectorAll(selector)];

  return items.filter(
    (item) =>
      isOnScreen(item) &&
      !items.some((other) => other !== item && other.contains(item)),
  );
}

function isModifiedClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

/**
 * Click handler for a link back home from a project page: line by line, the
 * page drifts right as it fades and blurs, then home plays its entrance.
 */
export function useExitToHome() {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion() ?? false;
  const leaving = useRef(false);

  // The mobile Back link lives in the root layout and never remounts, so the
  // flag has to clear once the page changes or the next exit is swallowed
  useEffect(() => {
    leaving.current = false;
  }, [pathname]);

  return useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (reduceMotion || isModifiedClick(event)) {
        return;
      }

      event.preventDefault();

      if (leaving.current) {
        return;
      }

      leaving.current = true;
      const blur = isTouchScreen() ? {} : { filter: PAGE_EXIT_BLUR };

      const exits = PROJECT_EXIT_GROUPS.map((selector) =>
        animate(
          getExitItems(selector),
          { opacity: 0, x: PAGE_EXIT_OFFSET_PX, ...blur },
          {
            duration: PAGE_EXIT_DURATION_S,
            ease: pageEnterEase,
            delay: stagger(PAGE_EXIT_STAGGER_S),
          },
        ),
      );

      Promise.all(exits).then(() => {
        router.push("/");
      });
    },
    [reduceMotion, router],
  );
}
