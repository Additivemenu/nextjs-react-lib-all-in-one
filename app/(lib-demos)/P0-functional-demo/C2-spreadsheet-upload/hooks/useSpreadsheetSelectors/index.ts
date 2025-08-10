import { useMemo } from "react";
import {
  SpreadsheetState,
  DerivedSpreadsheetState,
  CellReference,
} from "../../types";
import { parseRange, getCellRange } from "../../utils/excel-helpers";

/**
 * Custom hook that computes derived state from source spreadsheet state
 * This prevents storing redundant data and ensures consistency
 *
 * @param state - Source spreadsheet state
 * @returns Computed derived state (selectedCellRefs, selectedData, etc.)
 */
export const useSpreadsheetSelectors = (
  state: SpreadsheetState,
): DerivedSpreadsheetState => {
  // 🔄 Derive selectedCellRefs from selectedRange
  const selectedCellRefs: CellReference[] = useMemo(() => {
    if (!state.selectedRange?.trim()) return [];

    const cellRefs = parseRange(state.selectedRange);
    return cellRefs || [];
  }, [state.selectedRange]);

  // 🔄 Derive selectedData from data + selectedCellRefs
  const selectedData = useMemo(() => {
    if (selectedCellRefs.length === 0 || state.data.length === 0) return [];

    const result = getCellRange(state.data, state.columnDefs, selectedCellRefs);
    return result.data;
  }, [state.data, state.columnDefs, selectedCellRefs]);

  // 🔄 Derive selectedRangeDescription for UI display
  const selectedRangeDescription = useMemo(() => {
    if (selectedCellRefs.length === 0 || state.data.length === 0) return "";

    const result = getCellRange(state.data, state.columnDefs, selectedCellRefs);
    return result.range;
  }, [state.data, state.columnDefs, selectedCellRefs]);

  return {
    selectedCellRefs,
    selectedData,
    selectedRangeDescription,
  };
};
