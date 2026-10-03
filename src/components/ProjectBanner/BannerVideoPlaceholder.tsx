import { useId, type CSSProperties } from "react";

const TILE_Y = 20;
const TILE_HEIGHT = 56;
const TILE_GAP = 8;
const TILE_WIDTHS = [34, 22, 46, 28] as const;
const STRIP_START = 20;

/** One run of tiles; the strip slides by exactly this much per loop */
const PATTERN_WIDTH = TILE_WIDTHS.reduce(
  (total, width) => total + width + TILE_GAP,
  0,
);

const tiles = [0, 1].flatMap((repeat) => {
  let x = STRIP_START + repeat * PATTERN_WIDTH;
  return TILE_WIDTHS.map((width, index) => {
    const tile = { key: `${repeat}-${index}`, x, width };
    x += width + TILE_GAP;
    return tile;
  });
});

/** Stand-in for a banner video until its first frame is ready */
export function BannerVideoPlaceholder() {
  const id = useId();
  const clipId = `${id}-clip`;
  const fadeId = `${id}-fade`;
  const maskId = `${id}-mask`;

  return (
    <div className="banner-video-placeholder" aria-hidden="true">
      <svg
        className="banner-video-placeholder-graphic"
        viewBox="0 0 160 96"
        fill="none"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="14" y="14" width="132" height="68" rx="7" />
          </clipPath>
          {/* Soften tiles as they enter and leave the frame */}
          <linearGradient id={fadeId} x1="14" x2="146" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.2" stopColor="#fff" />
            <stop offset="0.8" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={maskId}>
            <rect x="0" y="0" width="160" height="96" fill={`url(#${fadeId})`} />
          </mask>
        </defs>
        <rect
          className="banner-video-placeholder-frame"
          x="8"
          y="8"
          width="144"
          height="80"
          rx="11"
        />
        <g clipPath={`url(#${clipId})`} mask={`url(#${maskId})`}>
          <g
            className="banner-video-placeholder-strip"
            style={{ "--strip-shift": `${-PATTERN_WIDTH}px` } as CSSProperties}
          >
            {tiles.map((tile) => (
              <rect
                key={tile.key}
                className="banner-video-placeholder-tile"
                x={tile.x}
                y={TILE_Y}
                width={tile.width}
                height={TILE_HEIGHT}
                rx="5"
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
