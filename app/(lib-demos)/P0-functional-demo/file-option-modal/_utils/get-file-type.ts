function isExcelFile(file: File): boolean {
  return (
    file.type === "application/vnd.ms-excel" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}

function isCsvFile(file: File): boolean {
  return file.type === "text/csv";
}

export function getFileType(file: File): "excel" | "csv" | "unknown" {
  if (isExcelFile(file)) return "excel";
  if (isCsvFile(file)) return "csv";
  return "unknown";
}
