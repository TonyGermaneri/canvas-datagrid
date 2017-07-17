/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*********************!*\
  !*** ./lib/main.js ***!
  \*********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(/*! ./draw */ 1),
    __webpack_require__(/*! ./events */ 2),
    __webpack_require__(/*! ./intf */ 3),
    __webpack_require__(/*! ./contextMenu */ 4),
    __webpack_require__(/*! ./defaults */ 5),
    __webpack_require__(/*! ./dom */ 6),
    __webpack_require__(/*! ./publicMethods */ 7)
], __WEBPACK_AMD_DEFINE_RESULT__ = function context() {
    'use strict';
    var modules = Array.prototype.slice.call(arguments);
    function grid(args) {
        args = args || {};
        var self = {};
        self.args = args;
        self.createGrid = grid;
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
        self.localStyleLibraryStorageKey = 'canvas-datagrid-user-style-library';
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
        self.currentFilter = function () {
            return true;
        };
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
        self.getSelectedData = function (expandToRow) {
            var d = [], s = self.getSchema(), l = self.data.length;
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
        };
        self.scrollOffset = function (e) {
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
        };
        self.position = function (e, ignoreScrollOffset) {
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
                y: pos.y
            };
        };
        self.fillArray = function (low, high, step) {
            step = step || 1;
            var i = [], x;
            for (x = low; x <= high; x += step) {
                i[x] = x;
            }
            return i;
        };
        self.getHeaderCellHeight = function () {
            return self.sizes.rows[-1] || self.style.headerCellHeight;
        };
        self.getHeaderCellWidth = function () {
            return self.attributes.showRowHeaders
                ? (self.sizes.columns.cornerCell ||  self.style.headerRowWidth) : 0;
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
        self.createNewRowData = function () {
            self.newRow = {};
            self.newRow[self.uniqueId] = self.uId;
            self.uId += 1;
            self.getSchema().forEach(function forEachHeader(header, index) {
                var d = header.defaultValue || '';
                if (typeof d === 'function') {
                    d = d.apply(self.intf, [header, index]);
                }
                self.newRow[header.name] = d;
            });
        };
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
        self.getClippingRect = function (ele) {
            var boundingRect = self.position(self.parentNode),
                eleRect = self.position(ele),
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
        self.autoScrollZone = function (e, x, y, ctrl) {
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
                self.setDefaults(self.attributes, args, i[0], i[1]);
            });
        };
        self.setStyle = function () {
            self.defaults.styles.forEach(function eachStyle(i) {
                self.setDefaults(self.style, args.style || {}, i[0], i[1]);
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
            self.eventParent.removeEventListener('mousewheel', self.scrollWheel, false);
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
            if (self.storedSettings && typeof self.storedSettings.orders === 'object') {
                if (self.storedSettings.orders.rows.length >= self.data.length) {
                    self.orders.rows = self.storedSettings.orders.rows;
                }
                s = self.getSchema();
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
                if (self.getHeaderByName(self.orderBy) && self.orderDirection) {
                    self.order(self.orderBy, self.orderDirection);
                }
            }
        };
        self.init = function () {
            self.setAttributes();
            self.setStyle();
            self.initScrollBox();
            self.setDom();
            self.intf.type = 'canvas-datagrid';
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
            self.intf.drawChildGrids = self.drawChildGrids;
            self.intf.style = {};
            Object.defineProperty(self.intf, 'style', {
                get: function () {
                    return self.style;
                },
                set: function (value) {
                    Object.keys(value).forEach(function (key) {
                        self.style[key] = value[key];
                    });
                    self.draw(true);
                }
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
            self.localStyleLibrary = localStorage.getItem(self.localStyleLibraryStorageKey);
            if (self.localStyleLibrary !== null) {
                try {
                    self.localStyleLibrary = JSON.parse(self.localStyleLibrary);
                } catch (e) {
                    console.warn('could not read style settings from localStore', e);
                    self.localStyleLibrary = {};
                }
                if (self.localStyleLibrary.default) {
                    Object.keys(self.style).forEach(function (key) {
                        self.intf.style[key] =
                            self.localStyleLibrary.default[key] === undefined
                                ? self.style[key] : self.localStyleLibrary.default[key];
                    });
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
            self.resize(true);
        };
        modules.forEach(function (module) {
            module(self);
        });
        self.init();
        return self.intf;
    }
    if (window && !window.canvasDatagrid) {
        window.canvasDatagrid = grid;
    }
    return grid;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
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
        function drawHtml(html, x, y, w, h, columnIndex, rowIndex) {
            var img;
            x += self.canvasOffsetLeft;
            y += self.canvasOffsetTop;
            if (self.htmlImageCache[html]) {
                img = self.htmlImageCache[html];
                if (img.height !== h || img.width !== w) {
                    // height and width of the cell has changed, invalidate cache
                    self.htmlImageCache[html] = undefined;
                } else {
                    if (!img.complete) {
                        return;
                    }
                    return self.ctx.drawImage(img, x, y);
                }
            }
            img = new Image(w, h);
            self.htmlImageCache[html] = img;
            img.onload = function () {
                self.ctx.drawImage(img, x, y);
                drawOnAllImagesLoaded();
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(
                '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">\n' +
                    '<foreignObject class="node" x="0" y="0" width="100%" height="100%">\n' +
                    '<body xmlns="http://www.w3.org/1999/xhtml" style="margin:0;padding:0;">\n' +
                    html + '\n' +
                    '</body>' +
                    '</foreignObject>\n' +
                    '</svg>\n'
            );
        }
        function drawOrderByArrow(x, y) {
            x += self.canvasOffsetLeft;
            y += self.canvasOffsetTop;
            self.ctx.fillStyle = self.style.headerOrderByArrowColor;
            self.ctx.strokeStyle = self.style.headerOrderByArrowBorderColor;
            self.ctx.beginPath();
            x = x + self.style.headerOrderByArrowMarginLeft;
            y = y + self.style.headerOrderByArrowMarginTop;
            if (self.orderDirection === 'asc') {
                self.ctx.moveTo(x, y);
                self.ctx.lineTo(x + self.style.headerOrderByArrowWidth, y);
                self.ctx.lineTo(x + (self.style.headerOrderByArrowWidth * 0.5), y + self.style.headerOrderByArrowHeight);
                self.ctx.moveTo(x, y);
            } else {
                self.ctx.lineTo(x, y + self.style.headerOrderByArrowHeight);
                self.ctx.lineTo(x + self.style.headerOrderByArrowWidth, y + self.style.headerOrderByArrowHeight);
                self.ctx.lineTo(x + (self.style.headerOrderByArrowWidth * 0.5), y);
                self.ctx.lineTo(x, y + self.style.headerOrderByArrowHeight);
            }
            self.ctx.stroke();
            self.ctx.fill();
            return self.style.headerOrderByArrowMarginLeft
                + self.style.headerOrderByArrowWidth
                + self.style.headerOrderByArrowMarginRight;
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
                },
            };
            p[pos]();
            self.ctx.stroke();
        }
        /**
         * Redraws the grid. No matter what the change, this is the only method required to refresh everything.
         * @memberof canvasDataGrid#
         * @method
         */
        self.draw = function (internal) {
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
            var checkScrollHeight, borderWidth, rowHeaderCell, p, cx, cy, treeGrid, rowOpen,
                rowHeight, cornerCell, y, x, c, h, w, s, r, rd, aCell,
                l = self.data.length,
                u = self.currentCell || {},
                headerCellHeight = self.getHeaderCellHeight(),
                headerCellWidth = self.getHeaderCellWidth(),
                cellHeight = self.style.cellHeight;
            drawCount += 1;
            p = performance.now();
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
                        style: 'scroll-box-corner'
                    },
                    m = (self.style.scrollBarBoxMargin * 2),
                    d = self.style.scrollBarBoxMargin * 0.5;
                self.ctx.strokeStyle = self.style.scrollBarBorderColor;
                self.ctx.lineWidth = self.style.scrollBarBorderWidth;
                // vertical
                v.x += w - self.style.scrollBarWidth - self.style.scrollBarBorderWidth - d;
                v.y += headerCellHeight;
                v.width = self.style.scrollBarWidth + self.style.scrollBarBorderWidth + d;
                v.height = h - headerCellHeight - self.style.scrollBarWidth - d - m;
                self.ctx.fillStyle = self.style.scrollBarBackgroundColor;
                fillRect(v.x, v.y, v.width, v.height + m);
                strokeRect(v.x, v.y, v.width, v.height + m);
                // vertical box
                vb.x = v.x + self.style.scrollBarBoxMargin;
                vb.y = headerCellHeight + self.style.scrollBarBoxMargin
                    + ((v.height - self.scrollBox.scrollBoxHeight)
                        * (self.scrollBox.scrollTop / self.scrollBox.scrollHeight));
                vb.width = self.style.scrollBarBoxWidth;
                vb.height = self.scrollBox.scrollBoxHeight;
                self.ctx.fillStyle = self.style.scrollBarBoxColor;
                if (/vertical/.test(u.context)) {
                    self.ctx.fillStyle = self.style.scrollBarActiveColor;
                }
                if (vb.width < v.width) {
                    radiusRect(vb.x, vb.y, vb.width, vb.height, self.style.scrollBarBoxBorderRadius);
                    self.ctx.stroke();
                    self.ctx.fill();
                }
                // horizontal
                n.x += headerCellWidth;
                n.y += h - self.style.scrollBarWidth - d;
                n.width = w - self.style.scrollBarWidth - headerCellWidth - d - m;
                n.height = self.style.scrollBarWidth + self.style.scrollBarBorderWidth + d;
                self.ctx.fillStyle = self.style.scrollBarBackgroundColor;
                fillRect(n.x, n.y, n.width + m, n.height);
                strokeRect(n.x, n.y, n.width + m, n.height);
                // horizontal box
                nb.y = n.y + self.style.scrollBarBoxMargin;
                nb.x = headerCellWidth + self.style.scrollBarBoxMargin
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
                self.ctx.fillStyle = self.style.scrollBarCornerBackground;
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
                        childGridAttributes,
                        cell,
                        selected = self.selections[rowOrderIndex] && self.selections[rowOrderIndex].indexOf(columnOrderIndex) !== -1,
                        hovered = self.hovers[d[self.uniqueId]] && self.hovers[d[self.uniqueId]].indexOf(columnOrderIndex) !== -1,
                        active = self.activeCell.rowIndex === rowOrderIndex && self.activeCell.columnIndex === columnOrderIndex,
                        isGrid = Array.isArray(d[header.name]),
                        activeHeader = (self.orders.rows[self.activeCell.rowIndex] === rowOrderIndex
                                || self.orders.columns[self.activeCell.columnIndex] === columnOrderIndex)
                            && (columnOrderIndex === -1 || rowOrderIndex === -1),
                        val,
                        f = self.formatters[header.type || 'string'],
                        orderByArrowSize = 0,
                        treeArrowSize = 0,
                        cellWidth = self.sizes.columns[cellStyle  === 'rowHeaderCell'
                            ? 'cornerCell' : header[self.uniqueId]] || header.width,
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
                    if (x + cellWidth + borderWidth < 0) {
                        x += cellWidth + borderWidth;
                    }
                    if (active) {
                        cellStyle = 'activeCell';
                    }
                    if (self.visibleRows.indexOf(rowIndex) === -1
                            && ['headerCell', 'cornerCell'].indexOf(cellStyle) === -1) {
                        self.visibleRows.push(rowIndex);
                    }
                    val = self.dispatchEvent('formatcellvalue', ev);
                    if (!self.dispatchEvent('beforerendercell', ev)) {
                        cx = x;
                        cy = y;
                        if (cellStyle === 'cornerCell') {
                            cx = 0;
                            cy = 0;
                        } else if (cellStyle === 'rowHeaderCell') {
                            cx = 0;
                        } else if (cellStyle === 'headerCell') {
                            cy = 0;
                        }
                        cell = {
                            type: isGrid ? 'canvas-datagrid-cell' : header.type,
                            style: cellStyle,
                            nodeType: 'canvas-datagrid-cell',
                            x: cx,
                            y: cy,
                            offsetTop: self.canvasOffsetTop,
                            offsetLeft: self.canvasOffsetLeft,
                            scrollTop: self.scrollBox.scrollTop,
                            scrollLeft: self.scrollBox.scrollLeft,
                            active: active === true,
                            hovered: hovered === true,
                            selected: selected === true,
                            width: cellWidth,
                            height: cellHeight,
                            offsetWidth: cellWidth,
                            offsetHeight: cellHeight,
                            parentNode: self.intf.parentNode,
                            offsetParent: self.intf.parentNode,
                            data: d,
                            isHeader: /headerCell|cornerCell/.test(cellStyle),
                            isRowHeader: 'rowHeaderCell' === cellStyle,
                            rowOpen: rowOpen,
                            header: header,
                            columnIndex: columnOrderIndex,
                            rowIndex: rowOrderIndex,
                            sortColumnIndex: headerIndex,
                            sortRowIndex: rowIndex,
                            isGrid: isGrid,
                            gridId: (self.attributes.name || '') + d[self.uniqueId] + ':' + header[self.uniqueId].name,
                            parentGrid: self.intf,
                            innerHTML: '',
                            value: cellStyle === 'headerCell'
                                ? (header.title || header.name) : d[header.name]
                        };
                        ev.cell = cell;
                        cell.userHeight = cell.isHeader ? self.sizes.rows[-1] : rowHeight;
                        cell.userWidth = cell.isHeader ? self.sizes.columns.cornerCell : self.sizes.columns[header[self.uniqueId]];
                        cell[self.uniqueId] = d[self.uniqueId];
                        self.visibleCells.unshift(cell);
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
                            self.ctx.fillStyle = self.style[cellStyle + 'ActiveBackgroundColor'];
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
                            self.sizes.rows[cellStyle === 'headerCell' ? -1 : d[self.uniqueId]] = cell.height;
                            checkScrollHeight = true;
                        }
                        if (cell.width !== cellWidth) {
                            self.sizes.columns[header[self.uniqueId]] = cell.width;
                            checkScrollHeight = true;
                        }
                        if (cellStyle === 'rowHeaderCell' && self.attributes.tree) {
                            if (!self.dispatchEvent('rendertreearrow', ev)) {
                                treeArrowSize = drawTreeArrow(cell, self.style[cellStyle + 'PaddingLeft'], cy, 0);
                            }
                        }
                        if ((self.attributes.showRowNumbers && cellStyle === 'rowHeaderCell')
                                || cellStyle !== 'rowHeaderCell') {
                            if (cell.isGrid) {
                                if (!self.childGrids[cell.gridId]) {
                                    childGridAttributes = self.args.childGridAttributes || self.args;
                                    childGridAttributes.name = self.attributes.saveAppearance ? cell.gridId : undefined;
                                    childGridAttributes.parentNode = cell;
                                    childGridAttributes.data = d[header.name];
                                    self.childGrids[cell.gridId] = self.createGrid(childGridAttributes);
                                    checkScrollHeight = true;
                                }
                                cell.grid = self.childGrids[cell.gridId];
                                cell.grid.parentNode = cell;
                                cell.grid.visible = true;
                                cell.grid.draw();
                                self.dispatchEvent('rendercellgrid', ev);
                            } else {
                                if (self.childGrids[cell.gridId]) {
                                    self.childGrids[cell.gridId].parentNode.offsetHeight = 0;
                                }
                                self.ctx.font = self.style[cellStyle + 'Font'];
                                val = val !== undefined ? val : f
                                    ? f(self.ctx, cell) : '';
                                if (val === undefined && !f) {
                                    val = '';
                                    console.warn('canvas-datagrid: Unknown format '
                                        + header.type + ' add a cellFormater');
                                }
                                if (cellStyle === 'headerCell' && self.orderBy === header.name) {
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
                                    self.ctx.fillStyle = self.style[cellStyle + 'ActiveColor'];
                                }
                                if (self.columnFilters && self.columnFilters[val] !== undefined && cellStyle === 'headerCell') {
                                    val = self.style.filterTextPrefix + val;
                                }
                                if (cell.innerHTML || header.type === 'html') {
                                    drawHtml(cell.innerHTML || val,
                                        cell.x,
                                        cell.y,
                                        cell.width,
                                        cell.height,
                                        cell.columnIndex,
                                        cell.rowIndex);
                                } else {
                                    cell.formattedValue = ((val !== undefined && val !== null) ? val : '').toString();
                                    self.dispatchEvent('rendertext', ev);
                                    fillText(self.addEllipsis(cell.formattedValue, cell.width
                                        - self.style[cellStyle + 'PaddingRight'] - orderByArrowSize - self.style.autosizePadding),
                                        treeArrowSize + orderByArrowSize + cx + self.style[cellStyle + 'PaddingLeft'],
                                        cy - (cell.height * 0.5) + self.style[cellStyle + 'PaddingTop'] + cell.height);
                                }
                            }
                        }
                        if (active && !self.attributes.rowSelectionMode) {
                            aCell = cell;
                            self.ctx.lineWidth = self.style.activeCellOverlayBorderWidth;
                            self.ctx.strokeStyle = self.style.activeCellOverlayBorderColor;
                            strokeRect(aCell.x, aCell.y, aCell.width, aCell.height);
                        }
                        self.ctx.lineWidth = self.style.selectionOverlayBorderWidth;
                        self.ctx.strokeStyle = self.style.selectionOverlayBorderColor;
                        if (selected && cell.style !== 'rowHeaderCell') {
                            if ((!self.selections[cell.rowIndex - 1]
                                    || self.selections[cell.rowIndex - 1].indexOf(cell.columnIndex) === -1
                                    || cell.rowIndex === 0)
                                    && !cell.isHeader) {
                                addBorderLine(cell, 't');
                            }
                            if (!self.selections[cell.rowIndex + 1]
                                    || self.selections[cell.rowIndex + 1].indexOf(cell.columnIndex) === -1) {
                                addBorderLine(cell, 'b');
                            }
                            if (!self.selections[cell.rowIndex] || cell.columnIndex === 0
                                    || self.selections[cell.rowIndex].indexOf(cell.columnIndex - 1) === -1) {
                                addBorderLine(cell, 'l');
                            }
                        } else if (self.selections[cell.rowIndex]
                                && self.selections[cell.rowIndex].indexOf(cell.columnIndex - 1) !== -1) {
                            addBorderLine(cell, 'l');
                        }
                        self.ctx.restore();
                        x += cell.width + borderWidth;
                        return cell.width;
                    }
                };
            }
            function drawHeaderRow() {
                var d, g = s.length, i, o, headerCell, header;
                if (self.attributes.showHeaders) {
                    x = (self.scrollBox.scrollLeft * -1) + self.scrollPixelLeft;
                    if (self.attributes.showRowHeaders) {
                        x += headerCellWidth;
                    }
                    y = 0;
                    // cell height might have changed during drawing
                    cellHeight = self.getHeaderCellHeight();
                    for (o = self.scrollIndexLeft; o < g; o += 1) {
                        i = self.orders.columns[o];
                        header = s[i];
                        d = {
                            title: header.title,
                            name: header.name,
                            width: header.width,
                            style: 'headerCell',
                            type: 'string',
                            index: o,
                            order: i
                        };
                        headerCell = {'headerCell': header.title || header.name};
                        headerCell[self.uniqueId] = 'h' + header[self.uniqueId];
                        d[self.uniqueId] = header[self.uniqueId];
                        x += drawCell(headerCell, -1, -1)(d, o, i);
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
                            type: 'string',
                            index: s.length
                        };
                        c[self.uniqueId] = 'headerCell';
                        drawCell({endCap: ''}, -1, -1)(c, -1, -1);
                    }
                    // fill in the space left of the headers
                    if (self.attributes.showRowHeaders) {
                        cornerCell = {'cornerCell': '' };
                        cornerCell[self.uniqueId] = 'cornerCell';
                        x = 0;
                        c = {
                            name: 'cornerCell',
                            width: self.style.headerRowWidth,
                            style: 'cornerCell',
                            type: 'string',
                            index: -1
                        };
                        c[self.uniqueId] = 'cornerCell';
                        drawCell(cornerCell, -1, -1)(c, -1, -1);
                    }
                }
            }
            function drawRowHeader(rowData, index, rowOrderIndex) {
                var a;
                if (self.attributes.showRowHeaders) {
                    x = 0;
                    rowHeaderCell = {'rowHeaderCell': index + 1 };
                    rowHeaderCell[self.uniqueId] = rowData[self.uniqueId];
                    a = {
                        name: 'rowHeaderCell',
                        width: self.style.headerRowWidth,
                        style: 'rowHeaderCell',
                        type: 'string',
                        data: rowData[self.uniqueId],
                        index: -1
                    };
                    a[self.uniqueId] = rowData[self.uniqueId];
                    drawCell(rowHeaderCell, index, rowOrderIndex)(a, -1, -1);
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
                    x += headerCellWidth;
                }
                cellHeight = rowHeight;
                for (o = self.scrollIndexLeft; o < g; o += 1) {
                    i = self.orders.columns[o];
                    x += drawCell(rd, r, d)(s[i], i, o);
                    if (x > self.width) {
                        break;
                    }
                }
                drawRowHeader(rd, r, d);
                // cell height might have changed during drawing
                cellHeight = rowHeight;
                x = (self.scrollBox.scrollLeft * -1) + self.scrollPixelLeft;
                // don't draw a tree for the new row
                treeGrid = self.childGrids[rd[self.uniqueId]];
                if (r !== self.data.length && rowOpen) {
                    treeGrid.visible = true;
                    treeGrid.parentNode = {
                        offsetTop: y + rowSansTreeHeight + self.canvasOffsetTop,
                        offsetLeft: headerCellWidth - 1 + self.canvasOffsetLeft,
                        offsetHeight: treeHeight,
                        offsetWidth: self.width - headerCellWidth - self.style.scrollBarWidth - 1,
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
                if (self.attributes.rowSelectionMode
                        && self.activeCell
                        && self.activeCell.rowIndex === r) {
                    self.ctx.lineWidth = self.style.activeCellOverlayBorderWidth;
                    self.ctx.strokeStyle = self.style.activeCellOverlayBorderColor;
                    strokeRect(0, y, self.getHeaderWidth(), rowHeight);
                }
                y += cellHeight + borderWidth;
                return true;
            }
            function initDraw() {
                borderWidth = self.style.cellBorderWidth * 2;
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
                x = (self.scrollBox.scrollLeft * -1) + self.scrollPixelLeft;
                y = (self.scrollBox.scrollTop * -1) + headerCellHeight + self.scrollPixelTop;
                for (r = self.scrollIndexTop; r < l; r += 1) {
                    n = self.orders.rows[r];
                    if (!drawRow(n, r)) {
                        break;
                    }
                }
                if (self.attributes.showNewRow) {
                    if (self.attributes.showRowHeaders) {
                        x += headerCellWidth;
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
                    drawRowHeader(self.newRow, self.data.length, self.data.length);
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
                    d.scrollLeft = self.scrollBox.scrollLeft;
                    d.scrollTop = self.scrollBox.scrollTop;
                    d.scrollIndexTop = self.scrollIndexTop;
                    d.scrollPixelTop = self.scrollPixelTop;
                    d.scrollIndexLeft = self.scrollIndexLeft;
                    d.scrollPixelLeft = self.scrollPixelLeft;
                    d.canvasOffsetLeft = self.canvasOffsetLeft;
                    d.canvasOffsetTop = self.canvasOffsetTop;
                    d.width = self.width;
                    d.height = self.height;
                    d.mousex = self.mouse.x;
                    d.mousey = self.mouse.y;
                    d.touchx = !self.touchStart ? 0 : self.touchStart.x;
                    d.touchy = !self.touchStart ? 0 : self.touchStart.y;
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
                        fillRect(headerCellWidth, lh + (index * lh), 100, lh);
                        self.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
                        fillText(m, headerCellWidth + 1, headerCellHeight + (index * lh));

                    });
                    self.ctx.restore();
                }
            }
            self.ctx.save();
            initDraw();
            drawBackground();
            drawRows();
            drawHeaderRow();
            drawReorderMarkers();
            drawScrollBars();
            if (checkScrollHeight) {
                self.resize(true);
            }
            drawBorder();
            drawDebug();
            self.ctx.restore();
        };
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 2 */
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
                y: pos.y
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
            if (drawAfterResize) {
                self.draw(true);
            }
            self.dispatchEvent('resize', {});
            return true;
        };
        self.scroll = function (e) {
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
                pos = self.position(self.parentNode, true);
                self.input.style.top = pos.top + self.scrollEdit.inputTop
                    + (self.scrollEdit.scrollTop - self.scrollBox.scrollTop) + 'px';
                self.input.style.left = pos.left + self.scrollEdit.inputLeft
                    + (self.scrollEdit.scrollLeft - self.scrollBox.scrollLeft) + 'px';
                self.clipElement(self.input);
            }
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
            var top, left, cell, s = self.getVisibleSchema();
            cell = self.visibleCells.filter(function (vCell) {
                return vCell.columnIndex === x && vCell.rowIndex === y;
            })[0];
            if (self.dispatchEvent('beforebeginedit', {cell: cell})) { return false; }
            self.scrollIntoView(x, y);
            self.setActiveCell(x, y);
            function postDraw() {
                var pos = self.position(self.parentNode, true);
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
                self.clipElement(self.input);
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
            self.dispatchEvent('mouseup', {NativeEvent: e, cell: self.currentCell});
            if (!self.hasFocus) {
                return;
            }
            if (self.currentCell && self.currentCell.grid !== undefined) {
                return;
            }
            if (self.ontextMenu || self.input) { return; }
            self.selecting = undefined;
            self.draggingItem = undefined;
            if (self.dragStart && self.isInGrid(self.dragStart)) {
                self.controlInput.focus();
            }
            self.dragStartObject = undefined;
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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 3 */
/*!*********************!*\
  !*** ./lib/intf.js ***!
  \*********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
    'use strict';
    return function (self) {
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
        self.intf.formatters = self.formatters;
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
                // width cannot be determined correctly until after inserted into the dom?
                requestAnimationFrame(function () {
                    self.fitColumnToValues('cornerCell');
                });
                if (!self.resize()) { self.draw(true); }
                self.createRowOrders();
                self.tryLoadStoredOrders();
                self.dispatchEvent('datachanged', {data: self.data});
            }
        });
        return;
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 4 */
/*!****************************!*\
  !*** ./lib/contextMenu.js ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
    'use strict';
    return function (self) {
        self.contextmenu = function (e, overridePos) {
            if (!self.hasFocus) {
                return;
            }
            if (self.contextMenu) {
                e.preventDefault();
                return self.disposeContextMenu();
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
            pos = overridePos || self.getLayerPos(e);
            contextObject = self.getCellAt(pos.x, pos.y);
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
                                self.setFilter(cf, '');
                                self.disposeContextMenu();
                                self.controlInput.focus();
                            }
                        });
                    });
                }
            }
            if (self.attributes.showCopy
                    && self.selections.reduce(function (p, r) {
                        return p + r.length;
                    }, 0) > 0) {
                menuItems.push({
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
                menuItems.push({
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
            if (self.attributes.allowSorting && self.attributes.showOrderByOption) {
                menuItems.push({
                    title: self.attributes.showOrderByOptionTextAsc.replace('%s', contextObject.header.name),
                    click: function (e) {
                        e.preventDefault();
                        self.order(contextObject.header.name, 'asc');
                        self.disposeContextMenu();
                        self.controlInput.focus();
                    }
                });
                menuItems.push({
                    title: self.attributes.showOrderByOptionTextDesc.replace('%s', contextObject.header.name),
                    click: function (e) {
                        e.preventDefault();
                        self.order(contextObject.header.name, 'desc');
                        self.disposeContextMenu();
                        self.controlInput.focus();
                    }
                });
            }
            if (self.dispatchEvent('contextmenu', {NativeEvent: e, cell: contextObject, items: menuItems, contextMenu: self.contextMenu})) { return; }
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
                        item.click.apply(this, [e, contextObject, self.disposeContextMenu]);
                        e.preventDefault();
                        e.stopPropagation();
                        self.controlInput.focus();
                    });
                }
            });
            filterInput.addEventListener('dblclick', self.stopPropagation);
            filterInput.addEventListener('click', self.stopPropagation);
            filterInput.addEventListener('mousedown', self.stopPropagation);
            filterInput.addEventListener('keyup', function filterKeyUp() {
                self.setFilter(contextObject.header.name, filterInput.value);
                requestAnimationFrame(function filterRequestAnimationFrame() {
                    filterInput.classList.remove(self.invalidSearchExpClass);
                    if (self.invalidFilterRegEx) {
                        filterInput.classList.add(self.invalidSearchExpClass);
                    }
                });
            });
            document.body.addEventListener('click', self.disposeContextMenu);
            document.body.appendChild(self.contextMenu);
            loc.x = pos.x + self.style.contextMenuMarginLeft;
            loc.y = pos.y + self.style.contextMenuMarginTop;
            if (loc.x + self.contextMenu.offsetWidth > document.documentElement.clientWidth) {
                loc.x = document.documentElement.clientWidth - self.contextMenu.offsetWidth;
            }
            if (loc.y + self.contextMenu.offsetHeight > document.documentElement.clientHeight) {
                loc.y = document.documentElement.clientHeight - self.contextMenu.offsetHeight;
            }
            self.contextMenu.style.left = loc.x + 'px';
            self.contextMenu.style.top = loc.y + 'px';
            oPreventDefault.apply(e);
        };
        /**
         * Removes the context menu if it is present.
         * @memberof canvasDataGrid#
         * @method
         */
        self.disposeContextMenu = function (e) {
            //TODO: there are most likely some bugs around removing the context menu.  Can't use grid on first click sometimes
            function disp() {
                self.contextMenu = undefined;
                self.canvas.cursor = 'pointer';
                document.body.removeEventListener('click', self.disposeContextMenu);
                document.body.removeEventListener('mouseup', disp);
                document.body.removeEventListener('mousedown', disp);
                document.body.removeEventListener('touchstart', disp);
                document.body.removeEventListener('touchend', disp);
            }
            if (!e || (self.contextMenu
                                && self.contextMenu.parentNode
                                && !self.contextMenu.contains(e.target))) {
                self.contextMenu.parentNode.removeChild(self.contextMenu);
                document.body.addEventListener('mouseup', disp);
                document.body.addEventListener('mousedown', disp);
                document.body.addEventListener('touchstart', disp);
                document.body.addEventListener('touchend', disp);
            }
        };
        return;
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 5 */
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
                ['rowSelectionMode', false],
                ['autoResizeColumns', false],
                ['allowRowHeaderResize', true],
                ['allowColumnResize', true],
                ['allowRowResize', true],
                ['allowRowResizeFromCell', false],
                ['allowColumnResizeFromCell', false],
                ['debug', false],
                ['borderResizeZone', 10],
                ['showHeaders', true],
                ['showRowNumbers', true],
                ['showRowHeaders', true],
                ['scrollRepeatRate', 75],
                ['selectionScrollZone', 20],
                ['resizeScrollZone', 20],
                ['selectionScrollIncrement', 20],
                ['reorderDeadZone', 3],
                ['showClearSettingsOption', true],
                ['showOrderByOption', true],
                ['clearSettingsOptionText', 'Clear saved settings'],
                ['showOrderByOptionTextAsc', 'Order by %s ascending'],
                ['showOrderByOptionTextDesc', 'Order by %s descending'],
                ['removeFilterOptionText', 'Remove filter on %s'],
                ['filterOptionText', 'Filter'],
                ['touchReleaseAnimationDurationMs', 1000],
                ['touchReleaseAcceleration', 30],
                ['touchDeadZone', 3],
                ['touchSelectTimeMs', 800],
                ['touchScrollZone', 40],
                ['copyText', 'Copy'],
                ['showCopy', true]
            ],
            styles: [
                ['name', 'default'],
                ['scrollBarBackgroundColor', 'rgba(240, 240, 240, 1)'],
                ['scrollBarBoxColor', 'rgba(192, 192, 192, 1)'],
                ['scrollBarActiveColor', 'rgba(125, 125, 125, 1)'],
                ['scrollBarBoxWidth', 8],
                ['scrollBarBoxMargin', 2],
                ['scrollBarBoxBorderRadius', 3],
                ['scrollBarBorderColor', 'rgba(202, 202, 202, 1)'],
                ['scrollBarBorderWidth', 0.5],
                ['scrollBarWidth', 11],
                ['scrollBarBoxMinSize', 15],
                ['scrollBarCornerBorderColor', 'rgba(202, 202, 202, 1)'],
                ['scrollBarCornerBackground', 'rgba(240, 240, 240, 1)'],
                ['treeArrowClickRadius', 5],
                ['treeGridHeight', 250],
                ['treeArrowHeight', 8],
                ['treeArrowWidth', 13],
                ['treeArrowColor', 'rgba(155, 155, 155, 1)'],
                ['treeArrowBorderColor', 'rgba(195, 199, 202, 1)'],
                ['treeArrowBorderWidth', 1],
                ['treeArrowMarginRight', 5],
                ['treeArrowMarginLeft', 0],
                ['treeArrowMarginTop', 6],
                ['filterTextPrefix', '(filtered) '],
                ['editCellFontSize', '16px'],
                ['editCellFontFamily', 'sans-serif'],
                ['editCellPaddingLeft', 4],
                ['editCellBoxShadow', '0 2px 5px rgba(0,0,0,0.4)'],
                ['editCellBorder', 'solid 1px rgba(110, 168, 255, 1)'],
                ['styleSheet', ''],
                ['contextMenuItemMargin', '2px'],
                ['contextMenuItemBorderRadius', '3px'],
                ['contextMenuLabelMargin', '0 3px 0 0'],
                ['contextMenuLabelDisplay', 'inline-block'],
                ['contextMenuLabelMinWidth', '75px'],
                ['contextMenuLabelMaxWidth', '700px'],
                ['contextMenuHoverBackground', 'rgba(182, 205, 250, 1)'],
                ['contextMenuColor', 'rgba(43, 48, 43, 1)'],
                ['contextMenuHoverColor', 'rgba(43, 48, 153, 1)'],
                ['contextMenuFontSize', '16px'],
                ['contextMenuFontFamily', 'sans-serif'],
                ['contextMenuBackground', 'rgba(240, 240, 240, 1)'],
                ['contextMenuBorder', 'solid 1px rgba(158, 163, 169, 1)'],
                ['contextMenuPadding', '2px'],
                ['contextMenuBorderRadius', '3px'],
                ['contextMenuOpacity', '0.98'],
                ['contextMenuFilterInvalidExpresion', 'rgba(237, 155, 156, 1)'],
                ['contextMenuMarginTop', 15],
                ['contextMenuMarginLeft', 3],
                ['autosizePadding', 5],
                ['autosizeHeaderCellPadding', 8],
                ['minHeight', 24],
                ['minRowHeight', 24],
                ['minColumnWidth', 45],
                ['columnWidth', 250],
                ['backgroundColor', 'rgba(240, 240, 240, 1)'],
                ['headerOrderByArrowHeight', 8],
                ['headerOrderByArrowWidth', 13],
                ['headerOrderByArrowColor', 'rgba(155, 155, 155, 1)'],
                ['headerOrderByArrowBorderColor', 'rgba(195, 199, 202, 1)'],
                ['headerOrderByArrowBorderWidth', 1],
                ['headerOrderByArrowMarginRight', 5],
                ['headerOrderByArrowMarginLeft', 0],
                ['headerOrderByArrowMarginTop', 6],
                ['cellHeightWithChildGrid', 150],
                ['cellWidthWithChildGrid', 250],
                ['cellHeight', 24],
                ['cellFont', '16px sans-serif'],
                ['cellPaddingTop', 5],
                ['cellAutoResizePadding', 13],
                ['cellPaddingLeft', 5],
                ['cellPaddingRight', 7],
                ['cellAlignment', 'left'],
                ['cellColor', 'rgba(0, 0, 0, 1)'],
                ['cellBackgroundColor', 'rgba(255, 255, 255, 1)'],
                ['cellHoverColor', 'rgba(0, 0, 0, 1)'],
                ['cellHoverBackgroundColor', 'rgba(255, 255, 255, 1)'],
                ['cellSelectedColor', 'rgba(0, 0, 0, 1)'],
                ['cellSelectedBackgroundColor', 'rgba(236, 243, 255, 1)'],
                ['cellBorderWidth', 0.25],
                ['cellBorderColor', 'rgba(195, 199, 202, 1)'],
                ['activeCellFont', '16px sans-serif'],
                ['activeCellPaddingTop', 5],
                ['activeCellPaddingLeft', 5],
                ['activeCellPaddingRight', 7],
                ['activeCellAlignment', 'left'],
                ['activeCellColor', 'rgba(0, 0, 0, 1)'],
                ['activeCellBackgroundColor', 'rgba(255, 255, 255, 1)'],
                ['activeCellHoverColor', 'rgba(0, 0, 0, 1)'],
                ['activeCellHoverBackgroundColor', 'rgba(255, 255, 255, 1)'],
                ['activeCellSelectedColor', 'rgba(0, 0, 0, 1)'],
                ['activeCellSelectedBackgroundColor', 'rgba(236, 243, 255, 1)'],
                ['activeCellBorderWidth', 0.25],
                ['activeCellBorderColor', 'rgba(110, 168, 255, 1)'],
                ['headerCellPaddingTop', 5],
                ['headerCellPaddingLeft', 5],
                ['headerCellPaddingRight', 7],
                ['headerCellHeight', 25],
                ['headerCellBorderWidth', 0.25],
                ['headerCellBorderColor', 'rgba(152, 152, 152, 1)'],
                ['headerCellFont', '16px sans-serif'],
                ['headerCellColor', 'rgba(50, 50, 50, 1)'],
                ['headerCellBackgroundColor', 'rgba(240, 240, 240, 1)'],
                ['headerCellHoverColor', 'rgba(0, 0, 0, 1)'],
                ['headerCellHoverBackgroundColor', 'rgba(235, 235, 235, 1)'],
                ['headerCellActiveColor', 'rgba(0, 0, 0, 1)'],
                ['headerCellActiveBackgroundColor', 'rgba(225, 225, 225, 1)'],
                ['headerRowWidth', 57],
                ['rowHeaderCellPaddingTop', 5],
                ['rowHeaderCellPaddingLeft', 5],
                ['rowHeaderCellPaddingRight', 5],
                ['rowHeaderCellHeight', 25],
                ['rowHeaderCellBorderWidth', 0.25],
                ['rowHeaderCellBorderColor', 'rgba(152, 152, 152, 1)'],
                ['rowHeaderCellFont', '16px sans-serif'],
                ['rowHeaderCellColor', 'rgba(50, 50, 50, 1)'],
                ['rowHeaderCellBackgroundColor', 'rgba(240, 240, 240, 1)'],
                ['rowHeaderCellHoverColor', 'rgba(0, 0, 0, 1)'],
                ['rowHeaderCellHoverBackgroundColor', 'rgba(235, 235, 235, 1)'],
                ['rowHeaderCellSelectedColor', 'rgba(50, 50, 50, 1)'],
                ['rowHeaderCellSelectedBackgroundColor', 'rgba(217, 217, 217, 1)'],
                ['rowHeaderCellActiveColor', 'rgba(0, 0, 0, 1)'],
                ['rowHeaderCellActiveBackgroundColor', 'rgba(225, 225, 225, 1)'],
                ['activeCellOverlayBorderColor', 'rgba(66, 133, 244, 1)'],
                ['activeCellOverlayBorderWidth', 2],
                ['selectionOverlayBorderColor', 'rgba(66, 133, 244, 1)'],
                ['selectionOverlayBorderWidth', 1.25],
                ['reorderMarkerIndexBorderColor', 'rgba(66, 133, 244, 1)'],
                ['reorderMarkerIndexBorderWidth', 2.75],
                ['reorderMarkerBackgroundColor', 'rgba(0, 0, 0, 0.1)'],
                ['reorderMarkerBorderColor', 'rgba(0, 0, 0, 0.2)'],
                ['reorderMarkerBorderWidth', 1.25],
                ['gridBorderColor', 'rgba(202, 202, 202, 1)'],
                ['gridBorderWidth', 1]
            ]
        };
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 6 */
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
        self.attachCss = function () {
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
            self.eventParent.addEventListener('touchstart', self.touchstart, false);
            self.eventParent.addEventListener('mouseup', self.mouseup, false);
            self.eventParent.addEventListener('mousedown', self.mousedown, false);
            self.eventParent.addEventListener('dblclick', self.dblclick, false);
            self.eventParent.addEventListener('click', self.click, false);
            self.eventParent.addEventListener('mousemove', self.mousemove);
            self.eventParent.addEventListener('mousewheel', self.scrollWheel, false);
            self.canvas.addEventListener('contextmenu', self.contextmenu, false);
            (self.isChildGrid ? self.parentGrid : document).addEventListener('copy', self.copy);
            self.controlInput.addEventListener('keypress', self.keypress, false);
            self.controlInput.addEventListener('keyup', self.keyup, false);
            self.controlInput.addEventListener('keydown', self.keydown, false);
        };
        self.setDom = function () {
            self.appendTo(self.args.parentNode);
            self.attachCss();
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
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 7 */
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
         * Inserts a new column before the specified index into the schema.
         * @see canvasDataGrid#schema
         * @tutorial schema
         * @memberof canvasDataGrid#
         * @method
         * @param {column} rowIndex The column to insert into the schema.
         * @param {number} index The index of the row to insert before.
         */
        self.insertColumn = function (c, index) {
            var s = self.getSchema();
            if (s.length < index) {
                throw new Error('Index is beyond the length of the schema.');
            }
            self.validateColumn(c, s);
            self.intf.schema = s.splice(index, 0, c);
        };
        /**
         * Deletes a column from the schema at the specified index.
         * @memberof canvasDataGrid#
         * @tutorial schema
         * @method
         * @param {number} index The index of the column to delete.
         */
        self.deleteColumn = function (index) {
            var s = self.getSchema();
            self.intf.schema = s.splice(index, 1);
        };
        /**
         * Adds a new column into the schema.
         * @see canvasDataGrid#schema
         * @tutorial schema
         * @memberof canvasDataGrid#
         * @method
         * @param {column} c The column to add to the schema.
         */
        self.addColumn = function (c) {
            var s = self.getSchema();
            self.validateColumn(c, s);
            s.push(c);
            self.intf.schema = s;
        };
        /**
         * Deletes a row from the dataset at the specified index.
         * @memberof canvasDataGrid#
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
         * @memberof canvasDataGrid#
         * @method
         * @param {object} d data.
         * @param {number} index The index of the row to insert before.
         */
        self.insertRow = function (d, index) {
            if (self.originalData.length < index) {
                throw new Error('Index is beyond the length of the dataset.');
            }
            self.originalData.splice(index, 0, d);
            self.setFilter();
            self.resize(true);
        };
        /**
         * Adds a new row into the dataset.
         * @memberof canvasDataGrid#
         * @method
         * @param {object} d data.
         */
        self.addRow = function (d) {
            self.originalData.push(d);
            self.setFilter();
            self.resize(true);
        };
        /**
         * Sets the height of a given row by index number.
         * @memberof canvasDataGrid#
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
         * @memberof canvasDataGrid#
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
         * @memberof canvasDataGrid#
         * @tutorial schema
         * @method
         */
        self.resetColumnWidths = function () {
            self.sizes.columns = {};
            self.draw(true);
        };
        /**
         * Removes any changes to the height of the rows due to user or api interaction, setting them back to the schema or style default.
         * @memberof canvasDataGrid#
         * @tutorial schema
         * @method
         */
        self.resetRowHeights = function () {
            self.sizes.rows = {};
            self.draw(true);
        };
        /**
         * Sets the value of the filter.
         * @memberof canvasDataGrid#
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
                    self.currentFilter = header.filter;
                    self.data = self.data.filter(function (row) {
                        return self.currentFilter(row[filter], self.columnFilters[filter]);
                    });
                });
                self.resize();
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
        };
        /**
         * Returns the number of pixels to scroll down to line up with row rowIndex.
         * @memberof canvasDataGrid#
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
         * @memberof canvasDataGrid#
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
         * @memberof canvasDataGrid#
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
         * @memberof canvasDataGrid#
         * @method
         * @param {number} y The row index of the cell to scroll to.
         */
        self.gotoRow = function (y) {
            self.gotoCell(0, y);
        };
        /**
         * Scrolls the cell at cell x, row y into view if it is not already.
         * @memberof canvasDataGrid#
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
         * @memberof canvasDataGrid#
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
         * Selects a row.
         * @memberof canvasDataGrid#
         * @method
         * @param {boolean} toggleSelectMode When true, behaves as if you were holding control/command when you clicked the row.
         * @param {boolean} supressSelectionchangedEvent When true, prevents the selectionchanged event from firing.
         */
        self.selectRow = function (rowIndex, ctrl, supressEvent) {
            var s = self.getSchema();
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
            self.dispatchEvent('selectionchanged', {
                selectedData: self.getSelectedData(),
                selections: self.selections,
                selectionBounds: self.selectionBounds
            });
        };
        /**
         * Collapse a tree grid by row index.
         * @memberof canvasDataGrid#
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
         * @memberof canvasDataGrid#
         * @method
         * @param {number} index The index of the row to expand.
         */
        self.expandTree = function (rowIndex) {
            var headerCellHeight = self.getHeaderCellHeight(),
                headerCellWidth = self.sizes.columns.cornerCell || self.style.headerRowWidth,
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
         * @memberof canvasDataGrid#
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
         * @memberof canvasDataGrid#
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
         * @memberof canvasDataGrid#
         * @method
         * @param {string} name The name of the column to resize.
         */
        self.fitColumnToValues = function (name) {
            self.sizes.columns[name === 'cornerCell' ? name : self.getHeaderByName(name)[self.uniqueId]]
                = self.findColumnMaxTextLength(name);
            self.resize();
            self.draw(true);
        };
        /**
         * Checks if a cell is currently visible.
         * @memberof canvasDataGrid#
         * @method
         * @returns {boolean} when true, the cell is visible, when false the cell is not currently drawn.
         * @param {cell} cell The cell to check for.  Alternatively you can pass an object { x: <x-index>, y: <y-index> }.
         */
        self.isCellVisible = function (cell) {
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
         * @memberof canvasDataGrid#
         * @method
         * @returns {cell} cell at the selected location.
         * @param {number} columnName Number of pixels from the left.
         * @param {string} direction `asc` for ascending or `desc` for descending.
         * @param {bool} dontSetStorageData Don't store this setting for future use.
         */
        self.order = function (columnName, direction, dontSetStorageData) {
            var f,
                c = self.getSchema().filter(function (col) {
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
         * Gets the cell at grid pixel coordinate x and y.
         * @memberof canvasDataGrid#
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
        };
        /**
         * Gets the bounds of current selection. 
         * @returns {rect} selection.
         * @memberof canvasDataGrid#
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
         * @memberof canvasDataGrid#
         * @method
         * @tutorial schema
         * @returns {schema} schema A schema based on the first item in the data array.
         */
        self.getSchemaFromData = function () {
            return Object.keys(self.data[0] || {' ': ''}).map(function mapEachSchemaColumn(key, index) {
                var type = self.getBestGuessDataType(key),
                    i = {
                        name: key,
                        title: key,
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
         * @memberof canvasDataGrid#
         * @method
         */
        self.clearChangeLog = function () {
            self.changes = [];
        };
        /**
         * Selects an area of the grid.
         * @memberof canvasDataGrid#
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
         * @memberof canvasDataGrid#
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
        };
        /**
         * Gets the total width of all header columns.
         * @memberof canvasDataGrid#
         * @method
         */
        self.getHeaderWidth = function () {
            return self.getVisibleSchema().reduce(function (total, header) {
                return total + header.width;
            }, 0);
        };
        self.formatters.string = function cellFormatterString(ctx, cell) {
            return cell.value !== undefined ? cell.value : '';
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
//# sourceMappingURL=canvas-datagrid.map