Canvas Data Grid
================

* [Demo](https://tonygermaneri.github.io/canvas-datagrid/sample/index.html)
* High performance lightweight hierarchal canvas based data grid.
* Support for millions of rows and columns.
* Extensible styling, filtering, formatting, resizing, selecting, and ordering.
* Rich API of events, methods and properties optimized for CRUD, reporting and work flow applications.
* Zero dependencies, very small code base, a single 94k (16k gziped) file.

Installation
============
You can install canvas-datagrid one of three ways:

1. Download the [source](https://raw.githubusercontent.com/TonyGermaneri/canvas-datagrid/master/lib/main.js) file from github.
2. Use bower

    bower install canvas-datagrid

3. Use npm

    npm install canvas-datagrid

Place the single source file `./lib/main.js` in your web page using
a script tag that points to the source or use a require framework.

If you do not use a require framework a function will
be added to the global scope of the web page called `canvasDatagrid`.

Instantiation
=============

Works with require framework or without.
If used without require, `canvasDataGrid` is declared in the global scope.

Simple creation and data set.

    var grid = canvasDataGrid({
        parentNode: document.getElementById('myHtmlElement'),
        data: [
            {col1: 'row 1 column 1', col2: 'row 1 column 2', col3: 'row 1 column 3'},
            {col1: 'row 2 column 1', col2: 'row 2 column 2', col3: 'row 2 column 3'}
        ]
    });

Check which [cell](#cell) the user clicked on.

    grid.addEventListener('click', function (e, cell) {
        console.log(cell.value);
    });

Check values when the selection has changed.

    grid.addEventListener('selectionchanged', function (data, matrix, bounds) {
        console.log(data);
    });

You can alter the data after instantiation.

    grid.data[0].col1 = 'blah';
    // gota call draw after setting data this way.
    grid.draw();

Change the color of a cell based on value.

    grid.addEventListener('rendercell', function (ctx, cell) {
        if (cell.value === 'blah') {
            ctx.fillStyle = 'red';
        }
    });

Alter the format (appearance only) of a data based on type.

    grid.formatters.date = function (ctx, cell) {
        return new Date(cell.value).toISOString();
    };

Add a tree view.

    grid.attributes.tree = true;
    grid.addEventListener('expandtree', function (grid, data, rowIndex) {
        grid.data = [{My: 'Other Data'}];
    });

Change all the data!

    grid.data = [{other: 'data'}];

Extending
=========
canvas-datagrid can be extended in many ways.  This section covers all of the
methods of extending the canvas.

Extending the visual appearance
-------------------------------
All visual elements of the canvas are dependent on the values of the style object.
You can change the dimensions and appearance of any element of the grid.

This example changes the fill style of the cell when the cell is a certain value.

    grid.addEventListener('rendercell', function (ctx, cell) {
        if (cell.header.name === 'MyStatusCell' && /blah/.test(cell.value)) {
            ctx.fillStyle = '#AEEDCF';
        }
    });

For a complete list of all style properties visit the [styles](#styles) section.

Drawing on the canvas
-------------------------------------------
Extending behavior is done using event handlers just like a regular HTML element.
You can alter the content of a rendered cell by attaching to such an event handler.
Below is an example of drawing an image into a cell:

This example attaches to two events. `rendertext` to prevent the rendering of text into the cell...

    grid.addEventListener('rendertext', function (ctx, cell) {
        if (cell.rowIndex > -1) {
            if (cell.header.name === 'MyImageColumnName') {
                cell.formattedValue = cell.value ? '' : 'No Image';
            }
        }
    });

... and `afterrendercell` to draw an image into the cell after the background and borders are drawn.
Because the image is loaded asynchronously, you need to attach to the load even to actually draw
the image.

    var imgs = {};
    grid.addEventListener('afterrendercell', function (ctx, cell) {
        var i, contextGrid = this;
        if (cell.header.name === 'MyImageColumnName'
                && cell.value && cell.rowIndex > -1) {
            if (!imgs[cell.value]) {
                i = imgs[cell.value] = new Image();
                i.src = cell.value;
                i.onload = function () {
                    i.targetHeight = cell.height;
                    i.targetWidth = cell.height * (i.width / i.height);
                    contextGrid.draw();
                };
                return;
            }
            i = imgs[cell.value];
            if (i.width !== 0) {
                ctx.drawImage(i, cell.x, cell.y, i.targetWidth, i.targetHeight);
            }
        }
    });

Extending the context menu
--------------------------
You can add or remove items from the context menu, or stop it from appearing.
In the following example, a context menu item is added:

        grid.addEventListener('contextmenu', function (e, cell, items) {
            items.push({
                title: 'Process selected row(s)',
                click: function () {
                    // cell.value contains the cell's value
                    // cell.data contains the row values
                    myProcess(cell.value, cell.data);
                }
            });
        });

The `title` property can be an HTML node reference instead of a string.
The `click` property is optional.  See [contextmenu](#contextmenu) complete information.

Formatting data
-------------------------------------------------------
You can format the data in your cells without altering the data in two ways.

The first and fastest method is grid formatters.
Grid formatters allow you to define what happens to a type of data.
Data type is defined in the [schema](#schema) that you can optionally pass to describe your data.

This method is slightly faster due to the O(1) hash map employed in the value formatters.

In the following example the type `date` is given a formatter function.

    grid.formatters.date = function (ctx, cell) {
        return new Date(cell.value).toISOString();
    };

The return value of the formatter function will be displayed in the cell instead of the value
in the data without altering the data.

The second method is the `rendertext` event.  By subscribing to the `rendertext` event listener
we can intercept the value in the context of the [cell](#cell) being drawn and alter it.

This method is slightly slower due to the O(n) loop employed in the event handler class.

This method is not dependent on values in the schema.  This methods overrides `grid.formatters`.

    grid.addEventListener('rendertext', function (ctx, cell) {
        if (cell.rowIndex > -1) {
            if (cell.header.name === 'MyDateColumnName') {
                cell.formattedValue = new Date(cell.value).toISOString();
            }
        }
    });

formatters
==========
Object that contains a list of formatting functions for displaying text.
The properties in this object match the `schema[].type` property.
For example, if the schema for a given column was of the type `date`
the grid would look for a formatter called `formatters.date`
if a formatter cannot be found for a given data type a warning will
be logged and the string formatter will be used.

Cell formatter function should contain the following arguments.

    grid.formatters.date = function (ctx, cell) { return new Date(cell.value).toISOString(); }

| Argument | Description |
|-----|------|
| ctx | Canvas context. |
| [cell](#cell) | Current cell. |

Formatters must return a string value to be displayed in the cell.

sorters
=======
Object that contains a list of sorting functions for sorting columns.

| Argument | Description |
|-----|------|
| columnName | Name of the column to be sorted. |
| direction | `asc` or `desc` for ascending or descending. |

Sorter function must return a sort function.
This function will be used in the [native sort method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).

Example sorter:

    grid.sorters.number = function (columnName, direction) {
        var asc = direction === 'asc';
        return function (a, b) {
            if (asc) {
                return a[columnName] - b[columnName];
            }
            return b[columnName] - a[columnName];
        };
    };

filters
=======
Object that contains a list of filters for filtering data.
The properties in this object match the `schema[].type` property.
For example, if the schema for a given column was of the type `date`
the grid would look for a filter called `filters.date`
if a filter cannot be found for a given data type a warning will
be logged and the string/RegExp filter will be used.

    filters.number = function (value, filterFor) {
        if (!filterFor) { return true; }
        return value === filterFor;
    };

| Argument | Description |
|-----|------|
| value | Value of the data. |
| filterFor | Value to filter for. |

data
====
This is how data is set in the grid.
Data must be an array of objects that conform to a schema.

    [
        {col1: 'row 1 column 1', col2: 'row 1 column 2', col3: 'row 1 column 3'},
        {col1: 'row 2 column 1', col2: 'row 2 column 2', col3: 'row 2 column 3'}
    ]

Data values can be any primitive type.  However if a cell value is another data array,
a child grid will be rendered into the cell.  This child grid is different than a
tree view grid and uses the `childGridAttributes` attribute for properties and styling.

schema
======
Schema is optional.  Schema is an array of column objects.
If no schema is provided one will be generated from the
data, in that case all data will be assumed to be string data.

Each column object can have the following properties:

| Property | Description |
|-----|------|
| name | The name of the column.  This is used to match with data and is the only required property. |
| type | The data type of this column |
| title | What will be displayed to the user.  If not present, name will be used. |
| width | The default width in pixels of this column.|
| hidden | When true the column will be hidden. |
| filter | The filter function to use to filter this column.  If no function is provided, type will determine filer. |
| formatter | The formatter function used display this column.  If no function is provided, type will determine formatter.|
| defaultValue | The default value of this column for new rows.  This is a function that takes the arguments `header` and `index` and must return a value for new default cells in this column.|

Example schema:

    [
        {
            name: 'col1'
        },
        {
            name: 'col2'
        },
        {
            name: 'col3'
        }
    ]
