You can format the data in your cells without altering the data in two ways.

The first and fastest method is grid formatters.
Grid formatters allow you to define what happens to a type of data.
Data type is defined in the [schema](https://tonygermaneri.github.io/canvas-datagrid/docs/tutorial-schema.html) that you can optionally pass to describe your data.

This method is slightly faster due to the O(1) hash map employed in the value formatters.

In the following example the type `date` is given a formatter function.

    grid.formatters.date = function (ctx, cell) {
        return new Date(cell.value).toISOString();
    };

The return value of the formatter function will be displayed in the cell instead of the value
in the data without altering the data.

The second method is the `rendertext` event.  By subscribing to the `rendertext` event listener
we can intercept the value in the context of the [cell](https://tonygermaneri.github.io/canvas-datagrid/docs/canvasDataGrid.cell.html) being drawn and alter it.

This method is slightly slower due to the O(n) loop employed in the event handler class.

This method is not dependent on values in the schema.  This methods overrides `grid.formatters`.

    grid.addEventListener('rendertext', function (e) {
        if (e.cell.rowIndex > -1) {
            if (e.cell.header.name === 'MyDateColumnName') {
                e.cell.formattedValue = new Date(e.cell.value).toISOString();
            }
        }
    });

formatters interface
====================
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
| [cell](https://tonygermaneri.github.io/canvas-datagrid/docs/canvasDataGrid.cell.html) | Current cell. |

Formatters must return a string value to be displayed in the cell.
