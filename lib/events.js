/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([], function () {
    'use strict';
    return function (self) {
        var touchDelta = {x: 0, y: 0, scrollTop: 0, scrollLeft: 0},
            touchAnimateTo = {scrollLeft: 0, scrollTop: 0},
            touchSigma = {scrollLeft: 0, scrollTop: 0},
            xPPS = 0,
            yPPS = 0,
            touchingCell = false,
            startingCell = false,
            animationFrames = 0;
        self.getTouchPos = function (e) {
            var rect = self.canvas.getBoundingClientRect(),
                pos = {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                };
            if (self.isChildGrid) {
                pos.x -= self.canvasOffsetLeft;
                pos.y -= self.canvasOffsetTop;
            }
            return {
                x: pos.x,
                y: pos.y,
                rect: rect
            };
        };
        self.calculatePPS = function () {
            xPPS = ((touchDelta.scrollLeft - touchSigma.scrollLeft) / (touchDelta.t - touchSigma.t));
            yPPS = ((touchDelta.scrollTop - touchSigma.scrollTop) / (touchDelta.t - touchSigma.t));
            touchSigma = {
                scrollLeft: touchDelta.scrollLeft,
                scrollTop: touchDelta.scrollTop,
                t: performance.now() / 1000
            };
        };
        self.touchCell = function (e) {
            return function () {
                clearInterval(self.touchCalcTimeout);
                var pos = self.getTouchPos(e);
                if (Math.abs(touchDelta.x) + Math.abs(touchDelta.y) < self.attributes.touchDeadZone) {
                    touchingCell = self.getCellAt(pos.x, pos.y);
                    self.mousemove(e, pos);
                    self.mousedown(e, pos);
                    self.mousemove(e, pos);
                    self.draw();
                }
            };
        };
        self.touchstart = function (e) {
            touchingCell = false;
            self.touchStart = self.getTouchPos(e);
            startingCell = self.getCellAt(self.touchStart.x, self.touchStart.y, true);
            if (self.dispatchEvent('touchstart', {NativeEvent: e, cell: self.startingCell})) { return; }
            if (!self.hasFocus) { return; }
            self.stopPropagation(e);
            e.preventDefault();
            if (e.touches.length === 2) {
                return self.contextmenu(e, self.touchStart);
            }
            self.touchScrollStart = {
                scrollLeft: self.scrollBox.scrollLeft,
                scrollTop: self.scrollBox.scrollTop,
                t: performance.now() / 1000
            };
            touchDelta = {
                x: self.touchStart.x,
                y: self.touchStart.y,
                scrollLeft: self.scrollBox.scrollLeft,
                scrollTop: self.scrollBox.scrollTop,
                t: 0
            };
            self.touchmove(e);
            clearTimeout(self.touchTimeout);
            clearInterval(self.touchCalcTimeout);
            self.touchTimeout = setTimeout(self.touchCell(e), self.attributes.touchSelectTimeMs);
            self.touchCalcTimeout = setInterval(self.calculatePPS, 20);
            self.touchHaltAnimation = true;
            document.body.addEventListener('touchmove', self.touchmove, {passive: false});
            document.body.addEventListener('touchend', self.touchend, false);
            document.body.addEventListener('touchcancel', self.touchcancel, false);
        };
        self.easing = function (t, b, c, d) {
            return c * (t / d) * (2 - t) + b;
        };
        self.touchEndAnimation = function () {
            if (!self.canvas || !self.scrollBox.scrollTo) { return requestAnimationFrame(self.touchEndAnimation); }
            var x,
                y,
                n = performance.now() / 1000,
                d = (self.attributes.touchReleaseAnimationDurationMs / 1000),
                t;
            touchDelta.t = touchDelta.t || n + d;
            t = n - touchDelta.t + 1;
            if (t > 1 || self.touchHaltAnimation || (animationFrames > 1000)) {
                animationFrames = 0;
                self.touchHaltAnimation = false;
                touchAnimateTo = {scrollLeft: -1, scrollTop: -1};
                return;
            }
            animationFrames += 1;
            x = self.easing(t, touchDelta.scrollLeft, -touchAnimateTo.scrollLeft, d);
            y = self.easing(t, touchDelta.scrollTop, -touchAnimateTo.scrollTop, d);
            self.scrollBox.scrollTo(x, y);
            requestAnimationFrame(self.touchEndAnimation);
        };
        self.touchend = function (e) {
            if (self.dispatchEvent('touchend', {NativeEvent: e})) { return; }
            var dz = Math.abs(touchDelta.x) + Math.abs(touchDelta.y) < self.attributes.touchDeadZone,
                pos = {
                    x: self.touchStart.x + touchDelta.x,
                    y: self.touchStart.y + touchDelta.y
                },
                cell = self.getCellAt(pos.x, pos.y);
            if (!self.hasFocus) { return; }
            if (touchingCell) {
                self.mouseup(e, self.touchStart);
            } else if (dz) {
                if (cell.active) {
                    self.beginEditAt(cell.columnIndex, cell.rowIndex);
                } else {
                    self.mousedown(e, self.touchStart);
                    self.mouseup(e, self.touchStart);
                    self.click(e, self.touchStart);
                }
            }
            touchingCell = false;
            document.body.removeEventListener('touchmove', self.touchmove, {passive: false});
            document.body.removeEventListener('touchend', self.touchend, false);
            document.body.removeEventListener('touchcancel', self.touchcancel, false);
            clearTimeout(self.touchTimeout);
            clearInterval(self.touchCalcTimeout);
            self.calculatePPS();
            touchAnimateTo.scrollLeft = xPPS * self.attributes.touchReleaseAcceleration;
            touchAnimateTo.scrollTop = yPPS * self.attributes.touchReleaseAcceleration;
            self.touchHaltAnimation = false;
            if (animationFrames === 0 && !/-scroll-/.test(startingCell.style) && !dz) {
                self.touchEndAnimation();
            }
        };
        self.touchmove = function (e) {
            var d = self.getTouchPos(e);
            if (self.dispatchEvent('touchmove', {NativeEvent: e, cell: self.currentCell})) { return; }
            self.stopPropagation(e);
            e.preventDefault();
            if (!self.hasFocus) { return; }
            touchDelta = {
                x: d.x - self.touchStart.x,
                y: d.y - self.touchStart.y,
                scrollLeft: self.scrollBox.scrollLeft,
                scrollTop: self.scrollBox.scrollTop,
                t: 0
            };
            if (/vertical-scroll-/.test(startingCell.style)) {
                self.scrollBox.scrollTop = self.scrollBox.scrollHeight * (d.y / self.height);
            } else if (/horizontal-scroll-/.test(startingCell.style)) {
                self.scrollBox.scrollLeft = self.scrollBox.scrollWidth * (d.x / self.width);
            } else if (touchingCell) {
                self.mousemove(e, d);
                self.draw();
            } else {
                if (animationFrames === 0) {
                    self.scrollBox.scrollTo(self.touchScrollStart.scrollLeft - touchDelta.x,
                        self.touchScrollStart.scrollTop - touchDelta.y);
                }
            }
        };
        self.touchcancel = function (e) {
            if (self.dispatchEvent('touchcancel', {NativeEvent: e, cell: self.currentCell})) { return; }
            if (!self.hasFocus) { return; }
            touchingCell = false;
            document.body.removeEventListener('touchmove', self.touchmove, {passive: false});
            document.body.removeEventListener('touchend', self.touchend, false);
            document.body.removeEventListener('touchcancel', self.touchcancel, false);
            return;
        };
        self.stopPropagation = function (e) { e.stopPropagation(); };
        self.addEventListener = function (ev, fn) {
            self.events[ev] = self.events[ev] || [];
            self.events[ev].unshift(fn);
        };
        self.removeEventListener = function (ev, fn) {
            (self.events[ev] || []).forEach(function removeEachListener(sfn, idx) {
                if (fn === sfn) {
                    self.events[ev].splice(idx, 1);
                }
            });
        };
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
        self.resize = function (drawAfterResize) {
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
            self.resizeEditInput();
            if (drawAfterResize) {
                self.draw(true);
            }
            self.dispatchEvent('resize', {});
            return true;
        };
        self.resizeEditInput = function () {
            if (self.input) {
                var pos = self.canvas.getBoundingClientRect(),
                    bx2 = (self.style.cellBorderWidth * 2),
                    cell = self.getVisibleCellByIndex(self.input.editCell.columnIndex, self.input.editCell.rowIndex)
                        || {x: -100, y: -100, height: 0, width: 0};
                self.input.style.left = pos.left + cell.x - self.style.cellBorderWidth + self.canvasOffsetLeft + 'px';
                self.input.style.top = pos.top + cell.y - bx2 + self.canvasOffsetTop + 'px';
                self.input.style.height = cell.height - bx2 - 1 + 'px';
                self.input.style.width = cell.width - bx2 - self.style.cellPaddingLeft + 'px';
                self.clipElement(self.input);
            }
        };
        self.scroll = function (e) {
            var s = self.getVisibleSchema(),
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
            //TODO: figure out why this has to be delayed for child grids
            //BUG: scrolling event on 3rd level hierarchy fails to move input box
            requestAnimationFrame(self.resizeEditInput);
            self.dispatchEvent('scroll', {top: self.scrollBox.scrollTop, left: self.scrollBox.scrollLeft});
        };
        self.mousemove = function (e, overridePos) {
            if (self.contextMenu || self.input) {
                return;
            }
            self.mouse = overridePos || self.getLayerPos(e);
            var ctrl = (e.controlKey || e.metaKey || self.attributes.persistantSelectionMode),
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
                    self.canvas.style.cursor = 'pointer';
                    self.hovers[o.data[self.uniqueId]] = [o.columnIndex];
                }
                if ((self.selecting || self.reorderObject)
                        && o.context === 'cell'
                        && o.data) {
                    sBounds = self.getSelectionBounds();
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
                            self.selectRow(o.rowIndex, ctrl, true);
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
                                self.selectRow(i, true, true);
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
        /**
         * Ends editing, optionally aborting the edit.
         * @memberof canvasDataGrid#
         * @method
         * @param {boolean} abort When true, abort the edit.
         */
        self.endEdit = function (abort) {
            var cell = self.input.editCell,
                y = cell.rowIndex;
            function abortEdit() {
                abort = true;
            }
            if (self.dispatchEvent('beforeendedit', {
                    cell: cell,
                    newValue: self.input.value,
                    oldValue: cell.value,
                    abort: abortEdit,
                    input: self.input
                })) { return false; }
            if (self.input.value !== cell.value && !abort) {
                self.changes[y] = self.changes[y] || {};
                self.changes[y][cell.header.name] = self.input.value;
                cell.data[cell.header.name] = self.input.value;
                if (y === self.data.length) {
                    if (self.dispatchEvent('newrow', {
                            value: self.input.value,
                            defaultValue: cell.value,
                            aborted: abort,
                            cell: cell,
                            input: self.input
                        })) { return false; }
                    self.uId += 1;
                    self.addRow(cell.data);
                    self.createNewRowData();
                }
                self.draw(true);
            }
            document.body.removeChild(self.input);
            self.controlInput.focus();
            self.dispatchEvent('endedit', {
                cell: cell,
                value: self.input.value,
                aborted: abort,
                input: self.input
            });
            self.input = undefined;
            return true;
        };
        /**
         * Begins editing at cell x, row y.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} x The column index of the cell to edit.
         * @param {number} y The row index of the cell to edit.
         */
        self.beginEditAt = function (x, y) {
            if (!self.attributes.editable) { return; }
            var cell = self.getVisibleCellByIndex(x, y),
                s = self.getVisibleSchema();
            if (self.dispatchEvent('beforebeginedit', {cell: cell})) { return false; }
            self.scrollIntoView(x, y);
            self.setActiveCell(x, y);
            function postDraw() {
                cell = self.getVisibleCellByIndex(x, y);
                self.input = document.createElement(self.attributes.multiLine ? 'textarea' : 'input');
                document.body.appendChild(self.input);
                self.createInlineStyle(self.input, 'canvas-datagrid-edit-input');
                self.input.style.position = 'absolute';
                self.input.editCell = cell;
                self.resizeEditInput();
                self.input.style.zIndex = '2';
                self.input.value = cell.value;
                self.input.focus();
                self.input.addEventListener('click', self.stopPropagation);
                self.input.addEventListener('dblclick', self.stopPropagation);
                self.input.addEventListener('mouseup', self.stopPropagation);
                self.input.addEventListener('mousedown', self.stopPropagation);
                self.input.addEventListener('keydown', function (e) {
                    var nx = cell.columnIndex,
                        ny = cell.rowIndex;
                    // esc
                    if (e.keyCode === 27) {
                        self.endEdit(true);
                        self.draw(true);
                    // enter
                    } else if (e.keyCode === 13) {
                        self.endEdit();
                        self.draw(true);
                    } else if (e.keyCode === 9) {
                        e.preventDefault();
                        if (!self.endEdit()) {
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
                        self.beginEditAt(nx, ny);
                    }
                });
            }
            requestAnimationFrame(postDraw);
            self.dispatchEvent('beginedit', {cell: cell, input: self.input});
        };
        self.click = function (e, overridePos) {
            var i,
                selectionChanged,
                ctrl = (e.controlKey || e.metaKey || self.attributes.persistantSelectionMode),
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
            if (self.currentCell.context === 'cell') {
                if (self.currentCell.style === 'cornerCell') {
                    self.order(self.uniqueId, 'asc');
                    self.setFilter();
                    checkSelectionChange();
                    return;
                }
                if (self.currentCell.style === 'headerCell') {
                    if (self.orderBy === i.header.name) {
                        self.orderDirection = self.orderDirection === 'asc' ? 'desc' : 'asc';
                    } else {
                        self.orderDirection = 'asc';
                    }
                    self.order(i.header.name, self.orderDirection);
                    checkSelectionChange();
                    return;
                }
                if (['rowHeaderCell', 'headerCell'].indexOf(self.currentCell.style) === -1 && !ctrl) {
                    self.setActiveCell(i.columnIndex, i.rowIndex);
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
                        self.toggleTree(i.rowIndex);
                        return;
                    }
                    selectionChanged = true;
                    self.selectRow(i.rowIndex, ctrl, true);
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
                self.reorderObject = self.dragStartObject;
                self.reorderTarget = self.currentCell;
                self.reorderObject.dragOffset = {
                    x: x,
                    y: y
                };
                self.autoScrollZone(e, pos.x, pos.x, false);
            }
        };
        self.stopDragReorder = function (e) {
            var cr = {
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
                    && self.reorderTarget) {
                self.ignoreNextClick = true;
                if (self.reorderObject[i] !== self.reorderTarget[i]
                        && !self.dispatchEvent('reorder', {
                            NativeEvent: e,
                            source: self.reorderObject,
                            target: self.reorderTarget,
                            dragMode: self.dragMode
                        })) {
                    cr[self.dragMode].splice(cr[self.dragMode].indexOf(self.reorderObject[i]), 1);
                    cr[self.dragMode].splice(cr[self.dragMode].indexOf(self.reorderTarget[i]), 0, self.reorderObject[i]);
                    self.setStorageData();
                }
            }
            self.reorderObject = undefined;
            self.reorderTarget = undefined;
            self.draw(true);
        };
        self.mousedown = function (e, overridePos) {
            self.lastMouseDownTarget = e.target;
            if (self.dispatchEvent('mousedown', {NativeEvent: e, cell: self.currentCell})) { return; }
            if (!self.hasFocus) {
                return;
            }
            if (e.button === 2 || self.input) { return; }
            var ctrl = (e.controlKey || e.metaKey);
            self.dragStart = overridePos || self.getLayerPos(e);
            self.scrollStart = {
                left: self.scrollBox.scrollLeft,
                top: self.scrollBox.scrollTop
            };
            self.dragStartObject = self.getCellAt(self.dragStart.x, self.dragStart.y);
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
                self.scrollGrid(e);
                document.body.addEventListener('mousemove', self.scrollGrid, false);
                document.body.addEventListener('mouseup', self.stopScrollGrid, false);
                self.ignoreNextClick = true;
                return;
            }
            if (self.dragMode === 'cell') {
                self.selecting = true;
                if (self.attributes.rowSelectionMode) {
                    self.selectRow(self.dragStartObject.rowIndex, ctrl, true);
                }
                return self.mousemove(e);
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
                document.body.addEventListener('mousemove', self.dragResizeColumn, false);
                document.body.addEventListener('mouseup', self.stopDragResize, false);
            }
            if (['row-reorder', 'column-reorder'].indexOf(self.dragMode) !== -1) {
                self.draggingItem = self.dragItem;
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
                ctrl = (e.controlKey || e.metaKey),
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
                return self.beginEditAt(x, y);
            }
            //Space
            if (e.keyCode === 32) {
                self.selections = [];
                self.selections[Math.max(y, 0)] = [];
                self.selections[Math.max(y, 0)].push(x);
                self.selectionBounds = self.getSelectionBounds();
                if (self.attributes.rowSelectionMode) {
                    for (i = self.selectionBounds.top; i <= self.selectionBounds.bottom; i += 1) {
                        self.selectRow(i, ctrl, true);
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
            self.controlInput.value = '';
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
                    && self.currentCell.style === 'headerCell') {
                self.fitColumnToValues(self.currentCell.header.name);
            } else if (self.currentCell.context === 'ew-resize'
                    && self.currentCell.style === 'cornerCell') {
                self.autosize();
            } else if (['cell', 'activeCell'].indexOf(self.currentCell.style) !== -1) {
                self.beginEditAt(self.currentCell.columnIndex, self.currentCell.rowIndex);
            }
        };
        self.scrollWheel = function (e) {
            if (self.dispatchEvent('mousewheel', {NativeEvent: e})) {
                return;
            }
            self.touchHaltAnimation = true;
            var l = self.scrollBox.scrollLeft,
                t = self.scrollBox.scrollTop;
            if (self.hasFocus) {
                self.scrollBox.scrollTop -= e.wheelDeltaY;
                self.scrollBox.scrollLeft -= e.wheelDeltaX;
            }
            if (t !== self.scrollBox.scrollTop || l !== self.scrollBox.scrollLeft) {
                e.preventDefault();
            }
        };
        self.copy = function (e) {
            if (self.dispatchEvent('copy', {NativeEvent: e})) { return; }
            if (!self.hasFocus || !e.clipboardData) { return; }
            var rows = [], sData = self.getSelectedData();
            if (sData.length > 0) {
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
        };
        return;
    };
});
