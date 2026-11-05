/**
 * Lets only one banner video play at a time: the one with the most of itself
 * on screen. Decoding several large videos at once is what made scrolling
 * stutter, and only the one being looked at needs to move.
 */

type Listener = () => void;

const visibleArea = new Map<Element, number>();
const listeners = new Set<Listener>();
let leader: Element | null = null;

// Callbacks fire every 5% of an element entering or leaving view, which is
// enough to hand playback over smoothly between neighbouring cards.
const THRESHOLDS = Array.from({ length: 21 }, (_, index) => index / 20);

let observer: IntersectionObserver | null = null;

function updateLeader() {
  let next: Element | null = null;
  let bestArea = 0;

  for (const [element, area] of visibleArea) {
    if (area > bestArea) {
      next = element;
      bestArea = area;
    }
  }

  if (next !== leader) {
    leader = next;
    listeners.forEach((listener) => listener());
  }
}

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const { width, height } = entry.intersectionRect;
        visibleArea.set(entry.target, entry.isIntersecting ? width * height : 0);
      }
      updateLeader();
    },
    { threshold: THRESHOLDS },
  );

  return observer;
}

/** Starts tracking an element; returns a function that stops it. */
export function trackVideoFocus(element: Element) {
  visibleArea.set(element, 0);
  getObserver().observe(element);

  return () => {
    observer?.unobserve(element);
    visibleArea.delete(element);
    updateLeader();
  };
}

/** Runs `listener` whenever the most-visible video changes. */
export function subscribeVideoFocus(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isVideoFocused(element: Element | null) {
  return element !== null && element === leader;
}
