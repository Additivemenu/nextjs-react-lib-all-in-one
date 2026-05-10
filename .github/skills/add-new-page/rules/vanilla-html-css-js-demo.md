# Rule: Adding a Vanilla JS / CSS / HTML Demo

This pattern is used for demos where the actual interactive content is a plain HTML file (with its own CSS and JS), embedded in the Next.js app via an `<iframe>`. The Next.js page acts as a shell that provides links to the README and the source code on GitHub.

> For how README and source code links work, see [readme-and-source-links.md](readme-and-source-links.md).

---

## Folder structure

```
app/(lib-demos)/P0-HTML-CSS-JS-demo/
  js/                        ← or css/ depending on the category
    <NN>-<demo-name>/        ← e.g. 01-thumbs-up, 07-virtual-menu
      page.tsx               ← Next.js shell page
      readme-path.ts         ← exports the path string for the README link
      readme.md              ← explains the demo
      demo/                  ← the actual vanilla files (copied to public/ at build time)
        index.html
        index.css            ← (optional)
        index.js             ← (optional)
```

### How `demo/` is served

At build time `scripts/copy-paste-demo-to-public.ts` scans every folder named `demo/` under `app/(lib-demos)/` and copies its contents to `public/demos/` preserving the relative path:

```
app/(lib-demos)/P0-HTML-CSS-JS-demo/js/01-thumbs-up/demo/
  →  public/demos/P0-HTML-CSS-JS-demo/js/01-thumbs-up/
```

The `useHtmlFilePath` hook (see `app/(lib-demos)/P0-HTML-CSS-JS-demo/(hooks)/useHtmlFilePath.ts`) derives the public URL from `usePathname()`:

```ts
// pathname = "/P0-HTML-CSS-JS-demo/js/01-thumbs-up"
// → "/demos/P0-HTML-CSS-JS-demo/js/01-thumbs-up/index.html"
```

So the iframe `src` is always `/demos/<section>/<category>/<NN>-<demo-name>/index.html`.

---

## Files to create

### 1. `readme-path.ts` and `readme.md`

See [readme-and-source-links.md](readme-and-source-links.md) for the full pattern.

Quick reference:

```ts
// readme-path.ts
export const readmePath =
  "app/(lib-demos)/P0-HTML-CSS-JS-demo/<category>/<NN>-<demo-name>/readme.md";
```

### 2. `page.tsx` — the Next.js shell

Use the simpler CSS-style page (no `PageToolbar`, just raw `LinkButton`s) as the baseline:

```tsx
"use client";

import LinkButton from "@/components/links/LinkButton";
import React from "react";
import { readmePath } from "./readme-path";
import { useHtmlFilePath } from "../../(hooks)/useHtmlFilePath";

const Page = () => {
  const htmlFilePath = useHtmlFilePath();
  // htmlFilePath resolves to /demos/P0-HTML-CSS-JS-demo/<category>/<NN>-<demo-name>/index.html
  // the public/ source lives at public${htmlFilePath}
  const srcCodeFilePath = `public${htmlFilePath}`;

  return (
    <div className="h-full w-full">
      <div className="flex gap-2 p-2">
        <LinkButton filePath={readmePath} />
        <LinkButton filePath={srcCodeFilePath} label="source code" />
      </div>
      <iframe
        src={htmlFilePath}
        width="100%"
        height="90%"
        frameBorder="0"
        title="<Demo Name>"
      />
    </div>
  );
};

export default Page;
```

> Note: `LinkButton` calls `getGitHubUrl(filePath)` internally, which prepends the repo base URL  
> `https://github.com/Additivemenu/nextjs-react-lib-all-in-one/blob/main/`.  
> So `filePath` must be a **repo-relative path** (no leading `/`).

### 3. `demo/index.html` (and siblings)

Self-contained HTML file. Keep all CSS and JS either inline or in sibling files within `demo/`. Do **not** reference paths outside the `demo/` folder.

### 4. `readme.md`

Document what the demo covers, key techniques, and any references.

---

## Build-time copy — nothing extra to configure

`pnpm build` (and `pnpm dev`) already run `copy-demos` automatically via the `package.json` scripts. As long as your vanilla files sit inside a folder named exactly `demo/`, they will be copied to `public/demos/` at the right path.

If you want to verify the copy worked during development:

```bash
pnpm run copy-demos
# then check public/demos/<your-path>/index.html
```

---

## Checklist

- [ ] Created `demo/index.html` (self-contained, no external path references)
- [ ] Created `readme-path.ts` with the correct repo-relative path
- [ ] Created `readme.md`
- [ ] Created `page.tsx` using `useHtmlFilePath` + `LinkButton` + `<iframe>`
- [ ] The outer `<div>` in `page.tsx` uses `h-full w-full` (no `overflow-y-auto` needed — the iframe fills the space)
- [ ] Ran `pnpm run copy-demos` (or restarted dev server) to confirm the HTML file is served correctly
