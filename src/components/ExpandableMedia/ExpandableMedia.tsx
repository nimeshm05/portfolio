"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";
import "./ExpandableMedia.css";

type Rect = { left: number; top: number; width: number; height: number };

/** Set on <html> while media is open, so the page around it steps aside */
const PUSH_ATTRIBUTE = "data-media-expanded";

/** Page chrome that drifts outward while media is open */
const CHROME_SELECTORS = [
  ".project-sidebar",
  ".project-back-mobile",
  ".site-controls",
];

/**
 * Everything moves away from the middle of the viewport, as if the page were
 * pushed past the viewer: the content grows around the centre, and each piece
 * of fixed chrome drifts outward along the line from the centre through it,
 * further the further out it sits.
 */
function pushPageAside() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Grow the content from the middle of the viewport, wherever it's scrolled
  const body = document.querySelector<HTMLElement>(".project-body");
  if (body) {
    const rect = body.getBoundingClientRect();
    body.style.setProperty("--media-push-origin-x", `${centerX - rect.left}px`);
    body.style.setProperty("--media-push-origin-y", `${centerY - rect.top}px`);
  }

  const factor =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--factor-media-push-chrome",
      ),
    ) || 0;
  for (const element of document.querySelectorAll<HTMLElement>(
    CHROME_SELECTORS.join(","),
  )) {
    const rect = element.getBoundingClientRect();
    if (!rect.width) continue;
    const dx = rect.left + rect.width / 2 - centerX;
    const dy = rect.top + rect.height / 2 - centerY;
    element.style.setProperty("--media-push-x", `${dx * factor}px`);
    element.style.setProperty("--media-push-y", `${dy * factor}px`);
  }

  document.documentElement.setAttribute(PUSH_ATTRIBUTE, "");
}

function bringPageBack() {
  document.documentElement.removeAttribute(PUSH_ATTRIBUTE);
}

/**
 * Where the media will sit once the page is back to normal. While open, the
 * content is scaled up around the viewport's middle, so undo that here and
 * the closing media lands exactly in its spot as the page settles.
 */
function restingRect(element: HTMLElement): Rect {
  const rect = element.getBoundingClientRect();
  const body = element.closest<HTMLElement>(".project-body");
  const scale = body ? parseFloat(getComputedStyle(body).scale) : NaN;
  if (!body || !Number.isFinite(scale) || scale === 1) return toRect(rect);
  const originX = window.innerWidth / 2;
  const originY = window.innerHeight / 2;
  return {
    left: originX + (rect.left - originX) / scale,
    top: originY + (rect.top - originY) / scale,
    width: rect.width / scale,
    height: rect.height / scale,
  };
}

const toRect = ({ left, top, width, height }: DOMRect): Rect => ({
  left,
  top,
  width,
  height,
});

/** Share of the viewport the open media may take, on its longer side */
const VIEWPORT_SHARE = 0.9;

/* Same springs as the open stamp cards (see PhotoStamps) */
const OPEN_TRANSITION: Transition = {
  type: "spring",
  duration: 0.55,
  bounce: 0.2,
};
const CLOSE_TRANSITION: Transition = {
  type: "spring",
  duration: 0.45,
  bounce: 0,
};
const BACKDROP_TRANSITION: Transition = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1],
};
const INSTANT: Transition = { duration: 0 };

/** What the open view shows when no renderExpanded is given */
type Snapshot =
  | { kind: "image"; src: string; alt: string }
  | {
      kind: "video";
      src: string;
      alt: string;
      time: number;
      source: HTMLVideoElement;
      hasFrame: boolean;
    }
  | { kind: "custom" };

type Opened = { rect: Rect; snapshot: Snapshot };

type ExpandableMediaProps = {
  children: ReactNode;
  /** Label for the expand button, e.g. the media's alt text */
  label: string;
  /**
   * Content for the open view. Defaults to a copy of the image or video
   * inside `children`, picked up from the page at open time.
   */
  renderExpanded?: () => ReactNode;
  className?: string;
};

/**
 * Wraps a case-study image or video with an "Expand" button that rises into
 * view at its bottom centre on hover. Opening lifts the media from its spot into the middle of the page,
 * up to 90% of the viewport, over a dimmed and blurred page — the same
 * motion as the stamp cards.
 */
export function ExpandableMedia({
  children,
  label,
  renderExpanded,
  className,
}: ExpandableMediaProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [opened, setOpened] = useState<Opened | null>(null);
  // Keeps the inline media hidden until the open copy has flown back
  const [lifted, setLifted] = useState(false);
  const [returnRect, setReturnRect] = useState<Rect | null>(null);

  const open = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    let snapshot: Snapshot = { kind: "custom" };
    if (!renderExpanded) {
      const video = wrapper.querySelector("video");
      const img = wrapper.querySelector("img");
      if (video && (video.currentSrc || video.src)) {
        snapshot = {
          kind: "video",
          src: video.currentSrc || video.src,
          alt: video.getAttribute("aria-label") ?? label,
          time: video.currentTime,
          source: video,
          // A loaded inline video can hand over its current frame as a still
          hasFrame: video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA,
        };
      } else if (img) {
        snapshot = {
          kind: "image",
          src: img.currentSrc || img.src,
          alt: img.alt || label,
        };
      } else {
        return;
      }
    }
    setReturnRect(null);
    // The inline media stays visible until the open copy has painted (see onReady)
    setOpened({ rect: toRect(wrapper.getBoundingClientRect()), snapshot });
  };

  // The page steps aside as the media starts to grow
  const lift = useCallback(() => {
    setLifted(true);
    pushPageAside();
  }, []);

  const close = useCallback(() => {
    const wrapper = wrapperRef.current;
    setReturnRect((current) => (wrapper ? restingRect(wrapper) : current));
    setOpened(null);
    // ...and comes back as it shrinks
    bringPageBack();
  }, []);

  useEffect(() => bringPageBack, []);

  return (
    <div
      ref={wrapperRef}
      className={
        className ? `expandable-media ${className}` : "expandable-media"
      }
      data-lifted={lifted ? "" : undefined}
    >
      {children}
      <button
        ref={buttonRef}
        type="button"
        className="expandable-media-button"
        aria-label={`Expand: ${label}`}
        aria-haspopup="dialog"
        onClick={open}
      >
        <span aria-hidden="true">Expand</span>
      </button>
      {typeof document === "undefined"
        ? null
        : createPortal(
            <ExpandedLayer
              opened={opened}
              returnRect={returnRect}
              label={label}
              renderExpanded={renderExpanded}
              onClose={close}
              ready={lifted}
              onReady={lift}
              onClosed={() => {
                setLifted(false);
                requestAnimationFrame(() =>
                  buttonRef.current?.focus({ preventScroll: true }),
                );
              }}
            />,
            document.body,
          )}
    </div>
  );
}

function ExpandedLayer({
  opened,
  returnRect,
  label,
  renderExpanded,
  onClose,
  ready,
  onReady,
  onClosed,
}: {
  opened: Opened | null;
  returnRect: Rect | null;
  label: string;
  renderExpanded?: () => ReactNode;
  onClose: () => void;
  /** The copy has painted; the dim starts with the grow, never before it */
  ready: boolean;
  onReady: () => void;
  onClosed: () => void;
}) {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <AnimatePresence custom={returnRect ?? undefined} onExitComplete={onClosed}>
      {opened && ready ? (
        <motion.div
          key="backdrop"
          className="expandable-media-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? INSTANT : BACKDROP_TRANSITION}
          onClick={onClose}
        />
      ) : null}
      {opened ? (
        <ExpandedMedia
          key="media"
          opened={opened}
          label={label}
          renderExpanded={renderExpanded}
          reduceMotion={reduceMotion}
          onClose={onClose}
          onReady={onReady}
        />
      ) : null}
    </AnimatePresence>
  );
}

function ExpandedMedia({
  opened,
  label,
  renderExpanded,
  reduceMotion,
  onClose,
  onReady,
}: {
  opened: Opened;
  label: string;
  renderExpanded?: () => ReactNode;
  reduceMotion: boolean;
  onClose: () => void;
  onReady: () => void;
}) {
  const { rect: origin, snapshot } = opened;
  const boxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<Rect | null>(null);
  // The copy waits, invisible, on top of the inline media until its image is
  // decoded or its video frame is ready; only then does it swap in and grow.
  // Otherwise the spot would flash empty for a frame or two.
  const [ready, setReady] = useState(false);
  // Videos open on a still of the inline video's current frame, drawn
  // instantly; the playing copy takes over once it has caught up
  const frameRef = useRef<HTMLCanvasElement>(null);
  const hasFrame = snapshot.kind === "video" && snapshot.hasFrame;
  const [videoPlaying, setVideoPlaying] = useState(false);

  useLayoutEffect(() => {
    if (snapshot.kind !== "video" || !snapshot.hasFrame) return;
    const { source } = snapshot;
    const canvas = frameRef.current;
    if (!canvas) return;
    canvas.width = source.videoWidth;
    canvas.height = source.videoHeight;
    canvas.getContext("2d")?.drawImage(source, 0, 0);
  }, [snapshot]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    let cancelled = false;

    const imageReady = (img: HTMLImageElement) =>
      img.decode().catch(() => undefined);
    const videoReady = (video: HTMLVideoElement) =>
      new Promise<void>((resolve) => {
        if (
          video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
          !video.seeking
        ) {
          resolve();
          return;
        }
        // Resolves once it has a frame at the inline video's time
        const done = () => {
          if (video.seeking) return;
          video.removeEventListener("loadeddata", done);
          video.removeEventListener("seeked", done);
          resolve();
        };
        video.addEventListener("loadeddata", done);
        video.addEventListener("seeked", done);
      });

    const waits = [
      ...Array.from(content.querySelectorAll("img"), imageReady),
      // With a still of the current frame there's nothing to wait for
      ...(hasFrame
        ? []
        : Array.from(content.querySelectorAll("video"), videoReady)),
    ];
    // Never hold the open back for long on a slow connection
    const timeout = new Promise<void>((resolve) =>
      window.setTimeout(resolve, 600),
    );

    Promise.race([Promise.all(waits), timeout]).then(() => {
      if (cancelled) return;
      // One more frame so the copy has painted before the inline media hides
      requestAnimationFrame(() => {
        if (cancelled) return;
        setReady(true);
        onReady();
      });
    });
    return () => {
      cancelled = true;
    };
  }, [onReady, hasFrame]);

  // Fit the media's own shape into 90% of the viewport
  useLayoutEffect(() => {
    const ratio = origin.width / origin.height;
    const measure = () => {
      const maxWidth = window.innerWidth * VIEWPORT_SHARE;
      const maxHeight = window.innerHeight * VIEWPORT_SHARE;
      let width = maxWidth;
      let height = width / ratio;
      if (height > maxHeight) {
        height = maxHeight;
        width = height * ratio;
      }
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
    boxRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const variants: Variants = {
    // `rect` is the media's spot: where it opened from, or where it is now when closing
    collapsed: (rect: Rect | undefined) => ({
      ...(rect ?? origin),
      transition: reduceMotion ? INSTANT : CLOSE_TRANSITION,
    }),
  };
  if (target) {
    variants.expanded = {
      ...target,
      transition: reduceMotion ? INSTANT : OPEN_TRANSITION,
    };
  }

  return (
    <motion.div
      ref={boxRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      className="expandable-media-expanded"
      custom={origin}
      variants={variants}
      initial="collapsed"
      animate={target && ready ? "expanded" : "collapsed"}
      data-ready={ready ? "" : undefined}
      exit="collapsed"
    >
      <div ref={contentRef} className="expandable-media-expanded-content">
        {snapshot.kind === "custom" ? (
          renderExpanded?.()
        ) : snapshot.kind === "video" ? (
          <>
            <canvas
              ref={frameRef}
              className="expandable-media-frame"
              aria-hidden="true"
            />
            <video
              src={snapshot.src}
              data-playing={videoPlaying || !hasFrame ? "" : undefined}
              aria-label={snapshot.alt}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={(event) => {
                // Carry on from where the inline video was
                event.currentTarget.currentTime = snapshot.time;
              }}
              onPlaying={() => setVideoPlaying(true)}
            />
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={snapshot.src} alt={snapshot.alt} />
        )}
      </div>
      <button
        type="button"
        className="expandable-media-button"
        aria-label="Shrink"
        onClick={onClose}
      >
        <span aria-hidden="true">Shrink</span>
      </button>
    </motion.div>
  );
}
