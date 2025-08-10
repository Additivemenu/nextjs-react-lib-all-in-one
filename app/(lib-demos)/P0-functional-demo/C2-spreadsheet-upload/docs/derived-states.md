# Derived State Pattern in React

## Overview

This document explains the derived state pattern implementation in our spreadsheet upload component and clarifies how `useMemo` works within React's render cycle.

## What is Derived State?

Derived state refers to data that can be computed from existing source state rather than being stored separately. Instead of maintaining redundant state variables, we calculate values on-demand from the source data.

### Before - Redundant State

```typescript
interface SpreadsheetState {
  data: any[][];
  selectedRange: string;
  selectedCellRefs: CellReference[]; // ❌ Redundant - can be derived
  selectedData: any[][]; // ❌ Redundant - can be derived
}
```

### After - Derived State

```typescript
interface SpreadsheetState {
  data: any[][];
  selectedRange: string;
  // selectedCellRefs and selectedData are computed on-demand
}
```

## Implementation: `useSpreadsheetSelectors`

Our implementation uses `useMemo` to efficiently compute derived state:

```typescript
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

  return { selectedCellRefs, selectedData, selectedRangeDescription };
};
```

## React Render Cycle and Timing

### Common Misconception ❌

> "Derived states are computed in a different component lifecycle and won't change immediately when source state changes."

### Reality ✅

**Derived states ARE computed synchronously in the same render cycle as source state changes.**

## Timeline of What Actually Happens

1. **User action triggers state change** (e.g., typing in range input)
2. **React schedules a re-render**
3. **During the render phase** (single render cycle):
   - Component function executes
   - `useSpreadsheetSelectors` hook executes
   - `useMemo` detects `state.selectedRange` has changed
   - **Computation runs immediately** to recalculate `selectedCellRefs`
   - **Computation runs immediately** to recalculate `selectedData`
   - New derived values are returned
4. **React commits the changes** to DOM with all updated values

## Key Benefits of useMemo

- ✅ **Same render cycle**: Source state + derived state are always in sync
- ✅ **Performance optimization**: Expensive computations only run when dependencies change
- ✅ **Consistency**: No race conditions or timing issues
- ✅ **Memory efficiency**: No redundant state storage

## Contrast with Asynchronous Patterns

### ❌ Wrong Approach - Async with useEffect

```typescript
const [selectedCellRefs, setSelectedCellRefs] = useState([]);

useEffect(() => {
  // This runs AFTER the render commit - creates inconsistency!
  const cellRefs = parseRange(state.selectedRange);
  setSelectedCellRefs(cellRefs);
}, [state.selectedRange]);
```

This would create timing issues where source and derived state are temporarily out of sync.

### ✅ Correct Approach - Sync with useMemo

```typescript
const selectedCellRefs = useMemo(() => {
  // This runs DURING the render - stays in sync!
  return parseRange(state.selectedRange);
}, [state.selectedRange]);
```

## When to Use Each Pattern

| Pattern     | Use Case                                | Timing                           |
| ----------- | --------------------------------------- | -------------------------------- |
| `useMemo`   | Derived/computed state                  | Synchronous (same render)        |
| `useEffect` | Side effects (API calls, subscriptions) | Asynchronous (after render)      |
| `useState`  | Independent source state                | Synchronous (triggers re-render) |

## Comparison with Redux useSelector

Our `useSpreadsheetSelectors` follows similar principles to Redux's `useSelector`:

| Aspect            | Redux useSelector              | Our useSpreadsheetSelectors |
| ----------------- | ------------------------------ | --------------------------- |
| **Purpose**       | Select from global state       | Select from local state     |
| **Memoization**   | Built-in with shallow equality | Explicit with useMemo       |
| **Recomputation** | When global state changes      | When dependencies change    |
| **Scope**         | Application-wide               | Component-specific          |

## Best Practices

1. **Identify what's truly source vs derived** - Keep only essential data in state
2. **Use useMemo for expensive computations** - Avoid recalculating on every render
3. **Design dependencies carefully** - Ensure memoization works effectively
4. **Keep derived state close to usage** - Use custom hooks for reusability
5. **Document the relationship** - Make it clear what derives from what

## Performance Considerations

- **Memoization overhead**: `useMemo` has a small cost, only use for expensive computations
- **Dependency arrays**: Keep them minimal and stable to avoid unnecessary recalculations
- **Memory vs computation trade-off**: Derived state saves memory but uses CPU cycles

This pattern provides excellent performance characteristics while maintaining clean, predictable state management.
