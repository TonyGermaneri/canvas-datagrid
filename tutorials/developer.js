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
            debug: false
        });
    grid.style.columnHeaderCellHeight = 40;
    grid.style.cellHeight = 40;
    grid.style.height = '100%';
    grid.style.width = '100%';
    for (x = 0; x < 400; x += 1) {
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