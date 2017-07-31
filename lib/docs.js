/**
 * Hierarchal canvas based data grid.
 * @class 
 * @name canvasDataGrid
 * @see https://tonygermaneri.github.io/canvas-datagrid/docs/tutorial-sample.html
 * @see https://github.com/TonyGermaneri/canvas-datagrid
 * @author Tony Germaneri (TonyGermaneri@gmail.com)
 * @param {object} args Parameters for the grid.
 * @param {object} args.parentNode HTML element that will hold the grid.  This element must have a height, the canvas will match itself to this element's dimensions.
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
 * @param {boolean} [args.showColumnHeaders=true] - When true, headers are shown.
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
 * @param {boolean} [args.showCopy=true] - When true, copy will appear on the context menu when it is available.
 * @param {boolean} [args.copyText=Copy] - The text that appears on the context menu when copy is available.
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
 * @property {boolean} isGrid - When true, the cell is a grid.
 * @property {boolean} isHeader - When true, the cell is a column header.
 * @property {boolean} isRowHeader - When true, the cell is a row header.
 * @property {boolean} isCorner - When true, the cell is the upper left corner cell.
 * @property {string} horizontalAlignment - The horizontal alignment of the cell.
 * @property {string} verticalAlignment - The vertical alignment of the cell.
 * @property {string} innerHTML - HTML, if any, in the cell.
 * @property {object} text - The text object in the cell.
 * @property {object} text.x - The x coordinate of the text.
 * @property {object} text.y - The y coordinate of the text.
 * @property {object} text.width - The width of the text, including truncation and ellipsis.
 * @property {object} text.value - The value of the text, including truncation and ellipsis.
 */
/**
 * Styles for the canvas data grid.
 * @class
 * @name canvasDataGrid.style
* @property {string} [activeCellBackgroundColor=rgba(255, 255, 255, 1)] - Style of activeCellBackgroundColor.
* @property {string} [activeCellBorderColor=rgba(110, 168, 255, 1)] - Style of activeCellBorderColor.
* @property {number} [activeCellBorderWidth=0.25] - Style of activeCellBorderWidth.
* @property {string} [activeCellColor=rgba(0, 0, 0, 1)] - Style of activeCellColor.
* @property {string} [activeCellFont=16px sans-serif] - Style of activeCellFont.
* @property {string} [activeCellHoverBackgroundColor=rgba(255, 255, 255, 1)] - Style of activeCellHoverBackgroundColor.
* @property {string} [activeCellHoverColor=rgba(0, 0, 0, 1)] - Style of activeCellHoverColor.
* @property {string} [activeCellOverlayBorderColor=rgba(66, 133, 244, 1)] - Style of activeCellOverlayBorderColor.
* @property {number} [activeCellOverlayBorderWidth=1.50] - Style of activeCellOverlayBorderWidth.
* @property {number} [activeCellPaddingBottom=5] - Style of activeCellPaddingBottom.
* @property {number} [activeCellPaddingLeft=5] - Style of activeCellPaddingLeft.
* @property {number} [activeCellPaddingRight=7] - Style of activeCellPaddingRight.
* @property {number} [activeCellPaddingTop=5] - Style of activeCellPaddingTop.
* @property {string} [activeCellSelectedBackgroundColor=rgba(236, 243, 255, 1)] - Style of activeCellSelectedBackgroundColor.
* @property {string} [activeCellSelectedColor=rgba(0, 0, 0, 1)] - Style of activeCellSelectedColor.
* @property {string} [activeHeaderCellBackgroundColor=rgba(225, 225, 225, 1)] - Style of activeHeaderCellBackgroundColor.
* @property {string} [activeHeaderCellColor=rgba(0, 0, 0, 1)] - Style of activeHeaderCellColor.
* @property {string} [activeRowHeaderCellBackgroundColor=rgba(225, 225, 225, 1)] - Style of activeRowHeaderCellBackgroundColor.
* @property {string} [activeRowHeaderCellColor=rgba(0, 0, 0, 1)] - Style of activeRowHeaderCellColor.
* @property {number} [autocompleteBottomMargin=60] - Style of autocompleteBottomMargin.
* @property {number} [autosizeHeaderCellPadding=8] - Style of autosizeHeaderCellPadding.
* @property {number} [autosizePadding=5] - Style of autosizePadding.
* @property {string} [backgroundColor=rgba(240, 240, 240, 1)] - Style of backgroundColor.
* @property {number} [cellAutoResizePadding=13] - Style of cellAutoResizePadding.
* @property {string} [cellBackgroundColor=rgba(255, 255, 255, 1)] - Style of cellBackgroundColor.
* @property {string} [cellBorderColor=rgba(195, 199, 202, 1)] - Style of cellBorderColor.
* @property {number} [cellBorderWidth=0.25] - Style of cellBorderWidth.
* @property {string} [cellColor=rgba(0, 0, 0, 1)] - Style of cellColor.
* @property {string} [cellFont=16px sans-serif] - Style of cellFont.
* @property {number} [cellHeight=24] - Style of cellHeight.
* @property {number} [cellHeightWithChildGrid=150] - Style of cellHeightWithChildGrid.
* @property {string} [cellHorizontalAlignment=left] - Style of cellHorizontalAlignment.
* @property {string} [cellHoverBackgroundColor=rgba(255, 255, 255, 1)] - Style of cellHoverBackgroundColor.
* @property {string} [cellHoverColor=rgba(0, 0, 0, 1)] - Style of cellHoverColor.
* @property {number} [cellPaddingBottom=5] - Style of cellPaddingBottom.
* @property {number} [cellPaddingLeft=5] - Style of cellPaddingLeft.
* @property {number} [cellPaddingRight=7] - Style of cellPaddingRight.
* @property {number} [cellPaddingTop=5] - Style of cellPaddingTop.
* @property {string} [cellSelectedBackgroundColor=rgba(236, 243, 255, 1)] - Style of cellSelectedBackgroundColor.
* @property {string} [cellSelectedColor=rgba(0, 0, 0, 1)] - Style of cellSelectedColor.
* @property {string} [cellVerticalAlignment=center] - Style of cellVerticalAlignment.
* @property {number} [cellWidthWithChildGrid=250] - Style of cellWidthWithChildGrid.
* @property {number} [childContextMenuMarginLeft=-5] - Style of childContextMenuMarginLeft.
* @property {number} [childContextMenuMarginTop=0] - Style of childContextMenuMarginTop.
* @property {string} [childContextMenuArrowHTML=&#x25BA;] - Style of childContextMenuArrowHTML.
* @property {string} [childContextMenuArrowColor=rgba(43, 48, 43, 1)] - Style of childContextMenuArrowColor.
* @property {string} [contextMenuChildArrowFontSize=12px] - Style of contextMenuChildArrowFontSize.
* @property {number} [columnWidth=250] - Style of columnWidth.
* @property {string} [contextMenuBackground=rgba(240, 240, 240, 1)] - Style of contextMenuBackground.
* @property {string} [contextMenuBorder=solid 1px rgba(158, 163, 169, 1)] - Style of contextMenuBorder.
* @property {string} [contextMenuBorderRadius=3px] - Style of contextMenuBorderRadius.
* @property {string} [contextMenuColor=rgba(43, 48, 43, 1)] - Style of contextMenuColor.
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
* @property {string} [contextFilterButtonHTML=&#x25BC;] - Style of contextFilterButtonHTML.
* @property {string} [contextFilterButtonBorder=solid 1px rgba(158, 163, 169, 1)] - Style of contextFilterButtonBorder.
* @property {string} [contextFilterButtonBorderRadius=3px] - Style of contextFilterButtonBorderRadius.
* @property {string} [cornerCellBackgroundColor=rgba(240, 240, 240, 1)] - Style of cornerCellBackgroundColor.
* @property {string} [cornerCellBorderColor=rgba(202, 202, 202, 1)] - Style of cornerCellBorderColor.
* @property {string} [editCellBorder=solid 1px rgba(110, 168, 255, 1)] - Style of editCellBorder.
* @property {string} [editCellBoxShadow=0 2px 5px rgba(0,0,0,0.4)] - Style of editCellBoxShadow.
* @property {string} [editCellFontFamily=sans-serif] - Style of editCellFontFamily.
* @property {string} [editCellFontSize=16px] - Style of editCellFontSize.
* @property {number} [editCellPaddingLeft=4] - Style of editCellPaddingLeft.
* @property {string} [editCellColor=black] - Style of editCellColor.
* @property {string} [editCellBackgroundColor=white] - Style of editCellBackgroundColor.
* @property {string} [gridBorderColor=rgba(202, 202, 202, 1)] - Style of gridBorderColor.
* @property {number} [gridBorderWidth=1] - Style of gridBorderWidth.
* @property {string} [headerCellBackgroundColor=rgba(240, 240, 240, 1)] - Style of headerCellBackgroundColor.
* @property {string} [headerCellBorderColor=rgba(152, 152, 152, 1)] - Style of headerCellBorderColor.
* @property {number} [headerCellBorderWidth=0.25] - Style of headerCellBorderWidth.
* @property {string} [headerCellColor=rgba(50, 50, 50, 1)] - Style of headerCellColor.
* @property {string} [headerCellFont=16px sans-serif] - Style of headerCellFont.
* @property {number} [headerCellHeight=25] - Style of headerCellHeight.
* @property {string} [headerCellHorizontalAlignment=left] - Style of headerCellHorizontalAlignment.
* @property {string} [headerCellHoverBackgroundColor=rgba(235, 235, 235, 1)] - Style of headerCellHoverBackgroundColor.
* @property {string} [headerCellHoverColor=rgba(0, 0, 0, 1)] - Style of headerCellHoverColor.
* @property {number} [headerCellPaddingBottom=5] - Style of headerCellPaddingBottom.
* @property {number} [headerCellPaddingLeft=5] - Style of headerCellPaddingLeft.
* @property {number} [headerCellPaddingRight=7] - Style of headerCellPaddingRight.
* @property {number} [headerCellPaddingTop=5] - Style of headerCellPaddingTop.
* @property {string} [headerCellVerticalAlignment=center] - Style of headerCellVerticalAlignment.
* @property {string} [headerOrderByArrowBorderColor=rgba(195, 199, 202, 1)] - Style of headerOrderByArrowBorderColor.
* @property {number} [headerOrderByArrowBorderWidth=1] - Style of headerOrderByArrowBorderWidth.
* @property {string} [headerOrderByArrowColor=rgba(155, 155, 155, 1)] - Style of headerOrderByArrowColor.
* @property {number} [headerOrderByArrowHeight=8] - Style of headerOrderByArrowHeight.
* @property {number} [headerOrderByArrowMarginLeft=0] - Style of headerOrderByArrowMarginLeft.
* @property {number} [headerOrderByArrowMarginRight=5] - Style of headerOrderByArrowMarginRight.
* @property {number} [headerOrderByArrowMarginTop=6] - Style of headerOrderByArrowMarginTop.
* @property {number} [headerOrderByArrowWidth=13] - Style of headerOrderByArrowWidth.
* @property {number} [headerRowWidth=57] - Style of headerRowWidth.
* @property {number} [minColumnWidth=45] - Style of minColumnWidth.
* @property {number} [minHeight=24] - Style of minHeight.
* @property {number} [minRowHeight=24] - Style of minRowHeight.
* @property {string} [name=default] - Style of name.
* @property {string} [reorderMarkerBackgroundColor=rgba(0, 0, 0, 0.1)] - Style of reorderMarkerBackgroundColor.
* @property {string} [reorderMarkerBorderColor=rgba(0, 0, 0, 0.2)] - Style of reorderMarkerBorderColor.
* @property {number} [reorderMarkerBorderWidth=1.25] - Style of reorderMarkerBorderWidth.
* @property {string} [reorderMarkerIndexBorderColor=rgba(66, 133, 244, 1)] - Style of reorderMarkerIndexBorderColor.
* @property {number} [reorderMarkerIndexBorderWidth=2.75] - Style of reorderMarkerIndexBorderWidth.
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
 */
 // event docs go here
 /**
 * Fires when the selection changes.
 * @event
 * @name canvasDataGrid#selectionchanged
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.selectedData Selected data.
 * @param {array} e.selections Selections object. 2D matrix of selections.
 * @param {rectangle} e.selectionsBounds rectangle object describing the selection bounds.
 */
 /**
 * Fires when the user clicks on the "drill in" arrow.  When the arrow is clicked a new
 * grid is created and nested inside of the row.  The grid, the row data and row index are passed
 * to the event listener.  From here you can manipulate the inner grid.  A grid is not disposed
 * when the tree is collapsed, just hidden, but grids are not created until the arrow is clicked.
 * @event
 * @name canvasDataGrid#expandtree
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.treeGrid New, or if reopened existing, grid.
 * @param {object} e.data The row's data.
 * @param {object} e.rowIndex The row index that was expanded.
 */
 /**
 * Fires when the user click the "drill in" arrow on a row that is already expanded.
 * @event
 * @name canvasDataGrid#collapsetree
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.childGrid New, or if reopened existing, grid.
 * @param {object} e.data The row's data.
 * @param {object} e.rowIndex The row index that was expanded.
 */
 /**
 * Fires when the user scrolls the grid.
 * @event
 * @name canvasDataGrid#scroll
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {number} e.top The new scroll top.
 * @param {number} e.left The new scroll left.
 */
 /**
 * Fires when the data setter is set.
 * @event
 * @name canvasDataGrid#datachanged
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.data Data.
 */
 /**
 * Fires when the schema setter is set.
 * @event
 * @name canvasDataGrid#schemachanged
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.schema Schema.
 */
 /**
 * Fires when a mouseweel event occurs.
 * @event
 * @name canvasDataGrid#mousewheel
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native mouseweel event.
 */
 /**
 * Fires when a copy is performed.
 * @event
 * @name canvasDataGrid#copy
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native copy event.
 */
 /**
 * Fired just before a cell is drawn onto the canvas.  `e.preventDefault();` prevents the cell from being drawn.
 * You would only use this if you want to completely stop the cell from being drawn and generally muck up everything.
 * @event
 * @name canvasDataGrid#beforerendercell
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
 * @name canvasDataGrid#rendercell
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.header Current header object.
 * @param {canvasDataGrid.cell} e.cell Current cell.
 * @param {object} e.x The current cells x coordinate.
 * @param {object} e.y The current cells y coordinate.
 */
 /**
 * Fires just after a cell is drawn.  If you want to draw things in the cell, this is the event to attach to.
 * Drawing on the canvas is allowed.  Altering the context of the canvas is allowed.
 * @event
 * @name canvasDataGrid#afterrendercell
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.header Current header object.
 * @param {canvasDataGrid.cell} e.cell Current cell.
 * @param {object} e.x The current cells x coordinate.
 * @param {object} e.y The current cells y coordinate.
 */
 /**
 * Fires when text is drawn into a cell.  If you want to change the color of the text, this is the event to attach to.
 * To alter what text finally appears in the cell, change the value of `cell.formattedValue`.  Keep in mind this
 * text will still be subject to the ellipsis function that truncates text when the width is too long for the cell.
 * You cannot alter the cell's height or width from this event, use `rendercell` event instead.
 * @event
 * @name canvasDataGrid#rendertext
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.header Current header object.
 * @param {canvasDataGrid.cell} e.cell Current cell.
 * @param {object} e.x The current cells x coordinate.
 * @param {object} e.y The current cells y coordinate.
 */
 /**
 * Fires when the order by arrow is drawn onto the canvas.  This is the only way
 * to completely replace the order arrow graphic.  Call `e.preventDefault()` to stop the default arrow from being drawn.
 * @event
 * @name canvasDataGrid#renderorderbyarrow
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.header Current header object.
 * @param {canvasDataGrid.cell} e.cell Current cell.
 * @param {object} e.x The current cells x coordinate.
 * @param {object} e.y The current cells y coordinate.
 */
 /**
 * Fires when the tree arrow is drawn onto the canvas.  This is the only way
 * to completely replace the tree arrow graphic.  Call `e.preventDefault()` to stop the default arrow from being drawn.
 * @event
 * @name canvasDataGrid#rendertreearrow
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.header Current header object.
 * @param {canvasDataGrid.cell} e.cell Current cell.
 * @param {object} e.x The current cells x coordinate.
 * @param {object} e.y The current cells y coordinate.
 */
 /**
 * Fires when a cell grid is instantiated.  Allows you to alter the cell data grid.
 * Only fires once per grid.
 * @event
 * @name canvasDataGrid#rendercellgrid
 * @param {object} e Event object
 * @param {object} e.ctx Canvas context.
 * @param {object} e.value Current cell value.
 * @param {object} e.row Current row data.
 * @param {object} e.header Current header object.
 * @param {canvasDataGrid.cell} e.cell Current cell.
 * @param {object} e.cell Current cell.
 * @param {object} e.x The current cells x coordinate.
 * @param {object} e.y The current cells y coordinate.
 */
 /**
 * Fires when a column is reordered.
 * @event
 * @name canvasDataGrid#ordercolumn
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.columnName Name of the column.
 * @param {object} e.direction Direction of the order.
 */
 /**
 * Fires when the mouse moves over the grid.
 * @event
 * @name canvasDataGrid#mousemove
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDataGrid.cell} e.cell Cell under mouse.
 */
 /**
 * Fires when a context menu is requested.  The menu item array can be altered to change what items appear on the menu.
 * You can add items to the context menu but they must conform to {@link canvasDataGrid.contextMenuItem}. 
 * Removing all items from the list of menu items will cause the context menu to not appear.
 * Calling `e.preventDefault();` will cause the context menu to not appear as well.
 * @event
 * @name canvasDataGrid#contextmenu
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native contextmenu event.
 * @param {canvasDataGrid.cell} e.cell Cell under mouse.
 * @param {object} e.items[](#contextMenuItem) Mutable list of menu items.
 * @param {object} e.contextMenu Context menu HTML element.
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
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {canvasDataGrid.cell} e.cell Current cell.
 * @param {object} e.newValue New value.
 * @param {object} e.oldValue Old value.
 * @param {function} e.abort Abort edit function.  Call this function to abort the edit.
  * @param {object} e.input Textarea or input HTMLElement depending on `attributes.multiLine`.
 */
 /**
 * Fires when the edit has ended.  This event gives you a chance to abort the edit
 * preserving original row data, or modify the value of the row data prior to being written.
 * @event
 * @name canvasDataGrid#endedit
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDataGrid.cell} e.cell Cell object.
 * @param {object} e.value New value.
 * @param {object} e.abort When true, the edit was aborted.
 * @param {object} e.input Textarea or input HTMLElement depending on `attributes.multiLine`.
 */
 /**
 * Fires when the edit has ended.  This event gives you a chance to abort the edit
 * preserving original row data, or modify the value of the row data prior to being written.
 * @event
 * @name canvasDataGrid#endedit
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDataGrid.cell} e.cell Cell object.
 * @param {object} e.value New value.
 * @param {object} e.abort When true, the edit was aborted.
 * @param {object} e.input Textarea or input HTMLElement depending on `attributes.multiLine`.
 */
 /**
 * Fires before a edit cell has been created giving you a chance to abort it.
 * `e.preventDefault();` will abort the edit cell from being created.
 * @event
 * @name canvasDataGrid#beforebeginedit
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {canvasDataGrid.cell} e.cell Cell object.
 */
 /**
 * Fires when an editor textarea (or input) has been created.
 * @event
 * @name canvasDataGrid#beginedit
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDataGrid.cell} e.cell Cell object.
 * @param {object} e.input Textarea or input HTMLElement depending on `attributes.multiLine`.
 */
 /**
 * Fires when the a touch event begins.
 * @event
 * @name canvasDataGrid#touchstart
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.NativeEvent Native touchstart event.
 * @param {canvasDataGrid.cell} e.cell Cell object.
 */
 /**
 * Fires when the a touch event ends.
 * @event
 * @name canvasDataGrid#touchend
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.NativeEvent Native touchend event.
 * @param {canvasDataGrid.cell} e.cell Cell object.
 */
 /**
 * Fires when the a touch move event occurs.
 * @event
 * @name canvasDataGrid#touchend
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.NativeEvent Native touchmove event.
 * @param {canvasDataGrid.cell} e.cell Cell object.
 */
 /**
 * Fires when the a touch event is canceled.
 * @event
 * @name canvasDataGrid#touchcancel
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.NativeEvent Native touchcancel event.
 * @param {canvasDataGrid.cell} e.cell Cell object.
 */
 /**
 * Fires when the grid is clicked.
 * @event
 * @name canvasDataGrid#click
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDataGrid.cell} e.cell Cell object.
 */
 /**
 * Fires when a column is about to be resized.
 * `e.preventDefault();` will abort the resize.
 * @event
 * @name canvasDataGrid#resizecolumn
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {object} e.x x pixel position of the resize.
 * @param {object} e.y y pixel position of the resize.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {canvasDataGrid.cell} e.cell The mutable cell to be resized.
 */
 /**
 * Fires when the mouse button is pressed down on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDataGrid#mousedown
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native mousedown event.
 * @param {canvasDataGrid.cell} e.cell Cell object.
 */
 /**
 * Fires when the mouse button is pressed down on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDataGrid#mouseup
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native mouseup event.
 * @param {canvasDataGrid.cell} e.cell Cell object.
 */
 /**
 * Fires when the mouse button is double clicked on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * Note that this will necessarily require 2*`mousedown`, 2*`mouseup` and 2*`click` events to fire prior to the double click.
 * @event
 * @name canvasDataGrid#dblclick
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native dblclick event. 
 * @param {canvasDataGrid.cell} e.cell Cell object.
 */
 /**
 * Fires when the keyboard button is pressed down on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDataGrid#keydown
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native keydown event.
 * @param {canvasDataGrid.cell} e.cell Cell object.
 */
 /**
 * Fires when the keyboard button is released on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDataGrid#keyup
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native keyup event.
 * @param {canvasDataGrid.cell} e.cell Cell object.
 */
 /**
 * Fires when the keyboard press is completed on the grid.
 * `e.preventDefault();` will abort the default grid event.
 * @event
 * @name canvasDataGrid#keypress
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native keypress event.
 * @param {canvasDataGrid.cell} e.cell Cell object.
 */
 /**
 * Fires when grid is being resized.
 * @event
 * @name canvasDataGrid#resize
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 */
  /**
 * Fires when the mouse enters a cell.
 * @event
 * @name canvasDataGrid#cellmouseover
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDataGrid.cell} e.cell The cell being moved over.
 */
  /**
 * Fires when the mouse exits a cell.
 * @event
 * @name canvasDataGrid#cellmouseout
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {canvasDataGrid.cell} e.cell The cell being moved out of.
 */
  /**
 * Fires when a style has been changed.
 * @event
 * @name canvasDataGrid#stylechanged
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.styleName The name of the style being changed.
 * @param {object} e.styleValue The value of the style being changed.
 */
  /**
 * Fires when an attribute has been changed.
 * @event
 * @name canvasDataGrid#attributechanged
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 */
  /**
 * Fires as the user reorders a row or column.  Calling `e.preventDefault` will prevent the column from starting to be reordered.
 * @event
 * @name canvasDataGrid#reordering
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
 * @name canvasDataGrid#reorder
 * @param {object} e Event object.
 * @param {object} e.ctx Canvas context.
 * @param {function} e.preventDefault Prevents the default behavior.
 * @param {object} e.NativeEvent Native mousemove event.
 * @param {cell} e.source The header cell of the column or row being reordered.
 * @param {cell} e.target The header cell of the column or row that the dragged row or column will be inserted onto.
 * @param {string} e.dragMode When dragging a column `column-reorder`, when dragging a row `row-reorder`.
 */
