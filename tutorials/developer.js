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
            debug: true
        });
    grid.style.height = '100%';
    grid.style.width = '100%';
    for (x = 0; x < 1000; x += 1) {
        data[x] = {};
        for (y = 0; y < 6; y += 1) {
            data[x][String.fromCharCode(65 + y)] = '';
        }
    }
    grid.data = data;
}