/*jslint browser: true*/
/*globals describe: false, it: false, canvasDatagrid: false*/
(function () {
    'use strict';
    var grid,
        c = {
            '225,225,225,255': 'white',
            '0,0,0,255': 'black'
        };
    function getPx(x, y) {
        var d = grid.ctx.getImageData(x, y, 1, 1).data;
        d = d['0'] + d['1'] + d['2'] + d['3'];
        return c[d] || d;
    }
    function assertIf(cond, msg) {
        if (cond) { throw new Error(msg); }
    }
    describe('canvas-datagrid', function () {
        it('Should create an instance of datagrid', function (done) {
            grid = canvasDatagrid({
                parentNode: document.getElementById('grid')
            });
            assertIf(!grid, 'Expected a grid instance, instead got something false');
            done();
        });
        it('Should completely annihilate the grid.', function (done) {
            grid.dispose();
            assertIf(document.getElementById('grid').firstChild,
                'Expected to see the grid gone, it is not.');
            done();
        });
        it('Should create a grid and set data, data should be visible.', function (done) {
            grid = canvasDatagrid({
                parentNode: document.getElementById('grid'),
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            assertIf(grid.data.length !== 3,
                'Expected to see data in the interface.');
            // assertIf(getPx(40, 40) !== 'white',
            //     'Expected to see cells when data is set.');
            done();
        });
    });
}());