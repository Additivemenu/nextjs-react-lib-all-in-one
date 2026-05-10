---
description: Step-by-step instructions for adding a new demo page, topic, or section to this Next.js app. Use when the user asks to add a page, demo, example, route, or navigation entry.
applyTo: "**"
---

# Skill: Add a New Demo Page

Use this skill whenever the user asks to add a new demo, example, or page to this Next.js app.

> **Before starting**, ask the developer:
>
> - Do you want a `readme.md` and a GitHub source code link on the page?
>   If yes, read [README and source code links](rules/readme-and-source-links.md) before creating the page.

> **Supporting rules** — load the relevant rule file(s) before implementing:
>
> | Rule file                                                        | Purpose                                                                             | When to load                                             |
> | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------- |
> | [app-structure.md](rules/app-structure.md)                       | Folder hierarchy, section/topic/demo naming conventions                             | Always — when unsure about where to put a new file       |
> | [page-scroll-wrapper.md](rules/page-scroll-wrapper.md)           | Why every page needs `w-full h-full overflow-y-auto`                                | Always — when creating any page under `app/(lib-demos)/` |
> | [nav-generation.md](rules/nav-generation.md)                     | How the sidebar JSON is auto-generated from the file system                         | When the user asks about navigation or the sidebar       |
> | [page-registration.md](rules/page-registration.md)               | How to register a page in a `PageWithAccordions` index                              | When adding a demo to an existing topic or section       |
> | [readme-and-source-links.md](rules/readme-and-source-links.md)   | `LinkButton`, `readme-path.ts`, `getGitHubUrl` pattern, header numbering convention | When the demo needs a README or GitHub source code link  |
> | [vanilla-html-css-js-demo.md](rules/vanilla-html-css-js-demo.md) | Full pattern for iframe-based HTML/CSS/JS demos                                     | When the demo is a plain HTML file (not a React page)    |

---

## Add a Demo to an Existing Topic

1. **Create** `app/(lib-demos)/<section>/<topic>/demo<N>/page.tsx`:

```tsx
"use client";

import React from "react";

export default function Demo<N>Page() {
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        <h1 className="text-2xl font-bold">Demo Title</h1>
        {/* demo content */}
      </div>
    </div>
  );
}
```

2. **Register** in `app/(lib-demos)/<section>/<topic>/page.tsx` — add to the `demos` array:

```tsx
{ title: "Demo <N>: your description", path: "/demo<N>/" }
```

3. **Sidebar** updates automatically on the next `pnpm dev` start. To update now: `pnpm run generate-nav`.

---

## Add a New Topic (C\_) to an Existing Section

1. **Create** `app/(lib-demos)/<section>/C<N>-<topic-name>/page.tsx`:

```tsx
import PageWithAccordions from "@/components/pages/page-with-accordions";

const page = () => (
  <PageWithAccordions demos={[{ title: "Demo 1: …", path: "/demo1/" }]} />
);
export default page;
```

2. _(Optional)_ Add `layout.tsx` only if demos in this topic share a provider (e.g. `QueryClientProvider`).

3. **Register** in `app/(lib-demos)/<section>/page.tsx` — add to the content array:

```tsx
{ title: "C<N>-<topic-name>", path: "/C<N>-<topic-name>/", style: "text-purple-500 underline" }
```

4. Run `pnpm run generate-nav` (or restart dev server).

---

## Add a New Section (P\_)

1. **Create** `app/(lib-demos)/P<N>-<section-name>/page.tsx` using the same `PageWithAccordions` pattern.

2. **Register** in `app/(lib-demos)/page.tsx`:

```tsx
{ title: "P<N>: <section name>", path: "/P<N>-<section-name>/", style: "text-red-500 underline" }
```

3. Run `pnpm run generate-nav` (or restart dev server).

---

## Installing New Libraries

```bash
pnpm add <package-name>
```
