'use strict';
//@ts-check
/// <reference path="./type.d.ts" />

// Abbreviation in this file
// - sel: selection
// - sel0, sel1: If there are two selections in the parameters, these two names are for them.

// Types of Selection
// 0. (High Priority) Unselected cells from [row0, col0] to [row1, col1]
// 1. Cells from [row0, col0] to [row1, col1]
// 2. Rows from row0 to row1
// 3. Columns from col0 to col1

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
 * - It contains these required properties: type, row0, col0, row1, col1
 * - Property `row1` and property `col1` must exist even if their value are the same with `row0` or `col0`.
 * - The value of `row1` must be equals or greater than the value of `row0`
 * - The value of `col1` must be equals or greater than the value of `col0`
 * @param {SelectionDescriptor} sel
 * @returns {SelectionDescriptor}
 */
const normalizeSelection = (sel) => {
  if (!sel) return sel;
  switch (sel.type) {
    case SelectionType.UnselectedCells:
    case SelectionType.Cells:
      if (typeof sel.row1 !== 'number') sel.row1 = sel.row0;
      else if (sel.row1 < sel.row0) swapProps(sel, 'row0', 'row1');

      if (typeof sel.col1 !== 'number') sel.col1 = sel.col0;
      else if (sel.col1 < sel.col0) swapProps(sel, 'col0', 'col1');

      break;
    case SelectionType.Rows:
      if (typeof sel.row1 !== 'number') sel.row1 = sel.row0;
      else if (sel.row1 < sel.row0) swapProps(sel, 'row0', 'row1');

      break;
    case SelectionType.Columns:
      if (typeof sel.col1 !== 'number') sel.col1 = sel.col0;
      else if (sel.col1 < sel.col0) swapProps(sel, 'col0', 'col1');

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
        row0: num[0],
        col0: num[1],
        row1: num[2],
        col1: num[3],
      });
    case 'row':
    case 'rows':
      return normalizeSelection({
        type: SelectionType.Rows,
        row0: num[0],
        row1: num[1],
      });
    case 'col':
    case 'cols':
      return normalizeSelection({
        type: SelectionType.Columns,
        col0: num[0],
        col1: num[1],
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
    block0.row0 === block1.row0 &&
    block0.row1 === block1.row1 &&
    block0.col0 === block1.col0 &&
    block0.col1 === block1.col1
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
    if (cells.row0 >= rowsOrColumns.row0 && cells.row1 <= rowsOrColumns.row1)
      return rowsOrColumns;
    return;
  }
  if (cells.col0 >= rowsOrColumns.col0 && cells.col1 <= rowsOrColumns.col1)
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
      : sel0.row0 === sel1.row0 && sel0.row1 === sel1.row1;

  /** These two selection objects may be concatenated vertically */
  const verticalConcat =
    sel0.type === SelectionType.Rows
      ? true
      : sel0.col0 === sel1.col0 && sel0.col1 === sel1.col1;

  if (horizontalConcat) {
    // Are they the same
    if (verticalConcat) return sel0;
    // Are they neighbor
    if (sel1.col0 > sel0.col1 + 1 || sel1.col1 < sel0.col0 - 1) return;
    return Object.assign({}, sel0, {
      col0: Math.min(sel0.col0, sel1.col0),
      col1: Math.max(sel0.col1, sel1.col1),
    });
  }

  if (verticalConcat) {
    // Are they neighbor
    if (sel1.row0 > sel0.row1 + 1 || sel1.row1 < sel0.row0 - 1) return;
    return Object.assign({}, sel0, {
      row0: Math.min(sel0.row0, sel1.row0),
      row1: Math.max(sel0.row1, sel1.row1),
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
  if (remove.row1 < selection.row0) return;
  if (remove.row0 > selection.row1) return;
  if (remove.row0 <= selection.row0) {
    // all rows of the selection is removed
    if (remove.row1 >= selection.row1) return [];
    return [Object.assign({}, selection, { row0: remove.row1 + 1 })];
  }
  if (remove.row1 >= selection.row1)
    return [Object.assign({}, selection, { row1: remove.row0 - 1 })];
  // the selection be divided into two parts
  return [
    Object.assign({}, selection, { row1: remove.row0 - 1 }),
    Object.assign({}, selection, { row0: remove.row1 + 1 }),
  ];
};

/**
 * Remove some columns from a columns selection
 * @param {object} selection It must be a selection with type as `Columns`
 * @param {object} remove It must be a selection with type as `Columns`
 * @returns {object[]} Returning a `undefined` represents parameter `remove` doesn't intersect with parameter `selection`
 */
const removePartOfColumnsSelection = (selection, remove) => {
  if (remove.col1 < selection.col0) return;
  if (remove.col0 > selection.col1) return;
  if (remove.col0 <= selection.col0) {
    // all cols of the selection is removed
    if (remove.col1 >= selection.col1) return [];
    return [Object.assign({}, selection, { col0: remove.col1 + 1 })];
  }
  if (remove.col1 >= selection.col1)
    return [Object.assign({}, selection, { col1: remove.col0 - 1 })];
  // the selection be divided into two parts
  return [
    Object.assign({}, selection, { col1: remove.col0 - 1 }),
    Object.assign({}, selection, { col0: remove.col1 + 1 }),
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
  let minRow0 = selection.row0;
  let maxRow1 = selection.row1;
  let maxCol1 = selection.col1;
  if (intersect.row0 > selection.row0) {
    // Top
    result.push(Object.assign({}, selection, { row1: intersect.row0 - 1 }));
    minRow0 = intersect.row0;
  }
  if (intersect.col1 < selection.col1) {
    // Right
    result.push(
      Object.assign({}, selection, {
        row0: minRow0,
        col0: intersect.col1 + 1,
      }),
    );
    maxCol1 = intersect.col1;
  }
  if (intersect.row1 < selection.row1) {
    // Bottom
    result.push(
      Object.assign({}, selection, {
        col1: maxCol1,
        row0: intersect.row1 + 1,
      }),
    );
    maxRow1 = intersect.row1;
  }
  if (intersect.col0 > selection.col0) {
    // Bottom
    result.push(
      Object.assign({}, selection, {
        row0: minRow0,
        row1: maxRow1,
        col1: intersect.col0 - 1,
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
      const col0 = Math.max(sel0.col0, sel1.col0);
      const col1 = Math.min(sel0.col1, sel1.col1);
      if (col0 > col1) return;

      const row0 = Math.max(sel0.row0, sel1.row0);
      const row1 = Math.min(sel0.row1, sel1.row1);
      if (row0 > row1) return;

      return { type: SelectionType.Cells, row0, col0, row1, col1 };
    }
    if (sel1.type === SelectionType.Rows) {
      const row0 = Math.max(sel0.row0, sel1.row0);
      const row1 = Math.min(sel0.row1, sel1.row1);
      if (row0 > row1) return;
      return {
        type: SelectionType.Cells,
        row0,
        col0: sel0.col0,
        row1,
        col1: sel0.col1,
      };
    } else {
      // SelectionType.Columns
      const col0 = Math.max(sel0.col0, sel1.col0);
      const col1 = Math.min(sel0.col1, sel1.col1);
      if (col0 > col1) return;
      return {
        type: SelectionType.Cells,
        col0,
        row0: sel0.row0,
        col1,
        row1: sel0.row1,
      };
    }
  }
  if (sel0.type === SelectionType.Rows) {
    if (sel1.type === SelectionType.Rows) {
      const row0 = Math.max(sel0.row0, sel1.row0);
      const row1 = Math.min(sel0.row1, sel1.row1);
      if (row0 > row1) return;
      return { type: SelectionType.Rows, row0, row1 };
    } else {
      // SelectionType.Columns
      return {
        type: SelectionType.Cells,
        row0: sel0.row0,
        col0: sel1.col0,
        row1: sel0.row1,
        col1: sel1.col1,
      };
    }
  }
  // SelectionType.Columns
  const col0 = Math.max(sel0.col0, sel1.col0);
  const col1 = Math.min(sel0.col1, sel1.col1);
  if (col0 > col1) return;
  return { type: SelectionType.Columns, col0, col1 };
};

/**
 * Add a selection object into `selections` array. And there are two behaviours if this function:
 * - It appends a new selection object into the `selections` array
 * - It rewrites the selection item in the `selections` array (merge or change its type)
 *
 * @param {SelectionDescriptor[]} selections
 * @param {SelectionDescriptor} add Supported types: Cells, Rows, Columns
 * @param {SelectionDescriptor} [context] Eg: {rows:1000, columns:1000}
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
      const selectedAllRows = add.row0 === 0 && add.row1 + 1 >= context.rows;
      const selectedAllColumns =
        add.col0 === 0 && add.col1 + 1 >= context.columns;
      let isChanged0, isChanged1;
      if (selectedAllRows) {
        isChanged0 = addIntoSelections(
          selections,
          { type: SelectionType.Columns, col0: add.col0, col1: add.col1 },
          context,
        );
      }
      if (selectedAllColumns) {
        isChanged1 = addIntoSelections(
          selections,
          { type: SelectionType.Rows, row0: add.row0, row1: add.row1 },
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
            ? { row0: add.row0, row1: add.row1, col0: 0, col1: sel.col1 }
            : { col0: add.col0, col1: add.col1, row0: 0, row1: sel.row1 },
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
 * @param {SelectionDescriptor} [context] Eg: {rows:1000, columns:1000}
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
        remove.row0 === 0 && remove.row1 + 1 >= context.rows;
      const unselectedAllColumns =
        remove.col0 === 0 && remove.col1 + 1 >= context.columns;
      let isChanged0, isChanged1;
      if (unselectedAllRows) {
        isChanged0 = removeFromSelections(
          selections,
          {
            type: SelectionType.Columns,
            col0: remove.col0,
            col1: remove.col1,
          },
          context,
        );
      }
      if (unselectedAllColumns) {
        isChanged1 = removeFromSelections(
          selections,
          { type: SelectionType.Rows, row0: remove.row0, row1: remove.row1 },
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
            ? { row0: remove.row0, row1: remove.row1, col0: 0, col1: sel.col1 }
            : { col0: remove.col0, col1: remove.col1, row0: 0, row1: sel.row1 },
        );
        if (parts) {
          selections.splice(i, 1, ...parts);
          i += parts.length - 1;
        }
        continue;
      }
      if (sel.type === SelectionType.UnselectedCells) {
        if (isRowsSelection) {
          if (sel.row0 >= remove.row0 && sel.row1 <= remove.row1) {
            selections.splice(i, 1);
            i--;
          }
        } else {
          if (sel.col0 >= remove.col0 && sel.col1 <= remove.col1) {
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
            col0: remove.col0,
            col1: remove.col1,
            row0: sel.row0,
            row1: sel.row1,
          };
        } else {
          newSelection = {
            type: SelectionType.UnselectedCells,
            row0: remove.row0,
            row1: remove.row1,
            col0: sel.col0,
            col1: sel.col1,
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
        if (rowIndex >= sel.row0 && rowIndex <= sel.row1) return false;
        break;
      case SelectionType.Rows:
        if (rowIndex >= sel.row0 && rowIndex <= sel.row1) return true;
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
        if (columnIndex >= sel.col0 && columnIndex <= sel.col1) return false;
        break;
      case SelectionType.Columns:
        if (columnIndex >= sel.col0 && columnIndex <= sel.col1) return true;
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
          columnIndex >= sel.col0 &&
          columnIndex <= sel.col1 &&
          rowIndex >= sel.row0 &&
          rowIndex <= sel.row1
        )
          return sel.type === SelectionType.Cells;
        break;
      case SelectionType.Rows:
        if (rowIndex >= sel.row0 && rowIndex <= sel.row1) return true;
        break;
      case SelectionType.Columns:
        if (columnIndex >= sel.col0 && columnIndex <= sel.col1) return true;
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
  const { row0, col0, row1, col1 } = range;
  for (let i = 0, iTo = selections.length; i < iTo; i++) {
    const sel = selections[i];
    if (!sel) continue;
    switch (sel.type) {
      case SelectionType.UnselectedCells:
      case SelectionType.Cells:
        {
          const matched0 = col0 >= sel.col0 && row0 >= sel.row0;
          const matched1 = col1 <= sel.col1 && row1 <= sel.row1;
          if (matched0 || matched1) {
            if (matched0 && matched1) return sel.type === SelectionType.Cells;
            if (
              (matched0 && col0 <= sel.col1 && row0 <= sel.row1) ||
              (matched1 && col1 >= sel.col0 && row1 >= sel.row0)
            )
              return false;
          }
        }
        break;
      case SelectionType.Rows:
        if (row0 >= sel.row0) {
          if (row1 <= sel.row1) return true;
          if (row0 <= sel.row1) return false;
        } else if (row1 >= sel.row0) return false;
        break;
      case SelectionType.Columns:
        if (col0 >= sel.col0) {
          if (col1 <= sel.col1) return true;
          if (col0 <= sel.col1) return false;
        } else if (col1 >= sel.col0) return false;
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
 * A reference for returned value: `state[rowIndex - range.row0][colIndex - range.col0]`
 */
const getSelectionStateFromCells = (selections, range) => {
  if (!Array.isArray(selections) || selections.length === 0) return false;
  selections = selections.filter((sel) => {
    if (typeof sel.row0 === 'number')
      if (sel.row1 < range.row0 || sel.row0 > range.row1) return false;
    if (typeof sel.col0 === 'number')
      if (sel.col1 < range.col0 || sel.col0 > range.col1) return false;
    return sel;
  });
  if (selections.length === 0) return false;
  if (areAllCellsSelected(selections, range)) return true;

  const countOfColumns = range.col1 - range.col0 + 1;
  const result = new Array(range.row1 - range.row0 + 1)
    .fill(null)
    .map(() => new Array(countOfColumns));

  const test = Object.assign({ type: SelectionType.Cells }, range);
  for (let i = selections.length - 1; i >= 0; i--) {
    const sel = selections[i];
    const intersection = getIntersection(test, sel);
    if (!intersection) continue;
    const value = sel.type !== SelectionType.UnselectedCells;
    for (
      let rowIndex = intersection.row0;
      rowIndex <= intersection.row1;
      rowIndex++
    ) {
      const row = result[rowIndex - range.row0];
      let columnOffset = intersection.col0 - range.col0;
      const columnOffsetEnd = intersection.col1 - range.col0;
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
 * A reference for returned value: `state[rowIndex - range.row0][colIndex - range.col0]`
 */
const getVerboseSelectionStateFromCells = (selections, range) => {
  if (!Array.isArray(selections) || selections.length === 0) return [];
  selections = selections.map((sel) => {
    if (typeof sel.row0 === 'number')
      if (sel.row1 < range.row0 || sel.row0 > range.row1) return null;
    if (typeof sel.col0 === 'number')
      if (sel.col1 < range.col0 || sel.col0 > range.col1) return null;
    return sel;
  });
  if (selections.length === 0) return [];

  const countOfColumns = range.col1 - range.col0 + 1;
  const result = new Array(range.row1 - range.row0 + 1)
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
      let rowIndex = intersection.row0;
      rowIndex <= intersection.row1;
      rowIndex++
    ) {
      const row = result[rowIndex - range.row0];
      let columnOffset = intersection.col0 - range.col0;
      const columnOffsetEnd = intersection.col1 - range.col0;
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
 * @returns {number[]} a tuple [beginColumnOrderIndex, endColumnOrderIndex] or `undefined`
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
  if (matched) return [matched.col0, matched.col1];
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
  if (matched) return [matched.row0, matched.row1];
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
        selection.row0 += offsetX;
        selection.row1 += offsetX;
        selection.col0 += offsetY;
        selection.col1 += offsetY;
        break;
      case SelectionType.Rows:
        selection.row0 += offsetX;
        selection.row1 += offsetX;
        break;
      case SelectionType.Columns:
        selection.col0 += offsetY;
        selection.col1 += offsetY;
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
  const low = { x: Infinity, y: Infinity };
  const high = { x: -Infinity, y: -Infinity };
  for (let i = 0; i < selections.length; i++) {
    const sel = selections[i];
    if (sel.type === SelectionType.UnselectedCells) continue;

    if (typeof sel.col0 !== 'number') low.x = 0;
    else if (sel.col0 < low.x) low.x = sel.col0;
    if (typeof sel.col1 !== 'number') high.x = Infinity;
    else if (sel.col1 > high.x) high.x = sel.col1;

    if (typeof sel.row0 !== 'number') low.y = 0;
    else if (sel.row0 < low.y) low.x = sel.row0;
    if (typeof sel.row1 !== 'number') high.y = Infinity;
    else if (sel.row1 > high.y) high.y = sel.row1;
  }
  return {
    top: low.y,
    left: low.x,
    bottom: high.y,
    right: high.x,
  };
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
  getSelectionStateFromCells,
  getVerboseSelectionStateFromCells,
  areSelectionsComplex,
  getSelectedContiguousColumns,
  getSelectedContiguousRows,
  moveSelections,
  cloneSelections,
  getSelectionBounds,
};
