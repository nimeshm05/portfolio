"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import "./HomeFooter.css";

const LINES = [
  "Crafted with care by nimesh.",
  "Thanks to cursor agents, figma mcp, and to a few neurons in my brain :)",
] as const;

const FULL_CREDIT = LINES.join(" ");

const LETTER_DURATION = 0.05;
const LETTER_GAP = 0.012;
const LINE_GAP = 0.08;

type FooterChar = {
  key: string;
  char: string;
  delay: number;
  isSpace: boolean;
};

function buildLines() {
  let letterIndex = 0;

  return LINES.map((line, lineIndex) => {
    const chars: FooterChar[] = Array.from(line).map((char, charIndex) => {
      const isSpace = char === " ";
      const delay =
        letterIndex * (LETTER_DURATION + LETTER_GAP) + lineIndex * LINE_GAP;

      if (!isSpace) {
        letterIndex += 1;
      }

      return {
        key: `${lineIndex}-${charIndex}-${char}`,
        char: isSpace ? "\u00A0" : char,
        delay,
        isSpace,
      };
    });

    return { key: `line-${lineIndex}`, chars };
  });
}

const FOOTER_LINES = buildLines();

const MAX_LETTER_DELAY = Math.max(
  ...FOOTER_LINES.flatMap((line) =>
    line.chars.filter((item) => !item.isSpace).map((item) => item.delay),
  ),
);

const TOTAL_ANIMATION_MS = (MAX_LETTER_DELAY + LETTER_DURATION) * 1000;

type AnimationPhase = "waiting" | "playing" | "done";

export function HomeFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("waiting");
  const prefersReducedMotion = useReducedMotion();
  const inView = useInView(footerRef, {
    once: true,
    amount: 0.4,
  });

  useEffect(() => {
    if (inView && animationPhase === "waiting") {
      setAnimationPhase("playing");
    }
  }, [inView, animationPhase]);

  useEffect(() => {
    if (animationPhase !== "playing") {
      return;
    }

    const timer = window.setTimeout(() => {
      setAnimationPhase("done");
    }, TOTAL_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, [animationPhase]);

  const reduceMotion = Boolean(prefersReducedMotion);
  const revealed =
    reduceMotion || animationPhase === "playing" || animationPhase === "done";

  return (
    <footer
      ref={footerRef}
      className="home-footer"
      aria-label={FULL_CREDIT}
    >
      <p className="home-footer-credit" aria-hidden="true">
        {FOOTER_LINES.map((line) => (
          <span key={line.key} className="home-footer-line">
            {line.chars.map((item) => {
              if (item.isSpace) {
                return (
                  <span key={item.key} className="home-footer-space">
                    {item.char}
                  </span>
                );
              }

              return (
                <motion.span
                  key={item.key}
                  className="home-footer-letter"
                  initial={false}
                  animate={
                    revealed
                      ? { clipPath: "inset(-0.2em 0% -0.25em 0)" }
                      : { clipPath: "inset(-0.2em 100% -0.25em 0)" }
                  }
                  transition={
                    reduceMotion || animationPhase !== "playing"
                      ? { duration: 0 }
                      : {
                          duration: LETTER_DURATION,
                          delay: item.delay,
                          ease: "easeOut",
                        }
                  }
                >
                  {item.char}
                </motion.span>
              );
            })}
          </span>
        ))}
      </p>
    </footer>
  );
}
