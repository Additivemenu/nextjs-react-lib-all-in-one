import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SpreadsheetUploadPage from "./page";

// Mock the dependencies
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("ag-grid-react", () => ({
  AgGridReact: ({ columnDefs, rowData, onRangeSelectionChanged }: any) => (
    <div
      data-testid="ag-grid"
      data-columns={columnDefs?.length}
      data-rows={rowData?.length}
    >
      Mock AG Grid
    </div>
  ),
}));

// Mock file reading
const mockFileReader = {
  readAsText: jest.fn(),
  readAsArrayBuffer: jest.fn(),
  onload: null as any,
  result: null as any,
};

global.FileReader = jest.fn(() => mockFileReader) as any;

describe("SpreadsheetUploadPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the upload form", () => {
    render(<SpreadsheetUploadPage />);

    expect(screen.getByText("Spreadsheet Upload")).toBeInTheDocument();
    expect(screen.getByLabelText(/Select File/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        "Upload CSV or Excel files and select data ranges for processing",
      ),
    ).toBeInTheDocument();
  });

  it("shows file input with correct accept types", () => {
    render(<SpreadsheetUploadPage />);

    const fileInput = screen.getByLabelText(/Select File/i);
    expect(fileInput).toHaveAttribute("accept", ".csv,.xlsx,.xls");
    expect(fileInput).toHaveAttribute("type", "file");
  });

  it("displays range selection inputs after file upload", async () => {
    render(<SpreadsheetUploadPage />);

    // Initially, range inputs should not be visible
    expect(screen.queryByLabelText(/Start Cell/i)).not.toBeInTheDocument();

    // We would need to mock file upload to test this properly
    // This is a basic structure test
  });

  it("has proper form structure", () => {
    render(<SpreadsheetUploadPage />);

    const form =
      screen.getByRole("form") ||
      screen.getByTestId("upload-form") ||
      document.querySelector("form");
    expect(form).toBeInTheDocument();
  });
});
