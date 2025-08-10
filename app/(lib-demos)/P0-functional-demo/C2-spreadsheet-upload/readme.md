# Spreadsheet Upload Demo

This demo implements a comprehensive spreadsheet upload feature that allows users to upload CSV or Excel files and select specific data ranges for processing.

## 🎯 State Architecture (Derived State Pattern)

### Source State (Single Source of Truth)

```typescript
interface SpreadsheetState {
  data: any[]; // Raw uploaded file data
  columnDefs: ColDef[]; // AG Grid column definitions
  selectedRange: string; // Range string (e.g., "A1:C10")
}
```

### Derived State (Computed On-Demand)

```typescript
interface DerivedSpreadsheetState {
  selectedCellRefs: CellReference[]; // Computed from selectedRange
  selectedData: any[]; // Computed from data + selectedRange
  selectedRangeDescription: string; // Computed UI description
}
```

## 🔄 State Derivation Flow

```
selectedRange → parseRange() → selectedCellRefs
     ↓
data + selectedCellRefs → getCellRange() → selectedData + description
```

## 📊 Benefits of Derived State Pattern

1. **Single Source of Truth**: Only `selectedRange` is stored, other values computed
2. **Consistency**: No risk of `selectedCellRefs` being out of sync with `selectedRange`
3. **Performance**: Memoized computations prevent unnecessary recalculations
4. **Maintainability**: Simpler state transitions, fewer edge cases

## State Transitions:

1. **Initial**: Empty state
2. **File Upload**: `data` + `columnDefs` populated
3. **Range Selection**: Only `selectedRange` updated (derived state auto-computed)
4. **Clear**: Reset to initial state

## Key Design Principles:

- **State-First Design**: Data structure designed before UI components
  -  :white_check_mark: [the derived states ARE computed synchronously in the same render cycle as the source state changes](./docs/derived-states.md)
- **Derived State**: Avoid storing redundant data that can be computed
- **Single Source of Truth**: All spreadsheet data lives in one place
- **Components Consume State**: Components don't manage state, only display it

## 🏗️ Architecture Components:

- **useSpreadsheetSelectors**: Hook that computes derived state with memoization
- **CellRange**: Class-based range parsing and validation
- **Modular Hooks**: Separated concerns (file upload, range selection, data operations)


