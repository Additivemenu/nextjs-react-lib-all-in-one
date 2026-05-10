# Rule: README Header Numbering Convention

All `readme.md` files in this project use a numeric prefix on every heading so readers can reference sections unambiguously (e.g. "see section 2.3").

---

## Convention

| Heading level | Format          | Example                             |
| ------------- | --------------- | ----------------------------------- |
| H1 (`#`)      | `# N. Title`    | `# 1. Movable — Draggable Wrapper`  |
| H2 (`##`)     | `## N. Title`   | `## 2. Key concepts`                |
| H3 (`###`)    | `### N.M Title` | `### 2.1 Drag vs click distinction` |

- Each document has exactly **one H1**, always numbered `1.`.
- H2s are numbered sequentially from `1.` within the document.
- H3s are numbered `{parent H2 number}.{sequence}` — they reset per H2 parent.
- H4 and deeper are rarely used; if needed, extend the pattern: `#### 2.1.1 Sub-detail`.

---

## Example

```md
# 1. My Component

## 1. Why this approach?

…comparison table…

## 2. Key concepts

### 2.1 First concept

…

### 2.2 Second concept

…

## 3. Props

…props table…

## 4. Comparison with alternatives

…
```
