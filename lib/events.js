/*jslint browser: true, unparam: true, todo: true, plusplus: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([], function () {
    'use strict';
    return function (self) {
        var wheeling;
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
            e = ev.type ? ev : (e || {});
            ev = ev.type || ev;
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
        self.getRatio = function () {
            return Math.min(self.attributes.maxPixelRatio, (window.devicePixelRatio || 1) /
                (self.ctx.webkitBackingStorePixelRatio ||
                    self.ctx.mozBackingStorePixelRatio ||
                    self.ctx.msBackingStorePixelRatio ||
                    self.ctx.oBackingStorePixelRatio ||
                    self.ctx.backingStorePixelRatio || 1));
        };
        self.resize = function (drawAfterResize) {
            if (!self.canvas) { return; }
            var x,
                v = {
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
                    isCorner: true,
                    isScrollBoxCorner: true,
                    style: 'scroll-box-corner'
                },
                m = (self.style.scrollBarBoxMargin * 2),
                b = (self.style.scrollBarBorderWidth * 2),
                d = self.style.scrollBarBoxMargin * 0.5,
                sbw = self.style.scrollBarWidth + (self.style.scrollBarBorderWidth * 2),
                ratio = self.getRatio(),
                bm = self.style.gridBorderCollapse === 'collapse' ? 1 : 2,
                cellBorder = self.style.cellBorderWidth * bm,
                columnHeaderCellBorder = self.style.columnHeaderCellBorderWidth * bm,
                dataHeight = 0,
                dataWidth = 0,
                dims,
                l = (self.data || []).length,
                columnHeaderCellHeight = self.getColumnHeaderCellHeight(),
                rowHeaderCellWidth = self.getRowHeaderCellWidth(),
                ch = self.style.cellHeight,
                s = self.getSchema();
            // sets actual DOM canvas element
            function checkScrollBoxVisibility() {
                self.scrollBox.horizontalBarVisible = (self.style.width !== 'auto' && dataWidth > self.scrollBox.width && self.style.overflowX !== 'hidden')
                    || self.style.overflowX === 'scroll';
                self.scrollBox.horizontalBoxVisible = dataWidth > self.scrollBox.width;
                self.scrollBox.verticalBarVisible = (self.style.height !== 'auto' && dataHeight > self.scrollBox.height && self.style.overflowY !== 'hidden')
                    || self.style.overflowY === 'scroll';
                self.scrollBox.verticalBoxVisible = dataHeight > self.scrollBox.height;
            }
            function setScrollBoxSize() {
                self.scrollBox.width = self.width - rowHeaderCellWidth;
                self.scrollBox.height = self.height - columnHeaderCellHeight;
            }
            function setCanvasSize() {
                if (self.isChildGrid) {
                    return;
                }
                dims = {
                    // HACK +1 ? maybe it's a magic cell border?  Required to line up properly in auto height mode.
                    height: columnHeaderCellHeight + dataHeight + cellBorder + 1,
                    width: dataWidth + rowHeaderCellWidth + cellBorder
                };
                ['width', 'height'].forEach(function (dim) {
                    //TODO: support inherit
                    if (['auto', undefined].indexOf(self.style[dim]) !== -1
                            && ['auto', undefined].indexOf(self.appliedInlineStyles[dim]) !== -1) {
                        self.parentNodeStyle[dim] = dims[dim] + 'px';
                    } else if (['auto', undefined].indexOf(self.style[dim]) == -1
                            && ['auto', undefined].indexOf(self.appliedInlineStyles[dim]) == -1) {
                        self.parentNodeStyle[dim] = self.style[dim];
                        if (self.isComponet) {
                            self.canvas.style[dim] = self.style[dim];
                        }
                    }
                });
            }
            self.scrollCache.x = [];
            self.scrollCache.y = [];
            for (x = 0; x < l; x += 1) {
                self.scrollCache.y[x] = dataHeight;
                dataHeight += (((self.sizes.rows[x] || ch) + (self.sizes.trees[x] || 0)) * self.scale)
                    // HACK? if an expanded tree row is frozen it is necessary to add the tree row's height a second time.
                    + (self.frozenRow > x ? (self.sizes.trees[x] || 0) : 0);
            }
            if (l > 1) {
                self.scrollCache.y[x] = dataHeight;
            }
            dataWidth = s.reduce(function reduceSchema(accumulator, column, columnIndex) {
                // intentional redefintion of column.  This causes scrollCache to be in the correct order
                column = s[self.orders.columns[columnIndex]];
                if (column.hidden) {
                    self.scrollCache.x[columnIndex] = accumulator;
                    return accumulator;
                }
                var va = accumulator + self.getColummnWidth(self.orders.columns[columnIndex]);
                self.scrollCache.x[columnIndex] = va;
                return va;
            }, 0) || 0;
            if (self.attributes.showNewRow) {
                dataHeight += ch;
            }
            if (self.attributes.snapToRow) {
              dataHeight += self.style.cellHeight;
            }
            setCanvasSize();
            if (self.isChildGrid) {
                self.width = self.parentNode.offsetWidth;
                self.height = self.parentNode.offsetHeight;
            } else if (self.height !== self.canvas.offsetHeight || self.width !== self.canvas.offsetWidth) {
                self.height = self.canvas.offsetHeight;
                self.width = self.canvas.offsetWidth;
                self.canvasOffsetLeft = self.args.canvasOffsetLeft || 0;
                self.canvasOffsetTop = self.args.canvasOffsetTop || 0;
            }
            /// calculate scroll bar dimensions
            // non-controversial
            self.scrollBox.top = columnHeaderCellHeight + columnHeaderCellBorder;
            self.scrollBox.left = rowHeaderCellWidth;
            // width and height of scroll box
            setScrollBoxSize();
            // is the data larger than the scroll box
            checkScrollBoxVisibility();
            // if the scroll box is visible, make room for it by expanding the size of the element
            // if the other dimension is set to auto
            if (self.scrollBox.horizontalBarVisible) {
                if (self.style.height === 'auto' && !self.isChildGrid) {
                    self.height += sbw;
                }
                dataHeight += sbw;
                setCanvasSize();
                setScrollBoxSize();
                checkScrollBoxVisibility();
            }
            if (self.scrollBox.verticalBarVisible) {
                if (self.style.width === 'auto' && !self.isChildGrid) {
                    self.width += sbw;
                }
                dataWidth += sbw;
                setCanvasSize();
                setScrollBoxSize();
                checkScrollBoxVisibility();
            }
            // set again after bar visibility checks
            setScrollBoxSize();
            self.scrollBox.scrollWidth = dataWidth - self.scrollBox.width;
            self.scrollBox.scrollHeight = dataHeight - self.scrollBox.height;
            self.scrollBox.widthBoxRatio = self.scrollBox.width / dataWidth;
            self.scrollBox.scrollBoxWidth = self.scrollBox.width
                * self.scrollBox.widthBoxRatio
                - self.style.scrollBarWidth - b - d;
            // TODO: This heightBoxRatio number is terribly wrong.
            // They should be a result of the size of the grid/canvas?
            // it being off causes the scroll bar to "slide" under
            // the dragged mouse.
            // https://github.com/TonyGermaneri/canvas-datagrid/issues/97
            self.scrollBox.heightBoxRatio = (self.scrollBox.height - columnHeaderCellHeight) / dataHeight;
            self.scrollBox.scrollBoxHeight = self.scrollBox.height
                * self.scrollBox.heightBoxRatio
                - self.style.scrollBarWidth - b - d;
            self.scrollBox.scrollBoxWidth = Math.max(self.scrollBox.scrollBoxWidth, self.style.scrollBarBoxMinSize);
            self.scrollBox.scrollBoxHeight = Math.max(self.scrollBox.scrollBoxHeight, self.style.scrollBarBoxMinSize);
            // horizontal
            n.x += rowHeaderCellWidth;
            n.y += self.height - self.style.scrollBarWidth - d;
            n.width = self.width - self.style.scrollBarWidth - rowHeaderCellWidth - d - m;
            n.height = self.style.scrollBarWidth + self.style.scrollBarBorderWidth + d;
            // horizontal box
            nb.y = n.y + self.style.scrollBarBoxMargin;
            nb.width = self.scrollBox.scrollBoxWidth;
            nb.height = self.style.scrollBarBoxWidth;
            // vertical
            v.x += self.width - self.style.scrollBarWidth - self.style.scrollBarBorderWidth - d;
            v.y += columnHeaderCellHeight;
            v.width = self.style.scrollBarWidth + self.style.scrollBarBorderWidth + d;
            v.height = self.height - columnHeaderCellHeight - self.style.scrollBarWidth - d - m;
            // vertical box
            vb.x = v.x + self.style.scrollBarBoxMargin;
            vb.width = self.style.scrollBarBoxWidth;
            vb.height = self.scrollBox.scrollBoxHeight;
            // corner
            co.x = n.x + n.width + m;
            co.y = v.y + v.height + m;
            co.width = self.style.scrollBarWidth + self.style.scrollBarBorderWidth;
            co.height = self.style.scrollBarWidth + self.style.scrollBarBorderWidth;
            self.scrollBox.entities = {
                horizontalBar: n,
                horizontalBox: nb,
                verticalBar: v,
                verticalBox: vb,
                corner: co
            };
            self.scrollBox.bar = {
                v: v,
                h: n
            };
            self.scrollBox.box = {
                v: vb,
                h: nb
            };
            /// calculate page and dom elements
            self.page = Math.max(1, self.visibleRows.length - 3 - self.attributes.pageUpDownOverlap);
            // set canvas drawing related items
            if (!self.isChildGrid) {
                self.canvas.width = self.width * ratio;
                self.canvas.height = self.height * ratio;
                self.ctx.scale(ratio, ratio);
            }
            // resize any open dom elements (input/textarea)
            self.resizeEditInput();
            self.scroll(true);
            if (drawAfterResize) {
                self.draw(true);
            }
            self.dispatchEvent('resize', {});
            return true;
        };
        self.scroll = function (dontDraw) {
            var s = self.getSchema(),
                l = (self.data || []).length,
                ch = self.style.cellHeight;
            // go too far in leaps, then get focused
            self.scrollIndexTop = Math.floor((l * (self.scrollBox.scrollTop / self.scrollBox.scrollHeight)) - 100);
            self.scrollIndexTop = Math.max(self.scrollIndexTop, 0);
            self.scrollPixelTop = self.scrollCache.y[self.scrollIndexTop];
            // sometimes the grid is rendered but the height is zero
            if (self.scrollBox.scrollHeight === 0) {
                self.scrollIndexTop = 0;
            }
            self.scrollPixelTop = 0;
            self.scrollIndexLeft = self.frozenColumn;
            self.scrollPixelLeft = 0;
            while (self.scrollPixelTop < self.scrollBox.scrollTop && self.scrollIndexTop < self.data.length) {
                // start on index +1 since index 0 was used in "go too far" section above
                self.scrollIndexTop += 1;
                self.scrollPixelTop = self.scrollCache.y[self.scrollIndexTop];
            }
            while (self.scrollPixelLeft < (self.scrollBox.scrollLeft + 1) && self.scrollIndexLeft < s.length) {
                self.scrollPixelLeft = self.scrollCache.x[self.scrollIndexLeft];
                self.scrollIndexLeft += 1;
            }
            if (s.length > 0) {
                self.scrollIndexLeft = Math.max(self.scrollIndexLeft - 1, 0);
                self.scrollPixelLeft -= self.getColummnWidth(self.orders.columns[self.scrollIndexLeft]);
            }
            if ((self.data || []).length > 0) {
                self.scrollIndexTop = Math.max(self.scrollIndexTop - 1, 0);
                self.scrollPixelTop = Math.max((self.scrollPixelTop
                    - (
                        self.data[self.scrollIndexTop] ? (self.sizes.rows[self.scrollIndexTop] || ch)
                                + (self.sizes.trees[self.scrollIndexTop] || 0)
                        : ch
                    ) * self.scale), 0);
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
            var ctrl = ((e.ctrlKey || e.metaKey || self.attributes.persistantSelectionMode) && !self.attributes.singleSelectionMode),
                i,
                s = self.getSchema(),
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
            if (o && self.currentCell) {
                self.rowBoundaryCrossed = self.currentCell.rowIndex !== o.rowIndex;
                self.columnBoundaryCrossed = self.currentCell.columnIndex !== o.columnIndex;
                self.cellBoundaryCrossed = self.rowBoundaryCrossed || self.columnBoundaryCrossed;
                ['row', 'column', 'cell'].forEach(function (prefix) {
                    if (self[prefix + 'BoundaryCrossed']) {
                        ev.cell = previousCell;
                        self.dispatchEvent(prefix + 'mouseout', ev);
                        ev.cell = o;
                        self.dispatchEvent(prefix + 'mouseover', ev);
                    }
                });
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
                self.cursor = o.context;
                if (o.context === 'cell') {
                    self.cursor = 'default';
                    self.hovers = { rowIndex: o.rowIndex, columnIndex: o.columnIndex };
                }
                if ((self.selecting || self.reorderObject)
                        && o.context === 'cell') {
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
                        sBounds = self.getSelectionBounds();
                        dragBounds.left = -1;
                        dragBounds.right = s.length - 1;
                        dragBounds.top = Math.min(sBounds.top, o.rowIndex);
                        dragBounds.bottom = Math.max(sBounds.bottom, o.rowIndex);
                    }
                    if (self.dragStartObject.rowIndex !== o.rowIndex
                                || self.dragStartObject.columnIndex !== o.columnIndex) {
                        self.ignoreNextClick = true;
                    }
                    if (self.cellBoundaryCrossed || (delta.x === 0 && delta.y === 0) || (self.attributes.selectionMode === 'row')) {
                        if (((self.attributes.selectionMode === 'row') || self.dragStartObject.columnIndex === -1)
                                && self.rowBoundaryCrossed) {
                            self.selectRow(o.rowIndex, ctrl, null, true);
                        } else if (self.attributes.selectionMode !== 'row') {
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
                        } else if (dragBounds.top !== -1) {
                            self.selectArea(sBounds, true);
                        }
                    }
                    self.autoScrollZone(e, x, y, ctrl);
                }
            }
            self.cellBoundaryCrossed = false;
            self.rowBoundaryCrossed = false;
            self.columnBoundaryCrossed = false;
            self.draw(true);
        };
        self.click = function (e, overridePos) {
            var i,
                startingBounds = JSON.stringify(self.getSelectionBounds()),
                ctrl = ((e.ctrlKey || e.metaKey || self.attributes.persistantSelectionMode) && !self.attributes.singleSelectionMode),
                pos = overridePos || self.getLayerPos(e);
            self.currentCell = self.getCellAt(pos.x, pos.y);
            if (self.currentCell.grid !== undefined) {
                return;
            }
            function checkSelectionChange() {
                var ev, sb = self.getSelectionBounds();
                if (startingBounds === JSON.stringify(sb)) {
                    return;
                }
                ev = {
                    selections: self.selections,
                    selectionBounds: self.getSelectionBounds()
                };
                Object.defineProperty(ev, 'selectedData', {
                    get: function () {
                        return self.getSelectedData();
                    }
                });
                self.dispatchEvent('selectionchanged', ev);
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
                        self.selectColumn(i.header.index, ctrl, e.shiftKey);
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
                       ? 'cornerCell' : self.draggingItem.sortColumnIndex] = x;
                if (['rowHeaderCell', 'cornerCell'].indexOf(self.draggingItem.header.style) !== -1) {
                    self.resize(true);
                }
                self.resizeChildGrids();
                return;
            }
            if (self.dragMode === 'ns-resize') {
                if (self.draggingItem.rowOpen) {
                    self.sizes.trees[self.draggingItem.rowIndex] = y;
                } else if (self.attributes.globalRowResize) {
                    self.style.cellHeight = y;
                } else {
                    self.sizes.rows[self.draggingItem.rowIndex] = y;
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
            document.removeEventListener('mousemove', self.scrollGrid, false);
        };
        self.dragReorder = function (e) {
            var pos, x, y,
                columReorder = self.dragMode === 'column-reorder',
                rowReorder = self.dragMode === 'row-reorder';
            pos = self.getLayerPos(e);
            x = pos.x - self.dragStart.x;
            y = pos.y - self.dragStart.y;
            if (!self.attributes.allowColumnReordering && columReorder) {
                return;
            }
            if (!self.attributes.allowRowReordering && rowReorder) {
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
                self.autoScrollZone(e, columReorder ? pos.x : -1, rowReorder ? pos.y : -1, false);
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
                    'column-reorder': 'sortColumnIndex'
                }[self.dragMode];
            document.body.removeEventListener('mousemove', self.dragReorder, false);
            document.body.removeEventListener('mouseup', self.stopDragReorder, false);
            if (self.reorderObject
                    && self.reorderTarget
                    && ((self.dragMode === 'column-reorder' && self.reorderTarget.sortColumnIndex > -1
                        && self.reorderTarget.sortColumnIndex < self.getSchema().length)
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
                if(self.dragMode === 'column-reorder') {
                  self.orders.columns = cr[self.dragMode];
                } else {
                  self.orders.rows = cr[self.dragMode];
                }
                self.resize();
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
            if (self.dispatchEvent('endfreezemove', {NativeEvent: e, cell: self.currentCell})) {
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
                document.addEventListener('mousemove', self.scrollGrid, false);
                document.addEventListener('mouseup', self.stopScrollGrid, false);
                self.ignoreNextClick = true;
                return;
            }
            if (self.dragMode === 'cell') {
                self.selecting = true;
                if ((self.attributes.selectionMode === 'row' || self.dragStartObject.columnIndex === -1)
                        && self.dragStartObject.rowIndex > -1) {
                    self.selectRow(self.dragStartObject.rowIndex, ctrl, null);
                } else if (self.attributes.selectionMode !== 'row') {
                    self.mousemove(e);
                }
                return;
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
                    self.resizingStartingHeight = self.sizes.trees[self.draggingItem.rowIndex];
                } else {
                    self.resizingStartingHeight = self.sizes.rows[self.draggingItem.rowIndex] || self.style.cellHeight;
                }
                self.resizingStartingWidth = self.sizes.columns[self.draggingItem.header.style === 'rowHeaderCell'
                       ? 'cornerCell' : self.draggingItem.sortColumnIndex] || self.draggingItem.width;
                document.body.addEventListener('mousemove', self.dragResizeColumn, false);
                document.body.addEventListener('mouseup', self.stopDragResize, false);
                return;
            }
            if (['row-reorder', 'column-reorder'].indexOf(self.dragMode) !== -1) {
                self.draggingItem = self.dragStartObject;
                document.body.addEventListener('mousemove', self.dragReorder, false);
                document.body.addEventListener('mouseup', self.stopDragReorder, false);
                return;
            }
        };
        self.mouseup = function (e) {
            clearTimeout(self.scrollTimer);
            self.cellBoundaryCrossed = true;
            self.rowBoundaryCrossed = true;
            self.columnBoundaryCrossed = true;
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
        // gets the horizontal adjacent cells as well as first/last based on column visibility
        self.getAdjacentCells = function () {
            var x,
                i,
                s = self.getSchema(),
                o = {};
            for (x = 0; x < s.length; x += 1) {
                i = self.orders.columns[x];
                if (!s[i].hidden) {
                    if (o.first === undefined) {
                        o.first = x;
                        o.left = x;
                    }
                    o.last = x;
                    if (x > self.activeCell.columnIndex && o.right === undefined) {
                        o.right = x;
                    }
                    if (x < self.activeCell.columnIndex) {
                        o.left = x;
                    }
                }
            }
            if (o.right === undefined) {
                o.right = o.last;
            }
            return o;
        };
        self.keydown = function (e) {
            var i,
                ev,
                adjacentCells = self.getAdjacentCells(),
                x = self.activeCell.columnIndex,
                y = self.activeCell.rowIndex,
                ctrl = (e.ctrlKey || e.metaKey),
                last = self.data.length - 1,
                s = self.getSchema(),
                cols = s.length - 1;

            var defaultPrevented = self.dispatchEvent('keydown', {
                NativeEvent: e,
                cell: self.currentCell
            });

            if (defaultPrevented) {
                return;
            }

            if (!self.hasFocus) {
                return;
            }

            if (self.attributes.showNewRow) {
                last += 1;
            }

            if (e.key === "Tab") {
                e.preventDefault();
            }

            if (e.key === "Escape") {
                self.selections = [];
                self.draw(true);
            } else if (ctrl && e.key === "a") {
                self.selectAll();
            } else if (e.key === "ArrowDown") {
                y += 1;
            } else if (e.key === "ArrowUp") {
                y -= 1;
            } else if (e.key === "ArrowLeft" || (e.shiftKey && e.key === "Tab")) {
                x = adjacentCells.left;
            } else if (e.key === "ArrowRight" || (!e.shiftKey && e.key === "Tab")) {
                x = adjacentCells.right;
            } else if (e.key === "PageUp") {
                y -= self.page;
                e.preventDefault();
            } else if (e.key === "PageDown") {
                y += self.page;
                e.preventDefault();
            } else if (e.key === "Home" || (ctrl && e.key === "ArrowUp")) {
                y = 0;
            } else if (e.key === "End" || (ctrl && e.key === "ArrowDown")) {
                y = self.data.length - 1;
            } else if (ctrl && e.key === "ArrowRight") {
                x = adjacentCells.last;
            } else if (ctrl && e.key === "ArrowLeft") {
                x = adjacentCells.first;
            }

            if (e.key === "Enter") {
                return self.beginEditAt(x, y, e);
            }

            if (e.key === "Space") {
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
            if (x < 0 || Number.isNaN(x)) {
                x = adjacentCells.first;
            }
            if (y > last) {
                y = last;
            }
            if (y < 0 || Number.isNaN(y)) {
                y = 0;
            }
            if (x > cols) {
                x = adjacentCells.last;
            }

            // TODO - most likely some column order related bugs in key based selection
            // Arrows
            var isArrowKey = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(e.key);
            
            if (e.shiftKey && isArrowKey) {
                self.selections[Math.max(y, 0)] = self.selections[Math.max(y, 0)] || [];
                self.selections[Math.max(y, 0)].push(x);
            
                self.selectionBounds = self.getSelectionBounds();
                self.selectArea(undefined, ctrl);
            
                self.draw(true);
            }

            if (x !== self.activeCell.columnIndex || y !== self.activeCell.rowIndex) {
                self.scrollIntoView(
                  x !== self.activeCell.columnIndex ? x : undefined,
                  y !== self.activeCell.rowIndex && !Number.isNaN(y) ? y : undefined
                );

                self.setActiveCell(x, y);
                if (!e.shiftKey && self.attributes.selectionFollowsActiveCell) {
                    if (!ctrl) {
                        self.selections = [];
                    }
                    self.selections[y] = self.selections[y] || [];
                    self.selections[y].push(x);
                    ev = {
                        selectedData: self.getSelectedData(),
                        selections: self.selections,
                        selectionBounds: self.getSelectionBounds()
                    };
                    Object.defineProperty(ev, 'selectedData', {
                        get: function () {
                            return self.getSelectedData();
                        }
                    });
                    self.dispatchEvent('selectionchanged', ev);
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
                ev = e,
                deltaX = e.deltaX === undefined ? e.NativeEvent.deltaX : e.deltaX,
                deltaY = e.deltaY === undefined ? e.NativeEvent.deltaY : e.deltaY,
                deltaMode = e.deltaMode === undefined ? e.NativeEvent.deltaMode : e.deltaMode;
            if (wheeling) {
                return;
            }
            if (self.dispatchEvent('wheel', {NativeEvent: e})) {
                return;
            }
            var e = e.NativeEvent || e;
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
                if ((self.scrollBox.scrollTop  < self.scrollBox.scrollHeight && deltaY > 0)
                        || (self.scrollBox.scrollLeft < self.scrollBox.scrollWidth && deltaX > 0)
                        || (self.scrollBox.scrollTop > 0 && deltaY < 0)
                        || (self.scrollBox.scrollLeft > 0 && deltaX < 0)) {
                    ev.preventDefault(e);
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
                // ditch any headers on the table
                clipData = clipData.filter(function (row) {
                    return !/^<th>|^<thead>/.test(row);
                });
            } else {
                clipData = clipData.split('\n');
            }
            l = clipData.length;
            clipData.forEach(function (rowData) {
                yi += 1;
                var i = self.orders.rows[yi];
                self.data[i] = normalizeRowData(rowData, self.data[i], x, s, mimeType, i);
            });
            self.selections = sel;
            return l;
        };
        self.getNextVisibleColumnIndex = function (visibleColumnIndex) {
            var x, s = self.getVisibleSchema();
            for (x = 0; x < s.length; x += 1) {
                if (s[x].columnIndex === visibleColumnIndex) {
                    return s[x + 1].columnIndex;
                }
            }
            return -1;
        };
        self.getVisibleColumnIndexOf = function (columnIndex) {
            var x, s = self.getVisibleSchema();
            for (x = 0; x < s.length; x += 1) {
                if (s[x].columnIndex === columnIndex) {
                    return x;
                }
            }
            return -1;
        };
        self.paste = function (event) {
            var clipboardItems = new Map(
                Array.from(event.clipboardData.items).map(item => [item.type, item])
            );

            // Supported MIME types, in order of preference:
            var supportedMimeTypes = ['text/html', 'text/csv', 'text/plain'];

            // The clipboard will often contain the same data in multiple formats,
            // which can be used depending on the context in which it's pasted. Here
            // we'll prefere more structured (HTML/CSV) over less structured, when
            // available, so we try to find those first:
            var pasteableItems = supportedMimeTypes.map(
                mimeType => clipboardItems.get(mimeType)
            ).filter(item => !!item); // filter out not-found MIME types (= undefined)

            if (pasteableItems.length === 0) {
                console.warn('Cannot find supported clipboard data type. Supported types are:', supportedMimeTypes.join(', '));
                return;
            }

            var itemToPaste = pasteableItems[0];

            // itemToPaste is cleared once accessed (getData or getAsString),
            // so we need to store the type here, before reading its value:
            var pasteType = itemToPaste.type;

            itemToPaste.getAsString(function (pasteValue) {
                self.pasteItem(
                    pasteValue,
                    self.getVisibleColumnIndexOf(self.activeCell.columnIndex),
                    self.activeCell.rowIndex,
                    pasteType
                );

                self.draw();
            });
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
                data = (self.data || []),
                tableRows = [],
                textRows = [],
                outputHeaders = {},
                outputHeaderKeys,
                sData = self.getSelectedData(),
                s = self.getSchema();
            function htmlSafe(v) {
                return v.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
            function fCopyCell(v) {
                v = v === null || v === undefined ? '' : v;
                return '<td>' + (typeof v === 'string' ? htmlSafe(v) : v) + '</td>';
            }
            function addHeaders(headers, useHtml) {
                if (!s.length || headers.length < 2) { return ''; }
                var h = [];
                if (useHtml) {
                    h.push('<tr>');
                }
                s.forEach(function (column, columnIndex) {
                    // intentional redefinition of column
                    column = s[self.orders.columns[columnIndex]];
                    if (!column.hidden && headers.indexOf(column.name) !== -1) {
                        var ev = {NativeEvent: e, column: column};
                        if(self.dispatchEvent('copyonschema', ev)) {
                            column = ev.column;
                        }

                        var hVal = (column.name || column.title) || '';
                        if (useHtml) {
                            h.push('<th>' + htmlSafe(hVal) + '</th>');
                        } else {
                            h.push('"' + hVal.replace(/"/g, '""') + '"');
                        }
                    }
                });
                h.push(useHtml ? '</tr>' : '\n');
                return h.join(useHtml ? '' : ',');
            }
            function addCellValue(val, trRow, textRow, column) {
                // escape strings
                if (val !== null
                        && val !== false
                        && val !== undefined
                        && val.replace) {
                    trRow.push(fCopyCell(val));
                    textRow.push('"' + val.replace(/"/g, '""') + '"');
                    return;
                }
                if (val !== undefined) {
                    textRow.push(val);
                    trRow.push(fCopyCell(val));
                    return;
                }
                // issue #66
                textRow.push('');
                trRow.push('<td>&nbsp;</td>');
            }
            if (sData.length > 0) {
                sData.forEach(function (row) {
                    var rowKeys = Object.keys(row);
                    if (row) {
                        var trRow = [],
                            textRow = [],
                            sSorted = [];
                        // HACK: https://github.com/TonyGermaneri/canvas-datagrid/issues/181
                        // I can't use sort here or O(1), so hacks
                        s.forEach(function (column, columnIndex) {
                            sSorted.push(s[self.orders.columns[columnIndex]]);
                        });
                        sSorted.forEach(function (column, columnIndex) {
                            if (rowKeys.indexOf(column.name) !== -1) {
                                outputHeaders[column.name] = true;
                                // escape strings
                                addCellValue(row[column.name], trRow, textRow, column);
                            }
                        });
                        tableRows.push(trRow.join(''));
                        textRows.push(textRow.join(','));
                    }
                });
                outputHeaderKeys = Object.keys(outputHeaders);
                t = addHeaders(outputHeaderKeys) + textRows.join('\n');
                d = '<table>' + addHeaders(outputHeaderKeys, true) + '<tr>' + tableRows.join('</tr><tr>') + '</tr></table>';
                if (outputHeaderKeys.length === 1) {
                    // if there was only one cell selected, remove the quotes from the string
                    t = t.substring(1, t.length -1);
                }
                e.clipboardData.setData('text/html', d);
                e.clipboardData.setData('text/plain', t);
                e.clipboardData.setData('text/csv', t);
                e.clipboardData.setData('application/json', JSON.stringify(sData));
                e.preventDefault();
            }
        };
        return;
    };
});
