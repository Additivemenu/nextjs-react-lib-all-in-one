import { toast } from "sonner";

/**
 * Hook for data operations (copy, download) on selected data
 * Now accepts selectedData as parameter instead of relying on stored state
 */
export const useDataOperations = () => {
  const handleCopyData = (selectedData: any[]) => {
    if (selectedData.length === 0) {
      toast.error("No data selected to copy");
      return;
    }

    try {
      const csvContent = convertToCSV(selectedData);
      navigator.clipboard.writeText(csvContent);
      toast.success(`Copied ${selectedData.length} rows to clipboard`);
    } catch (error) {
      toast.error("Failed to copy data to clipboard");
    }
  };

  const handleDownloadData = (selectedData: any[], selectedRange: string) => {
    if (selectedData.length === 0) {
      toast.error("No data selected to download");
      return;
    }

    try {
      const csvContent = convertToCSV(selectedData);
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `selected-data-${selectedRange || "range"}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${selectedData.length} rows`);
    } catch (error) {
      toast.error("Failed to download data");
    }
  };

  return { handleCopyData, handleDownloadData };
};

// Helper function to convert data to CSV format
function convertToCSV(data: any[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape values that contain commas or quotes
          return typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        })
        .join(","),
    ),
  ];

  return csvRows.join("\n");
}
