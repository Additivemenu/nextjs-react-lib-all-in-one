---
description: Step-by-step instructions for adding a new demo page, topic, or section to this Next.js app. Use when the user asks to add a page, demo, example, route, or navigation entry.
applyTo: "**"
---

# Skill: Add a New Demo Page

Use this skill whenever the user asks to add a new demo, example, or page to this Next.js app.

> **Supporting rules** — read these for full detail when needed:
>
> - [App structure](rules/app-structure.md)
> - [Page scroll wrapper](rules/page-scroll-wrapper.md)
> - [Nav generation](rules/nav-generation.md)
> - [Page registration](rules/page-registration.md)

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
