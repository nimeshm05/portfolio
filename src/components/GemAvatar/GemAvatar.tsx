"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { useReducedMotion } from "motion/react";
import { AVATAR_DROP_DELAY_MS } from "@/motion/pageEnter";
import {
  BODY_R,
  EYE_PATH,
  GemMotion,
  REST_FRAME,
  bodyTransform,
  eyeTransform,
  shadowScale,
  type GemFrame,
} from "./gemMotion";
import "./GemAvatar.css";

type GemAvatarProps = {
  label: string;
};

/** hidden until the page's text has mostly entered, then it drops in. */
type View = "hidden" | "shown";

const SHADOW_RX = 74;
const SHADOW_RY = 11;
const SHADOW_Y = BODY_R + 6;

const restL = eyeTransform(-1, REST_FRAME);
const restR = eyeTransform(1, REST_FRAME);

/**
 * Avatar as a little green glass gem with a face: it looks towards the pointer,
 * blinks, winks, glances around, spins round with a hop and bounces when
 * pressed. It drops in once the page's text has mostly entered. With reduced
 * motion it sits still, facing forward.
 */
export function GemAvatar({ label }: GemAvatarProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const id = useId().replace(/:/g, "");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const eyeLRef = useRef<SVGPathElement>(null);
  const eyeRRef = useRef<SVGPathElement>(null);
  const shadowRef = useRef<SVGGElement>(null);
  const motionRef = useRef<GemMotion | null>(null);
  const pressRef = useRef<number | null>(null);
  const enteredRef = useRef(false); // survives effect re-runs so the entrance plays once
  const [view, setView] = useState<View>("hidden");

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    if (reduceMotion) {
      enteredRef.current = true;
      return;
    }

    const paint = (f: GemFrame) => {
      bodyRef.current?.setAttribute("transform", bodyTransform(f));
      for (const [ref, side] of [[eyeLRef, -1], [eyeRRef, 1]] as const) {
        const eye = eyeTransform(side, f);
        ref.current?.setAttribute("transform", eye.matrix);
        ref.current?.setAttribute("opacity", eye.opacity.toFixed(3));
      }
      const s = shadowScale(f);
      shadowRef.current?.setAttribute("transform", `translate(0 ${SHADOW_Y}) scale(${(s * (1 + f.squash * 0.9)).toFixed(4)} ${s.toFixed(4)})`);
      shadowRef.current?.setAttribute("opacity", (s * s).toFixed(3));
    };

    const motion = new GemMotion(paint);
    motionRef.current = motion;
    let timer = 0;

    const enter = () => {
      const reentry = enteredRef.current;
      enteredRef.current = true;
      // fall from just above the viewport's top edge so it never appears out of thin air
      const unitsPerPx = (2 * BODY_R) / button.clientWidth;
      const fromTop = button.getBoundingClientRect().bottom;
      const dropFrom = reentry || fromTop <= 0 ? 0 : fromTop * unitsPerPx;
      paint({ ...REST_FRAME, y: -dropFrom });
      setView("shown");
      motion.start(dropFrom);
    };
    if (enteredRef.current) enter();
    else timer = window.setTimeout(enter, AVATAR_DROP_DELAY_MS);

    const onPointerMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = button.getBoundingClientRect();
      motion.lookAtPointer(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2));
    };
    const onPointerLeave = () => motion.forgetPointer();
    const onVisibility = () => motion.setVisible(document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => motion.setVisible(entry.isIntersecting));
    observer.observe(button);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      motion.destroy();
      motionRef.current = null;
    };
  }, [reduceMotion]);

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    pressRef.current = event.pointerId;
    motionRef.current?.press();
  };

  const endPress = (event: PointerEvent<HTMLButtonElement>, activate: boolean) => {
    if (pressRef.current !== event.pointerId) return;
    pressRef.current = null;
    motionRef.current?.release(activate);
  };

  // Pointer presses are handled above; this only catches keyboard activation (Enter / Space).
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) motionRef.current?.release();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " ") event.preventDefault(); // keep Space from scrolling the page
  };

  const ref = (name: string) => `gem-${name}-${id}`;
  const url = (name: string) => `url(#${ref(name)})`;

  return (
    <button
      ref={buttonRef}
      type="button"
      className="gem-avatar"
      data-view={reduceMotion ? "shown" : view}
      aria-label={`${label}. Press to make it bounce.`}
      onPointerDown={onPointerDown}
      onPointerUp={(event) => endPress(event, true)}
      onPointerCancel={(event) => endPress(event, false)}
      onPointerLeave={(event) => endPress(event, false)}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <svg className="gem-avatar-svg" viewBox="-100 -100 200 200" aria-hidden="true" focusable="false">
        <defs>
          {/* light comes from the upper left, gathers inside and spills out lower right */}
          <radialGradient id={ref("body")} cx="0.6" cy="0.68" r="0.72">
            <stop offset="0" stopColor="var(--gem-glow)" />
            <stop offset="0.38" stopColor="var(--gem-light)" />
            <stop offset="0.78" stopColor="var(--gem-mid)" />
            <stop offset="1" stopColor="var(--gem-deep)" />
          </radialGradient>
          <radialGradient id={ref("rim")} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.72" stopColor="var(--gem-edge)" stopOpacity="0" />
            <stop offset="0.93" stopColor="var(--gem-edge)" stopOpacity="0.45" />
            <stop offset="1" stopColor="var(--gem-edge)" stopOpacity="0.8" />
          </radialGradient>
          <radialGradient id={ref("swirl")} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--gem-glow)" stopOpacity="0.75" />
            <stop offset="1" stopColor="var(--gem-glow)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ref("shine")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={ref("shadow")} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--gem-shadow)" stopOpacity="1" />
            <stop offset="1" stopColor="var(--gem-shadow)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ref("caustic")} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--gem-caustic)" stopOpacity="0.9" />
            <stop offset="1" stopColor="var(--gem-caustic)" stopOpacity="0" />
          </radialGradient>
          <clipPath id={ref("clip")}>
            <circle r={BODY_R} />
          </clipPath>
        </defs>

        <g ref={shadowRef} transform={`translate(0 ${SHADOW_Y})`}>
          <ellipse rx={SHADOW_RX} ry={SHADOW_RY} fill={url("shadow")} />
          {/* green light the glass throws onto the ground */}
          <ellipse cx={26} cy={3} rx={46} ry={9} fill={url("caustic")} />
        </g>

        <g ref={bodyRef} transform={bodyTransform(REST_FRAME)}>
          <circle r={BODY_R} fill={url("body")} />
          <g clipPath={url("clip")}>
            {/* refraction inside the glass */}
            <ellipse cx={-14} cy={30} rx={58} ry={34} transform="rotate(-24 -14 30)" fill={url("swirl")} opacity={0.55} />
            <path d="M-70 18 C-40 -6 6 -2 30 34 C10 18 -30 14 -70 40 Z" fill="var(--gem-glow)" opacity={0.28} />
            <circle r={BODY_R} fill={url("rim")} />
            {/* light leaving the glass along the lower right edge */}
            <path d="M86 30 A88 88 0 0 1 24 86" fill="none" stroke="var(--gem-glow)" strokeWidth={7} strokeLinecap="round" opacity={0.5} />
            {/* window reflection along the upper right rim */}
            <path d="M40 -86 A92 92 0 0 1 90 -24 L78 -22 A80 80 0 0 0 34 -74 Z" fill="var(--gem-edge)" opacity={0.35} />
            <path ref={eyeLRef} d={EYE_PATH} transform={restL.matrix} opacity={restL.opacity} fill="var(--gem-eye)" />
            <path ref={eyeRRef} d={EYE_PATH} transform={restR.matrix} opacity={restR.opacity} fill="var(--gem-eye)" />
          </g>
          {/* specular: a soft crescent on the upper left and a sharp glint */}
          <path d="M-84 -30 A88 88 0 0 1 -30 -84 A96 96 0 0 0 -74 -50 A96 96 0 0 0 -84 -30 Z" fill={url("shine")} />
          <ellipse cx={-50} cy={-56} rx={10} ry={6} transform="rotate(-40 -50 -56)" fill="#fff" opacity={0.9} />
          <circle cx={62} cy={58} r={4} fill="#fff" opacity={0.55} />
        </g>
      </svg>
    </button>
  );
}
