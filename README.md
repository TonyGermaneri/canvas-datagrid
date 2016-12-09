Canvas Data Grid
================

* High performance lightweight hierarchal canvas based data grid.
* Support for 10^6+ rows and 100's of columns.
* Extensible styling, filtering, formatting, resizing, selecting, and ordering.
* Rich API of events, methods and properties optimized for CRUD, reporting and work flow applications.
* Zero dependencies, very small code base, a single 94k (16k gziped) file.

[Demo](https://tonygermaneri.github.io/canvas-datagrid/sample/index.html)

* [Instantiation](#instantiation)
* [Attributes](#attributes)
* [Properties](#properties)
* [Methods](#methods)
* [Events](#events)
* [Common Objects](#common-objects)
* [Styles](#styles)
* [Browser limitations](#browser-limitations)


Instantiation
=============

Works with require framework or without.
If used without require, `canvasDataGrid` is declared in the global scope.

Simple creation and data set.

    var grid = canvasDataGrid({
        parentNode: document.getElementById('blockElement'),
        data: data
    });

Check which [cell](#cell) the user clicked on.

    grid.addEventListener('click', function (e, cell) {
        console.log(cell.value);
    });

Check values when the selection has changed.

    grid.addEventListener('selectionchanged', function (data, matrix, bounds) {
        console.log(data);
    });

Alter the data after instantiation.

    grid.data[0].col1 = 'blah';
    grid.draw();

Change the color of a cell based on value.

    grid.addEventListener('rendercell', function (ctx, cell) {
        if (cell.value === 'blah') {
            ctx.fillStyle = 'red';
        }
    });

Alter the format (appearance only) of a data based on type.

    grid.formatters.date = function (ctx, cell) {
        return new Date(cell.value).toISOString();
    };

Add a tree view
    grid.attributes.tree = true;
    grid.addEventListener('expandtree', function (e) {
        e.grid.data = [{My: 'Other Data'}];
    });

Change all the data!

    grid.data = [{other: 'data'}];

Attributes
==========
Attributes are the basic properties set during instantiation.  Think of HTML attributes.
Attributes can be set during instantiation or after by setting `grid.attributes`.
Setting an attribute will automatically call `draw`.

    var grid = canvasDataGrid({
            // Every value here is an attribute
        });

    // all attributes can be accessed here after instantiation
    grid.attributes


parentNode
----------
HTML element that will hold the grid.

name
----
Optional value that will allow the saving of column height and row width settings to the browser's local store.
This name should be unique to this grid.

tree: false
-----------
When true, an arrow will be drawn on each row that when clicked raises the `expandtree` event
for that row and creates an inner grid.

childGridAttributes
-------------------
Attributes used for cell grids.  These child grids are different than the tree grids.
See the data property for more information about cell grids.

showNewRow: true
----------------
When true, a row will appear at the bottom of the data set.  `schema[].defaultValue`
will define a default value for each [cell](#cell).  `defaultValue` can be a `string` or a
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
Warning!  Expensive for large (>100k ~2 seconds) datasets.

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

schema
------
Sets the schema.  See schema property below.

data: []
----
Sets the data. See data property below.

style
-----
Sets all style values overriding all defaults.  Unless you're
replacing 100% of the styles, don't use this property.  See style property below.

Properties
==========
The difference between attributes and properties is that attributes
are always getter/setters attached to the `attributes` property.
Attributes are the values that can be passed during instantiation.
Setting an attribute will call `draw`.

Properties are references to internal objects and function maps like `filters`.
You can change the sub-properties of the various properties, but the base properties,
with a few exceptions are immutable.

selectedRows
------------
Array of selected rows.  Looks just like the data you passed in, but filtered for the rows the user
has cells selected in.  If any cell in the row is selected, all data for that row will appear in this array.

selectedCells
-------------
Jagged array of cells that the user has selected.  Beware that because this is a jagged array, some indexes will be `null`.
Besides the `null`s this data looks just like the data you passed in, but just the cells the user has selected.
So if the user has selected cell 10 in a 10 column row, there will be 9 `null`s followed by the data from column 10.

changes
-------
Array of changes and additions made to the grid since last time data was loaded.
The data property will change with changes as well, but this is a convince list of all the
changes in one spot.  Calling `clearChangeLog` will clear this list.

input
-----
Reference to the the edit cell when editing.  Undefined when not editing.

controlInput
------------
Input used for key controls on the grid.  Any clicks on the grid will cause
this input to be focused.  This input is hidden behind the canvas.

currentCell
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
Matrix array of selected cells.

selectionBounds
---------------
[rect](#rect) object, bounds of current selection.

attributes
----------
Object that contains the properties listed in the attributes section.

sizes
-----
Mutable object that contains `sizes.columns` and `sizes.rows` arrays.
These arrays control the sizes of the columns and rows.
If there is not an entry for the row or column index it will fall back to
the style default.

style
-----
Object that contains the properties listed in the style section.
Changing a style will automatically call `draw`.

resizeMode
----------
Represents the currently displayed resize cursor.  Can be `ns-resize`, `ew-resize`, `pointer`, or `inherit`.

formatters
----------
Object that contains a list of formatting functions for displaying text.
The properties in this object match the `schema[].type` property.
For example, if the schema for a given column was of the type `date`
the grid would look for a formatter called `formatters.date`
if a formatter cannot be found for a given data type a warning will
be logged and the string formatter will be used.

Cell formatter function should contain the following arguments.

    grid.formatters.date = function (ctx, cell) { return new Date(cell.value).toISOString(); }

| Argument | Description |
|-----|------|
| ctx | Canvas context. |
| [cell](#cell) | Current cell. |

Formatters must return a string value to be displayed in the cell.

sorters
-------
Object that contains a list of sorting functions for sorting columns.

| Argument | Description |
|-----|------|
| columnName | Name of the column to be sorted. |
| direction | `asc` or `desc` for ascending or descending. |

Sorter function must return a sort function.
This function will be used in the [native sort method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

Example sorter:

    grid.sorters.number = function (columnName, direction) {
        var asc = direction === 'asc';
        return function (a, b) {
            if (asc) {
                return a[columnName] - b[columnName];
            }
            return b[columnName] - a[columnName];
        };
    };

filters
-------
Object that contains a list of filters for filtering data.
The properties in this object match the `schema[].type` property.
For example, if the schema for a given column was of the type `date`
the grid would look for a filter called `filters.date`
if a filter cannot be found for a given data type a warning will
be logged and the string/RegExp filter will be used.

    filters.number = function (value, filterFor) {
        if (!filterFor) { return true; }
        return value === filterFor;
    };

| Argument | Description |
|-----|------|
| value | Value of the data. |
| filterFor | Value to filter for. |

data
----
This is how data is set in the grid.
Data must be an array of objects that conform to a schema.

    [
        {col1: 'row 1 column 1', col2: 'row 1 column 2', col3: 'row 1 column 3'},
        {col1: 'row 2 column 1', col2: 'row 2 column 2', col3: 'row 2 column 3'}
    ]

Data values can be any primitive type.  However if a cell value is another data array,
a child grid will be rendered into the cell.  This child grid is different than a
tree view grid and uses the `childGridAttributes` attribute for properties and styling.

schema
------
Schema is optional.  Schema is an array of column objects.
If no schema is provided one will be generated from the
data, in that case all data will be assumed to be string data.

Each column object can have the following properties:

| Property | Description |
|-----|------|
| name | The name of the column.  This is used to match with data and is the only required property. |
| type | The data type of this column |
| title | What will be displayed to the user.  If not present, name will be used. |
| width | The default width in pixels of this column.|
| hidden | When true the column will be hidden. |
| filter | The filter function to use to filter this column.  If no function is provided, type will determine filer. |
| formatter | The formatter function used display this column.  If no function is provided, type will determine formatter.|
| defaultValue | The default value of this column for new rows.  This is a function that takes the arguments `header` and `index` and must return a value for new default cells in this column.|

Example schema:

    [
        {
            name: 'col1'
        },
        {
            name: 'col2'
        },
        {
            name: 'col3'
        }
    ]


scrollHeight
------------
The total number of pixels that can be scrolled down.

scrollWidth
-----------
The total number of pixels that can be scrolled to the left.

scrollTop
---------
The number of pixels that have been scrolled down.

scrollLeft
----------
The number of pixels that have been scrolled to the left.

offsetTop
---------
The offset top of the grid.

offsetLeft
----------
The offset left of the grid.

parentNode
----------
The grid's parent HTML node.

isChildGrid
-----------
When true, this grid is a child grid of another grid.

openChildren
------------
List of open child grids by internal unique row id.

childGrids
----------
Child grids in this grid organized by internal unique row id.

parentGrid
----------
If this grid is a child grid, this is the grids parent.

canvas
------
The canvas element drawn onto for this grid.


Methods
=======

toggleTree(rowIndex)
--------------------
Toggles the given row index's child table on/off.

expandTree(rowIndex)
--------------------
Expands the given row index's child table.

expandTree(rowIndex)
--------------------
Collapses the given row index's child table.

beginEditAt(x, y)
-----------------
Begins editing at cell x, row y

endEdit(abort)
--------------
Ends editing, optionally aborting the edit.

selectRow(rowIndex, toggleSelectMode, supressSelectionchangedEvent)
-------------------------------------------------------------------
Selects a row.  `toggleSelectMode` behaves as if you were holding control/command when you clicked the row.
`supressSelectionchangedEvent` will prevent the `selectionchanged` event from firing.

clearChangeLog()
----------------
Clears the change log `grid.changes` that keeps track of changes to the data set.
This does not undo changes or alter `grid.data` it is simply a convince array to
keep track of changes made to the data.

setActiveCell(x, y)
-------------------
Sets the active cell.  Requires redrawing.

scrollIntoView(x, y)
--------------------
Scrolls the cell at cell x, row y into view if it is not already.

gotoCell(x, y)
------------------
Scrolls to the cell at cell x, row y.

gotoRow(y)
------------
Scrolls to the row y.

findColumnScrollLeft(columnIndex)
---------------------------------
Returns the number of pixels to scroll to the left to line up with column `columnIndex`.

findRowScrollTop(rowIndex)
--------------------------
Returns the number of pixels to scroll down to line up with row `rowIndex`.

getSelectionBounds()
--------------------
Gets the bounds of current selection.  Returns a [rect](#rect) object.

fitColumnToValues(name)
-----------------------
Resizes a column to fit the longest value in the column.  Call without a value to resize all columns.
Warning, can be slow on very large record sets (100k records ~3-5 seconds on an i7).

getHeaderByName(name)
---------------------
Returns a header from the schema by name.

findColumnMaxTextLength(name)
-----------------------------
Returns the maximum text width for a given column by column name.

disposeContextMenu()
--------------------
Removes the context menu if it is present.

getCellAt(x, y)
-----------------
Gets the cell at grid pixel coordinate x and y.

order(columnName, direction)
----------------------------
Sets the order of the data.

draw()
------
Redraws the grid.  No matter what the change, this is the only method required to refresh everything.

selectArea()
------------
Accepts a [rect](#rect) object that defines the desired selected area.

getSchemaFromData()
-------------------
Returns schema with auto generated schema based on data structure.

setFilterValue(column, value)
----------------------------
Sets the value of the filter.

Events
======

Events are subscribed to using `addEventListener` and unsubscribed from using `removeEventListener`.
Some events have a first argument with the method `preventDefault`.  Calling `preventDefault` will
prevent the default behavior from occurring.  For example, if you wanted to prevent the edit cell
from appearing for some cells you can subscribe to the `beforebeginedit` event and call `e.preventDefault`
when you want the cell to be read only.  Using events will give you the most granular control of appearance
and behavior.

selectionchanged
----------------
Fires when the selection changes.

    grid.addEventListener('selectionchanged', function (data, matrix, bounds) { });

| Argument | Description |
|-----|------|
| data | Selected data. |
| matrix | Selections object.  2D matrix of selections. |
| bounds | `Rectangle` object describing the selection bounds. |

expandtree
----------
Fires when the user clicks on the "drill in" arrow.  When the arrow is clicked a new
grid is created and nested inside of the row.  The grid, the row data and row index are passed
to the event listener.  From here you can manipulate the inner grid.  A grid is not disposed
when the tree is collapsed, just hidden, but grids are not created until the arrow is clicked.

| Argument | Description |
|-----|------|
| e | event. |
| e.rowIndex | The row index that was expanded. |
| e.data | The row's data. |
| e.grid | New, or if reopened existing, grid. |

collapsetree
------------
Fires when the user click the "drill in" arrow on a row that is already expanded.

| Argument | Description |
|-----|------|
| e | event. |
| e.rowIndex | The row index that was collapsed. |
| e.data | The row's data. |
| e.grid | Grid that is being collapsed. |

scroll
------
Fires when the user scrolls the grid.


beforerendercell
----------------
Fired just before a cell is drawn onto the canvas.  `e.preventDefault();` prevents the cell from being drawn.
You would only use this if you want to completely stop the cell from being drawn and generally muck up everything.

    grid.addEventListener('beforerendercell', function (ctx, value, row, header, x, y) { });

| Argument | Description |
|-----|------|
| ctx | Canvas context. |
| value | Current cell value. |
| row | Current row data. |
| header | Current header object. |
| x | The current cells x coordinate. |
| y | The current cells y coordinate. |

rendercell
----------
Fires when a cell is drawn.  If you want to change colors, sizes this is the event to attach to.
Changing the cell object's height and width is allowed.  Altering the context of the canvas is allowed.
Drawing on the canvas will probably be drawn over by the cell.

    grid.addEventListener('rendercell', function (ctx, cell) { });

| Argument | Description |
|-----|------|
| ctx | Canvas context. |
| [cell](#cell) | Current cell. |

afterrendercell
---------------
Fires just after a cell is drawn.  If you want to draw things in the cell, this is the event to attach to.
Drawing on the canvas is allowed.  Altering the context of the canvas is allowed.

    grid.addEventListener('afterrendercell', function (ctx, cell) { });

| Argument | Description |
|-----|------|
| ctx | Canvas context. |
| [cell](#cell) | Current cell. |

rendertext
----------
Fires when text is drawn into a cell.  If you want to change the color of the text, this is the event to attach to.
To alter what text finally appears in the cell, change the value of `cell.formattedValue`.  Keep in mind this
text will still be subject to the ellipsis function that truncates text when the width is too long for the cell.

You cannot alter the cell's height or width from this event, use `rendercell` event instead.

    grid.addEventListener('rendertext', function (ctx, cell) { });

| Argument | Description |
|-----|------|
| ctx | Canvas context. |
| [cell](#cell) | Current cell. |


renderorderbyarrow
------------------
Fires when the order by arrow is drawn onto the canvas.  This is the only way
to completely replace the order arrow graphic.  Call `e.preventDefault()` to stop the default arrow from being drawn.

    grid.addEventListener('renderorderbyarrow', function (ctx, cell) { });

| Argument | Description |
|-----|------|
| ctx | Canvas context. |
| [cell](#cell) | Current cell. |


rendertreearrow
---------------
Fires when the tree arrow is drawn onto the canvas.  This is the only way
to completely replace the tree arrow graphic.  Call `e.preventDefault()` to stop the default arrow from being drawn.

    grid.addEventListener('rendertreearrow', function (ctx, cell) { });

| Argument | Description |
|-----|------|
| ctx | Canvas context. |
| [cell](#cell) | Current cell. |

rendercellgrid
--------------
Fires when a cell grid is instantiated.  Allows you to alter the cell data grid.
Only fires once per grid.

    grid.addEventListener('rendercellgrid', function (ctx, cell) { });

| Argument | Description |
|-----|------|
| ctx | Canvas context. |
| [cell](#cell) | Current cell. |
| grid | Cell data grid. |

ordercolumn
-----------
Fires when a column is reordered.

    grid.addEventListener('rendercellgrid', function (columnName, direction) { });

| Argument | Description |
|-----|------|
| columnName | Name of the column. |
| direction | Direction of the order. |

mousemove
---------
Fires when the mouse moves over the grid.

    grid.addEventListener('mousemove', function (e, cell) { });

| Argument | Description |
|-----|------|
| 0 | Mouse event. |
| 1 | Cell under mouse. |


contextmenu
-----------
Fires when a context menu is requested.  The menu item array can be altered to change what items appear on the menu.

    grid.addEventListener('contextmenu', function (e, cell, menuItems, contextMenu) { });

| Argument | Description |
|-----|------|
| 0 | Mouse event. |
| 1 | Cell under mouse. |
| 2 | Mutable list of menu items. |
| 3 | Context menu HTML element. |

You can add items to the context menu but they must conform to this object type.

| Property | Description |
|-----|------|
| title | The title that will appear in the context menu.  If title is a `string` then the string will appear.  If title is a `HTMLElement` then it will be appended via `appendChild()` to the context menu row maintaining any events and references. |
| click | Optional function to invoke when this context menu item is clicked.  Neglecting to call `e.stopPropagation();` in your function will result in the mouse event bubbling up to the canvas undesirably.|

Removing all items from the list of menu items will cause the context menu to not appear.
Calling `e.preventDefault();` will cause the context menu to not appear as well.

beforeendedit
-------------
Fires just before edit is complete giving you a chance to validate the input.
`e.preventDefault();` will cause the edit to not end and row data will not be written back to the `data` array.

    grid.addEventListener('beforeendedit', function (value, originalValue, abort, cell, textarea) { });

| Argument | Description |
|-----|------|
| value | New value. |
| originalValue | Original value. |
| abort | Abort edit function.  Call this function to abort the edit. |
| [cell](#cell) | Cell object. |
| textarea | Textarea or input HTMLElement depending on `attributes.multiLine`. |


endedit
-------
Fires when the edit has ended.  This event gives you a chance to abort the edit
preserving original row data, or modify the value of the row data prior to being written.

    grid.addEventListener('endedit', function (value, abort, cell, textarea) { });

| Argument | Description |
|-----|------|
| value | New value. |
| abort | When true, the edit was aborted. |
| [cell](#cell) | Cell object. |
| textarea | Textarea HTMLElement. |



beforebeginedit
---------------
Fires before a edit cell has been created giving you a chance to abort it.
`e.preventDefault();` will abort the edit cell from being created.

    grid.addEventListener('beforebeginedit', function (cell) { });

| Argument | Description |
|-----|------|
| [cell](#cell) | Cell object. |


beginedit
---------
Fires when an editor textarea (or input) has been created.

    grid.addEventListener('beginedit', function (cell, textarea) { });

| Argument | Description |
|-----|------|
| [cell](#cell) | Cell object. |
| textarea | Textarea HTMLElement. |


click
-----
Fires when the grid is clicked.

    grid.addEventListener('click', function (e, cell) { });

| Argument | Description |
|-----|------|
| e | Mouse event. |
| [cell](#cell) | Cell object. |


resizecolumn
------------
Fires when a column is about to be resized.
`e.preventDefault();` will abort the resize.

    grid.addEventListener('resizecolumn', function (x, y, cell) { });

| Argument | Description |
|-----|------|
| x | x pixel position of the resize. |
| y | y pixel position of the resize. |
| [cell](#cell) | The mutable cell to be resized. |


mousedown
---------
Fires when the mouse button is pressed down on the grid.
`e.preventDefault();` will abort the default grid event.

    grid.addEventListener('mousedown', function (e, cell) { });

| Argument | Description |
|-----|------|
| e | Mouse event. |
| [cell](#cell) | Cell object. |

mouseup
-------
Fires when the mouse button is pressed down on the grid.
`e.preventDefault();` will abort the default grid event.

    grid.addEventListener('mouseup', function (e, cell) { });

| Argument | Description |
|-----|------|
| e | Mouse event. |
| [cell](#cell) | Cell object. |

dblclick
--------
Fires when the mouse button is double clicked on the grid.
`e.preventDefault();` will abort the default grid event.
Note that this will necessarily require 2*`mousedown`, 2*`mouseup` and 2*`click` events to fire prior to the double click.

    grid.addEventListener('dblclick', function (e, cell) { });

| Argument | Description |
|-----|------|
| e | Mouse event. |
| [cell](#cell) | Cell object. |


keydown
-------
Fires when the keyboard button is pressed down on the grid.
`e.preventDefault();` will abort the default grid event.

    grid.addEventListener('keydown', function (e, cell) { });

| Argument | Description |
|-----|------|
| e | Key event. |
| [cell](#cell) | Cell object. |


keyup
-----
Fires when the keyboard button is released on the grid.
`e.preventDefault();` will abort the default grid event.

    grid.addEventListener('keyup', function (e, cell) { });

| Argument | Description |
|-----|------|
| e | Key event. |
| [cell](#cell) | Cell object. |



keypress
--------
Fires when the keyboard press is completed on the grid.
`e.preventDefault();` will abort the default grid event.

    grid.addEventListener('keypress', function (e, cell) { });

| Argument | Description |
|-----|------|
| e | Key event. |
| [cell](#cell) | Cell object. |



resize
------
Fires when grid is being resized.
`e.preventDefault();` will abort the resizing.

    grid.addEventListener('resize', function (e, cell) { });

| Argument | Description |
|-----|------|
| e | height. |
| [cell](#cell) | width. |


Common Objects
==============

cell
----

A cell on the grid and all data associated with it.

| Property | Description |
|-----|------|
| type | Data type used by this cell as dictated by the column. |
| style | Visual style of cell.  Can be any one of `cell`, `activeCell`, `headerCell`, `cornerCell`, or `rowHeaderCell`.  Prefix of each style name. |
| x | The x coordinate of this cell on the canvas. |
| y | The y coordinate of this cell on the canvas. |
| hovered | When true, this cell is hovered. |
| selected | When true, this cell is selected. |
| active | When true, this cell is the active cell. |
| width | Width of the cell on the canvas. |
| height | Height of the cell on the canvas. |
| userWidth | User set width of the cell on the canvas.  If undefined, the user has not set this column. |
| userHeight | Height of the cell on the canvas.  If undefined, the user has not set this row. |
| data | The row of data this cell belongs to. |
| header | The schema column this cell belongs to. |
| columnIndex | The column index of the cell. |
| rowIndex | The row index of the cell. |
| value | The value of the cell. |
| formattedValue | The value after passing through any formatters. |

rect
----

A selection area represented by a rectangle.
This object is returned by a number of events, methods and properties, and is passed to the `selectArea` method.

| Property | Description |
|-----|------|
| top | First row index. |
| bottom | Last row index. |
| left | First column index. |
| right | Last column index. |


Styles
==========
Styles can be passed during instantiation or after.
Changing a style will automatically call `draw`.

    grid.style.cellBackgroundColor = 'burlywood';

| Property | Default Value |
|-----|------|
| maxEllipsisLength | 250 |
| treeGridHeight | 250 |
| treeArrowHeight | 8 |
| treeArrowWidth | 13 |
| treeArrowColor | rgba(155, 155, 155, 1) |
| treeArrowBorderColor | rgba(195, 199, 202, 1) |
| treeArrowBorderWidth | 1 |
| treeArrowMarginRight | 5 |
| treeArrowMarginLeft | 0 |
| treeArrowMarginTop | 6 |
| scrollBarWidth | 14 |
| scrollDivOverlap | 0.7 |
| filterTextPrefix | (filtered) |
| editCellFontSize | 16px |
| editCellFontFamily | sans-serif |
| editCellPaddingLeft | 4.5 |
| contextMenuStyleSheet | false |
| contextMenuItemMargin | 2px |
| contextMenuItemBorderRadius | 3px |
| contextMenuLabelDisplay | inline-block |
| contextMenuLabelMinWidth | 75px |
| contextMenuHoverBackground | rgba(182, 205, 250, 1) |
| contextMenuColor | rgba(43, 48, 43, 1) |
| contextMenuHoverColor | rgba(43, 48, 153, 1) |
| contextMenuFontSize | 16px |
| contextMenuFontFamily | sans-serif |
| contextMenuBackground | rgba(222, 227, 233, 0.94) |
| contextMenuBorder | solid 1px rgba(158, 163, 169, 1) |
| contextMenuPadding | 2px |
| contextMenuBorderRadius | 3px |
| contextMenuOpacity | 0.98 |
| contextMenuFilterInvalidExpresion | rgba(237, 155, 156, 1) |
| contextMenuMarginTop | 0 |
| contextMenuMarginLeft | 5 |
| autosizePadding | 5 |
| minHeight | 250 |
| minRowHeight | 10 |
| minColumnWidth | 10 |
| columnWidth | 250 |
| backgroundColor | rgba(240, 240, 240, 1) |
| headerOrderByArrowHeight | 8 |
| headerOrderByArrowWidth | 13 |
| headerOrderByArrowColor | rgba(185, 185, 185, 1) |
| headerOrderByArrowBorderColor | rgba(195, 199, 202, 1) |
| headerOrderByArrowBorderWidth | 1 |
| headerOrderByArrowMarginRight | 5 |
| headerOrderByArrowMarginLeft | 0 |
| headerOrderByArrowMarginTop | 6 |
| cellHeight | 24 |
| cellFont | 16px sans-serif |
| cellPaddingTop | 5 |
| cellPaddingLeft | 5 |
| cellPaddingRight | 7 |
| cellAlignment | left |
| cellColor | rgba(0, 0, 0, 1) |
| cellBackgroundColor | rgba(240, 240, 240, 1) |
| cellHoverColor | rgba(0, 0, 0, 1) |
| cellHoverBackgroundColor | rgba(240, 240, 240, 1) |
| cellSelectedColor | rgba(43, 48, 153, 1) |
| cellSelectedBackgroundColor | rgba(182, 205, 250, 1) |
| cellBorderWidth | 0.5 |
| cellBorderColor | rgba(195, 199, 202, 1) |
| activeCellFont | 16px sans-serif |
| activeCellPaddingTop | 5 |
| activeCellPaddingLeft | 5 |
| activeCellPaddingRight | 7 |
| activeCellAlignment | left |
| activeCellColor | rgba(43, 48, 153, 1) |
| activeCellBackgroundColor | rgba(111, 160, 255, 1) |
| activeCellHoverColor | rgba(43, 48, 153, 1) |
| activeCellHoverBackgroundColor | rgba(110, 168, 255, 1) |
| activeCellSelectedColor | rgba(43, 48, 153, 1) |
| activeCellSelectedBackgroundColor | rgba(110, 168, 255, 1) |
| activeCellBorderWidth | 0.5 |
| activeCellBorderColor | rgba(151, 173, 190, 1) |
| headerCellPaddingTop | 5 |
| headerCellPaddingLeft | 5 |
| headerCellPaddingRight | 7 |
| headerCellHeight | 25 |
| headerCellBorderWidth | 0.5 |
| headerCellBorderColor | rgba(172, 175, 179, 1) |
| headerCellFont | 16px sans-serif |
| headerCellColor | rgba(50, 50, 50, 1) |
| headerCellBackgroundColor | rgba(222, 227, 233, 1) |
| headerCellHoverColor | rgba(43, 48, 153, 1) |
| headerCellHoverBackgroundColor | rgba(181, 201, 223, 1) |
| headerRowWidth | 57 |
| rowHeaderCellPaddingTop | 5 |
| rowHeaderCellPaddingLeft | 5 |
| rowHeaderCellPaddingRight | 7 |
| rowHeaderCellHeight | 25 |
| rowHeaderCellBorderWidth | 0.5 |
| rowHeaderCellBorderColor | rgba(172, 175, 179, 1) |
| rowHeaderCellFont | 16px sans-serif |
| rowHeaderCellColor | rgba(50, 50, 50, 1) |
| rowHeaderCellBackgroundColor | rgba(222, 227, 233, 1) |
| rowHeaderCellHoverColor | rgba(43, 48, 153, 1) |
| rowHeaderCellHoverBackgroundColor | rgba(181, 201, 223, 1) |
| rowHeaderCellSelectedColor | rgba(43, 48, 153, 1) |
| rowHeaderCellSelectedBackgroundColor | rgba(182, 205, 250, 1) |
| scrollBarWidth | 14 |
| scrollDivOverlap | 1.6 |

Browser limitations
-------------------
Some browsers (lookin at you Firefox) cannot have elements larger than a certain height.
This height ends up being ~1.7^7px or around 700k rows if each row is the default of 24px tall.

All browsers appear to break down somewhere around 10^6x7 rows.  It is unclear if it is a limitation
of memory due to the dataset that is being created or a hard browser limit.
Avoid loading greater than 10^6x7 rows.
