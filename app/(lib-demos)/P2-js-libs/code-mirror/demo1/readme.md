# 1. CodeMirror 6 — Basic JavaScript Editor (Vanilla TS + iframe)

A minimal [CodeMirror 6](https://codemirror.net/) demo written in **vanilla TypeScript**, compiled to plain JS and embedded into the Next.js app via an `<iframe>` (the vanilla HTML/CSS/JS demo pattern).

## 2. What the demo shows

- Creating an `EditorView` with `basicSetup` (line numbers, history, fold gutter, default keymap, bracket matching, autocompletion, …)
- Adding the `javascript()` language extension for syntax highlighting
- Listening to document changes with `EditorView.updateListener` (live line/char stats)
- Reading the current document via `editor.state.doc.toString()` — used by the **Run** button, which executes the code with `new Function()` and captures `console.log` output into a panel

## 3. How the TypeScript → browser pipeline works

### 3.1 Source and compilation

The demo logic lives in `demo/index.ts` and is compiled to `demo/index.js` with `tsc` (no bundler):

```bash
npx tsc "app/(lib-demos)/P2-js-libs/code-mirror/demo1/demo/index.ts" \
  --target ES2020 --module ESNext --moduleResolution bundler \
  --lib ES2020,DOM,DOM.Iterable --strict --skipLibCheck
```

Both the `.ts` source and the compiled `.js` are committed. Re-run the command after editing `index.ts`.

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

## 5. References

- [CodeMirror 6 docs](https://codemirror.net/docs/)
- [Bundling example / why CM6 is distributed as ES modules](https://codemirror.net/examples/bundle/)
- [esm.sh — ESM CDN](https://esm.sh/)
