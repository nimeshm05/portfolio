---
name: stagger-enter
description: Apply the portfolio's staggered entrance animation (items slide in one after another on a loose spring while fading in and un-blurring, like the desktop project sidebar) to a component. Use when asked to add the stagger, sidebar-style or "lazy staggered" animation to any list, menu, set of buttons or group of elements. Pass the component and, optionally, a direction.
---

# Stagger enter

The effect lives in one place: `src/motion/staggerEnter.ts`. Never copy its
numbers into a component; call it, so tuning the feel there updates every
use. Current uses to copy from: `src/components/SidebarNav/SidebarNav.tsx`
(sidebar, from below) and `src/components/ProjectDock/ProjectDock.tsx`
(dock buttons from the right, menu items from below).

## Input

`/stagger-enter <component or file> [from] [notes]`

- `from`: `below` (default) | `above` | `left` | `right`, the side items
  slide in from. If the user describes motion as "right to left", items come
  from the right.
- Anything else ("slower", "no blur", "starts after the page loads") maps to
  the options below.

## Steps

1. Read the component. Find the parent that holds the items and the items
   themselves (list rows, buttons, cards). The items must be direct motion
   children of the parent for the stagger to reach them.
2. Call the hook once in the component:

   ```tsx
   import { useStaggerEnter } from "@/motion/staggerEnter";

   const { container, item } = useStaggerEnter({ from: "right" });
   ```

   Two groups in one component (like the dock) get two calls with their own
   names.
3. Make the parent a `motion.*` element with `variants={container}` and
   drive it with the variant names `"initial" | "animate" | "exit"`:
   - On mount: `initial="initial" animate="animate"`.
   - Toggled (a menu that opens): `initial={false}` and
     `animate={open ? "animate" : "exit"}`.
   - Leaving the tree: wrap in `AnimatePresence` and add `exit="exit"`.
4. Make each item `motion.*` with `variants={item}` and a stable `key`
   (the item's id, not the index when the list can change). Do not give
   items their own `initial`/`animate`; they inherit from the parent.
5. Run `npx tsc --noEmit -p .` and `npx eslint` on the changed files, then
   check it in the browser preview at the widths where it shows.

## Options

| Option     | Default   | Use                                             |
| ---------- | --------- | ----------------------------------------------- |
| `from`     | `"below"` | Side the items slide in from                    |
| `distance` | `60`      | Slide distance in px (px only, never CSS vars)  |
| `blur`     | `8`       | Starting blur in px; `0` for none               |
| `stagger`  | `0.03`    | Seconds between items; ~0.06 for 2–3 big items  |
| `delay`    | `0.04`    | Seconds before the first item                   |

Reduced motion is handled inside the hook: it falls back to a plain fade.
Outside a component, `getStaggerEnter({ ...options, reduceMotion })` returns
the same `{ container, item }`.

## Pitfalls

- **Glass inside an animated item.** Any `filter` on an ancestor, even
  `blur(0px)`, stops a descendant's `backdrop-filter` from seeing what's
  behind it. The module already clears the filter to `none` when an item
  settles. If you add your own blur animation on a wrapper of glass, end it
  with `transitionEnd: { filter: "none" }` too.
- **Items that also animate on their own** (open/close, hover). Put the
  stagger `variants` on a wrapper element and keep the item's own `animate`
  on the inner element, as the dock does with `.project-dock-enter`, so the
  two don't fight over the same properties.
- **Scroll containers.** Items rising in overhang their parent for a moment.
  If the parent scrolls, hide its scrollbar (`scrollbar-width: none`) or the
  scrollbar flashes and the width jumps.
- **Absolutely positioned items** wrapped for the stagger: give the wrapper
  the same box (`position: absolute; inset: 0`) so the item keeps
  positioning against it.
- Don't invent a new easing or spring for a one-off. If the feel needs to
  change everywhere, change `staggerEnter.ts`.
