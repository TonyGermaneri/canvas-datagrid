canvas-grid
-----------

Lightweight canvas based data grid.

Instantiation
=============

Works with require framework or without.
If used without require, `canvasDataGrid` is declared in the global scope.

Simple creation and data set

    var grid = canvasDataGrid({
        parentNode: document.getElementById('blockElement'),
        data: data
    });

cell
====

| Property | Description |
|-----|------|
| type | Can be `none`, `ew-resize`, `sw-resize`, or `cell`. |
| item | A cell item. |

item
====

| Property | Description |
|-----|------|
| type | Data type used by this cell as dictated by the column. |
| style | Visual style of cell.  Can be any one of `cell`, `activeCell`, `headerCell`, `cornerCell`, or `headerRowCell`.  Prefix of each style name. |
| x | The x coordinate of this cell on the canvas. |
| y | The y coordinate of this cell on the canvas. |
| hovered | When true, this cell is hovered. |
| selected | When true, this cell is selected. |
| width | Width of the cell on the canvas. |
| height | Height of the cell on the canvas. |
| data | The row of data this cell belongs to. |
| header | The schema column this cell belongs to. |
| columnIndex | The column index of the cell. |
| rowIndex | The row index of the cell. |
| value | The value of the cell. |


Attributes
==========

Attributes can be set during instantiation or after
by accessing `grid.attributes`.  If changed after instantiation some attributes
require calling `grid.draw()` to see changes.

showNewRow: true
----------------
When true, a row will appear at the bottom of the data set.  `schema[].defaultValue`
will define a default value for each cell.  `defaultValue` can be a `string` or a
`function`.  When a function is used, the arguments `header` and `index` will be passed
to the function.  The value returned by the function will be the value in the new cell.

saveAppearance: true 
----------------
When true, and the attribute `name` is set, column and row sizes will be saved to the
browser's localStore.

selectionFollowsActiveCell: false 
----------------
When true, moving the active cell with keystrokes will also change the selection.

multiLine: true 
----------------
When true, edit cells will be textareas, when false edit cells will be inputs.

editable: true 
----------------
When true cells can be edited.  When false, grid is read only to the user.

allowColumnReordering: true 
----------------
When true columns can be reordered.  NOT IMPLEMENTED.

showFilter: true 
----------------
When true, filter will be an option in the context menu.

pageUpDownOverlap: 1 
----------------
Amount of rows to overlap when pageup/pagedown is used.

persistantSelectionMode: false 
----------------
When true, selections will behave as if the command/control key is held down at all times.

rowSelectionMode: false 
----------------
When true, clicking on any cell will select the entire row that cell belongs to.

autoResizeColumns: false 
----------------
When true, all columns will be automatically resized to fit the data in them.
Warning!  Expensive for large (>10k ~2 seconds) datasets.

allowRowHeaderResize: true 
----------------
When true, the user can resize the width of the row headers.

allowColumnResize: true 
----------------
When true, the user can resize the width of the columns.

allowRowResize: true 
----------------
When true, the user can resize the row headers increasing the height of the row.


allowRowResizeFromCell: false 
----------------
When true, the user can resize the height of the row from the border of the cell.

allowColumnResizeFromCell: false 
----------------
When true, the user can resize the width of the column from the border of the cell.

showPerformance: false 
----------------
When true, the amount of time taken to draw the grid is shown.

borderResizeZone: 10 
----------------
Number of pixels in total around a border that count as resize zones.

showHeaders: true 
----------------
When true, headers are shown.

showRowNumbers: true 
----------------
When true, row numbers are shown in the row headers.

showRowHeaders: true 
----------------
When true, row headers are shown.



Properties
==========

textarea
--------
Reference to the the edit cell when editing.  Undefined when not editing.

controlInput
------------
Input used for key controls on the grid.  Any clicks on the grid will cause
this input to be focused.  This input is hidden behind the canvas.

currentObject
-------------
Convenience object that represents the object that the mouse moved over last.

height
------
Height of the grid.

width
-----
Width of the grid.

visibleCells
------------
Array of cell drawn.

visibleRows
-----------
Array of visible row indexes.

selections
----------
Array of selected cells.

selectionBounds
---------------
Bounds of current selection.  Represented as an 
object with the properties `top`, `left`, `bottom`, `right`.

attributes
----------
Object that contains the properties listed in the attributes section.

style
-----
Object that contains the properties listed in the style section.

resizeMode
----------
Represents the currently displayed resize cursor.  Can be `ns-resize`, `ew-resize`, `pointer`, or `inherit`.

cellFormaters
-------------
Object that contains a list of formatters for displaying text.
The properties in this object match the `schema[].type` property.
For example, if the schema for a given column was of the type `date`
the grid would look for a formatter called `cellFormatters.date`
if a formatter cannot be found for a given data type a warning will
be logged and the string formatter will be used.

Cell formatter function should contain the following arguments.

| Argument | Description |
|-----|------|
| 0 | Canvas context |
| 1 | boolean header cell |
| 2 | string header name or value |
| 3 | row |
| 4 | header |
| 5 | x canvas coordinate |
| 6 | y canvas coordinate |
| 7 | data |
| 8 | schema |

Formatters must return a string value to be displayed in the cell.

filters
-------
Object that contains a list of filters for filtering data.
The properties in this object match the `schema[].type` property.
For example, if the schema for a given column was of the type `date`
the grid would look for a filter called `cellFormatters.date`
if a filter cannot be found for a given data type a warning will
be logged and the string/RegExp filter will be used.

| Argument | Description |
|-----|------|
| 0 | Value of the data |
| 1 | Value to filter for |

data
----
This is how data is set in the grid.  
Data must be an array of objects that conform to a schema.


schema
------
Schema is an array of column objects.
Schema is optional.  If no schema is provided one will be generated from the
data, in that case all data will be assumed to be string data.

Each column object can have the following properties:

| Property | Description |
|-----|------|
| name | The name of the column.  This is used to match with data. |
| type | The data type of this column |
| title | What will be displayed to the user.  If not present, name will be used. |
| width | The default width in pixels of this column.|
| hidden | When true the column will be hidden. |
| filter | The filter function to use to filter this column.  If no function is provided, type will determine filer. |
| formatter | The formatter function used display this column.  If no function is provided, type will determine formatter.|
| defaultValue | The default value of this column for new rows.  This is a function that takes the arguments `header` and `index` and must return a value for new default cells in this column.|



Methods
==========

beginEditAt(x, y)
-----------------
Begins editing at cell x, row y

endEdit(abort)
--------------
Ends editing, optionally aborting the edit.

setActiveCell(x, y)
-------------------
Sets the active cell.  Requires redrawing.

scrollIntoView(x, y)
--------------------
Scrolls the cell at cell x, row y into view if it is not already.

scrollToCell(x, y)
------------------
Scrolls to the cell at cell x, row y.

findColumnScrollLeft(columnIndex)
---------------------------------
Returns the number of pixels to scroll to the left to line up with column `columnIndex`.

findRowScrollTop(rowIndex)
--------------------------
Returns the number of pixels to scroll down to line up with row `rowIndex`.

getSelectionBounds()
--------------------
Gets the bounds of current selection.  Represented as an 
object with the properties `top`, `left`, `bottom`, `right`.
Same as the property `selectionBounds`.

fitColumnToValues(name)
-----------------------
Resizes a column to fit the longest value in the column.

getHeaderByName(name)
---------------------
Returns a header from the schema by name.

findColumnMaxTextLength(name)
-----------------------------
Returns the maximum text width for a given column by column name.

disposeContextMenu()
--------------------
Removes the context menu if it is present.

getObjectAt(x, y)
-----------------
Gets the object at pixel coordinate x and y.

Object has two properties.  .
And `item` which is a reference to the cell (if any).  This is what the item property appears like.


order(columnName, direction)
----------------------------
Sets the order of the data.

draw()
------
Redraws the grid.  No matter what the change, this is the only method required to refresh everything.

selectArea()
------------
Accepts a rectangle object that defines the desired selected area.  Uses column and row indexes.  E.g.:
    
    {
        top: 0,
        left: 3,
        bottom: 7,
        right: 9
    }

getSchemaFromData()
-------------------
Replaces schema with auto generated schema based on data structure.

setFilterValue(column, value)
----------------------------
Sets the value of the filter.

Events
======

selectionchanged
----------------
Fires when the selection changes.  `e.preventDefault();` prevents the selection from changing.

| Argument | Description |
|-----|------|
| 0 | Selected data. |
| 1 | Selections object.  2D matrix of selections. |
| 2 | Rectangle object describing the selection bounds. |


formatcellvalue
---------------
Fired each time a value is drawn into a cell allowing you to format the value of the cell.
The `string` value returned is the value used in the cell.  This does not however change the value in the data.

This is for per cell formating.  If you want to format data types, see formatters for a much easier way.

| Argument | Description |
|-----|------|
| 0 | Canvas context. |
| 1 | Current value of the cell. |
| 2 | Current row index. |
| 3 | Current header object. |
| 4 | The current cells x coordinate. |
| 5 | The current cells y coordinate. |
| 6 | All row data. |
| 7 | Visible schema. |


rendercell
----------
Fired when a cell is drawn onto the canvas.  `e.preventDefault();` prevents the cell from being drawn.

| Argument | Description |
|-----|------|
| 0 | Canvas context. |
| 1 | Current cell value. |
| 2 | Current row data. |
| 3 | Current header object. |
| 4 | All row data. |
| 5 | Visible schema. |
| 6 | The current cells x coordinate. |
| 7 | The current cells y coordinate. |

renderorderbyarrow
------------------
Fires when the order by arrow is drawn onto the canvas.  This is the only way
to completely replace the order arrow graphic.

| Argument | Description |
|-----|------|
| 0 | Canvas context. |
| 1 | Current cell value. |
| 2 | Current row data. |
| 3 | Current header object. |
| 4 | All row data. |
| 5 | Visible schema. |
| 6 | The current cells x coordinate. |
| 7 | The current cells y coordinate. |


mousemove
---------
| Argument | Description |
|-----|------|
| 0 | Mouse event. |
| 1 | Object under mouse. |


contextmenu
-----------
Fires when a context menu is requested.  The menu item array can be altered to change what items appear on the menu.

| Argument | Description |
|-----|------|
| 0 | Mouse event. |
| 1 | Object under mouse. |
| 2 | Mutable list of menu items. |
| 3 | Context menu html element. |

You can add items to the context menu but they must conform to this object type.

| Property | Description |
|-----|------|
| title | The title that will appear in the context menu.  If title is a `string` then the string will appear.  If title is a `HTMLElement` then it will be appended via `appendChild()` to the context menu row maintaining any events and references. |
| onclick | Optional function to invoke when this context menu item is clicked.  Neglecting to call `e.stopPropagation();` in your function will result in the mouse event bubbling up to the canvas undesirably.|

Removing all items from the list of menu items will cause the context menu to not appear.
Calling `e.preventDefault();` will cause the context menu to not appear as well.

beforeendedit
-------------
Fires just before edit is complete giving you a chance to validate the input.
`e.preventDefault();` will cause the edit to not end and row data will not be written back to the `data` array.

| Argument | Description |
|-----|------|
| 0 | New value. |
| 1 | Original value. |
| 2 | Mutable abort boolean. |
| 3 | Row data. |
| 4 | Textarea HTMLElement. |
| 5 | Cell object. |


endedit
-------
Fires when the edit has ended.  This event gives you a chance to abort the edit
preserving original row data, or modify the value of the row data prior to being written.

| Argument | Description |
|-----|------|
| 0 | New value. |
| 1 | Mutable abort boolean. |
| 2 | Textarea HTMLElement. |
| 3 | Cell object. |


beforebeginedit
---------------
Fires before a edit cell has been created giving you a chance to abort it.
`e.preventDefault();` will abort the edit cell from being created.

| Argument | Description |
|-----|------|
| 0 | Cell object. |


beginedit
---------
Fires when an editor textarea has been created.

| Argument | Description |
|-----|------|
| 0 | Cell object. |
| 1 | Textarea HTMLElement. |


click
-----
Fires when the grid is clicked.

| Argument | Description |
|-----|------|
| 0 | Mouse event. |
| 1 | Cell object. |


resizecolumn
------------
Fires when a column is about to be resized.
`e.preventDefault();` will abort the resize.

| Argument | Description |
|-----|------|
| 0 | x pixel position of the resize. |
| 1 | y pixel position of the resize. |
| 3 | y the mutable item to be resized. |


mousedown
---------
Fires when the mouse button is pressed down on the grid.
`e.preventDefault();` will abort the default grid event.

| Argument | Description |
|-----|------|
| 0 | Mouse event. |
| 1 | Cell object. |

mouseup
-------
Fires when the mouse button is pressed down on the grid.
`e.preventDefault();` will abort the default grid event.

| Argument | Description |
|-----|------|
| 0 | Mouse event. |
| 1 | Cell object. |


dblclick e, currentObject
--------
Fires when the mouse button is double clicked on the grid.
`e.preventDefault();` will abort the default grid event.
Note that this will necessarily require 2*`mousedown`, 2*`mouseup` and 2*`click` events to fire prior to the double click.

| Argument | Description |
|-----|------|
| 0 | Mouse event. |
| 1 | Cell object. |


keydown
-------
Fires when the keyboard button is pressed down on the grid.
`e.preventDefault();` will abort the default grid event.

| Argument | Description |
|-----|------|
| 0 | Key event. |
| 1 | Cell object. |


keyup
-----
Fires when the keyboard button is released on the grid.
`e.preventDefault();` will abort the default grid event.

| Argument | Description |
|-----|------|
| 0 | Key event. |
| 1 | Cell object. |


keypress
--------
Fires when the keyboard press is completed on the grid.
`e.preventDefault();` will abort the default grid event.

| Argument | Description |
|-----|------|
| 0 | Key event. |
| 1 | Cell object. |


resize
------
Fires when grid is being resized.
`e.preventDefault();` will abort the resizing.

| Argument | Description |
|-----|------|
| 0 | height. |
| 1 | width. |


Styles
==========

editCellPadding: '2px' 
----------------


editCellFontSize: '16px' 
----------------


editCellFontFamily: 'sans-serif' 
----------------


contextMenuItemMargin: '2px' 
----------------


contextMenuItemBorderRadius: '3px' 
----------------


contextMenuLabelDisplay: 'inline-block' 
----------------


contextMenuLabelMinWidth: '75px' 
----------------


contextMenuHoverBackground: 'rgba(182, 205, 250, 1)' 
----------------


contextMenuHoverColor: 'rgba(43, 48, 153, 1)' 
----------------


contextMenuFontSize: '16px' 
----------------


contextMenuFontFamily: 'sans-serif' 
----------------


contextMenuBackground: 'rgba(222, 227, 233, 0.90)' 
----------------


contextMenuBorder: 'solid 1px rgba(158, 163, 169, 1)' 
----------------


contextMenuPadding: '2px' 
----------------


contextMenuBorderRadius: '3px' 
----------------


contextMenuOpacity: '0.98' 
----------------


contextMenuFilterInvalidExpresion: 'rgba(237, 155, 156, 1)' 
----------------


autosizePadding: 5 
----------------


minHeight: 250 
----------------


minRowHeight: 10 
----------------


minColumnWidth: 10 
----------------


columnWidth: 250 
----------------


backgroundColor: 'rgba(255, 0, 255, 1)' 
----------------


headerOrderByArrowHeight: 8 
----------------


headerOrderByArrowWidth: 13 
----------------


headerOrderByArrowColor: 'rgba(0, 0, 0, 1)' 
----------------


headerOrderByArrowBorderColor: 'rgba(255, 255, 255, 1)' 
----------------


headerOrderByArrowBorderWidth: 1 
----------------


headerOrderByArrowMarginRight: 5 
----------------


headerOrderByArrowMarginLeft: 0 
----------------


headerOrderByArrowMarginTop: 6 
----------------


cellHeight: 24 
----------------


cellFont: '16px sans-serif' 
----------------


cellPaddingBottom: 5 
----------------


cellPaddingLeft: 5 
----------------


cellPaddingRight: 7 
----------------


cellAlignment: 'left' 
----------------


cellColor: 'rgba(0, 0, 0, 1)' 
----------------


cellBackgroundColor: 'rgba(255, 255, 0, 1)' 
----------------


cellHoverColor: 'rgba(0, 0, 0, 1)' 
----------------


cellHoverBackgroundColor: 'rgba(128, 255, 0, 1)' 
----------------


cellSelectedColor: 'rgba(128, 255, 0, 1)' 
----------------


cellSelectedBackgroundColor: 'rgba(0, 255, 128, 1)' 
----------------


cellBorderWidth: 1 
----------------


cellBorderColor: 'rgba(0, 0, 0, 1)' 
----------------


activeCellFont: '16px sans-serif' 
----------------


activeCellPaddingBottom: 5 
----------------


activeCellPaddingLeft: 5 
----------------


activeCellPaddingRight: 7 
----------------


activeCellAlignment: 'left' 
----------------


activeCellColor: 'rgba(0, 0, 0, 1)' 
----------------


activeCellBackgroundColor: 'rgba(125, 255, 0, 1)' 
----------------


activeCellHoverColor: 'rgba(100, 100, 100, 1)' 
----------------


activeCellHoverBackgroundColor: 'rgba(0, 8, 125, 1)' 
----------------


activeCellSelectedColor: 'rgba(128, 255, 0, 1)' 
----------------


activeCellSelectedBackgroundColor: 'rgba(45, 75, 128, 1)' 
----------------


activeCellBorderWidth: 1 
----------------


activeCellBorderColor: 'rgba(0, 0, 0, 1)' 
----------------


headerCellPaddingBottom: 5 
----------------


headerCellPaddingLeft: 5 
----------------


headerCellPaddingRight: 7 
----------------


headerCellHeight: 25 
----------------


headerCellBorderWidth: 1 
----------------


headerCellBorderColor: 'rgba(0, 0, 0, 1)' 
----------------


headerCellFont: '16px sans-serif' 
----------------


headerCellColor: 'rgba(0, 0, 0, 1)' 
----------------


headerCellBackgroundColor: 'rgba(0, 255, 255, 1)' 
----------------


headerCellHoverColor: 'rgba(0, 0, 0, 1)' 
----------------


headerCellHoverBackgroundColor: 'rgba(128, 255, 0, 1)' 
----------------


headerRowWidth: 50 
----------------


headerRowCellPaddingBottom: 5 
----------------


headerRowCellPaddingLeft: 5 
----------------


headerRowCellPaddingRight: 7 
----------------


headerRowCellHeight: 25 
----------------


headerRowCellBorderWidth: 1 
----------------


headerRowCellBorderColor: 'rgba(0, 0, 0, 1)' 
----------------


headerRowCellFont: '16px sans-serif' 
----------------


headerRowCellColor: 'rgba(0, 0, 0, 1)' 
----------------


headerRowCellBackgroundColor: 'rgba(0, 255, 255, 1)' 
----------------


headerRowCellHoverColor: 'rgba(0, 0, 0, 1)' 
----------------


headerRowCellHoverBackgroundColor: 'rgba(128, 255, 0, 1)' 
----------------
