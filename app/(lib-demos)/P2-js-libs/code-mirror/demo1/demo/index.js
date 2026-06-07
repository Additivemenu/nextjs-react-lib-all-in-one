import { createEditor } from "./editor.js";
import { createOutputPanel, runCode } from "./runner.js";
const editorParent = document.querySelector("#editor");
const runBtn = document.querySelector("#run-btn");
const clearBtn = document.querySelector("#clear-btn");
const output = document.querySelector("#output");
const docStats = document.querySelector("#doc-stats");
if (!editorParent || !runBtn || !clearBtn || !output || !docStats) {
    throw new Error("Demo DOM elements not found");
}
const updateStats = (view) => {
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
