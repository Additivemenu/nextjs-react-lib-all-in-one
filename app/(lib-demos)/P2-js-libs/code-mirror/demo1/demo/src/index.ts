/**
 * CodeMirror 6 basic demo — entry point: DOM lookups + wiring.
 *
 * Written in TypeScript under demo/src/, compiled to flat ES modules in
 * demo/ with `npx tsc -p .../demo/src` (see readme.md). The bare module
 * specifiers ("codemirror", "@codemirror/lang-javascript") are resolved
 * in the browser by the import map declared in index.html (esm.sh);
 * relative imports carry the ".js" extension so they run natively.
 */
import type { EditorView } from "codemirror";
import { createEditor } from "./editor.js";
import { createOutputPanel, runCode } from "./runner.js";

const editorParent = document.querySelector<HTMLDivElement>("#editor");
const runBtn = document.querySelector<HTMLButtonElement>("#run-btn");
const clearBtn = document.querySelector<HTMLButtonElement>("#clear-btn");
const output = document.querySelector<HTMLPreElement>("#output");
const docStats = document.querySelector<HTMLSpanElement>("#doc-stats");

if (!editorParent || !runBtn || !clearBtn || !output || !docStats) {
  throw new Error("Demo DOM elements not found");
}

const updateStats = (view: EditorView): void => {
  const doc = view.state.doc;
  docStats.textContent = `${doc.lines} lines · ${doc.length} chars`;
};

const editor = createEditor(editorParent, updateStats);
updateStats(editor);

const panel = createOutputPanel(output);

// Run button: read the current doc from editor state and execute it
runBtn.addEventListener("click", () => {
  runCode(editor.state.doc.toString(), panel);
});

// Clear button: wipe the output panel
clearBtn.addEventListener("click", () => {
  panel.clear();
});
