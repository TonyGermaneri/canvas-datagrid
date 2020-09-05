/*jslint browser: true*/
/*globals Event: false, describe: false, afterEach: false, beforeEach: false, after: false, it: false, canvasDatagrid: false, async: false, requestAnimationFrame: false*/
(function () {
    'use strict';
    var blocks = '██████████████████',
        // Template colors, for pixel tests
        c = {
            b: 'rgb(0, 0, 255)',
            y: 'rgb(255, 255, 0)',
            r: 'rgb(255, 0, 0)',
            fu: 'rgb(255, 0, 255)',
            white: 'rgb(255, 255, 255)',
            black: 'rgb(0, 0, 0)'
        },
        // Marker colors, for visually identifying test points
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
        // Sample data
        smallData = function () {
            return [
                {col1: 'foo', col2: 0, col3: 'a'},
                {col1: 'bar', col2: 1, col3: 'b'},
                {col1: 'baz', col2: 2, col3: 'c'}
            ];
        };
        
    // Get color `c` of rgb vector `v` 
    //  Note: See c = {...} above for color options 
    function getC(v) {
        return Object.keys(c).filter(function (k) {
            return c[k] === v;
        })[0] || v;
    }
    
    // Convert number `n` to 'spreadsheet-style' column label `s`
    //  Note: Zero-index, so 0 = A, 27 = AB, etc.
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
    
    // Create data grid with `r` rows, `c` columns, and cell contents derived
    // by the function `dFn`.
    //  Note: If dFn does not exist, each cell is left blank.
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
    
    // Reset test environment
    function cleanup(done) {
        var m = document.getElementById('mocha');
        m.scrollTop = m.scrollHeight;
        if (this.currentTest && this.currentTest.grid) {
            this.currentTest.grid.disposeContextMenu();
        }
        done();
    }
    
    // Draws a 'crosshairs' marker at coordinates (x,y).
    // The marker includes:
    //  - A 1px vertical line at x
    //  - A 1px horizontal line at y
    //  - A 3px central marker centered at (x,y)
    // Note: markerColors[...] selection ensures contrast between lines and 
    //  central marker
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

    function assertPxColorFn(grid, x, y, expected) {
        var d, match, e;
        x = x * window.devicePixelRatio;
        y = y * window.devicePixelRatio;
        return function (callback) {
            function f() {
                d = grid.ctx.getImageData(x, y, 1, 1).data;
                d = 'rgb(' + [d['0'], d['1'], d['2']].join(', ') + ')';
                match = d === expected;
                if (expected !== undefined) {
                    e = new Error('Expected color ' + getC(expected) + ' but got color ' + getC(d));
                    if (expected && !match) { console.error(e); }
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
            f();
        };
    }
    function assertPxColor(grid, x, y, expected, callback) {
        return assertPxColorFn(grid, x, y, expected)(callback);
    }
    function de(el, event, args) {
        var e = new Event(event);
        Object.keys(args).forEach(function (key) {
            e[key] = args[key];
        });
        el.dispatchEvent(e);
    }
    function keydown(el, key, args) {
        args = args || {};
        args.key = key;
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
        de(el, 'touchstart', {touches: [{clientX: x + p.left, clientY: y + p.top }], changedTouches: [{x: 0, y: 0}]});
    }
    function touchend(el, x, y, bbEl) {
        var p = bb(bbEl || el);
        de(el, 'touchend', {touches: [{clientX: x + p.left, clientY: y + p.top }], changedTouches: [{x: 0, y: 0}]});
    }
    function touchcancel(el, x, y, bbEl) {
        var p = bb(bbEl || el);
        de(el, 'touchcancel', {touches: [{clientX: x + p.left, clientY: y + p.top }], changedTouches: [{x: 0, y: 0}]});
    }
    function touchmove(el, x, y, bbEl) {
        var p = bb(bbEl || el);
        de(el, 'touchmove', {touches: [{clientX: x + p.left, clientY: y + p.top }], changedTouches: [{x: 0, y: 0}]});
    }
    function click(el, x, y, bbEl, ev) {
        var p = bb(bbEl || el);
        ev = ev || {};
        ev.clientX = x + p.left;
        ev.clientY = y + p.top;
        de(el, 'click', ev);
    }
    function dblclick(el, x, y, bbEl) {
        var p = bb(bbEl || el);
        de(el, 'dblclick', {clientX: x + p.left, clientY: y + p.top });
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
        if (args.component) {
            grid = document.createElement('canvas-datagrid');
            d.appendChild(grid);
            Object.keys(args).forEach(function (arg) {
                if (arg === 'parentNode') { return; }
                grid[arg] = args[arg];
            });
        } else {
            grid = canvasDatagrid(args);
        }
        grid.style.height = '100%';
        grid.style.width = '100%';
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
                it('Should be callable without arguments.', function (done) {
                    canvasDatagrid();
                    done();
                });
                it('Should create an instance of datagrid', function (done) {
                    var grid = g({test: this.test});
                    assertIf(!grid, 'Expected a grid instance, instead got something false');
                    grid.style.gridBackgroundColor = c.y;
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
                        data: smallData()
                    });
                    grid.style.activeCellBackgroundColor = c.b;
                    assertIf(grid.data.length !== 3,
                        'Expected to see data in the interface.');
                    assertPxColor(grid, 80, 32, c.b, done);
                });
            });
            if (window.customElements) {
                describe('Web component', function () {
                    it('Should create a web component, set a style', function (done) {
                        var grid = g({
                            test: this.test,
                            data: smallData(),
                            component: true
                        });
                        grid.style.activeCellBackgroundColor = c.b;
                        assertIf(grid.data.length !== 3,
                            'Expected to see data in the interface.');
                        assertPxColor(grid, 80, 32, c.b, done);
                    });
                    it('Should create a web component and set a hyphenated style', function (done) {
                        var grid = g({
                            test: this.test,
                            data: smallData(),
                            component: true
                        });
                        grid.style['active-cell-background-color'] = c.b;
                        assertIf(grid.data.length !== 3,
                            'Expected to see data in the interface.');
                        assertPxColor(grid, 80, 32, c.b, done);
                    });
                    it('Should create a web component and set a hyphenated style with a custom prefix', function (done) {
                        var grid = g({
                            test: this.test,
                            data: smallData(),
                            component: true
                        });
                        grid.style['--cdg-active-cell-background-color'] = c.b;
                        assertIf(grid.data.length !== 3,
                            'Expected to see data in the interface.');
                        assertPxColor(grid, 80, 32, c.b, done);
                    });
                    it('Should create a web component and set a schema', function (done) {
                        var grid = g({
                            test: this.test,
                            data: [{a: blocks}],
                            component: true
                        });
                        grid.style.gridBackgroundColor = c.b;
                        grid.schema = [{name: 'a', width: 30}];
                        assertIf(grid.data.length !== 1,
                            'Expected to see data in the interface.');
                        assertPxColor(grid, 80, 32, c.b, done);
                    });
                });
            }
            describe('Drawing', function () {
                it('Should draw row selections.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        selectionMode: 'row',
                        style: {
                            activeCellSelectedBackgroundColor: c.b,
                            cellSelectedBackgroundColor: c.b
                        }
                    });
                    mousemove(grid.canvas, 45, 37);
                    mousedown(grid.canvas, 45, 37);
                    mouseup(grid.canvas, 45, 37);
                    mousemove(grid.canvas, 45, 37);
                    setTimeout(function () {
                        assertPxColor(grid, 80, 37, c.b, done);
                    }, 1);
                });
                it('Should draw a debug message.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        debug: true,
                        style: {
                            debugFont: '200px sans-serif',
                            debugColor: c.b
                        }
                    });
                    mousemove(grid.canvas, 100, 113);
                    assertPxColor(grid, 90, 10, c.b, done);
                });
                // phantom throws a nonsense error due to the way the data url is constructed in the html function
                it('Should draw HTML.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{a: '<span style="background: ' + c.b + ';color: ' + c.b + '">blah</span>' }],
                        schema: [{name: 'a', type: 'html'}]
                    });
                    setTimeout(function () {
                        assertPxColor(grid, 50, 32, c.b, done);
                    }, 100);
                });
            });
            describe('Styles', function () {
                it('Should set the active cell color to black.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.style.activeCellBackgroundColor = c.black;
                    assertPxColor(grid, 100, 32, c.black, done);
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
            });
            describe('Public interface', function () {
                it('Focus on the grid', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    done(assertIf(!grid.hasFocus, 'Expected the grid to have focus'));
                });
                it('Blur the grid', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
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
                it('Use a function as a default value', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '', e: ''}],
                        schema: [{name: 'd'}, {name: 'e'}]
                    });
                    grid.insertColumn({
                        name: 'f',
                        defaultValue: function () { return 'g'; }
                    }, 1);
                    done(assertIf(grid.schema[1].name !== 'f' || grid.data[0].f !== 'g',
                        'Expected to see a specific column here, it is not here.'));
                });
                it('Autosize a column', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '123456', e: '123456'}]
                    });
                    grid.addEventListener('rendercell', function (e) {
                        if (e.cell.columnIndex === 1) {
                            e.ctx.fillStyle = c.b;
                        }
                    });
                    grid.autosize('d');
                    grid.draw();
                    assertPxColor(grid, 200, 32, c.b, done);
                });
                it('Autosize all columns', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '123456', e: '123456'}],
                        style: {
                            gridBackgroundColor: c.b
                        }
                    });
                    grid.autosize();
                    grid.draw();
                    assertPxColor(grid, 220, 32, c.b, done);
                });
                it('Add a style to the style setter', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '123456', e: '123456'}]
                    });
                    grid.style.gridBackgroundColor = c.b;
                    assertPxColor(grid, 200, 70, c.b, done);
                });
                it('Add an attribute to the attribute setter', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '123456', e: '123456'}]
                    });
                    grid.addEventListener('attributechanged', function (e) {
                        done(assertIf(grid.attributes.name !== 'blah', 'expected name to be blah'));
                    });
                    grid.attributes.name = 'blah';
                });
                it('Get visible schema', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '123456', e: '123456'}]
                    });
                    done(assertIf(grid.visibleSchema[0].name !== 'd', 'Expected schema to be returned'));
                });
                it('Get visible rows', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '123456', e: '123456'}]
                    });
                    done(assertIf(grid.visibleRows.length === 1, 'Expected 1 row to be returned'));
                });
                it('Get visible cells', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '123456', e: '123456'}]
                    });
                    done(assertIf(grid.visibleCells.length === 2, 'Expected 2 cells to be returned'));
                });
                it('Get current cell', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '123456', e: '123456'}]
                    });
                    mousemove(grid.canvas, 45, 37);
                    mousedown(grid.canvas, 45, 37);
                    mouseup(grid.canvas, 45, 37);
                    done(assertIf(grid.currentCell.rowIndex !== 0, 'Expected current cell to be rowIndex 0'));
                });
                it('Get offsetLeft of the parent node', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '123456', e: '123456'}]
                    });
                    done(assertIf(grid.offsetLeft === 0, 'Expected offsetLeft to be > 0'));
                });
                it('Get offsetTop of the parent node', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '123456', e: '123456'}]
                    });
                    done(assertIf(grid.offsetTop === 0, 'Expected offsetLeft to be > 0'));
                });
                it('Get the offsetParent node', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: '123456', e: '123456'}]
                    });
                    done(assertIf(grid.offsetParent === undefined, 'Expected a DOM node'));
                });
                it('Should throw an error if insertColumn is passed a bad index', function (done) {
                    var e, grid = g({
                        test: this.test,
                        data: [{d: '', e: ''}],
                        schema: [{name: 'd'}, {name: 'e'}]
                    });
                    try {
                        grid.insertColumn({
                            name: 'f',
                            defaultValue: 'g'
                        }, 5000);
                    } catch (er) {
                        e = er;
                    } finally {
                        done(assertIf(e === undefined,
                            'Expected insertColumn to throw an error.'));
                    }
                });
                it('Delete column', function (done) {
                    var grid = g({
                            test: this.test,
                            data: [{d: '', e: ''}]
                        }),
                        n = Object.keys(smallData()[0])[0];
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
                it('Should throw an error if insertRow is passed a bad index', function (done) {
                    var e, grid = g({
                        test: this.test,
                        data: [{d: '', e: ''}],
                        schema: [{name: 'd'}, {name: 'e'}]
                    });
                    try {
                        grid.insertRow({d: '6'}, 5000);
                    } catch (er) {
                        e = er;
                    } finally {
                        done(assertIf(e === undefined,
                            'Expected insertRow to throw an error.'));
                    }
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
                        data: smallData()
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
                        data: smallData()
                    });
                    grid.addEventListener('rendercell', function (e) {
                        if (e.cell.columnIndex === 0) {
                            e.ctx.fillStyle = c.y;
                        }
                    });
                    grid.setColumnWidth(0, 10);
                    setTimeout(function () {
                        assertPxColor(grid, 48, 78, c.y, done);
                    }, 1);
                });
                it('Reset row height', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
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
                        data: smallData()
                    });
                    grid.addEventListener('rendercell', function (e) {
                        if (e.cell.columnIndex === 1) {
                            e.ctx.fillStyle = c.y;
                        }
                    });
                    grid.setColumnWidth(0, 10);
                    grid.resetColumnWidths();
                    assertPxColor(grid, 340, 80, c.y, done);
                });
                it('Inserting an impossible column index should throw an error', function (done) {
                    var err, grid = g({
                        test: this.test,
                        data: [{d: '', e: ''}],
                        schema: [{name: 'd'}, {name: 'e'}]
                    });
                    try {
                        grid.insertColumn({
                            name: 'f',
                            defaultValue: 'g'
                        }, 999);
                    } catch (e) {
                        err = e;
                    }

                    done(assertIf(!err, 'Expected to see an error.'));
                });
                it('Inserting an impossible row index should throw an error', function (done) {
                    var err, grid = g({
                        test: this.test,
                        data: [{d: '', e: ''}],
                        schema: [{name: 'd'}, {name: 'e'}]
                    });
                    try {
                        grid.insertrow({
                            d: 'f',
                            e: 'g'
                        }, 999);
                    } catch (e) {
                        err = e;
                    }
                    done(assertIf(!err, 'Expected to see an error.'));
                });
                it('Goto a specific row', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 30)
                    });
                    grid.gotoRow(20);
                    done(assertIf(grid.scrollTop < 1,
                        'Expected scrollTop to be a little further along.'));
                });
                it('Fit column size to values', function (done) {
                    var doneCalled, grid = g({
                        test: this.test,
                        data: makeData(30, 30, function (y, x) { return x + ':' + y; })
                    });
                    grid.fitColumnToValues('a');
                    grid.addEventListener('rendercell', function (e) {
                        if (e.cell.rowIndex === 0 && e.cell.columnIndex === 0) {
                            if (doneCalled) { return; }
                            doneCalled = true;
                            done(assertIf(e.cell.width > 100,
                                'Expected column to be a little narrower.'));
                        }
                    });
                    grid.draw();
                });
                it('isCellVisible should return true when cell is visible, false when it is not', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 30, function (y, x) { return x + ':' + y; })
                    });
                    done(assertIf(!grid.isCellVisible({x: 0, y: 0})
                            || grid.isCellVisible({x: 0, y: 20}),
                                'Expected column to be a little narrower.'));
                });
            });
            describe('Context menu', function () {
                it('Should produce a context menu', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
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
                        data: smallData()
                    });
                    grid.addEventListener('contextmenu', function (e) {
                        setTimeout(function () {
                            e.items[4].contextItemContainer.dispatchEvent(new Event('click'));
                            done(assertIf(grid.data[0].col1 !== 'bar',
                                'Expected the content to be reordered asc.'));
                        }, 1);
                    });
                    contextmenu(grid.canvas, 100, 37);
                });
                it('Should produce a context menu very wide requiring the context menu move to be fully visible', function (done) {
                    var d = [], x, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    for (x = 0; x < 100; x += 1) {
                        d.push({
                            title: 'veryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryverywide'
                        });
                    }
                    grid.addEventListener('contextmenu', function (e) {
                        e.items.push({
                            title: 'Child menu',
                            items: function () {
                                return d;
                            }
                        });
                        setTimeout(function () {
                            e.items[6].contextItemContainer.dispatchEvent(new Event('mouseover'));
                            setTimeout(function () {
                                done(assertIf(!e.items[6].contextMenu.container, 'Expected child context menu.'));
                            }, 1);
                        }, 1);
                    });
                    contextmenu(grid.canvas, 60, 37);
                });
                it('Should create a child context menu using a function that returns items', function (done) {
                    var d = [], x, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    for (x = 0; x < 100; x += 1) {
                        d.push({
                            title: x
                        });
                    }
                    grid.addEventListener('contextmenu', function (e) {
                        e.items.push({
                            title: 'Child menu',
                            items: function () {
                                return d;
                            }
                        });
                        setTimeout(function () {
                            e.items[6].contextItemContainer.dispatchEvent(new Event('mouseover'));
                            setTimeout(function () {
                                done(assertIf(!e.items[6].contextMenu.container, 'Expected child context menu.'));
                            }, 1);
                        }, 1);
                    });
                    contextmenu(grid.canvas, 60, 37);
                });
                it('Should create a child context menu using a function that uses a callback argument', function (done) {
                    var d = [], x, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    for (x = 0; x < 100; x += 1) {
                        d.push({
                            title: x
                        });
                    }
                    grid.addEventListener('contextmenu', function (e) {
                        e.items.push({
                            title: 'Child menu',
                            items: function (callback) {
                                return callback(d);
                            }
                        });
                        setTimeout(function () {
                            e.items[6].contextItemContainer.dispatchEvent(new Event('mouseover'));
                            setTimeout(function () {
                                done(assertIf(!e.items[6].contextMenu.container, 'Expected child context menu.'));
                            }, 1);
                        }, 1);
                    });
                    contextmenu(grid.canvas, 60, 37);
                });
                it('Create a child context menu and scroll up and down using mouseover events, then exit menu', function (done) {
                    var d = [], x, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    for (x = 0; x < 100; x += 1) {
                        d.push({
                            title: x
                        });
                    }
                    grid.addEventListener('contextmenu', function (e) {
                        e.items.push({
                            title: 'child menu',
                            items: d
                        });
                        setTimeout(function () {
                            e.items[6].contextItemContainer.dispatchEvent(new Event('mouseover'));
                            e.items[6].contextMenu.downArrow.dispatchEvent(new Event('mouseover'));
                            setTimeout(function () {
                                var err = assertIf(e.items[6].contextMenu.container.scrollTop === 0);
                                if (err) { return done(err); }
                                e.items[6].contextMenu.downArrow.dispatchEvent(new Event('mouseout'));
                                e.items[6].contextMenu.upArrow.dispatchEvent(new Event('mouseover'));
                                setTimeout(function () {
                                    e.items[6].contextMenu.upArrow.dispatchEvent(new Event('mouseout'));
                                    err = assertIf(e.items[6].contextMenu.container.scrollTop !== 0);
                                    if (err) { return done(err); }
                                    setTimeout(function () {
                                        e.items[6].contextItemContainer.dispatchEvent(new Event('mouseout'));
                                        done(assertIf(e.items[6].contextMenu !== undefined,
                                            'expected child context menu to be gone.'));
                                    }, 100);
                                }, 1500);
                            }, 1000);
                        }, 1);
                    });
                    contextmenu(grid.canvas, 60, 37);
                }).timeout(5000);
                it('Autocomplete should appear when a value is entered into the filter input', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.addEventListener('contextmenu', function (e) {
                        setTimeout(function () {
                            //HACK: get to filter input element in context menu
                            var i = e.items[0].title.children[1];
                            i.value = 'f';
                            i.dispatchEvent(new Event('keyup'));
                            done(assertIf(document.body.lastChild.childNodes.length === 1
                                    && document.body.lastChild.firstChild.innerHTML !== 'foo',
                                'Expected the autocomplete to be the most recent item added to body and expected it to only contain "foo"'));
                        }, 1);
                    });
                    contextmenu(grid.canvas, 100, 37);
                });
                it('Autocomplete keys should key down and filter', function (done) {
                    var err,
                        grid = g({
                            test: this.test,
                            data: smallData()
                        });
                    grid.addEventListener('contextmenu', function (e) {
                        setTimeout(function () {
                            //HACK: get to filter input element in context menu
                            var i = e.items[0].title.children[1];
                            i.value = 'b';
                            i.dispatchEvent(new Event('keyup'));

                            ['ArrowDown', 'Enter'].forEach(function (key) {
                                var ev = new Event('keydown');
                                ev.key = key;
                                
                                i.dispatchEvent(ev);
                                
                                if (key === 'Enter') {
                                    err = assertIf(grid.data[0].col1 !== 'baz', 'Expected key combination to filter for baz');
                                }
                            });
                            done(err);
                        }, 1);
                    });
                    contextmenu(grid.canvas, 100, 37);
                });
                it('Autocomplete keys should key down, key up and filter', function (done) {
                    var err,
                        grid = g({
                            test: this.test,
                            data: smallData()
                        });
                    grid.addEventListener('contextmenu', function (e) {
                        setTimeout(function () {
                            //HACK: get to filter input element in context menu
                            var i = e.items[0].title.children[1];
                            i.value = 'b';
                            i.dispatchEvent(new Event('keyup'));
                            ['ArrowDown', 'ArrowUp', 'Enter'].forEach(function (key) {
                                var ev = new Event('keydown');
                                ev.key = key;

                                i.dispatchEvent(ev);
                                
                                if (key === 'Enter') {
                                    err = assertIf(grid.data[0].col1 !== 'bar', 'Expected key combination to filter for bar');
                                }
                            });
                            done(err);
                        }, 1);
                    });
                    contextmenu(grid.canvas, 100, 37);
                });
                it('Autocomplete keys should key tab', function (done) {
                    var err,
                        grid = g({
                            test: this.test,
                            data: smallData()
                        });
                    grid.addEventListener('contextmenu', function (e) {
                        setTimeout(function () {
                            //HACK: get to filter input element in context menu
                            var i = e.items[0].title.children[1];
                            i.value = 'f';
                            i.dispatchEvent(new Event('keyup'));
                            ['Tab'].forEach(function (key) {
                                var ev = new Event('keydown');
                                ev.key = key;
                                i.dispatchEvent(ev);
                                if (key === 'Tab') {
                                    err = assertIf(grid.data[0].col1 !== 'foo', 'Expected key combination to filter for bar');
                                }
                            });
                            done(err);
                        }, 1);
                    });
                    contextmenu(grid.canvas, 100, 37);
                });
                it('Autocomplete keys should key esc', function (done) {
                    var err,
                        grid = g({
                            test: this.test,
                            data: smallData()
                        });
                    grid.addEventListener('contextmenu', function (e) {
                        setTimeout(function () {
                            //HACK: get to filter input element in context menu
                            var i = e.items[0].title.children[1];
                            i.value = 'f';
                            i.dispatchEvent(new Event('keyup'));
                            ['Escape'].forEach(function (key) {
                                var ev = new Event('keydown');
                                ev.key = key;
                                i.dispatchEvent(ev);
                                if (key === 'esc') {
                                    err = assertIf(grid.data[0].col1 !== 'foo', 'Expected key combination to filter for bar');
                                }
                            });
                            done(err);
                        }, 1);
                    });
                    contextmenu(grid.canvas, 100, 37);
                });
                it('Should store JSON view state data, then clear it once clear settings is clicked.', function (done) {
                    var n = 'a' + (new Date().getTime()),
                        k = 'canvasDataGrid-' + n,
                        grid = g({
                            test: this.test,
                            data: smallData(),
                            name: n
                        });
                    grid.order('col1');
                    grid.addEventListener('contextmenu', function (e) {
                        setTimeout(function () {
                            var err, i = localStorage.getItem(k);
                            e.items[3].contextItemContainer.dispatchEvent(new Event('click'));
                            err = assertIf(localStorage.getItem(k) === i, 'expected storage values to differ');
                            localStorage.removeItem(k);
                            done(err);
                        }, 1);
                    });
                    contextmenu(grid.canvas, 100, 37);
                });
            });
            describe('Scroll box with scrollPointerLock false', function () {
                it('Scroll horizontally via box drag', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 50),
                        scrollPointerLock: false
                    });
                    setTimeout(function () {
                        grid.focus();
                        mousedown(grid.canvas, 53, 113);
                        marker(grid, 53, 113);
                        mousemove(document, 50, 113, grid.canvas);
                        setTimeout(function () {
                            // simulate very slow movement of humans
                            marker(grid, 100, 113);
                            mousemove(document, 100, 113, grid.canvas);
                            mouseup(document, 100, 113, grid.canvas);
                            done(assertIf(grid.scrollLeft < 100,
                                'Expected the scroll bar to be further along.'));
                        }, 200);
                    }, 1);
                });
                it('Scroll horizontally right via margin click', function (done) {
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
                            mouseup(document, 100, 113, grid.canvas);
                            done(assertIf(grid.scrollLeft < 1,
                                 'Expected the scroll bar to be further along.'));
                        }, 500);
                    }, 1);
                }).timeout(5000);
                it('Scroll horizontally right via margin click until box capture', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 10),
                        scrollPointerLock: false
                    });
                    setTimeout(function () {
                        grid.focus();
                        marker(grid, 100, 113);
                        mousemove(grid.canvas, 100, 113);
                        mousedown(grid.canvas, 100, 113);
                        setTimeout(function () {
                            mouseup(document, 100, 113, grid.canvas);
                            done(assertIf(grid.scrollLeft < 1,
                                 'Expected the scroll bar to be further along.'));
                        }, 500);
                    }, 1);
                }).timeout(5000);
                it('Scroll horizontally left via margin click', function (done) {
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
                            mouseup(document, 60, 113, grid.canvas);
                            done(assertIf(grid.scrollLeft === grid.scrollWidth,
                                 'Expected the scroll bar to be further along.'));
                        }, 2000);
                    }, 1);
                }).timeout(5000);
                it('Scroll vertically via box drag', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 500),
                        scrollPointerLock: false
                    });
                    marker(grid, 395, 35);
                    setTimeout(function () {
                        grid.focus();
                        mousedown(grid.canvas, 395, 35);
                        mousemove(document, 395, 35, grid.canvas);
                        setTimeout(function () {
                            // simulate very slow movement of humans
                            //marker(grid, 100, 113);
                            mousemove(document, 395, 100, grid.canvas);
                            mouseup(document, 395, 100, grid.canvas);
                            done(assertIf(grid.scrollTop < 100,
                                'Expected the scroll bar to be further along.'));
                        }, 200);
                    }, 1);
                });
                it('Scroll vertically down via margin click', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 500),
                        scrollPointerLock: false
                    });
                    setTimeout(function () {
                        grid.focus();
                        mousemove(grid.canvas, 395, 100);
                        mousedown(grid.canvas, 395, 100);
                        setTimeout(function () {
                            mouseup(document, 395, 100, grid.canvas);
                            done(assertIf(grid.scrollTop < 1,
                                 'Expected the scroll bar to be further along.'));
                        }, 2000);
                    }, 1);
                }).timeout(5000);
                it('Scroll vertically down via margin click until box capture', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 20),
                        scrollPointerLock: false
                    });
                    setTimeout(function () {
                        grid.focus();
                        marker(grid, 395, 70);
                        mousemove(grid.canvas, 395, 70);
                        mousedown(grid.canvas, 395, 70);
                        setTimeout(function () {
                            mouseup(document, 395, 70, grid.canvas);
                            done(assertIf(grid.scrollTop < 1,
                                 'Expected the scroll bar to be further along.'));
                        }, 2000);
                    }, 1);
                }).timeout(5000);
                it('Scroll vertically up via margin click', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(30, 500),
                        scrollPointerLock: false
                    });
                    grid.scrollTop = grid.scrollHeight;
                    setTimeout(function () {
                        grid.focus();
                        marker(grid, 393, 75);
                        mousemove(grid.canvas, 393, 75);
                        mousedown(grid.canvas, 393, 75);
                        setTimeout(function () {
                            mouseup(document, 395, 75, grid.canvas);
                            done(assertIf(grid.scrollTop === grid.scrollHeight,
                                 'Expected the scroll bar to be further along.'));
                        }, 2000);
                    }, 1);
                }).timeout(5000);
                it('Scroll horizontally via wheel', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: makeData(30, 500)
                    });
                    grid.focus();
                    ev = new Event('wheel');
                    ev.deltaX = 10;
                    ev.deltaY = 0;
                    ev.deltaMode = 0;
                    grid.canvas.dispatchEvent(ev);
                    setTimeout(function () {
                        done(assertIf(grid.scrollLeft < 1,
                             'Expected the scroll bar to be further along.'));
                    }, 100);
                });
                it('Scroll vertically via wheel', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: makeData(30, 500)
                    });
                    grid.focus();
                    ev = new Event('wheel');
                    ev.deltaX = 0;
                    ev.deltaY = 10;
                    ev.deltaMode = 0;
                    grid.canvas.dispatchEvent(ev);
                    setTimeout(function () {
                        done(assertIf(grid.scrollTop < 1,
                             'Expected the scroll bar to be further along.'));
                    }, 100);
                });
                it('Scroll vertically via wheel honoring deltaMode 0x01 DOM_DELTA_LINE', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: makeData(30, 500)
                    });
                    grid.focus();
                    ev = new Event('wheel');
                    ev.deltaX = 0;
                    ev.deltaY = 1;
                    ev.deltaMode = 1;
                    grid.canvas.dispatchEvent(ev);
                    setTimeout(function () {
                        done(assertIf(grid.scrollTop < 1,
                             'Expected the scroll bar to be further along.'));
                    }, 100);
                });
            });
            describe('Touch', function () {
                it('Touch and drag should scroll the grid vertically and horizontally', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    setTimeout(function () {
                        grid.focus();
                        touchstart(grid.canvas, 200, 37);
                        touchmove(document.body, 90, 37, grid.canvas);
                        setTimeout(function () {
                            // simulate very slow movement of humans
                            touchmove(document.body, 60, 66, grid.canvas);
                            touchend(document.body, 60, 66, grid.canvas);
                            setTimeout(function () {
                                done(assertIf(grid.scrollLeft === 0,
                                    'Expected the grid to scroll some.'));
                            }, 1500);
                        }, 200);
                    }, 1);
                });
                it('Touch and drag should scroll the inner grid', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        tree: true
                    });
                    grid.addEventListener('expandtree', function (e) {
                        setTimeout(function () {
                            e.treeGrid.focus();
                            touchstart(grid.canvas, 200, 80);
                            touchmove(document.body, 90, 80, grid.canvas);
                            setTimeout(function () {
                                // simulate very slow movement of humans
                                touchmove(document.body, 60, 80, grid.canvas);
                                touchend(document.body, 60, 80, grid.canvas);
                                setTimeout(function () {
                                    done(assertIf(e.treeGrid.scrollLeft === 0,
                                        'Expected the grid to scroll some.'));
                                }, 1500);
                            }, 200);
                        }, 1);
                        e.treeGrid.data = [{a: 'b', c: 'd', e: 'f', g: 'h'}];
                    });
                    grid.expandTree(0);
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
                            setTimeout(function () {
                                done(assertIf(grid.scrollLeft < 400,
                                    'Expected the scroll bar to be further along.'));
                            }, 100);
                        }, 200);
                    }, 1);
                });
                it('Use touchstart event to prevent touch events using e.preventDefault.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.addEventListener('touchstart', function (e) { return e.preventDefault(); });
                    setTimeout(function () {
                        grid.focus();
                        touchstart(grid.canvas, 200, 37);
                        setTimeout(function () {
                            // simulate very slow movement of humans
                            grid.focus();
                            touchmove(document.body, 320, 90, grid.canvas);
                            touchend(document.body, 320, 90, grid.canvas);
                            setTimeout(function () {
                                done(assertIf(grid.scrollLeft !== 0,
                                    'Expected no movement.'));
                            }, 1);
                        }, 1000);
                    }, 1);
                });
                it('Use touchend event to prevent touch events using e.preventDefault.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.addEventListener('touchend', function (e) { return e.preventDefault(); });
                    setTimeout(function () {
                        grid.focus();
                        touchstart(grid.canvas, 200, 37);
                        setTimeout(function () {
                            // simulate very slow movement of humans
                            grid.focus();
                            touchmove(document.body, 320, 90, grid.canvas);
                            touchend(document.body, 320, 90, grid.canvas);
                            setTimeout(function () {
                                done(assertIf(grid.scrollLeft !== 0,
                                    'Expected no movement.'));
                            }, 1);
                        }, 1000);
                    }, 1);
                });
                it('Touch and hold should not start selecting or moving if very little movement before touchEnd', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    setTimeout(function () {
                        grid.focus();
                        touchstart(grid.canvas, 200, 37);
                        setTimeout(function () {
                            // simulate very slow movement of humans
                            grid.focus();
                            touchmove(document.body, 200, 38, grid.canvas);
                            touchend(document.body, 200, 38, grid.canvas);
                            setTimeout(function () {
                                done(assertIf(grid.scrollLeft !== 0,
                                    'Expected no movement.'));
                            }, 1);
                        }, 1000);
                    }, 1);
                });
            });
            describe('Editing', function () {
                it('Begin editing, end editing', function (done) {
                    var ev,
                        err,
                        grid = g({
                            test: this.test,
                            data: [{d: ''}]
                        });
                    grid.beginEditAt(0, 0);
                    err = assertIf(!grid.input.parentNode, 'Expected an input to have appeared');
                    if (err) { return done(err); }
                    ev = new Event('keydown');
                    ev.key = "Escape";

                    grid.addEventListener('endedit', function () {
                        done();
                    });
                    grid.input.dispatchEvent(ev);
                });
                it('Begin editing, enter a value, end editing', function (done) {
                    var ev,
                        grid = g({
                            test: this.test,
                            data: [{d: ''}]
                        });
                    grid.beginEditAt(0, 0);
                    ev = new Event('keydown');
                    ev.key = "Enter";
                    grid.input.value = 'blah';
                    grid.addEventListener('endedit', function (e) {
                        done(assertIf(grid.data[0].d !== 'blah', 'Expected value to be in data'));
                    });
                    grid.input.dispatchEvent(ev);
                });
                it('Begin editing, enter a value, end editing, abort before ending.', function (done) {
                    var ev,
                        grid = g({
                            test: this.test,
                            data: [{d: ''}]
                        });
                    grid.beginEditAt(0, 0);
                    ev = new Event('keydown');
                    ev.key = "Enter";
                    grid.input.value = 'blah';
                    grid.addEventListener('beforeendedit', function (e) {
                        e.abort();
                        done(assertIf(grid.data[0].d === 'blah', 'Expected value to be in data'));
                    });
                    grid.input.dispatchEvent(ev);
                });
                it('Begin editing a select with short definition.', function (done) {
                    var grid = g({
                            test: this.test,
                            data: [{d: ''}],
                            schema: [{name: 'd', enum: ['a', 'b', 'c']}]
                        });
                    grid.beginEditAt(0, 0);
                    done(assertIf(grid.input.childNodes.length === 3
                            && grid.input.tagName !== 'SELECT', 'Expected an input to have appeared'));
                    grid.endEdit();
                });
                it('Begin editing a select with standard definition.', function (done) {
                    var grid = g({
                            test: this.test,
                            data: [{d: ''}],
                            schema: [{name: 'd', enum: [['a', 'A'], ['b', 'B'], ['c', 'C']]}]
                        });
                    grid.beginEditAt(0, 0);
                    done(assertIf(grid.input.childNodes[0].innerHTML === 'A'
                            && grid.input.childNodes.length === 3
                            && grid.input.tagName !== 'SELECT', 'Expected an input to have appeared'));
                    grid.endEdit();
                });
                it('Begin editing by double clicking a cell.', function (done) {
                    var grid = g({
                            test: this.test,
                            data: [{d: ''}]
                        });
                    mousemove(grid.canvas, 65, 37);
                    mousedown(grid.canvas, 65, 37);
                    mouseup(grid.canvas, 65, 37);
                    mousedown(grid.canvas, 65, 37);
                    mouseup(grid.canvas, 65, 37);
                    dblclick(grid.canvas, 65, 37);
                    done(assertIf(grid.input.tagName !== 'INPUT', 'Expected an input to have appeared'));
                    grid.endEdit();
                });
                it('Should copy a value onto the simulated clipboard.', function (done) {
                    var once,
                        grid = g({
                            test: this.test,
                            data: [
                                {d: 'Text with, a comma 1', e: 'Text that has no comma in in 1'},
                                {d: 'Text with, a comma 2', e: 'Text that has no comma in in 2'}
                            ]
                        });
                    grid.selectAll();
                    grid.focus();
                    setTimeout(function () {
                        grid.copy({
                            clipboardData: {
                                setData: function (mime, data) {
                                    if (once) { return; }
                                    once = true;
                                    done(assertIf(mime !== 'text/html'
                                        || data.indexOf('Text with') === -1, 'Expected data from the grid to be placed into the fake clipboard.'));
                                }
                            },
                            preventDefault: () => null // noop so the call in addCellValue doesn't cause an error
                        });
                    }, 1);
                });
                it('Should paste a value from the clipboard into a cell', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [
                            { 'Column A': 'Original value' }
                        ]
                    });

                    grid.focus();
                    grid.setActiveCell(0, 0);

                    grid.paste({
                        clipboardData: {
                            items: [
                                {
                                    type: 'text/plain',
                                    getAsString: function(callback) {
                                        callback('Paste buffer value');
                                    }
                                }
                            ]
                        }
                    });

                    setTimeout(function() {
                        var cellData = grid.data[0]['Column A'];
                        done(assertIf(cellData !== 'Paste buffer value', 'Value has not been replaced with clipboard data: ' + cellData));
                    }, 10);
                });
                it('Should paste an HTML value from the clipboard into a cell', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [
                            { 'Column A': 'Original value' }
                        ]
                    });

                    grid.focus();
                    grid.setActiveCell(0, 0);

                    grid.paste({
                        clipboardData: {
                            items: [
                                {
                                    type: 'text/html',
                                    getAsString: function(callback) {
                                        callback("<meta charset='utf-8'><table><tr><td>Paste buffer value</td></tr></table>");
                                    }
                                }
                            ]
                        }
                    });

                    setTimeout(function() {
                        var cellData = grid.data[0]['Column A'];
                        done(assertIf(cellData !== 'Paste buffer value', 'Value has not been replaced with clipboard data: ' + cellData));
                    }, 10);
                });
                it("Should fire a beforepaste event", function (done) {
                    var grid = g({
                        test: this.test,
                        data: [
                            { 'Column A': 'Original value' }
                        ]
                    });

                    grid.focus();
                    grid.setActiveCell(0, 0);

                    grid.addEventListener('beforepaste', function (event) {
                        event.preventDefault();
                        done();
                    });

                    // Event can be empty, because beforepaste should fire immediately,
                    // and return from paste function (because preventDefault):
                    grid.paste({});
                });
                it("Should fire an afterpaste event", function (done) {
                    var grid = g({
                        test: this.test,
                        data: [
                            { 'Column A': 'Original value' }
                        ]
                    });

                    grid.focus();
                    grid.setActiveCell(0, 0);

                    grid.addEventListener('afterpaste', function (event) {
                        done();
                    });

                    grid.paste({
                        clipboardData: {
                            items: [
                                {
                                    type: 'text/plain',
                                    getAsString: function(callback) {
                                        callback('Paste buffer value');
                                    }
                                }
                            ]
                        }
                    });
                });
                it('Begin editing, tab to next cell', function (done) {
                    var ev,
                        err,
                        grid = g({
                            test: this.test,
                            data: smallData()
                        });
                    grid.beginEditAt(0, 0);
                    ev = new Event('keydown');
                    ev.key = "Tab";
                    grid.input.dispatchEvent(ev);
                    grid.addEventListener('endedit', function (e) {
                        if (e.cell.columnIndex === 1) {
                            done();
                        }
                    });
                    grid.endEdit();
                });
                it('Begin editing, shift tab to very last cell', function (done) {
                    var ev,
                        err,
                        grid = g({
                            test: this.test,
                            data: smallData()
                        });
                    grid.beginEditAt(0, 0);
                    ev = new Event('keydown');
                    ev.shiftKey = true;
                    ev.key = "Tab";
                    grid.addEventListener('endedit', function (e) {
                        if (e.cell.columnIndex === 2 && e.cell.rowIndex === 2) {
                            done();
                        }
                    });
                    grid.input.dispatchEvent(ev);
                    grid.endEdit();
                });
                it('Begin editing, tab to next row by hitting tab three times', function (done) {
                    var ev,
                        err,
                        grid = g({
                            test: this.test,
                            data: smallData()
                        });
                    grid.beginEditAt(0, 0);
                    grid.addEventListener('endedit', function (e) {
                        if (e.cell.columnIndex === 0 && e.cell.rowIndex === 0) {
                            done();
                        }
                    });
                    ev = new Event('keydown');
                    ev.key = "Tab";
                    document.body.lastChild.dispatchEvent(ev);
                    document.body.lastChild.dispatchEvent(ev);
                    document.body.lastChild.dispatchEvent(ev);
                    grid.endEdit();
                });
            });
            describe('Key navigation', function () {
                it('Arrow down should move active cell down one', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    ev = new Event('keydown');
                    ev.key = "ArrowDown";
                    grid.controlInput.dispatchEvent(ev);
                    done(assertIf(grid.activeCell.rowIndex !== 1, 'Expected the active cell to move.'));
                });
                it('Arrow right should move active cell right one', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    ev = new Event('keydown');
                    ev.key = "ArrowRight";
                    grid.controlInput.dispatchEvent(ev);
                    done(assertIf(grid.activeCell.columnIndex !== 1, 'Expected the active cell to move.'));
                });
                it('Arrow right, then left should move active cell right one, then left one', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    ev = new Event('keydown');
                    ev.key = "ArrowRight";
                    grid.controlInput.dispatchEvent(ev);
                    ev = new Event('keydown');
                    ev.key = "ArrowLeft";
                    grid.controlInput.dispatchEvent(ev);
                    done(assertIf(grid.activeCell.columnIndex !== 0, 'Expected the active cell to move.'));
                });
                it('Arrow down, then up should move active cell down one, then up one', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    ev = new Event('keydown');
                    ev.key = "ArrowDown";
                    grid.controlInput.dispatchEvent(ev);
                    ev = new Event('keydown');
                    ev.key = "ArrowUp";
                    grid.controlInput.dispatchEvent(ev);
                    done(assertIf(grid.activeCell.columnIndex !== 0, 'Expected the active cell to move.'));
                });
                it('Shift and Arrow down should add the selection down one', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    ev = new Event('keydown');
                    ev.key = " "; // Space
                    grid.controlInput.dispatchEvent(ev);
                    ev = new Event('keydown');
                    ev.shiftKey = true;
                    ev.key = "ArrowDown";
                    grid.controlInput.dispatchEvent(ev);
                    done(assertIf(grid.selectedRows.length !== 2, 'Expected the active cell to move.'));
                });
                it('Shift and Arrow right should add the selection right one', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    ev = new Event('keydown');
                    ev.key = " "; // Space
                    grid.controlInput.dispatchEvent(ev);
                    ev = new Event('keydown');
                    ev.shiftKey = true;
                    ev.key = "ArrowRight";
                    grid.controlInput.dispatchEvent(ev);
                    done(assertIf(grid.selectedRows.length !== 1 || grid.selections[0].col3 !== undefined, 'Expected the active cell to move.'));
                });
                it('Shift and Arrow left should add the selection to the left one', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    ev = new Event('keydown');
                    ev.key = " "; // Space
                    grid.controlInput.dispatchEvent(ev);
                    ev = new Event('keydown');
                    ev.shiftKey = true;
                    ev.key = "ArrowRight";
                    grid.controlInput.dispatchEvent(ev);
                    ev = new Event('keydown');
                    ev.shiftKey = true;
                    ev.key = "ArrowLeft";
                    grid.controlInput.dispatchEvent(ev);
                    done(assertIf(grid.selectedRows.length !== 1 || grid.selections[0].col3 !== undefined, 'Expected the active cell to move.'));
                });
                it('Shift and Arrow up should add the selection up one', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    ev = new Event('keydown');
                    ev.key = " "; // Space
                    grid.controlInput.dispatchEvent(ev);
                    ev = new Event('keydown');
                    ev.shiftKey = true;
                    ev.key = "ArrowDown";
                    grid.controlInput.dispatchEvent(ev);
                    ev = new Event('keydown');
                    ev.shiftKey = true;
                    ev.key = "ArrowUp";
                    grid.controlInput.dispatchEvent(ev);
                    done(assertIf(grid.selectedRows.length !== 2 || grid.selections[0].col2 !== undefined, 'Expected the active cell to move.'));
                });
                it('Shift tab should behave like left arrow', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    ev = new Event('keydown');
                    ev.key = "ArrowRight";
                    grid.controlInput.dispatchEvent(ev);
                    ev = new Event('keydown');
                    ev.key = "Tab";
                    ev.shiftKey = true;
                    grid.controlInput.dispatchEvent(ev);
                    done(assertIf(grid.activeCell.columnIndex !== 0, 'Expected the active cell to move.'));
                });
                it('Tab should behave like right arrow', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    ev = new Event('keydown');
                    ev.key = "Tab";
                    grid.controlInput.dispatchEvent(ev);
                    done(assertIf(grid.activeCell.columnIndex !== 1, 'Expected the active cell to move.'));
                });
                it('Tab should behave like right arrow', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    ev = new Event('keydown');
                    ev.key = "Tab";
                    grid.controlInput.dispatchEvent(ev);
                    done(assertIf(grid.activeCell.columnIndex !== 1, 'Expected the active cell to move.'));
                });
                it('Keyup and keypress', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    grid.addEventListener('keyup', function () {
                        grid.addEventListener('keypress', function () {
                            done();
                        });
                        ev = new Event('keypress');
                        grid.controlInput.dispatchEvent(ev);
                    });
                    ev = new Event('keyup');
                    grid.controlInput.dispatchEvent(ev);
                });
                it('Page down should move down a page', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: makeData(50, 50)
                    });
                    grid.focus();
                    ev = new Event('keydown');
                    ev.key = "PageDown";
                    grid.controlInput.dispatchEvent(ev);
                    done(assertIf(grid.activeCell.rowIndex === 0, 'Expected the active cell to move.'));
                });
                it('Page up should move up a page', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: makeData(50, 50)
                    });
                    grid.focus();
                    ev = new Event('keydown');
                    ev.key = "PageDown";
                    grid.controlInput.dispatchEvent(ev);
                    ev = new Event('keydown');
                    ev.key = "PageUp";
                    grid.controlInput.dispatchEvent(ev);
                    done(assertIf(grid.activeCell.rowIndex !== 0, 'Expected the active cell to move.'));
                });
                it('Space select just the active cell', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    grid.selectAll();
                    ev = new Event('keydown');
                    ev.key = " "; // Space
                    grid.controlInput.dispatchEvent(ev);
                    done(assertIf(grid.selectedRows.length !== 1, 'Expected to see one row selected.'));
                });
            });
            describe('Resize', function () {
                it('Resize a column from a column header.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        style: {
                            cellWidth: 50
                        }
                    });
                    grid.addEventListener('rendercell', function (e) {
                        if (e.cell.columnIndex === 0) {
                            e.ctx.fillStyle = c.b;
                        }
                    });
                    grid.focus();
                    mousemove(grid.canvas, 94, 10);
                    mousedown(grid.canvas, 94, 10);
                    mousemove(grid.canvas, 190, 10, grid.canvas);
                    mousemove(document.body, 190, 10, grid.canvas);
                    mouseup(document.body, 190, 10, grid.canvas);
                    setTimeout(function () {
                        assertPxColor(grid, 100, 36, c.b, done);
                    }, 10);
                });
                it('Resize a column from a cell.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        borderDragBehavior: 'resize',
                        allowColumnResizeFromCell: true,
                        style: {
                            cellWidth: 50
                        }
                    });
                    grid.addEventListener('rendercell', function (e) {
                        if (e.cell.columnIndex === 0) {
                            e.ctx.fillStyle = c.b;
                        }
                    });
                    setTimeout(function () {
                        grid.focus();
                        mousemove(grid.canvas, 94, 36);
                        mousedown(grid.canvas, 94, 36);
                        mousemove(grid.canvas, 190, 36, grid.canvas);
                        mousemove(document.body, 190, 36, grid.canvas);
                        mouseup(document.body, 190, 36, grid.canvas);
                        assertPxColor(grid, 110, 36, c.b, done);
                    }, 1);
                });
                it('Resize a row.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        style: {
                            cellWidth: 50
                        }
                    });
                    grid.addEventListener('rendercell', function (e) {
                        if (e.cell.columnIndex === -1 && e.cell.rowIndex === 0) {
                            e.ctx.fillStyle = c.b;
                        }
                    });
                    setTimeout(function () {
                        grid.focus();
                        mousemove(grid.canvas, 10, 48);
                        mousedown(grid.canvas, 10, 48);
                        mousemove(grid.canvas, 10, 100, grid.canvas);
                        mousemove(document.body, 10, 100, grid.canvas);
                        mouseup(document.body, 10, 100, grid.canvas);
                        assertPxColor(grid, 10, 90, c.b, done);
                    }, 1);
                });
                it('Resize a row from a cell.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        allowRowResizeFromCell: true,
                        borderDragBehavior: 'resize',
                        style: {
                            cellWidth: 50
                        }
                    });
                    grid.addEventListener('rendercell', function (e) {
                        if (e.cell.columnIndex === -1 && e.cell.rowIndex === 0) {
                            e.ctx.fillStyle = c.b;
                        }
                    });
                    setTimeout(function () {
                        grid.focus();
                        mousemove(grid.canvas, 40, 48);
                        mousedown(grid.canvas, 40, 48);
                        mousemove(grid.canvas, 40, 100, grid.canvas);
                        mousemove(document.body, 40, 100, grid.canvas);
                        mouseup(document.body, 40, 100, grid.canvas);
                        assertPxColor(grid, 10, 90, c.b, done);
                    }, 1);
                });
            });
            describe('Formatters', function () {
                it('Should format values using formating functions', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: ''}],
                        schema: [{name: 'd', type: 's'}],
                        formatters: {
                            s: function () {
                                return blocks;
                            }
                        }
                    });
                    assertPxColor(grid, 90, 32, c.black, done);
                });
            });
            describe('Sorters', function () {
                it('Should sort a string, should handle null and undefined', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{a: 'a'}, {a: 'b'}, {a: 'c'}, {a: 'd'}, {a: null}, {a: undefined}],
                        schema: [{name: 'a', type: 'string'}]
                    });
                    grid.order('a', 'desc');
                    done(assertIf(grid.data[0].a !== 'd', 'expected to see sort by string desc'));
                });
                it('Should sort numbers', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{a: 0}, {a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}],
                        schema: [{name: 'a', type: 'number'}]
                    });
                    grid.order('a', 'desc');
                    done(assertIf(grid.data[0].a !== 5, 'expected to see sort by number desc'));
                });
                it('Should sort date', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{a: 1503307131397}, {a: 1503307132397},
                            {a: 1503307133397}, {a: 1503307134397}, {a: 1503307135397}, {a: 1503307136397}],
                        schema: [{name: 'a', type: 'date'}]
                    });
                    grid.formatters.date =  function (e) {
                        return new Date(e.cell.value).toISOString();
                    };
                    grid.order('a', 'desc');
                    done(assertIf(grid.data[0].a !== 1503307136397, 'expected to see sort by date desc'));
                });
                it('Should set orderBy', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
                        schema: [{ name: 'a', type: 'string' }]
                    });
                    if (grid.orderBy !== null) {
                        throw new Error('expected orderBy to be null initially')
                    }
                    grid.order('a', 'desc');
                    done(assertIf(grid.orderBy !== 'a', 'expected orderBy to be set'));
                });
                it('Should set orderDirection', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
                        schema: [{ name: 'a', type: 'string' }]
                    });
                    if (grid.orderDirection !== 'asc') {
                        throw new Error('expected orderBy to be asc initially')
                    }
                    grid.order('a', 'desc');
                    done(assertIf(grid.orderDirection !== 'desc', 'expected orderDirection to be set'));
                });
                it('Should sort with string sorter if type sorter undefined', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ a: '0' }, { a: '10' }, { a: '2' }],
                        schema: [{ name: 'a', type: 'xxx' }],
                        formatters: { xxx: function (e) { return e.cell.value.toString(); }}
                    });
                    grid.order('a', 'desc');
                    done(assertIf(grid.data[0].a !== '2', 'expected to see sort by string desc'));
                });
                it('Should preserve current sort order, effectively allowing sort on multiple columns', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ a: 'a', b: 'a' }, { a: 'b', b: 'a' }, { a: 'c', b: 'b' }],
                        schema: [{ name: 'a', type: 'string' }, { name: 'b', type: 'string' }]
                    });
                    grid.order('a', 'desc');
                    grid.order('b', 'asc');
                    done(assertIf(grid.data[0].a !== 'b', 'expected to see sort by a desc then b asc'));
                });
                it('Should throw when a nonexistant column name is passed', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
                        schema: [{ name: 'a', type: 'string' }]
                    });
                    var err;
                    try {
                        grid.order('x', 'desc');
                    } catch (e) {
                        err = e
                    }
                    done(assertIf(typeof err === 'undefined', 'Error not thrown'));
                });
                it('Should raise beforesortcolumn before sort', function (done) {
                    var err = new Error('Expected beforesortcolumn event to be raised');
                    var grid = g({
                        test: this.test,
                        data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
                        schema: [{ name: 'a', type: 'string' }]
                    });
                    grid.addEventListener('beforesortcolumn', function (e) {
                        err = assertIf(e.name !== 'a', 'name should be "a" but was "%s"', e.column) ||
                              assertIf(e.direction !== 'desc', 'direction should be "desc" but was "%s"', e.direction) ||
                              assertIf(grid.data[0].a !== 'a', 'expected data to not be sorted in event');
                    });
                    grid.order('a', 'desc');
                    done(err || assertIf(grid.data[0].a !== 'c', 'expected data to be sorted'));
                });
                it('Should not sort when beforesortcolumn prevents default', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
                        schema: [{ name: 'a', type: 'string' }]
                    });
                    grid.addEventListener('beforesortcolumn', function (e) { e.preventDefault(); });
                    grid.order('a', 'desc');
                    done(assertIf(grid.data[0].a !== 'a', 'expected no change in sort order'));
                });
                it('Should raise sortcolumn event after sort', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
                        schema: [{ name: 'a', type: 'string' }]
                    });
                    grid.addEventListener('sortcolumn', function (e) {
                        done(assertIf(e.name !== 'a', 'name should be "a" but was "%s"', e.column) ||
                             assertIf(e.direction !== 'desc', 'direction should be "desc" but was "%s"', e.direction) ||
                             assertIf(grid.data[0].a !== 'c', 'expected data to be sorted'));
                    });
                    grid.order('a', 'desc');
                });
                it('Should raise sortcolumn event only once', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
                        schema: [{ name: 'a', type: 'string' }]
                    });
                    var callCnt = 0;
                    grid.addEventListener('sortcolumn', function (e) { callCnt++; });
                    grid.order('a', 'desc');

                    done(assertIf(callCnt !== 1, 'expected sort column to only be called once'));
                });
                it('Should not raise sortcolumn event when beforesortcolumn prevents default', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ a: 'a' }, { a: 'b' }, { a: 'c' }],
                        schema: [{ name: 'a', type: 'string' }]
                    });
                    grid.addEventListener('beforesortcolumn', function (e) { e.preventDefault(); });
                    grid.addEventListener('sortcolumn', function (e) { throw new Error("sortcolumn event"); });
                    grid.order('a', 'desc');
                    done();
                });
                it('Should apply the schema sorter to sort data', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ a: 'ab' }, { a: 'ba' }, { a: 'cd' }, { a: 'dc' }],
                        schema: [{
                            name: 'a',
                            type: 'string',
                            sorter: function (col, dir) {
                                var mult = (dir === "desc" ? -1 : 1);
                                return function (x, y) {
                                    var x1 = x[col].charCodeAt(1), y1 = y[col].charCodeAt(1);
                                    return mult * (x1 - y1);
                                }
                            }
                        }]
                    });
                    grid.order('a', 'desc');
                    done(assertIf(grid.data[0].a !== 'cd', 'expected schema sorter to be used'));
                });
                it('Should reapply current sort after data set', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ a: 'a', b: 'a' }, { a: 'b', b: 'b' }, { a: 'c', b: 'c' }],
                        schema: [{ name: 'a', type: 'string' }, { name: 'b', type: 'string' }]
                    });
                    grid.order('a', 'desc');
                    grid.order('b', 'asc');
                    grid.data = [{ a: 'a', b: 'a' }, { a: 'b', b: 'a' }, { a: 'c', b: 'b' }];
                    done(assertIf(grid.data[0].a !== 'b', 'expected to see sort by a desc then b asc'));
                });
                it('Should reapply current sort after filter', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ a: 'a', b: 'a' }, { a: 'b', b: 'a' }, { a: 'c', b: 'b' }],
                        schema: [{ name: 'a', type: 'string' }, { name: 'b', type: 'string' }]
                    });
                    grid.order('a', 'desc');
                    grid.setFilter('b', 'a');
                    done(assertIf(grid.data[0].a !== 'b', 'expected to see sort by a desc then b asc'));
                });
            });
            describe('Selections', function () {
                it('Should select all', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.selectAll();
                    grid.style.activeCellSelectedBackgroundColor = c.y;
                    grid.style.cellSelectedBackgroundColor = c.y;
                    assertPxColor(grid, 90, 30, c.y, function (err) {
                        if (err) { return done(err); }
                        assertPxColor(grid, 360, 90, c.y, function (err) {
                            if (err) { return done(err); }
                            done(assertIf(grid.selectedRows.length !== smallData().length,
                                    'Expected data interface `selectedRows` to contain all rows.  It does not.'));
                        });
                    });
                });
                it('Should select all via ctrl/cmnd a', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    de(grid.controlInput, 'keydown', {key: "a", ctrlKey: true });
                    setTimeout(function () {
                        grid.style.activeCellSelectedBackgroundColor = c.y;
                        grid.style.cellSelectedBackgroundColor = c.y;
                        assertPxColor(grid, 90, 30, c.y, function (err) {
                            if (err) { return done(err); }
                            assertPxColor(grid, 360, 90, c.y, function (err) {
                                if (err) { return done(err); }
                                done(assertIf(grid.selectedRows.length !== smallData().length,
                                        'Expected data interface `selectedRows` to contain all rows.  It does not.'));
                            });
                        });
                    }, 100);
                });
                it('Selection keystrokes should do nothing if the grid is not focused.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    de(grid.controlInput, 'keydown', {key: "a", ctrlKey: true });
                    setTimeout(function () {
                        grid.style.activeCellBackgroundColor = c.b;
                        grid.style.cellBackgroundColor = c.b;
                        assertPxColor(grid, 90, 30, c.b, function (err) {
                            if (err) { return done(err); }
                            assertPxColor(grid, 360, 90, c.b, function (err) {
                                if (err) { return done(err); }
                                done(assertIf(grid.selectedRows.length === 1,
                                        'Expected just the first row to be selected'));
                            });
                        });
                    }, 100);
                });
                it('Should de-select all via esc', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.focus();
                    de(grid.controlInput, 'keydown', {key: "Escape"});
                    setTimeout(function () {
                        grid.style.activeCellBackgroundColor = c.y;
                        grid.style.cellBackgroundColor = c.y;
                        assertPxColor(grid, 90, 30, c.y, function (err) {
                            if (err) { return done(err); }
                            assertPxColor(grid, 360, 90, c.y, function (err) {
                                if (err) { return done(err); }
                                done(assertIf(grid.selectedRows.length !== 0,
                                        'Expected data interface `selectedRows` to contain no rows.'));
                            });
                        });
                    }, 100);
                });
                it('Should select a row', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.selectRow(0);
                    grid.style.activeCellSelectedBackgroundColor = c.y;
                    grid.style.cellSelectedBackgroundColor = c.y;
                    grid.style.cellBackgroundColor = c.b;
                    assertPxColor(grid, 90, 30, c.y, function (err) {
                        if (err) { return done(err); }
                        assertPxColor(grid, 360, 90, c.b, function (err) {
                            if (err) { return done(err); }
                            done(assertIf(grid.selectedRows.length !== 1,
                                    'Expected data interface `selectedRows` 1 row.  It does not.'));
                        });
                    });
                });
                it('Should select a row, then add to the selection with control', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.selectRow(0);
                    grid.selectRow(2, true);
                    grid.style.activeCellSelectedBackgroundColor = c.y;
                    grid.style.cellSelectedBackgroundColor = c.y;
                    grid.style.cellBackgroundColor = c.b;
                    assertPxColor(grid, 90, 30, c.y, function (err) {
                        if (err) { return done(err); }
                        assertPxColor(grid, 360, 90, c.y, function (err) {
                            if (err) { return done(err); }
                            done(assertIf(grid.selectedRows.filter(function (row) {
                                return row[0] !== null;
                            }).length !== 2, 'Expected data interface `selectedRows` 2 rows.  It does not.'));
                        });
                    });
                });
                it('Should select a row, then add to the selection with control, then remove it with control', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.selectRow(0);
                    grid.selectRow(2, true);
                    grid.selectRow(0, true);
                    grid.style.activeCellSelectedBackgroundColor = c.y;
                    grid.style.cellSelectedBackgroundColor = c.y;
                    grid.style.cellBackgroundColor = c.b;
                    assertPxColor(grid, 340, 30, c.b, function (err) {
                        if (err) { return done(err); }
                        assertPxColor(grid, 360, 90, c.y, function (err) {
                            if (err) { return done(err); }
                            done(assertIf(grid.selectedRows.filter(function (row) {
                                return row !== null;
                            }).length !== 1, 'Expected data interface `selectedRows` 1 row.  It does not.'));
                        });
                    });
                });
                it('Should select a range of rows by holding shift', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.selectRow(0);
                    grid.selectRow(2, null, true);
                    grid.style.activeCellSelectedBackgroundColor = c.y;
                    grid.style.cellSelectedBackgroundColor = c.y;
                    grid.style.cellBackgroundColor = c.b;
                    assertPxColor(grid, 90, 30, c.y, function (err) {
                        if (err) { return done(err); }
                        assertPxColor(grid, 360, 90, c.y, function (err) {
                            if (err) { return done(err); }
                            done(assertIf(grid.selectedRows.filter(function (row) {
                                return row !== null;
                            }).length !== 3, 'Expected data interface `selectedRows` 1 row.  It does not.'));
                        });
                    });
                });
                it('Should select a column', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.selectColumn(0);
                    grid.style.activeCellSelectedBackgroundColor = c.y;
                    grid.style.cellSelectedBackgroundColor = c.y;
                    grid.style.cellBackgroundColor = c.b;
                    assertPxColor(grid, 90, 30, c.y, function (err) {
                        if (err) { return done(err); }
                        assertPxColor(grid, 360, 90, c.b, function (err) {
                            if (err) { return done(err); }
                            done(assertIf(grid.selectedRows.length !== smallData().length,
                                    'Expected data interface `selectedRows` to contain all rows.  It does not.'));
                        });
                    });
                });
                it('Should select a column, then add a column to the selection.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.selectColumn(0);
                    grid.selectColumn(1, true);
                    grid.style.activeCellSelectedBackgroundColor = c.y;
                    grid.style.cellSelectedBackgroundColor = c.y;
                    grid.style.cellBackgroundColor = c.b;
                    assertPxColor(grid, 90, 30, c.y, function (err) {
                        if (err) { return done(err); }
                        assertPxColor(grid, 360, 90, c.y, function (err) {
                            if (err) { return done(err); }
                            done(assertIf(grid.selectedRows.length !== smallData().length,
                                    'Expected data interface `selectedRows` to contain all rows.  It does not.'));
                        });
                    });
                });
                it('Should select a range of columns via shift.', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        style: {
                            cellWidth: 50
                        }
                    });
                    grid.selectColumn(0);
                    grid.selectColumn(2, false, true);
                    grid.style.activeCellSelectedBackgroundColor = c.y;
                    grid.style.cellSelectedBackgroundColor = c.y;
                    grid.style.cellBackgroundColor = c.b;
                    assertPxColor(grid, 70, 30, c.y, function (err) {
                        if (err) { return done(err); }
                        assertPxColor(grid, 170, 90, c.y, function (err) {
                            if (err) { return done(err); }
                            done(assertIf(grid.selectedRows.length !== smallData().length,
                                    'Expected data interface `selectedRows` to contain all rows.  It does not.'));
                        });
                    });
                });
                it('Should select a column, then add to the column selection and immediately remove it', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.selectColumn(0);
                    grid.selectColumn(1, true);
                    grid.selectColumn(1, true);
                    grid.style.activeCellSelectedBackgroundColor = c.y;
                    grid.style.cellSelectedBackgroundColor = c.y;
                    grid.style.cellBackgroundColor = c.b;
                    assertPxColor(grid, 90, 30, c.y, function (err) {
                        if (err) { return done(err); }
                        assertPxColor(grid, 360, 90, c.b, function (err) {
                            if (err) { return done(err); }
                            done(assertIf(grid.selectedRows.length !== smallData().length,
                                    'Expected data interface `selectedRows` to contain all rows.  It does not.'));
                        });
                    });
                });
                it('Should select an area when click and drag occurs', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.style.activeCellSelectedBackgroundColor = c.y;
                    grid.style.cellSelectedBackgroundColor = c.y;
                    grid.style.cellBackgroundColor = c.fu;
                    setTimeout(function () {
                        grid.focus();
                        mousemove(grid.canvas, 67, 30);
                        mousedown(grid.canvas, 67, 30);
                        mousemove(grid.canvas, 320, 65, grid.canvas);
                        mousemove(document.body, 320, 65, grid.canvas);
                        mouseup(document.body, 320, 65, grid.canvas);
                        mouseup(grid.canvas, 320, 65, grid.canvas);
                        click(grid.canvas, 320, 65);
                        assertPxColor(grid, 67, 30, c.y, function (err) {
                            if (err) { return done(err); }
                            assertPxColor(grid, 350, 65, c.y, function (err) {
                                if (err) { return done(err); }
                                assertPxColor(grid, 360, 80, c.fu, function (err) {
                                    if (err) { return done(err); }
                                    done(assertIf(grid.selectedRows.length !== smallData().length - 1,
                                            'Expected data interface `selectedRows` to contain all but one rows.  It does not.'));
                                });
                            });
                        });
                    }, 1);
                });
                it('Should remove a cell from selection when holding control and clicking a selected cell', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.style.activeCellSelectedBackgroundColor = c.y;
                    grid.style.cellHoverBackgroundColor = c.b;
                    grid.style.cellSelectedBackgroundColor = c.y;
                    grid.style.cellBackgroundColor = c.fu;
                    setTimeout(function () {
                        var p = bb(grid.canvas);
                        grid.focus();
                        mousemove(grid.canvas, 67, 30);
                        mousedown(grid.canvas, 67, 30);
                        mousemove(grid.canvas, 320, 65, grid.canvas);
                        mousemove(document.body, 320, 65, grid.canvas);
                        mouseup(document.body, 320, 65, grid.canvas);
                        mouseup(grid.canvas, 320, 65, grid.canvas);
                        click(grid.canvas, 320, 65);
                        // ctrl click
                        de(grid.canvas, 'mousemove', {clientX: 320 + p.left, clientY: 65 + p.top, ctrlKey: true });
                        de(grid.canvas, 'mousedown', {clientX: 320 + p.left, clientY: 65 + p.top, ctrlKey: true });
                        de(document.body, 'mouseup', {clientX: 320 + p.left, clientY: 65 + p.top, ctrlKey: true });
                        de(grid.canvas, 'mouseup', {clientX: 320 + p.left, clientY: 65 + p.top, ctrlKey: true });
                        assertPxColor(grid, 67, 30, c.y, function (err) {
                            if (err) { return done(err); }
                            assertPxColor(grid, 350, 65, c.b, function (err) {
                                if (err) { return done(err); }
                                assertPxColor(grid, 360, 80, c.fu, function (err) {
                                    if (err) { return done(err); }
                                    done(assertIf(grid.selectedRows.length !== smallData().length - 1
                                        && grid.selectedRows[1].col2 === undefined,
                                            'Expected data interface `selectedRows` to contain row 1 col1 and col2, row 2 col 1.  It does not.'));
                                });
                            });
                        });
                    }, 1);
                });
            });
            describe('Filters', function () {
                it('Should filter for given value', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: 'abcd'}, {d: 'edfg'}]
                    });
                    grid.setFilter('d', 'edfg');
                    done(assertIf(grid.data.length === 0 && grid.data[0].d === 'edfg',
                        'Expected filter to remove all but 1 row.'));
                });
                it('Should remove all filters', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: 'abcd', e: 'qwert'}, {d: 'edfg', e: 'asdfg'}]
                    });
                    grid.setFilter('d', 'edfg');
                    grid.setFilter('e', 'asdfg');
                    grid.setFilter();
                    done(assertIf(grid.data.length !== 2, 'Expected to see all the records return.'));
                });
                it('Should remove a specific filter by passing empty string', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: 'abcd', e: 'qwert'}, {d: 'edfg', e: 'asdfg'}]
                    });
                    grid.setFilter('d', 'edfg');
                    grid.setFilter('e', 'asdfg');
                    grid.setFilter('e', '');
                    done(assertIf(grid.data.length !== 1, 'Expected to see 1 of the records.'));
                });
                it('Should remove a specific filter by passing undefined', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: 'abcd', e: 'qwert'}, {d: 'edfg', e: 'asdfg'}]
                    });
                    grid.setFilter('d', 'edfg');
                    grid.setFilter('e', 'asdfg');
                    grid.setFilter('e');
                    done(assertIf(grid.data.length !== 1, 'Expected to see 1 of the records.'));
                });
                it('Should use RegExp as a filter', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: 'abcd'}, {d: 'edfg'}]
                    });
                    grid.setFilter('d', '/\\w/');
                    done(assertIf(grid.data.length === 0 && grid.data[0].d === 'edfg',
                        'Expected to see a row after a RegExp value.'));
                });
                it('Should tolerate RegExp errors', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{d: 'abcd'}, {d: 'edfg'}]
                    });
                    grid.setFilter('d', '/{1}/');
                    done();
                });
                it('Should not reset filter when non-existant columns passed to setFilter', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ d: 'abcd' }, { d: 'edfg' }]
                    });
                    grid.setFilter('d', 'a');
                    grid.setFilter('x', 'a');
                    done(assertIf(grid.data.length !== 1, 'Expected to see only 1 record.'));
                });
                it('Should apply correct type filtering method when column filter not set', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ num: 1234 }, { num: 1 }],
                        schema: [{ name: 'num', type: 'int' }],
                        filters: { int: function (value, filterFor) { return !filterFor || value.toString() === filterFor; }}
                    });
                    delete grid.schema[0].filter;
                    grid.setFilter('num', '1');
                    done(assertIf(grid.data.length !== 1, 'Expected to see only 1 record.'));
                });
                it('Should apply filter to new data when data is set', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ d: 'abcd' }, { d: 'edfg' }]
                    });
                    grid.setFilter('d', 'a');
                    grid.data = [{ d: 'gfde' }, { d: 'dcba' }]
                    done(assertIf(grid.data.length !== 1, 'Expected to see only 1 record.'));
                });
                it('Should retain filters of columns not in new data when data is set', function (done) {
                    var grid = g({
                        test: this.test,
                        data: [{ d: 'abcd' }, { d: 'edfg' }]
                    });
                    grid.setFilter('d', 'a');

                    grid.data = [{ x: 'aaaa' }, { x: 'aaaa' }]
                    grid.data = [{ d: 'gfde' }, { d: 'dcba' }]

                    done(assertIf(grid.data.length !== 1, 'Expected to see only 1 record.'));
                });
            });
            describe('Attributes', function () {
                it('Should store JSON view state data when a name is passed and view state is altered.', function (done) {
                    var n = 'a' + (new Date().getTime()),
                        k = 'canvasDataGrid-' + n,
                        grid = g({
                            test: this.test,
                            data: smallData(),
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
                        data: smallData()
                    });
                    grid.addEventListener('expandtree', function (e) {
                        assertIf(e.treeGrid === undefined, 'Expected a grid here.');
                        e.treeGrid.style.cornerCellBackgroundColor = c.y;
                        assertPxColor(grid, 10, 34, c.fu, function () {
                            setTimeout(function () {
                                assertPxColor(grid, 60, 60, c.y, done);
                            }, 3);
                        });
                    });
                    grid.style.treeArrowColor = c.fu;
                    click(grid.canvas, 7, 37);
                });
                it('Should be able to close tree grids.', function (done) {
                    var grid = g({
                        test: this.test,
                        tree: true,
                        data: smallData()
                    });
                    grid.addEventListener('expandtree', function (e) {
                        var err = assertIf(e.treeGrid === undefined, 'Expected a grid here.');
                        if (err) { return done(err); }
                        e.treeGrid.style.cornerCellBackgroundColor = c.y;
                    });
                    grid.style.treeArrowColor = c.fu;
                    grid.style.cellBackgroundColor = c.b;
                    click(grid.canvas, 7, 37);
                    click(grid.canvas, 7, 37);
                    setTimeout(function () {
                        assertPxColor(grid, 130, 60, c.b, done);
                    }, 2);
                });
                it('Should render a cell grid.', function (done) {
                    var grid = g({
                        test: this.test,
                        schema: [{name: 'a', type: 'canvas-datagrid'}],
                        data: [{a: [{b: 'c'}]}],
                        cellGridAttributes: {
                            style: {
                                activeCellBackgroundColor: c.b
                            }
                        }
                    });
                    setTimeout(function () {
                        assertPxColor(grid, 130, 60, c.b, done);
                    }, 30);
                });
                it('Should display a new row', function (done) {
                    var grid = g({
                        test: this.test,
                        showNewRow: true,
                        data: [{a: 'a'}]
                    });
                    grid.style.cellBackgroundColor = c.y;
                    assertIf(grid.data.length !== 1, 'Expected there to be exactly 1 row.');
                    assertPxColor(grid, 60, 60, c.y, done);
                });
                it('Should insert data into the new row', function (done) {
                    var ev, grid = g({
                        test: this.test,
                        showNewRow: true,
                        data: [{a: 'a'}]
                    });
                    ev = new Event('keydown');
                    ev.key = "Enter";
                    grid.style.cellBackgroundColor = c.y;
                    grid.beginEditAt(0, 1);
                    grid.input.value = 'abcd';
                    grid.input.dispatchEvent(ev);
                    assertPxColor(grid, 60, 90, c.y, function (err) {
                        if (err) { return done(err); }
                        done(assertIf(grid.data.length !== 2,
                            'expected there to be exactly 3 row.'));
                    });
                });
                it('Should NOT store JSON view state data when saveAppearance is false.', function (done) {
                    var n = 'a' + (new Date().getTime()),
                        k = 'canvasDataGrid-' + n,
                        grid = g({
                            test: this.test,
                            data: smallData(),
                            name: n,
                            saveAppearance: false
                        });
                    grid.order('col1');
                    assertIf(JSON.parse(localStorage.getItem(k)),
                        'Expected no storage item %s.', n);
                    localStorage.removeItem(k);
                    done();
                });
                it('Should store JSON view state data and recall it.', function (done) {
                    var n = 'a' + (new Date().getTime()),
                        k = 'canvasDataGrid-' + n,
                        a = {
                            test: this.test,
                            data: smallData(),
                            name: n,
                            saveAppearance: true
                        },
                        grid = g(a);
                    setTimeout(function () {
                        grid.focus();
                        marker(grid, 67, 10);
                        mousemove(grid.canvas, 67, 10);
                        mousedown(grid.canvas, 67, 10);
                        mouseup(document.body, 67, 10, grid.canvas);
                        click(grid.canvas, 67, 10);
                        setTimeout(function () {
                            // make the test look less ugly
                            // grid.parentNode.parentNode.parentNode.removeChild(grid.parentNode.parentNode);
                            grid.dispose();
                            setTimeout(function () {
                                grid = g(a);
                                localStorage.removeItem(k);
                                setTimeout(function () {
                                    done(assertIf(grid.data[0].col1 !== 'bar',
                                        'Expected data to be ordered when new grid is created'));
                                }, 1);
                            }, 1);
                        });
                    }, 1);
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
                    keydown(grid.controlInput, "ArrowDown");
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
                    keydown(grid.controlInput, "ArrowDown");
                    done(assertIf(grid.selectedRows.length === 0, 'Expected selection to not follow active cell'));
                });
                it('Should use a textarea to edit when multiLine is true', function (done) {
                    var grid = g({
                        test: this.test,
                        multiLine: true,
                        data: smallData()
                    });
                    grid.beginEditAt(0, 0);
                    done(assertIf(grid.input.tagName !== 'TEXTAREA', 'Expected a textarea here'));
                    grid.endEdit();
                });
                it('Should use an input to edit when multiLine is false', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    grid.beginEditAt(0, 0);
                    done(assertIf(grid.input.tagName !== 'INPUT', 'Expected an input here'));
                    grid.endEdit();
                });
                it('Should not be editable when editable is false', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        editable: false
                    });
                    click(grid.canvas, 60, 37);
                    keydown(grid.controlInput, "Enter");
                    done(assertIf(grid.input !== undefined, 'Expected no input when UI enters edit mode.'));
                });
                it('Should be editable when editable is true', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData()
                    });
                    click(grid.canvas, 60, 37);
                    keydown(grid.controlInput, "Enter");
                    done(assertIf(grid.input === undefined, 'Expected an input when UI enters edit mode.'));
                    grid.endEdit();
                });
                it('Should allow column reordering when allowColumnReordering is true', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(3, 3, function (y, x) { return x + ':' + y; }),
                        style: {
                            cellWidth: 50
                        }
                    });
                    setTimeout(function () {
                        grid.focus();
                        marker(grid, 67, 10);
                        mousemove(grid.canvas, 67, 10);
                        mousedown(grid.canvas, 67, 10);
                        mousemove(grid.canvas, 140, 10, grid.canvas);
                        mousemove(document.body, 140, 10, grid.canvas);
                        mouseup(document.body, 140, 10, grid.canvas);
                        grid.draw();
                        grid.addEventListener('click', function (e) {
                            done(assertIf(e.cell.value !== '1:0', 'Expected to see the value from column 2 here, instead saw %n.', e.cell.value));
                        });
                        // lib intentionally ignoring next click - required to make the ux work as desired
                        click(grid.canvas, 60, 37);
                        click(grid.canvas, 60, 37);
                    }, 1);
                });
                it('Should reverse column reordering when allowColumnReordering is true and clicked twice', function (done) {
                    var n = 'a' + (new Date().getTime()),
                        k = 'canvasDataGrid-' + n,
                        a = {
                            test: this.test,
                            data: smallData(),
                            name: n,
                            saveAppearance: true
                        },
                        grid = g(a);
                    setTimeout(function () {
                        grid.focus();
                        marker(grid, 67, 10);
                        mousemove(grid.canvas, 67, 10);
                        mousedown(grid.canvas, 67, 10);
                        mouseup(document.body, 67, 10, grid.canvas);
                        click(grid.canvas, 67, 10);
                        setTimeout(function () {
                            mousemove(grid.canvas, 67, 10);
                            mousedown(grid.canvas, 67, 10);
                            mouseup(document.body, 67, 10, grid.canvas);
                            click(grid.canvas, 67, 10);
                            setTimeout(function () {
                                setTimeout(function () {
                                    done(assertIf(grid.data[0].col1 !== 'foo',
                                        'Expected data to be ordered when new grid is created'));
                                }, 1);
                            }, 1);
                        });
                    }, 1);
                });
                it('Should draw column reorder markers when allowColumnReordering is true and reordering', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        style: {
                            cellWidth: 50,
                            reorderMarkerBackgroundColor: c.r,
                            reorderMarkerBorderWidth: 4,
                            reorderMarkerBorderColor: c.y,
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
                        grid.draw();
                        setTimeout(function () {
                            async.parallel([
                                assertPxColorFn(grid, 178, 30, c.r),
                                assertPxColorFn(grid, 159, 10, c.y),
                                assertPxColorFn(grid, 195, 50, c.b)
                            ], function (err) {
                                done(err);
                            });
                        }, 10);
                    }, 10);
                });
                it('Should allow row reordering when allowRowReordering is true', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        allowRowReordering: true,
                        style: {
                            cellWidth: 50
                        }
                    });
                    setTimeout(function () {
                        grid.focus();
                        marker(grid, 10, 32);
                        mousemove(grid.canvas, 10, 29);
                        mousedown(grid.canvas, 10, 29);
                        mousemove(grid.canvas, 10, 90, grid.canvas);
                        mousemove(document.body, 10, 90, grid.canvas);
                        mouseup(document.body, 10, 90, grid.canvas);
                        grid.draw();
                        grid.addEventListener('click', function (e) {
                            done(assertIf(e.cell.value !== 'bar', 'Expected to see the value from row 2 here.'));
                        });
                        // lib intentionally ignoring next click - required to make the ux work as desired
                        click(grid.canvas, 60, 29);
                        click(grid.canvas, 60, 29);
                    }, 1);
                });
                it('Should draw row reorder markers when allowRowReordering is true and reordering', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        allowRowReordering: true,
                        style: {
                            cellWidth: 50,
                            reorderMarkerBackgroundColor: c.y,
                            reorderMarkerBorderWidth: 4,
                            reorderMarkerBorderColor: c.fu,
                            reorderMarkerIndexBorderColor: c.b,
                            reorderMarkerIndexBorderWidth: 4
                        }
                    });
                    setTimeout(function () {
                        grid.focus();
                        mousemove(grid.canvas, 10, 29);
                        mousedown(grid.canvas, 10, 29);
                        mousemove(grid.canvas, 10, 90, grid.canvas);
                        mousemove(document.body, 10, 90, grid.canvas);
                        assertPxColor(grid, 10, 98, c.b, function (err) {
                            if (err) { return done(err); }
                            assertPxColor(grid, 10, 85, c.fu, function (err) {
                                if (err) { return done(err); }
                                assertPxColor(grid, 30, 90, c.y, done);
                            });
                        });
                        grid.draw();
                    }, 10);
                });
                it('The context menu filter should not show up when showFilter is false', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        showFilter: false
                    });
                    grid.addEventListener('contextmenu', function (e) {
                        setTimeout(function () {
                            done(assertIf(e.items.length !== 5,
                                'Expected to only see two items in the context menu at this point.'));
                        }, 1);
                    });
                    contextmenu(grid.canvas, 60, 37);
                });
                it('The context menu filter should show up when showFilter is true', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        showFilter: true
                    });
                    grid.addEventListener('contextmenu', function (e) {
                        setTimeout(function () {
                            done(assertIf(e.items.length !== 6,
                                'Expected to only see two items in the context menu at this point.'));
                        }, 1);
                    });
                    contextmenu(grid.canvas, 60, 37);
                });
                it('Clicking the corner cell will select all.', function (done) {
                    var d = makeData(10, 10, function (x) { return x; }), grid = g({
                        test: this.test,
                        data: d,
                        columnHeaderClickBehavior: 'sort'
                    });
                    marker(grid, 60, 12);
                    mousemove(grid.canvas, 60, 12);
                    click(grid.canvas, 60, 12);
                    setTimeout(function () {
                        marker(grid, 12, 12);
                        mousemove(grid.canvas, 12, 12);
                        click(grid.canvas, 12, 12);
                        done(assertIf(grid.selectedRows.length !== d.length, 'Expected data to be selected.'));
                    }, 1);
                });
                it('Clicking a header cell with columnHeaderClickBehavior set to sort should sort the column asc', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        columnHeaderClickBehavior: 'sort'
                    });
                    marker(grid, 60, 12);
                    mousemove(grid.canvas, 60, 12);
                    click(grid.canvas, 60, 12);
                    done(assertIf(grid.data[0].col1 !== 'bar', 'Expected data to be sorted.'));
                });
                it('Clicking a header cell with columnHeaderClickBehavior set to select should select the column', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        columnHeaderClickBehavior: 'select'
                    });
                    marker(grid, 60, 12);
                    mousemove(grid.canvas, 60, 12);
                    click(grid.canvas, 60, 12);
                    done(assertIf(grid.selectedRows.length !== 3
                        || grid.selectedCells[0].col2 !== undefined, 'Expected every row to be selected.'));
                });
                it('Clicking a header cell with columnHeaderClickBehavior set to select then clicking another with ctrl held should add to the selection', function (done) {
                    var grid = g({
                        test: this.test,
                        data: smallData(),
                        columnHeaderClickBehavior: 'select',
                        style: {
                            cellWidth: 50
                        }
                    });
                    marker(grid, 60, 12);
                    mousemove(grid.canvas, 60, 12);
                    click(grid.canvas, 60, 12);
                    mousemove(grid.canvas, 175, 12);
                    click(grid.canvas, 175, 12, null, {ctrlKey: true});
                    done(assertIf(grid.selectedRows.length !== 3
                        || grid.selectedCells[0].col2 !== undefined
                        || grid.selectedCells[0].col3 !== 'a', 'Expected every row to be selected and column 2 to not be selected.'));
                });
                it('Clicking a header cell with columnHeaderClickBehavior set to select then clicking another with shift held should add a range to the selection', function (done) {
                    var grid = g({
                        test: this.test,
                        data: makeData(3, 3, function (y, x) { return x + ':' + y; }),
                        columnHeaderClickBehavior: 'select',
                        style: {
                            cellWidth: 50
                        }
                    });
                    marker(grid, 40, 12);
                    mousemove(grid.canvas, 40, 12);
                    click(grid.canvas, 40, 12);
                    mousemove(grid.canvas, 175, 12);
                    click(grid.canvas, 175, 12, null, {shiftKey: true});
                    done(assertIf(grid.selectedRows.length !== 3
                        || grid.selectedCells[0].c !== '2:0'
                        || grid.selectedCells[0].b !== '1:0', 'Expected everything to be selected.'));
                });
            });
        });
    });
}());
