# Gem Avatar

The home-page avatar: a little green glass gem with a face. Replaces the old photo jelly (`JellyAvatar`, removed with its WebGL engine and `profile-jelly.webp`).

## Behaviour

- 72×72 layout box (`--avatar-size`), drawn as inline SVG with `overflow: visible`, so hops and the entrance draw outside the box without shifting layout.
- **Looks at the pointer** (mouse only): the whole face turns on the sphere; eyes foreshorten towards the rim.
- **Idle life**, when the pointer has been still for 2.5s: glances around, blinks (sometimes twice), winks with a head tilt, little bounces, a full turn-around with a hop (the eyes slide round the back), wide eyes.
- **Press** squashes it (anticipation); **release / Enter / Space** hops, cycling: wide eyes → turn-around → wink.
- **Entrance:** hidden until `AVATAR_DROP_DELAY_MS`, then falls from the top of the viewport, squashes and bounces.
- `prefers-reduced-motion` → still gem, facing forward, no loop.
- The loop pauses when scrolled out of view or the tab is hidden.

## Files

| File | Role |
| --- | --- |
| `src/components/GemAvatar/gemMotion.ts` | Dependency-free motion: springs, hop physics, idle scheduler, eye projection. Tuning constants at the top. |
| `src/components/GemAvatar/GemAvatar.tsx` | SVG artwork + pointer/keyboard wiring; paints frames straight to SVG attributes (no React re-render per frame). |
| `src/components/GemAvatar/GemAvatar.css` | Gem colour tokens (`--gem-*`, dark-mode overrides), box, focus ring. |
