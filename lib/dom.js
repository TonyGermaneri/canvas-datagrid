/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([], function () {
    'use strict';
    return function (self) {
        /**
         * Ends editing, optionally aborting the edit.
         * @memberof canvasDataGrid
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
            self.parentDOMNode.removeChild(self.input);
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
         * @memberof canvasDataGrid
         * @name beginEditAt
         * @method
         * @param {number} x The column index of the cell to edit.
         * @param {number} y The row index of the cell to edit.
         */
        self.beginEditAt = function (x, y) {
            if (!self.attributes.editable) { return; }
            var cell = self.getVisibleCellByIndex(x, y),
                s = self.getVisibleSchema(),
                enumItems,
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
            function postDraw() {
                var option, valueInEnum;
                cell = self.getVisibleCellByIndex(x, y);
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
                self.parentDOMNode.appendChild(self.input);
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
            }
            postDraw();
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
                    zIndex: 3,
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
                    position: 'absolute',
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
                    overflow: 'hidden'
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
                    self.parentDOMNode = self.parentNode.parentElement;
                    self.canvas = document.createElement('canvas');
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
                self.ctx = self.canvas.getContext('2d');
                self.ctx.textBaseline = 'alphabetic';
                self.eventParent = self.canvas;
            }
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
            (self.isChildGrid ? self.parentGrid : document).addEventListener('copy', self.copy);
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
                self.shadowRoot = self.args.parentNode.createShadowRoot();
                self.args.parentNode = self.shadowRoot;
            }
            self.appendTo(self.args.parentNode);
        };
    };
});
