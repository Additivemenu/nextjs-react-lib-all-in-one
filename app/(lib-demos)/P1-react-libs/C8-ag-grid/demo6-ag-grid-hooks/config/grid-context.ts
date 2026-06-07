// Grid context configuration for company-wide data
export interface GridContext {
  companyName: string;
  fiscalYear: number;
  currency: string;
  departmentBudgets: Record<string, number>;
  performanceThreshold: number;
  salaryIncrementRate: number;
}

/**
 * context in ag-grid is a way to pass global data to all cells and components within the grid.
 * What can be put in context?
 * Any data that is relevant to the entire grid, such as user information, configuration settings,
 * business logic, or any other shared data.
 *
 * Any cell renderer, editor or custom component can access this context via the params.context property.
 *
 * This has several pros:
 * 1. Centralized Data: It allows you to define data that is relevant to the entire grid in one place.
 * 2. Easy Access: Any cell renderer, editor, or filter can access this context data without needing to pass it down through props.
 * 3. Consistency: Ensures that all parts of the grid have access to the same global data, reducing the risk of inconsistencies.
 *
 * @returns A GridContext object with predefined company data.
 */
export const createGridContext = (): GridContext => ({
  companyName: "TechCorp Inc.",
  fiscalYear: 2025,
  currency: "USD",
  departmentBudgets: {
    Engineering: 2000000,
    Marketing: 1500000,
    HR: 800000,
    Management: 3000000,
  },
  performanceThreshold: 8.0,
  salaryIncrementRate: 0.05,
});
