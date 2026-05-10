---
description: Step-by-step instructions for adding a new demo page, topic, or section to this Next.js app. Use when the user asks to add a page, demo, example, route, or navigation entry.
applyTo: "**"
---

# Skill: Add a New Demo Page

Use this skill whenever the user asks to add a new demo, example, or page to this Next.js app.

---

## App Structure at a Glance

```
app/
  (lib-demos)/          ← route group (shared layout + sidebar)
    layout.tsx          ← top-nav + sidebar shell (do NOT edit for new pages)
    page.tsx            ← root index: lists P0, P1, P2, … sections
    P1-react-libs/
      page.tsx          ← lists C0, C1, C2, … topics using PageWithAccordions
      C1-framer-motion/
        page.tsx        ← topic index: lists demo1, demo2, … using PageWithAccordions
        demo1/
          page.tsx      ← the actual demo (standalone "use client" component)
```

The hierarchy is always: **section (P*) → topic (C*) → demo (demo\_)**.

---

## How the Left-Sidebar Navigation Is Generated

The sidebar is **not hand-coded** — it is driven by a JSON file that is built automatically from the `app/` file system at dev/build time.

### Pipeline

```
app/ directory (file system)
    │
    ▼
scripts/generate-nav.ts          ← reads app/ recursively at build/dev time
    │  • skips _component folders, api/, and dot-folders
    │  • transparently unwraps route-group folders  (lib-demos)
    │  • a folder is included only if it contains a page.tsx (any depth)
    │  • folder names are formatted: "C1-framer-motion" → "C1 Framer Motion"
    ▼
scripts/output/nav/navigation.json   ← serialised NavigationItem[] tree
    │
    ▼
app/_components/side-bars/side-bar.tsx
    └─ require("@/scripts/output/nav/navigation.json")  ← loaded at runtime
```

### `NavigationItem` shape

```ts
interface NavigationItem {
  name: string; // display label (auto-formatted from folder name)
  path: string; // absolute URL path, e.g. "/P1-react-libs/C1-framer-motion"
  hasPage: boolean; // true when a page.tsx exists directly in this folder
  children: NavigationItem[];
}
```

### When the JSON is regenerated

| Command                 | What happens                                |
| ----------------------- | ------------------------------------------- |
| `pnpm dev`              | runs `generate-nav` **then** starts Next.js |
| `pnpm build`            | runs `generate-nav` **then** builds         |
| `pnpm run generate-nav` | regenerate manually (useful mid-session)    |

> Because `pnpm dev` regenerates the JSON on every start, simply **creating a `page.tsx` and restarting the dev server** is enough for the new route to appear in the sidebar automatically. You do **not** need to edit any nav config file.

---

## Step-by-Step: Add a Demo to an Existing Topic

### 1. Create the demo page file

```
app/(lib-demos)/<section>/<topic>/demo<N>/page.tsx
```

Starter template:

```tsx
"use client";

import React from "react";
// shadcn/ui components live in @/components/ui/
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Demo<N>Page() {
  return (
    // Outer div must be scrollable — the layout's content pane is h-full with no scroll
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        <h1 className="text-2xl font-bold">My Demo Title</h1>
        {/* demo content */}
      </div>
    </div>
  );
}
```

> **Important**: Always use `w-full h-full overflow-y-auto` on the outermost div so the page doesn't overflow the layout's fixed-height content pane.

> **Sidebar**: The new route appears in the left sidebar automatically the next time the dev server starts (or after running `pnpm run generate-nav` manually).

### 2. Register the demo in the topic's index page

Open `app/(lib-demos)/<section>/<topic>/page.tsx` and add an entry to the `demos` array:

```tsx
import PageWithAccordions from "@/components/pages/page-with-accordions";

const page = () => (
  <PageWithAccordions
    demos={[
      { title: "Demo 1: existing demo", path: "/demo1/" },
      { title: "Demo <N>: your new demo", path: "/demo<N>/" }, // ← add this
    ]}
  />
);
export default page;
```

The `Demo` interface accepted by `PageWithAccordions`:

```ts
interface Demo {
  title: string; // label shown in the accordion
  path: string; // relative path, always ends with /
  style?: string; // optional Tailwind classes on the trigger
  description?: string;
  links?: { name: string; link: string }[];
}
```

---

## Step-by-Step: Add a New Topic (C\_) to an Existing Section

### 1. Create the topic folder and its index page

```
app/(lib-demos)/<section>/C<N>-<topic-name>/page.tsx
```

```tsx
import PageWithAccordions from "@/components/pages/page-with-accordions";

const page = () => (
  <PageWithAccordions demos={[{ title: "Demo 1: …", path: "/demo1/" }]} />
);
export default page;
```

### 2. Create a layout.tsx only if the topic needs a provider

Most demos don't need one. Add `layout.tsx` only when demos share something (e.g. a `QueryClientProvider`):

```tsx
"use client";
const Layout = ({ children }: { children: React.ReactNode }) => (
  <MyProvider>{children}</MyProvider>
);
export default Layout;
```

### 3. Register the topic in the section's index page

Open `app/(lib-demos)/<section>/page.tsx` and add to the `content` array:

```tsx
{ title: "C<N>-<topic-name>", path: "/C<N>-<topic-name>/", style: "text-purple-500 underline" }
```

### 4. Regenerate navigation (if dev server is not running)

```bash
pnpm run generate-nav
```

If the dev server is already running, restart it — `pnpm dev` calls `generate-nav` automatically.

---

## Step-by-Step: Add a New Section (P\_)

### 1. Create the section folder

```
app/(lib-demos)/P<N>-<section-name>/page.tsx
```

Use the same `PageWithAccordions` pattern as a topic index.

### 2. Register the section in the root index

Open `app/(lib-demos)/page.tsx` and add:

```tsx
{ title: "P<N>: <section name>", path: "/P<N>-<section-name>/", style: "text-red-500 underline" }
```

### 3. Regenerate navigation

```bash
pnpm run generate-nav
```

---

## Installing New Libraries

Use `pnpm` (the project's package manager):

```bash
pnpm add <package-name>
```

---

## Key Conventions

| Rule               | Detail                                                                        |
| ------------------ | ----------------------------------------------------------------------------- |
| `"use client"`     | Add to any page/component that uses React state, effects, or browser APIs     |
| Scroll wrapper     | Always wrap page content in `<div className="w-full h-full overflow-y-auto">` |
| Paths end with `/` | All `path` entries in `PageWithAccordions` must end with a trailing slash     |
| Independence       | Each demo page is self-contained — avoid cross-page imports                   |
| Tailwind + shadcn  | UI primitives live in `@/components/ui/`; use Tailwind for layout/styling     |
| TypeScript         | All new files should be `.tsx` / `.ts`                                        |
