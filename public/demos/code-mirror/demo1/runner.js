/**
 * Output panel + code execution: runs the editor's document with
 * `new Function()` and captures `console.log` into the panel.
 */
export const createOutputPanel = (el) => ({
    append(text, isError = false) {
        const line = document.createElement("span");
        line.textContent = `${text}\n`;
        if (isError) {
            line.classList.add("error");
        }
        el.appendChild(line);
    },
    clear() {
        el.textContent = "";
    },
});
export const runCode = (code, panel) => {
    panel.clear();
    const originalLog = console.log;
    console.log = (...args) => {
        panel.append(args.map((arg) => String(arg)).join(" "));
        originalLog(...args);
    };
    try {
        // eslint-disable-next-line no-new-func
        new Function(code)();
    }
    catch (err) {
        panel.append(String(err), true);
    }
    finally {
        console.log = originalLog;
    }
};
