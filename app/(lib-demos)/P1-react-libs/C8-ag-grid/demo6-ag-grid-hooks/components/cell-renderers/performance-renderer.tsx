import { ICellRendererParams } from "ag-grid-community";
import { EmployeeData } from "../../data/sample-data";
import { GridContext } from "../../config/grid-context";

// Custom cell renderer to demonstrate ICellRendererParams
export const PerformanceRenderer = (
  params: ICellRendererParams<EmployeeData>,
) => {
  const { value, data } = params;

  if (!data) return null;

  // Use params to access both cell value and row data
  const getPerformanceColor = () => {
    if (value >= 9) return "text-green-600 font-bold";
    if (value >= 8) return "text-blue-600";
    if (value >= 7) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceIcon = () => {
    if (value >= 9) return "⭐";
    if (value >= 8) return "👍";
    if (value >= 7) return "👌";
    return "⚠️";
  };

  return (
    <div className="flex items-center gap-2">
      <span>{getPerformanceIcon()}</span>
      <span className={getPerformanceColor()}>{value}/10</span>
      {/* Using data from params to show additional context */}
      <span className="text-xs text-gray-500">({data.department})</span>
    </div>
  );
};
