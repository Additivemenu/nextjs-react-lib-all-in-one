// Simple CSV file processor with header row support and encoding detection
export interface ProcessedData {
  data: any[];
  columnDefs: Array<{ field: string; headerName: string }>;
}

// Helper function to detect and handle different encodings
const readFileWithEncoding = async (file: File): Promise<string> => {
  // Try reading as UTF-8 first
  try {
    const text = await file.text();
    // Check if the text contains question marks or replacement characters indicating encoding issues
    if (text.includes("�") || text.includes("?")) {
      throw new Error("Encoding issue detected");
    }
    return text;
  } catch (error) {
    // If UTF-8 fails, try with different encoding
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder("gbk"); // Common Chinese encoding
    try {
      return decoder.decode(buffer);
    } catch (gbkError) {
      // If GBK fails, try other common encodings
      const utf16Decoder = new TextDecoder("utf-16");
      try {
        return utf16Decoder.decode(buffer);
      } catch (utf16Error) {
        // Fall back to latin1
        const latin1Decoder = new TextDecoder("latin1");
        return latin1Decoder.decode(buffer);
      }
    }
  }
};

// Enhanced CSV parsing that handles quotes and commas better
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Handle escaped quotes
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === "," && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = "";
      i++;
    } else {
      current += char;
      i++;
    }
  }

  // Add the last field
  result.push(current.trim());
  return result;
};

export const processFileWithHeader = async (
  file: File,
  headerRowIndex: number = 0,
): Promise<ProcessedData> => {
  const text = await readFileWithEncoding(file);

  // Split into lines and remove empty lines - using proper regex syntax
  const lines = text
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => parseCSVLine(line));

  if (lines.length === 0) {
    throw new Error("No data found in the file");
  }

  if (headerRowIndex >= lines.length) {
    throw new Error(
      `Header row index ${headerRowIndex} is beyond the available data (${lines.length} rows)`,
    );
  }

  // Extract headers from the specified row
  const headers = lines[headerRowIndex] || [];

  // Process data starting from the row after the header
  const dataRows = lines.slice(headerRowIndex + 1);

  // Create column definitions
  const columnDefs = headers.map((header, index) => ({
    field: String(header || `Column_${index + 1}`),
    headerName: String(header || `Column ${index + 1}`),
  }));

  // Convert data rows to objects using headers as keys
  const data = dataRows.map((row, rowIndex) => {
    const obj: any = {};
    headers.forEach((header, index) => {
      const key = String(header || `Column_${index + 1}`);
      obj[key] = row[index] !== undefined ? row[index] : "";
    });
    return obj;
  });

  return {
    data,
    columnDefs,
  };
};
