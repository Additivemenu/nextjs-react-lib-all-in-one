# Rule: App Folder Structure

The route hierarchy inside `app/(lib-demos)/` is always:

```
section (P_)  →  topic (C_)  →  demo (demo_)
```

```
app/
  (lib-demos)/            ← route group — shared layout + sidebar
    layout.tsx            ← DO NOT edit for new pages
    page.tsx              ← root index: lists P0, P1, P2, … sections
    P1-react-libs/        ← a section
      page.tsx            ← section index: lists C0, C1, … topics
      C1-framer-motion/   ← a topic
        page.tsx          ← topic index: lists demo1, demo2, … demos
        demo1/
          page.tsx        ← the actual standalone demo page
```

**Naming conventions:**

- Sections: `P<N>-<kebab-name>` (e.g. `P1-react-libs`)
- Topics: `C<N>-<kebab-name>` (e.g. `C1-framer-motion`)
- Demos: `demo<N>` or `demo<N>-<variant>` (e.g. `demo1`, `demo2-1`)

**Key rules:**

- Each demo page is **self-contained** — do not import across demo pages
- `layout.tsx` at the route-group level is shared infrastructure — never modify it for a new page
- A `layout.tsx` inside a topic folder is optional and only needed when demos in that topic share a provider (e.g. `QueryClientProvider`)
