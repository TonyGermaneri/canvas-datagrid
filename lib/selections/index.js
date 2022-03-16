/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false, Event: false*/
/// <reference path="./type.d.ts" />
'use strict';

import { createHTMLString, createTextString } from '../events/util';
import {
  addIntoSelections,
  areSelectionsComplex,
  areSelectionsNeat,
  cleanupSelections,
  cloneSelections,
  getSelectedContiguousColumns,
  getSelectedContiguousRows,
  getSelectionBounds,
  getSelectionStateFromCells,
  isCellSelected,
  isColumnSelected,
  isRowSelected,
  moveSelections,
  normalizeSelection,
  removeFromSelections,
  SelectionType,
  shrinkOrExpandSelections,
} from './util';

export default function (self) {
  /**
   * Here are explanation for the item of this array:
   *
   * The type of properties about the row in it is viewRowIndex (row0, row1).
   * Here is an example of accessing the row data from the selection object:
   * `const rowData = originalData[self.getBoundRowIndexFromViewRowIndex(selection.row0)]`
   *
   * The type of properties about the column in it is columnOrderIndex (col0, col1)
   * Here is an example of accessing thr column schema from the selection object:
   * `const columnSchema = schema[self.orders.columns[selection.col0]]`
   * @type {SelectionDescriptor[]}
   */
  self.selections = [];
  /**
   * WIP
   */
  self.selectionCache = [];
  self.selectionCacheWidth = 0;
  self.selectionCacheHeight = 0;

  /**
   * Return a tuple if the user selected contiguous columns, otherwise `null`.
   * Info: Because the user may reorder the columns,
   * the schemaIndex of the first item may be greater than the schemaIndex of the second item,
   * but the columnIndex of the firs item must less than the columnIndex of the second item.
   * @param {object[]} [schema] from `self.getSchema()`
   * @returns {object[]} column schemas tuple (each schema has an additional field `schemaIndex`)
   */
  self.getSelectedContiguousColumns = function (schema) {
    if (!schema) schema = self.getSchema();
    const columnOrderIndexes = getSelectedContiguousColumns(
      self.selections,
      false,
    );
    if (!Array.isArray(columnOrderIndexes)) return;

    /** @type {number[]} orders[index] => columnIndex */
    const orders = self.orders.columns;
    return columnOrderIndexes.map((orderIndex) => {
      const schemaIndex = orders[orderIndex];
      const columnSchema = schema[schemaIndex];
      return Object.assign({}, columnSchema, { orderIndex });
    });
  };

  /**
   * @param {boolean} [allowOnlyOneRow]
   * @returns {number[]} a viewRowIndex tuple. It can contains one row index or two row indexes.
   */
  self.getSelectedContiguousRows = function (allowOnlyOneRow) {
    const viewRowIndexes = getSelectedContiguousRows(self.selections, false);
    if (!Array.isArray(viewRowIndexes)) return;
    if (!allowOnlyOneRow && viewRowIndexes[0] === viewRowIndexes[1]) return;
    return viewRowIndexes;
  };

  self.canSelectionsBeCopied = function () {
    return self.selections.length > 0 && !areSelectionsComplex(self.selections);
  };

  self.getSelectedRowsHeight = function () {
    const selected = getSelectedContiguousRows(self.selections, true);
    if (!selected) return 0;
    let height = 0;
    for (let row = selected[0]; row < selected[1]; row++)
      height += self.getRowHeight(row);
    return height;
  };

  self.getSelectedColumnsWidth = function () {
    const selected = getSelectedContiguousColumns(self.selections, true);
    if (!selected) return 0;
    let width = 0;
    for (let col = selected[0]; col < selected[1]; col++)
      width += self.getColumnWidth(self.orders.columns[col]);
    return width;
  };

  self.fitSelectedColumns = function (width) {
    const selectedColumns = self.selections[0];
    const schema = self.getSchema();

    for (const selectedColumn of selectedColumns) {
      // Make sure the column is not the row header and that the whole column has in fact been selected.
      if (selectedColumn >= 0 && self.isColumnSelected(selectedColumn)) {
        if (isNaN(width)) {
          const column = schema[self.orders.columns[selectedColumn]];
          self.fitColumnToValues(column.name);
        } else {
          self.sizes.columns[selectedColumn] = width;
          self.dispatchEvent('resizecolumn', {
            x: width,
            y: self.resizingStartingHeight,
            draggingItem: self.currentCell,
          });
        }
      }
    }
  };

  /**
   * @param {object} cell This method needs two properties in this parameter: `rowIndex`
   * and `viewColumnIndex`
   */
  self.isCellSelected = (cell) => {
    return isCellSelected(self.selections, cell.rowIndex, cell.viewColumnIndex);
  };

  /**
   * Returns true if the selected columnIndex is selected on every row.
   * @memberof canvasDatagrid
   * @name isColumnSelected
   * @method
   * @param {number} columnIndex The column index to check.
   */
  self.isColumnSelected = (viewColumnIndex) => {
    if (typeof viewColumnIndex !== 'number') return false;
    return isColumnSelected(self.selections, viewColumnIndex);
  };

  /**
   * Returns true if the selected rowIndex is selected on every column.
   * @memberof canvasDatagrid
   * @name isRowSelected
   * @method
   * @param {number} rowIndex The row index to check.
   */
  self.isRowSelected = (rowIndex) => {
    if (typeof rowIndex !== 'number') return false;
    return isRowSelected(self.selections, rowIndex);
  };

  self.clearSelections = (triggerEvent) => {
    self.selections = [];
    if (triggerEvent) self.dispatchSelectionChangedEvent();
  };

  /**
   * Removes the selection.
   * @memberof canvasDatagrid
   * @name selectNone
   * @param {boolean} dontDraw Suppress the draw method after the selection change.
   * @method
   */
  self.selectNone = (dontDraw) => {
    self.clearSelections(true);
    if (dontDraw) return;
    self.draw();
  };

  /**
   * Selects every visible cell.
   * @memberof canvasDatagrid
   * @name selectAll
   * @param {boolean} dontDraw Suppress the draw method after the selection change.
   * @method
   */
  self.selectAll = function (dontDraw) {
    const changed = addIntoSelections(self.selections, {
      type: SelectionType.Columns,
      col0: 0,
      col1: self.getSchema().length - 1,
    });
    if (!changed || dontDraw) return;
    self.draw();
  };

  /**
   * @param {object} cell This method needs two properties in this parameter: `rowIndex`
   * and `viewColumnIndex`
   * @param {boolean} [supressEvent]
   */
  self.unselectCell = (cell, supressEvent) => {
    const result = removeFromSelections(
      self.selections,
      normalizeSelection({
        type: SelectionType.Cells,
        row0: cell.rowIndex,
        col0: cell.viewColumnIndex,
      }),
    );
    if (result && !supressEvent) self.dispatchSelectionChangedEvent();
    return result;
  };

  /**
   * @param {number} row0 rowViewIndex
   * @param {number} row1 rowViewIndex
   * @param {boolean} supressEvent When true, prevents the `selectionchanged` event from firing.
   * @returns {boolean} It returns whether the selection changed
   */
  self.unselectRows = (row0, row1, supressEvent) => {
    const result = removeFromSelections(
      self.selections,
      normalizeSelection({
        type: SelectionType.Rows,
        row0,
        row1,
      }),
    );
    if (result && !supressEvent) self.dispatchSelectionChangedEvent();
    return result;
  };

  /**
   * @param {object} cell This method needs two properties in this parameter: `rowIndex`
   * and `viewColumnIndex`
   * @param {boolean} [supressEvent]
   */
  self.selectCell = (cell, supressEvent) => {
    const result = addIntoSelections(
      self.selections,
      normalizeSelection({
        type: SelectionType.Cells,
        row0: cell.rowIndex,
        col0: cell.viewColumnIndex,
      }),
    );
    if (result && !supressEvent) self.dispatchSelectionChangedEvent();
    return result;
  };

  /**
   * Moves the current selection relative to the its current position.  Note: this method does not move the selected data, just the selection itself.
   * @memberof canvasDatagrid
   * @name moveSelection
   * @method
   * @param {number} offsetX The number of columns to offset the selection.
   * @param {number} offsetY The number of rows to offset the selection.
   */
  self.moveSelection = function (offsetX, offsetY) {
    moveSelections(self.selections, offsetX, offsetY);
  };

  self.dispatchSelectionChangedEvent = () => {
    self.dispatchEvent('selectionchanged', self.getContextOfSelectionEvent());
  };

  self.getContextOfSelectionEvent = () => {
    const context = {
      selections: self.selections,
    };
    Object.defineProperty(context, 'selectedData', {
      get: function () {
        return self.getSelectedData();
      },
    });
    Object.defineProperty(context, 'selectedCells', {
      get: function () {
        return self.getSelectedCells();
      },
    });
    Object.defineProperty(context, 'selectionBounds', {
      get: function () {
        return self.getSelectionBounds();
      },
    });
    return context;
  };

  self.cloneSelections = () => {
    return cloneSelections(self.selections);
  };

  /**
   * Gets the bounds of current selection.
   * @param {boolean} [sanitized] sanitize the bound object if the value of thie paramater is `true`
   * @memberof canvasDatagrid
   * @name getSelectionBounds
   * @method
   * @returns {rect} two situations:
   * 1. The result is always a bound object if `sanitized` is not `true`.
   * And the result is `{top: Infinity, left: Infinity, bottom: -Infinity, right: -Infinity}` if there haven't selections.
   * This is used for keeping compatibility with existing APIs.
   * 2. When the parameter `sanitized` is true. The result will be null if there haven't selections.
   */
  self.getSelectionBounds = (sanitized) => {
    const bounds = getSelectionBounds(self.selections);
    if (sanitized) {
      // nothing is selected
      if (bounds.top > bounds.bottom || bounds.left > bounds.right) return null;
      self.sanitizeSelectionBounds(bounds);
    }
    return bounds;
  };
  self.sanitizeSelectionBounds = (bounds) => {
    if (!bounds) return bounds;
    if (bounds.top < 0) bounds.top = 0;
    if (bounds.left < 0) bounds.left = 0;

    const viewDataLength = self.viewData.length;
    if (bounds.bottom > viewDataLength) bounds.bottom = viewDataLength - 1;

    const schemaLength = self.getSchema().length;
    if (bounds.right > schemaLength) bounds.right = schemaLength - 1;
    return bounds;
  };

  /**
   * This function is migrated from the old API,
   * It needs to be refactoring/deprecated to work with the large dataset.
   * @param {boolean} [expandToRow]
   * @returns {any[]}
   */
  self.getSelectedData = (expandToRow) => {
    const bounds = self.getSelectionBounds(true);
    if (!bounds) return [];

    const selectedData = [];
    const { top, bottom, left, right } = bounds;
    const height = bottom - top + 1;
    const width = right - left + 1;
    const states = getSelectionStateFromCells(self.selections, {
      row0: top,
      row1: bottom,
      col0: left,
      col1: right,
    });

    if (states === false || states === true) {
      for (let row = top, row2 = top + height; row < row2; row++)
        selectedData[row] =
          states && self.viewData[row]
            ? Object.assign({}, self.viewData[row])
            : {};
      return selectedData;
    }

    const orderedSchema = getSchemaOrderByViewIndex(left, width);
    for (let row = top, row2 = top + height; row < row2; row++) {
      const viewData = self.viewData[row] || {};
      const rowData = {};
      selectedData[row] = rowData;
      const rowState = states[row - top];
      if (!rowState) continue;
      for (let col = left, col2 = left + width; col < col2; col++) {
        if (!rowState[col - left]) continue;
        const header = orderedSchema[col];
        if (!header || (header.hidden && !expandToRow)) continue;
        rowData[header.name] = viewData[header.name];
      }
    }
    return selectedData;
  };

  /**
   * This function is migrated from the old API,
   * @param {boolean} [expandToRow]
   * @returns {any[]}
   */
  self.getSelectedCells = (expandToRow) => {
    const selectedCells = [];
    const bounds = self.getSelectionBounds(true);
    iterateSelectedCells(
      (cell) => selectedCells.push(cell),
      bounds,
      expandToRow,
    );
    return selectedCells;
  };

  /**
   * This function is migrated from the old API,
   * @returns {any[]} affected cells
   */
  self.clearSelectedCells = () => {
    const affectedCells = [];
    const bounds = self.getSelectionBounds(true);
    iterateSelectedCells(
      (cell) => {
        affectedCells.push(cell);
        self.viewData[cell.boundRowIndex][cell.columnName] = '';
      },
      bounds,
      false,
    );
    return affectedCells;
  };

  /**
   * Deletes currently selected data.
   * @memberof canvasDatagrid
   * @name deleteSelectedData
   * @method
   * @param {boolean} dontDraw Suppress the draw method after the selection change.
   */
  self.deleteSelectedData = (dontDraw) => {
    const affectedCells = self.clearSelectedCells();
    self.dispatchEvent('afterdelete', {
      cells: affectedCells,
    });
    if (dontDraw) return;
    requestAnimationFrame(() => self.draw());
  };

  /**
   * Runs the defined method on each selected cell.
   * @memberof canvasDatagrid
   * @name forEachSelectedCell
   * @method
   * @param {number} fn The function to execute.  The signature of the function is: (data, rowIndex, columnName).
   * @param {number} expandToRow When true the data in the array is expanded to the entire row.
   */
  self.forEachSelectedCell = function (fn, expandToRow) {
    const bounds = self.getSelectionBounds(true);
    iterateSelectedCells(
      (cell) => fn(self.viewData, cell.viewRowIndex, cell.columnName),
      bounds,
      expandToRow,
    );
  };

  /**
   * @param {ClipboardInterface} clipboardData
   */
  self.copySelectedCellsToClipboard = (clipboardData) => {
    const selectedData = [];
    const isNeat = areSelectionsNeat(self.selections);
    const data = self.getSelectedData();
    if (data.length > 0) {
      // WIP: improve these two creating string method
      const textString = createTextString(selectedData, isNeat);
      const htmlString = createHTMLString(selectedData, isNeat);

      const copiedData = {
        'text/plain': textString,
        'text/html': htmlString,
        'text/csv': textString,
        'application/json': JSON.stringify(selectedData),
      };
      for (const [mimeType, data] of Object.entries(copiedData)) {
        clipboardData.setData(mimeType, data);
      }
    }
  };

  /**
   * This function is migrated from the old API,
   * @param {number} [width]
   */
  self.fitSelectedColumns = (width) => {
    const bounds = self.getSelectionBounds(true);
    if (!bounds) return;

    const hasCustomWidth = typeof width === 'number' && width > 0;
    // convert rectangle's height to only 1 row
    bounds.bottom = bounds.top;
    iterateSelectedCells(
      (cell) => {
        const { columnName, viewColumnIndex } = cell;
        if (hasCustomWidth) {
          self.sizes.columns[viewColumnIndex] = width;
          self.dispatchEvent('resizecolumn', {
            x: width,
            y: self.resizingStartingHeight,
            draggingItem: self.currentCell,
          });
        } else {
          self.fitColumnToValues(columnName);
        }
      },
      bounds,
      false,
    );
  };

  /**
   * Selects a column.
   * @memberof canvasDatagrid
   * @name selectColumn
   * @method
   * @param {number} columnIndex The column index to select.
   * @param {boolean} toggleSelectMode When true, behaves as if you were holding control/command when you clicked the column.
   * @param {boolean} shift When true, behaves as if you were holding shift when you clicked the column.
   * @param {boolean} supressEvent When true, prevents the selectionchanged event from firing.
   */
  self.selectColumn = (columnIndex, ctrl, shift, supressEvent) => {
    self.isMultiRowsSelected = false;
    self.isMultiColumnsSelected = false;
    function addCol(i) {
      addIntoSelections(
        self.selections,
        normalizeSelection({
          type: SelectionType.Columns,
          col0: i,
        }),
      );
    }
    function removeCol(i) {
      removeFromSelections(
        self.selections,
        normalizeSelection({
          type: SelectionType.Columns,
          col0: i,
        }),
      );
    }
    if (shift) {
      if (!self.activeCell) {
        return;
      }
      const s = Math.min(self.activeCell.columnIndex, columnIndex);
      const e = Math.max(self.activeCell.columnIndex, columnIndex);
      addIntoSelections(
        self.selections,
        normalizeSelection({
          type: SelectionType.Columns,
          col0: s,
          col1: e - 1,
        }),
      );
      if (s != e) self.isMultiColumnsSelected = true;
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
    if (supressEvent) {
      return;
    }
    self.dispatchSelectionChangedEvent();
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
  self.selectRow = (rowIndex, ctrl, shift, supressEvent) => {
    self.isMultiRowsSelected = false;
    function de() {
      if (supressEvent) {
        return;
      }
      self.dispatchSelectionChangedEvent();
    }
    function addRow(ri) {
      addIntoSelections(
        self.selections,
        normalizeSelection({
          type: SelectionType.Rows,
          row0: ri,
        }),
      );
    }
    if (self.dragAddToSelection === false || self.dragObject === undefined) {
      if (isRowSelected(self.selections, rowIndex) && ctrl) {
        removeFromSelections(
          self.selections,
          normalizeSelection({
            type: SelectionType.Rows,
            row0: rowIndex,
          }),
        );
        de();
        return;
      }
    }
    if (self.dragAddToSelection === true || self.dragObject === undefined) {
      if (shift && self.dragObject === undefined) {
        if (!self.activeCell) {
          return;
        }
        const st = Math.min(self.activeCell.rowIndex, rowIndex);
        const en = Math.max(self.activeCell.rowIndex, rowIndex);
        addIntoSelections(
          self.selections,
          normalizeSelection({
            type: SelectionType.Rows,
            row0: st,
            row1: en,
          }),
        );
      } else {
        addRow(rowIndex);
      }
    }
    de();
  };

  /**
   * @param {function} iterator signature: `(cell: any) => any`
   * @param {object} bounds type: `{left:number;right:number;top:number;bottom:number}`
   * @param {boolean} [expandToRow]
   */
  function iterateSelectedCells(iterator, bounds, expandToRow) {
    if (!bounds) return;
    const { top, bottom, left, right } = bounds;
    const height = bottom - top + 1;
    const width = right - left + 1;
    const states = getSelectionStateFromCells(self.selections, {
      row0: top,
      row1: bottom,
      col0: left,
      col1: right,
    });
    if (states === false) return;

    const orderedSchema = getSchemaOrderByViewIndex(left, width);
    for (let row = top, row2 = top + height; row < row2; row++) {
      const viewData = self.viewData[row] || {};
      const rowState = states[row - top];
      if (!rowState) continue;
      for (let col = left, col2 = left + width; col < col2; col++) {
        if (rowState !== true && !rowState[col - left]) continue;

        const header = orderedSchema[col];
        if (!header || (header.hidden && !expandToRow)) continue;

        const cell = {
          value: viewData[header.name],
          header,
          columnName: header.name,
          boundRowIndex: self.getBoundRowIndexFromViewRowIndex(row),
          boundColumnIndex: self.orders.columns[col],
          viewRowIndex: row,
          viewColumnIndex: col,
        };
        iterator(cell);
      }
    }
  }

  /**
   * Selects an area of the grid.
   * @memberof canvasDatagrid
   * @name selectArea
   * @method
   * @param {rect} [bounds] A rect object representing the selected values.
   * @param {boolean} [ctrl]
   */
  self.selectArea = function (bounds, ctrl) {
    if (bounds) {
      if (bounds.top > bounds.bottom || bounds.left > bounds.right)
        throw new Error('Impossible selection area');
      self.selectionBounds = self.sanitizeSelectionBounds(bounds);
    }
    const { top, bottom, left, right } = self.selectionBounds;
    if (!ctrl) self.selections = [];

    const schemaLength = self.getSchema().length;
    if (
      top < -1 ||
      bottom > self.viewData.length ||
      left < -1 ||
      right > schemaLength
    ) {
      throw new Error('Impossible selection area');
    }

    /** @type {ContextForSelectionAction} */
    const context = { rows: self.viewData.length, columns: schemaLength };

    // In original API, number -1 indicates selecting whole row or selecting while column.
    if (top === -1) {
      // select whole columns
      const col0 = Math.max(left, 0);
      // left eq -1 means selecting all cells
      const col1 =
        left === -1 ? schemaLength - 1 : Math.min(right, schemaLength - 1);
      addIntoSelections(
        self.selections,
        normalizeSelection({
          type: SelectionType.Columns,
          col0,
          col1,
        }),
        context,
      );
    } else if (left === -1) {
      // select whole rows
      const row0 = Math.max(top, 0);
      const row1 = Math.min(bottom, self.viewData.length - 1);
      addIntoSelections(
        self.selections,
        normalizeSelection({
          type: SelectionType.Rows,
          row0,
          row1,
        }),
        context,
      );
    }
    addIntoSelections(
      self.selections,
      normalizeSelection({
        type: SelectionType.Cells,
        row0: top,
        row1: bottom,
        col0: left,
        col1: right,
      }),
      context,
    );
    self.dispatchSelectionChangedEvent();
  };

  /**
   * This private method is using for make existing API about selection works.
   * TODO: This method can be removed by a better way.
   * @param {number} [rowIndex] 0 by default
   * @returns {number[]|undefined}
   */
  self.getRowSelectionStates = (rowIndex) => {
    if (typeof rowIndex !== 'number' || rowIndex < 0) rowIndex = 0;
    const col0 = 0;
    const col1 = self.getSchema().length - 1;
    const width = col1 - col0 + 1;
    const state = getSelectionStateFromCells(self.selections, {
      row0: rowIndex,
      col0,
      row1: rowIndex,
      col1,
    });
    if (state === false) return;
    if (state === true) return new Array(width).fill(true).map((_, i) => i);

    const firstRow = state[0];
    if (!firstRow) return;

    const result = [];
    for (let i = 0; i < firstRow.length; i++) if (firstRow[i]) result.push(i);
    return result;
  };

  self.replaceAllSelections = (newSelections) => {
    cleanupSelections(newSelections);
    self.selections = newSelections;
  };

  /**
   * @param {number[]} viewIndexes
   */
  self.selectColumnViewIndexes = (viewIndexes) => {
    const selections = viewIndexes.map((col) => ({
      type: SelectionType.Columns,
      col0: col,
      col1: col,
    }));
    self.replaceAllSelections(selections);
  };

  /**
   * This method will be a bottleneck in the future if this component
   * need to ship large dataset. But why I wrote this function:
   * 1. it is used for compatibility with existing APIs
   * 2. this component still has a bottleneck on the selection even there is not this function.
   * @returns {number[]}
   */
  self.getRowViewIndexesFromSelection = () => {
    if (self.selections.length === 0) return [];
    const bounds = getSelectionBounds(self.selections, true);
    const result = [];
    for (let rowIndex = bounds.top; rowIndex <= bounds.bottom; rowIndex++)
      result.push(rowIndex);
    return result;
  };

  /**
   * @param {object} cell Signature: `{rowIndex:number;columnIndex:number}`
   * @param {object} keyEvent Signature: `{key:string;shiftKey:boolean}`
   * @param {boolean} [supressEvent]
   */
  self.shrinkOrExpandSelections = (cell, keyEvent, supressEvent) => {
    const result = shrinkOrExpandSelections(self.selections, cell, keyEvent, {
      columns: self.getSchema().length,
      rows: self.viewData.length,
    });
    if (result && !supressEvent) self.dispatchSelectionChangedEvent();
    return result;
  };

  /**
   * @param {number} [fromIndex]
   * @param {number} [len]
   */
  function getSchemaOrderByViewIndex(fromIndex, len) {
    const schema = self.getSchema();
    const orderedSchema = [];
    for (let col = fromIndex, col2 = fromIndex + len; col < col2; col++) {
      const orderedIndex = self.orders.columns[col];
      const header = schema[orderedIndex];
      orderedSchema[orderedIndex] = header;
    }
    return orderedSchema;
  }

  /**
   * WIP: this function will be used for caching
   * Concatenating two 2-dimensional array.
   * It is simuliar with the method `concatenating` method of the Python module named `numpy`
   * @template T
   * @param {T[][]} a the first 2d array
   * @param {T[][]} b the second 2d array
   * @param {number} axis 1 implies that it is being done column-wise, otherwise row-wise
   * @returns {T[][]}
   */
  function concatenate2DArray(a, b, axis) {
    if (axis === 1) {
      const result = new Array(a.length);
      for (let i = 0; i < a.length; i++) {
        const rowInA = a[i];
        const rowInB = b[i];
        result[i] = rowInA.concat(rowInB);
      }
    }
    return a.concat(b);
  }
}
