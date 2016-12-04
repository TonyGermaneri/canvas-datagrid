/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, requestAnimationFrame: false, performance: false, btoa: false*/
(window.define || function defineStub(a, b) {
    'use strict';
    window.canvasDatagrid = b();
    return;
})([], function context() {
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
                ['scrollBarWidth', 14],
                ['scrollDivOverlap', 1.6],
                ['filterTextPrefix', '(filtered)'],
                ['editCellFontSize', '16px'],
                ['editCellFontFamily', 'sans-serif'],
                ['editCellPaddingLeft', 4],
                ['contextMenuStyleSheet', false],
                ['contextMenuItemMargin', '2px'],
                ['contextMenuItemBorderRadius', '3px'],
                ['contextMenuLabelDisplay', 'inline-block'],
                ['contextMenuLabelMinWidth', '75px'],
                ['contextMenuHoverBackground', 'rgba(182, 205, 250, 1)'],
                ['contextMenuColor', 'rgba(43, 48, 43, 1)'],
                ['contextMenuHoverColor', 'rgba(43, 48, 153, 1)'],
                ['contextMenuFontSize', '16px'],
                ['contextMenuFontFamily', 'sans-serif'],
                ['contextMenuBackground', 'rgba(222, 227, 233, 0.94)'],
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
                ['headerRowWidth', 57],
                ['rowHeaderCellPaddingTop', 5],
                ['rowHeaderCellPaddingLeft', 5],
                ['rowHeaderCellPaddingRight', 7],
                ['rowHeaderCellHeight', 25],
                ['rowHeaderCellBorderWidth', 0.5],
                ['rowHeaderCellBorderColor', 'rgba(172, 175, 179, 1)'],
                ['rowHeaderCellFont', '16px sans-serif'],
                ['rowHeaderCellColor', 'rgba(50, 50, 50, 1)'],
                ['rowHeaderCellBackgroundColor', 'rgba(222, 227, 233, 1)'],
                ['rowHeaderCellHoverColor', 'rgba(43, 48, 153, 1)'],
                ['rowHeaderCellHoverBackgroundColor', 'rgba(181, 201, 223, 1)'],
                ['rowHeaderCellSelectedColor', 'rgba(43, 48, 153, 1)'],
                ['rowHeaderCellSelectedBackgroundColor', 'rgba(182, 205, 250, 1)']
            ],
            input,
            contextMenu,
            controlInput,
            activeCell = [0, 0],
            currentCell,
            storageName = 'canvasDataGrid',
            storedSettings,
            invalidSearchExpClass = 'canvas-datagrid-invalid-search-regExp',
            uniqueId = '_canvasDataGridUniqueId',
            orderBy = uniqueId,
            orderDirection = 'asc',
            invalidFilterRegEx,
            filterBy = '',
            filterValue = '',
            filterTypeMap = {},
            ellipsisCache = {},
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
            scrollIndexTop = 0,
            scrollPixelTop = 0,
            newRow,
            dragStart;
        function setStorageData() {
            if (!attributes.saveAppearance) { return; }
            localStorage.setItem(storageName + '-' + args.name, JSON.stringify({
                sizes: sizes
            }));
        }
        function getVisibleSchema() {
            return (schema || tempSchema).filter(function (col) { return !col.hidden; });
        }
        function createNewRowData() {
            newRow = {};
            newRow[uniqueId] = uId;
            uId += 1;
            (schema || tempSchema).forEach(function forEachHeader(header, index) {
                var d = header.defaultValue || '';
                if (typeof d === 'function') {
                    d = d.apply(intf, [header, index]);
                }
                newRow[header.name] = d;
            });
        }
        function addEllipsis(text, width) {
            if (ellipsisCache[text] && ellipsisCache[text][width]) {
                return ellipsisCache[text][width];
            }
            var o = text, i = text.length;
            while (width < ctx.measureText(o).width && i > 1) {
                i -= 1;
                o = text.substring(0, i) + "...";
            }
            ellipsisCache[text] = ellipsisCache[text] || {};
            ellipsisCache[text][width] = o;
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
        cellFormaters.string = function cellFormatterString(ctx, cell) {
            return cell.value !== undefined ? cell.value : '';
        };
        cellFormaters.rowHeaderCell = cellFormaters.string;
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
            var d = [], s = getVisibleSchema(), l = data.length;
            selections.forEach(function (row, index) {
                if (index === l) { return; }
                d[index] = {};
                row.forEach(function (col) {
                    if (col === -1) { return; }
                    d[index][s[col].name] = data[index][s[col].name];
                });
            });
            return d;
        }
        function clearChangeLog() {
            changes = [];
        }
        function selectArea() {
            var x, y;
            selections = [];
            for (x = selectionBounds.top; x <= selectionBounds.bottom; x += 1) {
                selections[x] = [];
                for (y = selectionBounds.left; y <= selectionBounds.right; y += 1) {
                    selections[x].push(y);
                }
            }
            fire('selectionchanged', [getSelectedData(), selections, selectionBounds], intf);
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
        function findColumnMaxTextLength(name) {
            var m = -Infinity;
            if (name === 'cornerCell') {
                ctx.font = style.rowHeaderCellFont;
                return ctx.measureText((data.length + (attributes.showNewRow ? 1 : 0)).toString()).width
                    + style.rowHeaderCellPaddingRight
                    + style.rowHeaderCellPaddingLeft;
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
        function setScrollArea() {
            var cellBorder = style.cellBorderWidth * 2,
                headerCellBorder =  style.headerCellBorderWidth * 2;
            scrollHeight = data.reduce(function reduceData(accumulator, row) {
                return accumulator + (sizes.rows[row[uniqueId]] || style.cellHeight) + cellBorder;
            }, 0) || 0;
            scrollWidth = (schema || tempSchema).reduce(function reduceSchema(accumulator, column) {
                if (column.hidden) { return accumulator; }
                return accumulator + (sizes.columns[column.name] || column.width || style.columnWidth) + cellBorder;
            }, 0) || 0;
            if (attributes.showNewRow) {
                scrollHeight += style.cellHeight + cellBorder;
            }
            scrollArea.style.height = scrollHeight - headerCellBorder + style.scrollDivOverlap + 'px';
            scrollArea.style.width = scrollWidth - style.scrollBarWidth + 'px';
        }
        function draw() {
            if (!container.parentNode
                    || !container.offsetHeight
                    || !container.offsetWidth) {
                return;
            }
            var checkScrollHeight, borderWidth, rowHeaderCell, p, cx, cy, cellHeight,
                cornerCell, y, x, c, h, w, s, r, rd, l = data.length,
                headerCellHeight = sizes.rows[-1] || style.headerCellHeight,
                headerCellWidth = sizes.columns.cornerCell ||  style.headerRowWidth;
            if (attributes.showPerformance) {
                p = performance.now();
            }
            borderWidth = style.cellBorderWidth * 2;
            visibleRows = [];
            s = getVisibleSchema();
            visibleCells = [];
            x = 0;
            y = scrollBox.scrollTop * -1 + headerCellHeight + scrollPixelTop;
            h = canvas.height = height;
            w = canvas.width = width;
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
                        cellWidth = sizes.columns[cellStyle  === 'rowHeaderCell'
                            ? 'cornerCell' : header[uniqueId]] || header.width;
                    if (active) {
                        cellStyle = 'activeCell';
                    }
                    if (visibleRows.indexOf(rowIndex) === -1
                            && ['headerCell', 'cornerCell'].indexOf(cellStyle) === -1) {
                        visibleRows.push(rowIndex);
                    }
                    val = fire('formatcellvalue', [ctx, d[header.name], d, header, cx, cy], intf);
                    if (!fire('beforerendercell', [ctx, d[header.name], d, header, cx, cy], intf)) {
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
                            type: header.type,
                            style: cellStyle,
                            x: cx,
                            y: cy,
                            active: active === true,
                            hovered: hovered === true,
                            selected: selected === true,
                            width: cellWidth,
                            height: cellHeight,
                            data: d,
                            header: header,
                            index: headerIndex,
                            columnIndex: headerIndex,
                            rowIndex: rowIndex,
                            value: cellStyle === 'headerCell'
                                ? (header.title || header.name) : d[header.name]
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
                        fire('rendercell', [ctx, cell], intf);
                        ctx.fillRect(cx, cy, cell.width, cell.height);
                        ctx.strokeRect(cx, cy, cell.width, cell.height);
                        if (cell.height !== cellHeight) {
                            sizes.rows[cellStyle === 'headerCell' ? -1 : d[uniqueId]] = cell.height;
                            checkScrollHeight = true;
                        }
                        if (cell.width !== cellWidth) {
                            sizes.columns[cell.columnIndex] = cell.width;
                            checkScrollHeight = true;
                        }
                        if ((attributes.showRowNumbers && cellStyle === 'rowHeaderCell')
                                || cellStyle !== 'rowHeaderCell') {
                            ctx.font = style[cellStyle + 'Font'];
                            val = val !== undefined ? val : f
                                ? f(ctx, cell) : '';
                            if (val === undefined && !f) {
                                val = '';
                                console.warn('canvas-datagrid: I don\'t know how to format a '
                                    + header.type + ' add a cellFormater');
                            }
                            if (cellStyle === 'headerCell' && orderBy === header.name) {
                                if (!fire('renderorderbyarrow', [ctx, cell], intf)) {
                                    orderByArrowSize = drawOrderByArrow(cx + style[cellStyle + 'PaddingLeft'], 0);
                                }
                            }
                            ctx.save();
                            ctx.rect(cx, cy, cell.width, cell.height);
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
                            cell.formattedValue = (val || '').toString();
                            fire('rendertext', [ctx, cell], intf);
                            ctx.fillText(addEllipsis(cell.formattedValue, cell.width - style[cellStyle + 'PaddingRight'] - orderByArrowSize - style.autosizePadding),
                                orderByArrowSize + cx + style[cellStyle + 'PaddingLeft'],
                                cy - (cell.height * 0.5) + style[cellStyle + 'PaddingTop'] + cell.height);
                            ctx.restore();
                        }
                        x += cell.width + borderWidth;
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
            for (r = scrollIndexTop; r < l; r += 1) {
                rd = data[r];
                if ((y - cellHeight > h)
                        || (r < scrollIndexTop)
                        || (y < cellHeight * -1)) {
                    break;
                }
                cellHeight = sizes.rows[rd[uniqueId]] || style.cellHeight;
                if (attributes.showRowHeaders) {
                    x = headerCellWidth;
                }
                s.forEach(drawCell(rd, r));
                drawRowHeader(rd, r);
                y += cellHeight + borderWidth;
                x = 0;
            }
            if (attributes.showNewRow) {
                if (attributes.showRowHeaders) {
                    x = headerCellWidth;
                }
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
            if (checkScrollHeight) {
                setScrollArea();
            }
            if (attributes.showPerformance) {
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'white';
                p = (performance.now() - p).toFixed(2) + 'ms';
                ctx.font = '33px sans-serif';
                ctx.fillText(p, w - (w / 5), h - (h / 10));
                ctx.strokeText(p, w - (w / 5), h - (h / 10));
            }
        }
        function resize() {
            var h,
                headerCellHeight = sizes.rows[-1] || style.headerCellHeight,
                headerCellWidth = sizes.columns.cornerCell || style.headerRowWidth,
                headerCellBorder =  style.headerCellBorderWidth * 2;
            h = (attributes.height === undefined ?
                    Math.min(container.parentNode.offsetHeight, window.innerHeight) : attributes.height);
            if (attributes.maxHeight !== undefined && h > attributes.maxHeight) {
                h = attributes.maxHeight;
            }
            if (h < style.minHeight) {
                h = style.minHeight;
            }
            if (fire('resize', [h, width], intf)) { return false; }
            container.style.height = h + 'px';
            height = container.offsetHeight;
            width = container.offsetWidth;
            scrollBox.style.width = container.offsetWidth - headerCellWidth + 'px';
            scrollBox.style.height = container.offsetHeight - headerCellHeight - headerCellBorder
                + style.scrollDivOverlap + 'px';
            scrollBox.style.top = headerCellHeight + headerCellBorder
                - style.scrollDivOverlap + 'px';
            scrollBox.style.left = headerCellWidth + 'px';
            draw();
            return true;
        }
        function clipInput() {
            var clipRect = {
                    x: 0,
                    y: 0,
                    h: 0,
                    w: 0
                },
                headerCellHeight = sizes.rows[-1] || style.headerCellHeight,
                headerCellWidth = sizes.columns.cornerCell || style.headerRowWidth;
            clipRect.h = input.offsetHeight;
            clipRect.w = input.offsetWidth;
            input.style.top = scrollEdit.inputTop
                + (scrollEdit.scrollTop - scrollBox.scrollTop) + 'px';
            input.style.left = scrollEdit.inputLeft
                + (scrollEdit.scrollLeft - scrollBox.scrollLeft) + 'px';
            clipRect.x = (input.offsetLeft * -1) + headerCellWidth;
            clipRect.y = (input.offsetTop * -1) + headerCellHeight;
            input.style.clipPath = 'polygon('
                + clipRect.x + 'px ' + clipRect.y + 'px,'
                + clipRect.x + 'px ' + clipRect.h + 'px,'
                + clipRect.w + 'px ' + clipRect.h + 'px,'
                + clipRect.w + 'px ' + clipRect.y + 'px'
                + ')';
        }
        function scroll() {
            var cellBorder = style.cellBorderWidth * 2;
            scrollIndexTop = 0;
            scrollPixelTop = 0;
            while (scrollPixelTop < scrollBox.scrollTop) {
                scrollPixelTop += (sizes.rows[data[scrollIndexTop][uniqueId]] || style.cellHeight) + cellBorder;
                scrollIndexTop += 1;
            }
            scrollIndexTop = Math.max(scrollIndexTop - 1, 0);
            scrollPixelTop = Math.max(scrollPixelTop - (sizes.rows[data[scrollIndexTop][uniqueId]] || style.cellHeight), 0);
            ellipsisCache = {};
            draw();
            if (input) {
                clipInput();
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
        function fitColumnToValues(name) {
            sizes.columns[name === 'cornerCell' ? name : getHeaderByName(name)[uniqueId]]
                = findColumnMaxTextLength(name);
            draw();
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
                if (a[columnName] === undefined || a[columnName] === null
                        || b[columnName] === undefined || b[columnName] === null) {
                    return false;
                }
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
        function getCellAt(x, y) {
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
                                && ['rowHeaderCell', 'cornerCell'].indexOf(cell.style) !== -1)
                                || ['rowHeaderCell', 'cornerCell'].indexOf(cell.style) === -1)) {
                        cell.context = 'ew-resize';
                        return cell;
                    }
                    if (cell.y + cell.height - (attributes.borderResizeZone * 0.5) < y
                            && cell.y + cell.height + (attributes.borderResizeZone * 0.5) > y
                            && attributes.allowRowResize
                            && ((attributes.allowRowResizeFromCell && cell.style === 'cell')
                                || cell.style !== 'cell')
                            && cell.style !== 'headerCell') {
                        cell.context = 'ns-resize';
                        return cell;
                    }
                    cell.context = 'cell';
                    return cell;
                }
            }
            return {
                context: 'inherit'
            };
        }
        function mousemove(e) {
            if (contextMenu || input) {
                return;
            }
            var dragBounds,
                x = e.clientX - container.getBoundingClientRect().left,
                y = e.clientY - container.getBoundingClientRect().top,
                o = getCellAt(x, y);
            currentCell = o;
            hovers = {};
            if (!resizingItem && o) {
                resizeItem = o;
                resizeMode = o.context;
                container.style.cursor = o.context;
                if (o.context === 'cell') {
                    container.style.cursor = 'pointer';
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
                    if (!selectionBounds || (dragBounds.top !== selectionBounds.top
                            || dragBounds.left !== selectionBounds.left
                            || dragBounds.bottom !== selectionBounds.bottom
                            || dragBounds.right !== selectionBounds.right)) {
                        selectionBounds = dragBounds;
                        selectArea();
                    }
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
            setScrollArea();
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
                contextObject = getCellAt(pos.x, pos.y),
                filterContainer,
                filterLabel,
                filterInput,
                menuItems;
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
            contextMenu.style.top = pos.y + style.contextMenuMarginTop + 'px';
            contextMenu.style.left = pos.x + style.contextMenuMarginLeft + 'px';
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
                    && Object.keys(sizes.rows).length > 0
                    && Object.keys(sizes.columns).length > 0) {
                menuItems.push({
                    title: 'Reset column and row sizes',
                    click: function (e) {
                        e.preventDefault();
                        sizes = {
                            rows: {},
                            columns: {},
                        };
                        setStorageData();
                        draw();
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
                if (item.click) {
                    row.addEventListener('click', function contextClickProxy(e) {
                        item.click.apply(this, [e, contextObject, disposeContextMenu]);
                        e.preventDefault();
                        e.stopPropagation();
                        controlInput.focus();
                    });
                }
            });
            filterInput.addEventListener('dblclick', function (e) {
                e.stopPropagation();
            });
            filterInput.addEventListener('click', function (e) {
                e.stopPropagation();
            });
            filterInput.addEventListener('mousedown', function (e) {
                e.stopPropagation();
            });
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
            container.appendChild(contextMenu);
            e.preventDefault();
        }
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
        function gotoCell(x, y) {
            if (x !== undefined) {
                scrollBox.scrollLeft = findColumnScrollLeft(x);
            }
            if (y !== undefined) {
                scrollBox.scrollTop = findRowScrollTop(y);
            }
        }
        function gotoRow(y) {
            gotoCell(0, y);
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
                gotoCell(x, y);
            }
        }
        function setActiveCell(x, y) {
            activeCell = [x, y];
        }
        function addRow(d) {
            originalData.push(d);
            setFilter(filterBy, filterValue);
            setScrollArea();
        }
        function endEdit(abort) {
            var cell = input.editCell,
                y = cell.rowIndex;
            function abortEdit() {
                abort = true;
            }
            if (fire('beforeendedit', [input.value, cell.value, abortEdit, cell, input], intf)) { return false; }
            if (input.value !== cell.value && !abort) {
                changes[y] = changes[y] || {};
                changes[y][cell.header.name] = input.value;
                cell.data[cell.header.name] = input.value;
                if (y === data.length) {
                    if (fire('newrow', [input.value, cell.value, abort, cell, input], intf)) { return false; }
                    uId += 1;
                    addRow(cell.data);
                    createNewRowData();
                }
                draw();
            }
            container.removeChild(input);
            controlInput.focus();
            fire('endedit', [input.value, abort, cell, input], intf);
            input = undefined;
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
                top = cell.y + style.cellBorderWidth;
                left = cell.x + style.cellBorderWidth;
                scrollEdit = {
                    scrollTop: scrollBox.scrollTop,
                    scrollLeft: scrollBox.scrollLeft,
                    inputTop: top,
                    inputLeft: left
                };
                input = document.createElement(attributes.multiLine ? 'textarea' : 'input');
                container.appendChild(input);
                input.className = 'canvas-datagrid-edit-input';
                input.style.position = 'absolute';
                input.style.border = 'none';
                input.style.top = top + 'px';
                input.style.left = left + 'px';
                input.style.height = cell.height - (style.cellBorderWidth * 2) + 'px';
                input.style.width = cell.width - (style.cellBorderWidth * 2) - style.cellPaddingLeft + 'px';
                input.style.zIndex = '2';
                input.value = cell.value;
                input.editCell = cell;
                clipInput();
                input.focus();
                input.addEventListener('click', function (e) { e.stopPropagation(); });
                input.addEventListener('dblclick', function (e) { e.stopPropagation(); });
                input.addEventListener('mouseup', function (e) { e.stopPropagation(); });
                input.addEventListener('mousedown', function (e) { e.stopPropagation(); });
                input.addEventListener('keydown', function (e) {
                    var nx = cell.columnIndex,
                        ny = cell.rowIndex;
                    // esc
                    if (e.keyCode === 27) {
                        endEdit(true);
                        draw();
                    // enter
                    } else if (e.keyCode === 13) {
                        endEdit();
                        draw();
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
            fire('beginedit', [cell, input], intf);
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
            currentCell = getCellAt(pos.x, pos.y);
            function checkSelectionChange() {
                if (!selectionChanged) { return; }
                fire('selectionchanged', [getSelectedData(), selections, selectionBounds], intf);
            }
            if (input) {
                endEdit();
            }
            if (ignoreNextClick) {
                ignoreNextClick = false;
                return;
            }
            i = currentCell;
            if (fire('click', [e, currentCell], intf)) { return; }
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
                index = i.selected ? selections[i.rowIndex].indexOf(i.header.index) : -1;
                if (attributes.rowSelectionMode || currentCell.style === 'rowHeaderCell') {
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
                        selections[i.rowIndex].push(i.columnIndex);
                    }
                }
                if (i.selected && ctrl) {
                    if (attributes.rowSelectionMode) {
                        selections[i.rowIndex] = undefined;
                    }
                    selections[i.rowIndex].splice(selections[i.rowIndex].indexOf(i.columnIndex), 1);
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
                sizes.columns[resizingItem.header.style === 'rowHeaderCell'
                       ? 'cornerCell' : resizingItem.header[uniqueId]] = x;
                return;
            }
            if (resizeMode === 'ns-resize') {
                sizes.rows[resizingItem.data[uniqueId]] = y;
                return;
            }
            ellipsisCache = {};
        }
        function stopDragResize() {
            setScrollArea();
            document.body.removeEventListener('mousemove', dragResizeColumn, false);
            document.body.removeEventListener('mouseup', stopDragResize, false);
            setStorageData();
            draw();
            ignoreNextClick = true;
        }
        function mousedown(e) {
            if (fire('mousedown', [e, currentCell], intf)) { return; }
            if (e.button === 2 || input) { return; }
            dragStart = {
                x: e.clientX - container.getBoundingClientRect().left,
                y: e.clientY - container.getBoundingClientRect().top
            };
            dragStartObject = getCellAt(dragStart.x, dragStart.y);
            if (resizeMode === 'cell') {
                selecting = true;
                mousemove(e);
            }
            if (['ns-resize', 'ew-resize'].indexOf(resizeMode) !== -1) {
                resizingItem = resizeItem;
                resizingStartingWidth = sizes.columns[resizingItem.header.style === 'rowHeaderCell'
                       ? 'cornerCell' : resizingItem.header[uniqueId]] || resizingItem.header.width;
                resizingStartingHeight = sizes.rows[resizingItem.data[uniqueId]] || style.cellHeight;
                document.body.addEventListener('mousemove', dragResizeColumn, false);
                document.body.addEventListener('mouseup', stopDragResize, false);
            }
        }
        function mouseup(e) {
            if (fire('mouseup', [e, currentCell], intf)) { return; }
            if (contextMenu || input) { return; }
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
            if (fire('keydown', [e, currentCell], intf)) { return; }
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
            //Enter
            } else if (e.keyCode === 13) {
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
            // Arrows
            if (e.shiftKey && [37, 38, 39, 40].indexOf(e.keyCode) !== -1) {
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
            if (fire('keyup', [e, currentCell], intf)) { return; }
            controlInput.value = '';
        }
        function keypress(e) {
            if (fire('keypress', [e, currentCell], intf)) { return; }
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
            if (fire('dblclick', [e, currentCell], intf)) { return; }
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
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
            window.removeEventListener('resize', resize);
        }
        function attachCss() {
            var styleSheet, css = [
                '.canvas-datagrid-scrollBox { overflow: auto!important; z-index: 1!important; }',
                '.canvas-datagrid { box-sizing: content-box!important; padding: 0!important; background: <backgroundColor>;}',
                '.canvas-datagrid-edit-input { box-sizing: content-box!important; outline: none!important; margin: 0!important; padding: 0 0 0 <editCellPaddingLeft>px!important;',
                'font-size: <editCellFontSize>!important; font-family: <editCellFontFamily>!important; }',
                '.canvas-datagrid-context-menu-item { margin: <contextMenuItemMargin>; border-radius: <contextMenuItemBorderRadius>; }',
                '.canvas-datagrid-context-menu-item:hover { background: <contextMenuHoverBackground>;',
                ' color: <contextMenuHoverColor>; margin: <contextMenuItemMargin>; }',
                '.canvas-datagrid-context-menu-label { display: <contextMenuLabelDisplay>; min-width: <contextMenuLabelMinWidth>; }',
                '.canvas-datagrid-context-menu { font-family: <contextMenuFontFamily>;',
                'font-size: <contextMenuFontSize>; background: <contextMenuBackground>; color: <contextMenuColor>;',
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
        function setDom() {
            controlInput = document.createElement('input');
            container = document.createElement('div');
            scrollBox = document.createElement('div');
            scrollArea = document.createElement('div');
            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');
            ctx.textBaseline = 'alphabetic';
            container.className = 'canvas-datagrid';
            scrollBox.className = 'canvas-datagrid-scrollBox';
            [scrollBox, canvas, controlInput].forEach(function eachEle(el) {
                el.style.position = 'absolute';
            });
            window.addEventListener('resize', function resizeEvent() { requestAnimationFrame(resize); });
            if (container.parentNode) {
                container.parentNode.addEventListener('resize', resize);
            }
            controlInput.addEventListener('keypress', keypress, false);
            controlInput.addEventListener('keyup', keyup, false);
            controlInput.addEventListener('keydown', keydown, false);
            document.body.addEventListener('mouseup', mouseup, false);
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
            intf.getSchemaFromData = getSchemaFromData;
            intf.setFilter = setFilter;
            intf.addRow = addRow;
            intf.sizes = sizes;
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
            intf.cellFormaters = cellFormaters;
            intf.filters = filterTypeMap;
            Object.keys(style).forEach(function (key) {
                Object.defineProperty(intf.style, key, {
                    get: function () {
                        return style[key];
                    },
                    set: function (value) {
                        style[key] = value;
                        draw();
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
                        draw();
                    }
                });
            });
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
                        return col;
                    });
                }
            });
            Object.defineProperty(intf, 'schema', {
                get: function schemaGetter() {
                    return schema.map(function eachDataRow(col) {
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
                    schema = value.map(function eachSchemaColumn(column, index) {
                        column.width = column.width || style.columnWidth;
                        column[uniqueId] = getSchemaNameHash(column.name);
                        column.filter = column.filter || filter(column.type);
                        column.type = column.type || 'string';
                        column.index = index;
                        return column;
                    });
                    createNewRowData();
                    resize();
                }
            });
            Object.defineProperty(intf, 'data', {
                get: function dataGetter() {
                    return data.map(function eachDataRow(row) {
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
                    changes = [];
                    data = originalData.filter(dataFilter);
                    if (!schema && data.length > 0) {
                        tempSchema = getSchemaFromData();
                    }
                    if (data.length === 0) {
                        tempSchema = [{name: ''}];
                    }
                    createNewRowData();
                    if (attributes.autoResizeColumns && data.length > 0
                            && storedSettings === undefined) {
                        autosize();
                    }
                    setScrollArea();
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
                intf.data = [];
            }
            resize();
            controlInput.focus();
        }
        init();
        return intf;
    }
    return grid;
});
