/*jslint browser: true */
require(['../dist/canvas-datagrid.debug.js'], function (dataGrid) {
    'use strict';
    var grid = dataGrid({
        parentNode: document.body
    });
    grid.data = [{a: 0, b: 1, c: 2}];
});
