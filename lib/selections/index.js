/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false, Event: false*/
/// <reference path="./type.d.ts" />
'use strict';

import {
  addIntoSelections,
  areSelectionsComplex,
  getSelectedContiguousColumns,
  getSelectedContiguousRows,
  isCellSelected,
  isColumnSelected,
  isRowSelected,
  normalizeSelection,
  removeFromSelections,
  SelectionType,
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
    return isRowSelected(self.selections, rowIndex);
  };

  self.clearSelections = (triggerEvent) => {
    self.selections = [];
    // self.selectedRows = [];
    // self.selectedColumns = [];
    if (triggerEvent)
      self.dispatchEvent('selectionchanged', self.getContextOfSelectionEvent());
  };

  /**
   * @param {object} cell This method needs two properties in this parameter: `rowIndex`
   * and `viewColumnIndex`
   */
  self.unselectCell = (cell) => {
    const result = removeFromSelections(
      self.selections,
      normalizeSelection({
        type: SelectionType.Cells,
        row0: cell.rowIndex,
        col0: cell.viewColumnIndex,
      }),
    );
    if (result)
      self.dispatchEvent('selectionchanged', self.getContextOfSelectionEvent());
    return result;
  };

  self.selectCell = (cell) => {
    const result = addIntoSelections(
      self.selections,
      normalizeSelection({
        type: SelectionType.Cells,
        row0: cell.rowIndex,
        col0: cell.viewColumnIndex,
      }),
    );
    if (result)
      self.dispatchEvent('selectionchanged', self.getContextOfSelectionEvent());
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
    self.moveSelections(self.selections, offsetX, offsetY);
  };

  self.getContextOfSelectionEvent = () => {
    // WIP
    const context = {
      selections: self.selections,
      // selectedCells: self.getSelectedCells(),
      // selectionBounds: self.getSelectionBounds(),
    };
    Object.defineProperty(context, 'selectedData', {
      get: function () {
        return self.getSelectedData();
      },
    });
    return context;
  };

  self.cloneSelections = () => {
    const clonedSelections = [];
    for (let i = 0; i < self.selections.length; i++) {
      const sel = self.selections[i];
      if (!sel) continue;
      clonedSelections.push(Object.assign({}, sel));
    }
    return clonedSelections;
  };

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
