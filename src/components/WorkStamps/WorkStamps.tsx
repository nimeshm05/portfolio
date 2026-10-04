"use client";

import { useId, useRef, useState } from "react";
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
    <div className="work-stamps-frame">
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
                    <div className="work-stamp-details">
                      <p className="work-stamp-name">{stamp.company}</p>
                      <div className="work-stamp-meta">
                        <p>{stamp.role}</p>
                        <p>{stamp.dates}</p>
                      </div>
                    </div>
                    <span className="work-stamp-value" aria-hidden="true">
                      {stamp.value}
                    </span>
                  </div>
                </div>
                <p className="work-stamp-imprint" aria-hidden="true">
                  <span>{STAMP_IMPRINT_DESIGN}</span>
                  <span>{stamp.postmark.year}</span>
                  <span>{stamp.location}</span>
                </p>
                <Postmark {...stamp.postmark} location={stamp.location} seed={index + 1} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- Stamp conventions ----------
   The small print that makes a card read as a stamp: a face value on the
   artwork, and a printer's imprint (designer, year, place) in the bottom margin. */

const STAMP_IMPRINT_DESIGN = "Design N. Mohanakrishnan";

/* ---------- Postmark ----------
   A circular cancellation mark in the stamp's own ink. The distress filter
   knocks out fine specks and fades broad patches, so it reads as hand-inked
   rather than vector-perfect. `seed` keeps each stamp's wear different. */

function Postmark({
  label,
  year,
  rotate,
  location,
  seed,
}: WorkStampData["postmark"] & { location: string; seed: number }) {
  const id = useId();
  const top = `${id}-top`;
  const bottom = `${id}-bottom`;
  const wear = `${id}-wear`;
  const star = "M0 -3.4 1 -1 3.4 -1 1.5 0.5 2.2 3 0 1.5 -2.2 3 -1.5 0.5 -3.4 -1 -1 -1Z";

  return (
    <svg
      className="work-stamp-postmark"
      viewBox="0 0 100 100"
      style={{ "--work-stamp-postmark-rotate": `${rotate}deg` } as CSSProperties}
      aria-hidden="true"
    >
      <defs>
        <path id={top} d="M 16 50 A 34 34 0 0 1 84 50" />
        <path id={bottom} d="M 8 50 A 42 42 0 0 0 92 50" />
        <filter id={wear} x="-5%" y="-5%" width="110%" height="110%">
          {/* fine grain: tiny gaps where the ink didn't take */}
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} result="grain" />
          <feColorMatrix
            in="grain"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4 0 0 0 2.65"
            result="specks"
          />
          {/* broad patches: uneven pressure across the stamp */}
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={1} seed={seed + 11} result="pressure" />
          <feColorMatrix
            in="pressure"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.6 0 0 0 2.05"
            result="patches"
          />
          <feComposite in="SourceGraphic" in2="specks" operator="in" result="specked" />
          <feComposite in="specked" in2="patches" operator="in" result="worn" />
          {/* slightly rough edges */}
          <feDisplacementMap in="worn" in2="grain" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${wear})`} fill="currentColor" stroke="currentColor">
        <circle cx="50" cy="50" r="47" fill="none" strokeWidth="3" />
        <circle cx="50" cy="50" r="31" fill="none" strokeWidth="1.5" />
        <text className="work-stamp-postmark-arc" stroke="none">
          <textPath href={`#${top}`} startOffset="50%" textAnchor="middle">
            {label}
          </textPath>
        </text>
        <text className="work-stamp-postmark-arc" stroke="none">
          <textPath href={`#${bottom}`} startOffset="50%" textAnchor="middle">
            {location}
          </textPath>
        </text>
        <path d={star} transform="translate(11 50)" stroke="none" />
        <path d={star} transform="translate(89 50)" stroke="none" />
        <text className="work-stamp-postmark-year" x="50" y="50" stroke="none">
          {year}
        </text>
      </g>
    </svg>
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
