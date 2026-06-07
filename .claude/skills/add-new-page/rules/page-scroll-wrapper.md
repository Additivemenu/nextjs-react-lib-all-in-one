# Rule: Page Scroll Wrapper

**Every demo page must have this as its outermost element:**

```tsx
<div className="w-full h-full overflow-y-auto">{/* page content */}</div>
```

## Why this is required

The shared layout's content pane (`app/(lib-demos)/layout.tsx`) is:

```tsx
<div className="h-full flex flex-col justify-center items-center py-2 grow-[5]">
  {children}
</div>
```

It has a **fixed height** (`h-full`, constrained by `h-main-content = calc(100vh - var(--top-nav-height))`) with **no overflow**, and centres its child. Any page taller than the pane will overflow the viewport instead of scrolling. The `overflow-y-auto` wrapper turns the page into a proper scroll container.

## Rules

- ✅ Always use `<div className="w-full h-full overflow-y-auto">` as the outermost element of every page
- ❌ Never use `h-[calc(100vh-...)]` inside a page — the layout already handles height via `h-main-content`
- ❌ Never rely on `justify-center items-center` from the layout to centre your page — use `mx-auto` on an inner container instead
