/**
 * Hierarchical canvas based web component.
 * @property selectedRows - Selected rows.  Same as the `data` property but filtered for the rows the user has cells selected in.  If any cell in the row is selected, all data for that row will appear in this array.
 * @property selectedCells - Jagged array of cells that the user has selected.  Beware that because this is a jagged array, some indexes will be `null`.  Besides the `null`s this data looks just like the data you passed in, but just the cells the user has selected.  So if the user has selected cell 10 in a 10 column row, there will be 9 `null`s followed by the data from column 10.
 * @property changes - Array of changes and additions made to the grid since last time data was loaded.  The data property will change with changes as well, but this is a convince list of all the changes in one spot.  Calling `clearChangeLog` will clear this list.
 * @property input - Reference to the the edit cell when editing.  Undefined when not editing.  When editing, this DOM element is superimposed over the cell being edited and is fully visible.
 * @property controlInput - Input used for key controls on the grid.  Any clicks on the grid will cause this input to be focused.  This input is hidden above the top left corner of the browser window.
 * @property currentCell - Cell that the mouse moved over last.
 * @property height - Height of the grid.
 * @property width - Width of the grid.
 * @property visibleCells - Array of cell drawn.
 * @property visibleRows - Array of visible row indexes.
 * @property selections - Matrix array of selected cells.
 * @property selectionBounds - Bounds of current selection.
 * @property attributes - Object that contains the properties listed in the attributes section.  These properties can be used at runtime to alter attributes set during instantiation.  See the See {@link canvasDatagrid.params} section for full documentation.
 * @property sizes - Mutable object that contains `sizes.columns` and `sizes.rows` arrays.  These arrays control the sizes of the columns and rows.  If there is not an entry for the row or column index it will fall back to the style default.
 * @property style - Object that contains the properties listed in the style section.  Changing a style will automatically call `draw`.
 * @property dragMode - Represents the currently displayed resize cursor.  Can be `ns-resize`, `ew-resize`, `pointer`, or `inherit`.
 * @property formatters - Object that contains formatting functions for displaying text.  The properties in this object match the `schema[].type` property.  For example, if the schema for a given column was of the type `date` the grid would look for a formatter called `formatters.date` if a formatter cannot be found for a given data type a warning will be logged and the string formatter will be used. Formatters must return a string value to be displayed in the cell.  See {@link canvasDatagrid.formatters}.
 * @property sorters - Object that contains a list of sorting functions for sorting columns.   See {@tutorial sorters}.
 * @property filters - Object that contains a list of filters for filtering data.  The properties in this object match the `schema[].type` property.  For example, if the schema for a given column was of the type `date` the grid would look for a filter called `filters.date` if a filter cannot be found for a given data type a warning will be logged and the string/RegExp filter will be used.   See {@link canvasDatagrid.filters}.
 * @property hasActiveFilters - When true, grid data is being filtered.
 * @property data - This is how data is set in the grid.  Data must be an array of objects that conform to a schema.  Data values can be any primitive type.  However if a cell value is another data array, an inner grid will be rendered into the cell.  This "cell grid" is different than a "tree grid" (the sort you drill in with a row header arrow) and uses the `cellGridAttributes` attribute for properties and styling. See {@link canvasDatagrid.data}.
 * @property schema - Schema is optional.  Schema is an array of {canvasDatagrid.header} objects.  If no schema is provided one will be generated from the data, in that case all data will be assumed to be string data. See {@link canvasDatagrid.schema}.
 * @property scrollHeight - The total number of pixels that can be scrolled down.
 * @property scrollWidth - The total number of pixels that can be scrolled to the left.
 * @property scrollTop - The current position of the vertical scroll bar in pixels.
 * @property scrollLeft - The current position of the horizontal scroll bar in pixels.
 * @property offsetTop - The offset top of the grid.
 * @property offsetLeft - The offset left of the grid.
 * @property isChildGrid - When true, this grid is a child grid of another grid.  Meaning, it appears as a tree grid or a cell grid of another parent grid.
 * @property openChildren - List of open child grids by internal unique row id.
 * @property childGrids - Child grids in this grid organized by internal unique row id.
 * @property parentGrid - If this grid is a child grid, this is the grids parent.
 * @property canvas - The canvas element drawn onto for this grid.
 * @property shadowRoot - The shadow root element.
 * @property rowOrder - Gets or sets the order of the rows.  This allows you to modify the appearance of the data without modifying the data itself. The order of the array dictates the order of the rows, e.g.: [0, 1, 2] is normal order, [2, 1, 0] is reverse.  The array length must be equal to or greater than the number of rows.
 * @property columnOrder - Gets or sets the order of the columns.  This allows you to modify the appearance of the schema without modifying the data itself. The order of the array dictates the order of the columns, e.g.: [0, 1, 2] is normal order, [2, 1, 0] is reverse.  The array length must be equal to or greater than the number of columns.
 * @property activeCell - Gets the active cell as `{rowIndex, columnIndex}` (view indexes). The active cell is the one that receives keyboard input and edits and is drawn with the `activeCell*` styles. It is independent of the selection: keyboard navigation moves it, `selectNone()` keeps it, and a range selection has exactly one active cell (the one the drag started from). Move it with `setActiveCell(columnIndex, rowIndex)` and listen to `activecellchanged` to follow it.
 * @property hasFocus - When true, the grid is has focus.
 * @property visibleRowHeights - The heights of the visible rows.
 * @property isChildGrid - When true, this grid is within another grid.
 * @property parentNode - The parent node of the canvas, usually the shadow DOM's parent element.
 * @property scrollIndexRect - Rect describing the view port of the virtual canvas in column and row indexes.  If you only want to do things to visible cells, this is a good property to check what the range of visible cells is.
 * @property scrollPixelRect - Rect describing view port of the virtual canvas in pixels.
 * @property frozenColumn - The highest frozen column index.  Setting a value higher than the possible visible columns will result in a range error.
 * @property frozenRow - The highest frozen row index.  Setting a value higher than the possible visible rows will result in a range error.
 * @property orderBy - The name of the column the grid is currently sorted by.  You can set this value to any column name to alter the sort order dependent on data type.  Subscribing to `beforesortcolumn` and calling `e.preventDefault` allows you to change the property and the graphical appearance of the grid (an order arrow will be drawn over the respective column) without invoking the client side ordering function.  This is useful if you want to use server side data ordering.
 * @property orderDirection - Gets or sets the order by direction.  Value can be `asc` for ascending order or `desc` for descending order.  Subscribing to `beforesortcolumn` and calling `e.preventDefault` allows you to change the property and the graphical appearance of the grid (an order arrow will be drawn over the respective column) without invoking the client side ordering function.  This is useful if you want to use server side data ordering.
 * @param args - Parameters for the grid.
 * @param args.parentNode - HTML element that will hold the grid.  This block element must have a height, canvas-datagrid will add a canvas itself and will match itself to this element's dimensions.  It will resize itself on window.resize events, and DOM mutation.  But you may need to invoke canvas-datagrid.resize() manually if you find it does not maintain size in your use case.  When using the non web component the parentNode can be a canvas.
 * @param [args.name] - Optional value that will allow the saving of column height, row width, etc. to the browser's local store. This name should be unique to this grid.
 * @param [args.tree = false] - When true, an arrow will be drawn on each row that when clicked raises the See {@link canvasDatagrid#event:expandtree} event for that row and creates an inner grid.  See {@link tutorial--Allow-users-to-open-trees}.
 * @param [args.treeHorizontalScroll = false] - Reserved. Intended to make expanded child grids scroll horizontally with the parent columns; the option is accepted but not implemented yet (see issue #314), child grids always stay stationary.
 * @param [args.cellGridAttributes] - Attributes used for cell grids. These child grids are different than the tree grids. See the {@link canvasDatagrid.data} property for more information about cell grids.
 * @param [args.treeGridAttributes] - Attributes used for tree grids. These child grids are different than the cell grids. See the {@link canvasDatagrid.data} property for more information about tree grids.
 * @param [args.showNewRow = true] - When true, a row will appear at the bottom of the data set. schema[].defaultValue will define a default value for each cell. defaultValue can be a string or a function. When a function is used, the arguments header and index will be passed to the function. The value returned by the function will be the value in the new cell.  See {@link canvasDatagrid.header.defaultValue}
 * @param [args.saveAppearance = true] - When true, and the attribute name is set, column and row sizes will be saved to the browser's localStore.
 * @param [args.selectionFollowsActiveCell = false] - When true, moving the active cell with keystrokes will also change the selection.
 * @param [args.multiLine = false] - When true, edit cells will allow multiple lines (with Alt+Enter), when false edit cells will only allow single line entries.  See {@link tutorial--Use-a-textarea-to-edit-cells-instead-of-an-input.}
 * @param [args.globalRowResize = false] - When true, resizing a row will resize all rows to the same height.
 * @param [args.editable = true] - When true, cells can be edited. When false, grid is read only to the user.
 * @param [args.borderDragBehavior = 'none'] - Can be set to 'resize', 'move', or 'none'.  If set to 'move', `allowMovingSelection` should also be set true.  If set to 'resize', `allowRowResizeFromCell` and/or `allowColumnResizeFromCell` should be set true.
 * @param [args.autoGenerateSchema = false] - When true, every time data is set the schema will be automatically generated from the data overwriting any existing schema.
 * @param [args.autoScrollOnMousemove = false] - Only trigger auto scrolling when mouse moves in horizontal or vertical direction.
 * @param [args.autoScrollMargin = 5] - Number of pixels of mouse movement to trigger auto scroll.
 * @param [args.allowFreezingRows = false] - When true, the UI provides a drag-able cutter to freeze rows.
 * @param [args.allowFreezingColumns = false] - When true, the UI provides a drag-able cutter to freeze columns.
 * @param [args.allowShrinkingSelection = false] - When true, this allows users to shrink the selection by dragging and dropping the handle inwards, similar to Excel. (Not supported yet.)
 * @param [args.clearCellsWhenShrinkingSelection = false] - When true, this allows the clearing of the previously selected cells after the handle is moved inwards. (Not supported yet.)
 * @param [args.filterFrozenRows = true] - When false, rows on and above {@link canvasDatagrid#property:frozenRow}` will be ignored by filters when {@link canvasDatagrid#param:allowFreezingRows} is true.
 * @param [args.sortFrozenRows = true] - When false, rows on and above {@link canvasDatagrid#property:frozenRow}` will be ignored by sorters when {@link canvasDatagrid#param:allowSorting} is true.
 * @param [args.allowColumnReordering = true] - When true columns can be reordered.
 * @param [args.allowMovingSelection = false] - When true selected data can be moved by clicking and dragging on the border of the selection.
 * @param [args.allowRowReordering = false] - When true rows can be reordered.
 * @param [args.blanksText = (Blanks)] - The text that appears on the context menu for filtering blank values (i.e. `undefined`, `null`, `''`).
 * @param [args.ellipsisText = ...] - The text used as ellipsis text on truncated values.
 * @param [args.allowSorting = true] - Allow user to sort rows by clicking on column headers.
 * @param [args.allowColumnSelection = true] - When false, clicking or touching a column header never selects (highlights) the column, so with `columnHeaderClickBehavior: 'sort'` an existing row selection survives sorting. Columns can still be selected through the API.
 * @param [args.allowGridExpandOnPaste = false] - Allow adding new rows and columns if pasted data dimensions are bigger than existing grid dimensions.
 * @param [args.allowGroupingColumns = true] - Allow user to group columns by clicking on column headers.
 * @param [args.allowGroupingRows = true] - Allow user to group rows by clicking on rows headers.
 * @param [args.showFilter = true] - When true, filter will be an option in the context menu.
 * @param [args.pageUpDownOverlap = 1] - Amount of rows to overlap when pageup/pagedown is used.
 * @param [args.persistantSelectionMode = false] - When true, selections will behave as if the command/control key is held down at all times. Conflicts with singleSelectionMode.
 * @param [args.singleSelectionMode = false] - When true, selections will ignore the command/control key. Conflicts with persistantSelectionMode.
 * @param [args.keepFocusOnMouseOut = false] - When true, grid will continue to handle keydown events when mouse is outside of the grid.
 * @param [args.selectionMode = 'cell'] - Can be 'cell', or 'row'.  This setting dictates what will be selected when the user clicks a cell.  The cell, or the entire row respectively.
 * @param [args.hoverMode = 'cell'] - Can be 'cell', or 'row'. This setting dictates whether to highlight either the individual cell, or the entire row when hovering over a cell.
 * @param [args.autoResizeColumns = false] - When true, all columns will be automatically resized to fit the data in them. Warning! Expensive for large (&gt;100k ~2 seconds) datasets.
 * @param [args.fillLastColumn = false] - When true, the last visible column expands to the right edge of the grid when the columns do not fill its width. The outer edge of that column cannot be resized.
 * @param [args.autoResizeRows = false] - When true, rows will be automatically resized to fit the data in them if text-wrapping is enabled.
 * @param [args.allowRowHeaderResize = true] - When true, the user can resize the width of the row headers.
 * @param [args.allowColumnResize = true] - When true, the user can resize the width of the columns.
 * @param [args.allowRowResize = true] - When true, the user can resize the row headers increasing the height of the row.
 * @param [args.allowRowResizeFromCell = false] - When true, the user can resize the height of the row from the border of the cell.
 * @param [args.allowColumnResizeFromCell = false] - When true, the user can resize the width of the column from the border of the cell.
 * @param [args.showPerformance = false] - When true, a graph showing performance is rendered.
 * @param [args.debug = false] - When true, debug info will be drawn on top of the grid.
 * @param [args.borderResizeZone = 10] - Number of pixels in total around a border that count as resize zones.
 * @param [args.showColumnHeaders = true] - When true, headers are shown.
 * @param [args.showRowNumbers = true] - When true, row numbers are shown in the row headers.
 * @param [args.showRowNumberGaps = true] - When true, gaps between row numbers due to filtering are shown in the row headers using a colored bar.
 * @param [args.showRowHeaders = true] - When true, row headers are shown.
 * @param [args.reorderDeadZone = 3] - Number of pixels needed to move before column reordering occurs.
 * @param [args.selectionScrollZone = 20] - Number of pixels to auto scroll in in horizontal or vertical direction.
 * @param [args.showClearSettingsOption = true] - Show an option on the context menu to clear saved settings.
 * @param [args.clearSettingsOptionText = 'Clear saved settings'] - Text that appears on the clear settings option.
 * @param [args.showOrderByOptionTextDesc = 'Order by %s ascending'] - Text that appears on the order by descending option.
 * @param [args.showOrderByOptionTextAsc = 'Order by %s desc'] - Text that appears on the order by ascending option.
 * @param [args.showGroupColumns = 'Group columns %s'] - Text that appears on the group columns option.
 * @param [args.showGroupRows = 'Group row %s'] - Text that appears on the group rows option.
 * @param [args.showRemoveGroupColumns = 'Remove group %s'] - Text that appears on the remove columns group option.
 * @param [args.showRemoveGroupRows = 'Remove group %s'] - Text that appears on the remove rows group option.
 * @param [args.showRemoveAllGroupColumns = 'Remove all column groups'] - Text that appears on the remove all column groups option.
 * @param [args.showRemoveAllGroupRows = 'Remove all row groups'] - Text that appears on the remove all row groups option.
 * @param [args.showExpandAllGroupColumns = 'Expand all column groups'] - Text that appears on the expand all column groups option.
 * @param [args.showExpandAllGroupRows = 'Expand all row groups'] - Text that appears on the expand all row groups option.
 * @param [args.showCollapseAllGroupColumns = 'Collapse all column groups'] - Text that appears on the collapsed all column groups option.
 * @param [args.showCollapseAllGroupRows = 'Collapse all row groups'] - Text that appears on the collapsed all row groups option.
 * @param [args.columnGroupIndicatorPosition = 'right'] - The position of the column group inidcator(icon), available values: 'left' and 'right'.
 * @param [args.rowGroupIndicatorPosition = 'bottom'] - Ths position of the row group indicator(icon), available values: 'top' and 'bottom'.
 * @param [args.showOrderByOption = true] - Show an option on the context menu sort rows.
 * @param [args.showPaste = false] - Show the paste option in the context menu when applicable.
 * @param [args.resizeAfterDragged] - Resize after the handle is dropped, similar to Excel.
 * @param [args.schema = []] - Sets the schema. See {@link canvasDatagrid.schema}.
 * @param [args.data = []] - Sets the data. See {@link canvasDatagrid.data}.
 * @param [args.touchReleaseAnimationDurationMs = 2000] - How long the ease animation runs after touch release.
 * @param [args.touchReleaseAcceleration = 1000] - How many times the detected pixel per inch touch swipe is multiplied on release.  Higher values mean more greater touch release movement.
 * @param [args.touchDeadZone = 3] - How many pixels a touch must move within `attributes.touchSelectTimeMs` to be considered scrolling rather than selecting.
 * @param [args.touchScrollZone = 30] - When touching, the scroll element hit boxes are increased by this number of pixels for easier touching.
 * @param [args.showCopy = true] - When true, copy will appear on the context menu when it is available.
 * @param [args.pasteText = Paste] - The text that appears on the context menu when paste is available.
 * @param [args.copyText = Copy] - The text that appears on the context menu when copy is available.
 * @param [args.columnHeaderClickBehavior = sort] - Can be any of sort, select, none.  When sort is selected, left clicking a column header will result in sorting ascending, then sorting descending if already sorted by this column.  If select is selected then clicking a column header will result in the column becoming selected.  Holding control/command or shift will select multiple columns in this mode.
 * @param [args.scrollPointerLock = false] - When true, clicking on the scroll box to scroll will cause the mouse cursor to disappear to prevent it from exiting the area observable to the grid.
 * @param [args.selectionHandleBehavior = 'none'] - When set to a value other than none, a handle will appear in the lower right corner of the desktop version of the grid.
 * @param [args.columnSelectorVisibleText = '&nbsp;&nbsp;&nbsp&nbsp;'] - When a column is hidden, this is the value to the left of the title in the column selector content menu.
 * @param [args.columnSelectorHiddenText = '\u2713'] - When a column is visible, this is the value to the left of the title in the column selector content menu.
 * @param [args.columnSelectorText = 'Add/remove columns'] - The text of the column selector context menu.
 * @param [args.hideColumnText = 'Hide %s'] - The text displayed on the hide column .
 * @param [args.showColumnSelector = true] - When true, the column selector context menu is visible.
 * @param [args.touchContextMenuTimeMs = 800] - The length of time in milliseconds before a context menu appears on touch start within the touch dead zone.
 * @param [args.scrollAnimationPPSThreshold = 0.75] - How many points per second must be achieved before touch animation occurs on touch release.
 * @param [args.touchSelectHandleZone = 20] - Radius of pixels around touch select handles that touch select handles respond to.
 * @param [args.touchEasingMethod = easeOutQuad] - Animation easing method used for touch release animation.  Valid values are easeOutQuad, easeOutCubic, easeOutQuart, easeOutQuint.
 * @param [args.snapToRow = false] - When true, scrolling snaps to the top row.
 * @param [args.touchZoomSensitivity = 0.005] - The scale at which "pinch to zoom" screen pixels are converted to scale values.
 * @param [args.touchZoomMin = 0.5] - The minimum zoom scale.
 * @param [args.touchZoomMax = 1.75] - The maximum zoom scale.
 * @param [args.maxPixelRatio = 1.5] - The maximum pixel ratio for high DPI displays.  High DPI displays can cause sluggish performance, this caps resolution the grid is rendered at.  Standard resolution (e.g.: 1920x1080) have a pixel ratio of 1:1 while higher resolution displays can be higher (e.g.: Retina display 2:1).  Higher numbers are sharper (higher resolution) up to the max of your display (usually 2), lower numbers are lower resolution, down to 1.  It might be fun to set a value lower than 1, I've never done it.
 * @param [args.maxCanvasSize = 16384] - Largest width or height, in CSS pixels, an auto-sized grid (`style.width`/`style.height` set to `auto`) may grow to. Browsers cannot paint larger canvases. Past this size the grid stops growing and shows a scroll bar for the rest of the data.
 * @param [args.fillCellCallback] - The callback function that is called when a cell is filled.
 * @param [args.style = {}] - Sets selected values in style.
 * @param [args.filters = {}] - Sets selected values in filters.  See {@link canvasDatagrid.filters}.
 * @param [args.sorters = {}] - Sets selected values in sorters.  See {@link canvasDatagrid.sorters}.
 * @param [args.formatters = {}] - Sets selected values in formatters.  See {@link canvasDatagrid.formatters}.
 * @param [args.parsers = {}] - Sets selected values in parsers.  See {@link canvasDatagrid.parsers}.
 */
declare class canvasDatagrid {
    constructor(args: {
        parentNode: HTMLElement;
        name?: string;
        tree?: boolean;
        treeHorizontalScroll?: boolean;
        cellGridAttributes?: any;
        treeGridAttributes?: any;
        showNewRow?: boolean;
        saveAppearance?: boolean;
        selectionFollowsActiveCell?: boolean;
        multiLine?: boolean;
        globalRowResize?: boolean;
        editable?: boolean;
        borderDragBehavior?: string;
        autoGenerateSchema?: boolean;
        autoScrollOnMousemove?: boolean;
        autoScrollMargin?: number;
        allowFreezingRows?: boolean;
        allowFreezingColumns?: boolean;
        allowShrinkingSelection?: boolean;
        clearCellsWhenShrinkingSelection?: boolean;
        filterFrozenRows?: boolean;
        sortFrozenRows?: boolean;
        allowColumnReordering?: boolean;
        allowMovingSelection?: boolean;
        allowRowReordering?: boolean;
        blanksText?: string;
        ellipsisText?: string;
        allowSorting?: boolean;
        allowColumnSelection?: boolean;
        allowGridExpandOnPaste?: boolean;
        allowGroupingColumns?: boolean;
        allowGroupingRows?: boolean;
        showFilter?: boolean;
        pageUpDownOverlap?: number;
        persistantSelectionMode?: boolean;
        singleSelectionMode?: boolean;
        keepFocusOnMouseOut?: boolean;
        selectionMode?: string;
        hoverMode?: string;
        autoResizeColumns?: boolean;
        fillLastColumn?: boolean;
        autoResizeRows?: boolean;
        allowRowHeaderResize?: boolean;
        allowColumnResize?: boolean;
        allowRowResize?: boolean;
        allowRowResizeFromCell?: boolean;
        allowColumnResizeFromCell?: boolean;
        showPerformance?: boolean;
        debug?: boolean;
        borderResizeZone?: number;
        showColumnHeaders?: boolean;
        showRowNumbers?: boolean;
        showRowNumberGaps?: boolean;
        showRowHeaders?: boolean;
        reorderDeadZone?: number;
        selectionScrollZone?: number;
        showClearSettingsOption?: boolean;
        clearSettingsOptionText?: string;
        showOrderByOptionTextDesc?: string;
        showOrderByOptionTextAsc?: string;
        showGroupColumns?: string;
        showGroupRows?: string;
        showRemoveGroupColumns?: string;
        showRemoveGroupRows?: string;
        showRemoveAllGroupColumns?: string;
        showRemoveAllGroupRows?: string;
        showExpandAllGroupColumns?: string;
        showExpandAllGroupRows?: string;
        showCollapseAllGroupColumns?: string;
        showCollapseAllGroupRows?: string;
        columnGroupIndicatorPosition?: string;
        rowGroupIndicatorPosition?: string;
        showOrderByOption?: boolean;
        showPaste?: boolean;
        resizeAfterDragged?: boolean;
        schema?: any[];
        data?: any[];
        touchReleaseAnimationDurationMs?: number;
        touchReleaseAcceleration?: number;
        touchDeadZone?: number;
        touchScrollZone?: number;
        showCopy?: boolean;
        pasteText?: string;
        copyText?: string;
        columnHeaderClickBehavior?: string;
        scrollPointerLock?: boolean;
        selectionHandleBehavior?: string;
        columnSelectorVisibleText?: string;
        columnSelectorHiddenText?: string;
        columnSelectorText?: string;
        hideColumnText?: string;
        showColumnSelector?: boolean;
        touchContextMenuTimeMs?: number;
        scrollAnimationPPSThreshold?: number;
        touchSelectHandleZone?: string;
        touchEasingMethod?: string;
        snapToRow?: boolean;
        touchZoomSensitivity?: number;
        touchZoomMin?: number;
        touchZoomMax?: number;
        maxPixelRatio?: number;
        maxCanvasSize?: number;
        fillCellCallback?: any;
        style?: canvasDatagrid.style;
        filters?: canvasDatagrid.filter;
        sorters?: canvasDatagrid.sorter;
        formatters?: canvasDatagrid.formatter;
        parsers?: canvasDatagrid.dataTypes;
    });
    /**
     * Applies the computed css styles to the grid.  In some browsers, changing directives in attached style sheets does not automatically update the styles in this component.  It is necessary to call this method to update in these cases.
     */
    applyComponentStyle(): void;
    /**
     * A formatting function.  Must be a member of (property of) {@link canvasDatagrid.formatters} and match a type from one of the {@link canvasDatagrid.header}s in {@link canvasDatagrid.schema}.
     * @param e - Formatting event object.
     * @param e.cell - Cell being formatted.
     */
    formatter(e: {
        cell: canvasDatagrid.cell;
    }): void;
    /**
     * A filter function.  Filter should return true when the value should be kept, and false if the value should be filtered out.  Must be a member of (property of) {canvasDatagrid.filters} and match a type from one of the {@link canvasDatagrid.header}s in {@link canvasDatagrid.schema}.
     * @param value - The current value being checked.
     * @param filterFor - The value being filtered against.
     */
    filter(value: string, filterFor: string): void;
    /**
     * A sorter function.  Must be a member of (property of) {@link canvasDatagrid.sorters} and match a type from one of the {@link canvasDatagrid.header}s in {@link canvasDatagrid.schema}.
     * @param columnName - Name of the column being sorted.
     * @param direction - Direction of the column being sorted, either `asc` or `desc`.
     */
    sorter(columnName: string, direction: string): void;
    /**
     * Ends editing, optionally aborting the edit.
     * @param abort - When true, abort the edit.
     */
    endEdit(abort: boolean): void;
    /**
     * Begins editing at cell x, row y.
     * @param x - The column index of the cell to edit.
     * @param y - The row index of the cell to edit.
     * @param inEnterMode - If true, starting to type in cell will replace the
     * cell's previous value instead of appending, and using the arrow keys will allow
     * the user to navigate to adjacent cells instead of moving the text cursor around
     * (default is false, and means user is in 'edit' mode).
     */
    beginEditAt(x: number, y: number, inEnterMode: boolean): void;
    /**
     * Redraws the grid. No matter what the change, this is the only method required to refresh everything.
     */
    draw(): void;
    /**
     * Adds an event listener to the given event.
     * @param ev - The name of the event to subscribe to.
     * @param fn - The event procedure to execute when the event is raised.
     */
    addEventListener(ev: string, fn: (...params: any[]) => any): void;
    /**
     * Removes the given listener function from the given event.  Must be an actual reference to the function that was bound.
     * @param ev - The name of the event to unsubscribe from.
     * @param fn - The event procedure to execute when the event is raised.
     */
    removeEventListener(ev: string, fn: (...params: any[]) => any): void;
    /**
     * Fires the given event, passing an event object to the event subscribers.
     * @param ev - The name of the event to dispatch.
     * @param e - The event object.
     */
    dispatchEvent(ev: number, e: number): void;
    /**
     * Releases grid resources and removes grid elements.
     */
    dispose(): void;
    /**
     * Appends the grid to another element later.  Not implemented.
     * @param el - The element to append the grid to.
     */
    appendTo(el: number): void;
    /**
     * Removes focus from the grid.
     */
    blur(): void;
    /**
     * Focuses on the grid.
     */
    focus(): void;
    /**
     * Gets an array of currently registered MIME types.
     */
    getDataTypes(): void;
    /**
     * Converts a integer into a letter A - ZZZZZ...
     * @param n - The number to convert.
     */
    integerToAlpha(n: column): void;
    /**
     * Inserts a new column before the specified index into the schema.
     * @param c - The column to insert into the schema.
     * @param index - The index of the column to insert before.
     */
    insertColumn(c: column, index: number): void;
    /**
     * Deletes a column from the schema at the specified index.
     * @param index - The index of the column to delete.
     */
    deleteColumn(index: number): void;
    /**
     * Adds a new column into the schema.
     * @param c - The column to add to the schema.
     */
    addColumn(c: column): void;
    /**
     * Deletes a row from the dataset at the specified index.
     * @param index - The index of the row to delete.
     */
    deleteRow(index: number): void;
    /**
     * Inserts a new row into the dataset before the specified index.
     * @param d - data.
     * @param index - The index of the row to insert before.
     */
    insertRow(d: any, index: number): void;
    /**
     * Adds a new row into the dataset.
     * @param d - data.
     */
    addRow(d: any): void;
    /**
     * Sets the height of a given row by index number.
     * @param rowIndex - The index of the row to set.
     * @param height - Height to set the row to.
     */
    setRowHeight(rowIndex: number, height: number): void;
    /**
     * Sets the width of a given column by index number.
     * @param colIndex - The index of the column to set.
     * @param width - Width to set the column to.
     */
    setColumnWidth(colIndex: number, width: number): void;
    /**
     * Removes any changes to the width of the columns due to user or api interaction, setting them back to the schema or style default.
     */
    resetColumnWidths(): void;
    /**
     * Removes any changes to the height of the rows due to user or api interaction, setting them back to the schema or style default.
     */
    resetRowHeights(): void;
    /**
     * Sets the value of the filter.
     * @param column - Name of the column to filter.
     * @param value - The value to filter for.
     */
    setFilter(column: string, value: string): void;
    /**
     * Returns the number of pixels to scroll down to line up with row rowIndex.
     * @param rowIndex - The row index of the row to scroll find.
     */
    findRowScrollTop(rowIndex: number): void;
    /**
     * Returns the number of pixels to scroll to the left to line up with column columnIndex.
     * @param columnIndex - The column index of the column to find.
     */
    findColumnScrollLeft(columnIndex: number): void;
    /**
     * Scrolls to the cell at columnIndex x, and rowIndex y.  If you define both rowIndex and columnIndex additional calculations can be made to center the cell using the target cell's height and width.  Defining only one rowIndex or only columnIndex will result in simpler calculations.
     * @param x - The column index of the cell to scroll to.
     * @param y - The row index of the cell to scroll to.
     * @param [offsetX = 0] - Percentage offset the cell should be from the left edge (not including headers).  The default is 0, meaning the cell will appear at the left edge. Valid values are 0 through 1. 1 = Left, 0 = Right, 0.5 = Center.
     * @param [offsetY = 0] - Percentage offset the cell should be from the top edge (not including headers).  The default is 0, meaning the cell will appear at the top edge. Valid values are 0 through 1. 1 = Bottom, 0 = Top, 0.5 = Center.
     */
    gotoCell(x: number, y: number, offsetX?: number, offsetY?: number): void;
    /**
     * Scrolls the row y.
     * @param y - The row index of the cell to scroll to.
     */
    gotoRow(y: number): void;
    /**
     * Add a button into the cell.
     * @param columnIndex - The column index of the cell to to add a button.
     * @param rowIndex - The row index of the cell to to add a button.
     * @param offset - Offset how far go away from cell.
     * @param items - a list of items to add into button menu.
     * @param imgSrc - icon path to add into button.
     */
    addButton(columnIndex: number, rowIndex: number, offset: any, items: any, imgSrc: string): void;
    /**
     * Expand/Collapse CellTree.
     * @param treeData - The array of cellTree to expand or collapse.
     */
    toggleCellCollapseTree(treeData: any[]): void;
    /**
     * Expand/Collapse CellTree.
     * @param treeData - The array of cellTree to expand or collapse.
     */
    expandCollapseCellTree(treeData: any[]): void;
    /**
     * Scrolls the cell at cell x, row y into view if it is not already.
     * @param x - The column index of the cell to scroll into view.
     * @param y - The row index of the cell to scroll into view.
     * @param [offsetX = 0] - Percentage offset the cell should be from the left edge (not including headers).  The default is 0, meaning the cell will appear at the left edge. Valid values are 0 through 1. 1 = Left, 0 = Right, 0.5 = Center.
     * @param [offsetY = 0] - Percentage offset the cell should be from the top edge (not including headers).  The default is 0, meaning the cell will appear at the top edge. Valid values are 0 through 1. 1 = Bottom, 0 = Top, 0.5 = Center.
     */
    scrollIntoView(x: number, y: number, offsetX?: number, offsetY?: number): void;
    /**
     * Sets the active cell. Requires redrawing.
     * @param x - The column index of the cell to set active.
     * @param y - The row index of the cell to set active.
     */
    setActiveCell(x: number, y: number): void;
    /**
     * Collapse a tree grid by row index.
     * @param index - The index of the row to collapse.
     */
    collapseTree(index: number): void;
    /**
     * Expands a tree grid by row index.
     * @param index - The index of the row to expand.
     */
    expandTree(index: number): void;
    /**
     * Toggles tree grid open and close by row index.
     * @param index - The index of the row to toggle.
     */
    toggleTree(index: number): void;
    /**
     * Returns a header from the schema by name.
     * @param name - The name of the column to resize.
     * @returns header with the selected name, or undefined.
     */
    getHeaderByName(name: string): header;
    /**
     * Hide column/columns
     * @param beginColumnOrderIndex - The begin column order index
     * @param [endColumnOrderIndex] - The end column order index
     */
    hideColumns(beginColumnOrderIndex: number, endColumnOrderIndex?: number): void;
    /**
     * Unihde column/columns
     * @param beginColumnOrderIndex - The begin column order index
     * @param [endColumnOrderIndex] - The end column order index
     */
    unhideColumns(beginColumnOrderIndex: number, endColumnOrderIndex?: number): void;
    /**
     * Hide rows
     * @param beginRowIndex - The begin row index
     * @param endRowIndex - The end row index
     */
    hideRows(beginRowIndex: number, endRowIndex: number): void;
    /**
     * Unhide rows
     * @param beginRowIndex - The begin row index
     * @param endRowIndex - The end row index
     */
    unhideRows(beginRowIndex: number, endRowIndex: number): void;
    /**
     * Resizes a column to fit the longest value in the column. Call without a value to resize all columns.
     * Warning, can be slow on very large record sets (1m records ~3-5 seconds on an i7).
     * @param name - The name of the column to resize.
     */
    fitColumnToValues(name: string): void;
    /**
     * Checks if a cell is currently visible.
     * @param columnIndex - The column index of the cell to check.
     * @param rowIndex - The row index of the cell to check.
     * @returns when true, the cell is visible, when false the cell is not currently drawn.
     */
    isCellVisible(columnIndex: number, rowIndex: number): boolean;
    /**
     * Sets the order of the data.
     * @param columnName - Name of the column to be sorted.
     * @param direction - `asc` for ascending or `desc` for descending.
     * @param [sortFunction] - When defined, override the default sorting method defined in the column's schema and use this one.
     * @param [dontSetStorageData] - Don't store this setting for future use.
     */
    order(columnName: number, direction: string, sortFunction?: (...params: any[]) => any, dontSetStorageData?: boolean): void;
    /**
     * Grouping columns
     * @param firstColumnName - Name of the first column to be grouped.
     * @param lastColumnName - Name of the last column to be grouped.
     */
    groupColumns(firstColumnName: number | string, lastColumnName: number | string): void;
    /**
     * Grouping columns
     * @param rowIndexFrom - The row index which is the beginning of the group
     * @param rowIndexTo - The row index which is the end of the group
     */
    groupRows(rowIndexFrom: number, rowIndexTo: number): void;
    /**
     * Remove grouping columns
     * @param firstColumnName - Name of the first column to be grouped.
     * @param lastColumnName - Name of the last column to be grouped.
     */
    removeGroupColumns(firstColumnName: number | string, lastColumnName: number | string): void;
    /**
     * Remove grouping columns
     * @param rowIndexFrom - The row index which is the beginning of the group
     * @param rowIndexTo - The row index which is the end of the group
     */
    removeGroupRows(rowIndexFrom: number, rowIndexTo: number): void;
    /**
     * Toggle(expand/collapsed) grouping columns
     * @param firstColumnName - Name of the first column to be grouped.
     * @param lastColumnName - Name of the last column to be grouped.
     */
    toggleGroupColumns(firstColumnName: number | string, lastColumnName: number | string): void;
    /**
     * Toggle(expand/collapsed) grouping rows
     * @param rowIndexFrom - The row index which is the beginning of the group
     * @param rowIndexTo - The row index which is the end of the group
     */
    toggleGroupRows(rowIndexFrom: number, rowIndexTo: number): void;
    /**
     * Moves data in the provided selection to another position in the grid.  Moving data off the edge of the schema (columns/x) will truncate data.
     * @param sel - 2D array representing selected rows and columns.  `canvasDatagrid.selections` is in this format and can be used here.
     * @param x - The column index to start inserting the selection at.
     * @param y - The row index to start inserting the selection at.
     */
    moveTo(sel: any[], x: number, y: number): void;
    /**
     * Get the column group info given column belongs to
     * @param columnIndex - Column index.
     */
    getGroupsColumnBelongsTo(columnIndex: number): { from: number; to: number; collapsed: boolean; }[];
    /**
     * Get the row group info given row belongs to
     * @param rowIndex - Row index.
     */
    getGroupsRowBelongsTo(rowIndex: number): { from: number; to: number; collapsed: boolean; }[];
    /**
     * Checks if a given column is visible.
     * @param columnIndex - Column index.
     * @returns When true, the column is visible.
     */
    isColumnVisible(columnIndex: number): boolean;
    /**
     * Checks if a given row is visible.
     * @param rowIndex - Row index.
     * @returns When true, the row is visible.
     */
    isRowVisible(rowIndex: number): boolean;
    /**
     * Gets the cell at columnIndex and rowIndex.
     * @param x - Column index.
     * @param y - Row index.
     * @returns cell at the selected location.
     */
    getVisibleCellByIndex(x: number, y: number): cell;
    /**
     * Get an unhide indicator at grid pixel coordinate x and y.
     * @param x - Number of pixels from the left.
     * @param y - Number of pixels from the top.
     */
    getUnhideIndicator(x: number, y: number): void;
    /**
     * Get a column group at grid pixel coordinate x and y.
     * @param x - Number of pixels from the left.
     * @param y - Number of pixels from the top.
     */
    getColumnGroupAt(x: number, y: number): void;
    /**
     * Get a row group at grid pixel coordinate x and y.
     * @param x - Number of pixels from the left.
     * @param y - Number of pixels from the top.
     */
    getRowGroupAt(x: number, y: number): void;
    /**
     * Gets the cell at grid pixel coordinate x and y.  Author's note.  This function ties drawing and events together.  This is a very complex function and is core to the component.
     * @param x - Number of pixels from the left.
     * @param y - Number of pixels from the top.
     * @returns cell at the selected location.
     */
    getCellAt(x: number, y: number): cell;
    /**
     * Returns an auto generated schema based on data structure.
     * @returns schema A schema based on the first item in the data array.
     */
    getSchemaFromData(): schema;
    /**
     * Clears the change log grid.changes that keeps track of changes to the data set.
     * This does not undo changes or alter data it is simply a convince array to keep
     * track of changes made to the data since last this method was called.
     */
    clearChangeLog(): void;
    /**
     * Returns the maximum text width for a given column by column name.
     * @param name - The name of the column to calculate the value's width of.
     * @returns The number of pixels wide the maximum width value in the selected column.
     */
    findColumnMaxTextLength(name: string): number;
    /**
     * Gets the total width of all header columns.
     */
    getHeaderWidth(): void;
    /**
     * Gets the height of a row by index.
     * @param rowIndex - The row index to lookup.
     */
    getRowHeight(rowIndex: number): void;
    /**
     * Gets the width of a column by index.
     * @param columnIndex - The column index to lookup.
     */
    getColumnWidth(columnIndex: number): void;
    /**
     * Returns true if the selected columnIndex is selected on every row.
     * @param columnIndex - The column index to check.
     */
    isColumnSelected(columnIndex: number): void;
    /**
     * Returns true if the selected rowIndex is selected on every column.
     * @param rowIndex - The row index to check.
     */
    isRowSelected(rowIndex: number): void;
    /**
     * Removes the selection.
     * @param dontDraw - Suppress the draw method after the selection change.
     */
    selectNone(dontDraw: boolean): void;
    /**
     * Selects every visible cell.
     * @param dontDraw - Suppress the draw method after the selection change.
     */
    selectAll(dontDraw: boolean): void;
    /**
     * Moves the current selection relative to the its current position.  Note: this method does not move the selected data, just the selection itself.
     * @param offsetX - The number of columns to offset the selection.
     * @param offsetY - The number of rows to offset the selection.
     */
    moveSelection(offsetX: number, offsetY: number): void;
    /**
     * Gets the bounds of current selection.
     * @param [sanitized] - sanitize the bound object if the value of thie paramater is `true`
     * @returns two situations:
     * 1. The result is always a bound object if `sanitized` is not `true`.
     * And the result is `{top: Infinity, left: Infinity, bottom: -Infinity, right: -Infinity}` if there haven't selections.
     * This is used for keeping compatibility with existing APIs.
     * 2. When the parameter `sanitized` is true. The result will be null if there haven't selections.
     */
    getSelectionBounds(sanitized?: boolean): rect;
    /**
     * Deletes currently selected data.
     * @param dontDraw - Suppress the draw method after the selection change.
     */
    deleteSelectedData(dontDraw: boolean): void;
    /**
     * Runs the defined method on each selected cell.
     * @param fn - The function to execute.  The signature of the function is: (data, rowIndex, columnName).
     * @param expandToRow - When true the data in the array is expanded to the entire row.
     */
    forEachSelectedCell(fn: number, expandToRow: number): void;
    /**
     * Selects a column.
     * @param columnIndex - The column index to select.
     * @param toggleSelectMode - When true, behaves as if you were holding control/command when you clicked the column.
     * @param shift - When true, behaves as if you were holding shift when you clicked the column.
     * @param suppressEvent - When true, prevents the selectionchanged event from firing.
     */
    selectColumn(columnIndex: number, toggleSelectMode: boolean, shift: boolean, suppressEvent: boolean): void;
    /**
     * Selects a row.
     * @param rowIndex - The row index to select.
     * @param ctrl - When true, behaves as if you were holding control/command when you clicked the row.
     * @param shift - When true, behaves as if you were holding shift when you clicked the row.
     * @param supressSelectionchangedEvent - When true, prevents the selectionchanged event from firing.
     */
    selectRow(rowIndex: number, ctrl: boolean, shift: boolean, supressSelectionchangedEvent: boolean): void;
    /**
     * Selects an area of the grid.
     * @param [bounds] - A rect object representing the selected values.
     */
    selectArea(bounds?: rect, ctrl?: boolean): void;
    /**
     * Selected rows.  Same as the `data` property but filtered for the rows the user has cells selected in.  If any cell in the row is selected, all data for that row will appear in this array.
    */
    selectedRows: any[];
    /**
     * Jagged array of cells that the user has selected.  Beware that because this is a jagged array, some indexes will be `null`.  Besides the `null`s this data looks just like the data you passed in, but just the cells the user has selected.  So if the user has selected cell 10 in a 10 column row, there will be 9 `null`s followed by the data from column 10.
    */
    selectedCells: any[];
    /**
     * Array of changes and additions made to the grid since last time data was loaded.  The data property will change with changes as well, but this is a convince list of all the changes in one spot.  Calling `clearChangeLog` will clear this list.
    */
    changes: any[];
    /**
     * Reference to the the edit cell when editing.  Undefined when not editing.  When editing, this DOM element is superimposed over the cell being edited and is fully visible.
    */
    input: any;
    /**
     * Input used for key controls on the grid.  Any clicks on the grid will cause this input to be focused.  This input is hidden above the top left corner of the browser window.
    */
    controlInput: any;
    /**
     * Cell that the mouse moved over last.
    */
    currentCell: canvasDatagrid.cell;
    /**
     * Height of the grid.
    */
    height: number;
    /**
     * Width of the grid.
    */
    width: number;
    /**
     * Array of cell drawn.
    */
    visibleCells: any[];
    /**
     * Array of visible row indexes.
    */
    visibleRows: any[];
    /**
     * Matrix array of selected cells.
    */
    selections: any[];
    /**
     * Bounds of current selection.
    */
    selectionBounds: rect;
    /**
     * Object that contains the properties listed in the attributes section.  These properties can be used at runtime to alter attributes set during instantiation.  See the See {@link canvasDatagrid.params} section for full documentation.
    */
    attributes: any;
    /**
     * Mutable object that contains `sizes.columns` and `sizes.rows` arrays.  These arrays control the sizes of the columns and rows.  If there is not an entry for the row or column index it will fall back to the style default.
    */
    sizes: any;
    /**
     * Object that contains the properties listed in the style section.  Changing a style will automatically call `draw`.
    */
    style: canvasDatagrid.style;
    /**
     * Represents the currently displayed resize cursor.  Can be `ns-resize`, `ew-resize`, `pointer`, or `inherit`.
    */
    dragMode: string;
    /**
     * Object that contains formatting functions for displaying text.  The properties in this object match the `schema[].type` property.  For example, if the schema for a given column was of the type `date` the grid would look for a formatter called `formatters.date` if a formatter cannot be found for a given data type a warning will be logged and the string formatter will be used. Formatters must return a string value to be displayed in the cell.  See {@link canvasDatagrid.formatters}.
    */
    formatters: canvasDatagrid.formatter;
    /**
     * Object that contains a list of sorting functions for sorting columns.   See {@tutorial sorters}.
    */
    sorters: canvasDatagrid.sorter;
    /**
     * Object that contains a list of filters for filtering data.  The properties in this object match the `schema[].type` property.  For example, if the schema for a given column was of the type `date` the grid would look for a filter called `filters.date` if a filter cannot be found for a given data type a warning will be logged and the string/RegExp filter will be used.   See {@link canvasDatagrid.filters}.
    */
    filters: canvasDatagrid.filter;
    /**
     * When true, grid data is being filtered.
    */
    hasActiveFilters: boolean;
    /**
     * This is how data is set in the grid.  Data must be an array of objects that conform to a schema.  Data values can be any primitive type.  However if a cell value is another data array, an inner grid will be rendered into the cell.  This "cell grid" is different than a "tree grid" (the sort you drill in with a row header arrow) and uses the `cellGridAttributes` attribute for properties and styling. See {@link canvasDatagrid.data}.
    */
    data: canvasDatagrid.data;
    /**
     * Schema is optional.  Schema is an array of {canvasDatagrid.header} objects.  If no schema is provided one will be generated from the data, in that case all data will be assumed to be string data. See {@link canvasDatagrid.schema}.
    */
    schema: canvasDatagrid.schema;
    /**
     * The total number of pixels that can be scrolled down.
    */
    scrollHeight: number;
    /**
     * The total number of pixels that can be scrolled to the left.
    */
    scrollWidth: number;
    /**
     * The current position of the vertical scroll bar in pixels.
    */
    scrollTop: number;
    /**
     * The current position of the horizontal scroll bar in pixels.
    */
    scrollLeft: number;
    /**
     * The offset top of the grid.
    */
    offsetTop: number;
    /**
     * The offset left of the grid.
    */
    offsetLeft: number;
    /**
     * When true, this grid is within another grid.
    */
    isChildGrid: boolean;
    /**
     * List of open child grids by internal unique row id.
    */
    openChildren: boolean;
    /**
     * Child grids in this grid organized by internal unique row id.
    */
    childGrids: boolean;
    /**
     * If this grid is a child grid, this is the grids parent.
    */
    parentGrid: canvasDatagrid;
    /**
     * The canvas element drawn onto for this grid.
    */
    canvas: any;
    /**
     * The shadow root element.
    */
    shadowRoot: HTMLElement;
    /**
     * Gets or sets the order of the rows.  This allows you to modify the appearance of the data without modifying the data itself. The order of the array dictates the order of the rows, e.g.: [0, 1, 2] is normal order, [2, 1, 0] is reverse.  The array length must be equal to or greater than the number of rows.
    */
    rowOrder: any[];
    /**
     * Gets or sets the order of the columns.  This allows you to modify the appearance of the schema without modifying the data itself. The order of the array dictates the order of the columns, e.g.: [0, 1, 2] is normal order, [2, 1, 0] is reverse.  The array length must be equal to or greater than the number of columns.
    */
    columnOrder: any[];
    /**
     * Gets the active cell as `{rowIndex, columnIndex}` (view indexes). The active cell is the one that receives keyboard input and edits and is drawn with the `activeCell*` styles. It is independent of the selection: keyboard navigation moves it, `selectNone()` keeps it, and a range selection has exactly one active cell (the one the drag started from). Move it with `setActiveCell(columnIndex, rowIndex)` and listen to `activecellchanged` to follow it.
    */
    activeCell: any;
    /**
     * When true, the grid is has focus.
    */
    hasFocus: boolean;
    /**
     * The heights of the visible rows.
    */
    visibleRowHeights: any[];
    /**
     * When true, this grid is within another grid.
    */
    isChildGrid: boolean;
    /**
     * The parent node of the canvas, usually the shadow DOM's parent element.
    */
    parentNode: HTMLElement;
    /**
     * Rect describing the view port of the virtual canvas in column and row indexes.  If you only want to do things to visible cells, this is a good property to check what the range of visible cells is.
    */
    scrollIndexRect: any;
    /**
     * Rect describing view port of the virtual canvas in pixels.
    */
    scrollPixelRect: any;
    /**
     * The highest frozen column index.  Setting a value higher than the possible visible columns will result in a range error.
    */
    frozenColumn: number;
    /**
     * The highest frozen row index.  Setting a value higher than the possible visible rows will result in a range error.
    */
    frozenRow: number;
    /**
     * The name of the column the grid is currently sorted by.  You can set this value to any column name to alter the sort order dependent on data type.  Subscribing to `beforesortcolumn` and calling `e.preventDefault` allows you to change the property and the graphical appearance of the grid (an order arrow will be drawn over the respective column) without invoking the client side ordering function.  This is useful if you want to use server side data ordering.
    */
    orderBy: string;
    /**
     * Gets or sets the order by direction.  Value can be `asc` for ascending order or `desc` for descending order.  Subscribing to `beforesortcolumn` and calling `e.preventDefault` allows you to change the property and the graphical appearance of the grid (an order arrow will be drawn over the respective column) without invoking the client side ordering function.  This is useful if you want to use server side data ordering.
    */
    orderDirection: string;
}

declare namespace canvasDatagrid {
    /**
     * A selection rectangle.
     * @property top - First row index.
     * @property bottom - Last row index.
     * @property left - First column index.
     * @property right - Last column index.
     */
    class rect {
        /**
         * First row index.
        */
        top: number;
        /**
         * Last row index.
        */
        bottom: number;
        /**
         * First column index.
        */
        left: number;
        /**
         * Last column index.
        */
        right: number;
    }
    /**
     * A header that describes the data in a column.  The term header and column are used interchangeably in this documentation.  The {@link canvasDatagrid.schema} is an array of {@link canvasDatagrid.header}.
     * @property name - The name of the header.  This must match the property name of an object in the {@link canvasDatagrid.data} array.  This is the only required property of a {@link canvasDatagrid.header}.  This value will appear at the top of the column unless {@link canvasDatagrid.header.title} is defined.
     * @property type - The data type of this header.  This value should match properties in {@link canvasDatagrid.formatters}, {@link canvasDatagrid.filters}, {@link canvasDatagrid.sorters} to take full advantage of formatting, sorting and filtering when not defining these properties within this header.
     * @property title - The value that is actually displayed to the user at the top of the column.  If no value is present, {@link canvasDatagrid.header.name} will be used instead.
     * @property width - The mutable width of this column in pixels.  The user can override this value if {@link canvasDatagrid.attributes.allowColumnResizing} is set to `true`.
     * @property hidden - When true, the column will not be included in the visible schema.  This means selection, copy, and drawing functions will not display this column or values from this column.
     * @property filter - A {@link canvasDatagrid.filter} function that defines how filters will work against data in this column.
     * @property formatter - A {@link canvasDatagrid.formatter} function that defines how data will be formatted when drawn onto cells belonging to this column.
     * @property sorter - A {@link canvasDatagrid.sorter} function that defines how data will sorted within this column.
     * @property defaultValue - The default value of this column for new rows.  This can be a function or string.  When using a string, this string value will be used in the new cell.  When using a function, it must return a string, which will be used in the new cell.  The arguments passed to this function are: argument[0] = {@link canvasDatagrid.header}, argument[1] = row index.
     */
    class header {
        /**
         * The name of the header.  This must match the property name of an object in the {@link canvasDatagrid.data} array.  This is the only required property of a {@link canvasDatagrid.header}.  This value will appear at the top of the column unless {@link canvasDatagrid.header.title} is defined.
        */
        name: string;
        /**
         * The data type of this header.  This value should match properties in {@link canvasDatagrid.formatters}, {@link canvasDatagrid.filters}, {@link canvasDatagrid.sorters} to take full advantage of formatting, sorting and filtering when not defining these properties within this header.
        */
        type: string;
        /**
         * The value that is actually displayed to the user at the top of the column.  If no value is present, {@link canvasDatagrid.header.name} will be used instead.
        */
        title: string;
        /**
         * The mutable width of this column in pixels.  The user can override this value if {@link canvasDatagrid.attributes.allowColumnResizing} is set to `true`.
        */
        width: number;
        /**
         * When true, the column will not be included in the visible schema.  This means selection, copy, and drawing functions will not display this column or values from this column.
        */
        hidden: boolean;
        /**
         * A {@link canvasDatagrid.filter} function that defines how filters will work against data in this column.
        */
        filter: (...params: any[]) => any;
        /**
         * A {@link canvasDatagrid.formatter} function that defines how data will be formatted when drawn onto cells belonging to this column.
        */
        formatter: (...params: any[]) => any;
        /**
         * A {@link canvasDatagrid.sorter} function that defines how data will sorted within this column.
        */
        sorter: (...params: any[]) => any;
        /**
         * The default value of this column for new rows.  This can be a function or string.  When using a string, this string value will be used in the new cell.  When using a function, it must return a string, which will be used in the new cell.  The arguments passed to this function are: argument[0] = {@link canvasDatagrid.header}, argument[1] = row index.
        */
        defaultValue: ((...params: any[]) => any) | string;
    }
    /**
     * A cell on the grid.
     * @property type - Data type used by this cell as dictated by the column.
     * @property style - Visual style of cell. Can be any one of cell, activeCell, columnHeaderCell, cornerCell, or rowHeaderCell. Prefix of each style name.
     * @property x - The x coordinate of this cell on the grid.
     * @property y - The y coordinate of this cell on the grid.
     * @property nodeType - Always 'canvas-datagrid-cell'.
     * @property offsetTop - The y coordinate of this cell on the grid canvas.
     * @property offsetLeft - The x coordinate of this cell on the grid canvas.
     * @property scrollTop - The scrollTop value of the scrollBox.
     * @property scrollLeft - The scrollLeft value of the scrollBox.
     * @property rowOpen - When true, this row is a tree grid enabled cell and the tree is in the open state.
     * @property hovered - When true, this cell is hovered.
     * @property selected - When true, this cell is selected.
     * @property active - When true, this cell is the active cell.
     * @property width - Width of the cell on the canvas.
     * @property height - Height of the cell on the canvas.
     * @property userWidth - User set width of the cell on the canvas. If undefined, the user has not set this column.
     * @property userHeight - Height of the cell on the canvas. If undefined, the user has not set this row.
     * @property data - The row of data this cell belongs to.
     * @property header - The schema column this cell belongs to.
     * @property columnIndex - The column index of the cell.
     * @property rowIndex - The row index of the cell.
     * @property sortColumnIndex - The column index of the cell after the user has reordered it.
     * @property sortRowIndex - The column index of the cell after the user has reordered it.
     * @property value - The value of the cell.
     * @property formattedValue - The value after passing through any formatters.  See {@link canvasDatagrid.formatters}.
     * @property isColumnHeaderCellCap - When true, the cell is the cap at the right side end of the header cells.
     * @property parentGrid - The grid to which this cell belongs.
     * @property gridId - If this cell contains a grid, this is the grids unique id.
     * @property isGrid - When true, the cell is a grid.
     * @property isHeader - When true, the cell is a column or row header.
     * @property isColumnHeader - When true, the cell is a column header.
     * @property isRowHeader - When true, the cell is a row header.
     * @property isCorner - When true, the cell is the upper left corner cell.
     * @property activeHeader - When true, the cell is an active header cell, meaning the active cell is in the same row or column.
     * @property horizontalAlignment - The horizontal alignment of the cell.
     * @property verticalAlignment - The vertical alignment of the cell.
     * @property innerHTML - HTML, if any, in the cell.  If set, HTML will be rendered into the cell.
     * @property text - The text object in the cell.
     * @property text.x - The x coordinate of the text.
     * @property text.y - The y coordinate of the text.
     * @property text.width - The width of the text, including truncation and ellipsis.
     * @property text.value - The value of the text, including truncation and ellipsis.
     */
    class cell {
        /**
         * Data type used by this cell as dictated by the column.
        */
        type: string;
        /**
         * Visual style of cell. Can be any one of cell, activeCell, columnHeaderCell, cornerCell, or rowHeaderCell. Prefix of each style name.
        */
        style: string;
        /**
         * The x coordinate of this cell on the grid.
        */
        x: number;
        /**
         * The y coordinate of this cell on the grid.
        */
        y: number;
        /**
         * Always 'canvas-datagrid-cell'.
        */
        nodeType: string;
        /**
         * The y coordinate of this cell on the grid canvas.
        */
        offsetTop: number;
        /**
         * The x coordinate of this cell on the grid canvas.
        */
        offsetLeft: number;
        /**
         * The scrollTop value of the scrollBox.
        */
        scrollTop: number;
        /**
         * The scrollLeft value of the scrollBox.
        */
        scrollLeft: number;
        /**
         * When true, this row is a tree grid enabled cell and the tree is in the open state.
        */
        rowOpen: boolean;
        /**
         * When true, this cell is hovered.
        */
        hovered: boolean;
        /**
         * When true, this cell is selected.
        */
        selected: boolean;
        /**
         * When true, this cell is the active cell.
        */
        active: boolean;
        /**
         * Width of the cell on the canvas.
        */
        width: number;
        /**
         * Height of the cell on the canvas.
        */
        height: number;
        /**
         * User set width of the cell on the canvas. If undefined, the user has not set this column.
        */
        userWidth: number;
        /**
         * Height of the cell on the canvas. If undefined, the user has not set this row.
        */
        userHeight: number;
        /**
         * The row of data this cell belongs to.
        */
        data: any;
        /**
         * The schema column this cell belongs to.
        */
        header: header;
        /**
         * The column index of the cell.
        */
        columnIndex: number;
        /**
         * The row index of the cell.
        */
        rowIndex: number;
        /**
         * The column index of the cell after the user has reordered it.
        */
        sortColumnIndex: number;
        /**
         * The column index of the cell after the user has reordered it.
        */
        sortRowIndex: number;
        /**
         * The value of the cell.
        */
        value: string;
        /**
         * The value after passing through any formatters.  See {@link canvasDatagrid.formatters}.
        */
        formattedValue: string;
        /**
         * When true, the cell is the cap at the right side end of the header cells.
        */
        isColumnHeaderCellCap: boolean;
        /**
         * The grid to which this cell belongs.
        */
        parentGrid: canvasDatagrid;
        /**
         * If this cell contains a grid, this is the grids unique id.
        */
        gridId: string;
        /**
         * When true, the cell is a grid.
        */
        isGrid: boolean;
        /**
         * When true, the cell is a column or row header.
        */
        isHeader: boolean;
        /**
         * When true, the cell is a column header.
        */
        isColumnHeader: boolean;
        /**
         * When true, the cell is a row header.
        */
        isRowHeader: boolean;
        /**
         * When true, the cell is the upper left corner cell.
        */
        isCorner: boolean;
        /**
         * When true, the cell is an active header cell, meaning the active cell is in the same row or column.
        */
        activeHeader: boolean;
        /**
         * The horizontal alignment of the cell.
        */
        horizontalAlignment: string;
        /**
         * The vertical alignment of the cell.
        */
        verticalAlignment: string;
        /**
         * HTML, if any, in the cell.  If set, HTML will be rendered into the cell.
        */
        innerHTML: string;
        /**
         * The text object in the cell.
        */
        text: {
            x: any;
            y: any;
            width: any;
            value: any;
        };
    }
    /**
     * Styles for the canvas data grid.  Standard CSS styles still apply but are not listed here.
     * @property [activeCellBackgroundColor = rgba(255, 255, 255, 1)] - Style of activeCellBackgroundColor.
     * @property [activeCellBorderColor = rgba(110, 168, 255, 1)] - Style of activeCellBorderColor.
     * @property [activeCellBorderWidth = 0.25] - Style of activeCellBorderWidth.
     * @property [activeCellColor = rgba(0, 0, 0, 1)] - Style of activeCellColor.
     * @property [activeCellFont = 16px sans-serif] - Style of activeCellFont.
     * @property [activeCellHoverBackgroundColor = rgba(255, 255, 255, 1)] - Style of activeCellHoverBackgroundColor.
     * @property [activeCellHorizontalAlignment = left] - Style of activeCellHorizontalAlignment.
     * @property [activeCellHoverColor = rgba(0, 0, 0, 1)] - Style of activeCellHoverColor.
     * @property [activeCellOverlayBorderColor = rgba(66, 133, 244, 1)] - Style of activeCellOverlayBorderColor.
     * @property [activeCellOverlayBorderWidth = 1.50] - Style of activeCellOverlayBorderWidth.
     * @property [activeCellPaddingBottom = 5] - Style of activeCellPaddingBottom.
     * @property [activeCellPaddingLeft = 5] - Style of activeCellPaddingLeft.
     * @property [activeCellPaddingRight = 7] - Style of activeCellPaddingRight.
     * @property [activeCellPaddingTop = 5] - Style of activeCellPaddingTop.
     * @property [activeCellSelectedBackgroundColor = rgba(236, 243, 255, 1)] - Style of activeCellSelectedBackgroundColor.
     * @property [activeCellSelectedColor = rgba(0, 0, 0, 1)] - Style of activeCellSelectedColor.
     * @property [activeCellVerticalAlignment = center] - Style of activeCellVerticalAlignment.
     * @property [activeColumnHeaderCellBackgroundColor = rgba(225, 225, 225, 1)] - Style of activeColumnHeaderCellBackgroundColor.
     * @property [activeColumnHeaderCellColor = rgba(0, 0, 0, 1)] - Style of activeColumnHeaderCellColor.
     * @property [activeRowHeaderCellBackgroundColor = rgba(225, 225, 225, 1)] - Style of activeRowHeaderCellBackgroundColor.
     * @property [activeRowHeaderCellColor = rgba(0, 0, 0, 1)] - Style of activeRowHeaderCellColor.
     * @property [autocompleteBottomMargin = 60] - Style of autocompleteBottomMargin.
     * @property [autosizeHeaderCellPadding = 8] - Style of autosizeHeaderCellPadding.
     * @property [autosizePadding = 5] - Style of autosizePadding.
     * @property [gridBorderCollapse = collapse] - Style of gridBorderCollapse.  When grid border collapse is set to the default value of `collapse`, the bottom border and the top border of the next cell down will be merged into a single border.  The only other setting is `expand` which allows the full border to be drawn.
     * @property [cellAutoResizePadding = 13] - Style of cellAutoResizePadding.
     * @property [cellBackgroundColor = rgba(255, 255, 255, 1)] - Style of cellBackgroundColor.
     * @property [cellBorderColor = rgba(195, 199, 202, 1)] - Style of cellBorderColor.
     * @property [cellBorderWidth = 0.25] - Style of cellBorderWidth.
     * @property [cellColor = rgba(0, 0, 0, 1)] - Style of cellColor.
     * @property [cellFont = 16px sans-serif] - Style of cellFont.
     * @property [cellGridHeight = 250] - Style of cellGridHeight.
     * @property [cellHeight = 24] - Style of cellHeight.
     * @property [cellHeightWithChildGrid = 150] - Style of cellHeightWithChildGrid.
     * @property [cellHorizontalAlignment = left] - Style of cellHorizontalAlignment.
     * @property [cellHoverBackgroundColor = rgba(255, 255, 255, 1)] - Style of cellHoverBackgroundColor.
     * @property [cellHoverColor = rgba(0, 0, 0, 1)] - Style of cellHoverColor.
     * @property [cellPaddingBottom = 5] - Style of cellPaddingBottom.
     * @property [cellPaddingLeft = 5] - Style of cellPaddingLeft.
     * @property [cellPaddingRight = 5] - Style of cellPaddingRight.
     * @property [cellPaddingTop = 5] - Style of cellPaddingTop.
     * @property [cellSelectedBackgroundColor = rgba(236, 243, 255, 1)] - Style of cellSelectedBackgroundColor.
     * @property [cellSelectedColor = rgba(0, 0, 0, 1)] - Style of cellSelectedColor.
     * @property [cellVerticalAlignment = center] - Style of cellVerticalAlignment.
     * @property [cellWhiteSpace = nowrap] - Style of cellWhiteSpace. Can be 'nowrap' or 'normal'.
     * @property [cellLineHeight = 1] - The line height of each wrapping line as a percentage.
     * @property [cellLineSpacing = 3] - Style of cellLineSpacing.
     * @property [cellWidthWithChildGrid = 250] - Style of cellWidthWithChildGrid.
     * @property [childContextMenuMarginLeft = -5] - Style of childContextMenuMarginLeft.
     * @property [childContextMenuMarginTop = 0] - Style of childContextMenuMarginTop.
     * @property [childContextMenuArrowHTML = &#x25BA;] - Style of childContextMenuArrowHTML.
     * @property [childContextMenuArrowColor = rgba(43, 48, 43, 1)] - Style of childContextMenuArrowColor.
     * @property [columnGroupRowHeight = 25] - Style of columnGroupRowHeight.
     * @property [contextMenuChildArrowFontSize = 12px] - Style of contextMenuChildArrowFontSize.
     * @property [cellWidth = 250] - Style of cellWidth.
     * @property [contextMenuBackground = rgba(240, 240, 240, 1)] - Style of contextMenuBackground.
     * @property [contextMenuBorder = solid 1px rgba(158, 163, 169, 1)] - Style of contextMenuBorder.
     * @property [contextMenuBorderRadius = 3px] - Style of contextMenuBorderRadius.
     * @property [contextMenuColor = rgba(43, 48, 43, 1)] - Style of contextMenuColor.
     * @property [contextMenuCursor = default] - Style of contextMenuCursor.
     * @property [contextMenuFilterInvalidExpresion = rgba(237, 155, 156, 1)] - Style of contextMenuFilterInvalidExpresion.
     * @property [contextMenuFontFamily = sans-serif] - Style of contextMenuFontFamily.
     * @property [contextMenuFontSize = 16px] - Style of contextMenuFontSize.
     * @property [contextMenuHoverBackground = rgba(182, 205, 250, 1)] - Style of contextMenuHoverBackground.
     * @property [contextMenuHoverColor = rgba(43, 48, 153, 1)] - Style of contextMenuHoverColor.
     * @property [contextMenuItemBorderRadius = 3px] - Style of contextMenuItemBorderRadius.
     * @property [contextMenuItemMargin = 2px] - Style of contextMenuItemMargin.
     * @property [contextMenuLabelDisplay = inline-block] - Style of contextMenuLabelDisplay.
     * @property [contextMenuLabelMargin = 0 3px 0 0] - Style of contextMenuLabelMargin.
     * @property [contextMenuLabelMaxWidth = 700px] - Style of contextMenuLabelMaxWidth.
     * @property [contextMenuLabelMinWidth = 75px] - Style of contextMenuLabelMinWidth.
     * @property [contextMenuMarginLeft = 3] - Style of contextMenuMarginLeft.
     * @property [contextMenuMarginTop = -3] - Style of contextMenuMarginTop.
     * @property [contextMenuWindowMargin = 6] - Style of contextMenuWindowMargin.
     * @property [contextMenuOpacity = 0.98] - Style of contextMenuOpacity.
     * @property [contextMenuPadding = 2px] - Style of contextMenuPadding.
     * @property [contextMenuArrowUpHTML = &#x25B2;] - Style of contextMenuArrowUpHTML.
     * @property [contextMenuArrowDownHTML = &#x25BC;] - Style of contextMenuArrowDownHTML.
     * @property [contextMenuArrowColor = rgba(43, 48, 43, 1)] - Style of contextMenuArrowColor.
     * @property [contextMenuZIndex = 10000] - Style of contextMenuZIndex.
     * @property [contextFilterButtonHTML = &#x25BC;] - Style of contextFilterButtonHTML.
     * @property [contextFilterButtonBorder = solid 1px rgba(158, 163, 169, 1)] - Style of contextFilterButtonBorder.
     * @property [contextFilterButtonBorderRadius = 3px] - Style of contextFilterButtonBorderRadius.
     * @property [cornerCellBackgroundColor = rgba(240, 240, 240, 1)] - Style of cornerCellBackgroundColor.
     * @property [cornerCellBorderColor = rgba(202, 202, 202, 1)] - Style of cornerCellBorderColor.
     * @property [debugBackgroundColor = rgba(0, 0, 0, .0)] - Style of debugBackgroundColor.
     * @property [debugColor = rgba(255, 15, 24, 1)] - Style of debugColor.
     * @property [debugEntitiesColor = rgba(76, 231, 239, 1.00)] - Style of debugEntitiesColor.
     * @property [debugFont = 11px sans-serif] - Style of debugFont.
     * @property [debugPerfChartBackground = rgba(29, 25, 26, 1.00)] - Style of debugPerfChartBackground.
     * @property [debugPerfChartTextColor = rgba(255, 255, 255, 0.8)] - Style of debugPerfChartTextColor.
     * @property [debugPerformanceColor = rgba(252, 255, 37, 1.00)] - Style of debugPerformanceColor.
     * @property [debugScrollHeightColor = rgba(252, 255, 37, 1.00)] - Style of debugScrollHeightColor.
     * @property [debugScrollWidthColor = rgba(66, 255, 27, 1.00)] - Style of debugScrollWidthColor.
     * @property [debugTouchPPSXColor = rgba(246, 102, 24, 1.00)] - Style of debugTouchPPSXColor.
     * @property [debugTouchPPSYColor = rgba(186, 0, 255, 1.00)] - Style of debugTouchPPSYColor.
     * @property [editCellBorder = solid 1px rgba(110, 168, 255, 1)] - Style of editCellBorder.
     * @property [editCellBoxShadow = 0 2px 5px rgba(0,0,0,0.4)] - Style of editCellBoxShadow.
     * @property [editCellFontFamily = sans-serif] - Style of editCellFontFamily.
     * @property [editCellFontSize = 16px] - Style of editCellFontSize.
     * @property [editCellPaddingLeft = 4] - Style of editCellPaddingLeft.
     * @property [editCellColor = black] - Style of editCellColor.
     * @property [editCellBackgroundColor = white] - Style of editCellBackgroundColor.
     * @property [editCellZIndex = 10000] - Style of editCellZIndex.
     * @property [fillOverlayBorderColor = rgba(127, 127, 127, 1)] - Style of fillOverlayBorderColor.
     * @property [fillOverlayBorderWidth = 2] - Style of fillOverlayBorderWidth.
     * @property [gridBackgroundColor = rgba(240, 240, 240, 1)] - Style of gridBackgroundColor.
     * @property [gridBorderColor = rgba(202, 202, 202, 1)] - Style of gridBorderColor.
     * @property [gridBorderWidth = 1] - Style of gridBorderWidth.
     * @property [groupIndicatorColor = rgba(155, 155, 155, 1)'] - Foreground color of the group indicator(icon).
     * @property [groupIndicatorBackgroundColor = rgba(255, 255, 255, 1)'] - Background color of the group indicator(icon).
     * @property [columnHeaderCellBackgroundColor = rgba(240, 240, 240, 1)] - Style of columnHeaderCellBackgroundColor.
     * @property [columnHeaderCellBorderColor = rgba(172, 172, 172, 1)] - Style of columnHeaderCellBackgroundColor.
     * @property [columnHeaderCellBorderWidth = 1] - Style of columnHeaderCellBackgroundColor.
     * @property [columnHeaderCellCapBackgroundColor = rgba(240, 240, 240, 1)] - Style of columnHeaderCellCapBackgroundColor.
     * @property [columnHeaderCellCapBorderColor = rgba(172, 172, 172, 1)] - Style of columnHeaderCellCapBackgroundColor.
     * @property [columnHeaderCellCapBorderWidth = 1] - Style of columnHeaderCellCapBackgroundColor.
     * @property [columnHeaderCellBorderColor = rgba(152, 152, 152, 1)] - Style of columnHeaderCellBorderColor.
     * @property [columnHeaderCellBorderWidth = 0.25] - Style of columnHeaderCellBorderWidth.
     * @property [columnHeaderCellColor = rgba(50, 50, 50, 1)] - Style of columnHeaderCellColor.
     * @property [columnHeaderCellFont = 16px sans-serif] - Style of columnHeaderCellFont.
     * @property [columnHeaderCellHeight = 25] - Style of columnHeaderCellHeight.
     * @property [columnHeaderCellHorizontalAlignment = left] - Style of columnHeaderCellHorizontalAlignment.
     * @property [columnHeaderCellHoverBackgroundColor = rgba(235, 235, 235, 1)] - Style of columnHeaderCellHoverBackgroundColor.
     * @property [columnHeaderCellHoverColor = rgba(0, 0, 0, 1)] - Style of columnHeaderCellHoverColor.
     * @property [columnHeaderCellPaddingBottom = 5] - Style of columnHeaderCellPaddingBottom.
     * @property [columnHeaderCellPaddingLeft = 5] - Style of columnHeaderCellPaddingLeft.
     * @property [columnHeaderCellPaddingRight = 7] - Style of columnHeaderCellPaddingRight.
     * @property [columnHeaderCellPaddingTop = 5] - Style of columnHeaderCellPaddingTop.
     * @property [columnHeaderCellVerticalAlignment = center] - Style of columnHeaderCellVerticalAlignment.
     * @property [columnHeaderOrderByArrowBorderColor = rgba(195, 199, 202, 1)] - Style of columnHeaderOrderByArrowBorderColor.
     * @property [columnHeaderOrderByArrowBorderWidth = 1] - Style of columnHeaderOrderByArrowBorderWidth.
     * @property [columnHeaderOrderByArrowColor = rgba(155, 155, 155, 1)] - Style of columnHeaderOrderByArrowColor.
     * @property [columnHeaderOrderByArrowHeight = 8] - Style of columnHeaderOrderByArrowHeight.
     * @property [columnHeaderOrderByArrowMarginLeft = 0] - Style of columnHeaderOrderByArrowMarginLeft.
     * @property [columnHeaderOrderByArrowMarginRight = 5] - Style of columnHeaderOrderByArrowMarginRight.
     * @property [columnHeaderOrderByArrowMarginTop = 6] - Style of columnHeaderOrderByArrowMarginTop.
     * @property [columnHeaderOrderByArrowWidth = 13] - Style of columnHeaderOrderByArrowWidth.
     * @property [rowHeaderCellWidth = 57] - Style of rowHeaderCellWidth.
     * @property [minColumnWidth = 45] - Style of minColumnWidth.
     * @property [height = auto] - Style of height.
     * @property [minHeight = 24] - Style of minHeight.
     * @property [minRowHeight = 24] - Style of minRowHeight.
     * @property [name = default] - Style of name.
     * @property [reorderMarkerBackgroundColor = rgba(0, 0, 0, 0.1)] - Style of reorderMarkerBackgroundColor.
     * @property [reorderMarkerBorderColor = rgba(0, 0, 0, 0.2)] - Style of reorderMarkerBorderColor.
     * @property [reorderMarkerBorderWidth = 1.25] - Style of reorderMarkerBorderWidth.
     * @property [reorderMarkerIndexBorderColor = rgba(66, 133, 244, 1)] - Style of reorderMarkerIndexBorderColor.
     * @property [reorderMarkerIndexBorderWidth = 2.75] - Style of reorderMarkerIndexBorderWidth.
     * @property [resizeMarkerColor = rgba(0, 0, 0, 0.2)] - Style of resizeMarkerColor.
     * @property [resizeMarkerSize = 2] - Style of resizeMarkerSize.
     * @property [rowGroupColumnWidth = 25] - Style of rowGroupColumnWidth.
     * @property [rowHeaderCellBackgroundColor = rgba(240, 240, 240, 1)] - Style of rowHeaderCellBackgroundColor.
     * @property [rowHeaderCellBorderColor = rgba(152, 152, 152, 1)] - Style of rowHeaderCellBorderColor.
     * @property [rowHeaderCellBorderWidth = 0.25] - Style of rowHeaderCellBorderWidth.
     * @property [rowHeaderCellColor = rgba(50, 50, 50, 1)] - Style of rowHeaderCellColor.
     * @property [rowHeaderCellFont = 16px sans-serif] - Style of rowHeaderCellFont.
     * @property [rowHeaderCellHeight = 25] - Style of rowHeaderCellHeight.
     * @property [rowHeaderCellHorizontalAlignment = left] - Style of rowHeaderCellHorizontalAlignment.
     * @property [rowHeaderCellHoverBackgroundColor = rgba(235, 235, 235, 1)] - Style of rowHeaderCellHoverBackgroundColor.
     * @property [rowHeaderCellHoverColor = rgba(0, 0, 0, 1)] - Style of rowHeaderCellHoverColor.
     * @property [rowHeaderCellPaddingBottom = 5] - Style of rowHeaderCellPaddingBottom.
     * @property [rowHeaderCellPaddingLeft = 5] - Style of rowHeaderCellPaddingLeft.
     * @property [rowHeaderCellPaddingRight = 5] - Style of rowHeaderCellPaddingRight.
     * @property [rowHeaderCellPaddingTop = 5] - Style of rowHeaderCellPaddingTop.
     * @property [rowHeaderCellRowNumberGapHeight = 5] - Style of rowHeaderCellRowNumberGapHeight.
     * @property [rowHeaderCellRowNumberGapColor = rgba(50, 50, 50, 1)] - Style of rowHeaderCellRowNumberGapColor.
     * @property [rowHeaderCellSelectedBackgroundColor = rgba(217, 217, 217, 1)] - Style of rowHeaderCellSelectedBackgroundColor.
     * @property [rowHeaderCellSelectedColor = rgba(50, 50, 50, 1)] - Style of rowHeaderCellSelectedColor.
     * @property [rowHeaderCellVerticalAlignment = center] - Style of rowHeaderCellVerticalAlignment.
     * @property [scrollBarActiveColor = rgba(125, 125, 125, 1)] - Style of scrollBarActiveColor.
     * @property [scrollBarBackgroundColor = rgba(240, 240, 240, 1)] - Style of scrollBarBackgroundColor.
     * @property [scrollBarBorderColor = rgba(202, 202, 202, 1)] - Style of scrollBarBorderColor.
     * @property [scrollBarBorderWidth = 0.5] - Style of scrollBarBorderWidth.
     * @property [scrollBarBoxBorderRadius = 3] - Style of scrollBarBoxBorderRadius.
     * @property [scrollBarBoxColor = rgba(192, 192, 192, 1)] - Style of scrollBarBoxColor.
     * @property [scrollBarBoxMargin = 2] - Style of scrollBarBoxMargin.
     * @property [scrollBarBoxMinSize = 15] - Style of scrollBarBoxMinSize.
     * @property [scrollBarBoxWidth = 8] - Style of scrollBarBoxWidth.
     * @property [scrollBarCornerBackgroundColor = rgba(240, 240, 240, 1)] - Style of scrollBarCornerBackgroundColor.
     * @property [scrollBarCornerBorderColor = rgba(202, 202, 202, 1)] - Style of scrollBarCornerBorderColor.
     * @property [scrollBarWidth = 11] - Style of scrollBarWidth.
     * @property [selectionOverlayBorderColor = rgba(66, 133, 244, 1)] - Style of selectionOverlayBorderColor.
     * @property [selectionOverlayBorderWidth = 0.75] - Style of selectionOverlayBorderWidth.
     * @property [treeArrowBorderColor = rgba(195, 199, 202, 1)] - Style of treeArrowBorderColor.
     * @property [treeArrowBorderWidth = 1] - Style of treeArrowBorderWidth.
     * @property [treeArrowClickRadius = 5] - Style of treeArrowClickRadius.
     * @property [treeArrowColor = rgba(155, 155, 155, 1)] - Style of treeArrowColor.
     * @property [treeArrowHeight = 8] - Style of treeArrowHeight.
     * @property [treeArrowMarginLeft = 0] - Style of treeArrowMarginLeft.
     * @property [treeArrowMarginRight = 5] - Style of treeArrowMarginRight.
     * @property [treeArrowMarginTop = 6] - Style of treeArrowMarginTop.
     * @property [treeArrowWidth = 13] - Style of treeArrowWidth.
     * @property [treeGridHeight = 250] - Style of treeGridHeight.
     * @property [selectionHandleColor = rgba(66, 133, 244, 1)] - Style of selectionHandleColor.
     * @property [selectionHandleBorderColor = rgba(255, 255, 255, 1)] - Style of selectionHandleBorderColor.
     * @property [selectionHandleSize = 8] - Style of selectionHandleSize.
     * @property [selectionHandleBorderWidth = 1.5] - Style of selectionHandleBorderWidth.
     * @property [selectionHandleType = 'square'] - Style of selectionHandleType.  Can be square or circle.
     * @property [moveOverlayBorderWidth = 1] - Style of moveOverlayBorderWidth.
     * @property [moveOverlayBorderColor = 'rgba(66, 133, 244, 1)'] - Style of moveOverlayBorderColor.
     * @property [moveOverlayBorderSegments = '12, 7'] - Style of moveOverlayBorderSegments.
     * @property [frozenMarkerActiveColor = 'rgba(236, 243, 255, 1)'] - Style of frozenMarkerActiveColor.
     * @property [frozenMarkerActiveBorderColor = 'rgba(110, 168, 255, 1)'] - Style of frozenMarkerActiveBorderColor.
     * @property [frozenMarkerColor = 'rgba(222, 222, 222, 1)'] - Style of frozenMarkerColor.
     * @property [frozenMarkerBorderColor = 'rgba(202, 202, 202, 1)'] - Style of frozenMarkerBorderColor.
     * @property [frozenMarkerBorderWidth = 1] - Style of frozenMarkerBorderWidth.
     * @property [frozenMarkerWidth = 1] - Style of frozenMarkerWidth.
     * @property [overflowY = auto] - When set to hidden, vertical scroll bar will be hidden.  When set to auto vertical scroll bar will appear when data overflows the height.  When set to scroll the vertical scrollbar will always be visible.
     * @property [overflowX = auto] - When set to hidden, horizontal scroll bar will be hidden.  When set to auto horizontal scroll bar will appear when data overflows the width.  When set to scroll the horizontal scrollbar will always be visible.
     * @property [width = auto] - Style of width.
     *
     *  ['', 'normal'],
     */
    class style {
        /**
         * Style of activeCellBackgroundColor.
        */
        activeCellBackgroundColor?: string;
        /**
         * Style of activeCellBorderColor.
        */
        activeCellBorderColor?: string;
        /**
         * Style of activeCellBorderWidth.
        */
        activeCellBorderWidth?: number;
        /**
         * Style of activeCellColor.
        */
        activeCellColor?: string;
        /**
         * Style of activeCellFont.
        */
        activeCellFont?: string;
        /**
         * Style of activeCellHoverBackgroundColor.
        */
        activeCellHoverBackgroundColor?: string;
        /**
         * Style of activeCellHorizontalAlignment.
        */
        activeCellHorizontalAlignment?: string;
        /**
         * Style of activeCellHoverColor.
        */
        activeCellHoverColor?: string;
        /**
         * Style of activeCellOverlayBorderColor.
        */
        activeCellOverlayBorderColor?: string;
        /**
         * Style of activeCellOverlayBorderWidth.
        */
        activeCellOverlayBorderWidth?: number;
        /**
         * Style of activeCellPaddingBottom.
        */
        activeCellPaddingBottom?: number;
        /**
         * Style of activeCellPaddingLeft.
        */
        activeCellPaddingLeft?: number;
        /**
         * Style of activeCellPaddingRight.
        */
        activeCellPaddingRight?: number;
        /**
         * Style of activeCellPaddingTop.
        */
        activeCellPaddingTop?: number;
        /**
         * Style of activeCellSelectedBackgroundColor.
        */
        activeCellSelectedBackgroundColor?: string;
        /**
         * Style of activeCellSelectedColor.
        */
        activeCellSelectedColor?: string;
        /**
         * Style of activeCellVerticalAlignment.
        */
        activeCellVerticalAlignment?: string;
        /**
         * Style of activeColumnHeaderCellBackgroundColor.
        */
        activeColumnHeaderCellBackgroundColor?: string;
        /**
         * Style of activeColumnHeaderCellColor.
        */
        activeColumnHeaderCellColor?: string;
        /**
         * Style of activeRowHeaderCellBackgroundColor.
        */
        activeRowHeaderCellBackgroundColor?: string;
        /**
         * Style of activeRowHeaderCellColor.
        */
        activeRowHeaderCellColor?: string;
        /**
         * Style of autocompleteBottomMargin.
        */
        autocompleteBottomMargin?: number;
        /**
         * Style of autosizeHeaderCellPadding.
        */
        autosizeHeaderCellPadding?: number;
        /**
         * Style of autosizePadding.
        */
        autosizePadding?: number;
        /**
         * Style of gridBorderCollapse.  When grid border collapse is set to the default value of `collapse`, the bottom border and the top border of the next cell down will be merged into a single border.  The only other setting is `expand` which allows the full border to be drawn.
        */
        gridBorderCollapse?: string;
        /**
         * Style of cellAutoResizePadding.
        */
        cellAutoResizePadding?: number;
        /**
         * Style of cellBackgroundColor.
        */
        cellBackgroundColor?: string;
        /**
         * Style of cellBorderColor.
        */
        cellBorderColor?: string;
        /**
         * Style of cellBorderWidth.
        */
        cellBorderWidth?: number;
        /**
         * Style of cellColor.
        */
        cellColor?: string;
        /**
         * Style of cellFont.
        */
        cellFont?: string;
        /**
         * Style of cellGridHeight.
        */
        cellGridHeight?: number;
        /**
         * Style of cellHeight.
        */
        cellHeight?: number;
        /**
         * Style of cellHeightWithChildGrid.
        */
        cellHeightWithChildGrid?: number;
        /**
         * Style of cellHorizontalAlignment.
        */
        cellHorizontalAlignment?: string;
        /**
         * Style of cellHoverBackgroundColor.
        */
        cellHoverBackgroundColor?: string;
        /**
         * Style of cellHoverColor.
        */
        cellHoverColor?: string;
        /**
         * Style of cellPaddingBottom.
        */
        cellPaddingBottom?: number;
        /**
         * Style of cellPaddingLeft.
        */
        cellPaddingLeft?: number;
        /**
         * Style of cellPaddingRight.
        */
        cellPaddingRight?: number;
        /**
         * Style of cellPaddingTop.
        */
        cellPaddingTop?: number;
        /**
         * Style of cellSelectedBackgroundColor.
        */
        cellSelectedBackgroundColor?: string;
        /**
         * Style of cellSelectedColor.
        */
        cellSelectedColor?: string;
        /**
         * Style of cellVerticalAlignment.
        */
        cellVerticalAlignment?: string;
        /**
         * Style of cellWhiteSpace. Can be 'nowrap' or 'normal'.
        */
        cellWhiteSpace?: string;
        /**
         * The line height of each wrapping line as a percentage.
        */
        cellLineHeight?: number;
        /**
         * Style of cellLineSpacing.
        */
        cellLineSpacing?: number;
        /**
         * Style of cellWidthWithChildGrid.
        */
        cellWidthWithChildGrid?: number;
        /**
         * Style of childContextMenuMarginLeft.
        */
        childContextMenuMarginLeft?: number;
        /**
         * Style of childContextMenuMarginTop.
        */
        childContextMenuMarginTop?: number;
        /**
         * Style of childContextMenuArrowHTML.
        */
        childContextMenuArrowHTML?: string;
        /**
         * Style of childContextMenuArrowColor.
        */
        childContextMenuArrowColor?: string;
        /**
         * Style of columnGroupRowHeight.
        */
        columnGroupRowHeight?: number;
        /**
         * Style of contextMenuChildArrowFontSize.
        */
        contextMenuChildArrowFontSize?: string;
        /**
         * Style of cellWidth.
        */
        cellWidth?: number;
        /**
         * Style of contextMenuBackground.
        */
        contextMenuBackground?: string;
        /**
         * Style of contextMenuBorder.
        */
        contextMenuBorder?: string;
        /**
         * Style of contextMenuBorderRadius.
        */
        contextMenuBorderRadius?: string;
        /**
         * Style of contextMenuColor.
        */
        contextMenuColor?: string;
        /**
         * Style of contextMenuCursor.
        */
        contextMenuCursor?: string;
        /**
         * Style of contextMenuFilterInvalidExpresion.
        */
        contextMenuFilterInvalidExpresion?: string;
        /**
         * Style of contextMenuFontFamily.
        */
        contextMenuFontFamily?: string;
        /**
         * Style of contextMenuFontSize.
        */
        contextMenuFontSize?: string;
        /**
         * Style of contextMenuHoverBackground.
        */
        contextMenuHoverBackground?: string;
        /**
         * Style of contextMenuHoverColor.
        */
        contextMenuHoverColor?: string;
        /**
         * Style of contextMenuItemBorderRadius.
        */
        contextMenuItemBorderRadius?: string;
        /**
         * Style of contextMenuItemMargin.
        */
        contextMenuItemMargin?: string;
        /**
         * Style of contextMenuLabelDisplay.
        */
        contextMenuLabelDisplay?: string;
        /**
         * Style of contextMenuLabelMargin.
        */
        contextMenuLabelMargin?: string;
        /**
         * Style of contextMenuLabelMaxWidth.
        */
        contextMenuLabelMaxWidth?: string;
        /**
         * Style of contextMenuLabelMinWidth.
        */
        contextMenuLabelMinWidth?: string;
        /**
         * Style of contextMenuMarginLeft.
        */
        contextMenuMarginLeft?: number;
        /**
         * Style of contextMenuMarginTop.
        */
        contextMenuMarginTop?: number;
        /**
         * Style of contextMenuWindowMargin.
        */
        contextMenuWindowMargin?: number;
        /**
         * Style of contextMenuOpacity.
        */
        contextMenuOpacity?: string;
        /**
         * Style of contextMenuPadding.
        */
        contextMenuPadding?: string;
        /**
         * Style of contextMenuArrowUpHTML.
        */
        contextMenuArrowUpHTML?: string;
        /**
         * Style of contextMenuArrowDownHTML.
        */
        contextMenuArrowDownHTML?: string;
        /**
         * Style of contextMenuArrowColor.
        */
        contextMenuArrowColor?: string;
        /**
         * Style of contextMenuZIndex.
        */
        contextMenuZIndex?: number;
        /**
         * Style of contextFilterButtonHTML.
        */
        contextFilterButtonHTML?: string;
        /**
         * Style of contextFilterButtonBorder.
        */
        contextFilterButtonBorder?: string;
        /**
         * Style of contextFilterButtonBorderRadius.
        */
        contextFilterButtonBorderRadius?: string;
        /**
         * Style of cornerCellBackgroundColor.
        */
        cornerCellBackgroundColor?: string;
        /**
         * Style of cornerCellBorderColor.
        */
        cornerCellBorderColor?: string;
        /**
         * Style of debugBackgroundColor.
        */
        debugBackgroundColor?: string;
        /**
         * Style of debugColor.
        */
        debugColor?: string;
        /**
         * Style of debugEntitiesColor.
        */
        debugEntitiesColor?: string;
        /**
         * Style of debugFont.
        */
        debugFont?: string;
        /**
         * Style of debugPerfChartBackground.
        */
        debugPerfChartBackground?: string;
        /**
         * Style of debugPerfChartTextColor.
        */
        debugPerfChartTextColor?: string;
        /**
         * Style of debugPerformanceColor.
        */
        debugPerformanceColor?: string;
        /**
         * Style of debugScrollHeightColor.
        */
        debugScrollHeightColor?: string;
        /**
         * Style of debugScrollWidthColor.
        */
        debugScrollWidthColor?: string;
        /**
         * Style of debugTouchPPSXColor.
        */
        debugTouchPPSXColor?: string;
        /**
         * Style of debugTouchPPSYColor.
        */
        debugTouchPPSYColor?: string;
        /**
         * Style of editCellBorder.
        */
        editCellBorder?: string;
        /**
         * Style of editCellBoxShadow.
        */
        editCellBoxShadow?: string;
        /**
         * Style of editCellFontFamily.
        */
        editCellFontFamily?: string;
        /**
         * Style of editCellFontSize.
        */
        editCellFontSize?: string;
        /**
         * Style of editCellPaddingLeft.
        */
        editCellPaddingLeft?: number;
        /**
         * Style of editCellColor.
        */
        editCellColor?: string;
        /**
         * Style of editCellBackgroundColor.
        */
        editCellBackgroundColor?: string;
        /**
         * Style of editCellZIndex.
        */
        editCellZIndex?: number;
        /**
         * Style of fillOverlayBorderColor.
        */
        fillOverlayBorderColor?: string;
        /**
         * Style of fillOverlayBorderWidth.
        */
        fillOverlayBorderWidth?: number;
        /**
         * Style of gridBackgroundColor.
        */
        gridBackgroundColor?: string;
        /**
         * Style of gridBorderColor.
        */
        gridBorderColor?: string;
        /**
         * Style of gridBorderWidth.
        */
        gridBorderWidth?: number;
        /**
         * Foreground color of the group indicator(icon).
        */
        groupIndicatorColor?: string;
        /**
         * Background color of the group indicator(icon).
        */
        groupIndicatorBackgroundColor?: string;
        /**
         * Style of columnHeaderCellBackgroundColor.
        */
        columnHeaderCellBackgroundColor?: string;
        /**
         * Style of columnHeaderCellBorderColor.
        */
        columnHeaderCellBorderColor?: string;
        /**
         * Style of columnHeaderCellBorderWidth.
        */
        columnHeaderCellBorderWidth?: number;
        /**
         * Style of columnHeaderCellCapBackgroundColor.
        */
        columnHeaderCellCapBackgroundColor?: string;
        /**
         * Style of columnHeaderCellCapBackgroundColor.
        */
        columnHeaderCellCapBorderColor?: string;
        /**
         * Style of columnHeaderCellCapBackgroundColor.
        */
        columnHeaderCellCapBorderWidth?: number;
        /**
         * Style of columnHeaderCellBorderColor.
        */
        columnHeaderCellBorderColor?: string;
        /**
         * Style of columnHeaderCellBorderWidth.
        */
        columnHeaderCellBorderWidth?: number;
        /**
         * Style of columnHeaderCellColor.
        */
        columnHeaderCellColor?: string;
        /**
         * Style of columnHeaderCellFont.
        */
        columnHeaderCellFont?: string;
        /**
         * Style of columnHeaderCellHeight.
        */
        columnHeaderCellHeight?: number;
        /**
         * Style of columnHeaderCellHorizontalAlignment.
        */
        columnHeaderCellHorizontalAlignment?: string;
        /**
         * Style of columnHeaderCellHoverBackgroundColor.
        */
        columnHeaderCellHoverBackgroundColor?: string;
        /**
         * Style of columnHeaderCellHoverColor.
        */
        columnHeaderCellHoverColor?: string;
        /**
         * Style of columnHeaderCellPaddingBottom.
        */
        columnHeaderCellPaddingBottom?: number;
        /**
         * Style of columnHeaderCellPaddingLeft.
        */
        columnHeaderCellPaddingLeft?: number;
        /**
         * Style of columnHeaderCellPaddingRight.
        */
        columnHeaderCellPaddingRight?: number;
        /**
         * Style of columnHeaderCellPaddingTop.
        */
        columnHeaderCellPaddingTop?: number;
        /**
         * Style of columnHeaderCellVerticalAlignment.
        */
        columnHeaderCellVerticalAlignment?: string;
        /**
         * Style of columnHeaderOrderByArrowBorderColor.
        */
        columnHeaderOrderByArrowBorderColor?: string;
        /**
         * Style of columnHeaderOrderByArrowBorderWidth.
        */
        columnHeaderOrderByArrowBorderWidth?: number;
        /**
         * Style of columnHeaderOrderByArrowColor.
        */
        columnHeaderOrderByArrowColor?: string;
        /**
         * Style of columnHeaderOrderByArrowHeight.
        */
        columnHeaderOrderByArrowHeight?: number;
        /**
         * Style of columnHeaderOrderByArrowMarginLeft.
        */
        columnHeaderOrderByArrowMarginLeft?: number;
        /**
         * Style of columnHeaderOrderByArrowMarginRight.
        */
        columnHeaderOrderByArrowMarginRight?: number;
        /**
         * Style of columnHeaderOrderByArrowMarginTop.
        */
        columnHeaderOrderByArrowMarginTop?: number;
        /**
         * Style of columnHeaderOrderByArrowWidth.
        */
        columnHeaderOrderByArrowWidth?: number;
        /**
         * Style of rowHeaderCellWidth.
        */
        rowHeaderCellWidth?: number;
        /**
         * Style of minColumnWidth.
        */
        minColumnWidth?: number;
        /**
         * Style of height.
        */
        height?: number | string;
        /**
         * Style of minHeight.
        */
        minHeight?: number;
        /**
         * Style of minRowHeight.
        */
        minRowHeight?: number;
        /**
         * Style of name.
        */
        name?: string;
        /**
         * Style of reorderMarkerBackgroundColor.
        */
        reorderMarkerBackgroundColor?: string;
        /**
         * Style of reorderMarkerBorderColor.
        */
        reorderMarkerBorderColor?: string;
        /**
         * Style of reorderMarkerBorderWidth.
        */
        reorderMarkerBorderWidth?: number;
        /**
         * Style of reorderMarkerIndexBorderColor.
        */
        reorderMarkerIndexBorderColor?: string;
        /**
         * Style of reorderMarkerIndexBorderWidth.
        */
        reorderMarkerIndexBorderWidth?: number;
        /**
         * Style of resizeMarkerColor.
        */
        resizeMarkerColor?: string;
        /**
         * Style of resizeMarkerSize.
        */
        resizeMarkerSize?: number;
        /**
         * Style of rowGroupColumnWidth.
        */
        rowGroupColumnWidth?: number;
        /**
         * Style of rowHeaderCellBackgroundColor.
        */
        rowHeaderCellBackgroundColor?: string;
        /**
         * Style of rowHeaderCellBorderColor.
        */
        rowHeaderCellBorderColor?: string;
        /**
         * Style of rowHeaderCellBorderWidth.
        */
        rowHeaderCellBorderWidth?: number;
        /**
         * Style of rowHeaderCellColor.
        */
        rowHeaderCellColor?: string;
        /**
         * Style of rowHeaderCellFont.
        */
        rowHeaderCellFont?: string;
        /**
         * Style of rowHeaderCellHeight.
        */
        rowHeaderCellHeight?: number;
        /**
         * Style of rowHeaderCellHorizontalAlignment.
        */
        rowHeaderCellHorizontalAlignment?: string;
        /**
         * Style of rowHeaderCellHoverBackgroundColor.
        */
        rowHeaderCellHoverBackgroundColor?: string;
        /**
         * Style of rowHeaderCellHoverColor.
        */
        rowHeaderCellHoverColor?: string;
        /**
         * Style of rowHeaderCellPaddingBottom.
        */
        rowHeaderCellPaddingBottom?: number;
        /**
         * Style of rowHeaderCellPaddingLeft.
        */
        rowHeaderCellPaddingLeft?: number;
        /**
         * Style of rowHeaderCellPaddingRight.
        */
        rowHeaderCellPaddingRight?: number;
        /**
         * Style of rowHeaderCellPaddingTop.
        */
        rowHeaderCellPaddingTop?: number;
        /**
         * Style of rowHeaderCellRowNumberGapHeight.
        */
        rowHeaderCellRowNumberGapHeight?: number;
        /**
         * Style of rowHeaderCellRowNumberGapColor.
        */
        rowHeaderCellRowNumberGapColor?: number;
        /**
         * Style of rowHeaderCellSelectedBackgroundColor.
        */
        rowHeaderCellSelectedBackgroundColor?: string;
        /**
         * Style of rowHeaderCellSelectedColor.
        */
        rowHeaderCellSelectedColor?: string;
        /**
         * Style of rowHeaderCellVerticalAlignment.
        */
        rowHeaderCellVerticalAlignment?: string;
        /**
         * Style of scrollBarActiveColor.
        */
        scrollBarActiveColor?: string;
        /**
         * Style of scrollBarBackgroundColor.
        */
        scrollBarBackgroundColor?: string;
        /**
         * Style of scrollBarBorderColor.
        */
        scrollBarBorderColor?: string;
        /**
         * Style of scrollBarBorderWidth.
        */
        scrollBarBorderWidth?: number;
        /**
         * Style of scrollBarBoxBorderRadius.
        */
        scrollBarBoxBorderRadius?: number;
        /**
         * Style of scrollBarBoxColor.
        */
        scrollBarBoxColor?: string;
        /**
         * Style of scrollBarBoxMargin.
        */
        scrollBarBoxMargin?: number;
        /**
         * Style of scrollBarBoxMinSize.
        */
        scrollBarBoxMinSize?: number;
        /**
         * Style of scrollBarBoxWidth.
        */
        scrollBarBoxWidth?: number;
        /**
         * Style of scrollBarCornerBackgroundColor.
        */
        scrollBarCornerBackgroundColor?: string;
        /**
         * Style of scrollBarCornerBorderColor.
        */
        scrollBarCornerBorderColor?: string;
        /**
         * Style of scrollBarWidth.
        */
        scrollBarWidth?: number;
        /**
         * Style of selectionOverlayBorderColor.
        */
        selectionOverlayBorderColor?: string;
        /**
         * Style of selectionOverlayBorderWidth.
        */
        selectionOverlayBorderWidth?: number;
        /**
         * Style of treeArrowBorderColor.
        */
        treeArrowBorderColor?: string;
        /**
         * Style of treeArrowBorderWidth.
        */
        treeArrowBorderWidth?: number;
        /**
         * Style of treeArrowClickRadius.
        */
        treeArrowClickRadius?: number;
        /**
         * Style of treeArrowColor.
        */
        treeArrowColor?: string;
        /**
         * Style of treeArrowHeight.
        */
        treeArrowHeight?: number;
        /**
         * Style of treeArrowMarginLeft.
        */
        treeArrowMarginLeft?: number;
        /**
         * Style of treeArrowMarginRight.
        */
        treeArrowMarginRight?: number;
        /**
         * Style of treeArrowMarginTop.
        */
        treeArrowMarginTop?: number;
        /**
         * Style of treeArrowWidth.
        */
        treeArrowWidth?: number;
        /**
         * Style of treeGridHeight.
        */
        treeGridHeight?: number;
        /**
         * Style of selectionHandleColor.
        */
        selectionHandleColor?: string;
        /**
         * Style of selectionHandleBorderColor.
        */
        selectionHandleBorderColor?: string;
        /**
         * Style of selectionHandleSize.
        */
        selectionHandleSize?: number;
        /**
         * Style of selectionHandleBorderWidth.
        */
        selectionHandleBorderWidth?: number;
        /**
         * Style of selectionHandleType.  Can be square or circle.
        */
        selectionHandleType?: string;
        /**
         * Style of moveOverlayBorderWidth.
        */
        moveOverlayBorderWidth?: number;
        /**
         * Style of moveOverlayBorderColor.
        */
        moveOverlayBorderColor?: string;
        /**
         * Style of moveOverlayBorderSegments.
        */
        moveOverlayBorderSegments?: string;
        /**
         * Style of frozenMarkerActiveColor.
        */
        frozenMarkerActiveColor?: string;
        /**
         * Style of frozenMarkerActiveBorderColor.
        */
        frozenMarkerActiveBorderColor?: string;
        /**
         * Style of frozenMarkerColor.
        */
        frozenMarkerColor?: string;
        /**
         * Style of frozenMarkerBorderColor.
        */
        frozenMarkerBorderColor?: string;
        /**
         * Style of frozenMarkerBorderWidth.
        */
        frozenMarkerBorderWidth?: number;
        /**
         * Style of frozenMarkerWidth.
        */
        frozenMarkerWidth?: number;
        /**
         * When set to hidden, vertical scroll bar will be hidden.  When set to auto vertical scroll bar will appear when data overflows the height.  When set to scroll the vertical scrollbar will always be visible.
        */
        overflowY?: string;
        /**
         * When set to hidden, horizontal scroll bar will be hidden.  When set to auto horizontal scroll bar will appear when data overflows the width.  When set to scroll the horizontal scrollbar will always be visible.
        */
        overflowX?: string;
        /**
         * Style of width.
        
         ['', 'normal'],
        */
        width?: number | string;
    }
    /**
     * An item in the context menu.
     * @property title - The title that will appear in the context menu.  If title is a `string` then the string will appear.  If title is a `HTMLElement` then it will be appended via `appendChild()` to the context menu row maintaining any events and references.
     * @property click - Optional function to invoke when this context menu item is clicked.  Neglecting to call `e.stopPropagation();` in your function will result in the mouse event bubbling up to the canvas undesirably.
     */
    class contextMenuItem {
        /**
         * The title that will appear in the context menu.  If title is a `string` then the string will appear.  If title is a `HTMLElement` then it will be appended via `appendChild()` to the context menu row maintaining any events and references.
        */
        title: any;
        /**
         * Optional function to invoke when this context menu item is clicked.  Neglecting to call `e.stopPropagation();` in your function will result in the mouse event bubbling up to the canvas undesirably.
        */
        click: any;
    }
}

/**
 * deduce the type of values in the column 'colNum' of data represented by 'rows'
 * if the column is not empty and all values in the column are numbers, then the type is 'number',
 * otherwise the type is 'string'.
 * Purpose: check the type of pasted data when a new column is created dynamically
 * @param rows - array of rows, e.g. [ [{"value": [{"value": "a"}]},{"value": [{"value": "b"}]}], [{"value": [{"value": "1"}]},{"value": [{"value": "2"}]}] ]
 * @param colNum - Column index to check
 * @returns deduced type
 */
declare function deduceColTypeFromData(rows: any[], colNum: number): "string" | "number";

/**
 * Merge a new hidden row range into existed ranges array
 * @param hiddenRowRanges - tuples: Array<[bgeinRowIndex, endRowIndex]>
 * @param newRange - tuple: [beginRowIndex, endRowIndex]
 */
declare function mergeHiddenRowRanges(hiddenRowRanges: any[], newRange: number[]): boolean;

/**
 * Swap values between two properties in an object
 * @param obj - The object
 * @param prop0 - First property name
 * @param prop1 - Another property name
 */
declare function swapProps(obj: any, prop0: string, prop1: string): void;

/**
 * This function transforms a selection object to normalized.
 * Here is the definition of **normalized selection object**:
 * - It contains these required properties: type, startRow, startColumn, endRow, endColumn
 * - Property `endRow` and property `endColumn` must exist even if their value are the same with `startRow` or `startColumn`.
 * - The value of `endRow` must be equals or greater than the value of `startRow`
 * - The value of `endColumn` must be equals or greater than the value of `startColumn`
 */
declare function normalizeSelection(sel: SelectionDescriptor): SelectionDescriptor;

/**
 * Parse a string expression to a selection object. Here are some example expressions:
 * - cells:20,30-40,50
 * - row:5
 * - cols:5-9
 */
declare function getSelectionFromString(str: string): SelectionDescriptor;

/**
 * Check are two cells block the same
 */
declare function isSameCellsBlock(block0: SelectionDescriptor, block1: SelectionDescriptor): boolean;

/**
 * This function is used in the function `mergeSelections`
 */
declare function mergeCellsIntoRowsOrColumns(cells: SelectionDescriptor, rowsOrColumns: SelectionDescriptor): SelectionDescriptor;

/**
 * Merge two selection objects (Splicing, Containing)
 * @returns A concatenated selection object based on `block0`.
 * Or `undefined` if they can't be concatenated
 */
declare function mergeSelections(sel0: SelectionDescriptor, sel1: SelectionDescriptor): SelectionDescriptor;

/**
 * Remove some rows from a rows selection
 * @param selection - It must be a selection with type as `Rows`
 * @param remove - It must be a selection with type as `Rows`
 * @returns Returning a `undefined` represents parameter `remove` doesn't intersect with parameter `selection`
 */
declare function removePartOfRowsSelection(selection: SelectionDescriptor, remove: SelectionDescriptor): SelectionDescriptor[];

/**
 * Remove some columns from a columns selection
 * @param selection - It must be a selection with type as `Columns`
 * @param remove - It must be a selection with type as `Columns`
 * @returns Returning a `undefined` represents parameter `remove` doesn't intersect with parameter `selection`
 */
declare function removePartOfColumnsSelection(selection: any, remove: any): object[];

/**
 * Remove a cells block from a cells selection
 * @param selection - It must be a selection with type as `Cells` or `UnselectedCells`
 * @param remove - It must be a selection
 * @returns Returning a `undefined` represents parameter `remove` doesn't intersect with parameter `selection`
 */
declare function removePartOfCellsSelection(selection: SelectionDescriptor, remove: SelectionDescriptor): SelectionDescriptor[];

/**
 * Get intersection of two selection object
 * @returns a selection object or undefined
 */
declare function getIntersection(sel0: SelectionDescriptor, sel1: SelectionDescriptor): SelectionDescriptor;

/**
 * Add a selection object into `selections` array. And there are two behaviours if this function:
 * - It appends a new selection object into the `selections` array
 * - It rewrites the selection item in the `selections` array (merge or change its type)
 * @param add - Supported types: Cells, Rows, Columns
 * @param [context] - Eg: {rows:1000, columns:1000}
 * @returns is the selections array changed
 */
declare function addIntoSelections(selections: SelectionDescriptor[], add: SelectionDescriptor, context?: ContextForSelectionAction): boolean;

/**
 * Remove a selection area from `selections` array
 * @param remove - Supported types: Cells, Rows, Columns
 * @param [context] - Eg: {rows:1000, columns:1000}
 * @returns is the selections array changed
 */
declare function removeFromSelections(selections: SelectionDescriptor[], remove: SelectionDescriptor, context?: ContextForSelectionAction): boolean;

/**
 * Clean up a selections array.
 * This function removes unnecessary selection object, and it tries to merge different selections.
 */
declare function cleanupSelections(selections: SelectionDescriptor[]): void;

/**
 * Check if all cells in a given row selected
 */
declare function isRowSelected(selections: SelectionDescriptor[], rowIndex: number): void;

/**
 * Check if all cells in a given column selected
 */
declare function isColumnSelected(selections: SelectionDescriptor[], columnIndex: number): void;

/**
 * Check if a given cell selected
 */
declare function isCellSelected(selections: SelectionDescriptor[], rowIndex: number, columnIndex: number): void;

/**
 * Check if all given cells selected
 * @param range - the range of cells block
 */
declare function areAllCellsSelected(selections: SelectionDescriptor[], range: RangeDescriptor): boolean;

/**
 * Get selection state from cells
 * @returns Returning `true` means all given cells are selected,
 * Returning `false` means all given cells are not selected.
 * Returning a two-dimensional array means some cells are selected and some cells are not selected.
 * A reference for returned value: `state[rowIndex - range.startRow][colIndex - range.startColumn]`
 */
declare function getSelectionStateFromCells(selections: SelectionDescriptor[], range: RangeDescriptor): boolean | boolean[][];

/**
 * Get verbose selection state from cells.
 * (`verbose` in here means that you can locate particular selection for selected cells)
 * @returns Each item in this two-dimensional array is 0 or a positive int,
 * it represents the index of matched selection plus 1 if it is a positive int.
 * And if the value of item is 0, it means this cell is not selected.
 * A reference for returned value: `state[rowIndex - range.startRow][colIndex - range.startColumn]`
 */
declare function getVerboseSelectionStateFromCells(selections: SelectionDescriptor[], range: RangeDescriptor): number[][];

/**
 * Check if any contiguous columns are selected.
 * (This function is useful for the preconditions for actions on columns, Eg: grouping, hiding)
 * @param allowImpurity - This function ignores other selected rows/cells if its value is `true`
 * @returns a tuple [beginViewColumnIndex, endViewColumnIndex] or `undefined`
 */
declare function getSelectedContiguousColumns(selections: SelectionDescriptor[], allowImpurity: boolean): number[];

/**
 * Check if any contiguous rows are selected.
 * (This function is useful for the preconditions for actions on rows, Eg: grouping, hiding)
 * @param allowImpurity - This function ignores other selected columns/cells if its value is `true`
 * @returns a tuple [beginRowOrderIndex, endRowOrderIndex] or `undefined`
 */
declare function getSelectedContiguousRows(selections: SelectionDescriptor[], allowImpurity: boolean): number[];

/**
 * Check if current selections are complex.
 * How we defined "complex" in here:
 * - There are any unselected cells in selected rows/columns
 * - More than one selection type in current selections
 */
declare function areSelectionsComplex(selections: SelectionDescriptor[]): boolean;

/**
 * Check if current selections are neat.
 * This method is used for make new API are compatible with obsolete API
 * For example:
 * - Selected like <0,0-10,10> or rows<5-10>  is neat
 * - Selected like <0,0-10,10>&<11,1-11,10> is untidy
 * @param selections - selections after clean up
 */
declare function areSelectionsNeat(selections: SelectionDescriptor[]): boolean;

declare function moveSelections(selections: SelectionDescriptor[], offsetX: number, offsetY: number): void;

declare function cloneSelections(selections: SelectionDescriptor[]): SelectionDescriptor[];

declare function getSelectionBounds(selections: SelectionDescriptor[]): RectangleObject;

/**
 * @param cell - Signature: `{rowIndex:number;columnIndex:number}`
 * @param keyEvent - Signature: `{key:string;shiftKey:boolean}`
 * @param context - Signature: `{columns:number;rows:number}`
 */
declare function shrinkOrExpandSelections(selections: SelectionDescriptor[], cell: any, keyEvent: any, context: any): boolean;


// --- module exports (added by scripts/finalize-types.js) ---
/**
 * Arguments accepted by the factory. Every option is optional; without
 * `parentNode` the returned element must be appended to the document by
 * the caller.
 */
type CanvasDatagridArgs = Partial<
  ConstructorParameters<typeof canvasDatagrid>[0]
>;
/**
 * Creates a grid. This is what `import canvasDatagrid from 'canvas-datagrid'`
 * and the `window.canvasDatagrid` global resolve to.
 */
declare function createCanvasDatagrid(args?: CanvasDatagridArgs): canvasDatagrid;
declare global {
  interface Window {
    canvasDatagrid: typeof createCanvasDatagrid;
  }
}
export default createCanvasDatagrid;
export { canvasDatagrid, CanvasDatagridArgs };
