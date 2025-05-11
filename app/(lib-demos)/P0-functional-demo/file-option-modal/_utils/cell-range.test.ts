import {
  excelColumnStrToColumnIndex,
  extractColumnAndRowFromCell,
  getColumnIndexBound,
  getStartingCellRowNumber,
  validateCell,
  validateCellRange,
} from "."; // Replace 'yourModule' with the actual file name

describe("validateCell", () => {
  it("should return true for valid cell format", () => {
    expect(validateCell("A1")).toBe(true);
    expect(validateCell("Z99")).toBe(true);
    expect(validateCell("AA100")).toBe(true);
  });

  it("should return false for invalid cell format", () => {
    expect(validateCell("1A")).toBe(false);
    expect(validateCell("A")).toBe(false);
    expect(validateCell("A1B")).toBe(false);
  });
});

describe("extractColumnAndRowFromCell", () => {
  it("should extract column and row from valid cell", () => {
    expect(extractColumnAndRowFromCell("A1")).toEqual({ column: "A", row: 1 });
    expect(extractColumnAndRowFromCell("Z99")).toEqual({
      column: "Z",
      row: 99,
    });
    expect(extractColumnAndRowFromCell("AA100")).toEqual({
      column: "AA",
      row: 100,
    });
  });

  it("should throw an error for invalid cell format", () => {
    expect(() => extractColumnAndRowFromCell("1A")).toThrow(
      "Invalid cell range"
    );
    expect(() => extractColumnAndRowFromCell("A")).toThrow(
      "Invalid cell range"
    );
  });
});

describe("validateCellRange", () => {
  it("should return true for valid cell range", () => {
    expect(validateCellRange({ startingCell: "A1", endingCell: "B2" })).toBe(
      true
    );
    expect(validateCellRange({ startingCell: "AA1", endingCell: "BB10" })).toBe(
      true
    );
  });

  it("should return false for invalid cell range", () => {
    expect(validateCellRange({ startingCell: "B2", endingCell: "A1" })).toBe(
      false
    );
    expect(validateCellRange({ startingCell: "Z1", endingCell: "A1" })).toBe(
      false
    );
  });

  it("should return false if any cell in the range is invalid", () => {
    expect(validateCellRange({ startingCell: "A1", endingCell: "B2C" })).toBe(
      false
    );
    expect(validateCellRange({ startingCell: "1A", endingCell: "B2" })).toBe(
      false
    );
  });
});

describe("excelColumnStrToColumnIndex", () => {
  it("should return correct column index for single-letter columns", () => {
    expect(excelColumnStrToColumnIndex("A")).toBe(0);
    expect(excelColumnStrToColumnIndex("B")).toBe(1);
    expect(excelColumnStrToColumnIndex("Z")).toBe(25);
  });

  it("should return correct column index for multi-letter columns", () => {
    expect(excelColumnStrToColumnIndex("AA")).toBe(26);
    expect(excelColumnStrToColumnIndex("AB")).toBe(27);
    expect(excelColumnStrToColumnIndex("BA")).toBe(52);
  });

  it("should throw an error for invalid column strings", () => {
    expect(() => excelColumnStrToColumnIndex("A1")).toThrow(
      "Invalid input: column string must only contain uppercase A-Z characters."
    );
    expect(() => excelColumnStrToColumnIndex("1")).toThrow(
      "Invalid input: column string must only contain uppercase A-Z characters."
    );
  });
});

describe("getColumnIndexBound", () => {
  it("should return correct column index bounds for valid cell ranges", () => {
    expect(
      getColumnIndexBound({ startingCell: "A1", endingCell: "C3" })
    ).toEqual({ leftBoundIndex: 0, rightBoundIndex: 2 });
    expect(
      getColumnIndexBound({ startingCell: "AA1", endingCell: "AC3" })
    ).toEqual({ leftBoundIndex: 26, rightBoundIndex: 28 });
  });

  it("should throw an error for invalid cell ranges", () => {
    expect(() =>
      getColumnIndexBound({ startingCell: "C1", endingCell: "A1" })
    ).toThrow("Invalid cell range");
  });
});

describe("getStartingCellRowNumber", () => {
  it("should return correct starting row number for valid cell ranges", () => {
    expect(
      getStartingCellRowNumber({ startingCell: "A1", endingCell: "C3" })
    ).toBe(1);
    expect(
      getStartingCellRowNumber({ startingCell: "AA100", endingCell: "AC200" })
    ).toBe(100);
  });

  it("should throw an error for invalid cell ranges", () => {
    expect(() =>
      getStartingCellRowNumber({ startingCell: "C1", endingCell: "A1" })
    ).toThrow("Invalid cell range");
  });
});
