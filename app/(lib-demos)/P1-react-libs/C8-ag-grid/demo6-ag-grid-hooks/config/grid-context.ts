// Grid context configuration for company-wide data
export interface GridContext {
  companyName: string;
  fiscalYear: number;
  currency: string;
  departmentBudgets: Record<string, number>;
  performanceThreshold: number;
  salaryIncrementRate: number;
}

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
