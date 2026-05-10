# Rule: Left-Sidebar Navigation Generation

The sidebar is **not hand-coded**. It is auto-generated from the `app/` file system.

## Pipeline

```
app/ directory
    │
    ▼
scripts/generate-nav.ts
    │  • skips folders starting with _ or .  and the api/ folder
    │  • transparently unwraps route-group folders like (lib-demos)
    │  • includes a folder only if it contains a page.tsx (at any depth)
    │  • formats folder names: "C1-framer-motion" → "C1 Framer Motion"
    ▼
scripts/output/nav/navigation.json   (NavigationItem[] tree)
    │
    ▼
app/_components/side-bars/side-bar.tsx
    └─ require("@/scripts/output/nav/navigation.json")
```

## NavigationItem shape

```ts
interface NavigationItem {
  name: string; // display label (auto-formatted from folder name)
  path: string; // absolute URL path, e.g. "/P1-react-libs/C1-framer-motion"
  hasPage: boolean; // true when a page.tsx exists directly in this folder
  children: NavigationItem[];
}
```

## When it runs

| Command                 | Behaviour                                |
| ----------------------- | ---------------------------------------- |
| `pnpm dev`              | runs `generate-nav` then starts Next.js  |
| `pnpm build`            | runs `generate-nav` then builds          |
| `pnpm run generate-nav` | manual regeneration (useful mid-session) |

## Key point

Simply **creating a `page.tsx` and restarting the dev server** is enough for a new route to appear in the sidebar. You do **not** need to edit any nav config file manually.
