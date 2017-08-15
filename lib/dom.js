/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([], function () {
    'use strict';
    return function (self) {
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
                self.controlInput.onblur = self.intf.blur;
                self.createInlineStyle(self.controlInput, 'canvas-datagrid-control-input');
                self.isChildGrid = false;
                self.parentDOMNode = self.parentNode;
                self.parentNode = self.parentDOMNode;
                self.parentIsCanvas = /canvas/i.test(self.parentDOMNode.tagName);
                if (self.parentIsCanvas) {
                    self.canvas = self.parentDOMNode;
                } else {
                    self.canvas = document.createElement('canvas');
                    self.parentDOMNode.appendChild(self.canvas);
                }
                self.ctx = self.canvas.getContext('2d');
                self.ctx.textBaseline = 'alphabetic';
                document.body.appendChild(self.controlInput);
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
            self.canvas.addEventListener('contextmenu', self.contextmenuEvent, false);
            (self.isChildGrid ? self.parentGrid : document).addEventListener('copy', self.copy);
            self.controlInput.addEventListener('keypress', self.keypress, false);
            self.controlInput.addEventListener('keyup', self.keyup, false);
            self.controlInput.addEventListener('keydown', self.keydown, false);
        };
        self.setDom = function () {
            self.appendTo(self.args.parentNode);
        };
    };
});
