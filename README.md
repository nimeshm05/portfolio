# Personal portfolio

Personal site for myself. It is built with Next.js 16 (App Router), React 19, and Motion 13. Styling is plain CSS files plus a primitive → semantic token layer — no Tailwind.

The home page has Work and About tabs, list or card views for projects, and case-study pages at `/work/[slug]`. Copy and project data live in `src/data`; motion timings live in `src/motion`.

## Components

- **ArchitectureWorkflow** — Auto-rotating step diagram for the Architecture Agent product section.
- **Callout** — Serif pull-quote with a hanging quotation mark and optional attribution.
- **ConnectExcitement** — Inline SVG “yay” drawing that plays on Yes hover/click in Connect.
- **ConnectPrompt** — Multi-step contact flow (call, email, social) in the home header.
- **ContentSection** — Home section: label plus list items or project cards.
- **ContentTable** — Hairline study-design table used on project pages.
- **Header** — Profile avatar, name, bio, and Connect slot.
- **HomeFooter** — Full-width closing credit that types in as it enters view.
- **HomePage** — Home shell: header, Work/About tabs, sections, footer, sidebar.
- **HomeSidebar** — Scroll-aware in-page nav for Work card view.
- **Icon** — Shared Lucide icon set for list items, nav, and controls.
- **ListItem** — Row that links, expands, or stays open; used for work, about, and case-study lists.
- **MorphingArrowUpRight** — Chevron that becomes an external-link arrow on hover.
- **MorphingChevron** — Expand/collapse chevron that morphs between down and up.
- **MorphingConnectIcon** — Connect control icon that morphs between states.
- **PageEnter** — Page-load stagger: 40px rise, blur, and fade for home and project blocks.
- **ProjectBanner** — Case-study and card media (image or lazy video) with optional background.
- **LazyBannerVideo** — Defers banner video until near the viewport.
- **ProjectCard** — Work-tab card: title, type, banner, timeline, and description.
- **ProjectHeader** — Case-study title, subtitle, and mobile Back link.
- **ProjectPage** — Case-study layout: sidebar, intro, and all project sections.
- **ProjectSection** — Named case-study block with eyebrow, heading, and body.
- **ProjectSidebar** — Sticky case-study nav with Back and section anchors.
- **RichText** — Paragraphs with `**bold`** emphasis.
- **SegmentedControl** — Work / About tab switcher.
- **SidebarNav** — Shared sidebar list (home sections or project anchors, optional Back).
- **SourceCards** — Compact source/reference cards inside expandable case-study items.
- **ViewSwitcher** — List vs card toggle for the Work tab.
- **ViewportEdgeBlur** — Soft blur at the top and bottom of the viewport.
- **WorkflowSteps** — Numbered or labeled process steps in case studies.

