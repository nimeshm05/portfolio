"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Transition, type Variants } from "motion/react";
import type { PhotoBookSpread } from "@/data/photoBook";
import { pauseInline, playInline } from "@/components/InViewVideo/playInline";
import "@/components/WorkStamps/WorkStamps.css";
import "./PhotoDeck.css";

/** Share of the card width the front card must travel before it's sent to the back */
const SWIPE_THRESHOLD = 0.3;
/** Travel (px) under which a touch counts as a tap, which opens the card */
const TAP_SLOP = 6;
/** Cards that peek out from behind the front one; the rest wait, hidden, below them */
const VISIBLE_CARDS = 3;

type Swipe = { pointerId: number; startX: number; dx: number };

type Rect = { left: number; top: number; width: number; height: number };

type Opened = { index: number; rect: Rect };

const toRect = ({ left, top, width, height }: DOMRect): Rect => ({ left, top, width, height });

/**
 * The photo book for phones, where a two-page spread doesn't fit: the photos
 * as a stack of stamp cards, photo on top and caption below, built from the
 * work stamps' paper. Swiping the front card sideways tucks it behind the
 * stack and brings the next one forward; tapping it lifts it into the middle
 * of the screen, larger, the way an open work stamp does.
 */
export function PhotoDeck({
  title,
  spreads,
}: {
  title: string;
  spreads: readonly PhotoBookSpread[];
}) {
  // order[position] = spread index; position 0 is the front of the stack
  const [order, setOrder] = useState(() => spreads.map((_, index) => index));
  const swipe = useRef<Swipe | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  // `opened` drives the open card; `lifted` hides its slot until it has flown back
  const [opened, setOpened] = useState<Opened | null>(null);
  const [lifted, setLifted] = useState<number | null>(null);
  // Where the closing card flies back to: its slot as it is at close time
  const [returnRect, setReturnRect] = useState<Rect | null>(null);
  const peeking = Math.min(spreads.length, VISIBLE_CARDS);

  const setDrag = (el: HTMLElement, dx: number | null) => {
    if (dx === null) {
      el.removeAttribute("data-dragging");
      el.style.removeProperty("--work-stamp-drag");
      el.style.removeProperty("--work-stamp-drag-progress");
      return;
    }
    el.setAttribute("data-dragging", "");
    el.style.setProperty("--work-stamp-drag", `${dx}px`);
    el.style.setProperty(
      "--work-stamp-drag-progress",
      `${Math.max(-1, Math.min(1, dx / el.offsetWidth))}`,
    );
  };

  const open = (index: number) => {
    const item = itemRefs.current[index];
    if (!item) return;
    setReturnRect(null);
    setOpened({ index, rect: toRect(item.getBoundingClientRect()) });
    setLifted(index);
  };

  const close = useCallback(() => {
    if (!opened) return;
    const item = itemRefs.current[opened.index];
    setReturnRect(item ? toRect(item.getBoundingClientRect()) : opened.rect);
    setOpened(null);
  }, [opened]);

  const onPointerDown = (event: PointerEvent<HTMLLIElement>) => {
    swipe.current = { pointerId: event.pointerId, startX: event.clientX, dx: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLLIElement>) => {
    if (swipe.current?.pointerId !== event.pointerId) return;
    swipe.current.dx = event.clientX - swipe.current.startX;
    // Below the tap slop it's still a tap, so the card stays put
    if (Math.abs(swipe.current.dx) > TAP_SLOP) {
      setDrag(event.currentTarget, swipe.current.dx);
    }
  };

  const endSwipe = (event: PointerEvent<HTMLLIElement>, index: number) => {
    if (swipe.current?.pointerId !== event.pointerId) return;
    const el = event.currentTarget;
    const { dx } = swipe.current;
    swipe.current = null;
    // Clearing the drag lets the card transition from where it was let go:
    // back to the front, or (with a lower z-index) behind the rest of the stack
    setDrag(el, null);
    if (event.type !== "pointerup") return;
    if (Math.abs(dx) <= TAP_SLOP) {
      open(index);
    } else if (Math.abs(dx) > el.offsetWidth * SWIPE_THRESHOLD) {
      setOrder((current) => [...current.slice(1), current[0]]);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLLIElement>, index: number) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    open(index);
  };

  return (
    <div className="work-stamps-frame photo-deck-frame">
      <ul
        className="work-stamps photo-deck"
        aria-label={title.replace(/\n/g, " ")}
        style={{ "--work-stamp-count": peeking } as CSSProperties}
      >
        {spreads.map((spread, index) => {
          const position = order.indexOf(index);
          const isFront = position === 0;
          return (
            <li
              key={spread.image}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="work-stamp work-stamp--teal photo-deck-card"
              style={
                {
                  "--work-stamp-index": Math.min(position, peeking - 1),
                  zIndex: spreads.length - position,
                } as CSSProperties
              }
              data-behind={isFront ? undefined : ""}
              data-hidden={position >= peeking ? "" : undefined}
              data-lifted={lifted === index ? "" : undefined}
              aria-hidden={isFront ? undefined : true}
              role={isFront ? "button" : undefined}
              tabIndex={isFront ? 0 : undefined}
              aria-label={isFront ? `View photo: ${spread.alt}` : undefined}
              aria-haspopup={isFront ? "dialog" : undefined}
              onKeyDown={isFront ? (event) => onKeyDown(event, index) : undefined}
              onPointerDown={isFront ? onPointerDown : undefined}
              onPointerMove={isFront ? onPointerMove : undefined}
              onPointerUp={isFront ? (event) => endSwipe(event, index) : undefined}
              onPointerCancel={isFront ? (event) => endSwipe(event, index) : undefined}
            >
              <PhotoCardFace spread={spread} playing={isFront && lifted !== index} />
            </li>
          );
        })}
      </ul>
      <OpenPhoto
        spreads={spreads}
        opened={opened}
        returnRect={returnRect}
        onClose={close}
        onClosed={() => {
          const item = lifted === null ? null : itemRefs.current[lifted];
          setLifted(null);
          requestAnimationFrame(() => item?.focus({ preventScroll: true }));
        }}
      />
    </div>
  );
}

/** One size for the deck and the open card, so opening reuses the loaded file
    instead of fetching a new one (it covers the open card on 3x phones too) */
const PHOTO_SIZES = "340px";

function PhotoCardFace({ spread, playing }: { spread: PhotoBookSpread; playing: boolean }) {
  return (
    <div className="work-stamp-paper">
      <div className="work-stamp-print photo-deck-print">
        <div className="photo-deck-photo">
          <Image src={spread.image} alt={spread.alt} fill sizes={PHOTO_SIZES} draggable={false} />
          {spread.video ? <DeckVideo src={spread.video} playing={playing} /> : null}
        </div>
        <p className="photo-deck-caption">{spread.caption}</p>
      </div>
    </div>
  );
}

/**
 * A spread's clip, laid over its still: it loads once its card first reaches
 * the front, plays while that card is at the front and on screen, and fades
 * in over the still once it's actually running.
 */
function DeckVideo({ src, playing }: { src: string; playing: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(playing);
  const [inView, setInView] = useState(false);
  const [running, setRunning] = useState(false);

  if (playing && !loaded) setLoaded(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !loaded) return;
    if (playing && inView) playInline(video);
    else pauseInline(video);
  }, [loaded, playing, inView]);

  return (
    <video
      ref={videoRef}
      className="photo-deck-video"
      src={loaded ? src : undefined}
      data-running={running ? "" : undefined}
      aria-hidden="true"
      loop
      muted
      playsInline
      preload="none"
      onPlaying={() => setRunning(true)}
    />
  );
}

/* ---------- Open card ----------
   The same springs and backdrop as an open work stamp: the card's real box
   animates from its slot to the middle of the screen, keeping its shape. */

const OPEN_TRANSITION: Transition = { type: "spring", duration: 0.55, bounce: 0.2 };
const CLOSE_TRANSITION: Transition = { type: "spring", duration: 0.45, bounce: 0 };
const BACKDROP_TRANSITION: Transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };
const INSTANT: Transition = { duration: 0 };

/** Share of the screen the open card may take, and the perforation step it snaps to */
const VIEWPORT_SHARE = { width: 0.92, height: 0.84 };
const PERF_STEP = 14;

function OpenPhoto({
  spreads,
  opened,
  returnRect,
  onClose,
  onClosed,
}: {
  spreads: readonly PhotoBookSpread[];
  opened: Opened | null;
  returnRect: Rect | null;
  onClose: () => void;
  onClosed: () => void;
}) {
  const reduceMotion = Boolean(useReducedMotion());

  return typeof document === "undefined"
    ? null
    : createPortal(
        <AnimatePresence custom={returnRect ?? undefined} onExitComplete={onClosed}>
          {opened ? (
            <motion.div
              key="backdrop"
              className="work-stamp-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? INSTANT : BACKDROP_TRANSITION}
              onClick={onClose}
            />
          ) : null}
          {opened ? (
            <OpenCard
              key={`card-${opened.index}`}
              spread={spreads[opened.index]}
              origin={opened.rect}
              reduceMotion={reduceMotion}
              onClose={onClose}
            />
          ) : null}
        </AnimatePresence>,
        document.body,
      );
}

function OpenCard({
  spread,
  origin,
  reduceMotion,
  onClose,
}: {
  spread: PhotoBookSpread;
  origin: Rect;
  reduceMotion: boolean;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<Rect | null>(null);

  // Grow the card in its own shape to fit the screen, snapped to the perforation step
  useEffect(() => {
    const measure = () => {
      const ratio = origin.width / origin.height;
      const snap = (value: number) => Math.floor(value / PERF_STEP) * PERF_STEP;
      let width = window.innerWidth * VIEWPORT_SHARE.width;
      let height = width / ratio;
      const maxHeight = window.innerHeight * VIEWPORT_SHARE.height;
      if (height > maxHeight) {
        height = maxHeight;
        width = height * ratio;
      }
      width = snap(width);
      height = snap(height);
      setTarget({
        width,
        height,
        left: (window.innerWidth - width) / 2,
        top: (window.innerHeight - height) / 2,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [origin.width, origin.height]);

  useEffect(() => {
    cardRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const variants: Variants = {
    // `rect` is the slot: the origin when opening, the live slot when closing
    collapsed: (rect: Rect | undefined) => ({
      ...(rect ?? origin),
      "--work-stamp-expand": 0,
      transition: reduceMotion ? INSTANT : CLOSE_TRANSITION,
    }),
  };
  if (target) {
    variants.expanded = {
      ...target,
      "--work-stamp-expand": 1,
      transition: reduceMotion ? INSTANT : OPEN_TRANSITION,
    };
  }

  return (
    <motion.div
      ref={cardRef}
      role="dialog"
      aria-modal="true"
      aria-label={spread.alt}
      tabIndex={-1}
      className="work-stamp-expanded work-stamp--teal photo-deck-open"
      custom={origin}
      variants={variants}
      initial="collapsed"
      animate={target ? "expanded" : "collapsed"}
      exit="collapsed"
      onClick={onClose}
    >
      <PhotoCardFace spread={spread} playing />
    </motion.div>
  );
}
