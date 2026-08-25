---
name: Cuelume interaction sounds
overview: Install Cuelume, bind it once, and replace the generic click WAV with mapped interaction sounds while keeping the existing page-transition MP3 for work navigations.
todos:
  - id: install-cuelume
    content: Install the cuelume package
    status: completed
  - id: bootstrap-bind
    content: Call bind() from ClickSound, keep page-transition MP3, play press on other clickable controls
    status: completed
  - id: tag-specials
    content: Add toggle/success/arrival/bloom attributes on ViewSwitcher and ConnectPrompt
    status: completed
  - id: verify-browser
    content: Verify each mapped interaction and that page-transition MP3 still plays
    status: completed
isProject: false
---

# Add Cuelume interaction sounds

Install [cuelume](https://www.npmjs.com/package/cuelume) and replace the generic click WAV with its synthesized palette. Keep the existing page-transition MP3 for work navigations.

## Sound map

- **press** — any mouse click on a clickable control (buttons, links, tabs, etc.), except the cases below
- **toggle** — [ViewSwitcher](src/components/ViewSwitcher/ViewSwitcher.tsx) options
- **success** — in-flow Connect options (`PromptAction`: Sure, Social Media, In Person, Cool, etc.)
- **arrival** — Connect outbound links (`PromptLink`: LinkedIn, Github, X, Medium, Email, phone)
- **bloom** — Connect left-arrow reset (only when it is actually the left arrow, not the disabled invite state)
- **page-transition.mp3** — unchanged for `.project-card`, `a.list-item[href^="/work/"]`, `.sidebar-nav-back`, `.project-back-mobile`

No hover, release, or mute control unless you ask for them later.

## Wiring

1. `npm install cuelume`

2. Evolve [ClickSound.tsx](src/components/ClickSound/ClickSound.tsx) into the single audio bootstrap:
   - Call `bind()` once in `useEffect` (React recipe from Cuelume)
   - Drop `/assets/click-prompt.wav`
   - Keep the page-transition MP3 path and selector as they are today
   - For other left-click `pointerdown` events, if the target is a clickable control and is **not** already handled by a `data-cuelume-*` attribute or the page-transition selector, call `play("press")`

   Clickable means real controls (`a[href]`, `button:not(:disabled)`, `[role="button"]`, `[role="tab"]`), not empty-page clicks. That is stricter than today’s “any pointerdown anywhere” behavior.

   Skip `play("press")` when `closest("[data-cuelume-press], [data-cuelume-toggle]")` matches, so ViewSwitcher and Connect do not double-fire.

3. Tag specials (Cuelume uses `closest()`, so the attribute goes on the interactive element):

   - [ViewSwitcher.tsx](src/components/ViewSwitcher/ViewSwitcher.tsx) — `data-cuelume-toggle` on each option button
   - [ConnectPrompt.tsx](src/components/ConnectPrompt/ConnectPrompt.tsx)
     - `PromptAction`: `data-cuelume-press="success"`
     - `PromptLink`: `data-cuelume-press="arrival"`
     - Reset button: `data-cuelume-press="bloom"` only when `!isInvite`

`ClickSound` stays mounted in [layout.tsx](src/app/layout.tsx). No new CSS or tokens.

```mermaid
flowchart TD
  pointerDown[pointerdown on left click]
  pointerDown --> pageNav{page-transition selector?}
  pageNav -->|yes| mp3[play page-transition.mp3]
  pageNav -->|no| cuelumeAttr{data-cuelume-press or toggle?}
  cuelumeAttr -->|yes| bindPlay[bind plays mapped sound]
  cuelumeAttr -->|no| isControl{clickable control?}
  isControl -->|yes| press[play press]
  isControl -->|no| silent[no sound]
```

## Verify in the browser

- Generic controls (theme toggle, header avatar, footer links, segmented tabs, gallery close) play **press**
- Clicking empty canvas does **not** play a sound
- ViewSwitcher plays **toggle** only (no extra press)
- Connect in-flow options play **success**; outbound links play **arrival**; left arrow plays **bloom**
- Project cards, work list links, and back links still play the MP3
