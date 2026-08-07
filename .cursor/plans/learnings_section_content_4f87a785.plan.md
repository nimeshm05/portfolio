---
name: Learnings section content
overview: Add the Conversation Insights Learnings section from Figma using the same ProjectSection + expandable ListItem + ProjectBanner pattern as Early Designs, wired to the local `learnings/` screenshots.
todos:
  - id: learnings-types-icon
    content: Add learnings to ProjectPageData types and settings icon to Icon
    status: completed
  - id: learnings-data
    content: Fill conversation-insights learnings copy, images, and nav href from Figma
    status: completed
  - id: learnings-render
    content: Render Learnings ProjectSection after Early Designs with ProjectBanner media
    status: completed
isProject: false
---

# Learnings section (Conversation Insights)

## Source

Figma node [`214:2621`](https://www.figma.com/design/7SObhe2tsBTV67x9WcOPsp/Portfolio?node-id=214-2621) (frame named “Early Designs” in Figma; content is Learnings). Local images already in [`public/assets/projects/conversation-insights/learnings/`](public/assets/projects/conversation-insights/learnings/):

- `old-chart.png` — first expandable item
- `old-filters.png` — second expandable item
- Third item is text-only (no image in Figma)

Use these local files, not the placeholder diagram still embedded in the Figma frame.

## Content (from Figma)

**Eyebrow:** Learnings from User Test Sessions  
**Heading:** Evolving designs based on user feedback and constraints  
**Intro:** After releasing the first version of the product, we conducted weekly feedback calls with our users to identify points of friction and additional requirements. Here's a list of all the problems from multiple user test sessions.

| Item | Icon | Image |
|------|------|-------|
| Users preferred direct answers | `users` | `learnings/old-chart.png` |
| Filtering didn't scale with complex investigations. | `database` | `learnings/old-filters.png` |
| A gap in discovery, not a cut made under pressure. | `settings` (new) | none |

Body copy for each item is the multi-paragraph text from Figma (two paragraphs for items 1–2, one for item 3).

## Types

Extend [`src/data/projects/types.ts`](src/data/projects/types.ts) with a `learnings` block matching discovery-style sections (no `closingParagraphs`):

```ts
learnings: {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  items: ExpandableItemContent[];
};
```

## Data

In [`src/data/projects/conversation-insights.ts`](src/data/projects/conversation-insights.ts):

- Fill `learnings` with the Figma copy + image paths/alts
- Set nav item to `{ id: "learnings", label: "Learnings", href: "#learnings" }`

## Icon

Add Lucide `Settings` as `"settings"` in [`src/components/Icon/Icon.tsx`](src/components/Icon/Icon.tsx) for the third list item (gear icon in Figma).

## Rendering

In [`src/components/ProjectPage/ProjectPage.tsx`](src/components/ProjectPage/ProjectPage.tsx), after Early Designs, add a `ProjectSection` with `id="learnings"` mirroring Early Designs:

- Intro paragraphs in `project-section-body`
- Expandable `ListItem`s with `RichText`
- Item images via `ProjectBanner` + `project.bannerBackgroundSrc` (same framed screenshot treatment as Early Designs, not Discovery’s plain `.list-item-media`)

No new CSS components required.