/*jslint browser: true, unparam: true, todo: true*/
/*globals XMLSerializer: false, define: true, Blob: false, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([], function () {
    'use strict';
    return function (self) {
        var perfCounters = [],
            drawCount = 0,
            perfWindowSize = 20;
        self.htmlImageCache = {};
        function drawOnAllImagesLoaded() {
            var loaded = true;
            Object.keys(self.htmlImageCache).forEach(function (html) {
                if (!self.htmlImageCache[html].complete) {
                    loaded = false;
                }
            });
            if (loaded) {
                self.draw();
            }
        }
        function drawHtml(cell) {
            var img,
                v = cell.innerHTML || cell.formattedValue,
                x = cell.x + self.canvasOffsetLeft,
                y = cell.y + self.canvasOffsetTop;
            if (self.htmlImageCache[v]) {
                img = self.htmlImageCache[v];
                if (img.height !== cell.height || img.width !== cell.width) {
                    // height and width of the cell has changed, invalidate cache
                    self.htmlImageCache[v] = undefined;
                } else {
                    if (!img.complete) {
                        return;
                    }
                    return self.ctx.drawImage(img, x, y);
                }
            }
            img = new Image(cell.width, cell.height);
            self.htmlImageCache[v] = img;
            img.onload = function () {
                self.ctx.drawImage(img, x, y);
                drawOnAllImagesLoaded();
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(
                '<svg xmlns="http://www.w3.org/2000/svg" width="' + cell.width + '" height="' + cell.height + '">\n' +
                    '<foreignObject class="node" x="0" y="0" width="100%" height="100%">\n' +
                    '<body xmlns="http://www.w3.org/1999/xhtml" style="margin:0;padding:0;">\n' +
                    v + '\n' +
                    '</body>' +
                    '</foreignObject>\n' +
                    '</svg>\n'
            );
        }
        function drawOrderByArrow(x, y) {
            x += self.canvasOffsetLeft;
            y += self.canvasOffsetTop;
            self.ctx.fillStyle = self.style.headerOrderByArrowColor;
            self.ctx.strokeStyle = self.style.headerOrderByArrowBorderColor;
            self.ctx.beginPath();
            x = x + self.style.headerOrderByArrowMarginLeft;
            y = y + self.style.headerOrderByArrowMarginTop;
            if (self.orderDirection === 'asc') {
                self.ctx.moveTo(x, y);
                self.ctx.lineTo(x + self.style.headerOrderByArrowWidth, y);
                self.ctx.lineTo(x + (self.style.headerOrderByArrowWidth * 0.5), y + self.style.headerOrderByArrowHeight);
                self.ctx.moveTo(x, y);
            } else {
                self.ctx.lineTo(x, y + self.style.headerOrderByArrowHeight);
                self.ctx.lineTo(x + self.style.headerOrderByArrowWidth, y + self.style.headerOrderByArrowHeight);
                self.ctx.lineTo(x + (self.style.headerOrderByArrowWidth * 0.5), y);
                self.ctx.lineTo(x, y + self.style.headerOrderByArrowHeight);
            }
            self.ctx.stroke();
            self.ctx.fill();
            return self.style.headerOrderByArrowMarginLeft
                + self.style.headerOrderByArrowWidth
                + self.style.headerOrderByArrowMarginRight;
        }
        function drawTreeArrow(cell, x, y) {
            x += self.canvasOffsetLeft;
            y += self.canvasOffsetTop;
            self.ctx.fillStyle = self.style.treeArrowColor;
            self.ctx.strokeStyle = self.style.treeArrowBorderColor;
            self.ctx.beginPath();
            x = x + self.style.treeArrowMarginLeft;
            y = y + self.style.treeArrowMarginTop;
            if (self.openChildren[cell.data[self.uniqueId]]) {
                self.ctx.moveTo(x, y);
                self.ctx.lineTo(x + self.style.treeArrowWidth, y);
                self.ctx.lineTo(x + (self.style.treeArrowWidth * 0.5), y + self.style.treeArrowHeight);
                self.ctx.moveTo(x, y);
            } else {
                self.ctx.lineTo(x, y);
                self.ctx.lineTo(x + self.style.treeArrowHeight, y + (self.style.treeArrowWidth * 0.5));
                self.ctx.lineTo(x, y + self.style.treeArrowWidth);
                self.ctx.lineTo(x, y);
            }
            self.ctx.stroke();
            self.ctx.fill();
            return self.style.treeArrowMarginLeft
                + self.style.treeArrowWidth
                + self.style.treeArrowMarginRight;
        }
        function radiusRect(x, y, w, h, radius) {
            x += self.canvasOffsetLeft;
            y += self.canvasOffsetTop;
            var r = x + w, b = y + h;
            self.ctx.beginPath();
            self.ctx.moveTo(x + radius, y);
            self.ctx.lineTo(r - radius, y);
            self.ctx.quadraticCurveTo(r, y, r, y + radius);
            self.ctx.lineTo(r, y + h - radius);
            self.ctx.quadraticCurveTo(r, b, r - radius, b);
            self.ctx.lineTo(x + radius, b);
            self.ctx.quadraticCurveTo(x, b, x, b - radius);
            self.ctx.lineTo(x, y + radius);
            self.ctx.quadraticCurveTo(x, y, x + radius, y);
        }
        function fillRect(x, y, w, h) {
            x += self.canvasOffsetLeft;
            y += self.canvasOffsetTop;
            self.ctx.fillRect(x, y, w, h);
        }
        function strokeRect(x, y, w, h) {
            x += self.canvasOffsetLeft;
            y += self.canvasOffsetTop;
            self.ctx.strokeRect(x, y, w, h);
        }
        function fillText(text, x, y) {
            x += self.canvasOffsetLeft;
            y += self.canvasOffsetTop;
            self.ctx.fillText(text, x, y);
        }
        function addBorderLine(c, pos) {
            self.ctx.beginPath();
            var p = {
                t: function () {
                    self.ctx.moveTo(c.x + self.canvasOffsetLeft, c.y + self.canvasOffsetTop);
                    self.ctx.lineTo(c.x + self.canvasOffsetLeft + c.width, c.y + self.canvasOffsetTop);
                },
                r: function () {
                    self.ctx.moveTo(c.x + self.canvasOffsetLeft + c.width, c.y + self.canvasOffsetTop);
                    self.ctx.lineTo(c.x + self.canvasOffsetLeft + c.width, c.y + self.canvasOffsetTop + c.height);
                },
                b: function () {
                    self.ctx.moveTo(c.x + self.canvasOffsetLeft, c.y + self.canvasOffsetTop + c.height);
                    self.ctx.lineTo(c.x + self.canvasOffsetLeft + c.width, c.y + self.canvasOffsetTop + c.height);
                },
                l: function () {
                    self.ctx.moveTo(c.x + self.canvasOffsetLeft, c.y + self.canvasOffsetTop);
                    self.ctx.lineTo(c.x + self.canvasOffsetLeft, c.y + self.canvasOffsetTop + c.height);
                },
            };
            p[pos]();
            self.ctx.stroke();
        }
        function addEllipsis(text, width) {
            var o, i, c, w = 0;
            if (self.ellipsisCache[text] && self.ellipsisCache[text][width]) {
                return self.ellipsisCache[text][width];
            }
            w = self.ctx.measureText(text).width;
            if (w < width) {
                o = text;
            } else {
                o = text.substring(0, 1);
                i = 1;
                // wow! a do while!  and I didn't intend to use one here
                do {
                    i += 1;
                    o = text.substring(0, i) + '...';
                    w = self.ctx.measureText(o).width;
                } while (width > w);
            }
            self.ellipsisCache[text] = self.ellipsisCache[text] || {};
            c = {value: o, width: w};
            self.ellipsisCache[text][width] = c;
            return c;
        }
        function drawText(cell) {
            var paddingLeft = self.style[cell.style + 'PaddingLeft'],
                paddingTop = self.style[cell.style + 'PaddingTop'],
                paddingRight = self.style[cell.style + 'PaddingRight'],
                paddingBottom = self.style[cell.style + 'PaddingBottom'],
                vPos = paddingTop + cell.height - (cell.height * 0.5),
                hPos = paddingLeft + cell.treeArrowWidth + cell.orderByArrowWidth;
            cell.text = addEllipsis(cell.formattedValue, cell.width - paddingRight - paddingLeft);
            cell.text.height = cell.fontHeight;
            if (cell.horizontalAlignment === 'right') {
                hPos = cell.width - cell.text.width - paddingRight;
            } else if (cell.horizontalAlignment === 'center') {
                hPos = (cell.width / 2) - (cell.text.width / 2);
            }
            if (cell.verticalAlignment === 'top') {
                vPos = paddingTop + cell.text.height;
            } else if (cell.verticalAlignment === 'bottom') {
                vPos = cell.height - paddingBottom - cell.text.height;
            }
            cell.text.x = cell.x + hPos;
            cell.text.y = cell.y + vPos;
            fillText(cell.text.value, cell.text.x, cell.text.y);
        }
        /**
         * Redraws the grid. No matter what the change, this is the only method required to refresh everything.
         * @memberof canvasDataGrid
         * @name draw
         * @method
         */
        self.draw = function (internal) {
            if (!self.isChildGrid && (!self.height || !self.width)) {
                return;
            }
            if (self.isChildGrid && internal) {
                self.parentGrid.draw();
                return;
            }
            if (self.intf.visible === false) {
                return;
            }
            // initial values
            var checkScrollHeight, borderWidth, rowHeaderCell, p, cx, cy, treeGrid, rowOpen,
                rowHeight, cornerCell, y, x, c, h, w, s, r, rd, aCell,
                selectionBorders = [],
                rowHeaders = [],
                l = self.data.length,
                u = self.currentCell || {},
                headerCellHeight = self.getHeaderCellHeight(),
                headerCellWidth = self.getHeaderCellWidth(),
                cellHeight = self.style.cellHeight;
            drawCount += 1;
            p = performance.now();
            // if data length has changed, there is no way to know
            if (self.data.length > self.orders.rows.length) {
                self.createRowOrders();
            }
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
                    m = (self.style.scrollBarBoxMargin * 2),
                    d = self.style.scrollBarBoxMargin * 0.5;
                self.ctx.strokeStyle = self.style.scrollBarBorderColor;
                self.ctx.lineWidth = self.style.scrollBarBorderWidth;
                // vertical
                v.x += w - self.style.scrollBarWidth - self.style.scrollBarBorderWidth - d;
                v.y += headerCellHeight;
                v.width = self.style.scrollBarWidth + self.style.scrollBarBorderWidth + d;
                v.height = h - headerCellHeight - self.style.scrollBarWidth - d - m;
                self.ctx.fillStyle = self.style.scrollBarBackgroundColor;
                fillRect(v.x, v.y, v.width, v.height + m);
                strokeRect(v.x, v.y, v.width, v.height + m);
                // vertical box
                vb.x = v.x + self.style.scrollBarBoxMargin;
                vb.y = headerCellHeight + self.style.scrollBarBoxMargin
                    + ((v.height - self.scrollBox.scrollBoxHeight)
                        * (self.scrollBox.scrollTop / self.scrollBox.scrollHeight));
                vb.width = self.style.scrollBarBoxWidth;
                vb.height = self.scrollBox.scrollBoxHeight;
                self.ctx.fillStyle = self.style.scrollBarBoxColor;
                if (/vertical/.test(u.context)) {
                    self.ctx.fillStyle = self.style.scrollBarActiveColor;
                }
                if (vb.width < v.width) {
                    radiusRect(vb.x, vb.y, vb.width, vb.height, self.style.scrollBarBoxBorderRadius);
                    self.ctx.stroke();
                    self.ctx.fill();
                }
                // horizontal
                n.x += headerCellWidth;
                n.y += h - self.style.scrollBarWidth - d;
                n.width = w - self.style.scrollBarWidth - headerCellWidth - d - m;
                n.height = self.style.scrollBarWidth + self.style.scrollBarBorderWidth + d;
                self.ctx.fillStyle = self.style.scrollBarBackgroundColor;
                fillRect(n.x, n.y, n.width + m, n.height);
                strokeRect(n.x, n.y, n.width + m, n.height);
                // horizontal box
                nb.y = n.y + self.style.scrollBarBoxMargin;
                nb.x = headerCellWidth + self.style.scrollBarBoxMargin
                    + ((n.width - self.scrollBox.scrollBoxWidth)
                        * (self.scrollBox.scrollLeft / self.scrollBox.scrollWidth));
                nb.width = self.scrollBox.scrollBoxWidth;
                nb.height = self.style.scrollBarBoxWidth;
                self.ctx.fillStyle = self.style.scrollBarBoxColor;
                if (/horizontal/.test(u.context)) {
                    self.ctx.fillStyle = self.style.scrollBarActiveColor;
                }
                if (nb.width < n.width) {
                    radiusRect(nb.x, nb.y, nb.width, nb.height, self.style.scrollBarBoxBorderRadius);
                    self.ctx.stroke();
                    self.ctx.fill();
                }
                //corner
                self.ctx.strokeStyle = self.style.scrollBarCornerBorderColor;
                self.ctx.fillStyle = self.style.scrollBarCornerBackgroundColor;
                co.x = n.x + n.width + m;
                co.y = v.y + v.height + m;
                co.width = self.style.scrollBarWidth + self.style.scrollBarBorderWidth;
                co.height = self.style.scrollBarWidth + self.style.scrollBarBorderWidth;
                radiusRect(co.x, co.y, co.width, co.height, 0);
                self.ctx.stroke();
                self.ctx.fill();
                self.visibleCells.unshift(v);
                self.visibleCells.unshift(vb);
                self.visibleCells.unshift(n);
                self.visibleCells.unshift(nb);
                self.visibleCells.unshift(co);
                self.scrollBox.bar = {
                    v: v,
                    h: n
                };
                self.scrollBox.box = {
                    v: vb,
                    h: nb
                };
            }
            function drawCell(d, rowIndex, rowOrderIndex) {
                return function drawEach(header, headerIndex, columnOrderIndex) {
                    var cellStyle = header.style || 'cell',
                        childGridAttributes,
                        cell,
                        isHeader = /headerCell/.test(cellStyle),
                        isCorner = /cornerCell/.test(cellStyle),
                        isRowHeader = 'rowHeaderCell' === cellStyle,
                        selected = self.selections[rowOrderIndex] && self.selections[rowOrderIndex].indexOf(columnOrderIndex) !== -1,
                        hovered = self.hovers[d[self.uniqueId]] && self.hovers[d[self.uniqueId]].indexOf(columnOrderIndex) !== -1,
                        active = self.activeCell.rowIndex === rowOrderIndex && self.activeCell.columnIndex === columnOrderIndex,
                        isGrid = Array.isArray(d[header.name]),
                        activeHeader = (self.orders.rows[self.activeCell.rowIndex] === rowOrderIndex
                                || self.orders.columns[self.activeCell.columnIndex] === columnOrderIndex)
                            && (columnOrderIndex === -1 || rowOrderIndex === -1)
                            ? (isRowHeader ? 'activeRowHeaderCell' : 'activeHeaderCell') : false,
                        val,
                        f = self.formatters[header.type || 'string'],
                        orderByArrowSize = 0,
                        treeArrowSize = 0,
                        cellWidth = self.sizes.columns[isRowHeader ? 'cornerCell' : header[self.uniqueId]] || header.width,
                        ev = {
                            value: d[header.name],
                            row: d,
                            header: header
                        };
                    if (cellStyle === 'headerCellCap') {
                        cellWidth = w - x;
                    }
                    // if no data or schema are defined, a width is provided to the stub column
                    if (cellWidth === undefined) {
                        cellWidth = self.style.columnWidth;
                    }
                    if (x + cellWidth + borderWidth < 0) {
                        x += cellWidth + borderWidth;
                    }
                    if (active) {
                        cellStyle = 'activeCell';
                    }
                    if (self.visibleRows.indexOf(rowIndex) === -1 && !isHeader) {
                        self.visibleRows.push(rowIndex);
                    }
                    val = self.dispatchEvent('formatcellvalue', ev);
                    if (!self.dispatchEvent('beforerendercell', ev)) {
                        cx = x;
                        cy = y;
                        if (cellStyle === 'cornerCell') {
                            cx = 0;
                            cy = 0;
                        } else if (isRowHeader) {
                            cx = 0;
                        } else if (isHeader) {
                            cy = 0;
                        }
                        cell = {
                            type: isGrid ? 'canvas-datagrid-cell' : header.type,
                            style: cellStyle,
                            nodeType: 'canvas-datagrid-cell',
                            x: cx,
                            y: cy,
                            horizontalAlignment: self.style[cellStyle + 'HorizontalAlignment'],
                            verticalAlignment: self.style[cellStyle + 'VerticalAlignment'],
                            offsetTop: self.canvasOffsetTop,
                            offsetLeft: self.canvasOffsetLeft,
                            scrollTop: self.scrollBox.scrollTop,
                            scrollLeft: self.scrollBox.scrollLeft,
                            active: active || activeHeader,
                            hovered: hovered,
                            selected: selected,
                            width: cellWidth,
                            height: cellHeight,
                            offsetWidth: cellWidth,
                            offsetHeight: cellHeight,
                            parentNode: self.intf.parentNode,
                            offsetParent: self.intf.parentNode,
                            data: d,
                            isCorner: isCorner,
                            isHeader: isHeader,
                            isRowHeader: isRowHeader,
                            rowOpen: rowOpen,
                            header: header,
                            columnIndex: columnOrderIndex,
                            rowIndex: rowOrderIndex,
                            sortColumnIndex: headerIndex,
                            sortRowIndex: rowIndex,
                            isGrid: isGrid,
                            gridId: (self.attributes.name || '') + d[self.uniqueId] + ':' + header[self.uniqueId].name,
                            parentGrid: self.intf,
                            innerHTML: '',
                            activeHeader: activeHeader,
                            value: isHeader
                                ? (header.title || header.name) : d[header.name]
                        };
                        ev.cell = cell;
                        cell.userHeight = cell.isHeader ? self.sizes.rows[-1] : rowHeight;
                        cell.userWidth = cell.isHeader ? self.sizes.columns.cornerCell : self.sizes.columns[header[self.uniqueId]];
                        cell[self.uniqueId] = d[self.uniqueId];
                        self.visibleCells.unshift(cell);
                        self.ctx.fillStyle = self.style[cellStyle + 'BackgroundColor'];
                        self.ctx.strokeStyle = self.style[cellStyle + 'BorderColor'];
                        self.ctx.lineWidth = self.style[cellStyle + 'BorderWidth'];
                        if (hovered) {
                            self.ctx.fillStyle = self.style[cellStyle + 'HoverBackgroundColor'];
                            self.ctx.strokeStyle = self.style[cellStyle + 'HoverBorderColor'];
                        }
                        if (selected) {
                            self.ctx.fillStyle = self.style[cellStyle + 'SelectedBackgroundColor'];
                            self.ctx.strokeStyle = self.style[cellStyle + 'SelectedBorderColor'];
                        }
                        if (activeHeader) {
                            self.ctx.fillStyle = self.style[activeHeader + 'BackgroundColor'];
                        }
                        self.dispatchEvent('rendercell', ev);
                        if (cell.isGrid) {
                            if (cell.height !== rowHeight) {
                                cell.height = rowHeight || self.style.cellHeightWithChildGrid;
                                checkScrollHeight = true;
                            }
                            cell.width = self.sizes.columns[header[self.uniqueId]] || self.style.cellWidthWithChildGrid;
                        }
                        if (rowOpen && !cell.isRowHeader) {
                            cell.height = self.sizes.rows[rd[self.uniqueId]] || self.style.cellHeight;
                        }
                        if (!cell.isGrid) {
                            fillRect(cx, cy, cell.width, cell.height);
                            strokeRect(cx, cy, cell.width, cell.height);
                        }
                        self.ctx.save();
                        radiusRect(cell.x, cell.y, cell.width, cell.height, 0);
                        self.ctx.clip();
                        self.dispatchEvent('afterrendercell', ev);
                        if (cell.height !== cellHeight && !(rowOpen && !cell.isRowHeader)) {
                            self.sizes.rows[isHeader ? -1 : d[self.uniqueId]] = cell.height;
                            checkScrollHeight = true;
                        }
                        if (cell.width !== cellWidth) {
                            self.sizes.columns[header[self.uniqueId]] = cell.width;
                            checkScrollHeight = true;
                        }
                        if (isRowHeader && self.attributes.tree) {
                            if (!self.dispatchEvent('rendertreearrow', ev)) {
                                treeArrowSize = drawTreeArrow(cell, self.style[cellStyle + 'PaddingLeft'], cy, 0);
                            }
                        }
                        if ((self.attributes.showRowNumbers && isRowHeader)
                                || !isRowHeader) {
                            if (cell.isGrid) {
                                if (!self.childGrids[cell.gridId]) {
                                    childGridAttributes = self.args.childGridAttributes || self.args;
                                    childGridAttributes.name = self.attributes.saveAppearance ? cell.gridId : undefined;
                                    childGridAttributes.parentNode = cell;
                                    childGridAttributes.data = d[header.name];
                                    self.childGrids[cell.gridId] = self.createGrid(childGridAttributes);
                                    checkScrollHeight = true;
                                }
                                cell.grid = self.childGrids[cell.gridId];
                                cell.grid.parentNode = cell;
                                cell.grid.visible = true;
                                cell.grid.draw();
                                self.dispatchEvent('rendercellgrid', ev);
                            } else {
                                if (self.childGrids[cell.gridId]) {
                                    self.childGrids[cell.gridId].parentNode.offsetHeight = 0;
                                }
                                if (isHeader && self.orderBy === header.name) {
                                    if (!self.dispatchEvent('renderorderbyarrow', ev)) {
                                        orderByArrowSize = drawOrderByArrow(cx + self.style[cellStyle + 'PaddingLeft'], 0);
                                    }
                                }
                                self.ctx.fillStyle = self.style[cellStyle + 'Color'];
                                if (hovered) {
                                    self.ctx.fillStyle = self.style[cellStyle + 'HoverColor'];
                                }
                                if (selected) {
                                    self.ctx.fillStyle = self.style[cellStyle + 'SelectedColor'];
                                }
                                if (activeHeader) {
                                    self.ctx.fillStyle = self.style[activeHeader + 'Color'];
                                }
                                self.ctx.font = self.style[cellStyle + 'Font'];
                                cell.fontHeight = self.style[cellStyle + 'FontHeight'];
                                cell.treeArrowWidth = treeArrowSize;
                                cell.orderByArrowWidth = orderByArrowSize;
                                val = val !== undefined ? val : f
                                    ? f(self.ctx, cell) : '';
                                if (val === undefined && !f) {
                                    val = '';
                                    console.warn('canvas-datagrid: Unknown format '
                                        + header.type + ' add a cellFormater');
                                }
                                cell.formattedValue = ((val !== undefined && val !== null) ? val : '').toString();
                                if (self.columnFilters && self.columnFilters[val] !== undefined && isHeader) {
                                    val = self.style.filterTextPrefix + val;
                                }
                                if (!self.dispatchEvent('rendertext', ev)) {
                                    if (cell.innerHTML || header.type === 'html') {
                                        drawHtml(cell);
                                    } else {
                                        drawText(cell);
                                    }
                                }
                            }
                        }
                        if (active) {
                            aCell = cell;
                        }
                        if (selected && !isRowHeader) {
                            if ((!self.selections[cell.rowIndex - 1]
                                    || self.selections[cell.rowIndex - 1].indexOf(cell.columnIndex) === -1
                                    || cell.rowIndex === 0)
                                    && !cell.isHeader) {
                                selectionBorders.push([cell, 't']);
                            }
                            if (!self.selections[cell.rowIndex + 1]
                                    || self.selections[cell.rowIndex + 1].indexOf(cell.columnIndex) === -1) {
                                selectionBorders.push([cell, 'b']);
                            }
                            if (!self.selections[cell.rowIndex] || cell.columnIndex === 0
                                    || self.selections[cell.rowIndex].indexOf(cell.columnIndex - 1) === -1) {
                                selectionBorders.push([cell, 'l']);
                            }
                        } else if (self.selections[cell.rowIndex]
                                && self.selections[cell.rowIndex].indexOf(cell.columnIndex - 1) !== -1) {
                            selectionBorders.push([cell, 'l']);
                        }
                        self.ctx.restore();
                        x += cell.width + borderWidth;
                        return cell.width;
                    }
                };
            }
            function drawRowHeader(rowData, index, rowOrderIndex) {
                var a;
                if (self.attributes.showRowHeaders) {
                    x = 0;
                    rowHeaderCell = {'rowHeaderCell': index + 1 };
                    rowHeaderCell[self.uniqueId] = rowData[self.uniqueId];
                    a = {
                        name: 'rowHeaderCell',
                        width: self.style.headerRowWidth,
                        style: 'rowHeaderCell',
                        type: 'string',
                        data: rowData[self.uniqueId],
                        index: -1
                    };
                    a[self.uniqueId] = rowData[self.uniqueId];
                    rowOpen = self.openChildren[rowData[self.uniqueId]];
                    drawCell(rowHeaderCell, index, rowOrderIndex)(a, -1, -1);
                }
            }
            function drawHeaders() {
                var d, g = s.length, i, o, headerCell, header;
                rowHeaders.forEach(function (rArgs) {
                    y = rArgs[3];
                    cellHeight = rArgs[4];
                    drawRowHeader(rArgs[0], rArgs[1], rArgs[2]);
                });
                if (self.attributes.showColumnHeaders) {
                    x = (self.scrollBox.scrollLeft * -1) + self.scrollPixelLeft;
                    if (self.attributes.showRowHeaders) {
                        x += headerCellWidth;
                    }
                    y = 0;
                    // cell height might have changed during drawing
                    cellHeight = self.getHeaderCellHeight();
                    for (o = self.scrollIndexLeft; o < g; o += 1) {
                        i = self.orders.columns[o];
                        header = s[i];
                        d = {
                            title: header.title,
                            name: header.name,
                            width: header.width,
                            style: 'headerCell',
                            type: 'string',
                            index: o,
                            order: i
                        };
                        headerCell = {'headerCell': header.title || header.name};
                        headerCell[self.uniqueId] = 'h' + header[self.uniqueId];
                        d[self.uniqueId] = header[self.uniqueId];
                        x += drawCell(headerCell, -1, -1)(d, o, i);
                        if (x > self.width + self.scrollBox.scrollLeft) {
                            break;
                        }
                    }
                    // fill in the space right of the headers
                    if (x < w) {
                        c = {
                            name: '',
                            width: self.style.scrollBarWidth,
                            style: 'headerCellCap',
                            type: 'string',
                            index: s.length
                        };
                        c[self.uniqueId] = 'headerCell';
                        drawCell({endCap: ''}, -1, -1)(c, -1, -1);
                    }
                    // fill in the space left of the headers
                    if (self.attributes.showRowHeaders) {
                        cornerCell = {'cornerCell': '' };
                        cornerCell[self.uniqueId] = 'cornerCell';
                        x = 0;
                        c = {
                            name: 'cornerCell',
                            width: self.style.headerRowWidth,
                            style: 'cornerCell',
                            type: 'string',
                            index: -1
                        };
                        c[self.uniqueId] = 'cornerCell';
                        drawCell(cornerCell, -1, -1)(c, -1, -1);
                    }
                }
            }
            function drawRow(r, d) {
                var i, treeHeight, rowSansTreeHeight, o, g = s.length;
                if (y - (cellHeight * 2) > h) {
                    return false;
                }
                rd = self.data[r];
                rowOpen = self.openChildren[rd[self.uniqueId]];
                rowSansTreeHeight = self.sizes.rows[rd[self.uniqueId]] || self.style.cellHeight;
                treeHeight = (rowOpen ? self.sizes.trees[rd[self.uniqueId]] : 0);
                rowHeight = rowSansTreeHeight + treeHeight;
                if (y < rowHeight * -1) {
                    return false;
                }
                if (self.attributes.showRowHeaders) {
                    x += headerCellWidth;
                }
                cellHeight = rowHeight;
                for (o = self.scrollIndexLeft; o < g; o += 1) {
                    i = self.orders.columns[o];
                    x += drawCell(rd, r, d)(s[i], i, o);
                    if (x > self.width) {
                        break;
                    }
                }
                // cell height might have changed during drawing
                cellHeight = rowHeight;
                x = (self.scrollBox.scrollLeft * -1) + self.scrollPixelLeft;
                // don't draw a tree for the new row
                treeGrid = self.childGrids[rd[self.uniqueId]];
                if (r !== self.data.length && rowOpen) {
                    treeGrid.visible = true;
                    treeGrid.parentNode = {
                        offsetTop: y + rowSansTreeHeight + self.canvasOffsetTop,
                        offsetLeft: headerCellWidth - 1 + self.canvasOffsetLeft,
                        offsetHeight: treeHeight,
                        offsetWidth: self.width - headerCellWidth - self.style.scrollBarWidth - 1,
                        offsetParent: self.intf.parentNode,
                        parentNode: self.intf.parentNode,
                        style: self.style,
                        nodeType: 'canvas-datagrid-tree',
                        scrollTop: self.scrollBox.scrollTop,
                        scrollLeft: self.scrollBox.scrollLeft,
                        rowIndex: r
                    };
                    self.visibleCells.unshift({
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
                    delete self.sizes.trees[rd[self.uniqueId]];
                }
                rowHeaders.push([rd, r, d, y, rowHeight]);
                y += cellHeight + borderWidth;
                return true;
            }
            function initDraw() {
                borderWidth = self.style.cellBorderWidth;
                self.visibleRows = [];
                s = self.getVisibleSchema();
                self.visibleCells = [];
                self.canvasOffsetTop = self.isChildGrid ? self.parentNode.offsetTop : 0;
                self.canvasOffsetLeft = self.isChildGrid ? self.parentNode.offsetLeft : 0;
                h = self.height;
                w = self.width;
                if (!self.isChildGrid) {
                    self.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
                }
            }
            function drawBackground() {
                radiusRect(0, 0, w, h, 0);
                self.ctx.clip();
                self.ctx.fillStyle = self.style.backgroundColor;
                fillRect(0, 0, w, h);
            }
            function drawRows() {
                var o, n, i, g = s.length;
                x = (self.scrollBox.scrollLeft * -1) + self.scrollPixelLeft;
                y = (self.scrollBox.scrollTop * -1) + headerCellHeight + self.scrollPixelTop;
                for (r = self.scrollIndexTop; r < l; r += 1) {
                    n = self.orders.rows[r];
                    if (!drawRow(n, r)) {
                        break;
                    }
                }
                if (self.attributes.showNewRow) {
                    if (self.attributes.showRowHeaders) {
                        x += headerCellWidth;
                    }
                    rowHeight = cellHeight = self.style.cellHeight;
                    rowOpen = false;
                    for (o = self.scrollIndexLeft; o < g; o += 1) {
                        i = self.orders.columns[o];
                        x += drawCell(self.newRow, self.data.length, self.data.length)(s[i], i, o);
                        if (x > self.width + self.scrollBox.scrollLeft) {
                            break;
                        }
                    }
                    rowHeaders.push([self.newRow, self.data.length, self.data.length, y, rowHeight]);
                }
            }
            function drawReorderMarkers() {
                if (!self.reorderObject) { return; }
                var b = {
                        height: self.reorderObject.height,
                        width: self.reorderObject.width,
                        x: self.reorderObject.x + self.reorderObject.dragOffset.x,
                        y: self.reorderObject.y + self.reorderObject.dragOffset.y
                    },
                    m = {
                        width: w,
                        heigth: h,
                        x: 0,
                        y: 0
                    };
                self.ctx.fillStyle = self.style.reorderMarkerBackgroundColor;
                self.ctx.lineWidth = self.style.reorderMarkerBorderWidth;
                self.ctx.strokeStyle = self.style.reorderMarkerBorderColor;
                if (self.dragMode === 'row-reorder') {
                    b.width = w;
                    b.x = 0;
                    m.width = w;
                    m.y = self.currentCell.y;
                    fillRect(b.x, b.y, b.width, b.height);
                    strokeRect(b.x, b.y, b.width, b.height);
                    self.ctx.lineWidth = self.style.reorderMarkerIndexBorderWidth;
                    self.ctx.strokeStyle = self.style.reorderMarkerIndexBorderColor;
                    if (self.currentCell.rowIndex !== self.reorderObject.rowIndex
                            && self.currentCell.rowIndex - 1 !== self.reorderObject.rowIndex) {
                        addBorderLine(m, 't');
                    }
                } else if (self.dragMode === 'column-reorder' && self.reorderObject) {
                    b.height = h;
                    b.y = 0;
                    m.height = h;
                    m.x = self.currentCell.x;
                    fillRect(b.x, b.y, b.width, b.height);
                    strokeRect(b.x, b.y, b.width, b.height);
                    self.ctx.lineWidth = self.style.reorderMarkerIndexBorderWidth;
                    self.ctx.strokeStyle = self.style.reorderMarkerIndexBorderColor;
                    if (self.currentCell.columnIndex !== self.reorderObject.columnIndex
                            && self.currentCell.columnIndex - 1 !== self.reorderObject.columnIndex) {
                        addBorderLine(m, 'l');
                    }
                }
            }
            function drawBorder() {
                self.ctx.lineWidth = self.style.gridBorderWidth;
                self.ctx.strokeStyle = self.style.gridBorderColor;
                strokeRect(0, 0, self.width, self.height);
            }
            function drawSelectionBorders() {
                self.ctx.lineWidth = self.style.selectionOverlayBorderWidth;
                self.ctx.strokeStyle = self.style.selectionOverlayBorderColor;
                selectionBorders.forEach(function (c) {
                    addBorderLine(c[0], c[1]);
                });
            }
            function drawActiveCell() {
                if (!aCell) { return; }
                if (self.attributes.rowSelectionMode) {
                    if (self.activeCell && self.activeCell.rowIndex === aCell.rowIndex) {
                        self.ctx.lineWidth = self.style.activeCellOverlayBorderWidth;
                        self.ctx.strokeStyle = self.style.activeCellOverlayBorderColor;
                        strokeRect(0, aCell.y, self.getHeaderWidth() + headerCellWidth, rowHeight);
                    }
                } else {
                    self.ctx.lineWidth = self.style.activeCellOverlayBorderWidth;
                    self.ctx.strokeStyle = self.style.activeCellOverlayBorderColor;
                    strokeRect(aCell.x, aCell.y, aCell.width, aCell.height);
                }

            }
            function drawDebug() {
                perfCounters[drawCount % perfWindowSize] = performance.now() - p;
                var d;
                if (self.attributes.debug) {
                    self.ctx.font = '11px sans-serif';
                    d = {};
                    d.perf = (perfCounters.reduce(function (a, b) {
                        return a + b;
                    }, 0) / perfCounters.length).toFixed(1)
                        + 'ms (' +
                        perfCounters.map(function (a) { return a.toFixed(1); }).join(', ') + ')';
                    d.htmlImages = Object.keys(self.htmlImageCache).length;
                    d.scrollLeft = self.scrollBox.scrollLeft;
                    d.scrollTop = self.scrollBox.scrollTop;
                    d.scrollIndexTop = self.scrollIndexTop;
                    d.scrollPixelTop = self.scrollPixelTop;
                    d.scrollIndexLeft = self.scrollIndexLeft;
                    d.scrollPixelLeft = self.scrollPixelLeft;
                    d.canvasOffsetLeft = self.canvasOffsetLeft;
                    d.canvasOffsetTop = self.canvasOffsetTop;
                    d.width = self.width;
                    d.height = self.height;
                    d.mousex = self.mouse.x;
                    d.mousey = self.mouse.y;
                    d.touchx = !self.touchStart ? 0 : self.touchStart.x;
                    d.touchy = !self.touchStart ? 0 : self.touchStart.y;
                    d.entities = self.visibleCells.length;
                    d.hasFocus = self.hasFocus;
                    d.dragMode = self.dragMode;
                    if (self.currentCell) {
                        d.columnIndex = self.currentCell.columnIndex;
                        d.rowIndex = self.currentCell.rowIndex;
                        d.sortColumnIndex = self.currentCell.sortColumnIndex;
                        d.sortRowIndex = self.currentCell.sortRowIndex;
                        d.context = self.currentCell.context;
                        d.dragContext = self.currentCell.dragContext;
                        d.style = self.currentCell.style;
                        d.type = self.currentCell.type;
                    }
                    self.ctx.save();
                    Object.keys(d).forEach(function (key, index) {
                        var m = key + ': ' + d[key],
                            lh = 14;
                        self.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        fillRect(headerCellWidth, lh + (index * lh), 100, lh);
                        self.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
                        fillText(m, headerCellWidth + 1, headerCellHeight + (index * lh));
                    });
                    self.ctx.restore();
                }
            }
            self.ctx.save();
            initDraw();
            drawBackground();
            drawRows();
            drawSelectionBorders();
            drawHeaders();
            drawActiveCell();
            drawReorderMarkers();
            drawScrollBars();
            if (checkScrollHeight) {
                self.resize(true);
            }
            drawBorder();
            drawDebug();
            self.ctx.restore();
        };
    };
});
