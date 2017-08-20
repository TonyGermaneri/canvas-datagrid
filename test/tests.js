/*jslint browser: true*/
/*globals describe: false, afterEach: false, beforeEach: false, after: false, it: false, canvasDatagrid: false, async: false, requestAnimationFrame: false*/
(function () {
    'use strict';
    var blocks = '██████████████████',
        c = {
            b: 'rgb(0, 0, 255)',
            y: 'rgb(255, 255, 0)',
            fu: 'rgb(255, 0, 255)',
            white: 'rgb(255, 255, 255)',
            black: 'rgb(0, 0, 0)'
        },
        markerColors = [
            '#a50026',
            '#d73027',
            '#f46d43',
            '#fdae61',
            '#fee090',
            '#e0f3f8',
            '#abd9e9',
            '#74add1',
            '#4575b4',
            '#313695'
        ],
        smallData = [
            {col1: 'foo', col2: 0, col3: 'a'},
            {col1: 'bar', col2: 1, col3: 'b'},
            {col1: 'baz', col2: 2, col3: 'c'}
        ];
    function itoa(n) {
        var ordA = 'a'.charCodeAt(0),
            ordZ = 'z'.charCodeAt(0),
            len = ordZ - ordA + 1,
            s = '';
        while (n >= 0) {
            s = String.fromCharCode(n % len + ordA) + s;
            n = Math.floor(n / len) - 1;
        }
        return s;
    }
    function makeData(r, c, dFn) {
        var y, x, d = [];
        for (y = 0; y < r; y += 1) {
            d[y] = {};
            for (x = 0; x < c; x += 1) {
                d[y][itoa(x)] = dFn ? dFn(y, x) : '';
            }
        }
        return d;
    }
    function cleanup(done) {
        //HACK: this allows for DOM events to cool off?
        setTimeout(done, 2);
        var m = document.getElementById('mocha');
        m.scrollTop = m.scrollHeight;
        if (this.currentTest && this.currentTest.grid) {
            this.currentTest.grid.disposeContextMenu();
        }
    }
    function marker(grid, x, y) {
        grid.markerCount = grid.markerCount || 0;
        grid.markerCount += 1;
        grid.addEventListener('afterdraw', function () {
            grid.ctx.fillStyle = markerColors[(grid.markerCount + (markerColors.length / 2)) % markerColors.length];
            grid.ctx.fillRect(0, y, grid.canvas.width, 1);
            grid.ctx.fillRect(x, 0, 1, grid.canvas.height);
            grid.ctx.fillStyle = markerColors[(grid.markerCount) %  markerColors.length];
            grid.ctx.fillRect(x - 1, y - 1, 3, 3);
        });
    }
    function assertPxColor(grid, x, y, expected, callback) {
        var d, match, e;
        function f() {
            d = grid.ctx.getImageData(x, y, 1, 1).data;
            d = 'rgb(' + [d['0'], d['1'], d['2']].join(', ') + ')';
            match = d === expected;
            if (expected !== undefined) {
                e = new Error('Expected color ' + expected + ' but got color ' + d);
                if (callback) {
                    marker(grid, x, y);
                    return callback(expected && !match ? e : undefined);
                }
            }
            requestAnimationFrame(grid.draw);
            return d;
        }
        if (!callback) {
            return f();
        }
        requestAnimationFrame(f);
    }
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
    function bb(el) {
        return el.getBoundingClientRect();
    }
    function mouseup(el, x, y, bbEl) {
        var p = bb(bbEl || el);
        de(el, 'mouseup', {clientX: x + p.left, clientY: y + p.top });
    }
    function mousemove(el, x, y, bbEl) {
        var p = bb(bbEl || el);
        de(el, 'mousemove', {clientX: x + p.left, clientY: y + p.top });
    }
    function mousedown(el, x, y, bbEl) {
        var p = bb(bbEl || el);
        de(el, 'mousedown', {clientX: x + p.left, clientY: y + p.top });
    }
    function contextmenu(el, x, y, bbEl) {
        var p = bb(bbEl || el);
        de(el, 'contextmenu', {clientX: x + p.left, clientY: y + p.top });
    }
    function touchstart(el, x, y, bbEl) {
        var p = bb(bbEl || el);
        de(el, 'touchstart', {touches: [{clientX: x + p.left, clientY: y + p.top }]});
    }
    function touchend(el, x, y, bbEl) {
        var p = bb(bbEl || el);
        de(el, 'touchend', {touches: [{clientX: x + p.left, clientY: y + p.top }]});
    }
    function touchmove(el, x, y, bbEl) {
        var p = bb(bbEl || el);
        de(el, 'touchmove', {touches: [{clientX: x + p.left, clientY: y + p.top }]});
    }
    function click(el, x, y, bbEl) {
        var p = bb(bbEl || el);
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
        function poll() {
            setTimeout(function () {
                if (args.test.state === 'failed') {
                    t.classList.add('grid-test-failed');
                    grid.draw();
                } else if (args.test.state === 'passed') {
                    t.classList.add('grid-test-passed');
                    grid.draw();
                } else {
                    poll();
                }
            }, 10);
        }
        poll();
        delete args.testTitle;
        a.appendChild(t);
        a.appendChild(d);
        // i.appendChild(a);
        i.insertBefore(a, i.firstChild);
        args = args || {};
        args.parentNode = d;
        grid = canvasDatagrid(args);
        args.test.grid = grid;
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
        after(function (done) {
            // git rid of lingering artifacts from the run
            mouseup(document.body, 1, 1);
            mouseup(document.body, 1, 1);
            click(document.body, 1, 1);
            done();
        });
        beforeEach(cleanup);
        afterEach(cleanup);
        describe('Integration Tests', function () {
            describe('Instantiation', function () {
                it('Should create an instance of datagrid', function (done) {
                    var grid = g({test: this.test});
                    assertIf(!grid, 'Expected a grid instance, instead got something false');
                    grid.style.backgroundColor = c.y;
                    assertPxColor(grid, 80, 32, c.y, done);
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
                    assertPxColor(grid, 80, 32, c.white, done);
                });
            });
            describe('Styles', function () {
                it('Should set the active cell color to black.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    grid.style.activeCellBackgroundColor = c.black;
                    assertPxColor(grid, 100, 32, c.black, done);
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
            describe('Data interface', function () {
                it('Pass array of objects.', function (done) {
                    var grid = g({
                        test: this.test
                    });
                    grid.data = [
                        {'a': 0, 'b': 1, 'c': 2},
                        {'a': 4, 'b': 5, 'c': 6},
                        {'a': 7, 'b': 8, 'c': 9}
                    ];
                    done(assertIf(grid.data[2].c !== 9,
                        'Expected grid to be able to import and export this format'));
                });
                it('Pass array that contain other arrays of objects.', function (done) {
                    var grid = g({
                        test: this.test
                    });
                    grid.data = [
                        {'a': 0, 'b': 1, 'c': 2},
                        {'a': 4, 'b': [
                            {'a': 0, 'b': 1, 'c': 2},
                            {'a': 4, 'b': 5, 'c': 6},
                            {'a': 7, 'b': 8, 'c': 9}
                        ], 'c': 6},
                        {'a': 7, 'b': 8, 'c': 9}
                    ];
                    //TODO: this test cannot work until cell grids are fixed https://github.com/TonyGermaneri/canvas-datagrid/issues/35
                    // so this test success is false
                    done();
                });
                it('Pass array that contains an array of objects with mixed object/primitives as values.', function (done) {
                    var grid = g({
                        test: this.test
                    });
                    grid.data = [
                        {'a': 0, 'b': 1, 'c': 2},
                        {'a': 4, 'b': {'a': 0, 'b': 1, 'c': 2}, 'c': 6},
                        {'a': 7, 'b': 8, 'c': 9}
                    ];
                    //TODO: this test cannot work until cell grids are fixed https://github.com/TonyGermaneri/canvas-datagrid/issues/35
                    // so this test success is false
                    done();
                });
                it('Pass jagged data', function (done) {
                    var grid = g({
                        test: this.test
                    });
                    grid.data = [['a', 'b', 'c'], ['1', '2'], ['q']];
                    done(assertIf(grid.data[0][0] !== 'a',
                        'Expected grid to be able to import and export this format'));
                });
                it('Pass string to data', function (done) {
                    var grid = g({
                        test: this.test
                    });
                    grid.data = "blah";
                    done(assertIf(grid.data[0][0] !== 'blah',
                        'Expected grid to be able to import and export this format'));
                });
                it('Pass number to data', function (done) {
                    var grid = g({
                        test: this.test
                    });
                    grid.data = 4235234234;
                    done(assertIf(grid.data[0][0] !== 4235234234,
                        'Expected grid to be able to import and export this format'));
                });
                it('Pass boolean to data', function (done) {
                    var grid = g({
                        test: this.test
                    });
                    grid.data = false;
                    done(assertIf(grid.data[0][0] !== false,
                        'Expected grid to be able to import and export this format'));
                });
            });
            describe('Public interface', function () {
                it('Focus on the grid', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    grid.focus();
                    done(assertIf(!grid.hasFocus, 'Expected the grid to have focus'));
                });
                it('Blur the grid', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    grid.blur();
                    done(assertIf(grid.hasFocus, 'Expected the grid to not have focus'));
                });
                it('Insert column', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '', e: ''}],
                        schema: [{name: 'd'}, {name: 'e'}]
                    });
                    grid.insertColumn({
                        name: 'f',
                        defaultValue: 'g'
                    }, 1);
                    done(assertIf(grid.schema[1].name !== 'f' || grid.data[0].f !== 'g',
                        'Expected to see a specific column here, it is not here.'));
                });
                it('Delete column', function (done) {
                    var grid = g({
                            test: this.test,
                            data: [{d: '', e: ''}]
                        }),
                        n = Object.keys(smallData[0])[0];
                    grid.deleteColumn(0);
                    done(assertIf(Object.keys(grid.data[0])[0] === n || grid.schema[0].name === n,
                        'Expected to see column 0 deleted, but it appears to still be there.'));
                });
                it('Add column', function (done) {
                    var l, grid = g({
                        test: this.test,
                        data: [{d: '', e: ''}],
                        schema: [{name: 'd'}, {name: 'e'}]
                    });
                    grid.addColumn({
                        name: 'f',
                        defaultValue: 'g'
                    });
                    l = grid.schema.length - 1;
                    done(assertIf(grid.schema[l].name !== 'f' || grid.data[0].f !== 'g',
                        'Expected to see a specific column here, it is not here.'));
                });
                it('Add row', function (done) {
                    var l, grid = g({
                        test: this.test,
                        data: [{d: '', e: ''}],
                        schema: [{name: 'd'}, {name: 'e', defaultValue: 10}]
                    });
                    grid.addRow({d: '1'});
                    l = grid.data.length - 1;
                    done(assertIf(grid.data[l].d !== '1' || grid.data[l].e !== 10,
                        'Expected to see a specific row here, it is not here.'));
                });
                it('Insert row', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '1', e: '2'}, {d: '3', e: '4'}],
                        schema: [{name: 'd'}, {name: 'e', defaultValue: 10}]
                    });
                    grid.insertRow({d: '6'}, 1);
                    done(assertIf(grid.data[2].d !== '3' || grid.data[1].e !== 10,
                        'Expected to see a specific row here, it is not here.'));
                });
                it('Delete row', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '1'}, {d: '2'}]
                    });
                    grid.deleteRow(1);
                    done(assertIf(grid.data.length !== 1 || grid.data[0].d !== '1',
                        'Expected to see only 1 row, expected row 1 to contain a specific value.'));
                });
                it('Set row height', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    grid.addEventListener('rendercell', function (e) {
                        if (e.cell.rowIndex === 0) {
                            e.ctx.fillStyle = c.y;
                        }
                    });
                    grid.setRowHeight(0, 60);
                    assertPxColor(grid, 40, 80, c.y, done);
                });
                it('Set column width', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    grid.addEventListener('rendercell', function (e) {
                        if (e.cell.columnIndex === 0) {
                            e.ctx.fillStyle = c.y;
                        }
                    });
                    grid.setColumnWidth(0, 10);
                    assertPxColor(grid, 35, 78, c.y, done);
                });
                it('Reset row height', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    grid.addEventListener('rendercell', function (e) {
                        if (e.cell.rowIndex !== 0) {
                            e.ctx.fillStyle = c.y;
                        }
                    });
                    grid.setRowHeight(0, 60);
                    grid.resetRowHeights();
                    assertPxColor(grid, 90, 80, c.y, done);
                });
                it('Reset column width', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    grid.addEventListener('rendercell', function (e) {
                        if (e.cell.columnIndex === 1) {
                            e.ctx.fillStyle = c.y;
                        }
                    });
                    grid.setColumnWidth(0, 10);
                    grid.resetColumnWidths();
                    assertPxColor(grid, 300, 80, c.y, done);
                });
            });
            describe('Context menu', function () {
                it('Should produce a context menu', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    grid.addEventListener('contextmenu', function (e) {
                        setTimeout(function () {
                            done(assertIf(!document.body.contains(e.items[0].title), 'Expected context menu to exist in the body and be visible.'));
                        }, 1);
                    });
                    contextmenu(grid.canvas, 60, 37);
                });
                it('Clicking Order by asc should order the selected column asc', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    grid.addEventListener('contextmenu', function (e) {
                        setTimeout(function () {
                            //HACK: refine asc context menu item to click it
                            e.items[0].title.parentNode.parentNode.childNodes[1].dispatchEvent(new Event('click'));
                            done(assertIf(grid.data[0].col1 !== 'bar',
                                'Expected the content to be reordered asc.'));
                        }, 1);
                    });
                    contextmenu(grid.canvas, 60, 37);
                });
                it('Clicking Order by desc should order the selected column desc', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    grid.addEventListener('contextmenu', function (e) {
                        setTimeout(function () {
                            //HACK: refine desc context menu item to click it
                            e.items[0].title.parentNode.parentNode.childNodes[2].dispatchEvent(new Event('click'));
                            done(assertIf(grid.data[0].col1 !== 'foo',
                                'Expected the content to be reordered desc.'));
                        }, 1);
                    });
                    contextmenu(grid.canvas, 60, 37);
                });
            });
            describe('Scroll box with scrollPointerLock false', function () {
                it('Scroll vertically via box drag', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 500),
                        scrollPointerLock: false
                    });
                    setTimeout(function () {
                        grid.focus();
                        mousedown(grid.canvas, 50, 113);
                        mousemove(document.body, 50, 113, grid.canvas);
                        setTimeout(function () {
                            // simulate very slow movement of humans
                            //marker(grid, 100, 113);
                            mousemove(document.body, 100, 113, grid.canvas);
                            mouseup(document.body, 100, 113, grid.canvas);
                            done(assertIf(grid.scrollLeft < 100,
                                'Expected the scroll bar to be further along.'));
                        }, 200);
                    }, 1);
                });
                it('Scroll vertically right via margin click', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 500),
                        scrollPointerLock: false
                    });
                    setTimeout(function () {
                        grid.focus();
                        mousemove(grid.canvas, 100, 113);
                        mousedown(grid.canvas, 100, 113);
                        setTimeout(function () {
                            mouseup(document.body, 100, 113, grid.canvas);
                            done(assertIf(grid.scrollLeft < 1,
                                 'Expected the scroll bar to be further along.'));
                        }, 2000);
                    }, 1);
                }).timeout(5000);
                it('Scroll vertically left via margin click', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 500),
                        scrollPointerLock: false
                    });
                    marker(grid, 60, 113);
                    grid.scrollLeft = grid.scrollWidth;
                    setTimeout(function () {
                        grid.focus();
                        mousemove(grid.canvas, 60, 113);
                        mousedown(grid.canvas, 60, 113);
                        setTimeout(function () {
                            mouseup(document.body, 60, 113, grid.canvas);
                            done(assertIf(grid.scrollLeft === grid.scrollWidth,
                                 'Expected the scroll bar to be further along.'));
                        }, 2000);
                    }, 1);
                }).timeout(5000);
                it('Scroll horizontally via box drag', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 500),
                        scrollPointerLock: false
                    });
                    setTimeout(function () {
                        grid.focus();
                        mousedown(grid.canvas, 393, 35);
                        mousemove(document.body, 393, 35, grid.canvas);
                        setTimeout(function () {
                            // simulate very slow movement of humans
                            //marker(grid, 100, 113);
                            mousemove(document.body, 393, 100, grid.canvas);
                            mouseup(document.body, 393, 100, grid.canvas);
                            done(assertIf(grid.scrollTop < 100,
                                'Expected the scroll bar to be further along.'));
                        }, 200);
                    }, 1);
                });
                it('Scroll horizontally down via margin click', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 500),
                        scrollPointerLock: false
                    });
                    setTimeout(function () {
                        grid.focus();
                        mousemove(grid.canvas, 393, 100);
                        mousedown(grid.canvas, 393, 100);
                        setTimeout(function () {
                            mouseup(document.body, 393, 100, grid.canvas);
                            done(assertIf(grid.scrollTop < 1,
                                 'Expected the scroll bar to be further along.'));
                        }, 2000);
                    }, 1);
                }).timeout(5000);
                it('Scroll horizontally up via margin click', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 500),
                        scrollPointerLock: false
                    });
                    grid.scrollTop = grid.scrollHeight;
                    setTimeout(function () {
                        grid.focus();
                        mousemove(grid.canvas, 393, 75);
                        mousedown(grid.canvas, 393, 75);
                        setTimeout(function () {
                            mouseup(document.body, 393, 75, grid.canvas);
                            done(assertIf(grid.scrollTop === grid.scrollHeight,
                                 'Expected the scroll bar to be further along.'));
                        }, 2000);
                    }, 1);
                }).timeout(5000);
            });
            describe('Touch', function () {
                it('Touch and drag should scroll the grid', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    setTimeout(function () {
                        grid.focus();
                        touchstart(grid.canvas, 200, 37);
                        touchmove(document.body, 90, 37, grid.canvas);
                        setTimeout(function () {
                            // simulate very slow movement of humans
                            touchmove(document.body, 60, 37, grid.canvas);
                            touchend(document.body, 60, 37, grid.canvas);
                            done(assertIf(grid.scrollLeft === 0,
                                'Expected the grid to scroll some.'));
                        }, 200);
                    }, 1);
                });
                it('Touch and drag on the scroll bar should engage fast scrolling', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 500)
                    });
                    setTimeout(function () {
                        grid.focus();
                        touchstart(grid.canvas, 50, 113);
                        touchmove(document.body, 50, 113, grid.canvas);
                        setTimeout(function () {
                            // simulate very slow movement of humans
                            touchmove(document.body, 100, 113, grid.canvas);
                            touchend(document.body, 100, 113, grid.canvas);
                            done(assertIf(grid.scrollLeft < 400,
                                'Expected the scroll bar to be further along.'));
                        }, 200);
                    }, 1);
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
                        return blocks;
                    };
                    assertPxColor(grid, 90, 32, c.black, done);
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
                        assertPxColor(grid, 10, 34, c.fu, function () {
                            assertPxColor(grid, 60, 60, c.y, done);
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
                    assertPxColor(grid, 40, 60, c.y, done);
                });
                //TODO: treeHorizontalScroll
                it('Should NOT store JSON view state data when saveAppearance is false.', function (done) {
                    var n = 'a' + (new Date().getTime()),
                        k = 'canvasDataGrid-' + n,
                        grid = g({
                            test: this.test,
                            data: smallData,
                            name: n,
                            saveAppearance: false
                        });
                    grid.order('col1');
                    assertIf(JSON.parse(localStorage.getItem(k)),
                        'Expected storage item %s.', n);
                    localStorage.removeItem(k);
                    done();
                });
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
                it('Should use a textarea to edit when multiLine is true', function (done) {
                    var grid = g({
                        test: this.test,
                        multiLine: true,
                        data: smallData
                    });
                    grid.beginEditAt(0, 0);
                    done(assertIf(grid.input.tagName !== 'TEXTAREA', 'Expected a textarea here'));
                    grid.endEdit();
                });
                it('Should use an input to edit when multiLine is false', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    grid.beginEditAt(0, 0);
                    done(assertIf(grid.input.tagName !== 'INPUT', 'Expected an input here'));
                    grid.endEdit();
                });
                it('Should not be editable when editable is false', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData,
                        editable: false
                    });
                    click(grid.canvas, 60, 37);
                    keydown(grid.controlInput, 13);
                    done(assertIf(grid.input !== undefined, 'Expected no input when UI enters edit mode.'));
                });
                it('Should be editable when editable is true', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData
                    });
                    click(grid.canvas, 60, 37);
                    keydown(grid.controlInput, 13);
                    done(assertIf(grid.input === undefined, 'Expected an input when UI enters edit mode.'));
                    grid.endEdit();
                });
                it('Should allow column reordering when allowColumnReordering is true', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData,
                        style: {
                            columnWidth: 50
                        }
                    });
                    setTimeout(function () {
                        grid.focus();
                        mousemove(grid.canvas, 67, 10);
                        mousedown(grid.canvas, 67, 10);
                        mousemove(grid.canvas, 200, 10, grid.canvas);
                        mousemove(document.body, 200, 10, grid.canvas);
                        mouseup(document.body, 200, 10, grid.canvas);
                        grid.draw();
                        grid.addEventListener('click', function (e) {
                            done(assertIf(e.cell.value !== 0, 'Expected to see the value from column 2 here.'));
                        });
                        // lib intentionally ignoring next click - required to make the ux work as desired
                        click(grid.canvas, 60, 37);
                        click(grid.canvas, 60, 37);
                    }, 1);
                });
                it('Should draw column reorder markers when allowColumnReordering is true and reordering', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData,
                        style: {
                            columnWidth: 50,
                            reorderMarkerBackgroundColor: c.y,
                            reorderMarkerBorderWidth: 4,
                            reorderMarkerBorderColor: c.fu,
                            reorderMarkerIndexBorderColor: c.b,
                            reorderMarkerIndexBorderWidth: 4
                        }
                    });
                    setTimeout(function () {
                        grid.focus();
                        mousemove(grid.canvas, 67, 10);
                        mousedown(grid.canvas, 67, 10);
                        mousemove(grid.canvas, 180, 10, grid.canvas);
                        mousemove(document.body, 180, 10, grid.canvas);
                        assertPxColor(grid, 160, 10, c.y, function (err) {
                            if (err) { return done(err); }
                            assertPxColor(grid, 145, 90, c.fu, function (err) {
                                if (err) { return done(err); }
                                assertPxColor(grid, 132, 50, c.b, done);
                            });
                        });
                        grid.draw();
                    }, 10);
                });
                it('Should allow row reordering when allowRowReordering is true', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData,
                        allowRowReordering: true,
                        style: {
                            columnWidth: 50
                        }
                    });
                    setTimeout(function () {
                        grid.focus();
                        mousemove(grid.canvas, 10, 37);
                        mousedown(grid.canvas, 10, 37);
                        mousemove(grid.canvas, 10, 75, grid.canvas);
                        mousemove(document.body, 10, 75, grid.canvas);
                        mouseup(document.body, 10, 75, grid.canvas);
                        grid.draw();
                        grid.addEventListener('click', function (e) {
                            done(assertIf(e.cell.value !== 'bar', 'Expected to see the value from row 2 here.'));
                        });
                        // lib intentionally ignoring next click - required to make the ux work as desired
                        click(grid.canvas, 60, 37);
                        click(grid.canvas, 60, 37);
                    }, 1);
                });
                it('Should draw row reorder markers when allowRowReordering is true and reordering', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData,
                        allowRowReordering: true,
                        style: {
                            columnWidth: 50,
                            reorderMarkerBackgroundColor: c.y,
                            reorderMarkerBorderWidth: 4,
                            reorderMarkerBorderColor: c.fu,
                            reorderMarkerIndexBorderColor: c.b,
                            reorderMarkerIndexBorderWidth: 4
                        }
                    });
                    setTimeout(function () {
                        grid.focus();
                        mousemove(grid.canvas, 10, 37);
                        mousedown(grid.canvas, 10, 37);
                        mousemove(grid.canvas, 10, 75, grid.canvas);
                        mousemove(document.body, 10, 75, grid.canvas);
                        assertPxColor(grid, 10, 74, c.b, function (err) {
                            if (err) { return done(err); }
                            assertPxColor(grid, 20, 63, c.fu, function (err) {
                                if (err) { return done(err); }
                                assertPxColor(grid, 30, 69, c.y, done);
                            });
                        });
                        grid.draw();
                    }, 10);
                });
                it('The context menu filter should not show up when showFilter is false', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData,
                        showFilter: false
                    });
                    grid.addEventListener('contextmenu', function (e) {
                        setTimeout(function () {
                            done(assertIf(e.items.length !== 2,
                                'Expected to only see two items in the context menu at this point.'));
                        }, 1);
                    });
                    contextmenu(grid.canvas, 60, 37);
                });
                it('The context menu filter should show up when showFilter is true', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData,
                        showFilter: true
                    });
                    grid.addEventListener('contextmenu', function (e) {
                        setTimeout(function () {
                            done(assertIf(e.items.length !== 3,
                                'Expected to only see two items in the context menu at this point.'));
                        }, 1);
                    });
                    contextmenu(grid.canvas, 60, 37);
                });
            });
        });
    });
}());
