"use client";

import { useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import Image from "next/image";
import type { PhotoBookSpread } from "@/data/photoBook";
import "@/components/WorkStamps/WorkStamps.css";
import "./PhotoDeck.css";

/** Share of the card width the front card must travel before it's sent to the back */
const SWIPE_THRESHOLD = 0.3;
/** Cards that peek out from behind the front one; the rest wait, hidden, below them */
const VISIBLE_CARDS = 3;

type Swipe = { pointerId: number; startX: number; dx: number };

/**
 * The photo book for phones, where a two-page spread doesn't fit: the photos
 * as a stack of stamp cards, photo on top and caption below, built from the
 * work stamps' paper. Swiping the front card sideways tucks it behind the
 * stack and brings the next one forward.
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

  const onPointerDown = (event: PointerEvent<HTMLLIElement>) => {
    swipe.current = { pointerId: event.pointerId, startX: event.clientX, dx: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLLIElement>) => {
    if (swipe.current?.pointerId !== event.pointerId) return;
    swipe.current.dx = event.clientX - swipe.current.startX;
    setDrag(event.currentTarget, swipe.current.dx);
  };

  const endSwipe = (event: PointerEvent<HTMLLIElement>) => {
    if (swipe.current?.pointerId !== event.pointerId) return;
    const el = event.currentTarget;
    const passed = Math.abs(swipe.current.dx) > el.offsetWidth * SWIPE_THRESHOLD;
    swipe.current = null;
    // Clearing the drag lets the card transition from where it was let go:
    // back to the front, or (with a lower z-index) behind the rest of the stack
    setDrag(el, null);
    if (passed && event.type === "pointerup") {
      setOrder((current) => [...current.slice(1), current[0]]);
    }
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
              className="work-stamp work-stamp--teal photo-deck-card"
              style={
                {
                  "--work-stamp-index": Math.min(position, peeking - 1),
                  zIndex: spreads.length - position,
                } as CSSProperties
              }
              data-behind={isFront ? undefined : ""}
              data-hidden={position >= peeking ? "" : undefined}
              aria-hidden={isFront ? undefined : true}
              onPointerDown={isFront ? onPointerDown : undefined}
              onPointerMove={isFront ? onPointerMove : undefined}
              onPointerUp={isFront ? endSwipe : undefined}
              onPointerCancel={isFront ? endSwipe : undefined}
            >
              <div className="work-stamp-paper">
                <div className="work-stamp-print photo-deck-print">
                  <div className="photo-deck-photo">
                    <Image
                      src={spread.image}
                      alt={spread.alt}
                      fill
                      sizes="266px"
                      draggable={false}
                    />
                  </div>
                  <p className="photo-deck-caption">{spread.caption}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
