import * as XLSX from "xlsx";
import { toast } from "sonner";
import { ColDef } from "ag-grid-community";

// File processing utility
export const processSpreadsheetFile = (
  file: File,
  onSuccess: (data: any[][], fileName: string) => void,
) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = e.target?.result;
      let worksheet: XLSX.WorkSheet;

      if (file.type === "text/csv") {
        const csvData = data as string;
        const workbook = XLSX.read(csvData, { type: "string" });
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
      } else {
        const workbook = XLSX.read(data, { type: "array" });
        worksheet = workbook.Sheets[workbook.SheetNames[0]];
      }

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      }) as any[][];

      if (jsonData.length === 0) {
        toast.error("The file appears to be empty");
        return;
      }

      onSuccess(jsonData, file.name);
      toast.success("File loaded successfully");
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error processing file. Please check the file format.");
    }
  };

  if (file.type === "text/csv") {
    reader.readAsText(file);
  } else {
    reader.readAsArrayBuffer(file);
  }
};

// Enhanced file processing for the modular version
export const processFile = async (
  file: File,
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

        //! Create column definitions, as we are load data dynamically
        const maxColumns = Math.max(
          ...(jsonData as any[][]).map((row) => row.length),
        );
        const columnDefs: ColDef[] = Array.from(
          { length: maxColumns },
          (_, i) => ({
            field: `col_${i}`,
            headerName: `Column ${String.fromCharCode(65 + i)}`,
            sortable: true,
            filter: true,
            resizable: true,
          }),
        );

        // Convert array data to object format
        const rowData = (jsonData as any[][]).map((row, index) => {
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
