"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import "./HomeFooter.css";

const LINES = [
  "Crafted with precision and care by Nimesh.",
  "Thanks to cursor agents, figma, and my brain.",
] as const;

const FULL_CREDIT = LINES.join(" ");

const LETTER_DURATION = 0.08;
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

export function HomeFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const inView = useInView(footerRef, {
    once: true,
    amount: 0.4,
  });

  const reduceMotion = Boolean(prefersReducedMotion);

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
                  initial={
                    reduceMotion
                      ? { clipPath: "inset(0 0% 0 0)" }
                      : { clipPath: "inset(0 100% 0 0)" }
                  }
                  animate={
                    reduceMotion || inView
                      ? { clipPath: "inset(0 0% 0 0)" }
                      : { clipPath: "inset(0 100% 0 0)" }
                  }
                  transition={
                    reduceMotion || !inView
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
