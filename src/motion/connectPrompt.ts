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
