/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([
    './draw',
    './events',
    './intf',
    './contextMenu',
    './defaults'
], function context(drawModule, eventsModule, intfModule, contextMenuModule, defaults) {
    'use strict';
    function grid(args) {
        args = args || {};
        var self = {};
        drawModule(self);
        eventsModule(self);
        intfModule(self);
        contextMenuModule(self);
        self.orders = {
            rows: [],
            columns: []
        };
        self.hasFocus = false;
        self.activeCell = {
            columnIndex: 0,
            rowIndex: 0
        };
        self.storageName = 'canvasDataGrid';
        self.invalidSearchExpClass = 'canvas-datagrid-invalid-search-regExp';
        self.uniqueId = '_canvasDataGridUniqueId';
        self.orderBy = self.uniqueId;
        self.orderDirection = 'asc';
        self.columnFilters = {};
        self.filters = {};
        self.ellipsisCache = {};
        self.scrollBox = {};
        self.visibleRows = [];
        self.sizes = {
            rows: {},
            columns: {},
            trees: {}
        };
        self.currentFilter = function () { return true; };
        self.selections = [];
        self.hovers = {};
        self.attributes = {};
        self.style = {};
        self.intf = {};
        self.formatters = {};
        self.sorters = {};
        self.schemaHashes = {};
        self.events = {};
        self.uId = 0;
        self.changes = [];
        self.scrollIndexTop = 0;
        self.scrollPixelTop = 0;
        self.scrollIndexLeft = 0;
        self.scrollPixelLeft = 0;
        self.childGrids = {};
        self.openChildren = {};
        self.scrollModes = [
            'vertical-scroll-box',
            'vertical-scroll-top',
            'vertical-scroll-bottom',
            'horizontal-scroll-box',
            'horizontal-scroll-right',
            'horizontal-scroll-left'
        ];
        self.mouse = { x: 0, y: 0};
        self.data = undefined;
        self.observer = undefined;
        self.reorderObject = undefined;
        self.reorderTarget = undefined;
        self.parentNode = undefined;
        self.eventParent = undefined;
        self.parentDOMNode = undefined;
        self.isChildGrid = undefined;
        self.input = undefined;
        self.contextMenu = undefined;
        self.controlInput = undefined;
        self.currentCell = undefined;
        self.storedSettings = undefined;
        self.invalidFilterRegEx = undefined;
        self.canvas = undefined;
        self.height = undefined;
        self.width = undefined;
        self.selecting = undefined;
        self.schema = undefined;
        self.ctx = undefined;
        self.visibleCells = undefined;
        self.selectionBounds = undefined;
        self.dragAddToSelection = undefined;
        self.dragStartObject = undefined;
        self.dragItem = undefined;
        self.draggingItem = undefined;
        self.resizingStartingWidth = undefined;
        self.resizingStartingHeight = undefined;
        self.dragMode = undefined;
        self.ignoreNextClick = undefined;
        self.tempSchema = undefined;
        self.originalData = undefined;
        self.newRow = undefined;
        self.parentGrid = undefined;
        self.scrollMode = undefined;
        self.scrollStartMode = undefined;
        self.page = undefined;
        self.scrollTimer = undefined;
        self.dragStart = undefined;
        self.scrollStart = undefined;
        self.canvasOffsetTop = undefined;
        self.canvasOffsetLeft = undefined;
        self.cellBoundaryCrossed = undefined;
        self.scrollEdit = undefined;
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
        function position(e, ignoreScrollOffset) {
            var x = 0, y = 0, s = e, h, w;
            while (e.offsetParent) {
                x += e.offsetLeft;
                y += e.offsetTop;
                h = e.offsetHeight;
                w = e.offsetWidth;
                e = e.offsetParent;
            }
            if (ignoreScrollOffset) {
                return {left: x, top: y, height: h, width: w};
            }
            e = s;
            s = scrollOffset(e);
            return { left: x + s.left, top: y + s.top, height: h, width: w };
        }
        function getLayerPos(e) {
            var rect = self.canvas.getBoundingClientRect(),
                pos = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            if (self.isChildGrid) {
                pos.x -= self.canvasOffsetLeft;
                pos.y -= self.canvasOffsetTop;
            }
            return {
                x: pos.x,
                y: pos.y
            };
        }
        function fillArray(low, high, step) {
            step = step || 1;
            var i = [], x;
            for (x = low; x <= high; x += step) {
                i[x] = x;
            }
            return i;
        }
        self.getHeaderCellHeight = function () {
            return self.sizes.rows[-1] || self.style.headerCellHeight;
        };
        self.getHeaderCellWidth = function () {
            return self.attributes.showRowHeaders
                ? (self.sizes.columns.cornerCell ||  self.style.headerRowWidth) : 0;
        };
        function stopPropagation(e) { e.stopPropagation(); }
        function setStorageData() {
            if (!self.attributes.saveAppearance) { return; }
            localStorage.setItem(self.storageName + '-' + self.attributes.name, JSON.stringify({
                sizes: {
                    rows: self.sizes.rows,
                    columns: self.sizes.columns
                },
                orders: {
                    rows: self.orders.rows,
                    columns: self.orders.columns
                },
                orderBy: self.orderBy,
                orderDirection: self.orderDirection
            }));
        }
        function getSchema() {
            return self.schema || self.tempSchema;
        }
        function createColumnOrders() {
            var s = getSchema();
            self.orders.columns = fillArray(0, s.length - 1);
        }
        self.createRowOrders = function () {
            self.orders.rows = fillArray(0, self.data.length - 1);
        };
        self.getVisibleSchema = function () {
            return getSchema().filter(function (col) { return !col.hidden; });
        };
        function createNewRowData() {
            self.newRow = {};
            self.newRow[self.uniqueId] = self.uId;
            self.uId += 1;
            getSchema().forEach(function forEachHeader(header, index) {
                var d = header.defaultValue || '';
                if (typeof d === 'function') {
                    d = d.apply(self.intf, [header, index]);
                }
                self.newRow[header.name] = d;
            });
        }
        self.addEllipsis = function (text, width) {
            var o, i, c = self.style.cellPaddingRight + self.style.cellPaddingLeft;
            if (self.ellipsisCache[text] && self.ellipsisCache[text][width]) {
                return self.ellipsisCache[text][width];
            }
            if (self.ctx.measureText(text).width + c < width) {
                o = text;
            } else {
                o = text.substring(0, 1);
                i = 1;
                while (width > (self.ctx.measureText(o).width + c)) {
                    i += 1;
                    o = text.substring(0, i) + "...";
                }
            }
            self.ellipsisCache[text] = self.ellipsisCache[text] || {};
            self.ellipsisCache[text][width] = o;
            return o;
        };
        function addEventListener(ev, fn) {
            self.events[ev] = self.events[ev] || [];
            self.events[ev].unshift(fn);
        }
        function removeEventListener(ev, fn) {
            (self.events[ev] || []).forEach(function removeEachListener(sfn, idx) {
                if (fn === sfn) {
                    self.events[ev].splice(idx, 1);
                }
            });
        }
        self.dispatchEvent = function (ev, args, context) {
            args = args || {};
            context = context || self.intf;
            var defaultPrevented;
            function preventDefault() {
                defaultPrevented = true;
            }
            if (!self.events[ev]) { return; }
            self.events[ev].forEach(function dispatchEachEvent(fn) {
                args[0].preventDefault = preventDefault;
                fn.apply(context, args);
            });
            return defaultPrevented;
        };
        self.formatters.string = function cellFormatterString(ctx, cell) {
            return cell.value !== undefined ? cell.value : '';
        };
        self.formatters.rowHeaderCell = self.formatters.string;
        self.formatters.headerCell = self.formatters.string;
        self.formatters.number = self.formatters.string;
        self.formatters.int = self.formatters.string;
        function getSchemaNameHash(key) {
            var n = 0;
            while (self.schemaHashes[key]) {
                n += 1;
                key = key + n;
            }
            return key;
        }
        function filter(type) {
            var f = self.filters[type];
            if (!f && type !== undefined) {
                console.warn('Cannot find filter for type %s, falling back to substring match.', type);
                f = self.filters.string;
            }
            return f;
        }
        function getBestGuessDataType(columnName) {
            var t, x, l = self.data.length;
            for (x = 0; x < l; x += 1) {
                if ([null, undefined].indexOf(self.data[x][columnName]) !== -1) {
                    t = typeof self.data[x];
                    return t === 'object' ? 'string' : t;
                }
            }
            return 'string';
        }
        /**
         * Returns an auto generated schema based on data structure.
         * @memberof canvasDataGrid#
         * @method
         * @tutorial schema
         * @returns {schema} schema A schema based on the first item in the data array.
         */
        function getSchemaFromData() {
            return Object.keys(self.data[0] || {' ': ''}).map(function mapEachSchemaColumn(key, index) {
                var type = getBestGuessDataType(key),
                    i = {
                        name: key,
                        title: key,
                        width: self.style.columnWidth,
                        index: index,
                        type: type,
                        filter: filter(type)
                    };
                if (key === self.uniqueId) {
                    i.hidden = true;
                }
                i[self.uniqueId] = getSchemaNameHash(key);
                return i;
            });
        }
        function getSelectedData(expandToRow) {
            var d = [], s = getSchema(), l = self.data.length;
            self.selections.forEach(function (row, index) {
                if (index === l) { return; }
                d[index] = {};
                if (expandToRow) {
                    s.forEach(function (column) {
                        d[index][column.name] = self.data[index][column.name];
                    });
                } else {
                    row.forEach(function (col) {
                        if (col === -1) { return; }
                        d[index][s[col].name] = self.data[index][s[col].name];
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
            self.changes = [];
        }
        /**
         * Selects an area of the grid.
         * @memberof canvasDataGrid#
         * @method
         * @param {rect} bounds A rect object representing the selected values.
         */
        function selectArea(bounds, ctrl) {
            self.selectionBounds = bounds || self.selectionBounds;
            var x, y, s = getSchema();
            if (!ctrl) {
                self.selections = [];
            }
            if (self.selectionBounds.top < -1
                    || self.selectionBounds.bottom > self.data.length
                    || self.selectionBounds.left < -1
                    || self.selectionBounds.right > s.length) {
                throw new Error('Impossible selection area');
            }
            for (x = self.selectionBounds.top; x <= self.selectionBounds.bottom; x += 1) {
                self.selections[x] = [];
                for (y = self.selectionBounds.left; y <= self.selectionBounds.right; y += 1) {
                    if (self.selections[x].indexOf(y) === -1) {
                        self.selections[x].push(y);
                    }
                }
            }
            self.dispatchEvent('selectionchanged', [getSelectedData(), self.selections, self.selectionBounds], self.intf);
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
                self.ctx.font = self.style.rowHeaderCellFont;
                return self.ctx.measureText((self.data.length + (self.attributes.showNewRow ? 1 : 0)).toString()).width
                    + self.style.autosizePadding + self.style.autosizeHeaderCellPadding
                    + self.style.rowHeaderCellPaddingRight
                    + self.style.rowHeaderCellPaddingLeft
                    + (self.attributes.tree ? self.style.treeArrowWidth
                        + self.style.treeArrowMarginLeft + self.style.treeArrowMarginRight : 0);
            }
            getSchema().forEach(function (col) {
                if (col.name !== name) { return; }
                self.ctx.font = self.style.headerCellFont;
                var t = self.ctx.measureText(col.title || col.name).width
                    + self.style.headerCellPaddingRight
                    + self.style.headerCellPaddingLeft;
                m = t > m ? t : m;
            });
            self.data.forEach(function (row) {
                self.ctx.font = self.style.cellFont;
                var t = self.ctx.measureText(row[name]).width
                    + self.style.cellPaddingRight
                    + self.style.cellPaddingLeft + self.style.cellAutoResizePadding;
                m = t > m ? t : m;
            });
            return m;
        }

        /**
         * Gets the total width of all header columns.
         * @memberof canvasDataGrid#
         * @method
         */
        function getHeaderWidth() {
            return self.getVisibleSchema().reduce(function (total, header) {
                return total + header.width;
            }, 0);
        }

        function drawChildGrids() {
            Object.keys(self.childGrids).forEach(function (gridKey) {
                self.childGrids[gridKey].draw();
            });
        }
        function resizeChildGrids() {
            Object.keys(self.childGrids).forEach(function (gridKey) {
                self.childGrids[gridKey].resize();
            });
        }
        function resize(drawAfterResize) {
            var cellBorder = self.style.cellBorderWidth * 2,
                headerCellBorder =  self.style.headerCellBorderWidth * 2,
                scrollHeight,
                scrollWidth,
                headerCellHeight = self.getHeaderCellHeight(),
                headerCellWidth = self.getHeaderCellWidth(),
                // TODO: What the hell are these numbers!?  They are probably some value in the style.
                scrollDragPositionOffsetY = 30,
                scrollDragPositionOffsetX = 15;
            if (self.isChildGrid) {
                self.height = self.parentNode.offsetHeight;
                self.width = self.parentNode.offsetWidth;
            } else {
                self.height = self.parentDOMNode.offsetHeight - self.style.scrollBarBoxMargin;
                self.width = self.parentDOMNode.offsetWidth - self.style.scrollBarBoxMargin;
                self.parentNode = self.parentDOMNode;
                self.canvas.height = self.height * window.devicePixelRatio;
                self.canvas.width = self.width * window.devicePixelRatio;
                self.canvas.style.height = self.height + 'px';
                self.canvas.style.width = self.width + 'px';
                self.canvasOffsetTop = 0;
                self.canvasOffsetLeft = 0;
            }
            scrollHeight = self.data.reduce(function reduceData(accumulator, row) {
                return accumulator
                    + (self.sizes.rows[row[self.uniqueId]] || self.style.cellHeight)
                    + (self.sizes.trees[row[self.uniqueId]] || 0)
                    + cellBorder;
            }, 0) || 0;
            scrollWidth = self.getVisibleSchema().reduce(function reduceSchema(accumulator, column) {
                if (column.hidden) { return accumulator; }
                return accumulator + (self.sizes.columns[column[self.uniqueId]] || column.width || self.style.columnWidth) + cellBorder;
            }, 0) || 0;
            if (self.attributes.showNewRow) {
                scrollHeight += self.style.cellHeight + cellBorder;
            }
            self.scrollBox.width = self.width - headerCellWidth;
            self.scrollBox.height = self.height - headerCellHeight - headerCellBorder;
            self.scrollBox.top = headerCellHeight + headerCellBorder;
            self.scrollBox.left = headerCellWidth;
            self.scrollBox.scrollHeight = scrollHeight + self.style.scrollBarWidth - self.scrollBox.height;
            self.scrollBox.scrollWidth = scrollWidth + self.style.scrollBarWidth - self.scrollBox.width;
            self.scrollBox.widthBoxRatio = ((self.scrollBox.width - scrollDragPositionOffsetX)
                / (self.scrollBox.scrollWidth + self.scrollBox.width - scrollDragPositionOffsetX));
            self.scrollBox.scrollBoxWidth = self.scrollBox.width
                * self.scrollBox.widthBoxRatio
                - self.style.scrollBarWidth;
            self.scrollBox.heightBoxRatio = ((self.scrollBox.height - scrollDragPositionOffsetY)
                / (self.scrollBox.scrollHeight + (self.scrollBox.height - scrollDragPositionOffsetY)));
            self.scrollBox.scrollBoxHeight = self.scrollBox.height
                * self.scrollBox.heightBoxRatio
                - self.style.scrollBarWidth;
            self.scrollBox.scrollBoxWidth = Math.max(self.scrollBox.scrollBoxWidth, self.style.scrollBarBoxMinSize);
            self.scrollBox.scrollBoxHeight = Math.max(self.scrollBox.scrollBoxHeight, self.style.scrollBarBoxMinSize);
            self.page = self.visibleRows.length - 3 - self.attributes.pageUpDownOverlap;
            if (drawAfterResize) {
                self.draw(true);
            }
            self.dispatchEvent('resize', [{}], self.intf);
            return true;
        }
        function getClippingRect(ele) {
            var boundingRect = position(self.parentNode),
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
                headerCellHeight = self.getHeaderCellHeight(),
                headerCellWidth = self.getHeaderCellWidth();
            clipRect.h = boundingRect.top + boundingRect.height - ele.offsetTop - self.style.scrollBarWidth;
            clipRect.w = boundingRect.left + boundingRect.width - ele.offsetLeft - self.style.scrollBarWidth;
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
            if (self.dragAddToSelection === false) {
                if (self.selections[rowIndex] && self.selections[rowIndex].length - 1 === s.length) {
                    if (ctrl) {
                        self.selections[rowIndex] = [];
                        return;
                    }
                }
            }
            if (self.dragAddToSelection === true) {
                self.selections[rowIndex] = [];
                self.selections[rowIndex].push(-1);
                s.forEach(function (col) {
                    self.selections[rowIndex].push(col.index);
                });
            }
            if (supressEvent) { return; }
            self.dispatchEvent('selectionchanged', [getSelectedData(), self.selections, self.selectionBounds], self.intf);
        }
        /**
         * Collapse a tree grid by row index.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} index The index of the row to collapse.
         */
        function collapseTree(rowIndex) {
            var rowId = self.data[rowIndex][self.uniqueId];
            self.dispatchEvent('collapsetree', [self.childGrids[rowId], self.data[rowIndex], rowIndex], self.intf);
            self.openChildren[rowId].blur();
            self.openChildren[rowId].dispose();
            delete self.openChildren[rowId];
            delete self.sizes.trees[rowId];
            delete self.childGrids[rowId];
            self.dispatchEvent('resizerow', [self.style.cellHeight], self.intf);
            resize(true);
            self.draw(true);
        }
        /**
         * Expands a tree grid by row index.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} index The index of the row to expand.
         */
        function expandTree(rowIndex) {
            var headerCellHeight = self.getHeaderCellHeight(),
                headerCellWidth = self.sizes.columns.cornerCell || self.style.headerRowWidth,
                rowId = self.data[rowIndex][self.uniqueId],
                h = self.sizes.trees[rowId] || self.style.treeGridHeight,
                treeGrid;
            if (!self.childGrids[rowId]) {
                treeGrid = grid({
                    debug: self.attributes.debug,
                    showPerformance: self.attributes.showPerformance,
                    name: self.attributes.saveAppearance
                        ? self.attributes.name + 'tree' + rowId : undefined,
                    parentNode: {
                        parentGrid: self.intf,
                        nodeType: 'canvas-datagrid-tree',
                        offsetHeight: h,
                        offsetWidth: self.width - headerCellWidth,
                        header: { width: self.width - headerCellWidth },
                        offsetLeft: headerCellWidth,
                        offsetTop: headerCellHeight,
                        offsetParent: self.intf.parentNode,
                        parentNode: self.intf.parentNode,
                        style: 'tree',
                        data: self.data[rowIndex]
                    }
                });
                self.childGrids[rowId] = treeGrid;
            }
            treeGrid = self.childGrids[rowId];
            treeGrid.visible = true;
            self.dispatchEvent('expandtree', [treeGrid, self.data[rowIndex], rowIndex], self.intf);
            self.openChildren[self.data[rowIndex][self.uniqueId]] = treeGrid;
            self.sizes.trees[self.data[rowIndex][self.uniqueId]] = h;
            self.dispatchEvent('resizerow', [self.style.cellHeight], self.intf);
            resize(true);
            self.draw();
        }
        /**
         * Toggles tree grid open and close by row index.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} index The index of the row to toggle.
         */
        function toggleTree(rowIndex) {
            var i = self.openChildren[self.data[rowIndex][self.uniqueId]];
            if (i) {
                return collapseTree(rowIndex);
            }
            expandTree(rowIndex);
        }
        function scroll(e) {
            var pos,
                s = self.getVisibleSchema(),
                cellBorder = self.style.cellBorderWidth * 2;
            self.scrollIndexTop = 0;
            self.scrollPixelTop = 0;
            self.scrollIndexLeft = 0;
            self.scrollPixelLeft = 0;
            while (self.scrollPixelTop < self.scrollBox.scrollTop && self.scrollIndexTop < self.data.length) {
                self.scrollPixelTop +=
                    (self.sizes.rows[self.data[self.scrollIndexTop][self.uniqueId]] || self.style.cellHeight)
                    + (self.sizes.trees[self.data[self.scrollIndexTop][self.uniqueId]] || 0)
                    + cellBorder;
                self.scrollIndexTop += 1;
            }
            while (self.scrollPixelLeft < self.scrollBox.scrollLeft && self.scrollIndexLeft < s.length) {
                self.scrollPixelLeft +=
                    (self.sizes.columns[s[self.scrollIndexLeft][self.uniqueId]] || s[self.scrollIndexLeft].width);
                self.scrollIndexLeft += 1;
            }
            if (self.data.length > 0) {
                self.scrollIndexLeft = Math.max(self.scrollIndexLeft - 1, 0);
                self.scrollPixelLeft = Math.max(self.scrollPixelLeft
                    - (self.sizes.columns[s[self.scrollIndexLeft][self.uniqueId]] || s[self.scrollIndexLeft].width), 0);
                self.scrollIndexTop = Math.max(self.scrollIndexTop - 1, 0);
                self.scrollPixelTop = Math.max(self.scrollPixelTop
                    - (self.sizes.rows[self.data[self.scrollIndexTop][self.uniqueId]] || self.style.cellHeight)
                    - (self.sizes.trees[self.data[self.scrollIndexTop][self.uniqueId]] || 0), 0);
            }
            self.ellipsisCache = {};
            self.draw(true);
            if (self.input) {
                pos = position(self.parentNode, true);
                self.input.style.top = pos.top + self.scrollEdit.inputTop
                    + (self.scrollEdit.scrollTop - self.scrollBox.scrollTop) + 'px';
                self.input.style.left = pos.left + self.scrollEdit.inputLeft
                    + (self.scrollEdit.scrollLeft - self.scrollBox.scrollLeft) + 'px';
                clipElement(self.input);
            }
            self.dispatchEvent('scroll', [{top: self.scrollBox.scrollTop, left: self.scrollBox.scrollLeft }], self.intf);
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
            self.sizes.columns[name === 'cornerCell' ? name : getHeaderByName(name)[self.uniqueId]]
                = findColumnMaxTextLength(name);
            resize();
            self.draw(true);
        }
        self.sorters.string = function (columnName, direction) {
            var asc = direction === 'asc';
            return function (a, b) {
                if (a[columnName] === undefined || a[columnName] === null) {
                    return 1;
                }
                if (b[columnName] === undefined || b[columnName] === null) {
                    return 0;
                }
                if (asc) {
                    if (!a[columnName].localeCompare) { return 1; }
                    return a[columnName].localeCompare(b[columnName]);
                }
                if (!b[columnName].localeCompare) { return 1; }
                return b[columnName].localeCompare(a[columnName]);
            };
        };
        self.sorters.number = function (columnName, direction) {
            var asc = direction === 'asc';
            return function (a, b) {
                if (asc) {
                    return a[columnName] - b[columnName];
                }
                return b[columnName] - a[columnName];
            };
        };
        self.sorters.date = function (columnName, direction) {
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
         * Checks if a cell is currently visible.
         * @memberof canvasDataGrid#
         * @method
         * @returns {boolean} when true, the cell is visible, when false the cell is not currently drawn.
         * @param {cell} cell The cell to check for.  Alternatively you can pass an object { x: <x-index>, y: <y-index> }.
         */
        function isCellVisible(cell) {
            var x, l = self.visibleCells.length;
            for (x = 0; x < l; x += 1) {
                if (cell.x === self.visibleCells[x].x && cell.y === self.visibleCells[x].y) {
                    return true;
                }
            }
            return false;
        }
        /**
         * Sets the order of the data.
         * @memberof canvasDataGrid#
         * @method
         * @returns {cell} cell at the selected location.
         * @param {number} columnName Number of pixels from the left.
         * @param {string} direction `asc` for ascending or `desc` for descending.
         * @param {bool} dontSetStorageData Don't store this setting for future use.
         */
        function order(columnName, direction, dontSetStorageData) {
            var f,
                c = getSchema().filter(function (col) {
                    return col.name === columnName;
                });
            self.orderBy = columnName;
            if (c.length === 0) {
                throw new Error('Cannot sort.  No such column name');
            }
            f = self.sorters[c[0].type];
            if (!f && c[0].type !== undefined) {
                console.warn('Cannot sort type "%s" falling back to string sort.', c[0].type);
            }
            self.data = self.data.sort(typeof f === 'function' ? f(columnName, direction) : self.sorters.string);
            self.dispatchEvent('ordercolumn', [columnName, direction], self.intf);
            self.draw(true);
            if (dontSetStorageData) { return; }
            setStorageData();
        }
        function isInGrid(e) {
            if (e.x < 0
                    || e.x > self.width
                    || e.y < 0
                    || e.y > self.height) {
                return false;
            }
            return true;
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
            var i, l = self.visibleCells.length, cell;
            if (!self.visibleCells || !self.visibleCells.length) { return; }
            self.hasFocus = true;
            if (!(y < self.height
                && y > 0
                && x < self.width
                && x > 0)) {
                self.hasFocus = false;
                return {
                    dragContext: 'inherit',
                    context: 'inherit'
                };
            }
            for (i = 0; i < l; i += 1) {
                cell = self.visibleCells[i];
                if (cell.x - self.style.cellBorderWidth < x
                        && cell.x + cell.width + self.style.cellBorderWidth > x
                        && cell.y - self.style.cellBorderWidth < y
                        && cell.y + cell.height + self.style.cellBorderWidth > y) {
                    if (/vertical-scroll-(bar|box)/.test(cell.style)) {
                        cell.dragContext = 'vertical-scroll-box';
                        cell.context = 'vertical-scroll-box';
                        if (y > self.scrollBox.box.v.y + self.scrollBox.scrollBoxHeight) {
                            cell.dragContext = 'vertical-scroll-bottom';
                            cell.context = 'vertical-scroll-bottom';
                        } else if (y < self.scrollBox.box.v.y) {
                            cell.dragContext = 'vertical-scroll-top';
                            cell.context = 'vertical-scroll-top';
                        }
                        self.canvas.style.cursor = 'default';
                        return cell;
                    }
                    if (/horizontal-scroll-(bar|box)/.test(cell.style)) {
                        cell.dragContext = 'horizontal-scroll-box';
                        cell.context = 'horizontal-scroll-box';
                        if (x > self.scrollBox.box.h.x + self.scrollBox.scrollBoxWidth) {
                            cell.dragContext = 'horizontal-scroll-right';
                            cell.context = 'horizontal-scroll-right';
                        } else if (x < self.scrollBox.box.h.x) {
                            cell.dragContext = 'horizontal-scroll-left';
                            cell.context = 'horizontal-scroll-left';
                        }
                        self.canvas.style.cursor = 'default';
                        return cell;
                    }
                    if (cell.x + cell.width - (self.attributes.borderResizeZone * 0.4) < x
                            && cell.x + cell.width + (self.attributes.borderResizeZone * 0.6) > x
                            && self.attributes.allowColumnResize
                            && ((self.attributes.allowColumnResizeFromCell && cell.style === 'cell')
                                || cell.style !== 'cell')
                            && ((self.attributes.allowRowHeaderResize
                                && ['rowHeaderCell', 'cornerCell'].indexOf(cell.style) !== -1)
                                || ['rowHeaderCell', 'cornerCell'].indexOf(cell.style) === -1)) {
                        cell.context = 'ew-resize';
                        cell.dragContext = 'ew-resize';
                        return cell;
                    }
                    if (cell.y + cell.height - (self.attributes.borderResizeZone * 0.4) < y
                            && cell.y + cell.height + (self.attributes.borderResizeZone * 0.6) > y
                            && self.attributes.allowRowResize
                            && ((self.attributes.allowRowResizeFromCell && cell.style === 'cell')
                                || cell.style !== 'cell')
                            && cell.style !== 'headerCell') {
                        cell.context = 'ns-resize';
                        cell.dragContext = 'ns-resize';
                        return cell;
                    }
                    if (cell.style === 'headerCell') {
                        cell.context = 'cell';
                        cell.dragContext = 'column-reorder';
                        return cell;
                    }
                    if (cell.style === 'rowHeaderCell') {
                        cell.context = 'cell';
                        cell.dragContext = 'row-reorder';
                        return cell;
                    }
                    if (cell.isGrid) {
                        self.hasFocus = false;
                        cell.dragContext = 'cell-grid';
                        cell.context = 'cell-grid';
                        return cell;
                    }
                    if (cell.style === 'tree-grid') {
                        self.hasFocus = false;
                        cell.dragContext = 'tree';
                        cell.context = 'tree';
                        return cell;
                    }
                    cell.dragContext = 'cell';
                    cell.context = 'cell';
                    return cell;
                }
            }
            self.hasFocus = false;
            return {
                context: 'inherit'
            };
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
            self.data.forEach(function (row, rowIndex) {
                var maxCol, minCol;
                if (self.selections[rowIndex] && self.selections[rowIndex].length) {
                    low.y = rowIndex < low.y ? rowIndex : low.y;
                    high.y = rowIndex > high.y ? rowIndex : high.y;
                    maxCol = Math.max.apply(null, self.selections[rowIndex]);
                    minCol = Math.min.apply(null, self.selections[rowIndex]);
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
        function mousemove(e) {
            if (self.contextMenu || self.input) {
                return;
            }
            self.mouse = getLayerPos(e);
            var ctrl = (e.controlKey || e.metaKey || self.attributes.persistantSelectionMode),
                i,
                s = getSchema(),
                dragBounds,
                sBounds,
                x = self.mouse.x,
                y = self.mouse.y,
                o,
                delta;
            clearTimeout(self.scrollTimer);
            if (self.dispatchEvent('mousemove', [e, o], self.intf)) {
                return;
            }
            if (!isInGrid({x: x, y: y})) {
                self.hasFocus = false;
            }
            o = getCellAt(x, y);
            if (o && self.currentCell && (self.currentCell.rowIndex !== o.rowIndex
                    || self.currentCell.columnIndex !== o.columnIndex)) {
                self.cellBoundaryCrossed = true;
                self.dispatchEvent('cellmouseover', [e, o], self.intf);
                self.dispatchEvent('cellmouseout', [e, self.currentCell], self.intf);
            }
            self.currentCell = o;
            if (!self.hasFocus) {
                return;
            }
            self.hovers = {};
            if (!self.draggingItem
                    && o
                    && self.scrollModes.indexOf(o.context) === -1) {
                self.dragItem = o;
                self.dragMode = o.dragContext;
                self.canvas.style.cursor = o.context;
                if (o.context === 'cell' && o.data) {
                    self.canvas.style.cursor = 'pointer';
                    self.hovers[o.data[self.uniqueId]] = [o.rowIndex];
                }
                if ((self.selecting || self.reorderObject)
                        && o.context === 'cell'
                        && o.data) {
                    sBounds = getSelectionBounds();
                    delta = {
                        x: Math.abs(self.dragStart.x - x),
                        y: Math.abs(self.dragStart.y - y),
                    };
                    if (self.dragStartObject.columnIndex !== -1 && e.shiftKey) {
                        self.dragStartObject = {
                            rowIndex: self.activeCell.rowIndex,
                            columnIndex: self.activeCell.columnIndex
                        };
                    }
                    dragBounds = {
                        top: Math.min(self.dragStartObject.rowIndex, o.rowIndex),
                        left: Math.min(self.dragStartObject.columnIndex, o.columnIndex),
                        bottom: Math.max(self.dragStartObject.rowIndex, o.rowIndex),
                        right: Math.max(self.dragStartObject.columnIndex, o.columnIndex)
                    };
                    if (self.dragStartObject.columnIndex === -1) {
                        dragBounds.left = -1;
                        dragBounds.right = s.length - 1;
                        dragBounds.top = Math.min(sBounds.top, o.rowIndex);
                        dragBounds.bottom = Math.max(sBounds.bottom, o.rowIndex);
                    }
                    if (self.dragStartObject.rowIndex !== o.rowIndex
                                || self.dragStartObject.columnIndex !== o.columnIndex) {
                        self.ignoreNextClick = true;
                    }
                    if (self.cellBoundaryCrossed || (delta.x === 0 && delta.y === 0) || self.attributes.rowSelectionMode) {
                        if (self.attributes.rowSelectionMode || self.dragStartObject.columnIndex === -1) {
                            selectRow(o.rowIndex, ctrl, true);
                        } else {
                            if (!self.dragAddToSelection && o.rowIndex) {
                                if (self.selections[o.rowIndex] && self.selections[o.rowIndex].indexOf(o.columnIndex) !== -1) {
                                    self.selections[o.rowIndex].splice(self.selections[o.rowIndex].indexOf(o.columnIndex), 1);
                                }
                            } else {
                                self.selections[o.rowIndex] = self.selections[o.rowIndex] || [];
                                if (self.selections[o.rowIndex].indexOf(o.columnIndex) === -1) {
                                    self.selections[o.rowIndex].push(o.columnIndex);
                                }
                            }
                        }
                    }
                    if ((!self.selectionBounds || (dragBounds.top !== self.selectionBounds.top
                            || dragBounds.left !== self.selectionBounds.left
                            || dragBounds.bottom !== self.selectionBounds.bottom
                            || dragBounds.right !== self.selectionBounds.right)) && !ctrl) {
                        self.selections = [];
                        sBounds = dragBounds;
                        if (self.attributes.rowSelectionMode) {
                            for (i = sBounds.top; i <= sBounds.bottom; i += 1) {
                                selectRow(i, true, true);
                            }
                        } else {
                            selectArea(sBounds, true);
                        }
                    }
                    autoScrollZone(e, x, y, ctrl);
                }
            }
            self.cellBoundaryCrossed = false;
            self.draw(true);
        }
        function autoScrollZone(e, x, y, ctrl) {
            var setTimer,
                headerCellWidth = self.getHeaderCellWidth(),
                headerCellHeight = self.getHeaderCellHeight();
            if (x > self.width - self.attributes.selectionScrollZone && x < self.width) {
                self.scrollBox.scrollLeft += self.attributes.selectionScrollIncrement;
                setTimer = true;
            }
            if (y > self.height - self.attributes.selectionScrollZone && y < self.height) {
                self.scrollBox.scrollTop += self.attributes.selectionScrollIncrement;
                setTimer = true;
            }
            if (x - self.attributes.selectionScrollZone - headerCellWidth < 0) {
                self.scrollBox.scrollLeft -= self.attributes.selectionScrollIncrement;
                setTimer = true;
            }
            if (y - self.attributes.selectionScrollZone - headerCellHeight < 0) {
                self.scrollBox.scrollTop -= self.attributes.selectionScrollIncrement;
                setTimer = true;
            }
            if (setTimer && !ctrl && self.currentCell && self.currentCell.columnIndex !== -1) {
                self.scrollTimer = setTimeout(mousemove, self.attributes.scrollRepeatRate, e);
            }
        }
        /**
         * Removes the context menu if it is present.
         * @memberof canvasDataGrid#
         * @method
         */
        function disposeContextMenu(e) {
            //TODO: there are most likely some bugs around removing the context menu.  Can't use grid on first click sometimes
            function disp() {
                self.contextMenu = undefined;
                self.canvas.cursor = 'pointer';
                document.body.removeEventListener('click', disposeContextMenu);
                document.body.removeEventListener('mouseup', disp);
                document.body.removeEventListener('mousedown', disp);
            }
            if (!e || (self.contextMenu
                                && self.contextMenu.parentNode
                                && !self.contextMenu.contains(e.target))) {
                self.contextMenu.parentNode.removeChild(self.contextMenu);
                document.body.addEventListener('mouseup', disp);
                document.body.addEventListener('mousedown', disp);
            }
        }
        function refreshFromOrigialData() {
            self.data = self.originalData.filter(function (row) {
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
            function applyFilter() {
                refreshFromOrigialData();
                Object.keys(self.columnFilters).forEach(function (filter) {
                    var header = getHeaderByName(column);
                    if (!header) {
                        return;
                    }
                    self.currentFilter = header.filter;
                    self.data = self.data.filter(function (row) {
                        return self.currentFilter(row[filter], self.columnFilters[filter]);
                    });
                });
                resize();
                self.draw(true);
            }
            if (self.coulumn === undefined && value === undefined) {
                return applyFilter();
            }
            if (column && (value === '' || value === undefined)) {
                delete self.columnFilters[column];
            } else {
                self.columnFilters[column] = value;
            }
            applyFilter();

        }
        function contextmenu(e) {
            if (!self.hasFocus) {
                return;
            }
            if (self.contextMenu) {
                e.preventDefault();
                return disposeContextMenu();
            }
            var oPreventDefault = e.preventDefault,
                pos,
                loc = {},
                contextObject,
                filterContainer,
                filterLabel,
                filterInput,
                columnFilter,
                menuItems;
            pos = getLayerPos(e);
            contextObject = getCellAt(pos.x, pos.y);
            if (contextObject.grid !== undefined) {
                return;
            }
            if (!contextObject.header) { e.preventDefault(); return; }
            columnFilter = self.columnFilters[contextObject.header.name] || '';
            filterContainer = document.createElement('div');
            filterLabel = document.createElement('div');
            filterLabel.className = 'canvas-datagrid-context-menu-label';
            filterInput = document.createElement('input');
            filterLabel.innerHTML = self.attributes.filterOptionText + ' ' + contextObject.header.name;
            filterContainer.appendChild(filterLabel);
            filterContainer.appendChild(filterInput);
            self.contextMenu = document.createElement('div');
            self.contextMenu.className = 'canvas-datagrid-context-menu';
            self.contextMenu.style.cursor = 'pointer';
            self.contextMenu.style.position = 'absolute';
            self.contextMenu.style.zIndex = '3';
            filterInput.value = columnFilter;
            menuItems = [];
            if (self.attributes.showFilter) {
                menuItems.push({
                    title: filterContainer
                });
                if (Object.keys(self.columnFilters).length) {
                    Object.keys(self.columnFilters).forEach(function (cf) {
                        menuItems.push({
                            title: self.attributes.removeFilterOptionText.replace(/%s/g, cf),
                            click: function removeFilterClick() {
                                e.preventDefault();
                                setFilter(cf, '');
                                disposeContextMenu();
                                self.controlInput.focus();
                            }
                        });
                    });
                }
            }
            if (self.attributes.saveAppearance && self.attributes.showClearSettingsOption
                    && (Object.keys(self.sizes.rows).length > 0
                        || Object.keys(self.sizes.columns).length > 0)) {
                menuItems.push({
                    title: self.attributes.clearSettingsOptionText,
                    click: function (e) {
                        e.preventDefault();
                        self.sizes.rows = {};
                        self.sizes.columns = {};
                        self.createRowOrders();
                        createColumnOrders();
                        self.storedSettings = undefined;
                        self.dispatchEvent('resizecolumn', [self.style.columnWidth], self.intf);
                        self.dispatchEvent('resizerow', [self.style.cellHeight], self.intf);
                        setStorageData();
                        resize(true);
                        disposeContextMenu();
                        self.controlInput.focus();
                    }
                });
            }
            if (self.attributes.allowSorting && self.attributes.showOrderByOption) {
                menuItems.push({
                    title: self.attributes.showOrderByOptionTextAsc.replace('%s', contextObject.header.name),
                    click: function (e) {
                        e.preventDefault();
                        order(contextObject.header.name, 'asc');
                        disposeContextMenu();
                        self.controlInput.focus();
                    }
                });
                menuItems.push({
                    title: self.attributes.showOrderByOptionTextDesc.replace('%s', contextObject.header.name),
                    click: function (e) {
                        e.preventDefault();
                        order(contextObject.header.name, 'desc');
                        disposeContextMenu();
                        self.controlInput.focus();
                    }
                });
            }
            if (self.dispatchEvent('contextmenu', [e, contextObject, menuItems, self.contextMenu], self.intf)) { return; }
            if (!menuItems.length) {
                return;
            }
            menuItems.forEach(function (item) {
                var row = document.createElement('div');
                self.contextMenu.appendChild(row);
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
                        self.controlInput.focus();
                    });
                }
            });
            filterInput.addEventListener('dblclick', stopPropagation);
            filterInput.addEventListener('click', stopPropagation);
            filterInput.addEventListener('mousedown', stopPropagation);
            filterInput.addEventListener('keyup', function filterKeyUp() {
                setFilter(contextObject.header.name, filterInput.value);
                requestAnimationFrame(function filterRequestAnimationFrame() {
                    filterInput.classList.remove(self.invalidSearchExpClass);
                    if (self.invalidFilterRegEx) {
                        filterInput.classList.add(self.invalidSearchExpClass);
                    }
                });
            });
            document.body.addEventListener('click', disposeContextMenu);
            document.body.appendChild(self.contextMenu);
            loc.x = e.clientX - self.style.contextMenuMarginLeft;
            loc.y = e.clientY - self.style.contextMenuMarginTop;
            if (loc.x + self.contextMenu.offsetWidth > document.documentElement.clientWidth) {
                loc.x = document.documentElement.clientWidth - self.contextMenu.offsetWidth;
            }
            if (loc.y + self.contextMenu.offsetHeight > document.documentElement.clientHeight) {
                loc.y = document.documentElement.clientHeight - self.contextMenu.offsetHeight;
            }
            self.contextMenu.style.left = loc.x + 'px';
            self.contextMenu.style.top = loc.y + 'px';
            oPreventDefault.apply(e);
        }
        /**
         * Returns the number of pixels to scroll down to line up with row rowIndex.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} rowIndex The row index of the row to scroll find.
         */
        function findRowScrollTop(rowIndex) {
            var top = 0, x = 0, l = self.data.length,
                cellBorder = self.style.cellBorderWidth * 2;
            if (!self.attributes.showNewRow) {
                l -= 1;
            }
            if (rowIndex > l) {
                throw new Error('Impossible row index');
            }
            while (x < rowIndex) {
                top += (self.sizes.rows[self.data[x][self.uniqueId]] || self.style.cellHeight) + cellBorder;
                x += 1;
            }
            //TODO: This is not super accurate, causes pageUp/Dn to not move around right
            return top - (self.sizes.rows[self.data[rowIndex][self.uniqueId]] || self.style.cellHeight);
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
                left += self.sizes.columns[s[y][self.uniqueId]] || s[y].width;
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
                self.scrollBox.scrollLeft = findColumnScrollLeft(x);
            }
            if (y !== undefined) {
                self.scrollBox.scrollTop = findRowScrollTop(y);
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
            if (self.visibleCells.filter(function (cell) {
                    return (cell.rowIndex === y || y === undefined)
                        && (cell.columnIndex === x || x === undefined)
                        && cell.x > 0
                        && cell.y > 0
                        && cell.x + cell.width < self.width
                        && cell.y + cell.height < self.height;
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
            self.activeCell = {
                rowIndex: y,
                columnIndex: x
            };
        }
        function validateColumn(c, s) {
            if (!c.name) {
                throw new Error('A column must contain at least a name.');
            }
            if (s.filter(function (i) { return i.name === c.name; }).length > 0) {
                throw new Error('A column with the name '
                    + c.name + ' already exists and cannot be added again.');
            }
            return true;
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
            validateColumn(c, s);
            self.intf.schema = s.splice(index, 0, c);
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
            self.intf.schema = s.splice(index, 1);
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
            validateColumn(c, s);
            s.push(c);
            self.intf.schema = s;
        }
        /**
         * Deletes a row from the dataset at the specified index.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} index The index of the row to delete.
         */
        function deleteRow(index) {
            self.originalData.splice(index, 1);
            setFilter();
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
            if (self.originalData.length < index) {
                throw new Error('Index is beyond the length of the dataset.');
            }
            self.originalData.splice(index, 0, d);
            setFilter();
            resize(true);
        }
        /**
         * Adds a new row into the dataset.
         * @memberof canvasDataGrid#
         * @method
         * @param {object} d data.
         */
        function addRow(d) {
            self.originalData.push(d);
            setFilter();
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
            self.sizes.rows[self.data[rowIndex][self.uniqueId]] = height;
            self.draw(true);
        }
        /**
         * Sets the width of a given column by index number.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} colIndex The index of the column to set.
         * @param {number} width Width to set the column to.
         */
        function setColumnWidth(colIndex, width) {
            var s = getSchema();
            self.sizes.columns[s[colIndex][self.uniqueId]] = width;
            self.draw(true);
        }
        /**
         * Removes any changes to the width of the columns due to user or api interaction, setting them back to the schema or style default.
         * @memberof canvasDataGrid#
         * @tutorial schema
         * @method
         */
        function resetColumnWidths() {
            self.sizes.columns = {};
            self.draw(true);
        }
        /**
         * Removes any changes to the height of the rows due to user or api interaction, setting them back to the schema or style default.
         * @memberof canvasDataGrid#
         * @tutorial schema
         * @method
         */
        function resetRowHeights() {
            self.sizes.rows = {};
            self.draw(true);
        }
        /**
         * Ends editing, optionally aborting the edit.
         * @memberof canvasDataGrid#
         * @method
         * @param {boolean} abort When true, abort the edit.
         */
        function endEdit(abort) {
            var cell = self.input.editCell,
                y = cell.rowIndex;
            function abortEdit() {
                abort = true;
            }
            if (self.dispatchEvent('beforeendedit', [{}, cell, self.input.value, cell.value,
                    abortEdit, self.input], self.intf)) { return false; }
            if (self.input.value !== cell.value && !abort) {
                self.changes[y] = self.changes[y] || {};
                self.changes[y][cell.header.name] = self.input.value;
                cell.data[cell.header.name] = self.input.value;
                if (y === self.data.length) {
                    if (self.dispatchEvent('newrow', [self.input.value, cell.value,
                            abort, cell, self.input], self.intf)) { return false; }
                    self.uId += 1;
                    addRow(cell.data);
                    createNewRowData();
                }
                self.draw(true);
            }
            document.body.removeChild(self.input);
            self.controlInput.focus();
            self.dispatchEvent('endedit', [{}, cell, self.input.value, abort, self.input], self.intf);
            self.input = undefined;
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
            if (!self.attributes.editable) { return; }
            var top, left, cell, s = self.getVisibleSchema();
            cell = self.visibleCells.filter(function (vCell) {
                return vCell.columnIndex === x && vCell.rowIndex === y;
            })[0];
            if (self.dispatchEvent('beforebeginedit', [{}, cell], self.intf)) { return false; }
            scrollIntoView(x, y);
            setActiveCell(x, y);
            function postDraw() {
                var pos = position(self.parentNode, true);
                cell = self.visibleCells.filter(function (vCell) {
                    return vCell.columnIndex === x && vCell.rowIndex === y;
                })[0];
                top = cell.y + self.style.cellBorderWidth;
                left = cell.x + self.style.cellBorderWidth;
                self.scrollEdit = {
                    scrollTop: self.scrollBox.scrollTop,
                    scrollLeft: self.scrollBox.scrollLeft,
                    inputTop: top,
                    inputLeft: left
                };
                self.input = document.createElement(self.attributes.multiLine ? 'textarea' : 'input');
                document.body.appendChild(self.input);
                self.input.className = 'canvas-datagrid-edit-input';
                self.input.style.position = 'absolute';
                self.input.style.top = pos.top - 1 + top + 'px';
                self.input.style.left = pos.left - 1 + left + 'px';
                self.input.style.height = cell.height - (self.style.cellBorderWidth * 2) + 'px';
                self.input.style.width = cell.width - (self.style.cellBorderWidth * 2)
                    - self.style.cellPaddingLeft + 'px';
                self.input.style.zIndex = '2';
                self.input.value = cell.value;
                self.input.editCell = cell;
                clipElement(self.input);
                self.input.focus();
                self.input.addEventListener('click', stopPropagation);
                self.input.addEventListener('dblclick', stopPropagation);
                self.input.addEventListener('mouseup', stopPropagation);
                self.input.addEventListener('mousedown', stopPropagation);
                self.input.addEventListener('keydown', function (e) {
                    var nx = cell.columnIndex,
                        ny = cell.rowIndex;
                    // esc
                    if (e.keyCode === 27) {
                        endEdit(true);
                        self.draw(true);
                    // enter
                    } else if (e.keyCode === 13) {
                        endEdit();
                        self.draw(true);
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
                            ny = self.data.length - 1;
                        }
                        if (ny > self.data.length - 1) {
                            ny = 0;
                        }
                        beginEditAt(nx, ny);
                    }
                });
            }
            requestAnimationFrame(postDraw);
            self.dispatchEvent('beginedit', [cell, self.input], self.intf);
        }
        function click(e) {
            var i,
                selectionChanged,
                ctrl = (e.controlKey || e.metaKey || self.attributes.persistantSelectionMode),
                pos = getLayerPos(e);
            self.currentCell = getCellAt(pos.x, pos.y);
            if (self.currentCell.grid !== undefined) {
                return;
            }
            function checkSelectionChange() {
                if (!selectionChanged) { return; }
                self.dispatchEvent('selectionchanged',
                    [getSelectedData(), self.selections, self.selectionBounds], self.intf);
            }
            if (self.input) {
                endEdit();
            }
            if (self.ignoreNextClick) {
                self.ignoreNextClick = false;
                return;
            }
            i = self.currentCell;
            if (self.dispatchEvent('click', [e, self.currentCell], self.intf)) { return; }
            if (!self.hasFocus) {
                return;
            }
            if (self.currentCell.context === 'cell') {
                if (self.currentCell.style === 'cornerCell') {
                    order(self.uniqueId, 'asc');
                    setFilter();
                    checkSelectionChange();
                    return;
                }
                if (self.currentCell.style === 'headerCell') {
                    if (self.orderBy === i.header.name) {
                        self.orderDirection = self.orderDirection === 'asc' ? 'desc' : 'asc';
                    } else {
                        self.orderDirection = 'asc';
                    }
                    order(i.header.name, self.orderDirection);
                    checkSelectionChange();
                    return;
                }
                if (['rowHeaderCell', 'headerCell'].indexOf(self.currentCell.style) === -1 && !ctrl) {
                    setActiveCell(i.columnIndex, i.rowIndex);
                }
                self.selections[i.rowIndex] = self.selections[i.rowIndex] || [];
                if ((self.attributes.rowSelectionMode || self.currentCell.style === 'rowHeaderCell')) {
                    if (self.currentCell.style === 'rowHeaderCell'
                            && self.attributes.tree && pos.x > 0
                            && pos.x - self.currentCell.x < self.style.treeArrowWidth
                            + self.style.treeArrowMarginLeft
                            + self.style.treeArrowMarginRight + self.style.treeArrowClickRadius
                            && pos.y - self.currentCell.y < self.style.treeArrowHeight
                            + self.style.treeArrowMarginTop + self.style.treeArrowClickRadius
                            && pos.y > 0) {
                        toggleTree(i.rowIndex);
                        return;
                    }
                    selectionChanged = true;
                    selectRow(i.rowIndex, ctrl, true);
                }
                if (e.shiftKey && !ctrl) {
                    self.selectionBounds = getSelectionBounds();
                    selectArea(undefined, false);
                }
            }
            checkSelectionChange();
            self.draw(true);
        }
        function dragResizeColumn(e) {
            var pos, x, y;
            pos = getLayerPos(e);
            x = self.resizingStartingWidth + pos.x - self.dragStart.x;
            y = self.resizingStartingHeight + pos.y - self.dragStart.y;
            if (x < self.style.minColumnWidth) {
                x = self.style.minColumnWidth;
            }
            if (y < self.style.minRowHeight) {
                y = self.style.minRowHeight;
            }
            if (self.dispatchEvent('resizecolumn', [{}, x, y, self.draggingItem], self.intf)) { return false; }
            if (self.scrollBox.scrollLeft > self.scrollBox.scrollWidth - self.attributes.resizeScrollZone
                    && self.dragMode === 'ew-resize') {
                resize(true);
                self.scrollBox.scrollLeft += x;
            }
            if (self.dragMode === 'ew-resize') {
                self.sizes.columns[self.draggingItem.header.style === 'rowHeaderCell'
                       ? 'cornerCell' : self.draggingItem.header[self.uniqueId]] = x;
                if (['rowHeaderCell', 'cornerCell'].indexOf(self.draggingItem.header.style) !== -1) {
                    resize(true);
                }
                resizeChildGrids();
                return;
            }
            if (self.dragMode === 'ns-resize') {
                if (self.draggingItem.rowOpen) {
                    self.sizes.trees[self.draggingItem.data[self.uniqueId]] = y;
                } else if (self.attributes.globalRowResize) {
                    self.style.cellHeight = y;
                } else {
                    self.sizes.rows[self.draggingItem.data[self.uniqueId]] = y;
                }
                self.dispatchEvent('resizerow', [y], self.intf);
                resizeChildGrids();
                return;
            }
            self.ellipsisCache = {};
        }
        function stopDragResize() {
            resize();
            document.body.removeEventListener('mousemove', dragResizeColumn, false);
            document.body.removeEventListener('mouseup', stopDragResize, false);
            setStorageData();
            self.draw(true);
            self.ignoreNextClick = true;
        }
        function scrollGrid(e) {
            var pos = getLayerPos(e);
            self.scrollMode = getCellAt(pos.x, pos.y).context;
            if (self.scrollMode === 'horizontal-scroll-box' && self.scrollStartMode !== 'horizontal-scroll-box') {
                self.scrollStartMode = 'horizontal-scroll-box';
                self.dragStart = pos;
                self.scrollStart.left = self.scrollBox.scrollLeft;
                clearTimeout(self.scrollTimer);
                return;
            }
            if (self.scrollMode === 'vertical-scroll-box' && self.scrollStartMode !== 'vertical-scroll-box') {
                self.scrollStartMode = 'vertical-scroll-box';
                self.dragStart = pos;
                self.scrollStart.top = self.scrollBox.scrollTop;
                clearTimeout(self.scrollTimer);
                return;
            }
            if (self.scrollStartMode === 'vertical-scroll-box'
                    && self.scrollMode !== 'vertical-scroll-box') {
                self.scrollMode = 'vertical-scroll-box';
            }
            if (self.scrollStartMode === 'horizontal-scroll-box'
                    && self.scrollMode !== 'horizontal-scroll-box') {
                self.scrollMode = 'horizontal-scroll-box';
            }
            clearTimeout(self.scrollTimer);
            if (self.scrollModes.indexOf(self.scrollMode) === -1) {
                return;
            }
            if (self.scrollMode === 'vertical-scroll-box') {
                self.scrollBox.scrollTop = self.scrollStart.top + ((pos.y - self.dragStart.y)
                    / self.scrollBox.heightBoxRatio);
            } else if (self.scrollMode === 'vertical-scroll-top') {
                self.scrollBox.scrollTop -= (self.page * self.style.cellHeight);
                self.scrollTimer = setTimeout(scrollGrid, self.attributes.scrollRepeatRate, e);
            } else if (self.scrollMode === 'vertical-scroll-bottom') {
                self.scrollBox.scrollTop += (self.page * self.style.cellHeight);
                self.scrollTimer = setTimeout(scrollGrid, self.attributes.scrollRepeatRate, e);
            }
            if (self.scrollMode === 'horizontal-scroll-box') {
                self.scrollBox.scrollLeft = self.scrollStart.left + ((pos.x - self.dragStart.x)
                    / self.scrollBox.widthBoxRatio);
            } else if (self.scrollMode === 'horizontal-scroll-right') {
                self.scrollBox.scrollLeft += self.attributes.selectionScrollIncrement;
                self.scrollTimer = setTimeout(scrollGrid, self.attributes.scrollRepeatRate, e);
            } else if (self.scrollMode === 'horizontal-scroll-left') {
                self.scrollBox.scrollLeft -= self.attributes.selectionScrollIncrement;
                self.scrollTimer = setTimeout(scrollGrid, self.attributes.scrollRepeatRate, e);
            }
        }
        function stopScrollGrid() {
            clearTimeout(self.scrollTimer);
            document.body.removeEventListener('mousemove', scrollGrid, false);
        }
        function dragReorder(e) {
            var pos, x, y;
            pos = getLayerPos(e);
            x = pos.x - self.dragStart.x;
            y = pos.y - self.dragStart.y;
            if (!self.attributes.allowColumnReordering && self.dragMode === 'column-reorder') {
                return;
            }
            if (!self.attributes.allowRowReordering && self.dragMode === 'row-reorder') {
                return;
            }
            if (self.dispatchEvent('reordering', [e, self.dragStartObject, self.currentCell, self.dragMode], self.intf)) {
                return;
            }
            if (Math.abs(x) > self.attributes.reorderDeadZone || Math.abs(y) > self.attributes.reorderDeadZone) {
                self.reorderObject = self.dragStartObject;
                self.reorderTarget = self.currentCell;
                self.reorderObject.dragOffset = {
                    x: x,
                    y: y
                };
                autoScrollZone(e, pos.x, pos.x, false);
            }
        }
        function stopDragReorder(e) {
            var cr = {
                    'row-reorder': self.orders.rows,
                    'column-reorder': self.orders.columns
                },
                i = {
                    'row-reorder': 'rowIndex',
                    'column-reorder': 'columnIndex'
                }[self.dragMode];
            document.body.removeEventListener('mousemove', dragReorder, false);
            document.body.removeEventListener('mouseup', stopDragReorder, false);
            if (self.reorderObject
                    && self.reorderTarget) {
                self.ignoreNextClick = true;
                if (self.reorderObject[i] !== self.reorderTarget[i]
                        && !self.dispatchEvent('reorder', [e, self.reorderObject, self.reorderTarget, self.dragMode], self.intf)) {
                    cr[self.dragMode].splice(cr[self.dragMode].indexOf(self.reorderObject[i]), 1);
                    cr[self.dragMode].splice(cr[self.dragMode].indexOf(self.reorderTarget[i]), 0, self.reorderObject[i]);
                    setStorageData();
                }
            }
            self.reorderObject = undefined;
            self.reorderTarget = undefined;
            self.draw(true);
        }
        function mousedown(e) {
            if (self.dispatchEvent('mousedown', [e, self.currentCell], self.intf)) { return; }
            if (!self.hasFocus) {
                return;
            }
            if (e.button === 2 || self.input) { return; }
            var ctrl = (e.controlKey || e.metaKey);
            self.dragStart = getLayerPos(e);
            self.scrollStart = {
                left: self.scrollBox.scrollLeft,
                top: self.scrollBox.scrollTop
            };
            self.dragStartObject = getCellAt(self.dragStart.x, self.dragStart.y);
            self.dragAddToSelection = !self.dragStartObject.selected;
            if (!ctrl && !e.shiftKey && !/(vertical|horizontal)-scroll-(bar|box)/
                    .test(self.dragStartObject.context)) {
                self.selections = [];
            }
            if (self.dragStartObject.isGrid) {
                return;
            }
            if (self.scrollModes.indexOf(self.dragStartObject.context) !== -1) {
                self.scrollMode = self.dragStartObject.context;
                self.scrollStartMode = self.dragStartObject.context;
                scrollGrid(e);
                document.body.addEventListener('mousemove', scrollGrid, false);
                document.body.addEventListener('mouseup', stopScrollGrid, false);
                self.ignoreNextClick = true;
                return;
            }
            if (self.dragMode === 'cell') {
                self.selecting = true;
                if (self.attributes.rowSelectionMode) {
                    selectRow(self.dragStartObject.rowIndex, ctrl, true);
                }
                return mousemove(e);
            }
            if (['ns-resize', 'ew-resize'].indexOf(self.dragMode) !== -1) {
                self.draggingItem = self.dragItem;
                if (self.draggingItem.rowOpen) {
                    self.resizingStartingHeight = self.sizes.trees[self.draggingItem.data[self.uniqueId]];
                } else {
                    self.resizingStartingHeight = self.sizes.rows[self.draggingItem.data[self.uniqueId]] || self.style.cellHeight;
                }
                self.resizingStartingWidth = self.sizes.columns[self.draggingItem.header.style === 'rowHeaderCell'
                       ? 'cornerCell' : self.draggingItem.header[self.uniqueId]] || self.draggingItem.header.width;
                document.body.addEventListener('mousemove', dragResizeColumn, false);
                document.body.addEventListener('mouseup', stopDragResize, false);
            }
            if (['row-reorder', 'column-reorder'].indexOf(self.dragMode) !== -1) {
                self.draggingItem = self.dragItem;
                document.body.addEventListener('mousemove', dragReorder, false);
                document.body.addEventListener('mouseup', stopDragReorder, false);
            }
        }
        function mouseup(e) {
            clearTimeout(self.scrollTimer);
            self.cellBoundaryCrossed = true;
            self.dispatchEvent('mouseup', [e, self.currentCell], self.intf);
            if (!self.hasFocus) {
                return;
            }
            if (self.currentCell && self.currentCell.grid !== undefined) {
                return;
            }
            if (self.ontextMenu || self.input) { return; }
            self.selecting = undefined;
            self.draggingItem = undefined;
            if (self.dragStart && isInGrid(self.dragStart)) {
                self.controlInput.focus();
            }
            self.dragStartObject = undefined;
            e.preventDefault();
        }
        function keydown(e) {
            var i,
                x = self.activeCell.columnIndex,
                y = self.activeCell.rowIndex,
                ctrl = (e.controlKey || e.metaKey),
                last = self.data.length - 1,
                cols = self.getVisibleSchema().length - 1;
            if (self.dispatchEvent('keydown', [e, self.currentCell], self.intf)) { return; }
            if (!self.hasFocus) {
                return;
            }
            self.page = self.visibleRows.length - 3 - self.attributes.pageUpDownOverlap;
            if (self.attributes.showNewRow) {
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
                y -= self.page;
                e.preventDefault();
            //PageDown
            } else if (e.keyCode === 34) {
                y += self.page;
                e.preventDefault();
            //Home ArrowUp
            } else if (e.keyCode === 36 || (ctrl && e.keyCode === 38)) {
                y = 0;
            //End ArrowDown
            } else if (e.keyCode === 35 || (ctrl && e.keyCode === 40)) {
                y = self.data.length - 1;
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
                self.selections = [];
                self.selections[Math.max(y, 0)] = [];
                self.selections[Math.max(y, 0)].push(x);
                self.selectionBounds = getSelectionBounds();
                if (self.attributes.rowSelectionMode) {
                    for (i = self.selectionBounds.top; i <= self.selectionBounds.bottom; i += 1) {
                        selectRow(i, ctrl, true);
                    }
                } else {
                    selectArea(undefined, ctrl);
                }
                e.preventDefault();
                self.draw(true);
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
                self.selections[Math.max(y, 0)] = self.selections[Math.max(y, 0)] || [];
                self.selections[Math.max(y, 0)].push(x);
                self.selectionBounds = getSelectionBounds();
                selectArea(undefined, ctrl);
                self.draw(true);
            }
            if (x !== self.activeCell.columnIndex || y !== self.activeCell.rowIndex) {
                scrollIntoView(x !== self.activeCell.columnIndex ? x : undefined, y !== self.activeCell.rowIndex ? y : undefined);
                setActiveCell(x, y);
                if (!e.shiftKey && self.attributes.selectionFollowsActiveCell) {
                    if (!ctrl) {
                        self.selections = [];
                    }
                    self.selections[y] = self.selections[y] || [];
                    self.selections[y].push(x);
                    self.dispatchEvent('selectionchanged', [getSelectedData(), self.selections, self.selectionBounds], self.intf);
                }
                self.draw(true);
            }
        }
        function keyup(e) {
            if (self.dispatchEvent('keyup', [e, self.currentCell], self.intf)) { return; }
            if (!self.hasFocus) {
                return;
            }
            self.controlInput.value = '';
        }
        function keypress(e) {
            if (!self.hasFocus) {
                return;
            }
            if (self.dispatchEvent('keypress', [e, self.currentCell], self.intf)) { return; }
        }
        function setDefaults(obj1, obj2, key, def) {
            obj1[key] = obj2[key] === undefined ? def : obj2[key];
        }
        function setAttributes() {
            defaults.attributes.forEach(function eachAttribute(i) {
                setDefaults(self.attributes, args, i[0], i[1]);
            });
        }
        function setStyle() {
            defaults.styles.forEach(function eachStyle(i) {
                setDefaults(self.style, args.style || {}, i[0], i[1]);
            });
        }
        function autosize(colName) {
            self.getVisibleSchema().forEach(function (col) {
                if (col.name === colName || colName === undefined) {
                    fitColumnToValues(col.name);
                }
            });
            fitColumnToValues('cornerCell');
        }
        function dblclick(e) {
            if (self.dispatchEvent('dblclick', [e, self.currentCell], self.intf)) { return; }
            if (!self.hasFocus) {
                return;
            }
            if (self.currentCell.context === 'ew-resize'
                    && self.currentCell.style === 'headerCell') {
                fitColumnToValues(self.currentCell.header.name);
            } else if (self.currentCell.context === 'ew-resize'
                    && self.currentCell.style === 'cornerCell') {
                autosize();
            } else if (['cell', 'activeCell'].indexOf(self.currentCell.style) !== -1) {
                beginEditAt(self.currentCell.columnIndex, self.currentCell.rowIndex);
            }
        }
        function scrollWheel(e) {
            if (self.dispatchEvent('mousewheel', [e, self.ctx], self.intf)) {
                return;
            }
            var l = self.scrollBox.scrollLeft,
                t = self.scrollBox.scrollTop;
            if (self.hasFocus) {
                self.scrollBox.scrollTop -= e.wheelDeltaY;
                self.scrollBox.scrollLeft -= e.wheelDeltaX;
            }
            if (t !== self.scrollBox.scrollTop || l !== self.scrollBox.scrollLeft) {
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
        function dispose() {
            if (!self.isChildGrid && self.canvas && self.canvas.parentNode) {
                self.canvas.parentNode.removeChild(self.canvas);
            }
            self.eventParent.removeEventListener('mouseup', mouseup, false);
            self.eventParent.removeEventListener('mousedown', mousedown, false);
            self.eventParent.removeEventListener('dblclick', dblclick, false);
            self.eventParent.removeEventListener('click', click, false);
            self.eventParent.removeEventListener('mousemove', mousemove);
            self.eventParent.removeEventListener('mousewheel', scrollWheel, false);
            self.canvas.removeEventListener('contextmenu', contextmenu, false);
            self.canvas.removeEventListener('copy', copy);
            self.controlInput.removeEventListener('keypress', keypress, false);
            self.controlInput.removeEventListener('keyup', keyup, false);
            self.controlInput.removeEventListener('keydown', keydown, false);
            window.removeEventListener('resize', resize);
            if (self.observer && self.observer.disconnect) {
                self.observer.disconnect();
            }
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
                        background: self.style.backgroundColor,
                        'z-index': '1',
                        'box-sizing': 'content-box!important',
                        padding: '0!important'
                    },
                    'canvas-datagrid-control-input': {
                        position: 'fixed!important',
                        top: '-5px',
                        left: '-5px',
                        border: 'none!important',
                        opacity: '0!important',
                        cursor: 'pointer!important',
                        width: '1px',
                        height: '1px'
                    },
                    'canvas-datagrid-edit-input': {
                        'box-sizing': 'content-box!important',
                        outline: 'none!important',
                        margin: '0!important',
                        padding: '0 0 0 ' + self.style.editCellPaddingLeft + 'px!important',
                        'font-size': self.style.editCellFontSize + '!important',
                        'font-family': self.style.editCellFontFamily + '!important',
                        'box-shadow': self.style.editCellBoxShadow,
                        border: self.style.editCellBorder
                    },
                    'canvas-datagrid-context-menu-item': {
                        margin: self.style.contextMenuItemMargin,
                        'border-radius': self.style.contextMenuItemBorderRadius
                    },
                    'canvas-datagrid-context-menu-item:hover': {
                        background: self.style.contextMenuHoverBackground,
                        color: self.style.contextMenuHoverColor,
                        margin: self.style.contextMenuItemMargin
                    },
                    'canvas-datagrid-context-menu-label': {
                        'margin': self.style.contextMenuLabelMargin,
                        display: self.style.contextMenuLabelDisplay,
                        'min-width': self.style.contextMenuLabelMinWidth,
                        'max-width': self.style.contextMenuLabelMaxWidth,
                    },
                    'canvas-datagrid-context-menu': {
                        'font-family': self.style.contextMenuFontFamily,
                        'font-size': self.style.contextMenuFontSize,
                        background: self.style.contextMenuBackground,
                        color: self.style.contextMenuColor,
                        border: self.style.contextMenuBorder,
                        padding: self.style.contextMenuPadding,
                        'border-radius': self.style.contextMenuBorderRadius,
                        opacity: self.style.contextMenuOpacity
                    },
                    'canvas-datagrid-invalid-search-regExp': {
                        background: self.style.contextMenuFilterInvalidExpresion
                    }
                };
            Object.keys(css).forEach(function (className) {
                styleSheetBody.push('.' + className + '{');
                Object.keys(css[className]).forEach(function (propertyName) {
                    styleSheetBody.push(propertyName + ':' + css[className][propertyName] + ';');
                });
                styleSheetBody.push('}');
            });
            if (document.getElementById(self.uniqueId)) {
                return;
            }
            styleSheet = document.createElement('link');
            styleSheet.id = self.uniqueId;
            styleSheet.rel = 'stylesheet';
            if (document.head.firstChild) {
                document.head.insertBefore(styleSheet, document.head.firstChild);
            } else {
                document.head.appendChild(styleSheet);
            }
            styleSheet.href = 'data:text/css;base64,'
                + btoa(self.style.styleSheet || styleSheetBody.join(''));
        }
        function appendTo(n) {
            self.parentNode = n;
            self.height = self.parentNode.offsetHeight;
            self.width = self.parentNode.offsetWidth;
            if (self.parentNode && /canvas-datagrid-(cell|tree)/.test(self.parentNode.nodeType)) {
                self.isChildGrid = true;
                self.parentGrid = self.parentNode.parentGrid;
                self.ctx = self.parentGrid.context;
                self.canvas = self.parentGrid.canvas;
                self.controlInput = self.parentGrid.controlInput;
                self.eventParent = self.canvas;
                self.intf.offsetParent = self.parentNode;
            } else {
                self.controlInput = document.createElement('input');
                self.controlInput.className = 'canvas-datagrid-control-input';
                self.isChildGrid = false;
                self.parentDOMNode = self.parentNode;
                self.parentNode = self.parentDOMNode;
                self.canvas = document.createElement('canvas');
                self.ctx = self.canvas.getContext('2d');
                self.ctx.textBaseline = 'alphabetic';
                self.parentDOMNode.appendChild(self.canvas);
                self.parentDOMNode.appendChild(self.controlInput);
                self.eventParent = self.canvas;
            }
            window.addEventListener('resize', resize);
            if (MutationObserver) {
                self.observer = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        resize(true);
                    });
                });
                [self.canvas.parentNode].forEach(function (el) {
                    self.observer.observe(el, { attributes: true });
                });
            }
            self.eventParent.addEventListener('mouseup', mouseup, false);
            self.eventParent.addEventListener('mousedown', mousedown, false);
            self.eventParent.addEventListener('dblclick', dblclick, false);
            self.eventParent.addEventListener('click', click, false);
            self.eventParent.addEventListener('mousemove', mousemove);
            self.eventParent.addEventListener('mousewheel', scrollWheel, false);
            self.canvas.addEventListener('contextmenu', contextmenu, false);
            self.canvas.addEventListener('copy', copy);
            self.controlInput.addEventListener('keypress', keypress, false);
            self.controlInput.addEventListener('keyup', keyup, false);
            self.controlInput.addEventListener('keydown', keydown, false);
        }
        function setDom() {
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
            Object.defineProperty(self.scrollBox, 'scrollBoxHeight', {
                get: function () {
                    return scrollBoxHeight;
                },
                set: function (value) {
                    scrollBoxHeight = value;
                }
            });
            Object.defineProperty(self.scrollBox, 'scrollBoxWidth', {
                get: function () {
                    return scrollBoxWidth;
                },
                set: function (value) {
                    scrollBoxWidth = value;
                }
            });
            Object.defineProperty(self.scrollBox, 'height', {
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
            Object.defineProperty(self.scrollBox, 'width', {
                get: function () {
                    return sWidth;
                },
                set: function (value) {
                    sWidth = value;
                }
            });
            Object.defineProperty(self.scrollBox, 'scrollTop', {
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
            Object.defineProperty(self.scrollBox, 'scrollLeft', {
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
            Object.defineProperty(self.scrollBox, 'scrollHeight', {
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
            Object.defineProperty(self.scrollBox, 'scrollWidth', {
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
        function tryLoadStoredOrders() {
            var s;
            if (self.storedSettings && typeof self.storedSettings.orders === 'object') {
                if (self.storedSettings.orders.rows.length >= self.data.length) {
                    self.orders.rows = self.storedSettings.orders.rows;
                }
                s = getSchema();
                self.orders.columns = self.storedSettings.orders.columns;
                s.forEach(function (h, i) {
                    if (self.orders.columns.indexOf(i) === -1) {
                        self.orders.columns.push(i);
                    }
                });
                self.orderBy = self.storedSettings.orderBy === undefined
                    ? self.uniqueId : self.storedSettings.orderBy;
                self.orderDirection = self.storedSettings.orderDirection === undefined
                    ? self.uniqueId : self.storedSettings.orderDirection;
                if (getHeaderByName(self.orderBy) && self.orderDirection) {
                    order(self.orderBy, self.orderDirection);
                }
            }
        }
        function init() {
            setAttributes();
            setStyle();
            initScrollBox();
            setDom();
            self.intf.type = 'canvas-datagrid';
            self.intf.addEventListener = addEventListener;
            self.intf.removeEventListener = removeEventListener;
            self.intf.dispatchEvent = self.dispatchEvent;
            self.intf.dispose = dispose;
            self.intf.appendTo = appendTo;
            self.intf.filters = self.filters;
            self.intf.sorters = self.sorters;
            self.intf.autosize = autosize;
            self.intf.beginEditAt = beginEditAt;
            self.intf.endEdit = endEdit;
            self.intf.setActiveCell = setActiveCell;
            self.intf.scrollIntoView = scrollIntoView;
            self.intf.clearChangeLog = clearChangeLog;
            self.intf.gotoCell = gotoCell;
            self.intf.gotoRow = gotoRow;
            self.intf.findColumnScrollLeft = findColumnScrollLeft;
            self.intf.findRowScrollTop = findRowScrollTop;
            self.intf.fitColumnToValues = fitColumnToValues;
            self.intf.findColumnMaxTextLength = findColumnMaxTextLength;
            self.intf.disposeContextMenu = disposeContextMenu;
            self.intf.getCellAt = getCellAt;
            self.intf.isCellVisible = isCellVisible;
            self.intf.order = order;
            self.intf.draw = self.draw;
            self.intf.selectArea = selectArea;
            self.intf.clipElement = clipElement;
            self.intf.getSchemaFromData = getSchemaFromData;
            self.intf.setFilter = setFilter;
            self.intf.selectRow = selectRow;
            self.intf.parentGrid = self.parentGrid;
            self.intf.toggleTree = toggleTree;
            self.intf.expandTree = expandTree;
            self.intf.collapseTree = collapseTree;
            self.intf.canvas = self.canvas;
            self.intf.context = self.ctx;
            self.intf.insertRow = insertRow;
            self.intf.deleteRow = deleteRow;
            self.intf.addRow = addRow;
            self.intf.insertColumn = insertColumn;
            self.intf.deleteColumn = deleteColumn;
            self.intf.addColumn = addColumn;
            self.intf.getClippingRect = getClippingRect;
            self.intf.setRowHeight = setRowHeight;
            self.intf.setColumnWidth = setColumnWidth;
            self.intf.resetColumnWidths = resetColumnWidths;
            self.intf.resetRowHeights = resetRowHeights;
            self.intf.resize = resize;
            self.intf.drawChildGrids = drawChildGrids;
            self.intf.blur = function () {
                self.hasFocus = false;
            };
            self.intf.focus = function () {
                self.hasFocus = true;
                self.controlInput.focus();
            };
            Object.defineProperty(self.intf, 'height', {
                get: function () {
                    return self.parentNode.height;
                },
                set: function (value) {
                    self.parentNode.height = value;
                    resize(true);
                }
            });
            Object.defineProperty(self.intf, 'width', {
                get: function () {
                    return self.parentNode.width;
                },
                set: function (value) {
                    self.parentNode.width = value;
                    resize(true);
                }
            });
            Object.defineProperty(self.intf, 'openChildren', {
                get: function () {
                    return self.openChildren;
                }
            });
            Object.defineProperty(self.intf, 'childGrids', {
                get: function () {
                    return self.childGrids;
                }
            });
            Object.defineProperty(self.intf, 'isChildGrid', {
                get: function () {
                    return self.isChildGrid;
                }
            });
            Object.defineProperty(self.intf, 'parentNode', {
                get: function () {
                    return self.parentNode;
                },
                set: function (value) {
                    self.parentNode = value;
                }
            });
            Object.defineProperty(self.intf, 'offsetParent', {
                get: function () {
                    return self.parentNode;
                },
                set: function (value) {
                    self.parentNode = value;
                }
            });
            Object.defineProperty(self.intf, 'offsetLeft', {
                get: function () {
                    return self.parentNode.offsetLeft;
                }
            });
            Object.defineProperty(self.intf, 'offsetTop', {
                get: function () {
                    return self.parentNode.offsetTop;
                }
            });
            Object.defineProperty(self.intf, 'scrollHeight', {
                get: function () {
                    return self.scrollBox.scrollHeight;
                }
            });
            Object.defineProperty(self.intf, 'scrollWidth', {
                get: function () {
                    return self.scrollBox.scrollWidth;
                }
            });
            Object.defineProperty(self.intf, 'scrollTop', {
                get: function () {
                    return self.scrollBox.scrollTop;
                },
                set: function (value) {
                    self.scrollBox.scrollTop = value;
                }
            });
            Object.defineProperty(self.intf, 'scrollLeft', {
                get: function () {
                    return self.scrollBox.scrollLeft;
                },
                set: function (value) {
                    self.scrollBox.scrollLeft = value;
                }
            });
            Object.defineProperty(self.intf, 'sizes', {
                get: function () {
                    return self.sizes;
                }
            });
            Object.defineProperty(self.intf, 'input', {
                get: function () {
                    return self.input;
                }
            });
            Object.defineProperty(self.intf, 'controlInput', {
                get: function () {
                    return self.controlInput;
                }
            });
            Object.defineProperty(self.intf, 'currentCell', {
                get: function () {
                    return self.currentCell;
                }
            });
            Object.defineProperty(self.intf, 'visibleCells', {
                get: function () {
                    return self.visibleCells;
                }
            });
            Object.defineProperty(self.intf, 'visibleRows', {
                get: function () {
                    return self.visibleRows;
                }
            });
            Object.defineProperty(self.intf, 'selections', {
                get: function () {
                    return self.selections;
                }
            });
            Object.defineProperty(self.intf, 'dragMode', {
                get: function () {
                    return self.dragMode;
                }
            });
            Object.defineProperty(self.intf, 'changes', {
                get: function () {
                    return self.changes;
                }
            });
            self.intf.attributes = {};
            self.intf.style = {};
            self.intf.formatters = self.formatters;
            Object.keys(self.style).forEach(function (key) {
                Object.defineProperty(self.intf.style, key, {
                    get: function () {
                        return self.style[key];
                    },
                    set: function (value) {
                        self.style[key] = value;
                        self.draw(true);
                    }
                });
            });
            Object.keys(self.attributes).forEach(function (key) {
                Object.defineProperty(self.intf.attributes, key, {
                    get: function () {
                        return self.attributes[key];
                    },
                    set: function (value) {
                        self.attributes[key] = value;
                        self.draw(true);
                    }
                });
            });
            self.filters.string = function (value, filterFor) {
                if (!filterFor) { return true; }
                var filterRegExp;
                self.invalidFilterRegEx = undefined;
                try {
                    filterRegExp = new RegExp(filterFor, 'ig');
                } catch (e) {
                    self.invalidFilterRegEx = e;
                    return;
                }
                return filterRegExp.test(value);
            };
            self.filters.number = function (value, filterFor) {
                if (!filterFor) { return true; }
                return value === filterFor;
            };
            Object.defineProperty(self.intf, 'selectionBounds', {
                get: function () {
                    return getSelectionBounds();
                }
            });
            Object.defineProperty(self.intf, 'selectedRows', {
                get: function () {
                    return getSelectedData(true);
                }
            });
            Object.defineProperty(self.intf, 'selectedCells', {
                get: function () {
                    return getSelectedData();
                }
            });
            Object.defineProperty(self.intf, 'visibleSchema', {
                get: function () {
                    return self.getVisibleSchema().map(function eachDataRow(col) {
                        return col;
                    });
                }
            });
            Object.defineProperty(self.intf, 'schema', {
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
                    self.schema = value.map(function eachSchemaColumn(column, index) {
                        column.width = column.width || self.style.columnWidth;
                        column[self.uniqueId] = getSchemaNameHash(column.name);
                        column.filter = column.filter || filter(column.type);
                        column.type = column.type || 'string';
                        column.index = index;
                        column.columnIndex = index;
                        column.rowIndex = -1;
                        return column;
                    });
                    self.tempSchema = undefined;
                    createNewRowData();
                    createColumnOrders();
                    tryLoadStoredOrders();
                    resize(true);
                    self.dispatchEvent('schemachanged', [self.schema], self.intf);
                }
            });
            Object.defineProperty(self.intf, 'data', {
                get: function dataGetter() {
                    return self.data;
                },
                set: function dataSetter(value) {
                    if (!Array.isArray(value)
                            || (value.length > 0 && typeof value[0] !== 'object')) {
                        throw new Error('Data must be an array of objects.');
                    }
                    self.originalData = value.map(function eachDataRow(row) {
                        row[self.uniqueId] = self.uId;
                        self.uId += 1;
                        return row;
                    });
                    self.changes = [];
                    //TODO apply filter to incoming dataset
                    self.data = self.originalData;
                    if (!self.schema && self.data.length > 0) {
                        self.tempSchema = getSchemaFromData();
                    }
                    if (!self.schema && self.data.length === 0) {
                        self.tempSchema = [{name: ''}];
                        self.tempSchema[0][self.uniqueId] = getSchemaNameHash('');
                    }
                    if (self.tempSchema && !self.schema) {
                        createColumnOrders();
                        tryLoadStoredOrders();
                        self.dispatchEvent('schemachanged', [self.tempSchema], self.intf);
                    }
                    createNewRowData();
                    if (self.attributes.autoResizeColumns && self.data.length > 0
                            && self.storedSettings === undefined) {
                        autosize();
                    }
                    // width cannot be determined correctly until after inserted into the dom?
                    requestAnimationFrame(function () {
                        fitColumnToValues('cornerCell');
                    });
                    if (!resize()) { self.draw(true); }
                    self.createRowOrders();
                    tryLoadStoredOrders();
                    self.dispatchEvent('datachanged', [self.data], self.intf);
                }
            });
            if (self.attributes.name && self.attributes.saveAppearance) {
                self.storedSettings = localStorage.getItem(self.storageName + '-' + self.attributes.name);
                if (self.storedSettings) {
                    try {
                        self.storedSettings = JSON.parse(self.storedSettings);
                    } catch (e) {
                        console.warn('could not read settings from localStore', e);
                        self.storedSettings = undefined;
                    }
                }
                if (self.storedSettings) {
                    if (typeof self.storedSettings.sizes === 'object') {
                        self.sizes.rows = self.storedSettings.sizes.rows;
                        self.sizes.columns = self.storedSettings.sizes.columns;
                        ['trees', 'columns', 'rows'].forEach(function (i) {
                            if (!self.sizes[i]) {
                                self.sizes[i] = {};
                            }
                        });
                    }
                }
            }
            if (args.data) {
                self.intf.data = args.data;
            }
            if (args.schema) {
                self.intf.schema = args.schema;
            }
            if (!self.data) {
                self.intf.data = [];
            }
            resize(true);
        }
        init();
        self.args = args;
        self.createGrid = grid;
        return self.intf;
    }
    if (window && !window.canvasDatagrid) {
        window.canvasDatagrid = grid;
    }
    return grid;
});
