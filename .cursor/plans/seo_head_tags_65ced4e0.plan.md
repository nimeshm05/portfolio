---
name: SEO head tags
overview: List the SEO metadata still needed from you, then wire Next.js Metadata API tags once those answers (or placeholders) are in. The site currently only sets title and description.
todos:
  - id: collect-seo-answers
    content: "Collect remaining SEO answers: indexing, titles, description, OG images, Twitter handle, JSON-LD job title"
    status: pending
  - id: root-metadata
    content: Expand root layout metadata (title template, OG/Twitter, robots, metadataBase from env)
    status: pending
  - id: project-metadata
    content: Expand generateMetadata on work/[slug] with canonical, OG, and project description
    status: pending
  - id: json-ld
    content: Add Person/WebSite JSON-LD on the homepage once job title and URL strategy are confirmed
    status: pending
isProject: false
---

# SEO head tags — what I need from you

Head tags already exist, but they are thin. [`src/app/layout.tsx`](src/app/layout.tsx) only sets `title` and `description`. Project pages in [`src/app/work/[slug]/page.tsx`](src/app/work/[slug]/page.tsx) reuse `project.title` / `project.subtitle`. `lang="en"` is set. [`src/app/icon.png`](src/app/icon.png) is already the favicon (your portrait). There is no `metadataBase`, Open Graph, Twitter card, canonical URL, robots, sitemap, or JSON-LD.

Because you are still finishing the site and will share the custom domain later, I can implement the tags now with a `NEXT_PUBLIC_SITE_URL` placeholder and keep pages `noindex` until you launch.

## What I can reuse without asking

- Name: Nimesh Mohanakrishnan
- Home description (already in layout)
- Project titles and subtitles
- Location / role from [`src/data/home.ts`](src/data/home.ts)
- Social URLs: LinkedIn, GitHub, X (`hoveroverhere`), email
- Favicon: existing `icon.png`

## What I still need from you

**Required before launch (can wait)**

1. **Production URL** — e.g. `https://nimesh.dev`. Needed for canonical, Open Graph `og:url`, sitemap, and JSON-LD. You said you will provide this later. I will use `process.env.NEXT_PUBLIC_SITE_URL` so it is a one-line env change.

**Required for good social previews**

2. **Default Open Graph image** — a **1200×630** still (PNG/JPG) for the homepage when someone pastes the link in Slack, LinkedIn, iMessage, X. The current favicon/portrait is a crop and will look wrong as a link card. Options:
   - You supply a designed share graphic
   - I generate a simple OG image with `next/og` (name + “Product designer”)
3. **Per-project share images** — case study banners are **videos**. Crawlers need a static 1200×630 still per project (or one fallback). If you do not have stills, I will use the default OG image on project pages for now.

**Quick preferences (reply in chat is enough)**

4. **Indexing while you finish** — keep `robots: noindex, nofollow` until launch, or allow indexing now?
5. **Title pattern**
   - Home: keep `Nimesh Mohanakrishnan`, or use something like `Nimesh Mohanakrishnan — Product Designer`?
   - Projects: `Conversation Insights | Nimesh Mohanakrishnan` (recommended) vs title-only?
6. **Home meta description** — keep the current HCDE/Seattle line, or a shorter hiring-focused line? (~150–160 characters)
7. **X/Twitter** — use `@hoveroverhere` as `twitter:creator`?
8. **JSON-LD job title** — e.g. `Product Designer` vs `Product Designer & HCDE Master's Student`?

**Nice-to-have, skip unless you care**

- Keywords (Google largely ignores them)
- `theme-color` (I can pull from existing tokens)
- Separate Apple touch icon (can reuse `icon.png`)

## What I would add in code (after you answer 4–8; 1–3 can stay placeholders)

Next.js Metadata API in the root layout and `generateMetadata` on project pages — not raw `<head>` tags:

- `metadataBase` from the env URL
- `title.template` (`%s | Nimesh Mohanakrishnan`)
- `openGraph` + `twitter` (summary_large_image)
- `alternates.canonical` per route
- `robots` (noindex until you say otherwise)
- `authors` / `creator`
- JSON-LD `Person` + `WebSite` on the homepage (name, url, image, sameAs socials, jobTitle, email)
- Optional later: `app/robots.ts` + `app/sitemap.ts` once the domain is live

No new pages or visual UI changes. Project copy stays as-is unless you rewrite the home description.
