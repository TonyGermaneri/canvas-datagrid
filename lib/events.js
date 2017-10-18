/*jslint browser: true, unparam: true, todo: true, plusplus: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([], function () {
    'use strict';
    return function (self) {
        var wheeling;
        function calculateCssSize(sizeString, parentSize) {
            var p;
            if (sizeString === 'auto' || sizeString === '') { return parentSize; }
            if (/%/.test(sizeString)) {
                p = parseFloat(sizeString, 10);
                return parentSize * (p * 0.01);
            }
            return parseFloat(sizeString, 10);
        }
        self.stopPropagation = function (e) { e.stopPropagation(); };
        /**
         * Adds an event listener to the given event.
         * @memberof canvasDatagrid
         * @name addEventListener
         * @method
         * @param {string} ev The name of the event to subscribe to.
         * @param {function} fn The event procedure to execute when the event is raised.
         */
        self.addEventListener = function (ev, fn) {
            self.events[ev] = self.events[ev] || [];
            self.events[ev].unshift(fn);
        };
        /**
         * Removes the given listener function from the given event.  Must be an actual reference to the function that was bound.
         * @memberof canvasDatagrid
         * @name removeEventListener
         * @method
         * @param {string} ev The name of the event to unsubscribe from.
         * @param {function} fn The event procedure to execute when the event is raised.
         */
        self.removeEventListener = function (ev, fn) {
            (self.events[ev] || []).forEach(function removeEachListener(sfn, idx) {
                if (fn === sfn) {
                    self.events[ev].splice(idx, 1);
                }
            });
        };
        /**
         * Fires the given event, padding an event object to the event subscribers.
         * @memberof canvasDatagrid
         * @name dispatchEvent
         * @method
         * @param {number} ev The name of the event to dispatch.
         * @param {number} e The event object.
         */
        self.dispatchEvent = function (ev, e) {
            var defaultPrevented;
            function preventDefault() {
                defaultPrevented = true;
            }
            if (!self.events[ev]) { return; }
            self.events[ev].forEach(function dispatchEachEvent(fn) {
                e.ctx = self.ctx;
                e.preventDefault = preventDefault;
                fn.apply(self.intf, [e]);
            });
            return defaultPrevented;
        };
        self.resizeDomElement = function () {
            if (!self.parentIsCanvas) {
                if (self.shadowRootParentElement) {
                    // shadow dom browsers
                    self.width = calculateCssSize(self.style.width, self.shadowRootParentElement.offsetWidth);
                    self.height = calculateCssSize(self.style.height, self.shadowRootParentElement.offsetHeight);
                } else {
                    // pre shadow dom browsers
                    self.width = self.parentDOMNode.offsetWidth;
                    self.height = self.parentDOMNode.offsetHeight;
                }
                self.canvas.style.width = self.width + 'px';
                self.canvas.style.height = self.height + 'px';
                self.canvas.width = self.width * window.devicePixelRatio;
                self.canvas.height = self.height * window.devicePixelRatio;
            }
            self.canvasOffsetLeft = self.args.canvasOffsetLeft || 0;
            self.canvasOffsetTop = self.args.canvasOffsetTop || 0;
        };
        self.resize = function (drawAfterResize) {
            var cellBorder = self.style.cellBorderWidth * 2,
                columnHeaderCellBorder =  self.style.columnHeaderCellBorderWidth * 2,
                scrollHeight,
                scrollWidth,
                rowHeaderCellHeight = self.getRowHeaderCellHeight(),
                columnHeaderCellWidth = self.getColumnHeaderCellWidth(),
                ch = self.style.cellHeight,
                // TODO: What the hell are these numbers!?  They are probably some value in the style.
                scrollDragPositionOffsetY = 30,
                scrollDragPositionOffsetX = 15;
            if (self.isChildGrid) {
                self.width = self.parentNode.offsetWidth;
                self.height = self.parentNode.offsetHeight;
            } else {
                self.resizeDomElement();
            }
            scrollHeight = self.data.reduce(function reduceData(accumulator, row, rowIndex) {
                return accumulator
                    + (((self.sizes.rows[row[self.uniqueId]] || ch) + (self.sizes.trees[row[self.uniqueId]] || 0)) * self.scale)
                    + cellBorder
                    // HACK? if an expanded tree row is frozen it is necessary to add the tree row's height a second time.
                    + (self.frozenRow > rowIndex ? (self.sizes.trees[row[self.uniqueId]] || 0) : 0);
            }, 0) || 0;
            scrollWidth = self.getVisibleSchema().reduce(function reduceSchema(accumulator, column) {
                if (column.hidden) { return accumulator; }
                return accumulator + ((self.sizes.columns[column[self.uniqueId]] || column.width || self.style.columnWidth) * self.scale) + cellBorder;
            }, 0) || 0;
            if (self.attributes.showNewRow) {
                scrollHeight += ch + cellBorder;
            }
            self.scrollBox.width = self.width - columnHeaderCellWidth;
            self.scrollBox.height = self.height - rowHeaderCellHeight - columnHeaderCellBorder;
            self.scrollBox.top = rowHeaderCellHeight + columnHeaderCellBorder;
            self.scrollBox.left = columnHeaderCellWidth;
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
            self.resizeEditInput();
            self.scroll(true);
            if (drawAfterResize) {
                self.draw(true);
            }
            self.dispatchEvent('resize', {});
            return true;
        };
        self.scroll = function (e, dontDraw) {
            var s = self.getVisibleSchema(),
                cellBorder = self.style.cellBorderWidth * 2,
                ch = self.style.cellHeight;
            self.scrollIndexTop = 0;
            self.scrollPixelTop = 0;
            self.scrollIndexLeft = 0;
            self.scrollPixelLeft = 0;
            while (self.scrollPixelTop < self.scrollBox.scrollTop && self.scrollIndexTop < self.data.length) {
                self.scrollPixelTop +=
                    (((self.sizes.rows[self.data[self.scrollIndexTop][self.uniqueId]] || ch)
                        + (self.sizes.trees[self.data[self.scrollIndexTop][self.uniqueId]] || 0)) * self.scale)
                    + cellBorder;
                self.scrollIndexTop += 1;
            }
            while (self.scrollPixelLeft < self.scrollBox.scrollLeft && self.scrollIndexLeft < s.length) {
                self.scrollPixelLeft +=
                    ((self.sizes.columns[s[self.scrollIndexLeft][self.uniqueId]] || s[self.scrollIndexLeft].width) * self.scale)
                    + cellBorder;
                self.scrollIndexLeft += 1;
            }
            if (self.data.length > 0) {
                self.scrollIndexLeft = Math.max(self.scrollIndexLeft - 1, 0);
                self.scrollPixelLeft = Math.max(self.scrollPixelLeft
                    - ((self.sizes.columns[s[self.scrollIndexLeft][self.uniqueId]] || s[self.scrollIndexLeft].width) * self.scale), 0);
                self.scrollIndexTop = Math.max(self.scrollIndexTop - 1, 0);
                self.scrollPixelTop = Math.max((self.scrollPixelTop
                    - ((self.sizes.rows[self.data[self.scrollIndexTop][self.uniqueId]] || ch)
                    + (self.sizes.trees[self.data[self.scrollIndexTop][self.uniqueId]] || 0)) * self.scale), 0);
            }
            self.ellipsisCache = {};
            if (!dontDraw) {
                self.draw(true);
            }
            //TODO: figure out why this has to be delayed for child grids
            //BUG: wheeling event on 3rd level hierarchy fails to move input box
            requestAnimationFrame(self.resizeEditInput);
            self.dispatchEvent('scroll', {top: self.scrollBox.scrollTop, left: self.scrollBox.scrollLeft});
        };
        self.mousemove = function (e, overridePos) {
            if (self.contextMenu || self.input) {
                return;
            }
            self.mouse = overridePos || self.getLayerPos(e);
            var ctrl = (e.ctrlKey || e.metaKey || self.attributes.persistantSelectionMode),
                i,
                vs = self.getVisibleSchema(),
                dragBounds,
                sBounds,
                x = self.mouse.x,
                y = self.mouse.y,
                o = self.getCellAt(x, y),
                delta,
                ev = {NativeEvent: e, cell: o, x: x, y: y},
                previousCell = self.currentCell;
            clearTimeout(self.scrollTimer);
            if (!self.isInGrid({x: x, y: y})) {
                self.hasFocus = false;
            }
            if (self.dispatchEvent('mousemove', ev)) {
                return;
            }
            if (o && self.currentCell && (self.currentCell.rowIndex !== o.rowIndex
                    || self.currentCell.columnIndex !== o.columnIndex)) {
                self.cellBoundaryCrossed = true;
                ev.cell = previousCell;
                self.dispatchEvent('cellmouseout', ev);
                ev.cell = o;
                self.dispatchEvent('cellmouseover', ev);
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
                    self.canvas.style.cursor = 'default';
                    self.hovers[o.data[self.uniqueId]] = [o.columnIndex];
                }
                if ((self.selecting || self.reorderObject)
                        && o.context === 'cell'
                        && o.data) {
                    sBounds = self.getSelectionBounds();
                    delta = {
                        x: Math.abs(self.dragStart.x - x),
                        y: Math.abs(self.dragStart.y - y)
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
                        dragBounds.right = vs.length - 1;
                        dragBounds.top = Math.min(sBounds.top, o.rowIndex);
                        dragBounds.bottom = Math.max(sBounds.bottom, o.rowIndex);
                    }
                    if (self.dragStartObject.rowIndex !== o.rowIndex
                                || self.dragStartObject.columnIndex !== o.columnIndex) {
                        self.ignoreNextClick = true;
                    }
                    if (self.cellBoundaryCrossed || (delta.x === 0 && delta.y === 0) || (self.attributes.selectionMode === 'row')) {
                        if ((self.attributes.selectionMode === 'row') || self.dragStartObject.columnIndex === -1) {
                            self.selectRow(o.rowIndex, ctrl, null, true);
                        } else {
                            if (!self.dragAddToSelection && o.rowIndex !== undefined) {
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
                        if (self.attributes.selectionMode === 'row') {
                            for (i = sBounds.top; i <= sBounds.bottom; i += 1) {
                                self.selectRow(i, true, null, true);
                            }
                        } else {
                            self.selectArea(sBounds, true);
                        }
                    }
                    self.autoScrollZone(e, x, y, ctrl);
                }
            }
            self.cellBoundaryCrossed = false;
            self.draw(true);
        };
        self.click = function (e, overridePos) {
            var i,
                selectionChanged,
                ctrl = (e.ctrlKey || e.metaKey || self.attributes.persistantSelectionMode),
                pos = overridePos || self.getLayerPos(e);
            self.currentCell = self.getCellAt(pos.x, pos.y);
            if (self.currentCell.grid !== undefined) {
                return;
            }
            function checkSelectionChange() {
                if (!selectionChanged) { return; }
                self.dispatchEvent('selectionchanged', {
                    selectedData: self.getSelectedData(),
                    selections: self.selections,
                    selectionBounds: self.selectionBounds
                });
            }
            if (self.input) {
                self.endEdit();
            }
            if (self.ignoreNextClick) {
                self.ignoreNextClick = false;
                return;
            }
            i = self.currentCell;
            if (self.dispatchEvent('click', {NativeEvent: e, cell: self.currentCell})) { return; }
            if (!self.hasFocus) {
                return;
            }
            if (['rowHeaderCell', 'columnHeaderCell'].indexOf(self.currentCell.style) === -1 && !ctrl) {
                self.setActiveCell(i.columnIndex, i.rowIndex);
            }
            if (self.currentCell.context === 'cell') {
                if (self.currentCell.style === 'cornerCell') {
                    self.selectAll();
                    self.draw();
                    checkSelectionChange();
                    return;
                }
                if (self.currentCell.style === 'columnHeaderCell') {
                    if (self.attributes.columnHeaderClickBehavior === 'sort') {
                        if (self.orderBy === i.header.name) {
                            self.orderDirection = self.orderDirection === 'asc' ? 'desc' : 'asc';
                        } else {
                            self.orderDirection = 'asc';
                        }
                        self.order(i.header.name, self.orderDirection);
                        checkSelectionChange();
                        return;
                    }
                    if (self.attributes.columnHeaderClickBehavior === 'select') {
                        self.selectColumn(i.header.index, ctrl, e.shiftKey, true);
                        checkSelectionChange();
                        self.draw();
                        return;
                    }
                }
                self.selections[i.rowIndex] = self.selections[i.rowIndex] || [];
                if (((self.attributes.selectionMode === 'row') || self.currentCell.style === 'rowHeaderCell')) {
                    if (self.currentCell.style === 'rowHeaderCell'
                            && self.attributes.tree && pos.x > 0
                            && pos.x - self.currentCell.x < self.style.treeArrowWidth
                            + self.style.treeArrowMarginLeft
                            + self.style.treeArrowMarginRight + self.style.treeArrowClickRadius
                            && pos.y - self.currentCell.y < self.style.treeArrowHeight
                            + self.style.treeArrowMarginTop + self.style.treeArrowClickRadius
                            && pos.y > 0) {
                        self.toggleTree(i.rowIndex);
                        return;
                    }
                    selectionChanged = true;
                    self.selectRow(i.rowIndex, ctrl, null, true);
                }
                if (e.shiftKey && !ctrl) {
                    self.selectionBounds = self.getSelectionBounds();
                    self.selectArea(undefined, false);
                }
            }
            checkSelectionChange();
            self.draw(true);
        };
        self.dragResizeColumn = function (e) {
            var pos, x, y;
            pos = self.getLayerPos(e);
            x = self.resizingStartingWidth + pos.x - self.dragStart.x;
            y = self.resizingStartingHeight + pos.y - self.dragStart.y;
            if (x < self.style.minColumnWidth) {
                x = self.style.minColumnWidth;
            }
            if (y < self.style.minRowHeight) {
                y = self.style.minRowHeight;
            }
            if (self.dispatchEvent('resizecolumn', {x: x, y: y, draggingItem: self.draggingItem})) { return false; }
            if (self.scrollBox.scrollLeft > self.scrollBox.scrollWidth - self.attributes.resizeScrollZone
                    && self.dragMode === 'ew-resize') {
                self.resize(true);
                self.scrollBox.scrollLeft += x;
            }
            if (self.dragMode === 'ew-resize') {
                self.sizes.columns[self.draggingItem.header.style === 'rowHeaderCell'
                       ? 'cornerCell' : self.draggingItem.header[self.uniqueId]] = x;
                if (['rowHeaderCell', 'cornerCell'].indexOf(self.draggingItem.header.style) !== -1) {
                    self.resize(true);
                }
                self.resizeChildGrids();
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
                self.dispatchEvent('resizerow', {row: y});
                self.resizeChildGrids();
                return;
            }
            self.ellipsisCache = {};
        };
        self.stopDragResize = function () {
            self.resize();
            document.body.removeEventListener('mousemove', self.dragResizeColumn, false);
            document.body.removeEventListener('mouseup', self.stopDragResize, false);
            self.setStorageData();
            self.draw(true);
            self.ignoreNextClick = true;
        };
        self.scrollGrid = function (e) {
            var pos = self.getLayerPos(e);
            if (self.attributes.scrollPointerLock && self.pointerLockPosition
                    && ['horizontal-scroll-box', 'vertical-scroll-box'].indexOf(self.scrollStartMode) !== -1) {
                self.pointerLockPosition.x += e.movementX;
                self.pointerLockPosition.y += e.movementY;
                self.pointerLockPosition.x = Math.min(self.width - self.style.scrollBarWidth, Math.max(0, self.pointerLockPosition.x));
                self.pointerLockPosition.y = Math.min(self.height - self.style.scrollBarWidth, Math.max(0, self.pointerLockPosition.y));
                pos = self.pointerLockPosition;
            }
            self.scrollMode = self.getCellAt(pos.x, pos.y).context;
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
                self.scrollTimer = setTimeout(self.scrollGrid, self.attributes.scrollRepeatRate, e);
            } else if (self.scrollMode === 'vertical-scroll-bottom') {
                self.scrollBox.scrollTop += (self.page * self.style.cellHeight);
                self.scrollTimer = setTimeout(self.scrollGrid, self.attributes.scrollRepeatRate, e);
            }
            if (self.scrollMode === 'horizontal-scroll-box') {
                self.scrollBox.scrollLeft = self.scrollStart.left + ((pos.x - self.dragStart.x)
                    / self.scrollBox.widthBoxRatio);
            } else if (self.scrollMode === 'horizontal-scroll-right') {
                self.scrollBox.scrollLeft += self.attributes.selectionScrollIncrement;
                self.scrollTimer = setTimeout(self.scrollGrid, self.attributes.scrollRepeatRate, e);
            } else if (self.scrollMode === 'horizontal-scroll-left') {
                self.scrollBox.scrollLeft -= self.attributes.selectionScrollIncrement;
                self.scrollTimer = setTimeout(self.scrollGrid, self.attributes.scrollRepeatRate, e);
            }
        };
        self.stopScrollGrid = function () {
            clearTimeout(self.scrollTimer);
            if (document.exitPointerLock) {
                document.exitPointerLock();
            }
            document.body.removeEventListener('mousemove', self.scrollGrid, false);
        };
        self.dragReorder = function (e) {
            var pos, x, y;
            pos = self.getLayerPos(e);
            x = pos.x - self.dragStart.x;
            y = pos.y - self.dragStart.y;
            if (!self.attributes.allowColumnReordering && self.dragMode === 'column-reorder') {
                return;
            }
            if (!self.attributes.allowRowReordering && self.dragMode === 'row-reorder') {
                return;
            }
            if (self.dispatchEvent('reordering', {
                    NativeEvent: e,
                    source: self.dragStartObject,
                    target: self.currentCell,
                    dragMode: self.dragMode
                })) {
                return;
            }
            if (Math.abs(x) > self.attributes.reorderDeadZone || Math.abs(y) > self.attributes.reorderDeadZone) {
                self.reorderObject = self.draggingItem;
                self.reorderTarget = self.currentCell;
                self.reorderObject.dragOffset = {
                    x: x,
                    y: y
                };
                self.autoScrollZone(e, pos.x, pos.y, false);
            }
        };
        self.stopDragReorder = function (e) {
            var oIndex,
                tIndex,
                cr = {
                    'row-reorder': self.orders.rows,
                    'column-reorder': self.orders.columns
                },
                i = {
                    'row-reorder': 'rowIndex',
                    'column-reorder': 'columnIndex'
                }[self.dragMode];
            document.body.removeEventListener('mousemove', self.dragReorder, false);
            document.body.removeEventListener('mouseup', self.stopDragReorder, false);
            if (self.reorderObject
                    && self.reorderTarget
                    && ((self.dragMode === 'column-reorder' && self.reorderTarget.columnIndex > -1
                        && self.reorderTarget.columnIndex < self.getVisibleSchema().length)
                    || (self.dragMode === 'row-reorder' && self.reorderTarget.rowIndex > -1
                        && self.reorderTarget.rowIndex < self.data.length))
                    && self.reorderObject[i] !== self.reorderTarget[i]
                    && !self.dispatchEvent('reorder', {
                        NativeEvent: e,
                        source: self.reorderObject,
                        target: self.reorderTarget,
                        dragMode: self.dragMode
                    })) {
                self.ignoreNextClick = true;
                oIndex = cr[self.dragMode].indexOf(self.reorderObject[i]);
                tIndex = cr[self.dragMode].indexOf(self.reorderTarget[i]);
                cr[self.dragMode].splice(oIndex, 1);
                cr[self.dragMode].splice(tIndex, 0, self.reorderObject[i]);
                self.setStorageData();
            }
            self.reorderObject = undefined;
            self.reorderTarget = undefined;
            self.draw(true);
        };
        self.dragMove = function (e) {
            if (self.dispatchEvent('moving', {NativeEvent: e, cell: self.currentCell})) { return; }
            var pos = self.getLayerPos(e);
            self.moveOffset = {
                x: self.currentCell.columnIndex - self.dragStartObject.columnIndex,
                y: self.currentCell.rowIndex - self.dragStartObject.rowIndex
            };
            if (Math.abs(pos.x) > self.attributes.reorderDeadZone || Math.abs(pos.y) > self.attributes.reorderDeadZone) {
                setTimeout(function () {
                    self.autoScrollZone(e, pos.x, pos.y, false);
                }, 1);
            }
        };
        self.stopDragMove = function (e) {
            document.body.removeEventListener('mousemove', self.dragMove, false);
            document.body.removeEventListener('mouseup', self.stopDragMove, false);
            var b = self.getSelectionBounds();
            if (self.dispatchEvent('endmove', {NativeEvent: e, cell: self.currentCell})) {
                self.movingSelection = undefined;
                self.moveOffset = undefined;
                self.draw(true);
                return;
            }
            if (self.moveOffset) {
                self.moveTo(self.movingSelection, b.left + self.moveOffset.x, b.top + self.moveOffset.y);
                self.moveSelection(self.moveOffset.x, self.moveOffset.y);
            }
            self.movingSelection = undefined;
            self.moveOffset = undefined;
            self.draw(true);
        };
        self.freezeMove = function (e) {
            if (self.dispatchEvent('freezemoving', {NativeEvent: e, cell: self.currentCell})) { return; }
            var pos = self.getLayerPos(e);
            self.ignoreNextClick = true;
            self.freezeMarkerPosition = pos;
            if (self.currentCell && self.currentCell.rowIndex !== undefined && self.dragMode === 'frozen-row-marker') {
                self.scrollBox.scrollTop = 0;
                self.frozenRow = self.currentCell.rowIndex + 1;
            }
            if (self.currentCell && self.currentCell.columnIndex !== undefined && self.dragMode === 'frozen-column-marker') {
                self.scrollBox.scrollLeft = 0;
                self.frozenColumn = self.currentCell.columnIndex + 1;
            }
            if (Math.abs(pos.x) > self.attributes.reorderDeadZone || Math.abs(pos.y) > self.attributes.reorderDeadZone) {
                setTimeout(function () {
                    self.autoScrollZone(e, pos.x, pos.y, false);
                }, 1);
            }
        };
        self.stopFreezeMove = function (e) {
            document.body.removeEventListener('mousemove', self.freezeMove, false);
            document.body.removeEventListener('mouseup', self.stopFreezeMove, false);
            self.freezeMarkerPosition = undefined;
            if (self.dispatchEvent('endfreezemove', {NativeEvent: e})) {
                self.frozenRow = self.startFreezeMove.x;
                self.frozenColumn = self.startFreezeMove.y;
                self.draw(true);
                return;
            }
            self.draw(true);
        };
        self.mousedown = function (e, overridePos) {
            self.lastMouseDownTarget = e.target;
            if (self.dispatchEvent('mousedown', {NativeEvent: e, cell: self.currentCell})) { return; }
            if (!self.hasFocus) {
                return;
            }
            if (e.button === 2 || self.input) { return; }
            var ctrl = (e.ctrlKey || e.metaKey),
                move = /-move/.test(self.dragMode),
                freeze = /frozen-row-marker|frozen-column-marker/.test(self.dragMode),
                resize = /-resize/.test(self.dragMode);
            self.dragStart = overridePos || self.getLayerPos(e);
            self.scrollStart = {
                left: self.scrollBox.scrollLeft,
                top: self.scrollBox.scrollTop
            };
            self.dragStartObject = self.getCellAt(self.dragStart.x, self.dragStart.y);
            self.dragAddToSelection = !self.dragStartObject.selected;
            if (!ctrl && !e.shiftKey && !/(vertical|horizontal)-scroll-(bar|box)/
                    .test(self.dragStartObject.context)
                    && self.currentCell
                    && !self.currentCell.isColumnHeader
                    && !move
                    && !freeze
                    && !resize) {
                self.selections = [];
            }
            if (self.dragStartObject.isGrid) {
                return;
            }
            if (self.scrollModes.indexOf(self.dragStartObject.context) !== -1) {
                self.scrollMode = self.dragStartObject.context;
                self.scrollStartMode = self.dragStartObject.context;
                self.scrollGrid(e);
                if (self.attributes.scrollPointerLock
                        && ['horizontal-scroll-box', 'vertical-scroll-box'].indexOf(self.scrollStartMode) !== -1) {
                    self.pointerLockPosition = {
                        x: self.dragStart.x,
                        y: self.dragStart.y
                    };
                    self.canvas.requestPointerLock();
                }
                document.body.addEventListener('mousemove', self.scrollGrid, false);
                document.body.addEventListener('mouseup', self.stopScrollGrid, false);
                self.ignoreNextClick = true;
                return;
            }
            if (self.dragMode === 'cell') {
                self.selecting = true;
                if (self.attributes.selectionMode === 'row') {
                    self.selectRow(self.dragStartObject.rowIndex, ctrl, null, true);
                }
                return self.mousemove(e);
            }
            if (move) {
                self.draggingItem = self.dragItem;
                self.movingSelection = self.selections.concat([]);
                self.dragging = self.dragStartObject;
                if (self.dispatchEvent('beginmove', {NativeEvent: e, cell: self.currentCell})) { return; }
                document.body.addEventListener('mousemove', self.dragMove, false);
                document.body.addEventListener('mouseup', self.stopDragMove, false);
                return self.mousemove(e);
            }
            if (freeze) {
                self.draggingItem = self.dragItem;
                self.startFreezeMove = {
                    x: self.frozenRow,
                    y: self.frozenColumn
                };
                if (self.dispatchEvent('beginfreezemove', {NativeEvent: e})) { return; }
                document.body.addEventListener('mousemove', self.freezeMove, false);
                document.body.addEventListener('mouseup', self.stopFreezeMove, false);
                return self.mousemove(e);
            }
            if (resize) {
                self.draggingItem = self.dragItem;
                if (self.draggingItem.rowOpen) {
                    self.resizingStartingHeight = self.sizes.trees[self.draggingItem.data[self.uniqueId]];
                } else {
                    self.resizingStartingHeight = self.sizes.rows[self.draggingItem.data[self.uniqueId]] || self.style.cellHeight;
                }
                self.resizingStartingWidth = self.sizes.columns[self.draggingItem.header.style === 'rowHeaderCell'
                       ? 'cornerCell' : self.draggingItem.header[self.uniqueId]] || self.draggingItem.width;
                document.body.addEventListener('mousemove', self.dragResizeColumn, false);
                document.body.addEventListener('mouseup', self.stopDragResize, false);
            }
            if (['row-reorder', 'column-reorder'].indexOf(self.dragMode) !== -1) {
                self.draggingItem = self.dragStartObject;
                document.body.addEventListener('mousemove', self.dragReorder, false);
                document.body.addEventListener('mouseup', self.stopDragReorder, false);
            }
        };
        self.mouseup = function (e) {
            clearTimeout(self.scrollTimer);
            self.cellBoundaryCrossed = true;
            self.selecting = undefined;
            self.draggingItem = undefined;
            self.dragStartObject = undefined;
            if (self.dispatchEvent('mouseup', {NativeEvent: e, cell: self.currentCell})) { return; }
            if (!self.hasFocus && e.target !== self.canvas) {
                return;
            }
            if (self.currentCell && self.currentCell.grid !== undefined) {
                return;
            }
            if (self.contextMenu || self.input) { return; }
            if (self.dragStart && self.isInGrid(self.dragStart)) {
                self.controlInput.focus();
            }
            e.preventDefault();
        };
        self.keydown = function (e) {
            var i,
                x = self.activeCell.columnIndex,
                y = self.activeCell.rowIndex,
                ctrl = (e.ctrlKey || e.metaKey),
                last = self.data.length - 1,
                cols = self.getVisibleSchema().length - 1;
            if (self.dispatchEvent('keydown', {NativeEvent: e, cell: self.currentCell})) { return; }
            if (!self.hasFocus) {
                return;
            }
            self.page = self.visibleRows.length - 3 - self.attributes.pageUpDownOverlap;
            if (self.attributes.showNewRow) {
                last += 1;
            }
            if (e.keyCode === 9) {
                e.preventDefault();
            }
            // esc
            if (e.keyCode === 27) {
                self.selections = [];
                self.draw(true);
            // ctrl + a
            } else if (ctrl && e.keyCode === 65) {
                self.selectAll();
            //ArrowDown
            } else if (e.keyCode === 40) {
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
                return self.beginEditAt(x, y);
            }
            //Space
            if (e.keyCode === 32) {
                self.selections = [];
                self.selections[Math.max(y, 0)] = [];
                self.selections[Math.max(y, 0)].push(x);
                self.selectionBounds = self.getSelectionBounds();
                if (self.attributes.selectionMode === 'row') {
                    for (i = self.selectionBounds.top; i <= self.selectionBounds.bottom; i += 1) {
                        self.selectRow(i, ctrl, null, true);
                    }
                } else {
                    self.selectArea(undefined, ctrl);
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
                self.selectionBounds = self.getSelectionBounds();
                self.selectArea(undefined, ctrl);
                self.draw(true);
            }
            if (x !== self.activeCell.columnIndex || y !== self.activeCell.rowIndex) {
                self.scrollIntoView(x !== self.activeCell.columnIndex ? x : undefined, y !== self.activeCell.rowIndex ? y : undefined);
                self.setActiveCell(x, y);
                if (!e.shiftKey && self.attributes.selectionFollowsActiveCell) {
                    if (!ctrl) {
                        self.selections = [];
                    }
                    self.selections[y] = self.selections[y] || [];
                    self.selections[y].push(x);
                    self.dispatchEvent('selectionchanged', {
                        selectedData: self.getSelectedData(),
                        selections: self.selections,
                        selectionBounds: self.selectionBounds
                    });
                }
                self.draw(true);
            }
        };
        self.keyup = function (e) {
            if (self.dispatchEvent('keyup', {NativeEvent: e, cell: self.currentCell})) { return; }
            if (!self.hasFocus) {
                return;
            }
        };
        self.keypress = function (e) {
            if (!self.hasFocus) {
                return;
            }
            if (self.dispatchEvent('keypress', {NativeEvent: e, cell: self.currentCell})) { return; }
        };
        self.dblclick = function (e) {
            if (self.dispatchEvent('dblclick', {NativeEvent: e, cell: self.currentCell})) { return; }
            if (!self.hasFocus) {
                return;
            }
            if (self.currentCell.context === 'ew-resize'
                    && self.currentCell.style === 'columnHeaderCell') {
                self.fitColumnToValues(self.currentCell.header.name);
            } else if (self.currentCell.context === 'ew-resize'
                    && self.currentCell.style === 'cornerCell') {
                self.autosize();
            } else if (['cell', 'activeCell'].indexOf(self.currentCell.style) !== -1) {
                self.beginEditAt(self.currentCell.columnIndex, self.currentCell.rowIndex);
            }
        };
        self.scrollWheel = function (e) {
            var l,
                t,
                deltaX = e.deltaX === undefined ? e.NativeEvent.deltaX : e.deltaX,
                deltaY = e.deltaY === undefined ? e.NativeEvent.deltaY : e.deltaY,
                deltaMode = e.deltaMode === undefined ? e.NativeEvent.deltaMode : e.deltaMode;
            if (wheeling) {
                return;
            }
            if (self.dispatchEvent('wheel', {NativeEvent: e})) {
                return;
            }
            e = e.NativeEvent || e;
            self.touchHaltAnimation = true;
            l = self.scrollBox.scrollLeft;
            t = self.scrollBox.scrollTop;
            if (self.hasFocus) {
                //BUG Issue 42: https://github.com/TonyGermaneri/canvas-datagrid/issues/42
                //https://stackoverflow.com/questions/20110224/what-is-the-height-of-a-line-in-a-wheel-event-deltamode-dom-delta-line
                if (deltaMode === 1) {
                    // line mode = 17 pixels per line
                    deltaY = deltaY * 17;
                }
                if ((self.scrollBox.scrollTop < self.scrollBox.scrollHeight && deltaY > 0)
                        || (self.scrollBox.scrollLeft < self.scrollBox.scrollWidth && deltaX > 0)
                        || (self.scrollBox.scrollTop > 0 && deltaY < 0)
                        || (self.scrollBox.scrollLeft > 0 && deltaX < 0)) {
                    e.preventDefault(e);
                }
                wheeling = setTimeout(function () {
                    wheeling = undefined;
                    self.scrollBox.scrollTo(deltaX + l, deltaY + t);
                }, 1);
            }
        };
        self.pasteItem = function (clipData, x, y, mimeType) {
            var l, s = self.getVisibleSchema(), yi = y - 1, sel = [];
            function normalizeRowData(importingRow, existingRow, offsetX, schema, mimeType, rowIndex) {
                var r = existingRow;
                if (!Array.isArray(importingRow) && importingRow !== null && typeof importingRow === 'object') {
                    importingRow = Object.keys(importingRow).map(function (colKey) {
                        return importingRow[colKey];
                    });
                }
                if (/^text\/html/.test(mimeType)) {
                    importingRow = importingRow.substring(4, importingRow.length - 5).split('</td><td>');
                }
                if (typeof importingRow === 'string') {
                    importingRow = [importingRow];
                }
                sel[rowIndex] = [];
                importingRow.forEach(function (cellData, colIndex) {
                    var cName = schema[colIndex + offsetX].name;
                    if (importingRow[colIndex] === undefined || importingRow[colIndex] === null) {
                        r[cName] = existingRow[cName];
                        return;
                    }
                    sel[rowIndex].push(colIndex + offsetX);
                    r[cName] = importingRow[colIndex];
                });
                return r;
            }
            if (/^text\/html/.test(mimeType)) {
                if (!/^(<meta[^>]+>)?<table>/.test(clipData.substring(0, 29))) {
                    console.warn('Unrecognized HTML format.  HTML must be a simple table, e.g.: <table><tr><td>data</td></tr></table>.  Data with the mime type text/html not in this format will not be imported as row data.');
                    return;
                }
                // strip table beginning and ending off, then split at rows
                clipData = clipData.substring(clipData.indexOf('<table><tr>') + 11, clipData.length - 13).split('</tr><tr>');
            } else {
                clipData = clipData.split('\n');
            }
            l = clipData.length;
            clipData.forEach(function (rowData) {
                yi += 1;
                self.data[yi] = normalizeRowData(rowData, self.data[yi], x, s, mimeType, yi);
            });
            self.selections = sel;
            return l;
        };
        self.paste = function (e) {
            var d;
            function getItem(dti) {
                var type = dti.type;
                dti.getAsString(function (s) {
                    self.pasteItem(s, self.activeCell.columnIndex, self.activeCell.rowIndex, type);
                    self.draw();
                });
            }
            d = Array.prototype.filter.call(e.clipboardData.items, function (dti) {
                return dti.type === 'text/html';
            })[0] || Array.prototype.filter(function (dti) {
                return dti.type === 'text/csv';
            })[0] || Array.prototype.filter(function (dti) {
                return dti.type === 'text/plain';
            })[0];
            if (!d) {
                console.warn('Cannot find supported clipboard data type.  Supported types are text/html, text/csv, text/plain.');
                return;
            }
            getItem(d);
        };
        self.cut = function (e) {
            self.copy(e);
            self.forEachSelectedCell(function (data, index, colName) {
                data[index][colName] = '';
            });
        };
        self.copy = function (e) {
            if (self.dispatchEvent('copy', {NativeEvent: e})) { return; }
            if (!self.hasFocus || !e.clipboardData) { return; }
            var t,
                d,
                rows = [],
                trows = [],
                sData = self.getSelectedData();
            function fCopyCell(d) {
                d = d === null || d === undefined ? '' : d;
                return '<td>' + (typeof d === 'string' ? d.replace(/</g, '&lt;').replace(/>/g, '&gt;') : d) + '</td>';
            }
            if (sData.length > 0) {
                sData.forEach(function (row) {
                    if (row) {
                        // r = array for HTML, rt = array for plain text
                        var r = [],
                            rt = [];
                        Object.keys(row).forEach(function (key) {
                            // escape strings
                            if (row[key] !== null
                                    && row[key] !== false
                                    && row[key] !== undefined
                                    && row[key].replace) {
                                rt.push('"' + row[key].replace(/"/g, '""') + '"');
                                r.push(fCopyCell(row[key]));
                                return;
                            }
                            rt.push(row[key]);
                            r.push(fCopyCell(row[key]));
                        });
                        rows.push(r.join(''));
                        trows.push(rt.join(','));
                    }
                });
                d = '<table><tr>' + rows.join('</tr><tr>') + '</tr></table>';
                t = trows.join('\n');
                e.clipboardData.setData('text/html', d);
                e.clipboardData.setData('text/plain', t);
                e.clipboardData.setData('text/csv', t);
                e.preventDefault();
            }
        };
        return;
    };
});
