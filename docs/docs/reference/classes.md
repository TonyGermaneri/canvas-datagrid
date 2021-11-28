---
title: Classes
---

### canvasDatagrid

Hierarchical canvas based web component.

#### Properties

|Name|Type|Description|
|---|---|---|
|activeCell|object|Gets the active cell.  Consists of the properties rowIndex and columnIndex.|
|attributes|object|Object that contains the properties listed in the attributes section.  These properties can be used at runtime to alter attributes set during instantiation.  See the See {@link canvasDatagrid.params} section for full documentation.|
|canvas|object|The canvas element drawn onto for this grid.|
|changes|array|Array of changes and additions made to the grid since last time data was loaded.  The data property will change with changes as well, but this is a convince list of all the changes in one spot.  Calling `clearChangeLog` will clear this list.|
|childGrids|boolean|Child grids in this grid organized by internal unique row id.|
|columnOrder|array|Gets or sets the order of the columns.  This allows you to modify the appearance of the schema without modifying the data itself. The order of the array dictates the order of the columns, e.g.: [0, 1, 2] is normal order, [2, 1, 0] is reverse.  The array length must be equal to or greater than the number of columns.|
|controlInput|object|Input used for key controls on the grid.  Any clicks on the grid will cause this input to be focused.  This input is hidden above the top left corner of the browser window.|
|currentCell|canvasDatagrid.cell|Cell that the mouse moved over last.|
|data|canvasDatagrid.data|This is how data is set in the grid.  Data must be an array of objects that conform to a schema.  Data values can be any primitive type.  However if a cell value is another data array, an inner grid will be rendered into the cell.  This "cell grid" is different than a "tree grid" (the sort you drill in with a row header arrow) and uses the `cellGridAttributes` attribute for properties and styling. See {@link canvasDatagrid.data}.|
|dragMode|string|Represents the currently displayed resize cursor.  Can be `ns-resize`, `ew-resize`, `pointer`, or `inherit`.|
|filters|canvasDatagrid.filter|Object that contains a list of filters for filtering data.  The properties in this object match the `schema[].type` property.  For example, if the schema for a given column was of the type `date` the grid would look for a filter called `filters.date` if a filter cannot be found for a given data type a warning will be logged and the string/RegExp filter will be used.   See {@link canvasDatagrid.filters}.|
|formatters|canvasDatagrid.formatter|Object that contains formatting functions for displaying text.  The properties in this object match the `schema[].type` property.  For example, if the schema for a given column was of the type `date` the grid would look for a formatter called `formatters.date` if a formatter cannot be found for a given data type a warning will be logged and the string formatter will be used. Formatters must return a string value to be displayed in the cell.  See {@link canvasDatagrid.formatters}.|
|frozenColumn|number|The highest frozen column index.  Setting a value higher than the possible visible columns will result in a range error.|
|frozenRow|number|The highest frozen row index.  Setting a value higher than the possible visible rows will result in a range error.|
|hasActiveFilters|boolean|When true, grid data is being filtered.|
|hasFocus|boolean|When true, the grid is has focus.|
|height|number|Height of the grid.|
|input|object|Reference to the the edit cell when editing.  Undefined when not editing.  When editing, this DOM element is superimposed over the cell being edited and is fully visible.|
|isChildGrid|boolean|When true, this grid is a child grid of another grid.  Meaning, it appears as a tree grid or a cell grid of another parent grid.|
|isChildGrid|boolean|When true, this grid is within another grid.|
|offsetLeft|number|The offset left of the grid.|
|offsetTop|number|The offset top of the grid.|
|openChildren|boolean|List of open child grids by internal unique row id.|
|orderBy|string|The name of the column the grid is currently sorted by.  You can set this value to any column name to alter the sort order dependent on data type.  Subscribing to `beforesortcolumn` and calling `e.preventDefault` allows you to change the property and the graphical appearance of the grid (an order arrow will be drawn over the respective column) without invoking the client side ordering function.  This is useful if you want to use server side data ordering.|
|orderDirection|string|Gets or sets the order by direction.  Value can be `asc` for ascending order or `desc` for descending order.  Subscribing to `beforesortcolumn` and calling `e.preventDefault` allows you to change the property and the graphical appearance of the grid (an order arrow will be drawn over the respective column) without invoking the client side ordering function.  This is useful if you want to use server side data ordering.|
|parentGrid|canvasDatagrid|If this grid is a child grid, this is the grids parent.|
|parentNode|HTMLElement|The parent node of the canvas, usually the shadow DOM's parent element.|
|rowOrder|array|Gets or sets the order of the rows.  This allows you to modify the appearance of the data without modifying the data itself. The order of the array dictates the order of the rows, e.g.: [0, 1, 2] is normal order, [2, 1, 0] is reverse.  The array length must be equal to or greater than the number of rows.|
|schema|canvasDatagrid.schema|Schema is optional.  Schema is an array of {canvasDatagrid.header} objects.  If no schema is provided one will be generated from the data, in that case all data will be assumed to be string data. See {@link canvasDatagrid.schema}.|
|scrollHeight|number|The total number of pixels that can be scrolled down.|
|scrollIndexRect|object|Rect describing the view port of the virtual canvas in column and row indexes.  If you only want to do things to visible cells, this is a good property to check what the range of visible cells is.|
|scrollLeft|number|The current position of the horizontal scroll bar in pixels.|
|scrollPixelRect|object|Rect describing view port of the virtual canvas in pixels.|
|scrollTop|number|The current position of the vertical scroll bar in pixels.|
|scrollWidth|number|The total number of pixels that can be scrolled to the left.|
|selectedCells|array|Jagged array of cells that the user has selected.  Beware that because this is a jagged array, some indexes will be `null`.  Besides the `null`s this data looks just like the data you passed in, but just the cells the user has selected.  So if the user has selected cell 10 in a 10 column row, there will be 9 `null`s followed by the data from column 10.|
|selectedRows|array|Selected rows.  Same as the `data` property but filtered for the rows the user has cells selected in.  If any cell in the row is selected, all data for that row will appear in this array.|
|selectionBounds|rect|Bounds of current selection.|
|selections|array|Matrix array of selected cells.|
|shadowRoot|HTMLElement|The shadow root element.|
|sizes|object|Mutable object that contains `sizes.columns` and `sizes.rows` arrays.  These arrays control the sizes of the columns and rows.  If there is not an entry for the row or column index it will fall back to the style default.|
|sorters|canvasDatagrid.sorter|Object that contains a list of sorting functions for sorting columns.   See {@tutorial sorters}.|
|style|canvasDatagrid.style|Object that contains the properties listed in the style section.  Changing a style will automatically call `draw`.|
|visibleCells|array|Array of cell drawn.|
|visibleRowHeights|array|The heights of the visible rows.|
|visibleRows|array|Array of visible row indexes.|
|width|number|Width of the grid.|
### rect

A selection rectangle.

#### Properties

|Name|Type|Description|
|---|---|---|
|top|number|First row index.|
|bottom|number|Last row index.|
|left|number|First column index.|
|right|number|Last column index.|
### header

A header that describes the data in a column.  The term header and column are used interchangeably in this documentation.  The {@link canvasDatagrid.schema} is an array of {@link canvasDatagrid.header}.

#### Properties

|Name|Type|Description|
|---|---|---|
|name|string|The name of the header.  This must match the property name of an object in the {@link canvasDatagrid.data} array.  This is the only required property of a {@link canvasDatagrid.header}.  This value will appear at the top of the column unless {@link canvasDatagrid.header.title} is defined.|
|type|string|The data type of this header.  This value should match properties in {@link canvasDatagrid.formatters}, {@link canvasDatagrid.filters}, {@link canvasDatagrid.sorters} to take full advantage of formatting, sorting and filtering when not defining these properties within this header.|
|title|string|The value that is actually displayed to the user at the top of the column.  If no value is present, {@link canvasDatagrid.header.name} will be used instead.|
|width|number|The mutable width of this column in pixels.  The user can override this value if {@link canvasDatagrid.attributes.allowColumnResizing} is set to `true`.|
|hidden|boolean|When true, the column will not be included in the visible schema.  This means selection, copy, and drawing functions will not display this column or values from this column.|
|filter|function|A {@link canvasDatagrid.filter} function that defines how filters will work against data in this column.|
|formatter|function|A {@link canvasDatagrid.formatter} function that defines how data will be formatted when drawn onto cells belonging to this column.|
|sorter|function|A {@link canvasDatagrid.sorter} function that defines how data will sorted within this column.|
|defaultValue|function,string|The default value of this column for new rows.  This can be a function or string.  When using a string, this string value will be used in the new cell.  When using a function, it must return a string, which will be used in the new cell.  The arguments passed to this function are: argument[0] = {@link canvasDatagrid.header}, argument[1] = row index.|
### cell

A cell on the grid.

#### Properties

|Name|Type|Description|
|---|---|---|
|type|string|Data type used by this cell as dictated by the column.|
|style|string|Visual style of cell. Can be any one of cell, activeCell, columnHeaderCell, cornerCell, or rowHeaderCell. Prefix of each style name.|
|x|number|The x coordinate of this cell on the grid.|
|y|number|The y coordinate of this cell on the grid.|
|nodeType|string|Always 'canvas-datagrid-cell'.|
|offsetTop|number|The y coordinate of this cell on the grid canvas.|
|offsetLeft|number|The x coordinate of this cell on the grid canvas.|
|scrollTop|number|The scrollTop value of the scrollBox.|
|scrollLeft|number|The scrollLeft value of the scrollBox.|
|rowOpen|boolean|When true, this row is a tree grid enabled cell and the tree is in the open state.|
|hovered|boolean|When true, this cell is hovered.|
|selected|boolean|When true, this cell is selected.|
|active|boolean|When true, this cell is the active cell.|
|width|number|Width of the cell on the canvas.|
|height|number|Height of the cell on the canvas.|
|userWidth|number|User set width of the cell on the canvas. If undefined, the user has not set this column.|
|userHeight|number|Height of the cell on the canvas. If undefined, the user has not set this row.|
|data|object|The row of data this cell belongs to.|
|header|header|The schema column this cell belongs to.|
|columnIndex|number|The column index of the cell.|
|rowIndex|number|The row index of the cell.|
|sortColumnIndex|number|The column index of the cell after the user has reordered it.|
|sortRowIndex|number|The column index of the cell after the user has reordered it.|
|value|string|The value of the cell.|
|formattedValue|string|The value after passing through any formatters.  See {@link canvasDatagrid.formatters}.|
|isColumnHeaderCellCap|boolean|When true, the cell is the cap at the right side end of the header cells.|
|parentGrid|canvasDatagrid|The grid to which this cell belongs.|
|gridId|string|If this cell contains a grid, this is the grids unique id.|
|isGrid|boolean|When true, the cell is a grid.|
|isHeader|boolean|When true, the cell is a column or row header.|
|isColumnHeader|boolean|When true, the cell is a column header.|
|isRowHeader|boolean|When true, the cell is a row header.|
|isCorner|boolean|When true, the cell is the upper left corner cell.|
|activeHeader|boolean|When true, the cell is an active header cell, meaning the active cell is in the same row or column.|
|horizontalAlignment|string|The horizontal alignment of the cell.|
|verticalAlignment|string|The vertical alignment of the cell.|
|innerHTML|string|HTML, if any, in the cell.  If set, HTML will be rendered into the cell.|
|text|object|The text object in the cell.|
|text.x|object|The x coordinate of the text.|
|text.y|object|The y coordinate of the text.|
|text.width|object|The width of the text, including truncation and ellipsis.|
|text.value|object|The value of the text, including truncation and ellipsis.|
### style

Styles for the canvas data grid.  Standard CSS styles still apply but are not listed here.

#### Properties

|Name|Type|Description|
|---|---|---|
|activeCellBackgroundColor|string|Style of activeCellBackgroundColor.|
|activeCellBorderColor|string|Style of activeCellBorderColor.|
|activeCellBorderWidth|number|Style of activeCellBorderWidth.|
|activeCellColor|string|Style of activeCellColor.|
|activeCellFont|string|Style of activeCellFont.|
|activeCellHorizontalAlignment|string|Style of activeCellHorizontalAlignment.|
|activeCellHoverBackgroundColor|string|Style of activeCellHoverBackgroundColor.|
|activeCellHoverColor|string|Style of activeCellHoverColor.|
|activeCellOverlayBorderColor|string|Style of activeCellOverlayBorderColor.|
|activeCellOverlayBorderWidth|number|Style of activeCellOverlayBorderWidth.|
|activeCellPaddingBottom|number|Style of activeCellPaddingBottom.|
|activeCellPaddingLeft|number|Style of activeCellPaddingLeft.|
|activeCellPaddingRight|number|Style of activeCellPaddingRight.|
|activeCellPaddingTop|number|Style of activeCellPaddingTop.|
|activeCellSelectedBackgroundColor|string|Style of activeCellSelectedBackgroundColor.|
|activeCellSelectedColor|string|Style of activeCellSelectedColor.|
|activeCellVerticalAlignment|string|Style of activeCellVerticalAlignment.|
|activeHeaderCellBackgroundColor|string|Style of activeHeaderCellBackgroundColor.|
|activeHeaderCellColor|string|Style of activeHeaderCellColor.|
|activeRowHeaderCellBackgroundColor|string|Style of activeRowHeaderCellBackgroundColor.|
|activeRowHeaderCellColor|string|Style of activeRowHeaderCellColor.|
|autocompleteBottomMargin|number|Style of autocompleteBottomMargin.|
|autosizeHeaderCellPadding|number|Style of autosizeHeaderCellPadding.|
|autosizePadding|number|Style of autosizePadding.|
|cellAutoResizePadding|number|Style of cellAutoResizePadding.|
|cellBackgroundColor|string|Style of cellBackgroundColor.|
|cellBorderColor|string|Style of cellBorderColor.|
|cellBorderWidth|number|Style of cellBorderWidth.|
|cellColor|string|Style of cellColor.|
|cellFont|string|Style of cellFont.|
|cellGridHeight|number|Style of cellGridHeight.|
|cellHeight|number|Style of cellHeight.|
|cellHeightWithChildGrid|number|Style of cellHeightWithChildGrid.|
|cellHorizontalAlignment|string|Style of cellHorizontalAlignment.|
|cellHoverBackgroundColor|string|Style of cellHoverBackgroundColor.|
|cellHoverColor|string|Style of cellHoverColor.|
|cellLineHeight|number|The line height of each wrapping line as a percentage.|
|cellLineSpacing|number|Style of cellLineSpacing.|
|cellPaddingBottom|number|Style of cellPaddingBottom.|
|cellPaddingLeft|number|Style of cellPaddingLeft.|
|cellPaddingRight|number|Style of cellPaddingRight.|
|cellPaddingTop|number|Style of cellPaddingTop.|
|cellSelectedBackgroundColor|string|Style of cellSelectedBackgroundColor.|
|cellSelectedColor|string|Style of cellSelectedColor.|
|cellVerticalAlignment|string|Style of cellVerticalAlignment.|
|cellWhiteSpace|string|Style of cellWhiteSpace. Can be 'nowrap' or 'normal'.|
|cellWidth|number|Style of cellWidth.|
|cellWidthWithChildGrid|number|Style of cellWidthWithChildGrid.|
|childContextMenuArrowColor|string|Style of childContextMenuArrowColor.|
|childContextMenuArrowHTML|string|Style of childContextMenuArrowHTML.|
|childContextMenuMarginLeft|number|Style of childContextMenuMarginLeft.|
|childContextMenuMarginTop|number|Style of childContextMenuMarginTop.|
|columnHeaderCellBorderColor|string|Style of columnHeaderCellBorderColor.|
|columnHeaderCellBorderWidth|number|Style of columnHeaderCellBorderWidth.|
|columnHeaderCellCapBackgroundColor|string|Style of columnHeaderCellBackgroundColor.|
|columnHeaderCellCapBorderColor|string|Style of columnHeaderCellBackgroundColor.|
|columnHeaderCellCapBorderWidth|number|Style of columnHeaderCellBackgroundColor.|
|columnHeaderCellColor|string|Style of columnHeaderCellColor.|
|columnHeaderCellFont|string|Style of columnHeaderCellFont.|
|columnHeaderCellHeight|number|Style of columnHeaderCellHeight.|
|columnHeaderCellHorizontalAlignment|string|Style of columnHeaderCellHorizontalAlignment.|
|columnHeaderCellHoverBackgroundColor|string|Style of columnHeaderCellHoverBackgroundColor.|
|columnHeaderCellHoverColor|string|Style of columnHeaderCellHoverColor.|
|columnHeaderCellPaddingBottom|number|Style of columnHeaderCellPaddingBottom.|
|columnHeaderCellPaddingLeft|number|Style of columnHeaderCellPaddingLeft.|
|columnHeaderCellPaddingRight|number|Style of columnHeaderCellPaddingRight.|
|columnHeaderCellPaddingTop|number|Style of columnHeaderCellPaddingTop.|
|columnHeaderCellVerticalAlignment|string|Style of columnHeaderCellVerticalAlignment.|
|columnHeaderOrderByArrowBorderColor|string|Style of columnHeaderOrderByArrowBorderColor.|
|columnHeaderOrderByArrowBorderWidth|number|Style of columnHeaderOrderByArrowBorderWidth.|
|columnHeaderOrderByArrowColor|string|Style of columnHeaderOrderByArrowColor.|
|columnHeaderOrderByArrowHeight|number|Style of columnHeaderOrderByArrowHeight.|
|columnHeaderOrderByArrowMarginLeft|number|Style of columnHeaderOrderByArrowMarginLeft.|
|columnHeaderOrderByArrowMarginRight|number|Style of columnHeaderOrderByArrowMarginRight.|
|columnHeaderOrderByArrowMarginTop|number|Style of columnHeaderOrderByArrowMarginTop.|
|columnHeaderOrderByArrowWidth|number|Style of columnHeaderOrderByArrowWidth.|
|contextFilterButtonBorder|string|Style of contextFilterButtonBorder.|
|contextFilterButtonBorderRadius|string|Style of contextFilterButtonBorderRadius.|
|contextFilterButtonHTML|string|Style of contextFilterButtonHTML.|
|contextMenuArrowColor|string|Style of contextMenuArrowColor.|
|contextMenuArrowDownHTML|string|Style of contextMenuArrowDownHTML.|
|contextMenuArrowUpHTML|string|Style of contextMenuArrowUpHTML.|
|contextMenuBackground|string|Style of contextMenuBackground.|
|contextMenuBorder|string|Style of contextMenuBorder.|
|contextMenuBorderRadius|string|Style of contextMenuBorderRadius.|
|contextMenuChildArrowFontSize|string|Style of contextMenuChildArrowFontSize.|
|contextMenuColor|string|Style of contextMenuColor.|
|contextMenuCursor|string|Style of contextMenuCursor.|
|contextMenuFilterInvalidExpresion|string|Style of contextMenuFilterInvalidExpresion.|
|contextMenuFontFamily|string|Style of contextMenuFontFamily.|
|contextMenuFontSize|string|Style of contextMenuFontSize.|
|contextMenuHoverBackground|string|Style of contextMenuHoverBackground.|
|contextMenuHoverColor|string|Style of contextMenuHoverColor.|
|contextMenuItemBorderRadius|string|Style of contextMenuItemBorderRadius.|
|contextMenuItemMargin|string|Style of contextMenuItemMargin.|
|contextMenuLabelDisplay|string|Style of contextMenuLabelDisplay.|
|contextMenuLabelMargin|string|Style of contextMenuLabelMargin.|
|contextMenuLabelMaxWidth|string|Style of contextMenuLabelMaxWidth.|
|contextMenuLabelMinWidth|string|Style of contextMenuLabelMinWidth.|
|contextMenuMarginLeft|number|Style of contextMenuMarginLeft.|
|contextMenuMarginTop|number|Style of contextMenuMarginTop.|
|contextMenuOpacity|string|Style of contextMenuOpacity.|
|contextMenuPadding|string|Style of contextMenuPadding.|
|contextMenuWindowMargin|number|Style of contextMenuWindowMargin.|
|contextMenuZIndex|number|Style of contextMenuZIndex.|
|cornerCellBackgroundColor|string|Style of cornerCellBackgroundColor.|
|cornerCellBorderColor|string|Style of cornerCellBorderColor.|
|debugBackgroundColor|string|Style of debugBackgroundColor.|
|debugColor|string|Style of debugColor.|
|debugEntitiesColor|string|Style of debugEntitiesColor.|
|debugFont|string|Style of debugFont.|
|debugPerfChartBackground|string|Style of debugPerfChartBackground.|
|debugPerfChartTextColor|string|Style of debugPerfChartTextColor.|
|debugPerformanceColor|string|Style of debugPerformanceColor.|
|debugScrollHeightColor|string|Style of debugScrollHeightColor.|
|debugScrollWidthColor|string|Style of debugScrollWidthColor.|
|debugTouchPPSXColor|string|Style of debugTouchPPSXColor.|
|debugTouchPPSYColor|string|Style of debugTouchPPSYColor.|
|editCellBackgroundColor|string|Style of editCellBackgroundColor.|
|editCellBorder|string|Style of editCellBorder.|
|editCellBoxShadow|string|Style of editCellBoxShadow.|
|editCellColor|string|Style of editCellColor.|
|editCellFontFamily|string|Style of editCellFontFamily.|
|editCellFontSize|string|Style of editCellFontSize.|
|editCellPaddingLeft|number|Style of editCellPaddingLeft.|
|editCellZIndex|number|Style of editCellZIndex.|
|frozenMarkerActiveBorderColor|string|Style of frozenMarkerActiveBorderColor.|
|frozenMarkerActiveColor|string|Style of frozenMarkerActiveColor.|
|frozenMarkerBorderColor|string|Style of frozenMarkerBorderColor.|
|frozenMarkerBorderWidth|number|Style of frozenMarkerBorderWidth.|
|frozenMarkerColor|string|Style of frozenMarkerColor.|
|frozenMarkerWidth|number|Style of frozenMarkerWidth.|
|gridBackgroundColor|string|Style of gridBackgroundColor.|
|gridBorderCollapse|string|Style of gridBorderCollapse.  When grid border collapse is set to the default value of `collapse`, the bottom border and the top border of the next cell down will be merged into a single border.  The only other setting is `expand` which allows the full border to be drawn.|
|gridBorderColor|string|Style of gridBorderColor.|
|gridBorderWidth|number|Style of gridBorderWidth.|
|minColumnWidth|number|Style of minColumnWidth.|
|minHeight|number|Style of minHeight.|
|minRowHeight|number|Style of minRowHeight.|
|moveOverlayBorderColor|string|Style of moveOverlayBorderColor.|
|moveOverlayBorderSegments|string|Style of moveOverlayBorderSegments.|
|moveOverlayBorderWidth|number|Style of moveOverlayBorderWidth.|
|name|string|Style of name.|
|overflowX|string|When set to hidden, horizontal scroll bar will be hidden.  When set to auto horizontal scroll bar will appear when data overflows the width.  When set to scroll the horizontal scrollbar will always be visible.

 ['', 'normal'],|
|overflowY|string|When set to hidden, vertical scroll bar will be hidden.  When set to auto vertical scroll bar will appear when data overflows the height.  When set to scroll the vertical scrollbar will always be visible.|
|reorderMarkerBackgroundColor|string|Style of reorderMarkerBackgroundColor.|
|reorderMarkerBorderColor|string|Style of reorderMarkerBorderColor.|
|reorderMarkerBorderWidth|number|Style of reorderMarkerBorderWidth.|
|reorderMarkerIndexBorderColor|string|Style of reorderMarkerIndexBorderColor.|
|reorderMarkerIndexBorderWidth|number|Style of reorderMarkerIndexBorderWidth.|
|rowHeaderCellBackgroundColor|string|Style of rowHeaderCellBackgroundColor.|
|rowHeaderCellBorderColor|string|Style of rowHeaderCellBorderColor.|
|rowHeaderCellBorderWidth|number|Style of rowHeaderCellBorderWidth.|
|rowHeaderCellColor|string|Style of rowHeaderCellColor.|
|rowHeaderCellFont|string|Style of rowHeaderCellFont.|
|rowHeaderCellHeight|number|Style of rowHeaderCellHeight.|
|rowHeaderCellHorizontalAlignment|string|Style of rowHeaderCellHorizontalAlignment.|
|rowHeaderCellHoverBackgroundColor|string|Style of rowHeaderCellHoverBackgroundColor.|
|rowHeaderCellHoverColor|string|Style of rowHeaderCellHoverColor.|
|rowHeaderCellPaddingBottom|number|Style of rowHeaderCellPaddingBottom.|
|rowHeaderCellPaddingLeft|number|Style of rowHeaderCellPaddingLeft.|
|rowHeaderCellPaddingRight|number|Style of rowHeaderCellPaddingRight.|
|rowHeaderCellPaddingTop|number|Style of rowHeaderCellPaddingTop.|
|rowHeaderCellRowNumberGapColor|number|Style of rowHeaderCellRowNumberGapColor.|
|rowHeaderCellRowNumberGapHeight|number|Style of rowHeaderCellRowNumberGapHeight.|
|rowHeaderCellSelectedBackgroundColor|string|Style of rowHeaderCellSelectedBackgroundColor.|
|rowHeaderCellSelectedColor|string|Style of rowHeaderCellSelectedColor.|
|rowHeaderCellVerticalAlignment|string|Style of rowHeaderCellVerticalAlignment.|
|rowHeaderCellWidth|number|Style of rowHeaderCellWidth.|
|scrollBarActiveColor|string|Style of scrollBarActiveColor.|
|scrollBarBackgroundColor|string|Style of scrollBarBackgroundColor.|
|scrollBarBorderColor|string|Style of scrollBarBorderColor.|
|scrollBarBorderWidth|number|Style of scrollBarBorderWidth.|
|scrollBarBoxBorderRadius|number|Style of scrollBarBoxBorderRadius.|
|scrollBarBoxColor|string|Style of scrollBarBoxColor.|
|scrollBarBoxMargin|number|Style of scrollBarBoxMargin.|
|scrollBarBoxMinSize|number|Style of scrollBarBoxMinSize.|
|scrollBarBoxWidth|number|Style of scrollBarBoxWidth.|
|scrollBarCornerBackgroundColor|string|Style of scrollBarCornerBackgroundColor.|
|scrollBarCornerBorderColor|string|Style of scrollBarCornerBorderColor.|
|scrollBarWidth|number|Style of scrollBarWidth.|
|selectionHandleBorderColor|string|Style of selectionHandleBorderColor.|
|selectionHandleBorderWidth|number|Style of selectionHandleBorderWidth.|
|selectionHandleColor|string|Style of selectionHandleColor.|
|selectionHandleSize|number|Style of selectionHandleSize.|
|selectionHandleType|string|Style of selectionHandleType.  Can be square or circle.|
|selectionOverlayBorderColor|string|Style of selectionOverlayBorderColor.|
|selectionOverlayBorderWidth|number|Style of selectionOverlayBorderWidth.|
|treeArrowBorderColor|string|Style of treeArrowBorderColor.|
|treeArrowBorderWidth|number|Style of treeArrowBorderWidth.|
|treeArrowClickRadius|number|Style of treeArrowClickRadius.|
|treeArrowColor|string|Style of treeArrowColor.|
|treeArrowHeight|number|Style of treeArrowHeight.|
|treeArrowMarginLeft|number|Style of treeArrowMarginLeft.|
|treeArrowMarginRight|number|Style of treeArrowMarginRight.|
|treeArrowMarginTop|number|Style of treeArrowMarginTop.|
|treeArrowWidth|number|Style of treeArrowWidth.|
|treeGridHeight|number|Style of treeGridHeight.|
### contextMenuItem

An item in the context menu.

#### Properties

|Name|Type|Description|
|---|---|---|
|title|object|The title that will appear in the context menu.  If title is a `string` then the string will appear.  If title is a `HTMLElement` then it will be appended via `appendChild()` to the context menu row maintaining any events and references.|
|click|object|Optional function to invoke when this context menu item is clicked.  Neglecting to call `e.stopPropagation();` in your function will result in the mouse event bubbling up to the canvas undesirably.|
