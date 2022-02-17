/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false, Event: false*/
'use strict';

export default function (self) {
  /**
   * This is an array that stores the different selection descriptors.
   * Common properties:
   * - row0
   * - row1
   * - col0
   * - col1
   */
  self.selections = [];
}
