import { ICellRendererParams } from "ag-grid-community";
import { EmployeeData } from "../../data/sample-data";
import { GridContext } from "../../config/grid-context";

// Advanced cell renderer demonstrating params.context usage
export const BudgetAnalysisRenderer = (
  params: ICellRendererParams<EmployeeData>,
) => {
  const { data, value, context } = params;

  if (!data || !context) return <span>{value}</span>;

  // Use params.context to access company-wide data
  const gridContext = context as GridContext;
  const { departmentBudgets, companyName, fiscalYear } = gridContext;
  const deptBudget = departmentBudgets[data.department] || 0;
  const salaryPercentage = ((data.salary / deptBudget) * 100).toFixed(2);

  const getBudgetStatus = () => {
    const percentage = parseFloat(salaryPercentage);
    if (percentage > 10)
      return { color: "text-red-600", icon: "🔴", status: "High" };
    if (percentage > 5)
      return { color: "text-yellow-600", icon: "🟡", status: "Medium" };
    return { color: "text-green-600", icon: "🟢", status: "Low" };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <span className={`text-xs font-semibold ${budgetStatus.color}`}>
          {salaryPercentage}%
        </span>
        <span>{budgetStatus.icon}</span>
      </div>
      <div className="text-xs text-gray-500">{budgetStatus.status} impact</div>
      <div className="text-xs text-gray-400">
        {companyName} {fiscalYear}
      </div>
    </div>
  );
};
