/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([], function () {
    'use strict';
    return function (self) {
        self.getClippingRect = function (ele) {
            var boundingRect = self.position(self.parentNode),
                eleRect = self.position(ele),
                s = self.scrollOffset(self.canvas),
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
                columnHeaderCellHeight = self.getColumnHeaderCellHeight(),
                rowHeaderCellWidth = self.getRowHeaderCellWidth();
            boundingRect.top -= s.top;
            boundingRect.left -= s.left;
            eleRect.top -= s.top;
            eleRect.left -= s.left;
            clipRect.h = boundingRect.top + boundingRect.height - ele.offsetTop - self.style.scrollBarWidth;
            clipRect.w = boundingRect.left + boundingRect.width - ele.offsetLeft - self.style.scrollBarWidth;
            clipRect.x = boundingRect.left + (eleRect.left * -1) + rowHeaderCellWidth;
            clipRect.y = boundingRect.top + (eleRect.top * -1) + columnHeaderCellHeight;
            return {
                x: clipRect.x > parentRect.x ? clipRect.x : parentRect.x,
                y: clipRect.y > parentRect.y ? clipRect.y : parentRect.y,
                h: clipRect.h < parentRect.h ? clipRect.h : parentRect.h,
                w: clipRect.w < parentRect.w ? clipRect.w : parentRect.w
            };
        };
        self.clipElement = function (ele) {
            var clipRect = self.getClippingRect(ele);
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
        };
        self.scrollOffset = function (e) {
            var x = 0, y = 0;
            while (e.parentNode && e.nodeName !== 'CANVAS-DATAGRID') {
                if (e.nodeType !== 'canvas-datagrid-tree'
                        && e.nodeType !== 'canvas-datagrid-cell') {
                    x -= e.scrollLeft;
                    y -= e.scrollTop;
                }
                e = e.parentNode;
            }
            return {left: x, top: y};
        };
        self.resizeEditInput = function () {
            if (self.input) {
                var pos = self.canvas.getBoundingClientRect(),
                    s = self.scrollOffset(self.canvas),
                    bm = self.style.borderCollapse === 'collapse' ? 1 : 2,
                    borderWidth = (self.style.cellBorderWidth * bm),
                    cell = self.getVisibleCellByIndex(self.input.editCell.columnIndex, self.input.editCell.rowIndex)
                        || {x: -100, y: -100, height: 0, width: 0};
                if (self.mobile) {
                    self.input.style.left = '0';
                    self.input.style.top = (self.height - self.style.mobileEditInputHeight) - borderWidth - 1 + 'px';
                    self.input.style.height = self.style.mobileEditInputHeight + 'px';
                    self.input.style.width = self.width - borderWidth - 1 + 'px';
                    return;
                }
                self.input.style.left = pos.left + cell.x + self.canvasOffsetLeft - s.left + 'px';
                self.input.style.top = pos.top + cell.y - borderWidth + self.canvasOffsetTop - s.top + 'px';
                self.input.style.height = cell.height - borderWidth + 'px';
                self.input.style.width = cell.width - self.style.cellPaddingLeft + 'px';
                self.clipElement(self.input);
            }
        };
        self.position = function (e, ignoreScrollOffset) {
            var x = 0, y = 0, s = e, h, w;
            while (e.offsetParent && e.nodeName !== 'CANVAS-DATAGRID') {
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
            s = self.scrollOffset(e);
            return { left: x + s.left, top: y + s.top, height: h, width: w };
        };
        self.getLayerPos = function (e, includeScrollingElement) {
            var rect = self.canvas.getBoundingClientRect(),
                pos = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            if (self.isChildGrid) {
                pos.x -= self.canvasOffsetLeft;
                pos.y -= self.canvasOffsetTop;
            }
            if (document.scrollingElement && includeScrollingElement) {
                pos.x += document.scrollingElement.scrollLeft;
                pos.y += document.scrollingElement.scrollTop;
            }
            return {
                x: pos.x,
                y: pos.y,
                rect: rect
            };
        };
        /**
         * Ends editing, optionally aborting the edit.
         * @memberof canvasDatagrid
         * @name endEdit
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
         * @memberof canvasDatagrid
         * @name beginEditAt
         * @method
         * @param {number} x The column index of the cell to edit.
         * @param {number} y The row index of the cell to edit.
         */
        self.beginEditAt = function (x, y) {
            if (!self.attributes.editable) { return; }
            if (self.input) {
                self.endEdit();
            }
            var cell = self.getVisibleCellByIndex(x, y),
                s = self.getVisibleSchema(),
                enumItems,
                enu,
                option,
                valueInEnum;
            if (!(cell && cell.header)) { return; }
            //HACK for IE10, does not like literal enum
            enu = cell.header['enum'];
            if (self.dispatchEvent('beforebeginedit', {cell: cell})) { return false; }
            self.scrollIntoView(x, y);
            self.setActiveCell(x, y);
            if (enu) {
                self.input = document.createElement('select');
            } else {
                self.input = document.createElement(self.attributes.multiLine
                    ? 'textarea' : 'input');
            }
            cell = self.getVisibleCellByIndex(x, y);
            //HACK on mobile devices sometimes edit can begin without the cell being in view, I don't know how.
            if (!cell) { return; }
            if (enu) {
                // add enums
                if (typeof enu === 'function') {
                    enumItems = enu.apply(self.intf, [{cell: cell}]);
                } else if (Array.isArray(enu)) {
                    enumItems = enu;
                }
                enumItems.forEach(function (e) {
                    var i = document.createElement('option'),
                        val,
                        title;
                    if (Array.isArray(e)) {
                        val = e[0];
                        title = e[1];
                    } else {
                        val = e;
                        title = e;
                    }
                    if (val === cell.value) { valueInEnum = true; }
                    i.value = val;
                    i.innerHTML = title;
                    self.input.appendChild(i);
                });
                if (!valueInEnum) {
                    option = document.createElement('option');
                    option.value = cell.value;
                    option.innerHTML = cell.value;
                    self.input.appendChild(option);
                }
                self.input.addEventListener('change', function () {
                    self.endEdit();
                    self.draw(true);
                });
            }
            document.body.appendChild(self.input);
            self.createInlineStyle(self.input, self.mobile ? 'canvas-datagrid-edit-mobile-input' : 'canvas-datagrid-edit-input');
            self.input.style.position = 'absolute';
            self.input.editCell = cell;
            self.resizeEditInput();
            self.input.style.zIndex = '2';
            self.input.style.fontSize = (parseInt(self.style.editCellFontSize, 10) * self.scale) + 'px';
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
                } else if (e.keyCode === 13
                        && (!self.attributes.multiLine
                            || (self.attributes.multiLine && e.shiftKey))) {
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
                    self.scrollIntoView(nx, ny);
                    self.beginEditAt(nx, ny);
                }
            });
            self.dispatchEvent('beginedit', {cell: cell, input: self.input});
        };
        self.createInlineStyle = function (el, className) {
            var css = {
                'canvas-datagrid-context-menu-filter-input': {
                    height: '19px',
                    verticalAlign: 'bottom',
                    marginLeft: '2px',
                    padding: '0',
                    background: self.style.contextFilterInputBackground,
                    color: self.style.contextFilterInputColor,
                    border: self.style.contextFilterInputBorder,
                    borderRadius: self.style.contextFilterInputBorderRadius,
                    lineHeight: 'normal',
                    fontWeight: 'normal',
                    fontFamily: self.style.contextFilterInputFontFamily,
                    fontSize: self.style.contextFilterInputFontSize
                },
                'canvas-datagrid-context-menu-filter-button': {
                    height: '19px',
                    verticalAlign: 'bottom',
                    marginLeft: '2px',
                    padding: '0',
                    background: self.style.contextMenuBackground,
                    color: self.style.contextMenuColor,
                    border: self.style.contextFilterButtonBorder,
                    borderRadius: self.style.contextFilterButtonBorderRadius,
                    lineHeight: 'normal',
                    fontWeight: 'normal',
                    fontFamily: self.style.contextMenuFilterButtonFontFamily,
                    fontSize: self.style.contextMenuFilterButtonFontSize
                },
                'canvas-datagrid-context-child-arrow': {
                    cssFloat: 'right',
                    color: self.style.childContextMenuArrowColor,
                    fontSize: self.style.contextMenuChildArrowFontSize,
                    fontFamily: self.style.contextMenuFontFamily,
                    verticalAlign: 'middle'
                },
                'canvas-datagrid-autocomplete': {
                    fontFamily: self.style.contextMenuFontFamily,
                    fontSize: self.style.contextMenuFontSize,
                    background: self.style.contextMenuBackground,
                    color: self.style.contextMenuColor,
                    border: self.style.contextMenuBorder,
                    padding: self.style.contextMenuPadding,
                    borderRadius: self.style.contextMenuBorderRadius,
                    opacity: self.style.contextMenuOpacity,
                    position: 'absolute',
                    zIndex: 9999,
                    overflow: 'hidden'
                },
                'canvas-datagrid-autocomplete-item': {
                    background: self.style.contextMenuBackground,
                    color: self.style.contextMenuColor
                },
                'canvas-datagrid-autocomplete-item:hover': {
                    background: self.style.contextMenuHoverBackground,
                    color: self.style.contextMenuHoverColor
                },
                'canvas-datagrid-canvas': {
                    position: 'absolute',
                    zIndex: '-1'
                },
                'canvas-datagrid': {
                    display: 'block',
                    background: self.style.backgroundColor,
                    zIndex: '1',
                    boxSizing: 'content-box',
                    padding: '0'
                },
                'canvas-datagrid-control-input': {
                    position: 'fixed',
                    top: '-5px',
                    left: '-5px',
                    border: 'none',
                    opacity: '0',
                    cursor: 'pointer',
                    width: '1px',
                    height: '1px',
                    lineHeight: 'normal',
                    fontWeight: 'normal',
                    fontFamily: self.style.contextMenuFontFamily,
                    fontSize: self.style.contextMenuFontSize
                },
                'canvas-datagrid-edit-mobile-input': {
                    boxSizing: 'content-box',
                    outline: 'none',
                    margin: '0',
                    padding: '0 0 0 0',
                    lineHeight: 'normal',
                    fontWeight: 'normal',
                    fontFamily: self.style.mobileEditFontFamily,
                    fontSize: self.style.mobileEditFontSize,
                    border: self.style.editCellBorder,
                    color: self.style.editCellColor,
                    background: self.style.editCellBackgroundColor,
                    appearance: 'none',
                    webkitAppearance: 'none',
                    mozAppearance: 'none',
                    borderRadius: '0'
                },
                'canvas-datagrid-edit-input': {
                    boxSizing: 'content-box',
                    outline: 'none',
                    margin: '0',
                    padding: '0 0 0 ' + self.style.editCellPaddingLeft + 'px',
                    lineHeight: 'normal',
                    fontWeight: 'normal',
                    fontFamily: self.style.editCellFontFamily,
                    fontSize: self.style.editCellFontSize,
                    boxShadow: self.style.editCellBoxShadow,
                    border: self.style.editCellBorder,
                    color: self.style.editCellColor,
                    background: self.style.editCellBackgroundColor,
                    appearance: 'none',
                    webkitAppearance: 'none',
                    mozAppearance: 'none',
                    borderRadius: '0'
                },
                'canvas-datagrid-context-menu-item-mobile': {
                    lineHeight: 'normal',
                    fontWeight: 'normal',
                    fontFamily: self.style.contextMenuFontFamily,
                    fontSize: self.style.contextMenuFontSize,
                    color: 'inherit',
                    background: 'inherit',
                    margin: self.style.contextMenuItemMargin,
                    borderRadius: self.style.contextMenuItemBorderRadius,
                    verticalAlign: 'middle'
                },
                'canvas-datagrid-context-menu-item': {
                    lineHeight: 'normal',
                    fontWeight: 'normal',
                    fontFamily: self.style.contextMenuFontFamily,
                    fontSize: self.style.contextMenuFontSize,
                    color: 'inherit',
                    background: 'inherit',
                    margin: self.style.contextMenuItemMargin,
                    borderRadius: self.style.contextMenuItemBorderRadius,
                    verticalAlign: 'middle'
                },
                'canvas-datagrid-context-menu-item:hover': {
                    background: self.style.contextMenuHoverBackground,
                    color: self.style.contextMenuHoverColor
                },
                'canvas-datagrid-context-menu-label': {
                    margin: self.style.contextMenuLabelMargin,
                    display: self.style.contextMenuLabelDisplay,
                    minWidth: self.style.contextMenuLabelMinWidth,
                    maxWidth: self.style.contextMenuLabelMaxWidth
                },
                'canvas-datagrid-context-menu-mobile': {
                    lineHeight: 'normal',
                    fontWeight: 'normal',
                    fontFamily: self.style.contextMenuFontFamily,
                    fontSize: self.style.contextMenuFontSize,
                    background: self.style.contextMenuBackground,
                    color: self.style.contextMenuColor,
                    border: self.style.contextMenuBorder,
                    padding: self.style.contextMenuPadding,
                    borderRadius: self.style.contextMenuBorderRadius,
                    opacity: self.style.contextMenuOpacity,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                },
                'canvas-datagrid-context-menu': {
                    lineHeight: 'normal',
                    fontWeight: 'normal',
                    fontFamily: self.style.contextMenuFontFamily,
                    fontSize: self.style.contextMenuFontSize,
                    background: self.style.contextMenuBackground,
                    color: self.style.contextMenuColor,
                    border: self.style.contextMenuBorder,
                    padding: self.style.contextMenuPadding,
                    borderRadius: self.style.contextMenuBorderRadius,
                    opacity: self.style.contextMenuOpacity,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                },
                'canvas-datagrid-invalid-search-regExp': {
                    background: self.style.contextMenuFilterInvalidExpresion
                }
            };
            if (css[className]) {
                Object.keys(css[className]).map(function (prop) {
                    el.style[prop] = css[className][prop];
                });
            }
            return;
        };
        self.appendTo = function (n) {
            self.parentNode = n || document.createElement('canvas');
            if (self.parentNode && /canvas-datagrid-(cell|tree)/.test(self.parentNode.nodeType)) {
                self.isChildGrid = true;
                self.parentGrid = self.parentNode.parentGrid;
                self.ctx = self.parentGrid.context;
                self.canvas = self.parentGrid.canvas;
                self.controlInput = self.parentGrid.controlInput;
                self.eventParent = self.canvas;
            } else {
                self.controlInput = document.createElement('input');
                self.controlInput.onblur = self.intf.blur;
                self.createInlineStyle(self.controlInput, 'canvas-datagrid-control-input');
                self.isChildGrid = false;
                self.parentDOMNode = self.parentNode;
                self.parentNode = self.parentDOMNode;
                self.parentIsCanvas = /^canvas$/i.test(self.parentDOMNode.tagName);
                if (self.isComponent) {
                    self.shadowCss = document.createElement('style');
                    self.shadowCss.innerHTML = ':host canvas { display:flex; flex-direction: column; padding: 0; margin: 0; }';
                    self.parentDOMNode = self.parentNode.parentElement;
                    self.canvas = document.createElement('canvas');
                    self.parentNode.appendChild(self.shadowCss);
                    self.parentNode.appendChild(self.canvas);
                    self.parentNode.appendChild(self.controlInput);
                } else if (self.parentIsCanvas) {
                    self.canvas = self.parentDOMNode;
                    self.parentDOMNode.appendChild(self.controlInput);
                } else {
                    self.canvas = document.createElement('canvas');
                    self.parentDOMNode.appendChild(self.canvas);
                    self.parentDOMNode.appendChild(self.controlInput);
                }
                self.createInlineStyle(self.canvas, 'canvas-datagrid');
                self.ctx = self.canvas.getContext('2d');
                self.ctx.textBaseline = 'alphabetic';
                self.eventParent = self.canvas;
            }
            self.controlInput.setAttribute('readonly', true);
            self.controlInput.addEventListener('blur', function (e) {
                if (e.target !== self.canvas) {
                    self.hasFocus = false;
                }
            });
            window.addEventListener('resize', self.resize);
            if (window.MutationObserver) {
                self.observer = new window.MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        self.resize(true);
                    });
                });
                [self.canvas.parentNode].forEach(function (el) {
                    if (!el) { return; }
                    self.observer.observe(el, { attributes: true });
                });
            }
            self.eventParent.addEventListener('scroll', self.resize, false);
            self.eventParent.addEventListener('touchstart', self.touchstart, false);
            self.eventParent.addEventListener('mouseup', self.mouseup, false);
            self.eventParent.addEventListener('mousedown', self.mousedown, false);
            self.eventParent.addEventListener('dblclick', self.dblclick, false);
            self.eventParent.addEventListener('click', self.click, false);
            self.eventParent.addEventListener('mousemove', self.mousemove);
            self.eventParent.addEventListener('wheel', self.scrollWheel, false);
            self.canvas.addEventListener('contextmenu', self.contextmenuEvent, false);
            self.controlInput.addEventListener('copy', self.copy);
            self.controlInput.addEventListener('cut', self.cut);
            self.controlInput.addEventListener('paste', self.paste);
            self.controlInput.addEventListener('keypress', self.keypress, false);
            self.controlInput.addEventListener('keyup', self.keyup, false);
            self.controlInput.addEventListener('keydown', self.keydown, false);
        };
        self.setDom = function () {
            if (self.args.parentNode && self.args.parentNode.createShadowRoot) {
                if (this.isComponent) {
                    self.shadowRootParentElement = self.args.parentNode.parentElement;
                } else {
                    self.shadowRootParentElement = self.args.parentNode;
                }
                self.shadowRoot = self.args.parentNode.attachShadow({mode: self.args.debug ? 'open' : 'closed'});
                self.args.parentNode = self.shadowRoot;
            }
            self.appendTo(self.args.parentNode);
        };
    };
});
