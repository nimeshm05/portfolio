---
name: Home list updates
overview: Update home page Work list data to hide Discovery Responses, replace the Writing section with one Medium article link, and register the Lucide `notebook-pen` icon for that item.
todos:
  - id: update-home-data
    content: Remove discovery-responses from industry projects; replace Writing section with Medium article item in home.ts
    status: completed
  - id: add-notebook-pen-icon
    content: Register notebook-pen in Icon.tsx (import, IconName union, icons map)
    status: completed
  - id: external-list-links
    content: Add http external link handling (target=_blank, rel) to ListItem.tsx
    status: completed
isProject: false
---

# Home list content updates

## Scope

Three targeted changes, all driven from existing data/icon patterns:

1. Hide **Discovery Responses** from the home Work list (project route/data stays intact)
2. Replace **Writing** section with one external article
3. Add **notebook-pen** Lucide icon for the writing item

## 1. Update home data — [`src/data/home.ts`](src/data/home.ts)

**Industry Projects:** Remove the `discovery-responses` entry from `workSections[0].items` (lines 60–65). No changes to project files under `src/data/projects/`.

**Writing section:** Replace the two placeholder items with a single item:

```ts
{
  id: "designing-beyond-the-interface",
  title: "Designing beyond the interface",
  icon: "notebook-pen",
  href: "https://nimeshmohanakrishnan.medium.com/designing-beyond-the-interface-what-contact-centers-taught-me-about-systems-thinking-ac164a68cc36",
}
```

## 2. Register Lucide icon — [`src/components/Icon/Icon.tsx`](src/components/Icon/Icon.tsx)

Follow the existing icon registry pattern:

- Import `NotebookPen` from `lucide-react`
- Add `"notebook-pen"` to the `IconName` union
- Map `"notebook-pen": NotebookPen` in the `icons` record

No CSS changes needed; icons inherit existing `.icon` styles.

## 3. External link behavior — [`src/components/ListItem/ListItem.tsx`](src/components/ListItem/ListItem.tsx)

The writing item links to Medium (external). `ListItem` currently renders a plain `<a href={href}>` with no `target`/`rel`.

Mirror the pattern already used in [`ConnectPrompt.tsx`](src/components/ConnectPrompt/ConnectPrompt.tsx):

```ts
const isExternal = href.startsWith("http");
// spread { target: "_blank", rel: "noopener noreferrer" } when external
```

This keeps internal `/work/...` links unchanged and opens the Medium article in a new tab.

## Files touched

| File | Change |
|------|--------|
| [`src/data/home.ts`](src/data/home.ts) | Remove Discovery Responses; update Writing section |
| [`src/components/Icon/Icon.tsx`](src/components/Icon/Icon.tsx) | Add `notebook-pen` icon |
| [`src/components/ListItem/ListItem.tsx`](src/components/ListItem/ListItem.tsx) | External link attrs for `http` hrefs |

No changes to `ContentSection`, `HomePage`, or project case-study data.

## Verification

- Home → Work tab: Industry Projects shows Conversation Insights + Architecture Agent only
- Writing section shows one item with notebook-pen icon
- Clicking the writing item opens Medium in a new tab
- `/work/discovery-responses` still reachable if navigated directly (unchanged)
