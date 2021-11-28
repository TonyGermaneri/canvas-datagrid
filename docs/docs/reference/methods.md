---
title: Methods
---

### formatter

A formatting function.  Must be a member of (property of) {@link canvasDatagrid.formatters} and match a type from one of the {@link canvasDatagrid.header}s in {@link canvasDatagrid.schema}.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|e|object|||Formatting event object.|
|e.cell|canvasDatagrid.cell|||Cell being formatted.|

### filter

A filter function.  Filter should return true when the value should be kept, and false if the value should be filtered out.  Must be a member of (property of) {canvasDatagrid.filters} and match a type from one of the {@link canvasDatagrid.header}s in {@link canvasDatagrid.schema}.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|value|string|||The current value being checked.|
|filterFor|string|||The value being filtered against.|

### sorter

A sorter function.  Must be a member of (property of) {@link canvasDatagrid.sorters} and match a type from one of the {@link canvasDatagrid.header}s in {@link canvasDatagrid.schema}.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|columnName|string|||Name of the column being sorted.|
|direction|string|||Direction of the column being sorted, either `asc` or `desc`.|

### exports



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### integerToAlpha

Converts a integer into a letter A - ZZZZZ...

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|n|column|||The number to convert.|

### integerToAlpha



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### insertColumn

Inserts a new column before the specified index into the schema.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|c|column|||The column to insert into the schema.|
|index|number|||The index of the column to insert before.|

### insertColumn



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### deleteColumn

Deletes a column from the schema at the specified index.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|index|number|||The index of the column to delete.|

### deleteColumn



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### addColumn

Adds a new column into the schema.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|c|column|||The column to add to the schema.|

### addColumn



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### deleteRow

Deletes a row from the dataset at the specified index.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|index|number|||The index of the row to delete.|

### deleteRow



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### insertRow

Inserts a new row into the dataset before the specified index.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|d|object|||data.|
|index|number|||The index of the row to insert before.|

### insertRow



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### addRow

Adds a new row into the dataset.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|d|object|||data.|

### addRow



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### setRowHeight

Sets the height of a given row by index number.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|rowIndex|number|||The index of the row to set.|
|height|number|||Height to set the row to.|

### setRowHeight



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### setColumnWidth

Sets the width of a given column by index number.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|colIndex|number|||The index of the column to set.|
|width|number|||Width to set the column to.|

### setColumnWidth



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### resetColumnWidths

Removes any changes to the width of the columns due to user or api interaction, setting them back to the schema or style default.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### resetColumnWidths



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### resetRowHeights

Removes any changes to the height of the rows due to user or api interaction, setting them back to the schema or style default.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### resetRowHeights



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### setFilter

Sets the value of the filter.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|column|string|||Name of the column to filter.|
|value|string|||The value to filter for.|

### setFilter



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### findRowScrollTop

Returns the number of pixels to scroll down to line up with row rowIndex.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|rowIndex|number|||The row index of the row to scroll find.|

### findRowScrollTop



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### findColumnScrollLeft

Returns the number of pixels to scroll to the left to line up with column columnIndex.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|columnIndex|number|||The column index of the column to find.|

### findColumnScrollLeft



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### gotoCell

Scrolls to the cell at columnIndex x, and rowIndex y.  If you define both rowIndex and columnIndex additional calculations can be made to center the cell using the target cell's height and width.  Defining only one rowIndex or only columnIndex will result in simpler calculations.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|x|number|||The column index of the cell to scroll to.|
|y|number|||The row index of the cell to scroll to.|
|offsetX|number|||Percentage offset the cell should be from the left edge (not including headers).  The default is 0, meaning the cell will appear at the left edge. Valid values are 0 through 1. 1 = Left, 0 = Right, 0.5 = Center.|
|offsetY|number|||Percentage offset the cell should be from the top edge (not including headers).  The default is 0, meaning the cell will appear at the top edge. Valid values are 0 through 1. 1 = Bottom, 0 = Top, 0.5 = Center.|

### gotoCell



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### gotoRow

Scrolls the row y.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|y|number|||The row index of the cell to scroll to.|

### gotoRow



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### scrollIntoView

Scrolls the cell at cell x, row y into view if it is not already.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|x|number|||The column index of the cell to scroll into view.|
|y|number|||The row index of the cell to scroll into view.|
|offsetX|number|||Percentage offset the cell should be from the left edge (not including headers).  The default is 0, meaning the cell will appear at the left edge. Valid values are 0 through 1. 1 = Left, 0 = Right, 0.5 = Center.|
|offsetY|number|||Percentage offset the cell should be from the top edge (not including headers).  The default is 0, meaning the cell will appear at the top edge. Valid values are 0 through 1. 1 = Bottom, 0 = Top, 0.5 = Center.|

### scrollIntoView



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### setActiveCell

Sets the active cell. Requires redrawing.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|x|number|||The column index of the cell to set active.|
|y|number|||The row index of the cell to set active.|

### setActiveCell



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### selectNone

Removes the selection.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|dontDraw|boolean|||Suppress the draw method after the selection change.|

### selectNone



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### selectAll

Selects every visible cell.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|dontDraw|boolean|||Suppress the draw method after the selection change.|

### selectAll



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### isColumnSelected

Returns true if the selected columnIndex is selected on every row.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|columnIndex|number|||The column index to check.|

### isColumnSelected



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### forEachSelectedCell

Runs the defined method on each selected cell.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|fn|number|||The function to execute.  The signature of the function is: (data, rowIndex, columnName).|
|expandToRow|number|||When true the data in the array is expanded to the entire row.|

### forEachSelectedCell



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### selectColumn

Selects a column.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|columnIndex|number|||The column index to select.|
|toggleSelectMode|boolean|||When true, behaves as if you were holding control/command when you clicked the column.|
|shift|boolean|||When true, behaves as if you were holding shift when you clicked the column.|
|supressSelectionchangedEvent|boolean|||When true, prevents the selectionchanged event from firing.|

### selectColumn



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### addCol



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### removeCol



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### selectRow

Selects a row.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|rowIndex|number|||The row index to select.|
|ctrl|boolean|||When true, behaves as if you were holding control/command when you clicked the row.|
|shift|boolean|||When true, behaves as if you were holding shift when you clicked the row.|
|supressSelectionchangedEvent|boolean|||When true, prevents the selectionchanged event from firing.|

### selectRow



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### de



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### addRow



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### collapseTree

Collapse a tree grid by row index.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|index|number|||The index of the row to collapse.|

### collapseTree



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### expandTree

Expands a tree grid by row index.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|index|number|||The index of the row to expand.|

### expandTree



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### toggleTree

Toggles tree grid open and close by row index.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|index|number|||The index of the row to toggle.|

### toggleTree



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### getHeaderByName

Returns a header from the schema by name.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|name|string|||The name of the column to resize.|

### getHeaderByName



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### fitColumnToValues

Resizes a column to fit the longest value in the column. Call without a value to resize all columns.
Warning, can be slow on very large record sets (1m records ~3-5 seconds on an i7).

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|name|string|||The name of the column to resize.|

### fitColumnToValues



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### isCellVisible

Checks if a cell is currently visible.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|columnIndex|number|||The column index of the cell to check.|
|rowIndex|number|||The row index of the cell to check.|

### isCellVisible



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### order

Sets the order of the data.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|columnName|number|||Name of the column to be sorted.|
|direction|string|||`asc` for ascending or `desc` for descending.|
|sortFunction|function|||When defined, override the default sorting method defined in the column's schema and use this one.|
|dontSetStorageData|bool|||Don't store this setting for future use.|

### order



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### isInGrid



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### moveSelection

Moves the current selection relative to the its current position.  Note: this method does not move the selected data, just the selection itself.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|offsetX|number|||The number of columns to offset the selection.|
|offsetY|number|||The number of rows to offset the selection.|

### moveSelection



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### moveTo

Moves data in the provided selection to another position in the grid.  Moving data off the edge of the schema (columns/x) will truncate data.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|sel|array|||2D array representing selected rows and columns.  `canvasDatagrid.selections` is in this format and can be used here.|
|x|number|||The column index to start inserting the selection at.|
|y|number|||The row index to start inserting the selection at.|

### moveTo



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### isColumnVisible

Checks if a given column is visible.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|columnIndex|number|||Column index.|

### isColumnVisible



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### isRowVisible

Checks if a given row is visible.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|rowIndex|number|||Row index.|

### isRowVisible



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### getVisibleCellByIndex

Gets the cell at columnIndex and rowIndex.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|x|number|||Column index.|
|y|number|||Row index.|

### getVisibleCellByIndex



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### getCellAt

Gets the cell at grid pixel coordinate x and y.  Author's note.  This function ties drawing and events together.  This is a very complex function and is core to the component.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|x|number|||Number of pixels from the left.|
|y|number|||Number of pixels from the top.|

### getCellAt



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### getBorder



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### getSelectionBounds

Gets the bounds of current selection.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### getSelectionBounds



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### getSchemaFromData

Returns an auto generated schema based on data structure.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### getSchemaFromData



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### clearChangeLog

Clears the change log grid.changes that keeps track of changes to the data set.
This does not undo changes or alter data it is simply a convince array to keep
track of changes made to the data since last this method was called.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### clearChangeLog



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### selectArea

Selects an area of the grid.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|bounds|rect|||A rect object representing the selected values.|

### selectArea



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### get



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### findColumnMaxTextLength

Returns the maximum text width for a given column by column name.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|name|string|||The name of the column to calculate the value's width of.|

### findColumnMaxTextLength



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### getHeaderWidth

Gets the total width of all header columns.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### getHeaderWidth



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### getRowHeight

Gets the height of a row by index.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|rowIndex|number|||The row index to lookup.|

### getRowHeight



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### getColumnWidth

Gets the width of a column by index.

|Name|Type|Optional|Default|Description|
|---|---|---|---|---|
|columnIndex|number|||The column index to lookup.|

### getColumnWidth



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### string



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### string



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### number



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### date



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

### 



|Name|Type|Optional|Default|Description|
|---|---|---|---|---|

