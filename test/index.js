'use strict';

/*jslint browser: true*/
/*globals Event: false, describe: false, afterEach: false, beforeEach: false, after: false, it: false, canvasDatagrid: false, async: false, requestAnimationFrame: false*/

import { cleanup, mouseup, click } from './util.js';

import instantationTests from './instantation.js';
import drawingTests from './drawing.js';
import styleTests from './style.js';
import dataInterfaceTests from './data-interface.js';
import touchTests from './touch.js';
import editingTests from './editing.js';
import keyNavigationTests from './key-navigation.js';
import resizeTests from './resize.js';
import formattersTests from './formatters.js';
import sortersTests from './sorters.js';
import selectionsTests from './selections.js';
import filtersTests from './filters.js';
import attributesTests from './attributes.js';
import groupsTests from './groups.js';
import publicInterfaceTests from './public-interface.js';
import contextMenuTests from './context-menu.js';
import webComponentTests from './web-component.js';
import scrollingTests from './scrolling.js';

import unitTests from './unit/index.js';

describe('canvas-datagrid', function () {
  after(function (done) {
    // git rid of lingering artifacts from the run
    mouseup(document.body, 1, 1);
    mouseup(document.body, 1, 1);
    click(document.body, 1, 1);
    done();
  });
  beforeEach(cleanup);
  afterEach(cleanup);
  describe('Integration Tests', function () {
    describe('Instantiation', instantationTests);
    describe('Web component', webComponentTests);
    describe('Drawing', drawingTests);
    describe('Styles', styleTests);
    describe('Data interface', dataInterfaceTests);
    describe('Public interface', publicInterfaceTests);
    describe('Context menu', contextMenuTests);
    describe('Scroll box with scrollPointerLock false', scrollingTests);
    describe('Touch', touchTests);
    describe('Editing', editingTests);
    describe('Key navigation', keyNavigationTests);
    describe('Resize', resizeTests);
    describe('Formatters', formattersTests);
    describe('Sorters', sortersTests);
    describe('Selections', selectionsTests);
    describe('Filters', filtersTests);
    describe('Attributes', attributesTests);
    describe('Groups', groupsTests);
  });
  describe('Unit Tests', unitTests);
});
