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
export const slashCommandSource = (context) => {
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
