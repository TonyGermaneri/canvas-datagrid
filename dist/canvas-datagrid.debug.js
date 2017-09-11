(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["canvasDatagrid"] = factory();
	else
		root["canvasDatagrid"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*************************!*\
  !*** ./lib/defaults.js ***!
  \*************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
    'use strict';
    return function (self) {
        self.defaults = {
            attributes: [
                ['name', ''],
                ['tree', false],
                ['showNewRow', false],
                ['treeHorizontalScroll', false],
                ['saveAppearance', true],
                ['selectionFollowsActiveCell', false],
                ['multiLine', false],
                ['editable', true],
                ['allowColumnReordering', true],
                ['allowRowReordering', false],
                ['allowSorting', true],
                ['showFilter', true],
                ['globalRowResize', false],
                ['pageUpDownOverlap', 1],
                ['persistantSelectionMode', false],
                ['selectionMode', 'cell'],
                ['autoResizeColumns', false],
                ['allowRowHeaderResize', true],
                ['allowColumnResize', true],
                ['allowRowResize', true],
                ['allowRowResizeFromCell', false],
                ['allowColumnResizeFromCell', false],
                ['debug', false],
                ['borderResizeZone', 10],
                ['showColumnHeaders', true],
                ['showRowNumbers', true],
                ['showRowHeaders', true],
                ['scrollRepeatRate', 75],
                ['selectionScrollZone', 20],
                ['resizeScrollZone', 20],
                ['contextHoverScrollRateMs', 5],
                ['contextHoverScrollAmount', 2],
                ['selectionScrollIncrement', 20],
                ['reorderDeadZone', 3],
                ['showClearSettingsOption', true],
                ['showOrderByOption', true],
                ['clearSettingsOptionText', 'Clear saved settings'],
                ['showOrderByOptionTextAsc', 'Order by %s ascending'],
                ['showOrderByOptionTextDesc', 'Order by %s descending'],
                ['removeFilterOptionText', 'Remove filter on %s'],
                ['filterOptionText', 'Filter %s'],
                ['filterTextPrefix', '(filtered) '],
                ['touchReleaseAnimationDurationMs', 2000],
                ['touchReleaseAcceleration', 500],
                ['touchDeadZone', 3],
                ['touchSelectTimeMs', 800],
                ['touchScrollZone', 30],
                ['copyText', 'Copy'],
                ['showCopy', true],
                ['columnHeaderClickBehavior', 'sort'],
                ['scrollPointerLock', false],
                ['maxAutoCompleteItems', 200]
            ],
            styles: [
                ['activeCellBackgroundColor', 'rgba(255, 255, 255, 1)'],
                ['activeCellBorderColor', 'rgba(110, 168, 255, 1)'],
                ['activeCellBorderWidth', 0.25],
                ['activeCellColor', 'rgba(0, 0, 0, 1)'],
                ['activeCellFont', '16px sans-serif'],
                ['activeCellHoverBackgroundColor', 'rgba(255, 255, 255, 1)'],
                ['activeCellHoverColor', 'rgba(0, 0, 0, 1)'],
                ['activeCellOverlayBorderColor', 'rgba(66, 133, 244, 1)'],
                ['activeCellOverlayBorderWidth', 0.5],
                ['activeCellPaddingBottom', 5],
                ['activeCellPaddingLeft', 5],
                ['activeCellPaddingRight', 7],
                ['activeCellPaddingTop', 5],
                ['activeCellSelectedBackgroundColor', 'rgba(236, 243, 255, 1)'],
                ['activeCellSelectedColor', 'rgba(0, 0, 0, 1)'],
                ['activeColumnHeaderCellBackgroundColor', 'rgba(225, 225, 225, 1)'],
                ['activeColumnHeaderCellColor', 'rgba(0, 0, 0, 1)'],
                ['activeRowHeaderCellBackgroundColor', 'rgba(225, 225, 225, 1)'],
                ['activeRowHeaderCellColor', 'rgba(0, 0, 0, 1)'],
                ['autocompleteBottomMargin', 60],
                ['autosizeHeaderCellPadding', 8],
                ['autosizePadding', 5],
                ['backgroundColor', 'rgba(240, 240, 240, 1)'],
                ['cellAutoResizePadding', 13],
                ['cellBackgroundColor', 'rgba(255, 255, 255, 1)'],
                ['cellBorderColor', 'rgba(195, 199, 202, 1)'],
                ['cellBorderWidth', 0.5],
                ['cellColor', 'rgba(0, 0, 0, 1)'],
                ['cellFont', '16px sans-serif'],
                ['cellGridHeight', 250],
                ['cellHeight', 24],
                ['cellHeightWithChildGrid', 150],
                ['cellHorizontalAlignment', 'left'],
                ['cellHoverBackgroundColor', 'rgba(255, 255, 255, 1)'],
                ['cellHoverColor', 'rgba(0, 0, 0, 1)'],
                ['cellPaddingBottom', 5],
                ['cellPaddingLeft', 5],
                ['cellPaddingRight', 7],
                ['cellPaddingTop', 5],
                ['cellSelectedBackgroundColor', 'rgba(236, 243, 255, 1)'],
                ['cellSelectedColor', 'rgba(0, 0, 0, 1)'],
                ['cellVerticalAlignment', 'center'],
                ['cellWidthWithChildGrid', 250],
                ['childContextMenuArrowColor', 'rgba(43, 48, 43, 1)'],
                ['childContextMenuArrowHTML', '&#x25BA;'],
                ['childContextMenuMarginLeft', -15],
                ['childContextMenuMarginTop', 0],
                ['columnHeaderCellBackgroundColor', 'rgba(240, 240, 240, 1)'],
                ['columnHeaderCellBorderColor', 'rgba(152, 152, 152, 1)'],
                ['columnHeaderCellBorderWidth', 0.25],
                ['columnHeaderCellColor', 'rgba(50, 50, 50, 1)'],
                ['columnHeaderCellFont', '16px sans-serif'],
                ['columnHeaderCellHeight', 25],
                ['columnHeaderCellHorizontalAlignment', 'left'],
                ['columnHeaderCellHoverBackgroundColor', 'rgba(235, 235, 235, 1)'],
                ['columnHeaderCellHoverColor', 'rgba(0, 0, 0, 1)'],
                ['columnHeaderCellPaddingBottom', 5],
                ['columnHeaderCellPaddingLeft', 5],
                ['columnHeaderCellPaddingRight', 7],
                ['columnHeaderCellPaddingTop', 5],
                ['columnHeaderCellVerticalAlignment', 'center'],
                ['columnWidth', 250],
                ['contextFilterButtonBorder', 'solid 1px rgba(158, 163, 169, 1)'],
                ['contextFilterButtonBorderRadius', '3px'],
                ['contextFilterButtonHTML', '&#x25BC;'],
                ['contextFilterInputBackground', 'rgba(255,255,255,1)'],
                ['contextFilterInputBorder', 'solid 1px rgba(158, 163, 169, 1)'],
                ['contextFilterInputBorderRadius', '0'],
                ['contextFilterInputColor', 'rgba(0,0,0,1)'],
                ['contextFilterInputFontFamily', 'sans-serif'],
                ['contextFilterInputFontSize', '14px'],
                ['contextFilterInvalidRegExpBackground', 'rgba(180, 6, 1, 1)'],
                ['contextFilterInvalidRegExpColor', 'rgba(255, 255, 255, 1)'],
                ['contextMenuArrowColor', 'rgba(43, 48, 43, 1)'],
                ['contextMenuArrowDownHTML', '&#x25BC;'],
                ['contextMenuArrowUpHTML', '&#x25B2;'],
                ['contextMenuBackground', 'rgba(240, 240, 240, 1)'],
                ['contextMenuBorder', 'solid 1px rgba(158, 163, 169, 1)'],
                ['contextMenuBorderRadius', '3px'],
                ['contextMenuChildArrowFontSize', '12px'],
                ['contextMenuColor', 'rgba(43, 48, 43, 1)'],
                ['contextMenuFilterButtonFontFamily', 'sans-serif'],
                ['contextMenuFilterButtonFontSize', '10px'],
                ['contextMenuFilterInvalidExpresion', 'rgba(237, 155, 156, 1)'],
                ['contextMenuFontFamily', 'sans-serif'],
                ['contextMenuFontSize', '16px'],
                ['contextMenuHoverBackground', 'rgba(182, 205, 250, 1)'],
                ['contextMenuHoverColor', 'rgba(43, 48, 153, 1)'],
                ['contextMenuItemBorderRadius', '3px'],
                ['contextMenuItemMargin', '2px'],
                ['contextMenuLabelDisplay', 'inline-block'],
                ['contextMenuLabelMargin', '0 3px 0 0'],
                ['contextMenuLabelMaxWidth', '700px'],
                ['contextMenuLabelMinWidth', '75px'],
                ['contextMenuMarginLeft', 3],
                ['contextMenuMarginTop', -3],
                ['contextMenuOpacity', '0.98'],
                ['contextMenuPadding', '2px'],
                ['contextMenuWindowMargin', 6],
                ['cornerCellBackgroundColor', 'rgba(240, 240, 240, 1)'],
                ['cornerCellBorderColor', 'rgba(202, 202, 202, 1)'],
                ['editCellBackgroundColor', 'white'],
                ['editCellBorder', 'solid 1px rgba(110, 168, 255, 1)'],
                ['editCellBoxShadow', '0 2px 5px rgba(0,0,0,0.4)'],
                ['editCellColor', 'black'],
                ['editCellFontFamily', 'sans-serif'],
                ['editCellFontSize', '16px'],
                ['editCellPaddingLeft', 4],
                ['height', 'auto'],
                ['gridBorderColor', 'rgba(202, 202, 202, 1)'],
                ['gridBorderWidth', 1],
                ['columnHeaderOrderByArrowBorderColor', 'rgba(195, 199, 202, 1)'],
                ['columnHeaderOrderByArrowBorderWidth', 1],
                ['columnHeaderOrderByArrowColor', 'rgba(155, 155, 155, 1)'],
                ['columnHeaderOrderByArrowHeight', 8],
                ['columnHeaderOrderByArrowMarginLeft', 0],
                ['columnHeaderOrderByArrowMarginRight', 5],
                ['columnHeaderOrderByArrowMarginTop', 6],
                ['columnHeaderOrderByArrowWidth', 13],
                ['minColumnWidth', 45],
                ['minHeight', 24],
                ['minRowHeight', 24],
                ['name', 'default'],
                ['reorderMarkerBackgroundColor', 'rgba(0, 0, 0, 0.1)'],
                ['reorderMarkerBorderColor', 'rgba(0, 0, 0, 0.2)'],
                ['reorderMarkerBorderWidth', 1.25],
                ['reorderMarkerIndexBorderColor', 'rgba(66, 133, 244, 1)'],
                ['reorderMarkerIndexBorderWidth', 2.75],
                ['rowHeaderCellBackgroundColor', 'rgba(240, 240, 240, 1)'],
                ['rowHeaderCellBorderColor', 'rgba(200, 200, 200, 1)'],
                ['rowHeaderCellBorderWidth', 1],
                ['rowHeaderCellColor', 'rgba(50, 50, 50, 1)'],
                ['rowHeaderCellFont', '16px sans-serif'],
                ['rowHeaderCellHeight', 25],
                ['rowHeaderCellHorizontalAlignment', 'left'],
                ['rowHeaderCellHoverBackgroundColor', 'rgba(235, 235, 235, 1)'],
                ['rowHeaderCellHoverColor', 'rgba(0, 0, 0, 1)'],
                ['rowHeaderCellPaddingBottom', 5],
                ['rowHeaderCellPaddingLeft', 5],
                ['rowHeaderCellPaddingRight', 5],
                ['rowHeaderCellPaddingTop', 5],
                ['rowHeaderCellSelectedBackgroundColor', 'rgba(217, 217, 217, 1)'],
                ['rowHeaderCellSelectedColor', 'rgba(50, 50, 50, 1)'],
                ['rowHeaderCellVerticalAlignment', 'center'],
                ['rowHeaderCellWidth', 57],
                ['scrollBarActiveColor', 'rgba(125, 125, 125, 1)'],
                ['scrollBarBackgroundColor', 'rgba(240, 240, 240, 1)'],
                ['scrollBarBorderColor', 'rgba(202, 202, 202, 1)'],
                ['scrollBarBorderWidth', 0.5],
                ['scrollBarBoxBorderRadius', 4.125],
                ['scrollBarBoxColor', 'rgba(192, 192, 192, 1)'],
                ['scrollBarBoxMargin', 2],
                ['scrollBarBoxMinSize', 15],
                ['scrollBarBoxWidth', 8],
                ['scrollBarCornerBackgroundColor', 'rgba(240, 240, 240, 1)'],
                ['scrollBarCornerBorderColor', 'rgba(202, 202, 202, 1)'],
                ['scrollBarWidth', 11],
                ['selectionOverlayBorderColor', 'rgba(66, 133, 244, 1)'],
                ['selectionOverlayBorderWidth', 0.75],
                ['treeArrowBorderColor', 'rgba(195, 199, 202, 1)'],
                ['treeArrowBorderWidth', 1],
                ['treeArrowClickRadius', 5],
                ['treeArrowColor', 'rgba(155, 155, 155, 1)'],
                ['treeArrowHeight', 8],
                ['treeArrowMarginLeft', 0],
                ['treeArrowMarginRight', 5],
                ['treeArrowMarginTop', 6],
                ['treeArrowWidth', 13],
                ['treeGridHeight', 250],
                ['width', 'auto']
            ]
        };
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/*!*********************!*\
  !*** ./lib/main.js ***!
  \*********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jslint browser: true, unparam: true, todo: true, evil: true*/
/*globals Reflect: false, HTMLElement: true, define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(/*! ./component */ 2),
    __webpack_require__(/*! ./defaults */ 0),
    __webpack_require__(/*! ./draw */ 3),
    __webpack_require__(/*! ./events */ 4),
    __webpack_require__(/*! ./intf */ 5),
    __webpack_require__(/*! ./contextMenu */ 6),
    __webpack_require__(/*! ./dom */ 7),
    __webpack_require__(/*! ./publicMethods */ 8)
], __WEBPACK_AMD_DEFINE_RESULT__ = function context(component) {
    'use strict';
    component = component();
    var modules = Array.prototype.slice.call(arguments);
    function Grid(args) {
        args = args || {};
        var self = {};
        self.isComponent = args.component === undefined;
        self.intf = self.isComponent ? eval('Reflect.construct(HTMLElement, [], new.target)') : {};
        self.args = args;
        self.createGrid = function grid(args) {
            args.component = false;
            return new Grid(args);
        };
        modules.forEach(function (module) {
            module(self);
        });
        self.intf.args = self.args;
        self.intf.init = self.init;
        if (!self.isComponent) {
            self.init();
        }
        return self.intf;
    }
    if (window.HTMLElement) {
        Grid.prototype = Object.create(window.HTMLElement.prototype);
    }
    // export web component
    if (window.customElements) {
        Grid.observedAttributes = component.getObservableAttributes();
        Grid.prototype.disconnectedCallback = function () { this.dispose(); };
        Grid.prototype.attributeChangedCallback = component.attributeChangedCallback;
        Grid.prototype.connectedCallback = component.connectedCallback;
        Grid.prototype.adoptedCallback = component.adoptedCallback;
        window.customElements.define('canvas-datagrid', Grid);
    }
    // export global
    if (window && !window.canvasDatagrid && !window.require) {
        window.canvasDatagrid = function (args) { return new Grid(args); };
    }
    // export amd loader
    module.exports = function grid(args) {
        args = args || {};
        args.component = false;
        return new Grid(args);
    };
    return module.exports;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 2 */
/*!**************************!*\
  !*** ./lib/component.js ***!
  \**************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./defaults */ 0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (defaults) {
    'use strict';
    return function (self) {
        self = self || {};
        var typeMap, component = {};
        function hyphenateProperty(prop, cust) {
            var p = '';
            Array.prototype.forEach.call(prop, function (char) {
                if (char === char.toUpperCase()) {
                    p += '-' + char.toLowerCase();
                    return;
                }
                p += char;
            });
            return (cust ? '--cdg-' : '') + p;
        }
        function getDefaultItem(base, item) {
            var i = {},
                r;
            defaults(i);
            r = i.defaults[base].filter(function (i) {
                return i[0].toLowerCase() === item.toLowerCase()
                    || hyphenateProperty(i[0]) === item.toLowerCase()
                    || hyphenateProperty(i[0], true) === item.toLowerCase();
            })[0];
            return r;
        }
        function applyComponentStyle(intf, self, supressChangeAndDrawEvents) {
            var cStyle = window.getComputedStyle(intf, null),
                defs = {};
            self.computedStyle = cStyle;
            defaults(defs);
            defs = defs.defaults.styles;
            defs.forEach(function (def) {
                var val = cStyle.getPropertyValue(hyphenateProperty(def[0], true));
                if (val !== "") {
                    self.style[def[0]] = typeMap[typeof def[1]](val, def[1]);
                }
            });
            self.draw(true);
            if (!supressChangeAndDrawEvents) {
                self.dispatchEvent('stylechanged', intf.style);
            }
        }
        typeMap = {
            data: function (strData) {
                try {
                    return JSON.parse(strData);
                } catch (e) {
                    throw new Error('Cannot read JSON data in canvas-datagrid data.');
                }
            },
            schema: function (strSchema) {
                try {
                    return JSON.parse(strSchema);
                } catch (e) {
                    throw new Error('Cannot read JSON data in canvas-datagrid schema attribute.');
                }
            },
            number: function (strNum, def) {
                var n = parseInt(strNum, 10);
                return isNaN(n) ? def : n;
            },
            boolean: function (strBool) {
                return (/true/i).test(strBool);
            },
            string: function (str) {
                return str;
            }
        };
        component.getObservableAttributes = function () {
            var i = {}, attrs = ['data', 'schema'];
            defaults(i);
            i.defaults.attributes.forEach(function (attr) {
                attrs.push(attr[0].toLowerCase());
            });
            return attrs;
        };
        component.connectedCallback = function () {
            var intf = this, s;
            if (intf.initialized) { return; }
            intf.initialized = true;
            intf.args.parentNode = intf;
            intf.args.attributes = intf.attributes;
            //HACK init() will secretly return the internal reference object.
            //since init is only run after instantiation in the component version
            //it won't work in the amd version and won't return self, so it is still
            //technically private since it's impossible to get at.
            //this has to be done so intf setters can bet run and alter self without stack overflows
            //intf.style.display = 'block';
            s = intf.init();
            component.observe(intf, s);
            applyComponentStyle(intf, s, true);
            Object.keys(intf.args.attributes).forEach(function (arg) {
                if (intf.attributes[arg] === undefined) { return; }
                intf.attributes[arg] = intf.args.attributes[arg];
            });
            s.resize();
            ['style', 'data', 'schema'].forEach(function (key) {
                Object.defineProperty(intf.args, key, {
                    set: function (value) {
                        s[key] = value;
                        intf.draw();
                    },
                    get: function () {
                        return s[key];
                    }
                });
            });
        };
        component.adoptedCallback = function () {
            this.resize();
        };
        component.attributeChangedCallback = function (attrName, oldVal, newVal) {
            var tfn, intf = this, def;
            if (attrName === 'style') {
                return;
            }
            if (attrName === 'data') {
                intf.args.data = typeMap.data(newVal);
                return;
            }
            if (attrName === 'schema') {
                intf.args.schema = typeMap.schema(newVal);
                return;
            }
            if (attrName === 'class' || attrName === 'className') {
                return;
            }
            def = getDefaultItem('attributes', attrName);
            if (def) {
                tfn = typeMap[typeof def[1]];
                intf.attributes[def[0]] = tfn(newVal);
                return;
            }
            if (/^on/.test(attrName)) {
                intf.addEventListener('on' + attrName, function (e) {
                    eval(newVal);
                });
            }
            return;
        };
        component.observe = function (intf, self) {
            var observer;
            if (!window.MutationObserver) { return; }
            self.applyComponentStyle = function () { applyComponentStyle(intf, self); self.resize(); };
            /**
             * Applies the computed css styles to the grid.  In some browsers, changing directives in attached style sheets does not automatically update the styles in this component.  It is necessary to call this method to update in these cases.
             * @memberof canvasDatagrid
             * @name applyComponentStyle
             * @method
             */
            intf.applyComponentStyle = self.applyComponentStyle;
            observer = new window.MutationObserver(function (mutations) {
                var checkInnerHTML, checkStyle;
                Array.prototype.forEach.call(mutations, function (mutation) {
                    if (mutation.attributeName === 'class'
                            || mutation.attributeName === 'style') {
                        self.applyComponentStyle();
                        return;
                    }
                    if (mutation.target.parentNode.nodeName === 'STYLE') {
                        checkStyle = true;
                        return;
                    }
                    if (mutation.addedNodes.length > 0 || mutation.type === 'characterData') {
                        checkInnerHTML = true;
                    }
                });
                if (checkStyle) {
                    intf.applyComponentStyle();
                }
                if (checkInnerHTML) {
                    intf.data = typeMap.data(intf.innerHTML);
                }
            });
            observer.observe(intf, { characterData: true, childList: true, attributes: true, subtree: true });
            Array.prototype.forEach.call(document.querySelectorAll('style'), function (el) {
                observer.observe(el, { characterData: true, childList: true, attributes: true, subtree: true });
            });
        };
        self.component = component;
        return component;
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 3 */
/*!*********************!*\
  !*** ./lib/draw.js ***!
  \*********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jslint browser: true, unparam: true, todo: true*/
/*globals XMLSerializer: false, define: true, Blob: false, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
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
            self.ctx.fillStyle = self.style.columnHeaderOrderByArrowColor;
            self.ctx.strokeStyle = self.style.columnHeaderOrderByArrowBorderColor;
            self.ctx.beginPath();
            x = x + self.style.columnHeaderOrderByArrowMarginLeft;
            y = y + self.style.columnHeaderOrderByArrowMarginTop;
            if (self.orderDirection === 'asc') {
                self.ctx.moveTo(x, y);
                self.ctx.lineTo(x + self.style.columnHeaderOrderByArrowWidth, y);
                self.ctx.lineTo(x + (self.style.columnHeaderOrderByArrowWidth * 0.5), y + self.style.columnHeaderOrderByArrowHeight);
                self.ctx.moveTo(x, y);
            } else {
                self.ctx.lineTo(x, y + self.style.columnHeaderOrderByArrowHeight);
                self.ctx.lineTo(x + self.style.columnHeaderOrderByArrowWidth, y + self.style.columnHeaderOrderByArrowHeight);
                self.ctx.lineTo(x + (self.style.columnHeaderOrderByArrowWidth * 0.5), y);
                self.ctx.lineTo(x, y + self.style.columnHeaderOrderByArrowHeight);
            }
            self.ctx.stroke();
            self.ctx.fill();
            return self.style.columnHeaderOrderByArrowMarginLeft
                + self.style.columnHeaderOrderByArrowWidth
                + self.style.columnHeaderOrderByArrowMarginRight;
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
                }
            };
            p[pos]();
            self.ctx.stroke();
        }
        function addEllipsis(text, width) {
            var c, w = 0;
            if (self.ellipsisCache[text] && self.ellipsisCache[text][width]) {
                return self.ellipsisCache[text][width];
            }
            //TODO Add ellipsis back when there is a fast way to do it
            w = self.ctx.measureText(text).width;
            self.ellipsisCache[text] = self.ellipsisCache[text] || {};
            c = {value: text, width: w};
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
         * @memberof canvasDatagrid
         * @name draw
         * @method
         */
         // r = literal row index
         // rd = row data array
         // i = user order index
         // o = literal data index
         // y = y drawing cursor
         // x = x drawing cursor
         // s = visible schema array
         // cx = current x drawing cursor sub calculation var
         // cy = current y drawing cursor sub calculation var
         // a = static cell (like corner cell)
         // p = perf counter
         // l = data length
         // u = current cell
         // h = current height
         // w = current width
        self.draw = function (internal) {
            if (self.dispatchEvent('beforedraw', {})) { return; }
            if (!self.isChildGrid && (!self.height || !self.width)) {
                return;
            }
            if (self.isChildGrid && internal) {
                requestAnimationFrame(self.parentGrid.draw);
                return;
            }
            if (self.intf.visible === false) {
                return;
            }
            // initial values
            var checkScrollHeight, rowHeaderCell, p, cx, cy, treeGrid, rowOpen,
                rowHeight, cornerCell, y, x, c, h, w, s, r, rd, aCell,
                selectionBorders = [],
                rowHeaders = [],
                l = self.data.length,
                u = self.currentCell || {},
                rowHeaderCellHeight = self.getRowHeaderCellHeight(),
                columnHeaderCellWidth = self.getColumnHeaderCellWidth(),
                cellHeight = self.style.cellHeight;
            drawCount += 1;
            p = performance.now();
            self.visibleRowHeights = [];
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
                        isCorner: true,
                        isScrollBoxCorner: true,
                        style: 'scroll-box-corner'
                    },
                    m = (self.style.scrollBarBoxMargin * 2),
                    d = self.style.scrollBarBoxMargin * 0.5;
                self.ctx.strokeStyle = self.style.scrollBarBorderColor;
                self.ctx.lineWidth = self.style.scrollBarBorderWidth;
                // vertical
                v.x += w - self.style.scrollBarWidth - self.style.scrollBarBorderWidth - d;
                v.y += rowHeaderCellHeight;
                v.width = self.style.scrollBarWidth + self.style.scrollBarBorderWidth + d;
                v.height = h - rowHeaderCellHeight - self.style.scrollBarWidth - d - m;
                self.ctx.fillStyle = self.style.scrollBarBackgroundColor;
                fillRect(v.x, v.y, v.width, v.height + m);
                strokeRect(v.x, v.y, v.width, v.height + m);
                // vertical box
                vb.x = v.x + self.style.scrollBarBoxMargin;
                vb.y = rowHeaderCellHeight + self.style.scrollBarBoxMargin
                    + ((v.height - self.scrollBox.scrollBoxHeight)
                        * (self.scrollBox.scrollTop / self.scrollBox.scrollHeight));
                vb.width = self.style.scrollBarBoxWidth;
                vb.height = self.scrollBox.scrollBoxHeight;
                self.ctx.fillStyle = self.style.scrollBarBoxColor;
                if (/vertical/.test(u.context)) {
                    self.ctx.fillStyle = self.style.scrollBarActiveColor;
                }
                if (vb.height < v.height) {
                    radiusRect(vb.x, vb.y, vb.width, vb.height, self.style.scrollBarBoxBorderRadius);
                    self.ctx.stroke();
                    self.ctx.fill();
                }
                // horizontal
                n.x += columnHeaderCellWidth;
                n.y += h - self.style.scrollBarWidth - d;
                n.width = w - self.style.scrollBarWidth - columnHeaderCellWidth - d - m;
                n.height = self.style.scrollBarWidth + self.style.scrollBarBorderWidth + d;
                self.ctx.fillStyle = self.style.scrollBarBackgroundColor;
                fillRect(n.x, n.y, n.width + m, n.height);
                strokeRect(n.x, n.y, n.width + m, n.height);
                // horizontal box
                nb.y = n.y + self.style.scrollBarBoxMargin;
                nb.x = columnHeaderCellWidth + self.style.scrollBarBoxMargin
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
                        cellGridAttributes,
                        cell,
                        isHeader = /HeaderCell/.test(cellStyle),
                        isCorner = /cornerCell/.test(cellStyle),
                        isRowHeader = 'rowHeaderCell' === cellStyle,
                        isColumnHeader = 'columnHeaderCell' === cellStyle,
                        selected = self.selections[rowOrderIndex] && self.selections[rowOrderIndex].indexOf(columnOrderIndex) !== -1,
                        hovered = self.hovers[d[self.uniqueId]] && self.hovers[d[self.uniqueId]].indexOf(columnOrderIndex) !== -1,
                        active = self.activeCell.rowIndex === rowOrderIndex && self.activeCell.columnIndex === columnOrderIndex,
                        isGrid = typeof d[header.name] === 'object' && d[header.name] !== null && d[header.name] !== undefined,
                        activeHeader = (self.orders.rows[self.activeCell.rowIndex] === rowOrderIndex
                                || self.orders.columns[self.activeCell.columnIndex] === columnOrderIndex)
                            && (columnOrderIndex === -1 || rowOrderIndex === -1)
                            ? (isRowHeader ? 'activeRowHeaderCell' : 'activeColumnHeaderCell') : false,
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
                    if (x + cellWidth + self.style.cellBorderWidth < 0) {
                        x += cellWidth + self.style.cellBorderWidth;
                    }
                    if (active) {
                        cellStyle = 'activeCell';
                    }
                    if (self.visibleRows.indexOf(rowIndex) === -1 && !isHeader) {
                        self.visibleRows.push(rowIndex);
                    }
                    val = self.dispatchEvent('formatcellvalue', ev);
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
                        offsetTop: self.canvasOffsetTop + cy,
                        offsetLeft: self.canvasOffsetLeft + cx,
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
                        isColumnHeader: isColumnHeader,
                        isHeaderCellCap: !!header.isHeaderCellCap,
                        isRowHeader: isRowHeader,
                        rowOpen: rowOpen,
                        header: header,
                        columnIndex: columnOrderIndex,
                        rowIndex: rowOrderIndex,
                        sortColumnIndex: headerIndex,
                        sortRowIndex: rowIndex,
                        isGrid: isGrid,
                        gridId: (self.attributes.name || '') + d[self.uniqueId] + ':' + header[self.uniqueId],
                        parentGrid: self.intf,
                        innerHTML: '',
                        activeHeader: activeHeader,
                        value: isHeader && !isRowHeader ? (header.title || header.name) : d[header.name]
                    };
                    ev.cell = cell;
                    cell.userHeight = cell.isHeader ? self.sizes.rows[-1] : rowHeight;
                    cell.userWidth = cell.isHeader ? self.sizes.columns.cornerCell : self.sizes.columns[header[self.uniqueId]];
                    cell[self.uniqueId] = d[self.uniqueId];
                    self.visibleCells.unshift(cell);
                    if (self.dispatchEvent('beforerendercell', ev)) { return; }
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
                        if (cell.isGrid && !self.dispatchEvent('beforerendercellgrid', ev)) {
                            if (!self.childGrids[cell.gridId]) {
                                cellGridAttributes = self.args.cellGridAttributes || self.args;
                                cellGridAttributes.name = self.attributes.saveAppearance ? cell.gridId : undefined;
                                cellGridAttributes.parentNode = cell;
                                cellGridAttributes.data = d[header.name];
                                ev.cellGridAttributes = cellGridAttributes;
                                if (self.dispatchEvent('beforecreatecellgrid', ev)) { return; }
                                self.childGrids[cell.gridId] = self.createGrid(cellGridAttributes);
                                self.sizes.rows[rd[self.uniqueId]]
                                    = self.sizes.rows[rd[self.uniqueId]] || self.style.cellGridHeight;
                                checkScrollHeight = true;
                            }
                            cell.grid = self.childGrids[cell.gridId];
                            cell.grid.parentNode = cell;
                            cell.grid.visible = true;
                            cell.grid.draw();
                            self.dispatchEvent('rendercellgrid', ev);
                        } else if (!cell.isGrid) {
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
                                ? f(ev) : '';
                            if (val === undefined && !f) {
                                val = '';
                                console.warn('canvas-datagrid: Unknown format '
                                    + header.type + ' add a cellFormater');
                            }
                            cell.formattedValue = ((val !== undefined && val !== null) ? val : '').toString();
                            if (self.columnFilters && self.columnFilters[val] !== undefined && isHeader) {
                                cell.formattedValue = self.attributes.filterTextPrefix + val;
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
                        if (!self.selections[cell.rowIndex] || cell.columnIndex === s.length
                                || self.selections[cell.rowIndex].indexOf(cell.columnIndex + 1) === -1) {
                            selectionBorders.push([cell, 'r']);
                        }
                    }
                    self.ctx.restore();
                    x += cell.width + self.style.cellBorderWidth;
                    return cell.width;
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
                        width: self.style.rowHeaderCellWidth,
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
                var d, g = s.length, i, o, columnHeaderCell, header;
                rowHeaders.forEach(function (rArgs) {
                    y = rArgs[3];
                    cellHeight = rArgs[4];
                    drawRowHeader(rArgs[0], rArgs[1], rArgs[2]);
                });
                if (self.attributes.showColumnHeaders) {
                    x = (self.scrollBox.scrollLeft * -1) + self.scrollPixelLeft;
                    if (self.attributes.showRowHeaders) {
                        x += columnHeaderCellWidth;
                    }
                    y = 0;
                    // cell height might have changed during drawing
                    cellHeight = self.getRowHeaderCellHeight();
                    for (o = self.scrollIndexLeft; o < g; o += 1) {
                        i = self.orders.columns[o];
                        header = s[i];
                        d = {
                            title: header.title,
                            name: header.name,
                            width: header.width,
                            style: 'columnHeaderCell',
                            type: 'string',
                            index: o,
                            order: i
                        };
                        columnHeaderCell = {'columnHeaderCell': header.title || header.name};
                        columnHeaderCell[self.uniqueId] = 'h' + header[self.uniqueId];
                        d[self.uniqueId] = header[self.uniqueId];
                        x += drawCell(columnHeaderCell, -1, -1)(d, o, i);
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
                            isHeaderCell: true,
                            isHeaderCellCap: true,
                            type: 'string',
                            index: s.length
                        };
                        c[self.uniqueId] = 'columnHeaderCell';
                        drawCell({endCap: ''}, -1, -1)(c, -1, -1);
                    }
                    // fill in the space right of the headers
                    if (self.attributes.showRowHeaders) {
                        cornerCell = {'cornerCell': '' };
                        cornerCell[self.uniqueId] = 'cornerCell';
                        x = 0;
                        c = {
                            name: 'cornerCell',
                            width: self.style.rowHeaderCellWidth,
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
                    x += columnHeaderCellWidth;
                }
                cellHeight = rowHeight;
                for (o = self.scrollIndexLeft; o < g; o += 1) {
                    i = self.orders.columns[o];
                    x += drawCell(rd, r, d)(s[i], i, o);
                    if (x > self.width) {
                        self.scrollIndexRight = o;
                        self.scrollPixelRight = x;
                        break;
                    }
                }
                // cell height might have changed during drawing
                cellHeight = rowHeight;
                x = (self.scrollBox.scrollLeft * -1) + self.scrollPixelLeft + self.style.cellBorderWidth;
                // don't draw a tree for the new row
                treeGrid = self.childGrids[rd[self.uniqueId]];
                if (r !== self.data.length && rowOpen) {
                    treeGrid.visible = true;
                    treeGrid.parentNode = {
                        offsetTop: y + rowSansTreeHeight + self.canvasOffsetTop,
                        offsetLeft: columnHeaderCellWidth - 1 + self.canvasOffsetLeft,
                        offsetHeight: treeHeight,
                        offsetWidth: self.width - columnHeaderCellWidth - self.style.scrollBarWidth - 1,
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
                self.visibleRowHeights[r] = rowHeight;
                y += cellHeight + self.style.cellBorderWidth;
                return true;
            }
            function initDraw() {
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
                x = (self.scrollBox.scrollLeft * -1) + self.scrollPixelLeft + self.style.cellBorderWidth;
                y = (self.scrollBox.scrollTop * -1) + rowHeaderCellHeight + self.scrollPixelTop + self.style.cellBorderWidth;
                for (r = self.scrollIndexTop; r < l; r += 1) {
                    n = self.orders.rows[r];
                    if (!drawRow(n, r)) {
                        self.scrollIndexBottom = r;
                        self.scrollPixelBottom = y;
                        break;
                    }
                }
                if (self.attributes.showNewRow) {
                    if (self.attributes.showRowHeaders) {
                        x += columnHeaderCellWidth;
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
                if (self.attributes.selectionMode === 'row') {
                    if (self.activeCell && self.activeCell.rowIndex === aCell.rowIndex) {
                        self.ctx.lineWidth = self.style.activeCellOverlayBorderWidth;
                        self.ctx.strokeStyle = self.style.activeCellOverlayBorderColor;
                        strokeRect(0, aCell.y, self.getHeaderWidth() + columnHeaderCellWidth, self.visibleRowHeights[aCell.rowIndex]);
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
                    d.scrollBox = self.scrollBox.toString();
                    d.scrollIndex = '{"top": ' + self.scrollIndexTop + ', "left": ' + self.scrollIndexLeft + '}';
                    d.scrollPixel = '{"top": ' + self.scrollPixelTop + ', "left": ' + self.scrollPixelLeft + '}';
                    d.canvasOffset = '{"top": ' + self.canvasOffsetTop + ', "left": ' + self.canvasOffsetLeft + '}';
                    d.pointerLockPosition =  self.pointerLockPosition ?
                            self.pointerLockPosition.x + ', ' + self.pointerLockPosition.y : '';
                    d.size = '{"width": ' + self.width + ', "height": ' + self.height + '}';
                    d.mouse = '{"x": ' + self.mouse.x + ', "y": ' + self.mouse.y + '}';
                    d.touch = !self.touchStart
                        ? '' : '{"x": ' + self.touchStart.x + ', "y": ' + self.touchStart.y + "}";
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
                        fillRect(columnHeaderCellWidth, lh + (index * lh), 800, lh);
                        self.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
                        fillText(m, columnHeaderCellWidth + 1, rowHeaderCellHeight + (index * lh));
                    });
                    self.ctx.restore();
                }
            }
            self.ctx.save();
            initDraw();
            drawBackground();
            drawRows();
            drawSelectionBorders();
            drawActiveCell();
            drawHeaders();
            drawReorderMarkers();
            drawScrollBars();
            if (checkScrollHeight) {
                self.resize(true);
            }
            drawBorder();
            drawDebug();
            if (self.dispatchEvent('afterdraw', {})) { return; }
            self.ctx.restore();
        };
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 4 */
/*!***********************!*\
  !*** ./lib/events.js ***!
  \***********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
    'use strict';
    return function (self) {
        var touchDelta = {x: 0, y: 0, scrollTop: 0, scrollLeft: 0},
            touchAnimateTo = {scrollLeft: 0, scrollTop: 0},
            touchSigma = {scrollLeft: 0, scrollTop: 0},
            xPPS = 0,
            yPPS = 0,
            touchingCell = false,
            startingCell = false,
            wheeling,
            animationFrames = 0;
        function calculateCssSize(sizeString, parentSize) {
            var p;
            if (sizeString === 'auto' || sizeString === '') { return parentSize; }
            if (/%/.test(sizeString)) {
                p = parseFloat(sizeString, 10);
                return parentSize * (p * 0.01);
            }
            return parseFloat(sizeString, 10);
        }
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
                t: performance.now() / 10
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
            self.stopPropagation(e);
            e.preventDefault();
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
            self.touchCalcTimeout = setInterval(self.calculatePPS, 10);
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
            var d = self.getTouchPos(e),
                rowHeaderCellHeight = self.getRowHeaderCellHeight(),
                columnHeaderCellWidth = self.getColumnHeaderCellWidth();
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
                self.scrollBox.scrollTop = self.scrollBox.scrollHeight * (d.y / (self.height - rowHeaderCellHeight));
            } else if (/horizontal-scroll-/.test(startingCell.style)) {
                self.scrollBox.scrollLeft = self.scrollBox.scrollWidth * (d.x / (self.width - columnHeaderCellWidth));
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
            self.touchend(e);
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
        self.resizeDomElement = function () {
            if (!self.parentIsCanvas) {
                if (self.shadowRootParentElement) {
                    // shadow dom browsers
                    self.width = calculateCssSize(self.style.width, self.shadowRootParentElement.offsetWidth);
                    self.height = calculateCssSize(self.style.height, self.shadowRootParentElement.offsetHeight);
                    // self.intf.style.width = self.height + 'px';
                    // self.intf.style.height = self.height + 'px';
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
                // TODO: What the hell are these numbers!?  They are probably some value in the style.
                scrollDragPositionOffsetY = 30,
                scrollDragPositionOffsetX = 15;
            if (self.isChildGrid) {
                self.width = self.parentNode.offsetWidth;
                self.height = self.parentNode.offsetHeight;
            } else {
                self.resizeDomElement();
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
                        dragBounds.right = s.length - 1;
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
                if (['rowHeaderCell', 'columnHeaderCell'].indexOf(self.currentCell.style) === -1 && !ctrl) {
                    self.setActiveCell(i.columnIndex, i.rowIndex);
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
                    .test(self.dragStartObject.context) && !self.currentCell.isColumnHeader) {
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
            if (['ns-resize', 'ew-resize'].indexOf(self.dragMode) !== -1) {
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
            wheeling = setTimeout(function () {
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
                    self.scrollBox.scrollTo(deltaX + l, deltaY + t);
                }
                if (t !== self.scrollBox.scrollTop || l !== self.scrollBox.scrollLeft) {
                    e.preventDefault();
                }
                wheeling = undefined;
            }, 1);
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
                            if (row[key] !== null
                                    && row[key] !== false
                                    && row[key] !== undefined
                                    && row[key].replace) {
                                return r.push('"' + row[key].replace(/"/g, '""') + '"');
                            }
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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 5 */
/*!*********************!*\
  !*** ./lib/intf.js ***!
  \*********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jslint browser: true, unparam: true, todo: true*/
/*globals HTMLElement: false, Reflect: false, define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
    'use strict';
    return function (self, ctor) {
        self.orders = {
            rows: [],
            columns: []
        };
        self.visibleRowHeights = [];
        self.hasFocus = false;
        self.activeCell = {
            columnIndex: 0,
            rowIndex: 0
        };
        self.storageName = 'canvasDataGrid';
        self.invalidSearchExpClass = 'canvas-datagrid-invalid-search-regExp';
        self.localStyleLibraryStorageKey = 'canvas-datagrid-user-style-library';
        self.uniqueId = '_canvasDataGridUniqueId';
        self.orderBy = self.uniqueId;
        self.orderDirection = 'asc';
        self.columnFilters = {};
        self.filters = {};
        self.frozenRows = [];
        self.ellipsisCache = {};
        self.scrollBox = {};
        self.visibleRows = [];
        /**
         * Used internally to keep track of sizes of row, columns and child grids.
         * @memberof canvasDatagrid
         * @property sizes
         * @readonly
         */
        self.sizes = {
            rows: {},
            columns: {},
            trees: {}
        };
        self.currentFilter = function () {
            return true;
        };
        self.selections = [];
        self.hovers = {};
        self.attributes = {};
        self.style = {};
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
        self.componentL1Events = {};
        self.eventNames = ['afterdraw', 'afterrendercell', 'attributechanged', 'beforebeginedit',
            'beforecreatecellgrid', 'beforedraw', 'beforeendedit', 'beforerendercell', 'beforerendercellgrid',
            'beginedit', 'cellmouseout', 'cellmouseover', 'click', 'collapsetree', 'contextmenu', 'copy',
            'datachanged', 'dblclick', 'endedit', 'expandtree', 'formatcellvalue', 'keydown', 'keypress',
            'keyup', 'mousedown', 'mousemove', 'mouseup', 'newrow', 'ordercolumn', 'rendercell', 'rendercellgrid',
            'renderorderbyarrow', 'rendertext', 'rendertreearrow', 'reorder', 'reordering', 'resize',
            'resizecolumn', 'resizerow', 'schemachanged', 'scroll', 'selectionchanged', 'stylechanged',
            'touchcancel', 'touchend', 'touchmove', 'touchstart', 'wheel'];
        self.mouse = { x: 0, y: 0};
        self.getSelectedData = function (expandToRow) {
            var d = [], s = self.getVisibleSchema(), l = self.data.length;
            self.selections.forEach(function (row, index) {
                if (index === l) { return; }
                if (row.length === 0) {
                    d[index] = null;
                    return;
                }
                d[index] = {};
                if (expandToRow) {
                    s.forEach(function (column) {
                        d[index][column.name] = self.data[index][column.name];
                    });
                } else {
                    row.forEach(function (col) {
                        if (col === -1 || !s[col]) { return; }
                        d[index][s[col].name] = self.data[index][s[col].name];
                    });
                }
            });
            return d;
        };
        self.fillArray = function (low, high, step) {
            step = step || 1;
            var i = [], x;
            for (x = low; x <= high; x += step) {
                i[x] = x;
            }
            return i;
        };
        self.getRowHeaderCellHeight = function () {
            if (!self.attributes.showColumnHeaders) { return 0; }
            return self.sizes.rows[-1] || self.style.columnHeaderCellHeight;
        };
        self.getColumnHeaderCellWidth = function () {
            if (!self.attributes.showRowHeaders) { return 0; }
            return self.sizes.columns.cornerCell || self.style.rowHeaderCellWidth;
        };
        self.setStorageData = function () {
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
        };
        self.getSchema = function () {
            return self.schema || self.tempSchema;
        };
        self.createColumnOrders = function () {
            var s = self.getSchema();
            self.orders.columns = self.fillArray(0, s.length - 1);
        };
        self.createRowOrders = function () {
            self.orders.rows = self.fillArray(0, self.data.length - 1);
        };
        self.getVisibleSchema = function () {
            return self.getSchema().filter(function (col) { return !col.hidden; });
        };
        self.applyDefaultValue = function (row, header) {
            var d = header.defaultValue || '';
            if (typeof d === 'function') {
                d = d.apply(self.intf, [header]);
            }
            row[header.name] = d;
        };
        self.createNewRowData = function () {
            self.newRow = {};
            self.newRow[self.uniqueId] = self.uId;
            self.uId += 1;
            self.getSchema().forEach(function forEachHeader(header) {
                self.applyDefaultValue(self.newRow, header);
            });
        };
        self.getSchemaNameHash = function (key) {
            var n = 0;
            while (self.schemaHashes[key]) {
                n += 1;
                key = key + n;
            }
            return key;
        };
        self.filter = function (type) {
            var f = self.filters[type];
            if (!f && type !== undefined) {
                console.warn('Cannot find filter for type %s, falling back to substring match.', type);
                f = self.filters.string;
            }
            return f;
        };
        self.getBestGuessDataType = function (columnName) {
            var t, x, l = self.data.length;
            for (x = 0; x < l; x += 1) {
                if ([null, undefined].indexOf(self.data[x][columnName]) !== -1) {
                    t = typeof self.data[x];
                    return t === 'object' ? 'string' : t;
                }
            }
            return 'string';
        };
        self.drawChildGrids = function () {
            Object.keys(self.childGrids).forEach(function (gridKey) {
                self.childGrids[gridKey].draw();
            });
        };
        self.resizeChildGrids = function () {
            Object.keys(self.childGrids).forEach(function (gridKey) {
                self.childGrids[gridKey].resize();
            });
        };
        self.autoScrollZone = function (e, x, y, ctrl) {
            var setTimer,
                columnHeaderCellWidth = self.getColumnHeaderCellWidth(),
                rowHeaderCellHeight = self.getRowHeaderCellHeight();
            if (x > self.width - self.attributes.selectionScrollZone && x < self.width) {
                self.scrollBox.scrollLeft += self.attributes.selectionScrollIncrement;
                setTimer = true;
            }
            if (y > self.height - self.attributes.selectionScrollZone && y < self.height) {
                self.scrollBox.scrollTop += self.attributes.selectionScrollIncrement;
                setTimer = true;
            }
            if (x - self.attributes.selectionScrollZone - columnHeaderCellWidth < 0) {
                self.scrollBox.scrollLeft -= self.attributes.selectionScrollIncrement;
                setTimer = true;
            }
            if (y - self.attributes.selectionScrollZone - rowHeaderCellHeight < 0) {
                self.scrollBox.scrollTop -= self.attributes.selectionScrollIncrement;
                setTimer = true;
            }
            if (setTimer && !ctrl && self.currentCell && self.currentCell.columnIndex !== -1) {
                self.scrollTimer = setTimeout(self.mousemove, self.attributes.scrollRepeatRate, e);
            }
        };
        self.refreshFromOrigialData = function () {
            self.data = self.originalData.filter(function (row) {
                return true;
            });
        };
        self.validateColumn = function (c, s) {
            if (!c.name) {
                throw new Error('A column must contain at least a name.');
            }
            if (s.filter(function (i) { return i.name === c.name; }).length > 0) {
                throw new Error('A column with the name '
                    + c.name + ' already exists and cannot be added again.');
            }
            return true;
        };
        self.setDefaults = function (obj1, obj2, key, def) {
            obj1[key] = obj2[key] === undefined ? def : obj2[key];
        };
        self.setAttributes = function () {
            self.defaults.attributes.forEach(function eachAttribute(i) {
                self.setDefaults(self.attributes, self.args, i[0], i[1]);
            });
        };
        self.setStyle = function () {
            self.defaults.styles.forEach(function eachStyle(i) {
                self.setDefaults(self.style, self.args.style || {}, i[0], i[1]);
            });
        };
        self.autosize = function (colName) {
            self.getVisibleSchema().forEach(function (col) {
                if (col.name === colName || colName === undefined) {
                    self.fitColumnToValues(col.name);
                }
            });
            self.fitColumnToValues('cornerCell');
        };
        self.dispose = function () {
            if (!self.isChildGrid && self.canvas && self.canvas.parentNode) {
                self.canvas.parentNode.removeChild(self.canvas);
            }
            self.eventParent.removeEventListener('mouseup', self.mouseup, false);
            self.eventParent.removeEventListener('mousedown', self.mousedown, false);
            self.eventParent.removeEventListener('dblclick', self.dblclick, false);
            self.eventParent.removeEventListener('click', self.click, false);
            self.eventParent.removeEventListener('mousemove', self.mousemove);
            self.eventParent.removeEventListener('wheel', self.scrollWheel, false);
            self.canvas.removeEventListener('contextmenu', self.contextmenu, false);
            self.canvas.removeEventListener('copy', self.copy);
            self.controlInput.removeEventListener('keypress', self.keypress, false);
            self.controlInput.removeEventListener('keyup', self.keyup, false);
            self.controlInput.removeEventListener('keydown', self.keydown, false);
            window.removeEventListener('resize', self.resize);
            if (self.observer && self.observer.disconnect) {
                self.observer.disconnect();
            }
        };
        self.tryLoadStoredOrders = function () {
            var s;
            if (self.storedSettings
                    && typeof self.storedSettings.orders === 'object'
                    && self.storedSettings.orders !== null) {
                if (self.storedSettings.orders.rows.length >= self.data.length) {
                    self.orders.rows = self.storedSettings.orders.rows;
                }
                s = self.getSchema();
                if (self.storedSettings.orders.columns.length === s.length) {
                    self.orders.columns = self.storedSettings.orders.columns;
                }
                self.orderBy = self.storedSettings.orderBy === undefined
                    ? self.uniqueId : self.storedSettings.orderBy;
                self.orderDirection = self.storedSettings.orderDirection === undefined
                    ? self.uniqueId : self.storedSettings.orderDirection;
                if (self.getHeaderByName(self.orderBy) && self.orderDirection) {
                    self.order(self.orderBy, self.orderDirection);
                }
            }
        };
        self.getFontHeight = function (fontStyle) {
            return parseFloat(fontStyle, 10);
        };
        self.parseFont = function (key) {
            if (/Font/.test(key)) {
                self.style[key + 'Height'] = self.getFontHeight(self.style[key]);
            }
        };
        self.initProp = function (propName) {
            if (!self.args[propName]) { return; }
            Object.keys(self.args[propName]).forEach(function (key) {
                self[propName][key] = self.args[propName][key];
            });
        };
        self.init = function () {
            if (self.initialized) { return; }
            var publicStyleKeyIntf = {};
            self.setAttributes();
            self.setStyle();
            self.initScrollBox();
            self.setDom();
            self.type = 'canvas-datagrid';
            self.initialized = true;
            self.pointerLockPosition = {x: 0, y: 0};
            Object.keys(self.style).forEach(self.parseFont);
            self.intf.type = self.type;
            self.intf.addEventListener = self.addEventListener;
            self.intf.removeEventListener = self.removeEventListener;
            self.intf.dispatchEvent = self.dispatchEvent;
            self.intf.dispose = self.dispose;
            self.intf.appendTo = self.appendTo;
            self.intf.filters = self.filters;
            self.intf.sorters = self.sorters;
            self.intf.autosize = self.autosize;
            self.intf.beginEditAt = self.beginEditAt;
            self.intf.endEdit = self.endEdit;
            self.intf.setActiveCell = self.setActiveCell;
            self.intf.scrollIntoView = self.scrollIntoView;
            self.intf.clearChangeLog = self.clearChangeLog;
            self.intf.gotoCell = self.gotoCell;
            self.intf.gotoRow = self.gotoRow;
            self.intf.findColumnScrollLeft = self.findColumnScrollLeft;
            self.intf.findRowScrollTop = self.findRowScrollTop;
            self.intf.fitColumnToValues = self.fitColumnToValues;
            self.intf.findColumnMaxTextLength = self.findColumnMaxTextLength;
            self.intf.disposeContextMenu = self.disposeContextMenu;
            self.intf.getCellAt = self.getCellAt;
            self.intf.isCellVisible = self.isCellVisible;
            self.intf.order = self.order;
            self.intf.draw = self.draw;
            self.intf.selectArea = self.selectArea;
            self.intf.clipElement = self.clipElement;
            self.intf.getSchemaFromData = self.getSchemaFromData;
            self.intf.setFilter = self.setFilter;
            self.intf.selectRow = self.selectRow;
            self.intf.parentGrid = self.parentGrid;
            self.intf.toggleTree = self.toggleTree;
            self.intf.expandTree = self.expandTree;
            self.intf.collapseTree = self.collapseTree;
            self.intf.canvas = self.canvas;
            self.intf.context = self.ctx;
            self.intf.insertRow = self.insertRow;
            self.intf.deleteRow = self.deleteRow;
            self.intf.addRow = self.addRow;
            self.intf.insertColumn = self.insertColumn;
            self.intf.deleteColumn = self.deleteColumn;
            self.intf.addColumn = self.addColumn;
            self.intf.getClippingRect = self.getClippingRect;
            self.intf.setRowHeight = self.setRowHeight;
            self.intf.setColumnWidth = self.setColumnWidth;
            self.intf.resetColumnWidths = self.resetColumnWidths;
            self.intf.resetRowHeights = self.resetRowHeights;
            self.intf.resize = self.resize;
            self.intf.selectColumn = self.selectColumn;
            self.intf.selectRow = self.selectRow;
            self.intf.selectAll = self.selectAll;
            self.intf.drawChildGrids = self.drawChildGrids;
            self.intf.assertPxColor = self.assertPxColor;
            self.intf.clearPxColorAssertions = self.clearPxColorAssertions;
            self.intf.integerToAlpha = self.integerToAlpha;
            self.intf.copy = self.copy;
            Object.keys(self.style).forEach(function (key) {
                // unless this line is here, Object.keys() will not work on <instance>.style
                publicStyleKeyIntf[key] = undefined;
                Object.defineProperty(publicStyleKeyIntf, key, {
                    get: function () {
                        return self.style[key];
                    },
                    set: function (value) {
                        self.parseFont(value);
                        self.style[key] = value;
                        self.draw(true);
                        self.dispatchEvent('stylechanged', {name: key, value: value});
                    }
                });
            });
            Object.defineProperty(self.intf, 'shadowRoot', {
                get: function () {
                    return self.shadowRoot;
                }
            });
            Object.defineProperty(self.intf, 'activeCell', {
                get: function () {
                    return self.activeCell;
                }
            });
            /**
             * When true, the grid is has focus.
             * @memberof canvasDatagrid
             * @property hasFocus
             * @readonly
             */
            Object.defineProperty(self.intf, 'hasFocus', {
                get: function () {
                    return self.hasFocus;
                }
            });
            if (!self.args.component) {
                Object.defineProperty(self.intf, 'style', {
                    get: function () {
                        return publicStyleKeyIntf;
                    },
                    set: function (value) {
                        Object.keys(value).forEach(function (key) {
                            self.parseFont(value);
                            self.style[key] = value[key];
                        });
                        self.draw(true);
                        self.dispatchEvent('stylechanged', {name: 'style', value: value});
                    }
                });
            }
            Object.defineProperty(self.intf, 'attributes', { value: {}});
            Object.keys(self.attributes).forEach(function (key) {
                Object.defineProperty(self.intf.attributes, key, {
                    get: function () {
                        return self.attributes[key];
                    },
                    set: function (value) {
                        self.attributes[key] = value;
                        self.draw(true);
                        self.dispatchEvent('attributechanged', {name: key, value: value[key]});
                    }
                });
            });
            self.filters.string = function (value, filterFor) {
                value = String(value);
                var filterRegExp,
                    regEnd = /\/(i|g|m)*$/,
                    pattern = regEnd.exec(filterFor),
                    flags = pattern ? pattern[0].substring(1) : '',
                    flagLength = flags.length;
                self.invalidFilterRegEx = undefined;
                if (filterFor.substring(0, 1) === '/' && pattern) {
                    try {
                        filterRegExp = new RegExp(filterFor.substring(1, filterFor.length - (flagLength + 1)), flags);
                    } catch (e) {
                        self.invalidFilterRegEx = e;
                        return;
                    }
                    return filterRegExp.test(value);
                }
                return value.toString ? value.toString().toLocaleUpperCase()
                    .indexOf(filterFor.toLocaleUpperCase()) !== -1 : false;
            };
            self.filters.number = function (value, filterFor) {
                if (!filterFor) { return true; }
                return value === filterFor;
            };
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
                    if (typeof self.storedSettings.sizes === 'object'
                            && self.storedSettings.sizes !== null) {
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
            ['formatters', 'filters', 'sorters'].forEach(self.initProp);
            if (self.args.data) {
                self.intf.data = self.args.data;
            }
            if (!self.data) {
                self.intf.data = [];
            }
            if (self.args.schema) {
                self.intf.schema = self.args.schema;
            }
            if (self.isChildGrid) {
                requestAnimationFrame(function () { self.resize(true); });
            } else {
                self.resize(true);
            }
            return self;
        };
        /**
         * Removes focus from the grid.
         * @memberof canvasDatagrid
         * @name blur
         * @method
         */
        self.intf.blur = function (e) {
            self.hasFocus = false;
        };
        /**
         * Focuses on the grid.
         * @memberof canvasDatagrid
         * @name focus
         * @method
         */
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
                self.resize(true);
            }
        });
        Object.defineProperty(self.intf, 'width', {
            get: function () {
                return self.parentNode.width;
            },
            set: function (value) {
                self.parentNode.width = value;
                self.resize(true);
            }
        });
        Object.defineProperty(self.intf, 'visibleRowHeights', {
            get: function () {
                return self.visibleRowHeights;
            }
        });
        Object.defineProperty(self.intf, 'openChildren', {
            get: function () {
                return self.openChildren;
            }
        });
        Object.defineProperty(self.intf, 'childGrids', {
            get: function () {
                return Object.keys(self.childGrids).map(function (gridId) {
                    return self.childGrids[gridId];
                });
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
                if (!self.isChildGrid) {
                    throw new TypeError('Cannot set property parentNode which has only a getter');
                }
                self.parentNode = value;
            }
        });
        Object.defineProperty(self.intf, 'offsetParent', {
            get: function () {
                return self.parentNode;
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
        self.intf.formatters = self.formatters;
        self.normalizeDataset = function (data, callback) {
            var i, d, max, syncFnInvoked;
            if (data === null || data === '' || data === undefined) {
                return callback([]);
            }
            if (typeof data === 'string'
                    || typeof data === 'number'
                    || typeof data === 'boolean') {
                data = [{'0': data}];
            }
            if (!Array.isArray(data) && typeof data === 'object') {
                data = [data];
            }
            if ((!Array.isArray(data[0]) && typeof data[0] === 'object' && data[0] !== null)
                            || (Array.isArray(data) && data.length === 0)) {
                return callback(data);
            }
            if (typeof data === 'function') {
                i = data.apply(self.intf, [function (d) {
                    if (syncFnInvoked) {
                        console.warn('Detected a callback to the data setter function after the same function already returned a value synchronously.');
                    }
                    self.normalizeDataset(d, callback);
                }]);
                if (i) {
                    syncFnInvoked = true;
                    self.normalizeDataset(i, callback);
                }
                return;
            }
            if (!Array.isArray(data) && typeof data === 'object') {
                data = [data];
            }
            if (Array.isArray(data)) {
                if (!Array.isArray(data[0])) {
                    //array of something?  throw it all into 1 row!
                    data = [data];
                }
                // find the longest length
                max = 0;
                d = [];
                data.forEach(function (row) {
                    max = Math.max(max, row.length);
                });
                // map against length indexes
                data.forEach(function (row, index) {
                    var x;
                    d[index] = {};
                    for (x = 0; x < max; x += 1) {
                        d[index][x] = row[x];
                    }
                });
                return callback(d);
            }
            throw new Error('Unsupported data type.  Must be an array of arrays or an array of objects, function or string.');
        };
        self.eventNames.forEach(function (eventName) {
            Object.defineProperty(self.intf, 'on' + eventName, {
                get: function () {
                    return self.componentL1Events[eventName];
                },
                set: function (value) {
                    self.events[eventName] = [];
                    self.componentL1Events[eventName] = value;
                    if (!value) { return; }
                    self.addEventListener(eventName, value);
                }
            });
        });
        Object.defineProperty(self.intf, 'frozenRows', {
            get: function () {
                return self.frozenRows;
            }
        });
        Object.defineProperty(self.intf, 'scrollIndexRect', {
            get: function () {
                return {
                    top: self.scrollIndexTop,
                    right: self.scrollIndexRight,
                    bottom: self.scrollIndexBottom,
                    left: self.scrollIndexLeft
                };
            }
        });
        Object.defineProperty(self.intf, 'scrollPixelRect', {
            get: function () {
                return {
                    top: self.scrollPixelTop,
                    right: self.scrollPixelRight,
                    bottom: self.scrollPixelBottom,
                    left: self.scrollPixelLeft
                };
            }
        });
        Object.defineProperty(self.intf, 'selectionBounds', {
            get: function () {
                return self.getSelectionBounds();
            }
        });
        Object.defineProperty(self.intf, 'selectedRows', {
            get: function () {
                return self.getSelectedData(true);
            }
        });
        Object.defineProperty(self.intf, 'selectedCells', {
            get: function () {
                return self.getSelectedData();
            }
        });
        Object.defineProperty(self.intf, 'visibleSchema', {
            get: function () {
                return self.getVisibleSchema().map(function eachDataRow(col) {
                    return col;
                });
            }
        });
        Object.defineProperty(self.intf, 'ctx', {
            get: function () {
                return self.ctx;
            }
        });
        Object.defineProperty(self.intf, 'schema', {
            get: function schemaGetter() {
                return self.getSchema();
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
                    column[self.uniqueId] = self.getSchemaNameHash(column.name);
                    column.filter = column.filter || self.filter(column.type);
                    column.type = column.type || 'string';
                    column.index = index;
                    column.columnIndex = index;
                    column.rowIndex = -1;
                    return column;
                });
                self.tempSchema = undefined;
                self.createNewRowData();
                self.createColumnOrders();
                self.tryLoadStoredOrders();
                self.resize(true);
                self.dispatchEvent('schemachanged', {schema: self.schema});
            }
        });
        Object.defineProperty(self.intf, 'data', {
            get: function dataGetter() {
                return self.data.map(function (row) {
                    delete row[self.uniqueId];
                    return row;
                });
            },
            set: function dataSetter(value) {
                self.normalizeDataset(value, function (d) {
                    self.originalData = d.map(function eachDataRow(row) {
                        row[self.uniqueId] = self.uId;
                        self.uId += 1;
                        return row;
                    });
                    self.changes = [];
                    //TODO apply filter to incoming dataset
                    self.data = self.originalData;
                    if (!self.schema) {
                        self.tempSchema = self.getSchemaFromData();
                    }
                    if (!self.schema && self.data.length === 0) {
                        self.tempSchema = [{name: ''}];
                        self.tempSchema[0][self.uniqueId] = self.getSchemaNameHash('');
                    }
                    if (self.tempSchema && !self.schema) {
                        self.createColumnOrders();
                        self.tryLoadStoredOrders();
                        self.dispatchEvent('schemachanged', {schema: self.tempSchema});
                    }
                    self.createNewRowData();
                    if (self.attributes.autoResizeColumns && self.data.length > 0
                            && self.storedSettings === undefined) {
                        self.autosize();
                    }
                    self.fitColumnToValues('cornerCell', true);
                    if (!self.resize() || !self.isChildGrid) { self.draw(true); }
                    self.createRowOrders();
                    self.tryLoadStoredOrders();
                    self.dispatchEvent('datachanged', {data: self.data});
                });
            }
        });
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
            self.scrollBox.toString = function () {
                return '{"width": ' + scrollWidth
                    + ', "height": ' + scrollHeight
                    + ', "left": ' + scrollLeft
                    + ', "top": ' + scrollTop + '}';
            };
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
        return;
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 6 */
/*!****************************!*\
  !*** ./lib/contextMenu.js ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false, Event: false*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
    'use strict';
    return function (self) {
        var zIndexTop = 2, hoverScrollTimeout, autoCompleteContext;
        function createContextMenu(ev, pos, items, parentContextMenu) {
            var container = document.createElement('div'),
                upArrow = document.createElement('div'),
                downArrow = document.createElement('div'),
                children = [],
                selectedIndex = -1,
                intf = {},
                rect;
            if (!Array.isArray(items)) { throw new Error('createContextMenu expects an array.'); }
            function createItems() {
                items.forEach(function (item) {
                    var contextItemContainer = document.createElement('div'),
                        childMenuArrow;
                    function removeChildContext(e) {
                        if (e.relatedTarget === container
                                || item.contextMenu.container === e.relatedTarget
                                || childMenuArrow === e.relatedTarget
                                || (contextItemContainer === e.relatedTarget)
                                ) { return; }
                        item.contextMenu.dispose();
                        children.splice(children.indexOf(item.contextMenu), 1);
                        item.contextMenu = undefined;
                        contextItemContainer.removeEventListener('mouseout', removeChildContext);
                        container.removeEventListener('mouseout', removeChildContext);
                        contextItemContainer.setAttribute('contextOpen', '0');
                        contextItemContainer.setAttribute('opening', '0');
                    }
                    function contextAddCallback(items) {
                        // check yet again if the user hasn't moved off
                        if (contextItemContainer.getAttribute('opening') !== '1' ||
                                contextItemContainer.getAttribute('contextOpen') === '1') {
                            return;
                        }
                        var cPos = contextItemContainer.getBoundingClientRect();
                        cPos = {
                            left: cPos.left + self.style.childContextMenuMarginLeft + container.offsetWidth,
                            top: cPos.top + self.style.childContextMenuMarginTop,
                            bottom: cPos.bottom,
                            right: cPos.right
                        };
                        item.contextMenu = createContextMenu(ev, cPos, items, intf);
                        contextItemContainer.setAttribute('contextOpen', '1');
                        contextItemContainer.addEventListener('mouseout', removeChildContext);
                        container.addEventListener('mouseout', removeChildContext);
                        children.push(item.contextMenu);
                    }
                    function createChildContext() {
                        var i;
                        if (contextItemContainer.getAttribute('contextOpen') === '1') {
                            return;
                        }
                        contextItemContainer.setAttribute('opening', '1');
                        if (typeof item.items === 'function') {
                            i  = item.items.apply(intf, [function (items) {
                                contextAddCallback(items);
                            }]);
                            if (i !== undefined && Array.isArray(i)) {
                                contextAddCallback(i);
                            }
                            return;
                        }
                        contextAddCallback(item.items);
                    }
                    function addItem(item) {
                        function addContent(content) {
                            if (content === null) { return; }
                            if (typeof content === 'function') {
                                return addContent(content(ev));
                            }
                            if (typeof content === 'object') {
                                contextItemContainer.appendChild(content);
                                return;
                            }
                            self.createInlineStyle(contextItemContainer, 'canvas-datagrid-context-menu-item');
                            contextItemContainer.addEventListener('mouseover', function () {
                                self.createInlineStyle(contextItemContainer, 'canvas-datagrid-context-menu-item:hover');
                            });
                            contextItemContainer.addEventListener('mouseout', function () {
                                self.createInlineStyle(contextItemContainer, 'canvas-datagrid-context-menu-item');
                            });
                            contextItemContainer.innerHTML = content;
                            return;
                        }
                        addContent(item.title);
                        item.contextItemContainer = contextItemContainer;
                        if ((item.items && item.items.length > 0) || typeof item.items === 'function') {
                            childMenuArrow = document.createElement('div');
                            self.createInlineStyle(childMenuArrow, 'canvas-datagrid-context-child-arrow');
                            childMenuArrow.innerHTML = self.style.childContextMenuArrowHTML;
                            contextItemContainer.appendChild(childMenuArrow);
                            contextItemContainer.addEventListener('mouseover', createChildContext);
                            contextItemContainer.addEventListener('mouseout', function () {
                                contextItemContainer.setAttribute('opening', '0');
                            });
                        }
                        if (item.click) {
                            contextItemContainer.addEventListener('click', function (ev) {
                                item.click.apply(self, [ev]);
                            });
                        }
                    }
                    addItem(item);
                    container.appendChild(contextItemContainer);
                });
            }
            function clickIndex(idx) {
                items[idx].contextItemContainer.dispatchEvent(new Event('click'));
            }
            function checkArrowVisibility() {
                if (container.scrollTop > 0) {
                    self.parentDOMNode.appendChild(upArrow);
                } else if (upArrow.parentNode) {
                    upArrow.parentNode.removeChild(upArrow);
                }
                if (container.scrollTop >= container.scrollHeight - container.offsetHeight && downArrow.parentNode) {
                    downArrow.parentNode.removeChild(downArrow);
                } else if (container.scrollHeight - container.offsetHeight > 0
                        && !(container.scrollTop >= container.scrollHeight - container.offsetHeight)) {
                    self.parentDOMNode.appendChild(downArrow);
                }
            }
            function startHoverScroll(type) {
                return function t() {
                    var a = self.attributes.contextHoverScrollAmount;
                    if (type === 'up' && container.scrollTop === 0) { return; }
                    if (type === 'down' && container.scrollTop === container.scrollHeight) { return; }
                    container.scrollTop += (type === 'up' ? -a : a);
                    hoverScrollTimeout = setTimeout(t, self.attributes.contextHoverScrollRateMs, type);
                };
            }
            function endHoverScroll(type) {
                return function () {
                    clearTimeout(hoverScrollTimeout);
                };
            }
            function init() {
                var loc = {},
                    s = self.scrollOffset(self.canvas);
                createItems();
                self.createInlineStyle(container, 'canvas-datagrid-context-menu');
                loc.x = pos.left - s.left;
                loc.y = pos.top - s.top;
                loc.height = 0;
                zIndexTop += 1;
                container.style.position = 'absolute';
                upArrow.style.color = self.style.contextMenuArrowColor;
                downArrow.style.color = self.style.contextMenuArrowColor;
                [upArrow, downArrow].forEach(function (el) {
                    el.style.textAlign = 'center';
                    el.style.position = 'absolute';
                    el.style.zIndex = zIndexTop + 1;
                });
                container.style.zIndex = zIndexTop;
                if (parentContextMenu && parentContextMenu.inputDropdown) {
                    container.style.maxHeight = window.innerHeight - loc.y - self.style.autocompleteBottomMargin + 'px';
                    container.style.minWidth = pos.width + 'px';
                    loc.y += pos.height;
                }
                container.style.left = loc.x + 'px';
                container.style.top = loc.y + 'px';
                container.addEventListener('scroll', checkArrowVisibility);
                container.addEventListener('wheel', function (e) {
                    if (self.hasFocus) {
                        container.scrollTop += e.deltaY;
                        container.scrollLeft += e.deltaX;
                    }
                    checkArrowVisibility();
                });
                upArrow.innerHTML = self.style.contextMenuArrowUpHTML;
                downArrow.innerHTML = self.style.contextMenuArrowDownHTML;
                container.appendChild(upArrow);
                document.body.appendChild(downArrow);
                document.body.appendChild(container);
                rect = container.getBoundingClientRect();
                if (rect.bottom > window.innerHeight && !(parentContextMenu && parentContextMenu.inputDropdown)) {
                    loc.y = window.innerHeight - container.offsetHeight;
                    if (loc.y < 0) { loc.y = 0; }
                    if (container.offsetHeight > window.innerHeight) {
                        container.style.height = window.innerHeight - self.style.contextMenuWindowMargin + 'px';
                    }
                }
                if (rect.right > window.innerWidth) {
                    if (parentContextMenu) {
                        loc.x = parentContextMenu.container.offsetLeft - container.offsetWidth;
                    } else {
                        loc.x = window.innerWidth - container.offsetWidth;
                    }
                }
                container.style.left = loc.x + 'px';
                container.style.top = loc.y + 'px';
                rect = container.getBoundingClientRect();
                upArrow.style.top = rect.top + 'px';
                downArrow.style.top = rect.top + rect.height - downArrow.offsetHeight + 'px';
                upArrow.style.left = rect.left + 'px';
                downArrow.style.left = rect.left + 'px';
                downArrow.style.width = container.offsetWidth + 'px';
                upArrow.style.width = container.offsetWidth + 'px';
                downArrow.addEventListener('mouseover', startHoverScroll('down'));
                downArrow.addEventListener('mouseout', endHoverScroll('down'));
                upArrow.addEventListener('mouseover', startHoverScroll('up'));
                upArrow.addEventListener('mouseout', endHoverScroll('up'));
                checkArrowVisibility();
            }
            intf.parentGrid = self.intf;
            intf.parentContextMenu = parentContextMenu;
            intf.container = container;
            init();
            intf.clickIndex = clickIndex;
            intf.rect = rect;
            intf.items = items;
            intf.upArrow = upArrow;
            intf.downArrow = downArrow;
            intf.dispose = function () {
                clearTimeout(hoverScrollTimeout);
                children.forEach(function (c) {
                    c.dispose();
                });
                [downArrow, upArrow, container].forEach(function (el) {
                    if (el.parentNode) { el.parentNode.removeChild(el); }
                });
            };
            Object.defineProperty(intf, 'selectedIndex', {
                get: function () {
                    return selectedIndex;
                },
                set: function (value) {
                    if (typeof value !== 'number' || isNaN(value || !isFinite(value))) {
                        throw new Error('Context menu selected index must be a sane number.');
                    }
                    selectedIndex = value;
                    if (selectedIndex > items.length - 1) {
                        selectedIndex = items.length - 1;
                    }
                    if (selectedIndex < 0) {
                        selectedIndex = 0;
                    }
                    items.forEach(function (item, index) {
                        if (index === selectedIndex) {
                            return self.createInlineStyle(item.contextItemContainer, 'canvas-datagrid-context-menu-item:hover');
                        }
                        self.createInlineStyle(item.contextItemContainer, 'canvas-datagrid-context-menu-item');
                    });
                }
            });
            return intf;
        }
        function createFilterContextMenuItems(e) {
            var filterContainer = document.createElement('div'),
                filterLabel = document.createElement('div'),
                filterAutoCompleteButton = document.createElement('button'),
                filterInput = document.createElement('input'),
                n = e.cell && e.cell.header ? e.cell.header.title || e.cell.header.name : '',
                autoCompleteItems,
                iRect;
            function checkRegExpErrorState() {
                filterInput.style.background = self.style.contextFilterInputBackground;
                filterInput.style.color = self.style.contextFilterInputColor;
                if (self.invalidFilterRegEx) {
                    filterInput.style.background = self.style.contextFilterInvalidRegExpBackground;
                    filterInput.style.color = self.style.contextFilterInvalidRegExpColor;
                }
            }
            function fillAutoComplete() {
                autoCompleteItems = {};
                self.data.filter(function (d, i) { return i < self.attributes.maxAutoCompleteItems; }).forEach(function (row) {
                    var value = row[e.cell.header.name];
                    if (autoCompleteItems[value]) { return; }
                    autoCompleteItems[value] = {
                        title: self.formatters[e.cell.header.type || 'string']({ cell: { value: value }}),
                        click: function (e) {
                            filterInput.value = value;
                            e.stopPropagation();
                            filterInput.dispatchEvent(new Event('keyup'));
                            self.disposeAutocomplete();
                            return;
                        }
                    };
                });
                autoCompleteItems = Object.keys(autoCompleteItems).map(function (key) {
                    return autoCompleteItems[key];
                });
            }
            function createAutoCompleteContext(ev) {
                if (ev && [40, 38, 13, 9, 27].indexOf(ev.keyCode) !== -1) { return; }
                fillAutoComplete();
                iRect = filterInput.getBoundingClientRect();
                if (autoCompleteContext) {
                    autoCompleteContext.dispose();
                    autoCompleteContext = undefined;
                }
                autoCompleteContext = createContextMenu(e, {
                    left: iRect.left,
                    top: iRect.top,
                    right: iRect.right,
                    bottom: iRect.bottom,
                    height: iRect.height,
                    width: iRect.width
                }, autoCompleteItems, {inputDropdown: true});
                autoCompleteContext.selectedIndex = 0;
            }
            self.createInlineStyle(filterLabel, 'canvas-datagrid-context-menu-label');
            self.createInlineStyle(filterAutoCompleteButton, 'canvas-datagrid-context-menu-filter-button');
            self.createInlineStyle(filterInput, 'canvas-datagrid-context-menu-filter-input');
            checkRegExpErrorState();
            filterInput.onclick = self.disposeAutocomplete;
            filterInput.addEventListener('keydown', function (e) {
                //down
                if (e.keyCode === 40) {
                    autoCompleteContext.selectedIndex += 1;
                }
                //up
                if (e.keyCode === 38) {
                    autoCompleteContext.selectedIndex -= 1;
                }
                //enter
                if (e.keyCode === 13) {
                    autoCompleteContext.clickIndex(autoCompleteContext.selectedIndex);
                    self.disposeContextMenu();
                }
                //tab
                if (e.keyCode === 9) {
                    autoCompleteContext.clickIndex(autoCompleteContext.selectedIndex);
                    e.preventDefault();
                }
                //esc
                if (e.keyCode === 27) {
                    self.disposeContextMenu();
                }
            });
            filterInput.addEventListener('keyup', function () {
                self.setFilter(e.cell.header.name, filterInput.value);
            });
            filterInput.addEventListener('keyup', createAutoCompleteContext);
            ['focus', 'blur', 'keydown', 'keyup', 'change'].forEach(function (en) {
                filterInput.addEventListener(en, checkRegExpErrorState);
            });
            filterInput.value = e.cell.header ? self.columnFilters[e.cell.header.name] || '' : '';
            filterLabel.innerHTML = self.attributes.filterOptionText.replace(/%s/g, n);
            filterAutoCompleteButton.onclick = function () {
                if (autoCompleteContext) {
                    return self.disposeAutocomplete();
                }
                createAutoCompleteContext();
            };
            filterAutoCompleteButton.innerHTML = self.style.contextFilterButtonHTML;
            filterContainer.addEventListener('click', function (e) {
                return e.stopPropagation();
            });
            filterContainer.appendChild(filterLabel);
            filterContainer.appendChild(filterInput);
            filterContainer.appendChild(filterAutoCompleteButton);
            e.items.push({
                title: filterContainer
            });
            if (Object.keys(self.columnFilters).length) {
                Object.keys(self.columnFilters).forEach(function (cf) {
                    var h = self.getHeaderByName(cf);
                    e.items.push({
                        title: self.attributes.removeFilterOptionText.replace(/%s/g, h.title || h.name),
                        click: function removeFilterClick(e) {
                            e.preventDefault();
                            self.setFilter(cf, '');
                            self.controlInput.focus();
                        }
                    });
                });
            }
        }
        function addDefaultContextMenuItem(e) {
            var isNormalCell = !(e.cell.isBackground || e.cell.isHeaderCellCap
                    || e.cell.isScrollBar || e.cell.isCorner || e.cell.isRowHeader)
                    && e.cell.header;
            if (self.attributes.showFilter && isNormalCell) {
                createFilterContextMenuItems(e);
            }
            if (self.attributes.showCopy
                    && self.selections.reduce(function (p, r) {
                        return p + r.length;
                    }, 0) > 0) {
                e.items.push({
                    title: self.attributes.copyText,
                    click: function () {
                        document.execCommand('copy');
                        self.disposeContextMenu();
                        self.controlInput.focus();
                    }
                });
            }
            if (self.attributes.saveAppearance && self.attributes.showClearSettingsOption
                    && (Object.keys(self.sizes.rows).length > 0
                        || Object.keys(self.sizes.columns).length > 0)) {
                e.items.push({
                    title: self.attributes.clearSettingsOptionText,
                    click: function (e) {
                        e.preventDefault();
                        self.sizes.rows = {};
                        self.sizes.columns = {};
                        self.createRowOrders();
                        self.createColumnOrders();
                        self.storedSettings = undefined;
                        self.dispatchEvent('resizecolumn', {columnWidth: self.style.columnWidth});
                        self.dispatchEvent('resizerow', {cellHeight: self.style.cellHeight});
                        self.setStorageData();
                        self.resize(true);
                        self.disposeContextMenu();
                        self.controlInput.focus();
                    }
                });
            }
            if (self.attributes.allowSorting && self.attributes.showOrderByOption && isNormalCell) {
                e.items.push({
                    title: self.attributes.showOrderByOptionTextAsc.replace('%s', e.cell.header.title || e.cell.header.name),
                    click: function (ev) {
                        ev.preventDefault();
                        self.order(e.cell.header.name, 'asc');
                        self.controlInput.focus();
                    }
                });
                e.items.push({
                    title: self.attributes.showOrderByOptionTextDesc.replace('%s', e.cell.header.title || e.cell.header.name),
                    click: function (ev) {
                        ev.preventDefault();
                        self.order(e.cell.header.name, 'desc');
                        self.disposeContextMenu();
                        self.controlInput.focus();
                    }
                });
            }
        }
        self.disposeAutocomplete = function () {
            if (autoCompleteContext) {
                autoCompleteContext.dispose();
                autoCompleteContext = undefined;
            }
        };
        self.disposeContextMenu = function () {
            document.removeEventListener('click', self.disposeContextMenu);
            zIndexTop = 2;
            self.disposeAutocomplete();
            if (self.contextMenu) {
                self.contextMenu.dispose();
            }
            self.contextMenu = undefined;
        };
        self.contextmenuEvent = function (e, overridePos) {
            if (!self.hasFocus && e.target !== self.canvas) {
                return;
            }
            function createDiposeEvent() {
                requestAnimationFrame(function () {
                    document.addEventListener('click', self.disposeContextMenu);
                    document.removeEventListener('mouseup', createDiposeEvent);
                });
            }
            var items = [],
                pos = overridePos || self.getLayerPos(e, true),
                ev = {
                    NativeEvent: e,
                    cell: self.getCellAt(pos.x, pos.y),
                    items: items
                };
            if (!ev.cell.isGrid) {
                addDefaultContextMenuItem(ev);
            }
            if (self.dispatchEvent('contextmenu', ev)) {
                return;
            }
            if (!ev.cell.isGrid) {
                if (self.contextMenu) {
                    self.disposeContextMenu();
                }
                self.contextMenu = createContextMenu(ev, {
                    left: pos.x + pos.rect.left + self.style.contextMenuMarginLeft + self.canvasOffsetLeft,
                    top: pos.y + pos.rect.top + self.style.contextMenuMarginTop + self.canvasOffsetTop,
                    right: ev.cell.width + ev.cell.x + pos.rect.left,
                    bottom: ev.cell.height + ev.cell.y + pos.rect.top,
                    height: ev.cell.height,
                    width: ev.cell.width
                }, items);
                document.addEventListener('mouseup', createDiposeEvent);
                e.preventDefault();
            }
        };
        return;
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 7 */
/*!********************!*\
  !*** ./lib/dom.js ***!
  \********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
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
                rowHeaderCellHeight = self.getRowHeaderCellHeight(),
                columnHeaderCellWidth = self.getColumnHeaderCellWidth();
            boundingRect.top -= s.top;
            boundingRect.left -= s.left;
            eleRect.top -= s.top;
            eleRect.left -= s.left;
            clipRect.h = boundingRect.top + boundingRect.height - ele.offsetTop - self.style.scrollBarWidth;
            clipRect.w = boundingRect.left + boundingRect.width - ele.offsetLeft - self.style.scrollBarWidth;
            clipRect.x = boundingRect.left + (eleRect.left * -1) + columnHeaderCellWidth;
            clipRect.y = boundingRect.top + (eleRect.top * -1) + rowHeaderCellHeight;
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
                    bx2 = (self.style.cellBorderWidth * 2),
                    cell = self.getVisibleCellByIndex(self.input.editCell.columnIndex, self.input.editCell.rowIndex)
                        || {x: -100, y: -100, height: 0, width: 0};
                self.input.style.left = pos.left + cell.x - self.style.cellBorderWidth + self.canvasOffsetLeft - s.left + 'px';
                self.input.style.top = pos.top + cell.y - bx2 + self.canvasOffsetTop - s.top + 'px';
                self.input.style.height = cell.height - bx2 - 1 + 'px';
                self.input.style.width = cell.width - bx2 - self.style.cellPaddingLeft + 'px';
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
        self.getLayerPos = function (e) {
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
            var cell = self.getVisibleCellByIndex(x, y),
                s = self.getVisibleSchema(),
                enumItems,
                //HACK for IE10, does not like literal enum
                enu = cell.header['enum'],
                option,
                valueInEnum;
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
                self.shadowRoot = self.args.parentNode.attachShadow({mode: self.args.debug ? 'open' : 'closed'});
                self.args.parentNode = self.shadowRoot;
            }
            self.appendTo(self.args.parentNode);
        };
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 8 */
/*!******************************!*\
  !*** ./lib/publicMethods.js ***!
  \******************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
    'use strict';
    return function (self) {
        // all methods here are exposed by intf
        // to users
        /**
         * Converts a integer into a letter A - ZZZZZ...
         * @memberof canvasDatagrid
         * @name integerToAlpha
         * @method
         * @param {column} n The number to convert.
         */
        self.integerToAlpha = function (n) {
            var ordA = 'a'.charCodeAt(0),
                ordZ = 'z'.charCodeAt(0),
                len = ordZ - ordA + 1,
                s = '';
            while (n >= 0) {
                s = String.fromCharCode(n % len + ordA) + s;
                n = Math.floor(n / len) - 1;
            }
            return s;
        };
        /**
         * Inserts a new column before the specified index into the schema.
         * @see canvasDatagrid#schema
         * @tutorial schema
         * @memberof canvasDatagrid
         * @name insertColumn
         * @method
         * @param {column} c The column to insert into the schema.
         * @param {number} index The index of the column to insert before.
         */
        self.insertColumn = function (c, index) {
            var s = self.getSchema();
            if (s.length < index) {
                throw new Error('Index is beyond the length of the schema.');
            }
            self.validateColumn(c, s);
            s.splice(index, 0, c);
            self.data.forEach(function (row) {
                self.applyDefaultValue(row, c);
            });
            self.intf.schema = s;
        };
        /**
         * Deletes a column from the schema at the specified index.
         * @memberof canvasDatagrid
         * @name deleteColumn
         * @tutorial schema
         * @method
         * @param {number} index The index of the column to delete.
         */
        self.deleteColumn = function (index) {
            var s = self.getSchema();
            // remove data matching this column name from data
            self.data.forEach(function (row) {
                delete row[s[index].name];
            });
            s.splice(index, 1);
            self.intf.schema = s;
        };
        /**
         * Adds a new column into the schema.
         * @see canvasDatagrid#schema
         * @tutorial schema
         * @memberof canvasDatagrid
         * @name addColumn
         * @method
         * @param {column} c The column to add to the schema.
         */
        self.addColumn = function (c) {
            var s = self.getSchema();
            self.validateColumn(c, s);
            s.push(c);
            self.data.forEach(function (row) {
                self.applyDefaultValue(row, c);
            });
            self.intf.schema = s;
        };
        /**
         * Deletes a row from the dataset at the specified index.
         * @memberof canvasDatagrid
         * @name deleteRow
         * @method
         * @param {number} index The index of the row to delete.
         */
        self.deleteRow = function (index) {
            self.originalData.splice(index, 1);
            self.setFilter();
            self.resize(true);
        };
        /**
         * Inserts a new row into the dataset before the specified index.
         * @memberof canvasDatagrid
         * @name insertRow
         * @method
         * @param {object} d data.
         * @param {number} index The index of the row to insert before.
         */
        self.insertRow = function (d, index) {
            if (self.originalData.length < index) {
                throw new Error('Index is beyond the length of the dataset.');
            }
            self.originalData.splice(index, 0, d);
            self.getSchema().forEach(function (c) {
                if (d[c.name] === undefined) {
                    self.applyDefaultValue(self.originalData[index], c);
                }
            });
            self.setFilter();
            self.resize(true);
        };
        /**
         * Adds a new row into the dataset.
         * @memberof canvasDatagrid
         * @name addRow
         * @method
         * @param {object} d data.
         */
        self.addRow = function (d) {
            self.originalData.push(d);
            self.getSchema().forEach(function (c) {
                if (d[c.name] === undefined) {
                    self.applyDefaultValue(self.originalData[self.originalData.length - 1], c);
                }
            });
            self.setFilter();
            self.resize(true);
        };
        /**
         * Sets the height of a given row by index number.
         * @memberof canvasDatagrid
         * @name setRowHeight
         * @method
         * @param {number} rowIndex The index of the row to set.
         * @param {number} height Height to set the row to.
         */
        self.setRowHeight = function (rowIndex, height) {
            self.sizes.rows[self.data[rowIndex][self.uniqueId]] = height;
            self.draw(true);
        };
        /**
         * Sets the width of a given column by index number.
         * @memberof canvasDatagrid
         * @name setColumnWidth
         * @method
         * @param {number} colIndex The index of the column to set.
         * @param {number} width Width to set the column to.
         */
        self.setColumnWidth = function (colIndex, width) {
            var s = self.getSchema();
            self.sizes.columns[s[colIndex][self.uniqueId]] = width;
            self.draw(true);
        };
        /**
         * Removes any changes to the width of the columns due to user or api interaction, setting them back to the schema or style default.
         * @memberof canvasDatagrid
         * @name resetColumnWidths
         * @tutorial schema
         * @method
         */
        self.resetColumnWidths = function () {
            self.sizes.columns = {};
            self.draw(true);
        };
        /**
         * Removes any changes to the height of the rows due to user or api interaction, setting them back to the schema or style default.
         * @memberof canvasDatagrid
         * @name resetRowHeights
         * @tutorial schema
         * @method
         */
        self.resetRowHeights = function () {
            self.sizes.rows = {};
            self.draw(true);
        };
        /**
         * Sets the value of the filter.
         * @memberof canvasDatagrid
         * @name setFilter
         * @method
         * @param {string} column Name of the column to filter.
         * @param {string} value The value to filter for.
         */
        self.setFilter = function (column, value) {
            function applyFilter() {
                self.refreshFromOrigialData();
                Object.keys(self.columnFilters).forEach(function (filter) {
                    var header = self.getHeaderByName(column);
                    if (!header) {
                        return;
                    }
                    self.currentFilter = header.filter || self.filter(column.type || 'string');
                    self.data = self.data.filter(function (row) {
                        return self.currentFilter(row[filter], self.columnFilters[filter]);
                    });
                });
                self.resize();
                self.draw(true);
            }
            if (column === undefined && value === undefined) {
                self.columnFilters = {};
                return applyFilter();
            }
            if (column && (value === '' || value === undefined)) {
                delete self.columnFilters[column];
            } else {
                self.columnFilters[column] = value;
            }
            applyFilter();
        };
        /**
         * Returns the number of pixels to scroll down to line up with row rowIndex.
         * @memberof canvasDatagrid
         * @name findRowScrollTop
         * @method
         * @param {number} rowIndex The row index of the row to scroll find.
         */
        self.findRowScrollTop = function (rowIndex) {
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
        };
        /**
         * Returns the number of pixels to scroll to the left to line up with column columnIndex.
         * @memberof canvasDatagrid
         * @name findColumnScrollLeft
         * @method
         * @param {number} columnIndex The column index of the column to find.
         */
        self.findColumnScrollLeft = function (columnIndex) {
            var left = 0, y = 0, s = self.getSchema(), l = s.length - 1;
            if (columnIndex > l) {
                throw new Error('Impossible column index');
            }
            while (y < columnIndex) {
                left += self.sizes.columns[s[y][self.uniqueId]] || s[y].width;
                y += 1;
            }
            return left;
        };
        /**
         * Scrolls the cell at cell x, row y.
         * @memberof canvasDatagrid
         * @name gotoCell
         * @method
         * @param {number} x The column index of the cell to scroll to.
         * @param {number} y The row index of the cell to scroll to.
         */
        self.gotoCell = function (x, y) {
            if (x !== undefined) {
                self.scrollBox.scrollLeft = self.findColumnScrollLeft(x);
            }
            if (y !== undefined) {
                self.scrollBox.scrollTop = self.findRowScrollTop(y);
            }
        };
        /**
         * Scrolls the row y.
         * @memberof canvasDatagrid
         * @name gotoRow
         * @method
         * @param {number} y The row index of the cell to scroll to.
         */
        self.gotoRow = function (y) {
            self.gotoCell(0, y);
        };
        /**
         * Scrolls the cell at cell x, row y into view if it is not already.
         * @memberof canvasDatagrid
         * @name scrollIntoView
         * @method
         * @param {number} x The column index of the cell to scroll into view.
         * @param {number} y The row index of the cell to scroll into view.
         */
        self.scrollIntoView = function (x, y) {
            if (self.visibleCells.filter(function (cell) {
                    return (cell.rowIndex === y || y === undefined)
                        && (cell.columnIndex === x || x === undefined)
                        && cell.x > 0
                        && cell.y > 0
                        && cell.x + cell.width < self.width
                        && cell.y + cell.height < self.height;
                }).length === 0) {
                self.gotoCell(x, y);
            }
        };
        /**
         * Sets the active cell. Requires redrawing.
         * @memberof canvasDatagrid
         * @name setActiveCell
         * @method
         * @param {number} x The column index of the cell to set active.
         * @param {number} y The row index of the cell to set active.
         */
        self.setActiveCell = function (x, y) {
            self.activeCell = {
                rowIndex: y,
                columnIndex: x
            };
        };
        /**
         * Selects every visible cell.
         * @memberof canvasDatagrid
         * @name selectAll
         * @method
         */
        self.selectAll = function () {
            self.selectArea({
                top: 0,
                left: 0,
                right: self.getVisibleSchema().length - 1,
                bottom: self.data.length - 1
            });
        };
        /**
         * Returns true if the selected columnIndex is selected on every row.
         * @memberof canvasDatagrid
         * @name isColumnSelected
         * @method
         * @param {number} columnIndex The column index to check.
         */
        self.isColumnSelected = function (columnIndex) {
            var colIsSelected = true;
            self.data.forEach(function (row, rowIndex) {
                if (!self.selections[rowIndex] || self.selections[rowIndex].indexOf(self.orders.columns[columnIndex]) === -1) {
                    colIsSelected = false;
                }
            });
            return colIsSelected;
        };
        /**
         * Selects a column.
         * @memberof canvasDatagrid
         * @name selectColumn
         * @method
         * @param {number} columnIndex The column index to select.
         * @param {boolean} toggleSelectMode When true, behaves as if you were holding control/command when you clicked the column.
         * @param {boolean} shift When true, behaves as if you were holding shift when you clicked the column.
         * @param {boolean} supressSelectionchangedEvent When true, prevents the selectionchanged event from firing.
         */
        self.selectColumn = function (columnIndex, ctrl, shift, supressEvent) {
            var s, e, x;
            function addCol(i) {
                self.data.forEach(function (row, rowIndex) {
                    self.selections[rowIndex] = self.selections[rowIndex] || [];
                    if (self.selections[rowIndex].indexOf(i) === -1) {
                        self.selections[rowIndex].push(i);
                    }
                });
            }
            function removeCol(i) {
                self.data.forEach(function (row, rowIndex) {
                    self.selections[rowIndex] = self.selections[rowIndex] || [];
                    if (self.selections[rowIndex].indexOf(i) !== -1) {
                        self.selections[rowIndex].splice(self.selections[rowIndex].indexOf(i), 1);
                    }
                });
            }
            if (shift) {
                if (!self.activeCell) { return; }
                s = Math.min(self.activeCell.columnIndex, columnIndex);
                e = Math.max(self.activeCell.columnIndex, columnIndex);
                for (x = s; e > x; x += 1) {
                    addCol(x);
                }
            }
            if (!ctrl && !shift) {
                self.selections = [];
                self.activeCell.columnIndex = columnIndex;
                self.activeCell.rowIndex = self.scrollIndexTop;
            }
            if (ctrl && self.isColumnSelected(columnIndex)) {
                removeCol(columnIndex);
            } else {
                addCol(columnIndex);
            }
            if (supressEvent) { return; }
            self.dispatchEvent('selectionchanged', {
                selectedData: self.getSelectedData(),
                selections: self.selections,
                selectionBounds: self.getSelectionBounds()
            });
        };
        /**
         * Selects a row.
         * @memberof canvasDatagrid
         * @name selectRow
         * @method
         * @param {number} rowIndex The row index to select.
         * @param {boolean} ctrl When true, behaves as if you were holding control/command when you clicked the row.
         * @param {boolean} shift When true, behaves as if you were holding shift when you clicked the row.
         * @param {boolean} supressSelectionchangedEvent When true, prevents the selectionchanged event from firing.
         */
        self.selectRow = function (rowIndex, ctrl, shift, supressEvent) {
            var x, st, en, s = self.getSchema();
            function addRow(ri) {
                self.selections[ri] = [];
                self.selections[ri].push(-1);
                s.forEach(function (col) {
                    self.selections[ri].push(col.index);
                });
            }
            if (self.dragAddToSelection === false || self.dragObject === undefined) {
                if (self.selections[rowIndex] && self.selections[rowIndex].length - 1 === s.length) {
                    if (ctrl) {
                        self.selections[rowIndex] = [];
                        return;
                    }
                }
            }
            if (self.dragAddToSelection === true || self.dragObject === undefined) {
                if (shift && self.dragObject === undefined) {
                    if (!self.activeCell) { return; }
                    st = Math.min(self.activeCell.rowIndex, rowIndex);
                    en = Math.max(self.activeCell.rowIndex, rowIndex);
                    for (x = st; en >= x; x += 1) {
                        addRow(x);
                    }
                } else {
                    addRow(rowIndex);
                }
            }
            if (supressEvent) { return; }
            self.dispatchEvent('selectionchanged', {
                selectedData: self.getSelectedData(),
                selections: self.selections,
                selectionBounds: self.selectionBounds
            });
        };
        /**
         * Collapse a tree grid by row index.
         * @memberof canvasDatagrid
         * @name collapseTree
         * @method
         * @param {number} index The index of the row to collapse.
         */
        self.collapseTree = function (rowIndex) {
            var rowId = self.data[rowIndex][self.uniqueId];
            self.dispatchEvent('collapsetree', {
                childGrid: self.childGrids[rowId],
                data: self.data[rowIndex],
                rowIndex: rowIndex
            });
            self.openChildren[rowId].blur();
            self.openChildren[rowId].dispose();
            delete self.openChildren[rowId];
            delete self.sizes.trees[rowId];
            delete self.childGrids[rowId];
            self.dispatchEvent('resizerow', {
                cellHeight: self.style.cellHeight
            });
            self.resize(true);
            self.draw(true);
        };
        /**
         * Expands a tree grid by row index.
         * @memberof canvasDatagrid
         * @name expandTree
         * @method
         * @param {number} index The index of the row to expand.
         */
        self.expandTree = function (rowIndex) {
            var rowHeaderCellHeight = self.getRowHeaderCellHeight(),
                columnHeaderCellWidth = self.sizes.columns.cornerCell || self.style.rowHeaderCellWidth,
                rowId = self.data[rowIndex][self.uniqueId],
                h = self.sizes.trees[rowId] || self.style.treeGridHeight,
                treeGrid;
            if (!self.childGrids[rowId]) {
                treeGrid = self.createGrid({
                    debug: self.attributes.debug,
                    name: self.attributes.saveAppearance
                        ? self.attributes.name + 'tree' + rowId : undefined,
                    parentNode: {
                        parentGrid: self.intf,
                        nodeType: 'canvas-datagrid-tree',
                        offsetHeight: h,
                        offsetWidth: self.width - columnHeaderCellWidth,
                        header: { width: self.width - columnHeaderCellWidth },
                        offsetLeft: columnHeaderCellWidth,
                        offsetTop: rowHeaderCellHeight,
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
            self.dispatchEvent('expandtree', {
                treeGrid: treeGrid,
                data: self.data[rowIndex],
                rowIndex: rowIndex
            });
            self.openChildren[rowId] = treeGrid;
            self.sizes.trees[rowId] = h;
            self.dispatchEvent('resizerow', {height: self.style.cellHeight});
            self.resize(true);
        };
        /**
         * Toggles tree grid open and close by row index.
         * @memberof canvasDatagrid
         * @name toggleTree
         * @method
         * @param {number} index The index of the row to toggle.
         */
        self.toggleTree = function (rowIndex) {
            var i = self.openChildren[self.data[rowIndex][self.uniqueId]];
            if (i) {
                return self.collapseTree(rowIndex);
            }
            self.expandTree(rowIndex);
        };
        /**
         * Returns a header from the schema by name.
         * @memberof canvasDatagrid
         * @name getHeaderByName
         * @tutorial schema
         * @method
         * @returns {header} header with the selected name, or undefined.
         * @param {string} name The name of the column to resize.
         */
        self.getHeaderByName = function (name) {
            var x, i = self.getSchema();
            for (x = 0; x < i.length; x += 1) {
                if (i[x].name === name) {
                    return i[x];
                }
            }
        };
        /**
         * Resizes a column to fit the longest value in the column. Call without a value to resize all columns.
         * Warning, can be slow on very large record sets (1m records ~3-5 seconds on an i7).
         * @memberof canvasDatagrid
         * @name fitColumnToValues
         * @method
         * @param {string} name The name of the column to resize.
         */
        self.fitColumnToValues = function (name, internal) {
            self.sizes.columns[name === 'cornerCell' ? name : self.getHeaderByName(name)[self.uniqueId]]
                = self.findColumnMaxTextLength(name);
            if (!internal) {
                self.resize();
                self.draw(true);
            }
        };
        /**
         * Checks if a cell is currently visible.
         * @memberof canvasDatagrid
         * @name isCellVisible
         * @overload
         * @method
         * @returns {boolean} when true, the cell is visible, when false the cell is not currently drawn.
         * @param {number} columnIndex The column index of the cell to check.
         * @param {number} rowIndex The row index of the cell to check.
         */
        /**
         * Checks if a cell is currently visible.
         * @memberof canvasDatagrid
         * @name isCellVisible
         * @method
         * @returns {boolean} when true, the cell is visible, when false the cell is not currently drawn.
         * @param {cell} cell The cell to check for.  Alternatively you can pass an object { x: <x-pixel-value>, y: <y-pixel-value> }.
         */
        self.isCellVisible = function (cell, rowIndex) {
            // overload
            if (rowIndex !== undefined) {
                return self.visibleCells.filter(function (c) {
                    return c.columnIndex === cell && c.rowIndex === rowIndex;
                }).length > 0;
            }
            var x, l = self.visibleCells.length;
            for (x = 0; x < l; x += 1) {
                if (cell.x === self.visibleCells[x].x && cell.y === self.visibleCells[x].y) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Sets the order of the data.
         * @memberof canvasDatagrid
         * @name order
         * @method
         * @returns {cell} cell at the selected location.
         * @param {number} columnName Number of pixels from the left.
         * @param {string} direction `asc` for ascending or `desc` for descending.
         * @param {function} [sortFunction] When defined, override the default sorting method defined in the column's schema and use this one.
         * @param {bool} [dontSetStorageData] Don't store this setting for future use.
         */
        self.order = function (columnName, direction, sortFunction, dontSetStorageData) {
            var f,
                c = self.getSchema().filter(function (col) {
                    return col.name === columnName;
                });
            self.orderBy = columnName;
            if (c.length === 0) {
                throw new Error('Cannot sort.  No such column name');
            }
            f = sortFunction || self.sorters[c[0].type];
            if (!f && c[0].type !== undefined) {
                console.warn('Cannot sort type "%s" falling back to string sort.', c[0].type);
            }
            self.data = self.data.sort(typeof f === 'function' ? f(columnName, direction) : self.sorters.string);
            self.dispatchEvent('ordercolumn', {name: columnName, direction: direction});
            self.draw(true);
            if (dontSetStorageData) { return; }
            self.setStorageData();
        };
        self.isInGrid = function (e) {
            if (e.x < 0
                    || e.x > self.width
                    || e.y < 0
                    || e.y > self.height) {
                return false;
            }
            return true;
        };
        /**
         * Checks if a given column is visible.
         * @memberof canvasDatagrid
         * @name isRowVisible
         * @method
         * @returns {boolean} When true, the row is visible.
         * @param {number} rowIndex Row index.
         */
        self.isColumnVisible = function (columnIndex) {
            return self.visibleCells.filter(function (c) {
                return c.columnIndex === columnIndex;
            }).length > 0;
        };
        /**
         * Checks if a given row is visible.
         * @memberof canvasDatagrid
         * @name isRowVisible
         * @method
         * @returns {boolean} When true, the row is visible.
         * @param {number} rowIndex Row index.
         */
        self.isRowVisible = function (rowIndex) {
            return self.visibleCells.filter(function (c) {
                return c.rowIndex === rowIndex;
            }).length > 0;
        };
        /**
         * Gets the cell at columnIndex and rowIndex.
         * @memberof canvasDatagrid
         * @name getVisibleCellByIndex
         * @method
         * @returns {cell} cell at the selected location.
         * @param {number} x Column index.
         * @param {number} y Row index.
         */
        self.getVisibleCellByIndex = function (x, y) {
            return self.visibleCells.filter(function (c) {
                return c.columnIndex === x && c.rowIndex === y;
            })[0];
        };
        /**
         * Gets the cell at grid pixel coordinate x and y.
         * @memberof canvasDatagrid
         * @name getCellAt
         * @method
         * @returns {cell} cell at the selected location.
         * @param {number} x Number of pixels from the left.
         * @param {number} y Number of pixels from the top.
         */
        self.getCellAt = function (x, y, useTouchScrollZones) {
            var tsz = useTouchScrollZones ? self.attributes.touchScrollZone : 0, i, l = self.visibleCells.length, cell;
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
                if (useTouchScrollZones && /(vertical|horizontal)-scroll-/.test(cell.style)) {
                    cell.x -= tsz;
                    cell.y -= tsz;
                    cell.height += tsz;
                    cell.width += tsz;
                }
                if (cell.x - self.style.cellBorderWidth < x
                        && cell.x + cell.width + self.style.cellBorderWidth > x
                        && cell.y - self.style.cellBorderWidth < y
                        && cell.y + cell.height + self.style.cellBorderWidth > y) {
                    if (/vertical-scroll-(bar|box)/.test(cell.style)) {
                        cell.dragContext = 'vertical-scroll-box';
                        cell.context = 'vertical-scroll-box';
                        cell.isScrollBar = true;
                        cell.isVerticalScrollBar = true;
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
                        cell.isScrollBar = true;
                        cell.isHorizontalScrollBar = true;
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
                            && cell.style !== 'columnHeaderCell') {
                        cell.context = 'ns-resize';
                        cell.dragContext = 'ns-resize';
                        return cell;
                    }
                    if (cell.style === 'columnHeaderCell') {
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
            self.hasFocus = true;
            self.canvas.style.cursor = 'default';
            return {
                dragContext: 'background',
                context: 'background',
                style: 'background',
                isBackground: true
            };
        };
        /**
         * Gets the bounds of current selection. 
         * @returns {rect} selection.
         * @memberof canvasDatagrid
         * @name getSelectionBounds
         * @method
         */
        self.getSelectionBounds = function () {
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
        };
        /**
         * Returns an auto generated schema based on data structure.
         * @memberof canvasDatagrid
         * @name getSchemaFromData
         * @method
         * @tutorial schema
         * @returns {schema} schema A schema based on the first item in the data array.
         */
        self.getSchemaFromData = function () {
            return Object.keys(self.data[0] || {' ': ''}).map(function mapEachSchemaColumn(key, index) {
                var type = self.getBestGuessDataType(key),
                    i = {
                        name: key,
                        title: isNaN(parseInt(key, 10)) ? key : self.integerToAlpha(key).toUpperCase(),
                        width: self.style.columnWidth,
                        index: index,
                        type: type,
                        filter: self.filter(type)
                    };
                if (key === self.uniqueId) {
                    i.hidden = true;
                }
                i[self.uniqueId] = self.getSchemaNameHash(key);
                return i;
            });
        };
        /**
         * Clears the change log grid.changes that keeps track of changes to the data set.
         * This does not undo changes or alter data it is simply a convince array to keep
         * track of changes made to the data since last this method was called.
         * @memberof canvasDatagrid
         * @name clearChangeLog
         * @method
         */
        self.clearChangeLog = function () {
            self.changes = [];
        };
        /**
         * Selects an area of the grid.
         * @memberof canvasDatagrid
         * @name selectArea
         * @method
         * @param {rect} bounds A rect object representing the selected values.
         */
        self.selectArea = function (bounds, ctrl) {
            self.selectionBounds = bounds || self.selectionBounds;
            var x, y, s = self.getSchema();
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
            self.dispatchEvent('selectionchanged', {
                selectedData: self.getSelectedData(),
                selections: self.selections,
                selectionBounds: self.selectionBounds
            });
        };
        /**
         * Returns the maximum text width for a given column by column name.
         * @memberof canvasDatagrid
         * @name findColumnMaxTextLength
         * @method
         * @returns {number} The number of pixels wide the maximum width value in the selected column.
         * @param {string} name The name of the column to calculate the value's width of.
         */
        self.findColumnMaxTextLength = function (name) {
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
            self.getSchema().forEach(function (col) {
                if (col.name !== name) { return; }
                self.ctx.font = self.style.columnHeaderCellFont;
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
        };
        /**
         * Gets the total width of all header columns.
         * @memberof canvasDatagrid
         * @name getHeaderWidth
         * @method
         */
        self.getHeaderWidth = function () {
            return self.getVisibleSchema().reduce(function (total, header) {
                return total + header.width;
            }, 0);
        };
        self.formatters.string = function cellFormatterString(e) {
            return e.cell.value !== undefined ? e.cell.value : '';
        };
        self.formatters.rowHeaderCell = self.formatters.string;
        self.formatters.headerCell = self.formatters.string;
        self.formatters.number = self.formatters.string;
        self.formatters.int = self.formatters.string;
        self.formatters.html = self.formatters.string;
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
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);
});
//# sourceMappingURL=canvas-datagrid.debug.map