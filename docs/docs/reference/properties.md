---
title: Properties
---

Once instantiated, canvas-datagrid exposes a number of properties.

```js
const grid = canvasDatagrid({ data });

// Some user interaction occurs

const activeCell = grid.activeCell;
```

## All options

|Name|Type|Description|
|---|---|---|

### activeCell <span class="properties-object-type">object</span>

Gets the active cell.  Consists of the properties rowIndex and columnIndex.

### attributes <span class="properties-object-type">object</span>

Object that contains the properties listed in the attributes section.  These properties can be used at runtime to alter attributes set during instantiation.  See the See {@link canvasDatagrid.params} section for full documentation.

### canvas <span class="properties-object-type">object</span>

The canvas element drawn onto for this grid.

### changes <span class="properties-object-type">array</span>

Array of changes and additions made to the grid since last time data was loaded.  The data property will change with changes as well, but this is a convince list of all the changes in one spot.  Calling `clearChangeLog` will clear this list.

### childGrids <span class="properties-object-type">boolean</span>

Child grids in this grid organized by internal unique row id.

### columnOrder <span class="properties-object-type">array</span>

Gets or sets the order of the columns.  This allows you to modify the appearance of the schema without modifying the data itself. The order of the array dictates the order of the columns, e.g.: [0, 1, 2] is normal order, [2, 1, 0] is reverse.  The array length must be equal to or greater than the number of columns.

### controlInput <span class="properties-object-type">object</span>

Input used for key controls on the grid.  Any clicks on the grid will cause this input to be focused.  This input is hidden above the top left corner of the browser window.

### currentCell <span class="properties-object-type">canvasDatagrid.cell</span>

Cell that the mouse moved over last.

### data <span class="properties-object-type">canvasDatagrid.data</span>

This is how data is set in the grid.  Data must be an array of objects that conform to a schema.  Data values can be any primitive type.  However if a cell value is another data array, an inner grid will be rendered into the cell.  This "cell grid" is different than a "tree grid" (the sort you drill in with a row header arrow) and uses the `cellGridAttributes` attribute for properties and styling. See {@link canvasDatagrid.data}.

### dragMode <span class="properties-object-type">string</span>

Represents the currently displayed resize cursor.  Can be `ns-resize`, `ew-resize`, `pointer`, or `inherit`.

### filters <span class="properties-object-type">canvasDatagrid.filter</span>

Object that contains a list of filters for filtering data.  The properties in this object match the `schema[].type` property.  For example, if the schema for a given column was of the type `date` the grid would look for a filter called `filters.date` if a filter cannot be found for a given data type a warning will be logged and the string/RegExp filter will be used.   See {@link canvasDatagrid.filters}.

### formatters <span class="properties-object-type">canvasDatagrid.formatter</span>

Object that contains formatting functions for displaying text.  The properties in this object match the `schema[].type` property.  For example, if the schema for a given column was of the type `date` the grid would look for a formatter called `formatters.date` if a formatter cannot be found for a given data type a warning will be logged and the string formatter will be used. Formatters must return a string value to be displayed in the cell.  See {@link canvasDatagrid.formatters}.

### frozenColumn <span class="properties-object-type">number</span>

The highest frozen column index.  Setting a value higher than the possible visible columns will result in a range error.

### frozenRow <span class="properties-object-type">number</span>

The highest frozen row index.  Setting a value higher than the possible visible rows will result in a range error.

### hasActiveFilters <span class="properties-object-type">boolean</span>

When true, grid data is being filtered.

### hasFocus <span class="properties-object-type">boolean</span>

When true, the grid is has focus.

### height <span class="properties-object-type">number</span>

Height of the grid.

### input <span class="properties-object-type">object</span>

Reference to the the edit cell when editing.  Undefined when not editing.  When editing, this DOM element is superimposed over the cell being edited and is fully visible.

### isChildGrid <span class="properties-object-type">boolean</span>

When true, this grid is a child grid of another grid.  Meaning, it appears as a tree grid or a cell grid of another parent grid.

### isChildGrid <span class="properties-object-type">boolean</span>

When true, this grid is within another grid.

### offsetLeft <span class="properties-object-type">number</span>

The offset left of the grid.

### offsetTop <span class="properties-object-type">number</span>

The offset top of the grid.

### openChildren <span class="properties-object-type">boolean</span>

List of open child grids by internal unique row id.

### orderBy <span class="properties-object-type">string</span>

The name of the column the grid is currently sorted by.  You can set this value to any column name to alter the sort order dependent on data type.  Subscribing to `beforesortcolumn` and calling `e.preventDefault` allows you to change the property and the graphical appearance of the grid (an order arrow will be drawn over the respective column) without invoking the client side ordering function.  This is useful if you want to use server side data ordering.

### orderDirection <span class="properties-object-type">string</span>

Gets or sets the order by direction.  Value can be `asc` for ascending order or `desc` for descending order.  Subscribing to `beforesortcolumn` and calling `e.preventDefault` allows you to change the property and the graphical appearance of the grid (an order arrow will be drawn over the respective column) without invoking the client side ordering function.  This is useful if you want to use server side data ordering.

### parentGrid <span class="properties-object-type">canvasDatagrid</span>

If this grid is a child grid, this is the grids parent.

### parentNode <span class="properties-object-type">HTMLElement</span>

The parent node of the canvas, usually the shadow DOM's parent element.

### rowOrder <span class="properties-object-type">array</span>

Gets or sets the order of the rows.  This allows you to modify the appearance of the data without modifying the data itself. The order of the array dictates the order of the rows, e.g.: [0, 1, 2] is normal order, [2, 1, 0] is reverse.  The array length must be equal to or greater than the number of rows.

### schema <span class="properties-object-type">canvasDatagrid.schema</span>

Schema is optional.  Schema is an array of {canvasDatagrid.header} objects.  If no schema is provided one will be generated from the data, in that case all data will be assumed to be string data. See {@link canvasDatagrid.schema}.

### scrollHeight <span class="properties-object-type">number</span>

The total number of pixels that can be scrolled down.

### scrollIndexRect <span class="properties-object-type">object</span>

Rect describing the view port of the virtual canvas in column and row indexes.  If you only want to do things to visible cells, this is a good property to check what the range of visible cells is.

### scrollLeft <span class="properties-object-type">number</span>

The current position of the horizontal scroll bar in pixels.

### scrollPixelRect <span class="properties-object-type">object</span>

Rect describing view port of the virtual canvas in pixels.

### scrollTop <span class="properties-object-type">number</span>

The current position of the vertical scroll bar in pixels.

### scrollWidth <span class="properties-object-type">number</span>

The total number of pixels that can be scrolled to the left.

### selectedCells <span class="properties-object-type">array</span>

Jagged array of cells that the user has selected.  Beware that because this is a jagged array, some indexes will be `null`.  Besides the `null`s this data looks just like the data you passed in, but just the cells the user has selected.  So if the user has selected cell 10 in a 10 column row, there will be 9 `null`s followed by the data from column 10.

### selectedRows <span class="properties-object-type">array</span>

Selected rows.  Same as the `data` property but filtered for the rows the user has cells selected in.  If any cell in the row is selected, all data for that row will appear in this array.

### selectionBounds <span class="properties-object-type">rect</span>

Bounds of current selection.

### selections <span class="properties-object-type">array</span>

Matrix array of selected cells.

### shadowRoot <span class="properties-object-type">HTMLElement</span>

The shadow root element.

### sizes <span class="properties-object-type">object</span>

Mutable object that contains `sizes.columns` and `sizes.rows` arrays.  These arrays control the sizes of the columns and rows.  If there is not an entry for the row or column index it will fall back to the style default.

### sorters <span class="properties-object-type">canvasDatagrid.sorter</span>

Object that contains a list of sorting functions for sorting columns.   See {@tutorial sorters}.

### style <span class="properties-object-type">canvasDatagrid.style</span>

Object that contains the properties listed in the style section.  Changing a style will automatically call `draw`.

### visibleCells <span class="properties-object-type">array</span>

Array of cell drawn.

### visibleRowHeights <span class="properties-object-type">array</span>

The heights of the visible rows.

### visibleRows <span class="properties-object-type">array</span>

Array of visible row indexes.

### width <span class="properties-object-type">number</span>

Width of the grid.
