# Rule: Registering Pages with PageWithAccordions

Every section and topic index page uses `PageWithAccordions` to list its children.

## Usage

```tsx
import PageWithAccordions from "@/components/pages/page-with-accordions";

const page = () => (
  <PageWithAccordions
    demos={[
      { title: "Demo 1: description", path: "/demo1/" },
      { title: "Demo 2: description", path: "/demo2/" },
    ]}
  />
);
export default page;
```

## Demo item interface

```ts
interface Demo {
  title: string; // label shown in the accordion trigger
  path: string; // relative path — MUST end with a trailing slash
  style?: string; // optional Tailwind classes applied to the trigger
  description?: string; // shown inside the accordion body
  links?: { name: string; link: string }[]; // optional reference links
}
```

## Rules

- `path` values **must always end with `/`** (e.g. `"/demo1/"` not `"/demo1"`)
- The path is relative to the current page's URL — `PageWithAccordions` reads `usePathname()` internally
- Section index pages (`P_/page.tsx`) use the same component to list topics; the `demos` prop works identically
