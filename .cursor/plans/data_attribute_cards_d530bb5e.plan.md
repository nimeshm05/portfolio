---
name: Data attribute cards
overview: Replace the Conversation Insights “What data did they use?” source cards with a new 9-tile attribute grid from Figma, using existing project tokens for type/spacing and new oklch tokens for the purple/red product colors. On desktop the grid bleeds past the project column like banners so the 4-across row is not packed.
todos:
  - id: tokens
    content: Add oklch primitives + semantic tokens for insight/operational card colors and stripe/rule sizes
    status: completed
  - id: component
    content: Create DataAttributeCards TSX/CSS using tokens, 4-col desktop bleed / 2-col tablet / 1-col mobile
    status: completed
  - id: wire-data
    content: Add types, replace CI source-cards data, render in ProjectPage, remove SourceCards
    status: completed
isProject: false
---

# Data attribute cards for Conversation Insights

G1 PASS — node `542:8168`: two rows of colored attribute tiles (purple insight types, red operational metadata), each with a top/bottom accent cap, short divider, title, and description. No images.

G2–G4 (to apply during implementation) — Next.js App Router + CSS modules-per-component (no Tailwind). Reuse expandable visual wiring in [`ProjectPage.tsx`](src/components/ProjectPage/ProjectPage.tsx), list-item panel layout, and tokens in [`primitives.css`](src/styles/tokens/primitives.css) / [`semantics.css`](src/styles/tokens/semantics.css). Figma colors become primitives → semantic roles; everything else maps to existing type/spacing tokens.

## Placement

In [`conversation-insights.ts`](src/data/projects/conversation-insights.ts), the “What data did they use?” expandable already renders copy then a `source-cards` visual. **Replace** that visual with the new grid. Keep the existing paragraph.

## Component

Add [`src/components/DataAttributeCards/DataAttributeCards.tsx`](src/components/DataAttributeCards/DataAttributeCards.tsx) + [`DataAttributeCards.css`](src/components/DataAttributeCards/DataAttributeCards.css).

Structure (data-driven, same pattern as [`WorkflowSteps`](src/components/WorkflowSteps/WorkflowSteps.tsx)):

```tsx
<ul className="data-attribute-cards">
  {cards.map((card) => (
    <li className={`data-attribute-card data-attribute-card--${card.tone}`}>
      <span className="data-attribute-card-rule" />
      <p className="data-attribute-card-title">{card.title}</p>
      <p className="data-attribute-card-description">{card.description}</p>
    </li>
  ))}
</ul>
```

Visual from Figma, adapted to codebase styles:

- **Colors** from Figma (converted to oklch primitives): insight `#6300aa` / `#d987ff`; operational `#cd204e` / `#eb727c` / `#ffb2b8`; titles stay white.
- **Caps:** top and bottom accent bars (Figma ~10.6px). Tokenize rather than hardcode.
- **Rule:** short rounded bar in the accent color, then title + description.
- **Typography/spacing:** existing tokens (`--font-size-18` / `--font-weight-bold` for titles, `--text-body-size` / `--weight-medium` / `--line-height-24` for descriptions, `--space-24` padding, `--gap-xl` gaps).
- **Radius:** use `--radius-lg` like other case-study cards (Figma tiles are square; the codebase rounds cards). Clip overflow so the caps follow the radius.
- **Dark mode:** keep these product colors (same approach as workflow chips). Do not invert them with the theme.

No icons or image assets in this node — nothing to download.

## Layout (responsive)

Figma is 4×2 at 1020px (four 240px tiles + 20px gaps). Project copy lives in a **34rem** column ([`--content-width-project`](src/styles/tokens/primitives.css)), which is too narrow for that row. **Do not** keep the grid inside the column.

Bleed on desktop the same way [`ProjectBanner.css`](src/components/ProjectBanner/ProjectBanner.css) does: at `min-width: 68.75rem`, set width/max-width to `min(var(--width-data-attribute-cards), calc(100vw - 2 * var(--inset-x)))` and center with negative `margin-inline`. Tokenize `--layout-data-attribute-cards-width: 63.75rem` (1020px) in primitives and `--width-data-attribute-cards` in semantics.

- Desktop `≥ 68.75rem`: 4 columns, banner-style bleed, Figma padding (`--space-24`) and gaps (`--gap-xl`)
- Tablet `≤ 68.6875rem`: 2 columns, no bleed (list-item panel clips overflow-x)
- Mobile `≤ 39.9375rem`: 1 column

Cards stretch fluidly inside the bled or in-column track; no fixed 240px widths. Cap bleed with the viewport so the page does not scroll horizontally.

## Tokens

Add oklch primitives for the five Figma colors (convert hex → oklch during implementation; do not leave hex in CSS).

Semantic roles in [`semantics.css`](src/styles/tokens/semantics.css), for example:

- `--color-data-insight-surface` / `--color-data-insight-accent` / `--color-data-insight-copy`
- `--color-data-operational-surface` / `--color-data-operational-accent` / `--color-data-operational-copy`
- `--color-data-attribute-title` → `--color-white`
- `--width-data-attribute-cards` → `--layout-data-attribute-cards-width` (`63.75rem`)
- stripe thickness, rule width/height if no existing size is close enough

Component CSS only references semantic tokens.

## Data and wiring

Extend [`types.ts`](src/data/projects/types.ts):

```ts
export type DataAttributeTone = "insight" | "operational";
export type DataAttributeCard = {
  title: string;
  description: string;
  tone: DataAttributeTone;
};
```

Add `{ type: "data-attribute-cards"; cards: DataAttributeCard[] }` to `ExpandableVisual`. Remove `SourceCard` and `"source-cards"` if unused.

Copy for the CI item (4 insight from Figma, 5 operational from you):

- **Insight:** Primary Topics; Customer Intent; Journey Moments; Root Causes (Figma descriptions)
- **Operational:** Interaction Duration — Length of each customer interaction; Routing Profile — How interactions were routed internally; Agent Username — Employee handling the customer interaction; Queue Name — Queue where interaction was handled; 60+ Attributes — Additional operational data about interactions

In [`ProjectPage.tsx`](src/components/ProjectPage/ProjectPage.tsx), render `DataAttributeCards` for the new visual type. Delete [`SourceCards/`](src/components/SourceCards/) once nothing imports it.

## Verify

On `/work/conversation-insights`, expand “What data did they use?” and check:

- Paragraph still first, then the grid (no RozieAI/AWS source cards)
- Desktop ~1440: 4-across row bleeds past the 34rem column, tiles not packed, no page-level horizontal scroll
- Laptop ~1024 / tablet ~768: 2 columns in the project column
- Mobile ~375: single column, readable type, comfortable spacing
- Light and dark: purple/red tiles unchanged, surrounding page theme still works
