// worker.ts
import * as XLSX from "xlsx";

// Define the message types
type WorkerMessage = {
  file: ArrayBuffer;
  headerRow?: number;
  readFirstNRows?: number;
};

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  try {
    const { file, headerRow, readFirstNRows } = e.data;

    const data = new Uint8Array(file);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet["!ref"]!);

    if (readFirstNRows) {
      // Read multiple rows for caching
      const allHeaders: string[][] = [];

      for (let row = 0; row < readFirstNRows; row++) {
        const rowHeaders: string[] = [];
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = { c: col, r: row };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          const cell = worksheet[cellRef];

          let cellValue: string;
          if (cell) {
            switch (cell.t) {
              case "n": // number
                cellValue = cell.v.toString();
                break;
              case "b": // boolean
                cellValue = cell.v ? "TRUE" : "FALSE";
                break;
              case "d": // date
                cellValue = cell.w || cell.v.toString();
                break;
              case "s": // string
              case "str": // formula string
                cellValue = cell.v;
                break;
              default:
                cellValue = cell.v ? String(cell.v) : "";
            }
          } else {
            cellValue = "";
          }
          rowHeaders.push(cellValue);
        }

        // Replace empty headers with default header convention
        rowHeaders.forEach((header, index) => {
          if (header.trim() === "") {
            rowHeaders[index] = `Unnamed: ${index}`;
          }
        });

        allHeaders.push(rowHeaders);
      }

      self.postMessage({ headers: allHeaders });
      return;
    }

    // Original single-row reading logic (no caching)
    if (!headerRow || headerRow < 1) {
      self.postMessage({ headers: [] });
      return;
    }

    const headers: string[] = [];
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = { c: col, r: headerRow - 1 };
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      const cell = worksheet[cellRef];

      let cellValue: string;
      if (cell) {
        switch (cell.t) {
          case "n":
            cellValue = cell.v.toString();
            break;
          case "b":
            cellValue = cell.v ? "TRUE" : "FALSE";
            break;
          case "d":
            cellValue = cell.w || cell.v.toString();
            break;
          case "s":
          case "str":
            cellValue = cell.v;
            break;
          default:
            cellValue = cell.v ? String(cell.v) : "";
        }
      } else {
        cellValue = "";
      }
      headers.push(cellValue);
    }

    headers.forEach((header, index) => {
      if (header.trim() === "") {
        headers[index] = `Unnamed: ${index}`;
      }
    });

    self.postMessage({ headers });
  } catch (error) {
    if (error instanceof Error) {
      self.postMessage({ error: error.message });
    }
  }
};

export {};
