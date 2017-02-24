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
