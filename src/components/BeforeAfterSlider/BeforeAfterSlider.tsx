"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { BeforeAfter } from "react-simple-before-after";
import type { BeforeAfterMedia } from "@/data/projects/types";
import "@/components/ProjectBanner/ProjectBanner.css";
import "./BeforeAfterSlider.css";

/** How far one image has to cover the frame before its caption takes over */
const REVEAL_THRESHOLD = 70;

type CaptionKey = "idle" | "before" | "after";

function getCaptionKey(value: number): CaptionKey {
  if (value >= REVEAL_THRESHOLD) return "before";
  if (value <= 100 - REVEAL_THRESHOLD) return "after";
  return "idle";
}

const captionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.14 } },
  exit: { transition: { staggerChildren: 0.02 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 6, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: "blur(8px)",
    transition: { duration: 0.28, ease: "easeIn" },
  },
};

const reducedWordVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

type Caption = { label?: string; text: string };

function toWords(caption: Caption) {
  return [
    ...(caption.label ? [{ text: `${caption.label}:`, label: true }] : []),
    ...caption.text.split(" ").map((text) => ({ text, label: false })),
  ];
}

type BeforeAfterSliderProps = BeforeAfterMedia;

export function BeforeAfterSlider({
  before,
  after,
  idleCaption,
}: BeforeAfterSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [captionKey, setCaptionKey] = useState<CaptionKey>("idle");
  const reduceMotion = useReducedMotion();

  const captions: Record<CaptionKey, Caption> = {
    idle: { text: idleCaption },
    before: { label: "Before", text: before.caption },
    after: { label: "After", text: after.caption },
  };
  const active = captions[captionKey];

  // The library hard-codes its image alts and leaves the range unlabelled
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const [beforeImg, afterImg] = root.querySelectorAll("img");
    beforeImg?.setAttribute("alt", before.alt);
    afterImg?.setAttribute("alt", after.alt);
    beforeImg?.setAttribute("draggable", "false");
    afterImg?.setAttribute("draggable", "false");
    const range = root.querySelector("input[type=range]");
    range?.setAttribute("aria-label", "Compare before and after");
    // Finer steps than the library's 1% so the divider glides, not ticks
    range?.setAttribute("step", "0.1");
  }, [before.alt, after.alt]);

  // The handle sits under the range input (pointer-events: none), so CSS
  // :hover / :active never reach it. Track them here as data attributes.
  useEffect(() => {
    const root = rootRef.current;
    const handle = root?.querySelector<HTMLElement>(".before-after-handle");
    if (!root || !handle) return;

    let pressed = false;
    const setHover = (x: number, y: number) => {
      const rect = handle.getBoundingClientRect();
      const dx = x - (rect.left + rect.width / 2);
      const dy = y - (rect.top + rect.height / 2);
      // A little slack around the 48px circle so it's easy to find
      const near = Math.hypot(dx, dy) <= rect.width / 2 + 12;
      root.toggleAttribute("data-handle-hover", pressed || near);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setHover(event.clientX, event.clientY);
    };
    const onLeave = () => {
      if (!pressed) root.removeAttribute("data-handle-hover");
    };
    const onDown = () => {
      pressed = true;
      root.setAttribute("data-handle-pressed", "");
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    };
    const onUp = (event: PointerEvent) => {
      pressed = false;
      root.removeAttribute("data-handle-pressed");
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (event.pointerType === "mouse") setHover(event.clientX, event.clientY);
      else root.removeAttribute("data-handle-hover");
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onDown);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div className="before-after">
      <div className="project-banner before-after-frame">
        <div ref={rootRef} className="project-banner-media">
          <BeforeAfter
            beforeImage={before.src}
            afterImage={after.src}
            className="before-after-slider"
            buttonClassName="before-after-handle"
            onChange={(event) =>
              setCaptionKey(getCaptionKey(Number(event.target.value)))
            }
            style={{ width: "100%", cursor: "ew-resize" }}
            beforeStyle={{ borderRight: 0 }}
            buttonStyle={{
              // Inline from the library, so the handle's fill is set here, not in CSS
              backgroundColor: "var(--color-white)",
              width: 48,
              height: 48,
            }}
          />
        </div>
      </div>

      <div className="before-after-caption" aria-live="polite">
        {/* Every caption sits in the same cell, invisibly, so the longest one
            sets the height and swapping never shifts the content below */}
        {(Object.keys(captions) as CaptionKey[]).map((key) => (
          <p key={key} className="before-after-caption-line is-sizer" aria-hidden="true">
            {toWords(captions[key]).map((word, index) => (
              <span key={index} className="before-after-caption-word">
                {word.text}
              </span>
            ))}
          </p>
        ))}
        <AnimatePresence initial={false}>
          <motion.p
            key={captionKey}
            className="before-after-caption-line"
            variants={captionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {toWords(active).map((word, index) => (
              <motion.span
                key={index}
                className={
                  word.label
                    ? "before-after-caption-word before-after-caption-label"
                    : "before-after-caption-word"
                }
                variants={reduceMotion ? reducedWordVariants : wordVariants}
              >
                {word.text}
              </motion.span>
            ))}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
