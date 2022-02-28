'use strict';

import {
  mergeSelections,
  normalizeSelection,
  getIntersection,
  getSelectionFromString,
  removeFromSelections,
  removePartOfRowsSelection,
  removePartOfCellsSelection,
  removePartOfColumnsSelection,
} from '../../lib/selections/util.js';

export default function () {
  const { deepStrictEqual } = chai.assert;
  it('test getIntersection', function () {
    [
      // get intersection between rows and cells block
      ['rows:10', 'cells:15,15', undefined],
      ['rows:10-15', 'cells:15,15', 'cells:15,15'],
      ['rows:10-15', 'cells:15,15-20,20', 'cells:15,15-15,20'],

      // get intersection between columns and cells block
      ['cols:10', 'cells:15,15', undefined],
      ['cols:10-15', 'cells:15,15', 'cells:15,15'],
      ['cols:10-15', 'cells:15,15-20,20', 'cells:15,15-20,15'],

      // get intersection between cells blocks
      ['cells:15,16', 'cells:15,15', undefined],
      ['cells:15,15', 'cells:15,15', 'cells:15,15'],
      ['cells:15,15-16,16', 'cells:15,15', 'cells:15,15'],
      ['cells:15,15-20,20', 'cells:14,10-14,14', undefined],
      ['cells:15,15-20,20', 'cells:14,10-15,15', 'cells:15,15'],
      ['cells:15,15-16,16', 'cells:10,10-20,20', 'cells:15,15-16,16'],

      // get intersection between rows
      ['rows:10', 'rows:11', undefined],
      ['rows:10', 'rows:11-20', undefined],
      ['rows:10', 'rows:10', 'rows:10'],
      ['rows:10', 'rows:9-10', 'rows:10'],
      ['rows:10-20', 'rows:5-10', 'rows:10'],
      ['rows:10-20', 'rows:5-20', 'rows:10-20'],
      ['rows:10-20', 'rows:5-25', 'rows:10-20'],

      // get intersection between columns
      ['cols:10', 'cols:11', undefined],
      ['cols:10', 'cols:11-20', undefined],
      ['cols:10', 'cols:10', 'cols:10'],
      ['cols:10', 'cols:9-10', 'cols:10'],
      ['cols:10-20', 'cols:5-10', 'cols:10'],
      ['cols:10-20', 'cols:5-20', 'cols:10-20'],
      ['cols:10-20', 'cols:5-25', 'cols:10-20'],

      // get intersection between rows and columns
      ['rows:10', 'cols:11', 'cell:10,11'],
      ['rows:10', 'cols:11-12', 'cell:10,11-10,12'],
      ['rows:10-11', 'cols:11-12', 'cell:10,11-11,12'],
    ].forEach(eachTest);
    function eachTest(it) {
      const msg = `getIntersection(${JSON.stringify(it[0])}, ${JSON.stringify(
        it[1],
      )}) should be ${JSON.stringify(it[2])}`;

      const a = getSelectionFromString(it[0]) || normalizeSelection(it[0]);
      const b = getSelectionFromString(it[1]) || normalizeSelection(it[1]);
      const expected =
        getSelectionFromString(it[2]) || normalizeSelection(it[2]);

      const actual = getIntersection(a, b);
      // changing the order of parameters should not affect the result
      const actual2 = getIntersection(b, a);

      deepStrictEqual(actual, expected, msg);
      deepStrictEqual(actual2, expected, msg);
    }
  });

  it('test mergeSelections', function () {
    [
      // their types are not the same
      ['rows:10', 'cells:15,15', undefined],
      ['rows:10', 'cols:10', undefined],
      ['cols:10', 'cells:0,0-999999999,999999999', undefined],

      // they are not neighbor
      ['rows:10', 'rows:12', undefined],
      ['rows:0-9999', 'rows:99999-100000', undefined],
      ['cols:10', 'cols:12', undefined],
      ['cols:0-9999', 'cols:99999-100000', undefined],
      ['cells:0,0-10,10', 'cells:15,15-20,20', undefined],
      ['cells:0,0-10,10', 'cells:0,15-10,20', undefined],

      ['cells:10,10-20,20', 'cells:5,25-10,25', undefined],

      // they are the same selection
      ['rows:10', 'rows:10', 'rows:10'],
      ['rows:10-20', 'rows:10-20', 'rows:10-20'],
      ['cols:10', 'cols:10', 'cols:10'],
      ['cols:10-20', 'cols:10-20', 'cols:10-20'],
      ['cells:10,20', 'cells:10,20', 'cells:10,20'],
      ['cells:10,20-10,25', 'cells:10,20-10,25', 'cells:10,20-10,25'],

      // rows concatenate
      ['rows:10', 'rows:11', 'rows:10-11'],
      ['rows:10-15', 'rows:13-20', 'rows:10-20'],

      // columns concatenate
      ['cols:10', 'cols:11', 'cols:10-11'],
      ['cols:10-15', 'cols:13-20', 'cols:10-20'],

      // cells blocks concatenate
      ['cells:0,0-10,10', 'cells:5,5-10,10', 'cells:0,0-10,10'],
      ['cells:0,0-10,10', 'cells:10,5-10,10', 'cells:0,0-10,10'],
      ['cells:0,0-10,10', 'cells:5,10-10,10', 'cells:0,0-10,10'],
      ['cells:0,0-10,10', 'cells:0,10-10,20', 'cells:0,0-10,20'],
    ].forEach(eachTest);
    function eachTest(it) {
      const msg = `mergeSelections(${JSON.stringify(it[0])}, ${JSON.stringify(
        it[1],
      )}) should be ${JSON.stringify(it[2])}`;

      const a = getSelectionFromString(it[0]) || normalizeSelection(it[0]);
      const b = getSelectionFromString(it[1]) || normalizeSelection(it[1]);
      const expected =
        getSelectionFromString(it[2]) || normalizeSelection(it[2]);

      const actual = mergeSelections(a, b);
      // changing the order of parameters should not affect the result
      const actual2 = mergeSelections(b, a);

      deepStrictEqual(actual, expected, msg);
      deepStrictEqual(actual2, expected, msg);
    }
  });

  it('test removeFromSelections', function () {
    // Remove the horizontal line of character "H"
    // "H" => four independent cells
    let selections = [
      'cells:10,10-12,10',
      'cells:10,12-12,12',
      'cells:11,11',
    ].map(getSelectionFromString);
    let remove = getSelectionFromString('cells:11,10-11,12');
    let changed = removeFromSelections(selections, remove);
    deepStrictEqual(changed, true);
    deepStrictEqual(selections.length, 4);
    sortSelections(selections);
    deepStrictEqual(
      selections,
      ['cell:10,10', 'cell:10,12', 'cell:12,10', 'cell:12,12'].map(
        getSelectionFromString,
      ),
    );

    // Remove the horizontal line of character "H" but the vertical lines of the "H" are whole column
    selections = ['col:10', 'col:12', 'cells:10,10-10,12'].map(
      getSelectionFromString,
    );
    remove = getSelectionFromString('cells:10,10-10,12');
    changed = removeFromSelections(selections, remove);
    deepStrictEqual(changed, true);
    deepStrictEqual(selections.length, 3);
    sortSelections(selections);
    deepStrictEqual(
      selections,
      ['-cells:10,10-10,12', 'col:10', 'col:12'].map(getSelectionFromString),
    );
  });

  /** @param {any[]} selections */
  function sortSelections(selections) {
    selections.sort((a, b) => {
      const v = compareRow(a, b);
      return v === 0 ? compareCol(a, b) : v;
    });
    function compareRow(a, b) {
      if (typeof a.row0 === 'number') {
        if (typeof b.row0 === 'number') {
          if (a.row0 === b.row0) return a.row1 - b.row1;
          return a.row0 - b.row0;
        }
        return -1;
      }
      if (typeof b.row0 === 'number') return 1;
      return 0;
    }
    function compareCol(a, b) {
      if (typeof a.col0 === 'number') {
        if (typeof b.col0 === 'number') {
          if (a.col0 === b.col0) return a.col1 - b.col1;
          return a.col0 - b.col0;
        }
        return -1;
      }
      if (typeof b.col0 === 'number') return 1;
      return 0;
    }
  }

  it('test removePartOfRowsSelection', function () {
    [
      ['rows:0-0', 'rows:10-20', undefined],
      ['rows:10-20', 'rows:0-0', undefined],
      ['rows:0-0', 'rows:0-20', []],
      ['rows:0-0', 'rows:0-0', []],
      ['rows:10-20', 'rows:0-10', ['rows:11-20']],
      ['rows:10-20', 'rows:0-19', ['rows:20-20']],
      ['rows:10-20', 'rows:0-20', []],
      ['rows:10-20', 'rows:10-20', []],
      ['rows:10-20', 'rows:11-12', ['rows:10-10', 'rows:13-20']],
      ['rows:10-20', 'rows:11-19', ['rows:10-10', 'rows:20-20']],
    ].forEach(eachTest);
    function eachTest(args) {
      const msg = `removePartOfRowsSelection(${JSON.stringify(
        args[0],
      )}, ${JSON.stringify(args[1])}) should be ${JSON.stringify(args[2])}`;

      const a = getSelectionFromString(args[0]) || normalizeSelection(args[0]);
      const b = getSelectionFromString(args[1]) || normalizeSelection(args[1]);
      const expected = args[2]
        ? args[2].map(
            (each) => getSelectionFromString(each) || normalizeSelection(each),
          )
        : undefined;

      const actual = removePartOfRowsSelection(a, b);
      deepStrictEqual(actual, expected, msg);
    }
  });

  it('test removePartOfColumnsSelection', function () {
    [
      ['cols:0-0', 'cols:10-20', undefined],
      ['cols:10-20', 'cols:0-0', undefined],
      ['cols:0-0', 'cols:0-20', []],
      ['cols:0-0', 'cols:0-0', []],
      ['cols:10-20', 'cols:0-10', ['cols:11-20']],
      ['cols:10-20', 'cols:0-19', ['cols:20-20']],
      ['cols:10-20', 'cols:0-20', []],
      ['cols:10-20', 'cols:10-20', []],
      ['cols:10-20', 'cols:11-12', ['cols:10-10', 'cols:13-20']],
      ['cols:10-20', 'cols:11-19', ['cols:10-10', 'cols:20-20']],
    ].forEach(eachTest);
    function eachTest(args) {
      const msg = `removePartOfColumnsSelection(${JSON.stringify(
        args[0],
      )}, ${JSON.stringify(args[1])}) should be ${JSON.stringify(args[2])}`;

      const a = getSelectionFromString(args[0]) || normalizeSelection(args[0]);
      const b = getSelectionFromString(args[1]) || normalizeSelection(args[1]);
      const expected = args[2]
        ? args[2].map(
            (each) => getSelectionFromString(each) || normalizeSelection(each),
          )
        : undefined;

      const actual = removePartOfColumnsSelection(a, b);
      deepStrictEqual(actual, expected, msg);
    }
  });

  it('test removePartOfCellsSelection', function () {
    [
      ['cols:0-0', 'cols:10-20', undefined],
      ['cols:10-20', 'cols:0-0', undefined],
      ['cols:0-0', 'cols:0-20', []],
      ['cols:0-0', 'cols:0-0', []],
      ['cols:10-20', 'cols:0-10', ['cols:11-20']],
      ['cols:10-20', 'cols:0-19', ['cols:20-20']],
      ['cols:10-20', 'cols:0-20', []],
      ['cols:10-20', 'cols:10-20', []],
      ['cols:10-20', 'cols:11-12', ['cols:10-10', 'cols:13-20']],
      ['cols:10-20', 'cols:11-19', ['cols:10-10', 'cols:20-20']],
    ].forEach(eachTest);
    function eachTest(args) {
      const msg = `removePartOfColumnsSelection(${JSON.stringify(
        args[0],
      )}, ${JSON.stringify(args[1])}) should be ${JSON.stringify(args[2])}`;

      const a = getSelectionFromString(args[0]) || normalizeSelection(args[0]);
      const b = getSelectionFromString(args[1]) || normalizeSelection(args[1]);
      const expected = args[2]
        ? args[2].map(
            (each) => getSelectionFromString(each) || normalizeSelection(each),
          )
        : undefined;

      const actual = removePartOfColumnsSelection(a, b);
      deepStrictEqual(actual, expected, msg);
    }
  });
}
