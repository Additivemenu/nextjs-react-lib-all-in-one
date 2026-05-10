# Rule: README and Source Code Links

Any demo page that has a `readme.md` or a source file worth linking to should surface those as GitHub links using `LinkButton`.

---

## How it works

`LinkButton` calls `getGitHubUrl(filePath)` internally:

```ts
// lib/utils.ts
export function getGitHubUrl(filePath: string): string {
  const baseURL =
    "https://github.com/Additivemenu/nextjs-react-lib-all-in-one/blob/main/";
  return `${baseURL}/${filePath}`;
}
```

So every `filePath` passed to `LinkButton` must be a **repo-relative path with no leading `/`**.

---

## `readme-path.ts`

Create this file alongside `page.tsx` to export the README path as a constant:

```ts
// app/(lib-demos)/<section>/<topic>/<demo>/readme-path.ts
export const readmePath = "app/(lib-demos)/<section>/<topic>/<demo>/readme.md";
```

---

## `LinkButton` usage

```tsx
import LinkButton from "@/components/links/LinkButton";
import { readmePath } from "./readme-path";

// README link (label defaults to "Check README")
<LinkButton filePath={readmePath} />

// Source code link — path must be repo-relative, no leading /
<LinkButton filePath="public/demos/P0-HTML-CSS-JS-demo/js/01-thumbs-up/index.html" label="source code" />
```

### For vanilla HTML demos — derive the source path from the iframe URL

```tsx
const htmlFilePath = useHtmlFilePath();
// htmlFilePath = "/demos/P0-HTML-CSS-JS-demo/js/01-thumbs-up/index.html"

const srcCodeFilePath = `public${htmlFilePath}`;
// srcCodeFilePath = "public/demos/P0-HTML-CSS-JS-demo/js/01-thumbs-up/index.html"
// ✅ repo-relative, no leading /

<LinkButton filePath={srcCodeFilePath} label="source code" />;
```

---

## `PageToolbar` (alternative — wraps both links)

For JS demos that use `PageToolbar` instead of raw `LinkButton`s:

```tsx
import PageToolbar from "@/app/_components/toolbars/page-toolbar";

<PageToolbar readmePath={readmePath} htmlFilePath={srcCodeFilePath} />;
```

`PageToolbar` renders both buttons in a styled bar. Either approach is fine; `LinkButton` directly gives more layout control.

---

## Rules

- `filePath` props must always be **repo-relative** (no leading `/`)
- Always export `readmePath` from a dedicated `readme-path.ts` — do not hardcode the string in `page.tsx`
- Open links in a new tab is handled automatically by `LinkButton` (`target="_blank"`)
