canvas-grid
-----------

Canvas based data grid.

attributes (instantiation args and grid.attributes.blah)
['saveAppearance', true],
['selectionFollowsActiveCell', false],
['multiLine', true],
['editable', true],
['allowColumnReordering', true],
['showFilter', true],
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
['borderResizeZone', 10],
['showHeaders', true],
['showRowNumbers', true],
['showRowHeaders', true]

methods and properties

beginEditAt(x, y)
endEdit(abort)
setActiveCell(x, y)
scrollIntoView(x, y)
scrollToCell(x, y)
findColumnScrollLeft(columnIndex)
findRowScrollTop(rowIndex)
getSelectionBounds()
fitColumnToValues(name)
getHeaderByName(name)
findColumnMaxTextLength(name)
disposeContextMenu()
getObjectAt(x, y)
order(columnName, direction)
draw()
selectArea()
getSchemaFromData()
setFilterValue(column, value)
textarea
controlInput
currentObject
height
width
visibleCells
visibleRows
selections
selectionBounds
attributes
style
cellFormaters
filters
resizeMode
changes
data
schema

events (bound using grid.addEventListener, many use e.preventDefault() to override behaviors)

selectionchanged  getSelectedData(), selections, selectionBounds
formatcellvalue ctx, d[header.name], d, header, cx, cy, data, schema
rendercell ctx, d[header.name], d, header, data, schema, cx, cy
renderOrderByArrow tx, d[header.name], d, header, data, schema, cx, cy
mousemove e, o.item.data
contextmenu contextObject, menuItems, contextMenu
beforeendedit textarea.value, cell.value, abort, cell.data, textarea, cell
endedit textarea.value, abort, textarea, cell
beforebeginedit cell
beginedit cell, textarea
click e, currentObject
resizecolumn x, y, resizingItem
mousedown e, currentObject
mouseup e, currentObject
keydown e, currentObject
keyup e, currentObject
keypress e, currentObject
resize height, width
dblclick e, currentObject

styles (can be altered during instantiation or after, must call grid.draw() after changes)

['contextMenuMarginTop', 0],
['contextMenuMarginLeft', 5],
['editCellFontSize', '16px'],
['editCellFontFamily', 'sans-serif'],
['autosizePadding', 5],
['minHeight', 250],
['minRowHeight', 10],
['minColumnWidth', 10],
['columnWidth', 250],
['backgroundColor', 'rgba(255, 0, 255, 1)'],
['headerOrderByArrowHeight', 8],
['headerOrderByArrowWidth', 13],
['headerOrderByArrowColor', 'rgba(0, 0, 0, 1)'],
['headerOrderByArrowBorderColor', 'rgba(255, 255, 255, 1)'],
['headerOrderByArrowBorderWidth', 1],
['headerOrderByArrowMarginRight', 5],
['headerOrderByArrowMarginLeft', 0],
['headerOrderByArrowMarginTop', 6],
['cellHeight', 24],
['cellFont', '16px sans-serif'],
['cellPaddingBottom', 5],
['cellPaddingLeft', 5],
['cellPaddingRight', 7],
['cellAlignment', 'left'],
['cellColor', 'rgba(0, 0, 0, 1)'],
['cellBackgroundColor', 'rgba(255, 255, 0, 1)'],
['cellHoverColor', 'rgba(0, 0, 0, 1)'],
['cellHoverBackgroundColor', 'rgba(128, 255, 0, 1)'],
['cellSelectedColor', 'rgba(128, 255, 0, 1)'],
['cellSelectedBackgroundColor', 'rgba(0, 255, 128, 1)'],
['cellBorderWidth', 1],
['cellBorderColor', 'rgba(0, 0, 0, 1)'],
['activeCellFont', '16px sans-serif'],
['activeCellPaddingBottom', 5],
['activeCellPaddingLeft', 5],
['activeCellPaddingRight', 7],
['activeCellAlignment', 'left'],
['activeCellColor', 'rgba(0, 0, 0, 1)'],
['activeCellBackgroundColor', 'rgba(125, 255, 0, 1)'],
['activeCellHoverColor', 'rgba(100, 100, 100, 1)'],
['activeCellHoverBackgroundColor', 'rgba(0, 8, 125, 1)'],
['activeCellSelectedColor', 'rgba(128, 255, 0, 1)'],
['activeCellSelectedBackgroundColor', 'rgba(45, 75, 128, 1)'],
['activeCellBorderWidth', 1],
['activeCellBorderColor', 'rgba(0, 0, 0, 1)'],
['headerCellPaddingBottom', 5],
['headerCellPaddingLeft', 5],
['headerCellPaddingRight', 7],
['headerCellHeight', 25],
['headerCellBorderWidth', 1],
['headerCellBorderColor', 'rgba(0, 0, 0, 1)'],
['headerCellFont', '16px sans-serif'],
['headerCellColor', 'rgba(0, 0, 0, 1)'],
['headerCellBackgroundColor', 'rgba(0, 255, 255, 1)'],
['headerCellHoverColor', 'rgba(0, 0, 0, 1)'],
['headerCellHoverBackgroundColor', 'rgba(128, 255, 0, 1)'],
['headerRowWidth', 50],
['headerRowCellPaddingBottom', 5],
['headerRowCellPaddingLeft', 5],
['headerRowCellPaddingRight', 7],
['headerRowCellHeight', 25],
['headerRowCellBorderWidth', 1],
['headerRowCellBorderColor', 'rgba(0, 0, 0, 1)'],
['headerRowCellFont', '16px sans-serif'],
['headerRowCellColor', 'rgba(0, 0, 0, 1)'],
['headerRowCellBackgroundColor', 'rgba(0, 255, 255, 1)'],
['headerRowCellHoverColor', 'rgba(0, 0, 0, 1)'],
['headerRowCellHoverBackgroundColor', 'rgba(128, 255, 0, 1)']# canvas-datagrid
