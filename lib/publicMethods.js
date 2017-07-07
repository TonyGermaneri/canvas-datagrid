/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/
define([], function () {
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
            self.dispatchEvent('selectionchanged', [self.getSelectedData(), self.selections, self.selectionBounds], self.intf);
        };
        /**
         * Collapse a tree grid by row index.
         * @memberof canvasDataGrid#
         * @method
         * @param {number} index The index of the row to collapse.
         */
        self.collapseTree = function (rowIndex) {
            var rowId = self.data[rowIndex][self.uniqueId];
            self.dispatchEvent('collapsetree', [self.childGrids[rowId], self.data[rowIndex], rowIndex], self.intf);
            self.openChildren[rowId].blur();
            self.openChildren[rowId].dispose();
            delete self.openChildren[rowId];
            delete self.sizes.trees[rowId];
            delete self.childGrids[rowId];
            self.dispatchEvent('resizerow', [self.style.cellHeight], self.intf);
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
                    showPerformance: self.attributes.showPerformance,
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
            self.dispatchEvent('expandtree', [treeGrid, self.data[rowIndex], rowIndex], self.intf);
            self.openChildren[self.data[rowIndex][self.uniqueId]] = treeGrid;
            self.sizes.trees[self.data[rowIndex][self.uniqueId]] = h;
            self.dispatchEvent('resizerow', [self.style.cellHeight], self.intf);
            self.resize(true);
            self.draw();
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
            self.dispatchEvent('ordercolumn', [columnName, direction], self.intf);
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
            self.dispatchEvent('selectionchanged', [self.getSelectedData(), self.selections, self.selectionBounds], self.intf);
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
});
