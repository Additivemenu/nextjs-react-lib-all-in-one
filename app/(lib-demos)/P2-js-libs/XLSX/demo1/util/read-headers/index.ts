/**
 *
 * This function reads the file in a web worker to avoid blocking the main thread.
 *
 * @param file
 * @param headerRow
 * @returns Promise<string[]> a promise that resolves with the headers array
 */
export const readHeaderValuesAsync = async (
  file: File,
  headerRow: number,
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    // Create a worker instance
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });

    // Handle worker messages
    worker.onmessage = (e: MessageEvent) => {
      const { headers, error } = e.data;
      worker.terminate(); // Clean up the worker

      if (error) {
        reject(new Error(error));
      } else {
        resolve(headers);
      }
    };

    // Handle worker errors
    worker.onerror = (error) => {
      worker.terminate();
      reject(error);
    };

    // Read the file and send it to the worker
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      worker.postMessage({
        file: e.target?.result,
        headerRow,
      });
    };
    reader.onerror = (error) => {
      worker.terminate();
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};
