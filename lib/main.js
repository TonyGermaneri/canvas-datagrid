/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, requestAnimationFrame: false, performance: false, btoa: false*/
window.define = window.define || function defineStub(a, b) {
    'use strict';
    window.canvasDatagrid = b();
    return;
};
define([], function context() {
    'use strict';
    function grid(args) {
        args = args || {};
        var defaultAttributes = [
                ['showNewRow', true],
                ['saveAppearance', true],
                ['selectionFollowsActiveCell', false],
                ['multiLine', false],
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
            ],
            defaultStyles = [
                ['filterTextPrefix', '(filtered)'],

                ['editCellFontSize', '16px'],
                ['editCellFontFamily', 'sans-serif'],

                ['contextMenuStyleSheet', false],
                ['contextMenuItemMargin', '2px'],
                ['contextMenuItemBorderRadius', '3px'],
                ['contextMenuLabelDisplay', 'inline-block'],
                ['contextMenuLabelMinWidth', '75px'],
                ['contextMenuHoverBackground', 'rgba(182, 205, 250, 1)'],
                ['contextMenuHoverColor', 'rgba(43, 48, 153, 1)'],
                ['contextMenuFontSize', '16px'],
                ['contextMenuFontFamily', 'sans-serif'],
                ['contextMenuBackground', 'rgba(222, 227, 233, 0.90)'],
                ['contextMenuBorder', 'solid 1px rgba(158, 163, 169, 1)'],
                ['contextMenuPadding', '2px'],
                ['contextMenuBorderRadius', '3px'],
                ['contextMenuOpacity', '0.98'],
                ['contextMenuFilterInvalidExpresion', 'rgba(237, 155, 156, 1)'],
                ['contextMenuMarginTop', 0],
                ['contextMenuMarginLeft', 5],

                ['autosizePadding', 5],
                ['minHeight', 250],
                ['minRowHeight', 10],
                ['minColumnWidth', 10],
                ['columnWidth', 250],
                ['backgroundColor', 'rgba(240, 240, 240, 1)'],

                ['headerOrderByArrowHeight', 8],
                ['headerOrderByArrowWidth', 13],
                ['headerOrderByArrowColor', 'rgba(185, 185, 185, 1)'],
                ['headerOrderByArrowBorderColor', 'rgba(195, 199, 202, 1)'],
                ['headerOrderByArrowBorderWidth', 1],
                ['headerOrderByArrowMarginRight', 5],
                ['headerOrderByArrowMarginLeft', 0],
                ['headerOrderByArrowMarginTop', 6],

                ['cellHeight', 24],
                ['cellFont', '16px sans-serif'],
                ['cellPaddingTop', 5],
                ['cellPaddingLeft', 5],
                ['cellPaddingRight', 7],
                ['cellAlignment', 'left'],
                ['cellColor', 'rgba(0, 0, 0, 1)'],
                ['cellBackgroundColor', 'rgba(240, 240, 240, 1)'],
                ['cellHoverColor', 'rgba(0, 0, 0, 1)'],
                ['cellHoverBackgroundColor', 'rgba(240, 240, 240, 1)'],
                ['cellSelectedColor', 'rgba(43, 48, 153, 1)'],
                ['cellSelectedBackgroundColor', 'rgba(182, 205, 250, 1)'],
                ['cellBorderWidth', 0.5],
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
                ['activeCellBorderWidth', 0.5],
                ['activeCellBorderColor', 'rgba(151, 173, 190, 1)'],

                ['headerCellPaddingTop', 5],
                ['headerCellPaddingLeft', 5],
                ['headerCellPaddingRight', 7],
                ['headerCellHeight', 25],
                ['headerCellBorderWidth', 0.5],
                ['headerCellBorderColor', 'rgba(172, 175, 179, 1)'],
                ['headerCellFont', '16px sans-serif'],
                ['headerCellColor', 'rgba(50, 50, 50, 1)'],
                ['headerCellBackgroundColor', 'rgba(222, 227, 233, 1)'],
                ['headerCellHoverColor', 'rgba(43, 48, 153, 1)'],
                ['headerCellHoverBackgroundColor', 'rgba(181, 201, 223, 1)'],

                ['headerRowWidth', 50],
                ['headerRowCellPaddingTop', 5],
                ['headerRowCellPaddingLeft', 5],
                ['headerRowCellPaddingRight', 7],
                ['headerRowCellHeight', 25],
                ['headerRowCellBorderWidth', 0.5],
                ['headerRowCellBorderColor', 'rgba(172, 175, 179, 1)'],
                ['headerRowCellFont', '16px sans-serif'],
                ['headerRowCellColor', 'rgba(50, 50, 50, 1)'],
                ['headerRowCellBackgroundColor', 'rgba(222, 227, 233, 1)'],
                ['headerRowCellHoverColor', 'rgba(43, 48, 153, 1)'],
                ['headerRowCellHoverBackgroundColor', 'rgba(181, 201, 223, 1)'],
                ['headerRowCellSelectedColor', 'rgba(43, 48, 153, 1)'],
                ['headerRowCellSelectedBackgroundColor', 'rgba(182, 205, 250, 1)'],
            ],
            textarea,
            contextMenu,
            controlInput,
            activeCell = [0, 0],
            currentObject,
            storageName = 'canvasDataGrid',
            storedSettings,
            invalidSearchExpClass = 'canvas-datagrid-invalid-search-regExp',
            uniqueId = 'canvasDataGridUniqueId',
            orderBy = uniqueId,
            orderDirection = 'asc',
            invalidFilterRegEx,
            filterBy = '',
            filterValue = '',
            filterTypeMap = {},
            container,
            canvas,
            height,
            width,
            selecting,
            scrollBox,
            scrollArea,
            schema,
            data,
            ctx,
            visibleCells,
            visibleRows,
            sizes = {
                rows: {},
                columns: {},
            },
            currentFilter = function () { return true; },
            selections = [],
            selectionBounds,
            hovers = {},
            attributes = {},
            style = {},
            intf = {},
            cellFormaters = {},
            schemaHashes = {},
            events = {},
            scrollHeight = 0,
            uId = 0,
            scrollWidth = 0,
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
            dragStart;
        function getVisibleSchema() {
            return (schema || tempSchema).filter(function (col) { return !col.hidden; });
        }
        function addEllipsis(text, width) {
            var o = text, i = text.length;
            while (width < ctx.measureText(o).width && i > 1) {
                i -= 1;
                o = text.substring(0, i) + "...";
            }
            return o;
        }
        function addEventListener(ev, fn) {
            events[ev] = events[ev] || [];
            events[ev].push(fn);
        }
        function removeEventListener(ev, fn) {
            (events[ev] || []).forEach(function removeEachListener(sfn, idx) {
                if (fn === sfn) {
                    events[ev].splice(idx, 1);
                }
            });
        }
        function fire(ev, args, context) {
            var defaultPrevented;
            if (!events[ev]) { return; }
            events[ev].forEach(function fireEachEvent(fn) {
                args.preventDefault = function preventDefault() {
                    defaultPrevented = true;
                };
                fn.apply(context, args);
            });
            return defaultPrevented;
        }
        cellFormaters.string = function cellFormatterString(ctx, value, row, column, x, y, data, schema) {
            return value !== undefined ? value : '';
        };
        cellFormaters.headerRowCell = cellFormaters.string;
        cellFormaters.headerCell = cellFormaters.string;
        cellFormaters.number = cellFormaters.string;
        cellFormaters.int = cellFormaters.string;
        function getSchemaNameHash(key) {
            var n = 0;
            while (schemaHashes[key]) {
                n += 1;
                key = key + n;
            }
            return key;
        }
        function filter(type) {
            var f = filterTypeMap[type];
            if (!f) {
                console.log('Cannot find filter for type %s, falling back to substring match.', type);
                f = filterTypeMap.string;
            }
            return f;
        }
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
        function getSelectedData() {
            var d = [], s = getVisibleSchema();
            selections.forEach(function (row, rowIndex) {
                if (rowIndex === -1 || rowIndex === data.length) { return; }
                d[rowIndex] = [];
                row.forEach(function (col, colIndex) {
                    if (colIndex === -1) { return; }
                    d[rowIndex][col] = data[rowIndex][s[col].name];
                });
            });
        }
        function selectArea() {
            var x, y;
            for (x = selectionBounds.top; x <= selectionBounds.bottom; x += 1) {
                selections[x] = [];
                for (y = selectionBounds.left; y <= selectionBounds.right; y += 1) {
                    selections[x].push(y);
                }
            }
            fire('selectionchanged', [getSelectedData(), selections, selectionBounds], intf);
        }
        function setScrollAreaHeight() {
            scrollHeight = data.reduce(function reduceData(accumulator, row) {
                return accumulator + (sizes.rows[row[uniqueId]] || style.cellHeight);
            }, 0) || 0;
            scrollWidth = (schema || tempSchema).reduce(function reduceSchema(accumulator, column) {
                return accumulator + column.width;
            }, 0) || 0;
            if (attributes.showNewRow) {
                scrollHeight += style.cellHeight;
            }
            scrollArea.style.height = style.headerCellHeight + scrollHeight + 'px';
            scrollArea.style.width = scrollWidth + 'px';
        }
        function drawOrderByArrow(x, y) {
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
        function draw() {
            if (!container.parentNode
                    || !container.offsetHeight
                    || !container.offsetWidth) {
                return;
            }
            var newRow, rowHeaderCell, p, cx, cy, cellHeight, cornerCell, y, x, c, h, w, s, end;
            if (attributes.showPerformance) {
                p = performance.now();
            }
            visibleRows = [];
            s = getVisibleSchema();
            visibleCells = [];
            cellHeight = sizes.rows[data[uniqueId]] || style.cellHeight;
            x = 0;
            y = scrollBox.scrollTop * -1 + style.headerCellHeight;
            h = canvas.height = height;
            w = canvas.width = width;
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = style.backgroundColor;
            ctx.fillRect(0, 0, w, h);
            function drawCell(d, rowIndex) {
                return function drawEach(header, headerIndex) {
                    var cellStyle = header.style || 'cell',
                        cell,
                        selected = selections[rowIndex] && selections[rowIndex].indexOf(headerIndex) !== -1,
                        hovered = hovers[d[uniqueId]] && hovers[d[uniqueId]].indexOf(headerIndex) !== -1,
                        active = activeCell[1] === rowIndex && activeCell[0] === headerIndex,
                        val,
                        f = cellFormaters[header.type || 'string'],
                        orderByArrowSize = 0,
                        cellWidth = sizes.columns[cellStyle  === 'headerRowCell'
                            ? 'cornerCell' : header[uniqueId]] || header.width;
                    if (active) {
                        cellStyle = 'activeCell';
                    }
                    if (y < cellHeight * -1) { return; }
                    if (y - cellHeight > h) {
                        end = true;
                        return;
                    }
                    if (visibleRows.indexOf(rowIndex) === -1
                            && ['headerCell', 'cornerCell'].indexOf(cellStyle) === -1) {
                        visibleRows.push(rowIndex);
                    }
                    val = fire('formatcellvalue', [ctx, d[header.name], d, header, cx, cy, data, schema], intf);
                    if (!fire('rendercell', [ctx, d[header.name], d, header, data, schema, cx, cy], intf)) {
                        cx = x - scrollBox.scrollLeft;
                        // style.cellHeight here is not a mistake, placing % cellHeight here will break everything
                        cy = y - (scrollBox.scrollTop % style.cellHeight);
                        if (cellStyle === 'cornerCell') {
                            cx = 0;
                            cy = 0;
                        } else if (cellStyle === 'headerRowCell') {
                            cx = 0;
                        } else if (cellStyle === 'headerCell') {
                            cy = 0;
                        }
                        cell = {
                            type: header.type,
                            style: cellStyle,
                            x: cx,
                            y: cy,
                            hovered: hovered,
                            selected: selected,
                            width: cellWidth,
                            height: cellHeight,
                            data: d,
                            header: header,
                            index: headerIndex,
                            columnIndex: headerIndex,
                            rowIndex: rowIndex,
                            value: d[header.name]
                        };
                        cell[uniqueId] = d[uniqueId];
                        visibleCells.unshift(cell);
                        ctx.fillStyle = style[cellStyle + 'BackgroundColor'];
                        ctx.strokeStyle = style[cellStyle + 'BorderColor'];
                        if (hovered) {
                            ctx.fillStyle = style[cellStyle + 'HoverBackgroundColor'];
                            ctx.strokeStyle = style[cellStyle + 'HoverBorderColor'];
                        }
                        if (selected) {
                            ctx.fillStyle = style[cellStyle + 'SelectedBackgroundColor'];
                            ctx.strokeStyle = style[cellStyle + 'SelectedBorderColor'];
                        }
                        ctx.fillRect(cx, cy, cellWidth, cellHeight);
                        ctx.strokeRect(cx, cy, cellWidth, cellHeight);
                        if ((attributes.showRowNumbers && cellStyle === 'headerRowCell')
                                || cellStyle !== 'headerRowCell') {
                            ctx.font = style[cellStyle + 'Font'];
                            val = val !== undefined ? val : f
                                ? f(ctx,  cellStyle === 'headerCell'
                                    ? (header.title || header.name) : d[header.name],
                                    d, header, cx, cy, data, schema) : '';
                            if (val === undefined && !f) {
                                val = '';
                                console.warn('canvas-datagrid: I don\'t know how to format a '
                                    + header.type + ' add a cellFormater');
                            }
                            if (cellStyle === 'headerCell' && orderBy === header.name) {
                                if (!fire('renderorderbyarrow', [ctx, d[header.name], d, header, data, schema, cx, cy], intf)) {
                                    orderByArrowSize = drawOrderByArrow(cx + style[cellStyle + 'PaddingLeft'], 0);
                                }
                            }
                            ctx.save();
                            ctx.rect(cx, cy, cellWidth, cellHeight);
                            ctx.clip();
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
                            ctx.fillText(addEllipsis(val, cellWidth - style[cellStyle + 'PaddingRight'] - orderByArrowSize),
                                orderByArrowSize + cx + style[cellStyle + 'PaddingLeft'],
                                cy - (cellHeight * 0.5) + style[cellStyle + 'PaddingTop'] + cellHeight);
                            ctx.restore();
                        }
                        x += cellWidth;
                    }
                };
            }
            function drawRowHeader(rowData, index) {
                var a;
                if (attributes.showRowHeaders) {
                    x = 0;
                    rowHeaderCell = {'headerRowCell': index };
                    rowHeaderCell[uniqueId] = rowData[uniqueId];
                    a = {
                        name: 'headerRowCell',
                        width: style.headerRowWidth,
                        style: 'headerRowCell',
                        type: 'string',
                        index: -1
                    };
                    a[uniqueId] = rowData[uniqueId];
                    drawCell(rowHeaderCell, index)(a, -1);
                }
            }
            data.forEach(function (d, index) {
                if (end) {
                    return;
                }
                cellHeight = sizes.rows[d[uniqueId]] || style.cellHeight;
                if (attributes.showRowHeaders) {
                    x = sizes.columns.cornerCell ||  style.headerRowWidth;
                }
                s.forEach(drawCell(d, index));
                drawRowHeader(d, index);
                y += cellHeight;
                x = 0;
            });
            if (attributes.showNewRow) {
                newRow = {};
                newRow[uniqueId] = uId;
                if (attributes.showRowHeaders) {
                    x = sizes.columns.cornerCell ||  style.headerRowWidth;
                }
                s.forEach(function forEachHeader(header, index) {
                    var d = header.defaultValue || '';
                    if (typeof d === 'function') {
                        d = d.apply(intf, [header, index]);
                    }
                    newRow[header.name] = d;
                    drawCell(newRow, data.length)(header, index);
                });
                drawRowHeader(newRow, data.length);
            }
            y = 0;
            if (attributes.showHeaders) {
                if (attributes.showRowHeaders) {
                    x = sizes.columns.cornerCell ||  style.headerRowWidth;
                }
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
                if (attributes.showRowHeaders) {
                    x = 0;
                    cornerCell = {'cornerCell': '' };
                    cornerCell[uniqueId] = 'cornerCell';
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
            if (attributes.showPerformance) {
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'white';
                p = (performance.now() - p).toFixed(2) + 'ms';
                ctx.font = '33px sans-serif';
                ctx.fillText(p, w - 200, h - 50);
                ctx.strokeText(p, w - 200, h - 50);
            }
        }
        function order(columnName, direction) {
            var asc = direction === 'asc',
                f,
                c = (schema || tempSchema).filter(function (col) {
                    return col.name === columnName;
                });
            orderBy = columnName;
            if (c.length === 0) {
                throw new Error('Cannot sort.  No such column name');
            }
            function localeCompare(a, b) {
                if (asc) {
                    return a[columnName].localeCompare(b[columnName]);
                }
                return b[columnName].localeCompare(a[columnName]);
            }
            function numericCompare(a, b) {
                if (asc) {
                    return a[columnName] - b[columnName];
                }
                return b[columnName] - a[columnName];
            }
            f = {
                string: localeCompare,
                number: numericCompare
            }[c[0].type];
            if (!f) {
                console.warn('Cannot sort type "%s" falling back to string sort.', c[0].type);
            }
            data = data.sort(f || localeCompare);
            draw();
        }
        function getObjectAt(x, y) {
            if (!visibleCells || !visibleCells.length) { return; }
            var i, l = visibleCells.length, cell;
            for (i = 0; i < l; i += 1) {
                cell = visibleCells[i];
                if (cell.x < x
                        && cell.x + cell.width + attributes.borderResizeZone > x
                        && cell.y < y
                        && cell.y + cell.height > y) {
                    if (cell.x + cell.width - (attributes.borderResizeZone * 0.5) < x
                            && cell.x + cell.width + (attributes.borderResizeZone * 0.5) > x
                            && attributes.allowColumnResize
                            && ((attributes.allowColumnResizeFromCell && cell.style === 'cell')
                                || cell.style !== 'cell')
                            && ((attributes.allowRowHeaderResize
                                && ['headerRowCell', 'cornerCell'].indexOf(cell.style) !== -1)
                                || ['headerRowCell', 'cornerCell'].indexOf(cell.style) === -1)) {
                        return {
                            item: cell,
                            type: 'ew-resize'
                        };
                    }
                    if (cell.y + cell.height - (attributes.borderResizeZone * 0.5) < y
                            && cell.y + cell.height + (attributes.borderResizeZone * 0.5) > y
                            && attributes.allowRowResize
                            && ((attributes.allowRowResizeFromCell && cell.style === 'cell')
                                || cell.style !== 'cell')
                            && cell.style !== 'headerCell') {
                        return {
                            item: cell,
                            type: 'ns-resize'
                        };
                    }
                    return {
                        item: cell,
                        type: 'cell'
                    };
                }
            }
            return {
                item: {},
                type: 'inherit'
            };
        }
        function mousemove(e) {
            if (contextMenu || textarea) {
                return;
            }
            var dragBounds,
                x = e.clientX - container.getBoundingClientRect().left,
                y = e.clientY - container.getBoundingClientRect().top,
                o = getObjectAt(x, y);
            currentObject = o;
            hovers = {};
            if (!resizingItem && o) {
                resizeItem = o.item;
                resizeMode = o.type;
                container.style.cursor = o.type;
                if (o.type === 'cell') {
                    container.style.cursor = 'pointer';
                    hovers[o.item.data[uniqueId]] = [o.item.index];
                }
                if (selecting
                        && o.type === 'cell'
                        && o.item.data
                        && (dragStartObject.item.rowIndex !== o.item.rowIndex
                                || dragStartObject.item.columnIndex !== o.item.columnIndex)) {
                    ignoreNextClick = true;
                    dragBounds = {
                        top: Math.min(dragStartObject.item.rowIndex, o.item.rowIndex),
                        left: Math.min(dragStartObject.item.columnIndex, o.item.columnIndex),
                        bottom: Math.max(dragStartObject.item.rowIndex, o.item.rowIndex),
                        right: Math.max(dragStartObject.item.columnIndex, o.item.columnIndex)
                    };
                    selections = [];
                    selectionBounds = dragBounds;
                    selectArea();
                }
            }
            if (fire('mousemove', [e, o], intf)) { return; }
            draw();
        }
        function dataFilter(row) {
            return (filterBy === '' && filterValue === '') ||
                currentFilter(row[filterBy], filterValue);
        }
        function disposeContextMenu(e) {
            //TODO: there are most likely some bugs around removing the context menu.  Can't use grid on first click sometimes
            function disp() {
                contextMenu = undefined;
                container.cursor = 'pointer';
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
        function getHeaderByName(name) {
            var x, i = (schema || tempSchema);
            for (x = 0; x < i.length; x += 1) {
                if (i[x].name === name) {
                    return i[x];
                }
            }
        }
        function refreshFromOrigialData() {
            data = originalData.filter(function (row) {
                return true;
            });
        }
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
            setScrollAreaHeight();
            draw();
        }
        function contextmenu(e) {
            if (contextMenu) {
                e.preventDefault();
                return disposeContextMenu();
            }
            var pos = {
                    x: e.clientX - container.getBoundingClientRect().left,
                    y: e.clientY - container.getBoundingClientRect().top
                },
                contextObject = getObjectAt(pos.x, pos.y),
                filterContainer,
                filterLabel,
                filterInput,
                menuItems;
            if (!contextObject.item.header) { e.preventDefault(); return; }
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
            contextMenu.style.top = e.clientY + style.contextMenuMarginTop + 'px';
            contextMenu.style.left = e.clientX + style.contextMenuMarginLeft + 'px';
            filterInput.value = filterValue || '';
            menuItems = [];
            if (attributes.showFilter) {
                menuItems.push({
                    title: filterContainer
                });
                if (filterValue) {
                    menuItems.push({
                        title: 'Remove Filter',
                        onclick: function () {
                            e.preventDefault();
                            setFilter();
                            disposeContextMenu();
                        }
                    });
                }
            }
            if (attributes.saveAppearance
                    && Object.keys(sizes.rows).length > 0
                    && Object.keys(sizes.columns).length > 0) {
                menuItems.push({
                    title: 'Reset column and row sizes',
                    onclick: function (e) {
                        e.preventDefault();
                        sizes = {
                            rows: {},
                            columns: {},
                        };
                        draw();
                        disposeContextMenu();
                    }
                });
            }
            if (attributes.allowColumnReordering) {
                menuItems.push({
                    title: 'Order by ' + contextObject.item.header.name + ' ascending',
                    onclick: function (e) {
                        e.preventDefault();
                        order(contextObject.item.header.name, 'asc');
                        disposeContextMenu();
                    }
                });
                menuItems.push({
                    title: 'Order by ' + contextObject.item.header.name + ' descending',
                    onclick: function (e) {
                        e.preventDefault();
                        order(contextObject.item.header.name, 'desc');
                        disposeContextMenu();
                    }
                });
            }
            if (fire('contextmenu', [e, contextObject, menuItems, contextMenu], intf)) { return; }
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
                if (item.onclick) {
                    row.addEventListener('click', function contextClickProxy(e) {
                        item.onclick.apply(this, [e, contextObject, disposeContextMenu]);
                        e.preventDefault();
                        e.stopPropagation();
                    });
                }
            });
            filterInput.addEventListener('click', function (e) {
                e.stopPropagation();
            });
            filterInput.addEventListener('mousedown', function (e) {
                e.stopPropagation();
            });
            filterInput.addEventListener('keyup', function () {
                setFilter(contextObject.item.header.name, filterInput.value);
                requestAnimationFrame(function () {
                    filterInput.classList.remove(invalidSearchExpClass);
                    if (invalidFilterRegEx) {
                        filterInput.classList.add(invalidSearchExpClass);
                    }
                });
            });
            document.body.addEventListener('click', disposeContextMenu);
            container.appendChild(contextMenu);
            e.preventDefault();
        }
        function findColumnMaxTextLength(name) {
            var m = -Infinity;
            if (name === 'cornerCell') {
                ctx.font = style.headerRowCellFont;
                return ctx.measureText(data.length.toString()).width
                    + style.headerRowCellPaddingRight
                    + style.headerRowCellPaddingLeft;
            }
            (schema || tempSchema).forEach(function (col) {
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
                    + style.cellPaddingLeft;
                m = t > m ? t : m;
            });
            return m;
        }
        function fitColumnToValues(name) {
            sizes.columns[name === 'cornerCell' ? name : getHeaderByName(name)[uniqueId]]
                = findColumnMaxTextLength(name);
            draw();
        }
        function getSelectionBounds() {
            var low = {x: Infinity, y: Infinity},
                high = {x: -Infinity, y: -Infinity};
            data.forEach(function (row, rowIndex) {
                var maxCol, minCol;
                if (selections[row[uniqueId]] && selections[rowIndex].length) {
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
        function findRowScrollTop(rowIndex) {
            var top = 0, x = 0, l = data.length;
            if (!attributes.showNewRow) {
                l -= 1;
            }
            if (rowIndex > l) {
                throw new Error('Impossible row index');
            }
            while (x < rowIndex) {
                top += sizes.rows[data[x][uniqueId]] || style.cellHeight;
                x += 1;
            }
            //TODO: This is not super accurate, causes pageUp/Dn to not move around right
            return top - (sizes.rows[data[rowIndex][uniqueId]] || style.cellHeight);
        }
        function findColumnScrollLeft(columnIndex) {
            var left = 0, y = 0, s = (schema || tempSchema), l = s.length - 1;
            if (columnIndex > l) {
                throw new Error('Impossible column index');
            }
            while (y < columnIndex) {
                left += sizes.columns[s[y][uniqueId]] || s[y].width;
                y += 1;
            }
            return left;
        }
        function scrollToCell(x, y) {
            if (x !== undefined) {
                scrollBox.scrollLeft = findColumnScrollLeft(x);
            }
            if (y !== undefined) {
                scrollBox.scrollTop = findRowScrollTop(y);
            }
        }
        function scrollIntoView(x, y) {
            if (visibleCells.filter(function (cell) {
                    return (cell.rowIndex === y || y === undefined)
                        && (cell.columnIndex === x || x === undefined)
                        && cell.x > 0
                        && cell.y > 0
                        && cell.x + cell.width < container.offsetWidth
                        && cell.y + cell.height < container.offsetHeight;
                }).length === 0) {
                scrollToCell(x, y);
            }
        }
        function setActiveCell(x, y) {
            activeCell = [x, y];
        }
        function addRow(d) {
            originalData.push(d);
            setFilter(filterBy, filterValue);
            setScrollAreaHeight();
        }
        function endEdit(abort) {
            var cell = textarea.editCell,
                y = cell.rowIndex;
            if (fire('beforeendedit', [textarea.value, cell.value, abort, cell.data, textarea, cell], intf)) { return false; }
            if (textarea.value !== cell.value && !abort) {
                changes[y] = changes[y] || {};
                changes[y][cell.header.name] = textarea.value;
                cell.data[cell.header.name] = textarea.value;
                if (y === data.length) {
                    if (fire('newrow', [textarea.value, cell.value, abort, cell.data, textarea, cell], intf)) { return false; }
                    uId += 1;
                    addRow(cell.data);
                }
                draw();
            }
            container.removeChild(textarea);
            controlInput.focus();
            fire('endedit', [textarea.value, abort, textarea, cell], intf);
            textarea = undefined;
            return true;
        }
        function beginEditAt(x, y) {
            if (!attributes.editable) { return; }
            var top, left, cell, s = getVisibleSchema();
            cell = visibleCells.filter(function (vCell) {
                return vCell.columnIndex === x && vCell.rowIndex === y;
            })[0];
            if (fire('beforebeginedit', [cell], intf)) { return false; }
            scrollIntoView(x, y);
            setActiveCell(x, y);
            function postDraw() {
                cell = visibleCells.filter(function (vCell) {
                    return vCell.columnIndex === x && vCell.rowIndex === y;
                })[0];
                top = container.getBoundingClientRect().top + cell.y + style.cellBorderWidth;
                left = container.getBoundingClientRect().left + cell.x + style.cellBorderWidth;
                scrollEdit = {
                    scrollTop: scrollBox.scrollTop,
                    scrollLeft: scrollBox.scrollLeft,
                    textareaTop: top,
                    textareaLeft: left
                };
                textarea = document.createElement(attributes.multiLine ? 'textarea' : 'input');
                container.appendChild(textarea);
                textarea.className = 'canvas-datagrid-edit-textarea';
                textarea.style.position = 'absolute';
                textarea.style.border = 'none';
                textarea.style.top = top + 'px';
                textarea.style.left = left + 'px';
                textarea.style.height = cell.height - (style.cellBorderWidth * 4) + 'px';
                textarea.style.width = cell.width - (style.cellBorderWidth * 4) - style.cellPaddingLeft + 'px';
                textarea.style.zIndex = '2';
                textarea.value = cell.value;
                textarea.editCell = cell;
                textarea.focus();
                textarea.addEventListener('keydown', function (e) {
                    var nx = cell.columnIndex,
                        ny = cell.rowIndex;
                    if (e.key === 'Escape') {
                        endEdit(true);
                        draw();
                    } else if (e.key === 'Tab') {
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
            fire('beginedit', [cell, textarea], intf);
        }
        function click(e) {
            var s = getVisibleSchema(),
                index,
                i,
                selectionChanged,
                ctrl = (e.controlKey || e.metaKey || attributes.persistantSelectionMode),
                pos = {
                    x: e.clientX - container.getBoundingClientRect().left,
                    y: e.clientY - container.getBoundingClientRect().top
                };
            currentObject = getObjectAt(pos.x, pos.y);
            function checkSelectionChange() {
                if (!selectionChanged) { return; }
                fire('selectionchanged', [getSelectedData(), selections, selectionBounds], intf);
            }
            if (textarea) {
                endEdit();
            }
            if (ignoreNextClick) {
                ignoreNextClick = false;
                return;
            }
            i = currentObject.item;
            if (fire('click', [e, currentObject], intf)) { return; }
            if (!e.shiftKey && !ctrl) {
                selections = [];
                selectionChanged = true;
            }
            if (currentObject.type === 'cell') {
                if (currentObject.item.style === 'cornerCell') {
                    order(uniqueId, 'asc');
                    setFilter();
                    checkSelectionChange();
                    return;
                }
                if (currentObject.item.style === 'headerCell') {
                    if (orderBy === i.header.name) {
                        orderDirection = orderDirection === 'asc' ? 'desc' : 'asc';
                    } else {
                        orderDirection = 'asc';
                    }
                    order(i.header.name, orderDirection);
                    checkSelectionChange();
                    return;
                }
                if (['headerRowCell', 'headerCell'].indexOf(currentObject.item.style) === -1) {
                    setActiveCell(i.columnIndex, i.rowIndex);
                }
                selections[i.rowIndex] = selections[i.rowIndex] || [];
                index = i.selected ? selections[i.rowIndex].indexOf(i.header.index) : -1;
                if (attributes.rowSelectionMode || currentObject.item.style === 'headerRowCell') {
                    if (selections[i.rowIndex].length === data.length) {
                        selections[i.rowIndex] = [];
                        selectionChanged = true;
                        checkSelectionChange();
                        return;
                    }
                    selectionChanged = true;
                    selections[i.rowIndex] = [];
                    selections[i.rowIndex].push(-1);
                    s.forEach(function (col) {
                        selections[i.rowIndex].push(col.index);
                    });
                } else {
                    if (index === -1) {
                        selectionChanged = true;
                        selections[i.rowIndex].push(i.header.index);
                    }
                }
                if (i.selected && ctrl) {
                    if (attributes.rowSelectionMode) {
                        selections[i.rowIndex] = undefined;
                    }
                    selections[i.rowIndex].splice(selections[i.rowIndex].indexOf(i.header.index), 1);
                    selectionChanged = true;
                }
                if (e.shiftKey && !ctrl) {
                    selectionBounds = getSelectionBounds();
                    selectArea();
                }
            }
            checkSelectionChange();
            draw();
        }
        function dragResizeColumn(e) {
            var pos = {
                    x: e.clientX - container.getBoundingClientRect().left,
                    y: e.clientY - container.getBoundingClientRect().top
                },
                x = resizingStartingWidth + pos.x - dragStart.x,
                y = resizingStartingHeight + pos.y - dragStart.y;
            if (x < style.minColumnWidth) {
                x = style.minColumnWidth;
            }
            if (y < style.minRowHeight) {
                y = style.minRowHeight;
            }
            if (fire('resizecolumn', [x, y, resizingItem], intf)) { return false; }
            if (resizeMode === 'ew-resize') {
                sizes.columns[resizingItem.header.style === 'headerRowCell'
                       ? 'cornerCell' : resizingItem.header[uniqueId]] = x;
                return;
            }
            if (resizeMode === 'ns-resize') {
                sizes.rows[resizingItem.data[uniqueId]] = y;
                return;
            }
        }
        function setStorageData() {
            if (!attributes.saveAppearance) { return; }
            localStorage.setItem(storageName + '-' + args.name, JSON.stringify({
                sizes: sizes
            }));
        }
        function stopDragResize() {
            setScrollAreaHeight();
            document.body.removeEventListener('mousemove', dragResizeColumn, false);
            document.body.removeEventListener('mouseup', stopDragResize, false);
            setStorageData();
            ignoreNextClick = true;
        }
        function mousedown(e) {
            if (fire('mousedown', [e, currentObject], intf)) { return; }
            if (e.button === 2 || textarea) { return; }
            dragStart = {
                x: e.clientX - container.getBoundingClientRect().left,
                y: e.clientY - container.getBoundingClientRect().top
            };
            dragStartObject = getObjectAt(dragStart.x, dragStart.y);
            if (resizeMode === 'cell') {
                selecting = true;
            }
            if (['ns-resize', 'ew-resize'].indexOf(resizeMode) !== -1) {
                resizingItem = resizeItem;
                resizingStartingWidth = sizes.columns[resizingItem.header.style === 'headerRowCell'
                       ? 'cornerCell' : resizingItem.header[uniqueId]] || resizingItem.header.width;
                resizingStartingHeight = sizes.rows[resizingItem.data[uniqueId]] || style.cellHeight;
                document.body.addEventListener('mousemove', dragResizeColumn, false);
                document.body.addEventListener('mouseup', stopDragResize, false);
            }
        }
        function mouseup(e) {
            if (fire('mouseup', [e, currentObject], intf)) { return; }
            if (contextMenu || textarea) { return; }
            selecting = undefined;
            resizingItem = undefined;
            controlInput.focus();
        }
        function keydown(e) {
            var x = activeCell[0],
                y = activeCell[1],
                ctrl = (e.controlKey || e.metaKey),
                last = data.length - 1,
                page = visibleRows.length - 3 - attributes.pageUpDownOverlap,
                cols = getVisibleSchema().length - 1;
            if (attributes.showNewRow) {
                last += 1;
            }
            if (fire('keydown', [e, currentObject], intf)) { return; }
            if (e.key === 'Tab') {
                e.preventDefault();
            }
            if (e.key === 'ArrowDown') {
                y += 1;
            } else if (e.key === 'ArrowUp') {
                y -= 1;
            } else if (e.key === 'ArrowLeft' || (e.shiftKey && e.key === 'Tab')) {
                x -= 1;
            } else if (e.key === 'ArrowRight' || (!e.shiftKey && e.key === 'Tab')) {
                x += 1;
            } else if (e.key === 'PageUp') {
                y -= page;
            } else if (e.key === 'PageDown') {
                y += page;
            } else if (e.key === 'Home' || (ctrl && e.key === 'ArrowUp')) {
                y = 0;
            } else if (e.key === 'Home' || (ctrl && e.key === 'ArrowDown')) {
                y = data.length - 1;
            } else if (ctrl && e.key === 'ArrowRight') {
                x = cols;
            } else if (ctrl && e.key === 'ArrowLeft') {
                x = 0;
            } else if (e.key === 'Enter') {
                return beginEditAt(x, y);
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
            if (e.shiftKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) !== -1) {
                selections[data[y][uniqueId]] = selections[data[y][uniqueId]] || [];
                selections[data[y][uniqueId]].push(x);
                selectionBounds = getSelectionBounds();
                selectArea();
                draw();
            }
            if (x !== activeCell[0] || y !== activeCell[1]) {
                scrollIntoView(x !== activeCell[0] ? x : undefined, y !== activeCell[1] ? y : undefined);
                setActiveCell(x, y);
                if (!e.shiftKey && attributes.selectionFollowsActiveCell) {
                    selections = [];
                    selections[data[y][uniqueId]] = [x];
                    fire('selectionchanged', [getSelectedData(), selections, selectionBounds], intf);
                }
                draw();
            }
        }
        function keyup(e) {
            if (fire('keyup', [e, currentObject], intf)) { return; }
            controlInput.value = '';
        }
        function keypress(e) {
            if (fire('keypress', [e, currentObject], intf)) { return; }
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
        function resize() {
            var h;
            if (container.offsetHeight === height
                    && container.offsetWidth === width) {
                return false;
            }
            h = (attributes.height === undefined ?
                    Math.min(container.parentNode.offsetHeight, window.innerHeight, scrollHeight) : attributes.height);
            if (attributes.maxHeight !== undefined && h > attributes.maxHeight) {
                h = attributes.maxHeight;
            }
            if (h < style.minHeight) {
                h = style.minHeight;
            }
            if (fire('resize', [h, width], intf)) { return false; }
            container.style.height = h + 'px';
            // this has to be done in this strange order because altering scrollBox changes the width of container
            scrollBox.style.height = container.offsetHeight + 'px';
            scrollBox.style.width = container.offsetWidth + 'px';
            height = container.offsetHeight;
            width = container.offsetWidth;
            [scrollBox, canvas].forEach(function eachEle(el) {
                el.style.top = container.getBoundingClientRect().top;
                el.style.left = container.getBoundingClientRect().left;
            });
            draw();
            return true;
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
            if (fire('dblclick', [e, currentObject], intf)) { return; }
            if (currentObject.type === 'ew-resize'
                    && currentObject.item.style === 'headerCell') {
                fitColumnToValues(currentObject.item.header.name);
            } else if (currentObject.type === 'ew-resize'
                    && currentObject.item.style === 'cornerCell') {
                autosize();
            } else if (['cell', 'activeCell'].indexOf(currentObject.item.style) !== -1) {
                beginEditAt(currentObject.item.columnIndex, currentObject.item.rowIndex);
            }
        }
        function dispose() {
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
            window.removeEventListener('resize', resize);
        }
        function attachCss() {
            var styleSheet, css = [
                '.canvas-datagrid-edit-textarea { outline: none; margin: 0; padding: 0 0 0 <cellPaddingLeft>px;',
                'font-size: <editCellFontSize>; font-family: <editCellFontFamily>; }',
                '.canvas-datagrid-context-menu-item { margin: <contextMenuItemMargin>; border-radius: <contextMenuItemBorderRadius>; }',
                '.canvas-datagrid-context-menu-item:hover { background: <contextMenuHoverBackground>;',
                ' color: <contextMenuHoverColor>; margin: <contextMenuItemMargin>; }',
                '.canvas-datagrid-context-menu-label { display: <contextMenuLabelDisplay>; min-width: <contextMenuLabelMinWidth>; }',
                '.canvas-datagrid-context-menu { font-family: <contextMenuFontFamily>;',
                'font-size: <contextMenuFontSize>; background: <contextMenuBackground>;',
                'border: <contextMenuBorder>; padding: <contextMenuPadding>;',
                ' border-radius: <contextMenuBorderRadius>; opacity: <contextMenuOpacity>;}',
                '.canvas-datagrid-invalid-search-regExp { background: <contextMenuFilterInvalidExpresion>; }'
            ].join('\n');
            Object.keys(style).forEach(function (i) {
                css = css.replace('<' + i + '>', style[i]);
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
            styleSheet.href = 'data:text/css;base64,' + btoa(style.contextMenuStyleSheet || css);
        }
        function scroll() {
            draw();
            if (textarea) {
                textarea.style.top = scrollEdit.textareaTop
                    + (scrollEdit.scrollTop - scrollBox.scrollTop) + 'px';
                textarea.style.left = scrollEdit.textareaLeft
                    + (scrollEdit.scrollLeft - scrollBox.scrollLeft) + 'px';
            }
        }
        function setDom() {
            controlInput = document.createElement('input');
            container = document.createElement('div');
            scrollBox = document.createElement('div');
            scrollArea = document.createElement('div');
            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');
            container.style.padding = '0';
            container.style.background = '#0F0';
            scrollBox.style.overflow = 'auto';
            scrollBox.style.zIndex = '1';
            [scrollBox, canvas, controlInput].forEach(function eachEle(el) {
                el.style.position = 'absolute';
            });
            window.addEventListener('resize', resize);
            if (container.parentNode) {
                container.parentNode.addEventListener('resize', resize);
            }
            controlInput.addEventListener('keypress', keypress, false);
            controlInput.addEventListener('keyup', keyup, false);
            controlInput.addEventListener('keydown', keydown, false);
            container.addEventListener('mouseup', mouseup, false);
            container.addEventListener('mousedown', mousedown, false);
            container.addEventListener('dblclick', dblclick, false);
            container.addEventListener('click', click, false);
            container.addEventListener('contextmenu', contextmenu, false);
            container.addEventListener('mousemove', mousemove, false);
            scrollBox.addEventListener('scroll', scroll, false);
            container.appendChild(controlInput);
            container.appendChild(scrollBox);
            container.appendChild(canvas);
            scrollBox.appendChild(scrollArea);
            if (args.parentNode) {
                args.parentNode.appendChild(container);
            }
            attachCss();
        }
        function appendTo(parentNode) {
            parentNode.appendChild(container);
        }
        function init() {
            setAttributes();
            setStyle();
            setDom();
            intf.addEventListener = addEventListener;
            intf.removeEventListener = removeEventListener;
            intf.dispose = dispose;
            intf.appendTo = appendTo;
            intf.filters = filterTypeMap;
            intf.autosize = autosize;
            intf.beginEditAt = beginEditAt;
            intf.endEdit = endEdit;
            intf.setActiveCell = setActiveCell;
            intf.scrollIntoView = scrollIntoView;
            intf.scrollToCell = scrollToCell;
            intf.findColumnScrollLeft = findColumnScrollLeft;
            intf.findRowScrollTop = findRowScrollTop;
            intf.fitColumnToValues = fitColumnToValues;
            intf.findColumnMaxTextLength = findColumnMaxTextLength;
            intf.disposeContextMenu = disposeContextMenu;
            intf.getObjectAt = getObjectAt;
            intf.order = order;
            intf.draw = draw;
            intf.selectArea = selectArea;
            intf.getSchemaFromData = getSchemaFromData;
            intf.setFilter = setFilter;
            intf.addRow = addRow;
            Object.defineProperty(intf, 'textarea', {
                get: function () {
                    return textarea;
                }
            });
            Object.defineProperty(intf, 'controlInput', {
                get: function () {
                    return controlInput;
                }
            });
            Object.defineProperty(intf, 'currentObject', {
                get: function () {
                    return currentObject;
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
            intf.attributes = attributes;
            intf.style = style;
            intf.cellFormaters = cellFormaters;
            intf.filters = filterTypeMap;
            filterTypeMap.string = function (value, filterFor) {
                if (!filterFor) { return true; }
                var filterRegExp;
                invalidFilterRegEx = undefined;
                try {
                    filterRegExp = new RegExp(filterFor);
                } catch (e) {
                    invalidFilterRegEx = e;
                    return;
                }
                return filterRegExp.test(value);
            };
            filterTypeMap.number = function (value, filterFor) {
                if (!filterFor) { return true; }
                return value === filterFor;
            };
            Object.defineProperty(intf, 'height', {
                get: function () {
                    return height;
                }
            });
            Object.defineProperty(intf, 'width', {
                get: function () {
                    return width;
                }
            });
            Object.defineProperty(intf, 'selectionBounds', {
                get: function () {
                    return getSelectionBounds();
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
                        delete col[uniqueId];
                        return col;
                    });
                }
            });
            Object.defineProperty(intf, 'schema', {
                get: function schemaGetter() {
                    return schema.map(function eachDataRow(col) {
                        delete col[uniqueId];
                        return col;
                    });
                },
                set: function schemaSetter(value) {
                    if (!Array.isArray(value) || typeof value[0] !== 'object') {
                        throw new Error('Schema must be an array of objects.');
                    }
                    if (value[0].name === undefined) {
                        throw new Error('Expected schema to contain an object with at least a name property.');
                    }
                    schema = value.map(function eachSchemaColumn(column) {
                        column.width = column.width || style.columnWidth;
                        column[uniqueId] = getSchemaNameHash(column.name);
                        column.filter = column.filter || filter(column.type);
                        return column;
                    });
                    resize();
                }
            });
            Object.defineProperty(intf, 'data', {
                get: function dataGetter() {
                    return data.map(function eachDataRow(row) {
                        delete row[uniqueId];
                        return row;
                    });
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
                    data = originalData.filter(dataFilter);
                    if (!schema) {
                        tempSchema = getSchemaFromData();
                    }
                    if (attributes.autoResizeColumns && data.length > 0
                            && storedSettings === undefined) {
                        autosize();
                    }
                    setScrollAreaHeight();
                    if (!resize()) { draw(); }
                }
            });
            if (args.name && attributes.saveAppearance) {
                storedSettings = localStorage.getItem(storageName + '-' + args.name);
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
                    sizes = storedSettings.sizes;
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
                intf.data = [{' ': ''}];
            }
            resize();
            controlInput.focus();
        }
        init();
        return intf;
    }
    return grid;
});