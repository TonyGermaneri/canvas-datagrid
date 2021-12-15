/**
 * Hierarchical canvas based web component.
 * @class
 * @name canvasDatagrid
 * @see https://github.com/TonyGermaneri/canvas-datagrid
 * @see https://canvas-datagrid.js.org/tutorial-sample.html
 * @see https://canvas-datagrid.js.org/tutorial-webcomponent.html
 * @see https://canvas-datagrid.js.org/styleBuilder.html
 * @see https://canvas-datagrid.js.org/amdDemo.html
 * @see https://canvas-datagrid.js.org/webcomponentDemo.html
 * @see https://canvas-datagrid.js.org/sparklineDemo.html
 * @author Tony Germaneri (TonyGermaneri@gmail.com)
 * @param {object} args Parameters for the grid.
 * @param {HTMLElement} args.parentNode HTML element that will hold the grid.  This block element must have a height, canvas-datagrid will add a canvas itself and will match itself to this element's dimensions.  It will resize itself on window.resize events, and DOM mutation.  But you may need to invoke canvas-datagrid.resize() manually if you find it does not maintain size in your use case.  When using the non web component the parentNode can be a canvas.
 * @param {string} [args.name] Optional value that will allow the saving of column height, row width, etc. to the browser's local store. This name should be unique to this grid.
 * @param {boolean} [args.tree=false] - When true, an arrow will be drawn on each row that when clicked raises the See {@link canvasDatagrid#event:expandtree} event for that row and creates an inner grid.  See {@link tutorial--Allow-users-to-open-trees}.
 * @param {boolean} [args.treeHorizontalScroll=false] - When true, expanded child grids will scroll horizontally with the parent columns. When false, when scrolling horizontally child grids will remain stationary. This does not impact vertical scrolling behavior.
 * @param {object} [args.cellGridAttributes] - Attributes used for cell grids. These child grids are different than the tree grids. See the {@link canvasDatagrid.data} property for more information about cell grids.
 * @param {object} [args.treeGridAttributes] - Attributes used for tree grids. These child grids are different than the cell grids. See the {@link canvasDatagrid.data} property for more information about tree grids.
 * @param {boolean} [args.showNewRow=true] - When true, a row will appear at the bottom of the data set. schema[].defaultValue will define a default value for each cell. defaultValue can be a string or a function. When a function is used, the arguments header and index will be passed to the function. The value returned by the function will be the value in the new cell.  See {@link canvasDatagrid.header.defaultValue}
 * @param {boolean} [args.saveAppearance=true] - When true, and the attribute name is set, column and row sizes will be saved to the browser's localStore.
 * @param {boolean} [args.selectionFollowsActiveCell=false] - When true, moving the active cell with keystrokes will also change the selection.
 * @param {boolean} [args.multiLine=false] - When true, edit cells will allow multiple lines (with Alt+Enter), when false edit cells will only allow single line entries.  See {@link tutorial--Use-a-textarea-to-edit-cells-instead-of-an-input.}
 * @param {boolean} [args.globalRowResize=false] - When true, resizing a row will resize all rows to the same height.
 * @param {boolean} [args.editable=true] - When true, cells can be edited. When false, grid is read only to the user.
 * @param {string} [args.borderDragBehavior='none'] - Can be set to 'resize', 'move', or 'none'.  If set to 'move', `allowMovingSelection` should also be set true.  If set to 'resize', `allowRowResizeFromCell` and/or `allowColumnResizeFromCell` should be set true.
 * @param {boolean} [args.autoGenerateSchema=false] - When true, every time data is set the schema will be automatically generated from the data overwriting any existing schema.
 * @param {boolean} [args.autoScrollOnMousemove=false] - Only trigger auto scrolling when mouse moves in horizontal or vertical direction.
 * @param {number} [args.autoScrollMargin=5] - Number of pixels of mouse movement to trigger auto scroll.
 * @param {boolean} [args.allowFreezingRows=false] - When true, the UI provides a drag-able cutter to freeze rows.
 * @param {boolean} [args.allowFreezingColumns=false] - When true, the UI provides a drag-able cutter to freeze columns.
 * @param {boolean} [args.filterFrozenRows=true] - When false, rows on and above {@link canvasDatagrid#property:frozenRow}` will be ignored by filters when {@link canvasDatagrid#param:allowFreezingRows} is true.
 * @param {boolean} [args.sortFrozenRows=true] - When false, rows on and above {@link canvasDatagrid#property:frozenRow}` will be ignored by sorters when {@link canvasDatagrid#param:allowSorting} is true.
 * @param {boolean} [args.allowColumnReordering=true] - When true columns can be reordered.
 * @param {boolean} [args.allowMovingSelection=false] - When true selected data can be moved by clicking and dragging on the border of the selection.
 * @param {boolean} [args.allowRowReordering=false] - When true rows can be reordered.
 * @param {string} [args.blanksText=(Blanks)] - The text that appears on the context menu for filtering blank values (i.e. `undefined`, `null`, `''`).
 * @param {string} [args.ellipsisText=...] - The text used as ellipsis text on truncated values.
 * @param {boolean} [args.allowSorting=true] - Allow user to sort rows by clicking on column headers.
 * @param {boolean} [args.allowGroupingColumns=true] - Allow user to group columns by clicking on column headers.
 * @param {boolean} [args.allowGroupingRows=true] - Allow user to group rows by clicking on rows headers.
 * @param {boolean} [args.showFilter=true] - When true, filter will be an option in the context menu.
 * @param {number} [args.pageUpDownOverlap=1] - Amount of rows to overlap when pageup/pagedown is used.
 * @param {boolean} [args.persistantSelectionMode=false] - When true, selections will behave as if the command/control key is held down at all times. Conflicts with singleSelectionMode.
 * @param {boolean} [args.singleSelectionMode=false] - When true, selections will ignore the command/control key. Conflicts with persistantSelectionMode.
 * @param {boolean} [args.keepFocusOnMouseOut=false] - When true, grid will continue to handle keydown events when mouse is outside of the grid.
 * @param {string} [args.selectionMode='cell'] - Can be 'cell', or 'row'.  This setting dictates what will be selected when the user clicks a cell.  The cell, or the entire row respectively.
 * @param {string} [args.hoverMode='cell'] - Can be 'cell', or 'row'. This setting dictates whether to highlight either the individual cell, or the entire row when hovering over a cell.
 * @param {boolean} [args.autoResizeColumns=false] - When true, all columns will be automatically resized to fit the data in them. Warning! Expensive for large (&gt;100k ~2 seconds) datasets.
 * @param {boolean} [args.autoResizeRows=false] - When true, rows will be automatically resized to fit the data in them if text-wrapping is enabled.
 * @param {boolean} [args.allowRowHeaderResize=true] - When true, the user can resize the width of the row headers.
 * @param {boolean} [args.allowColumnResize=true] - When true, the user can resize the width of the columns.
 * @param {boolean} [args.allowRowResize=true] - When true, the user can resize the row headers increasing the height of the row.
 * @param {boolean} [args.allowRowResizeFromCell=false] - When true, the user can resize the height of the row from the border of the cell.
 * @param {boolean} [args.allowColumnResizeFromCell=false] - When true, the user can resize the width of the column from the border of the cell.
 * @param {boolean} [args.showPerformance=false] - When true, a graph showing performance is rendered.
 * @param {boolean} [args.debug=false] - When true, debug info will be drawn on top of the grid.
 * @param {number} [args.borderResizeZone=10] - Number of pixels in total around a border that count as resize zones.
 * @param {boolean} [args.showColumnHeaders=true] - When true, headers are shown.
 * @param {boolean} [args.showRowNumbers=true] - When true, row numbers are shown in the row headers.
 * @param {boolean} [args.showRowNumberGaps=true] - When true, gaps between row numbers due to filtering are shown in the row headers using a colored bar.
 * @param {boolean} [args.showRowHeaders=true] - When true, row headers are shown.
 * @param {number} [args.reorderDeadZone=3] - Number of pixels needed to move before column reordering occurs.
 * @param {number} [args.selectionScrollZone=20] - Number of pixels to auto scroll in in horizontal or vertical direction.
 * @param {boolean} [args.showClearSettingsOption=true] - Show an option on the context menu to clear saved settings.
 * @param {string} [args.clearSettingsOptionText='Clear saved settings'] - Text that appears on the clear settings option.
 * @param {string} [args.showOrderByOptionTextDesc='Order by %s ascending'] - Text that appears on the order by descending option.
 * @param {string} [args.showOrderByOptionTextAsc='Order by %s desc'] - Text that appears on the order by ascending option.
 * @param {string} [args.showGroupColumns='Group columns %s'] - Text that appears on the group columns option.
 * @param {string} [args.showGroupRows='Group row %s'] - Text that appears on the group rows option.
 * @param {string} [args.showRemoveGroupColumns='Remove group %s'] - Text that appears on the remove columns group option.
 * @param {string} [args.showRemoveGroupRows='Remove group %s'] - Text that appears on the remove rows group option.
 * @param {boolean} [args.showOrderByOption=true] - Show an option on the context menu sort rows.
 * @param {boolean} [args.showPaste=false] - Show the paste option in the context menu when applicable.
 * @param {array} [args.schema=[]] - Sets the schema. See {@link canvasDatagrid.schema}.
 * @param {array} [args.data=[]] - Sets the data. See {@link canvasDatagrid.data}.
 * @param {number} [args.touchReleaseAnimationDurationMs=2000] - How long the ease animation runs after touch release.
 * @param {number} [args.touchReleaseAcceleration=1000] - How many times the detected pixel per inch touch swipe is multiplied on release.  Higher values mean more greater touch release movement.
 * @param {number} [args.touchDeadZone=3] - How many pixels a touch must move within `attributes.touchSelectTimeMs` to be considered scrolling rather than selecting.
 * @param {number} [args.touchScrollZone=30] - When touching, the scroll element hit boxes are increased by this number of pixels for easier touching.
 * @param {boolean} [args.showCopy=true] - When true, copy will appear on the context menu when it is available.
 * @param {string} [args.pasteText=Paste] - The text that appears on the context menu when paste is available.
 * @param {string} [args.copyText=Copy] - The text that appears on the context menu when copy is available.
 * @param {string} [args.columnHeaderClickBehavior=sort] - Can be any of sort, select, none.  When sort is selected, left clicking a column header will result in sorting ascending, then sorting descending if already sorted by this column.  If select is selected then clicking a column header will result in the column becoming selected.  Holding control/command or shift will select multiple columns in this mode.
 * @param {boolean} [args.scrollPointerLock=false] - When true, clicking on the scroll box to scroll will cause the mouse cursor to disappear to prevent it from exiting the area observable to the grid.
 * @param {string} [args.selectionHandleBehavior='none'] - When set to a value other than none a handle will appear in the lower right corner of the desktop version of the grid.  It does nothing but will be used in a future version of the grid.
 * @param {string} [args.columnSelectorVisibleText='&nbsp;&nbsp;&nbsp&nbsp;'] - When a column is hidden, this is the value to the left of the title in the column selector content menu.
 * @param {string} [args.columnSelectorHiddenText='\u2713'] - When a column is visible, this is the value to the left of the title in the column selector content menu.
 * @param {string} [args.columnSelectorText='Add/remove columns'] - The text of the column selector context menu.
 * @param {string} [args.hideColumnText='Hide %s'] - The text displayed on the hide column .
 * @param {boolean} [args.showColumnSelector=true] - When true, the column selector context menu is visible.
 * @param {number} [args.touchContextMenuTimeMs=800] - The length of time in milliseconds before a context menu appears on touch start within the touch dead zone.
 * @param {number} [args.scrollAnimationPPSThreshold=0.75] - How many points per second must be achieved before touch animation occurs on touch release.
 * @param {string} [args.touchSelectHandleZone=20] - Radius of pixels around touch select handles that touch select handles respond to.
 * @param {string} [args.touchEasingMethod=easeOutQuad] - Animation easing method used for touch release animation.  Valid values are easeOutQuad, easeOutCubic, easeOutQuart, easeOutQuint.
 * @param {boolean} [args.snapToRow=false] - When true, scrolling snaps to the top row.
 * @param {number} [args.touchZoomSensitivity=0.005] - The scale at which "pinch to zoom" screen pixels are converted to scale values.
 * @param {number} [args.touchZoomMin=0.5] - The minimum zoom scale.
 * @param {number} [args.touchZoomMax=1.75] - The maximum zoom scale.
 * @param {number} [args.maxPixelRatio=1.5] - The maximum pixel ratio for high DPI displays.  High DPI displays can cause sluggish performance, this caps resolution the grid is rendered at.  Standard resolution (e.g.: 1920x1080) have a pixel ratio of 1:1 while higher resolution displays can be higher (e.g.: Retina display 2:1).  Higher numbers are sharper (higher resolution) up to the max of your display (usually 2), lower numbers are lower resolution, down to 1.  It might be fun to set a value lower than 1, I've never done it.
 * @param {canvasDatagrid.style} [args.style={}] - Sets selected values in style.
 * @param {canvasDatagrid.filter} [args.filters={}] - Sets selected values in filters.  See {@link canvasDatagrid.filters}.
 * @param {canvasDatagrid.sorter} [args.sorters={}] - Sets selected values in sorters.  See {@link canvasDatagrid.sorters}.
 * @param {canvasDatagrid.formatter} [args.formatters={}] - Sets selected values in formatters.  See {@link canvasDatagrid.formatters}.
 * @param {canvasDatagrid.dataTypes} [args.parsers={}] - Sets selected values in parsers.  See {@link canvasDatagrid.parsers}.
 * @property {array} selectedRows - Selected rows.  Same as the `data` property but filtered for the rows the user has cells selected in.  If any cell in the row is selected, all data for that row will appear in this array.
 * @property {array} selectedCells - Jagged array of cells that the user has selected.  Beware that because this is a jagged array, some indexes will be `null`.  Besides the `null`s this data looks just like the data you passed in, but just the cells the user has selected.  So if the user has selected cell 10 in a 10 column row, there will be 9 `null`s followed by the data from column 10.
 * @property {array} changes - Array of changes and additions made to the grid since last time data was loaded.  The data property will change with changes as well, but this is a convince list of all the changes in one spot.  Calling `clearChangeLog` will clear this list.
 * @property {object} input - Reference to the the edit cell when editing.  Undefined when not editing.  When editing, this DOM element is superimposed over the cell being edited and is fully visible.
 * @property {object} controlInput - Input used for key controls on the grid.  Any clicks on the grid will cause this input to be focused.  This input is hidden above the top left corner of the browser window.
 * @property {canvasDatagrid.cell} currentCell - Cell that the mouse moved over last.
 * @property {number} height - Height of the grid.
 * @property {number} width - Width of the grid.
 * @property {array} visibleCells - Array of cell drawn.
 * @property {array} visibleRows - Array of visible row indexes.
 * @property {array} selections - Matrix array of selected cells.
 * @property {rect} selectionBounds - Bounds of current selection.
 * @property {object} attributes - Object that contains the properties listed in the attributes section.  These properties can be used at runtime to alter attributes set during instantiation.  See the See {@link canvasDatagrid.params} section for full documentation.
 * @property {object} sizes - Mutable object that contains `sizes.columns` and `sizes.rows` arrays.  These arrays control the sizes of the columns and rows.  If there is not an entry for the row or column index it will fall back to the style default.
 * @property {canvasDatagrid.style} style - Object that contains the properties listed in the style section.  Changing a style will automatically call `draw`.
 * @property {string} dragMode - Represents the currently displayed resize cursor.  Can be `ns-resize`, `ew-resize`, `pointer`, or `inherit`.
 * @property {canvasDatagrid.formatter} formatters - Object that contains formatting functions for displaying text.  The properties in this object match the `schema[].type` property.  For example, if the schema for a given column was of the type `date` the grid would look for a formatter called `formatters.date` if a formatter cannot be found for a given data type a warning will be logged and the string formatter will be used. Formatters must return a string value to be displayed in the cell.  See {@link canvasDatagrid.formatters}.
 * @property {canvasDatagrid.sorter} sorters - Object that contains a list of sorting functions for sorting columns.   See {@tutorial sorters}.
 * @property {canvasDatagrid.filter} filters - Object that contains a list of filters for filtering data.  The properties in this object match the `schema[].type` property.  For example, if the schema for a given column was of the type `date` the grid would look for a filter called `filters.date` if a filter cannot be found for a given data type a warning will be logged and the string/RegExp filter will be used.   See {@link canvasDatagrid.filters}.
 * @property {boolean} hasActiveFilters - When true, grid data is being filtered.
 * @property {canvasDatagrid.data} data - This is how data is set in the grid.  Data must be an array of objects that conform to a schema.  Data values can be any primitive type.  However if a cell value is another data array, an inner grid will be rendered into the cell.  This "cell grid" is different than a "tree grid" (the sort you drill in with a row header arrow) and uses the `cellGridAttributes` attribute for properties and styling. See {@link canvasDatagrid.data}.
 * @property {canvasDatagrid.schema} schema - Schema is optional.  Schema is an array of {canvasDatagrid.header} objects.  If no schema is provided one will be generated from the data, in that case all data will be assumed to be string data. See {@link canvasDatagrid.schema}.
 * @property {number} scrollHeight - The total number of pixels that can be scrolled down.
 * @property {number} scrollWidth - The total number of pixels that can be scrolled to the left.
 * @property {number} scrollTop - The current position of the vertical scroll bar in pixels.
 * @property {number} scrollLeft - The current position of the horizontal scroll bar in pixels.
 * @property {number} offsetTop - The offset top of the grid.
 * @property {number} offsetLeft - The offset left of the grid.
 * @property {boolean} isChildGrid - When true, this grid is a child grid of another grid.  Meaning, it appears as a tree grid or a cell grid of another parent grid.
 * @property {boolean} openChildren - List of open child grids by internal unique row id.
 * @property {boolean} childGrids - Child grids in this grid organized by internal unique row id.
 * @property {canvasDatagrid} parentGrid - If this grid is a child grid, this is the grids parent.
 * @property {object} canvas - The canvas element drawn onto for this grid.
 * @property {HTMLElement} shadowRoot - The shadow root element.
 * @property {array} rowOrder - Gets or sets the order of the rows.  This allows you to modify the appearance of the data without modifying the data itself. The order of the array dictates the order of the rows, e.g.: [0, 1, 2] is normal order, [2, 1, 0] is reverse.  The array length must be equal to or greater than the number of rows.
 * @property {array} columnOrder - Gets or sets the order of the columns.  This allows you to modify the appearance of the schema without modifying the data itself. The order of the array dictates the order of the columns, e.g.: [0, 1, 2] is normal order, [2, 1, 0] is reverse.  The array length must be equal to or greater than the number of columns.
 * @property {object} activeCell - Gets the active cell.  Consists of the properties rowIndex and columnIndex.
 * @property {boolean} hasFocus - When true, the grid is has focus.
 * @property {array} visibleRowHeights - The heights of the visible rows.
 * @property {boolean} isChildGrid - When true, this grid is within another grid.
 * @property {HTMLElement} parentNode - The parent node of the canvas, usually the shadow DOM's parent element.
 * @property {object} scrollIndexRect - Rect describing the view port of the virtual canvas in column and row indexes.  If you only want to do things to visible cells, this is a good property to check what the range of visible cells is.
 * @property {object} scrollPixelRect - Rect describing view port of the virtual canvas in pixels.
 * @property {number} frozenColumn - The highest frozen column index.  Setting a value higher than the possible visible columns will result in a range error.
 * @property {number} frozenRow - The highest frozen row index.  Setting a value higher than the possible visible rows will result in a range error.
 * @property {string} orderBy - The name of the column the grid is currently sorted by.  You can set this value to any column name to alter the sort order dependent on data type.  Subscribing to `beforesortcolumn` and calling `e.preventDefault` allows you to change the property and the graphical appearance of the grid (an order arrow will be drawn over the respective column) without invoking the client side ordering function.  This is useful if you want to use server side data ordering.
 * @property {string} orderDirection - Gets or sets the order by direction.  Value can be `asc` for ascending order or `desc` for descending order.  Subscribing to `beforesortcolumn` and calling `e.preventDefault` allows you to change the property and the graphical appearance of the grid (an order arrow will be drawn over the respective column) without invoking the client side ordering function.  This is useful if you want to use server side data ordering.
 */

// supporting classes go here
/**
 * A selection rectangle.
 * @class
 * @name canvasDatagrid.rect
 * @property {number} top - First row index.
 * @property {number} bottom - Last row index.
 * @property {number} left - First column index.
 * @property {number} right - Last column index.
 */
/**
 * A formatting function.  Must be a member of (property of) {@link canvasDatagrid.formatters} and match a type from one of the {@link canvasDatagrid.header}s in {@link canvasDatagrid.schema}.
 * @abstract
 * @function
 * @name canvasDatagrid.formatter
 * @param {object} e - Formatting event object.
 * @param {canvasDatagrid.cell} e.cell - Cell being formatted.
 */
/**
 * A filter function.  Filter should return true when the value should be kept, and false if the value should be filtered out.  Must be a member of (property of) {canvasDatagrid.filters} and match a type from one of the {@link canvasDatagrid.header}s in {@link canvasDatagrid.schema}.
 * @abstract
 * @function
 * @name canvasDatagrid.filter
 * @param {string} value - The current value being checked.
 * @param {string} filterFor - The value being filtered against.
 */
/**
 * A sorter function.  Must be a member of (property of) {@link canvasDatagrid.sorters} and match a type from one of the {@link canvasDatagrid.header}s in {@link canvasDatagrid.schema}.
 * @abstract
 * @function
 * @name canvasDatagrid.sorter
 * @param {string} columnName - Name of the column being sorted.
 * @param {string} direction - Direction of the column being sorted, either `asc` or `desc`.
 */
/**
 * A header that describes the data in a column.  The term header and column are used interchangeably in this documentation.  The {@link canvasDatagrid.schema} is an array of {@link canvasDatagrid.header}.
 * @class
 * @name canvasDatagrid.header
 * @property {string} name - The name of the header.  This must match the property name of an object in the {@link canvasDatagrid.data} array.  This is the only required property of a {@link canvasDatagrid.header}.  This value will appear at the top of the column unless {@link canvasDatagrid.header.title} is defined.
 * @property {string} type - The data type of this header.  This value should match properties in {@link canvasDatagrid.formatters}, {@link canvasDatagrid.filters}, {@link canvasDatagrid.sorters} to take full advantage of formatting, sorting and filtering when not defining these properties within this header.
 * @property {string} title - The value that is actually displayed to the user at the top of the column.  If no value is present, {@link canvasDatagrid.header.name} will be used instead.
 * @property {number} width - The mutable width of this column in pixels.  The user can override this value if {@link canvasDatagrid.attributes.allowColumnResizing} is set to `true`.
 * @property {boolean} hidden - When true, the column will not be included in the visible schema.  This means selection, copy, and drawing functions will not display this column or values from this column.
 * @property {function} filter - A {@link canvasDatagrid.filter} function that defines how filters will work against data in this column.
 * @property {function} formatter - A {@link canvasDatagrid.formatter} function that defines how data will be formatted when drawn onto cells belonging to this column.
 * @property {function} sorter - A {@link canvasDatagrid.sorter} function that defines how data will sorted within this column.
 * @property {function|string} defaultValue - The default value of this column for new rows.  This can be a function or string.  When using a string, this string value will be used in the new cell.  When using a function, it must return a string, which will be used in the new cell.  The arguments passed to this function are: argument[0] = {@link canvasDatagrid.header}, argument[1] = row index.
 */
/**
 * A cell on the grid.
 * @abstract
 * @class
 * @name canvasDatagrid.cell
 * @property {string} type - Data type used by this cell as dictated by the column.
 * @property {string} style - Visual style of cell. Can be any one of cell, activeCell, columnHeaderCell, cornerCell, or rowHeaderCell. Prefix of each style name.
 * @property {number} x - The x coordinate of this cell on the grid.
 * @property {number} y - The y coordinate of this cell on the grid.
 * @property {string} nodeType - Always 'canvas-datagrid-cell'.
 * @property {number} offsetTop - The y coordinate of this cell on the grid canvas.
 * @property {number} offsetLeft - The x coordinate of this cell on the grid canvas.
 * @property {number} scrollTop - The scrollTop value of the scrollBox.
 * @property {number} scrollLeft - The scrollLeft value of the scrollBox.
 * @property {boolean} rowOpen - When true, this row is a tree grid enabled cell and the tree is in the open state.
 * @property {boolean} hovered - When true, this cell is hovered.
 * @property {boolean} selected - When true, this cell is selected.
 * @property {boolean} active - When true, this cell is the active cell.
 * @property {number} width - Width of the cell on the canvas.
 * @property {number} height - Height of the cell on the canvas.
 * @property {number} userWidth - User set width of the cell on the canvas. If undefined, the user has not set this column.
 * @property {number} userHeight - Height of the cell on the canvas. If undefined, the user has not set this row.
 * @property {object} data - The row of data this cell belongs to.
 * @property {header} header - The schema column this cell belongs to.
 * @property {number} columnIndex - The column index of the cell.
 * @property {number} rowIndex - The row index of the cell.
 * @property {number} sortColumnIndex - The column index of the cell after the user has reordered it.
 * @property {number} sortRowIndex - The column index of the cell after the user has reordered it.
 * @property {string} value - The value of the cell.
 * @property {string} formattedValue - The value after passing through any formatters.  See {@link canvasDatagrid.formatters}.
 * @property {boolean} isColumnHeaderCellCap - When true, the cell is the cap at the right side end of the header cells.
 * @property {canvasDatagrid} parentGrid - The grid to which this cell belongs.
 * @property {string} gridId - If this cell contains a grid, this is the grids unique id.
 * @property {boolean} isGrid - When true, the cell is a grid.
 * @property {boolean} isHeader - When true, the cell is a column or row header.
 * @property {boolean} isColumnHeader - When true, the cell is a column header.
 * @property {boolean} isRowHeader - When true, the cell is a row header.
 * @property {boolean} isCorner - When true, the cell is the upper left corner cell.
 * @property {boolean} activeHeader - When true, the cell is an active header cell, meaning the active cell is in the same row or column.
 * @property {string} horizontalAlignment - The horizontal alignment of the cell.
 * @property {string} verticalAlignment - The vertical alignment of the cell.
 * @property {string} innerHTML - HTML, if any, in the cell.  If set, HTML will be rendered into the cell.
 * @property {object} text - The text object in the cell.
 * @property {object} text.x - The x coordinate of the text.
 * @property {object} text.y - The y coordinate of the text.
 * @property {object} text.width - The width of the text, including truncation and ellipsis.
 * @property {object} text.value - The value of the text, including truncation and ellipsis.
 */
/**
 * Styles for the canvas data grid.  Standard CSS styles still apply but are not listed here.
 * @class
 * @name canvasDatagrid.style
 * @property {string} [activeCellBackgroundColor=rgba(255, 255, 255, 1)] - Style of activeCellBackgroundColor.
 * @property {string} [activeCellBorderColor=rgba(110, 168, 255, 1)] - Style of activeCellBorderColor.
 * @property {number} [activeCellBorderWidth=0.25] - Style of activeCellBorderWidth.
 * @property {string} [activeCellColor=rgba(0, 0, 0, 1)] - Style of activeCellColor.
 * @property {string} [activeCellFont=16px sans-serif] - Style of activeCellFont.
 * @property {string} [activeCellHoverBackgroundColor=rgba(255, 255, 255, 1)] - Style of activeCellHoverBackgroundColor.
 * @property {string} [activeCellHorizontalAlignment=left] - Style of activeCellHorizontalAlignment.
 * @property {string} [activeCellHoverColor=rgba(0, 0, 0, 1)] - Style of activeCellHoverColor.
 * @property {string} [activeCellOverlayBorderColor=rgba(66, 133, 244, 1)] - Style of activeCellOverlayBorderColor.
 * @property {number} [activeCellOverlayBorderWidth=1.50] - Style of activeCellOverlayBorderWidth.
 * @property {number} [activeCellPaddingBottom=5] - Style of activeCellPaddingBottom.
 * @property {number} [activeCellPaddingLeft=5] - Style of activeCellPaddingLeft.
 * @property {number} [activeCellPaddingRight=7] - Style of activeCellPaddingRight.
 * @property {number} [activeCellPaddingTop=5] - Style of activeCellPaddingTop.
 * @property {string} [activeCellSelectedBackgroundColor=rgba(236, 243, 255, 1)] - Style of activeCellSelectedBackgroundColor.
 * @property {string} [activeCellSelectedColor=rgba(0, 0, 0, 1)] - Style of activeCellSelectedColor.
 * @property {string} [activeCellVerticalAlignment=center] - Style of activeCellVerticalAlignment.
 * @property {string} [activeHeaderCellBackgroundColor=rgba(225, 225, 225, 1)] - Style of activeHeaderCellBackgroundColor.
 * @property {string} [activeHeaderCellColor=rgba(0, 0, 0, 1)] - Style of activeHeaderCellColor.
 * @property {string} [activeRowHeaderCellBackgroundColor=rgba(225, 225, 225, 1)] - Style of activeRowHeaderCellBackgroundColor.
 * @property {string} [activeRowHeaderCellColor=rgba(0, 0, 0, 1)] - Style of activeRowHeaderCellColor.
 * @property {number} [autocompleteBottomMargin=60] - Style of autocompleteBottomMargin.
 * @property {number} [autosizeHeaderCellPadding=8] - Style of autosizeHeaderCellPadding.
 * @property {number} [autosizePadding=5] - Style of autosizePadding.
 * @property {string} [gridBorderCollapse=collapse] - Style of gridBorderCollapse.  When grid border collapse is set to the default value of `collapse`, the bottom border and the top border of the next cell down will be merged into a single border.  The only other setting is `expand` which allows the full border to be drawn.
 * @property {number} [cellAutoResizePadding=13] - Style of cellAutoResizePadding.
 * @property {string} [cellBackgroundColor=rgba(255, 255, 255, 1)] - Style of cellBackgroundColor.
 * @property {string} [cellBorderColor=rgba(195, 199, 202, 1)] - Style of cellBorderColor.
 * @property {number} [cellBorderWidth=0.25] - Style of cellBorderWidth.
 * @property {string} [cellColor=rgba(0, 0, 0, 1)] - Style of cellColor.
 * @property {string} [cellFont=16px sans-serif] - Style of cellFont.
 * @property {number} [cellGridHeight=250] - Style of cellGridHeight.
 * @property {number} [cellHeight=24] - Style of cellHeight.
 * @property {number} [cellHeightWithChildGrid=150] - Style of cellHeightWithChildGrid.
 * @property {string} [cellHorizontalAlignment=left] - Style of cellHorizontalAlignment.
 * @property {string} [cellHoverBackgroundColor=rgba(255, 255, 255, 1)] - Style of cellHoverBackgroundColor.
 * @property {string} [cellHoverColor=rgba(0, 0, 0, 1)] - Style of cellHoverColor.
 * @property {number} [cellPaddingBottom=5] - Style of cellPaddingBottom.
 * @property {number} [cellPaddingLeft=5] - Style of cellPaddingLeft.
 * @property {number} [cellPaddingRight=5] - Style of cellPaddingRight.
 * @property {number} [cellPaddingTop=5] - Style of cellPaddingTop.
 * @property {string} [cellSelectedBackgroundColor=rgba(236, 243, 255, 1)] - Style of cellSelectedBackgroundColor.
 * @property {string} [cellSelectedColor=rgba(0, 0, 0, 1)] - Style of cellSelectedColor.
 * @property {string} [cellVerticalAlignment=center] - Style of cellVerticalAlignment.
 * @property {string} [cellWhiteSpace=nowrap] - Style of cellWhiteSpace. Can be 'nowrap' or 'normal'.
 * @property {number} [cellLineHeight=1] - The line height of each wrapping line as a percentage.
 * @property {number} [cellLineSpacing=3] - Style of cellLineSpacing.
 * @property {number} [cellWidthWithChildGrid=250] - Style of cellWidthWithChildGrid.
 * @property {number} [childContextMenuMarginLeft=-5] - Style of childContextMenuMarginLeft.
 * @property {number} [childContextMenuMarginTop=0] - Style of childContextMenuMarginTop.
 * @property {string} [childContextMenuArrowHTML=&#x25BA;] - Style of childContextMenuArrowHTML.
 * @property {string} [childContextMenuArrowColor=rgba(43, 48, 43, 1)] - Style of childContextMenuArrowColor.
 * @property {number} [columnGroupRowHeight=25] - Style of columnGroupRowHeight.
 * @property {string} [contextMenuChildArrowFontSize=12px] - Style of contextMenuChildArrowFontSize.
 * @property {number} [cellWidth=250] - Style of cellWidth.
 * @property {string} [contextMenuBackground=rgba(240, 240, 240, 1)] - Style of contextMenuBackground.
 * @property {string} [contextMenuBorder=solid 1px rgba(158, 163, 169, 1)] - Style of contextMenuBorder.
 * @property {string} [contextMenuBorderRadius=3px] - Style of contextMenuBorderRadius.
 * @property {string} [contextMenuColor=rgba(43, 48, 43, 1)] - Style of contextMenuColor.
 * @property {string} [contextMenuCursor=default] - Style of contextMenuCursor.
 * @property {string} [contextMenuFilterInvalidExpresion=rgba(237, 155, 156, 1)] - Style of contextMenuFilterInvalidExpresion.
 * @property {string} [contextMenuFontFamily=sans-serif] - Style of contextMenuFontFamily.
 * @property {string} [contextMenuFontSize=16px] - Style of contextMenuFontSize.
 * @property {string} [contextMenuHoverBackground=rgba(182, 205, 250, 1)] - Style of contextMenuHoverBackground.
 * @property {string} [contextMenuHoverColor=rgba(43, 48, 153, 1)] - Style of contextMenuHoverColor.
 * @property {string} [contextMenuItemBorderRadius=3px] - Style of contextMenuItemBorderRadius.
 * @property {string} [contextMenuItemMargin=2px] - Style of contextMenuItemMargin.
 * @property {string} [contextMenuLabelDisplay=inline-block] - Style of contextMenuLabelDisplay.
 * @property {string} [contextMenuLabelMargin=0 3px 0 0] - Style of contextMenuLabelMargin.
 * @property {string} [contextMenuLabelMaxWidth=700px] - Style of contextMenuLabelMaxWidth.
 * @property {string} [contextMenuLabelMinWidth=75px] - Style of contextMenuLabelMinWidth.
 * @property {number} [contextMenuMarginLeft=3] - Style of contextMenuMarginLeft.
 * @property {number} [contextMenuMarginTop=-3] - Style of contextMenuMarginTop.
 * @property {number} [contextMenuWindowMargin=6] - Style of contextMenuWindowMargin.
 * @property {string} [contextMenuOpacity=0.98] - Style of contextMenuOpacity.
 * @property {string} [contextMenuPadding=2px] - Style of contextMenuPadding.
 * @property {string} [contextMenuArrowUpHTML=&#x25B2;] - Style of contextMenuArrowUpHTML.
 * @property {string} [contextMenuArrowDownHTML=&#x25BC;] - Style of contextMenuArrowDownHTML.
 * @property {string} [contextMenuArrowColor=rgba(43, 48, 43, 1)] - Style of contextMenuArrowColor.
 * @property {number} [contextMenuZIndex=10000] - Style of contextMenuZIndex.
 * @property {string} [contextFilterButtonHTML=&#x25BC;] - Style of contextFilterButtonHTML.
 * @property {string} [contextFilterButtonBorder=solid 1px rgba(158, 163, 169, 1)] - Style of contextFilterButtonBorder.
 * @property {string} [contextFilterButtonBorderRadius=3px] - Style of contextFilterButtonBorderRadius.
 * @property {string} [cornerCellBackgroundColor=rgba(240, 240, 240, 1)] - Style of cornerCellBackgroundColor.
 * @property {string} [cornerCellBorderColor=rgba(202, 202, 202, 1)] - Style of cornerCellBorderColor.
 * @property {string} [debugBackgroundColor=rgba(0, 0, 0, .0)] - Style of debugBackgroundColor.
 * @property {string} [debugColor=rgba(255, 15, 24, 1)] - Style of debugColor.
 * @property {string} [debugEntitiesColor=rgba(76, 231, 239, 1.00)] - Style of debugEntitiesColor.
 * @property {string} [debugFont=11px sans-serif] - Style of debugFont.
 * @property {string} [debugPerfChartBackground=rgba(29, 25, 26, 1.00)] - Style of debugPerfChartBackground.
 * @property {string} [debugPerfChartTextColor=rgba(255, 255, 255, 0.8)] - Style of debugPerfChartTextColor.
 * @property {string} [debugPerformanceColor=rgba(252, 255, 37, 1.00)] - Style of debugPerformanceColor.
 * @property {string} [debugScrollHeightColor=rgba(252, 255, 37, 1.00)] - Style of debugScrollHeightColor.
 * @property {string} [debugScrollWidthColor=rgba(66, 255, 27, 1.00)] - Style of debugScrollWidthColor.
 * @property {string} [debugTouchPPSXColor=rgba(246, 102, 24, 1.00)] - Style of debugTouchPPSXColor.
 * @property {string} [debugTouchPPSYColor=rgba(186, 0, 255, 1.00)] - Style of debugTouchPPSYColor.
 * @property {string} [editCellBorder=solid 1px rgba(110, 168, 255, 1)] - Style of editCellBorder.
 * @property {string} [editCellBoxShadow=0 2px 5px rgba(0,0,0,0.4)] - Style of editCellBoxShadow.
 * @property {string} [editCellFontFamily=sans-serif] - Style of editCellFontFamily.
 * @property {string} [editCellFontSize=16px] - Style of editCellFontSize.
 * @property {number} [editCellPaddingLeft=4] - Style of editCellPaddingLeft.
 * @property {string} [editCellColor=black] - Style of editCellColor.
 * @property {string} [editCellBackgroundColor=white] - Style of editCellBackgroundColor.
 * @property {number} [editCellZIndex=10000] - Style of editCellZIndex.
 * @property {string} [gridBackgroundColor=rgba(240, 240, 240, 1)] - Style of gridBackgroundColor.
 * @property {string} [gridBorderColor=rgba(202, 202, 202, 1)] - Style of gridBorderColor.
 * @property {number} [gridBorderWidth=1] - Style of gridBorderWidth.
 * @property {string} [columnHeaderCellCapBackgroundColor=rgba(240, 240, 240, 1)] - Style of columnHeaderCellBackgroundColor.
 * @property {string} [columnHeaderCellCapBorderColor=rgba(172, 172, 172, 1)] - Style of columnHeaderCellBackgroundColor.
 * @property {number} [columnHeaderCellCapBorderWidth=1] - Style of columnHeaderCellBackgroundColor.
 * @property {string} [columnHeaderCellBorderColor=rgba(152, 152, 152, 1)] - Style of columnHeaderCellBorderColor.
 * @property {number} [columnHeaderCellBorderWidth=0.25] - Style of columnHeaderCellBorderWidth.
 * @property {string} [columnHeaderCellColor=rgba(50, 50, 50, 1)] - Style of columnHeaderCellColor.
 * @property {string} [columnHeaderCellFont=16px sans-serif] - Style of columnHeaderCellFont.
 * @property {number} [columnHeaderCellHeight=25] - Style of columnHeaderCellHeight.
 * @property {string} [columnHeaderCellHorizontalAlignment=left] - Style of columnHeaderCellHorizontalAlignment.
 * @property {string} [columnHeaderCellHoverBackgroundColor=rgba(235, 235, 235, 1)] - Style of columnHeaderCellHoverBackgroundColor.
 * @property {string} [columnHeaderCellHoverColor=rgba(0, 0, 0, 1)] - Style of columnHeaderCellHoverColor.
 * @property {number} [columnHeaderCellPaddingBottom=5] - Style of columnHeaderCellPaddingBottom.
 * @property {number} [columnHeaderCellPaddingLeft=5] - Style of columnHeaderCellPaddingLeft.
 * @property {number} [columnHeaderCellPaddingRight=7] - Style of columnHeaderCellPaddingRight.
 * @property {number} [columnHeaderCellPaddingTop=5] - Style of columnHeaderCellPaddingTop.
 * @property {string} [columnHeaderCellVerticalAlignment=center] - Style of columnHeaderCellVerticalAlignment.
 * @property {string} [columnHeaderOrderByArrowBorderColor=rgba(195, 199, 202, 1)] - Style of columnHeaderOrderByArrowBorderColor.
 * @property {number} [columnHeaderOrderByArrowBorderWidth=1] - Style of columnHeaderOrderByArrowBorderWidth.
 * @property {string} [columnHeaderOrderByArrowColor=rgba(155, 155, 155, 1)] - Style of columnHeaderOrderByArrowColor.
 * @property {number} [columnHeaderOrderByArrowHeight=8] - Style of columnHeaderOrderByArrowHeight.
 * @property {number} [columnHeaderOrderByArrowMarginLeft=0] - Style of columnHeaderOrderByArrowMarginLeft.
 * @property {number} [columnHeaderOrderByArrowMarginRight=5] - Style of columnHeaderOrderByArrowMarginRight.
 * @property {number} [columnHeaderOrderByArrowMarginTop=6] - Style of columnHeaderOrderByArrowMarginTop.
 * @property {number} [columnHeaderOrderByArrowWidth=13] - Style of columnHeaderOrderByArrowWidth.
 * @property {number} [rowHeaderCellWidth=57] - Style of rowHeaderCellWidth.
 * @property {number} [minColumnWidth=45] - Style of minColumnWidth.
 * @property {number} [minHeight=24] - Style of minHeight.
 * @property {number} [minRowHeight=24] - Style of minRowHeight.
 * @property {string} [name=default] - Style of name.
 * @property {string} [reorderMarkerBackgroundColor=rgba(0, 0, 0, 0.1)] - Style of reorderMarkerBackgroundColor.
 * @property {string} [reorderMarkerBorderColor=rgba(0, 0, 0, 0.2)] - Style of reorderMarkerBorderColor.
 * @property {number} [reorderMarkerBorderWidth=1.25] - Style of reorderMarkerBorderWidth.
 * @property {string} [reorderMarkerIndexBorderColor=rgba(66, 133, 244, 1)] - Style of reorderMarkerIndexBorderColor.
 * @property {number} [reorderMarkerIndexBorderWidth=2.75] - Style of reorderMarkerIndexBorderWidth.
 * @property {number} [rowGroupColumnWidth=25] - Style of rowGroupColumnWidth.
 * @property {string} [rowHeaderCellBackgroundColor=rgba(240, 240, 240, 1)] - Style of rowHeaderCellBackgroundColor.
 * @property {string} [rowHeaderCellBorderColor=rgba(152, 152, 152, 1)] - Style of rowHeaderCellBorderColor.
 * @property {number} [rowHeaderCellBorderWidth=0.25] - Style of rowHeaderCellBorderWidth.
 * @property {string} [rowHeaderCellColor=rgba(50, 50, 50, 1)] - Style of rowHeaderCellColor.
 * @property {string} [rowHeaderCellFont=16px sans-serif] - Style of rowHeaderCellFont.
 * @property {number} [rowHeaderCellHeight=25] - Style of rowHeaderCellHeight.
 * @property {string} [rowHeaderCellHorizontalAlignment=left] - Style of rowHeaderCellHorizontalAlignment.
 * @property {string} [rowHeaderCellHoverBackgroundColor=rgba(235, 235, 235, 1)] - Style of rowHeaderCellHoverBackgroundColor.
 * @property {string} [rowHeaderCellHoverColor=rgba(0, 0, 0, 1)] - Style of rowHeaderCellHoverColor.
 * @property {number} [rowHeaderCellPaddingBottom=5] - Style of rowHeaderCellPaddingBottom.
 * @property {number} [rowHeaderCellPaddingLeft=5] - Style of rowHeaderCellPaddingLeft.
 * @property {number} [rowHeaderCellPaddingRight=5] - Style of rowHeaderCellPaddingRight.
 * @property {number} [rowHeaderCellPaddingTop=5] - Style of rowHeaderCellPaddingTop.
 * @property {number} [rowHeaderCellRowNumberGapHeight=5] - Style of rowHeaderCellRowNumberGapHeight.
 * @property {number} [rowHeaderCellRowNumberGapColor=rgba(50, 50, 50, 1)] - Style of rowHeaderCellRowNumberGapColor.
 * @property {string} [rowHeaderCellSelectedBackgroundColor=rgba(217, 217, 217, 1)] - Style of rowHeaderCellSelectedBackgroundColor.
 * @property {string} [rowHeaderCellSelectedColor=rgba(50, 50, 50, 1)] - Style of rowHeaderCellSelectedColor.
 * @property {string} [rowHeaderCellVerticalAlignment=center] - Style of rowHeaderCellVerticalAlignment.
 * @property {string} [scrollBarActiveColor=rgba(125, 125, 125, 1)] - Style of scrollBarActiveColor.
 * @property {string} [scrollBarBackgroundColor=rgba(240, 240, 240, 1)] - Style of scrollBarBackgroundColor.
 * @property {string} [scrollBarBorderColor=rgba(202, 202, 202, 1)] - Style of scrollBarBorderColor.
 * @property {number} [scrollBarBorderWidth=0.5] - Style of scrollBarBorderWidth.
 * @property {number} [scrollBarBoxBorderRadius=3] - Style of scrollBarBoxBorderRadius.
 * @property {string} [scrollBarBoxColor=rgba(192, 192, 192, 1)] - Style of scrollBarBoxColor.
 * @property {number} [scrollBarBoxMargin=2] - Style of scrollBarBoxMargin.
 * @property {number} [scrollBarBoxMinSize=15] - Style of scrollBarBoxMinSize.
 * @property {number} [scrollBarBoxWidth=8] - Style of scrollBarBoxWidth.
 * @property {string} [scrollBarCornerBackgroundColor=rgba(240, 240, 240, 1)] - Style of scrollBarCornerBackgroundColor.
 * @property {string} [scrollBarCornerBorderColor=rgba(202, 202, 202, 1)] - Style of scrollBarCornerBorderColor.
 * @property {number} [scrollBarWidth=11] - Style of scrollBarWidth.
 * @property {string} [selectionOverlayBorderColor=rgba(66, 133, 244, 1)] - Style of selectionOverlayBorderColor.
 * @property {number} [selectionOverlayBorderWidth=0.75] - Style of selectionOverlayBorderWidth.
 * @property {string} [treeArrowBorderColor=rgba(195, 199, 202, 1)] - Style of treeArrowBorderColor.
 * @property {number} [treeArrowBorderWidth=1] - Style of treeArrowBorderWidth.
 * @property {number} [treeArrowClickRadius=5] - Style of treeArrowClickRadius.
 * @property {string} [treeArrowColor=rgba(155, 155, 155, 1)] - Style of treeArrowColor.
 * @property {number} [treeArrowHeight=8] - Style of treeArrowHeight.
 * @property {number} [treeArrowMarginLeft=0] - Style of treeArrowMarginLeft.
 * @property {number} [treeArrowMarginRight=5] - Style of treeArrowMarginRight.
 * @property {number} [treeArrowMarginTop=6] - Style of treeArrowMarginTop.
 * @property {number} [treeArrowWidth=13] - Style of treeArrowWidth.
 * @property {number} [treeGridHeight=250] - Style of treeGridHeight.
 * @property {string} [selectionHandleColor=rgba(66, 133, 244, 1)] - Style of selectionHandleColor.
 * @property {string} [selectionHandleBorderColor=rgba(255, 255, 255, 1)] - Style of selectionHandleBorderColor.
 * @property {number} [selectionHandleSize=8] - Style of selectionHandleSize.
 * @property {number} [selectionHandleBorderWidth=1.5] - Style of selectionHandleBorderWidth.
 * @property {string} [selectionHandleType='square'] - Style of selectionHandleType.  Can be square or circle.
 * @property {number} [moveOverlayBorderWidth=1] - Style of moveOverlayBorderWidth.
 * @property {string} [moveOverlayBorderColor='rgba(66, 133, 244, 1)'] - Style of moveOverlayBorderColor.
 * @property {string} [moveOverlayBorderSegments='12, 7'] - Style of moveOverlayBorderSegments.
 * @property {string} [frozenMarkerActiveColor='rgba(236, 243, 255, 1)'] - Style of frozenMarkerActiveColor.
 * @property {string} [frozenMarkerActiveBorderColor='rgba(110, 168, 255, 1)'] - Style of frozenMarkerActiveBorderColor.
 * @property {string} [frozenMarkerColor='rgba(222, 222, 222, 1)'] - Style of frozenMarkerColor.
 * @property {string} [frozenMarkerBorderColor='rgba(202, 202, 202, 1)'] - Style of frozenMarkerBorderColor.
 * @property {number} [frozenMarkerBorderWidth=1] - Style of frozenMarkerBorderWidth.
 * @property {number} [frozenMarkerWidth=1] - Style of frozenMarkerWidth.
 * @property {string} [overflowY=auto] - When set to hidden, vertical scroll bar will be hidden.  When set to auto vertical scroll bar will appear when data overflows the height.  When set to scroll the vertical scrollbar will always be visible.
 * @property {string} [overflowX=auto] - When set to hidden, horizontal scroll bar will be hidden.  When set to auto horizontal scroll bar will appear when data overflows the width.  When set to scroll the horizontal scrollbar will always be visible.

 ['', 'normal'],
 */
// event docs go here
/**
 * Fires when the selection changes.
 * @event
 * @name canvasDatagrid#selectionchanged
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.selectedData Selected data.
 * @param {array} e.selections Selections object. 2D matrix of selections.
 * @param {rectangle} e.selectionBounds rectangle object describing the selection bounds.
 * @param {object} e.boundRowIndexMap Mapping of view data row to bound data row index.
 * @param {object} e.boundColumnIndexMap Mapping of view column order to bound column order.
 */
/**
 * Fires when the selected is deleted by pressing backspace or delete key.
 * @event
 * @name canvasDatagrid#afterdelete
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {array} e.cells Cells affected by the delete action. Each item in the array is a tuple of [rowIndex, columnIndex, boundRowIndex, boundColumnIndex].
 */
/**
 * Fires when the user clicks on the "drill in" arrow.  When the arrow is clicked a new
 * grid is created and nested inside of the row.  The grid, the row data and row index are passed
 * to the event listener.  From here you can manipulate the inner grid.  A grid is not disposed
 * when the tree is collapsed, just hidden, but grids are not created until the arrow is clicked.
 * @event
 * @name canvasDatagrid#expandtree
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.treeGrid New, or if reopened existing, grid.
 * @param {object} e.data The row's data.
 * @param {object} e.rowIndex The row index that was expanded.
 */
/**
 * Fires when the user click the "drill in" arrow on a row that is already expanded.
 * @event
 * @name canvasDatagrid#collapsetree
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.childGrid New, or if reopened existing, grid.
 * @param {object} e.data The row's data.
 * @param {object} e.rowIndex The row index that was expanded.
 */
/**
 * Fires when the user scrolls the grid.
 * @event
 * @name canvasDatagrid#scroll
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {number} e.top The new scroll top.
 * @param {number} e.left The new scroll left.
 */
/**
 * Fires when the data setter is set.
 * @event
 * @name canvasDatagrid#datachanged
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.data Data.
 */
/**
 * Fires when the schema setter is set.
 * @event
 * @name canvasDatagrid#schemachanged
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.schema Schema.
 */
/**
 * Fires when a mouseweel event occurs.
 * @event
 * @name canvasDatagrid#mousewheel
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native mouseweel event.
 */
/**
 * Fires when a copy is performed.
 * @event
 * @name canvasDatagrid#copy
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native copy event.
 */
/**
 * Fires when a copy is processing on a schema column. If you want to change headers of the copied data, this is the event to attach to.
 * Changing `column.title` or `column.name` will not change actual schema, it will just take effect and apply to the copied data.
 * @event
 * @name canvasDatagrid#copyonschema
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native copy event.
 * @param {object} e.column Current column object of schema.
 */
/**
 * Fires before a paste is performed.
 * @event
 * @name canvasDatagrid#beforepaste
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native paste event.
 */
/**
 * Fires after a paste is performed.
 * @event
 * @name canvasDatagrid#afterpaste
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {array} e.cells Cells affected by the paste action. Each item in the array is a tuple of [rowIndex, columnIndex, boundRowIndex, boundColumnIndex].
 */
/**
 * Fired just before a cell is drawn onto the canvas.  `e.preventDefault();` prevents the cell from being drawn.
 * You would only use this if you want to completely stop the cell from being drawn and generally muck up everything.
 * @event
 * @name canvasDatagrid#beforerendercell
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.header Current header object.
 */
/**
 * Fires when a cell is drawn.  If you want to change colors, sizes this is the event to attach to.
 * Changing the cell object's height and width is allowed.  Altering the context of the canvas is allowed.
 * Drawing on the canvas will probably be drawn over by the cell.
 * @event
 * @name canvasDatagrid#rendercell
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.header Current header object.
 * @param {canvasDatagrid.cell} e.cell Current cell.
 * @param {object} e.x The current cells x coordinate.
 * @param {object} e.y The current cells y coordinate.
 */
/**
 * Fires just after a cell is drawn.  If you want to draw things in the cell, this is the event to attach to.
 * Drawing on the canvas is allowed.  Altering the context of the canvas is allowed.
 * @event
 * @name canvasDatagrid#afterrendercell
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.header Current header object.
 * @param {canvasDatagrid.cell} e.cell Current cell.
 * @param {object} e.x The current cells x coordinate.
 * @param {object} e.y The current cells y coordinate.
 */
/**
 * Fires when text is drawn into a cell.  If you want to change the color of the text, this is the event to attach to.
 * To alter what text finally appears in the cell, change the value of `cell.formattedValue`.  Keep in mind this
 * text will still be subject to the ellipsis function that truncates text when the width is too long for the cell.
 * You cannot alter the cell's height or width from this event, use `rendercell` event instead.
 * @event
 * @name canvasDatagrid#rendertext
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.header Current header object.
 * @param {canvasDatagrid.cell} e.cell Current cell.
 * @param {object} e.x The current cells x coordinate.
 * @param {object} e.y The current cells y coordinate.
 */
/**
 * Fires when the order by arrow is drawn onto the canvas.  This is the only way
 * to completely replace the order arrow graphic.  Call `e.preventDefault()` to stop the default arrow from being drawn.
 * @event
 * @name canvasDatagrid#renderorderbyarrow
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.header Current header object.
 * @param {canvasDatagrid.cell} e.cell Current cell.
 * @param {object} e.x The current cells x coordinate.
 * @param {object} e.y The current cells y coordinate.
 */
/**
 * Fires when the tree arrow is drawn onto the canvas.  This is the only way
 * to completely replace the tree arrow graphic.  Call `e.preventDefault()` to stop the default arrow from being drawn.
 * @event
 * @name canvasDatagrid#rendertreearrow
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.header Current header object.
 * @param {canvasDatagrid.cell} e.cell Current cell.
 * @param {object} e.x The current cells x coordinate.
 * @param {object} e.y The current cells y coordinate.
 */
/**
 * Fires just after a cell grid calls its draw method.  Allows you to alter the cell data grid.
 * Only fires once per child grid.
 * @event
 * @name canvasDatagrid#rendercellgrid
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.header Current header object.
 * @param {canvasDatagrid.cell} e.cell Current cell.
 * @param {object} e.x The current cells x coordinate.
 * @param {object} e.y The current cells y coordinate.
 */
/**
 * Fires just before a cell grid is drawn giving you a chance to abort the drawing of the cell grid by calling e.preventDefault().
 * Only fires once per grid drawing.
 * @event
 * @name canvasDatagrid#beforerendercellgrid
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.header Current header object.
 * @param {canvasDatagrid.cell} e.cell Current cell.
 * @param {object} e.x The current cells x coordinate.
 * @param {object} e.y The current cells y coordinate.
 */
/**
 * Fires just before a cell grid is created giving you a chance to abort the creation of the cell grid by calling e.preventDefault().
 * You can alter cell grid instantiation arguments in this event as well.  Only fires once per grid creation.
 * @event
 * @name canvasDatagrid#beforecreatecellgrid
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.cellGridAttributes Mutable cell grid instantiation arguments.
 * @param {object} e.header Current header object.
 * @param {canvasDatagrid.cell} e.cell Current cell.
 * @param {object} e.x The current cells x coordinate.
 * @param {object} e.y The current cells y coordinate.
 */
/**
 * Fires just before a column is sorted.  Calling e.preventDefault will prevent sorting.  Used in conjunction with `grid.orderBy` and `grid.orderDirection` you can implement server side ordering while still using the native order by arrows.
 * @event
 * @name canvasDatagrid#beforesortcolumn
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.columnName Name of the column.
 * @param {object} e.direction Direction of the order.
 */
/**
 * Fires when a column is sorted.
 * @event
 * @name canvasDatagrid#sortcolumn
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.columnName Name of the column.
 * @param {object} e.direction Direction of the order.
 */
/**
 * Fires when the mouse moves over the grid.
 * @event
 * @name canvasDatagrid#mousemove
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDatagrid.cell} e.cell Cell under mouse.
 */
/**
 * Fires when a context menu is requested.  The menu item array can be altered to change what items appear on the menu.
 * You can add items to the context menu but they must conform to {@link canvasDatagrid.contextMenuItem}.
 * Removing all items from the list of menu items will cause the context menu to not appear.
 * Calling `e.preventDefault();` will cause the context menu to not appear as well.
 * @event
 * @name canvasDatagrid#contextmenu
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native contextmenu event.
 * @param {canvasDatagrid.cell} e.cell Cell under mouse.
 * @param {object} e.items[](#contextMenuItem) Mutable list of menu items.
 * @param {object} e.contextMenu Context menu HTML element.
 */
/**
 * An item in the context menu.
 * @name canvasDatagrid.contextMenuItem
 * @abstract
 * @class
 * @property {object} title The title that will appear in the context menu.  If title is a `string` then the string will appear.  If title is a `HTMLElement` then it will be appended via `appendChild()` to the context menu row maintaining any events and references.
 * @property {object} click Optional function to invoke when this context menu item is clicked.  Neglecting to call `e.stopPropagation();` in your function will result in the mouse event bubbling up to the canvas undesirably.
 */
/**
 * Fires just before edit is complete giving you a chance to validate the input.
 * `e.preventDefault();` will cause the edit to not end and row data will not be written back to the `data` array.
 * @event
 * @name canvasDatagrid#beforeendedit
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {canvasDatagrid.cell} e.cell Current cell.
 * @param {object} e.newValue New value.
 * @param {object} e.oldValue Old value.
 * @param {function} e.abort Abort edit function.  Call this function to abort the edit.
 * @param {object} e.input Textarea or input HTMLElement depending on `attributes.multiLine`.
 */
/**
 * Fires when the edit has ended.  This event gives you a chance to abort the edit
 * preserving original row data, or modify the value of the row data prior to being written.
 * @event
 * @name canvasDatagrid#endedit
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDatagrid.cell} e.cell Cell object.
 * @param {object} e.value New value.
 * @param {object} e.abort When true, the edit was aborted.
 * @param {object} e.input Textarea or input HTMLElement depending on `attributes.multiLine`.
 */
/**
 * Fires before a edit cell has been created giving you a chance to abort it.
 * `e.preventDefault();` will abort the edit cell from being created.
 * @event
 * @name canvasDatagrid#beforebeginedit
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {canvasDatagrid.cell} e.cell Cell object.
 */
/**
 * Fires when an editor textarea (or input) has been created.
 * @event
 * @name canvasDatagrid#beginedit
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDatagrid.cell} e.cell Cell object.
 * @param {object} e.input Textarea or input HTMLElement depending on `attributes.multiLine`.
 */
/**
 * Fires when the a touch event begins.
 * @event
 * @name canvasDatagrid#touchstart
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.NativeEvent Native touchstart event.
 * @param {canvasDatagrid.cell} e.cell Cell object.
 */
/**
 * Fires when the a touch event ends.
 * @event
 * @name canvasDatagrid#touchend
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDatagrid.cell} e.cell Last cell touched by point 0 prior to the touchend event being called.
 * @param {object} e.NativeEvent Native touchend event.
 */
/**
 * Fires when the a touch move event occurs.
 * @event
 * @name canvasDatagrid#touchmove
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDatagrid.cell} e.cell Cell being touched.
 * @param {object} e.NativeEvent Native touchmove event.
 */
/**
 * Fires just before a touch move event occurs allowing you to cancel the default behavior of touchmove.
 * @event
 * @name canvasDatagrid#beforetouchmove
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.NativeEvent Native touchmove event.
 */
/**
 * Fires when the a touch event is canceled.
 * @event
 * @name canvasDatagrid#touchcancel
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.NativeEvent Native touchcancel event.
 */
/**
 * Fires when the grid is clicked.
 * @event
 * @name canvasDatagrid#click
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDatagrid.cell} e.cell Cell object.
 */
/**
 * Fires when a column is about to be resized.
 * `e.preventDefault();` will abort the resize.
 * @event
 * @name canvasDatagrid#resizecolumn
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.x x pixel position of the resize.
 * @param {object} e.y y pixel position of the resize.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {canvasDatagrid.cell} e.cell The mutable cell to be resized.
 */
/**
 * Fires when the mouse button is pressed down on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDatagrid#mousedown
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native mousedown event.
 * @param {canvasDatagrid.cell} e.cell Cell object.
 */
/**
 * Fires when the mouse button is pressed down on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDatagrid#mouseup
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native mouseup event.
 * @param {canvasDatagrid.cell} e.cell Cell object.
 */
/**
 * Fires when the mouse button is double clicked on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * Note that this will necessarily require 2*`mousedown`, 2*`mouseup` and 2*`click` events to fire prior to the double click.
 * @event
 * @name canvasDatagrid#dblclick
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native dblclick event.
 * @param {canvasDatagrid.cell} e.cell Cell object.
 */
/**
 * Fires when the keyboard button is pressed down on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDatagrid#keydown
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native keydown event.
 * @param {canvasDatagrid.cell} e.cell Cell object.
 */
/**
 * Fires when the keyboard button is released on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDatagrid#keyup
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native keyup event.
 * @param {canvasDatagrid.cell} e.cell Cell object.
 */
/**
 * Fires when the keyboard press is completed on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDatagrid#keypress
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native keypress event.
 * @param {canvasDatagrid.cell} e.cell Cell object.
 */
/**
 * Fires when grid is being resized.
 * @event
 * @name canvasDatagrid#resize
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 */
/**
 * Fires when the mouse enters a cell.
 * @event
 * @name canvasDatagrid#cellmouseover
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDatagrid.cell} e.cell The cell being moved over.
 */
/**
 * Fires when the mouse exits a cell.
 * @event
 * @name canvasDatagrid#cellmouseout
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDatagrid.cell} e.cell The cell being moved out of.
 */
/**
 * Fires when the mouse enters a column.
 * @event
 * @name canvasDatagrid#columnmouseover
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDatagrid.cell} e.cell The cell being moved over.
 */
/**
 * Fires when the mouse exits a column.
 * @event
 * @name canvasDatagrid#columnmouseout
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDatagrid.cell} e.cell The cell being moved out of.
 */
/**
 * Fires when the mouse enters a row.
 * @event
 * @name canvasDatagrid#rowmouseover
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDatagrid.cell} e.cell The cell being moved over.
 */
/**
 * Fires when the mouse exits a row.
 * @event
 * @name canvasDatagrid#rowmouseout
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDatagrid.cell} e.cell The cell being moved out of.
 */
/**
 * Fires when a style has been changed.
 * @event
 * @name canvasDatagrid#stylechanged
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.styleName The name of the style being changed.
 * @param {object} e.styleValue The value of the style being changed.
 */
/**
 * Fires when an attribute has been changed.
 * @event
 * @name canvasDatagrid#attributechanged
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 */
/**
 * Fires as the user reorders a row or column.  Calling `e.preventDefault` will prevent the column from starting to be reordered.
 * @event
 * @name canvasDatagrid#reordering
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native mousemove event.
 * @param {cell} e.source The header cell of the column or row being reordered.
 * @param {cell} e.target The header cell of the column or row that the dragged row or column will be inserted onto.
 * @param {string} e.dragMode When dragging a column `column-reorder`, when dragging a row `row-reorder`.
 */
/**
 * Fires when the user finishes reordering a column or row.  Calling `e.preventDefault` will prevent the column from being reordered.
 * @event
 * @name canvasDatagrid#reorder
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native mousemove event.
 * @param {cell} e.source The header cell of the column or row being reordered.
 * @param {cell} e.target The header cell of the column or row that the dragged row or column will be inserted onto.
 * @param {string} e.dragMode When dragging a column `column-reorder`, when dragging a row `row-reorder`.
 */
/**
 * Fires when a selection begins to move.  Calling `e.preventDefault` will prevent the move from starting.
 * @event
 * @name canvasDatagrid#beginmove
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 */
/**
 * Fires when the mouse moves while moving a selection.  Calling `e.preventDefault` will prevent the move from occurring.
 * @event
 * @name canvasDatagrid#moving
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 */
/**
 * Fires when a selection moving selection is dropped.  Calling `e.preventDefault` will prevent the drop from occurring.
 * @event
 * @name canvasDatagrid#endmove
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 */
/**
 * Fires when a freeze cutter begins to move.  Calling `e.preventDefault` will prevent the move from starting.
 * @event
 * @name canvasDatagrid#beginfreezemove
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 */
/**
 * Fires when the mouse moves while moving a freeze cutter.  Calling `e.preventDefault` will prevent the freeze cutter from moving.
 * @event
 * @name canvasDatagrid#freezemoving
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 */
/**
 * Fires when a freeze cutter is dropped.  Calling `e.preventDefault` will prevent the drop from occurring.
 * @event
 * @name canvasDatagrid#endfreezemove
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 */
/**
 * Fires when the edit input is appended to the body.  This allows you to intercept the event and by calling `e.preventDefault` you can prevent the input from being appended to the body.  You can then append the input where you like.  The input is by default absolutely positioned to appear over the cell.  All styles are in-line.  You can alter anything you like, dimensions, appearance, parent node.  If you run `e.preventDefault`, and stop the input from being added to the body, make sure you append the input somewhere or you will not be able to use it.  When editing is complete the input will remove itself.
 * @event
 * @name canvasDatagrid#appendeditinput
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.input The edit input.  You're free to do what you will with it.  It will remove itself when editing is complete.
 */
/**
 * Fires when text is about to be formatted.  You can stop the default formatting function, text wrap, from occurring by calling `e.preventDefault`.  You might do this to improve performance on very long values (e.g.: lists of numbers not requiring formatting) or to replace the default formatting function with your own.  When preventing default it is important to populate the `e.cell.text` property with a text line array that looks like this `{ lines: [{value: "line 1" }, {value: "line 2" }] }`.  Each item in the array is assumed to fit the width of the cell.  The total number of lines is assumed to fit into the height of the cell.
 * @event
 * @name canvasDatagrid#formattext
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 */
