/*jslint browser: true, unparam: true, evil: true*/
/*globals canvasDatagrid: false, ace: false, requestAnimationFrame: false, alert: false */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    // setup a page to view the samples in.
    // This page should be kept vanilla css to not
    // conflict with docs styles
    function createSample(args) {
        if (!args.parentNode) {
            throw new Error('Parent node required');
        }
        var examples = {},
            title = document.createElement('div'),
            aside = document.createElement('div'),
            toc = document.createElement('ul'),
            forms = document.createElement('div');
        title.innerHTML = '<h1>Tutorials</h1><br>The following tutorials demonstrate some of the basic features of canvas-datagrid.  Each tutorial is setup to display the grid in the box just below the tutorial code.  In the tutorial code <i>parentNode</i> is a reference to the box (<i>div { height: 300px; } </i>) just below the code.  You can modify and execute the code in each tutorial or open it up in JS Fiddle.';
        toc.className = 'samples-toc';
        aside.className = 'sample-aside';
        forms.className = 'sample-content';
        args.parentNode.appendChild(forms);
        args.parentNode.appendChild(aside);
        forms.appendChild(title);
        aside.appendChild(toc);
        title.style.marginLeft = '10px';
        // --- examples section
        examples['Create a new grid|A grid is created and data is set in one command.  Data can be an array of objects, an array of arrays or a mixed array of objects, arrays and primitives.'] = function (parentNode) {
            // create a new grid
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
        };
        examples['Set data after instantiation|A grid is created, then data is set afterwards.  You can set data using <i>grid.data = &lt;data&gt;;</i> at anytime.  Data can be an array of objects, an array of arrays or a mixed array of objects, arrays and primitives.'] = function (parentNode) {
            // create a new grid
            var grid = canvasDatagrid({
                parentNode: parentNode
            });
            grid.data = [
                {col1: 'foo', col2: 0, col3: 'a'},
                {col1: 'bar', col2: 1, col3: 'b'},
                {col1: 'baz', col2: 2, col3: 'c'}
            ];
        };
        examples['Format data|Data is formatted using the data type setting in the schema.  The data type is mapped to the `grid.formatters` object.  In the following example col2 is data type `date` which will format data using the `grid.formatters.date` function.  By default the string formatter is used to format all data.  This method of formatting is faster than using the <i>rendertext</i> event.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 1501744914661, col3: 'a'},
                    {col1: 'bar', col2: 1301744914661, col3: 'b'},
                    {col1: 'baz', col2: 1401744914661, col3: 'c'}
                ],
                schema: [
                    {
                        name: 'col1'
                    },
                    {
                        name: 'col2',
                        type: 'date'
                    },
                    {
                        name: 'col3'
                    },
                ]
            });
            grid.formatters.date = function (e) {
                return new Date(e.cell.value).toISOString();
            };
        };
        examples['Format data using rendertext event|Attach to the <i>rendertext</i> event.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 1501744914661, col3: 'a'},
                    {col1: 'bar', col2: 1301744914661, col3: 'b'},
                    {col1: 'baz', col2: 1401744914661, col3: 'c'}
                ],
                schema: [
                    {
                        name: 'col1'
                    },
                    {
                        name: 'col2',
                        type: 'date'
                    },
                    {
                        name: 'col3'
                    },
                ]
            });
            grid.addEventListener('rendertext', function (e) {
                if (e.cell.rowIndex > -1) {
                    if (e.cell.header.name === 'col2') {
                        e.cell.formattedValue = new Date(e.cell.value).toISOString();
                    }
                }
            });
        };
        examples['Use a textarea to edit cells instead of an input.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                multiLine: true,
                data: [
                    {col1: 'foo\nbar', col2: 0, col3: 'a'},
                    {col1: 'bar\nfoo\nbar', col2: 1, col3: 'b'},
                    {col1: 'baz\nfoo\nbar', col2: 2, col3: 'c'}
                ]
            });
            grid.style.cellHeight = 80;
        };
        examples['Use select instead of input for edits|When a column in the schema includes an <i>enum</i> property, a drop down menu will appear instead of the normal input or textarea.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                schema: [
                    {
                        name: 'col1',
                        enum: [
                            ['foo', 'Foo'],
                            ['bar', 'Bar'],
                            ['baz', 'Baz']
                        ]
                    },
                    {
                        name: 'col2'
                    },
                    {
                        name: 'col3'
                    },
                ],
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
        };
        examples['Detect clicks|Detect which cell was clicked using the <i>click</i> event.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.addEventListener('click', function (e) {
                if (!e.cell) { return; }
                grid.data[0][grid.schema[0].name] = 'Clicked on ' + e.cell.value;
            });
        };
        examples['Detect cell over/out|Detect when a cell has been entered using <i>cellmouseover</i> and <i>cellmouseout</i> events.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.addEventListener('cellmouseover', function (e) {
                if (!e.cell) { return; }
                grid.data[0][grid.schema[0].name] = 'Just arrived at '
                    + e.cell.columnIndex + ', ' + e.cell.rowIndex;

            });
            grid.addEventListener('cellmouseout', function (e) {
                if (!e.cell) { return; }
                grid.data[1][grid.schema[0].name] = 'Just came from '
                    + e.cell.columnIndex + ', ' + e.cell.rowIndex;
            });
        };
        examples['Get data via XHR function.|Fetch data from data.gov and parse the JSON.'] = function (parentNode) {
            var xhr = new XMLHttpRequest(),
                grid = canvasDatagrid({
                    parentNode: parentNode
                });
            function parseOpenData(openData) {
                var data, schema = openData.meta.view.columns;
                data = openData.data.map(function (row) {
                    var r = {};
                    schema.forEach(function (column, index) {
                        r[column.name] = row[index];
                    });
                    return r;
                });
                return {
                    data: data,
                    schema: schema
                };
            }
            xhr.addEventListener('progress', function (e) {
                grid.data = [{ status: 'Loading data: ' + e.loaded + ' of ' + (e.total || 'unknown') + ' bytes...'}];
            });
            xhr.addEventListener('load', function (e) {
                grid.data = [{ status: 'Loading data ' + e.loaded + '...'}];
                var openData = parseOpenData(JSON.parse(this.responseText));
                grid.schema = openData.schema;
                grid.data = openData.data;
            });
            xhr.open('GET', 'https://data.cityofchicago.org/api/views/xzkq-xp2w/rows.json?accessType=DOWNLOAD');
            xhr.send();
        };
        examples['Set filter function|By default, the filter is a RegExp string, you can alter this per data type by adding a function to the object <i>grid.filters.&lt;type&gt;</i>.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.schema = [{name: 'id', type: 'number'}, {name: 'offendit', type: 'string'}];
            grid.data = [
                {id: 0, offendit: 'foo'},
                {id: 1, offendit: 'bar'},
                {id: 2, offendit: 'baz'},
            ];
            grid.filters.number = function (value, filterFor) {
                if (!filterFor) { return true; }
                console.log('number filter executed');
                return value === filterFor;
            };
            grid.setFilter('id', 1);
        };
        examples['Simple context menu|Add your own items to the context menu.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.addEventListener('contextmenu', function (e) {
                e.items.push({
                    title: 'Select all',
                    click: function (ev) {
                        grid.selectArea({
                            top: 0,
                            bottom: grid.data.length - 1,
                            left: 0,
                            right: grid.schema.length - 1
                        });
                        grid.draw();
                    }
                });
            });
        };
        examples['Hierarchal context menus|Add hierarchal items to the context menu.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.addEventListener('contextmenu', function (e) {
                e.items.push({
                    title: 'Top level item',
                    items: [
                        {
                            title: 'Child item #1',
                            click: function (ev) {
                                grid.data[0].col1 = e.cell.value;
                                grid.draw();
                            }
                        },
                        {
                            title: 'Child item #2',
                            click: function (ev) {
                                grid.data[0].col1 = e.cell.value;
                                grid.draw();
                            }
                        }
                    ]
                });
                e.items.push({
                    title: 'You have '
                        + grid.selectedRows.filter(function (row) { return !!row; }).length
                        + ' rows selected'
                });
            });
        };
        examples['Context menu using a function for items|Instead of using an array, you can use a function that returns an array.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.addEventListener('contextmenu', function (e) {
                e.items.push({
                    title: 'Function based child context menu item',
                    items: function () {
                        return [{
                            title: 'I was added via a function',
                            click: function () { return; }
                        }];
                    }
                });
            });
        };
        examples['Asynchronous context items|Instead of an array, you can use a function that invokes a callback.  When you invoke the callback you pass an array to it to add items to the context menu asynchronously.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.addEventListener('contextmenu', function (e) {
                e.items.push({
                    title: 'Asynchronous child context menu item',
                    items: function (callback) {
                        setTimeout(function () {
                            callback([{
                                title: 'I was added later',
                                click: function () { return; }
                            }]);
                        }, 500);
                    }
                });
            });
        };
        examples['Remove context menu items|You can mutate the existing items in the context menu.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.addEventListener('contextmenu', function (e) {
                e.items.splice(0, e.items.length);
                e.items.push({
                    title: 'Just me now'
                });
            });
        };
        examples['Create complex context menu|If you set the value of title to a HTML element reference, you can add complex functionality to the context menu.  To prevent the context menu from closing call <i>e.stopPropagation</i> on the object clicked on.'] = function (parentNode) {
            var content = document.createElement('div'),
                upButton = document.createElement('button'),
                downButton = document.createElement('button'),
                grid = canvasDatagrid({
                    parentNode: parentNode,
                    data: [
                        {col1: 'foo', col2: 0, col3: 'a'},
                        {col1: 'bar', col2: 1, col3: 'b'},
                        {col1: 'baz', col2: 2, col3: 'c'},
                        {col1: 'foo', col2: 0, col3: 'a'},
                        {col1: 'bar', col2: 1, col3: 'b'},
                        {col1: 'baz', col2: 2, col3: 'c'},
                        {col1: 'foo', col2: 0, col3: 'a'},
                        {col1: 'bar', col2: 1, col3: 'b'},
                        {col1: 'baz', col2: 2, col3: 'c'},
                        {col1: 'foo', col2: 0, col3: 'a'},
                        {col1: 'bar', col2: 1, col3: 'b'},
                        {col1: 'baz', col2: 2, col3: 'c'}
                    ]
                });
            content.appendChild(upButton);
            content.appendChild(downButton);
            upButton.innerHTML = 'Scroll Up';
            downButton.innerHTML = 'Scroll Down';
            upButton.addEventListener('click', function (e) {
                grid.scrollTop -= 10;
                e.stopPropagation();
            });
            downButton.addEventListener('click', function (e) {
                grid.scrollTop += 10;
                e.stopPropagation();
            });
            content.addEventListener('click', function (e) {
                e.stopPropagation();
            });
            grid.addEventListener('contextmenu', function (e) {
                e.items.splice(0, e.items.length);
                e.items.push({
                    title: content
                });
            });
        };
        examples['Alter runtime style|Change styles after the grid has been instantiated.  All styles can be changed at any time.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.style.columnHeaderCellBackgroundColor = 'dodgerblue';
            grid.style.columnHeaderCellColor = 'white';
        };
        examples['Canvas fill styles|An example of using complex fill styles on the canvas.'] = function (parentNode) {
            var grid = canvasDatagrid({
                    parentNode: parentNode,
                    data: [
                        {col1: 'foo', col2: 0, col3: 'a'},
                        {col1: 'bar', col2: 1, col3: 'b'},
                        {col1: 'baz', col2: 2, col3: 'c'}
                    ]
                }),
                gradient = grid.ctx.createLinearGradient(0, 0, 1300, 1300);
            gradient.addColorStop(0, 'dodgerblue');
            gradient.addColorStop(1, 'chartreuse');
            grid.style.cellBackgroundColor = gradient;
            grid.style.backgroundColor = gradient;
        };
        examples['Alter startup styles|Change the styles during instantiation.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                style: {
                    cellBackgroundColor: 'navy',
                    cellColor: 'wheat'
                },
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.data = [
                {Ei: 'principes', melius: 'causae'},
                {Ei: 'omittam', melius: 'audire'},
                {Ei: 'mea', melius: 'quot'},
                {Ei: 'pericula', melius: 'offendit'}
            ];
        };
        examples['Replace all styles at runtime|Replace the entire style object at runtime.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.style = {
                cellBackgroundColor: 'darkred',
                cellColor: 'goldenrod'
            };
        };
        examples['Selection Mode Row|Prevents the selection of individual cells forcing the row to become selected.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.attributes.selectionMode = 'row';
        };
        examples['Scroll to a cell'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'},
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'},
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'},
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.scrollIntoView(2, 2);
        };
        examples['Conditionally set colors|Change styles during the <i>rendercell</i> event.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode
            });
            grid.addEventListener('rendercell', function (e) {
                if (e.cell.header.name === 'Ei' && /omittam/.test(e.cell.value)) {
                    e.ctx.fillStyle = '#AEEDCF';
                }
            });
            grid.data = [
                {Ei: 'principes', melius: 'causae'},
                {Ei: 'omittam', melius: 'audire'},
                {Ei: 'mea', melius: 'quot'},
                {Ei: 'pericula', melius: 'offendit'}
            ];
        };
        examples['Validate input|In this example, by using the <i>beforeendedit</i> event you can prevent digits from being entered.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 'a', col3: 'a'},
                    {col1: 'bar', col2: 'b', col3: 'b'},
                    {col1: 'baz', col2: 'c', col3: 'c'}
                ]
            });
            grid.addEventListener('beforeendedit', function (e) {
                if (/\d+/.test(e.newValue)) {
                    alert('NO DIGITS!');
                    e.preventDefault();
                }
            });
        };
        examples['Edit a cell|Use the interface to focus a cell, then begin editing a cell.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'},
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'},
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'},
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.scrollIntoView(2, 3);
            grid.beginEditAt(2, 3);
        };
        examples['Set the width of a column'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.setColumnWidth(0, 60);
            grid.setColumnWidth(1, 200);
        };
        examples['Order by a column|By providing the order method with a column name and order (default ascending) you can change the sort order.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.order(grid.schema[0].name, 'asc');
        };
        examples['Select an area|Select an area of the grid using a <i>rect</i> object.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a', col4: 'z'},
                    {col1: 'bar', col2: 1, col3: 'b', col4: 'x'},
                    {col1: 'baz', col2: 2, col3: 'c', col4: 'w'},
                    {col1: 'foo', col2: 0, col3: 'a', col4: 'u'},
                    {col1: 'bar', col2: 1, col3: 'b', col4: 'l'},
                    {col1: 'baz', col2: 2, col3: 'c', col4: 'e'},
                    {col1: 'foo', col2: 0, col3: 'a', col4: 'c'},
                    {col1: 'bar', col2: 1, col3: 'b', col4: 'n'},
                    {col1: 'baz', col2: 2, col3: 'c', col4: 'b'}
                ]
            });
            grid.selectArea({
                top: 2,
                bottom: 6,
                left: 1,
                right: 2
            });
            grid.draw();
        };
        examples['Remove all rows|Just get rid of all the data.  It is silly data anyway.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.data = [];
        };
        examples['Allow new rows|Allow the input of new rows at the bottom of the grid.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.attributes.showNewRow = true;
        };
        examples['Create a web component grid'] = function (parentNode) {
            var grid = document.createElement('canvas-datagrid');
            parentNode.appendChild(grid);
            grid.data = [
                {col1: 'foo', col2: 0, col3: 'a'},
                {col1: 'bar', col2: 1, col3: 'b'},
                {col1: 'baz', col2: 2, col3: 'c'}
            ];
        };
        examples['Change a columns\'s title'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.schema[0].title = 'foo';
            grid.draw();
        };
        examples['Add a column|There is also an insert version of this function.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.addColumn({
                defaultValue: function (e) {
                    return new Date().toString();
                },
                title: 'Bar',
                type: 'date',
                name: 'bar'
            });
        };
        examples['Add a row|There is also an insert version of this function.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.addRow({
                col1: 'a ' + new Date().toString(),
                col2: 'a ' + new Date().toString(),
                col3: 'a ' + new Date().toString()
            });
        };
        examples['Draw HTML via Event|This draws HTML into an SVG object, takes a picture of it and caches it into the grid, then draws it into the cell.  In other words, it works, but it\'s slow.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.addEventListener('afterrendercell', function (e) {
                if (e.cell.columnIndex === 1 && e.cell.rowIndex > -1) {
                    e.cell.innerHTML = '<div style="display: inline-block; color: dodgerblue; font-size: 2em;">'
                        + e.cell.value
                        + '</div>'
                        + '<div style="display: inline-block; margin: -20px -20px; filter: blur(5px); font-size: 2em;">'
                        + e.cell.value
                        + '</div>';
                }
            });
            grid.draw();
        };
        examples['Draw HTML via data type|This draws HTML into an SVG object, takes a picture of it and caches it into the grid, then draws it into the cell.  In other words, it works, but it\'s slow.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.schema = [{name: 'id', type: 'number'}, {name: 'offendit', type: 'html'}];
            grid.data = [
                {id: 0, offendit: 'number'},
                {id: 0, offendit: 'number'},
            ];
            grid.draw();
        };
        examples['Open a tree|Open a tree grid on a specific row.  Use the <i>expandtree</i> event to control the data and settings of the tree grid.'] = function (parentNode) {
            function createData() {
                var x, y, d = [];
                for (x = 0; x < 2000; x += 1) {
                    d[x] = {};
                    for (y = 0; y < 20; y += 1) {
                        d[x][y] = y * x;
                    }
                }
                return d;
            }
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: createData()
            });
            grid.addEventListener('expandtree', function expandTree(e) {
                e.treeGrid.data = createData();
                // prevent repeated executions of this example code from blowing things up
                e.treeGrid.removeEventListener('expandtree', expandTree);
            });
            grid.expandTree(2);
        };
        examples['Allow users to open trees|Allows users to open trees.  Use the <i>expandtree</i> event to control the data and settings of the tree grid.'] = function (parentNode) {
            function createData() {
                var x, y, d = [];
                for (x = 0; x < 2000; x += 1) {
                    d[x] = {};
                    for (y = 0; y < 20; y += 1) {
                        d[x][y] = y * x;
                    }
                }
                return d;
            }
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: createData()
            });
            grid.attributes.tree = true;
            function expandTree(e) {
                e.treeGrid.addEventListener('expandtree', expandTree);
                e.treeGrid.attributes.tree = true;
                e.treeGrid.data = createData();
            }
            grid.addEventListener('expandtree', expandTree);
        };
        examples['Multiple filters|Create filters on more than one column at a time.'] = function (parentNode) {
            var grid = canvasDatagrid({
                    parentNode: parentNode
                }),
                x,
                data = [],
                d,
                i,
                c,
                r = 'The,quick,brown,fox,jumps,over,the,lazy,dog';
            grid.data = [];
            c = r.split(',').map(function (i) { return i.trim(); });
            r = r.split(',').map(function (i) { return i.trim(); });
            for (x = 0; x < 10000; x += 1) {
                d = {};
                for (i = 0; i < r.length; i += 1) {
                    d[r[i]] = c[Math.floor(Math.random() * 1000) % (c.length - 1)];
                }
                data.push(d);
            }
            // add the data to the grid
            grid.data = data.concat(grid.data);
            grid.setFilter('quick', /the/i);
            grid.setFilter('brown', 'quick');
        };
        examples['Draw a picture|Draw a picture into a cell.  First hook into <i>rendertext</i> to show the text "No Image" text if there is no image.  Then hook into <i>afterrendercell</i> to actually create an image element, hook into the image load event and draw the image once it\'s loaded.'] = function (parentNode) {
            var grid = canvasDatagrid({
                    parentNode: parentNode
                }),
                // place to store Image objects
                imgs = {};
            // stop the cell from rendering text
            grid.addEventListener('rendertext', function (e) {
                if (e.cell.rowIndex > -1) {
                    if (e.cell.header.name === 'image') {
                        e.cell.formattedValue = e.cell.value ? '' : 'No Image';
                    }
                }
            });
            // after the cell is rendered, draw on top of it
            grid.addEventListener('afterrendercell', function (e) {
                var i, contextGrid = this;
                if (e.cell.header.name === 'image'
                        && e.cell.value && e.cell.rowIndex > -1) {
                    // if we haven't already made an image for this, do it now
                    if (!imgs[e.cell.value]) {
                        // create a new image object and store it in the imgs object
                        i = imgs[e.cell.value] = new Image();
                        // get the image path from the cell's value
                        i.src = e.cell.value;
                        // when the image finally loads
                        // call draw() again to run the else path
                        i.onload = function (parentNode) {
                            contextGrid.draw();
                        };
                        return;
                    }
                    // if we have an image already, draw it.
                    i = imgs[e.cell.value];
                    if (i.width !== 0) {
                        i.targetHeight = e.cell.height;
                        i.targetWidth = e.cell.height * (i.width / i.height);
                        e.ctx.drawImage(i, e.cell.x, e.cell.y, i.targetWidth, i.targetHeight);
                    }
                }
            });
            // add some images
            grid.data = [
                {
                    image: 'https://imgfly.me/content/images/system/home_cover_1487462088616_671176.jpg',
                    melius: 'causae'
                },
                {
                    image: 'https://imgfly.me/content/images/system/home_cover_1487462024769_865e94.jpg',
                    melius: 'omittam'
                },
                {
                    image: 'https://imgfly.me/content/images/system/home_cover_1487462098680_a9930c.jpg',
                    melius: 'explicari'
                },
                {
                    image: '',
                    melius: 'principes'
                }
            ];
            // set the column widths and row heights
            grid.setColumnWidth(0, 300);
            grid.data.forEach(function (d, index) {
                grid.setRowHeight(index, 200);
            });
        };
        examples['Toggle debug data|Show fun debugging information.  What are all these numbers?  File a bug ticket to find out!'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: [
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'},
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'},
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'},
                    {col1: 'foo', col2: 0, col3: 'a'},
                    {col1: 'bar', col2: 1, col3: 'b'},
                    {col1: 'baz', col2: 2, col3: 'c'}
                ]
            });
            grid.attributes.debug = !grid.attributes.debug;
        };
        examples['Display unicode samples|Unicode works if it is properly encoded using \\u escape sequences.'] = function (parentNode) {
            var grid = canvasDatagrid({
                parentNode: parentNode
            });
            grid.data = [
                {'Block': 'Basic Latin', 'Sample': '! " # $ % & \' ( ) * + , - . / 0 1 2 3 4 5 6 7 8 9 : ; < = > ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~'},
                {'Block': 'Latin-1 Supplement', 'Sample': '  \u00A1 \u00A2 \u00A3 \u00A4 \u00A5 \u00A6 \u00A7 \u00A8 \u00A9 \u00AA \u00AB \u00AC \u00AD \u00AE \u00AF \u00B0 \u00B1 \u00B2 \u00B3 \u00B4 \u00B5 \u00B6 \u00B7 \u00B8 \u00B9 \u00BA \u00BB \u00BC \u00BD \u00BE \u00BF \u00C0 \u00C1 \u00C2 \u00C3 \u00C4 \u00C5 \u00C6 \u00C7 \u00C8 \u00C9 \u00CA \u00CB \u00CC \u00CD \u00CE \u00CF \u00D0 \u00D1 \u00D2 \u00D3 \u00D4 \u00D5 \u00D6 \u00D7 \u00D8 \u00D9 \u00DA \u00DB \u00DC \u00DD \u00DE \u00DF \u00E0 \u00E1 \u00E2 \u00E3 \u00E4 \u00E5 \u00E6 \u00E7 \u00E8 \u00E9 \u00EA \u00EB \u00EC \u00ED \u00EE \u00EF \u00F0 \u00F1 \u00F2 \u00F3 \u00F4 \u00F5 \u00F6 \u00F7 \u00F8 \u00F9 \u00FA \u00FB \u00FC \u00FD \u00FE \u00FF'},
                {'Block': 'Latin Extended-A', 'Sample': '\u0100 \u0101 \u0102 \u0103 \u0104 \u0105 \u0106 \u0107 \u0108 \u0109 \u010A \u010B \u010C \u010D \u010E \u010F \u0110 \u0111 \u0112 \u0113 \u0114 \u0115 \u0116 \u0117 \u0118 \u0119 \u011A \u011B \u011C \u011D \u011E \u011F \u0120 \u0121 \u0122 \u0123 \u0124 \u0125 \u0126 \u0127 \u0128 \u0129 \u012A \u012B \u012C \u012D \u012E \u012F \u0130 \u0131 \u0132 \u0133 \u0134 \u0135 \u0136 \u0137 \u0138 \u0139 \u013A \u013B \u013C \u013D \u013E \u013F \u0140 \u0141 \u0142 \u0143 \u0144 \u0145 \u0146 \u0147 \u0148 \u0149 \u014A \u014B \u014C \u014D \u014E \u014F \u0150 \u0151 \u0152 \u0153 \u0154 \u0155 \u0156 \u0157 \u0158 \u0159 \u015A \u015B \u015C \u015D \u015E \u015F \u0160 \u0161 \u0162 \u0163 \u0164 \u0165 \u0166 \u0167 \u0168 \u0169 \u016A \u016B \u016C \u016D \u016E \u016F \u0170 \u0171 \u0172 \u0173 \u0174 \u0175 \u0176 \u0177 \u0178 \u0179 \u017A \u017B \u017C \u017D \u017E \u017F'},
                {'Block': 'Latin Extended-B', 'Sample': '\u0180 \u0181 \u0182 \u0183 \u0184 \u0185 \u0186 \u0187 \u0188 \u0189 \u018A \u018B \u018C \u018D \u018E \u018F \u0190 \u0191 \u0192 \u0193 \u0194 \u0195 \u0196 \u0197 \u0198 \u0199 \u019A \u019B \u019C \u019D \u019E \u019F \u01A0 \u01A1 \u01A2 \u01A3 \u01A4 \u01A5 \u01A6 \u01A7 \u01A8 \u01A9 \u01AA \u01AB \u01AC \u01AD \u01AE \u01AF \u01B0 \u01B1 \u01B2 \u01B3 \u01B4 \u01B5 \u01B6 \u01B7 \u01B8 \u01B9 \u01BA \u01BB \u01BC \u01BD \u01BE \u01BF \u01C0 \u01C1 \u01C2 \u01C3 \u01C4 \u01C5 \u01C6 \u01C7 \u01C8 \u01C9 \u01CA \u01CB \u01CC \u01CD \u01CE \u01CF \u01D0 \u01D1 \u01D2 \u01D3 \u01D4 \u01D5 \u01D6 \u01D7 \u01D8 \u01D9 \u01DA \u01DB \u01DC \u01DD \u01DE \u01DF \u01E0 \u01E1 \u01E2 \u01E3 \u01E4 \u01E5 \u01E6 \u01E7 \u01E8 \u01E9 \u01EA \u01EB \u01EC \u01ED \u01EE \u01EF \u01F0 \u01F1 \u01F2 \u01F3 \u01F4 \u01F5 \u01F6 \u01F7 \u01F8 \u01F9 \u01FA \u01FB \u01FC \u01FD \u01FE \u01FF ...'},
                {'Block': 'IPA Extensions', 'Sample': '\u0250 \u0251 \u0252 \u0253 \u0254 \u0255 \u0256 \u0257 \u0258 \u0259 \u025A \u025B \u025C \u025D \u025E \u025F \u0260 \u0261 \u0262 \u0263 \u0264 \u0265 \u0266 \u0267 \u0268 \u0269 \u026A \u026B \u026C \u026D \u026E \u026F \u0270 \u0271 \u0272 \u0273 \u0274 \u0275 \u0276 \u0277 \u0278 \u0279 \u027A \u027B \u027C \u027D \u027E \u027F \u0280 \u0281 \u0282 \u0283 \u0284 \u0285 \u0286 \u0287 \u0288 \u0289 \u028A \u028B \u028C \u028D \u028E \u028F \u0290 \u0291 \u0292 \u0293 \u0294 \u0295 \u0296 \u0297 \u0298 \u0299 \u029A \u029B \u029C \u029D \u029E \u029F \u02A0 \u02A1 \u02A2 \u02A3 \u02A4 \u02A5 \u02A6 \u02A7 \u02A8 \u02A9 \u02AA \u02AB \u02AC \u02AD'},
                {'Block': 'Spacing Modifier Letters', 'Sample': '\u02B0 \u02B1 \u02B2 \u02B3 \u02B4 \u02B5 \u02B6 \u02B7 \u02B8 \u02B9 \u02BA \u02BB \u02BC \u02BD \u02BE \u02BF \u02C0 \u02C1 \u02C2 \u02C3 \u02C4 \u02C5 \u02C6 \u02C7 \u02C8 \u02C9 \u02CA \u02CB \u02CC \u02CD \u02CE \u02CF \u02D0 \u02D1 \u02D2 \u02D3 \u02D4 \u02D5 \u02D6 \u02D7 \u02D8 \u02D9 \u02DA \u02DB \u02DC \u02DD \u02DE \u02DF \u02E0 \u02E1 \u02E2 \u02E3 \u02E4 \u02E5 \u02E6 \u02E7 \u02E8 \u02E9 \u02EA \u02EB \u02EC \u02ED \u02EE'},
                {'Block': 'Combining Diacritical Marks', 'Sample': '\u0300 \u0301 \u0302 \u0303 \u0304 \u0305 \u0306 \u0307 \u0308 \u0309 \u030A \u030B \u030C \u030D \u030E \u030F \u0310 \u0311 \u0312 \u0313 \u0314 \u0315 \u0316 \u0317 \u0318 \u0319 \u031A \u031B \u031C \u031D \u031E \u031F \u0320 \u0321 \u0322 \u0323 \u0324 \u0325 \u0326 \u0327 \u0328 \u0329 \u032A \u032B \u032C \u032D \u032E \u032F \u0330 \u0331 \u0332 \u0333 \u0334 \u0335 \u0336 \u0337 \u0338 \u0339 \u033A \u033B \u033C \u033D \u033E \u033F \u0340 \u0341 \u0342 \u0343 \u0344 \u0345 \u0346 \u0347 \u0348 \u0349 \u034A \u034B \u034C \u034D \u034E \u034F \u0360 \u0361 \u0362 \u0363 \u0364 \u0365 \u0366 \u0367 \u0368 \u0369 \u036A \u036B \u036C \u036D \u036E \u036F'},
                {'Block': 'Greek and Coptic', 'Sample': '\u0374 \u0375 \u037A \u037E \u0384 \u0385 \u0386 \u0387 \u0388 \u0389 \u038A \u038C \u038E \u038F \u0390 \u0391 \u0392 \u0393 \u0394 \u0395 \u0396 \u0397 \u0398 \u0399 \u039A \u039B \u039C \u039D \u039E \u039F \u03A0 \u03A1 \u03A3 \u03A4 \u03A5 \u03A6 \u03A7 \u03A8 \u03A9 \u03AA \u03AB \u03AC \u03AD \u03AE \u03AF \u03B0 \u03B1 \u03B2 \u03B3 \u03B4 \u03B5 \u03B6 \u03B7 \u03B8 \u03B9 \u03BA \u03BB \u03BC \u03BD \u03BE \u03BF \u03C0 \u03C1 \u03C2 \u03C3 \u03C4 \u03C5 \u03C6 \u03C7 \u03C8 \u03C9 \u03CA \u03CB \u03CC \u03CD \u03CE \u03D0 \u03D1 \u03D2 \u03D3 \u03D4 \u03D5 \u03D6 \u03D7 \u03D8 \u03D9 \u03DA \u03DB \u03DC \u03DD \u03DE \u03DF \u03E0 \u03E1 \u03E2 \u03E3 \u03E4 \u03E5 \u03E6 \u03E7 \u03E8 \u03E9 \u03EA \u03EB \u03EC \u03ED \u03EE \u03EF \u03F0 \u03F1 \u03F2 \u03F3 \u03F4 \u03F5 \u03F6'},
                {'Block': 'Cyrillic', 'Sample': '\u0400 \u0401 \u0402 \u0403 \u0404 \u0405 \u0406 \u0407 \u0408 \u0409 \u040A \u040B \u040C \u040D \u040E \u040F \u0410 \u0411 \u0412 \u0413 \u0414 \u0415 \u0416 \u0417 \u0418 \u0419 \u041A \u041B \u041C \u041D \u041E \u041F \u0420 \u0421 \u0422 \u0423 \u0424 \u0425 \u0426 \u0427 \u0428 \u0429 \u042A \u042B \u042C \u042D \u042E \u042F \u0430 \u0431 \u0432 \u0433 \u0434 \u0435 \u0436 \u0437 \u0438 \u0439 \u043A \u043B \u043C \u043D \u043E \u043F \u0440 \u0441 \u0442 \u0443 \u0444 \u0445 \u0446 \u0447 \u0448 \u0449 \u044A \u044B \u044C \u044D \u044E \u044F \u0450 \u0451 \u0452 \u0453 \u0454 \u0455 \u0456 \u0457 \u0458 \u0459 \u045A \u045B \u045C \u045D \u045E \u045F \u0460 \u0461 \u0462 \u0463 \u0464 \u0465 \u0466 \u0467 \u0468 \u0469 \u046A \u046B \u046C \u046D \u046E \u046F \u0470 \u0471 \u0472 \u0473 \u0474 \u0475 \u0476 \u0477 \u0478 \u0479 \u047A \u047B \u047C \u047D \u047E \u047F ...'},
                {'Block': 'Cyrillic Supplementary', 'Sample': '\u0500 \u0501 \u0502 \u0503 \u0504 \u0505 \u0506 \u0507 \u0508 \u0509 \u050A \u050B \u050C \u050D \u050E \u050F'},
                {'Block': 'Armenian', 'Sample': '\u0531 \u0532 \u0533 \u0534 \u0535 \u0536 \u0537 \u0538 \u0539 \u053A \u053B \u053C \u053D \u053E \u053F \u0540 \u0541 \u0542 \u0543 \u0544 \u0545 \u0546 \u0547 \u0548 \u0549 \u054A \u054B \u054C \u054D \u054E \u054F \u0550 \u0551 \u0552 \u0553 \u0554 \u0555 \u0556 \u0559 \u055A \u055B \u055C \u055D \u055E \u055F \u0561 \u0562 \u0563 \u0564 \u0565 \u0566 \u0567 \u0568 \u0569 \u056A \u056B \u056C \u056D \u056E \u056F \u0570 \u0571 \u0572 \u0573 \u0574 \u0575 \u0576 \u0577 \u0578 \u0579 \u057A \u057B \u057C \u057D \u057E \u057F \u0580 \u0581 \u0582 \u0583 \u0584 \u0585 \u0586 \u0587 \u0589 \u058A'},
                {'Block': 'Hebrew', 'Sample': '\u0591 \u0592 \u0593 \u0594 \u0595 \u0596 \u0597 \u0598 \u0599 \u059A \u059B \u059C \u059D \u059E \u059F \u05A0 \u05A1 \u05A3 \u05A4 \u05A5 \u05A6 \u05A7 \u05A8 \u05A9 \u05AA \u05AB \u05AC \u05AD \u05AE \u05AF \u05B0 \u05B1 \u05B2 \u05B3 \u05B4 \u05B5 \u05B6 \u05B7 \u05B8 \u05B9 \u05BB \u05BC \u05BD \u05BE \u05BF \u05C0 \u05C1 \u05C2 \u05C3 \u05C4 \u05D0 \u05D1 \u05D2 \u05D3 \u05D4 \u05D5 \u05D6 \u05D7 \u05D8 \u05D9 \u05DA \u05DB \u05DC \u05DD \u05DE \u05DF \u05E0 \u05E1 \u05E2 \u05E3 \u05E4 \u05E5 \u05E6 \u05E7 \u05E8 \u05E9 \u05EA \u05F0 \u05F1 \u05F2 \u05F3 \u05F4'},
                {'Block': 'Arabic', 'Sample': '\u060C \u061B \u061F \u0621 \u0622 \u0623 \u0624 \u0625 \u0626 \u0627 \u0628 \u0629 \u062A \u062B \u062C \u062D \u062E \u062F \u0630 \u0631 \u0632 \u0633 \u0634 \u0635 \u0636 \u0637 \u0638 \u0639 \u063A \u0640 \u0641 \u0642 \u0643 \u0644 \u0645 \u0646 \u0647 \u0648 \u0649 \u064A \u064B \u064C \u064D \u064E \u064F \u0650 \u0651 \u0652 \u0653 \u0654 \u0655 \u0660 \u0661 \u0662 \u0663 \u0664 \u0665 \u0666 \u0667 \u0668 \u0669 \u066A \u066B \u066C \u066D \u066E \u066F \u0670 \u0671 \u0672 \u0673 \u0674 \u0675 \u0676 \u0677 \u0678 \u0679 \u067A \u067B \u067C \u067D \u067E \u067F \u0680 \u0681 \u0682 \u0683 \u0684 \u0685 \u0686 \u0687 \u0688 \u0689 \u068A \u068B \u068C \u068D \u068E \u068F \u0690 \u0691 \u0692 \u0693 \u0694 \u0695 \u0696 \u0697 \u0698 \u0699 \u069A \u069B \u069C \u069D \u069E \u069F \u06A0 \u06A1 \u06A2 \u06A3 \u06A4 \u06A5 \u06A6 \u06A7 \u06A8 \u06A9 \u06AA \u06AB \u06AC ...'},
                {'Block': 'Syriac', 'Sample': '\u0700 \u0701 \u0702 \u0703 \u0704 \u0705 \u0706 \u0707 \u0708 \u0709 \u070A \u070B \u070C \u070D \u070F \u0710 \u0711 \u0712 \u0713 \u0714 \u0715 \u0716 \u0717 \u0718 \u0719 \u071A \u071B \u071C \u071D \u071E \u071F \u0720 \u0721 \u0722 \u0723 \u0724 \u0725 \u0726 \u0727 \u0728 \u0729 \u072A \u072B \u072C \u0730 \u0731 \u0732 \u0733 \u0734 \u0735 \u0736 \u0737 \u0738 \u0739 \u073A \u073B \u073C \u073D \u073E \u073F \u0740 \u0741 \u0742 \u0743 \u0744 \u0745 \u0746 \u0747 \u0748 \u0749 \u074A'},
                {'Block': 'Thaana', 'Sample': '\u0780 \u0781 \u0782 \u0783 \u0784 \u0785 \u0786 \u0787 \u0788 \u0789 \u078A \u078B \u078C \u078D \u078E \u078F \u0790 \u0791 \u0792 \u0793 \u0794 \u0795 \u0796 \u0797 \u0798 \u0799 \u079A \u079B \u079C \u079D \u079E \u079F \u07A0 \u07A1 \u07A2 \u07A3 \u07A4 \u07A5 \u07A6 \u07A7 \u07A8 \u07A9 \u07AA \u07AB \u07AC \u07AD \u07AE \u07AF \u07B0 \u07B1'},
                {'Block': 'Devanagari', 'Sample': '\u0901 \u0902 \u0903 \u0905 \u0906 \u0907 \u0908 \u0909 \u090A \u090B \u090C \u090D \u090E \u090F \u0910 \u0911 \u0912 \u0913 \u0914 \u0915 \u0916 \u0917 \u0918 \u0919 \u091A \u091B \u091C \u091D \u091E \u091F \u0920 \u0921 \u0922 \u0923 \u0924 \u0925 \u0926 \u0927 \u0928 \u0929 \u092A \u092B \u092C \u092D \u092E \u092F \u0930 \u0931 \u0932 \u0933 \u0934 \u0935 \u0936 \u0937 \u0938 \u0939 \u093C \u093D \u093E \u093F \u0940 \u0941 \u0942 \u0943 \u0944 \u0945 \u0946 \u0947 \u0948 \u0949 \u094A \u094B \u094C \u094D \u0950 \u0951 \u0952 \u0953 \u0954 \u0958 \u0959 \u095A \u095B \u095C \u095D \u095E \u095F \u0960 \u0961 \u0962 \u0963 \u0964 \u0965 \u0966 \u0967 \u0968 \u0969 \u096A \u096B \u096C \u096D \u096E \u096F \u0970'},
                {'Block': 'Bengali', 'Sample': '\u0981 \u0982 \u0983 \u0985 \u0986 \u0987 \u0988 \u0989 \u098A \u098B \u098C \u098F \u0990 \u0993 \u0994 \u0995 \u0996 \u0997 \u0998 \u0999 \u099A \u099B \u099C \u099D \u099E \u099F \u09A0 \u09A1 \u09A2 \u09A3 \u09A4 \u09A5 \u09A6 \u09A7 \u09A8 \u09AA \u09AB \u09AC \u09AD \u09AE \u09AF \u09B0 \u09B2 \u09B6 \u09B7 \u09B8 \u09B9 \u09BC \u09BE \u09BF \u09C0 \u09C1 \u09C2 \u09C3 \u09C4 \u09C7 \u09C8 \u09CB \u09CC \u09CD \u09D7 \u09DC \u09DD \u09DF \u09E0 \u09E1 \u09E2 \u09E3 \u09E6 \u09E7 \u09E8 \u09E9 \u09EA \u09EB \u09EC \u09ED \u09EE \u09EF \u09F0 \u09F1 \u09F2 \u09F3 \u09F4 \u09F5 \u09F6 \u09F7 \u09F8 \u09F9 \u09FA'},
                {'Block': 'Gurmukhi', 'Sample': '\u0A02 \u0A05 \u0A06 \u0A07 \u0A08 \u0A09 \u0A0A \u0A0F \u0A10 \u0A13 \u0A14 \u0A15 \u0A16 \u0A17 \u0A18 \u0A19 \u0A1A \u0A1B \u0A1C \u0A1D \u0A1E \u0A1F \u0A20 \u0A21 \u0A22 \u0A23 \u0A24 \u0A25 \u0A26 \u0A27 \u0A28 \u0A2A \u0A2B \u0A2C \u0A2D \u0A2E \u0A2F \u0A30 \u0A32 \u0A33 \u0A35 \u0A36 \u0A38 \u0A39 \u0A3C \u0A3E \u0A3F \u0A40 \u0A41 \u0A42 \u0A47 \u0A48 \u0A4B \u0A4C \u0A4D \u0A59 \u0A5A \u0A5B \u0A5C \u0A5E \u0A66 \u0A67 \u0A68 \u0A69 \u0A6A \u0A6B \u0A6C \u0A6D \u0A6E \u0A6F \u0A70 \u0A71 \u0A72 \u0A73 \u0A74'},
                {'Block': 'Gujarati', 'Sample': '\u0A81 \u0A82 \u0A83 \u0A85 \u0A86 \u0A87 \u0A88 \u0A89 \u0A8A \u0A8B \u0A8D \u0A8F \u0A90 \u0A91 \u0A93 \u0A94 \u0A95 \u0A96 \u0A97 \u0A98 \u0A99 \u0A9A \u0A9B \u0A9C \u0A9D \u0A9E \u0A9F \u0AA0 \u0AA1 \u0AA2 \u0AA3 \u0AA4 \u0AA5 \u0AA6 \u0AA7 \u0AA8 \u0AAA \u0AAB \u0AAC \u0AAD \u0AAE \u0AAF \u0AB0 \u0AB2 \u0AB3 \u0AB5 \u0AB6 \u0AB7 \u0AB8 \u0AB9 \u0ABC \u0ABD \u0ABE \u0ABF \u0AC0 \u0AC1 \u0AC2 \u0AC3 \u0AC4 \u0AC5 \u0AC7 \u0AC8 \u0AC9 \u0ACB \u0ACC \u0ACD \u0AD0 \u0AE0 \u0AE6 \u0AE7 \u0AE8 \u0AE9 \u0AEA \u0AEB \u0AEC \u0AED \u0AEE \u0AEF'},
                {'Block': 'Oriya', 'Sample': '\u0B01 \u0B02 \u0B03 \u0B05 \u0B06 \u0B07 \u0B08 \u0B09 \u0B0A \u0B0B \u0B0C \u0B0F \u0B10 \u0B13 \u0B14 \u0B15 \u0B16 \u0B17 \u0B18 \u0B19 \u0B1A \u0B1B \u0B1C \u0B1D \u0B1E \u0B1F \u0B20 \u0B21 \u0B22 \u0B23 \u0B24 \u0B25 \u0B26 \u0B27 \u0B28 \u0B2A \u0B2B \u0B2C \u0B2D \u0B2E \u0B2F \u0B30 \u0B32 \u0B33 \u0B36 \u0B37 \u0B38 \u0B39 \u0B3C \u0B3D \u0B3E \u0B3F \u0B40 \u0B41 \u0B42 \u0B43 \u0B47 \u0B48 \u0B4B \u0B4C \u0B4D \u0B56 \u0B57 \u0B5C \u0B5D \u0B5F \u0B60 \u0B61 \u0B66 \u0B67 \u0B68 \u0B69 \u0B6A \u0B6B \u0B6C \u0B6D \u0B6E \u0B6F \u0B70'},
                {'Block': 'Tamil', 'Sample': '\u0B82 \u0B83 \u0B85 \u0B86 \u0B87 \u0B88 \u0B89 \u0B8A \u0B8E \u0B8F \u0B90 \u0B92 \u0B93 \u0B94 \u0B95 \u0B99 \u0B9A \u0B9C \u0B9E \u0B9F \u0BA3 \u0BA4 \u0BA8 \u0BA9 \u0BAA \u0BAE \u0BAF \u0BB0 \u0BB1 \u0BB2 \u0BB3 \u0BB4 \u0BB5 \u0BB7 \u0BB8 \u0BB9 \u0BBE \u0BBF \u0BC0 \u0BC1 \u0BC2 \u0BC6 \u0BC7 \u0BC8 \u0BCA \u0BCB \u0BCC \u0BCD \u0BD7 \u0BE7 \u0BE8 \u0BE9 \u0BEA \u0BEB \u0BEC \u0BED \u0BEE \u0BEF \u0BF0 \u0BF1 \u0BF2'},
                {'Block': 'Telugu', 'Sample': '\u0C01 \u0C02 \u0C03 \u0C05 \u0C06 \u0C07 \u0C08 \u0C09 \u0C0A \u0C0B \u0C0C \u0C0E \u0C0F \u0C10 \u0C12 \u0C13 \u0C14 \u0C15 \u0C16 \u0C17 \u0C18 \u0C19 \u0C1A \u0C1B \u0C1C \u0C1D \u0C1E \u0C1F \u0C20 \u0C21 \u0C22 \u0C23 \u0C24 \u0C25 \u0C26 \u0C27 \u0C28 \u0C2A \u0C2B \u0C2C \u0C2D \u0C2E \u0C2F \u0C30 \u0C31 \u0C32 \u0C33 \u0C35 \u0C36 \u0C37 \u0C38 \u0C39 \u0C3E \u0C3F \u0C40 \u0C41 \u0C42 \u0C43 \u0C44 \u0C46 \u0C47 \u0C48 \u0C4A \u0C4B \u0C4C \u0C4D \u0C55 \u0C56 \u0C60 \u0C61 \u0C66 \u0C67 \u0C68 \u0C69 \u0C6A \u0C6B \u0C6C \u0C6D \u0C6E \u0C6F'},
                {'Block': 'Kannada', 'Sample': '\u0C82 \u0C83 \u0C85 \u0C86 \u0C87 \u0C88 \u0C89 \u0C8A \u0C8B \u0C8C \u0C8E \u0C8F \u0C90 \u0C92 \u0C93 \u0C94 \u0C95 \u0C96 \u0C97 \u0C98 \u0C99 \u0C9A \u0C9B \u0C9C \u0C9D \u0C9E \u0C9F \u0CA0 \u0CA1 \u0CA2 \u0CA3 \u0CA4 \u0CA5 \u0CA6 \u0CA7 \u0CA8 \u0CAA \u0CAB \u0CAC \u0CAD \u0CAE \u0CAF \u0CB0 \u0CB1 \u0CB2 \u0CB3 \u0CB5 \u0CB6 \u0CB7 \u0CB8 \u0CB9 \u0CBE \u0CBF \u0CC0 \u0CC1 \u0CC2 \u0CC3 \u0CC4 \u0CC6 \u0CC7 \u0CC8 \u0CCA \u0CCB \u0CCC \u0CCD \u0CD5 \u0CD6 \u0CDE \u0CE0 \u0CE1 \u0CE6 \u0CE7 \u0CE8 \u0CE9 \u0CEA \u0CEB \u0CEC \u0CED \u0CEE \u0CEF'},
                {'Block': 'Malayalam', 'Sample': '\u0D02 \u0D03 \u0D05 \u0D06 \u0D07 \u0D08 \u0D09 \u0D0A \u0D0B \u0D0C \u0D0E \u0D0F \u0D10 \u0D12 \u0D13 \u0D14 \u0D15 \u0D16 \u0D17 \u0D18 \u0D19 \u0D1A \u0D1B \u0D1C \u0D1D \u0D1E \u0D1F \u0D20 \u0D21 \u0D22 \u0D23 \u0D24 \u0D25 \u0D26 \u0D27 \u0D28 \u0D2A \u0D2B \u0D2C \u0D2D \u0D2E \u0D2F \u0D30 \u0D31 \u0D32 \u0D33 \u0D34 \u0D35 \u0D36 \u0D37 \u0D38 \u0D39 \u0D3E \u0D3F \u0D40 \u0D41 \u0D42 \u0D43 \u0D46 \u0D47 \u0D48 \u0D4A \u0D4B \u0D4C \u0D4D \u0D57 \u0D60 \u0D61 \u0D66 \u0D67 \u0D68 \u0D69 \u0D6A \u0D6B \u0D6C \u0D6D \u0D6E \u0D6F'},
                {'Block': 'Sinhala', 'Sample': '\u0D82 \u0D83 \u0D85 \u0D86 \u0D87 \u0D88 \u0D89 \u0D8A \u0D8B \u0D8C \u0D8D \u0D8E \u0D8F \u0D90 \u0D91 \u0D92 \u0D93 \u0D94 \u0D95 \u0D96 \u0D9A \u0D9B \u0D9C \u0D9D \u0D9E \u0D9F \u0DA0 \u0DA1 \u0DA2 \u0DA3 \u0DA4 \u0DA5 \u0DA6 \u0DA7 \u0DA8 \u0DA9 \u0DAA \u0DAB \u0DAC \u0DAD \u0DAE \u0DAF \u0DB0 \u0DB1 \u0DB3 \u0DB4 \u0DB5 \u0DB6 \u0DB7 \u0DB8 \u0DB9 \u0DBA \u0DBB \u0DBD \u0DC0 \u0DC1 \u0DC2 \u0DC3 \u0DC4 \u0DC5 \u0DC6 \u0DCA \u0DCF \u0DD0 \u0DD1 \u0DD2 \u0DD3 \u0DD4 \u0DD6 \u0DD8 \u0DD9 \u0DDA \u0DDB \u0DDC \u0DDD \u0DDE \u0DDF \u0DF2 \u0DF3 \u0DF4'},
                {'Block': 'Thai', 'Sample': '\u0E01 \u0E02 \u0E03 \u0E04 \u0E05 \u0E06 \u0E07 \u0E08 \u0E09 \u0E0A \u0E0B \u0E0C \u0E0D \u0E0E \u0E0F \u0E10 \u0E11 \u0E12 \u0E13 \u0E14 \u0E15 \u0E16 \u0E17 \u0E18 \u0E19 \u0E1A \u0E1B \u0E1C \u0E1D \u0E1E \u0E1F \u0E20 \u0E21 \u0E22 \u0E23 \u0E24 \u0E25 \u0E26 \u0E27 \u0E28 \u0E29 \u0E2A \u0E2B \u0E2C \u0E2D \u0E2E \u0E2F \u0E30 \u0E31 \u0E32 \u0E33 \u0E34 \u0E35 \u0E36 \u0E37 \u0E38 \u0E39 \u0E3A \u0E3F \u0E40 \u0E41 \u0E42 \u0E43 \u0E44 \u0E45 \u0E46 \u0E47 \u0E48 \u0E49 \u0E4A \u0E4B \u0E4C \u0E4D \u0E4E \u0E4F \u0E50 \u0E51 \u0E52 \u0E53 \u0E54 \u0E55 \u0E56 \u0E57 \u0E58 \u0E59 \u0E5A \u0E5B'},
                {'Block': 'Lao', 'Sample': '\u0E81 \u0E82 \u0E84 \u0E87 \u0E88 \u0E8A \u0E8D \u0E94 \u0E95 \u0E96 \u0E97 \u0E99 \u0E9A \u0E9B \u0E9C \u0E9D \u0E9E \u0E9F \u0EA1 \u0EA2 \u0EA3 \u0EA5 \u0EA7 \u0EAA \u0EAB \u0EAD \u0EAE \u0EAF \u0EB0 \u0EB1 \u0EB2 \u0EB3 \u0EB4 \u0EB5 \u0EB6 \u0EB7 \u0EB8 \u0EB9 \u0EBB \u0EBC \u0EBD \u0EC0 \u0EC1 \u0EC2 \u0EC3 \u0EC4 \u0EC6 \u0EC8 \u0EC9 \u0ECA \u0ECB \u0ECC \u0ECD \u0ED0 \u0ED1 \u0ED2 \u0ED3 \u0ED4 \u0ED5 \u0ED6 \u0ED7 \u0ED8 \u0ED9 \u0EDC \u0EDD'},
                {'Block': 'Tibetan', 'Sample': '\u0F00 \u0F01 \u0F02 \u0F03 \u0F04 \u0F05 \u0F06 \u0F07 \u0F08 \u0F09 \u0F0A \u0F0B \u0F0C \u0F0D \u0F0E \u0F0F \u0F10 \u0F11 \u0F12 \u0F13 \u0F14 \u0F15 \u0F16 \u0F17 \u0F18 \u0F19 \u0F1A \u0F1B \u0F1C \u0F1D \u0F1E \u0F1F \u0F20 \u0F21 \u0F22 \u0F23 \u0F24 \u0F25 \u0F26 \u0F27 \u0F28 \u0F29 \u0F2A \u0F2B \u0F2C \u0F2D \u0F2E \u0F2F \u0F30 \u0F31 \u0F32 \u0F33 \u0F34 \u0F35 \u0F36 \u0F37 \u0F38 \u0F39 \u0F3A \u0F3B \u0F3C \u0F3D \u0F3E \u0F3F \u0F40 \u0F41 \u0F42 \u0F43 \u0F44 \u0F45 \u0F46 \u0F47 \u0F49 \u0F4A \u0F4B \u0F4C \u0F4D \u0F4E \u0F4F \u0F50 \u0F51 \u0F52 \u0F53 \u0F54 \u0F55 \u0F56 \u0F57 \u0F58 \u0F59 \u0F5A \u0F5B \u0F5C \u0F5D \u0F5E \u0F5F \u0F60 \u0F61 \u0F62 \u0F63 \u0F64 \u0F65 \u0F66 \u0F67 \u0F68 \u0F69 \u0F6A \u0F71 \u0F72 \u0F73 \u0F74 \u0F75 \u0F76 \u0F77 \u0F78 \u0F79 \u0F7A \u0F7B \u0F7C \u0F7D \u0F7E \u0F7F \u0F80 \u0F81 \u0F82 \u0F83 \u0F84 \u0F85 \u0F86 ...'},
                {'Block': 'Myanmar', 'Sample': '\u1000 \u1001 \u1002 \u1003 \u1004 \u1005 \u1006 \u1007 \u1008 \u1009 \u100A \u100B \u100C \u100D \u100E \u100F \u1010 \u1011 \u1012 \u1013 \u1014 \u1015 \u1016 \u1017 \u1018 \u1019 \u101A \u101B \u101C \u101D \u101E \u101F \u1020 \u1021 \u1023 \u1024 \u1025 \u1026 \u1027 \u1029 \u102A \u102C \u102D \u102E \u102F \u1030 \u1031 \u1032 \u1036 \u1037 \u1038 \u1039 \u1040 \u1041 \u1042 \u1043 \u1044 \u1045 \u1046 \u1047 \u1048 \u1049 \u104A \u104B \u104C \u104D \u104E \u104F \u1050 \u1051 \u1052 \u1053 \u1054 \u1055 \u1056 \u1057 \u1058 \u1059'},
                {'Block': 'Georgian', 'Sample': '\u10A0 \u10A1 \u10A2 \u10A3 \u10A4 \u10A5 \u10A6 \u10A7 \u10A8 \u10A9 \u10AA \u10AB \u10AC \u10AD \u10AE \u10AF \u10B0 \u10B1 \u10B2 \u10B3 \u10B4 \u10B5 \u10B6 \u10B7 \u10B8 \u10B9 \u10BA \u10BB \u10BC \u10BD \u10BE \u10BF \u10C0 \u10C1 \u10C2 \u10C3 \u10C4 \u10C5 \u10D0 \u10D1 \u10D2 \u10D3 \u10D4 \u10D5 \u10D6 \u10D7 \u10D8 \u10D9 \u10DA \u10DB \u10DC \u10DD \u10DE \u10DF \u10E0 \u10E1 \u10E2 \u10E3 \u10E4 \u10E5 \u10E6 \u10E7 \u10E8 \u10E9 \u10EA \u10EB \u10EC \u10ED \u10EE \u10EF \u10F0 \u10F1 \u10F2 \u10F3 \u10F4 \u10F5 \u10F6 \u10F7 \u10F8 \u10FB'},
                {'Block': 'Hangul Jamo', 'Sample': '\u1100 \u1101 \u1102 \u1103 \u1104 \u1105 \u1106 \u1107 \u1108 \u1109 \u110A \u110B \u110C \u110D \u110E \u110F \u1110 \u1111 \u1112 \u1113 \u1114 \u1115 \u1116 \u1117 \u1118 \u1119 \u111A \u111B \u111C \u111D \u111E \u111F \u1120 \u1121 \u1122 \u1123 \u1124 \u1125 \u1126 \u1127 \u1128 \u1129 \u112A \u112B \u112C \u112D \u112E \u112F \u1130 \u1131 \u1132 \u1133 \u1134 \u1135 \u1136 \u1137 \u1138 \u1139 \u113A \u113B \u113C \u113D \u113E \u113F \u1140 \u1141 \u1142 \u1143 \u1144 \u1145 \u1146 \u1147 \u1148 \u1149 \u114A \u114B \u114C \u114D \u114E \u114F \u1150 \u1151 \u1152 \u1153 \u1154 \u1155 \u1156 \u1157 \u1158 \u1159 \u115F \u1160 \u1161 \u1162 \u1163 \u1164 \u1165 \u1166 \u1167 \u1168 \u1169 \u116A \u116B \u116C \u116D \u116E \u116F \u1170 \u1171 \u1172 \u1173 \u1174 \u1175 \u1176 \u1177 \u1178 \u1179 \u117A \u117B \u117C \u117D \u117E \u117F \u1180 \u1181 \u1182 \u1183 \u1184 ...'},
                {'Block': 'Ethiopic', 'Sample': '\u1200 \u1201 \u1202 \u1203 \u1204 \u1205 \u1206 \u1208 \u1209 \u120A \u120B \u120C \u120D \u120E \u120F \u1210 \u1211 \u1212 \u1213 \u1214 \u1215 \u1216 \u1217 \u1218 \u1219 \u121A \u121B \u121C \u121D \u121E \u121F \u1220 \u1221 \u1222 \u1223 \u1224 \u1225 \u1226 \u1227 \u1228 \u1229 \u122A \u122B \u122C \u122D \u122E \u122F \u1230 \u1231 \u1232 \u1233 \u1234 \u1235 \u1236 \u1237 \u1238 \u1239 \u123A \u123B \u123C \u123D \u123E \u123F \u1240 \u1241 \u1242 \u1243 \u1244 \u1245 \u1246 \u1248 \u124A \u124B \u124C \u124D \u1250 \u1251 \u1252 \u1253 \u1254 \u1255 \u1256 \u1258 \u125A \u125B \u125C \u125D \u1260 \u1261 \u1262 \u1263 \u1264 \u1265 \u1266 \u1267 \u1268 \u1269 \u126A \u126B \u126C \u126D \u126E \u126F \u1270 \u1271 \u1272 \u1273 \u1274 \u1275 \u1276 \u1277 \u1278 \u1279 \u127A \u127B \u127C \u127D \u127E \u127F \u1280 \u1281 \u1282 \u1283 \u1284 \u1285 \u1286 \u1288 \u128A ...'},
                {'Block': 'Cherokee', 'Sample': '\u13A0 \u13A1 \u13A2 \u13A3 \u13A4 \u13A5 \u13A6 \u13A7 \u13A8 \u13A9 \u13AA \u13AB \u13AC \u13AD \u13AE \u13AF \u13B0 \u13B1 \u13B2 \u13B3 \u13B4 \u13B5 \u13B6 \u13B7 \u13B8 \u13B9 \u13BA \u13BB \u13BC \u13BD \u13BE \u13BF \u13C0 \u13C1 \u13C2 \u13C3 \u13C4 \u13C5 \u13C6 \u13C7 \u13C8 \u13C9 \u13CA \u13CB \u13CC \u13CD \u13CE \u13CF \u13D0 \u13D1 \u13D2 \u13D3 \u13D4 \u13D5 \u13D6 \u13D7 \u13D8 \u13D9 \u13DA \u13DB \u13DC \u13DD \u13DE \u13DF \u13E0 \u13E1 \u13E2 \u13E3 \u13E4 \u13E5 \u13E6 \u13E7 \u13E8 \u13E9 \u13EA \u13EB \u13EC \u13ED \u13EE \u13EF \u13F0 \u13F1 \u13F2 \u13F3 \u13F4'},
                {'Block': 'Unified Canadian Aboriginal Syllabics', 'Sample': '\u1401 \u1402 \u1403 \u1404 \u1405 \u1406 \u1407 \u1408 \u1409 \u140A \u140B \u140C \u140D \u140E \u140F \u1410 \u1411 \u1412 \u1413 \u1414 \u1415 \u1416 \u1417 \u1418 \u1419 \u141A \u141B \u141C \u141D \u141E \u141F \u1420 \u1421 \u1422 \u1423 \u1424 \u1425 \u1426 \u1427 \u1428 \u1429 \u142A \u142B \u142C \u142D \u142E \u142F \u1430 \u1431 \u1432 \u1433 \u1434 \u1435 \u1436 \u1437 \u1438 \u1439 \u143A \u143B \u143C \u143D \u143E \u143F \u1440 \u1441 \u1442 \u1443 \u1444 \u1445 \u1446 \u1447 \u1448 \u1449 \u144A \u144B \u144C \u144D \u144E \u144F \u1450 \u1451 \u1452 \u1453 \u1454 \u1455 \u1456 \u1457 \u1458 \u1459 \u145A \u145B \u145C \u145D \u145E \u145F \u1460 \u1461 \u1462 \u1463 \u1464 \u1465 \u1466 \u1467 \u1468 \u1469 \u146A \u146B \u146C \u146D \u146E \u146F \u1470 \u1471 \u1472 \u1473 \u1474 \u1475 \u1476 \u1477 \u1478 \u1479 \u147A \u147B \u147C \u147D \u147E \u147F \u1480 ...'},
                {'Block': 'Ogham', 'Sample': '\u1680 \u1681 \u1682 \u1683 \u1684 \u1685 \u1686 \u1687 \u1688 \u1689 \u168A \u168B \u168C \u168D \u168E \u168F \u1690 \u1691 \u1692 \u1693 \u1694 \u1695 \u1696 \u1697 \u1698 \u1699 \u169A \u169B \u169C'},
                {'Block': 'Runic', 'Sample': '\u16A0 \u16A1 \u16A2 \u16A3 \u16A4 \u16A5 \u16A6 \u16A7 \u16A8 \u16A9 \u16AA \u16AB \u16AC \u16AD \u16AE \u16AF \u16B0 \u16B1 \u16B2 \u16B3 \u16B4 \u16B5 \u16B6 \u16B7 \u16B8 \u16B9 \u16BA \u16BB \u16BC \u16BD \u16BE \u16BF \u16C0 \u16C1 \u16C2 \u16C3 \u16C4 \u16C5 \u16C6 \u16C7 \u16C8 \u16C9 \u16CA \u16CB \u16CC \u16CD \u16CE \u16CF \u16D0 \u16D1 \u16D2 \u16D3 \u16D4 \u16D5 \u16D6 \u16D7 \u16D8 \u16D9 \u16DA \u16DB \u16DC \u16DD \u16DE \u16DF \u16E0 \u16E1 \u16E2 \u16E3 \u16E4 \u16E5 \u16E6 \u16E7 \u16E8 \u16E9 \u16EA \u16EB \u16EC \u16ED \u16EE \u16EF \u16F0'},
                {'Block': 'Tagalog', 'Sample': '\u1700 \u1701 \u1702 \u1703 \u1704 \u1705 \u1706 \u1707 \u1708 \u1709 \u170A \u170B \u170C \u170E \u170F \u1710 \u1711 \u1712 \u1713 \u1714'},
                {'Block': 'Hanunoo', 'Sample': '\u1720 \u1721 \u1722 \u1723 \u1724 \u1725 \u1726 \u1727 \u1728 \u1729 \u172A \u172B \u172C \u172D \u172E \u172F \u1730 \u1731 \u1732 \u1733 \u1734 \u1735 \u1736'},
                {'Block': 'Buhid', 'Sample': '\u1740 \u1741 \u1742 \u1743 \u1744 \u1745 \u1746 \u1747 \u1748 \u1749 \u174A \u174B \u174C \u174D \u174E \u174F \u1750 \u1751 \u1752 \u1753'},
                {'Block': 'Tagbanwa', 'Sample': '\u1760 \u1761 \u1762 \u1763 \u1764 \u1765 \u1766 \u1767 \u1768 \u1769 \u176A \u176B \u176C \u176E \u176F \u1770 \u1772 \u1773'},
                {'Block': 'Khmer', 'Sample': '\u1780 \u1781 \u1782 \u1783 \u1784 \u1785 \u1786 \u1787 \u1788 \u1789 \u178A \u178B \u178C \u178D \u178E \u178F \u1790 \u1791 \u1792 \u1793 \u1794 \u1795 \u1796 \u1797 \u1798 \u1799 \u179A \u179B \u179C \u179D \u179E \u179F \u17A0 \u17A1 \u17A2 \u17A3 \u17A4 \u17A5 \u17A6 \u17A7 \u17A8 \u17A9 \u17AA \u17AB \u17AC \u17AD \u17AE \u17AF \u17B0 \u17B1 \u17B2 \u17B3 \u17B4 \u17B5 \u17B6 \u17B7 \u17B8 \u17B9 \u17BA \u17BB \u17BC \u17BD \u17BE \u17BF \u17C0 \u17C1 \u17C2 \u17C3 \u17C4 \u17C5 \u17C6 \u17C7 \u17C8 \u17C9 \u17CA \u17CB \u17CC \u17CD \u17CE \u17CF \u17D0 \u17D1 \u17D2 \u17D3 \u17D4 \u17D5 \u17D6 \u17D7 \u17D8 \u17D9 \u17DA \u17DB \u17DC \u17E0 \u17E1 \u17E2 \u17E3 \u17E4 \u17E5 \u17E6 \u17E7 \u17E8 \u17E9'},
                {'Block': 'Mongolian', 'Sample': '\u1800 \u1801 \u1802 \u1803 \u1804 \u1805 \u1806 \u1807 \u1808 \u1809 \u180A \u180B \u180C \u180D \u180E \u1810 \u1811 \u1812 \u1813 \u1814 \u1815 \u1816 \u1817 \u1818 \u1819 \u1820 \u1821 \u1822 \u1823 \u1824 \u1825 \u1826 \u1827 \u1828 \u1829 \u182A \u182B \u182C \u182D \u182E \u182F \u1830 \u1831 \u1832 \u1833 \u1834 \u1835 \u1836 \u1837 \u1838 \u1839 \u183A \u183B \u183C \u183D \u183E \u183F \u1840 \u1841 \u1842 \u1843 \u1844 \u1845 \u1846 \u1847 \u1848 \u1849 \u184A \u184B \u184C \u184D \u184E \u184F \u1850 \u1851 \u1852 \u1853 \u1854 \u1855 \u1856 \u1857 \u1858 \u1859 \u185A \u185B \u185C \u185D \u185E \u185F \u1860 \u1861 \u1862 \u1863 \u1864 \u1865 \u1866 \u1867 \u1868 \u1869 \u186A \u186B \u186C \u186D \u186E \u186F \u1870 \u1871 \u1872 \u1873 \u1874 \u1875 \u1876 \u1877 \u1880 \u1881 \u1882 \u1883 \u1884 \u1885 \u1886 \u1887 \u1888 \u1889 \u188A \u188B \u188C \u188D \u188E ...'},
                {'Block': 'Latin Extended Additional', 'Sample': '\u1E00 \u1E01 \u1E02 \u1E03 \u1E04 \u1E05 \u1E06 \u1E07 \u1E08 \u1E09 \u1E0A \u1E0B \u1E0C \u1E0D \u1E0E \u1E0F \u1E10 \u1E11 \u1E12 \u1E13 \u1E14 \u1E15 \u1E16 \u1E17 \u1E18 \u1E19 \u1E1A \u1E1B \u1E1C \u1E1D \u1E1E \u1E1F \u1E20 \u1E21 \u1E22 \u1E23 \u1E24 \u1E25 \u1E26 \u1E27 \u1E28 \u1E29 \u1E2A \u1E2B \u1E2C \u1E2D \u1E2E \u1E2F \u1E30 \u1E31 \u1E32 \u1E33 \u1E34 \u1E35 \u1E36 \u1E37 \u1E38 \u1E39 \u1E3A \u1E3B \u1E3C \u1E3D \u1E3E \u1E3F \u1E40 \u1E41 \u1E42 \u1E43 \u1E44 \u1E45 \u1E46 \u1E47 \u1E48 \u1E49 \u1E4A \u1E4B \u1E4C \u1E4D \u1E4E \u1E4F \u1E50 \u1E51 \u1E52 \u1E53 \u1E54 \u1E55 \u1E56 \u1E57 \u1E58 \u1E59 \u1E5A \u1E5B \u1E5C \u1E5D \u1E5E \u1E5F \u1E60 \u1E61 \u1E62 \u1E63 \u1E64 \u1E65 \u1E66 \u1E67 \u1E68 \u1E69 \u1E6A \u1E6B \u1E6C \u1E6D \u1E6E \u1E6F \u1E70 \u1E71 \u1E72 \u1E73 \u1E74 \u1E75 \u1E76 \u1E77 \u1E78 \u1E79 \u1E7A \u1E7B \u1E7C \u1E7D \u1E7E \u1E7F ...'},
                {'Block': 'Greek Extended', 'Sample': '\u1F00 \u1F01 \u1F02 \u1F03 \u1F04 \u1F05 \u1F06 \u1F07 \u1F08 \u1F09 \u1F0A \u1F0B \u1F0C \u1F0D \u1F0E \u1F0F \u1F10 \u1F11 \u1F12 \u1F13 \u1F14 \u1F15 \u1F18 \u1F19 \u1F1A \u1F1B \u1F1C \u1F1D \u1F20 \u1F21 \u1F22 \u1F23 \u1F24 \u1F25 \u1F26 \u1F27 \u1F28 \u1F29 \u1F2A \u1F2B \u1F2C \u1F2D \u1F2E \u1F2F \u1F30 \u1F31 \u1F32 \u1F33 \u1F34 \u1F35 \u1F36 \u1F37 \u1F38 \u1F39 \u1F3A \u1F3B \u1F3C \u1F3D \u1F3E \u1F3F \u1F40 \u1F41 \u1F42 \u1F43 \u1F44 \u1F45 \u1F48 \u1F49 \u1F4A \u1F4B \u1F4C \u1F4D \u1F50 \u1F51 \u1F52 \u1F53 \u1F54 \u1F55 \u1F56 \u1F57 \u1F59 \u1F5B \u1F5D \u1F5F \u1F60 \u1F61 \u1F62 \u1F63 \u1F64 \u1F65 \u1F66 \u1F67 \u1F68 \u1F69 \u1F6A \u1F6B \u1F6C \u1F6D \u1F6E \u1F6F \u1F70 \u1F71 \u1F72 \u1F73 \u1F74 \u1F75 \u1F76 \u1F77 \u1F78 \u1F79 \u1F7A \u1F7B \u1F7C \u1F7D \u1F80 \u1F81 \u1F82 \u1F83 \u1F84 \u1F85 \u1F86 \u1F87 \u1F88 \u1F89 \u1F8A \u1F8B \u1F8C \u1F8D ...'},
                {'Block': 'General Punctuation', 'Sample': '\u2000 \u2001 \u2002 \u2003 \u2004 \u2005 \u2006 \u2007 \u2008 \u2009 \u200A \u200B \u200C \u200D \u200E \u200F \u2010 \u2011 \u2012 \u2013 \u2014 \u2015 \u2016 \u2017 \u2018 \u2019 \u201A \u201B \u201C \u201D \u201E \u201F \u2020 \u2021 \u2022 \u2023 \u2024 \u2025 \u2026 \u2027 \u2028 \u2029 \u202A \u202B \u202C \u202D \u202E \u202F \u2030 \u2031 \u2032 \u2033 \u2034 \u2035 \u2036 \u2037 \u2038 \u2039 \u203A \u203B \u203C \u203D \u203E \u203F \u2040 \u2041 \u2042 \u2043 \u2044 \u2045 \u2046 \u2047 \u2048 \u2049 \u204A \u204B \u204C \u204D \u204E \u204F \u2050 \u2051 \u2052 \u2057 \u205F \u2060 \u2061 \u2062 \u2063 \u206A \u206B \u206C \u206D \u206E \u206F'},
                {'Block': 'Superscripts and Subscripts', 'Sample': '\u2070 \u2071 \u2074 \u2075 \u2076 \u2077 \u2078 \u2079 \u207A \u207B \u207C \u207D \u207E \u207F \u2080 \u2081 \u2082 \u2083 \u2084 \u2085 \u2086 \u2087 \u2088 \u2089 \u208A \u208B \u208C \u208D \u208E'},
                {'Block': 'Currency Symbols', 'Sample': '\u20A0 \u20A1 \u20A2 \u20A3 \u20A4 \u20A5 \u20A6 \u20A7 \u20A8 \u20A9 \u20AA \u20AB \u20AC \u20AD \u20AE \u20AF \u20B0 \u20B1'},
                {'Block': 'Combining Diacritical Marks for Symbols', 'Sample': '\u20D0 \u20D1 \u20D2 \u20D3 \u20D4 \u20D5 \u20D6 \u20D7 \u20D8 \u20D9 \u20DA \u20DB \u20DC \u20DD \u20DE \u20DF \u20E0 \u20E1 \u20E2 \u20E3 \u20E4 \u20E5 \u20E6 \u20E7 \u20E8 \u20E9 \u20EA'},
                {'Block': 'Letterlike Symbols', 'Sample': '\u2100 \u2101 \u2102 \u2103 \u2104 \u2105 \u2106 \u2107 \u2108 \u2109 \u210A \u210B \u210C \u210D \u210E \u210F \u2110 \u2111 \u2112 \u2113 \u2114 \u2115 \u2116 \u2117 \u2118 \u2119 \u211A \u211B \u211C \u211D \u211E \u211F \u2120 \u2121 \u2122 \u2123 \u2124 \u2125 \u2126 \u2127 \u2128 \u2129 \u212A \u212B \u212C \u212D \u212E \u212F \u2130 \u2131 \u2132 \u2133 \u2134 \u2135 \u2136 \u2137 \u2138 \u2139 \u213A \u213D \u213E \u213F \u2140 \u2141 \u2142 \u2143 \u2144 \u2145 \u2146 \u2147 \u2148 \u2149 \u214A \u214B'},
                {'Block': 'Number Forms', 'Sample': '\u2153 \u2154 \u2155 \u2156 \u2157 \u2158 \u2159 \u215A \u215B \u215C \u215D \u215E \u215F \u2160 \u2161 \u2162 \u2163 \u2164 \u2165 \u2166 \u2167 \u2168 \u2169 \u216A \u216B \u216C \u216D \u216E \u216F \u2170 \u2171 \u2172 \u2173 \u2174 \u2175 \u2176 \u2177 \u2178 \u2179 \u217A \u217B \u217C \u217D \u217E \u217F \u2180 \u2181 \u2182 \u2183'},
                {'Block': 'Arrows', 'Sample': '\u2190 \u2191 \u2192 \u2193 \u2194 \u2195 \u2196 \u2197 \u2198 \u2199 \u219A \u219B \u219C \u219D \u219E \u219F \u21A0 \u21A1 \u21A2 \u21A3 \u21A4 \u21A5 \u21A6 \u21A7 \u21A8 \u21A9 \u21AA \u21AB \u21AC \u21AD \u21AE \u21AF \u21B0 \u21B1 \u21B2 \u21B3 \u21B4 \u21B5 \u21B6 \u21B7 \u21B8 \u21B9 \u21BA \u21BB \u21BC \u21BD \u21BE \u21BF \u21C0 \u21C1 \u21C2 \u21C3 \u21C4 \u21C5 \u21C6 \u21C7 \u21C8 \u21C9 \u21CA \u21CB \u21CC \u21CD \u21CE \u21CF \u21D0 \u21D1 \u21D2 \u21D3 \u21D4 \u21D5 \u21D6 \u21D7 \u21D8 \u21D9 \u21DA \u21DB \u21DC \u21DD \u21DE \u21DF \u21E0 \u21E1 \u21E2 \u21E3 \u21E4 \u21E5 \u21E6 \u21E7 \u21E8 \u21E9 \u21EA \u21EB \u21EC \u21ED \u21EE \u21EF \u21F0 \u21F1 \u21F2 \u21F3 \u21F4 \u21F5 \u21F6 \u21F7 \u21F8 \u21F9 \u21FA \u21FB \u21FC \u21FD \u21FE \u21FF'},
                {'Block': 'Mathematical Operators', 'Sample': '\u2200 \u2201 \u2202 \u2203 \u2204 \u2205 \u2206 \u2207 \u2208 \u2209 \u220A \u220B \u220C \u220D \u220E \u220F \u2210 \u2211 \u2212 \u2213 \u2214 \u2215 \u2216 \u2217 \u2218 \u2219 \u221A \u221B \u221C \u221D \u221E \u221F \u2220 \u2221 \u2222 \u2223 \u2224 \u2225 \u2226 \u2227 \u2228 \u2229 \u222A \u222B \u222C \u222D \u222E \u222F \u2230 \u2231 \u2232 \u2233 \u2234 \u2235 \u2236 \u2237 \u2238 \u2239 \u223A \u223B \u223C \u223D \u223E \u223F \u2240 \u2241 \u2242 \u2243 \u2244 \u2245 \u2246 \u2247 \u2248 \u2249 \u224A \u224B \u224C \u224D \u224E \u224F \u2250 \u2251 \u2252 \u2253 \u2254 \u2255 \u2256 \u2257 \u2258 \u2259 \u225A \u225B \u225C \u225D \u225E \u225F \u2260 \u2261 \u2262 \u2263 \u2264 \u2265 \u2266 \u2267 \u2268 \u2269 \u226A \u226B \u226C \u226D \u226E \u226F \u2270 \u2271 \u2272 \u2273 \u2274 \u2275 \u2276 \u2277 \u2278 \u2279 \u227A \u227B \u227C \u227D \u227E \u227F ...'},
                {'Block': 'Miscellaneous Technical', 'Sample': '\u2300 \u2301 \u2302 \u2303 \u2304 \u2305 \u2306 \u2307 \u2308 \u2309 \u230A \u230B \u230C \u230D \u230E \u230F \u2310 \u2311 \u2312 \u2313 \u2314 \u2315 \u2316 \u2317 \u2318 \u2319 \u231A \u231B \u231C \u231D \u231E \u231F \u2320 \u2321 \u2322 \u2323 \u2324 \u2325 \u2326 \u2327 \u2328 \u2329 \u232A \u232B \u232C \u232D \u232E \u232F \u2330 \u2331 \u2332 \u2333 \u2334 \u2335 \u2336 \u2337 \u2338 \u2339 \u233A \u233B \u233C \u233D \u233E \u233F \u2340 \u2341 \u2342 \u2343 \u2344 \u2345 \u2346 \u2347 \u2348 \u2349 \u234A \u234B \u234C \u234D \u234E \u234F \u2350 \u2351 \u2352 \u2353 \u2354 \u2355 \u2356 \u2357 \u2358 \u2359 \u235A \u235B \u235C \u235D \u235E \u235F \u2360 \u2361 \u2362 \u2363 \u2364 \u2365 \u2366 \u2367 \u2368 \u2369 \u236A \u236B \u236C \u236D \u236E \u236F \u2370 \u2371 \u2372 \u2373 \u2374 \u2375 \u2376 \u2377 \u2378 \u2379 \u237A \u237B \u237C \u237D \u237E \u237F ...'},
                {'Block': 'Control Pictures', 'Sample': '\u2400 \u2401 \u2402 \u2403 \u2404 \u2405 \u2406 \u2407 \u2408 \u2409 \u240A \u240B \u240C \u240D \u240E \u240F \u2410 \u2411 \u2412 \u2413 \u2414 \u2415 \u2416 \u2417 \u2418 \u2419 \u241A \u241B \u241C \u241D \u241E \u241F \u2420 \u2421 \u2422 \u2423 \u2424 \u2425 \u2426'},
                {'Block': 'Optical Character Recognition', 'Sample': '\u2440 \u2441 \u2442 \u2443 \u2444 \u2445 \u2446 \u2447 \u2448 \u2449 \u244A'},
                {'Block': 'Enclosed Alphanumerics', 'Sample': '\u2460 \u2461 \u2462 \u2463 \u2464 \u2465 \u2466 \u2467 \u2468 \u2469 \u246A \u246B \u246C \u246D \u246E \u246F \u2470 \u2471 \u2472 \u2473 \u2474 \u2475 \u2476 \u2477 \u2478 \u2479 \u247A \u247B \u247C \u247D \u247E \u247F \u2480 \u2481 \u2482 \u2483 \u2484 \u2485 \u2486 \u2487 \u2488 \u2489 \u248A \u248B \u248C \u248D \u248E \u248F \u2490 \u2491 \u2492 \u2493 \u2494 \u2495 \u2496 \u2497 \u2498 \u2499 \u249A \u249B \u249C \u249D \u249E \u249F \u24A0 \u24A1 \u24A2 \u24A3 \u24A4 \u24A5 \u24A6 \u24A7 \u24A8 \u24A9 \u24AA \u24AB \u24AC \u24AD \u24AE \u24AF \u24B0 \u24B1 \u24B2 \u24B3 \u24B4 \u24B5 \u24B6 \u24B7 \u24B8 \u24B9 \u24BA \u24BB \u24BC \u24BD \u24BE \u24BF \u24C0 \u24C1 \u24C2 \u24C3 \u24C4 \u24C5 \u24C6 \u24C7 \u24C8 \u24C9 \u24CA \u24CB \u24CC \u24CD \u24CE \u24CF \u24D0 \u24D1 \u24D2 \u24D3 \u24D4 \u24D5 \u24D6 \u24D7 \u24D8 \u24D9 \u24DA \u24DB \u24DC \u24DD \u24DE \u24DF ...'},
                {'Block': 'Box Drawing', 'Sample': '\u2500 \u2501 \u2502 \u2503 \u2504 \u2505 \u2506 \u2507 \u2508 \u2509 \u250A \u250B \u250C \u250D \u250E \u250F \u2510 \u2511 \u2512 \u2513 \u2514 \u2515 \u2516 \u2517 \u2518 \u2519 \u251A \u251B \u251C \u251D \u251E \u251F \u2520 \u2521 \u2522 \u2523 \u2524 \u2525 \u2526 \u2527 \u2528 \u2529 \u252A \u252B \u252C \u252D \u252E \u252F \u2530 \u2531 \u2532 \u2533 \u2534 \u2535 \u2536 \u2537 \u2538 \u2539 \u253A \u253B \u253C \u253D \u253E \u253F \u2540 \u2541 \u2542 \u2543 \u2544 \u2545 \u2546 \u2547 \u2548 \u2549 \u254A \u254B \u254C \u254D \u254E \u254F \u2550 \u2551 \u2552 \u2553 \u2554 \u2555 \u2556 \u2557 \u2558 \u2559 \u255A \u255B \u255C \u255D \u255E \u255F \u2560 \u2561 \u2562 \u2563 \u2564 \u2565 \u2566 \u2567 \u2568 \u2569 \u256A \u256B \u256C \u256D \u256E \u256F \u2570 \u2571 \u2572 \u2573 \u2574 \u2575 \u2576 \u2577 \u2578 \u2579 \u257A \u257B \u257C \u257D \u257E \u257F'},
                {'Block': 'Block Elements', 'Sample': '\u2580 \u2581 \u2582 \u2583 \u2584 \u2585 \u2586 \u2587 \u2588 \u2589 \u258A \u258B \u258C \u258D \u258E \u258F \u2590 \u2591 \u2592 \u2593 \u2594 \u2595 \u2596 \u2597 \u2598 \u2599 \u259A \u259B \u259C \u259D \u259E \u259F'},
                {'Block': 'Geometric Shapes', 'Sample': '\u25A0 \u25A1 \u25A2 \u25A3 \u25A4 \u25A5 \u25A6 \u25A7 \u25A8 \u25A9 \u25AA \u25AB \u25AC \u25AD \u25AE \u25AF \u25B0 \u25B1 \u25B2 \u25B3 \u25B4 \u25B5 \u25B6 \u25B7 \u25B8 \u25B9 \u25BA \u25BB \u25BC \u25BD \u25BE \u25BF \u25C0 \u25C1 \u25C2 \u25C3 \u25C4 \u25C5 \u25C6 \u25C7 \u25C8 \u25C9 \u25CA \u25CB \u25CC \u25CD \u25CE \u25CF \u25D0 \u25D1 \u25D2 \u25D3 \u25D4 \u25D5 \u25D6 \u25D7 \u25D8 \u25D9 \u25DA \u25DB \u25DC \u25DD \u25DE \u25DF \u25E0 \u25E1 \u25E2 \u25E3 \u25E4 \u25E5 \u25E6 \u25E7 \u25E8 \u25E9 \u25EA \u25EB \u25EC \u25ED \u25EE \u25EF \u25F0 \u25F1 \u25F2 \u25F3 \u25F4 \u25F5 \u25F6 \u25F7 \u25F8 \u25F9 \u25FA \u25FB \u25FC \u25FD \u25FE \u25FF'},
                {'Block': 'Miscellaneous Symbols', 'Sample': '\u2600 \u2601 \u2602 \u2603 \u2604 \u2605 \u2606 \u2607 \u2608 \u2609 \u260A \u260B \u260C \u260D \u260E \u260F \u2610 \u2611 \u2612 \u2613 \u2616 \u2617 \u2619 \u261A \u261B \u261C \u261D \u261E \u261F \u2620 \u2621 \u2622 \u2623 \u2624 \u2625 \u2626 \u2627 \u2628 \u2629 \u262A \u262B \u262C \u262D \u262E \u262F \u2630 \u2631 \u2632 \u2633 \u2634 \u2635 \u2636 \u2637 \u2638 \u2639 \u263A \u263B \u263C \u263D \u263E \u263F \u2640 \u2641 \u2642 \u2643 \u2644 \u2645 \u2646 \u2647 \u2648 \u2649 \u264A \u264B \u264C \u264D \u264E \u264F \u2650 \u2651 \u2652 \u2653 \u2654 \u2655 \u2656 \u2657 \u2658 \u2659 \u265A \u265B \u265C \u265D \u265E \u265F \u2660 \u2661 \u2662 \u2663 \u2664 \u2665 \u2666 \u2667 \u2668 \u2669 \u266A \u266B \u266C \u266D \u266E \u266F \u2670 \u2671 \u2672 \u2673 \u2674 \u2675 \u2676 \u2677 \u2678 \u2679 \u267A \u267B \u267C \u267D \u2680 \u2681 \u2682 \u2683 \u2684 ...'},
                {'Block': 'Dingbats', 'Sample': '\u2701 \u2702 \u2703 \u2704 \u2706 \u2707 \u2708 \u2709 \u270C \u270D \u270E \u270F \u2710 \u2711 \u2712 \u2713 \u2714 \u2715 \u2716 \u2717 \u2718 \u2719 \u271A \u271B \u271C \u271D \u271E \u271F \u2720 \u2721 \u2722 \u2723 \u2724 \u2725 \u2726 \u2727 \u2729 \u272A \u272B \u272C \u272D \u272E \u272F \u2730 \u2731 \u2732 \u2733 \u2734 \u2735 \u2736 \u2737 \u2738 \u2739 \u273A \u273B \u273C \u273D \u273E \u273F \u2740 \u2741 \u2742 \u2743 \u2744 \u2745 \u2746 \u2747 \u2748 \u2749 \u274A \u274B \u274D \u274F \u2750 \u2751 \u2752 \u2756 \u2758 \u2759 \u275A \u275B \u275C \u275D \u275E \u2761 \u2762 \u2763 \u2764 \u2765 \u2766 \u2767 \u2768 \u2769 \u276A \u276B \u276C \u276D \u276E \u276F \u2770 \u2771 \u2772 \u2773 \u2774 \u2775 \u2776 \u2777 \u2778 \u2779 \u277A \u277B \u277C \u277D \u277E \u277F \u2780 \u2781 \u2782 \u2783 \u2784 \u2785 \u2786 \u2787 \u2788 \u2789 \u278A \u278B \u278C ...'},
                {'Block': 'Miscellaneous Mathematical Symbols-A', 'Sample': '\u27D0 \u27D1 \u27D2 \u27D3 \u27D4 \u27D5 \u27D6 \u27D7 \u27D8 \u27D9 \u27DA \u27DB \u27DC \u27DD \u27DE \u27DF \u27E0 \u27E1 \u27E2 \u27E3 \u27E4 \u27E5 \u27E6 \u27E7 \u27E8 \u27E9 \u27EA \u27EB'},
                {'Block': 'Supplemental Arrows-A', 'Sample': '\u27F0 \u27F1 \u27F2 \u27F3 \u27F4 \u27F5 \u27F6 \u27F7 \u27F8 \u27F9 \u27FA \u27FB \u27FC \u27FD \u27FE \u27FF'},
                {'Block': 'Braille Patterns', 'Sample': '\u2800 \u2801 \u2802 \u2803 \u2804 \u2805 \u2806 \u2807 \u2808 \u2809 \u280A \u280B \u280C \u280D \u280E \u280F \u2810 \u2811 \u2812 \u2813 \u2814 \u2815 \u2816 \u2817 \u2818 \u2819 \u281A \u281B \u281C \u281D \u281E \u281F \u2820 \u2821 \u2822 \u2823 \u2824 \u2825 \u2826 \u2827 \u2828 \u2829 \u282A \u282B \u282C \u282D \u282E \u282F \u2830 \u2831 \u2832 \u2833 \u2834 \u2835 \u2836 \u2837 \u2838 \u2839 \u283A \u283B \u283C \u283D \u283E \u283F \u2840 \u2841 \u2842 \u2843 \u2844 \u2845 \u2846 \u2847 \u2848 \u2849 \u284A \u284B \u284C \u284D \u284E \u284F \u2850 \u2851 \u2852 \u2853 \u2854 \u2855 \u2856 \u2857 \u2858 \u2859 \u285A \u285B \u285C \u285D \u285E \u285F \u2860 \u2861 \u2862 \u2863 \u2864 \u2865 \u2866 \u2867 \u2868 \u2869 \u286A \u286B \u286C \u286D \u286E \u286F \u2870 \u2871 \u2872 \u2873 \u2874 \u2875 \u2876 \u2877 \u2878 \u2879 \u287A \u287B \u287C \u287D \u287E \u287F ...'},
                {'Block': 'Supplemental Arrows-B', 'Sample': '\u2900 \u2901 \u2902 \u2903 \u2904 \u2905 \u2906 \u2907 \u2908 \u2909 \u290A \u290B \u290C \u290D \u290E \u290F \u2910 \u2911 \u2912 \u2913 \u2914 \u2915 \u2916 \u2917 \u2918 \u2919 \u291A \u291B \u291C \u291D \u291E \u291F \u2920 \u2921 \u2922 \u2923 \u2924 \u2925 \u2926 \u2927 \u2928 \u2929 \u292A \u292B \u292C \u292D \u292E \u292F \u2930 \u2931 \u2932 \u2933 \u2934 \u2935 \u2936 \u2937 \u2938 \u2939 \u293A \u293B \u293C \u293D \u293E \u293F \u2940 \u2941 \u2942 \u2943 \u2944 \u2945 \u2946 \u2947 \u2948 \u2949 \u294A \u294B \u294C \u294D \u294E \u294F \u2950 \u2951 \u2952 \u2953 \u2954 \u2955 \u2956 \u2957 \u2958 \u2959 \u295A \u295B \u295C \u295D \u295E \u295F \u2960 \u2961 \u2962 \u2963 \u2964 \u2965 \u2966 \u2967 \u2968 \u2969 \u296A \u296B \u296C \u296D \u296E \u296F \u2970 \u2971 \u2972 \u2973 \u2974 \u2975 \u2976 \u2977 \u2978 \u2979 \u297A \u297B \u297C \u297D \u297E \u297F'},
                {'Block': 'Miscellaneous Mathematical Symbols-B', 'Sample': '\u2980 \u2981 \u2982 \u2983 \u2984 \u2985 \u2986 \u2987 \u2988 \u2989 \u298A \u298B \u298C \u298D \u298E \u298F \u2990 \u2991 \u2992 \u2993 \u2994 \u2995 \u2996 \u2997 \u2998 \u2999 \u299A \u299B \u299C \u299D \u299E \u299F \u29A0 \u29A1 \u29A2 \u29A3 \u29A4 \u29A5 \u29A6 \u29A7 \u29A8 \u29A9 \u29AA \u29AB \u29AC \u29AD \u29AE \u29AF \u29B0 \u29B1 \u29B2 \u29B3 \u29B4 \u29B5 \u29B6 \u29B7 \u29B8 \u29B9 \u29BA \u29BB \u29BC \u29BD \u29BE \u29BF \u29C0 \u29C1 \u29C2 \u29C3 \u29C4 \u29C5 \u29C6 \u29C7 \u29C8 \u29C9 \u29CA \u29CB \u29CC \u29CD \u29CE \u29CF \u29D0 \u29D1 \u29D2 \u29D3 \u29D4 \u29D5 \u29D6 \u29D7 \u29D8 \u29D9 \u29DA \u29DB \u29DC \u29DD \u29DE \u29DF \u29E0 \u29E1 \u29E2 \u29E3 \u29E4 \u29E5 \u29E6 \u29E7 \u29E8 \u29E9 \u29EA \u29EB \u29EC \u29ED \u29EE \u29EF \u29F0 \u29F1 \u29F2 \u29F3 \u29F4 \u29F5 \u29F6 \u29F7 \u29F8 \u29F9 \u29FA \u29FB \u29FC \u29FD \u29FE \u29FF'},
                {'Block': 'Supplemental Mathematical Operators', 'Sample': '\u2A00 \u2A01 \u2A02 \u2A03 \u2A04 \u2A05 \u2A06 \u2A07 \u2A08 \u2A09 \u2A0A \u2A0B \u2A0C \u2A0D \u2A0E \u2A0F \u2A10 \u2A11 \u2A12 \u2A13 \u2A14 \u2A15 \u2A16 \u2A17 \u2A18 \u2A19 \u2A1A \u2A1B \u2A1C \u2A1D \u2A1E \u2A1F \u2A20 \u2A21 \u2A22 \u2A23 \u2A24 \u2A25 \u2A26 \u2A27 \u2A28 \u2A29 \u2A2A \u2A2B \u2A2C \u2A2D \u2A2E \u2A2F \u2A30 \u2A31 \u2A32 \u2A33 \u2A34 \u2A35 \u2A36 \u2A37 \u2A38 \u2A39 \u2A3A \u2A3B \u2A3C \u2A3D \u2A3E \u2A3F \u2A40 \u2A41 \u2A42 \u2A43 \u2A44 \u2A45 \u2A46 \u2A47 \u2A48 \u2A49 \u2A4A \u2A4B \u2A4C \u2A4D \u2A4E \u2A4F \u2A50 \u2A51 \u2A52 \u2A53 \u2A54 \u2A55 \u2A56 \u2A57 \u2A58 \u2A59 \u2A5A \u2A5B \u2A5C \u2A5D \u2A5E \u2A5F \u2A60 \u2A61 \u2A62 \u2A63 \u2A64 \u2A65 \u2A66 \u2A67 \u2A68 \u2A69 \u2A6A \u2A6B \u2A6C \u2A6D \u2A6E \u2A6F \u2A70 \u2A71 \u2A72 \u2A73 \u2A74 \u2A75 \u2A76 \u2A77 \u2A78 \u2A79 \u2A7A \u2A7B \u2A7C \u2A7D \u2A7E \u2A7F ...'},
                {'Block': 'CJK Radicals Supplement', 'Sample': '\u2E80 \u2E81 \u2E82 \u2E83 \u2E84 \u2E85 \u2E86 \u2E87 \u2E88 \u2E89 \u2E8A \u2E8B \u2E8C \u2E8D \u2E8E \u2E8F \u2E90 \u2E91 \u2E92 \u2E93 \u2E94 \u2E95 \u2E96 \u2E97 \u2E98 \u2E99 \u2E9B \u2E9C \u2E9D \u2E9E \u2E9F \u2EA0 \u2EA1 \u2EA2 \u2EA3 \u2EA4 \u2EA5 \u2EA6 \u2EA7 \u2EA8 \u2EA9 \u2EAA \u2EAB \u2EAC \u2EAD \u2EAE \u2EAF \u2EB0 \u2EB1 \u2EB2 \u2EB3 \u2EB4 \u2EB5 \u2EB6 \u2EB7 \u2EB8 \u2EB9 \u2EBA \u2EBB \u2EBC \u2EBD \u2EBE \u2EBF \u2EC0 \u2EC1 \u2EC2 \u2EC3 \u2EC4 \u2EC5 \u2EC6 \u2EC7 \u2EC8 \u2EC9 \u2ECA \u2ECB \u2ECC \u2ECD \u2ECE \u2ECF \u2ED0 \u2ED1 \u2ED2 \u2ED3 \u2ED4 \u2ED5 \u2ED6 \u2ED7 \u2ED8 \u2ED9 \u2EDA \u2EDB \u2EDC \u2EDD \u2EDE \u2EDF \u2EE0 \u2EE1 \u2EE2 \u2EE3 \u2EE4 \u2EE5 \u2EE6 \u2EE7 \u2EE8 \u2EE9 \u2EEA \u2EEB \u2EEC \u2EED \u2EEE \u2EEF \u2EF0 \u2EF1 \u2EF2 \u2EF3'},
                {'Block': 'Kangxi Radicals', 'Sample': '\u2F00 \u2F01 \u2F02 \u2F03 \u2F04 \u2F05 \u2F06 \u2F07 \u2F08 \u2F09 \u2F0A \u2F0B \u2F0C \u2F0D \u2F0E \u2F0F \u2F10 \u2F11 \u2F12 \u2F13 \u2F14 \u2F15 \u2F16 \u2F17 \u2F18 \u2F19 \u2F1A \u2F1B \u2F1C \u2F1D \u2F1E \u2F1F \u2F20 \u2F21 \u2F22 \u2F23 \u2F24 \u2F25 \u2F26 \u2F27 \u2F28 \u2F29 \u2F2A \u2F2B \u2F2C \u2F2D \u2F2E \u2F2F \u2F30 \u2F31 \u2F32 \u2F33 \u2F34 \u2F35 \u2F36 \u2F37 \u2F38 \u2F39 \u2F3A \u2F3B \u2F3C \u2F3D \u2F3E \u2F3F \u2F40 \u2F41 \u2F42 \u2F43 \u2F44 \u2F45 \u2F46 \u2F47 \u2F48 \u2F49 \u2F4A \u2F4B \u2F4C \u2F4D \u2F4E \u2F4F \u2F50 \u2F51 \u2F52 \u2F53 \u2F54 \u2F55 \u2F56 \u2F57 \u2F58 \u2F59 \u2F5A \u2F5B \u2F5C \u2F5D \u2F5E \u2F5F \u2F60 \u2F61 \u2F62 \u2F63 \u2F64 \u2F65 \u2F66 \u2F67 \u2F68 \u2F69 \u2F6A \u2F6B \u2F6C \u2F6D \u2F6E \u2F6F \u2F70 \u2F71 \u2F72 \u2F73 \u2F74 \u2F75 \u2F76 \u2F77 \u2F78 \u2F79 \u2F7A \u2F7B \u2F7C \u2F7D \u2F7E \u2F7F ...'},
                {'Block': 'Ideographic Description Characters', 'Sample': '\u2FF0 \u2FF1 \u2FF2 \u2FF3 \u2FF4 \u2FF5 \u2FF6 \u2FF7 \u2FF8 \u2FF9 \u2FFA \u2FFB'},
                {'Block': 'CJK Symbols and Punctuation', 'Sample': '\u3000 \u3001 \u3002 \u3003 \u3004 \u3005 \u3006 \u3007 \u3008 \u3009 \u300A \u300B \u300C \u300D \u300E \u300F \u3010 \u3011 \u3012 \u3013 \u3014 \u3015 \u3016 \u3017 \u3018 \u3019 \u301A \u301B \u301C \u301D \u301E \u301F \u3020 \u3021 \u3022 \u3023 \u3024 \u3025 \u3026 \u3027 \u3028 \u3029 \u302A \u302B \u302C \u302D \u302E \u302F \u3030 \u3031 \u3032 \u3033 \u3034 \u3035 \u3036 \u3037 \u3038 \u3039 \u303A \u303B \u303C \u303D \u303E \u303F'},
                {'Block': 'Hiragana', 'Sample': '\u3041 \u3042 \u3043 \u3044 \u3045 \u3046 \u3047 \u3048 \u3049 \u304A \u304B \u304C \u304D \u304E \u304F \u3050 \u3051 \u3052 \u3053 \u3054 \u3055 \u3056 \u3057 \u3058 \u3059 \u305A \u305B \u305C \u305D \u305E \u305F \u3060 \u3061 \u3062 \u3063 \u3064 \u3065 \u3066 \u3067 \u3068 \u3069 \u306A \u306B \u306C \u306D \u306E \u306F \u3070 \u3071 \u3072 \u3073 \u3074 \u3075 \u3076 \u3077 \u3078 \u3079 \u307A \u307B \u307C \u307D \u307E \u307F \u3080 \u3081 \u3082 \u3083 \u3084 \u3085 \u3086 \u3087 \u3088 \u3089 \u308A \u308B \u308C \u308D \u308E \u308F \u3090 \u3091 \u3092 \u3093 \u3094 \u3095 \u3096 \u3099 \u309A \u309B \u309C \u309D \u309E \u309F'},
                {'Block': 'Katakana', 'Sample': '\u30A0 \u30A1 \u30A2 \u30A3 \u30A4 \u30A5 \u30A6 \u30A7 \u30A8 \u30A9 \u30AA \u30AB \u30AC \u30AD \u30AE \u30AF \u30B0 \u30B1 \u30B2 \u30B3 \u30B4 \u30B5 \u30B6 \u30B7 \u30B8 \u30B9 \u30BA \u30BB \u30BC \u30BD \u30BE \u30BF \u30C0 \u30C1 \u30C2 \u30C3 \u30C4 \u30C5 \u30C6 \u30C7 \u30C8 \u30C9 \u30CA \u30CB \u30CC \u30CD \u30CE \u30CF \u30D0 \u30D1 \u30D2 \u30D3 \u30D4 \u30D5 \u30D6 \u30D7 \u30D8 \u30D9 \u30DA \u30DB \u30DC \u30DD \u30DE \u30DF \u30E0 \u30E1 \u30E2 \u30E3 \u30E4 \u30E5 \u30E6 \u30E7 \u30E8 \u30E9 \u30EA \u30EB \u30EC \u30ED \u30EE \u30EF \u30F0 \u30F1 \u30F2 \u30F3 \u30F4 \u30F5 \u30F6 \u30F7 \u30F8 \u30F9 \u30FA \u30FB \u30FC \u30FD \u30FE \u30FF'},
                {'Block': 'Bopomofo', 'Sample': '\u3105 \u3106 \u3107 \u3108 \u3109 \u310A \u310B \u310C \u310D \u310E \u310F \u3110 \u3111 \u3112 \u3113 \u3114 \u3115 \u3116 \u3117 \u3118 \u3119 \u311A \u311B \u311C \u311D \u311E \u311F \u3120 \u3121 \u3122 \u3123 \u3124 \u3125 \u3126 \u3127 \u3128 \u3129 \u312A \u312B \u312C'},
                {'Block': 'Hangul Compatibility Jamo', 'Sample': '\u3131 \u3132 \u3133 \u3134 \u3135 \u3136 \u3137 \u3138 \u3139 \u313A \u313B \u313C \u313D \u313E \u313F \u3140 \u3141 \u3142 \u3143 \u3144 \u3145 \u3146 \u3147 \u3148 \u3149 \u314A \u314B \u314C \u314D \u314E \u314F \u3150 \u3151 \u3152 \u3153 \u3154 \u3155 \u3156 \u3157 \u3158 \u3159 \u315A \u315B \u315C \u315D \u315E \u315F \u3160 \u3161 \u3162 \u3163 \u3164 \u3165 \u3166 \u3167 \u3168 \u3169 \u316A \u316B \u316C \u316D \u316E \u316F \u3170 \u3171 \u3172 \u3173 \u3174 \u3175 \u3176 \u3177 \u3178 \u3179 \u317A \u317B \u317C \u317D \u317E \u317F \u3180 \u3181 \u3182 \u3183 \u3184 \u3185 \u3186 \u3187 \u3188 \u3189 \u318A \u318B \u318C \u318D \u318E'},
                {'Block': 'Kanbun', 'Sample': '\u3190 \u3191 \u3192 \u3193 \u3194 \u3195 \u3196 \u3197 \u3198 \u3199 \u319A \u319B \u319C \u319D \u319E \u319F'},
                {'Block': 'Bopomofo Extended', 'Sample': '\u31A0 \u31A1 \u31A2 \u31A3 \u31A4 \u31A5 \u31A6 \u31A7 \u31A8 \u31A9 \u31AA \u31AB \u31AC \u31AD \u31AE \u31AF \u31B0 \u31B1 \u31B2 \u31B3 \u31B4 \u31B5 \u31B6 \u31B7'},
                {'Block': 'Katakana Phonetic Extensions', 'Sample': '\u31F0 \u31F1 \u31F2 \u31F3 \u31F4 \u31F5 \u31F6 \u31F7 \u31F8 \u31F9 \u31FA \u31FB \u31FC \u31FD \u31FE \u31FF'},
                {'Block': 'Enclosed CJK Letters and Months', 'Sample': '\u3200 \u3201 \u3202 \u3203 \u3204 \u3205 \u3206 \u3207 \u3208 \u3209 \u320A \u320B \u320C \u320D \u320E \u320F \u3210 \u3211 \u3212 \u3213 \u3214 \u3215 \u3216 \u3217 \u3218 \u3219 \u321A \u321B \u321C \u3220 \u3221 \u3222 \u3223 \u3224 \u3225 \u3226 \u3227 \u3228 \u3229 \u322A \u322B \u322C \u322D \u322E \u322F \u3230 \u3231 \u3232 \u3233 \u3234 \u3235 \u3236 \u3237 \u3238 \u3239 \u323A \u323B \u323C \u323D \u323E \u323F \u3240 \u3241 \u3242 \u3243 \u3251 \u3252 \u3253 \u3254 \u3255 \u3256 \u3257 \u3258 \u3259 \u325A \u325B \u325C \u325D \u325E \u325F \u3260 \u3261 \u3262 \u3263 \u3264 \u3265 \u3266 \u3267 \u3268 \u3269 \u326A \u326B \u326C \u326D \u326E \u326F \u3270 \u3271 \u3272 \u3273 \u3274 \u3275 \u3276 \u3277 \u3278 \u3279 \u327A \u327B \u327F \u3280 \u3281 \u3282 \u3283 \u3284 \u3285 \u3286 \u3287 \u3288 \u3289 \u328A \u328B \u328C \u328D \u328E \u328F \u3290 \u3291 \u3292 ...'},
                {'Block': 'CJK Compatibility', 'Sample': '\u3300 \u3301 \u3302 \u3303 \u3304 \u3305 \u3306 \u3307 \u3308 \u3309 \u330A \u330B \u330C \u330D \u330E \u330F \u3310 \u3311 \u3312 \u3313 \u3314 \u3315 \u3316 \u3317 \u3318 \u3319 \u331A \u331B \u331C \u331D \u331E \u331F \u3320 \u3321 \u3322 \u3323 \u3324 \u3325 \u3326 \u3327 \u3328 \u3329 \u332A \u332B \u332C \u332D \u332E \u332F \u3330 \u3331 \u3332 \u3333 \u3334 \u3335 \u3336 \u3337 \u3338 \u3339 \u333A \u333B \u333C \u333D \u333E \u333F \u3340 \u3341 \u3342 \u3343 \u3344 \u3345 \u3346 \u3347 \u3348 \u3349 \u334A \u334B \u334C \u334D \u334E \u334F \u3350 \u3351 \u3352 \u3353 \u3354 \u3355 \u3356 \u3357 \u3358 \u3359 \u335A \u335B \u335C \u335D \u335E \u335F \u3360 \u3361 \u3362 \u3363 \u3364 \u3365 \u3366 \u3367 \u3368 \u3369 \u336A \u336B \u336C \u336D \u336E \u336F \u3370 \u3371 \u3372 \u3373 \u3374 \u3375 \u3376 \u337B \u337C \u337D \u337E \u337F \u3380 \u3381 \u3382 \u3383 ...'},
                {'Block': 'CJK Unified Ideographs Extension A', 'Sample': '\u3400 \u3401 \u3402 \u3403 \u3404 \u3405 \u3406 \u3407 \u3408 \u3409 \u340A \u340B \u340C \u340D \u340E \u340F \u3410 \u3411 \u3412 \u3413 \u3414 \u3415 \u3416 \u3417 \u3418 \u3419 \u341A \u341B \u341C \u341D \u341E \u341F \u3420 \u3421 \u3422 \u3423 \u3424 \u3425 \u3426 \u3427 \u3428 \u3429 \u342A \u342B \u342C \u342D \u342E \u342F \u3430 \u3431 \u3432 \u3433 \u3434 \u3435 \u3436 \u3437 \u3438 \u3439 \u343A \u343B \u343C \u343D \u343E \u343F \u3440 \u3441 \u3442 \u3443 \u3444 \u3445 \u3446 \u3447 \u3448 \u3449 \u344A \u344B \u344C \u344D \u344E \u344F \u3450 \u3451 \u3452 \u3453 \u3454 \u3455 \u3456 \u3457 \u3458 \u3459 \u345A \u345B \u345C \u345D \u345E \u345F \u3460 \u3461 \u3462 \u3463 \u3464 \u3465 \u3466 \u3467 \u3468 \u3469 \u346A \u346B \u346C \u346D \u346E \u346F \u3470 \u3471 \u3472 \u3473 \u3474 \u3475 \u3476 \u3477 \u3478 \u3479 \u347A \u347B \u347C \u347D \u347E \u347F ...'},
                {'Block': 'CJK Unified Ideographs', 'Sample': '\u4E00 \u4E01 \u4E02 \u4E03 \u4E04 \u4E05 \u4E06 \u4E07 \u4E08 \u4E09 \u4E0A \u4E0B \u4E0C \u4E0D \u4E0E \u4E0F \u4E10 \u4E11 \u4E12 \u4E13 \u4E14 \u4E15 \u4E16 \u4E17 \u4E18 \u4E19 \u4E1A \u4E1B \u4E1C \u4E1D \u4E1E \u4E1F \u4E20 \u4E21 \u4E22 \u4E23 \u4E24 \u4E25 \u4E26 \u4E27 \u4E28 \u4E29 \u4E2A \u4E2B \u4E2C \u4E2D \u4E2E \u4E2F \u4E30 \u4E31 \u4E32 \u4E33 \u4E34 \u4E35 \u4E36 \u4E37 \u4E38 \u4E39 \u4E3A \u4E3B \u4E3C \u4E3D \u4E3E \u4E3F \u4E40 \u4E41 \u4E42 \u4E43 \u4E44 \u4E45 \u4E46 \u4E47 \u4E48 \u4E49 \u4E4A \u4E4B \u4E4C \u4E4D \u4E4E \u4E4F \u4E50 \u4E51 \u4E52 \u4E53 \u4E54 \u4E55 \u4E56 \u4E57 \u4E58 \u4E59 \u4E5A \u4E5B \u4E5C \u4E5D \u4E5E \u4E5F \u4E60 \u4E61 \u4E62 \u4E63 \u4E64 \u4E65 \u4E66 \u4E67 \u4E68 \u4E69 \u4E6A \u4E6B \u4E6C \u4E6D \u4E6E \u4E6F \u4E70 \u4E71 \u4E72 \u4E73 \u4E74 \u4E75 \u4E76 \u4E77 \u4E78 \u4E79 \u4E7A \u4E7B \u4E7C \u4E7D \u4E7E \u4E7F ...'},
                {'Block': 'Yi Syllables', 'Sample': '\uA000 \uA001 \uA002 \uA003 \uA004 \uA005 \uA006 \uA007 \uA008 \uA009 \uA00A \uA00B \uA00C \uA00D \uA00E \uA00F \uA010 \uA011 \uA012 \uA013 \uA014 \uA015 \uA016 \uA017 \uA018 \uA019 \uA01A \uA01B \uA01C \uA01D \uA01E \uA01F \uA020 \uA021 \uA022 \uA023 \uA024 \uA025 \uA026 \uA027 \uA028 \uA029 \uA02A \uA02B \uA02C \uA02D \uA02E \uA02F \uA030 \uA031 \uA032 \uA033 \uA034 \uA035 \uA036 \uA037 \uA038 \uA039 \uA03A \uA03B \uA03C \uA03D \uA03E \uA03F \uA040 \uA041 \uA042 \uA043 \uA044 \uA045 \uA046 \uA047 \uA048 \uA049 \uA04A \uA04B \uA04C \uA04D \uA04E \uA04F \uA050 \uA051 \uA052 \uA053 \uA054 \uA055 \uA056 \uA057 \uA058 \uA059 \uA05A \uA05B \uA05C \uA05D \uA05E \uA05F \uA060 \uA061 \uA062 \uA063 \uA064 \uA065 \uA066 \uA067 \uA068 \uA069 \uA06A \uA06B \uA06C \uA06D \uA06E \uA06F \uA070 \uA071 \uA072 \uA073 \uA074 \uA075 \uA076 \uA077 \uA078 \uA079 \uA07A \uA07B \uA07C \uA07D \uA07E \uA07F ...'},
                {'Block': 'Yi Radicals', 'Sample': '\uA490 \uA491 \uA492 \uA493 \uA494 \uA495 \uA496 \uA497 \uA498 \uA499 \uA49A \uA49B \uA49C \uA49D \uA49E \uA49F \uA4A0 \uA4A1 \uA4A2 \uA4A3 \uA4A4 \uA4A5 \uA4A6 \uA4A7 \uA4A8 \uA4A9 \uA4AA \uA4AB \uA4AC \uA4AD \uA4AE \uA4AF \uA4B0 \uA4B1 \uA4B2 \uA4B3 \uA4B4 \uA4B5 \uA4B6 \uA4B7 \uA4B8 \uA4B9 \uA4BA \uA4BB \uA4BC \uA4BD \uA4BE \uA4BF \uA4C0 \uA4C1 \uA4C2 \uA4C3 \uA4C4 \uA4C5 \uA4C6'},
                {'Block': 'Hangul Syllables', 'Sample': '\uAC00 \uAC01 \uAC02 \uAC03 \uAC04 \uAC05 \uAC06 \uAC07 \uAC08 \uAC09 \uAC0A \uAC0B \uAC0C \uAC0D \uAC0E \uAC0F \uAC10 \uAC11 \uAC12 \uAC13 \uAC14 \uAC15 \uAC16 \uAC17 \uAC18 \uAC19 \uAC1A \uAC1B \uAC1C \uAC1D \uAC1E \uAC1F \uAC20 \uAC21 \uAC22 \uAC23 \uAC24 \uAC25 \uAC26 \uAC27 \uAC28 \uAC29 \uAC2A \uAC2B \uAC2C \uAC2D \uAC2E \uAC2F \uAC30 \uAC31 \uAC32 \uAC33 \uAC34 \uAC35 \uAC36 \uAC37 \uAC38 \uAC39 \uAC3A \uAC3B \uAC3C \uAC3D \uAC3E \uAC3F \uAC40 \uAC41 \uAC42 \uAC43 \uAC44 \uAC45 \uAC46 \uAC47 \uAC48 \uAC49 \uAC4A \uAC4B \uAC4C \uAC4D \uAC4E \uAC4F \uAC50 \uAC51 \uAC52 \uAC53 \uAC54 \uAC55 \uAC56 \uAC57 \uAC58 \uAC59 \uAC5A \uAC5B \uAC5C \uAC5D \uAC5E \uAC5F \uAC60 \uAC61 \uAC62 \uAC63 \uAC64 \uAC65 \uAC66 \uAC67 \uAC68 \uAC69 \uAC6A \uAC6B \uAC6C \uAC6D \uAC6E \uAC6F \uAC70 \uAC71 \uAC72 \uAC73 \uAC74 \uAC75 \uAC76 \uAC77 \uAC78 \uAC79 \uAC7A \uAC7B \uAC7C \uAC7D \uAC7E \uAC7F ...'},
                {'Block': 'Private Use Area', 'Sample': '\uE000 \uE001 \uE002 \uE003 \uE004 \uE005 \uE006 \uE007 \uE008 \uE009 \uE00A \uE00B \uE00C \uE00D \uE00E \uE00F \uE010 \uE011 \uE012 \uE013 \uE014 \uE015 \uE016 \uE017 \uE018 \uE019 \uE01A \uE01B \uE01C \uE01D \uE01E \uE01F \uE020 \uE021 \uE022 \uE023 \uE024 \uE025 \uE026 \uE027 \uE028 \uE029 \uE02A \uE02B \uE02C \uE02D \uE02E \uE02F \uE030 \uE031 \uE032 \uE033 \uE034 \uE035 \uE036 \uE037 \uE038 \uE039 \uE03A \uE03B \uE03C \uE03D \uE03E \uE03F \uE040 \uE041 \uE042 \uE043 \uE044 \uE045 \uE046 \uE047 \uE048 \uE049 \uE04A \uE04B \uE04C \uE04D \uE04E \uE04F \uE050 \uE051 \uE052 \uE053 \uE054 \uE055 \uE056 \uE057 \uE058 \uE059 \uE05A \uE05B \uE05C \uE05D \uE05E \uE05F \uE060 \uE061 \uE062 \uE063 \uE064 \uE065 \uE066 \uE067 \uE068 \uE069 \uE06A \uE06B \uE06C \uE06D \uE06E \uE06F \uE070 \uE071 \uE072 \uE073 \uE074 \uE075 \uE076 \uE077 \uE078 \uE079 \uE07A \uE07B \uE07C \uE07D \uE07E \uE07F ...'},
                {'Block': 'CJK Compatibility Ideographs', 'Sample': '\uF900 \uF901 \uF902 \uF903 \uF904 \uF905 \uF906 \uF907 \uF908 \uF909 \uF90A \uF90B \uF90C \uF90D \uF90E \uF90F \uF910 \uF911 \uF912 \uF913 \uF914 \uF915 \uF916 \uF917 \uF918 \uF919 \uF91A \uF91B \uF91C \uF91D \uF91E \uF91F \uF920 \uF921 \uF922 \uF923 \uF924 \uF925 \uF926 \uF927 \uF928 \uF929 \uF92A \uF92B \uF92C \uF92D \uF92E \uF92F \uF930 \uF931 \uF932 \uF933 \uF934 \uF935 \uF936 \uF937 \uF938 \uF939 \uF93A \uF93B \uF93C \uF93D \uF93E \uF93F \uF940 \uF941 \uF942 \uF943 \uF944 \uF945 \uF946 \uF947 \uF948 \uF949 \uF94A \uF94B \uF94C \uF94D \uF94E \uF94F \uF950 \uF951 \uF952 \uF953 \uF954 \uF955 \uF956 \uF957 \uF958 \uF959 \uF95A \uF95B \uF95C \uF95D \uF95E \uF95F \uF960 \uF961 \uF962 \uF963 \uF964 \uF965 \uF966 \uF967 \uF968 \uF969 \uF96A \uF96B \uF96C \uF96D \uF96E \uF96F \uF970 \uF971 \uF972 \uF973 \uF974 \uF975 \uF976 \uF977 \uF978 \uF979 \uF97A \uF97B \uF97C \uF97D \uF97E \uF97F ...'},
                {'Block': 'Alphabetic Presentation Forms', 'Sample': '\uFB00 \uFB01 \uFB02 \uFB03 \uFB04 \uFB05 \uFB06 \uFB13 \uFB14 \uFB15 \uFB16 \uFB17 \uFB1D \uFB1E \uFB1F \uFB20 \uFB21 \uFB22 \uFB23 \uFB24 \uFB25 \uFB26 \uFB27 \uFB28 \uFB29 \uFB2A \uFB2B \uFB2C \uFB2D \uFB2E \uFB2F \uFB30 \uFB31 \uFB32 \uFB33 \uFB34 \uFB35 \uFB36 \uFB38 \uFB39 \uFB3A \uFB3B \uFB3C \uFB3E \uFB40 \uFB41 \uFB43 \uFB44 \uFB46 \uFB47 \uFB48 \uFB49 \uFB4A \uFB4B \uFB4C \uFB4D \uFB4E \uFB4F'},
                {'Block': 'Arabic Presentation Forms-A', 'Sample': '\uFB50 \uFB51 \uFB52 \uFB53 \uFB54 \uFB55 \uFB56 \uFB57 \uFB58 \uFB59 \uFB5A \uFB5B \uFB5C \uFB5D \uFB5E \uFB5F \uFB60 \uFB61 \uFB62 \uFB63 \uFB64 \uFB65 \uFB66 \uFB67 \uFB68 \uFB69 \uFB6A \uFB6B \uFB6C \uFB6D \uFB6E \uFB6F \uFB70 \uFB71 \uFB72 \uFB73 \uFB74 \uFB75 \uFB76 \uFB77 \uFB78 \uFB79 \uFB7A \uFB7B \uFB7C \uFB7D \uFB7E \uFB7F \uFB80 \uFB81 \uFB82 \uFB83 \uFB84 \uFB85 \uFB86 \uFB87 \uFB88 \uFB89 \uFB8A \uFB8B \uFB8C \uFB8D \uFB8E \uFB8F \uFB90 \uFB91 \uFB92 \uFB93 \uFB94 \uFB95 \uFB96 \uFB97 \uFB98 \uFB99 \uFB9A \uFB9B \uFB9C \uFB9D \uFB9E \uFB9F \uFBA0 \uFBA1 \uFBA2 \uFBA3 \uFBA4 \uFBA5 \uFBA6 \uFBA7 \uFBA8 \uFBA9 \uFBAA \uFBAB \uFBAC \uFBAD \uFBAE \uFBAF \uFBB0 \uFBB1 \uFBD3 \uFBD4 \uFBD5 \uFBD6 \uFBD7 \uFBD8 \uFBD9 \uFBDA \uFBDB \uFBDC \uFBDD \uFBDE \uFBDF \uFBE0 \uFBE1 \uFBE2 \uFBE3 \uFBE4 \uFBE5 \uFBE6 \uFBE7 \uFBE8 \uFBE9 \uFBEA \uFBEB \uFBEC \uFBED \uFBEE \uFBEF \uFBF0 ...'},
                {'Block': 'Variation Selectors', 'Sample': '\uFE00 \uFE01 \uFE02 \uFE03 \uFE04 \uFE05 \uFE06 \uFE07 \uFE08 \uFE09 \uFE0A \uFE0B \uFE0C \uFE0D \uFE0E \uFE0F'},
                {'Block': 'Combining Half Marks', 'Sample': '\uFE20 \uFE21 \uFE22 \uFE23'},
                {'Block': 'CJK Compatibility Forms', 'Sample': '\uFE30 \uFE31 \uFE32 \uFE33 \uFE34 \uFE35 \uFE36 \uFE37 \uFE38 \uFE39 \uFE3A \uFE3B \uFE3C \uFE3D \uFE3E \uFE3F \uFE40 \uFE41 \uFE42 \uFE43 \uFE44 \uFE45 \uFE46 \uFE49 \uFE4A \uFE4B \uFE4C \uFE4D \uFE4E \uFE4F'},
                {'Block': 'Small Form Variants', 'Sample': '\uFE50 \uFE51 \uFE52 \uFE54 \uFE55 \uFE56 \uFE57 \uFE58 \uFE59 \uFE5A \uFE5B \uFE5C \uFE5D \uFE5E \uFE5F \uFE60 \uFE61 \uFE62 \uFE63 \uFE64 \uFE65 \uFE66 \uFE68 \uFE69 \uFE6A \uFE6B'},
                {'Block': 'Arabic Presentation Forms-B', 'Sample': '\uFE70 \uFE71 \uFE72 \uFE73 \uFE74 \uFE76 \uFE77 \uFE78 \uFE79 \uFE7A \uFE7B \uFE7C \uFE7D \uFE7E \uFE7F \uFE80 \uFE81 \uFE82 \uFE83 \uFE84 \uFE85 \uFE86 \uFE87 \uFE88 \uFE89 \uFE8A \uFE8B \uFE8C \uFE8D \uFE8E \uFE8F \uFE90 \uFE91 \uFE92 \uFE93 \uFE94 \uFE95 \uFE96 \uFE97 \uFE98 \uFE99 \uFE9A \uFE9B \uFE9C \uFE9D \uFE9E \uFE9F \uFEA0 \uFEA1 \uFEA2 \uFEA3 \uFEA4 \uFEA5 \uFEA6 \uFEA7 \uFEA8 \uFEA9 \uFEAA \uFEAB \uFEAC \uFEAD \uFEAE \uFEAF \uFEB0 \uFEB1 \uFEB2 \uFEB3 \uFEB4 \uFEB5 \uFEB6 \uFEB7 \uFEB8 \uFEB9 \uFEBA \uFEBB \uFEBC \uFEBD \uFEBE \uFEBF \uFEC0 \uFEC1 \uFEC2 \uFEC3 \uFEC4 \uFEC5 \uFEC6 \uFEC7 \uFEC8 \uFEC9 \uFECA \uFECB \uFECC \uFECD \uFECE \uFECF \uFED0 \uFED1 \uFED2 \uFED3 \uFED4 \uFED5 \uFED6 \uFED7 \uFED8 \uFED9 \uFEDA \uFEDB \uFEDC \uFEDD \uFEDE \uFEDF \uFEE0 \uFEE1 \uFEE2 \uFEE3 \uFEE4 \uFEE5 \uFEE6 \uFEE7 \uFEE8 \uFEE9 \uFEEA \uFEEB \uFEEC \uFEED \uFEEE \uFEEF \uFEF0 ...'},
                {'Block': 'Halfwidth and Fullwidth Forms', 'Sample': '\uFF01 \uFF02 \uFF03 \uFF04 \uFF05 \uFF06 \uFF07 \uFF08 \uFF09 \uFF0A \uFF0B \uFF0C \uFF0D \uFF0E \uFF0F \uFF10 \uFF11 \uFF12 \uFF13 \uFF14 \uFF15 \uFF16 \uFF17 \uFF18 \uFF19 \uFF1A \uFF1B \uFF1C \uFF1D \uFF1E \uFF1F \uFF20 \uFF21 \uFF22 \uFF23 \uFF24 \uFF25 \uFF26 \uFF27 \uFF28 \uFF29 \uFF2A \uFF2B \uFF2C \uFF2D \uFF2E \uFF2F \uFF30 \uFF31 \uFF32 \uFF33 \uFF34 \uFF35 \uFF36 \uFF37 \uFF38 \uFF39 \uFF3A \uFF3B \uFF3C \uFF3D \uFF3E \uFF3F \uFF40 \uFF41 \uFF42 \uFF43 \uFF44 \uFF45 \uFF46 \uFF47 \uFF48 \uFF49 \uFF4A \uFF4B \uFF4C \uFF4D \uFF4E \uFF4F \uFF50 \uFF51 \uFF52 \uFF53 \uFF54 \uFF55 \uFF56 \uFF57 \uFF58 \uFF59 \uFF5A \uFF5B \uFF5C \uFF5D \uFF5E \uFF5F \uFF60 \uFF61 \uFF62 \uFF63 \uFF64 \uFF65 \uFF66 \uFF67 \uFF68 \uFF69 \uFF6A \uFF6B \uFF6C \uFF6D \uFF6E \uFF6F \uFF70 \uFF71 \uFF72 \uFF73 \uFF74 \uFF75 \uFF76 \uFF77 \uFF78 \uFF79 \uFF7A \uFF7B \uFF7C \uFF7D \uFF7E \uFF7F \uFF80 ...'},
                {'Block': 'Specials', 'Sample': '\uFFF9 \uFFFA \uFFFB \uFFFC \uFFFD'},
                {'Block': 'Old Italic', 'Sample': '\uD800\uDF00 \uD800\uDF01 \uD800\uDF02 \uD800\uDF03 \uD800\uDF04 \uD800\uDF05 \uD800\uDF06 \uD800\uDF07 \uD800\uDF08 \uD800\uDF09 \uD800\uDF0A \uD800\uDF0B \uD800\uDF0C \uD800\uDF0D \uD800\uDF0E \uD800\uDF0F \uD800\uDF10 \uD800\uDF11 \uD800\uDF12 \uD800\uDF13 \uD800\uDF14 \uD800\uDF15 \uD800\uDF16 \uD800\uDF17 \uD800\uDF18 \uD800\uDF19 \uD800\uDF1A \uD800\uDF1B \uD800\uDF1C \uD800\uDF1D \uD800\uDF1E \uD800\uDF20 \uD800\uDF21 \uD800\uDF22 \uD800\uDF23'},
                {'Block': 'Gothic', 'Sample': '\uD800\uDF30 \uD800\uDF31 \uD800\uDF32 \uD800\uDF33 \uD800\uDF34 \uD800\uDF35 \uD800\uDF36 \uD800\uDF37 \uD800\uDF38 \uD800\uDF39 \uD800\uDF3A \uD800\uDF3B \uD800\uDF3C \uD800\uDF3D \uD800\uDF3E \uD800\uDF3F \uD800\uDF40 \uD800\uDF41 \uD800\uDF42 \uD800\uDF43 \uD800\uDF44 \uD800\uDF45 \uD800\uDF46 \uD800\uDF47 \uD800\uDF48 \uD800\uDF49 \uD800\uDF4A'},
                {'Block': 'Deseret', 'Sample': '\uD801\uDC00 \uD801\uDC01 \uD801\uDC02 \uD801\uDC03 \uD801\uDC04 \uD801\uDC05 \uD801\uDC06 \uD801\uDC07 \uD801\uDC08 \uD801\uDC09 \uD801\uDC0A \uD801\uDC0B \uD801\uDC0C \uD801\uDC0D \uD801\uDC0E \uD801\uDC0F \uD801\uDC10 \uD801\uDC11 \uD801\uDC12 \uD801\uDC13 \uD801\uDC14 \uD801\uDC15 \uD801\uDC16 \uD801\uDC17 \uD801\uDC18 \uD801\uDC19 \uD801\uDC1A \uD801\uDC1B \uD801\uDC1C \uD801\uDC1D \uD801\uDC1E \uD801\uDC1F \uD801\uDC20 \uD801\uDC21 \uD801\uDC22 \uD801\uDC23 \uD801\uDC24 \uD801\uDC25 \uD801\uDC28 \uD801\uDC29 \uD801\uDC2A \uD801\uDC2B \uD801\uDC2C \uD801\uDC2D \uD801\uDC2E \uD801\uDC2F \uD801\uDC30 \uD801\uDC31 \uD801\uDC32 \uD801\uDC33 \uD801\uDC34 \uD801\uDC35 \uD801\uDC36 \uD801\uDC37 \uD801\uDC38 \uD801\uDC39 \uD801\uDC3A \uD801\uDC3B \uD801\uDC3C \uD801\uDC3D \uD801\uDC3E \uD801\uDC3F \uD801\uDC40 \uD801\uDC41 \uD801\uDC42 \uD801\uDC43 \uD801\uDC44 \uD801\uDC45 \uD801\uDC46 \uD801\uDC47 \uD801\uDC48 \uD801\uDC49 \uD801\uDC4A \uD801\uDC4B \uD801\uDC4C \uD801\uDC4D'},
                {'Block': 'Byzantine Musical Symbols', 'Sample': '\uD834\uDC00 \uD834\uDC01 \uD834\uDC02 \uD834\uDC03 \uD834\uDC04 \uD834\uDC05 \uD834\uDC06 \uD834\uDC07 \uD834\uDC08 \uD834\uDC09 \uD834\uDC0A \uD834\uDC0B \uD834\uDC0C \uD834\uDC0D \uD834\uDC0E \uD834\uDC0F \uD834\uDC10 \uD834\uDC11 \uD834\uDC12 \uD834\uDC13 \uD834\uDC14 \uD834\uDC15 \uD834\uDC16 \uD834\uDC17 \uD834\uDC18 \uD834\uDC19 \uD834\uDC1A \uD834\uDC1B \uD834\uDC1C \uD834\uDC1D \uD834\uDC1E \uD834\uDC1F \uD834\uDC20 \uD834\uDC21 \uD834\uDC22 \uD834\uDC23 \uD834\uDC24 \uD834\uDC25 \uD834\uDC26 \uD834\uDC27 \uD834\uDC28 \uD834\uDC29 \uD834\uDC2A \uD834\uDC2B \uD834\uDC2C \uD834\uDC2D \uD834\uDC2E \uD834\uDC2F \uD834\uDC30 \uD834\uDC31 \uD834\uDC32 \uD834\uDC33 \uD834\uDC34 \uD834\uDC35 \uD834\uDC36 \uD834\uDC37 \uD834\uDC38 \uD834\uDC39 \uD834\uDC3A \uD834\uDC3B \uD834\uDC3C \uD834\uDC3D \uD834\uDC3E \uD834\uDC3F \uD834\uDC40 \uD834\uDC41 \uD834\uDC42 \uD834\uDC43 \uD834\uDC44 \uD834\uDC45 \uD834\uDC46 \uD834\uDC47 \uD834\uDC48 \uD834\uDC49 \uD834\uDC4A \uD834\uDC4B \uD834\uDC4C \uD834\uDC4D \uD834\uDC4E \uD834\uDC4F \uD834\uDC50 \uD834\uDC51 \uD834\uDC52 \uD834\uDC53 \uD834\uDC54 \uD834\uDC55 \uD834\uDC56 \uD834\uDC57 \uD834\uDC58 \uD834\uDC59 \uD834\uDC5A \uD834\uDC5B \uD834\uDC5C \uD834\uDC5D \uD834\uDC5E \uD834\uDC5F \uD834\uDC60 \uD834\uDC61 \uD834\uDC62 \uD834\uDC63 \uD834\uDC64 \uD834\uDC65 \uD834\uDC66 \uD834\uDC67 \uD834\uDC68 \uD834\uDC69 \uD834\uDC6A \uD834\uDC6B \uD834\uDC6C \uD834\uDC6D \uD834\uDC6E \uD834\uDC6F \uD834\uDC70 \uD834\uDC71 \uD834\uDC72 \uD834\uDC73 \uD834\uDC74 \uD834\uDC75 \uD834\uDC76 \uD834\uDC77 \uD834\uDC78 \uD834\uDC79 \uD834\uDC7A \uD834\uDC7B \uD834\uDC7C \uD834\uDC7D \uD834\uDC7E \uD834\uDC7F ...'},
                {'Block': 'Musical Symbols', 'Sample': '\uD834\uDD00 \uD834\uDD01 \uD834\uDD02 \uD834\uDD03 \uD834\uDD04 \uD834\uDD05 \uD834\uDD06 \uD834\uDD07 \uD834\uDD08 \uD834\uDD09 \uD834\uDD0A \uD834\uDD0B \uD834\uDD0C \uD834\uDD0D \uD834\uDD0E \uD834\uDD0F \uD834\uDD10 \uD834\uDD11 \uD834\uDD12 \uD834\uDD13 \uD834\uDD14 \uD834\uDD15 \uD834\uDD16 \uD834\uDD17 \uD834\uDD18 \uD834\uDD19 \uD834\uDD1A \uD834\uDD1B \uD834\uDD1C \uD834\uDD1D \uD834\uDD1E \uD834\uDD1F \uD834\uDD20 \uD834\uDD21 \uD834\uDD22 \uD834\uDD23 \uD834\uDD24 \uD834\uDD25 \uD834\uDD26 \uD834\uDD2A \uD834\uDD2B \uD834\uDD2C \uD834\uDD2D \uD834\uDD2E \uD834\uDD2F \uD834\uDD30 \uD834\uDD31 \uD834\uDD32 \uD834\uDD33 \uD834\uDD34 \uD834\uDD35 \uD834\uDD36 \uD834\uDD37 \uD834\uDD38 \uD834\uDD39 \uD834\uDD3A \uD834\uDD3B \uD834\uDD3C \uD834\uDD3D \uD834\uDD3E \uD834\uDD3F \uD834\uDD40 \uD834\uDD41 \uD834\uDD42 \uD834\uDD43 \uD834\uDD44 \uD834\uDD45 \uD834\uDD46 \uD834\uDD47 \uD834\uDD48 \uD834\uDD49 \uD834\uDD4A \uD834\uDD4B \uD834\uDD4C \uD834\uDD4D \uD834\uDD4E \uD834\uDD4F \uD834\uDD50 \uD834\uDD51 \uD834\uDD52 \uD834\uDD53 \uD834\uDD54 \uD834\uDD55 \uD834\uDD56 \uD834\uDD57 \uD834\uDD58 \uD834\uDD59 \uD834\uDD5A \uD834\uDD5B \uD834\uDD5C \uD834\uDD5D \uD834\uDD5E \uD834\uDD5F \uD834\uDD60 \uD834\uDD61 \uD834\uDD62 \uD834\uDD63 \uD834\uDD64 \uD834\uDD65 \uD834\uDD66 \uD834\uDD67 \uD834\uDD68 \uD834\uDD69 \uD834\uDD6A \uD834\uDD6B \uD834\uDD6C \uD834\uDD6D \uD834\uDD6E \uD834\uDD6F \uD834\uDD70 \uD834\uDD71 \uD834\uDD72 \uD834\uDD73 \uD834\uDD74 \uD834\uDD75 \uD834\uDD76 \uD834\uDD77 \uD834\uDD78 \uD834\uDD79 \uD834\uDD7A \uD834\uDD7B \uD834\uDD7C \uD834\uDD7D \uD834\uDD7E \uD834\uDD7F \uD834\uDD80 \uD834\uDD81 \uD834\uDD82 ...'},
                {'Block': 'Mathematical Alphanumeric Symbols', 'Sample': '\uD835\uDC00 \uD835\uDC01 \uD835\uDC02 \uD835\uDC03 \uD835\uDC04 \uD835\uDC05 \uD835\uDC06 \uD835\uDC07 \uD835\uDC08 \uD835\uDC09 \uD835\uDC0A \uD835\uDC0B \uD835\uDC0C \uD835\uDC0D \uD835\uDC0E \uD835\uDC0F \uD835\uDC10 \uD835\uDC11 \uD835\uDC12 \uD835\uDC13 \uD835\uDC14 \uD835\uDC15 \uD835\uDC16 \uD835\uDC17 \uD835\uDC18 \uD835\uDC19 \uD835\uDC1A \uD835\uDC1B \uD835\uDC1C \uD835\uDC1D \uD835\uDC1E \uD835\uDC1F \uD835\uDC20 \uD835\uDC21 \uD835\uDC22 \uD835\uDC23 \uD835\uDC24 \uD835\uDC25 \uD835\uDC26 \uD835\uDC27 \uD835\uDC28 \uD835\uDC29 \uD835\uDC2A \uD835\uDC2B \uD835\uDC2C \uD835\uDC2D \uD835\uDC2E \uD835\uDC2F \uD835\uDC30 \uD835\uDC31 \uD835\uDC32 \uD835\uDC33 \uD835\uDC34 \uD835\uDC35 \uD835\uDC36 \uD835\uDC37 \uD835\uDC38 \uD835\uDC39 \uD835\uDC3A \uD835\uDC3B \uD835\uDC3C \uD835\uDC3D \uD835\uDC3E \uD835\uDC3F \uD835\uDC40 \uD835\uDC41 \uD835\uDC42 \uD835\uDC43 \uD835\uDC44 \uD835\uDC45 \uD835\uDC46 \uD835\uDC47 \uD835\uDC48 \uD835\uDC49 \uD835\uDC4A \uD835\uDC4B \uD835\uDC4C \uD835\uDC4D \uD835\uDC4E \uD835\uDC4F \uD835\uDC50 \uD835\uDC51 \uD835\uDC52 \uD835\uDC53 \uD835\uDC54 \uD835\uDC56 \uD835\uDC57 \uD835\uDC58 \uD835\uDC59 \uD835\uDC5A \uD835\uDC5B \uD835\uDC5C \uD835\uDC5D \uD835\uDC5E \uD835\uDC5F \uD835\uDC60 \uD835\uDC61 \uD835\uDC62 \uD835\uDC63 \uD835\uDC64 \uD835\uDC65 \uD835\uDC66 \uD835\uDC67 \uD835\uDC68 \uD835\uDC69 \uD835\uDC6A \uD835\uDC6B \uD835\uDC6C \uD835\uDC6D \uD835\uDC6E \uD835\uDC6F \uD835\uDC70 \uD835\uDC71 \uD835\uDC72 \uD835\uDC73 \uD835\uDC74 \uD835\uDC75 \uD835\uDC76 \uD835\uDC77 \uD835\uDC78 \uD835\uDC79 \uD835\uDC7A \uD835\uDC7B \uD835\uDC7C \uD835\uDC7D \uD835\uDC7E \uD835\uDC7F \uD835\uDC80 ...'},
                {'Block': 'CJK Unified Ideographs Extension B', 'Sample': '\uD840\uDC00 \uD840\uDC01 \uD840\uDC02 \uD840\uDC03 \uD840\uDC04 \uD840\uDC05 \uD840\uDC06 \uD840\uDC07 \uD840\uDC08 \uD840\uDC09 \uD840\uDC0A \uD840\uDC0B \uD840\uDC0C \uD840\uDC0D \uD840\uDC0E \uD840\uDC0F \uD840\uDC10 \uD840\uDC11 \uD840\uDC12 \uD840\uDC13 \uD840\uDC14 \uD840\uDC15 \uD840\uDC16 \uD840\uDC17 \uD840\uDC18 \uD840\uDC19 \uD840\uDC1A \uD840\uDC1B \uD840\uDC1C \uD840\uDC1D \uD840\uDC1E \uD840\uDC1F \uD840\uDC20 \uD840\uDC21 \uD840\uDC22 \uD840\uDC23 \uD840\uDC24 \uD840\uDC25 \uD840\uDC26 \uD840\uDC27 \uD840\uDC28 \uD840\uDC29 \uD840\uDC2A \uD840\uDC2B \uD840\uDC2C \uD840\uDC2D \uD840\uDC2E \uD840\uDC2F \uD840\uDC30 \uD840\uDC31 \uD840\uDC32 \uD840\uDC33 \uD840\uDC34 \uD840\uDC35 \uD840\uDC36 \uD840\uDC37 \uD840\uDC38 \uD840\uDC39 \uD840\uDC3A \uD840\uDC3B \uD840\uDC3C \uD840\uDC3D \uD840\uDC3E \uD840\uDC3F \uD840\uDC40 \uD840\uDC41 \uD840\uDC42 \uD840\uDC43 \uD840\uDC44 \uD840\uDC45 \uD840\uDC46 \uD840\uDC47 \uD840\uDC48 \uD840\uDC49 \uD840\uDC4A \uD840\uDC4B \uD840\uDC4C \uD840\uDC4D \uD840\uDC4E \uD840\uDC4F \uD840\uDC50 \uD840\uDC51 \uD840\uDC52 \uD840\uDC53 \uD840\uDC54 \uD840\uDC55 \uD840\uDC56 \uD840\uDC57 \uD840\uDC58 \uD840\uDC59 \uD840\uDC5A \uD840\uDC5B \uD840\uDC5C \uD840\uDC5D \uD840\uDC5E \uD840\uDC5F \uD840\uDC60 \uD840\uDC61 \uD840\uDC62 \uD840\uDC63 \uD840\uDC64 \uD840\uDC65 \uD840\uDC66 \uD840\uDC67 \uD840\uDC68 \uD840\uDC69 \uD840\uDC6A \uD840\uDC6B \uD840\uDC6C \uD840\uDC6D \uD840\uDC6E \uD840\uDC6F \uD840\uDC70 \uD840\uDC71 \uD840\uDC72 \uD840\uDC73 \uD840\uDC74 \uD840\uDC75 \uD840\uDC76 \uD840\uDC77 \uD840\uDC78 \uD840\uDC79 \uD840\uDC7A \uD840\uDC7B \uD840\uDC7C \uD840\uDC7D \uD840\uDC7E \uD840\uDC7F ...'},
                {'Block': 'CJK Compatibility Ideographs Supplement', 'Sample': '\uD87E\uDC00 \uD87E\uDC01 \uD87E\uDC02 \uD87E\uDC03 \uD87E\uDC04 \uD87E\uDC05 \uD87E\uDC06 \uD87E\uDC07 \uD87E\uDC08 \uD87E\uDC09 \uD87E\uDC0A \uD87E\uDC0B \uD87E\uDC0C \uD87E\uDC0D \uD87E\uDC0E \uD87E\uDC0F \uD87E\uDC10 \uD87E\uDC11 \uD87E\uDC12 \uD87E\uDC13 \uD87E\uDC14 \uD87E\uDC15 \uD87E\uDC16 \uD87E\uDC17 \uD87E\uDC18 \uD87E\uDC19 \uD87E\uDC1A \uD87E\uDC1B \uD87E\uDC1C \uD87E\uDC1D \uD87E\uDC1E \uD87E\uDC1F \uD87E\uDC20 \uD87E\uDC21 \uD87E\uDC22 \uD87E\uDC23 \uD87E\uDC24 \uD87E\uDC25 \uD87E\uDC26 \uD87E\uDC27 \uD87E\uDC28 \uD87E\uDC29 \uD87E\uDC2A \uD87E\uDC2B \uD87E\uDC2C \uD87E\uDC2D \uD87E\uDC2E \uD87E\uDC2F \uD87E\uDC30 \uD87E\uDC31 \uD87E\uDC32 \uD87E\uDC33 \uD87E\uDC34 \uD87E\uDC35 \uD87E\uDC36 \uD87E\uDC37 \uD87E\uDC38 \uD87E\uDC39 \uD87E\uDC3A \uD87E\uDC3B \uD87E\uDC3C \uD87E\uDC3D \uD87E\uDC3E \uD87E\uDC3F \uD87E\uDC40 \uD87E\uDC41 \uD87E\uDC42 \uD87E\uDC43 \uD87E\uDC44 \uD87E\uDC45 \uD87E\uDC46 \uD87E\uDC47 \uD87E\uDC48 \uD87E\uDC49 \uD87E\uDC4A \uD87E\uDC4B \uD87E\uDC4C \uD87E\uDC4D \uD87E\uDC4E \uD87E\uDC4F \uD87E\uDC50 \uD87E\uDC51 \uD87E\uDC52 \uD87E\uDC53 \uD87E\uDC54 \uD87E\uDC55 \uD87E\uDC56 \uD87E\uDC57 \uD87E\uDC58 \uD87E\uDC59 \uD87E\uDC5A \uD87E\uDC5B \uD87E\uDC5C \uD87E\uDC5D \uD87E\uDC5E \uD87E\uDC5F \uD87E\uDC60 \uD87E\uDC61 \uD87E\uDC62 \uD87E\uDC63 \uD87E\uDC64 \uD87E\uDC65 \uD87E\uDC66 \uD87E\uDC67 \uD87E\uDC68 \uD87E\uDC69 \uD87E\uDC6A \uD87E\uDC6B \uD87E\uDC6C \uD87E\uDC6D \uD87E\uDC6E \uD87E\uDC6F \uD87E\uDC70 \uD87E\uDC71 \uD87E\uDC72 \uD87E\uDC73 \uD87E\uDC74 \uD87E\uDC75 \uD87E\uDC76 \uD87E\uDC77 \uD87E\uDC78 \uD87E\uDC79 \uD87E\uDC7A \uD87E\uDC7B \uD87E\uDC7C \uD87E\uDC7D \uD87E\uDC7E \uD87E\uDC7F ...'},
                {'Block': 'Tags', 'Sample': '\uDB40\uDC01 \uDB40\uDC20 \uDB40\uDC21 \uDB40\uDC22 \uDB40\uDC23 \uDB40\uDC24 \uDB40\uDC25 \uDB40\uDC26 \uDB40\uDC27 \uDB40\uDC28 \uDB40\uDC29 \uDB40\uDC2A \uDB40\uDC2B \uDB40\uDC2C \uDB40\uDC2D \uDB40\uDC2E \uDB40\uDC2F \uDB40\uDC30 \uDB40\uDC31 \uDB40\uDC32 \uDB40\uDC33 \uDB40\uDC34 \uDB40\uDC35 \uDB40\uDC36 \uDB40\uDC37 \uDB40\uDC38 \uDB40\uDC39 \uDB40\uDC3A \uDB40\uDC3B \uDB40\uDC3C \uDB40\uDC3D \uDB40\uDC3E \uDB40\uDC3F \uDB40\uDC40 \uDB40\uDC41 \uDB40\uDC42 \uDB40\uDC43 \uDB40\uDC44 \uDB40\uDC45 \uDB40\uDC46 \uDB40\uDC47 \uDB40\uDC48 \uDB40\uDC49 \uDB40\uDC4A \uDB40\uDC4B \uDB40\uDC4C \uDB40\uDC4D \uDB40\uDC4E \uDB40\uDC4F \uDB40\uDC50 \uDB40\uDC51 \uDB40\uDC52 \uDB40\uDC53 \uDB40\uDC54 \uDB40\uDC55 \uDB40\uDC56 \uDB40\uDC57 \uDB40\uDC58 \uDB40\uDC59 \uDB40\uDC5A \uDB40\uDC5B \uDB40\uDC5C \uDB40\uDC5D \uDB40\uDC5E \uDB40\uDC5F \uDB40\uDC60 \uDB40\uDC61 \uDB40\uDC62 \uDB40\uDC63 \uDB40\uDC64 \uDB40\uDC65 \uDB40\uDC66 \uDB40\uDC67 \uDB40\uDC68 \uDB40\uDC69 \uDB40\uDC6A \uDB40\uDC6B \uDB40\uDC6C \uDB40\uDC6D \uDB40\uDC6E \uDB40\uDC6F \uDB40\uDC70 \uDB40\uDC71 \uDB40\uDC72 \uDB40\uDC73 \uDB40\uDC74 \uDB40\uDC75 \uDB40\uDC76 \uDB40\uDC77 \uDB40\uDC78 \uDB40\uDC79 \uDB40\uDC7A \uDB40\uDC7B \uDB40\uDC7C \uDB40\uDC7D \uDB40\uDC7E \uDB40\uDC7F'},
                {'Block': 'Supplementary Private Use Area-A', 'Sample': '\uDB80\uDC00 \uDB80\uDC01 \uDB80\uDC02 \uDB80\uDC03 \uDB80\uDC04 \uDB80\uDC05 \uDB80\uDC06 \uDB80\uDC07 \uDB80\uDC08 \uDB80\uDC09 \uDB80\uDC0A \uDB80\uDC0B \uDB80\uDC0C \uDB80\uDC0D \uDB80\uDC0E \uDB80\uDC0F \uDB80\uDC10 \uDB80\uDC11 \uDB80\uDC12 \uDB80\uDC13 \uDB80\uDC14 \uDB80\uDC15 \uDB80\uDC16 \uDB80\uDC17 \uDB80\uDC18 \uDB80\uDC19 \uDB80\uDC1A \uDB80\uDC1B \uDB80\uDC1C \uDB80\uDC1D \uDB80\uDC1E \uDB80\uDC1F \uDB80\uDC20 \uDB80\uDC21 \uDB80\uDC22 \uDB80\uDC23 \uDB80\uDC24 \uDB80\uDC25 \uDB80\uDC26 \uDB80\uDC27 \uDB80\uDC28 \uDB80\uDC29 \uDB80\uDC2A \uDB80\uDC2B \uDB80\uDC2C \uDB80\uDC2D \uDB80\uDC2E \uDB80\uDC2F \uDB80\uDC30 \uDB80\uDC31 \uDB80\uDC32 \uDB80\uDC33 \uDB80\uDC34 \uDB80\uDC35 \uDB80\uDC36 \uDB80\uDC37 \uDB80\uDC38 \uDB80\uDC39 \uDB80\uDC3A \uDB80\uDC3B \uDB80\uDC3C \uDB80\uDC3D \uDB80\uDC3E \uDB80\uDC3F \uDB80\uDC40 \uDB80\uDC41 \uDB80\uDC42 \uDB80\uDC43 \uDB80\uDC44 \uDB80\uDC45 \uDB80\uDC46 \uDB80\uDC47 \uDB80\uDC48 \uDB80\uDC49 \uDB80\uDC4A \uDB80\uDC4B \uDB80\uDC4C \uDB80\uDC4D \uDB80\uDC4E \uDB80\uDC4F \uDB80\uDC50 \uDB80\uDC51 \uDB80\uDC52 \uDB80\uDC53 \uDB80\uDC54 \uDB80\uDC55 \uDB80\uDC56 \uDB80\uDC57 \uDB80\uDC58 \uDB80\uDC59 \uDB80\uDC5A \uDB80\uDC5B \uDB80\uDC5C \uDB80\uDC5D \uDB80\uDC5E \uDB80\uDC5F \uDB80\uDC60 \uDB80\uDC61 \uDB80\uDC62 \uDB80\uDC63 \uDB80\uDC64 \uDB80\uDC65 \uDB80\uDC66 \uDB80\uDC67 \uDB80\uDC68 \uDB80\uDC69 \uDB80\uDC6A \uDB80\uDC6B \uDB80\uDC6C \uDB80\uDC6D \uDB80\uDC6E \uDB80\uDC6F \uDB80\uDC70 \uDB80\uDC71 \uDB80\uDC72 \uDB80\uDC73 \uDB80\uDC74 \uDB80\uDC75 \uDB80\uDC76 \uDB80\uDC77 \uDB80\uDC78 \uDB80\uDC79 \uDB80\uDC7A \uDB80\uDC7B \uDB80\uDC7C \uDB80\uDC7D \uDB80\uDC7E \uDB80\uDC7F ...'},
                {'Block': 'Supplementary Private Use Area-B', 'Sample': '\uDBC0\uDC00 \uDBC0\uDC01 \uDBC0\uDC02 \uDBC0\uDC03 \uDBC0\uDC04 \uDBC0\uDC05 \uDBC0\uDC06 \uDBC0\uDC07 \uDBC0\uDC08 \uDBC0\uDC09 \uDBC0\uDC0A \uDBC0\uDC0B \uDBC0\uDC0C \uDBC0\uDC0D \uDBC0\uDC0E \uDBC0\uDC0F \uDBC0\uDC10 \uDBC0\uDC11 \uDBC0\uDC12 \uDBC0\uDC13 \uDBC0\uDC14 \uDBC0\uDC15 \uDBC0\uDC16 \uDBC0\uDC17 \uDBC0\uDC18 \uDBC0\uDC19 \uDBC0\uDC1A \uDBC0\uDC1B \uDBC0\uDC1C \uDBC0\uDC1D \uDBC0\uDC1E \uDBC0\uDC1F \uDBC0\uDC20 \uDBC0\uDC21 \uDBC0\uDC22 \uDBC0\uDC23 \uDBC0\uDC24 \uDBC0\uDC25 \uDBC0\uDC26 \uDBC0\uDC27 \uDBC0\uDC28 \uDBC0\uDC29 \uDBC0\uDC2A \uDBC0\uDC2B \uDBC0\uDC2C \uDBC0\uDC2D \uDBC0\uDC2E \uDBC0\uDC2F \uDBC0\uDC30 \uDBC0\uDC31 \uDBC0\uDC32 \uDBC0\uDC33 \uDBC0\uDC34 \uDBC0\uDC35 \uDBC0\uDC36 \uDBC0\uDC37 \uDBC0\uDC38 \uDBC0\uDC39 \uDBC0\uDC3A \uDBC0\uDC3B \uDBC0\uDC3C \uDBC0\uDC3D \uDBC0\uDC3E \uDBC0\uDC3F \uDBC0\uDC40 \uDBC0\uDC41 \uDBC0\uDC42 \uDBC0\uDC43 \uDBC0\uDC44 \uDBC0\uDC45 \uDBC0\uDC46 \uDBC0\uDC47 \uDBC0\uDC48 \uDBC0\uDC49 \uDBC0\uDC4A \uDBC0\uDC4B \uDBC0\uDC4C \uDBC0\uDC4D \uDBC0\uDC4E \uDBC0\uDC4F \uDBC0\uDC50 \uDBC0\uDC51 \uDBC0\uDC52 \uDBC0\uDC53 \uDBC0\uDC54 \uDBC0\uDC55 \uDBC0\uDC56 \uDBC0\uDC57 \uDBC0\uDC58 \uDBC0\uDC59 \uDBC0\uDC5A \uDBC0\uDC5B \uDBC0\uDC5C \uDBC0\uDC5D \uDBC0\uDC5E \uDBC0\uDC5F \uDBC0\uDC60 \uDBC0\uDC61 \uDBC0\uDC62 \uDBC0\uDC63 \uDBC0\uDC64 \uDBC0\uDC65 \uDBC0\uDC66 \uDBC0\uDC67 \uDBC0\uDC68 \uDBC0\uDC69 \uDBC0\uDC6A \uDBC0\uDC6B \uDBC0\uDC6C \uDBC0\uDC6D \uDBC0\uDC6E \uDBC0\uDC6F \uDBC0\uDC70 \uDBC0\uDC71 \uDBC0\uDC72 \uDBC0\uDC73 \uDBC0\uDC74 \uDBC0\uDC75 \uDBC0\uDC76 \uDBC0\uDC77 \uDBC0\uDC78 \uDBC0\uDC79 \uDBC0\uDC7A \uDBC0\uDC7B \uDBC0\uDC7C \uDBC0\uDC7D \uDBC0\uDC7E \uDBC0\uDC7F ...'},
            ];
            grid.setColumnWidth(1, 5000);
        };
        examples['Create a spreadsheet|It\'s just like excel, but without all the useful parts.'] = function (parentNode) {
            // create a spreadsheet
            var grid = canvasDatagrid({
                    parentNode: parentNode
                }),
                x,
                y,
                d = [],
                n;
            function colName(n) {
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
            for (x = 0; x < 10000; x += 1) {
                d[x] = {};
                for (y = 0; y < 50; y += 1) {
                    n = colName(y).toUpperCase();
                    d[x][n] = x * y;
                }
            }
            grid.attributes.columnHeaderClickBehavior = 'select';
            grid.style.columnHeaderCellHorizontalAlignment = 'center';
            grid.data = d;
        };
        examples['Add 10,000 random rows|Because why not?'] = function (parentNode) {
            // create random data from a bunch of Latin words
            var grid = canvasDatagrid({
                    parentNode: parentNode
                }),
                x,
                data = [],
                d,
                i,
                c,
                r = 'Elend, eam, animal omittam an, has in, explicari principes. Elit, causae eleifend mea cu. No sed adipisci accusata, ei mea everti melius periculis. Ei quot audire pericula mea, qui ubique offendit no. Sint mazim mandamus duo ei. Sumo maiestatis id has, at animal reprehendunt definitionem cum, mei ne adhuc theophrastus.';
            c = r.split(' ').map(function (i) { return i.trim(); });
            r = r.split(',').map(function (i) { return i.trim(); });
            for (x = 0; x < 10000; x += 1) {
                d = {};
                for (i = 0; i < r.length; i += 1) {
                    d[r[i]] = c[Math.floor(Math.random() * 1000) % (c.length - 1)];
                }
                data.push(d);
            }
            // add the data to the grid
            grid.data = data.concat(grid.data);
        };
        examples['Disco Mode|This is silly.  There is no way to stop it.'] = function (parentNode) {
            // this is not a real mode, just for fun
            // you'll probably have to refresh the page to get rid of this timer
            function createData() {
                var x, y, d = [];
                for (x = 0; x < 2000; x += 1) {
                    d[x] = {};
                    for (y = 0; y < 20; y += 1) {
                        d[x][y] = y * x;
                    }
                }
                return d;
            }
            var grid = canvasDatagrid({
                parentNode: parentNode,
                data: createData()
            });
            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            }
            function getRandomColor() {
                // rgb(235, 33, 177)
                return 'rgb(' + getRandomInt(0, 255) + ', '
                    + getRandomInt(25, 244) + ', '
                    + getRandomInt(0, 127) + ')';
            }
            grid.addEventListener('rendercell', function (e) {
                e.ctx.fillStyle = getRandomColor();
                e.ctx.strokeStyle = getRandomColor();
            });
            setInterval(grid.draw, 500);
            grid.draw();
        };
        // --- end of examples section
        // setup page
        function toCodeSample(fn) {
            return ('            ' + fn.toString()).split('\n')
                .map(function (i, index, arr) {
                    if (index === 0 || index === arr.length - 1) { return undefined; }
                    return i.replace(/^ {12}/, '');
                }).filter(function (i, index) {
                    return index !== 0;
                }).join('\n');
        }
        Object.keys(examples).forEach(function (exampleKey, i) {
            var msg = exampleKey.split('|'),
                li = document.createElement('li'),
                tocA = document.createElement('a'),
                a = document.createElement('a'),
                editor = document.createElement('div'),
                form = document.createElement('form'),
                h2 = document.createElement('h2'),
                p = document.createElement('p'),
                parentNode = document.createElement('div'),
                evaluate = document.createElement('button'),
                openInFiddle = document.createElement('button'),
                error = document.createElement('p'),
                outputTitle = document.createElement('div'),
                hr = document.createElement('hr'),
                aceEditor,
                hiddenFormsItems;
            function updateCode() {
                var c = 'window.addEventListener(\'DOMContentLoaded\', function () {\n'
                        + '    var parentNode = document.getElementById(\'grid\');\n'
                        + '    ' + aceEditor.getValue().replace(/\n/g, '\n    ');
                c = c.substring(0, c.length - 4) + '});';
                hiddenFormsItems = {
                    html: '<div id="grid"></div>',
                    css: '#grid { height: 300px; }',
                    js: c,
                    title: msg[0],
                    description: msg[1] || msg[0],
                    resources: 'https://tonygermaneri.github.io/canvas-datagrid/dist/canvas-datagrid.js',
                    dtd: 'html 5'
                };
            }
            li.appendChild(tocA);
            a.name = msg[0];
            window.addEventListener('scroll', function () {
                var b = a.getBoundingClientRect();
                if (b.top > 0 && form.offsetHeight - b.top > 0) {
                    tocA.classList.add('sample-selected');
                    window.history.replaceState({}, msg[0], tocA.href);
                } else {
                    tocA.classList.remove('sample-selected');
                }
            });
            tocA.innerHTML = msg[0];
            tocA.title = msg[1] || msg[0];
            tocA.href = '#' + encodeURIComponent(msg[0]);
            toc.appendChild(li);
            form.method = 'post';
            hr.className = 'example-hr';
            form.className = 'example';
            outputTitle.innerHTML = 'Output';
            form.action = 'http://jsfiddle.net/api/post/library/pure/';
            form.target = msg[0];
            openInFiddle.innerHTML = 'Open In JS Fiddle';
            openInFiddle.type = 'submit';
            evaluate.innerHTML = 'Execute';
            evaluate.type = 'button';
            evaluate.onclick = function () {
                parentNode.innerHTML = '';
                try {
                    eval('(function (parentNode) {'
                        + aceEditor.getValue()
                        + '}(parentNode));');
                } catch (e) {
                    error.innerHTML = 'Error ' + e.message + '<br>Check console for more details.';
                    throw e;
                }
            };
            editor.id = 'e' + i;
            h2.innerHTML = msg[0];
            p.innerHTML = msg[1] || msg[0];
            form.appendChild(a);
            form.appendChild(h2);
            form.appendChild(p);
            form.appendChild(evaluate);
            form.appendChild(openInFiddle);
            form.appendChild(editor);
            form.appendChild(outputTitle);
            form.appendChild(parentNode);
            form.appendChild(hr);
            form.onsubmit = updateCode;
            forms.appendChild(form);
            editor.className = 'sample-editor';
            parentNode.className = 'sample-grid';
            aceEditor = ace.edit(editor.id);
            aceEditor.$blockScrolling = Infinity;
            aceEditor.setTheme("ace/theme/monokai");
            aceEditor.getSession().setMode('ace/mode/javascript');
            aceEditor.getSession().setValue(toCodeSample(examples[exampleKey]));
            updateCode();
            Object.keys(hiddenFormsItems).forEach(function (key) {
                var input = document.createElement('input');
                input.name = key;
                input.type = 'hidden';
                input.value = hiddenFormsItems[key];
                form.appendChild(input);
            });
            aceEditor.resize();
        });
    }
    var i = document.createElement('div');
    i.className = 'sample-container';
    document.body.appendChild(i);
    createSample({
        parentNode: i
    });
    window.dispatchEvent(new Event('scroll'));
    // remove jsdoc boilershit
    (function () {
        var c = document.querySelector('.container'),
            d = document.querySelector('footer');
        [c, d].forEach(function (el) {
            //if (el && el.parentNode) { el.parentNode.removeChild(el); }
        });
    }());
});
