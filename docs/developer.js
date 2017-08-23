/*jslint browser: true*/
/*globals canvasDatagrid: false*/
/* this file is for developing in a sandbox on a local machine */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    var grid = canvasDatagrid({
        parentNode: document.body,
        columnHeaderClickBehavior: 'select',
        tree: true
    });
    // grid.data = [
    //     {a: 'a', b: [{c: 'd'}]},
    //     {a: 'a', b: [{c: [
    //         {a: 'a', b: [{c: 'd'}]},
    //         {a: 'a', b: [{c: 'd'}]},
    //     ]}]},
    // ];
    grid.data = [
        {'a': 0, 'b': 1, 'c': 2},
        {'a': 4, 'b': {'a': 0, 'b': 1, 'c': 2}, 'c': 6},
        {'a': 7, 'b': 8, 'c': 9}
    ];
    grid.addEventListener('expandtree', function (e) {
        e.treeGrid.data = [
            {'a': 0, 'b': 1, 'c': 2},
            {'a': 4, 'b': {'a': 0, 'b': 1, 'c': 2}, 'c': 6},
            {'a': 7, 'b': 8, 'c': 9}
        ];
    });

});