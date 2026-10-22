"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ResumeHoverIcon } from "@/components/ResumeHoverIcon/ResumeHoverIcon";
import { SocialHoverLink } from "@/components/SocialHoverLink/SocialHoverLink";
import { footerLinks } from "@/data/home";
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
};

type FooterWord = {
  key: string;
  chars: FooterChar[];
};

function buildLines() {
  let letterIndex = 0;

  return LINES.map((line, lineIndex) => {
    // letters are grouped per word so a line only ever wraps between words
    const words: FooterWord[] = line.split(" ").map((word, wordIndex) => ({
      key: `${lineIndex}-${wordIndex}-${word}`,
      chars: Array.from(word).map((char, charIndex) => {
        const delay =
          letterIndex * (LETTER_DURATION + LETTER_GAP) + lineIndex * LINE_GAP;
        letterIndex += 1;

        return { key: `${charIndex}-${char}`, char, delay };
      }),
    }));

    return { key: `line-${lineIndex}`, words };
  });
}

const FOOTER_LINES = buildLines();

const MAX_LETTER_DELAY = Math.max(
  ...FOOTER_LINES.flatMap((line) =>
    line.words.flatMap((word) => word.chars.map((item) => item.delay)),
  ),
);

const TOTAL_ANIMATION_MS = (MAX_LETTER_DELAY + LETTER_DURATION) * 1000;

type AnimationPhase = "waiting" | "playing" | "done";

export function HomeFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const [animationDone, setAnimationDone] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const inView = useInView(footerRef, {
    once: true,
    amount: 0.4,
  });

  const animationPhase: AnimationPhase = animationDone
    ? "done"
    : inView
      ? "playing"
      : "waiting";

  useEffect(() => {
    if (animationPhase !== "playing") {
      return;
    }

    const timer = window.setTimeout(() => {
      setAnimationDone(true);
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
      <nav className="home-footer-links" aria-label="Social links and resume">
        {footerLinks.map((link, index) => {
          return (
            <Fragment key={link.id}>
              {index > 0 ? (
                <span className="home-footer-link-separator" aria-hidden="true">
                  /
                </span>
              ) : null}
              <SocialHoverLink
                className="home-footer-link"
                href={link.href}
                iconSrc={"iconSrc" in link ? link.iconSrc : undefined}
                icon={link.id === "resume" ? <ResumeHoverIcon /> : undefined}
              >
                {link.label}
              </SocialHoverLink>
            </Fragment>
          );
        })}
      </nav>
      <p className="home-footer-credit" aria-hidden="true">
        {FOOTER_LINES.map((line) => (
          <span key={line.key} className="home-footer-line">
            {line.words.map((word, wordIndex) => (
              <Fragment key={word.key}>
                {wordIndex > 0 ? " " : null}
                <span className="home-footer-word">
                  {word.chars.map((item) => (
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
                  ))}
                </span>
              </Fragment>
            ))}
          </span>
        ))}
      </p>
    </footer>
  );
}
