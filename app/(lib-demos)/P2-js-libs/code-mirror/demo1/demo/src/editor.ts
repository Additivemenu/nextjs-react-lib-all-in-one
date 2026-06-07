/**
 * Editor creation: state + extensions, mounted onto a parent element.
 */
import { basicSetup, EditorView } from "codemirror";
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import { slashCommandSource } from "./slash-commands.js";

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

export const createEditor = (
  parent: HTMLElement,
  onDocChanged: (view: EditorView) => void,
): EditorView =>
  new EditorView({
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
          onDocChanged(update.view);
        }
      }),
    ],
    parent,
  });
