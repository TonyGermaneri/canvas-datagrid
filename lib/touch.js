/*jslint browser: true, unparam: true, todo: true, plusplus: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
'use strict';

export default function (self) {
    var touchTimerMs = 50,
        debounceTouchMove,
        touchMoving,
        touchScrollTimeout;
    self.scrollAnimation = {};
    self.touchDelta = {};
    self.touchAnimateTo = {};
    self.animationFrames = 0;
    self.getTouchPos = function (e, touchIndex) {
        var t = touchIndex ? e.touches[touchIndex] : e.touches[0],
            rect = self.canvas.getBoundingClientRect(),
            pos;
        if (!t) { return; }
        pos = {
            x: t.clientX - rect.left,
            y: t.clientY - rect.top
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
    // shamelessly stolen from from https://gist.github.com/gre/1650294
    self.easingFunctions = {
        linear: function (t) { return t; },
        easeInQuad: function (t) { return t * t; },
        easeOutQuad: function (t) { return t * (2 - t); },
        easeInOutQuad: function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
        easeInCubic: function (t) { return t * t * t; },
        easeOutCubic: function (t) { return (--t) * t * t + 1; },
        easeInOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; },
        easeInQuart: function (t) { return t * t * t * t; },
        easeOutQuart: function (t) { return 1 - (--t) * t * t * t; },
        easeInOutQuart: function (t) { return t < 0.5 ? 8 * t  * t  * t * t : 1 - 8 * (--t) * t * t * t; },
        easeInQuint: function (t) { return t * t * t * t * t; },
        easeOutQuint: function (t) { return 1 + (--t) * t *  t * t * t; },
        easeInOutQuint: function (t) { return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t; }
    };
    self.easing = function (t, b, c, d) {
        return c * self.easingFunctions[self.attributes.touchEasingMethod](t / d) + b;
    };
    self.calculatePPSTimed = function () {
        self.xPPST = -((self.touchDelta.x - self.touchSigmaTimed.x) / (self.touchDelta.t - self.touchSigmaTimed.t));
        self.yPPST = -((self.touchDelta.y - self.touchSigmaTimed.y) / (self.touchDelta.t - self.touchSigmaTimed.t));
        self.touchSigmaTimed = {
            x: self.touchDelta.x,
            y: self.touchDelta.y,
            t: performance.now()
        };
    };
    self.calculatePPS = function () {
        self.xPPS = -((self.touchDelta.x - self.touchSigma.x) / (self.touchDelta.t - self.touchSigma.t));
        self.yPPS = -((self.touchDelta.y - self.touchSigma.y) / (self.touchDelta.t - self.touchSigma.t));
        self.touchSigma = {
            x: self.touchDelta.x,
            y: self.touchDelta.y,
            t: performance.now()
        };
    };
    self.touchEndAnimation = function () {
        if (!self.canvas || !self.scrollBox.scrollTo) { return requestAnimationFrame(self.touchEndAnimation); }
        var n = performance.now(),
            d = self.attributes.touchReleaseAnimationDurationMs,
            t;
        t = n - self.touchDelta.t;
        self.animationFrames += 1;
        self.scrollAnimation.x = self.easing(t, self.touchDelta.scrollLeft, self.touchAnimateTo.x, d);
        self.scrollAnimation.y = self.easing(t, self.touchDelta.scrollTop, self.touchAnimateTo.y, d);
        if (t > d || (self.scrollAnimation.y === self.scrollBox.scrollTop
                && self.scrollAnimation.x === self.scrollBox.scrollLeft) || self.stopAnimation) {
            return;
        }
        self.scrollBox.scrollTo(self.scrollAnimation.x, self.scrollAnimation.y);
        requestAnimationFrame(self.touchEndAnimation);
    };
    self.touchEditCell = function (cell) {
        self.beginEditAt(cell.columnIndex, cell.rowIndex);
    };
    self.touchCell = function (e) {
        return function () {
            clearInterval(self.calculatePPSTimer);
            var i, pos = self.getTouchPos(e);
            if (Math.abs(self.touchDelta.x) + Math.abs(self.touchDelta.y) < self.attributes.touchDeadZone) {
                i = self.getCellAt(pos.x, pos.y);
                if (!i) { return; }
                if (self.touchingCell && self.touchingCell.rowIndex === i.rowIndex
                        && self.touchingCell.columnIndex === i.columnIndex) {
                    self.touchEditCell(i);
                    return;
                }
                if (self.input && self.input.editCell) {
                    self.endEdit();
                }
                self.touchingCell = i;
                self.selectArea({
                    top: i.rowIndex,
                    bottom: i.rowIndex,
                    left: i.columnIndex,
                    right: i.columnIndex
                });
                self.draw(true);
            }
        };
    };
    self.touchstart = function (e) {
        if (e.changedTouches[0]) {
            self.touchStart = self.getTouchPos(e);
            self.startingCell = self.getCellAt(self.touchStart.x, self.touchStart.y, true);
        }
        if (self.dispatchEvent('touchstart', {NativeEvent: e, cell: self.startingCell})) { return; }
        self.disposeContextMenu();
        clearInterval(self.calculatePPSTimer);
        clearTimeout(self.touchContextTimeout);
        self.touchStartEvent = e;
        self.stopAnimation = true;
        self.animationFrames = 0;
        self.stopPropagation(e);
        e.preventDefault();
        if (e.touches.length === 1 && e.changedTouches[0] && !self.zoomAltered) {
            self.touchLength = 1;
            self.touchStart = self.touchStart || self.touchStart1;
            self.touchScrollStart = {
                x: self.scrollBox.scrollLeft,
                y: self.scrollBox.scrollTop,
                t: performance.now()
            };
            self.touchDelta = {
                x: 0,
                y: 0,
                scrollLeft: self.scrollBox.scrollLeft,
                scrollTop: self.scrollBox.scrollTop,
                t: self.touchScrollStart.t
            };
            self.touchSigma = {
                x: self.touchDelta.x,
                y: self.touchDelta.y,
                t: self.touchDelta.t
            };
            self.touchSigmaTimed = {
                x: self.touchDelta.x,
                y: self.touchDelta.y,
                t: self.touchDelta.t
            };
            self.touchContextTimeout = setTimeout(function () {
                self.contextmenuEvent(e, self.touchStart);
            }, self.attributes.touchContextMenuTimeMs);
            self.calculatePPSTimer = setInterval(self.calculatePPSTimed, touchTimerMs);
            if (self.startingCell && (self.startingCell.isGrid || ['tree', 'inherit'].indexOf(self.startingCell.context) !== -1)) {
                self.hasFocus = false;
                return;
            }
            self.hasFocus = true;
            if (self.startingCell.isHeader) {
                if (self.startingCell.isRowHeader) {
                    self.selectArea({
                        top: self.startingCell.rowIndex,
                        bottom: self.startingCell.rowIndex,
                        left: 0,
                        right: self.getVisibleSchema().length - 1,
                    });
                    self.draw(true);
                } else if (self.startingCell.isColumnHeader) {
                    if (self.attributes.columnHeaderClickBehavior === 'sort') {
                        if (self.orderBy === self.startingCell.header.name) {
                            self.orderDirection = self.orderDirection === 'asc' ? 'desc' : 'asc';
                        } else {
                            self.orderDirection = 'asc';
                        }
                        self.order(self.startingCell.header.name, self.orderDirection);
                    }
                    if (self.attributes.columnHeaderClickBehavior === 'select') {
                        self.selectArea({
                            top: 0,
                            bottom: self.data.length - 1,
                            left: self.startingCell.columnIndex,
                            right: self.startingCell.columnIndex,
                        });
                        self.draw(true);
                    }
                }
                self.touchEndEvents(e);
                return;
            }
        }
        if (self.zoomAltered) { return; }
        document.body.addEventListener('touchmove', self.touchmove, {passive: false});
        document.body.addEventListener('touchend', self.touchend, false);
        document.body.addEventListener('touchcancel', self.touchcancel, false);
        self.draw(true);
    };
    self.touchSelect = function (cell, handleType) {
        if (cell.rowIndex === undefined || cell.columnIndex === undefined) { return; }
        self.touchSelecting = true;
        var bounds = self.getSelectionBounds();
        if (handleType === 'selection-handle-bl'
                && cell.rowIndex >= bounds.top
                && cell.columnIndex <= bounds.right) {
            bounds.bottom = cell.rowIndex;
            bounds.left = cell.columnIndex;
        } else if (handleType === 'selection-handle-tl'
                && cell.rowIndex <= bounds.bottom
                && cell.columnIndex <= bounds.right) {
            bounds.top = cell.rowIndex;
            bounds.left = cell.columnIndex;
        } else if (handleType === 'selection-handle-tr'
                && cell.rowIndex <= bounds.bottom
                && cell.columnIndex >= bounds.left) {
            bounds.top = cell.rowIndex;
            bounds.right = cell.columnIndex;
        } else if (handleType === 'selection-handle-br'
                && cell.rowIndex >= bounds.top
                && cell.columnIndex >= bounds.left) {
            bounds.bottom = cell.rowIndex;
            bounds.right = cell.columnIndex;
        }
        if (self.attributes.selectionMode === 'row' || cell.rowIndex === -1) {
            bounds.left = 0;
            bounds.right = self.getSchema().length - 1;
        } else {
            bounds.left = Math.max(0, bounds.left);
        }
        self.selectArea(bounds);
        self.draw(true);
    };
    function touchMove(e) {
        var ch, rw, rScrollZone, lScrollZone, bScrollZone, tScrollZone, sbw, t1, t2;
        if (self.dispatchEvent('beforetouchmove', {NativeEvent: e})) { return; }
        clearTimeout(touchScrollTimeout);
        if (e.changedTouches[0]) {
            self.touchPosition = self.getTouchPos(e);
        }
        if (e.changedTouches[1]) {
            self.touchPosition1 = self.getTouchPos(e, 1);
        }
        if (Math.abs(self.touchDelta.x) + Math.abs(self.touchDelta.y) > self.attributes.touchDeadZone) {
            clearTimeout(self.touchContextTimeout);
        }
        if (e.touches.length === 2 && self.touchPosition && self.touchPosition1) {
            t1 = self.touchPosition.y;
            t2 = self.touchPosition1.y;
            if (!self.zoomDeltaStart) {
                self.zoomDeltaStart = Math.abs(t1 - t2);
                self.startScale = self.scale;
            }
            self.touchLength = 2;
            self.scaleDelta = self.zoomDeltaStart - Math.abs(t1 - t2);
            self.scale = self.startScale - (self.scaleDelta * self.attributes.touchZoomSensitivity);
            self.scale = Math.min(Math.max(self.scale, self.attributes.touchZoomMin), self.attributes.touchZoomMax);
            self.zoomAltered = true;
            self.resize(true);
            self.resizeChildGrids();
            return;
        }
        if (self.zoomAltered) { return; }
        self.touchLength = 1;
        self.touchPosition = self.touchPosition || self.touchPosition1;
        ch = self.getColumnHeaderCellHeight();
        rw = self.getRowHeaderCellWidth();
        rScrollZone = self.width - self.style.scrollBarWidth - self.touchPosition.x < self.attributes.selectionScrollZone;
        lScrollZone = self.touchPosition.x - rw < self.attributes.selectionScrollZone;
        bScrollZone = self.height - self.style.scrollBarWidth - self.touchPosition.y < self.attributes.selectionScrollZone;
        tScrollZone = self.touchPosition.y - ch < self.attributes.selectionScrollZone;
        sbw = self.style.scrollBarWidth;
        function touchScroll() {
            var x = self.scrollBox.scrollLeft,
                y = self.scrollBox.scrollTop;
            x += (rScrollZone ? self.attributes.selectionScrollIncrement : 0);
            y += (bScrollZone ? self.attributes.selectionScrollIncrement : 0);
            y -= (tScrollZone ? self.attributes.selectionScrollIncrement : 0);
            x -= (lScrollZone ? self.attributes.selectionScrollIncrement : 0);
            self.scrollBox.scrollTo(x, y);
            touchScrollTimeout = setTimeout(touchScroll, self.attributes.scrollRepeatRate);
        }
        e.stopPropagation();
        self.touchDelta = {
            x: self.touchPosition.x - self.touchStart.x,
            y: self.touchPosition.y - self.touchStart.y,
            scrollLeft: self.scrollBox.scrollLeft,
            scrollTop: self.scrollBox.scrollTop,
            t: performance.now()
        };
        self.currentCell = self.getCellAt(self.touchPosition.x, self.touchPosition.y);
        self.dispatchEvent('touchmove', {NativeEvent: e, cell: self.currentCell});
        self.calculatePPS();
        self.touchDuration = performance.now() - self.touchScrollStart.t;
        self.stopAnimation = true;
        self.animationFrames = 0;
        if (self.touchSelecting && (rScrollZone || lScrollZone || tScrollZone || bScrollZone)) {
            touchScroll();
        }
        if (/vertical-scroll-/.test(self.startingCell.style)) {
            self.scrollBox.scrollTop = self.scrollBox.scrollHeight
                * ((self.touchPosition.y - ch - sbw) / (self.scrollBox.height - sbw - ch));
            return;
        }
        if (/horizontal-scroll-/.test(self.startingCell.style)) {
            self.scrollBox.scrollLeft = self.scrollBox.scrollWidth
                * ((self.touchPosition.x - rw - sbw) / (self.scrollBox.width - sbw - rw));
            return;
        }
        if (/selection-handle-/.test(self.startingCell.style)) {
            self.touchSelect(self.currentCell, self.startingCell.style);
            return;
        }
        self.scrollBox.scrollTo(self.touchScrollStart.x - self.touchDelta.x,
            self.touchScrollStart.y - self.touchDelta.y);
    };
    self.touchmove = function (e) {
        if (touchMoving) {
            return;
        }
        requestAnimationFrame(function () {
            touchMoving = true;
            touchMove(e);
            touchMoving = false;
        });
    };
    self.touchEndEvents = function (e) {
        self.zoomDeltaStart = undefined;
        self.touchSelecting = false;
        clearInterval(self.touchScrollTimeout);
        clearInterval(self.touchContextTimeout);
        clearInterval(self.calculatePPSTimer);
        e.stopPropagation();
        document.body.removeEventListener('touchmove', self.touchmove, {passive: false});
        document.body.removeEventListener('touchend', self.touchend, false);
        document.body.removeEventListener('touchcancel', self.touchcancel, false);
    };
    self.touchend = function (e) {
        if (self.dispatchEvent('touchend', {NativeEvent: e, cell: self.currentCell})) { return; }
        self.zoomDeltaStart = undefined;
        if (e.changedTouches[0]) {
            self.touchPosition = undefined;
        }
        if (e.changedTouches[1]) {
            self.touchPosition1 = undefined;
        }
        if (self.zoomAltered) {
            if (e.touches.length === 0) {
                self.zoomAltered = false;
            }
            return;
        }
        var dz = Math.abs(self.touchDelta.x) + Math.abs(self.touchDelta.y) < self.attributes.touchDeadZone;
        if (isNaN(self.xPPS)) {
            self.xPPS = 0;
        }
        if (isNaN(self.yPPS)) {
            self.yPPS = 0;
        }
        if (isNaN(self.xPPST)) {
            self.xPPST = 0;
        }
        if (isNaN(self.yPPST)) {
            self.yPPST = 0;
        }
        self.touchAnimateTo.x = self.xPPS * self.attributes.touchReleaseAcceleration;
        self.touchAnimateTo.y = self.yPPS * self.attributes.touchReleaseAcceleration;
        self.calculatePPSTimed();
        if (dz && !self.contextMenu) {
            self.touchCell(self.touchStartEvent)();
        } else if (self.animationFrames === 0
                && (Math.abs(self.xPPST) > self.attributes.scrollAnimationPPSThreshold
                    || Math.abs(self.yPPST) > self.attributes.scrollAnimationPPSThreshold)
                && !/-scroll-/.test(self.startingCell.style)
                && !dz) {
            self.stopAnimation = false;
            self.touchEndAnimation();
        }
        self.touchEndEvents(e);
    };
    self.touchcancel = function (e) {
        if (self.dispatchEvent('touchcancel', {NativeEvent: e, cell: self.currentCell})) { return; }
        self.touchEndEvents(e);
    };
};
