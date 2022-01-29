'use strict';

import parseClipboardData from './parse-clip-board-data.js';
import mergeHiddenRowRanges from './merge-hidden-row-ranges.js';

export default function () {
  describe('clipboard', parseClipboardData);
  describe('mergeHiddenRowRanges', mergeHiddenRowRanges);
}
