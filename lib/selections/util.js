'use strict';

// Types of Selection
// 0. Subtract cells from [row0, col0] to [row1, col1]
// 1. Add cells from [row0, col0] to [row1, col1]
// 2. Add rows from row0 to row1
// 3. Add columns from col0 to col1

const SelectionType = {
  SubtractCells: 0,
  Cells: 1,
  Rows: 2,
  Columns: 3,
};

const normalizeSelection = (sel) => {
  switch (sel.type) {
    case SelectionType.SubtractCells:
    case SelectionType.Cells:
      if (!sel.row1) sel.row1 = sel.row0;
      if (!sel.col1) sel.col1 = sel.col0;
      break;
    case SelectionType.Rows:
      if (!sel.row1) sel.row1 = sel.row0;
      break;
    case SelectionType.Columns:
      if (!sel.col1) sel.col1 = sel.col0;
      break;
  }
  return sel;
};

const getIntersection = (a, b) => {
  if (a.type > b.type) return getIntersection(b, a);
  if (a.type <= SelectionType.Cells) {
    if (b.type <= SelectionType.Cells) {
      const col0 = Math.max(a.col0, b.col0);
      const col1 = Math.min(a.col1, b.col1);
      if (col0 > col1) return;

      const row0 = Math.max(a.row0, b.row0);
      const row1 = Math.min(a.row1, b.row1);
      if (row0 > row1) return;

      return { type: SelectionType.Cells, row0, col0, row1, col1 };
    }
    if (b.type === SelectionType.Rows) {
      const row0 = Math.max(a.row0, b.row0);
      const row1 = Math.min(a.row1, b.row1);
      if (row0 > row1) return;
      return {
        type: SelectionType.Cells,
        row0,
        col0: a.col0,
        row1,
        col1: a.col1,
      };
    } else {
      // SelectionType.Columns
      const col0 = Math.max(a.col0, b.col0);
      const col1 = Math.min(a.col1, b.col1);
      if (col0 > col1) return;
      return {
        type: SelectionType.Columns,
        col0,
        row0: a.row0,
        col1,
        row1: a.row1,
      };
    }
  }
  if (a.type === SelectionType.Rows) {
    if (b.type === SelectionType.Rows) {
      const row0 = Math.max(a.row0, b.row0);
      const row1 = Math.min(a.row1, b.row1);
      if (row0 > row1) return;
      return { type: SelectionType.Rows, row0, row1 };
    } else {
      // SelectionType.Columns
      return {
        type: SelectionType.Cells,
        row0: a.row0,
        col0: b.col0,
        row1: a.row1,
        col1: b.col1,
      };
    }
  }
  // SelectionType.Columns
  const col0 = Math.max(a.col0, b.col0);
  const col1 = Math.min(a.col1, b.col1);
  if (col0 > col1) return;
  return { type: SelectionType.Columns, col0, col1 };
};

/**
 * Add(Merge) a selection area into a selections array.
 * @param {array} selections
 * @returns {boolean} are selections changed
 */
const addToSelections = function (selections, add) {
  if (!add || typeof add.type !== 'number') return false;
  switch (add.type) {
    case SelectionType.SubtractCells:
      if (selections.length === 0) return false;
      selections.unshift(add);
      return true;
  }
};

const subtractFromSelections = function (selections, subtract) {
  // wip
};

const isRowSelected = function (selections, rowIndex) {
  // wip
};

const isColumnSelected = function (selections, columnIndex) {
  // wip
};

const isCellSelected = function (selection, rowIndex, columnIndex) {
  // wip
};

export {
  SelectionType,
  addToSelections,
  subtractFromSelections,
  getIntersection,
};
