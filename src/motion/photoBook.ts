/*
 * Photo book timing. These are the only values to tune: the component passes
 * them to its CSS as custom properties, so JS timers and CSS transitions
 * always agree.
 */

/** One page turn, cover open/close included. */
export const PHOTO_BOOK_TURN_MS = 950;

/** Weighty ease-in-out: the page lifts slowly, swings, then settles. */
export const PHOTO_BOOK_TURN_EASE = "cubic-bezier(0.42, 0.02, 0.18, 1)";

/**
 * Sliding the book right as it opens: fast out of the gate, so the pages move
 * with the lifting cover instead of being uncovered where the closed book sat.
 * Closing keeps the turn ease, so the book slides back after the cover lands.
 */
export const PHOTO_BOOK_SHIFT_OPEN_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Closing from the last spread: each leaf trails the one above it by this. */
export const PHOTO_BOOK_CLOSE_STAGGER_MS = 60;

/** The full turn on the Y axis after the book closes at the end. */
export const PHOTO_BOOK_SPIN_MS = 1400;
export const PHOTO_BOOK_SPIN_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

/** Pause between the book shutting and the spin starting. */
export const PHOTO_BOOK_SPIN_DELAY_MS = 80;

/** Narrow screens: sliding from one page of a spread to the other. */
export const PHOTO_BOOK_PAN_MS = 650;

/** Hover peek: the page lifts a few degrees toward the cursor. */
export const PHOTO_BOOK_PEEK_MS = 450;

/** Hover tilt toward the cursor: the most it leans, and how fast it follows. */
export const PHOTO_BOOK_TILT_DEG = 6;
export const PHOTO_BOOK_TILT_MS = 500;

/** Caption ink reveal: each word's bleed, the gap between words, and the
    pause after a page lands before the first word prints. */
export const PHOTO_BOOK_INK_MS = 700;
export const PHOTO_BOOK_INK_STAGGER_MS = 55;
export const PHOTO_BOOK_INK_DELAY_MS = 80;

/** Reduced motion: each half of the crossfade. */
export const PHOTO_BOOK_FADE_MS = 160;

/** Minimum horizontal travel, in px, for a touch to count as a swipe. */
export const PHOTO_BOOK_SWIPE_PX = 40;
