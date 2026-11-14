/**
 * Starts and stops the muted, inline clips that play on their own.
 *
 * Phones are stricter about videos that play without a tap. iOS only lets one
 * start if it's muted, and React sets `muted` as a property but never as the
 * attribute, so it's set both ways here before every play. And with Low Power
 * Mode (or a data saver) on, autoplay is refused outright: those clips are
 * queued and started on the visitor's next tap or scroll-ending touch, which
 * counts as a gesture and unlocks them.
 */

/** Clips that should be playing right now */
const wanted = new WeakSet<HTMLVideoElement>();
/** Clips the browser refused to start, waiting for a gesture */
const blocked = new Set<HTMLVideoElement>();
let listening = false;

const GESTURES = ["touchend", "click", "keydown"] as const;

function retryBlocked() {
  stopListening();
  for (const video of blocked) {
    blocked.delete(video);
    if (video.isConnected && wanted.has(video)) attempt(video);
  }
}

function startListening() {
  if (listening) return;
  listening = true;
  for (const type of GESTURES) {
    window.addEventListener(type, retryBlocked, { passive: true, capture: true });
  }
}

function stopListening() {
  if (!listening) return;
  listening = false;
  for (const type of GESTURES) {
    window.removeEventListener(type, retryBlocked, { capture: true });
  }
}

function attempt(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("muted", "");
  video.play().catch((error: unknown) => {
    // A pause before it started (scrolled away) is not a refusal
    if (!wanted.has(video)) return;
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      blocked.add(video);
      startListening();
    }
  });
}

export function playInline(video: HTMLVideoElement) {
  wanted.add(video);
  attempt(video);
}

export function pauseInline(video: HTMLVideoElement) {
  wanted.delete(video);
  blocked.delete(video);
  video.pause();
}
