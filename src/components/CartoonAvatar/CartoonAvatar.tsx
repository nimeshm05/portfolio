"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { AVATAR_DROP_DELAY_MS } from "@/motion/pageEnter";
import "./CartoonAvatar.css";

type CartoonAvatarProps = {
  src: string;
  alt: string;
};

/**
 * Flat illustrated portrait in a round frame. Pops in at the same cue the jelly
 * used to drop on, and gives a small hop when clicked.
 */
export function CartoonAvatar({ src, alt }: CartoonAvatarProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [hopping, setHopping] = useState(false);

  const hop = () => {
    setHopping(false);
    requestAnimationFrame(() => setHopping(true));
  };

  return (
    <button
      type="button"
      className="cartoon-avatar"
      aria-label={alt}
      data-hopping={hopping}
      data-reduce-motion={reduceMotion}
      style={{ "--cartoon-avatar-delay": `${AVATAR_DROP_DELAY_MS}ms` } as React.CSSProperties}
      onClick={hop}
      onAnimationEnd={(event) => {
        if (event.animationName === "cartoon-avatar-hop") setHopping(false);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- small static SVG, no optimisation needed */}
      <img className="cartoon-avatar-image" src={src} alt="" draggable={false} />
    </button>
  );
}
