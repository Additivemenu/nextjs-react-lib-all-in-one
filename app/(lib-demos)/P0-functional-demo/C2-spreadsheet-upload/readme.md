# Spreadsheet Upload Demo

This demo implements a comprehensive spreadsheet upload feature that allows users to upload CSV or Excel files and select specific data ranges for processing.

## Features Implemented

### ✅ File Upload

- **File selector** for CSV and Excel files (.csv, .xlsx, .xls)
- **File validation** using Zod schema to ensure only acceptable file types
- **File processing** using the `xlsx` library to handle both CSV and Excel formats
- **Error handling** with user-friendly messages via toast notifications

### ✅ Data Preview

- **AG Grid integration** for displaying spreadsheet data in a professional table format
- **Column headers** automatically generated (Column A, Column B, etc.)
- **Sortable and filterable** columns for better data exploration
- **Pagination** support for large datasets
- **Responsive design** that works across different screen sizes

### ✅ Range Selection

- **Interactive range selection** via click and drag in the AG Grid
- **Manual cell input** with two text fields for start and end cell references (e.g., A1 to E7)
- **Visual highlighting** of selected ranges with blue background and border
- **Excel-style cell references** (A1, B2, etc.) for intuitive usage
- **Automatic sync** between visual selection and text inputs

### ✅ Form Management

- **React Hook Form** integration for robust form handling
- **Zod validation** for file type checking and form validation
- **Form submission** that processes either the entire file or selected range
- **Clear functionality** to reset the form and data

### ✅ State Management

- **React Reducer** for managing complex spreadsheet state
- **Immutable state updates** following React best practices
- **Separated concerns** with actions for different state operations

## Technical Implementation

### Libraries Used

- **AG Grid React** - Professional data grid component
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **XLSX** - Excel/CSV file processing
- **Sonner** - Toast notifications
- **Tailwind CSS** - Styling and responsive design

### Key Components

1. **File Upload Section** - Handles file selection and validation
2. **Range Selection Inputs** - Manual cell reference input fields
3. **Data Preview Grid** - AG Grid with custom cell styling for selections
4. **Form Submission** - Processes selected data for upload

### Data Flow

1. User selects a file → File is processed and parsed
2. Data is displayed in AG Grid → User can select ranges visually or manually
3. Selected range is highlighted → Form submission processes selected data
4. Data is prepared for server upload (currently logs to console)

## Usage Instructions

1. **Select a file**: Choose a CSV or Excel file using the file selector
2. **Preview data**: The uploaded data will appear in the grid below
3. **Select range** (optional):
   - **Visual selection**: Click and drag in the grid to select cells
   - **Manual selection**: Enter cell references like "A1" and "E7" in the input fields
4. **Upload**: Click "Upload Selected Data" to process the data
5. **Clear**: Use the "Clear" button to reset everything

## Future Enhancements

- Upload large CSV/Excel files with streaming support
- Server-side file processing and storage
- Data validation and cleaning options
- Export functionality for processed data
- Batch processing for multiple files
