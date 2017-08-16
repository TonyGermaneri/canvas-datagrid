/*jslint browser: true*/
/*globals describe: false, afterEach: false, after: false, it: false, canvasDatagrid: false, async: false*/
(function () {
    'use strict';
    var c = {
            y: 'rgb(255, 255, 0)',
            fu: 'rgb(255, 0, 255)',
            white: 'rgb(255, 255, 255)',
            black: 'rgb(0, 0, 0)'
        },
        smallData = [
            {col1: 'foo', col2: 0, col3: 'a'},
            {col1: 'bar', col2: 1, col3: 'b'},
            {col1: 'baz', col2: 2, col3: 'c'}
        ];
    function de(el, event, args) {
        var e = new Event(event);
        Object.keys(args).forEach(function (key) {
            e[key] = args[key];
        });
        el.dispatchEvent(e);
    }
    function keydown(el, keyCode, args) {
        args = args || {};
        args.keyCode = keyCode;
        de(el, 'keydown', args);
    }
    function click(el, x, y) {
        var p = el.getBoundingClientRect();
        de(el, 'click', {clientX: x + p.left, clientY: y + p.top });
    }
    function g(args) {
        var grid,
            i = document.getElementById('grid'),
            a = document.createElement('div'),
            t = document.createElement('div'),
            d = document.createElement('div');
        a.className = 'test-container';
        d.className = 'grid-container';
        t.className = 'grid-test-title';
        t.innerHTML = args.test.title;
        setTimeout(function () {
            if (args.test.state === 'failed') {
                t.classList.add('grid-test-failed');
            } else if (args.test.state === 'passed') {
                t.classList.add('grid-test-passed');
            }
            grid.draw();
        }, 2000);
        delete args.testTitle;
        a.appendChild(t);
        a.appendChild(d);
        i.insertBefore(a, i.firstChild);
        args = args || {};
        args.parentNode = d;
        grid = canvasDatagrid(args);
        return grid;
    }
    function assertIf(cond, msg) {
        var x;
        for (x = 2; x < arguments.length; x += 1) {
            msg = msg.replace(/%s|%n/, arguments[x]);
        }
        if (cond) { return new Error(msg); }
    }
    describe('canvas-datagrid', function () {
        describe('Integration Tests', function () {
            describe('Instantiation', function () {
                it('Should create an instance of datagrid', function (done) {
                    var grid = g({test: this.test});
                    assertIf(!grid, 'Expected a grid instance, instead got something false');
                    grid.style.backgroundColor = c.y;
                    grid.assertPxColor(80, 32, c.y, done);
                });
                it('Should create, then completely annihilate the grid.', function (done) {
                    var grid = g({test: this.test});
                    grid.dispose();
                    done(assertIf(!grid.parentNode,
                        'Expected to see the grid gone, it is not.'));
                });
                it('Should create a grid and set data, data should be visible.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    grid.style.activeCellBackgroundColor = c.white;
                    assertIf(grid.data.length !== 3,
                        'Expected to see data in the interface.');
                    grid.assertPxColor(80, 32, c.white, done);
                });
            });
            describe('Styles', function () {
                it('Should set the active cell color to black.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    grid.style.activeCellBackgroundColor = c.black;
                    grid.assertPxColor(100, 32, c.black, done);
                });
                it('Each style setter should call draw 1 time.', function (done) {
                    var grid = g({
                            test: this.test,
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
            });
            describe('Formatters', function () {
                it('Should format values using formating functions', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: ''}],
                        schema: [{name: 'd', type: 's'}]
                    });
                    grid.formatters.s = function () {
                        return '██████████████████';
                    };
                    grid.assertPxColor(90, 32, c.black, done);
                });
            });
            describe('Attributes', function () {
                it('Should store JSON view state data when a name is passed and view state is altered.', function (done) {
                    var n = 'a' + (new Date().getTime()),
                        k = 'canvasDataGrid-' + n,
                        grid = g({
                            test: this.test,
                            data: smallData,
                            name: n
                        });
                    grid.order('col1');
                    assertIf(!JSON.parse(localStorage.getItem(k)),
                        'Expected storage item %s.', n);
                    localStorage.removeItem(k);
                    done();
                });
                it('Should produce clickable tree arrows and allow for opening trees when clicked, should invoke expandtree event handler.  Handler event should contain a new grid.', function (done) {
                    var grid = g({
                        test: this.test,
                        tree: true,
                        data: smallData
                    });
                    grid.addEventListener('expandtree', function (e) {
                        assertIf(e.treeGrid === undefined, 'Expected a grid here.');
                        e.treeGrid.style.cornerCellBackgroundColor = c.y;
                        grid.assertPxColor(10, 34, c.fu, function () {
                            grid.assertPxColor(60, 60, c.y, done);
                        });
                    });
                    grid.style.treeArrowColor = c.fu;
                    click(grid.canvas, 7, 37);
                });
                it('Should display a new row', function (done) {
                    var grid = g({
                        test: this.test,
                        showNewRow: true,
                        data: [{a: 'a'}]
                    });
                    grid.style.cellBackgroundColor = c.y;
                    assertIf(grid.data.length !== 1, 'Expected there to be exactly 1 row.');
                    grid.assertPxColor(40, 60, c.y, done);
                });
                //TODO: treeHorizontalScroll
                //TODO: saveAppearance
                it('Selection should follow active cell with selectionFollowsActiveCell true', function (done) {
                    var grid = g({
                        test: this.test,
                        selectionFollowsActiveCell: true,
                        data: [{a: 'a'}, {a: 'b'}]
                    });
                    grid.style.cellSelectedBackgroundColor = c.y;
                    grid.focus();
                    // select cell 0:0
                    click(grid.canvas, 60, 37);
                    keydown(grid.controlInput, 40);
                    done(assertIf(grid.selectedRows[1].a !== 'b', 'Expected selection to follow active cell'));
                });
                it('Selection should NOT follow active cell with selectionFollowsActiveCell false', function (done) {
                    var grid = g({
                        test: this.test,
                        selectionFollowsActiveCell: false,
                        data: [{a: 'a'}, {a: 'b'}]
                    });
                    grid.style.cellSelectedBackgroundColor = c.y;
                    grid.focus();
                    // select cell 0:0
                    click(grid.canvas, 60, 37);
                    keydown(grid.controlInput, 40);
                    done(assertIf(grid.selectedRows.length === 0, 'Expected selection to not follow active cell'));
                });
            });
        });
    });
}());
