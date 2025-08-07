// Sample employee data for the AG-Grid demo
export interface EmployeeData {
  id: number;
  name: string;
  age: number;
  salary: number;
  department: string;
  startDate: string;
  isActive: boolean;
  performance: number;
}

export const employeeData: EmployeeData[] = [
  {
    id: 1,
    name: "John Doe",
    age: 28,
    salary: 75000,
    department: "Engineering",
    startDate: "2022-01-15",
    isActive: true,
    performance: 8.5,
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 32,
    salary: 85000,
    department: "Marketing",
    startDate: "2021-03-20",
    isActive: true,
    performance: 9.2,
  },
  {
    id: 3,
    name: "Bob Johnson",
    age: 45,
    salary: 95000,
    department: "Engineering",
    startDate: "2020-07-10",
    isActive: false,
    performance: 7.8,
  },
  {
    id: 4,
    name: "Alice Brown",
    age: 29,
    salary: 70000,
    department: "HR",
    startDate: "2023-02-28",
    isActive: true,
    performance: 8.9,
  },
  {
    id: 5,
    name: "Charlie Wilson",
    age: 38,
    salary: 120000,
    department: "Management",
    startDate: "2019-11-05",
    isActive: true,
    performance: 9.5,
  },
];
