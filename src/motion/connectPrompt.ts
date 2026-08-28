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

export const excitementLegStaggerSeconds = 0.03;

export const excitementDrawEase = [0.22, 1, 0.36, 1] as const;

export const excitementLegTransition = {
  duration: 0.2,
  ease: excitementDrawEase,
};

export const excitementYayDrawTransition = {
  duration: 0.28,
  ease: excitementDrawEase,
};

export const excitementYayFillTransition = {
  duration: 0.12,
  delay: 0.12,
  ease: "easeOut" as const,
};

export const excitementSmokeTransition = {
  duration: 0.16,
  ease: "easeInOut" as const,
};

export const mascotPresenceTransition = {
  y: {
    type: "spring" as const,
    stiffness: 420,
    damping: 18,
    mass: 0.7,
  },
  opacity: {
    duration: 0.2,
    ease: excitementDrawEase,
  },
};

export const mascotHiddenBelow = {
  y: "0.5rem",
  opacity: 0,
} as const;

export const mascotEnterPose = {
  y: 0,
  opacity: 1,
} as const;

export const mascotEyeTiltDeg = 18;

export const mascotWinkScaleY = 2 / 6;

export const mascotEyeTransition = {
  duration: 0.2,
  ease: excitementDrawEase,
};

export const mascotWinkTransition = {
  duration: 0.28,
  ease: excitementDrawEase,
  times: [0, 0.5, 1] as const,
};

export const mascotIdleBlinkMs = 2000;

export const coffeeSteamVariants = {
  normal: {
    y: 0,
    opacity: 1,
  },
  animate: (custom: number) => ({
    y: -3,
    opacity: [0, 1, 0],
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      duration: 1.5,
      ease: "easeInOut" as const,
      delay: 0.2 * custom,
    },
  }),
} as const;
