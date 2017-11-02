Ways to create a grid
---------------------

* Web component by using the tag `&lt;canvas-datagrid&gt;&lt;/canvas-datagrid&gt;` anywhere in your document.
* Web component by running `var foo = document.createElement('canvas-datagrid')`.
* Webpack3 universal module loader by adding one of many module loaders to your application code.  <br>See example: {@link https://tonygermaneri.github.io/canvas-datagrid/tutorials/amdDemo.html}.
* You can also load the grid by invoking the global method `var foo = canvasDatagrid(&lt;args&gt;);` <br>See example: {@link https://tonygermaneri.github.io/canvas-datagrid/tutorials/demo.html}

If you create the grid using the non-web component model, you can attach the grid to an existing
canvas by passing the canvas in as the `parentNode` when you instantiate the grid.

With the exception of attaching to an existing canvas, the grid will attempt to create a Shadow DOM element and attach a canvas within.

Setting and Getting Data
------------------------

You can set data into the grid in a number of ways.  No matter how it is passed in, it is immediately converted into the native
format which is an array of objects that all contain the same properties.  E.g.:

    [
        {col1: 'row 1 column 1', col2: 'row 1 column 2', col3: 'row 1 column 3'},
        {col1: 'row 2 column 1', col2: 'row 2 column 2', col3: 'row 2 column 3'}
    ]

When getting data, no matter how it was set, it will be returned in the native format above.

Data can be almost any type, the behavior of the grid will change slightly depending on how it is set.

* Data can be set using the data property.
* Data can be set using the web component data attribute.
* Data can be set using the web component innerHTML attribute.

When setting data using the data property, you can use many types.

* As an array of objects.
* As an array of arrays.
* As an object.
* As a jagged array of objects.
* As a jagged array of arrays.
* As a function that returns any of the above.
* As a function that returns undefined, and passes any of the above to the callback argument asynchronously.

When using an array of arrays, the columns will be named like a spread sheet, A, B, C, through ZZZZ.

When the value of a cell is an object or an array, a new grid will be drawn into the cell.

Schema
------

Schema is optional.  Schema is an array of header objects.
This documentation will use the term header and column interchangeably.
If no schema is provided one will be generated from the
data, in that case all data will be assumed to be string data.

Each header object can have the following properties:

| Property | Description |
|-----|------|
| name | The name of the column.  This is used to match with data and is the only required property. |
| type | The data type of this column |
| title | What will be displayed to the user.  If not present, name will be used. |
| width | The default width in pixels of this column.|
| hidden | When true the column will be hidden. |
| filter | The filter function to use to filter this column.  If no function is provided, type will determine filer. |
| formatter | The formatter function used display this column.  If no function is provided, type will determine formatter.|
| defaultValue | The default value of this column for new rows.  This is a function or a string.  When a function is used, it takes the arguments `header` and `index` and must return a value for new default cell value in this column.|

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

Properties, Attributes, & Parameters
------------------------------------

* Properties, attributes, and parameters represent different ways to change the values and behaviors of the grid.
Properties can be accessed directly from the grid instance. E.g.:

    myGrid.someProperty = 'Some Value';

* Attributes can be access from the grid instance's attributes property.  E.g.:

    myGrid.attributes.someAttribute = 'Some Value';

* Attributes can also be set from the attribute list of the web component tag.  E.g.:

    &lt;canvas-datagrid someattribute="Some Value"&gt;&lt;/canvas-datagrid&gt;

* Parameters are attributes that are passed in the arguments object during instantiation.  E.g.:

    var myGrid = canvasDatagrid({someAttribute: 'Some Value'});


Web Component
-------------

The grid can be instantiated as a web component.


    <canvas-datagrid></canvas-datagrid>


To set data, add JSON between the open and close tags.


        <canvas-datagrid>[
            {"col1": "row 1 column 1", "col2": "row 1 column 2", "col3": "row 1 column 3"},
            {"col1": "row 2 column 1", "col2": "row 2 column 2", "col3": "row 2 column 3"}
        ]</canvas-datagrid>


To set attributes, add attributes.  Attributes are not case sensitive when using HTML.  When using the same element in JavaScript however they are case sensitive.

    <canvas-datagrid selectionmode='row'></canvas-datagrid>

Styles are declared as custom css properties prefixed with --cdg- and hyphenated rather than camelCase.
For example, the style "backgroundColor" is set with "--cdg-background-color".  The web component
works with classes, css cascading, and in-line styles just like any other HTML element.

Inline styles:

        <canvas-datagrid style="--cdg-background-color: lightblue;">[
            {"col1": "row 1 column 1", "col2": "row 1 column 2", "col3": "row 1 column 3"},
            {"col1": "row 2 column 1", "col2": "row 2 column 2", "col3": "row 2 column 3"}
        ]</canvas-datagrid>

Class styles.

        <style>
            .grid {
                --cdg-background-color: lightblue;
            }
        </style>
        <canvas-datagrid class="grid">[
            {"col1": "row 1 column 1", "col2": "row 1 column 2", "col3": "row 1 column 3"},
            {"col1": "row 2 column 1", "col2": "row 2 column 2", "col3": "row 2 column 3"}
        ]</canvas-datagrid>

You can still access the grid as you would expect and the interface for the web component instance is the same as the module loaded or globally scoped version.  The web component version has additional properties that come from inheriting the base HTTPElement class.

For further reading about web components see: https://www.webcomponents.org/

* When instantiating the grid using the Webpack loader or the global function canvasDatagrid, class support will not work.

Sorters
-------

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

Filters
-------

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

Formatters
----------

Object that contains a list of formatting functions for displaying text.
The properties in this object match the `schema[].type` property.
For example, if the schema for a given column was of the type `date`
the grid would look for a formatter called `formatters.date`
if a formatter cannot be found for a given data type a warning will
be logged and the string formatter will be used.

Cell formatter function should contain the following arguments.

    grid.formatters.date = function (e) { return new Date(e.cell.value).toISOString(); }

Formatters must return a string value to be displayed in the cell.


Formatting using event listeners
--------------------------------

You can format the data in your cells without altering the data in two ways.

The first and fastest method is grid formatters.
Grid formatters allow you to pass your values though a function to format them as they are drawn onto the grid.
Data type is defined in the [schema](https://tonygermaneri.github.io/canvas-datagrid/docs/#schema) that you can optionally pass to describe your data.

This method is slightly faster due to the O(1) hash map employed in the value formatters.

In the following example, the type `date` is given a formatter function.

    grid.formatters.date = function (e) {
        return new Date(e.cell.value).toISOString();
    };

The return value of the formatter function will be displayed in the cell instead of the value
in the data without altering the data.

The second method is the `rendertext` event.  By subscribing to the `rendertext` event listener
we can intercept the value in the context of the [cell](https://tonygermaneri.github.io/canvas-datagrid/docs/#canvasDatagrid.cell) being drawn and alter it.

This method is slightly slower due to the O(n) loop employed in the event handler class.

This method is not dependent on values in the schema.  This methods overrides `grid.formatters`.

    grid.addEventListener('rendertext', function (e) {
        if (e.cell.rowIndex > -1) {
            if (e.cell.header.name === 'MyDateColumnName') {
                e.cell.formattedValue = new Date(e.cell.value).toISOString();
            }
        }
    });

Extending the visual appearance
-------------------------------
All visual elements of the canvas are dependent on the values of the style object.
Using the style object, you can change the dimensions and appearance of any element of the grid.

There are two types of styles, styles built into the DOM element, such as width and margin, and there
are styles related to the drawing of the grid on the canvas, these are listed in the style section.

This example changes the fill style of the cell when the cell is a certain value.

    grid.addEventListener('rendercell', function (e) {
        if (e.cell.header.name === 'MyStatusCell' && /blah/.test(e.cell.value)) {
            e.ctx.fillStyle = '#AEEDCF';
        }
    });

Drawing on the canvas
---------------------
Extending behavior is done using event handlers just like a regular HTML element.
You can alter the content of a rendered cell by attaching to such an event handler.
Below is an example of drawing an image into a cell:

This example attaches to two events. `rendertext` to prevent the rendering of text into the cell...

    grid.addEventListener('rendertext', function (e) {
        if (e.cell.rowIndex > -1) {
            if (e.cell.header.name === 'MyImageColumnName') {
                e.cell.formattedValue = e.cell.value ? '' : 'No Image';
            }
        }
    });

... and `afterrendercell` to draw an image into the cell after the background and borders are drawn.
Because the image is loaded asynchronously, you need to attach to the load event to actually draw
the image.

    var imgs = {};
    grid.addEventListener('afterrendercell', function (e) {
        var i, contextGrid = this;
        if (e.cell.header.name === 'MyImageColumnName'
                && e.cell.value && e.cell.rowIndex > -1) {
            if (!imgs[e.cell.value]) {
                i = imgs[e.cell.value] = new Image();
                i.src = e.cell.value;
                i.onload = function () {
                    i.targetHeight = e.cell.height;
                    i.targetWidth = e.cell.height * (i.width / i.height);
                    contextGrid.draw();
                };
                return;
            }
            i = imgs[e.cell.value];
            if (i.width !== 0) {
                e.ctx.drawImage(i, e.cell.x, e.cell.y, i.targetWidth, i.targetHeight);
            }
        }
    });



Supporting DOM elements
-----------------------

Although the grid itself is pure canvas, there are some supporting elements of the grid that are HTMLElements.

* In order to overlap parts of the page that are not on the canvas, the context menu is a `&lt;div&gt;`.
* In order to support advanced key commands, copying, pasting as well as user customization outside of this library, the editing input/textarea is DOM.
* A hidden input is placed outside of the visible area of the web page to capture keystroke and translate them into grid commands, such as cursor navigation.

You can customize almost every behavior of the grid by subscribing to an event in the event handler collection.
Most events provide a `e.preventDefault();` method that will allow you to manipulate the grid's behavior on a very granular level.

Examples of how to use many of the event handlers to change default grid behaviors can be found in the <a href="#tutorials">tutorials</a> section.

Notes
-----

* Throughout this document there are several words that will be used interchangeably.
* Canvas Datagrid will also be referred to simply as "grid".
* Column and header are used interchangeably.
* Node, HTMLElement, DOM, DOM element, and element all refer to an HTML element or elements.
* Firing, raising, invoking, and running, all refer to a function or event occurring.
* Binding, subscribing, and listening all refer to using `&lt;element&gt;.addEventListener()` to subscribe to an event.
* Inner grid, child grid, tree grid, cell grid all refer to one of two types of grids that render inside of other grids.  Cell grids are in a single cell, while tree grids span an entire row.
* Drawing and rendering both refer to using low level methods to draw pixels onto the canvas, usually by invoking `canvasDatagrid.draw`.
* This documentation is automatically generated and can be prone to omissions, bad links and errors.  Please report any problems with the documentation here {@link https://github.com/TonyGermaneri/canvas-datagrid/issues}.
