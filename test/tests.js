/*jslint browser: true*/
/*globals describe: false, afterEach: false, beforeEach: false, after: false, it: false, canvasDatagrid: false, async: false*/
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
        var m = document.getElementById('mocha'),
            gr = document.getElementById('grid');
        m.scrollTop = m.scrollHeight;
        gr.scrollTop = gr.scrollHeight;
        if (this.currentTest && this.currentTest.grid) {
            this.currentTest.grid.disposeContextMenu();
        }
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
        i.appendChild(a);
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
                        grid.assertPxColor(160, 10, c.y, function (err) {
                            if (err) { return done(err); }
                            grid.assertPxColor(145, 90, c.fu, function (err) {
                                if (err) { return done(err); }
                                grid.assertPxColor(132, 50, c.b, done);
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
                        grid.assertPxColor(10, 74, c.b, function (err) {
                            if (err) { return done(err); }
                            grid.assertPxColor(20, 63, c.fu, function (err) {
                                if (err) { return done(err); }
                                grid.assertPxColor(30, 69, c.y, done);
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
                // it('Should create an instance of datagrid', function (done) {
                //     var grid = g({test: this.test});
                //     assertIf(!grid, 'Expected a grid instance, instead got something false');
                //     done();
                // });