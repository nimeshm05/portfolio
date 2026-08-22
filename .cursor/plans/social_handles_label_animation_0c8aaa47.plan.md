---
name: Social handles label animation
overview: Reuse the phone-step word-pull animation in ConnectPrompt so the social step transitions from "My handles:" to "See ya 👋" after the same delay.
todos:
  - id: generalize-label-slot
    content: Generalize PhoneLabelSlot/WordPullText usage for social + phone label pairs
    status: completed
  - id: social-state-effect
    content: Add social label state + 1.5s delay effect on social step
    status: completed
  - id: wire-social-ui
    content: "Replace static My handles: PromptText with animated label slot"
    status: completed
isProject: false
---

# Social handles label animation

## Behavior

On the `social` step in [`ConnectPrompt.tsx`](src/components/ConnectPrompt/ConnectPrompt.tsx):

1. Show **My handles:** on enter
2. After **1500ms** (same as `PHONE_LABEL_DELAY_MS`), word-pull swap to **See ya 👋** with the same wave animation used on the phone “soon” line
3. Social links stay visible and clickable during/after the swap

Trigger is step entry (clicking “Social Media”), matching the phone pattern—not a click on LinkedIn/Github/etc.

## Implementation

Reuse the existing `WordPullText` / label-slot machinery; generalize naming slightly so it isn’t phone-only.

In [`ConnectPrompt.tsx`](src/components/ConnectPrompt/ConnectPrompt.tsx):

- Add social label constants next to the phone ones:
  - `SOCIAL_LABEL_HANDLES = "My handles:"`
  - `SOCIAL_LABEL_BYE = \`See ya ${PHONE_WAVE_EMOJI}\``
- Add `SocialLabel = "handles" | "bye"` state, reset/set via `useEffect` when `step === "social"` (same structure as the phone `useEffect` around lines 320–334)
- Extract or duplicate `PhoneLabelSlot` as a shared `PullLabelSlot` that takes `{ active, idleText, activeText }` (idle = no entrance pull; active = pull + wave). Wire phone to contact/soon and social to handles/bye
- In the `social` case, replace `<PromptText>My handles:</PromptText>` with `<PullLabelSlot … />`

CSS in [`ConnectPrompt.css`](src/components/ConnectPrompt/ConnectPrompt.css): keep using the existing `.connect-prompt-phone-label*` / word-mask classes (or rename to `.connect-prompt-pull-label*` if renaming for clarity—behavior unchanged). Dual sizers remain so width doesn’t jump between the short and long strings.

No changes needed in [`src/motion/connectPrompt.ts`](src/motion/connectPrompt.ts)—reuse `PHONE_WAVE_EMOJI`, word, and wave motion tokens.

## Out of scope

- Changing phone copy or timing
- Firing the swap on individual social link clicks
- Resume / other home prompts
