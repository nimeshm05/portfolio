---
name: Wave emoji effect
overview: Replace the soon-line `:)` with a waving 👋 emoji that plays a short rotate wave after the word pull-up finishes.
todos:
  - id: wave-emoji
    content: Swap soon copy :) → 👋; add wave rotate after pull-up settles
    status: completed
isProject: false
---

# Wave emoji on soon message

## Copy

In [`ConnectPrompt.tsx`](src/components/ConnectPrompt/ConnectPrompt.tsx), update:

```ts
const PHONE_LABEL_SOON = "I'll see you soon my fren 👋";
```

Both sizers already render `PHONE_LABEL_SOON`, so fixed-width layout stays correct.

## Wave effect

In `WordPullText`, when a token is `👋`:

1. Still run the same staggered pull-up enter/exit as other words.
2. After enter settles, add a **wave rotate** on that token only:
   - `transformOrigin: "70% 90%"` (wrist-ish pivot)
   - rotate keyframes roughly `[0, 18, -8, 18, -4, 12, 0]`
   - delay ≈ word pull duration + that word’s stagger delay
   - duration ~1s, ease soft, **repeat 1–2 times** then stop (not infinite — avoids distraction on the home header)

Implement as a nested `motion.span` around the emoji (or `animate` rotate only when `pulled && animateEntrance` and token is wave), so pull-up `y`/`opacity`/`filter` stay on the outer word span.

Motion values live in [`src/motion/connectPrompt.ts`](src/motion/connectPrompt.ts) next to the existing phone word tokens (e.g. `phoneWaveRotate` + `phoneWaveTransition`).

## Out of scope

- Changing contact-line copy or options
- Continuous infinite waving
- Replacing other smileys elsewhere
