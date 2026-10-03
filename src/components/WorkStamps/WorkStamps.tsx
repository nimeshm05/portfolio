"use client";

import { useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import type { WorkStampData, WorkStampEmblem } from "@/data/home";
import "./WorkStamps.css";

type WorkStampsProps = {
  stamps: readonly WorkStampData[];
};

/** Share of the stamp width the front stamp must travel before it's sent to the back */
const SWIPE_THRESHOLD = 0.3;

type Swipe = { pointerId: number; startX: number; dx: number };

/**
 * A stack of postage stamps, one per role. Stacked by default; hovering (or
 * focusing) the stack fans the stamps out into a row and plays each pattern.
 * On touch, the front stamp can be swiped sideways and tucks behind the stack.
 */
export function WorkStamps({ stamps }: WorkStampsProps) {
  // order[position] = stamp index; position 0 is the front of the stack
  const [order, setOrder] = useState(() => stamps.map((_, index) => index));
  const swipe = useRef<Swipe | null>(null);

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
    if (event.pointerType === "mouse") return;
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
    // Clearing the drag lets the stamp transition from where it was let go:
    // back to the front, or (with a lower z-index) behind the rest of the stack.
    setDrag(el, null);
    if (passed && event.type === "pointerup") {
      setOrder((current) => [...current.slice(1), current[0]]);
    }
  };

  return (
    <ul
      className="work-stamps"
      aria-label="Experience"
      tabIndex={0}
      style={{ "--work-stamp-count": stamps.length } as CSSProperties}
    >
      {stamps.map((stamp, index) => {
        const position = order.indexOf(index);
        const isFront = position === 0;
        return (
          <li
            key={stamp.id}
            className={`work-stamp work-stamp--${stamp.tone}`}
            style={{ "--work-stamp-index": position } as CSSProperties}
            onPointerDown={isFront ? onPointerDown : undefined}
            onPointerMove={isFront ? onPointerMove : undefined}
            onPointerUp={isFront ? endSwipe : undefined}
            onPointerCancel={isFront ? endSwipe : undefined}
          >
            <div className="work-stamp-paper">
              <div className="work-stamp-print">
                <div className="work-stamp-panel">
                  <StampPattern emblem={stamp.emblem} />
                </div>
                <div className="work-stamp-copy">
                  <p className="work-stamp-name">{stamp.company}</p>
                  <div className="work-stamp-meta">
                    <p>{stamp.role}</p>
                    <p>{stamp.dates}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Panel patterns ----------
   Abstract, generative fills that run edge to edge across the 72×96 panel. Shapes
   come from a seeded generator, so server and client render the same SVG. */

const PANEL_W = 72;
const PANEL_H = 96;

function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function StampPattern({ emblem }: { emblem: WorkStampEmblem }) {
  return (
    <svg
      className={`work-stamp-pattern work-stamp-pattern--${emblem}`}
      viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {emblem === "drafting" ? <DraftingPattern /> : null}
      {emblem === "ripple" ? <RipplePattern /> : null}
      {emblem === "tiles" ? <TilesPattern /> : null}
    </svg>
  );
}

/** Knool: rows of text-like bars that re-type themselves in a slow ripple */
function DraftingPattern() {
  const rand = seeded(7);
  const rows = [];
  const count = 16;
  const bar = 1.5;
  for (let row = 0; row < count; row += 1) {
    const y = row * ((PANEL_H - bar) / (count - 1));
    const first = 18 + rand() * 30;
    const hasSecond = rand() > 0.45;
    const second = hasSecond ? 6 + rand() * (PANEL_W - first - 4 - 6) : 0;
    rows.push(
      <g
        key={row}
        className="pattern-draft-row"
        style={{ "--pattern-delay": `${row * 0.09}s` } as CSSProperties}
      >
        <rect x={0} y={y} width={first} height={bar} rx={bar / 2} />
        {hasSecond ? (
          <rect x={first + 4} y={y} width={Math.max(second, 4)} height={bar} rx={bar / 2} />
        ) : null}
      </g>,
    );
  }
  return <g fill="currentColor">{rows}</g>;
}

/** RozieAI: a dot matrix whose dots swell outward from the centre, like a voice */
function RipplePattern() {
  const cols = 7;
  const rows = 10;
  const cx = PANEL_W / 2;
  const cy = PANEL_H / 2;
  const dots = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const x = 2 + c * ((PANEL_W - 4) / (cols - 1));
      const y = 2 + r * ((PANEL_H - 4) / (rows - 1));
      const distance = Math.hypot(x - cx, y - cy);
      const radius = Math.max(1.1, 3.4 - distance / 18);
      dots.push(
        <circle
          key={`${r}-${c}`}
          className="pattern-ripple-dot"
          cx={x}
          cy={y}
          r={radius}
          style={{ "--pattern-delay": `${(distance / 40).toFixed(2)}s` } as CSSProperties}
        />,
      );
    }
  }
  return <g fill="currentColor">{dots}</g>;
}

/** Brane: three columns of layout tiles drifting upward at different speeds */
function TilesPattern() {
  const rand = seeded(21);
  const gap = 4;
  const columnWidth = (PANEL_W - gap * 2) / 3;
  const columns = [0, 1, 2].map((i) => i * (columnWidth + gap));
  return (
    <g fill="none" stroke="currentColor" strokeWidth={1}>
      {columns.map((x, index) => {
        const tiles: { y: number; h: number }[] = [];
        let y = 0.5 + rand() * 6;
        while (y < PANEL_H + gap) {
          const h = 8 + Math.round(rand() * 14);
          tiles.push({ y, h });
          y += h + gap;
        }
        const loop = y; // the column repeats every `loop` units, so the scroll is seamless
        return (
          <g
            key={x}
            className="pattern-tile-column"
            style={
              {
                "--pattern-loop": `${-loop}px`,
                "--pattern-duration": `${7 + index * 2.5}s`,
              } as CSSProperties
            }
          >
            {[0, loop].map((offset) =>
              tiles.map((tile) => (
                <rect
                  key={`${offset}-${tile.y}`}
                  x={x + 0.5}
                  y={tile.y + offset}
                  width={columnWidth - 1}
                  height={tile.h}
                  rx={2}
                />
              )),
            )}
          </g>
        );
      })}
    </g>
  );
}
