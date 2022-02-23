'use strict';

/**
 * Merge a new hidden row range into existed ranges array
 * @param {any[]} hiddenRowRanges tuples: Array<[bgeinRowIndex, endRowIndex]>
 * @param {number[]} newRange tuple: [beginRowIndex, endRowIndex]
 * @returns {boolean}
 */
const mergeHiddenRowRanges = function (hiddenRowRanges, newRange) {
  const [beginRowIndex, endRowIndex] = newRange;
  if (endRowIndex < beginRowIndex) return false;
  let inserted = false;
  for (let i = 0; i < hiddenRowRanges.length; i++) {
    const range = hiddenRowRanges[i];
    if (beginRowIndex > range[1] + 1) continue;
    if (beginRowIndex <= range[0] && endRowIndex >= range[0]) {
      hiddenRowRanges[i] = [beginRowIndex, Math.max(endRowIndex, range[1])];
      inserted = true;
      break;
    }
    if (beginRowIndex >= range[0]) {
      hiddenRowRanges[i] = [range[0], Math.max(endRowIndex, range[1])];
      inserted = true;
      break;
    }
  }
  if (!inserted) hiddenRowRanges.push([beginRowIndex, endRowIndex]);
  // merge intersections after sorting ranges
  hiddenRowRanges.sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < hiddenRowRanges.length - 1; i++) {
    const range = hiddenRowRanges[i];
    const nextRange = hiddenRowRanges[i + 1];
    if (nextRange[0] <= range[1] + 1) {
      hiddenRowRanges[i] = [range[0], Math.max(range[1], nextRange[1])];
      hiddenRowRanges.splice(i + 1, 1);
      i--;
    }
  }
  return true;
};

export { mergeHiddenRowRanges };
