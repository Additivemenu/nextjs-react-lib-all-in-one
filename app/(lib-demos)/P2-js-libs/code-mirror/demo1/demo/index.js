/**
 * CodeMirror 6 basic demo — written in TypeScript, compiled to index.js
 * with tsc (see readme.md for the exact command). The bare module
 * specifiers below are resolved in the browser by the import map
 * declared in index.html (pointing at esm.sh).
 */
import { basicSetup, EditorView } from "codemirror";
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
const INITIAL_DOC = `// Edit me, then hit "Run"
// Tip: type "/" on its own (start of line or after a space)
// to open the slash-command menu

function fib(n) {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}

for (let i = 0; i < 10; i++) {
  console.log(\`fib(\${i}) = \${fib(i)}\`);
}
`;
/* ------------------------------------------------------------------ */
/* Slash-command menu                                                  */
/*                                                                     */
/* A custom completion source for the autocompletion engine that ships */
/* with basicSetup. It only activates on a *standalone* "/" (preceded  */
/* and followed by whitespace / line boundaries). Each option's        */
/* `apply` callback runs an editor action instead of inserting text —  */
/* `from`/`to` always span the "/" plus whatever filter text was       */
/* typed after it, so replacing/deleting that range removes the "/".   */
/* ------------------------------------------------------------------ */
/** Current line, with the "/command" text sliced out */
const lineWithoutSlash = (view, from, to) => {
    const line = view.state.doc.lineAt(from);
    const text = line.text.slice(0, from - line.from) + line.text.slice(to - line.from);
    return { lineFrom: line.from, lineTo: line.to, text };
};
const slashCommands = [
    {
        label: "/delete-line",
        detail: "delete the current line",
        type: "keyword",
        apply: (view, _completion, from, _to) => {
            const line = view.state.doc.lineAt(from);
            // include the trailing newline so the line collapses entirely
            const delTo = Math.min(line.to + 1, view.state.doc.length);
            view.dispatch({ changes: { from: line.from, to: delTo } });
        },
    },
    {
        label: "/duplicate-line",
        detail: "duplicate the current line below",
        type: "keyword",
        apply: (view, _completion, from, to) => {
            const { lineTo, text } = lineWithoutSlash(view, from, to);
            view.dispatch({
                changes: [
                    { from, to }, // remove the "/command" text
                    { from: lineTo, insert: `\n${text}` },
                ],
            });
        },
    },
    {
        label: "/comment-line",
        detail: 'prefix the current line with "//"',
        type: "keyword",
        apply: (view, _completion, from, to) => {
            const { lineFrom } = lineWithoutSlash(view, from, to);
            view.dispatch({
                changes: [
                    { from, to },
                    { from: lineFrom, insert: "// " },
                ],
            });
        },
    },
    {
        label: "/uppercase-line",
        detail: "convert the current line to UPPERCASE",
        type: "keyword",
        apply: (view, _completion, from, to) => {
            const { lineFrom, lineTo, text } = lineWithoutSlash(view, from, to);
            view.dispatch({
                changes: { from: lineFrom, to: lineTo, insert: text.toUpperCase() },
            });
        },
    },
    {
        label: "/insert-function",
        detail: "insert a function skeleton",
        type: "function",
        apply: (view, _completion, from, to) => {
            const insert = "function newFunction() {\n  // TODO\n}";
            view.dispatch({
                changes: { from, to, insert },
                selection: { anchor: from + "function ".length }, // cursor on the name
            });
        },
    },
    {
        label: "/insert-for-loop",
        detail: "insert a for-loop skeleton",
        type: "function",
        apply: (view, _completion, from, to) => {
            const insert = "for (let i = 0; i < 10; i++) {\n  // TODO\n}";
            view.dispatch({ changes: { from, to, insert } });
        },
    },
    {
        label: "/insert-log",
        detail: "insert console.log()",
        type: "function",
        apply: (view, _completion, from, to) => {
            const insert = "console.log()";
            view.dispatch({
                changes: { from, to, insert },
                selection: { anchor: from + insert.length - 1 }, // cursor inside ()
            });
        },
    },
];
const slashCommandSource = (context) => {
    // "/" plus any filter text typed after it (e.g. "/dup")
    const match = context.matchBefore(/\/[\w-]*/);
    if (!match)
        return null;
    const { state, pos } = context;
    // standalone check #1: char before "/" must be line start or whitespace
    const charBefore = match.from === 0 ? "" : state.sliceDoc(match.from - 1, match.from);
    if (charBefore !== "" && !/\s/.test(charBefore))
        return null;
    // standalone check #2: char after the cursor must be line end or whitespace
    const charAfter = state.sliceDoc(pos, pos + 1);
    if (charAfter !== "" && !/\s/.test(charAfter))
        return null;
    return {
        from: match.from, // completions replace from the "/" itself
        options: slashCommands,
        // keep this result active (client-side filtering) while the user
        // types more word chars / hyphens after the "/"
        validFor: /^\/[\w-]*$/,
    };
};
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
        // register the slash-command source as an extra completion source
        // for JS content (alongside the default language completions)
        javascriptLanguage.data.of({ autocomplete: slashCommandSource }),
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
