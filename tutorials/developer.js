/*jslint browser: true*/
/*globals canvasDatagrid: false*/
/* this file is for developing in a sandbox on a local machine */


function getData(r, c, f) {
    var data = [];
    for (var x = 0; x < r; x++) {
        data[x] = {};
        for (var y = 0; y < c; y++) {
            data[x][y] = f ? f(x, y) : x + ", " + y
        }
    }
    return data;
}

function g() {
    'use strict';
    var parentNode = document.getElementById('grid');
    var grid = document.createElement('canvas-datagrid');


    parentNode.appendChild(grid);
    var data = getData(10, 10);


    grid.style.width = '300px';
    grid.style.height = '300px';

    grid.data = data; 

    console.log(grid.getVisibleCellByIndex(0,0));

}