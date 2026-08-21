---
name: Media tray skill
overview: Add a project Agent Skill that documents the shared outer-tray + inner-frame styling used by project section media, source cards, and workflow steps, so new image/video UI reuses the same tokens and structure without re-prompting.
todos:
  - id: write-media-tray-skill
    content: Create .cursor/skills/project-media-tray/SKILL.md with tray/frame token recipe, video clip rules, and checklist
    status: pending
isProject: false
---

# Project media tray skill

## Goal

Codify the repeated **muted tray + inset framed content** pattern so any new image/video (or similar inset content) on project pages matches existing case-study surfaces.

Canonical references:

- Outer tray: [`.project-section-media`](src/components/ProjectPage/ProjectPage.css), [`.source-card-container`](src/components/SourceCards/SourceCards.css), [`.workflow-steps`](src/components/WorkflowSteps/WorkflowSteps.css)
- Inner frame: [`.project-section-media-frame`](src/components/ProjectPage/ProjectPage.css), [`.source-card`](src/components/SourceCards/SourceCards.css), [`.workflow-step`](src/components/WorkflowSteps/WorkflowSteps.css)

## Location

Create as a **project skill** at [`.cursor/skills/project-media-tray/SKILL.md`](.cursor/skills/project-media-tray/SKILL.md) (repo-local; auto-available in this portfolio). Complement—not replace—[`style-organisation-skill`](file:///Users/nimeshmohanakrishnan/.cursor/skills/style-organisation-skill/SKILL.md) (tokens) and [`responsive-portfolio-skill`](file:///Users/nimeshmohanakrishnan/.cursor/skills/responsive-portfolio-skill/SKILL.md).

Omit `disable-model-invocation` so the agent can auto-load it when adding project media/CSS.

## Skill contents

**Frontmatter**

- `name`: `project-media-tray`
- `description`: third-person, trigger terms: project section media, image/video embeds, source cards, workflow steps, case-study trays, bordered media frames, `problem.mp4`-style section media

**Body (rules the agent must follow)**

1. **Two-layer composition (required)**
   - Outer tray: muted well around content
   - Inner frame: surface that holds media or content
   - Do not flatten into a single bordered box unless an existing component already does that for a clear reason

2. **Token recipe (use these exact semantic tokens)**

   Outer tray:
   - `padding: var(--padding-card-block)`
   - `background-color: var(--color-bg-muted)`
   - `border-radius: var(--radius-xl)`
   - `border: var(--border-card)`

   Inner frame:
   - `border-radius: var(--radius-lg)`
   - `border: var(--border-card)`
   - `background-color: var(--color-bg-surface)` (or `var(--color-white)` only if matching an existing sibling that already uses white)
   - `box-shadow: var(--shadow-card)`

3. **Media behavior**
   - Images and videos share the same tray/frame chrome
   - Prefer the existing `SectionMedia` pattern in [`ProjectPage.tsx`](src/components/ProjectPage/ProjectPage.tsx) for section-level `imageSrc` (extension-based image vs video)
   - Media fills the frame: `display: block; width: 100%; height: auto`
   - For `<video>`: clip on the **frame** (`overflow: hidden` + `clip-path: inset(0 round var(--radius-lg))` + mask), do not rely on radius on the video alone (avoids black corner fringe)
   - Do not wrap section media in `ProjectBanner` unless building a hero/banner

4. **Layout / spacing**
   - Tray and section copy use `padding-inline: var(--inset-x)` when sitting in project sections (match `.project-section-media`)
   - Keep gaps between sibling trays/cards via existing section/list gaps (`--gap-xl`, `--gap-md`, etc.)—do not invent one-off padding

5. **Hard rules**
   - No hardcoded colors, radii, shadows, or px dimensions (defer to style-organisation-skill)
   - Plain CSS files next to components; no Tailwind
   - When adding a new media surface, copy this tray/frame structure first, then specialize content inside the frame

6. **Checklist** (agent self-check before finishing)
   - Outer uses muted + xl radius + card border + card-block padding
   - Inner uses lg radius + card border + card shadow
   - Video corners clipped on the frame
   - Tokens only; matches SourceCards / WorkflowSteps / section media

No code/CSS refactors in this task—skill documentation only. (Optional later: extract shared CSS classes; out of scope unless requested.)
