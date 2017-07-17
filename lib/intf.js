/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([], function () {
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
});
