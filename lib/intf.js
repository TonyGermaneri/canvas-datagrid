/*jslint browser: true, unparam: true, todo: true*/
/*globals HTMLElement: false, Reflect: false, define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([], function () {
    'use strict';
    return function (self, ctor) {
        self.scale = 1;
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
        self.frozenRow = 0;
        self.frozenColumn = 0;
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
            var d = [], s = expandToRow ? self.getSchema() : self.getVisibleSchema(), l = self.data.length;
            if (l === 0) { return []; }
            self.selections.forEach(function (row, index) {
                if (index === l) { return; }
                if (row.length === 0) {
                    d[index] = null;
                    return;
                }
                d[index] = {};
                row.forEach(function (col) {
                    if (col === -1 || !s[col]) { return; }
                    d[index][s[col].name] = self.data[index][s[col].name];
                });
            });
            return d;
        };
        self.fillArray = function (low, high, step, def) {
            step = step || 1;
            var i = [], x;
            for (x = low; x <= high; x += step) {
                i[x] = def === undefined ? x : (typeof def === 'function' ? def(x) : def);
            }
            return i;
        };
        self.getColumnHeaderCellHeight = function () {
            if (!self.attributes.showColumnHeaders) { return 0; }
            return ((self.sizes.rows[-1] || self.style.columnHeaderCellHeight) * self.scale);
        };
        self.getRowHeaderCellWidth = function () {
            if (!self.attributes.showRowHeaders) { return 0; }
            return (self.sizes.columns.cornerCell || self.style.rowHeaderCellWidth) * self.scale;
        };
        self.setStorageData = function () {
            if (!self.attributes.saveAppearance || !self.attributes.name) { return; }
            var visibility = {};
            self.getSchema().forEach(function (column) {
                visibility[column.name] = !column.hidden;
            });
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
                orderDirection: self.orderDirection,
                visibility: visibility
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
            return self.getSchema().filter(function (col) {
                return !col.hidden && col.name !== self.uniqueId;
            });
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
                rowHeaderCellWidth = self.getRowHeaderCellWidth(),
                columnHeaderCellHeight = self.getColumnHeaderCellHeight();
            if (x > self.width - self.attributes.selectionScrollZone && x < self.width) {
                self.scrollBox.scrollLeft += self.attributes.selectionScrollIncrement;
                setTimer = true;
            }
            if (y > self.height - self.attributes.selectionScrollZone && y < self.height) {
                self.scrollBox.scrollTop += self.attributes.selectionScrollIncrement;
                setTimer = true;
            }
            if (x - self.attributes.selectionScrollZone - rowHeaderCellWidth < 0) {
                self.scrollBox.scrollLeft -= self.attributes.selectionScrollIncrement;
                setTimer = true;
            }
            if (y - self.attributes.selectionScrollZone - columnHeaderCellHeight < 0) {
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
        self.tryLoadStoredSettings = function () {
            var s;
            self.reloadStoredValues();
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
                if (self.orderBy !== self.uniqueId && self.getHeaderByName(self.orderBy) && self.orderDirection) {
                    self.order(self.orderBy, self.orderDirection);
                }
            }
        };
        self.getDomRoot = function () {
            return self.shadowRoot ? self.shadowRoot.host : self.parentNode;
        };
        self.getFontName = function (fontStyle) {
            return fontStyle.replace(/\d+\.?\d*px/, '');
        };
        self.getFontHeight = function (fontStyle) {
            return parseFloat(fontStyle, 10);
        };
        self.parseStyleValue = function (key) {
            if (/Font/.test(key)) {
                self.style[key + 'Height'] = self.getFontHeight(self.style[key]);
                self.style[key + 'Name'] = self.getFontName(self.style[key]);
                return;
            }
            // when inheriting styles from already instantiated grids, don't parse already parsed values.
            if (key === 'moveOverlayBorderSegments' && typeof self.style[key] === 'string') {
                self.style[key] = self.style[key].split(',')
                    .map(function (i) { return parseInt(i, 10); });
            }
        };
        self.initProp = function (propName) {
            if (!self.args[propName]) { return; }
            Object.keys(self.args[propName]).forEach(function (key) {
                self[propName][key] = self.args[propName][key];
            });
        };
        self.getStyleProperty = function (key) {
            if (self.styleKeys.indexOf(key) === -1) {
                return self.parentNodeStyle[key];
            }
            return self.style[key];
        };
        self.setStyleProperty = function (key, value, supressDrawAndEvent) {
            if (self.styleKeys.indexOf(key) === -1) {
                self.parentNodeStyle[key] = value;
            } else {
                self.style[key] = value;
                self.parseStyleValue(key);
            }
            if (!supressDrawAndEvent) {
                self.draw(true);
                self.dispatchEvent('stylechanged', {name: 'style', value: value});
            }
        };
        self.reloadStoredValues = function () {
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
                    if (typeof self.storedSettings.visibility === 'object') {
                        self.getSchema().forEach(function (column) {
                            if (self.storedSettings.visibility && self.storedSettings.visibility[column.name] !== undefined) {
                                column.hidden = !self.storedSettings.visibility[column.name];
                            }
                        });
                    }
                }
            }
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
            self.ie = /Trident/.test(window.navigator.userAgent);
            self.edge = /Edge/.test(window.navigator.userAgent);
            self.webKit = /WebKit/.test(window.navigator.userAgent);
            self.moz = /Gecko/.test(window.navigator.userAgent);
            self.webKit = /WebKit/.test(window.navigator.userAgent);
            self.mobile = /Mobile/i.test(window.navigator.userAgent);
            self.cursorGrab = 'grab';
            self.cursorGrabing = 'grabbing';
            self.cursorGrab = self.webKit ? '-webkit-grab' : self.cursorGrab;
            self.cursorGrabing = self.moz ? '-webkit-grabbing' : self.cursorGrabbing;
            self.pointerLockPosition = {x: 0, y: 0};
            Object.keys(self.style).forEach(self.parseStyleValue);
            self.intf.moveSelection = self.moveSelection;
            self.intf.moveTo = self.moveTo;
            self.intf.type = self.type;
            self.intf.addEventListener = self.addEventListener;
            self.intf.removeEventListener = self.removeEventListener;
            self.intf.dispatchEvent = self.dispatchEvent;
            /**
             * Releases grid resources and removes grid elements.
             * @memberof canvasDatagrid
             * @name dispose
             * @method
             */
            self.intf.dispose = self.dispose;
            /**
             * Appends the grid to another element later.  Not implemented.
             * @memberof canvasDatagrid
             * @name appendTo
             * @method
             * @param {number} el The element to append the grid to.
             */
            self.intf.appendTo = self.appendTo;
            self.intf.filters = self.filters;
            self.intf.sorters = self.sorters;
            self.intf.autosize = self.autosize;
            self.intf.beginEditAt = self.beginEditAt;
            self.intf.endEdit = self.endEdit;
            self.intf.setActiveCell = self.setActiveCell;
            self.intf.forEachSelectedCell = self.forEachSelectedCell;
            self.intf.scrollIntoView = self.scrollIntoView;
            self.intf.clearChangeLog = self.clearChangeLog;
            self.intf.gotoCell = self.gotoCell;
            self.intf.gotoRow = self.gotoRow;
            self.intf.getHeaderByName = self.getHeaderByName;
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
            self.intf.selectNone = self.selectNone;
            self.intf.drawChildGrids = self.drawChildGrids;
            self.intf.assertPxColor = self.assertPxColor;
            self.intf.clearPxColorAssertions = self.clearPxColorAssertions;
            self.intf.integerToAlpha = self.integerToAlpha;
            self.intf.copy = self.copy;
            self.intf.setStyleProperty = self.setStyleProperty;
            Object.defineProperty(self.intf, 'defaults', {
                get: function () {
                    return {
                        styles: self.defaults.styles.reduce(function (a, i) { a[i[0]] = i[1]; return a; }, {}),
                        attributes: self.defaults.attributes.reduce(function (a, i) { a[i[0]] = i[1]; return a; }, {})
                    };
                }
            });
            self.styleKeys = Object.keys(self.intf.defaults.styles);
            self.DOMStyles = window.getComputedStyle(document.body, null);
            Object.keys(self.DOMStyles).concat(Object.keys(self.style)).forEach(function (key) {
                // unless this line is here, Object.keys() will not work on <instance>.style
                publicStyleKeyIntf[key] = undefined;
                Object.defineProperty(publicStyleKeyIntf, key, {
                    get: function () {
                        return self.getStyleProperty(key);
                    },
                    set: function (value) {
                        self.setStyleProperty(key, value);
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
            Object.defineProperty(self.intf, 'hasFocus', {
                get: function () {
                    return self.hasFocus;
                }
            });
            Object.defineProperty(self.intf, 'style', {
                get: function () {
                    return publicStyleKeyIntf;
                },
                set: function (valueObject) {
                    Object.keys(valueObject).forEach(function (key) {
                        self.setStyleProperty(key, valueObject[key], true);
                    });
                    self.draw(true);
                    self.dispatchEvent('stylechanged', {name: 'style', value: valueObject});
                }
            });
            Object.defineProperty(self.intf, 'attributes', { value: {}});
            Object.keys(self.attributes).forEach(function (key) {
                Object.defineProperty(self.intf.attributes, key, {
                    get: function () {
                        return self.attributes[key];
                    },
                    set: function (value) {
                        self.attributes[key] = value;
                        if (key === 'name') {
                            self.tryLoadStoredSettings();
                        }
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
            ['formatters', 'filters', 'sorters'].forEach(self.initProp);
            self.reloadStoredValues();
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
        if (self.shadowRoot || self.isChildGrid) {
            Object.defineProperty(self.intf, 'height', {
                get: function () {
                    if (self.shadowRoot) {
                        return self.shadowRoot.height;
                    }
                    return self.parentNode.height;
                },
                set: function (value) {
                    if (self.shadowRoot) {
                        self.shadowRoot.height = value;
                    } else {
                        self.parentNode.height = value;
                    }
                    self.resize(true);
                }
            });
            Object.defineProperty(self.intf, 'width', {
                get: function () {
                    if (self.shadowRoot) {
                        return self.shadowRoot.width;
                    }
                    return self.parentNode.width;
                },
                set: function (value) {
                    if (self.shadowRoot) {
                        self.shadowRoot.width = value;
                    } else {
                        self.parentNode.width = value;
                    }
                    self.resize(true);
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
        }
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
        Object.defineProperty(self, 'cursor', {
            get: function () {
                return self.parentNodeStyle.cursor;
            },
            set: function (value) {
                if (value === 'cell') { value = 'default'; }
                if (self.currentCursor !== value) {
                    self.parentNodeStyle.cursor = value;
                    self.currentCursor = value;
                }
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
        Object.defineProperty(self.intf, 'frozenRow', {
            get: function () {
                return self.frozenRow;
            },
            set: function (val) {
                if (isNaN(val)) {
                    throw new TypeError('Expected value for frozenRow to be a number.');
                }
                if (self.visibleRows.length > val) {
                    throw new RangeError('Cannot set a value larger than the number of visible rows.');
                }
                self.frozenRow = val;
            }
        });
        Object.defineProperty(self.intf, 'frozenColumn', {
            get: function () {
                return self.frozenColumn;
            },
            set: function (val) {
                if (isNaN(val)) {
                    throw new TypeError('Expected value for frozenRow to be a number.');
                }
                if (self.getVisibleSchema().length > val) {
                    throw new RangeError('Cannot set a value larger than the number of visible columns.');
                }
                self.frozenColumn = val;
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
                    column.width = column.width || self.style.cellWidth;
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
                self.tryLoadStoredSettings();
                if (self.storedSettings && typeof self.storedSettings.visibility === 'object') {
                    self.schema.forEach(function hideEachSchemaColumn(column, index) {
                        if (self.storedSettings && self.storedSettings.visibility[column.name] !== undefined) {
                            column.hidden = !self.storedSettings.visibility[column.name];
                        }
                    });
                }
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
                        self.tryLoadStoredSettings();
                        self.dispatchEvent('schemachanged', {schema: self.tempSchema});
                    }
                    self.createNewRowData();
                    if (self.attributes.autoResizeColumns && self.data.length > 0
                            && self.storedSettings === undefined) {
                        self.autosize();
                    }
                    self.fitColumnToValues('cornerCell', true);
                    self.resize(true);
                    self.createRowOrders();
                    self.tryLoadStoredSettings();
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
            self.scrollBox.scrollTo = function (x, y, supressDrawEvent) {
                setScrollLeft(x, true);
                setScrollTop(y, supressDrawEvent);
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
});
