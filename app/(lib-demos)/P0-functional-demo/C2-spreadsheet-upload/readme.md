# Spreadsheet Upload Demo

This demo implements a comprehensive spreadsheet upload feature that allows users to upload CSV or Excel files and select specific data ranges for processing.

## State Transitions:
1. Initial: Empty state
2. File Upload: `data` + `columnDefs` populated
3. Range Selection: `selectedData` + `selectedRange` + `selectedCellRefs` updated
4. Clear: Reset to initial state

## Single Source of Truth:
+ All spreadsheet data lives in one place
+ Components consume state, don't manage it

## Start with Questions:
+ What data do we need to store?
+ How does data flow between components?
+ What are the possible states of the application?
+ What actions can change the state?