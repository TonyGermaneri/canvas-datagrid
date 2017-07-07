/**
 * Hierarchal canvas based data grid.
 * @class 
 * @name canvasDataGrid
 * @author Tony Germaneri (TonyGermaneri@gmail.com)
 * @param {object} args Parameters for the grid.
 * @param {object} args.parentNode HTML element that will hold the grid.
 * @param {object} [args.name] Optional value that will allow the saving of column height and row width settings to the browser's local store. This name should be unique to this grid.
 * @param {boolean} [args.tree=false] - When true, an arrow will be drawn on each row that when clicked raises the expandtree event for that row and creates an inner grid.
 * @param {boolean} [args.treeHorizontalScroll=false] - When true, expanded child grids will scroll horizontally with the parent columns. When false, when scrolling horizontally child grids will remain stationary. This does not impact vertical scrolling behavior.
 * @param {object} [args.childGridAttributes] - Attributes used for cell grids. These child grids are different than the tree grids. See the data property for more information about cell grids.
 * @param {boolean} [args.showNewRow=true] - When true, a row will appear at the bottom of the data set. schema[].defaultValue will define a default value for each cell. defaultValue can be a string or a function. When a function is used, the arguments header and index will be passed to the function. The value returned by the function will be the value in the new cell.
 * @param {boolean} [args.saveAppearance=true] - When true, and the attribute name is set, column and row sizes will be saved to the browser's localStore.
 * @param {boolean} [args.selectionFollowsActiveCell=false] - When true, moving the active cell with keystrokes will also change the selection.
 * @param {boolean} [args.multiLine=false] - When true, edit cells will be textareas, when false edit cells will be inputs.
 * @param {boolean} [args.globalRowResize=false] - When true, resizing a row will resize all rows to the same height. Questionable compatibility with hierarchical views.
 * @param {boolean} [args.editable=true] - When true cells can be edited. When false, grid is read only to the user.
 * @param {boolean} [args.allowColumnReordering=true] - When true columns can be reordered.
 * @param {boolean} [args.allowRowReordering=false] - When true rows can be reordered.
 * @param {boolean} [args.allowSorting=true] - Allow user to sort rows by clicking on column headers.
 * @param {boolean} [args.showFilter=true] - When true, filter will be an option in the context menu.
 * @param {number} [args.pageUpDownOverlap=1] - Amount of rows to overlap when pageup/pagedown is used.
 * @param {boolean} [args.persistantSelectionMode=false] - When true, selections will behave as if the command/control key is held down at all times.
 * @param {boolean} [args.rowSelectionMode=false] - When true, clicking on any cell will select the entire row that cell belongs to.
 * @param {boolean} [args.autoResizeColumns=false] - When true, all columns will be automatically resized to fit the data in them. Warning! Expensive for large (>100k ~2 seconds) datasets.
 * @param {boolean} [args.allowRowHeaderResize=true] - When true, the user can resize the width of the row headers.
 * @param {boolean} [args.allowColumnResize=true] - When true, the user can resize the width of the columns.
 * @param {boolean} [args.allowRowResize=true] - When true, the user can resize the row headers increasing the height of the row.
 * @param {boolean} [args.allowRowResizeFromCell=false] - When true, the user can resize the height of the row from the border of the cell.
 * @param {boolean} [args.allowColumnResizeFromCell=false] - When true, the user can resize the width of the column from the border of the cell.
 * @param {boolean} [args.showPerformance=false] - When true, the amount of time taken to draw the grid is shown.
 * @param {boolean} [args.debug=false] - When true, debug info will be drawn on top of the grid.
 * @param {number} [args.borderResizeZone=10] - Number of pixels in total around a border that count as resize zones.
 * @param {boolean} [args.showHeaders=true] - When true, headers are shown.
 * @param {boolean} [args.showRowNumbers=true] - When true, row numbers are shown in the row headers.
 * @param {boolean} [args.showRowHeaders=true] - When true, row headers are shown.
 * @param {boolean} [args.reorderDeadZone=3] - Number of pixels needed to move before column reordering occurs.
 * @param {boolean} [args.showClearSettingsOption=true] - Show an option on the context menu to clear saved settings.
 * @param {boolean} [args.clearSettingsOptionText='Clear saved settings'] - Text that appears on the clear settings option.
 * @param {boolean} [args.showOrderByOptionTextDesc='Order by %s ascending'] - Text that appears on the order by descending option.
 * @param {boolean} [args.showOrderByOptionTextAsc='Order by %s desc'] - Text that appears on the order by ascending option.
 * @param {boolean} [args.showOrderByOption=true] - Show an option on the context menu sort rows.
 * @param {boolean} [args.schema=[]] - Sets the schema. See {@tutorial schema}.
 * @param {boolean} [args.data=[]] - Sets the data. See {@tutorial data}.
 * @param {boolean} [args.touchReleaseAnimationDurationMs=1000] - How long the ease animation runs after touch release.
 * @param {boolean} [args.touchReleaseAcceleration=30] - How many times the detected pixel per inch touch swipe is multiplied on release.  Higher values mean more greater touch release movement.
 * @param {boolean} [args.touchDeadZone=3] - How many pixels a touch must move within `attributes.touchSelectTimeMs` to be considered scrolling rather than selecting.
 * @param {boolean} [args.touchSelectTimeMs=800] - How many milliseconds of touching without moving greater than `attributes.touchDeadZone` before a touch is considered selecting instead of scrolling.
 * @param {boolean} [args.touchSelectTimeMs=800] - How many milliseconds of touching without moving greater than `attributes.touchDeadZone` before a touch is considered selecting instead of scrolling.
 * @param {boolean} [args.touchScrollZone=40] - When touching, the scroll element hit boxes are increased by this number of pixels for easier touching.
 * @param {canvasDataGrid.style} [args.style={}] - Sets all style values overriding all defaults. Unless you're replacing 100% of the styles, don't use this property. See style property below.
 * @property {array} selectedRows - Selected rows.  Looks just like the data you passed in, but filtered for the rows the user has cells selected in.  If any cell in the row is selected, all data for that row will appear in this array.
 * @property {array} selectedCells - Jagged array of cells that the user has selected.  Beware that because this is a jagged array, some indexes will be `null`.  Besides the `null`s this data looks just like the data you passed in, but just the cells the user has selected.  So if the user has selected cell 10 in a 10 column row, there will be 9 `null`s followed by the data from column 10.
 * @property {array} changes - Array of changes and additions made to the grid since last time data was loaded.  The data property will change with changes as well, but this is a convince list of all the changes in one spot.  Calling `clearChangeLog` will clear this list.
 * @property {object} input - Reference to the the edit cell when editing.  Undefined when not editing.
 * @property {object} controlInput - Input used for key controls on the grid.  Any clicks on the grid will cause this input to be focused.  This input is hidden behind the canvas.
 * @property {cell} currentCell - Convenience object that represents the object that the mouse moved over last.
 * @property {number} height - Height of the grid.
 * @property {number} width - Width of the grid.
 * @property {array} visibleCells - Array of cell drawn.
 * @property {array} visibleRows - Array of visible row indexes.
 * @property {array} selections - Matrix array of selected cells.
 * @property {object} selectionBounds - object, bounds of current selection.
 * @property {object} attributes - Object that contains the properties listed in the attributes section.
 * @property {object} sizes - Mutable object that contains `sizes.columns` and `sizes.rows` arrays.  These arrays control the sizes of the columns and rows.  If there is not an entry for the row or column index it will fall back to the style default.
 * @property {canvasDatagrid.style} style - Object that contains the properties listed in the style section.  Changing a style will automatically call `draw`.
 * @property {string} dragMode - Represents the currently displayed resize cursor.  Can be `ns-resize`, `ew-resize`, `pointer`, or `inherit`.
 * @property {canvasDatagrid.formatters} formatters - Object that contains a list of formatting functions for displaying text.  The properties in this object match the `schema[].type` property.  For example, if the schema for a given column was of the type `date` the grid would look for a formatter called `formatters.date` if a formatter cannot be found for a given data type a warning will be logged and the string formatter will be used. Formatters must return a string value to be displayed in the cell.
 * @property {canvasDatagrid.sorters} sorters - Object that contains a list of sorting functions for sorting columns.
 * @property {canvasDatagrid.filters} filters - Object that contains a list of filters for filtering data.  The properties in this object match the `schema[].type` property.  For example, if the schema for a given column was of the type `date` the grid would look for a filter called `filters.date` if a filter cannot be found for a given data type a warning will be logged and the string/RegExp filter will be used.
 * @property {canvasDatagrid.data} data - This is how data is set in the grid.  Data must be an array of objects that conform to a schema.  Data values can be any primitive type.  However if a cell value is another data array, a child grid will be rendered into the cell.  This child grid is different than a tree view grid and uses the `childGridAttributes` attribute for properties and styling.
 * @property {canvasDatagrid.schema} schema - Schema is optional.  Schema is an array of column objects.  If no schema is provided one will be generated from the data, in that case all data will be assumed to be string data.
 * @property {number} scrollHeight - The total number of pixels that can be scrolled down.
 * @property {number} scrollWidth - The total number of pixels that can be scrolled to the left.
 * @property {number} scrollTop - The number of pixels that have been scrolled down.
 * @property {number} scrollLeft - The number of pixels that have been scrolled to the left.
 * @property {number} offsetTop - The offset top of the grid.
 * @property {number} offsetLeft - The offset left of the grid.
 * @property {object} parentNode - The grid's parent HTML node.
 * @property {boolean} isChildGrid - When true, this grid is a child grid of another grid.
 * @property {boolean} openChildren - List of open child grids by internal unique row id.
 * @property {boolean} childGrids - Child grids in this grid organized by internal unique row id.
 * @property {number} height - Gets or sets the height of the grid.
 * @property {number} width - Gets or sets the width of the grid.
 * @property {canvasDatagrid} parentGrid - If this grid is a child grid, this is the grids parent.
 * @property {object} canvas - The canvas element drawn onto for this grid.
 */
// supporting classes go here
 /**
 * A selection rectangle.
 * @abstract
 * @class
 * @name canvasDataGrid.rect
 * @property {number} top - First row index.
 * @property {number} bottom - Last row index.
 * @property {number} left - First column index.
 * @property {number} right - Last column index.
 */
 /**
 * A cell on the grid.
 * @abstract
 * @class
 * @name canvasDataGrid.cell
 * @property {string} type - Data type used by this cell as dictated by the column.
 * @property {string} style - Visual style of cell. Can be any one of cell, activeCell, headerCell, cornerCell, or rowHeaderCell. Prefix of each style name.
 * @property {number} x - The x coordinate of this cell on the canvas.
 * @property {number} y - The y coordinate of this cell on the canvas.
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
 * @property {string} value - The value of the cell.
 * @property {string} formattedValue - The value after passing through any formatters.
 */
/**
 * Styles for the canvas data grid.
 * @class
 * @name canvasDataGrid.style
 * @property {number} [maxEllipsisLength=250] - Override value for maxEllipsisLength.
 * @property {number} [treeArrowClickRadius=5] - Override value for treeArrowClickRadius.
 * @property {number} [treeGridHeight=250] - Override value for treeGridHeight.
 * @property {number} [treeArrowHeight=8] - Override value for treeArrowHeight.
 * @property {number} [treeArrowWidth=13] - Override value for treeArrowWidth.
 * @property {string} [treeArrowColor=rgba(155, 155, 155, 1)] - Override value for treeArrowColor.
 * @property {string} [treeArrowBorderColor=rgba(195, 199, 202, 1)] - Override value for treeArrowBorderColor.
 * @property {number} [treeArrowBorderWidth=1] - Override value for treeArrowBorderWidth.
 * @property {number} [treeArrowMarginRight=5] - Override value for treeArrowMarginRight.
 * @property {number} [treeArrowMarginLeft=0] - Override value for treeArrowMarginLeft.
 * @property {number} [treeArrowMarginTop=6] - Override value for treeArrowMarginTop.
 * @property {number} [scrollBarWidth=14] - Override value for scrollBarWidth.
 * @property {number} [scrollDivOverlap=0.7] - Override value for scrollDivOverlap.
 * @property {string} [filterTextPrefix=(filtered)] - Override value for filterTextPrefix.
 * @property {string} [editCellFontSize=16px] - Override value for editCellFontSize.
 * @property {string} [editCellFontFamily=sans-serif] - Override value for editCellFontFamily.
 * @property {string} [editCellPaddingLeft=4.5] - Override value for editCellPaddingLeft.
 * @property {string} [contextMenuStyleSheet] - Override value for contextMenuStyleSheet.
 * @property {string} [contextMenuItemMargin=2px] - Override value for contextMenuItemMargin.
 * @property {string} [contextMenuItemBorderRadius=3px] - Override value for contextMenuItemBorderRadius.
 * @property {string} [contextMenuLabelDisplay=inline-block] - Override value for contextMenuLabelDisplay.
 * @property {string} [contextMenuLabelMinWidth=75px] - Override value for contextMenuLabelMinWidth.
 * @property {string} [contextMenuLabelMaxWidth=700px] - Override value for contextMenuLabelMaxWidth.
 * @property {string} [contextMenuHoverBackground=rgba(182, 205, 250, 1)] - Override value for contextMenuHoverBackground.
 * @property {string} [contextMenuColor=rgba(43, 48, 43, 1)] - Override value for contextMenuColor.
 * @property {string} [contextMenuHoverColor=rgba(43, 48, 153, 1)] - Override value for contextMenuHoverColor.
 * @property {string} [contextMenuFontSize=16px] - Override value for contextMenuFontSize.
 * @property {string} [contextMenuFontFamily=sans-serif] - Override value for contextMenuFontFamily.
 * @property {string} [contextMenuBackground=rgba(222, 227, 233, 0.94)] - Override value for contextMenuBackground.
 * @property {string} [contextMenuBorder=solid 1px rgba(158, 163, 169, 1)] - Override value for contextMenuBorder.
 * @property {string} [contextMenuPadding=2px] - Override value for contextMenuPadding.
 * @property {string} [contextMenuBorderRadius=3px] - Override value for contextMenuBorderRadius.
 * @property {string} [contextMenuOpacity=0.98] - Override value for contextMenuOpacity.
 * @property {string} [contextMenuFilterInvalidExpresion=rgba(237, 155, 156, 1)] - Override value for contextMenuFilterInvalidExpresion.
 * @property {string} [contextMenuMarginTop=15] - Override value for contextMenuMarginTop.
 * @property {string} [contextMenuMarginLeft=5] - Override value for contextMenuMarginLeft.
 * @property {string} [autosizePadding=5] - Override value for autosizePadding.
 * @property {number} [minHeight=250] - Override value for minHeight.
 * @property {number} [minRowHeight=24] - Override value for minRowHeight.
 * @property {number} [minColumnWidth=10] - Override value for minColumnWidth.
 * @property {number} [columnWidth=250] - Override value for columnWidth.
 * @property {string} [backgroundColor=rgba(240, 240, 240, 1)] - Override value for backgroundColor.
 * @property {number} [headerOrderByArrowHeight=8] - Override value for headerOrderByArrowHeight.
 * @property {number} [headerOrderByArrowWidth=13] - Override value for headerOrderByArrowWidth.
 * @property {string} [headerOrderByArrowColor=rgba(185, 185, 185, 1)] - Override value for headerOrderByArrowColor.
 * @property {string} [headerOrderByArrowBorderColor=rgba(195, 199, 202, 1)] - Override value for headerOrderByArrowBorderColor.
 * @property {number} [headerOrderByArrowBorderWidth=1] - Override value for headerOrderByArrowBorderWidth.
 * @property {number} [headerOrderByArrowMarginRight=5] - Override value for headerOrderByArrowMarginRight.
 * @property {number} [headerOrderByArrowMarginLeft=0] - Override value for headerOrderByArrowMarginLeft.
 * @property {number} [headerOrderByArrowMarginTop=6] - Override value for headerOrderByArrowMarginTop.
 * @property {number} [cellHeight=24] - Override value for cellHeight.
 * @property {string} [cellFont=16px sans-serif] - Override value for cellFont.
 * @property {number} [cellPaddingTop=5] - Override value for cellPaddingTop.
 * @property {number} [cellPaddingLeft=5] - Override value for cellPaddingLeft.
 * @property {number} [cellPaddingRight=7] - Override value for cellPaddingRight.
 * @property {string} [cellAlignment=left] - Override value for cellAlignment.
 * @property {string} [cellColor=rgba(0, 0, 0, 1)] - Override value for cellColor.
 * @property {string} [cellBackgroundColor=rgba(240, 240, 240, 1)] - Override value for cellBackgroundColor.
 * @property {string} [cellHoverColor=rgba(0, 0, 0, 1)] - Override value for cellHoverColor.
 * @property {string} [cellHoverBackgroundColor=rgba(240, 240, 240, 1)] - Override value for cellHoverBackgroundColor.
 * @property {string} [cellSelectedColor=rgba(43, 48, 153, 1)] - Override value for cellSelectedColor.
 * @property {string} [cellSelectedBackgroundColor=rgba(182, 205, 250, 1)] - Override value for cellSelectedBackgroundColor.
 * @property {number} [cellBorderWidth=0.5] - Override value for cellBorderWidth.
 * @property {string} [cellBorderColor=rgba(195, 199, 202, 1)] - Override value for cellBorderColor.
 * @property {string} [activeCellFont=16px sans-serif] - Override value for activeCellFont.
 * @property {number} [activeCellPaddingTop=5] - Override value for activeCellPaddingTop.
 * @property {number} [activeCellPaddingLeft=5] - Override value for activeCellPaddingLeft.
 * @property {number} [activeCellPaddingRight=7] - Override value for activeCellPaddingRight.
 * @property {number} [activeCellAlignment=left] - Override value for activeCellAlignment.
 * @property {string} [activeCellColor=rgba(43, 48, 153, 1)] - Override value for activeCellColor.
 * @property {string} [activeCellBackgroundColor=rgba(111, 160, 255, 1)] - Override value for activeCellBackgroundColor.
 * @property {string} [activeCellHoverColor=rgba(43, 48, 153, 1)] - Override value for activeCellHoverColor.
 * @property {string} [activeCellHoverBackgroundColor=rgba(110, 168, 255, 1)] - Override value for activeCellHoverBackgroundColor.
 * @property {string} [activeCellSelectedColor=rgba(43, 48, 153, 1)] - Override value for activeCellSelectedColor.
 * @property {string} [activeCellSelectedBackgroundColor=rgba(110, 168, 255, 1)] - Override value for activeCellSelectedBackgroundColor.
 * @property {number} [activeCellBorderWidth=0.5] - Override value for activeCellBorderWidth.
 * @property {string} [activeCellBorderColor=rgba(151, 173, 190, 1)] - Override value for activeCellBorderColor.
 * @property {number} [headerCellPaddingTop=5] - Override value for headerCellPaddingTop.
 * @property {number} [headerCellPaddingLeft=5] - Override value for headerCellPaddingLeft.
 * @property {number} [headerCellPaddingRight=7] - Override value for headerCellPaddingRight.
 * @property {number} [headerCellHeight=25] - Override value for headerCellHeight.
 * @property {number} [headerCellBorderWidth=0.5] - Override value for headerCellBorderWidth.
 * @property {string} [headerCellBorderColor=rgba(172, 175, 179, 1)] - Override value for headerCellBorderColor.
 * @property {string} [headerCellFont=16px sans-serif] - Override value for headerCellFont.
 * @property {string} [headerCellColor=rgba(50, 50, 50, 1)] - Override value for headerCellColor.
 * @property {string} [headerCellBackgroundColor=rgba(222, 227, 233, 1)] - Override value for headerCellBackgroundColor.
 * @property {string} [headerCellHoverColor=rgba(43, 48, 153, 1)] - Override value for headerCellHoverColor.
 * @property {string} [headerCellHoverBackgroundColor=rgba(235, 235, 235, 1)] - Override value for headerCellHoverBackgroundColor.
 * @property {number} [headerRowWidth=57] - Override value for headerRowWidth.
 * @property {number} [rowHeaderCellPaddingTop=5] - Override value for rowHeaderCellPaddingTop.
 * @property {number} [rowHeaderCellPaddingLeft=5] - Override value for rowHeaderCellPaddingLeft.
 * @property {number} [rowHeaderCellPaddingRight=7] - Override value for rowHeaderCellPaddingRight.
 * @property {number} [rowHeaderCellHeight=25] - Override value for rowHeaderCellHeight.
 * @property {number} [rowHeaderCellBorderWidth=0.5] - Override value for rowHeaderCellBorderWidth.
 * @property {string} [rowHeaderCellBorderColor=rgba(172, 175, 179, 1)] - Override value for rowHeaderCellBorderColor.
 * @property {string} [rowHeaderCellFont=16px sans-serif] - Override value for rowHeaderCellFont.
 * @property {string} [rowHeaderCellColor=rgba(50, 50, 50, 1)] - Override value for rowHeaderCellColor.
 * @property {string} [rowHeaderCellBackgroundColor=rgba(222, 227, 233, 1)] - Override value for rowHeaderCellBackgroundColor.
 * @property {string} [rowHeaderCellHoverColor=rgba(43, 48, 153, 1)] - Override value for rowHeaderCellHoverColor.
 * @property {string} [rowHeaderCellHoverBackgroundColor=rgba(235, 235, 235, 1)] - Override value for rowHeaderCellHoverBackgroundColor.
 * @property {string} [rowHeaderCellSelectedColor=rgba(43, 48, 153, 1)] - Override value for rowHeaderCellSelectedColor.
 * @property {string} [rowHeaderCellSelectedBackgroundColor=rgba(182, 205, 250, 1)] - Override value for rowHeaderCellSelectedBackgroundColor.
 * @property {number} [scrollBarWidth=14] - Override value for scrollBarWidth.
 * @property {number} [cellAutoResizePadding=13] - Override value for cellAutoResizePadding.
 * @property {string} [scrollBarBackgroundColor=rgba(240, 240, 240, 1)] - Override value for scrollBarBackgroundColor.
 * @property {string} [scrollBarBoxColor=rgba(192, 192, 192, 1)] - Override value for scrollBarBoxColor.
 * @property {string} [scrollBarActiveColor=rgba(125, 125, 125, 1)] - Override value for scrollBarActiveColor.
 * @property {number} [scrollBarBoxWidth=8] - Override value for scrollBarBoxWidth.
 * @property {number} [scrollBarBoxMargin=2] - Override value for scrollBarBoxMargin.
 * @property {number} [scrollBarBoxBorderRadius=3] - Override value for scrollBarBoxBorderRadius.
 * @property {string} [scrollBarBorderColor=rgba(202, 202, 202, 1)] - Override value for scrollBarBorderColor.
 * @property {number} [scrollBarBorderWidth=0.5] - Override value for scrollBarBorderWidth.
 * @property {number} [scrollBarWidth=10] - Override value for scrollBarWidth.
 * @property {string} [scrollBarCornerBorderColor=rgba(202, 202, 202, 1)] - Override value for scrollBarCornerBorderColor.
 * @property {string} [scrollBarCornerBackground=rgba(240, 240, 240, 1)] - Override value for scrollBarCornerBackground.
 * @property {number} [scrollBarBoxMinSize=15] - Override value for scrollBarBoxMinSize.
 * @property {string} [activeCellOverlayBorderColor=rgba(66, 133, 244, 1)'] - Override value for activeCellOverlayBorderColor.
 * @property {number} [activeCellOverlayBorderWidth=2] - Override value for activeCellOverlayBorderWidth.
 * @property {string} [selectionOverlayBorderColor=rgba(66, 133, 244, 1)'] - Override value for selectionOverlayBorderColor.
 * @property {number} [selectionOverlayBorderWidth=1.25] - Override value for selectionOverlayBorderWidth.
 * @property {string} [editCellBoxShadow=0 2px 5px rgba(0,0,0,0.4)] - Override value for editCellBoxShadow.
 * @property {string} [editCellBorder=solid 1px rgba(110, 168, 255, 1)] - Override value for editCellBorder.
 * @property {string} [gridBorderColor=rgba(202, 202, 202, 1)] - Override value for gridBorderColor.
 * @property {string} [gridBorderWidth=1] - Override value for gridBorderWidth.
 * @property {string} [truncateWhiteSpace=nowrap] - Override value for truncateWhiteSpace.
 * @property {string} [trucateOverflow=hidden] - Override value for trucateOverflow.
 * @property {string} [truncateTextOverflow=ellipsis] - Override value for truncateTextOverflow.
 * @property {string} [truncateVerticalAlign=bottom] - Override value for truncateVerticalAlign.
 */
 // event docs go here
 /**
 * Fires when the selection changes.
 * @event
 * @name canvasDataGrid#selectionchanged
 * @param {object} data Selected data.
 * @param {array} matrix Selections object. 2D matrix of selections.
 * @param {rectangle} bounds rectangle object describing the selection bounds.
 */
 /**
 * Fires when the selection changes.
 * @event
 * @name canvasDataGrid#selectionchanged
 * @param {object} data Selected data.
 * @param {array} matrix Selections object. 2D matrix of selections.
 * @param {rectangle} bounds rectangle object describing the selection bounds.
 */
 /**
 * Fires when the selection changes.
 * @event
 * @name canvasDataGrid#selectionchanged
 * @param {object} data Selected data.
 * @param {object} matrix Selections object.  2D matrix of selections.
 * @param {object} bounds `Rectangle` object describing the selection bounds.
 */
 /**
 * Fires when the user clicks on the "drill in" arrow.  When the arrow is clicked a new
 * grid is created and nested inside of the row.  The grid, the row data and row index are passed
 * to the event listener.  From here you can manipulate the inner grid.  A grid is not disposed
 * when the tree is collapsed, just hidden, but grids are not created until the arrow is clicked.
 * @event
 * @name canvasDataGrid#expandtree
 * @param {object} grid New, or if reopened existing, grid.
 * @param {object} data The row's data.
 * @param {object} rowIndex The row index that was expanded.
 */
 /**
 * Fires when the user click the "drill in" arrow on a row that is already expanded.
 * @event
 * @name canvasDataGrid#collapsetree
 * @param {object} grid New, or if reopened existing, grid.
 * @param {object} data The row's data.
 * @param {object} rowIndex The row index that was expanded.
 */
 /**
 * Fires when the user scrolls the grid.
 * @event
 * @name canvasDataGrid#scroll
 */
 /**
 * Fires when the data setter is set.
 * @event
 * @name canvasDataGrid#datachanged
 * @param {object} data Data.
 */
 /**
 * Fires when the schema setter is set.
 * @event
 * @name canvasDataGrid#schemachanged
 * @param {object} schema Schema.
 */
 /**
 * Fired just before a cell is drawn onto the canvas.  `e.preventDefault();` prevents the cell from being drawn.
 * You would only use this if you want to completely stop the cell from being drawn and generally muck up everything.
 * @event
 * @name canvasDataGrid#beforerendercell
 * @param {object} e Event object
 * @param {object} ctx Canvas context.
 * @param {object} value Current cell value.
 * @param {object} row Current row data.
 * @param {object} header Current header object.
 * @param {object} x The current cells x coordinate.
 * @param {object} y The current cells y coordinate.
 */
 /**
 * Fires when a cell is drawn.  If you want to change colors, sizes this is the event to attach to.
 * Changing the cell object's height and width is allowed.  Altering the context of the canvas is allowed.
 * Drawing on the canvas will probably be drawn over by the cell.
 * @event
 * @name canvasDataGrid#rendercell
 * @param {object} ctx Canvas context.
 * @param {object} [cell](#cell) Current cell.
 */
 /**
 * Fires just after a cell is drawn.  If you want to draw things in the cell, this is the event to attach to.
 * Drawing on the canvas is allowed.  Altering the context of the canvas is allowed.
 * @event
 * @name canvasDataGrid#afterrendercell
 * @param {object} ctx Canvas context.
 * @param {object} [cell](#cell) Current cell.
 */
 /**
 * Fires when text is drawn into a cell.  If you want to change the color of the text, this is the event to attach to.
 * To alter what text finally appears in the cell, change the value of `cell.formattedValue`.  Keep in mind this
 * text will still be subject to the ellipsis function that truncates text when the width is too long for the cell.
 * You cannot alter the cell's height or width from this event, use `rendercell` event instead.
 * @event
 * @name canvasDataGrid#rendertext
 * @param {object} ctx Canvas context.
 * @param {object} [cell](#cell) Current cell.
 */
 /**
 * Fires when the order by arrow is drawn onto the canvas.  This is the only way
 * to completely replace the order arrow graphic.  Call `e.preventDefault()` to stop the default arrow from being drawn.
 * @event
 * @name canvasDataGrid#renderorderbyarrow
 * @param {object} e Event object
 * @param {object} ctx Canvas context.
 * @param {object} [cell](#cell) Current cell.
 */
 /**
 * Fires when the tree arrow is drawn onto the canvas.  This is the only way
 * to completely replace the tree arrow graphic.  Call `e.preventDefault()` to stop the default arrow from being drawn.
 * @event
 * @name canvasDataGrid#rendertreearrow
 * @param {object} e Event object
 * @param {object} ctx Canvas context.
 * @param {object} [cell](#cell) Current cell.
 */
 /**
 * Fires when a cell grid is instantiated.  Allows you to alter the cell data grid.
 * Only fires once per grid.
 * @event
 * @name canvasDataGrid#rendercellgrid
 * @param {object} ctx Canvas context.
 * @param {object} [cell](#cell) Current cell.
 * @param {object} grid Cell data grid.
 */
 /**
 * Fires when a column is reordered.
 * @event
 * @name canvasDataGrid#ordercolumn
 * @param {object} columnName Name of the column.
 * @param {object} direction Direction of the order.
 */
 /**
 * Fires when the mouse moves over the grid.
 * @event
 * @name canvasDataGrid#mousemove
 * @param {object} 0 Mouse event.
 * @param {object} 1 Cell under mouse.
 */
 /**
 * Fires when a context menu is requested.  The menu item array can be altered to change what items appear on the menu.
 * You can add items to the context menu but they must conform to {@link canvasDataGrid.contextMenuItem}. 
 * Removing all items from the list of menu items will cause the context menu to not appear.
 * Calling `e.preventDefault();` will cause the context menu to not appear as well.
 * @event
 * @name canvasDataGrid#contextmenu
 * @param {object} 0 Mouse event.
 * @param {object} 1 Cell under mouse.
 * @param {object} 2 Mutable list of menu items.
 * @param {object} 3 Context menu HTML element.
 */

 /**
 * An item in the context menu.
 * @name canvasDataGrid.contextMenuItem
 * @abstract
 * @class
 * @property {object} Property Description
 * @property {object} title The title that will appear in the context menu.  If title is a `string` then the string will appear.  If title is a `HTMLElement` then it will be appended via `appendChild()` to the context menu row maintaining any events and references.
 * @property {object} click Optional function to invoke when this context menu item is clicked.  Neglecting to call `e.stopPropagation();` in your function will result in the mouse event bubbling up to the canvas undesirably.
  */

 /**
 * Fires just before edit is complete giving you a chance to validate the input.
 * `e.preventDefault();` will cause the edit to not end and row data will not be written back to the `data` array.
 * @event
 * @name canvasDataGrid#beforeendedit
 * @param {object} e Event object.
 * @param {object} [cell](#cell) Cell object.
 * @param {object} value New value.
 * @param {object} originalValue Original value.
 * @param {object} abort Abort edit function.  Call this function to abort the edit.
  * @param {object} textarea Textarea or input HTMLElement depending on `attributes.multiLine`.
 */
 /**
 * Fires when the edit has ended.  This event gives you a chance to abort the edit
 * preserving original row data, or modify the value of the row data prior to being written.
 * @event
 * @name canvasDataGrid#endedit
 * @param {object} e Event object.
 * @param {object} [cell](#cell) Cell object.
 * @param {object} value New value.
 * @param {object} abort When true, the edit was aborted.
  * @param {object} textarea Textarea HTMLElement.
 */
 /**
 * Fires before a edit cell has been created giving you a chance to abort it.
 * `e.preventDefault();` will abort the edit cell from being created.
 * @event
 * @name canvasDataGrid#beforebeginedit
 * @param {object} e Event object.
 * @param {object} [cell](#cell) Cell object.
 */
 /**
 * Fires when an editor textarea (or input) has been created.
 * @event
 * @name canvasDataGrid#beginedit
 * @param {object} [cell](#cell) Cell object.
 * @param {object} textarea Textarea HTMLElement.
 */
 /**
 * Fires when the grid is clicked.
 * @event
 * @name canvasDataGrid#click
 * @param {object} e Mouse event.
 * @param {object} [cell](#cell) Cell object.
 */
 /**
 * Fires when a column is about to be resized.
 * `e.preventDefault();` will abort the resize.
 * @event
 * @name canvasDataGrid#resizecolumn
 * @param {object} e Event object.
 * @param {object} x x pixel position of the resize.
 * @param {object} y y pixel position of the resize.
 * @param {object} [cell](#cell) The mutable cell to be resized.
 */
 /**
 * Fires when the mouse button is pressed down on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDataGrid#mousedown
 * @param {object} e Mouse event.
 * @param {object} [cell](#cell) Cell object.
 */
 /**
 * Fires when the mouse button is pressed down on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDataGrid#mouseup
 * @param {object} e Mouse event.
 * @param {object} [cell](#cell) Cell object.
 */
 /**
 * Fires when the mouse button is double clicked on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * Note that this will necessarily require 2*`mousedown`, 2*`mouseup` and 2*`click` events to fire prior to the double click.
 * @event
 * @name canvasDataGrid#dblclick
 * @param {object} e Mouse event.
 * @param {object} [cell](#cell) Cell object.
 */
 /**
 * Fires when the keyboard button is pressed down on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDataGrid#keydown
 * @param {object} e Key event.
 * @param {object} [cell](#cell) Cell object.
 */
 /**
 * Fires when the keyboard button is released on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDataGrid#keyup
 * @param {object} e Key event.
 * @param {object} [cell](#cell) Cell object.
 */
 /**
 * Fires when the keyboard press is completed on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDataGrid#keypress
 * @param {object} e Key event.
 * @param {object} [cell](#cell) Cell object.
 */
 /**
 * Fires when grid is being resized.
 * @event
 * @name canvasDataGrid#resize
 * @param {object} e Resize events.
 */
  /**
 * Fires when the mouse enters a cell.
 * @event
 * @name canvasDataGrid#cellmouseover
 * @param {object} e mouse move event.
 * @param {cell} cell Cell that has been moved over.
 */
  /**
 * Fires when the mouse exits a cell.
 * @event
 * @name canvasDataGrid#cellmouseout
 * @param {object} e mouse move event.
 * @param {cell} cell Cell that has been moved out of.
 */
  /**
 * Fires as the user reorders a row or column.  Calling `e.preventDefault` will prevent the column from starting to be reordered.
 * @event
 * @name canvasDataGrid#reordering
 * @param {object} e mouse move event.
 * @param {cell} source The header cell of the column or row being reordered.
 * @param {cell} target The header cell of the column or row that the dragged row or column will be inserted onto.
 * @param {string} dragMode When dragging a column `column-reorder`, when dragging a row `row-reorder`.
 */
  /**
 * Fires when the user finishes reordering a column or row.  Calling `e.preventDefault` will prevent the column from being reordered.
 * @event
 * @name canvasDataGrid#reorder
 * @param {object} e mouse move event.
 * @param {cell} source The header cell of the column or row being reordered.
 * @param {cell} target The header cell of the column or row that the dragged row or column will be inserted onto.
 * @param {string} dragMode When dragging a column `column-reorder`, when dragging a row `row-reorder`.
 */
