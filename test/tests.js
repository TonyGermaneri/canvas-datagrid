/*jslint browser: true*/
/*globals describe: false, afterEach: false, after: false, it: false, canvasDatagrid: false*/
(function () {
    'use strict';
    var c = {
            white: 'rgb(255, 255, 255)',
            black: 'rgb(0, 0, 0)'
        },
        smallData = [
            {col1: 'foo', col2: 0, col3: 'a'},
            {col1: 'bar', col2: 1, col3: 'b'},
            {col1: 'baz', col2: 2, col3: 'c'}
        ];
    function g(args) {
        var i = document.getElementById('grid'), d = document.createElement('div');
        i.insertBefore(d, i.firstChild);
        args = args || {};
        args.parentNode = d;
        return canvasDatagrid(args);
    }
    function assertIf(cond, msg) {
        if (cond) { throw new Error(msg); }
    }
    describe('canvas-datagrid: integration tests', function () {
        it('Should create an instance of datagrid', function (done) {
            var grid = g();
            assertIf(!grid, 'Expected a grid instance, instead got something false');
            grid.dispose();
            done();
        });
        it('Should create, then completely annihilate the grid.', function (done) {
            var grid = g();
            grid.dispose();
            assertIf(!grid.parentNode,
                'Expected to see the grid gone, it is not.');
            done();
        });
        it('Should create a grid and set data, data should be visible.', function (done) {
            var grid = g({
                data: smallData
            });
            assertIf(grid.data.length !== 3,
                'Expected to see data in the interface.');
            grid.assertPxColor(100, 37, c.white, done);
        });
        it('Should set the cell color to black.', function (done) {
            var grid = g({
                data: smallData
            });
            grid.style.activeCellBackgroundColor = c.black;
            grid.assertPxColor(100, 37, c.black, done);
        });
    });
}());