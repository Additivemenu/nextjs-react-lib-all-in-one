import { toast } from "sonner";

export const useDataOperations = (selectedData: any[]) => {
  const handleCopyData = () => {
    if (selectedData.length === 0) return;

    const csvContent = [
      Object.keys(selectedData[0]).join(","),
      ...selectedData.map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(","),
      ),
    ].join("\n");

    navigator.clipboard.writeText(csvContent);
    toast.success("Data copied to clipboard!");
  };

  const handleDownloadData = () => {
    if (selectedData.length === 0) return;

    const csvContent = [
      Object.keys(selectedData[0]).join(","),
      ...selectedData.map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `selected_data_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Data downloaded successfully!");
  };

  return { handleCopyData, handleDownloadData };
};
