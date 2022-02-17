'use strict';

import { mergeHiddenRowRanges } from '../../lib/groups/util.js';

export default function () {
  const { deepStrictEqual } = chai.assert;
  it('invalid ranges can not be merged', function () {
    const ranges = [];
    deepStrictEqual(mergeHiddenRowRanges(ranges, [10, 5]), false);
    deepStrictEqual(ranges, []);
  });

  it('merge range only contains one row', function () {
    const ranges = [];
    deepStrictEqual(mergeHiddenRowRanges(ranges, [1, 1]), true);
    deepStrictEqual(ranges, [[1, 1]]);

    deepStrictEqual(mergeHiddenRowRanges(ranges, [2, 2]), true);
    deepStrictEqual(ranges, [[1, 2]]);

    deepStrictEqual(mergeHiddenRowRanges(ranges, [5, 5]), true);
    deepStrictEqual(ranges, [
      [1, 2],
      [5, 5],
    ]);

    deepStrictEqual(mergeHiddenRowRanges(ranges, [1, 5]), true);
    deepStrictEqual(ranges, [[1, 5]]);
  });

  it('merge ranges', function () {
    const ranges = [];
    deepStrictEqual(mergeHiddenRowRanges(ranges, [5, 10]), true);
    deepStrictEqual(ranges, [[5, 10]]);

    deepStrictEqual(mergeHiddenRowRanges(ranges, [5, 11]), true);
    deepStrictEqual(ranges, [[5, 11]]);

    deepStrictEqual(mergeHiddenRowRanges(ranges, [12, 15]), true);
    deepStrictEqual(ranges, [[5, 15]]);
  });

  it('merge independent intervals', function () {
    const ranges = [[5, 15]];
    deepStrictEqual(mergeHiddenRowRanges(ranges, [20, 30]), true);
    deepStrictEqual(ranges, [
      [5, 15],
      [20, 30],
    ]);

    deepStrictEqual(mergeHiddenRowRanges(ranges, [1, 3]), true);
    deepStrictEqual(ranges, [
      [1, 3],
      [5, 15],
      [20, 30],
    ]);
  });

  it('new range spans two existed ranges', function () {
    let ranges = [
      [1, 3],
      [5, 15],
      [20, 30],
    ];
    deepStrictEqual(mergeHiddenRowRanges(ranges, [7, 25]), true);
    deepStrictEqual(ranges, [
      [1, 3],
      [5, 30],
    ]);

    ranges = [
      [1, 3],
      [5, 15],
      [20, 30],
    ];
    deepStrictEqual(mergeHiddenRowRanges(ranges, [7, 35]), true);
    deepStrictEqual(ranges, [
      [1, 3],
      [5, 35],
    ]);
  });

  it('new range wraps all existed ranges', function () {
    const ranges = [
      [1, 3],
      [5, 15],
      [20, 30],
    ];
    deepStrictEqual(mergeHiddenRowRanges(ranges, [1, 50]), true);
    deepStrictEqual(ranges, [[1, 50]]);
  });
}
