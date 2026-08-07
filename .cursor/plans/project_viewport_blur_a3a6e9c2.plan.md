---
name: Project viewport blur
overview: "Add a scroll-linked focus band on the project page: content outside the center 66% of the viewport stays blurred; when a block enters that band, Motion animates the blur to 0."
todos:
  - id: viewport-blur-component
    content: Add ViewportFocusBlur wrapper (useInView center 66% + Motion filter animate)
    status: completed
  - id: wire-project-content
    content: Wrap ProjectSection, Callout, and project-intro with the blur wrapper
    status: completed
  - id: reduced-motion
    content: Disable blur when prefers-reduced-motion is set
    status: completed
isProject: false
---

# Project page viewport focus blur

## Behavior

- Focus band = **middle 66% of viewport height** (≈17% inset from top and bottom).
- Content **outside** that band: blurred (reuse existing feel from home tab motion — `blur(8px)`).
- When a block **enters** the band: animate `filter` to `blur(0px)` with Motion.
- When it **leaves** again (scroll past): blur back on.
- Respect `prefers-reduced-motion`: skip blur (always sharp).
- Sidebar stays sharp (fixed chrome, not body content).

## Approach

Reusable wrapper `ViewportFocusBlur` that:

1. Uses Motion `useInView` with `margin: "-17% 0px -17% 0px"` so the observed region is the center 66% band.
2. Wraps children in `motion.div` and `animate`s `{ filter: inView ? "blur(0px)" : "blur(8px)" }` (plus slight opacity if it reads better — keep opacity at 1 unless needed).
3. Uses a short ease (~0.35–0.5s) consistent with existing Motion usage.

New file: [`src/motion/viewportFocusBlur.tsx`](src/motion/viewportFocusBlur.tsx) (or `src/components/ViewportFocusBlur/`) exporting the wrapper + shared transition constants.

## What gets wrapped

Each **direct content block** inside [`project-body`](src/components/ProjectPage/ProjectPage.tsx):

- `project-intro` (header + banner)
- each `ProjectSection`
- each `Callout`

Not every paragraph/list row — section-sized units keep the effect readable and avoid fighting expandable `ListItem` panels. Apply by wrapping in `ProjectPage` (or inside `ProjectSection`/`Callout` roots so call sites stay thin).

Preferred wiring: wrap at the root of [`ProjectSection`](src/components/ProjectSection/ProjectSection.tsx) and [`Callout`](src/components/Callout/Callout.tsx), plus wrap `project-intro` once in `ProjectPage`. That covers all project content without touching every map.

## CSS note

`filter: blur()` on a section can create a new stacking context and soft edges; keep wrapper `width: 100%` and avoid clipping. No Tailwind — plain CSS only if a class is needed for reduced-motion fallback.

## Out of scope

- Nested sidebar tree / home page tabs
- Continuous scroll-linked blur curves (`useScroll`/`useTransform`) — binary enter/leave with animated tween matches “the moment it enters… blur animates to 0”
