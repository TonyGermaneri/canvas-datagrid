/*jslint browser: true*/
/*globals canvasDatagrid: false*/
/* this file is for developing in a sandbox on a local machine */
function g() {
    'use strict';
    var x,
        y,
        data = [],
        grid = canvasDatagrid({
            parentNode: document.body,
            allowFreezingColumns: true,
            debug: false
        });
    grid.style.columnHeaderCellHeight = 40;
    grid.style.cellHeight = 40;
    grid.style.height = '100%';
    grid.style.width = '100%';
    for (x = 0; x < 1000; x += 1) {
        data[x] = {};
        for (y = 0; y < 100; y += 1) {
            data[x][String.fromCharCode(65 + y)] = '';
        }
    }
    data[x - 1].A = 'EOF';
    data[x - 1][String.fromCharCode(65 + y - 1)] = 'EOF';
    grid.data = data;
    grid.style.height = '100%';
    grid.style.width = '100%';
    // grid.style.height = 'auto';
    // grid.style.width = 'auto';
}