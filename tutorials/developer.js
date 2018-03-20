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
            debug: false,
            selectionMode: 'row',
            showColumnHeaders: false,
            showRowHeaders: false
        });
    grid.style.marginTop = '20px';
    grid.style.marginLeft = '20px';
    grid.style.columnHeaderCellHeight = 50;
    grid.style.rowHeaderCellWidth = 50;
    grid.style.cellHeight = 50;
    grid.style.cellWidth = 500;
    grid.style.height = '300px';
    grid.style.width = '1000px';
    for (x = 0; x < 600; x += 1) {
        data[x] = {};
        for (y = 0; y < 4; y += 1) {
            data[x][String.fromCharCode(65 + y)] = '';
        }
    }
    data[x - 1].A = 'EOF';
    data[x - 1][String.fromCharCode(65 + y - 1)] = 'EOF';
    grid.data = data;
    // setTimeout(function () {
    //     grid.setActiveCell(17, 100);
    //     grid.gotoCell(17, 100, 0.5, 0.5);
    // }, 1000);
}