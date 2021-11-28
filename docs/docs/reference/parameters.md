---
title: Options
---

canvas-datagrid is highly configurable. This document describes all options you can pass to the constructor:

```js
const grid = canvasDatagrid({
    data: myData,
    // other options
});
```

## All options

### allowColumnReordering

When true columns can be reordered.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### allowColumnResize

When true, the user can resize the width of the columns.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### allowColumnResizeFromCell

When true, the user can resize the width of the column from the border of the cell.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### allowFreezingColumns

When true, the UI provides a drag-able cutter to freeze columns.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### allowFreezingRows

When true, the UI provides a drag-able cutter to freeze rows.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### allowMovingSelection

When true selected data can be moved by clicking and dragging on the border of the selection.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### allowRowHeaderResize

When true, the user can resize the width of the row headers.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### allowRowReordering

When true rows can be reordered.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### allowRowResize

When true, the user can resize the row headers increasing the height of the row.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### allowRowResizeFromCell

When true, the user can resize the height of the row from the border of the cell.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### allowSorting

Allow user to sort rows by clicking on column headers.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### autoGenerateSchema

When true, every time data is set the schema will be automatically generated from the data overwriting any existing schema.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### autoResizeColumns

When true, all columns will be automatically resized to fit the data in them. Warning! Expensive for large (&gt;100k ~2 seconds) datasets.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### autoResizeRows

When true, rows will be automatically resized to fit the data in them if text-wrapping is enabled.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### autoScrollMargin

Number of pixels of mouse movement to trigger auto scroll.

|Type|Optional|Default|
|---|---|---|
|number|true|` 5 `

### autoScrollOnMousemove

Only trigger auto scrolling when mouse moves in horizontal or vertical direction.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### blanksText

The text that appears on the context menu for filtering blank values (i.e. `undefined`, `null`, `''`).

|Type|Optional|Default|
|---|---|---|
|string|true|` (Blanks) `

### borderDragBehavior

Can be set to 'resize', 'move', or 'none'.  If set to 'move', `allowMovingSelection` should also be set true.  If set to 'resize', `allowRowResizeFromCell` and/or `allowColumnResizeFromCell` should be set true.

|Type|Optional|Default|
|---|---|---|
|string|true|` 'none' `

### borderResizeZone

Number of pixels in total around a border that count as resize zones.

|Type|Optional|Default|
|---|---|---|
|number|true|` 10 `

### cellGridAttributes

Attributes used for cell grids. These child grids are different than the tree grids. See the {@link canvasDatagrid.data} property for more information about cell grids.

|Type|Optional|Default|
|---|---|---|
|object|true|`  `

### clearSettingsOptionText

Text that appears on the clear settings option.

|Type|Optional|Default|
|---|---|---|
|string|true|` 'Clear saved settings' `

### columnHeaderClickBehavior

Can be any of sort, select, none.  When sort is selected, left clicking a column header will result in sorting ascending, then sorting descending if already sorted by this column.  If select is selected then clicking a column header will result in the column becoming selected.  Holding control/command or shift will select multiple columns in this mode.

|Type|Optional|Default|
|---|---|---|
|string|true|` sort `

### columnSelectorHiddenText

When a column is visible, this is the value to the left of the title in the column selector content menu.

|Type|Optional|Default|
|---|---|---|
|string|true|` '\u2713' `

### columnSelectorText

The text of the column selector context menu.

|Type|Optional|Default|
|---|---|---|
|string|true|` 'Add/remove columns' `

### columnSelectorVisibleText

When a column is hidden, this is the value to the left of the title in the column selector content menu.

|Type|Optional|Default|
|---|---|---|
|string|true|` '&nbsp;&nbsp;&nbsp&nbsp;' `

### copyText

The text that appears on the context menu when copy is available.

|Type|Optional|Default|
|---|---|---|
|string|true|` Copy `

### data

Sets the data. See {@link canvasDatagrid.data}.

|Type|Optional|Default|
|---|---|---|
|array|true|` [] `

### debug

When true, debug info will be drawn on top of the grid.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### editable

When true, cells can be edited. When false, grid is read only to the user.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### ellipsisText

The text used as ellipsis text on truncated values.

|Type|Optional|Default|
|---|---|---|
|string|true|` ... `

### filterFrozenRows

When false, rows on and above {@link canvasDatagrid#property:frozenRow}` will be ignored by filters when {@link canvasDatagrid#param:allowFreezingRows} is true.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### filters

Sets selected values in filters.  See {@link canvasDatagrid.filters}.

|Type|Optional|Default|
|---|---|---|
|canvasDatagrid.filter|true|` {} `

### formatters

Sets selected values in formatters.  See {@link canvasDatagrid.formatters}.

|Type|Optional|Default|
|---|---|---|
|canvasDatagrid.formatter|true|` {} `

### globalRowResize

When true, resizing a row will resize all rows to the same height.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### hideColumnText

The text displayed on the hide column .

|Type|Optional|Default|
|---|---|---|
|string|true|` 'Hide %s' `

### hoverMode

Can be 'cell', or 'row'. This setting dictates whether to highlight either the individual cell, or the entire row when hovering over a cell.

|Type|Optional|Default|
|---|---|---|
|string|true|` 'cell' `

### keepFocusOnMouseOut

When true, grid will continue to handle keydown events when mouse is outside of the grid.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### maxPixelRatio

The maximum pixel ratio for high DPI displays.  High DPI displays can cause sluggish performance, this caps resolution the grid is rendered at.  Standard resolution (e.g.: 1920x1080) have a pixel ratio of 1:1 while higher resolution displays can be higher (e.g.: Retina display 2:1).  Higher numbers are sharper (higher resolution) up to the max of your display (usually 2), lower numbers are lower resolution, down to 1.  It might be fun to set a value lower than 1, I've never done it.

|Type|Optional|Default|
|---|---|---|
|number|true|` 1.5 `

### multiLine

When true, edit cells will allow multiple lines (with Alt+Enter), when false edit cells will only allow single line entries.  See {@link tutorial--Use-a-textarea-to-edit-cells-instead-of-an-input.}

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### name

Optional value that will allow the saving of column height, row width, etc. to the browser's local store. This name should be unique to this grid.

|Type|Optional|Default|
|---|---|---|
|string|true|`  `

### pageUpDownOverlap

Amount of rows to overlap when pageup/pagedown is used.

|Type|Optional|Default|
|---|---|---|
|number|true|` 1 `

### parentNode

HTML element that will hold the grid.  This block element must have a height, canvas-datagrid will add a canvas itself and will match itself to this element's dimensions.  It will resize itself on window.resize events, and DOM mutation.  But you may need to invoke canvas-datagrid.resize() manually if you find it does not maintain size in your use case.  When using the non web component the parentNode can be a canvas.

|Type|Optional|Default|
|---|---|---|
|HTMLElement||`  `

### parsers

Sets selected values in parsers.  See {@link canvasDatagrid.parsers}.

|Type|Optional|Default|
|---|---|---|
|canvasDatagrid.dataTypes|true|` {} `

### pasteText

The text that appears on the context menu when paste is available.

|Type|Optional|Default|
|---|---|---|
|string|true|` Paste `

### persistantSelectionMode

When true, selections will behave as if the command/control key is held down at all times. Conflicts with singleSelectionMode.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### reorderDeadZone

Number of pixels needed to move before column reordering occurs.

|Type|Optional|Default|
|---|---|---|
|number|true|` 3 `

### saveAppearance

When true, and the attribute name is set, column and row sizes will be saved to the browser's localStore.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### schema

Sets the schema. See {@link canvasDatagrid.schema}.

|Type|Optional|Default|
|---|---|---|
|array|true|` [] `

### scrollAnimationPPSThreshold

How many points per second must be achieved before touch animation occurs on touch release.

|Type|Optional|Default|
|---|---|---|
|number|true|` 0.75 `

### scrollPointerLock

When true, clicking on the scroll box to scroll will cause the mouse cursor to disappear to prevent it from exiting the area observable to the grid.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### selectionFollowsActiveCell

When true, moving the active cell with keystrokes will also change the selection.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### selectionHandleBehavior

When set to a value other than none a handle will appear in the lower right corner of the desktop version of the grid.  It does nothing but will be used in a future version of the grid.

|Type|Optional|Default|
|---|---|---|
|string|true|` 'none' `

### selectionMode

Can be 'cell', or 'row'.  This setting dictates what will be selected when the user clicks a cell.  The cell, or the entire row respectively.

|Type|Optional|Default|
|---|---|---|
|string|true|` 'cell' `

### selectionScrollZone

Number of pixels to auto scroll in in horizontal or vertical direction.

|Type|Optional|Default|
|---|---|---|
|number|true|` 20 `

### showClearSettingsOption

Show an option on the context menu to clear saved settings.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### showColumnHeaders

When true, headers are shown.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### showColumnSelector

When true, the column selector context menu is visible.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### showCopy

When true, copy will appear on the context menu when it is available.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### showFilter

When true, filter will be an option in the context menu.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### showNewRow

When true, a row will appear at the bottom of the data set. schema[].defaultValue will define a default value for each cell. defaultValue can be a string or a function. When a function is used, the arguments header and index will be passed to the function. The value returned by the function will be the value in the new cell.  See {@link canvasDatagrid.header.defaultValue}

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### showOrderByOption

Show an option on the context menu sort rows.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### showOrderByOptionTextAsc

Text that appears on the order by ascending option.

|Type|Optional|Default|
|---|---|---|
|string|true|` 'Order by %s desc' `

### showOrderByOptionTextDesc

Text that appears on the order by descending option.

|Type|Optional|Default|
|---|---|---|
|string|true|` 'Order by %s ascending' `

### showPaste

Show the paste option in the context menu when applicable.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### showPerformance

When true, a graph showing performance is rendered.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### showRowHeaders

When true, row headers are shown.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### showRowNumberGaps

When true, gaps between row numbers due to filtering are shown in the row headers using a colored bar.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### showRowNumbers

When true, row numbers are shown in the row headers.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### singleSelectionMode

When true, selections will ignore the command/control key. Conflicts with persistantSelectionMode.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### snapToRow

When true, scrolling snaps to the top row.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### sorters

Sets selected values in sorters.  See {@link canvasDatagrid.sorters}.

|Type|Optional|Default|
|---|---|---|
|canvasDatagrid.sorter|true|` {} `

### sortFrozenRows

When false, rows on and above {@link canvasDatagrid#property:frozenRow}` will be ignored by sorters when {@link canvasDatagrid#param:allowSorting} is true.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` true `

### style

Sets selected values in style.

|Type|Optional|Default|
|---|---|---|
|canvasDatagrid.style|true|` {} `

### touchContextMenuTimeMs

The length of time in milliseconds before a context menu appears on touch start within the touch dead zone.

|Type|Optional|Default|
|---|---|---|
|number|true|` 800 `

### touchDeadZone

How many pixels a touch must move within `attributes.touchSelectTimeMs` to be considered scrolling rather than selecting.

|Type|Optional|Default|
|---|---|---|
|number|true|` 3 `

### touchEasingMethod

Animation easing method used for touch release animation.  Valid values are easeOutQuad, easeOutCubic, easeOutQuart, easeOutQuint.

|Type|Optional|Default|
|---|---|---|
|string|true|` easeOutQuad `

### touchReleaseAcceleration

How many times the detected pixel per inch touch swipe is multiplied on release.  Higher values mean more greater touch release movement.

|Type|Optional|Default|
|---|---|---|
|number|true|` 1000 `

### touchReleaseAnimationDurationMs

How long the ease animation runs after touch release.

|Type|Optional|Default|
|---|---|---|
|number|true|` 2000 `

### touchScrollZone

When touching, the scroll element hit boxes are increased by this number of pixels for easier touching.

|Type|Optional|Default|
|---|---|---|
|number|true|` 30 `

### touchSelectHandleZone

Radius of pixels around touch select handles that touch select handles respond to.

|Type|Optional|Default|
|---|---|---|
|string|true|` 20 `

### touchZoomMax

The maximum zoom scale.

|Type|Optional|Default|
|---|---|---|
|number|true|` 1.75 `

### touchZoomMin

The minimum zoom scale.

|Type|Optional|Default|
|---|---|---|
|number|true|` 0.5 `

### touchZoomSensitivity

The scale at which "pinch to zoom" screen pixels are converted to scale values.

|Type|Optional|Default|
|---|---|---|
|number|true|` 0.005 `

### tree

When true, an arrow will be drawn on each row that when clicked raises the See {@link canvasDatagrid#event:expandtree} event for that row and creates an inner grid.  See {@link tutorial--Allow-users-to-open-trees}.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

### treeGridAttributes

Attributes used for tree grids. These child grids are different than the cell grids. See the {@link canvasDatagrid.data} property for more information about tree grids.

|Type|Optional|Default|
|---|---|---|
|object|true|`  `

### treeHorizontalScroll

When true, expanded child grids will scroll horizontally with the parent columns. When false, when scrolling horizontally child grids will remain stationary. This does not impact vertical scrolling behavior.

|Type|Optional|Default|
|---|---|---|
|boolean|true|` false `

