import * as XLSX from "xlsx";
import { toast } from "sonner";
import { ColDef } from "ag-grid-community";



/**
 * 
 * @param file The file to process
 * @param defaultHeaderRow The row to use as the header (0-indexed)
 * @returns A promise that resolves with the processed data and column definitions
 */
export const processFile = async (
  file: File,
  defaultHeaderRow: number = -1, // -1: auto-generate, 0: first row, 1: second row, etc.
): Promise<{ data: any[]; columnDefs: ColDef[] }> => {
  //! wrap event-driven paradigm into a promise for better async handling
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let workbook: XLSX.WorkBook;

        if (file.name.endsWith(".csv")) {
          workbook = XLSX.read(data, { type: "binary" });
        } else {
          workbook = XLSX.read(data, { type: "array" });
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length === 0) {
          throw new Error("File is empty");
        }

        const rawData = jsonData as any[][];
        let headerRow: any[] | null = null;
        let dataRows: any[][] = rawData;

        // Determine header row and data rows based on defaultHeaderRow
        if (defaultHeaderRow >= 0 && defaultHeaderRow < rawData.length) {
          headerRow = rawData[defaultHeaderRow];
          // Remove header row from data and all rows before it
          dataRows = rawData.slice(defaultHeaderRow + 1);
        }

        //! Create column definitions based on header strategy
        const maxColumns = Math.max(...rawData.map((row) => row.length));

        const columnDefs: ColDef[] = Array.from(
          { length: maxColumns },
          (_, i) => {
            let headerName: string;

            if (headerRow && i < headerRow.length && headerRow[i] != null) {
              // Use actual data from the specified header row
              headerName = String(headerRow[i]);
            } else {
              // Fallback to auto-generated headers (Column A, B, C...)
              headerName = `Column ${String.fromCharCode(65 + i)}`;
            }

            return {
              field: `col_${i}`,
              headerName,
              sortable: true,
              filter: true,
              resizable: true,
            };
          },
        );

        // Convert array data to object format
        const rowData = dataRows.map((row, index) => {
          const obj: any = { _rowIndex: index };
          row.forEach((cell, cellIndex) => {
            obj[`col_${cellIndex}`] = cell;
          });
          return obj;
        });

        resolve({ data: rowData, columnDefs });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));

    if (file.name.endsWith(".csv")) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};
