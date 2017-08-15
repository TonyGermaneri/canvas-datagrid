/*jslint browser: true*/
/*globals describe: false, afterEach: false, after: false, it: false, canvasDatagrid: false, async: false*/
(function () {
    'use strict';
    var c = {
            fu: 'rgb(255, 0, 255)',
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
        var x;
        for (x = 2; x < arguments.length; x += 1) {
            msg = msg.replace(/%s|%n/, arguments[x]);
        }
        if (cond) { return new Error(msg); }
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
            grid.assertPxColor(100, 32, c.white, done);
        });
        it('Should set the cell color to black.', function (done) {
            var grid = g({
                data: smallData
            });
            grid.style.activeCellBackgroundColor = c.black;
            grid.style.activeCellBackgroundColor = c.black;
            grid.assertPxColor(100, 32, c.black, done);
        });
        it('Each style setter should call draw 1 time.', function (done) {
            var grid = g({
                    data: smallData
                }),
                styleKeys = Object.keys(grid.style),
                eventCount = -1;
            grid.addEventListener('beforedraw', function () {
                eventCount += 1;
            });
            async.eachSeries(styleKeys, function (s, cb) {
                grid.style[s] = grid.style[s];
                setTimeout(cb, 1);
            }, function () {
                done(assertIf(eventCount !== styleKeys.length,
                    'Wrong number of draw invocations on style setters.  Expected %n got %n.', styleKeys.length, eventCount));
            });
        });
        it('Should set the cell color to black.', function (done) {
            var grid = g({
                data: smallData
            });
            grid.style.activeCellBackgroundColor = c.black;
            grid.style.activeCellBackgroundColor = c.black;
            grid.assertPxColor(100, 32, c.black, done);
        });
    });
}());
