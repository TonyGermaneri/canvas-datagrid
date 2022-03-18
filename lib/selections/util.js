'use strict';
//@ts-check
/// <reference path="./type.d.ts" />

// Abbreviation in this file
// - sel: selection
// - sel0, sel1: If there are two selections in the parameters, these two names are for them.

// Types of Selection
// 0. (High Priority) Unselected cells from [startRow, startColumn] to [endRow, endColumn]
// 1. Cells from [startRow, startColumn] to [endRow, endColumn]
// 2. Rows from startRow to endRow
// 3. Columns from startColumn to endColumn

const SelectionType = {
  UnselectedCells: 0,
  Cells: 1,
  Rows: 2,
  Columns: 3,
};

/**
 * As its name
 * @param {object} obj
 * @param {string} prop0
 * @param {string} prop1
 */
const swapProps = (obj, prop0, prop1) => {
  const t = obj[prop0];
  obj[prop0] = obj[prop1];
  obj[prop1] = t;
};

/**
 * This function transforms a selection object to normalized.
 * Here is the definition of **normalized selection object**:
 * - It contains these required properties: type, startRow, startColumn, endRow, endColumn
 * - Property `endRow` and property `endColumn` must exist even if their value are the same with `startRow` or `startColumn`.
 * - The value of `endRow` must be equals or greater than the value of `startRow`
 * - The value of `endColumn` must be equals or greater than the value of `startColumn`
 * @param {SelectionDescriptor} sel
 * @returns {SelectionDescriptor}
 */
const normalizeSelection = (sel) => {
  if (!sel) return sel;
  switch (sel.type) {
    case SelectionType.UnselectedCells:
    case SelectionType.Cells:
      if (typeof sel.endRow !== 'number') sel.endRow = sel.startRow;
      else if (sel.endRow < sel.startRow) swapProps(sel, 'startRow', 'endRow');

      if (typeof sel.endColumn !== 'number') sel.endColumn = sel.startColumn;
      else if (sel.endColumn < sel.startColumn)
        swapProps(sel, 'startColumn', 'endColumn');

      break;
    case SelectionType.Rows:
      if (typeof sel.endRow !== 'number') sel.endRow = sel.startRow;
      else if (sel.endRow < sel.startRow) swapProps(sel, 'startRow', 'endRow');

      break;
    case SelectionType.Columns:
      if (typeof sel.endColumn !== 'number') sel.endColumn = sel.startColumn;
      else if (sel.endColumn < sel.startColumn)
        swapProps(sel, 'startColumn', 'endColumn');

      break;
  }
  return sel;
};

/**
 * Parse a string expression to a selection object. Here are some example expressions:
 * - cells:20,30-40,50
 * - row:5
 * - cols:5-9
 * @param {string} str
 * @returns {SelectionDescriptor}
 */
const getSelectionFromString = (str) => {
  if (typeof str !== 'string') return;

  const index = str.indexOf(':');
  if (index < 0) return;

  const type = str.slice(0, index);
  const num = str
    .slice(index + 1)
    .split(/[,:;-]+/)
    .map((it) => parseInt(it, 10));
  switch (type) {
    case 'cell':
    case 'cells':
    case '-cell':
    case '-cells':
      return normalizeSelection({
        type: SelectionType[type[0] === '-' ? 'UnselectedCells' : 'Cells'],
        startRow: num[0],
        startColumn: num[1],
        endRow: num[2],
        endColumn: num[3],
      });
    case 'row':
    case 'rows':
      return normalizeSelection({
        type: SelectionType.Rows,
        startRow: num[0],
        endRow: num[1],
      });
    case 'col':
    case 'cols':
      return normalizeSelection({
        type: SelectionType.Columns,
        startColumn: num[0],
        endColumn: num[1],
      });
  }
};

/**
 * Check are two cells block the same
 * @param {SelectionDescriptor} block0
 * @param {SelectionDescriptor} block1
 * @returns {boolean}
 */
const isSameCellsBlock = (block0, block1) => {
  return (
    block0.startRow === block1.startRow &&
    block0.endRow === block1.endRow &&
    block0.startColumn === block1.startColumn &&
    block0.endColumn === block1.endColumn
  );
};

/**
 * This function is used in the function `mergeSelections`
 * @see mergeSelections
 * @param {SelectionDescriptor} cells
 * @param {SelectionDescriptor} rowsOrColumns
 * @returns {SelectionDescriptor}
 */
const mergeCellsIntoRowsOrColumns = (cells, rowsOrColumns) => {
  if (rowsOrColumns.type === SelectionType.Rows) {
    if (
      cells.startRow >= rowsOrColumns.startRow &&
      cells.endRow <= rowsOrColumns.endRow
    )
      return rowsOrColumns;
    return;
  }
  if (
    cells.startColumn >= rowsOrColumns.startColumn &&
    cells.endColumn <= rowsOrColumns.endColumn
  )
    return rowsOrColumns;
};

/**
 * Merge two selection objects (Splicing, Containing)
 * @param {SelectionDescriptor} sel0
 * @param {SelectionDescriptor} sel1
 * @returns {SelectionDescriptor} A concatenated selection object based on `block0`.
 * Or `undefined` if they can't be concatenated
 */
const mergeSelections = (sel0, sel1) => {
  if (sel0.type !== sel1.type) {
    if (sel1.type <= SelectionType.Cells && sel0.type > SelectionType.Cells)
      return mergeCellsIntoRowsOrColumns(sel1, sel0);
    if (sel0.type <= SelectionType.Cells && sel1.type > SelectionType.Cells)
      return mergeCellsIntoRowsOrColumns(sel0, sel1);
    return;
  }

  /** These two selection objects may be concatenated horizontally */
  const horizontalConcat =
    sel0.type === SelectionType.Columns
      ? true
      : sel0.startRow === sel1.startRow && sel0.endRow === sel1.endRow;

  /** These two selection objects may be concatenated vertically */
  const verticalConcat =
    sel0.type === SelectionType.Rows
      ? true
      : sel0.startColumn === sel1.startColumn &&
        sel0.endColumn === sel1.endColumn;

  if (horizontalConcat) {
    // Are they the same
    if (verticalConcat) return sel0;
    // Are they neighbor
    if (
      sel1.startColumn > sel0.endColumn + 1 ||
      sel1.endColumn < sel0.startColumn - 1
    )
      return;
    return Object.assign({}, sel0, {
      startColumn: Math.min(sel0.startColumn, sel1.startColumn),
      endColumn: Math.max(sel0.endColumn, sel1.endColumn),
    });
  }

  if (verticalConcat) {
    // Are they neighbor
    if (sel1.startRow > sel0.endRow + 1 || sel1.endRow < sel0.startRow - 1)
      return;
    return Object.assign({}, sel0, {
      startRow: Math.min(sel0.startRow, sel1.startRow),
      endRow: Math.max(sel0.endRow, sel1.endRow),
    });
  }

  // Does one of them contain other one
  if (
    sel0.type === SelectionType.Cells ||
    sel0.type === SelectionType.UnselectedCells
  ) {
    const intersection = getIntersection(sel0, sel1);
    if (intersection) {
      if (isSameCellsBlock(intersection, sel0)) return sel1;
      if (isSameCellsBlock(intersection, sel1)) return sel0;
    }
  }
};

/**
 * Remove some rows from a rows selection
 * @param {SelectionDescriptor} selection It must be a selection with type as `Rows`
 * @param {SelectionDescriptor} remove It must be a selection with type as `Rows`
 * @returns {SelectionDescriptor[]} Returning a `undefined` represents parameter `remove` doesn't intersect with parameter `selection`
 */
const removePartOfRowsSelection = (selection, remove) => {
  if (remove.endRow < selection.startRow) return;
  if (remove.startRow > selection.endRow) return;
  if (remove.startRow <= selection.startRow) {
    // all rows of the selection is removed
    if (remove.endRow >= selection.endRow) return [];
    return [Object.assign({}, selection, { startRow: remove.endRow + 1 })];
  }
  if (remove.endRow >= selection.endRow)
    return [Object.assign({}, selection, { endRow: remove.startRow - 1 })];
  // the selection be divided into two parts
  return [
    Object.assign({}, selection, { endRow: remove.startRow - 1 }),
    Object.assign({}, selection, { startRow: remove.endRow + 1 }),
  ];
};

/**
 * Remove some columns from a columns selection
 * @param {object} selection It must be a selection with type as `Columns`
 * @param {object} remove It must be a selection with type as `Columns`
 * @returns {object[]} Returning a `undefined` represents parameter `remove` doesn't intersect with parameter `selection`
 */
const removePartOfColumnsSelection = (selection, remove) => {
  if (remove.endColumn < selection.startColumn) return;
  if (remove.startColumn > selection.endColumn) return;
  if (remove.startColumn <= selection.startColumn) {
    // all cols of the selection is removed
    if (remove.endColumn >= selection.endColumn) return [];
    return [
      Object.assign({}, selection, { startColumn: remove.endColumn + 1 }),
    ];
  }
  if (remove.endColumn >= selection.endColumn)
    return [
      Object.assign({}, selection, { endColumn: remove.startColumn - 1 }),
    ];
  // the selection be divided into two parts
  return [
    Object.assign({}, selection, { endColumn: remove.startColumn - 1 }),
    Object.assign({}, selection, { startColumn: remove.endColumn + 1 }),
  ];
};

/**
 * Remove a cells block from a cells selection
 * @param {SelectionDescriptor} selection It must be a selection with type as `Cells` or `UnselectedCells`
 * @param {SelectionDescriptor} remove It must be a selection
 * @returns {SelectionDescriptor[]} Returning a `undefined` represents parameter `remove` doesn't intersect with parameter `selection`
 */
const removePartOfCellsSelection = (selection, remove) => {
  const intersect = getIntersection(selection, remove);
  if (!intersect) return;
  // all of cells in the selection are removed
  if (isSameCellsBlock(selection, intersect)) return [];
  const result = [];
  let minStartRow = selection.startRow;
  let maxEndRow = selection.endRow;
  let maxEndColumn = selection.endColumn;
  if (intersect.startRow > selection.startRow) {
    // Top
    result.push(
      Object.assign({}, selection, { endRow: intersect.startRow - 1 }),
    );
    minStartRow = intersect.startRow;
  }
  if (intersect.endColumn < selection.endColumn) {
    // Right
    result.push(
      Object.assign({}, selection, {
        startRow: minStartRow,
        startColumn: intersect.endColumn + 1,
      }),
    );
    maxEndColumn = intersect.endColumn;
  }
  if (intersect.endRow < selection.endRow) {
    // Bottom
    result.push(
      Object.assign({}, selection, {
        endColumn: maxEndColumn,
        startRow: intersect.endRow + 1,
      }),
    );
    maxEndRow = intersect.endRow;
  }
  if (intersect.startColumn > selection.startColumn) {
    // Bottom
    result.push(
      Object.assign({}, selection, {
        startRow: minStartRow,
        endRow: maxEndRow,
        endColumn: intersect.startColumn - 1,
      }),
    );
  }
  return result;
};

/**
 * Get intersection of two selection object
 * @param {SelectionDescriptor} sel0
 * @param {SelectionDescriptor} sel1
 * @returns {SelectionDescriptor} a selection object or undefined
 */
const getIntersection = (sel0, sel1) => {
  if (sel0.type > sel1.type) return getIntersection(sel1, sel0);
  if (sel0.type <= SelectionType.Cells) {
    if (sel1.type <= SelectionType.Cells) {
      const startColumn = Math.max(sel0.startColumn, sel1.startColumn);
      const endColumn = Math.min(sel0.endColumn, sel1.endColumn);
      if (startColumn > endColumn) return;

      const startRow = Math.max(sel0.startRow, sel1.startRow);
      const endRow = Math.min(sel0.endRow, sel1.endRow);
      if (startRow > endRow) return;

      return {
        type: SelectionType.Cells,
        startRow: startRow,
        startColumn: startColumn,
        endRow: endRow,
        endColumn: endColumn,
      };
    }
    if (sel1.type === SelectionType.Rows) {
      const startRow = Math.max(sel0.startRow, sel1.startRow);
      const endRow = Math.min(sel0.endRow, sel1.endRow);
      if (startRow > endRow) return;
      return {
        type: SelectionType.Cells,
        startRow: startRow,
        startColumn: sel0.startColumn,
        endRow: endRow,
        endColumn: sel0.endColumn,
      };
    } else {
      // SelectionType.Columns
      const startColumn = Math.max(sel0.startColumn, sel1.startColumn);
      const endColumn = Math.min(sel0.endColumn, sel1.endColumn);
      if (startColumn > endColumn) return;
      return {
        type: SelectionType.Cells,
        startColumn: startColumn,
        startRow: sel0.startRow,
        endColumn: endColumn,
        endRow: sel0.endRow,
      };
    }
  }
  if (sel0.type === SelectionType.Rows) {
    if (sel1.type === SelectionType.Rows) {
      const startRow = Math.max(sel0.startRow, sel1.startRow);
      const endRow = Math.min(sel0.endRow, sel1.endRow);
      if (startRow > endRow) return;
      return { type: SelectionType.Rows, startRow: startRow, endRow: endRow };
    } else {
      // SelectionType.Columns
      return {
        type: SelectionType.Cells,
        startRow: sel0.startRow,
        startColumn: sel1.startColumn,
        endRow: sel0.endRow,
        endColumn: sel1.endColumn,
      };
    }
  }
  // SelectionType.Columns
  const startColumn = Math.max(sel0.startColumn, sel1.startColumn);
  const endColumn = Math.min(sel0.endColumn, sel1.endColumn);
  if (startColumn > endColumn) return;
  return {
    type: SelectionType.Columns,
    startColumn: startColumn,
    endColumn: endColumn,
  };
};

/**
 * Add a selection object into `selections` array. And there are two behaviours if this function:
 * - It appends a new selection object into the `selections` array
 * - It rewrites the selection item in the `selections` array (merge or change its type)
 *
 * @param {SelectionDescriptor[]} selections
 * @param {SelectionDescriptor} add Supported types: Cells, Rows, Columns
 * @param {ContextForSelectionAction} [context] Eg: {rows:1000, columns:1000}
 * @returns {boolean} is the selections array changed
 */
const addIntoSelections = (selections, add, context) => {
  if (!add || typeof add.type !== 'number') return false;
  if (add.type === SelectionType.Cells) {
    for (let i = 0; i < selections.length; i++) {
      const sel = selections[i];
      if (sel.type === SelectionType.UnselectedCells) {
        const parts = removePartOfCellsSelection(sel, add);
        if (parts) {
          selections.splice(i, 1, ...parts);
          i += parts.length - 1;
        }
        continue;
      }
      if (sel.type === SelectionType.Cells) {
        const parts = removePartOfCellsSelection(add, sel);
        if (Array.isArray(parts)) {
          let result = false;
          for (let i = 0; i < parts.length; i++) {
            const isChanged = addIntoSelections(selections, parts[i], context);
            if (isChanged) result = true;
          }
          if (result) cleanupSelections(selections);
          return result;
        }
      }
    }

    // has context info of the grid
    if (context) {
      const selectedAllRows =
        add.startRow === 0 && add.endRow + 1 >= context.rows;
      const selectedAllColumns =
        add.startColumn === 0 && add.endColumn + 1 >= context.columns;
      let isChanged0, isChanged1;
      if (selectedAllRows) {
        isChanged0 = addIntoSelections(
          selections,
          {
            type: SelectionType.Columns,
            startColumn: add.startColumn,
            endColumn: add.endColumn,
          },
          context,
        );
      }
      if (selectedAllColumns) {
        isChanged1 = addIntoSelections(
          selections,
          {
            type: SelectionType.Rows,
            startRow: add.startRow,
            endRow: add.endRow,
          },
          context,
        );
      }
      if (selectedAllRows || selectedAllColumns)
        return isChanged0 || isChanged1;
    }

    selections.push(add);
    cleanupSelections(selections);
    return true;
  }
  // end of cells selection

  const isRowsSelection = add.type === SelectionType.Rows;
  if (isRowsSelection || add.type === SelectionType.Columns) {
    for (let i = 0; i < selections.length; i++) {
      const sel = selections[i];
      if (sel.type === SelectionType.UnselectedCells) {
        const parts = removePartOfCellsSelection(
          sel,
          isRowsSelection
            ? {
                startRow: add.startRow,
                endRow: add.endRow,
                startColumn: 0,
                endColumn: sel.endColumn,
              }
            : {
                startColumn: add.startColumn,
                endColumn: add.endColumn,
                startRow: 0,
                endRow: sel.endRow,
              },
        );
        if (parts) {
          selections.splice(i, 1, ...parts);
          i += parts.length - 1;
        }
        continue;
      }
      if (sel.type !== add.type) continue;
      // try to concat them
      let merged = mergeSelections(sel, add);
      if (merged) {
        for (let j = i + 1; j < selections.length; j++) {
          if (selections[j].type !== add.type) continue;
          const newMerged = mergeSelections(selections[j], merged);
          if (newMerged) {
            selections.splice(j, 1);
            j--;
            merged = newMerged;
          }
        }
        selections[i] = merged;
        cleanupSelections(selections);
        return true;
      }
    }
    selections.push(add);
    cleanupSelections(selections);
    return true;
  }
  return false;
};

/**
 * Remove a selection area from `selections` array
 * @param {SelectionDescriptor[]} selections
 * @param {SelectionDescriptor} remove Supported types: Cells, Rows, Columns
 * @param {ContextForSelectionAction} [context] Eg: {rows:1000, columns:1000}
 * @returns {boolean} is the selections array changed
 */
const removeFromSelections = (selections, remove, context) => {
  if (!remove || typeof remove.type !== 'number') return false;
  if (remove.type === SelectionType.Cells) {
    for (let i = 0; i < selections.length; i++) {
      const sel = selections[i];
      if (sel.type === SelectionType.UnselectedCells) {
        const parts = removePartOfCellsSelection(remove, sel);
        if (Array.isArray(parts)) {
          let result = false;
          for (let i = 0; i < parts.length; i++) {
            const isChanged = removeFromSelections(
              selections,
              parts[i],
              context,
            );
            if (isChanged) result = true;
          }
          if (result) cleanupSelections(selections);
          return result;
        }
      }
      if (sel.type === SelectionType.Cells) {
        const parts = removePartOfCellsSelection(sel, remove);
        if (parts) {
          selections.splice(i, 1, ...parts);
          i += parts.length - 1;
        }
        continue;
      }
    }
    // has context info of the grid
    if (context) {
      const unselectedAllRows =
        remove.startRow === 0 && remove.endRow + 1 >= context.rows;
      const unselectedAllColumns =
        remove.startColumn === 0 && remove.endColumn + 1 >= context.columns;
      let isChanged0, isChanged1;
      if (unselectedAllRows) {
        isChanged0 = removeFromSelections(
          selections,
          {
            type: SelectionType.Columns,
            startColumn: remove.startColumn,
            endColumn: remove.endColumn,
          },
          context,
        );
      }
      if (unselectedAllColumns) {
        isChanged1 = removeFromSelections(
          selections,
          {
            type: SelectionType.Rows,
            startRow: remove.startRow,
            endRow: remove.endRow,
          },
          context,
        );
      }
      if (unselectedAllRows || unselectedAllColumns)
        return isChanged0 || isChanged1;
    }

    remove.type = SelectionType.UnselectedCells;
    selections.unshift(remove);
    cleanupSelections(selections);
    return true;
  }
  // end of cells selection

  const isRowsSelection = remove.type === SelectionType.Rows;
  if (isRowsSelection || remove.type === SelectionType.Columns) {
    let isChanged = false;
    for (let i = 0; i < selections.length; i++) {
      const sel = selections[i];
      if (sel.type === SelectionType.Cells) {
        const parts = removePartOfCellsSelection(
          sel,
          isRowsSelection
            ? {
                startRow: remove.startRow,
                endRow: remove.endRow,
                startColumn: 0,
                endColumn: sel.endColumn,
              }
            : {
                startColumn: remove.startColumn,
                endColumn: remove.endColumn,
                startRow: 0,
                endRow: sel.endRow,
              },
        );
        if (parts) {
          selections.splice(i, 1, ...parts);
          i += parts.length - 1;
        }
        continue;
      }
      if (sel.type === SelectionType.UnselectedCells) {
        if (isRowsSelection) {
          if (sel.startRow >= remove.startRow && sel.endRow <= remove.endRow) {
            selections.splice(i, 1);
            i--;
          }
        } else {
          if (
            sel.startColumn >= remove.startColumn &&
            sel.endColumn <= remove.endColumn
          ) {
            selections.splice(i, 1);
            i--;
          }
        }
        continue;
      }
      if (sel.type === remove.type) {
        const newSelection = isRowsSelection
          ? removePartOfRowsSelection(sel, remove)
          : removePartOfColumnsSelection(sel, remove);
        if (!newSelection) continue;
        isChanged = true;
        selections.splice(i, 1, ...newSelection);
        i += newSelection.length - 1;
      } else {
        isChanged = true;
        /** @type {SelectionDescriptor} */
        let newSelection;
        if (sel.type === SelectionType.Rows) {
          newSelection = {
            type: SelectionType.UnselectedCells,
            startColumn: remove.startColumn,
            endColumn: remove.endColumn,
            startRow: sel.startRow,
            endRow: sel.endRow,
          };
        } else {
          newSelection = {
            type: SelectionType.UnselectedCells,
            startRow: remove.startRow,
            endRow: remove.endRow,
            startColumn: sel.startColumn,
            endColumn: sel.endColumn,
          };
        }
        selections.unshift(newSelection);
      }
    }
    if (isChanged) cleanupSelections(selections);
    return isChanged;
  }
  return false;
};

/**
 * Clean up a selections array.
 * This function removes unnecessary selection object, and it tries to merge different selections.
 * @param {SelectionDescriptor[]} selections
 */
const cleanupSelections = (selections) => {
  let unselect = [];
  let select = [];
  for (let i = 0; i < selections.length; i++) {
    const sel = selections[i];
    if (sel.type === SelectionType.UnselectedCells) unselect.push(sel);
    else select.push(sel);
  }
  // clean unused unselected objects
  unselect = unselect.filter((unsel) => {
    for (let i = 0; i < select.length; i++)
      if (getIntersection(unsel, select[i])) return true;
    return false;
  });
  // merge neighbor cells block selections
  let endMerge = false;
  while (!endMerge) {
    endMerge = true;
    for (let i = 0; i < select.length; i++) {
      const sel0 = select[i];
      for (let j = i + 1; j < select.length; j++) {
        const sel1 = select[j];
        const newSel = mergeSelections(sel0, sel1);
        if (!newSel) continue;
        select[i] = newSel;
        select.splice(j, 1);
        endMerge = false;
        break;
      }
      if (!endMerge) break;
    }
  }
  // save back to `selections`
  let ptr = 0;
  for (let i = 0; i < unselect.length; i++) selections[ptr++] = unselect[i];
  for (let i = 0; i < select.length; i++) selections[ptr++] = select[i];
  selections.splice(ptr, selections.length - ptr);
};

/**
 * Check if all cells in a given row selected
 * @param {SelectionDescriptor[]} selections
 * @param {number} rowIndex
 */
const isRowSelected = (selections, rowIndex) => {
  for (let i = 0; i < selections.length; i++) {
    const sel = selections[i];
    switch (sel.type) {
      case SelectionType.UnselectedCells:
        if (rowIndex >= sel.startRow && rowIndex <= sel.endRow) return false;
        break;
      case SelectionType.Rows:
        if (rowIndex >= sel.startRow && rowIndex <= sel.endRow) return true;
    }
  }
  return false;
};

/**
 * Check if all cells in a given column selected
 * @param {SelectionDescriptor[]} selections
 * @param {number} columnIndex
 */
const isColumnSelected = (selections, columnIndex) => {
  for (let i = 0; i < selections.length; i++) {
    const sel = selections[i];
    switch (sel.type) {
      case SelectionType.UnselectedCells:
        if (columnIndex >= sel.startColumn && columnIndex <= sel.endColumn)
          return false;
        break;
      case SelectionType.Columns:
        if (columnIndex >= sel.startColumn && columnIndex <= sel.endColumn)
          return true;
    }
  }
  return false;
};

/**
 * Check if a given cell selected
 * @param {SelectionDescriptor[]} selections
 * @param {number} rowIndex
 * @param {number} columnIndex
 */
const isCellSelected = (selections, rowIndex, columnIndex) => {
  for (let i = 0; i < selections.length; i++) {
    const sel = selections[i];
    switch (sel.type) {
      case SelectionType.UnselectedCells:
      case SelectionType.Cells:
        if (
          columnIndex >= sel.startColumn &&
          columnIndex <= sel.endColumn &&
          rowIndex >= sel.startRow &&
          rowIndex <= sel.endRow
        )
          return sel.type === SelectionType.Cells;
        break;
      case SelectionType.Rows:
        if (rowIndex >= sel.startRow && rowIndex <= sel.endRow) return true;
        break;
      case SelectionType.Columns:
        if (columnIndex >= sel.startColumn && columnIndex <= sel.endColumn)
          return true;
    }
  }
  return false;
};

/**
 * Check if all given cells selected
 * @param {SelectionDescriptor[]} selections
 * @param {RangeDescriptor} range the range of cells block
 * @returns {boolean}
 */
const areAllCellsSelected = (selections, range) => {
  const {
    startRow: startRow,
    startColumn: startColumn,
    endRow: endRow,
    endColumn: endColumn,
  } = range;
  for (let i = 0, iTo = selections.length; i < iTo; i++) {
    const sel = selections[i];
    if (!sel) continue;
    switch (sel.type) {
      case SelectionType.UnselectedCells:
      case SelectionType.Cells:
        {
          const matched0 =
            startColumn >= sel.startColumn && startRow >= sel.startRow;
          const matched1 = endColumn <= sel.endColumn && endRow <= sel.endRow;
          if (matched0 || matched1) {
            if (matched0 && matched1) return sel.type === SelectionType.Cells;
            if (
              (matched0 &&
                startColumn <= sel.endColumn &&
                startRow <= sel.endRow) ||
              (matched1 &&
                endColumn >= sel.startColumn &&
                endRow >= sel.startRow)
            )
              return false;
          }
        }
        break;
      case SelectionType.Rows:
        if (startRow >= sel.startRow) {
          if (endRow <= sel.endRow) return true;
          if (startRow <= sel.endRow) return false;
        } else if (endRow >= sel.startRow) return false;
        break;
      case SelectionType.Columns:
        if (startColumn >= sel.startColumn) {
          if (endColumn <= sel.endColumn) return true;
          if (startColumn <= sel.endColumn) return false;
        } else if (endColumn >= sel.startColumn) return false;
    }
  }
  return false;
};

/**
 * Get selection state from cells
 * @param {SelectionDescriptor[]} selections
 * @param {RangeDescriptor} range
 * @returns {boolean|boolean[][]} Returning `true` means all given cells are selected,
 * Returning `false` means all given cells are not selected.
 * Returning a two-dimensional array means some cells are selected and some cells are not selected.
 * A reference for returned value: `state[rowIndex - range.startRow][colIndex - range.startColumn]`
 */
const getSelectionStateFromCells = (selections, range) => {
  if (!Array.isArray(selections) || selections.length === 0) return false;
  selections = selections.filter((sel) => {
    if (typeof sel.startRow === 'number')
      if (sel.endRow < range.startRow || sel.startRow > range.endRow)
        return false;
    if (typeof sel.startColumn === 'number')
      if (
        sel.endColumn < range.startColumn ||
        sel.startColumn > range.endColumn
      )
        return false;
    return sel;
  });
  if (selections.length === 0) return false;
  if (areAllCellsSelected(selections, range)) return true;

  const countOfColumns = range.endColumn - range.startColumn + 1;
  const result = new Array(range.endRow - range.startRow + 1)
    .fill(null)
    .map(() => new Array(countOfColumns));

  const test = Object.assign({ type: SelectionType.Cells }, range);
  for (let i = selections.length - 1; i >= 0; i--) {
    const sel = selections[i];
    const intersection = getIntersection(test, sel);
    if (!intersection) continue;
    const value = sel.type !== SelectionType.UnselectedCells;
    for (
      let rowIndex = intersection.startRow;
      rowIndex <= intersection.endRow;
      rowIndex++
    ) {
      const row = result[rowIndex - range.startRow];
      let columnOffset = intersection.startColumn - range.startColumn;
      const columnOffsetEnd = intersection.endColumn - range.startColumn;
      for (; columnOffset <= columnOffsetEnd; columnOffset++)
        row[columnOffset] = value;
    }
  }
  return result;
};

/**
 * Get verbose selection state from cells.
 * (`verbose` in here means that you can locate particular selection for selected cells)
 * @param {SelectionDescriptor[]} selections
 * @param {RangeDescriptor} range
 * @returns {number[][]} Each item in this two-dimensional array is 0 or a positive int,
 * it represents the index of matched selection plus 1 if it is a positive int.
 * And if the value of item is 0, it means this cell is not selected.
 * A reference for returned value: `state[rowIndex - range.startRow][colIndex - range.startColumn]`
 */
const getVerboseSelectionStateFromCells = (selections, range) => {
  if (!Array.isArray(selections) || selections.length === 0) return [];
  selections = selections.map((sel) => {
    if (typeof sel.startRow === 'number')
      if (sel.endRow < range.startRow || sel.startRow > range.endRow)
        return null;
    if (typeof sel.startColumn === 'number')
      if (
        sel.endColumn < range.startColumn ||
        sel.startColumn > range.endColumn
      )
        return null;
    return sel;
  });
  if (selections.length === 0) return [];

  const countOfColumns = range.endColumn - range.startColumn + 1;
  const result = new Array(range.endRow - range.startRow + 1)
    .fill(null)
    .map(() => new Array(countOfColumns));

  const test = Object.assign({ type: SelectionType.Cells }, range);
  for (let i = selections.length - 1; i >= 0; i--) {
    const sel = selections[i];
    if (!sel) continue;
    const intersection = getIntersection(test, sel);
    if (!intersection) continue;
    const value = sel.type !== SelectionType.UnselectedCells;
    for (
      let rowIndex = intersection.startRow;
      rowIndex <= intersection.endRow;
      rowIndex++
    ) {
      const row = result[rowIndex - range.startRow];
      let columnOffset = intersection.startColumn - range.startColumn;
      const columnOffsetEnd = intersection.endColumn - range.startColumn;
      for (; columnOffset <= columnOffsetEnd; columnOffset++)
        row[columnOffset] = value ? i + 1 : 0;
    }
  }
  return result;
};

/**
 * Check if any contiguous columns are selected.
 * (This function is useful for the preconditions for actions on columns, Eg: grouping, hiding)
 * @param {SelectionDescriptor[]} selections
 * @param {boolean} allowImpurity This function ignores other selected rows/cells if its value is `true`
 * @returns {number[]} a tuple [beginViewColumnIndex, endViewColumnIndex] or `undefined`
 */
const getSelectedContiguousColumns = (selections, allowImpurity) => {
  if (!selections || selections.length === 0) return;
  /** A selection object */
  let matched;
  for (let i = selections.length - 1; i >= 0; i--) {
    const selection = selections[i];
    switch (selection.type) {
      case SelectionType.Columns:
        if (matched) {
          const newMatched = mergeSelections(matched, selection);
          if (newMatched) {
            matched = newMatched;
            break;
          }
        }
        matched = selection;
        break;
      case SelectionType.Rows:
      case SelectionType.Cells:
        if (!allowImpurity) return;
        break;
      case SelectionType.UnselectedCells:
        if (!matched) return;
        if (getIntersection(selection, matched)) return;
    }
  }
  if (matched) return [matched.startColumn, matched.endColumn];
};

/**
 * Check if any contiguous rows are selected.
 * (This function is useful for the preconditions for actions on rows, Eg: grouping, hiding)
 * @param {SelectionDescriptor[]} selections
 * @param {boolean} allowImpurity This function ignores other selected columns/cells if its value is `true`
 * @returns {number[]} a tuple [beginRowOrderIndex, endRowOrderIndex] or `undefined`
 */
const getSelectedContiguousRows = (selections, allowImpurity) => {
  if (!selections || selections.length === 0) return;
  /** A selection object */
  let matched;
  for (let i = selections.length - 1; i >= 0; i--) {
    const selection = selections[i];
    switch (selection.type) {
      case SelectionType.Rows:
        if (matched) {
          const newMatched = mergeSelections(matched, selection);
          if (newMatched) {
            matched = newMatched;
            break;
          }
        }
        matched = selection;
        break;
      case SelectionType.Columns:
      case SelectionType.Cells:
        if (!allowImpurity) return;
        break;
      case SelectionType.UnselectedCells:
        if (!matched) return;
        if (getIntersection(selection, matched)) return;
    }
  }
  if (matched) return [matched.startRow, matched.endRow];
};

/**
 * Check if current selections are complex.
 * How we defined "complex" in here:
 * - There are any unselected cells in selected rows/columns
 * - More than one selection type in current selections
 * @param {SelectionDescriptor[]} selections
 * @returns {boolean}
 */
const areSelectionsComplex = (selections) => {
  if (!selections || selections <= 1) return false;
  const baseType = selections[0].type;
  if (baseType === SelectionType.UnselectedCells) return true;
  return selections.findIndex((it) => it.type !== baseType) >= 0;
};

/**
 * Check if current selections are neat.
 * This method is used for make new API are compatible with obsolete API
 * For example:
 * - Selected like <0,0-10,10> or rows<5-10>  is neat
 * - Selected like <0,0-10,10>&<11,1-11,10> is untidy
 * @param {SelectionDescriptor[]} selections selections after clean up
 * @returns {boolean}
 */
const areSelectionsNeat = (selections) => {
  if (!selections) return false;
  if (selections.length === 1) return true;

  const base = selections[0];
  const baseType = base.type;
  if (baseType === SelectionType.UnselectedCells) return true;

  for (let i = 0; i < selections.length; i++) {
    const sel = selections[i];
    if (baseType !== sel.type) return false;
    if (baseType === SelectionType.Cells) {
      if (
        sel.startColumn === base.startColumn &&
        sel.endColumn === base.endColumn
      )
        continue;
      if (sel.startRow === base.startRow && sel.endRow === base.endRow)
        continue;
      // they are not aligned
      return false;
    }
  }
  return true;
};

/**
 * @param {SelectionDescriptor[]} selections
 * @param {number} offsetX
 * @param {number} offsetY
 */
const moveSelections = (selections, offsetX, offsetY) => {
  for (let i = 0; i < selections.length; i++) {
    const selection = selections[i];
    switch (selection.type) {
      case SelectionType.Cells:
      case SelectionType.UnselectedCells:
        selection.startRow += offsetY;
        selection.endRow += offsetY;
        selection.startColumn += offsetX;
        selection.endColumn += offsetX;
        break;
      case SelectionType.Rows:
        selection.startRow += offsetY;
        selection.endRow += offsetY;
        break;
      case SelectionType.Columns:
        selection.startColumn += offsetX;
        selection.endColumn += offsetX;
        break;
    }
  }
};

/**
 * @param {SelectionDescriptor[]} selections
 * @returns {SelectionDescriptor[]}
 */
const cloneSelections = (selections) => {
  const clonedSelections = [];
  for (let i = 0; i < selections.length; i++) {
    const sel = selections[i];
    if (!sel) continue;
    clonedSelections.push(Object.assign({}, sel));
  }
  return clonedSelections;
};

/**
 * @param {SelectionDescriptor[]} selections
 * @returns {RectangleObject}
 */
const getSelectionBounds = (selections) => {
  /**
   * The reason why the initialize values are `Infinity` is used for making
   * the bound is compatible with the obsolete API.
   */
  let top = Infinity,
    bottom = -Infinity,
    left = Infinity,
    right = -Infinity;
  for (let i = 0; i < selections.length; i++) {
    const sel = selections[i];
    if (sel.type === SelectionType.UnselectedCells) continue;

    if (typeof sel.startColumn !== 'number') left = 0;
    else if (sel.startColumn < left) left = sel.startColumn;

    if (typeof sel.endColumn !== 'number') right = Infinity;
    else if (sel.endColumn > right) right = sel.endColumn;

    if (typeof sel.startRow !== 'number') top = 0;
    else if (sel.startRow < top) top = sel.startRow;

    if (typeof sel.endRow !== 'number') bottom = Infinity;
    else if (sel.endRow > bottom) bottom = sel.endRow;
  }
  return { top, left, bottom, right };
};

/**
 * @param {SelectionDescriptor[]} selections
 * @param {object} cell Signature: `{rowIndex:number;columnIndex:number}`
 * @param {object} keyEvent Signature: `{key:string;shiftKey:boolean}`
 * @param {object} context Signature: `{columns:number;rows:number}`
 * @returns {boolean}
 */
const shrinkOrExpandSelections = (selections, cell, keyEvent, context) => {
  const { rowIndex, columnIndex } = cell;
  if (rowIndex < 0 || columnIndex < 0) return false;

  const keyInfo = {
    ArrowLeft: { x: 1, y: 0, isLeft: true },
    ArrowUp: { x: 0, y: 1, isUp: true },
    ArrowRight: { x: -1, y: 0, isRight: true },
    ArrowDown: { x: 0, y: -1, isDown: true },
  }[keyEvent.key];
  if (!keyInfo) return false;

  const originalRowIndex = rowIndex + keyInfo.y;
  const originalColumnIndex = columnIndex + keyInfo.x;

  /** @type {number[]} */
  let matchedSelections = [];
  for (let i = 0; i < selections.length; i++) {
    /** @type {SelectionDescriptor} */
    const sel = selections[i];
    switch (sel.type) {
      case SelectionType.Cells:
      case SelectionType.UnselectedCells:
        if (
          (originalRowIndex === sel.startRow ||
            originalRowIndex === sel.endRow) &&
          (originalColumnIndex === sel.startColumn ||
            originalColumnIndex === sel.endColumn)
        ) {
          // we can't shrink or expand from a unselected areas
          if (sel.type === SelectionType.UnselectedCells) return false;
          matchedSelections.push(sel);
        }
        break;
      case SelectionType.Rows:
        if (
          originalRowIndex === sel.startRow ||
          originalRowIndex === sel.endRow
        )
          matchedSelections.push(sel);
        break;
      case SelectionType.Columns:
        if (
          originalColumnIndex === sel.startColumn ||
          originalColumnIndex === sel.endColumn
        )
          matchedSelections.push(sel);
        break;
    }
  }
  // The selection is complex.
  // Or the expanding / shrinking action is not from the border cell of selected area
  if (matchedSelections.length !== 1) return false;
  const selection = matchedSelections[0];

  const isTopBorder = selection.startRow === originalRowIndex;
  const isBottomBorder = selection.endRow === originalRowIndex;

  const isLeftBorder = selection.startColumn === originalColumnIndex;
  const isRightBorder = selection.endColumn === originalColumnIndex;

  const maxRow = context ? context.rows - 1 : Infinity;
  const maxColumn = context ? context.columns - 1 : Infinity;

  const afterChange = () => {
    cleanupSelections(selections);
    return true;
  };

  if (isTopBorder) {
    if (keyInfo.isUp) {
      // at the topmost row
      if (selection.startRow === 0) return false;
      // expand to the up
      selection.startRow--;
      return afterChange();
    } else if (keyInfo.isDown && selection.startRow < selection.endRow) {
      selection.startRow++;
      return afterChange();
    }
  }
  if (isBottomBorder) {
    if (keyInfo.isDown) {
      // at the bottomost row
      if (selection.endRow >= maxRow) return false;
      // expand to the down
      selection.endRow++;
      return afterChange();
    } else if (keyInfo.isUp && selection.startRow < selection.endRow) {
      selection.endRow--;
      return afterChange();
    }
  }
  if (isLeftBorder) {
    if (keyInfo.isLeft) {
      // at the leftmost column
      if (selection.startColumn === 0) return false;
      // expand to the left
      selection.startColumn--;
      return afterChange();
    } else if (keyInfo.isRight && selection.startColumn < selection.endColumn) {
      selection.startColumn++;
      return afterChange();
    }
  }
  if (isRightBorder) {
    if (keyInfo.isRight) {
      // at the rightmost column
      if (selection.endColumn >= maxColumn) return false;
      // expand to the down
      selection.endColumn++;
      return afterChange();
    } else if (keyInfo.isLeft && selection.startColumn < selection.endColumn) {
      selection.endColumn--;
      return afterChange();
    }
  }
  return false;
};

export {
  SelectionType,
  getSelectionFromString,
  normalizeSelection,
  addIntoSelections,
  removeFromSelections,
  mergeSelections,
  removePartOfRowsSelection,
  removePartOfColumnsSelection,
  removePartOfCellsSelection,
  cleanupSelections,
  getIntersection,
  isRowSelected,
  isColumnSelected,
  isCellSelected,
  areAllCellsSelected,
  areSelectionsNeat,
  getSelectionStateFromCells,
  getVerboseSelectionStateFromCells,
  areSelectionsComplex,
  getSelectedContiguousColumns,
  getSelectedContiguousRows,
  moveSelections,
  cloneSelections,
  getSelectionBounds,
  shrinkOrExpandSelections,
};
