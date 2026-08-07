---
name: Early designs content
overview: Fill the Early Designs expandable items with Figma copy and closing paragraph, and render each iteration screenshot inside a ProjectBanner frame using the same background and sizing as the hero banner.
todos:
  - id: early-data
    content: Add closingParagraphs to earlyDesigns type and fill Figma copy + image paths
    status: completed
  - id: early-render
    content: Render Early Designs with ProjectBanner frames and closing paragraphs
    status: completed
isProject: false
---

# Early Designs content + banner frames

## Source

Figma node [`212:2482`](https://www.figma.com/design/7SObhe2tsBTV67x9WcOPsp/Portfolio?node-id=212-2482) — same section pattern as Discovery/Constraints (`ProjectSection` + expandable `ListItem`s). Local screenshots live in [`public/assets/projects/conversation-insights/initial-solution/`](public/assets/projects/conversation-insights/initial-solution/).

## Content updates in [`conversation-insights.ts`](src/data/projects/conversation-insights.ts)

Keep existing eyebrow / heading / intro. Fill each item and add a closing paragraph after the list.

| Item | Copy | Image |
|------|------|-------|
| Visualisation for Insights | Charts-anchored-middle paragraph from Figma | `initial-solution/Iteration 1 - Top View.png` |
| Data Table Operational Metadata | Table-follows-charts paragraph | `initial-solution/Iteration 1 - Bottom View.png` |
| Column and Date Filters | Filters-first paragraph | `initial-solution/Iteration 1 - Filters.png` |

Closing body (after list):

> The deeper constraint I was designing against: AI-derived signals and operational metadata had previously lived in separate places…

Icons stay as already mapped (`users`, `database`, `bug`) to match the Figma list-item instances. Reuse hero `background-1.png` as each framed image’s background via `project.bannerBackgroundSrc`.

## Types

Extend `earlyDesigns` in [`types.ts`](src/data/projects/types.ts):

```ts
earlyDesigns: {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  items: ExpandableItemContent[];
  closingParagraphs: string[];
};
```

## Rendering in [`ProjectPage.tsx`](src/components/ProjectPage/ProjectPage.tsx)

For Early Designs expandable panels only:

- Text via existing `RichText`
- Image via reusable [`ProjectBanner`](src/components/ProjectBanner/ProjectBanner.tsx) (same height `--size-banner-height`, breakout width, muted/pattern background, `object-fit: contain`) — not the plain `.list-item-media` img used in Discovery
- After the list, render `closingParagraphs` in a `project-section-body` block

```tsx
{item.imageSrc ? (
  <ProjectBanner
    src={item.imageSrc}
    alt={item.imageAlt ?? ""}
    backgroundSrc={project.bannerBackgroundSrc}
  />
) : null}
```

Discovery media stays on `.list-item-media` (diagram SVGs). No CSS changes required on `ProjectBanner` unless list-panel nesting needs a small wrapper for gap (existing list-item panel already uses `gap: var(--space-40)`).

## Scope

- [`src/data/projects/types.ts`](src/data/projects/types.ts)
- [`src/data/projects/conversation-insights.ts`](src/data/projects/conversation-insights.ts)
- [`src/components/ProjectPage/ProjectPage.tsx`](src/components/ProjectPage/ProjectPage.tsx)
