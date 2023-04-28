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

/**
 * Before reading the code of this module, you must know these things:
 *
 * You may see words like "obsolete", "old API", "compatibility" in the code later.
 * Because this grid component has used a different selection mechanism in the past.
 *
 * The old mechanism use a 2D array to represent the selection state.
 * For example: `[undefined x 10, [0, 5]]` indicates
 * there are two cells are selected in current grid. they are located in row 11.
 * and one in column 1, another in column 6.
 * And `[undefined x 5, [-1, 0,1,2,3,4,5,6...], undefined x 2, [1]]` indicates
 * the row 6 is selected and the cell that located in row 9 column 2 is selected.
 *
 * But this implementation has performance issue when the grid is shipping a large dataset.
 * You can just imagine about what will happen when you select all cells in a grid with 1 million rows.
 *
 * So we create a new way to implement the selection.
 * In this way, we use a selection list to represent the selection state.
 * Each element in this selection list is a selection descriptor.
 * Each descriptor represents an area whose selected or unselected by the user.
 * And we have four types for the descriptor: UnselectedCells, Cells, Rows and Columns
 *
 * Because the old selection mechanism has been in used for a long time and
 * we have many public APIs about it.
 * We still need to keep these APIs working in the 0.x versions in the future.
 * So we create some functions to make sure these APIs and context objects work like previous version.
 * This is the reason why you may see there are some functions in this file
 * be marked "for compatibility" without best practice.
 */
export default function (self) {
  /**
   * Here are explanation for the item of this array:
   *
   * The type of properties about the row in it is viewRowIndex (startRow, endRow).
   * Here is an example of accessing the row data from the selection object:
   * `const rowData = originalData[self.getBoundRowIndexFromViewRowIndex(selection.startRow)]`
   *
   * The type of properties about the column in it is columnOrderIndex (startColumn, endColumn)
   * Here is an example of accessing thr column schema from the selection object:
   * `const columnSchema = schema[self.orders.columns[selection.startColumn]]`
   * @type {SelectionDescriptor[]}
   */
  self.selections = [];

  /**
   * TODO support the cache
   */
  self.selectionCache = [];
  self.selectionCacheWidth = 0;
  self.selectionCacheHeight = 0;

  /**
   * This method is used for adapting old API and it has performance issue for the large data set.
   * We should keep this function and its related functions until version 1.x,
   * because this action can cause incompatible API changes <https://semver.org/>
   *
   * Generate a selection 2 dimensional array from the selection list.
   * Each row in this 2D array is a number array that indicates which columns are selected in this row.
   * And -1 in the result means entire cells are selected in particular row/column
   *
   * @param {object[]} [otherSelections] The function create a 2d array based on this selection list
   * if this parameter is provided. Otherwise, this function uses self.selections as the list input.
   * @returns {number[][]}
   */
  self.getObsoleteSelectionMatrix = (otherSelections) => {
    const bounds = self.getSelectionBounds(true, otherSelections);
    if (!bounds) return [];
    const { top, bottom, left, right } = bounds;
    const height = bottom - top + 1;
    const width = right - left + 1;
    const states = getSelectionStateFromCells(self.selections, {
      startRow: top,
      endRow: bottom,
      startColumn: left,
      endColumn: right,
    });
    if (states === false) return [];

    const result = [];
    for (let row = top, row2 = top + height; row < row2; row++) {
      if (states === true) {
        result[row] = new Array(width).fill(0).map((_, i) => left + i);
        continue;
      }

      const rowState = states[row - top];
      if (!rowState) continue;
      result[row] = [];
      for (let col = left, col2 = left + width; col < col2; col++) {
        if (rowState !== true && !rowState[col - left]) continue;
        result[row].push(col);
      }
    }
    for (let i = 0; i < self.selections.length; i++) {
      const selection = self.selections[i];
      if (selection.type !== SelectionType.Rows) continue;
      for (let row = selection.startRow; row <= selection.endRow; row++) {
        if (!result[row]) {
          result[row] = [-1];
          continue;
        }
        if (result[row][0] === -1) continue;
        result[row].unshift(-1);
      }
    }
    return result;
  };

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

  /**
   * Check if current selection are copyable for the system clipbaord
   * @returns {boolean}
   */
  self.canSelectionsBeCopied = function () {
    return self.selections.length > 0 && !areSelectionsComplex(self.selections);
  };

  /**
   * Return the height of the selection area.
   * This function is used for rendering the overlay for the dnd(drag and drop)
   * @returns {number} The height of the selection area
   */
  self.getSelectedRowsHeight = function () {
    const selected = getSelectedContiguousRows(self.selections, true);
    if (!selected) return 0;
    let height = 0;
    for (let row = selected[0]; row <= selected[1]; row++)
      height += self.getRowHeight(row);
    return height;
  };

  /**
   * Return the width of the selection area.
   * This function is used for rendering the overlay for the dnd(drag and drop)
   * @returns {number} The width of the selection area
   */
  self.getSelectedColumnsWidth = function () {
    const selected = getSelectedContiguousColumns(self.selections, true);
    if (!selected) return 0;
    let width = 0;
    for (let col = selected[0]; col <= selected[1]; col++)
      width += self.getColumnWidth(self.orders.columns[col]);
    return width;
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

  /**
   * Removes the selection.
   * @param {boolean} triggerEvent true for trigger a event
   */
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
      startColumn: 0,
      endColumn: self.getSchema().length - 1,
    });
    if (!changed || dontDraw) return;
    self.draw();
  };

  /**
   * @param {object} cell This method needs two properties in this parameter: `rowIndex`
   * and `viewColumnIndex`
   * @param {boolean} [suppressEvent]
   */
  self.unselectCell = (cell, suppressEvent) => {
    const result = removeFromSelections(
      self.selections,
      normalizeSelection({
        type: SelectionType.Cells,
        startRow: cell.rowIndex,
        startColumn: cell.viewColumnIndex,
      }),
    );
    if (result && !suppressEvent) self.dispatchSelectionChangedEvent();
    return result;
  };

  /**
   * @param {number} startRow rowViewIndex
   * @param {number} endRow rowViewIndex
   * @param {boolean} suppressEvent When true, prevents the `selectionchanged` event from firing.
   * @returns {boolean} It returns whether the selection changed
   */
  self.unselectRows = (startRow, endRow, suppressEvent) => {
    const result = removeFromSelections(
      self.selections,
      normalizeSelection({
        type: SelectionType.Rows,
        startRow: startRow,
        endRow: endRow,
      }),
    );
    if (result && !suppressEvent) self.dispatchSelectionChangedEvent();
    return result;
  };

  /**
   * @param {object} cell This method needs two properties in this parameter: `rowIndex`
   * and `viewColumnIndex`
   * @param {boolean} [suppressEvent]
   */
  self.selectCell = (cell, suppressEvent) => {
    const result = addIntoSelections(
      self.selections,
      normalizeSelection({
        type: SelectionType.Cells,
        startRow: cell.rowIndex,
        startColumn: cell.viewColumnIndex,
      }),
    );
    if (result && !suppressEvent) self.dispatchSelectionChangedEvent();
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

  /**
   * Dispatch a event named `selectionchanged` with context info
   */
  self.dispatchSelectionChangedEvent = () => {
    self.dispatchEvent('selectionchanged', self.getContextOfSelectionEvent());
  };

  /**
   * Return the event context for event `selectionchanged`
   * @returns {object} the context for the event
   */
  self.getContextOfSelectionEvent = () => {
    const context = { selectionList: self.cloneSelections() };
    //#region for API compatibility
    Object.defineProperty(context, 'selections', {
      get: function () {
        return self.getObsoleteSelectionMatrix();
      },
    });
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
    //#endregion for API compatibility
    return context;
  };

  /**
   * Return a cloned selection list from current selection list
   * @returns {object[]} A cloned selection list
   */
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
  self.getSelectionBounds = (sanitized, otherSelections) => {
    const bounds = getSelectionBounds(otherSelections || self.selections);
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
      startRow: top,
      endRow: bottom,
      startColumn: left,
      endColumn: right,
    });
    if (states === false) return [];

    const orderedSchema = getSchemaOrderByViewIndex(left, width);
    for (let row = top, row2 = top + height; row < row2; row++) {
      const viewData = self.viewData[row] || {};
      const rowData = {};
      let hasData = false;
      const rowState = states === true || states[row - top];
      if (!rowState) continue;

      for (let col = left, col2 = left + width; col < col2; col++) {
        if (states !== true && !rowState[col - left]) continue;
        const header = orderedSchema[col];
        if (!header || header.hidden) continue;
        hasData = true;
        if (expandToRow) break;
        rowData[header.name] = viewData[header.name];
      }
      if (hasData)
        selectedData[row] = expandToRow ? Object.assign({}, viewData) : rowData;
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
    const apiCompatibleCells = affectedCells.map((cell) => {
      return [
        cell.viewRowIndex,
        cell.viewColumnIndex,
        cell.boundRowIndex,
        cell.boundColumnIndex,
      ];
    });
    self.dispatchEvent('afterdelete', {
      cells: apiCompatibleCells,
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
      (cell) => fn(self.viewData, cell.viewRowIndex, cell.columnName, cell),
      bounds,
      expandToRow,
    );
  };

  /**
   * @param {ClipboardInterface} clipboardData
   */
  self.copySelectedCellsToClipboard = (clipboardData) => {
    const isNeat = areSelectionsNeat(self.selections);
    const selectedData = self.getSelectedData();
    const data = selectedData.filter((row) => row != null);

    if (data.length > 0) {
      const textString = createTextString(data, isNeat);
      const htmlString = createHTMLString(data, isNeat);

      const copiedData = {
        'text/plain': textString,
        'text/html': htmlString,
        'text/csv': textString,
        'application/json': JSON.stringify(data),
      };
      for (const [mimeType, data] of Object.entries(copiedData)) {
        clipboardData.setData(mimeType, data);
      }
    }
  };

  /**
   * (This function is migrated from the old API)
   * Modify the width of columns that contain selected cells to fit the content.
   * @param {number} [width] Custom width for each column
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
            // TODO: Drop x, y from all 'resizecolumn' events and use height and width instead.
            x: width,
            y: self.resizingStartingHeight,
            width: width,
            height: self.resizingStartingHeight,
            columnIndex: viewColumnIndex,
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
   * Set the height of the selected rows to the given value.
   * @param {number} [height]
   */
  self.fitSelectedRows = (height) => {
    const bounds = self.getSelectionBounds(true);
    if (!bounds) return;

    for (let row = bounds.top; row <= bounds.bottom; row++) {
      if (!self.isRowSelected(row)) {
        continue;
      }
      self.sizes.rows[row] = height;
      self.dispatchEvent('resizerow', {
        width: self.resizingStartingWidth,
        height: height,
        rowIndex: row,
        draggingItem: self.currentCell,
      });
    }
  };

  /**
   * Selects a column.
   * @memberof canvasDatagrid
   * @name selectColumn
   * @method
   * @param {number} columnIndex The column index to select.
   * @param {boolean} toggleSelectMode When true, behaves as if you were holding control/command when you clicked the column.
   * @param {boolean} shift When true, behaves as if you were holding shift when you clicked the column.
   * @param {boolean} suppressEvent When true, prevents the selectionchanged event from firing.
   */
  self.selectColumn = (columnIndex, ctrl, shift, suppressEvent) => {
    self.isMultiRowsSelected = false;
    self.isMultiColumnsSelected = false;
    function addCol(i) {
      addIntoSelections(
        self.selections,
        normalizeSelection({
          type: SelectionType.Columns,
          startColumn: i,
        }),
      );
    }
    function removeCol(i) {
      removeFromSelections(
        self.selections,
        normalizeSelection({
          type: SelectionType.Columns,
          startColumn: i,
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
          startColumn: s,
          endColumn: e - 1,
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
    if (suppressEvent) {
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
  self.selectRow = (rowIndex, ctrl, shift, suppressEvent) => {
    self.isMultiRowsSelected = false;
    function de() {
      if (suppressEvent) {
        return;
      }
      self.dispatchSelectionChangedEvent();
    }
    function addRow(ri) {
      addIntoSelections(
        self.selections,
        normalizeSelection({
          type: SelectionType.Rows,
          startRow: ri,
        }),
      );
    }
    if (self.dragAddToSelection === false || self.dragObject === undefined) {
      if (isRowSelected(self.selections, rowIndex) && ctrl) {
        removeFromSelections(
          self.selections,
          normalizeSelection({
            type: SelectionType.Rows,
            startRow: rowIndex,
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
            startRow: st,
            endRow: en,
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
      startRow: top,
      endRow: bottom,
      startColumn: left,
      endColumn: right,
    });
    if (states === false) return;

    const orderedSchema = getSchemaOrderByViewIndex(left, width);
    for (let row = top, row2 = top + height; row < row2; row++) {
      const viewData = self.viewData[row] || {};
      const rowState = states === true || states[row - top];
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
    const schemaLength = self.getSchema().length;
    if (bounds) {
      if (bounds.right < 0) {
        // patch for API compatibility
        bounds.right = Math.max(schemaLength - 1, bounds.left, 0);
      }
      if (bounds.top > bounds.bottom || bounds.left > bounds.right)
        throw new Error('Impossible selection area');
      self.selectionBounds = self.sanitizeSelectionBounds(bounds);
    }
    let { top, bottom, left, right } = self.selectionBounds;
    if (!ctrl) self.selections = [];

    if (bottom >= self.viewData.length)
      bottom = Math.max(self.viewData.length - 1, top);
    if (top < -1 || left < -1 || right > schemaLength)
      throw new Error('Impossible selection area');

    /** @type {ContextForSelectionAction} */
    const context = { rows: self.viewData.length, columns: schemaLength };
    let changed = false;

    // In original API, number -1 indicates selecting whole row or selecting while column.
    if (top === -1) {
      // select whole columns
      const startColumn = Math.max(left, 0);
      // left eq -1 means selecting all cells
      const endRow =
        left === -1 ? schemaLength - 1 : Math.min(right, schemaLength - 1);
      changed = addIntoSelections(
        self.selections,
        normalizeSelection({
          type: SelectionType.Columns,
          startColumn: startColumn,
          endColumn: endRow,
        }),
        context,
      );
    } else if (left === -1) {
      // select whole rows
      const startRow = Math.max(top, 0);
      const endRow = Math.min(bottom, self.viewData.length - 1);
      changed = addIntoSelections(
        self.selections,
        normalizeSelection({
          type: SelectionType.Rows,
          startRow: startRow,
          endRow: endRow,
        }),
        context,
      );
    } else {
      changed = addIntoSelections(
        self.selections,
        normalizeSelection({
          type: SelectionType.Cells,
          startRow: top,
          endRow: bottom,
          startColumn: left,
          endColumn: right,
        }),
        context,
      );
    }
    if (changed) self.dispatchSelectionChangedEvent();
  };

  /**
   * This private method is using for make existing API about selection works.
   * TODO: This method can be removed by a better way.
   * @param {number} [rowIndex] 0 by default
   * @returns {number[]|undefined}
   */
  self.getRowSelectionStates = (rowIndex) => {
    if (typeof rowIndex !== 'number' || rowIndex < 0) rowIndex = 0;
    const startColumn = 0;
    const endRow = self.getSchema().length - 1;
    const width = endRow - startColumn + 1;
    const state = getSelectionStateFromCells(self.selections, {
      startRow: rowIndex,
      startColumn: startColumn,
      endRow: rowIndex,
      endColumn: endRow,
    });
    if (state === false) return;
    if (state === true) return new Array(width).fill(true).map((_, i) => i);

    const firstRow = state[0];
    if (!firstRow) return;

    const result = [];
    for (let col = 0; col < firstRow.length; col++)
      if (firstRow[col]) result.push(col);
    return result;
  };

  /**
   * Replace current selection list with new selection list
   * @param {object[]} newSelections New selection list
   */
  self.replaceAllSelections = (newSelections) => {
    cleanupSelections(newSelections);
    self.selections = newSelections;
  };

  /**
   * Select given columns and remove other existing selection area
   * @param {number[]} viewIndexes A number array that represents column view indexes
   */
  self.selectColumnViewIndexes = (viewIndexes) => {
    const selections = viewIndexes.map((col) => ({
      type: SelectionType.Columns,
      startColumn: col,
      endRow: col,
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
   * @param {boolean} [suppressEvent]
   */
  self.shrinkOrExpandSelections = (cell, keyEvent, suppressEvent) => {
    const result = shrinkOrExpandSelections(self.selections, cell, keyEvent, {
      columns: self.getSchema().length,
      rows: self.viewData.length,
    });
    if (result && !suppressEvent) self.dispatchSelectionChangedEvent();
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
      orderedSchema[col] = header;
    }
    return orderedSchema;
  }

  /**
   * TODO: this function will be used for caching
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
