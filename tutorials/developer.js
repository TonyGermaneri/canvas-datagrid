/*jslint browser: true*/
/*globals canvasDatagrid: false*/
/* this file is for developing in a sandbox on a local machine */
function g() {
    'use strict';
    var parentNode = document.getElementById('grid');
    var grid = document.createElement('canvas-datagrid');
    parentNode.appendChild(grid);
    grid.data = [
        {col1: 'foo', col2: 0, col3: 'a'},
        {col1: 'bar', col2: 1, col3: 'b'},
        {col1: 'baz', col2: 2, col3: 'c'}
    ];
    grid.columnOrder = [2, 1, 0];
    grid.addEventListener('reorder', function () {
        grid.columnOrder = [1, 2, 0];
    });
}