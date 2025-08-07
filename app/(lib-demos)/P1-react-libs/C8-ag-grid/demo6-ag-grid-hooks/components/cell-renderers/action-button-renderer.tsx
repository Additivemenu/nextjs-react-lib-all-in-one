import { ICellRendererParams } from "ag-grid-community";
import { EmployeeData } from "../../data/sample-data";

// Advanced cell renderer demonstrating params.api usage
export const ActionButtonRenderer = (
  params: ICellRendererParams<EmployeeData>,
) => {
  const { data, api, node } = params;

  if (!data || !api || !node) return null;

  const handlePromote = () => {
    // Use params.api to get selected rows and update data
    const selectedNodes = api.getSelectedNodes();
    const totalSelected = selectedNodes.length;

    // Update the current row's data using the API
    const updatedData = {
      ...data,
      performance: Math.min(data.performance + 0.5, 10),
    };
    node.setData(updatedData);

    // Show info about selected rows using the API
    alert(
      `Promoted ${data.name}! Performance: ${updatedData.performance}/10\nTotal selected rows: ${totalSelected}`,
    );

    // Refresh the grid to show changes
    api.refreshCells({ rowNodes: [node] });
  };

  const handleGetRowInfo = () => {
    // Demonstrate various API methods
    const rowCount = api.getDisplayedRowCount();
    const allRowData: EmployeeData[] = [];
    api.forEachNode((node) => {
      if (node.data) allRowData.push(node.data);
    });

    const avgSalary =
      allRowData.reduce((sum, row) => sum + row.salary, 0) / allRowData.length;

    alert(`Grid Info via params.api:
- Total rows: ${rowCount}
- Average salary: $${avgSalary.toLocaleString()}
- Current row index: ${node.rowIndex}
- Row ID: ${node.id}`);
  };

  return (
    <div className="flex gap-1">
      <button
        onClick={handlePromote}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        title="Promote employee (uses params.api)"
      >
        📈
      </button>
      <button
        onClick={handleGetRowInfo}
        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
        title="Show grid info (uses params.api)"
      >
        ℹ️
      </button>
    </div>
  );
};
