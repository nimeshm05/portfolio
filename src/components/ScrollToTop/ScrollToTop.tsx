"use client";

import { useRef, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/Icon/Icon";
import { ArrowUpAnimatedIcon } from "@/components/AnimatedIcon/icons/arrow-up";
import type { AnimatedIconHandle } from "@/components/AnimatedIcon/types";
import "./ScrollToTop.css";

const REVEAL_RATIO = 0.15;
const SCROLL_OPTIONS: AddEventListenerOptions = { passive: true, capture: true };
const ENTER_Y = 20;
const EXPAND_EASE = [0.22, 1, 0.36, 1] as const;

let scrollTopVisible = false;
const listeners = new Set<() => void>();
let attached = false;

function getScrollY() {
  return Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop,
  );
}

function getRevealOffset() {
  return Math.min(120, window.innerHeight * REVEAL_RATIO);
}

function notify() {
  const next = getScrollY() > getRevealOffset();
  if (next === scrollTopVisible) {
    return;
  }

  scrollTopVisible = next;
  listeners.forEach((listener) => listener());
}

function attach() {
  if (attached) {
    return;
  }

  attached = true;
  document.documentElement.addEventListener("scroll", notify, SCROLL_OPTIONS);
  document.addEventListener("scroll", notify, SCROLL_OPTIONS);
  window.addEventListener("scroll", notify, SCROLL_OPTIONS);
  window.addEventListener("resize", notify);
}

function detach() {
  if (!attached) {
    return;
  }

  attached = false;
  document.documentElement.removeEventListener("scroll", notify, SCROLL_OPTIONS);
  document.removeEventListener("scroll", notify, SCROLL_OPTIONS);
  window.removeEventListener("scroll", notify, SCROLL_OPTIONS);
  window.removeEventListener("resize", notify);
}

function subscribeToScroll(onChange: () => void) {
  listeners.add(onChange);
  attach();
  queueMicrotask(notify);

  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      detach();
    }
  };
}

function getScrollTopVisibleSnapshot() {
  return scrollTopVisible;
}

export function ScrollToTop() {
  const visible = useSyncExternalStore(
    subscribeToScroll,
    getScrollTopVisibleSnapshot,
    () => false,
  );
  const reduceMotion = useReducedMotion() ?? false;
  const iconRef = useRef<AnimatedIconHandle>(null);
  const hidden = reduceMotion
    ? { opacity: 0, y: 0 }
    : { opacity: 0, y: ENTER_Y };
  const shown = { opacity: 1, y: 0 };

  return (
    <div className="scroll-to-top">
      <AnimatePresence>
        {visible ? (
          <motion.button
            type="button"
            className="site-control scroll-to-top-control"
            aria-label="Back to top"
            initial={hidden}
            animate={shown}
            exit={hidden}
            transition={
              reduceMotion
                ? { duration: 0.16 }
                : { duration: 0.5, ease: EXPAND_EASE }
            }
            onClick={() => {
              const behavior = reduceMotion ? "auto" : "smooth";
              document.documentElement.scrollTo({ top: 0, behavior });
              window.scrollTo({ top: 0, behavior });
            }}
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
            <span className="site-control-icon-swap">
              {reduceMotion ? (
                <Icon name="arrow-up" size={20} className="site-control-icon" />
              ) : (
                <ArrowUpAnimatedIcon
                  ref={iconRef}
                  size={20}
                  className="site-control-icon"
                />
              )}
            </span>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
