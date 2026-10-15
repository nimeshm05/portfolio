"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Transition, type Variants } from "motion/react";
import type { PhotoStampData } from "@/data/home";
import "./PhotoStamps.css";

type Rect = { left: number; top: number; width: number; height: number };

type Opened = { index: number; rect: Rect };

const toRect = ({ left, top, width, height }: DOMRect): Rect => ({ left, top, width, height });

/** Thumbnails are a few rem tall; this covers them at 2x */
const THUMB_SIZES = "160px";

/**
 * A row of small photos printed on perforated stamp paper, like the work
 * stamps. Each keeps its own aspect ratio. Clicking one lifts it into the
 * middle of the page at full size, the same way an open work stamp does.
 */
export function PhotoStamps({ photos }: { photos: readonly PhotoStampData[] }) {
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // `opened` drives the expanded photo; `lifted` hides its slot until it has flown back
  const [opened, setOpened] = useState<Opened | null>(null);
  const [lifted, setLifted] = useState<number | null>(null);
  // Where the closing photo flies back to: its slot as it is at close time
  const [returnRect, setReturnRect] = useState<Rect | null>(null);

  const open = (index: number) => {
    const trigger = triggerRefs.current[index];
    if (!trigger) return;
    setOpened({ index, rect: toRect(trigger.getBoundingClientRect()) });
    setLifted(index);
  };

  const close = useCallback(() => {
    if (!opened) return;
    const trigger = triggerRefs.current[opened.index];
    setReturnRect(trigger ? toRect(trigger.getBoundingClientRect()) : opened.rect);
    setOpened(null);
  }, [opened]);

  return (
    <>
      <ul className="photo-stamps" aria-label="Photos">
        {photos.map((photo, index) => (
          <li key={photo.src} className="photo-stamp-slot">
            <button
              ref={(el) => {
                triggerRefs.current[index] = el;
              }}
              type="button"
              className="photo-stamp"
              style={{ "--photo-stamp-ratio": photo.width / photo.height } as CSSProperties}
              data-lifted={lifted === index ? "" : undefined}
              aria-label={`View photo: ${photo.alt}`}
              aria-haspopup="dialog"
              onClick={() => open(index)}
            >
              <span className="photo-stamp-paper">
                <span className="photo-stamp-print">
                  <Image src={photo.src} alt="" fill sizes={THUMB_SIZES} />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <ExpandedPhoto
        photos={photos}
        opened={opened}
        returnRect={returnRect}
        onClose={close}
        onClosed={() => {
          const trigger = lifted === null ? null : triggerRefs.current[lifted];
          setLifted(null);
          // Hand focus back once the photo is visible in its slot again
          requestAnimationFrame(() => trigger?.focus({ preventScroll: true }));
        }}
      />
    </>
  );
}

/* ---------- Expanded photo ----------
   Like the open work stamp, the photo animates its real box from its slot to
   the middle of the page. --photo-stamp-expand (0 → 1) rides the same spring
   and widens the paper border as it grows. */

const OPEN_TRANSITION: Transition = { type: "spring", duration: 0.55, bounce: 0.2 };
const CLOSE_TRANSITION: Transition = { type: "spring", duration: 0.45, bounce: 0 };
const BACKDROP_TRANSITION: Transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

function ExpandedPhoto({
  photos,
  opened,
  returnRect,
  onClose,
  onClosed,
}: {
  photos: readonly PhotoStampData[];
  opened: Opened | null;
  returnRect: Rect | null;
  onClose: () => void;
  onClosed: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const instant: Transition = { duration: 0 };

  return typeof document === "undefined"
    ? null
    : createPortal(
        <AnimatePresence custom={returnRect ?? undefined} onExitComplete={onClosed}>
          {opened ? (
            <motion.div
              key="backdrop"
              className="photo-stamp-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? instant : BACKDROP_TRANSITION}
              onClick={onClose}
            />
          ) : null}
          {opened ? (
            <ExpandedCard
              key={`photo-${opened.index}`}
              photo={photos[opened.index]}
              origin={opened.rect}
              reduceMotion={Boolean(reduceMotion)}
              onClose={onClose}
            />
          ) : null}
        </AnimatePresence>,
        document.body,
      );
}

function ExpandedCard({
  photo,
  origin,
  reduceMotion,
  onClose,
}: {
  photo: PhotoStampData;
  origin: Rect;
  reduceMotion: boolean;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const [target, setTarget] = useState<Rect | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Fit the photo (plus its border) into the viewport, then snap the paper
  // down to the perforation step so the holes stay even. The probe resolves
  // the tokens to pixels: width = perforation step, height = border,
  // margins = viewport inset (left) and size cap (right).
  useLayoutEffect(() => {
    const measure = () => {
      const probe = probeRef.current;
      if (!probe) return;
      const style = getComputedStyle(probe);
      const step = parseFloat(style.width) || 1;
      const pad = parseFloat(style.height);
      const inset = parseFloat(style.marginLeft);
      const cap = parseFloat(style.marginRight);
      const snap = (value: number) => Math.max(step, Math.floor(value / step) * step);

      const maxWidth = Math.min(window.innerWidth - inset * 2, cap);
      const maxHeight = window.innerHeight - inset * 2;
      const ratio = photo.width / photo.height;
      let imageWidth = maxWidth - pad * 2;
      let imageHeight = imageWidth / ratio;
      if (imageHeight + pad * 2 > maxHeight) {
        imageHeight = maxHeight - pad * 2;
        imageWidth = imageHeight * ratio;
      }
      const width = snap(imageWidth + pad * 2);
      const height = snap(imageHeight + pad * 2);
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
  }, [photo.width, photo.height]);

  useEffect(() => {
    cardRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const instant: Transition = { duration: 0 };
  const variants: Variants = {
    // `rect` is the slot: the origin when opening, the live slot when closing
    collapsed: (rect: Rect | undefined) => ({
      ...(rect ?? origin),
      "--photo-stamp-expand": 0,
      transition: reduceMotion ? instant : CLOSE_TRANSITION,
    }),
  };
  if (target) {
    variants.expanded = {
      ...target,
      "--photo-stamp-expand": 1,
      transition: reduceMotion ? instant : OPEN_TRANSITION,
    };
  }

  return (
    <>
      <span ref={probeRef} className="photo-stamp-probe" aria-hidden="true" />
      <motion.div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={photo.alt}
        tabIndex={-1}
        className="photo-stamp-expanded"
        custom={origin}
        variants={variants}
        initial="collapsed"
        animate={target ? "expanded" : "collapsed"}
        exit="collapsed"
        onClick={onClose}
      >
        <span className="photo-stamp-paper">
          <span className="photo-stamp-print">
            {/* The thumbnail is already loaded, so it shows straight away;
                the full-size photo fades in over it once it arrives */}
            <Image src={photo.src} alt="" fill sizes={THUMB_SIZES} />
            {target ? (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={`${Math.ceil(target.width)}px`}
                className="photo-stamp-full"
                data-loaded={loaded ? "" : undefined}
                onLoad={() => setLoaded(true)}
              />
            ) : null}
          </span>
        </span>
      </motion.div>
    </>
  );
}
