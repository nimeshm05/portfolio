# ConnectPrompt Component Architecture & Design

A comprehensive technical breakdown of the interactive multi-step connection dialog component from nimeshm05's portfolio.

---

## 📋 Overview

**ConnectPrompt** is a sophisticated, multi-stage interactive component that guides users through a connection flow with delightful animations and micro-interactions. It follows a linear conversation-like progression with 5 distinct steps, each building upon the previous selection.

**Key Characteristics:**
- 🎭 Multi-step state machine (5 steps)
- ✨ Rich animation framework using Framer Motion
- 📱 Fully responsive and accessible
- 🎨 Data-driven with contact information
- 🪟 Visibility-aware (resets when scrolled out of view)

---

## 🏗️ Component Tree

```
ConnectPrompt (Main Container)
│
├── Reset Button
│   └── MorphingConnectIcon
│       ├── Motion Rect (top-left square)
│       ├── Motion Rect (bottom-right square)
│       ├── Motion Path (primary connection line)
│       └── Motion Path (secondary connection line - dash animation)
│
└── AnimatePresence (Step content)
    ├── [Step: "invite"]
    │   ├── PromptText ("Wanna Connect?")
    │   ├── ConnectExcitement (conditionally rendered on hover)
    │   │   └── SVG with animated legs and "YAY" text
    │   └── Options
    │       └── PromptAction ("Yes")
    │
    ├── [Step: "prefer"]
    │   ├── PromptText ("How do you prefer?")
    │   └── Options
    │       ├── PromptAction ("Social Media")
    │       └── PromptAction ("In Person")
    │
    ├── [Step: "social"]
    │   ├── PromptText ("My handles:")
    │   └── Options
    │       ├── PromptLink (LinkedIn)
    │       ├── PromptLink (Github)
    │       ├── PromptLink (X/Twitter)
    │       ├── PromptLink (Medium)
    │       └── PromptLink (Email)
    │
    ├── [Step: "inPerson"]
    │   ├── Coffee Phrase
    │   │   ├── PromptText ("Cup of")
    │   │   ├── AnimatedCoffeeIcon
    │   │   │   └── Motion Paths (3 steam lines)
    │   │   └── PromptText ("sometime in Seattle?")
    │   └── Options
    │       ├── PromptAction ("Cool")
    │       └── PromptAction ("Nah, something else?")
    │
    └── [Step: "phone"]
        ├── PhoneLabelSlot
        │   ├── Sizer spans (for layout stability)
        │   └── WordPullText (animated label transitions)
        │       └── Motion words with staggered entry/exit
        └── Options
            ├── PromptLink (phone number)
            └── PromptLink (email)
```

---

## 🔄 State Management & Flow

### Core State Variables

| State | Type | Purpose |
|-------|------|---------|
| `step` | `ConnectStep` | Current wizard step ("invite" \| "prefer" \| "social" \| "inPerson" \| "phone") |
| `phoneLabel` | `PhoneLabel` | Toggles between two phone screen messages ("contact" \| "soon") |
| `yesHovered` | `boolean` | Tracks "Yes" button hover state for excitement animation |
| `burstExitMode` | `ExcitementExitMode` | Controls excitement animation exit ("reverse" \| "smoke") |

### Ref-based State (Non-rendering side effects)

| Ref | Type | Purpose |
|-----|------|---------|
| `previousTabRef` | `useRef<HomeTab>` | Tracks active tab from parent to detect changes |
| `rootRef` | `useRef<HTMLDivElement>` | Reference to root element for Intersection Observer |
| `smokingRef` | `useRef<boolean>` | Flag to prevent interactions during smoke exit animation |
| `smokeTimeoutRef` | `useRef<number>` | Store timeout ID for cleanup |

### State Machine Flow Diagram

```
START
  ↓
[invite] ← "Wanna Connect?"
  ↓ (click "Yes" with hover OR without)
  ↓ (if hovered: shows excitement animation → smoke exit → 300ms delay)
  ↓
[prefer] ← "How do you prefer?"
  ├→ "Social Media" → [social] → displays LinkedIn/GitHub/X/Medium/Email links
  └→ "In Person" → [inPerson] → "Cup of ☕ sometime in Seattle?"
                     ↓
                   [phone] ← Shows phone & email with animated label transition
```

---

## ✨ Animation Architecture

### 1. **Phone Label Transition** (`WordPullText` Component)

**Purpose:** Smoothly transition between two different messages with word-level pull-up animation.

**Mechanism:**
- Text is split into words
- Each word animates from below (offset by `1.15em`) with blur
- Words enter with staggered timing: `index * 0.05 seconds`
- Exit uses same offset reversed

**Key Timings:**
```javascript
phoneWordTransition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
phoneWordStaggerSeconds = 0.05
phoneWordEnter = { y: "0em", opacity: 1, filter: "blur(0px)" }
phoneWordHiddenBelow = { y: "1.15em", opacity: 0, filter: "blur(8px)" }
```

**Special Handling:**
- Wave emoji 👋 receives additional rotation animation (`phoneWaveRotate: [0, 18, -8, 18, -4, 12, 0]`)
- Used in message: "I'll see you soon my fren 👋"
- Wave transitions are 1 second duration with specific timing curve

### 2. **Excitement Animation** (`ConnectExcitement` Component)

**Triggered:** When user hovers over "Yes" button (on hover-capable devices)

**Components:**
1. **Animated Legs** (4 SVG lines)
   - Draw sequentially with stagger: `0.03 seconds` between each
   - Duration: `0.2 seconds` per leg
   - Easing: `[0.22, 1, 0.36, 1]` (bounce-like curve)

2. **"YAY" Text Path**
   - Starts as stroke that animates to full path (0 → 1)
   - Then fills with opacity transition
   - Staggered after legs complete: `4 * 0.03 = 0.12 seconds` delay

**Exit Modes:**
- **"reverse"**: Animate back to undrawn state (line unsheathes)
- **"smoke"**: Quick blur and fade out in 160ms (no reverse animation)

**Motion Reduction Support:**
- If `prefers-reduced-motion` detected: all animations become instantaneous
- Preserves visual state but removes motion

### 3. **Coffee Steam Animation** (`AnimatedCoffeeIcon`)

**Mechanism:**
- 3 separate steam lines (paths)
- Each has staggered infinite loop
- Move up 3px + opacity pulse: `[0, 1, 0]`
- Duration: 1.5 seconds with custom delay per line

```javascript
coffeeSteamVariants = {
  normal: { y: 0, opacity: 1 },
  animate: (custom: number) => ({
    y: -3,
    opacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "easeInOut",
      delay: 0.2 * custom  // 0 / 0.2 / 0.4 seconds
    },
  }),
}
```

### 4. **Step Transition Animation**

All step content uses the same blur-based transition:
```javascript
tabContentBlurVariants = {
  initial: { opacity: 0, filter: "blur(8px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(8px)" },
}

tabContentTransition = { duration: 0.2, ease: "easeInOut" }
```

### 5. **Reset Icon Morphing** (`MorphingConnectIcon`)

**Purpose:** Visual feedback for the reset button state

**Animations:**
- **Position**: Top-left square moves from (3,3) to (2,2) OR (13,13) to (14,14)
- **Primary Path**: Morphs between workflow connection path and send-to-back path
- **Secondary Path**: Dash animation with offset toggle

All animations: 0.2s with `easeInOut`

---

## 🎯 Event Handling & User Interactions

### The "Yes" Button (Multi-state)

```javascript
onMouseEnter/onFocus: {
  // Only trigger on hover-capable devices AND not already smoking
  if (smokingRef.current || !window.matchMedia("(hover: hover)").matches) return;
  setBurstExitMode("reverse");
  setYesHovered(true);  // Shows excitement animation
}

onClick: {
  if (yesHovered) {
    // Hovered click: show excitement exit animation (smoke)
    smokingRef.current = true;
    setBurstExitMode("smoke");
    // Schedule state transition after animation
    setTimeout(() => setStep("prefer"), 300ms);
  } else {
    // Direct click: no excitement animation
    setStep("prefer");
  }
}
```

**Why this complexity?**
- Rewards hover interaction with animation
- Works on touch devices (skips excitement)
- Prevents state changes during animation (`smokingRef` guard)

### Scroll-aware Reset

When user scrolls the component out of view:
```javascript
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) {
      reset();  // Resets to "invite" step
    }
  }, { threshold: 0 });
  
  observer.observe(rootRef.current);
}, [isInvite]);
```

**Purpose:** Clean UX - component resets when user leaves it

### Tab Switching Behavior

```javascript
useEffect(() => {
  // Detect when activeTab prop changes (Work ↔ About tabs)
  if (previousTab === activeTab) return;
  
  // Reset component if not on invite step
  if (!isInvite) {
    reset();
  }
  previousTabRef.current = activeTab;
}, [activeTab, isInvite]);
```

---

## 🧩 Sub-Component Details

### PromptText
- Simple wrapper applying `.connect-prompt-text` class
- Color transitions on excitement state

### PromptAction (Button)
- Fully accessible button element
- Supports mouse, focus, and blur events
- Active state: scale down 2% with fast transition
- Inactive color: subtle text
- Hover/Focus color: primary text

### PromptLink (Anchor)
- Renders `<a>` with class matching PromptAction
- Auto-detects external URLs → opens in new tab
- Handles both http/https external links and internal routes

### Options (Container)
- Flexbox layout with items separated by "/"
- Configurable items array with keys and nodes

### PhoneLabelSlot
- **Grid-based layout** (single cell, multiple overlays)
- Two invisible "sizer" spans set width for both possible messages
- Animated `WordPullText` overlaid on same grid cell
- Uses `aria-hidden` on sizers to prevent screen reader duplication

---

## 📊 Data Integration

Contact information flows from `src/data/home.ts`:

```typescript
export const connect = {
  phoneDisplay: "+1 (253) 408-1856",
  phoneHref: "tel:+12534081856",
  email: "nimeshm.work@gmail.com",
  emailHref: "mailto:nimeshm.work@gmail.com",
  linkedInHref: "https://www.linkedin.com/in/nimeshm-work/",
  githubHref: "https://github.com/nimeshm05",
  xHref: "https://x.com/hoveroverhere",
  mediumHref: "https://nimeshmohanakrishnan.medium.com/"
}
```

**Usage Pattern:**
- `<PromptLink href={connect.linkedInHref}>LinkedIn</PromptLink>`
- All socials are external (open in new tab)
- Phone uses `tel:` protocol
- Email uses `mailto:` protocol

---

## 🎨 Styling Strategy

### CSS Architecture (BEM-inspired)

| Class | Purpose |
|-------|---------|
| `.connect-prompt` | Root container, flex layout |
| `.connect-prompt--follow-up` | Modifier for non-invite steps (color variant) |
| `.connect-prompt-step` | Animated step content wrapper |
| `.connect-prompt-text` | Text styling with color transition |
| `.connect-prompt-action` | Button/link base styling |
| `.connect-prompt-options` | Container for option items |
| `.connect-prompt-separator` | "/" divider between options |
| `.connect-prompt-reset` | Icon button (hidden on invite step) |
| `.connect-prompt-phone-label` | Grid container for label animation |
| `.connect-prompt-phone-label-motion` | Animated label (grid-area: 1/1) |
| `.connect-prompt-word-mask` | Overflow hidden container for pull-up |
| `.connect-prompt-wave` | Wave emoji with rotation origin |

### Design Tokens Used

```css
--gap-md          /* Horizontal spacing between prompt and options */
--gap-xs          /* Padding/gaps in options */
--gap-connect     /* Gap between coffee icon and text */
--color-text-label
--color-text-subtle
--color-text-primary
--color-accent    /* Color when excited */
--color-connect-prompt-follow-up  /* Follow-up step text */
--icon-size       /* Reset button size */
--icon-size-coffee /* Coffee icon size */
--color-icon-coffee
--text-list-size
--text-list-weight
--text-list-line-height
--transition-fast /* Color transitions */
```

---

## 🔐 Accessibility Features

### ARIA Attributes
- `role="button"` implicit from `<button>` element
- `aria-hidden="true"` on animation elements (legs, enthusiasm)
- `aria-hidden="true"` on non-interactive decorations
- `aria-label="Start over"` on reset button
- `aria-live="polite"` on root for screen reader announcements

### Keyboard Navigation
- All buttons fully keyboard accessible
- Tab order preserved through steps
- Focus indicators from button styles
- Reset button `tabIndex={-1}` when disabled/invite step

### Screen Reader Optimization
- Sizer spans marked `aria-hidden` to prevent duplicate readings
- Content hierarchy preserved with semantic HTML
- No animated SVG paths announce to assistive tech

### Responsive Handling
- Media query: `(hover: hover)` detects hover capability
- Touch devices skip excitement animation (no false interactivity)
- Mobile-friendly button sizing and spacing

---

## 🔧 Technical Considerations

### Performance Optimizations

1. **Ref-based Flags**: `smokingRef` prevents simultaneous animations
2. **Staggered Animations**: Spread motion load (`0.03s` stagger prevents jank)
3. **Motion Reduction**: Respects `prefers-reduced-motion` system preference
4. **Cleanup**: All timeouts and observers properly cleaned up

### Edge Cases Handled

| Case | Handling |
|------|----------|
| Tab switch during animation | Reset called, animation halted |
| Scroll out of view | IntersectionObserver triggers reset |
| Screen resizer | No explicit handling (flex layout adapts) |
| Touch device | Skips hover excitement (uses direct click) |
| Reduced motion preference | All animation becomes instant |
| Multiple clicks on "Yes" | `smokingRef` prevents double-trigger |
| Rapid step changes | `AnimatePresence mode="wait"` ensures sequential animation |

### Browser Compatibility Notes

- **Framer Motion (motion/react)**: Modern browsers with CSS animation support
- **IntersectionObserver**: Polyfill recommended for IE11
- **CSS Grid**: Used in PhoneLabelSlot (IE11 support available)
- **SVG Animations**: Widely supported, hardware accelerated in modern browsers

---

## 🎓 Design Patterns Used

### 1. **State Machine Pattern**
- Explicit ConnectStep enum type
- Switch statement for step-based rendering
- Clear state transitions

### 2. **Compound Component Pattern**
- PromptText, PromptAction, PromptLink are atomic
- Options composes multiple items
- Each handles own styling/behavior

### 3. **Animation Container Pattern**
- AnimatePresence wraps all step changes
- Decouples animation logic from state transitions
- Motion/exit timing separate from React lifecycle

### 4. **Progressive Disclosure**
- Step-by-step revealing of options
- Guided conversational flow
- Reduces cognitive load

### 5. **Intersection Observer Pattern**
- Detects visibility without polling
- Reactive cleanup
- Efficient performance monitoring

---

## 📝 Constants & Magic Numbers

| Constant | Value | Used For |
|----------|-------|----------|
| `PHONE_LABEL_DELAY_MS` | 1500 | Delay before "contact" → "soon" message |
| `phoneWordStaggerSeconds` | 0.05 | Delay between word animations |
| `excitementLegStaggerSeconds` | 0.03 | Delay between leg draws |
| `PHONE_WAVE_EMOJI` | "👋" | Wave emoji identifier |
| Phone wave duration | 1.0s | Full rotation cycle |
| Excitement smoke duration | 0.16s | Exit animation length |
| Step blur transition | 0.2s | Content fade between steps |
| Smoke timeout | 300ms | `excitementSmokeTransition.duration * 1000` |

---

## 🚀 Extension Points

### Adding New Steps
1. Add to `ConnectStep` type
2. Add case to switch statement
3. Define content JSX
4. Add state transition logic

### Customizing Animations
1. Edit `/src/motion/connectPrompt.ts` for timing/easing
2. Modify `ConnectExcitement.tsx` for excitement visual
3. Adjust `.css` file for layout-based animations

### Changing Contact Data
- Edit `/src/data/home.ts` `connect` object
- Component references automatically update
- No component code changes needed

---

## 📚 Related Files

```
src/
├── components/
│   ├── ConnectPrompt/
│   │   ├── ConnectPrompt.tsx          (main component)
│   │   └── ConnectPrompt.css          (styling)
│   ├── ConnectExcitement/
│   │   ├── ConnectExcitement.tsx      (excitement animation)
│   │   ├── excitementYayPath.ts       (SVG path constant)
│   │   └── ConnectExcitement.css
│   ├── AnimatedCoffeeIcon/
│   │   ├── AnimatedCoffeeIcon.tsx     (coffee steam animation)
│   │   └── AnimatedCoffeeIcon.css
│   └── MorphingConnectIcon/
│       ├── MorphingConnectIcon.tsx    (reset button icon)
│       └── MorphingConnectIcon.css
├── motion/
│   ├── connectPrompt.ts               (animation constants)
│   └── tabContent.ts                  (step transition variants)
└── data/
    └── home.ts                        (contact information)
```

---

## 🎯 Summary

The **ConnectPrompt** component exemplifies modern React interactive design through:

- **State Management**: Clear, ref-augmented state for animations
- **Animation**: Sophisticated Framer Motion choreography with motion reduction support
- **UX**: Progressive disclosure with delightful micro-interactions
- **Accessibility**: Semantic HTML with ARIA, keyboard support, and screen reader optimization
- **Code Quality**: Modular sub-components, clean separation of concerns
- **Performance**: Efficient animation sequencing, proper cleanup, responsive behavior

It's a masterclass in combining **developer experience** (clean architecture) with **user experience** (delightful interactions).
