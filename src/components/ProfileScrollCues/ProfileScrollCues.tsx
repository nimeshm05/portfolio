"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { HomeTab } from "@/data/home";
import "./ProfileScrollCues.css";

const LETTER_DURATION = 0.05;
const LETTER_GAP = 0.012;
const HEAD_DURATION = 0.32;
const SHAFT_DURATION = 0.48;
const HEAD_TO_SHAFT_GAP = 0.12;
const SHAFT_TO_TEXT_GAP = 0.08;
const CUE_GAP = 0.2;
const FADE_RANGE_RATIO = 0.4;
const INTERACTIVE_OPACITY = 0.05;

const WORK_ARROW = {
  viewBox: "-4 -4 32 62",
  shaft:
    "M1.5 1.5C2.24676 2.24676 2.99352 2.99352 4.93636 7.43693C6.8792 11.8803 9.99549 19.9978 11.6942 24.9262C13.3929 29.8547 13.5796 31.3482 13.7719 34.0185",
  head: "M4.5 34.6586C7.48704 38.0247 16.9121 47.4441 21.4596 50.9831C21.7557 43.4515 21.1944 37.6853 21.1002 34.4327C21.0059 32.8315 20.8174 31.3308 20.6232 27.5",
} as const;

const ABOUT_ARROW = {
  viewBox: "-4 -4 31 63",
  shaft:
    "M20.7715 1.5C20.0247 2.24676 19.278 2.99352 17.3351 7.43693C15.3923 11.8803 12.276 19.9978 10.5773 24.9262C8.87858 29.8547 8.69189 31.3482 8.49955 34.0185",
  head: "M18.5446 35.6586C15.5575 39.0247 6.13249 48.4441 1.58494 51.9831C1.28888 44.4515 1.85015 38.6853 1.94439 35.4327C2.03864 33.8315 2.22712 32.3308 2.42132 28.5",
} as const;

type CueLetter = {
  key: string;
  char: string;
  delay: number;
  isSpace: boolean;
};

type CueTiming = {
  headDelay: number;
  shaftDelay: number;
  textStart: number;
  letters: CueLetter[];
  textEnd: number;
};

function buildCueTiming(word: string, start: number): CueTiming {
  let letterIndex = 0;
  const letters: CueLetter[] = Array.from(word).map((char, charIndex) => {
    const isSpace = char === " ";
    const delay = letterIndex * (LETTER_DURATION + LETTER_GAP);

    if (!isSpace) {
      letterIndex += 1;
    }

    return {
      key: `${word}-${charIndex}-${char}`,
      char: isSpace ? "\u00A0" : char,
      delay,
      isSpace,
    };
  });

  const headDelay = start;
  const shaftDelay = start + HEAD_DURATION + HEAD_TO_SHAFT_GAP;
  const textStart = shaftDelay + SHAFT_DURATION + SHAFT_TO_TEXT_GAP;
  const lastLetterDelay = Math.max(
    0,
    ...letters.filter((item) => !item.isSpace).map((item) => item.delay),
  );

  return {
    headDelay,
    shaftDelay,
    textStart,
    letters,
    textEnd: textStart + lastLetterDelay + LETTER_DURATION,
  };
}

const WORK_TIMING = buildCueTiming("Work", 0);
const ABOUT_TIMING = buildCueTiming("About", WORK_TIMING.textEnd + CUE_GAP);

type ProfileScrollCuesProps = {
  onSelect: (tab: HomeTab) => void;
};

type ArrowGeometry = {
  viewBox: string;
  shaft: string;
  head: string;
};

type CueArrowProps = {
  geometry: ArrowGeometry;
  headDelay: number;
  shaftDelay: number;
  reduceMotion: boolean;
};

function CueArrow({
  geometry,
  headDelay,
  shaftDelay,
  reduceMotion,
}: CueArrowProps) {
  return (
    <svg
      className="profile-scroll-cue-arrow"
      viewBox={geometry.viewBox}
      aria-hidden="true"
      focusable="false"
    >
      <motion.path
        d={geometry.head}
        strokeWidth={3}
        initial={{ pathLength: reduceMotion ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: HEAD_DURATION, delay: headDelay, ease: "easeOut" }
        }
      />
      <motion.path
        d={geometry.shaft}
        strokeWidth={3}
        initial={{ pathLength: reduceMotion ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: SHAFT_DURATION,
                delay: shaftDelay,
                ease: "easeOut",
              }
        }
      />
    </svg>
  );
}

type CueClusterProps = {
  ariaLabel: string;
  className: string;
  geometry: ArrowGeometry;
  timing: CueTiming;
  reduceMotion: boolean;
  onClick: () => void;
};

function CueCluster({
  ariaLabel,
  className,
  geometry,
  timing,
  reduceMotion,
  onClick,
}: CueClusterProps) {
  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span className="profile-scroll-cue-label" aria-hidden="true">
        {timing.letters.map((item) => {
          if (item.isSpace) {
            return (
              <span key={item.key} className="profile-scroll-cue-space">
                {item.char}
              </span>
            );
          }

          return (
            <motion.span
              key={item.key}
              className="profile-scroll-cue-letter"
              initial={{
                clipPath: reduceMotion
                  ? "inset(-0.2em 0% -0.25em 0)"
                  : "inset(-0.2em 100% -0.25em 0)",
              }}
              animate={{
                clipPath: "inset(-0.2em 0% -0.25em 0)",
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: LETTER_DURATION,
                      delay: timing.textStart + item.delay,
                      ease: "easeOut",
                    }
              }
            >
              {item.char}
            </motion.span>
          );
        })}
      </span>
      <CueArrow
        geometry={geometry}
        headDelay={timing.headDelay}
        shaftDelay={timing.shaftDelay}
        reduceMotion={reduceMotion}
      />
    </button>
  );
}

function getScrollTop() {
  return Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop,
    document.scrollingElement?.scrollTop ?? 0,
  );
}

function useProfileCueFade(reduceMotion: boolean) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(true);

  useEffect(() => {
    const cues = rootRef.current;

    if (!cues) {
      return;
    }

    const html = document.documentElement;
    const scroller = document.scrollingElement ?? html;
    let frameId = 0;
    let wheelOffset = 0;
    let wheeling = false;
    let wheelResetTimer = 0;

    const fadeRange = () => Math.max(1, window.innerHeight * FADE_RANGE_RATIO);

    const syncFade = () => {
      const range = fadeRange();
      const scrollTop = getScrollTop();

      if (!wheeling && scrollTop < 8) {
        wheelOffset = 0;
      }

      const traveled = Math.min(range, Math.max(scrollTop, wheelOffset));
      let opacity = 1 - traveled / range;

      if (reduceMotion) {
        opacity = opacity > 0.5 ? 1 : 0;
      }

      cues.style.opacity = String(opacity);
      setInteractive((current) => {
        const nextInteractive = opacity > INTERACTIVE_OPACITY;
        return current === nextInteractive ? current : nextInteractive;
      });
    };

    const scheduleSync = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        syncFade();
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        return;
      }

      const delta =
        event.deltaMode === 1
          ? event.deltaY * 16
          : event.deltaMode === 2
            ? event.deltaY * window.innerHeight
            : event.deltaY;

      wheeling = true;
      window.clearTimeout(wheelResetTimer);
      wheelOffset = Math.min(fadeRange(), Math.max(0, wheelOffset + delta));
      wheelResetTimer = window.setTimeout(() => {
        wheeling = false;
        scheduleSync();
      }, 160);
      scheduleSync();
    };

    syncFade();

    const scrollOptions: AddEventListenerOptions = { passive: true };
    scroller.addEventListener("scroll", scheduleSync, scrollOptions);
    html.addEventListener("scroll", scheduleSync, scrollOptions);
    window.addEventListener("scroll", scheduleSync, scrollOptions);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", scheduleSync);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      window.clearTimeout(wheelResetTimer);
      scroller.removeEventListener("scroll", scheduleSync);
      html.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", scheduleSync);
    };
  }, [reduceMotion]);

  return { rootRef, interactive };
}

export function ProfileScrollCues({ onSelect }: ProfileScrollCuesProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const { rootRef, interactive } = useProfileCueFade(reduceMotion);

  return (
    <div
      ref={rootRef}
      className={["profile-scroll-cues", interactive ? "" : "is-hidden"]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={!interactive}
    >
      <CueCluster
        ariaLabel="View work"
        className="profile-scroll-cue"
        geometry={WORK_ARROW}
        timing={WORK_TIMING}
        reduceMotion={reduceMotion}
        onClick={() => onSelect("work")}
      />
      <CueCluster
        ariaLabel="View about"
        className="profile-scroll-cue profile-scroll-cue--about"
        geometry={ABOUT_ARROW}
        timing={ABOUT_TIMING}
        reduceMotion={reduceMotion}
        onClick={() => onSelect("about")}
      />
    </div>
  );
}
