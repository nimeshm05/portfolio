"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import type { PhotoBookSpread } from "@/data/photoBook";
import {
  PHOTO_BOOK_CLOSE_STAGGER_MS,
  PHOTO_BOOK_FADE_MS,
  PHOTO_BOOK_PAN_MS,
  PHOTO_BOOK_PEEK_MS,
  PHOTO_BOOK_SPIN_DELAY_MS,
  PHOTO_BOOK_SPIN_EASE,
  PHOTO_BOOK_SPIN_MS,
  PHOTO_BOOK_SWIPE_PX,
  PHOTO_BOOK_TILT_DEG,
  PHOTO_BOOK_TILT_MS,
  PHOTO_BOOK_TURN_EASE,
  PHOTO_BOOK_TURN_MS,
} from "@/motion/photoBook";
import "./PhotoBook.css";

/*
 * A closed book that opens, turns and closes with CSS 3D transforms.
 *
 * The book is a stack of leaves hinged at the spine. Leaf 0 is the cover;
 * leaf i (1…n) carries spread i's caption on its front and spread i+1's
 * photo on its back, so with `flipped` leaves turned the reader sees the
 * back of leaf flipped-1 on the left and the front of leaf flipped on the
 * right. Each leaf is cut into a spine half and an outer half hinged at the
 * middle; the outer half lags during a turn, which reads as the paper bending.
 *
 * Under 640px the frame shows one page at a time: the book pans between the
 * left and right page of a spread, and turns (while panning) between spreads.
 *
 * One turn runs at a time. A click during a turn is queued (only the latest
 * one is kept) and runs as soon as the page lands.
 */

type Intent = "next" | "prev" | "close";
type Zone = "next" | "prev";
type Side = "left" | "right";

/** Matches the small breakpoint in responsive.css and PhotoBook.css. */
const NARROW_QUERY = "(max-width: 39.9375rem)";

function subscribeNarrow(onChange: () => void) {
  const query = window.matchMedia(NARROW_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useNarrow() {
  return useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia(NARROW_QUERY).matches,
    () => false,
  );
}

type Turn = {
  direction: "forward" | "back";
  from: number;
  to: number;
};

type PhotoBookProps = {
  title?: string;
  /** Any CSS color; defaults to the theme's cloth token */
  coverColor?: string;
  spreads: PhotoBookSpread[];
};

const spinKeyframes: Keyframe[] = [
  { transform: "translateY(0) rotateY(0deg)" },
  { transform: "translateY(-0.5rem) rotateY(-180deg)", offset: 0.5 },
  { transform: "translateY(0) rotateY(-360deg)" },
];

function Face({
  side,
  className,
  children,
}: {
  side: "front" | "back";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`photo-book-face photo-book-face--${side}${className ? ` ${className}` : ""}`}
    >
      <div className="photo-book-face-content">{children}</div>
    </div>
  );
}

/*
 * Cover art, in a 100×136 box (the page's shape): pen-tool curves with their
 * anchor handles ("designed") and viewfinder corners around the title ("shot").
 */
const coverCurves = [
  { tone: "sun", d: "M14 20 C30 50 66 -2 88 26", ends: [[14, 20], [88, 26]] },
  { tone: "coral", d: "M58 9 C90 8 66 42 91 46", ends: [[58, 9], [91, 46]] },
  { tone: "sky", d: "M17 114 C40 92 62 134 86 104", ends: [[17, 114], [86, 104]] },
] as const;

function CoverArt() {
  return (
    <svg
      className="photo-book-cover-art"
      viewBox="0 0 100 136"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        className="photo-book-cover-frame"
        d="M14 60 V54 H20 M84 54 H90 V60 M90 76 V82 H84 M20 82 H14 V76"
      />
      {coverCurves.map((curve) => (
        <g key={curve.tone} className={`photo-book-cover-curve--${curve.tone}`}>
          <path className="photo-book-cover-curve" d={curve.d} />
          {curve.ends.map(([cx, cy]) => (
            <circle
              key={`${cx}-${cy}`}
              className="photo-book-cover-handle"
              cx={cx}
              cy={cy}
              r={1.7}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

function Cover({ title }: { title?: string }) {
  return (
    <div className="photo-book-cover">
      <span className="photo-book-cover-binding" />
      <CoverArt />
      {title ? <span className="photo-book-cover-title">{title}</span> : null}
    </div>
  );
}

function PhotoPage({
  spread,
  folio,
  load,
}: {
  spread: PhotoBookSpread;
  folio: number;
  load: boolean;
}) {
  return (
    <div className="photo-book-page photo-book-page--photo">
      <div className="photo-book-photo">
        {load ? (
          <Image
            src={spread.image}
            alt=""
            fill
            sizes="(max-width: 40rem) 45vw, 20rem"
            loading="eager"
          />
        ) : null}
      </div>
      <span className="photo-book-folio">{folio}</span>
    </div>
  );
}

function CaptionPage({
  spread,
  folio,
}: {
  spread: PhotoBookSpread;
  folio: number;
}) {
  return (
    <div className="photo-book-page photo-book-page--caption">
      <p className="photo-book-caption">{spread.caption}</p>
      <span className="photo-book-folio">{folio}</span>
    </div>
  );
}

export function PhotoBook({ title, coverColor, spreads }: PhotoBookProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const hintId = useId();
  const narrow = useNarrow();
  const count = spreads.length;

  /** Leaves turned to the left; 0 is the closed book. */
  const [flipped, setFlipped] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [fading, setFading] = useState(false);
  const [peek, setPeek] = useState<Zone | null>(null);
  /** The page in view on narrow screens; ignored on wide ones. */
  const [side, setSide] = useState<Side>("right");
  const [panning, setPanning] = useState(false);
  /** Highest spread whose photo has been mounted; photos stay once loaded. */
  const [reach, setReach] = useState(1);

  const flippedRef = useRef(0);
  const sideRef = useRef<Side>("right");
  const busyRef = useRef(false);
  const queuedRef = useRef<Intent | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const spinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<(intent: Intent) => void>(() => {});
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipedRef = useRef(false);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => timeouts.forEach((id) => window.clearTimeout(id));
  }, []);


  const run = useCallback(
    (intent: Intent) => {
      if (busyRef.current) {
        queuedRef.current = intent;
        return;
      }

      const wait = (ms: number, fn: () => void) => {
        timeoutsRef.current.push(window.setTimeout(fn, ms));
      };
      const finish = () => {
        busyRef.current = false;
        const queued = queuedRef.current;
        queuedRef.current = null;
        if (queued) runRef.current(queued);
      };
      const crossfade = (update: () => void) => {
        setFading(true);
        wait(PHOTO_BOOK_FADE_MS, () => {
          update();
          setFading(false);
          wait(PHOTO_BOOK_FADE_MS, finish);
        });
      };

      const from = flippedRef.current;

      // One page at a time: within a spread, only pan to the other page.
      const panTo: Side | null =
        !narrow || from === 0
          ? null
          : intent === "next" && sideRef.current === "left"
            ? "right"
            : intent === "prev" && sideRef.current === "right"
              ? "left"
              : null;
      if (panTo) {
        busyRef.current = true;
        sideRef.current = panTo;
        setPeek(null);
        if (reduceMotion) {
          crossfade(() => setSide(panTo));
          return;
        }
        setSide(panTo);
        setPanning(true);
        wait(PHOTO_BOOK_PAN_MS, () => {
          setPanning(false);
          finish();
        });
        return;
      }

      const finale = intent === "next" && from === count;
      let to: number;
      if (intent === "next") {
        to = finale ? 0 : from + 1;
      } else if (from === 0) {
        return;
      } else {
        to = intent === "prev" ? from - 1 : 0;
      }
      // Turning forward lands on the new photo; turning back, on the caption.
      const toSide: Side = to > from ? "left" : "right";

      busyRef.current = true;
      flippedRef.current = to;
      sideRef.current = toSide;
      setPeek(null);
      setReach((current) => Math.max(current, to + 1));

      if (reduceMotion) {
        crossfade(() => {
          setFlipped(to);
          setSide(toSide);
        });
        return;
      }

      setTurn({ direction: to > from ? "forward" : "back", from, to });
      setFlipped(to);
      setSide(toSide);

      const turnMs =
        PHOTO_BOOK_TURN_MS +
        (Math.abs(to - from) - 1) * PHOTO_BOOK_CLOSE_STAGGER_MS;
      wait(turnMs, () => {
        setTurn(null);
        if (!finale) {
          finish();
          return;
        }

        setSpinning(true);
        wait(PHOTO_BOOK_SPIN_DELAY_MS, () => {
          const done = () => {
            setSpinning(false);
            // Land on the cover; clicks made during the closing gesture don't
            // reopen the book.
            queuedRef.current = null;
            finish();
          };
          const spin = spinRef.current?.animate(spinKeyframes, {
            duration: PHOTO_BOOK_SPIN_MS,
            easing: PHOTO_BOOK_SPIN_EASE,
          });
          if (spin) spin.finished.then(done, done);
          else done();
        });
      });
    },
    [count, narrow, reduceMotion],
  );

  useEffect(() => {
    runRef.current = run;
  }, [run]);

  // While open, a click anywhere outside the book closes it.
  const isOpen = flipped > 0;
  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (event: globalThis.PointerEvent) => {
      if (!frameRef.current?.contains(event.target as Node)) {
        runRef.current("close");
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        run("next");
        break;
      case "ArrowLeft":
        event.preventDefault();
        run("prev");
        break;
      case "Enter":
      case " ":
        if (flippedRef.current === 0) {
          event.preventDefault();
          run("next");
        }
        break;
      case "Escape":
        if (flippedRef.current > 0) {
          event.preventDefault();
          run("close");
        }
        break;
    }
  };

  const zoneOf = (target: EventTarget) =>
    ((target as HTMLElement).dataset.zone as Zone | undefined) ?? null;

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    swipedRef.current = false;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start || event.pointerType === "mouse") return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > PHOTO_BOOK_SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
      swipedRef.current = true;
      run(dx < 0 ? "next" : "prev");
    }
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    const zone = zoneOf(event.target);
    if (zone) run(zone);
  };

  /** Lean toward the cursor; x and y run -1…1 across the book, null resets. */
  const setTilt = (point: { x: number; y: number } | null) => {
    const stage = stageRef.current;
    if (!stage) return;
    const deg = (value: number) => `${(value * PHOTO_BOOK_TILT_DEG).toFixed(2)}deg`;
    stage.style.setProperty("--pb-tilt-x", point ? deg(-point.y) : "0deg");
    stage.style.setProperty("--pb-tilt-y", point ? deg(point.x) : "0deg");
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || narrow || reduceMotion) return;

    const zone = zoneOf(event.target);
    // Closed, only the cover counts; open, the whole spread.
    const area = zone
      ? (closed ? (event.target as HTMLElement) : event.currentTarget)
          .getBoundingClientRect()
      : null;
    setTilt(
      area
        ? {
            x: ((event.clientX - area.left) / area.width) * 2 - 1,
            y: ((event.clientY - area.top) / area.height) * 2 - 1,
          }
        : null,
    );

    if (busyRef.current) return;
    if (zone !== peek) setPeek(zone);
  };

  const closed = flipped === 0;
  const settledClosed = closed && turn == null;
  const currentSpread = closed ? null : spreads[flipped - 1];
  const announcement = closed
    ? `${title ?? "Photo book"}, closed`
    : narrow
      ? `Page ${side === "left" ? flipped * 2 - 1 : flipped * 2} of ${count * 2}`
      : `Pages ${flipped * 2 - 1} and ${flipped * 2} of ${count * 2}`;

  const leaves = Array.from({ length: count + 1 }, (_, index) => {
    const isFlipped = index < flipped;
    const isTurning =
      turn != null &&
      index >= Math.min(turn.from, turn.to) &&
      index < Math.max(turn.from, turn.to);
    // Closing several leaves at once: the top of the left stack goes first.
    const delay =
      isTurning && turn.direction === "back"
        ? (turn.from - 1 - index) * PHOTO_BOOK_CLOSE_STAGGER_MS
        : 0;
    const isPeeking =
      turn == null &&
      ((peek === "next" && index === flipped) ||
        (peek === "prev" && index === flipped - 1));

    const front =
      index === 0 ? (
        <Cover title={title} />
      ) : (
        <CaptionPage spread={spreads[index - 1]} folio={index * 2} />
      );
    const back =
      index < count ? (
        <PhotoPage
          spread={spreads[index]}
          folio={index * 2 + 1}
          load={index <= reach}
        />
      ) : (
        <div className="photo-book-page" />
      );
    const frontClass = index === 0 ? "photo-book-face--cover" : undefined;

    return (
      <div
        key={index}
        className="photo-book-leaf"
        data-flipped={isFlipped || undefined}
        data-turn={isTurning ? turn.direction : undefined}
        data-peek={isPeeking || undefined}
        style={
          {
            "--pb-z": isFlipped ? index + 1 : count - index + 1,
            "--pb-leaf-delay": `${delay}ms`,
          } as CSSProperties
        }
      >
        <div className="photo-book-seg photo-book-seg-a">
          <Face side="front" className={frontClass}>
            {front}
          </Face>
          <Face side="back">{back}</Face>
          <div className="photo-book-seg photo-book-seg-b">
            <Face side="front" className={frontClass}>
              {front}
            </Face>
            <Face side="back">{back}</Face>
          </div>
        </div>
      </div>
    );
  });

  const style = {
    "--pb-turn-duration": `${PHOTO_BOOK_TURN_MS}ms`,
    "--pb-turn-ease": PHOTO_BOOK_TURN_EASE,
    "--pb-peek-duration": `${PHOTO_BOOK_PEEK_MS}ms`,
    "--pb-pan-duration": `${PHOTO_BOOK_PAN_MS}ms`,
    "--pb-tilt-duration": `${PHOTO_BOOK_TILT_MS}ms`,
    "--pb-fade-duration": `${PHOTO_BOOK_FADE_MS}ms`,
    "--pb-leaves": count + 1,
    ...(coverColor ? { "--pb-cover": coverColor } : null),
  } as CSSProperties;

  return (
    <div
      className="photo-book"
      style={style}
      data-reduced={reduceMotion || undefined}
      data-narrow={narrow || undefined}
      data-open={!closed || undefined}
    >
      <div
        ref={frameRef}
        className="photo-book-frame"
        role="group"
        aria-roledescription="photo book"
        aria-label={title ?? "Photo book"}
        aria-describedby={hintId}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        data-closed={closed || undefined}
      >
        <div className="photo-book-viewport" data-fading={fading || undefined}>
          <div className="photo-book-stage" ref={stageRef}>
            <div className="photo-book-spin" ref={spinRef}>
              <div
                className="photo-book-book"
                data-closed={closed || undefined}
                data-settled={settledClosed || undefined}
                data-spinning={spinning || undefined}
                data-panning={panning || undefined}
                data-side={side}
                aria-hidden="true"
              >
                <div className="photo-book-ground" />
                <div className="photo-book-base">
                  <Face side="front">
                    <div className="photo-book-page" />
                  </Face>
                  <Face side="back" className="photo-book-face--cover">
                    <div className="photo-book-cover" />
                  </Face>
                </div>
                <div className="photo-book-edge photo-book-edge--spine" />
                <div className="photo-book-edge photo-book-edge--fore" />
                <div className="photo-book-edge photo-book-edge--top" />
                {leaves}
              </div>
            </div>
          </div>
        </div>

        <div
          className="photo-book-hit"
          aria-hidden="true"
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            setPeek(null);
            setTilt(null);
          }}
        >
          {closed ? (
            <div className="photo-book-zone photo-book-zone--cover" data-zone="next" />
          ) : (
            <>
              <div className="photo-book-zone photo-book-zone--prev" data-zone="prev" />
              <div className="photo-book-zone photo-book-zone--next" data-zone="next" />
            </>
          )}
        </div>

        <div className="photo-book-sr">
          <p id={hintId}>
            Press Enter to open. Use the left and right arrow keys to turn
            pages, and Escape to close.
          </p>
          {currentSpread ? (
            <>
              <div role="img" aria-label={currentSpread.alt} />
              <p>{currentSpread.caption}</p>
            </>
          ) : null}
          <p aria-live="polite">{announcement}</p>
        </div>
      </div>
    </div>
  );
}
