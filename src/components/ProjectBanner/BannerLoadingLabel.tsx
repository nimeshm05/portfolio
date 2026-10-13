"use client";

import { useEffect, useState, type CSSProperties } from "react";

const MESSAGES = [
  "Herding the frames",
  "Bribing the pixels",
  "Microwaving the render",
  "Convincing the codec",
] as const;

/** How long each message stays before the next one takes over */
const MESSAGE_HOLD_MS = 2200;

type BannerLoadingLabelProps = {
  /** Rotate messages only while the placeholder is visible */
  isActive: boolean;
};

/** Rotating caption under the placeholder; words blur in and out in a stagger */
export function BannerLoadingLabel({ isActive }: BannerLoadingLabelProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (
      !isActive ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const interval = window.setInterval(
      () => setStep((current) => current + 1),
      MESSAGE_HOLD_MS,
    );

    return () => window.clearInterval(interval);
  }, [isActive]);

  // The outgoing message stays mounted so its words can stagger out
  const visibleSteps = step === 0 ? [step] : [step - 1, step];

  return (
    <div className="banner-video-placeholder-label">
      {visibleSteps.map((messageStep) => (
        <span
          key={messageStep}
          className={`banner-video-placeholder-message ${
            messageStep === step ? "is-in" : "is-out"
          }`}
        >
          {MESSAGES[messageStep % MESSAGES.length]
            .split(" ")
            .map((word, index) => (
              <span
                key={index}
                className="banner-video-placeholder-word"
                style={{ "--word-index": index } as CSSProperties}
              >
                {word}
              </span>
            ))}
        </span>
      ))}
    </div>
  );
}
