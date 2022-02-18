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

const swapProps = (obj, prop0, prop1) => {
  const t = obj[prop0];
  obj[prop0] = obj[prop1];
  obj[prop1] = t;
};
const normalizeSelection = (sel) => {
  if (!sel) return sel;
  switch (sel.type) {
    case SelectionType.SubtractCells:
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
        type: SelectionType.Cells,
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

const isSameCellsBlock = (block0, block1) => {
  return (
    block0.row0 === block1.row0 &&
    block0.row1 === block1.row1 &&
    block0.col0 === block1.col0 &&
    block0.col1 === block1.col1
  );
};

const concatCellsBlocks = (block0, block1) => {
  const horizontalConcat =
    block0.row0 === block1.row0 && block0.row1 === block1.row1;
  const verticalConcat =
    block0.col0 === block1.col0 && block0.col1 === block1.col1;

  // is same block
  if (horizontalConcat) {
    if (verticalConcat) return block0;
    if (block1.col0 > block0.col1 || block1.col1 < block0.col0) return;
    return Object.assign({}, block0, {
      col0: Math.min(block0.col0, block1.col0),
      col1: Math.min(block0.col1, block1.col1),
    });
  }
  if (block1.row0 > block0.row1 || block1.row1 < block0.row0) return;
  return Object.assign({}, block0, {
    row0: Math.min(block0.row0, block1.row0),
    row1: Math.min(block0.row1, block1.row1),
  });
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
        type: SelectionType.Cells,
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
 * Toggle a selection. The behaviours of this method in here:
 * - Select this cell if the value of the parameter `toggle` only containing a unselected cell
 * - Unselect this cell if the value of the parameter `toggle` only containing a selected cell
 * - Select these cells if the value of the parameter `toggle` containing a cells block
 * - Select these rows/columns if the value of the parameter `toggle` containing rows/columns
 *
 * @param {array} selections
 * @param {object} toggle
 * @param {object} [context] Eg: {rows:1000, cols:1000}
 * @returns {boolean} are selections changed
 */
const toggleSelection = function (selections, toggle, context) {
  if (!toggle || typeof toggle.type !== 'number') return false;
  switch (toggle.type) {
    case SelectionType.SubtractCells:
      if (selections.length === 0) return false;
      for (let i = 0; i < selections.length; i++) {
        const sel = selections[i];
        if (sel.type === SelectionType.Cells && isSameCellsBlock(toggle, sel)) {
          selections.splice(i, 1);
          return true;
        }
        if (
          sel.type === SelectionType.SubtractCells &&
          isSameCellsBlock(toggle, sel)
        )
          return false;
      }
      selections.unshift(toggle);
      return true;
    case SelectionType.Cells:
      for (let i = 0; i < selections.length; i++) {
        const sel = selections[i];
        if (sel.type === SelectionType.Cells && isSameCellsBlock(toggle, sel)) {
          selections.splice(i, 1);
          return true;
        }
        if (
          sel.type === SelectionType.SubtractCells &&
          isSameCellsBlock(toggle, sel)
        )
          return false;
      }
      selections.push(toggle);
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
  getSelectionFromString,
  normalizeSelection,
  toggleSelection,
  subtractFromSelections,
  getIntersection,
};
