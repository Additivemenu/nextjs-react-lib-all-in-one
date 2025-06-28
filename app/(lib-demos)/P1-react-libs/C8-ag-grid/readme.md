https://www.ag-grid.com/react-data-grid/getting-started/

# key features

ag-grid 已经封装好了很多功能, 用起来主打 configuration (not composition), 同时允许插入一定程度的自定义的逻辑 (e.g. cell component, custom filter, custom cell editor)

## Showing Data

define how to display data in a configuration object (usually column-wise)

- mapping values -> `valueGetter`
- format values -> `valueFormatter`
- cell component
  - render a custom component in a cell
- resizing column

## Working with data

- filtering
  - ag-grid has 5 provided filters, you can also have custom filter
- editing
  - 7 provided cell editor, you can also create your own custom cell editor
- sorting
- row selection
  - `rowSelection` attr obj on table component
- pagination
  - `pagination` attr on table component


## Theme & Styling

+ `theme` attr on table component allows you to define custom theme for the table
  + ag-grid provides a theme builder interface
+ cell style
  + `cellClassRules` + css --> conditional cell styling
+ row style
  + `rowClassRules` + css --> conditional cell styling