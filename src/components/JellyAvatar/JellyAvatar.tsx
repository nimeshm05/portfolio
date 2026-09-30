"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { AVATAR_DROP_DELAY_MS } from "@/motion/pageEnter";
import type { JellyEngine } from "./jellyEngine";
import "./JellyAvatar.css";

type JellyAvatarProps = {
  src: string;
  alt: string;
};

/** Pixels the pointer must travel before a press becomes a pull instead of a jump. */
const DRAG_THRESHOLD_PX = 4;
/** How long past the drop cue to wait for the jelly before showing the still photo instead. */
const LOAD_GRACE_MS = 700;
/** How long the canvas stays stretched up to the viewport's top edge while the jelly falls in and settles. */
const DROP_MS = 2400;

/** hidden until the page's text has mostly entered; then the jelly, or the still photo as a fallback. */
type View = "hidden" | "still" | "jelly";

/**
 * Profile photo as a soft round jelly: pull it and it stretches, let go and it
 * springs home, click (or Enter / Space) and it jumps. It drops in once the
 * page's text has mostly entered. Falls back to a still round photo without
 * WebGL 2, with reduced motion, if loading is slow, or if the GPU context is lost.
 */
export function JellyAvatar({ src, alt }: JellyAvatarProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<JellyEngine | null>(null);
  const pressRef = useRef<{ id: number; x: number; y: number; pulling: boolean } | null>(null);
  const enteredRef = useRef(false); // survives effect re-runs so the entrance plays once
  const [view, setView] = useState<View>("hidden");
  const [hopping, setHopping] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const button = buttonRef.current;
    if (!canvas || !button) return;

    let cancelled = false;
    let Engine: typeof JellyEngine | null = null;
    let engine: JellyEngine | null = null;
    let observer: IntersectionObserver | null = null;
    let ready = false;
    let failed = reduceMotion;
    const reentry = enteredRef.current; // effect re-ran after the entrance (e.g. motion preference changed)
    let shown: View = reentry ? "still" : "hidden";
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    const show = (next: View) => {
      if (cancelled) return;
      shown = next;
      setView(next);
    };

    const showJelly = () => {
      // first appearance falls in from above; after a fallback it just cross-fades in place
      if (shown === "hidden" && engine) {
        // reach the canvas up to the top of the viewport so it falls from off-screen, not out of thin air
        const room = Math.round(button.getBoundingClientRect().top);
        if (room > 0) button.style.setProperty("--jelly-overflow-top", `${room}px`);
        engine.resize();
        engine.dropIn();
        later(() => {
          button.style.removeProperty("--jelly-overflow-top");
          engine?.resize();
        }, DROP_MS);
      }
      show("jelly");
    };

    const enter = () => {
      enteredRef.current = true;
      if (failed) show("still");
      else if (ready) showJelly();
      else if (reentry) show("still");
      else later(() => shown === "hidden" && show("still"), LOAD_GRACE_MS); // slow load: don't leave a hole
    };

    const fail = () => {
      ready = false;
      failed = true;
      if (enteredRef.current) show("still");
    };

    const start = () => {
      if (!Engine || cancelled) return;
      try {
        engine = new Engine({
          canvas,
          imageSrc: src,
          boxPx: button.clientWidth,
          onReady: () => {
            if (cancelled) return;
            ready = true;
            failed = false;
            if (enteredRef.current) showJelly();
          },
          onError: fail,
        });
      } catch {
        fail(); // no WebGL 2: the still photo stays
        return;
      }
      engineRef.current = engine;
    };

    // Mobile browsers may reclaim the GPU context (backgrounded tab, memory pressure).
    // Show the still photo meanwhile and rebuild the jelly if the context comes back.
    const onContextLost = (event: Event) => {
      event.preventDefault(); // allows webglcontextrestored to fire
      engine?.destroy();
      engine = engineRef.current = null;
      fail();
    };
    const onContextRestored = () => start();
    const onResize = () => engine?.resize();
    const onVisibility = () => engine?.setVisible(document.visibilityState === "visible");

    later(enter, reentry || reduceMotion ? 0 : AVATAR_DROP_DELAY_MS);

    if (!reduceMotion) {
      import("./jellyEngine")
        .then(({ JellyEngine: loaded }) => {
          if (cancelled) return;
          Engine = loaded;
          start();
          observer = new IntersectionObserver(([entry]) => engine?.setVisible(entry.isIntersecting));
          observer.observe(button);
          canvas.addEventListener("webglcontextlost", onContextLost);
          canvas.addEventListener("webglcontextrestored", onContextRestored);
          window.addEventListener("resize", onResize);
          document.addEventListener("visibilitychange", onVisibility);
        })
        .catch(fail); // chunk failed to load
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      observer?.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      engine?.destroy();
      engineRef.current = null;
    };
  }, [src, reduceMotion]);

  const live = view === "jelly";

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
      data-view={view}
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
