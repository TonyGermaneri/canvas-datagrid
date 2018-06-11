/*jslint browser: true*/
/*globals canvasDatagrid: false*/
/* this file is for developing in a sandbox on a local machine */
function g() {
    'use strict';
    var x,
        y,
        grid = canvasDatagrid({
            parentNode: document.body,
            allowFreezingColumns: true,
            allowFreezingRows: true,
            debug: false
        });
    grid.addEventListener('expandtree', function (e) {
        e.treeGrid.data = getData('');
    });
    grid.style.columnHeaderCellHeight = 40;
    grid.style.cellHeight = 40;
    grid.style.height = '100%';
    grid.style.width = '100%';
    function getData(prefix) {
        var data = [];
        for (x = 0; x < 100; x += 1) {
            data[x] = {};
            for (y = 0; y < 5; y += 1) {
                data[x][String.fromCharCode(65 + y)] = prefix + x + ':' + y;
            }
        }
        data[x - 1].A = 'EOF';
        data[x - 1][String.fromCharCode(65 + y - 1)] = 'EOF';
        return data;
    }
    grid.data = getData('');
    for (x = 0; x < 40; x += 1) {
        // grid.schema[x].width = 500 * Math.random();
        // grid.schema[x].hidden = Math.random() > 0.5;
    }

    [0, 1, 2].forEach(function (x) {
        grid.schema[x].width = 100;
        grid.schema[x].hidden = false;
    });
    grid.schema[0].width = 200;
    grid.schema[0].hidden = false;
    grid.style.height = '100%';
    grid.style.width = '100%';
    // grid.style.height = 'auto';
    // grid.style.width = 'auto';
    // setTimeout(function () {
    //     grid.scrollIntoView(20, 75, .5, .5);
    // }, 1000);
}