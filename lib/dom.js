/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([], function () {
    'use strict';
    return function (self) {
        self.createInlineStyle = function (el, className) {
            var css = {
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
                    height: '1px'
                },
                'canvas-datagrid-edit-input': {
                    boxSizing: 'content-box',
                    outline: 'none',
                    margin: '0',
                    padding: '0 0 0 ' + self.style.editCellPaddingLeft + 'px',
                    fontSize: self.style.editCellFontSize,
                    fontFamily: self.style.editCellFontFamily,
                    boxShadow: self.style.editCellBoxShadow,
                    border: self.style.editCellBorder
                },
                'canvas-datagrid-context-menu-item': {
                    color: 'inherit',
                    background: 'inherit',
                    margin: self.style.contextMenuItemMargin,
                    borderRadius: self.style.contextMenuItemBorderRadius
                },
                'canvas-datagrid-context-menu-item:hover': {
                    background: self.style.contextMenuHoverBackground,
                    color: self.style.contextMenuHoverColor
                },
                'canvas-datagrid-context-menu-label': {
                    margin: self.style.contextMenuLabelMargin,
                    display: self.style.contextMenuLabelDisplay,
                    minWidth: self.style.contextMenuLabelMinWidth,
                    maxWidth: self.style.contextMenuLabelMaxWidth,
                },
                'canvas-datagrid-context-menu': {
                    fontFamily: self.style.contextMenuFontFamily,
                    fontSize: self.style.contextMenuFontSize,
                    background: self.style.contextMenuBackground,
                    color: self.style.contextMenuColor,
                    border: self.style.contextMenuBorder,
                    padding: self.style.contextMenuPadding,
                    borderRadius: self.style.contextMenuBorderRadius,
                    opacity: self.style.contextMenuOpacity
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
                self.controlInput.onblur = self.blur;
                self.createInlineStyle(self.controlInput, 'canvas-datagrid-control-input');
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
            self.controlInput.addEventListener('blur', function (e) {
                if (e.target !== self.canvas) {
                    self.hasFocus = false;
                }
            });
            window.addEventListener('resize', self.resize);
            if (MutationObserver) {
                self.observer = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        self.resize(true);
                    });
                });
                [self.canvas.parentNode].forEach(function (el) {
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
            self.canvas.addEventListener('contextmenu', self.contextmenu, false);
            (self.isChildGrid ? self.parentGrid : document).addEventListener('copy', self.copy);
            self.controlInput.addEventListener('keypress', self.keypress, false);
            self.controlInput.addEventListener('keyup', self.keyup, false);
            self.controlInput.addEventListener('keydown', self.keydown, false);
        };
        self.setDom = function () {
            self.appendTo(self.args.parentNode);
        };
        self.initScrollBox = function () {
            var sHeight = 0,
                sWidth = 0,
                scrollTop = 0,
                scrollLeft = 0,
                scrollHeight = 0,
                scrollWidth = 0,
                scrollBoxHeight = 20,
                scrollBoxWidth = 20;
            function setScrollTop(value, preventScrollEvent) {
                if (isNaN(value)) {
                    throw new Error('ScrollTop value must be a number');
                }
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
                if (!preventScrollEvent) {
                    self.scroll();
                }
            }
            function setScrollLeft(value, preventScrollEvent) {
                if (isNaN(value)) {
                    throw new Error('ScrollLeft value must be a number');
                }
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
                if (!preventScrollEvent) {
                    self.scroll();
                }
            }
            self.scrollBox.scrollTo = function (x, y) {

                setScrollLeft(x, true);
                setScrollTop(y);
            };
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
                set: setScrollTop
            });
            Object.defineProperty(self.scrollBox, 'scrollLeft', {
                get: function () {
                    return scrollLeft;
                },
                set: setScrollLeft
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
        };
    };
});
