/**
 * CodeMirror 6 basic demo — written in TypeScript, compiled to index.js
 * with tsc (see readme.md for the exact command). The bare module
 * specifiers below are resolved in the browser by the import map
 * declared in index.html (pointing at esm.sh).
 */
import { basicSetup, EditorView } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
const INITIAL_DOC = `// Edit me, then hit "Run"
function fib(n) {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}

for (let i = 0; i < 10; i++) {
  console.log(\`fib(\${i}) = \${fib(i)}\`);
}
`;
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
// 1. Create the editor: state + extensions, mounted onto #editor
const editor = new EditorView({
    doc: INITIAL_DOC,
    extensions: [
        basicSetup, // line numbers, history, fold gutter, default keymap, …
        javascript(), // JS syntax highlighting + autocompletion
        // updateListener: fires on every transaction (typing, selection, …)
        EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                updateStats(update.view);
            }
        }),
    ],
    parent: editorParent,
});
updateStats(editor);
const appendOutput = (text, isError = false) => {
    const line = document.createElement("span");
    line.textContent = `${text}\n`;
    if (isError) {
        line.classList.add("error");
    }
    output.appendChild(line);
};
// 2. Run button: read the current doc from editor state and execute it,
//    capturing console.log output into the panel
runBtn.addEventListener("click", () => {
    output.textContent = "";
    const code = editor.state.doc.toString();
    const originalLog = console.log;
    console.log = (...args) => {
        appendOutput(args.map((arg) => String(arg)).join(" "));
        originalLog(...args);
    };
    try {
        // eslint-disable-next-line no-new-func
        new Function(code)();
    }
    catch (err) {
        appendOutput(String(err), true);
    }
    finally {
        console.log = originalLog;
    }
});
// 3. Clear button: wipe the output panel
clearBtn.addEventListener("click", () => {
    output.textContent = "";
});
