---
title: Events
---

This document describes all events emitted by canvas-datagrid. Use the sidebar to the right to quickly find the event you're looking for.

Listening for events can be done by registering a listener:

```js
const grid = canvasDatagrid();

function renderTextHandler(e) {
    // your code here; 'e' is the event object
}

grid.addEventListener('rendertext', renderTextHandler);
```

Don't forget to stop listening when you destroy the grid:

```js
grid.removeEventListener('rendertext', renderTextHandler);
```


## All events

### afterpaste

Fires after a paste is performed.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object|
|e.ctx|object|Canvas context.|
|e.cells|array|Cells affected by the paste action. Each item in the array is a tuple of [rowIndex, columnIndex].|

### afterrendercell

Fires just after a cell is drawn.  If you want to draw things in the cell, this is the event to attach to.
Drawing on the canvas is allowed.  Altering the context of the canvas is allowed.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object|
|e.ctx|object|Canvas context.|
|e.value|object|Current cell value.|
|e.row|object|Current row data.|
|e.header|object|Current header object.|
|e.cell|canvasDatagrid.cell|Current cell.|
|e.x|object|The current cells x coordinate.|
|e.y|object|The current cells y coordinate.|

### appendeditinput

Fires when the edit input is appended to the body.  This allows you to intercept the event and by calling `e.preventDefault` you can prevent the input from being appended to the body.  You can then append the input where you like.  The input is by default absolutely positioned to appear over the cell.  All styles are in-line.  You can alter anything you like, dimensions, appearance, parent node.  If you run `e.preventDefault`, and stop the input from being added to the body, make sure you append the input somewhere or you will not be able to use it.  When editing is complete the input will remove itself.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.input|object|The edit input.  You're free to do what you will with it.  It will remove itself when editing is complete.|

### attributechanged

Fires when an attribute has been changed.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|

### beforebeginedit

Fires before a edit cell has been created giving you a chance to abort it.
`e.preventDefault();` will abort the edit cell from being created.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.cell|canvasDatagrid.cell|Cell object.|

### beforecreatecellgrid

Fires just before a cell grid is created giving you a chance to abort the creation of the cell grid by calling e.preventDefault().
You can alter cell grid instantiation arguments in this event as well.  Only fires once per grid creation.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object|
|e.ctx|object|Canvas context.|
|e.value|object|Current cell value.|
|e.row|object|Current row data.|
|e.cellGridAttributes|object|Mutable cell grid instantiation arguments.|
|e.header|object|Current header object.|
|e.cell|canvasDatagrid.cell|Current cell.|
|e.x|object|The current cells x coordinate.|
|e.y|object|The current cells y coordinate.|

### beforeendedit

Fires just before edit is complete giving you a chance to validate the input.
`e.preventDefault();` will cause the edit to not end and row data will not be written back to the `data` array.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.cell|canvasDatagrid.cell|Current cell.|
|e.newValue|object|New value.|
|e.oldValue|object|Old value.|
|e.abort|function|Abort edit function.  Call this function to abort the edit.|
|e.input|object|Textarea or input HTMLElement depending on `attributes.multiLine`.|

### beforepaste

Fires before a paste is performed.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.NativeEvent|object|Native paste event.|

### beforerendercell

Fired just before a cell is drawn onto the canvas.  `e.preventDefault();` prevents the cell from being drawn.
You would only use this if you want to completely stop the cell from being drawn and generally muck up everything.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.value|object|Current cell value.|
|e.row|object|Current row data.|
|e.header|object|Current header object.|

### beforerendercellgrid

Fires just before a cell grid is drawn giving you a chance to abort the drawing of the cell grid by calling e.preventDefault().
Only fires once per grid drawing.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object|
|e.ctx|object|Canvas context.|
|e.value|object|Current cell value.|
|e.row|object|Current row data.|
|e.header|object|Current header object.|
|e.cell|canvasDatagrid.cell|Current cell.|
|e.x|object|The current cells x coordinate.|
|e.y|object|The current cells y coordinate.|

### beforesortcolumn

Fires just before a column is sorted.  Calling e.preventDefault will prevent sorting.  Used in conjunction with `grid.orderBy` and `grid.orderDirection` you can implement server side ordering while still using the native order by arrows.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.columnName|object|Name of the column.|
|e.direction|object|Direction of the order.|

### beforetouchmove

Fires just before a touch move event occurs allowing you to cancel the default behavior of touchmove.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.NativeEvent|object|Native touchmove event.|

### beginedit

Fires when an editor textarea (or input) has been created.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.cell|canvasDatagrid.cell|Cell object.|
|e.input|object|Textarea or input HTMLElement depending on `attributes.multiLine`.|

### beginfreezemove

Fires when a freeze cutter begins to move.  Calling `e.preventDefault` will prevent the move from starting.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|

### beginmove

Fires when a selection begins to move.  Calling `e.preventDefault` will prevent the move from starting.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|

### cellmouseout

Fires when the mouse exits a cell.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.cell|canvasDatagrid.cell|The cell being moved out of.|

### cellmouseover

Fires when the mouse enters a cell.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.cell|canvasDatagrid.cell|The cell being moved over.|

### click

Fires when the grid is clicked.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.cell|canvasDatagrid.cell|Cell object.|

### collapsetree

Fires when the user click the "drill in" arrow on a row that is already expanded.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.childGrid|object|New, or if reopened existing, grid.|
|e.data|object|The row's data.|
|e.rowIndex|object|The row index that was expanded.|

### columnmouseout

Fires when the mouse exits a column.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.cell|canvasDatagrid.cell|The cell being moved out of.|

### columnmouseover

Fires when the mouse enters a column.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.cell|canvasDatagrid.cell|The cell being moved over.|

### contextmenu

Fires when a context menu is requested.  The menu item array can be altered to change what items appear on the menu.
You can add items to the context menu but they must conform to {@link canvasDatagrid.contextMenuItem}.
Removing all items from the list of menu items will cause the context menu to not appear.
Calling `e.preventDefault();` will cause the context menu to not appear as well.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.NativeEvent|object|Native contextmenu event.|
|e.cell|canvasDatagrid.cell|Cell under mouse.|
|e.items[](#contextMenuItem)|object|Mutable list of menu items.|
|e.contextMenu|object|Context menu HTML element.|

### copy

Fires when a copy is performed.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.NativeEvent|object|Native copy event.|

### copyonschema

Fires when a copy is processing on a schema column. If you want to change headers of the copied data, this is the event to attach to.
Changing `column.title` or `column.name` will not change actual schema, it will just take effect and apply to the copied data.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.NativeEvent|object|Native copy event.|
|e.column|object|Current column object of schema.|

### datachanged

Fires when the data setter is set.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.data|object|Data.|

### dblclick

Fires when the mouse button is double clicked on the grid.
`e.preventDefault();` will abort the default grid event.
Note that this will necessarily require 2*`mousedown`, 2*`mouseup` and 2*`click` events to fire prior to the double click.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.NativeEvent|object|Native dblclick event.|
|e.cell|canvasDatagrid.cell|Cell object.|

### endedit

Fires when the edit has ended.  This event gives you a chance to abort the edit
preserving original row data, or modify the value of the row data prior to being written.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.cell|canvasDatagrid.cell|Cell object.|
|e.value|object|New value.|
|e.abort|object|When true, the edit was aborted.|
|e.input|object|Textarea or input HTMLElement depending on `attributes.multiLine`.|

### endfreezemove

Fires when a freeze cutter is dropped.  Calling `e.preventDefault` will prevent the drop from occurring.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|

### endmove

Fires when a selection moving selection is dropped.  Calling `e.preventDefault` will prevent the drop from occurring.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|

### expandtree

Fires when the user clicks on the "drill in" arrow.  When the arrow is clicked a new
grid is created and nested inside of the row.  The grid, the row data and row index are passed
to the event listener.  From here you can manipulate the inner grid.  A grid is not disposed
when the tree is collapsed, just hidden, but grids are not created until the arrow is clicked.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.treeGrid|object|New, or if reopened existing, grid.|
|e.data|object|The row's data.|
|e.rowIndex|object|The row index that was expanded.|

### formattext

Fires when text is about to be formatted.  You can stop the default formatting function, text wrap, from occurring by calling `e.preventDefault`.  You might do this to improve performance on very long values (e.g.: lists of numbers not requiring formatting) or to replace the default formatting function with your own.  When preventing default it is important to populate the `e.cell.text` property with a text line array that looks like this `{ lines: [{value: "line 1" }, {value: "line 2" }] }`.  Each item in the array is assumed to fit the width of the cell.  The total number of lines is assumed to fit into the height of the cell.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|

### freezemoving

Fires when the mouse moves while moving a freeze cutter.  Calling `e.preventDefault` will prevent the freeze cutter from moving.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|

### keydown

Fires when the keyboard button is pressed down on the grid.
`e.preventDefault();` will abort the default grid event.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.NativeEvent|object|Native keydown event.|
|e.cell|canvasDatagrid.cell|Cell object.|

### keypress

Fires when the keyboard press is completed on the grid.
`e.preventDefault();` will abort the default grid event.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.NativeEvent|object|Native keypress event.|
|e.cell|canvasDatagrid.cell|Cell object.|

### keyup

Fires when the keyboard button is released on the grid.
`e.preventDefault();` will abort the default grid event.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.NativeEvent|object|Native keyup event.|
|e.cell|canvasDatagrid.cell|Cell object.|

### mousedown

Fires when the mouse button is pressed down on the grid.
`e.preventDefault();` will abort the default grid event.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.NativeEvent|object|Native mousedown event.|
|e.cell|canvasDatagrid.cell|Cell object.|

### mousemove

Fires when the mouse moves over the grid.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.cell|canvasDatagrid.cell|Cell under mouse.|

### mouseup

Fires when the mouse button is pressed down on the grid.
`e.preventDefault();` will abort the default grid event.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.NativeEvent|object|Native mouseup event.|
|e.cell|canvasDatagrid.cell|Cell object.|

### mousewheel

Fires when a mouseweel event occurs.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.NativeEvent|object|Native mouseweel event.|

### moving

Fires when the mouse moves while moving a selection.  Calling `e.preventDefault` will prevent the move from occurring.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|

### rendercell

Fires when a cell is drawn.  If you want to change colors, sizes this is the event to attach to.
Changing the cell object's height and width is allowed.  Altering the context of the canvas is allowed.
Drawing on the canvas will probably be drawn over by the cell.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object|
|e.ctx|object|Canvas context.|
|e.value|object|Current cell value.|
|e.row|object|Current row data.|
|e.header|object|Current header object.|
|e.cell|canvasDatagrid.cell|Current cell.|
|e.x|object|The current cells x coordinate.|
|e.y|object|The current cells y coordinate.|

### rendercellgrid

Fires just after a cell grid calls its draw method.  Allows you to alter the cell data grid.
Only fires once per child grid.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object|
|e.ctx|object|Canvas context.|
|e.value|object|Current cell value.|
|e.row|object|Current row data.|
|e.header|object|Current header object.|
|e.cell|canvasDatagrid.cell|Current cell.|
|e.x|object|The current cells x coordinate.|
|e.y|object|The current cells y coordinate.|

### renderorderbyarrow

Fires when the order by arrow is drawn onto the canvas.  This is the only way
to completely replace the order arrow graphic.  Call `e.preventDefault()` to stop the default arrow from being drawn.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.value|object|Current cell value.|
|e.row|object|Current row data.|
|e.header|object|Current header object.|
|e.cell|canvasDatagrid.cell|Current cell.|
|e.x|object|The current cells x coordinate.|
|e.y|object|The current cells y coordinate.|

### rendertext

Fires when text is drawn into a cell.  If you want to change the color of the text, this is the event to attach to.
To alter what text finally appears in the cell, change the value of `cell.formattedValue`.  Keep in mind this
text will still be subject to the ellipsis function that truncates text when the width is too long for the cell.
You cannot alter the cell's height or width from this event, use `rendercell` event instead.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object|
|e.ctx|object|Canvas context.|
|e.value|object|Current cell value.|
|e.row|object|Current row data.|
|e.header|object|Current header object.|
|e.cell|canvasDatagrid.cell|Current cell.|
|e.x|object|The current cells x coordinate.|
|e.y|object|The current cells y coordinate.|

### rendertreearrow

Fires when the tree arrow is drawn onto the canvas.  This is the only way
to completely replace the tree arrow graphic.  Call `e.preventDefault()` to stop the default arrow from being drawn.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.value|object|Current cell value.|
|e.row|object|Current row data.|
|e.header|object|Current header object.|
|e.cell|canvasDatagrid.cell|Current cell.|
|e.x|object|The current cells x coordinate.|
|e.y|object|The current cells y coordinate.|

### reorder

Fires when the user finishes reordering a column or row.  Calling `e.preventDefault` will prevent the column from being reordered.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.NativeEvent|object|Native mousemove event.|
|e.source|cell|The header cell of the column or row being reordered.|
|e.target|cell|The header cell of the column or row that the dragged row or column will be inserted onto.|
|e.dragMode|string|When dragging a column `column-reorder`, when dragging a row `row-reorder`.|

### reordering

Fires as the user reorders a row or column.  Calling `e.preventDefault` will prevent the column from starting to be reordered.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.NativeEvent|object|Native mousemove event.|
|e.source|cell|The header cell of the column or row being reordered.|
|e.target|cell|The header cell of the column or row that the dragged row or column will be inserted onto.|
|e.dragMode|string|When dragging a column `column-reorder`, when dragging a row `row-reorder`.|

### resize

Fires when grid is being resized.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|

### resizecolumn

Fires when a column is about to be resized.
`e.preventDefault();` will abort the resize.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.x|object|x pixel position of the resize.|
|e.y|object|y pixel position of the resize.|
|e.preventDefault|function|Prevents the default behavior.|
|e.cell|canvasDatagrid.cell|The mutable cell to be resized.|

### rowmouseout

Fires when the mouse exits a row.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.cell|canvasDatagrid.cell|The cell being moved out of.|

### rowmouseover

Fires when the mouse enters a row.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.cell|canvasDatagrid.cell|The cell being moved over.|

### schemachanged

Fires when the schema setter is set.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.schema|object|Schema.|

### scroll

Fires when the user scrolls the grid.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.top|number|The new scroll top.|
|e.left|number|The new scroll left.|

### selectionchanged

Fires when the selection changes.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.selectedData|object|Selected data.|
|e.selections|array|Selections object. 2D matrix of selections.|
|e.selectionBounds|rectangle|rectangle object describing the selection bounds.|
|e.boundRowIndexMap|object|Mapping of view data row to bound data row index.|
|e.boundColumnIndexMap|object|Mapping of view column order to bound column order.|

### sortcolumn

Fires when a column is sorted.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.columnName|object|Name of the column.|
|e.direction|object|Direction of the order.|

### stylechanged

Fires when a style has been changed.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.preventDefault|function|Prevents the default behavior.|
|e.styleName|object|The name of the style being changed.|
|e.styleValue|object|The value of the style being changed.|

### touchcancel

Fires when the a touch event is canceled.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.NativeEvent|object|Native touchcancel event.|

### touchend

Fires when the a touch event ends.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.cell|canvasDatagrid.cell|Last cell touched by point 0 prior to the touchend event being called.|
|e.NativeEvent|object|Native touchend event.|

### touchmove

Fires when the a touch move event occurs.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.cell|canvasDatagrid.cell|Cell being touched.|
|e.NativeEvent|object|Native touchmove event.|

### touchstart

Fires when the a touch event begins.

|Property name|Type|Description|
|---|---|---|
|e|object|Event object.|
|e.ctx|object|Canvas context.|
|e.NativeEvent|object|Native touchstart event.|
|e.cell|canvasDatagrid.cell|Cell object.|

