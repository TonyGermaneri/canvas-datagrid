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
    var parentNode = document.body;
    var grid = canvasDatagrid();
    grid.attributes.tree = true;
    grid.addEventListener('expandtree', function (e) {
        e.treeGrid.data = getData(10,10);
    });
    grid.attributes.debug = true;

    parentNode.appendChild(grid);
    var data = getData(10, 10);


    grid.style.width = '100%';
    grid.style.height = '100%';

    grid.data = data; 

    grid.style.overflowY = 'scroll';
    grid.style.overflowX = 'scroll';


}