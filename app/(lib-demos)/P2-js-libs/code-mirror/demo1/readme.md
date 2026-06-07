# 1. CodeMirror 6 — Basic JavaScript Editor (Vanilla TS + iframe)

A minimal [CodeMirror 6](https://codemirror.net/) demo written in **vanilla TypeScript**, compiled to plain JS and embedded into the Next.js app via an `<iframe>` (the vanilla HTML/CSS/JS demo pattern).

## 2. What the demo shows

- Creating an `EditorView` with `basicSetup` (line numbers, history, fold gutter, default keymap, bracket matching, autocompletion, …)
- Adding the `javascript()` language extension for syntax highlighting
- Listening to document changes with `EditorView.updateListener` (live line/char stats)
- Reading the current document via `editor.state.doc.toString()` — used by the **Run** button, which executes the code with `new Function()` and captures `console.log` output into a panel
- A **Notion-style slash-command menu**: typing a standalone `/` pops up a list of editor actions at the cursor (see section 5)

## 3. How the TypeScript → browser pipeline works

### 3.1 Source and compilation

The demo logic lives in TypeScript modules under `demo/src/` and is compiled with `tsc` (no bundler) into **flat ES modules** in `demo/`:

```
demo/
  index.html, index.css        ← static assets
  src/                         ← TypeScript source (has its own tsconfig.json)
    index.ts                   ← entry point: DOM lookups + wiring
    editor.ts                  ← EditorView creation + extensions
    slash-commands.ts          ← slash-command completion source + actions
    runner.ts                  ← output panel + console-capturing code runner
  index.js, editor.js,
  slash-commands.js, runner.js ← compiled output (what the browser runs)
```

```bash
npx tsc -p "app/(lib-demos)/P2-js-libs/code-mirror/demo1/demo/src"
```

Both the `.ts` source and the compiled `.js` are committed. Re-run the command after editing anything in `src/`.

Details that make the no-bundler setup work:

- **Relative imports carry the `.js` extension in the `.ts` source** (e.g. `import { createEditor } from "./editor.js"`). TypeScript resolves `./editor.js` → `editor.ts` at check time but emits the specifier verbatim, so the output is natively loadable by the browser.
- **Output is emitted flat into `demo/`** (`outDir: ".."`), because the copy script only copies top-level *files* of `demo/` — subdirectories like `src/` are skipped (which conveniently keeps the TS source out of `public/`).
- The src `tsconfig.json` uses `"files"` instead of `"include"` — `outDir` is the parent folder, and tsc auto-excludes the outDir from include globs, which would otherwise swallow `src/` itself.

### 3.2 Bare imports resolved by an import map

`tsc` preserves the bare module specifiers (`"codemirror"`, `"@codemirror/lang-javascript"`). The browser resolves them through the **import map** declared in `index.html`, pointing at the esm.sh CDN:

```html
<script type="importmap">
  {
    "imports": {
      "codemirror": "https://esm.sh/codemirror@6.0.2",
      "@codemirror/lang-javascript": "https://esm.sh/@codemirror/lang-javascript@6.2.5"
    }
  }
</script>
```

The npm packages `codemirror` and `@codemirror/lang-javascript` are installed in `package.json` **only for TypeScript type-checking** — at runtime everything loads from the CDN. The import-map versions are pinned to match the installed ones so types and runtime stay in sync.

### 3.3 Serving via the iframe

At dev/build time, `scripts/copy-paste-demo-to-public.ts` copies the `demo/` folder to:

```
public/demos/code-mirror/demo1/
```

(the script strips the section segment, e.g. `P2-js-libs`). `page.tsx` uses the shared `useHtmlFilePath` hook — which strips the same segment from `usePathname()` — to point the iframe at `/demos/code-mirror/demo1/index.html`.

## 4. Key CodeMirror 6 concepts

| Concept             | In this demo                                                       |
| ------------------- | ------------------------------------------------------------------ |
| `EditorView`        | The editor UI component, mounted onto `#editor`                    |
| `EditorState`       | Immutable state — accessed via `editor.state` (e.g. `state.doc`)   |
| Extensions          | `basicSetup`, `javascript()`, `EditorView.updateListener`          |
| Transactions        | Every edit dispatches a transaction; the update listener sees them |

## 5. Slash-command menu

Typing a **standalone `/`** (preceded and followed only by whitespace or line boundaries) opens a dropdown of predefined actions at the `/` position — keep typing to filter (e.g. `/dup`), <kbd>↑</kbd>/<kbd>↓</kbd> + <kbd>Enter</kbd> to run, <kbd>Esc</kbd> to dismiss.

### 5.1 How it's built

No popup code is hand-rolled — it reuses the **autocompletion engine** already included in `basicSetup`:

1. A custom completion source matches `/` + filter text via `context.matchBefore(/\/[\w-]*/)`, then enforces the *standalone* rule by checking the characters before the `/` and after the cursor are whitespace/boundaries (returns `null` otherwise, so normal typing is unaffected).
2. It is registered as an **additional** source for JavaScript content — `javascriptLanguage.data.of({ autocomplete: slashCommandSource })` — so the default JS completions keep working.
3. Each option is a `Completion` whose `apply` **callback** runs an editor action instead of inserting its label. `apply(view, completion, from, to)` receives the range spanning the `/` + filter text, so the action's transaction also removes the typed command.
4. `validFor: /^\/[\w-]*$/` keeps the result active while the user types filter characters, avoiding re-querying the source on every keystroke.

### 5.2 Predefined actions

| Command            | Effect                                            |
| ------------------ | ------------------------------------------------- |
| `/delete-line`     | Delete the current line                           |
| `/duplicate-line`  | Duplicate the current line below                  |
| `/comment-line`    | Prefix the current line with `//`                 |
| `/uppercase-line`  | Convert the current line to UPPERCASE             |
| `/insert-function` | Insert a `function` skeleton (cursor on the name) |
| `/insert-for-loop` | Insert a `for`-loop skeleton                      |
| `/insert-log`      | Insert `console.log()` (cursor inside the parens) |

> Note: `@codemirror/autocomplete` is imported with `import type { … }` only — tsc erases it at compile time, so the compiled `index.js` gains no new CDN import and the import map stays unchanged. The package is installed purely for type-checking.

> Caveat: by the "standalone" definition, a division like `a / b` also triggers the menu (the `/` is surrounded by spaces). It's harmless — the popup is passive until <kbd>Enter</kbd> — but a real product might additionally check syntax context via `syntaxTree`.

## 6. References

- [CodeMirror 6 docs](https://codemirror.net/docs/)
- [Bundling example / why CM6 is distributed as ES modules](https://codemirror.net/examples/bundle/)
- [esm.sh — ESM CDN](https://esm.sh/)
