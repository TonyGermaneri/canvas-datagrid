/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, requestAnimationFrame: false, performance: false, btoa: false*/
(window.define || function defineStub(a, b) {
    'use strict';
    window.canvasDatagrid = b();
    return;
})([], function context() {
    'use strict';
// module ("class") attributes and properties docs go here
/**
 * Hierarchal canvas based data grid.
 * @see do not use the new keyword when instantiating.
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
 * @param {boolean} [args.allowColumnReordering=true] - When true columns can be reordered. NOT IMPLEMENTED.
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
 * @param {boolean} [args.schema=[]] - Sets the schema. See {@tutorial schema}.
 * @param {boolean} [args.data=[]] - Sets the data. See {@tutorial data}.
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
 * @property {string} resizeMode - Represents the currently displayed resize cursor.  Can be `ns-resize`, `ew-resize`, `pointer`, or `inherit`.
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
 * @see do not use the new keyword when instantiating.
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
 * @property {string} [contextMenuMarginTop=0] - Override value for contextMenuMarginTop.
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
 * @property {string} [headerCellHoverBackgroundColor=rgba(181, 201, 223, 1)] - Override value for headerCellHoverBackgroundColor.
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
 * @property {string} [rowHeaderCellHoverBackgroundColor=rgba(181, 201, 223, 1)] - Override value for rowHeaderCellHoverBackgroundColor.
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
 * @param {object} ctx Canvas context.
 * @param {object} [cell](#cell) Current cell.
 */
 /**
 * Fires when the tree arrow is drawn onto the canvas.  This is the only way
 * to completely replace the tree arrow graphic.  Call `e.preventDefault()` to stop the default arrow from being drawn.
 * @event
 * @name canvasDataGrid#rendertreearrow
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
 * @param {object} value New value.
 * @param {object} originalValue Original value.
 * @param {object} abort Abort edit function.  Call this function to abort the edit.
 * @param {object} [cell](#cell) Cell object.
 * @param {object} textarea Textarea or input HTMLElement depending on `attributes.multiLine`.
 */
 /**
 * Fires when the edit has ended.  This event gives you a chance to abort the edit
 * preserving original row data, or modify the value of the row data prior to being written.
 * @event
 * @name canvasDataGrid#endedit
 * @param {object} value New value.
 * @param {object} abort When true, the edit was aborted.
 * @param {object} [cell](#cell) Cell object.
 * @param {object} textarea Textarea HTMLElement.
 */
 /**
 * Fires before a edit cell has been created giving you a chance to abort it.
 * `e.preventDefault();` will abort the edit cell from being created.
 * @event
 * @name canvasDataGrid#beforebeginedit
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
 * `e.preventDefault();` will abort the resizing.
 * @event
 * @name canvasDataGrid#resize
 * @param {object} e height.
 * @param {cell} width.
 */
    function grid(args) {
        args = args || {};
        var defaultAttributes = [
                ['name', ''],
                ['tree', false],
                ['showNewRow', false],
                ['treeHorizontalScroll', false],
                ['saveAppearance', true],
                ['selectionFollowsActiveCell', false],
                ['multiLine', false],
                ['editable', true],
                ['allowColumnReordering', true],
                ['showFilter', true],
                ['globalRowResize', false],
                ['pageUpDownOverlap', 1],
                ['persistantSelectionMode', false],
                ['rowSelectionMode', false],
                ['autoResizeColumns', false],
                ['allowRowHeaderResize', true],
                ['allowColumnResize', true],
                ['allowRowResize', true],
                ['allowRowResizeFromCell', false],
                ['allowColumnResizeFromCell', false],
                ['showPerformance', false],
                ['debug', false],
                ['borderResizeZone', 10],
                ['showHeaders', true],
                ['showRowNumbers', true],
                ['showRowHeaders', true],
                ['scrollRepeatRate', 75],
                ['selectionScrollZone', 20],
                ['resizeScrollZone', 20],
                ['selectionScrollIncrement', 20]
            ],
            defaultStyles = [
                ['scrollBarBackgroundColor', 'rgba(240, 240, 240, 1)'],
                ['scrollBarBoxColor', 'rgba(192, 192, 192, 1)'],
                ['scrollBarActiveColor', 'rgba(125, 125, 125, 1)'],
                ['scrollBarBoxWidth', 8],
                ['scrollBarBoxMargin', 2],
                ['scrollBarBoxBorderRadius', 3],
                ['scrollBarBorderColor', 'rgba(202, 202, 202, 1)'],
                ['scrollBarBorderWidth', 0.5],
                ['scrollBarWidth', 10],
                ['scrollBarBoxMinSize', 15],
                ['scrollBarCornerBorderColor', 'rgba(202, 202, 202, 1)'],
                ['scrollBarCornerBackground', 'rgba(240, 240, 240, 1)'],
                ['treeArrowClickRadius', 5],
                ['treeGridHeight', 250],
                ['treeArrowHeight', 8],
                ['treeArrowWidth', 13],
                ['treeArrowColor', 'rgba(155, 155, 155, 1)'],
                ['treeArrowBorderColor', 'rgba(195, 199, 202, 1)'],
                ['treeArrowBorderWidth', 1],
                ['treeArrowMarginRight', 5],
                ['treeArrowMarginLeft', 0],
                ['treeArrowMarginTop', 6],
                ['filterTextPrefix', '(filtered)'],
                ['editCellFontSize', '16px'],
                ['editCellFontFamily', 'sans-serif'],
                ['editCellPaddingLeft', 4],
                ['styleSheet', ''],
                ['contextMenuItemMargin', '2px'],
                ['contextMenuItemBorderRadius', '3px'],
                ['contextMenuLabelDisplay', 'inline-block'],
                ['contextMenuLabelMinWidth', '75px'],
                ['contextMenuHoverBackground', 'rgba(182, 205, 250, 1)'],
                ['contextMenuColor', 'rgba(43, 48, 43, 1)'],
                ['contextMenuHoverColor', 'rgba(43, 48, 153, 1)'],
                ['contextMenuFontSize', '16px'],
                ['contextMenuFontFamily', 'sans-serif'],
                ['contextMenuBackground', 'rgba(222, 227, 233, 0.95)'],
                ['contextMenuBorder', 'solid 1px rgba(158, 163, 169, 1)'],
                ['contextMenuPadding', '2px'],
                ['contextMenuBorderRadius', '3px'],
                ['contextMenuOpacity', '0.98'],
                ['contextMenuFilterInvalidExpresion', 'rgba(237, 155, 156, 1)'],
                ['contextMenuMarginTop', 0],
                ['contextMenuMarginLeft', 5],
                ['autosizePadding', 5],
                ['autosizeHeaderCellPadding', 8],
                ['minHeight', 24],
                ['minRowHeight', 24],
                ['minColumnWidth', 10],
                ['columnWidth', 250],
                ['backgroundColor', 'rgba(240, 240, 240, 1)'],
                ['headerOrderByArrowHeight', 8],
                ['headerOrderByArrowWidth', 13],
                ['headerOrderByArrowColor', 'rgba(155, 155, 155, 1)'],
                ['headerOrderByArrowBorderColor', 'rgba(195, 199, 202, 1)'],
                ['headerOrderByArrowBorderWidth', 1],
                ['headerOrderByArrowMarginRight', 5],
                ['headerOrderByArrowMarginLeft', 0],
                ['headerOrderByArrowMarginTop', 6],
                ['cellHeightWithChildGrid', 150],
                ['cellWidthWithChildGrid', 250],
                ['cellHeight', 24],
                ['cellFont', '16px sans-serif'],
                ['cellPaddingTop', 5],
                ['cellAutoResizePadding', 13],
                ['cellPaddingLeft', 5],
                ['cellPaddingRight', 7],
                ['cellAlignment', 'left'],
                ['cellColor', 'rgba(0, 0, 0, 1)'],
                ['cellBackgroundColor', 'rgba(240, 240, 240, 1)'],
                ['cellHoverColor', 'rgba(0, 0, 0, 1)'],
                ['cellHoverBackgroundColor', 'rgba(240, 240, 240, 1)'],
                ['cellSelectedColor', 'rgba(43, 48, 153, 1)'],
                ['cellSelectedBackgroundColor', 'rgba(182, 205, 250, 1)'],
                ['cellBorderWidth', 0.25],
                ['cellBorderColor', 'rgba(195, 199, 202, 1)'],
                ['activeCellFont', '16px sans-serif'],
                ['activeCellPaddingTop', 5],
                ['activeCellPaddingLeft', 5],
                ['activeCellPaddingRight', 7],
                ['activeCellAlignment', 'left'],
                ['activeCellColor', 'rgba(43, 48, 153, 1)'],
                ['activeCellBackgroundColor', 'rgba(111, 160, 255, 1)'],
                ['activeCellHoverColor', 'rgba(43, 48, 153, 1)'],
                ['activeCellHoverBackgroundColor', 'rgba(110, 168, 255, 1)'],
                ['activeCellSelectedColor', 'rgba(43, 48, 153, 1)'],
                ['activeCellSelectedBackgroundColor', 'rgba(110, 168, 255, 1)'],
                ['activeCellBorderWidth', 0.25],
                ['activeCellBorderColor', 'rgba(151, 173, 190, 1)'],
                ['headerCellPaddingTop', 5],
                ['headerCellPaddingLeft', 5],
                ['headerCellPaddingRight', 7],
                ['headerCellHeight', 25],
                ['headerCellBorderWidth', 0.25],
                ['headerCellBorderColor', 'rgba(152, 155, 159, 1)'],
                ['headerCellFont', '16px sans-serif'],
                ['headerCellColor', 'rgba(50, 50, 50, 1)'],
                ['headerCellBackgroundColor', 'rgba(222, 227, 233, 1)'],
                ['headerCellHoverColor', 'rgba(43, 48, 153, 1)'],
                ['headerCellHoverBackgroundColor', 'rgba(181, 201, 223, 1)'],
                ['headerRowWidth', 57],
                ['rowHeaderCellPaddingTop', 5],
                ['rowHeaderCellPaddingLeft', 5],
                ['rowHeaderCellPaddingRight', 5],
                ['rowHeaderCellHeight', 25],
                ['rowHeaderCellBorderWidth', 0.25],
                ['rowHeaderCellBorderColor', 'rgba(172, 175, 179, 1)'],
                ['rowHeaderCellFont', '16px sans-serif'],
                ['rowHeaderCellColor', 'rgba(50, 50, 50, 1)'],
                ['rowHeaderCellBackgroundColor', 'rgba(222, 227, 233, 1)'],
                ['rowHeaderCellHoverColor', 'rgba(43, 48, 153, 1)'],
                ['rowHeaderCellHoverBackgroundColor', 'rgba(181, 201, 223, 1)'],
                ['rowHeaderCellSelectedColor', 'rgba(43, 48, 153, 1)'],
                ['rowHeaderCellSelectedBackgroundColor', 'rgba(182, 205, 250, 1)']
            ],
            parentNode,
            eventParent,
            parentDOMNode,
            isChildGrid,
            input,
            hasFocus = false,
            contextMenu,
            controlInput,
            activeCell = [0, 0],
            currentCell,
            lastMovedCell,
            storageName = 'canvasDataGrid',
            storedSettings,
            invalidSearchExpClass = 'canvas-datagrid-invalid-search-regExp',
            uniqueId = '_canvasDataGridUniqueId',
            orderBy = uniqueId,
            orderDirection = 'asc',
            invalidFilterRegEx,
            filterBy = '',
            filterValue = '',
            filters = {},
            ellipsisCache = {},
            canvas,
            height,
            width,
            selecting,
            scrollBox = {},
            schema,
            data,
            ctx,
            visibleCells,
            visibleRows = [],
            sizes = {
                rows: {},
                columns: {},
                trees: {}
            },
            currentFilter = function () { return true; },
            selections = [],
            selectionBounds,
            hovers = {},
            attributes = {},
            style = {},
            intf = {},
            formatters = {},
            sorters = {},
            schemaHashes = {},
            events = {},
            uId = 0,
            dragStartObject,
            resizeItem,
            resizingItem,
            resizingStartingWidth,
            resizingStartingHeight,
            resizeMode,
            ignoreNextClick,
            tempSchema,
            originalData,
            changes = [],
            scrollEdit,
            scrollIndexTop = 0,
            scrollPixelTop = 0,
            newRow,
            parentGrid,
            childGrids = {},
            openChildren = {},
            scrollMode,
            scrollStartMode,
            page,
            scrollTimer,
            scrollModes = [
                'vertical-scroll-box',
                'vertical-scroll-top',
                'vertical-scroll-bottom',
                'horizontal-scroll-box',
                'horizontal-scroll-right',
                'horizontal-scroll-left'
            ],
            dragStart,
            scrollStart,
            canvasOffsetTop,
            canvasOffsetLeft,
            mouse = { x: 0, y: 0};
        function scrollOffset(e) {
            var x = 0, y = 0;
            while (e.parentNode) {
                if (e.nodeType !== 'canvas-datagrid-tree'
                        && e.nodeType !== 'canvas-datagrid-cell') {
                    x -= e.scrollLeft;
                    y -= e.scrollTop;
                }
                e = e.parentNode;
            }
            return {left: x, top: y};
        }
        function position(e) {
            var x = 0, y = 0, s = e, h, w;
            while (e.offsetParent) {
                x += e.offsetLeft;
                y += e.offsetTop;
                h = e.offsetHeight;
                w = e.offsetWidth;
                e = e.offsetParent;
            }
            e = s;
            s = scrollOffset(e);
            return { left: x + s.left, top: y + s.top, height: h, width: w };
        }
        function getHeaderCellHeight() {
            return sizes.rows[-1] || style.headerCellHeight;
        }
        function getHeaderCellWidth() {
            return attributes.showRowHeaders
                ? (sizes.columns.cornerCell ||  style.headerRowWidth) : 0;
        }
        function stopPropagation(e) { e.stopPropagation(); }
        function setStorageData() {
            if (!attributes.saveAppearance) { return; }
            localStorage.setItem(storageName + '-' + attributes.name, JSON.stringify({
                sizes: {
                    rows: sizes.rows,
                    columns: sizes.columns
                }
            }));
        }
        function getSchema() {
            return schema || tempSchema;
        }
        function getVisibleSchema() {
            return getSchema().filter(function (col) { return !col.hidden; });
        }
        function createNewRowData() {
            newRow = {};
            newRow[uniqueId] = uId;
            uId += 1;
            getSchema().forEach(function forEachHeader(header, index) {
                var d = header.defaultValue || '';
                if (typeof d === 'function') {
                    d = d.apply(intf, [header, index]);
                }
                newRow[header.name] = d;
            });
        }
        function addEllipsis(text, width) {
            var o, i, c = style.cellPaddingRight + style.cellPaddingLeft, e;
            if (ellipsisCache[text] && ellipsisCache[text][width]) {
                return ellipsisCache[text][width];
            }
            e = ctx.measureText("...").width;
            if (ctx.measureText(text).width + c < width) {
                o = text;
            } else {
                o = text.substring(0, 1);
                i = 1;
                while (width > (ctx.measureText(o).width + c)) {
                    i += 1;
                    o = text.substring(0, i) + "...";
                }
            }
            ellipsisCache[text] = ellipsisCache[text] || {};
            ellipsisCache[text][width] = o;
            return o;
        }
        function addEventListener(ev, fn) {
            events[ev] = events[ev] || [];
            events[ev].unshift(fn);
        }
        function removeEventListener(ev, fn) {
            (events[ev] || []).forEach(function removeEachListener(sfn, idx) {
                if (fn === sfn) {
                    events[ev].splice(idx, 1);
                }
            });
        }
        function dispatchEvent(ev, args, context) {
            args = args || {};
            context = context || intf;
            var defaultPrevented;
            function preventDefault() {
                defaultPrevented = true;
            }
            if (!events[ev]) { return; }
            events[ev].forEach(function dispatchEachEvent(fn) {
                args[0].preventDefault = preventDefault;
                fn.apply(context, args);
            });
            return defaultPrevented;
        }
        formatters.string = function cellFormatterString(ctx, cell) {
            return cell.value !== undefined ? cell.value : '';
        };
        formatters.rowHeaderCell = formatters.string;
        formatters.headerCell = formatters.string;
        formatters.number = formatters.string;
        formatters.int = formatters.string;
        function getSchemaNameHash(key) {
            var n = 0;
            while (schemaHashes[key]) {
                n += 1;
                key = key + n;
            }
            return key;
        }
        function filter(type) {
            var f = filters[type];
            if (!f && type !== undefined) {
                console.warn('Cannot find filter for type %s, falling back to substring match.', type);
                f = filters.string;
            }
            return f;
        }
        /**
         * Returns an auto generated schema based on data structure.
         * @memberof canvasDataGrid#
         * @method
         * @tutorial schema
         * @returns {schema} schema A schema based on the first item in the data array.
         */
        function getSchemaFromData() {
            return Object.keys(data[0] || {' ': ''}).map(function mapEachSchemaColumn(key, index) {
                var type = typeof data[0][key],
                    i = {
                        name: key,
                        title: key,
                        width: style.columnWidth,
                        index: index,
                        type: type,
                        filter: filter(type)
                    };
                if (key === uniqueId) {
                    i.hidden = true;
                }
                i[uniqueId] = getSchemaNameHash(key);
                return i;
            });
        }
        function getSelectedData(expandToRow) {
            var d = [], s = getSchema(), l = data.length;
            selections.forEach(function (row, index) {
                if (index === l) { return; }
                d[index] = {};
                if (expandToRow) {
                    s.forEach(function (column) {
                        d[index][column.name] = data[index][column.name];
                    });
                } else {
                    row.forEach(function (col) {
                        if (col === -1) { return; }
                        d[index][s[col].name] = data[index][s[col].name];
                    });
                }
            });
            return d;
        }
        /**
         * Clears the change log grid.changes that keeps track of changes to the data set.
         * This does not undo changes or alter data it is simply a convince array to keep
         * track of changes made to the data since last this method was called.
         * @memberof canvasDataGrid#
         * @method
         */
        function clearChangeLog() {
            changes = [];
        }
        /**
         * Selects an area of the grid.
         * @memberof canvasDataGrid#
         * @method
         * @param {rect} bounds A rect object representing the selected values.
         */
        function selectArea(bounds, ctrl) {
            selectionBounds = bounds || selectionBounds;
            var x, y;
            if (!ctrl) {
                selections = [];
            }
            for (x = selectionBounds.top; x <= selectionBounds.bottom; x += 1) {
                selections[x] = selections[x] || [];
                for (y = selectionBounds.left; y <= selectionBounds.right; y += 1) {
                    selections[x].push(y);
                }
            }
            dispatchEvent('selectionchanged', [getSelectedData(), selections, selectionBounds], intf);
        }
        /**
         * Returns the maximum text width for a given column by column name.
         * @memberof canvasDataGrid#
         * @method
         * @returns {number} The number of pixels wide the maximum width value in the selected column.
         * @param {string} name The name of the column to calculate the value's width of.
         */
        function findColumnMaxTextLength(name) {
            var m = -Infinity;
            if (name === 'cornerCell') {
                ctx.font = style.rowHeaderCellFont;
                return ctx.measureText((data.length + (attributes.showNewRow ? 1 : 0)).toString()).width
                    + style.autosizePadding + style.autosizeHeaderCellPadding
                    + style.rowHeaderCellPaddingRight
                    + style.rowHeaderCellPaddingLeft
                    + (attributes.tree ? style.treeArrowWidth
                        + style.treeArrowMarginLeft + style.treeArrowMarginRight : 0);
            }
            getSchema().forEach(function (col) {
                if (col.name !== name) { return; }
                ctx.font = style.headerCellFont;
                var t = ctx.measureText(col.title || col.name).width
                    + style.headerCellPaddingRight
                    + style.headerCellPaddingLeft;
                m = t > m ? t : m;
            });
            data.forEach(function (row) {
                ctx.font = style.cellFont;
                var t = ctx.measureText(row[name]).width
                    + style.cellPaddingRight
                    + style.cellPaddingLeft + style.cellAutoResizePadding;
                m = t > m ? t : m;
            });
            return m;
        }
        function drawOrderByArrow(x, y) {
            x += canvasOffsetLeft;
            y += canvasOffsetTop;
            ctx.fillStyle = style.headerOrderByArrowColor;
            ctx.strokeStyle = style.headerOrderByArrowBorderColor;
            ctx.beginPath();
            x = x + style.headerOrderByArrowMarginLeft;
            y = y + style.headerOrderByArrowMarginTop;
            if (orderDirection === 'asc') {
                ctx.moveTo(x, y);
                ctx.lineTo(x + style.headerOrderByArrowWidth, y);
                ctx.lineTo(x + (style.headerOrderByArrowWidth * 0.5), y + style.headerOrderByArrowHeight);
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y + style.headerOrderByArrowHeight);
                ctx.lineTo(x + style.headerOrderByArrowWidth, y + style.headerOrderByArrowHeight);
                ctx.lineTo(x + (style.headerOrderByArrowWidth * 0.5), y);
                ctx.lineTo(x, y + style.headerOrderByArrowHeight);
            }
            ctx.stroke();
            ctx.fill();
            return style.headerOrderByArrowMarginLeft
                + style.headerOrderByArrowWidth
                + style.headerOrderByArrowMarginRight;
        }
        function drawTreeArrow(cell, x, y) {
            x += canvasOffsetLeft;
            y += canvasOffsetTop;
            ctx.fillStyle = style.treeArrowColor;
            ctx.strokeStyle = style.treeArrowBorderColor;
            ctx.beginPath();
            x = x + style.treeArrowMarginLeft;
            y = y + style.treeArrowMarginTop;
            if (openChildren[cell.data[uniqueId]]) {
                ctx.moveTo(x, y);
                ctx.lineTo(x + style.treeArrowWidth, y);
                ctx.lineTo(x + (style.treeArrowWidth * 0.5), y + style.treeArrowHeight);
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
                ctx.lineTo(x + style.treeArrowHeight, y + (style.treeArrowWidth * 0.5));
                ctx.lineTo(x, y + style.treeArrowWidth);
                ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.fill();
            return style.treeArrowMarginLeft
                + style.treeArrowWidth
                + style.treeArrowMarginRight;
        }
        function radiusRect(x, y, w, h, radius) {
            x += canvasOffsetLeft;
            y += canvasOffsetTop;
            var r = x + w, b = y + h;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(r - radius, y);
            ctx.quadraticCurveTo(r, y, r, y + radius);
            ctx.lineTo(r, y + h - radius);
            ctx.quadraticCurveTo(r, b, r - radius, b);
            ctx.lineTo(x + radius, b);
            ctx.quadraticCurveTo(x, b, x, b - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
        }
        function fillRect(x, y, w, h) {
            x += canvasOffsetLeft;
            y += canvasOffsetTop;
            ctx.fillRect(x, y, w, h);
        }
        function strokeRect(x, y, w, h) {
            x += canvasOffsetLeft;
            y += canvasOffsetTop;
            ctx.strokeRect(x, y, w, h);
        }
        function rect(x, y, w, h) {
            x += canvasOffsetLeft;
            y += canvasOffsetTop;
            ctx.rect(x, y, w, h);
        }
        function fillText(text, x, y) {
            x += canvasOffsetLeft;
            y += canvasOffsetTop;
            ctx.fillText(text, x, y);
        }
        function strokeText(text, x, y) {
            x += canvasOffsetLeft;
            y += canvasOffsetTop;
            ctx.strokeText(text, x, y);
        }
        /**
         * Redraws the grid. No matter what the change, this is the only method required to refresh everything.
         * @memberof canvasDataGrid#
         * @method
         */
        function draw(internal) {
            if (!isChildGrid && (!height || !width)) {
                return;
            }
            if (isChildGrid && internal) {
                requestAnimationFrame(parentGrid.draw);
                return;
            }
            if (intf.visible === false) {
                return;
            }
            // initial values
            var checkScrollHeight, borderWidth, rowHeaderCell, p, cx, cy, treeGrid, rowOpen,
                rowHeight, cornerCell, y, x, c, h, w, s, r, rd, cPos,
                l = data.length,
                u = currentCell || {},
                headerCellHeight = getHeaderCellHeight(),
                headerCellWidth = getHeaderCellWidth(),
                cellHeight = style.cellHeight;
            function drawScrollBars() {
                var v = {
                        x: 0,
                        y: 0,
                        height: 0,
                        width: 0,
                        style: 'vertical-scroll-bar'
                    },
                    n = {
                        x: 0,
                        y: 0,
                        height: 0,
                        width: 0,
                        style: 'horizontal-scroll-bar'
                    },
                    vb = {
                        x: 0,
                        y: 0,
                        height: 0,
                        width: 0,
                        style: 'vertical-scroll-box'
                    },
                    nb = {
                        x: 0,
                        y: 0,
                        height: 0,
                        width: 0,
                        style: 'horizontal-scroll-box'
                    },
                    co = {
                        x: 0,
                        y: 0,
                        height: 0,
                        width: 0,
                        style: 'scroll-box-corner'
                    },
                    m = (style.scrollBarBoxMargin * 2),
                    d = style.scrollBarBoxMargin * 0.5;
                // vertical
                v.x += w - style.scrollBarWidth - style.scrollBarBorderWidth - d;
                v.y += headerCellHeight;
                v.width = style.scrollBarWidth + style.scrollBarBorderWidth + d;
                v.height = h - headerCellHeight - style.scrollBarWidth - d - m;
                ctx.fillStyle = style.scrollBarBackgroundColor;
                fillRect(v.x, v.y, v.width, v.height + m);
                strokeRect(v.x, v.y, v.width, v.height + m);
                // vertical box
                vb.x = v.x + style.scrollBarBoxMargin;
                vb.y = headerCellHeight + style.scrollBarBoxMargin
                    + ((v.height - scrollBox.scrollBoxHeight)
                        * (scrollBox.scrollTop / scrollBox.scrollHeight));
                vb.width = style.scrollBarBoxWidth;
                vb.height = scrollBox.scrollBoxHeight;
                ctx.fillStyle = style.scrollBarBoxColor;
                if (/vertical/.test(u.context)) {
                    ctx.fillStyle = style.scrollBarActiveColor;
                }
                if (vb.width < v.width) {
                    radiusRect(vb.x, vb.y, vb.width, vb.height, style.scrollBarBoxBorderRadius);
                    ctx.stroke();
                    ctx.fill();
                }
                // horizontal
                n.x += headerCellWidth;
                n.y += h - style.scrollBarWidth - d;
                n.width = w - style.scrollBarWidth - headerCellWidth - d - m;
                n.height = style.scrollBarWidth + style.scrollBarBorderWidth + d;
                ctx.fillStyle = style.scrollBarBackgroundColor;
                ctx.strokeStyle = style.scrollBarBorderColor;
                ctx.lineWidth = style.scrollBarBorderWidth;
                fillRect(n.x, n.y, n.width + m, n.height);
                strokeRect(n.x, n.y, n.width + m, n.height);
                // horizontal box
                nb.y = n.y + style.scrollBarBoxMargin;
                nb.x = headerCellWidth + style.scrollBarBoxMargin
                    + ((n.width - scrollBox.scrollBoxWidth)
                        * (scrollBox.scrollLeft / scrollBox.scrollWidth));
                nb.width = scrollBox.scrollBoxWidth;
                nb.height = style.scrollBarBoxWidth;
                ctx.fillStyle = style.scrollBarBoxColor;
                if (/horizontal/.test(u.context)) {
                    ctx.fillStyle = style.scrollBarActiveColor;
                }
                if (nb.width < n.width) {
                    radiusRect(nb.x, nb.y, nb.width, nb.height, style.scrollBarBoxBorderRadius);
                    ctx.stroke();
                    ctx.fill();
                }
                //corner
                ctx.strokeStyle = style.scrollBarCornerBorderColor;
                ctx.fillStyle = style.scrollBarCornerBackground;
                co.x = n.x + n.width + m;
                co.y = v.y + v.height + m;
                co.width = style.scrollBarWidth + style.scrollBarBorderWidth;
                co.height = style.scrollBarWidth + style.scrollBarBorderWidth;
                radiusRect(co.x, co.y, co.width, co.height, 0);
                ctx.stroke();
                ctx.fill();
                visibleCells.unshift(v);
                visibleCells.unshift(vb);
                visibleCells.unshift(n);
                visibleCells.unshift(nb);
                visibleCells.unshift(co);
                scrollBox.bar = {
                    v: v,
                    h: n
                };
                scrollBox.box = {
                    v: vb,
                    h: nb
                };
            }
            function drawCell(d, rowIndex) {
                return function drawEach(header, headerIndex) {
                    var cellStyle = header.style || 'cell',
                        childGridAttributes,
                        cell,
                        selected = selections[rowIndex] && selections[rowIndex].indexOf(headerIndex) !== -1,
                        hovered = hovers[d[uniqueId]] && hovers[d[uniqueId]].indexOf(headerIndex) !== -1,
                        active = activeCell[1] === rowIndex && activeCell[0] === headerIndex,
                        isGrid = Array.isArray(d[header.name]),
                        val,
                        f = formatters[header.type || 'string'],
                        orderByArrowSize = 0,
                        treeArrowSize = 0,
                        cellWidth = sizes.columns[cellStyle  === 'rowHeaderCell'
                            ? 'cornerCell' : header[uniqueId]] || header.width;
                    if (cellStyle === 'headerCellCap') {
                        cellWidth = w - x;
                    }
                    // if no data or schema are defined, a width is provided to the stub column
                    if (cellWidth === undefined) {
                        cellWidth = style.columnWidth;
                    }
                    if (x + cellWidth + borderWidth < 0) {
                        x += cellWidth + borderWidth;
                    }
                    if (active) {
                        cellStyle = 'activeCell';
                    }
                    if (visibleRows.indexOf(rowIndex) === -1
                            && ['headerCell', 'cornerCell'].indexOf(cellStyle) === -1) {
                        visibleRows.push(rowIndex);
                    }
                    val = dispatchEvent('formatcellvalue', [ctx, d[header.name], d, header, cx, cy], intf);
                    if (!dispatchEvent('beforerendercell', [ctx, d[header.name], d, header, cx, cy], intf)) {
                        cx = x - scrollBox.scrollLeft;
                        cy = y;
                        if (cellStyle === 'cornerCell') {
                            cx = 0;
                            cy = 0;
                        } else if (cellStyle === 'rowHeaderCell') {
                            cx = 0;
                        } else if (cellStyle === 'headerCell') {
                            cy = 0;
                        }
                        cell = {
                            type: isGrid ? 'canvas-datagrid-cell' : header.type,
                            style: cellStyle,
                            nodeType: 'canvas-datagrid-cell',
                            x: cx,
                            y: cy,
                            offsetTop: cy,
                            offsetLeft: cx,
                            scrollTop: scrollBox.scrollTop,
                            scrollLeft: scrollBox.scrollLeft,
                            active: active === true,
                            hovered: hovered === true,
                            selected: selected === true,
                            width: cellWidth,
                            height: cellHeight,
                            offsetWidth: cellWidth,
                            offsetHeight: cellHeight,
                            parentNode: intf.parentNode,
                            offsetParent: intf.parentNode,
                            data: d,
                            isHeader: /headerCell|cornerCell/.test(cellStyle),
                            isRowHeader: 'rowHeaderCell' === cellStyle,
                            rowOpen: rowOpen,
                            header: header,
                            index: headerIndex,
                            columnIndex: headerIndex,
                            rowIndex: rowIndex,
                            isGrid: isGrid,
                            gridId: (attributes.name || '') + d[uniqueId] + ':' + header[uniqueId],
                            parentGrid: intf,
                            value: cellStyle === 'headerCell'
                                ? (header.title || header.name) : d[header.name]
                        };
                        cell.userHeight = cell.isHeader ? sizes.rows[-1] : rowHeight;
                        cell.userWidth = cell.isHeader ? sizes.columns.cornerCell : sizes.columns[header[uniqueId]];
                        cell[uniqueId] = d[uniqueId];
                        visibleCells.unshift(cell);
                        ctx.fillStyle = style[cellStyle + 'BackgroundColor'];
                        ctx.strokeStyle = style[cellStyle + 'BorderColor'];
                        ctx.lineWidth = style[cellStyle + 'BorderWidth'];
                        if (hovered) {
                            ctx.fillStyle = style[cellStyle + 'HoverBackgroundColor'];
                            ctx.strokeStyle = style[cellStyle + 'HoverBorderColor'];
                        }
                        if (selected) {
                            ctx.fillStyle = style[cellStyle + 'SelectedBackgroundColor'];
                            ctx.strokeStyle = style[cellStyle + 'SelectedBorderColor'];
                        }
                        dispatchEvent('rendercell', [ctx, cell], intf);
                        if (cell.isGrid) {
                            if (cell.height !== rowHeight) {
                                cell.height = rowHeight || style.cellHeightWithChildGrid;
                                checkScrollHeight = true;
                            }
                            cell.width = sizes.columns[header[uniqueId]] || style.cellWidthWithChildGrid;
                        }
                        if (rowOpen && !cell.isRowHeader) {
                            cell.height = sizes.rows[rd[uniqueId]] || style.cellHeight;
                        }
                        if (!cell.isGrid) {
                            fillRect(cx, cy, cell.width, cell.height);
                            strokeRect(cx, cy, cell.width, cell.height);
                        }
                        ctx.save();
                        radiusRect(cell.x, cell.y, cell.width, cell.height, 0);
                        ctx.clip();
                        dispatchEvent('afterrendercell', [ctx, cell], intf);
                        if (cell.height !== cellHeight && !(rowOpen && !cell.isRowHeader)) {
                            sizes.rows[cellStyle === 'headerCell' ? -1 : d[uniqueId]] = cell.height;
                            checkScrollHeight = true;
                        }
                        if (cell.width !== cellWidth) {
                            sizes.columns[header[uniqueId]] = cell.width;
                            checkScrollHeight = true;
                        }
                        if (cellStyle === 'rowHeaderCell' && attributes.tree) {
                            if (!dispatchEvent('rendertreearrow', [ctx, cell], intf)) {
                                treeArrowSize = drawTreeArrow(cell, style[cellStyle + 'PaddingLeft'], cy, 0);
                            }
                        }
                        if ((attributes.showRowNumbers && cellStyle === 'rowHeaderCell')
                                || cellStyle !== 'rowHeaderCell') {
                            if (cell.isGrid) {
                                if (!childGrids[cell.gridId]) {
                                    childGridAttributes = args.childGridAttributes || args;
                                    childGridAttributes.name = attributes.saveAppearance ? cell.gridId : undefined;
                                    childGridAttributes.parentNode = cell;
                                    childGridAttributes.data = d[header.name];
                                    childGrids[cell.gridId] = grid(childGridAttributes);
                                    dispatchEvent('rendercellgrid', [ctx, cell, childGrids[cell.gridId]], intf);
                                    checkScrollHeight = true;
                                }
                                cell.grid = childGrids[cell.gridId];
                                cell.grid.parentNode = cell;
                                cell.grid.visible = true;
                                cell.grid.draw();
                            } else {
                                ctx.font = style[cellStyle + 'Font'];
                                val = val !== undefined ? val : f
                                    ? f(ctx, cell) : '';
                                if (val === undefined && !f) {
                                    val = '';
                                    console.warn('canvas-datagrid: I don\'t know how to format a '
                                        + header.type + ' add a cellFormater');
                                }
                                if (cellStyle === 'headerCell' && orderBy === header.name) {
                                    if (!dispatchEvent('renderorderbyarrow', [ctx, cell], intf)) {
                                        orderByArrowSize = drawOrderByArrow(cx + style[cellStyle + 'PaddingLeft'], 0);
                                    }
                                }
                                ctx.fillStyle = style[cellStyle + 'Color'];
                                if (hovered) {
                                    ctx.fillStyle = style[cellStyle + 'HoverColor'];
                                }
                                if (selected) {
                                    ctx.fillStyle = style[cellStyle + 'SelectedColor'];
                                }
                                if (header.name === filterBy && filterValue !== '' && cellStyle === 'headerCell') {
                                    val = style.filterTextPrefix + val;
                                }
                                cell.formattedValue = (val || '').toString();
                                dispatchEvent('rendertext', [ctx, cell], intf);
                                fillText(addEllipsis(cell.formattedValue, cell.width - style[cellStyle + 'PaddingRight'] - orderByArrowSize - style.autosizePadding),
                                    treeArrowSize + orderByArrowSize + cx + style[cellStyle + 'PaddingLeft'],
                                    cy - (cell.height * 0.5) + style[cellStyle + 'PaddingTop'] + cell.height);
                            }
                        }
                        ctx.restore();
                        x += cell.width + borderWidth;
                        return (x - cell.width > width + scrollBox.scrollLeft);
                    }
                };
            }
            function drawRowHeader(rowData, index) {
                var a;
                if (attributes.showRowHeaders) {
                    x = 0;
                    rowHeaderCell = {'rowHeaderCell': index + 1 };
                    rowHeaderCell[uniqueId] = rowData[uniqueId];
                    a = {
                        name: 'rowHeaderCell',
                        width: style.headerRowWidth,
                        style: 'rowHeaderCell',
                        type: 'string',
                        index: -1
                    };
                    a[uniqueId] = rowData[uniqueId];
                    drawCell(rowHeaderCell, index)(a, -1);
                }
            }
            function drawRow(r) {
                var treeHeight, rowSansTreeHeight, u, g = s.length;
                if (y - (cellHeight * 2) > h) {
                    return false;
                }
                rd = data[r];
                rowOpen = openChildren[rd[uniqueId]];
                rowSansTreeHeight = sizes.rows[rd[uniqueId]] || style.cellHeight;
                treeHeight = (rowOpen ? sizes.trees[rd[uniqueId]] : 0);
                rowHeight = rowSansTreeHeight + treeHeight;
                if (y < rowHeight * -1) {
                    return false;
                }
                if (attributes.showRowHeaders) {
                    x = headerCellWidth;
                }
                cellHeight = rowHeight;
                for (u = 0; u < g; u += 1) {
                    if (drawCell(rd, r)(s[u], u)) {
                        break;
                    }
                }
                drawRowHeader(rd, r);
                // cell height might have changed during drawing
                cellHeight = rowHeight;
                x = 0;
                // don't draw a tree for the new row
                treeGrid = childGrids[rd[uniqueId]];
                if (r !== data.length && rowOpen) {
                    treeGrid.visible = true;
                    treeGrid.parentNode = {
                        offsetTop: y + rowSansTreeHeight + canvasOffsetTop,
                        offsetLeft: x + headerCellWidth - 1 + canvasOffsetLeft,
                        offsetHeight: treeHeight,
                        offsetWidth: width - headerCellWidth - style.scrollBarWidth - 1,
                        offsetParent: intf.parentNode,
                        parentNode: intf.parentNode,
                        style: style,
                        nodeType: 'canvas-datagrid-tree',
                        scrollTop: scrollBox.scrollTop,
                        scrollLeft: scrollBox.scrollLeft,
                        rowIndex: x
                    };
                    visibleCells.unshift({
                        rowIndex: x,
                        columnIndex: 0,
                        y: treeGrid.parentNode.offsetTop,
                        x: treeGrid.parentNode.offsetLeft,
                        height: treeGrid.parentNode.offsetHeight,
                        width: treeGrid.parentNode.offsetWidth,
                        style: 'tree-grid',
                        type: treeGrid.parentNode.nodeType
                    });
                    treeGrid.draw();
                } else if (treeGrid) {
                    treeGrid.parentNode.offsetHeight = 0;
                    delete sizes.trees[rd[uniqueId]];
                }
                y += cellHeight + borderWidth;
                return true;
            }
            if (attributes.showPerformance) {
                p = performance.now();
            }
            borderWidth = style.cellBorderWidth * 2;
            visibleRows = [];
            s = getVisibleSchema();
            visibleCells = [];
            canvasOffsetTop = isChildGrid ? parentNode.offsetTop : 0;
            canvasOffsetLeft = isChildGrid ? parentNode.offsetLeft : 0;
            x = 0;
            y = (scrollBox.scrollTop * -1) + headerCellHeight + scrollPixelTop;
            h = height;
            w = width;
            // draw background
            ctx.save();
            if (!isChildGrid) {
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
            radiusRect(
                0,
                0,
                width,
                height,
                0
            );
            ctx.clip();
            ctx.fillStyle = style.backgroundColor;
            fillRect(x, y, w, h);
            for (r = scrollIndexTop; r < l; r += 1) {
                if (!drawRow(r)) {
                    break;
                }
            }
            if (attributes.showNewRow) {
                if (attributes.showRowHeaders) {
                    x = headerCellWidth;
                }
                rowHeight = cellHeight = style.cellHeight;
                rowOpen = false;
                s.forEach(function forEachHeader(header, index) {
                    drawCell(newRow, data.length)(header, index);
                });
                drawRowHeader(newRow, data.length);
            }
            y = 0;
            if (attributes.showHeaders) {
                if (attributes.showRowHeaders) {
                    x = headerCellWidth;
                }
                // cell height might have changed during drawing
                cellHeight = getHeaderCellHeight();
                s.forEach(function forEachHeader(header, index) {
                    var d = {
                        title: header.title,
                        name: header.name,
                        width: header.width,
                        style: 'headerCell',
                        type: 'string',
                        index: index
                    }, headerCell = {'headerCell': header.title || header.name};
                    headerCell[uniqueId] = 'h' + header[uniqueId];
                    d[uniqueId] = header[uniqueId];
                    drawCell(headerCell, -1)(d, index);
                });
                // fill in the space right of the headers
                if (x < w) {
                    c = {
                        name: '',
                        width: style.scrollBarWidth,
                        style: 'headerCellCap',
                        type: 'string',
                        index: s.length
                    };
                    c[uniqueId] = 'headerCell';
                    drawCell({endCap: ''}, -1)(c, -1);
                }
                // fill in the space left of the headers
                if (attributes.showRowHeaders) {
                    cornerCell = {'cornerCell': '' };
                    cornerCell[uniqueId] = 'cornerCell';
                    x = 0;
                    c = {
                        name: 'cornerCell',
                        width: style.headerRowWidth,
                        style: 'cornerCell',
                        type: 'string',
                        index: -1
                    };
                    c[uniqueId] = 'cornerCell';
                    drawCell(cornerCell, -1)(c, -1);
                }
            }
            drawScrollBars();
            if (checkScrollHeight) {
                resize(true);
            }
            if (attributes.showPerformance) {
                ctx.fillStyle = 'black';
                p = (performance.now() - p).toFixed(2) + 'ms';
                ctx.font = '23px sans-serif';
                fillText(p, w - (w / 5), h - (h / 10));
            }
            if (attributes.debug) {
                ctx.font = '14px sans-serif';
                p = ('topIndex: %s, topPixel: %s, offsetLeft: %s, offsetTop: %s, w: %s, h: %s'
                    + '\nx: %s, y: %s,\nvisible entities: %s, focus: %s, context: %s')
                    .replace('%s', scrollIndexTop)
                    .replace('%s', scrollPixelTop)
                    .replace('%s', canvasOffsetLeft)
                    .replace('%s', canvasOffsetTop)
                    .replace('%s', width)
                    .replace('%s', height)
                    .replace('%s', mouse.x)
                    .replace('%s', mouse.y)
                    .replace('%s', visibleCells.length)
                    .replace('%s', hasFocus)
                    .replace('%s', currentCell
                        ? (('(x: %s, y: %s, context: %s, style: %s, type: %s)')
                            .replace('%s', currentCell.rowIndex)
                            .replace('%s', currentCell.columnIndex)
                            .replace('%s', currentCell.context)
                            .replace('%s', currentCell.style)
                            .replace('%s', currentCell.type)) : '');
                p.split('\n').forEach(function (s, index) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    fillRect(60, 39 + (index * 15), ctx.measureText(s).width + 20, 15);
                    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
                    fillText(s, 70, 52 + (index * 15));
                });
            }
            ctx.restore();
        }
        function drawChildGrids() {
            Object.keys(childGrids).forEach(function (gridKey) {
                childGrids[gridKey].draw();
            });
        }
        function resizeChildGrids() {
            Object.keys(childGrids).forEach(function (gridKey) {
                childGrids[gridKey].resize();
            });
        }
        function resize(drawAfterResize) {
            var cellBorder = style.cellBorderWidth * 2,
                headerCellBorder =  style.headerCellBorderWidth * 2,
                scrollHeight,
                scrollWidth,
                headerCellHeight = getHeaderCellHeight(),
                headerCellWidth = getHeaderCellWidth();
            if (isChildGrid) {
                height = parentNode.offsetHeight;
                width = parentNode.offsetWidth;
            } else {
                height = parentDOMNode.offsetHeight;
                width = parentDOMNode.offsetWidth;
                parentNode = parentDOMNode;
                canvas.height = height * window.devicePixelRatio;
                canvas.width = width * window.devicePixelRatio;
                canvas.style.height = height + 'px';
                canvas.style.width = width + 'px';
                canvasOffsetTop = 0;
                canvasOffsetLeft = 0;
            }
            scrollHeight = data.reduce(function reduceData(accumulator, row) {
                return accumulator
                    + (sizes.rows[row[uniqueId]] || style.cellHeight)
                    + (sizes.trees[row[uniqueId]] || 0)
                    + cellBorder;
            }, 0) || 0;
            scrollWidth = getVisibleSchema().reduce(function reduceSchema(accumulator, column) {
                if (column.hidden) { return accumulator; }
                return accumulator + (sizes.columns[column[uniqueId]] || column.width || style.columnWidth) + cellBorder;
            }, 0) || 0;
            if (attributes.showNewRow) {
                scrollHeight += style.cellHeight + cellBorder;
            }
            scrollBox.width = width - headerCellWidth;
            scrollBox.height = height - headerCellHeight - headerCellBorder;
            scrollBox.top = headerCellHeight + headerCellBorder;
            scrollBox.left = headerCellWidth;
            scrollBox.scrollHeight = scrollHeight + style.scrollBarWidth - scrollBox.height;
            scrollBox.scrollWidth = scrollWidth + style.scrollBarWidth - scrollBox.width;
            scrollBox.widthBoxRatio = (scrollBox.width / (scrollBox.scrollWidth + scrollBox.width));
            scrollBox.scrollBoxWidth = scrollBox.width
                * scrollBox.widthBoxRatio
                - style.scrollBarWidth;
            scrollBox.heightBoxRatio = (scrollBox.height / (scrollBox.scrollHeight + scrollBox.height));
            scrollBox.scrollBoxHeight = scrollBox.height
                * scrollBox.heightBoxRatio
                - style.scrollBarWidth;
            scrollBox.scrollBoxWidth = Math.max(scrollBox.scrollBoxWidth, style.scrollBarBoxMinSize);
            scrollBox.scrollBoxHeight = Math.max(scrollBox.scrollBoxHeight, style.scrollBarBoxMinSize);
            page = visibleRows.length - 3 - attributes.pageUpDownOverlap;
            if (drawAfterResize) {
                draw(true);
            }
            dispatchEvent('resize', [], intf);
            return true;
        }
        function getClippingRect(ele) {
            var boundingRect = position(parentNode),
                eleRect = position(ele),
                clipRect = {
                    x: 0,
                    y: 0,
                    h: 0,
                    w: 0
                },
                parentRect = {
                    x: -Infinity,
                    y: -Infinity,
                    h: Infinity,
                    w: Infinity
                },
                headerCellHeight = getHeaderCellHeight(),
                headerCellWidth = getHeaderCellWidth();
            clipRect.h = boundingRect.top + boundingRect.height - ele.offsetTop - style.scrollBarWidth;
            clipRect.w = boundingRect.left + boundingRect.width - ele.offsetLeft - style.scrollBarWidth;
            clipRect.x = boundingRect.left + (eleRect.left * -1) + headerCellWidth;
            clipRect.y = boundingRect.top + (eleRect.top * -1) + headerCellHeight;
            return {
                x: clipRect.x > parentRect.x ? clipRect.x : parentRect.x,
                y: clipRect.y > parentRect.y ? clipRect.y : parentRect.y,
                h: clipRect.h < parentRect.h ? clipRect.h : parentRect.h,
                w: clipRect.w < parentRect.w ? clipRect.w : parentRect.w
            };
        }
        function clipElement(ele) {
            var clipRect = getClippingRect(ele);
            if (clipRect.w < 0) { clipRect.w = 0; }
            if (clipRect.h < 0) { clipRect.h = 0; }
            ele.style.clip = 'rect('
                + clipRect.y + 'px,'
                + clipRect.w + 'px,'
                + clipRect.h + 'px,'
                + clipRect.x + 'px'
                + ')';
            // INFO https://developer.mozilla.org/en-US/docs/Web/CSS/clip
            // clip has been "deprecated" for clipPath.  Of course nothing but chrome
            // supports clip path, so we'll keep using clip until someday clipPath becomes
            // more widely support.  The code below works correctly, but setting clipPath and clip
            // at the same time has undesirable results.
            // ele.style.clipPath = 'polygon('
            //     + clipRect.x + 'px ' + clipRect.y + 'px,'
            //     + clipRect.x + 'px ' + clipRect.h + 'px,'
            //     + clipRect.w + 'px ' + clipRect.h + 'px,'
            //     + clipRect.w + 'px ' + clipRect.y + 'px'
            //     + ')';
        }
        /**
         * Selects a row.
         * @memberof canvasDataGrid#
         * @method
         * @param {boolean} toggleSelectMode When true, behaves as if you were holding control/command when you clicked the row.
         * @param {boolean} supressSelectionchangedEvent When true, prevents the selectionchanged event from firing.
         */
        function selectRow(rowIndex, ctrl, supressEvent) {
            var s = getSchema();
            if (selections[rowIndex] && selections[rowIndex].length === data.length && !ctrl) {
                selections[rowIndex] = [];
                return;
            }
            selections[rowIndex] = [];
            selections[rowIndex].push(-1);
            s.forEach(function (col) {
                selections[rowIndex].push(col.index);
            });
            if (supressEvent) { return; }
            dispatchEvent('selectionchanged', [getSelectedData(), selections, selectionBounds], intf);
        }
        /**
         * Collapse a tree grid by row index.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} index The index of the row to collapse.
         */
        function collapseTree(rowIndex) {
            var rowId = data[rowIndex][uniqueId];
            dispatchEvent('collapsetree', [childGrids[rowId], data[rowIndex], rowIndex], intf);
            openChildren[rowId].blur();
            openChildren[rowId].dispose();
            delete openChildren[rowId];
            delete sizes.trees[rowId];
            delete childGrids[rowId];
            dispatchEvent('resizerow', [style.cellHeight], intf);
            resize(true);
            draw(true);
        }
        /**
         * Expands a tree grid by row index.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} index The index of the row to expand.
         */
        function expandTree(rowIndex) {
            var headerCellHeight = getHeaderCellHeight(),
                headerCellWidth = sizes.columns.cornerCell || style.headerRowWidth,
                rowId = data[rowIndex][uniqueId],
                h = sizes.trees[rowId] || style.treeGridHeight,
                treeGrid;
            if (!childGrids[rowId]) {
                treeGrid = grid({
                    debug: attributes.debug,
                    showPerformance: attributes.showPerformance,
                    name: attributes.saveAppearance
                        ? attributes.name + 'tree' + rowId : undefined,
                    parentNode: {
                        parentGrid: intf,
                        nodeType: 'canvas-datagrid-tree',
                        offsetHeight: h,
                        offsetWidth: width - headerCellWidth,
                        header: { width: width - headerCellWidth },
                        offsetLeft: headerCellWidth,
                        offsetTop: headerCellHeight,
                        offsetParent: intf.parentNode,
                        parentNode: intf.parentNode,
                        style: 'tree',
                        data: data[rowIndex]
                    }
                });
                childGrids[rowId] = treeGrid;
            }
            treeGrid = childGrids[rowId];
            treeGrid.visible = true;
            dispatchEvent('expandtree', [treeGrid, data[rowIndex], rowIndex], intf);
            openChildren[data[rowIndex][uniqueId]] = treeGrid;
            sizes.trees[data[rowIndex][uniqueId]] = h;
            dispatchEvent('resizerow', [style.cellHeight], intf);
            resize(true);
            draw();
        }
        /**
         * Toggles tree grid open and close by row index.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} index The index of the row to toggle.
         */
        function toggleTree(rowIndex) {
            var i = openChildren[data[rowIndex][uniqueId]];
            if (i) {
                return collapseTree(rowIndex);
            }
            expandTree(rowIndex);
        }
        function scroll(e) {
            var pos = position(parentNode),
                cellBorder = style.cellBorderWidth * 2;
            scrollIndexTop = 0;
            scrollPixelTop = 0;
            while (scrollPixelTop < scrollBox.scrollTop && scrollIndexTop < data.length) {
                scrollPixelTop +=
                    (sizes.rows[data[scrollIndexTop][uniqueId]] || style.cellHeight)
                    + (sizes.trees[data[scrollIndexTop][uniqueId]] || 0)
                    + cellBorder;
                scrollIndexTop += 1;
            }
            if (data.length > 0) {
                scrollIndexTop = Math.max(scrollIndexTop - 1, 0);
                scrollPixelTop = Math.max(scrollPixelTop
                    - (sizes.rows[data[scrollIndexTop][uniqueId]] || style.cellHeight)
                    - (sizes.trees[data[scrollIndexTop][uniqueId]] || 0), 0);
            }
            ellipsisCache = {};
            draw(true);
            if (input) {
                input.style.top = pos.top + scrollEdit.inputTop
                    + (scrollEdit.scrollTop - scrollBox.scrollTop) + 'px';
                input.style.left = pos.left + scrollEdit.inputLeft
                    + (scrollEdit.scrollLeft - scrollBox.scrollLeft) + 'px';
                clipElement(input);
            }
            dispatchEvent('scroll', [{top: scrollBox.scrollTop, left: scrollBox.scrollLeft }], intf);
        }
        /**
         * Returns a header from the schema by name.
         * @memberof canvasDataGrid#
         * @tutorial schema
         * @method
         * @returns {header} header with the selected name, or undefined.
         * @param {string} name The name of the column to resize.
         */
        function getHeaderByName(name) {
            var x, i = getSchema();
            for (x = 0; x < i.length; x += 1) {
                if (i[x].name === name) {
                    return i[x];
                }
            }
        }
        /**
         * Resizes a column to fit the longest value in the column. Call without a value to resize all columns.
         * Warning, can be slow on very large record sets (1m records ~3-5 seconds on an i7).
         * @memberof canvasDataGrid#
         * @method
         * @param {string} name The name of the column to resize.
         */
        function fitColumnToValues(name) {
            sizes.columns[name === 'cornerCell' ? name : getHeaderByName(name)[uniqueId]]
                = findColumnMaxTextLength(name);
            resize();
            draw(true);
        }
        sorters.string = function (columnName, direction) {
            var asc = direction === 'asc';
            return function (a, b) {
                if (a[columnName] === undefined || a[columnName] === null
                        || b[columnName] === undefined || b[columnName] === null) {
                    return false;
                }
                if (asc) {
                    if (!a[columnName].localeCompare) { return false; }
                    return a[columnName].localeCompare(b[columnName]);
                }
                if (!b[columnName].localeCompare) { return false; }
                return b[columnName].localeCompare(a[columnName]);
            };
        };
        sorters.number = function (columnName, direction) {
            var asc = direction === 'asc';
            return function (a, b) {
                if (asc) {
                    return a[columnName] - b[columnName];
                }
                return b[columnName] - a[columnName];
            };
        };
        sorters.date = function (columnName, direction) {
            var asc = direction === 'asc';
            return function (a, b) {
                if (asc) {
                    return new Date(a[columnName]).getTime()
                        - new Date(b[columnName]).getTime();
                }
                return new Date(b[columnName]).getTime()
                        - new Date(a[columnName]).getTime();
            };
        };
        /**
         * Sets the order of the data.
         * @memberof canvasDataGrid#
         * @method
         * @returns {cell} cell at the selected location.
         * @param {number} columnName Number of pixels from the left.
         * @param {string} direction `asc` for ascending or `desc` for descending.
         */
        function order(columnName, direction) {
            var f,
                c = getSchema().filter(function (col) {
                    return col.name === columnName;
                });
            orderBy = columnName;
            if (c.length === 0) {
                throw new Error('Cannot sort.  No such column name');
            }
            f = sorters[c[0].type];
            if (!f && c[0].type !== undefined) {
                console.warn('Cannot sort type "%s" falling back to string sort.', c[0].type);
            }
            data = data.sort(f(columnName, direction) || sorters.string);
            dispatchEvent('ordercolumn', [columnName, direction], intf);
            draw(true);
        }
        /**
         * Gets the cell at grid pixel coordinate x and y.
         * @memberof canvasDataGrid#
         * @method
         * @returns {cell} cell at the selected location.
         * @param {number} x Number of pixels from the left.
         * @param {number} y Number of pixels from the top.
         */
        function getCellAt(x, y) {
            var i, l = visibleCells.length, cell;
            if (!visibleCells || !visibleCells.length) { return; }
            hasFocus = true;
            if (!(y < height
                && y > 0
                && x < width
                && x > 0)) {
                hasFocus = false;
                return {
                    context: 'inherit'
                };
            }
            for (i = 0; i < l; i += 1) {
                cell = visibleCells[i];
                if (cell.x < x
                        && cell.x + cell.width + style.cellBorderWidth > x
                        && cell.y < y
                        && cell.y + cell.height + style.cellBorderWidth > y) {
                    if (/vertical-scroll-(bar|box)/.test(cell.style)) {
                        cell.context = 'vertical-scroll-box';
                        if (y > scrollBox.box.v.y + scrollBox.scrollBoxHeight) {
                            cell.context = 'vertical-scroll-bottom';
                        } else if (y < scrollBox.box.v.y) {
                            cell.context = 'vertical-scroll-top';
                        }
                        canvas.style.cursor = 'default';
                        return cell;
                    }
                    if (/horizontal-scroll-(bar|box)/.test(cell.style)) {
                        cell.context = 'horizontal-scroll-box';
                        if (x > scrollBox.box.h.x + scrollBox.scrollBoxWidth) {
                            cell.context = 'horizontal-scroll-right';
                        } else if (x < scrollBox.box.h.x) {
                            cell.context = 'horizontal-scroll-left';
                        }
                        canvas.style.cursor = 'default';
                        return cell;
                    }
                    if (cell.x + cell.width - (attributes.borderResizeZone * 0.4) < x
                            && cell.x + cell.width + (attributes.borderResizeZone * 0.6) > x
                            && attributes.allowColumnResize
                            && ((attributes.allowColumnResizeFromCell && cell.style === 'cell')
                                || cell.style !== 'cell')
                            && ((attributes.allowRowHeaderResize
                                && ['rowHeaderCell', 'cornerCell'].indexOf(cell.style) !== -1)
                                || ['rowHeaderCell', 'cornerCell'].indexOf(cell.style) === -1)) {
                        cell.context = 'ew-resize';
                        return cell;
                    }
                    if (cell.y + cell.height - (attributes.borderResizeZone * 0.4) < y
                            && cell.y + cell.height + (attributes.borderResizeZone * 0.6) > y
                            && attributes.allowRowResize
                            && ((attributes.allowRowResizeFromCell && cell.style === 'cell')
                                || cell.style !== 'cell')
                            && cell.style !== 'headerCell') {
                        cell.context = 'ns-resize';
                        return cell;
                    }
                    if (cell.isGrid) {
                        hasFocus = false;
                        cell.context = 'cell-grid';
                        return cell;
                    }
                    if (cell.style === 'tree-grid') {
                        hasFocus = false;
                        cell.context = 'tree';
                        return cell;
                    }
                    cell.context = 'cell';
                    return cell;
                }
            }
            hasFocus = false;
            return {
                context: 'inherit'
            };
        }
        function mousemove(e) {
            if (contextMenu || input) {
                return;
            }
            var ctrl = (e.controlKey || e.metaKey || attributes.persistantSelectionMode),
                setTimer,
                i,
                headerCellWidth = getHeaderCellWidth(),
                headerCellHeight = getHeaderCellHeight(),
                dragBounds,
                pos = position(parentNode, false),
                x = e.clientX - pos.left,
                y = e.clientY - pos.top,
                o;
            mouse.x = x;
            mouse.y = y;
            clearTimeout(scrollTimer);
            if (dispatchEvent('mousemove', [e, o], intf)) {
                return;
            }
            if (!isInGrid({x: x, y: y})) {
                hasFocus = false;
            }
            o = getCellAt(x, y);
            lastMovedCell = currentCell;
            currentCell = o;
            if (!hasFocus) {
                return;
            }
            hovers = {};
            if (!resizingItem
                    && o
                    && scrollModes.indexOf(o.context) === -1) {
                resizeItem = o;
                resizeMode = o.context;
                canvas.style.cursor = o.context;
                if (o.context === 'cell' && o.data) {
                    canvas.style.cursor = 'pointer';
                    hovers[o.data[uniqueId]] = [o.index];
                }
                if (selecting
                        && o.context === 'cell'
                        && o.data) {
                    dragBounds = {
                        top: Math.min(dragStartObject.rowIndex, o.rowIndex),
                        left: Math.min(dragStartObject.columnIndex, o.columnIndex),
                        bottom: Math.max(dragStartObject.rowIndex, o.rowIndex),
                        right: Math.max(dragStartObject.columnIndex, o.columnIndex)
                    };
                    if (dragStartObject.rowIndex !== o.rowIndex
                                || dragStartObject.columnIndex !== o.columnIndex) {
                        ignoreNextClick = true;
                    }
                    if ((!selectionBounds || (dragBounds.top !== selectionBounds.top
                            || dragBounds.left !== selectionBounds.left
                            || dragBounds.bottom !== selectionBounds.bottom
                            || dragBounds.right !== selectionBounds.right)) && !ctrl) {
                        selectionBounds = dragBounds;
                        selectArea(undefined, ctrl);
                        if (attributes.rowSelectionMode) {
                            for (i = selectionBounds.top; i <= selectionBounds.bottom; i += 1) {
                                selectRow(i, ctrl, true);
                            }
                        }
                    }
                    if (ctrl && o.selected) {
                        selections[o.rowIndex].splice(selections[o.rowIndex].indexOf(o.columnIndex), 1);
                    } else {
                        selections[o.rowIndex] = selections[o.rowIndex] || [];
                        selections[o.rowIndex].push(o.columnIndex);
                    }
                    if (x > width - attributes.selectionScrollZone && x < width) {
                        scrollBox.scrollLeft += attributes.selectionScrollIncrement;
                        setTimer = true;
                    }
                    if (y > height - attributes.selectionScrollZone && y < height) {
                        scrollBox.scrollTop += attributes.selectionScrollIncrement;
                        setTimer = true;
                    }
                    if (x - attributes.selectionScrollZone - headerCellWidth < 0) {
                        scrollBox.scrollLeft -= attributes.selectionScrollIncrement;
                        setTimer = true;
                    }
                    if (y - attributes.selectionScrollZone - headerCellHeight < 0) {
                        scrollBox.scrollTop -= attributes.selectionScrollIncrement;
                        setTimer = true;
                    }
                    if (setTimer) {
                        scrollTimer = setTimeout(mousemove, attributes.scrollRepeatRate, e);
                    }
                }
            }
            draw(true);
        }
        function dataFilter(row) {
            return (filterBy === '' && filterValue === '') ||
                currentFilter(row[filterBy], filterValue);
        }
        /**
         * Removes the context menu if it is present.
         * @memberof canvasDataGrid#
         * @method
         */
        function disposeContextMenu(e) {
            //TODO: there are most likely some bugs around removing the context menu.  Can't use grid on first click sometimes
            function disp() {
                contextMenu = undefined;
                canvas.cursor = 'pointer';
                document.body.removeEventListener('click', disposeContextMenu);
                document.body.removeEventListener('mouseup', disp);
                document.body.removeEventListener('mousedown', disp);
            }
            if (!e || (contextMenu
                                && contextMenu.parentNode
                                && !contextMenu.contains(e.target))) {
                contextMenu.parentNode.removeChild(contextMenu);
                document.body.addEventListener('mouseup', disp);
                document.body.addEventListener('mousedown', disp);
            }
        }
        function refreshFromOrigialData() {
            data = originalData.filter(function (row) {
                return true;
            });
        }
        /**
         * Sets the value of the filter.
         * @memberof canvasDataGrid#
         * @method
         * @param {string} column Name of the column to filter.
         * @param {string} value The value to filter for.
         */
        function setFilter(column, value) {
            var header;
            filterBy = column;
            filterValue = value;
            if (!column || value === '') {
                refreshFromOrigialData();
            }
            header = getHeaderByName(column);
            if (!header) {
                return;
            }
            currentFilter = header.filter;
            data = originalData.filter(function (row) {
                return currentFilter(row[filterBy], filterValue);
            });
            resize();
            draw(true);
        }
        function contextmenu(e) {
            if (!hasFocus) {
                return;
            }
            if (contextMenu) {
                e.preventDefault();
                return disposeContextMenu();
            }
            var oPreventDefault = e.preventDefault,
                pos = position(parentNode),
                loc = {},
                contextObject,
                filterContainer,
                filterLabel,
                filterInput,
                menuItems;
            pos = {
                x: e.clientX - pos.left,
                y: e.clientY - pos.top
            };
            contextObject = getCellAt(pos.x, pos.y);
            if (contextObject.grid !== undefined) {
                return;
            }
            if (!contextObject.header) { e.preventDefault(); return; }
            filterContainer = document.createElement('div');
            filterLabel = document.createElement('div');
            filterLabel.className = 'canvas-datagrid-context-menu-label';
            filterInput = document.createElement('input');
            filterLabel.innerHTML = 'Filter';
            filterContainer.appendChild(filterLabel);
            filterContainer.appendChild(filterInput);
            contextMenu = document.createElement('div');
            contextMenu.className = 'canvas-datagrid-context-menu';
            contextMenu.style.cursor = 'pointer';
            contextMenu.style.position = 'absolute';
            contextMenu.style.zIndex = '3';
            filterInput.value = filterValue || '';
            menuItems = [];
            if (attributes.showFilter) {
                menuItems.push({
                    title: filterContainer
                });
                if (filterValue) {
                    menuItems.push({
                        title: 'Remove Filter',
                        click: function removeFilterClick() {
                            e.preventDefault();
                            setFilter();
                            disposeContextMenu();
                            controlInput.focus();
                        }
                    });
                }
            }
            if (attributes.saveAppearance
                    && (Object.keys(sizes.rows).length > 0
                        || Object.keys(sizes.columns).length > 0)) {
                menuItems.push({
                    title: 'Reset column and row sizes',
                    click: function (e) {
                        e.preventDefault();
                        sizes.rows = {};
                        sizes.columns = {};
                        dispatchEvent('resizecolumn', [style.columnWidth], intf);
                        dispatchEvent('resizerow', [style.cellHeight], intf);
                        setStorageData();
                        resize(true);
                        disposeContextMenu();
                        controlInput.focus();
                    }
                });
            }
            if (attributes.allowColumnReordering) {
                menuItems.push({
                    title: 'Order by ' + contextObject.header.name + ' ascending',
                    click: function (e) {
                        e.preventDefault();
                        order(contextObject.header.name, 'asc');
                        disposeContextMenu();
                        controlInput.focus();
                    }
                });
                menuItems.push({
                    title: 'Order by ' + contextObject.header.name + ' descending',
                    click: function (e) {
                        e.preventDefault();
                        order(contextObject.header.name, 'desc');
                        disposeContextMenu();
                        controlInput.focus();
                    }
                });
            }
            if (dispatchEvent('contextmenu', [e, contextObject, menuItems, contextMenu], intf)) { return; }
            if (!menuItems.length) {
                return;
            }
            menuItems.forEach(function (item) {
                var row = document.createElement('div');
                contextMenu.appendChild(row);
                if (typeof item.title === 'string') {
                    row.className = 'canvas-datagrid-context-menu-item';
                    row.innerHTML = item.title;
                } else {
                    row.appendChild(item.title);
                }
                if (item.click) {
                    row.addEventListener('click', function contextClickProxy(e) {
                        item.click.apply(this, [e, contextObject, disposeContextMenu]);
                        e.preventDefault();
                        e.stopPropagation();
                        controlInput.focus();
                    });
                }
            });
            filterInput.addEventListener('dblclick', stopPropagation);
            filterInput.addEventListener('click', stopPropagation);
            filterInput.addEventListener('mousedown', stopPropagation);
            filterInput.addEventListener('keyup', function filterKeyUp() {
                setFilter(contextObject.header.name, filterInput.value);
                requestAnimationFrame(function filterRequestAnimationFrame() {
                    filterInput.classList.remove(invalidSearchExpClass);
                    if (invalidFilterRegEx) {
                        filterInput.classList.add(invalidSearchExpClass);
                    }
                });
            });
            document.body.addEventListener('click', disposeContextMenu);
            document.body.appendChild(contextMenu);
            loc.x = e.clientX - style.contextMenuMarginLeft;
            loc.y = e.clientY - style.contextMenuMarginTop;
            if (loc.x + contextMenu.offsetWidth > document.documentElement.clientWidth) {
                loc.x = document.documentElement.clientWidth - contextMenu.offsetWidth;
            }
            if (loc.y + contextMenu.offsetHeight > document.documentElement.clientHeight) {
                loc.y = document.documentElement.clientHeight - contextMenu.offsetHeight;
            }
            contextMenu.style.left = loc.x + 'px';
            contextMenu.style.top = loc.y + 'px';
            oPreventDefault.apply(e);
        }
        /**
         * Gets the bounds of current selection. 
         * @returns {rect} selection.
         * @memberof canvasDataGrid#
         * @method
         */
        function getSelectionBounds() {
            var low = {x: Infinity, y: Infinity},
                high = {x: -Infinity, y: -Infinity};
            data.forEach(function (row, rowIndex) {
                var maxCol, minCol;
                if (selections[rowIndex] && selections[rowIndex].length) {
                    low.y = rowIndex < low.y ? rowIndex : low.y;
                    high.y = rowIndex > high.y ? rowIndex : high.y;
                    maxCol = Math.max.apply(null, selections[rowIndex]);
                    minCol = Math.min.apply(null, selections[rowIndex]);
                    low.x = minCol < low.x ? minCol : low.x;
                    high.x = maxCol > high.x ? maxCol : high.x;
                }
            });
            return {
                top: low.y,
                left: low.x,
                bottom: high.y,
                right: high.x
            };
        }
        /**
         * Returns the number of pixels to scroll down to line up with row rowIndex.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} rowIndex The row index of the row to scroll find.
         */
        function findRowScrollTop(rowIndex) {
            var top = 0, x = 0, l = data.length,
                cellBorder = style.cellBorderWidth * 2;
            if (!attributes.showNewRow) {
                l -= 1;
            }
            if (rowIndex > l) {
                throw new Error('Impossible row index');
            }
            while (x < rowIndex) {
                top += (sizes.rows[data[x][uniqueId]] || style.cellHeight) + cellBorder;
                x += 1;
            }
            //TODO: This is not super accurate, causes pageUp/Dn to not move around right
            return top - (sizes.rows[data[rowIndex][uniqueId]] || style.cellHeight);
        }
        /**
         * Returns the number of pixels to scroll to the left to line up with column columnIndex.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} columnIndex The column index of the column to find.
         */
        function findColumnScrollLeft(columnIndex) {
            var left = 0, y = 0, s = getSchema(), l = s.length - 1;
            if (columnIndex > l) {
                throw new Error('Impossible column index');
            }
            while (y < columnIndex) {
                left += sizes.columns[s[y][uniqueId]] || s[y].width;
                y += 1;
            }
            return left;
        }
        /**
         * Scrolls the cell at cell x, row y.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} x The column index of the cell to scroll to.
         * @param {number} y The row index of the cell to scroll to.
         */
        function gotoCell(x, y) {
            if (x !== undefined) {
                scrollBox.scrollLeft = findColumnScrollLeft(x);
            }
            if (y !== undefined) {
                scrollBox.scrollTop = findRowScrollTop(y);
            }
        }
        /**
         * Scrolls the row y.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} y The row index of the cell to scroll to.
         */
        function gotoRow(y) {
            gotoCell(0, y);
        }
        /**
         * Scrolls the cell at cell x, row y into view if it is not already.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} x The column index of the cell to scroll into view.
         * @param {number} y The row index of the cell to scroll into view.
         */
        function scrollIntoView(x, y) {
            if (visibleCells.filter(function (cell) {
                    return (cell.rowIndex === y || y === undefined)
                        && (cell.columnIndex === x || x === undefined)
                        && cell.x > 0
                        && cell.y > 0
                        && cell.x + cell.width < width
                        && cell.y + cell.height < height;
                }).length === 0) {
                gotoCell(x, y);
            }
        }
        /**
         * Sets the active cell. Requires redrawing.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} x The column index of the cell to set active.
         * @param {number} y The row index of the cell to set active.
         */
        function setActiveCell(x, y) {
            activeCell = [x, y];
        }
        /**
         * Inserts a new column before the specified index into the schema.
         * @see canvasDataGrid#schema
         * @tutorial schema
         * @memberof canvasDataGrid#
         * @method
         * @param {column} rowIndex The column to insert into the schema.
         * @param {number} index The index of the row to insert before.
         */
        function insertColumn(c, index) {
            var s = getSchema();
            if (s.length < index) {
                throw new Error('Index is beyond the length of the schema.');
            }
            intf.schema = s.splice(index, 0, c);
        }
        /**
         * Deletes a column from the schema at the specified index.
         * @memberof canvasDataGrid#
         * @tutorial schema
         * @method
         * @param {number} index The index of the column to delete.
         */
        function deleteColumn(index) {
            var s = getSchema();
            intf.schema = s.splice(index, 1);
        }
        /**
         * Adds a new column into the schema.
         * @see canvasDataGrid#schema
         * @tutorial schema
         * @memberof canvasDataGrid#
         * @method
         * @param {column} c The column to add to the schema.
         */
        function addColumn(c) {
            var s = getSchema();
            intf.schema = s.push(c);
        }
        /**
         * Deletes a row from the dataset at the specified index.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} index The index of the row to delete.
         */
        function deleteRow(index) {
            originalData.splice(index, 1);
            setFilter(filterBy, filterValue);
            resize(true);
        }
        /**
         * Inserts a new row into the dataset before the specified index.
         * @memberof canvasDataGrid#
         * @method
         * @param {object} d data.
         * @param {number} index The index of the row to insert before.
         */
        function insertRow(d, index) {
            if (originalData.length < index) {
                throw new Error('Index is beyond the length of the dataset.');
            }
            originalData.splice(index, 0, d);
            setFilter(filterBy, filterValue);
            resize(true);
        }
        /**
         * Adds a new row into the dataset.
         * @memberof canvasDataGrid#
         * @method
         * @param {object} d data.
         */
        function addRow(d) {
            originalData.push(d);
            setFilter(filterBy, filterValue);
            resize(true);
        }
        /**
         * Sets the height of a given row by index number.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} rowIndex The index of the row to set.
         * @param {number} height Height to set the row to.
         */
        function setRowHeight(rowIndex, height) {
            sizes.rows[data[rowIndex][uniqueId]] = height;
            draw(true);
        }
        /**
         * Sets the height of a given row by index number.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} rowIndex The index of the row to set.
         * @param {number} height Height to set the row to.
         */
        function setColumnWidth(colIndex, width) {
            var s = getSchema();
            sizes.columns[s[colIndex][uniqueId]] = width;
            draw(true);
        }
        /**
         * Removes any changes to the width of the columns due to user or api interaction, setting them back to the schema or style default.
         * @memberof canvasDataGrid#
         * @tutorial schema
         * @method
         */
        function resetColumnWidths() {
            sizes.columns = {};
            draw(true);
        }
        /**
         * Removes any changes to the height of the rows due to user or api interaction, setting them back to the schema or style default.
         * @memberof canvasDataGrid#
         * @tutorial schema
         * @method
         */
        function resetRowHeights() {
            sizes.rows = {};
            draw(true);
        }
        /**
         * Ends editing, optionally aborting the edit.
         * @memberof canvasDataGrid#
         * @method
         * @param {boolean} abort When true, abort the edit.
         */
        function endEdit(abort) {
            var cell = input.editCell,
                y = cell.rowIndex;
            function abortEdit() {
                abort = true;
            }
            if (dispatchEvent('beforeendedit', [input.value, cell.value,
                    abortEdit, cell, input], intf)) { return false; }
            if (input.value !== cell.value && !abort) {
                changes[y] = changes[y] || {};
                changes[y][cell.header.name] = input.value;
                cell.data[cell.header.name] = input.value;
                if (y === data.length) {
                    if (dispatchEvent('newrow', [input.value, cell.value,
                            abort, cell, input], intf)) { return false; }
                    uId += 1;
                    addRow(cell.data);
                    createNewRowData();
                }
                draw(true);
            }
            document.body.removeChild(input);
            controlInput.focus();
            dispatchEvent('endedit', [input.value, abort, cell, input], intf);
            input = undefined;
            return true;
        }
        /**
         * Begins editing at cell x, row y.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} x The column index of the cell to edit.
         * @param {number} y The row index of the cell to edit.
         */
        function beginEditAt(x, y) {
            if (!attributes.editable) { return; }
            var top, left, cell, s = getVisibleSchema();
            cell = visibleCells.filter(function (vCell) {
                return vCell.columnIndex === x && vCell.rowIndex === y;
            })[0];
            if (dispatchEvent('beforebeginedit', [cell], intf)) { return false; }
            scrollIntoView(x, y);
            setActiveCell(x, y);
            function postDraw() {
                var pos = position(parentNode);
                cell = visibleCells.filter(function (vCell) {
                    return vCell.columnIndex === x && vCell.rowIndex === y;
                })[0];
                top = cell.y + style.cellBorderWidth;
                left = cell.x + style.cellBorderWidth;
                scrollEdit = {
                    scrollTop: scrollBox.scrollTop,
                    scrollLeft: scrollBox.scrollLeft,
                    inputTop: top,
                    inputLeft: left
                };
                input = document.createElement(attributes.multiLine ? 'textarea' : 'input');
                document.body.appendChild(input);
                input.className = 'canvas-datagrid-edit-input';
                input.style.position = 'absolute';
                input.style.border = 'none';
                input.style.top = pos.top + top + 'px';
                input.style.left = pos.left + left + 'px';
                input.style.height = cell.height - (style.cellBorderWidth * 2) + 'px';
                input.style.width = cell.width - (style.cellBorderWidth * 2)
                    - style.cellPaddingLeft + 'px';
                input.style.zIndex = '2';
                input.value = cell.value;
                input.editCell = cell;
                clipElement(input);
                input.focus();
                input.addEventListener('click', stopPropagation);
                input.addEventListener('dblclick', stopPropagation);
                input.addEventListener('mouseup', stopPropagation);
                input.addEventListener('mousedown', stopPropagation);
                input.addEventListener('keydown', function (e) {
                    var nx = cell.columnIndex,
                        ny = cell.rowIndex;
                    // esc
                    if (e.keyCode === 27) {
                        endEdit(true);
                        draw(true);
                    // enter
                    } else if (e.keyCode === 13) {
                        endEdit();
                        draw(true);
                    } else if (e.keyCode === 9) {
                        e.preventDefault();
                        if (!endEdit()) {
                            return;
                        }
                        if (e.shiftKey) {
                            nx -= 1;
                        } else {
                            nx += 1;
                        }
                        if (nx < 0) {
                            nx = s.length - 1;
                            ny -= 1;
                        }
                        if (nx > s.length - 1) {
                            nx = 0;
                            ny += 1;
                        }
                        if (ny < 0) {
                            ny = data.length - 1;
                        }
                        if (ny > data.length - 1) {
                            ny = 0;
                        }
                        beginEditAt(nx, ny);
                    }
                });
            }
            requestAnimationFrame(postDraw);
            dispatchEvent('beginedit', [cell, input], intf);
        }
        function click(e) {
            var index,
                i,
                selectionChanged,
                ctrl = (e.controlKey || e.metaKey || attributes.persistantSelectionMode),
                pos = position(parentNode);
            pos = {
                x: e.clientX - pos.left,
                y: e.clientY - pos.top
            };
            currentCell = getCellAt(pos.x, pos.y);
            if (currentCell.grid !== undefined) {
                return;
            }
            function checkSelectionChange() {
                if (!selectionChanged) { return; }
                dispatchEvent('selectionchanged',
                    [getSelectedData(), selections, selectionBounds], intf);
            }
            if (input) {
                endEdit();
            }
            if (ignoreNextClick) {
                ignoreNextClick = false;
                return;
            }
            i = currentCell;
            if (dispatchEvent('click', [e, currentCell], intf)) { return; }
            if (!hasFocus) {
                return;
            }
            if (!e.shiftKey && !ctrl) {
                selections = [];
                selectionChanged = true;
            }
            if (currentCell.context === 'cell') {
                if (currentCell.style === 'cornerCell') {
                    order(uniqueId, 'asc');
                    setFilter();
                    checkSelectionChange();
                    return;
                }
                if (currentCell.style === 'headerCell') {
                    if (orderBy === i.header.name) {
                        orderDirection = orderDirection === 'asc' ? 'desc' : 'asc';
                    } else {
                        orderDirection = 'asc';
                    }
                    order(i.header.name, orderDirection);
                    checkSelectionChange();
                    return;
                }
                if (['rowHeaderCell', 'headerCell'].indexOf(currentCell.style) === -1) {
                    setActiveCell(i.columnIndex, i.rowIndex);
                }
                selections[i.rowIndex] = selections[i.rowIndex] || [];
                if (attributes.rowSelectionMode || currentCell.style === 'rowHeaderCell') {
                    if (currentCell.style === 'rowHeaderCell'
                            && attributes.tree && pos.x > 0
                            && pos.x - currentCell.x < style.treeArrowWidth
                            + style.treeArrowMarginLeft
                            + style.treeArrowMarginRight + style.treeArrowClickRadius
                            && pos.y - currentCell.y < style.treeArrowHeight
                            + style.treeArrowMarginTop + style.treeArrowClickRadius
                            && pos.y > 0) {
                        toggleTree(i.rowIndex);
                        return;
                    }
                    selectionChanged = true;
                    selectRow(i.rowIndex, ctrl, true);
                }
                if (e.shiftKey && !ctrl) {
                    selectionBounds = getSelectionBounds();
                    selectArea(undefined, false);
                }
            }
            checkSelectionChange();
            draw(true);
        }
        function dragResizeColumn(e) {
            var pos = position(parentNode), x, y;
            pos = {
                x: e.clientX - pos.left,
                y: e.clientY - pos.top
            };
            x = resizingStartingWidth + pos.x - dragStart.x;
            y = resizingStartingHeight + pos.y - dragStart.y;
            if (x < style.minColumnWidth) {
                x = style.minColumnWidth;
            }
            if (y < style.minRowHeight) {
                y = style.minRowHeight;
            }
            if (dispatchEvent('resizecolumn', [x, y, resizingItem], intf)) { return false; }
            if (scrollBox.scrollLeft > scrollBox.scrollWidth - attributes.resizeScrollZone
                    && resizeMode === 'ew-resize') {
                resize(true);
                scrollBox.scrollLeft += x;
            }
            if (resizeMode === 'ew-resize') {
                sizes.columns[resizingItem.header.style === 'rowHeaderCell'
                       ? 'cornerCell' : resizingItem.header[uniqueId]] = x;
                if (['rowHeaderCell', 'cornerCell'].indexOf(resizingItem.header.style) !== -1) {
                    resize(true);
                }
                resizeChildGrids();
                return;
            }
            if (resizeMode === 'ns-resize') {
                if (resizingItem.rowOpen) {
                    sizes.trees[resizingItem.data[uniqueId]] = y;
                } else if (attributes.globalRowResize) {
                    style.cellHeight = y;
                } else {
                    sizes.rows[resizingItem.data[uniqueId]] = y;
                }
                dispatchEvent('resizerow', [y], intf);
                resizeChildGrids();
                return;
            }
            ellipsisCache = {};
        }
        function stopDragResize() {
            resize();
            document.body.removeEventListener('mousemove', dragResizeColumn, false);
            document.body.removeEventListener('mouseup', stopDragResize, false);
            setStorageData();
            draw(true);
            ignoreNextClick = true;
        }
        function scrollGrid(e) {
            var pos = position(parentNode);
            pos = {
                x: e.clientX - pos.left,
                y: e.clientY - pos.top
            };
            scrollMode = getCellAt(pos.x, pos.y).context;
            if (scrollMode === 'horizontal-scroll-box' && scrollStartMode !== 'horizontal-scroll-box') {
                scrollStartMode = 'horizontal-scroll-box';
                dragStart = pos;
                scrollStart.left = scrollBox.scrollLeft;
                clearTimeout(scrollTimer);
                return;
            }
            if (scrollMode === 'vertical-scroll-box' && scrollStartMode !== 'vertical-scroll-box') {
                scrollStartMode = 'vertical-scroll-box';
                dragStart = pos;
                scrollStart.top = scrollBox.scrollTop;
                clearTimeout(scrollTimer);
                return;
            }
            if (scrollStartMode === 'vertical-scroll-box'
                    && scrollMode !== 'vertical-scroll-box') {
                scrollMode = 'vertical-scroll-box';
            }
            if (scrollStartMode === 'horizontal-scroll-box'
                    && scrollMode !== 'horizontal-scroll-box') {
                scrollMode = 'horizontal-scroll-box';
            }
            clearTimeout(scrollTimer);
            if (scrollModes.indexOf(scrollMode) === -1) {
                return;
            }
            if (scrollMode === 'vertical-scroll-box') {
                scrollBox.scrollTop = scrollStart.top + ((pos.y - dragStart.y)
                    / scrollBox.heightBoxRatio);
            } else if (scrollMode === 'vertical-scroll-top') {
                scrollBox.scrollTop -= (page * style.cellHeight);
                scrollTimer = setTimeout(scrollGrid, attributes.scrollRepeatRate, e);
            } else if (scrollMode === 'vertical-scroll-bottom') {
                scrollBox.scrollTop += (page * style.cellHeight);
                scrollTimer = setTimeout(scrollGrid, attributes.scrollRepeatRate, e);
            }
            if (scrollMode === 'horizontal-scroll-box') {
                scrollBox.scrollLeft = scrollStart.left + ((pos.x - dragStart.x)
                    / scrollBox.widthBoxRatio);
            } else if (scrollMode === 'horizontal-scroll-right') {
                scrollBox.scrollLeft += attributes.selectionScrollIncrement;
                scrollTimer = setTimeout(scrollGrid, attributes.scrollRepeatRate, e);
            } else if (scrollMode === 'horizontal-scroll-left') {
                scrollBox.scrollLeft -= attributes.selectionScrollIncrement;
                scrollTimer = setTimeout(scrollGrid, attributes.scrollRepeatRate, e);
            }
        }
        function stopScrollGrid() {
            clearTimeout(scrollTimer);
            document.body.removeEventListener('mousemove', scrollGrid, false);
        }
        function isInGrid(e) {
            if (e.x < 0
                    || e.x > width
                    || e.y < 0
                    || e.y > height) {
                return false;
            }
            return true;
        }
        function mousedown(e) {
            if (dispatchEvent('mousedown', [e, currentCell], intf)) { return; }
            if (!hasFocus) {
                return;
            }
            if (e.button === 2 || input) { return; }
            var pos = position(parentNode);
            dragStart = {
                x: e.clientX - pos.left,
                y: e.clientY - pos.top
            };
            scrollStart = {
                left: scrollBox.scrollLeft,
                top: scrollBox.scrollTop
            };
            dragStartObject = getCellAt(dragStart.x, dragStart.y);
            if (dragStartObject.isGrid) {
                return;
            }
            if (scrollModes.indexOf(dragStartObject.context) !== -1) {
                scrollMode = dragStartObject.context;
                scrollStartMode = dragStartObject.context;
                scrollGrid(e);
                document.body.addEventListener('mousemove', scrollGrid, false);
                document.body.addEventListener('mouseup', stopScrollGrid, false);
                ignoreNextClick = true;
                return;
            }
            if (resizeMode === 'cell') {
                selecting = true;
                if (attributes.rowSelectionMode) {
                    selectRow(dragStartObject.rowIndex, false, true);
                }
                return mousemove(e);
            }
            if (['ns-resize', 'ew-resize'].indexOf(resizeMode) !== -1) {
                resizingItem = resizeItem;
                if (resizingItem.rowOpen) {
                    resizingStartingHeight = sizes.trees[resizingItem.data[uniqueId]];
                } else {
                    resizingStartingHeight = sizes.rows[resizingItem.data[uniqueId]] || style.cellHeight;
                }
                resizingStartingWidth = sizes.columns[resizingItem.header.style === 'rowHeaderCell'
                       ? 'cornerCell' : resizingItem.header[uniqueId]] || resizingItem.header.width;
                document.body.addEventListener('mousemove', dragResizeColumn, false);
                document.body.addEventListener('mouseup', stopDragResize, false);
            }
        }
        function mouseup(e) {
            clearTimeout(scrollTimer);
            dispatchEvent('mouseup', [e, currentCell], intf);
            if (!hasFocus) {
                return;
            }
            if (currentCell && currentCell.grid !== undefined) {
                return;
            }
            if (contextMenu || input) { return; }
            selecting = undefined;
            resizingItem = undefined;
            if (dragStart && isInGrid(dragStart)) {
                controlInput.focus();
            }
            dragStartObject = undefined;
            e.preventDefault();
        }
        function keydown(e) {
            var i,
                x = activeCell[0],
                y = activeCell[1],
                ctrl = (e.controlKey || e.metaKey),
                last = data.length - 1,
                cols = getVisibleSchema().length - 1;
            if (dispatchEvent('keydown', [e, currentCell], intf)) { return; }
            if (!hasFocus) {
                return;
            }
            page = visibleRows.length - 3 - attributes.pageUpDownOverlap;
            if (attributes.showNewRow) {
                last += 1;
            }
            if (e.keyCode === 'Tab') {
                e.preventDefault();
            }
            //ArrowDown
            if (e.keyCode === 40) {
                y += 1;
            //ArrowUp
            } else if (e.keyCode === 38) {
                y -= 1;
            //ArrowLeft Tab
            } else if (e.keyCode === 37 || (e.shiftKey && e.keyCode === 9)) {
                x -= 1;
            //ArrowRight Tab
            } else if (e.keyCode === 39 || (!e.shiftKey && e.keyCode === 9)) {
                x += 1;
            //PageUp
            } else if (e.keyCode === 33) {
                y -= page;
            //PageDown
            } else if (e.keyCode === 34) {
                y += page;
            //Home ArrowUp
            } else if (e.keyCode === 36 || (ctrl && e.keyCode === 38)) {
                y = 0;
            //End ArrowDown
            } else if (e.keyCode === 35 || (ctrl && e.keyCode === 40)) {
                y = data.length - 1;
            //ArrowRight
            } else if (ctrl && e.keyCode === 39) {
                x = cols;
            //ArrowLeft
            } else if (ctrl && e.keyCode === 37) {
                x = 0;
            }
            //Enter
            if (e.keyCode === 13) {
                return beginEditAt(x, y);
            }
            //Space
            if (e.keyCode === 32) {
                selections = [];
                selections[Math.max(y - 1, 0)] = [];
                selections[Math.max(y - 1, 0)].push(x);
                selectionBounds = getSelectionBounds();
                if (attributes.rowSelectionMode) {
                    for (i = selectionBounds.top; i <= selectionBounds.bottom; i += 1) {
                        selectRow(i, ctrl, true);
                    }
                } else {
                    selectArea(undefined, ctrl);
                }
                e.preventDefault();
                draw(true);
                return;
            }
            if (x < 0) {
                x = 0;
            }
            if (y > last) {
                y = last;
            }
            if (y < 0) {
                y = 0;
            }
            if (x > cols) {
                x = cols;
            }
            // Arrows
            if (e.shiftKey && [37, 38, 39, 40].indexOf(e.keyCode) !== -1) {
                selections[Math.max(y - 1, 0)] = selections[Math.max(y - 1, 0)] || [];
                selections[Math.max(y - 1, 0)].push(x);
                selectionBounds = getSelectionBounds();
                selectArea(undefined, ctrl);
                draw(true);
            }
            if (x !== activeCell[0] || y !== activeCell[1]) {
                scrollIntoView(x !== activeCell[0] ? x : undefined, y !== activeCell[1] ? y : undefined);
                setActiveCell(x, y);
                if (!e.shiftKey && attributes.selectionFollowsActiveCell) {
                    if (!ctrl) {
                        selections = [];
                    }
                    selections[y] = selections[y] || [];
                    selections[y].push(x);
                    dispatchEvent('selectionchanged', [getSelectedData(), selections, selectionBounds], intf);
                }
                draw(true);
            }
        }
        function keyup(e) {
            if (dispatchEvent('keyup', [e, currentCell], intf)) { return; }
            if (!hasFocus) {
                return;
            }
            controlInput.value = '';
        }
        function keypress(e) {
            if (!hasFocus) {
                return;
            }
            if (dispatchEvent('keypress', [e, currentCell], intf)) { return; }
        }
        function defaults(obj1, obj2, key, def) {
            obj1[key] = obj2[key] === undefined ? def : obj2[key];
        }
        function setAttributes() {
            defaultAttributes.forEach(function eachAttribute(i) {
                defaults(attributes, args, i[0], i[1]);
            });
        }
        function setStyle() {
            defaultStyles.forEach(function eachStyle(i) {
                defaults(style, args.style || {}, i[0], i[1]);
            });
        }
        function autosize(colName) {
            getVisibleSchema().forEach(function (col) {
                if (col.name === colName || colName === undefined) {
                    fitColumnToValues(col.name);
                }
            });
            fitColumnToValues('cornerCell');
        }
        function dblclick(e) {
            if (dispatchEvent('dblclick', [e, currentCell], intf)) { return; }
            if (!hasFocus) {
                return;
            }
            if (currentCell.context === 'ew-resize'
                    && currentCell.style === 'headerCell') {
                fitColumnToValues(currentCell.header.name);
            } else if (currentCell.context === 'ew-resize'
                    && currentCell.style === 'cornerCell') {
                autosize();
            } else if (['cell', 'activeCell'].indexOf(currentCell.style) !== -1) {
                beginEditAt(currentCell.columnIndex, currentCell.rowIndex);
            }
        }
        function dispose() {
            if (!isChildGrid && canvas && canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
            eventParent.removeEventListener('mouseup', mouseup, false);
            eventParent.removeEventListener('mousedown', mousedown, false);
            eventParent.removeEventListener('dblclick', dblclick, false);
            eventParent.removeEventListener('click', click, false);
            eventParent.removeEventListener('mousemove', mousemove);
            eventParent.removeEventListener('mousewheel', scrollWheel, false);
            canvas.removeEventListener('contextmenu', contextmenu, false);
            canvas.removeEventListener('copy', copy);
            controlInput.removeEventListener('keypress', keypress, false);
            controlInput.removeEventListener('keyup', keyup, false);
            controlInput.removeEventListener('keydown', keydown, false);
            window.removeEventListener('resize', resize);
        }
        function attachCss() {
            var styleSheet,
                styleSheetBody = [],
                css = {
                    'canvas-datagrid-canvas': {
                        position: 'absolute!important',
                        'z-index': '-1'
                    },
                    'canvas-datagrid-scrollBox': {
                        position: 'absolute!important',
                        overflow: 'auto!important',
                        'z-index': '1!important'
                    },
                    'canvas-datagrid': {
                        position: 'absolute!important',
                        background: style.backgroundColor,
                        'z-index': '1',
                        'box-sizing': 'content-box!important',
                        padding: '0!important'
                    },
                    'canvas-datagrid-control-input': {
                        position: 'absolute!important',
                        border: 'none!important',
                        background: 'transparet!important',
                        opacity: '0!important',
                        cursor: 'pointer!important',
                        width: '1px',
                        height: '1px'
                    },
                    'canvas-datagrid-edit-input': {
                        'box-sizing': 'content-box!important',
                        outline: 'none!important',
                        margin: '0!important',
                        padding: '0 0 0 ' + style.editCellPaddingLeft + 'px!important',
                        'font-size': style.editCellFontSize + '!important',
                        'font-family': style.editCellFontFamily + '!important'
                    },
                    'canvas-datagrid-context-menu-item': {
                        margin: style.contextMenuItemMargin,
                        'border-radius': style.contextMenuItemBorderRadius
                    },
                    'canvas-datagrid-context-menu-item:hover': {
                        background: style.contextMenuHoverBackground,
                        color: style.contextMenuHoverColor,
                        margin: style.contextMenuItemMargin
                    },
                    'canvas-datagrid-context-menu-label': {
                        display: style.contextMenuLabelDisplay,
                        'min-width': style.contextMenuLabelMinWidth
                    },
                    'canvas-datagrid-context-menu': {
                        'font-family': style.contextMenuFontFamily,
                        'font-size': style.contextMenuFontSize,
                        background: style.contextMenuBackground,
                        color: style.contextMenuColor,
                        border: style.contextMenuBorder,
                        padding: style.contextMenuPadding,
                        'border-radius': style.contextMenuBorderRadius,
                        opacity: style.contextMenuOpacity
                    },
                    'canvas-datagrid-invalid-search-regExp': {
                        background: style.contextMenuFilterInvalidExpresion
                    }
                };
            Object.keys(css).forEach(function (className) {
                styleSheetBody.push('.' + className + '{');
                Object.keys(css[className]).forEach(function (propertyName) {
                    styleSheetBody.push(propertyName + ':' + css[className][propertyName] + ';');
                });
                styleSheetBody.push('}');
            });
            if (document.getElementById(uniqueId)) {
                return;
            }
            styleSheet = document.createElement('link');
            styleSheet.id = uniqueId;
            styleSheet.rel = 'stylesheet';
            if (document.head.firstChild) {
                document.head.insertBefore(styleSheet, document.head.firstChild);
            } else {
                document.head.appendChild(styleSheet);
            }
            styleSheet.href = 'data:text/css;base64,'
                + btoa(style.styleSheet || styleSheetBody.join(''));
        }
        function scrollWheel(e) {
            if (dispatchEvent('mousewheel', [e, ctx], intf)) {
                return;
            }
            var l = scrollBox.scrollLeft,
                t = scrollBox.scrollTop;
            if (hasFocus) {
                scrollBox.scrollTop -= e.wheelDeltaY;
                scrollBox.scrollLeft -= e.wheelDeltaX;
            }
            if (t !== scrollBox.scrollTop || l !== scrollBox.scrollLeft) {
                e.preventDefault();
            }
        }
        function copy(e) {
            var rows = [], sData = getSelectedData();
            sData.forEach(function (row) {
                if (row) {
                    var r = [];
                    Object.keys(row).forEach(function (key) {
                        r.push(row[key]);
                    });
                    r.join(',');
                    rows.push(r);
                }
            });
            e.clipboardData.setData('text/plain', rows.join('\n'));
            e.preventDefault();
        }
        function appendTo(n) {
            parentNode = n;
            height = parentNode.offsetHeight;
            width = parentNode.offsetWidth;
            if (parentNode && /canvas-datagrid-(cell|tree)/.test(parentNode.nodeType)) {
                isChildGrid = true;
                parentGrid = parentNode.parentGrid;
                ctx = parentGrid.context;
                canvas = parentGrid.canvas;
                controlInput = parentGrid.controlInput;
                eventParent = parentGrid;
                intf.offsetParent = parentNode;
            } else {
                controlInput = document.createElement('input');
                controlInput.className = 'canvas-datagrid-control-input';
                isChildGrid = false;
                parentDOMNode = parentNode;
                parentNode = parentDOMNode;
                canvas = document.createElement('canvas');
                ctx = canvas.getContext('2d');
                ctx.textBaseline = 'alphabetic';
                parentDOMNode.appendChild(canvas);
                parentDOMNode.appendChild(controlInput);
                eventParent = canvas;
            }
            eventParent.addEventListener('mouseup', mouseup, false);
            eventParent.addEventListener('mousedown', mousedown, false);
            eventParent.addEventListener('dblclick', dblclick, false);
            eventParent.addEventListener('click', click, false);
            eventParent.addEventListener('mousemove', mousemove);
            eventParent.addEventListener('mousewheel', scrollWheel, false);
            canvas.addEventListener('contextmenu', contextmenu, false);
            canvas.addEventListener('copy', copy);
            controlInput.addEventListener('keypress', keypress, false);
            controlInput.addEventListener('keyup', keyup, false);
            controlInput.addEventListener('keydown', keydown, false);
        }
        function setDom() {
            window.addEventListener('resize', function resizeEvent() { requestAnimationFrame(resize); });
            appendTo(args.parentNode);
            attachCss();
        }
        function initScrollBox() {
            var sHeight = 0,
                sWidth = 0,
                scrollTop = 0,
                scrollLeft = 0,
                scrollHeight = 0,
                scrollWidth = 0,
                scrollBoxHeight = 20,
                scrollBoxWidth = 20;
            Object.defineProperty(scrollBox, 'scrollBoxHeight', {
                get: function () {
                    return scrollBoxHeight;
                },
                set: function (value) {
                    scrollBoxHeight = value;
                }
            });
            Object.defineProperty(scrollBox, 'scrollBoxWidth', {
                get: function () {
                    return scrollBoxWidth;
                },
                set: function (value) {
                    scrollBoxWidth = value;
                }
            });
            Object.defineProperty(scrollBox, 'height', {
                get: function () {
                    return sHeight;
                },
                set: function (value) {
                    if (scrollHeight < value) {
                        scrollTop = 0;
                    }
                    sHeight = value;
                }
            });
            Object.defineProperty(scrollBox, 'width', {
                get: function () {
                    return sWidth;
                },
                set: function (value) {
                    sWidth = value;
                }
            });
            Object.defineProperty(scrollBox, 'scrollTop', {
                get: function () {
                    return scrollTop;
                },
                set: function (value) {
                    if (value < 0) {
                        value = 0;
                    }
                    if (value > scrollHeight) {
                        value = scrollHeight;
                    }
                    if (scrollHeight < 0) {
                        value = 0;
                    }
                    scrollTop = value;
                    scroll();
                }
            });
            Object.defineProperty(scrollBox, 'scrollLeft', {
                get: function () {
                    return scrollLeft;
                },
                set: function (value) {
                    if (value < 0) {
                        value = 0;
                    }
                    if (value > scrollWidth) {
                        value = scrollWidth;
                    }
                    if (scrollWidth < 0) {
                        value = 0;
                    }
                    scrollLeft = value;
                    scroll();
                }
            });
            Object.defineProperty(scrollBox, 'scrollHeight', {
                get: function () {
                    return scrollHeight;
                },
                set: function (value) {
                    if (scrollTop > value) {
                        scrollTop = Math.max(value, 0);
                    }
                    if (scrollHeight < sHeight) {
                        scrollTop = 0;
                    }
                    scrollHeight = value;
                }
            });
            Object.defineProperty(scrollBox, 'scrollWidth', {
                get: function () {
                    return scrollWidth;
                },
                set: function (value) {
                    if (scrollLeft > value) {
                        scrollLeft = Math.max(value, 0);
                    }
                    scrollWidth = value;
                }
            });
        }
        function init() {
            setAttributes();
            setStyle();
            initScrollBox();
            setDom();
            intf.type = 'canvas-datagrid';
            intf.addEventListener = addEventListener;
            intf.removeEventListener = removeEventListener;
            intf.dispatchEvent = dispatchEvent;
            intf.dispose = dispose;
            intf.appendTo = appendTo;
            intf.filters = filters;
            intf.autosize = autosize;
            intf.beginEditAt = beginEditAt;
            intf.endEdit = endEdit;
            intf.setActiveCell = setActiveCell;
            intf.scrollIntoView = scrollIntoView;
            intf.clearChangeLog = clearChangeLog;
            intf.gotoCell = gotoCell;
            intf.gotoRow = gotoRow;
            intf.findColumnScrollLeft = findColumnScrollLeft;
            intf.findRowScrollTop = findRowScrollTop;
            intf.fitColumnToValues = fitColumnToValues;
            intf.findColumnMaxTextLength = findColumnMaxTextLength;
            intf.disposeContextMenu = disposeContextMenu;
            intf.getCellAt = getCellAt;
            intf.order = order;
            intf.draw = draw;
            intf.selectArea = selectArea;
            intf.clipElement = clipElement;
            intf.getSchemaFromData = getSchemaFromData;
            intf.setFilter = setFilter;
            intf.selectRow = selectRow;
            intf.parentGrid = parentGrid;
            intf.toggleTree = toggleTree;
            intf.expandTree = expandTree;
            intf.collapseTree = collapseTree;
            intf.canvas = canvas;
            intf.context = ctx;
            intf.insertRow = insertRow;
            intf.deleteRow = deleteRow;
            intf.addRow = addRow;
            intf.insertColumn = insertColumn;
            intf.deleteColumn = deleteColumn;
            intf.addColumn = addColumn;
            intf.getClippingRect = getClippingRect;
            intf.setRowHeight = setRowHeight;
            intf.setColumnWidth = setColumnWidth;
            intf.resetColumnWidths = resetColumnWidths;
            intf.resetRowHeights = resetRowHeights;
            intf.resize = resize;
            intf.drawChildGrids = drawChildGrids;
            intf.blur = function () {
                hasFocus = false;
            };
            intf.focus = function () {
                hasFocus = true;
                controlInput.focus();
            };
            Object.defineProperty(intf, 'height', {
                get: function () {
                    return parentNode.height;
                },
                set: function (value) {
                    parentNode.height = value;
                    resize(true);
                }
            });
            Object.defineProperty(intf, 'width', {
                get: function () {
                    return parentNode.width;
                },
                set: function (value) {
                    parentNode.width = value;
                    resize(true);
                }
            });
            Object.defineProperty(intf, 'openChildren', {
                get: function () {
                    return openChildren;
                }
            });
            Object.defineProperty(intf, 'childGrids', {
                get: function () {
                    return childGrids;
                }
            });
            Object.defineProperty(intf, 'isChildGrid', {
                get: function () {
                    return isChildGrid;
                }
            });
            Object.defineProperty(intf, 'parentNode', {
                get: function () {
                    return parentNode;
                },
                set: function (value) {
                    parentNode = value;
                }
            });
            Object.defineProperty(intf, 'offsetParent', {
                get: function () {
                    return parentNode;
                },
                set: function (value) {
                    parentNode = value;
                }
            });
            Object.defineProperty(intf, 'offsetLeft', {
                get: function () {
                    return parentNode.offsetLeft;
                }
            });
            Object.defineProperty(intf, 'offsetTop', {
                get: function () {
                    return parentNode.offsetTop;
                }
            });
            Object.defineProperty(intf, 'scrollHeight', {
                get: function () {
                    return scrollBox.scrollHeight;
                }
            });
            Object.defineProperty(intf, 'scrollWidth', {
                get: function () {
                    return scrollBox.scrollWidth;
                }
            });
            Object.defineProperty(intf, 'scrollTop', {
                get: function () {
                    return scrollBox.scrollTop;
                },
                set: function (value) {
                    scrollBox.scrollTop = value;
                    scroll();
                }
            });
            Object.defineProperty(intf, 'scrollLeft', {
                get: function () {
                    return scrollBox.scrollLeft;
                },
                set: function (value) {
                    scrollBox.scrollLeft = value;
                    scroll();
                }
            });
            Object.defineProperty(intf, 'sizes', {
                get: function () {
                    return sizes;
                }
            });
            Object.defineProperty(intf, 'input', {
                get: function () {
                    return input;
                }
            });
            Object.defineProperty(intf, 'controlInput', {
                get: function () {
                    return controlInput;
                }
            });
            Object.defineProperty(intf, 'currentCell', {
                get: function () {
                    return currentCell;
                }
            });
            Object.defineProperty(intf, 'visibleCells', {
                get: function () {
                    return visibleCells;
                }
            });
            Object.defineProperty(intf, 'visibleRows', {
                get: function () {
                    return visibleRows;
                }
            });
            Object.defineProperty(intf, 'selections', {
                get: function () {
                    return selections;
                }
            });
            Object.defineProperty(intf, 'resizeMode', {
                get: function () {
                    return resizeMode;
                }
            });
            Object.defineProperty(intf, 'changes', {
                get: function () {
                    return changes;
                }
            });
            intf.attributes = {};
            intf.style = {};
            intf.formatters = formatters;
            intf.filters = filters;
            Object.keys(style).forEach(function (key) {
                Object.defineProperty(intf.style, key, {
                    get: function () {
                        return style[key];
                    },
                    set: function (value) {
                        style[key] = value;
                        draw(true);
                    }
                });
            });
            Object.keys(attributes).forEach(function (key) {
                Object.defineProperty(intf.attributes, key, {
                    get: function () {
                        return attributes[key];
                    },
                    set: function (value) {
                        attributes[key] = value;
                        draw(true);
                    }
                });
            });
            filters.string = function (value, filterFor) {
                if (!filterFor) { return true; }
                var filterRegExp;
                invalidFilterRegEx = undefined;
                try {
                    filterRegExp = new RegExp(filterFor, 'ig');
                } catch (e) {
                    invalidFilterRegEx = e;
                    return;
                }
                return filterRegExp.test(value);
            };
            filters.number = function (value, filterFor) {
                if (!filterFor) { return true; }
                return value === filterFor;
            };
            Object.defineProperty(intf, 'selectionBounds', {
                get: function () {
                    return getSelectionBounds();
                }
            });
            Object.defineProperty(intf, 'selectedRows', {
                get: function () {
                    return getSelectedData(true);
                }
            });
            Object.defineProperty(intf, 'selectedCells', {
                get: function () {
                    return getSelectedData();
                }
            });
            Object.defineProperty(intf, 'visibleSchema', {
                get: function () {
                    return getVisibleSchema().map(function eachDataRow(col) {
                        return col;
                    });
                }
            });
            Object.defineProperty(intf, 'schema', {
                get: function schemaGetter() {
                    return getSchema();
                },
                set: function schemaSetter(value) {
                    if (!Array.isArray(value) || typeof value[0] !== 'object') {
                        throw new Error('Schema must be an array of objects.');
                    }
                    if (value[0].name === undefined) {
                        throw new Error('Expected schema to contain an object with at least a name property.');
                    }
                    schema = value.map(function eachSchemaColumn(column, index) {
                        column.width = column.width || style.columnWidth;
                        column[uniqueId] = getSchemaNameHash(column.name);
                        column.filter = column.filter || filter(column.type);
                        column.type = column.type || 'string';
                        column.index = index;
                        return column;
                    });
                    createNewRowData();
                    resize(true);
                    dispatchEvent('schemachanged', [schema], intf);
                }
            });
            Object.defineProperty(intf, 'data', {
                get: function dataGetter() {
                    return data;
                },
                set: function dataSetter(value) {
                    if (!Array.isArray(value)
                            || (value.length > 0 && typeof value[0] !== 'object')) {
                        throw new Error('Data must be an array of objects.');
                    }
                    originalData = value.map(function eachDataRow(row) {
                        row[uniqueId] = uId;
                        uId += 1;
                        return row;
                    });
                    changes = [];
                    data = originalData.filter(dataFilter);
                    if (!schema && data.length > 0) {
                        tempSchema = getSchemaFromData();
                    }
                    if (!schema && data.length === 0) {
                        tempSchema = [{name: ''}];
                    }
                    if (tempSchema) {
                        dispatchEvent('schemachanged', [tempSchema], intf);
                    }
                    createNewRowData();
                    if (attributes.autoResizeColumns && data.length > 0
                            && storedSettings === undefined) {
                        autosize();
                    }
                    // width cannot be determined correctly until after inserted into the dom?
                    requestAnimationFrame(function () {
                        fitColumnToValues('cornerCell');
                    });
                    if (!resize()) { draw(true); }
                    dispatchEvent('datachanged', [data], intf);
                }
            });
            if (attributes.name && attributes.saveAppearance) {
                storedSettings = localStorage.getItem(storageName + '-' + attributes.name);
                if (storedSettings) {
                    try {
                        storedSettings = JSON.parse(storedSettings);
                    } catch (e) {
                        console.warn('could not read settings from localStore', e);
                        storedSettings = undefined;
                    }
                }
                if (storedSettings
                        && typeof storedSettings.sizes === 'object') {
                    sizes.rows = storedSettings.sizes.rows;
                    sizes.columns = storedSettings.sizes.columns;
                    ['trees', 'columns', 'rows'].forEach(function (i) {
                        if (!sizes[i]) {
                            sizes[i] = {};
                        }
                    });
                }
                storedSettings = undefined;
            }
            if (args.data) {
                intf.data = args.data;
            }
            if (args.schema) {
                intf.schema = args.schema;
            }
            if (!data) {
                intf.data = [];
            }
            resize(true);
        }
        init();
        return intf;
    }
    return grid;
});
