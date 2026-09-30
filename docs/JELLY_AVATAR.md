# Jelly Avatar

The home-page profile photo, rebuilt as a soft round jelly. Replaces the old round `<Image>` in `Header`.

## Behaviour (as agreed)

- 80×80 layout box (`--size-avatar: 5rem`), a circle (rounded, extruded disc), photo on the front face.
- Always faces the viewer (orthographic camera, no 3D angle). It stays in place: an anchor spring holds it home.
- **Drag** → stretches like taffy in any direction (whole body pinned while held), wobbles back on release.
- **Click / tap, Enter or Space** → jumps (~45px), squashes on landing. Space does not scroll the page.
- A stretch or jump may draw outside the 80px box (canvas has 70px overflow on each side); layout never shifts.
- Only the owner's photo (`/assets/profile-jelly.webp`). No upload, no photo picker, no sound (sound may come later).
- No border ring.
- **Entrance:** hidden at first; ~0.9s after mount (`AVATAR_DROP_DELAY_MS` in `src/motion/pageEnter.ts`, once the header's text stagger has mostly settled) it drops from above the viewport, squashes on landing and bounces ~10px. While falling, the canvas' top edge is stretched up to the viewport top (`--jelly-overflow-top`) so it never appears out of thin air. The avatar is no longer a `PageEnterItem`.
- Fallbacks → still round photo, fading in at the same cue: no WebGL2, engine chunk fails to load, photo fails to load, jelly not ready within 700ms of the cue (it cross-fades in later if it arrives), or the WebGL context is lost (common on mobile after backgrounding; the jelly is rebuilt on `webglcontextrestored`). `prefers-reduced-motion` → still photo straight away; a click does a 3px CSS hop.
- `touch-action: none` only while the jelly is live, so the still photo never blocks page scrolling on touch screens.
- Rendering loop sleeps once the body settles (~3s after a jump), when scrolled out of view, or when the tab is hidden.

## Files

| File | Role |
| --- | --- |
| `src/components/JellyAvatar/jellyEngine.ts` | Dependency-free WebGL2 engine: soft-body physics + rendering. |
| `src/components/JellyAvatar/JellyAvatar.tsx` | React wrapper: pointer/keyboard handling, lazy-loads the engine, fallbacks. |
| `src/components/JellyAvatar/JellyAvatar.css` | Box, overflow canvas, circular clip for the still image, focus ring. |
| `src/components/Header/Header.tsx` / `.css` | Uses `<JellyAvatar>`; avatar wrapper gets `z-index: 1` so the jelly draws over the name. |
| `src/data/home.ts` | `avatarSrc` → `/assets/profile-jelly.webp` (14 KB, cropped from the photo embedded in `profile.svg`). |
| `src/styles/tokens/primitives.css` | `--size-avatar` 4.5rem → 5rem. |

`public/assets/profile.svg` (3.5 MB) is no longer used by the home page but was left in place.

## How the engine works

- **Mesh / particles:** a 40×28 UV sphere whose unique vertices (~1,080) are projected radially onto a rounded, extruded disc (signed-distance function, bisection per direction). Diameter is exactly 2 world units = the 80px box.
- **Physics (position-based dynamics, 240 Hz fixed step, 2 iterations):**
  - global shape matching toward the rest shape (rotation extracted with Müller et al. 2016), slerped toward identity so it keeps facing forward;
  - volume constraint (squash bulges rather than shrinks);
  - light edge springs for a smooth skin;
  - grab: pulls a smooth patch of particles toward the pointer; the body's centre is pinned home while held;
  - floor at the rest bottom (only matters for jumps; disabled while held, eased back on release);
  - rebound cap so a released pull never flies out of the canvas.
- **Rendering:** orthographic projection, photo planar-projected from the rest shape (UVs never swim), soft studio reflections + fresnel on the rounded rim, small contact shadow that shrinks during a jump (white in dark mode; redraws on theme change). Transparent canvas, so it works on light and dark themes.

## Tuning knobs (top of `jellyEngine.ts`)

| Constant | Effect |
| --- | --- |
| `JUMP_SPEED` | Jump height (6.4 ≈ 45px). |
| `DROP_START_SPEED` | How fast the entrance drop starts falling (9 → a 400px drop lands in ~0.75s). |
| `DROP_BOUNCE_SPEED` | Cap on the rebound after the entrance drop (3.2 ≈ 10px bounce). |
| `GRAVITY` | Fall speed / hang time. |
| `STIFF_REST` | How firmly it holds its shape at rest (higher = less jiggle, less sag). |
| `STIFF_HELD` | Stretchiness while held (lower = gooier). |
| `ANCHOR_K` / `ANCHOR_C` | Spring back to home sideways, and its damping. |
| `HOLD_K` / `HOLD_C` | How firmly the body is pinned while being pulled. |
| `MAX_PULL` | How far the grabbed skin can travel (1.5 units = 60px). |
| `MAX_RISE_SPEED` / `MAX_RISE` | Cap on rebound after release (keeps it inside the canvas). |
| `GRAB_RADIUS` | Size of the patch that follows the pointer. |
| damping line in `step()` (`Math.exp(-(this.grab ? 5 : 7.5) * h)`) | How long it wobbles after a jump or release. |

If you raise jump height or pull distance, check it still fits: the canvas gives 110px above and around the centre (`--jelly-overflow: 70px` in the CSS + half the box). Worst cases measured at 97px (release after a hard downward pull) and 84px (jump).

## Testing notes

Verified in headless Chromium (SwiftShader WebGL2) with the real component in React: pulls in several directions, release, click jump, keyboard jump, reduced motion, light and dark backgrounds. Not yet verified: `npm run lint` and `next build` in this repo.

## Ideas parked for later

- Sound on jump (existing Cuelume presets).
- Eyes/expressions like the Connect mascot, or a blink.
