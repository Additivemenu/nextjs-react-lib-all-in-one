import { ICellRendererParams } from "ag-grid-community";
import { EmployeeData } from "../../data/sample-data";

// Status renderer to show how params.value affects rendering
export const StatusRenderer = (params: ICellRendererParams<EmployeeData>) => {
  const { value, data } = params;

  if (!data) return null;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${
          value ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className={value ? "text-green-700" : "text-red-700"}>
        {value ? "Active" : "Inactive"}
      </span>
      {/* Show additional info using row data from params */}
      {!value && (
        <span className="text-xs text-gray-500">
          (Since {new Date(data.startDate).getFullYear()})
        </span>
      )}
    </div>
  );
};
