/**
 * A slower, eased scroll to a section, for jumps the browser's own smooth
 * scroll makes too abrupt. Safari's `scroll-behavior: smooth` runs in a
 * fraction of a second whatever the distance, so on a phone a jump across a
 * long case study reads as a cut. Here the time grows with the distance
 * (within bounds) and eases in and out.
 *
 * The section's own scroll-margin-top is respected, a touch, wheel or key
 * hands control straight back to the visitor, and reduced motion jumps.
 */

const MIN_MS = 550;
const MAX_MS = 1100;
/** Extra time per pixel travelled */
const MS_PER_PX = 0.22;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

let cancelCurrent: (() => void) | null = null;

export function smoothScrollTo(target: HTMLElement) {
  cancelCurrent?.();

  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const maxTop = document.documentElement.scrollHeight - window.innerHeight;
  const startTop = window.scrollY;
  const endTop = Math.max(
    0,
    Math.min(maxTop, target.getBoundingClientRect().top + startTop - margin),
  );
  const distance = endTop - startTop;

  // `instant` overrides the page's CSS smooth scrolling for each step
  const jump = (top: number) => window.scrollTo({ top, behavior: "instant" });

  if (
    Math.abs(distance) < 1 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    jump(endTop);
    return;
  }

  const duration = Math.min(MAX_MS, MIN_MS + Math.abs(distance) * MS_PER_PX);
  let frame = 0;
  let start: number | null = null;

  const stop = () => {
    cancelAnimationFrame(frame);
    for (const type of INTERRUPTS) window.removeEventListener(type, stop);
    if (cancelCurrent === stop) cancelCurrent = null;
  };

  const step = (now: number) => {
    start ??= now;
    const progress = Math.min(1, (now - start) / duration);
    jump(startTop + distance * easeInOutCubic(progress));
    if (progress < 1) frame = requestAnimationFrame(step);
    else stop();
  };

  for (const type of INTERRUPTS) {
    window.addEventListener(type, stop, { passive: true, once: true });
  }
  cancelCurrent = stop;
  frame = requestAnimationFrame(step);
}

/** The visitor taking over mid-scroll */
const INTERRUPTS = ["wheel", "touchstart", "keydown"] as const;
