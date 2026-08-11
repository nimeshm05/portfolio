export const phoneWordTransition = {
  duration: 0.7,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const phoneWordStaggerSeconds = 0.05;

/** Pull-up uses em so masks with line-height clip correctly. */
export const phoneWordEnter = {
  y: "0em",
  opacity: 1,
  filter: "blur(0px)",
} as const;

/**
 * Enter starts here; contact-line exit returns here —
 * the reverse of the soon-line pull-up (y / opacity / blur).
 */
export const phoneWordHiddenBelow = {
  y: "1.15em",
  opacity: 0,
  filter: "blur(8px)",
} as const;

export const PHONE_WAVE_EMOJI = "👋";

export const phoneWaveRotate = [0, 18, -8, 18, -4, 12, 0];

export const phoneWaveTransition = {
  duration: 1,
  ease: [0.45, 0, 0.55, 1] as [number, number, number, number],
  times: [0, 0.15, 0.3, 0.5, 0.65, 0.8, 1],
  repeat: 1,
};
