/**
 * Output panel + code execution: runs the editor's document with
 * `new Function()` and captures `console.log` into the panel.
 */

export interface OutputPanel {
  append(text: string, isError?: boolean): void;
  clear(): void;
}

export const createOutputPanel = (el: HTMLPreElement): OutputPanel => ({
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

export const runCode = (code: string, panel: OutputPanel): void => {
  panel.clear();

  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    panel.append(args.map((arg) => String(arg)).join(" "));
    originalLog(...args);
  };

  try {
    // eslint-disable-next-line no-new-func
    new Function(code)();
  } catch (err) {
    panel.append(String(err), true);
  } finally {
    console.log = originalLog;
  }
};
