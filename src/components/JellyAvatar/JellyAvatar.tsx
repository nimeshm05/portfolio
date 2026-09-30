"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import type { JellyEngine } from "./jellyEngine";
import "./JellyAvatar.css";

type JellyAvatarProps = {
  src: string;
  alt: string;
};

/** Pixels the pointer must travel before a press becomes a pull instead of a jump. */
const DRAG_THRESHOLD_PX = 4;

/**
 * Profile photo as a soft octagon jelly: pull it and it stretches, let go and it
 * springs home, click (or Enter / Space) and it jumps. Falls back to a still
 * octagon photo without WebGL 2 or with reduced motion.
 */
export function JellyAvatar({ src, alt }: JellyAvatarProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<JellyEngine | null>(null);
  const pressRef = useRef<{ id: number; x: number; y: number; pulling: boolean } | null>(null);
  const [ready, setReady] = useState(false);
  const [hopping, setHopping] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const button = buttonRef.current;
    if (reduceMotion || !canvas || !button) return;

    let cancelled = false;
    let engine: JellyEngine | null = null;
    let observer: IntersectionObserver | null = null;
    const onResize = () => engine?.resize();
    const onVisibility = () => engine?.setVisible(document.visibilityState === "visible");

    import("./jellyEngine").then(({ JellyEngine: Engine }) => {
      if (cancelled) return;
      try {
        engine = new Engine({
          canvas,
          imageSrc: src,
          boxPx: button.clientWidth,
          onReady: () => !cancelled && setReady(true),
          onError: () => !cancelled && setReady(false),
        });
      } catch {
        return; // no WebGL 2: the still photo stays
      }
      engineRef.current = engine;
      observer = new IntersectionObserver(([entry]) => engine?.setVisible(entry.isIntersecting));
      observer.observe(button);
      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onVisibility);
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      engine?.destroy();
      engineRef.current = null;
    };
  }, [src, reduceMotion]);

  const live = ready && !reduceMotion;

  const hop = () => {
    if (!live || !engineRef.current) {
      setHopping(false);
      requestAnimationFrame(() => setHopping(true));
      return;
    }
    engineRef.current.jump();
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const engine = engineRef.current;
    pressRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, pulling: false };
    if (engine && live && engine.grabAt(event.clientX, event.clientY)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const press = pressRef.current;
    if (!press || press.id !== event.pointerId) return;
    if (!press.pulling && Math.hypot(event.clientX - press.x, event.clientY - press.y) > DRAG_THRESHOLD_PX) {
      press.pulling = true;
    }
    if (press.pulling) engineRef.current?.dragTo(event.clientX, event.clientY);
  };

  const endPress = (event: PointerEvent<HTMLButtonElement>, cancelled: boolean) => {
    const press = pressRef.current;
    if (!press || press.id !== event.pointerId) return;
    pressRef.current = null;
    engineRef.current?.release();
    if (!press.pulling && !cancelled) hop();
  };

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => endPress(event, false);
  const onPointerCancel = (event: PointerEvent<HTMLButtonElement>) => endPress(event, true);

  // Pointer presses are handled above; this only catches keyboard activation (Enter / Space).
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) hop();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " ") event.preventDefault(); // keep Space from scrolling the page
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className="jelly-avatar"
      data-ready={live}
      data-hopping={hopping}
      aria-label={`${alt}. Press to make it jump.`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onAnimationEnd={() => setHopping(false)}
    >
      <Image className="jelly-avatar-still" src={src} alt="" width={80} height={80} priority draggable={false} />
      <canvas ref={canvasRef} className="jelly-avatar-canvas" aria-hidden="true" />
    </button>
  );
}
