You can add or remove items from the context menu, or stop it from appearing.
In the following example, a context menu item is added:

        grid.addEventListener('contextmenu', function (e) {
            e.items.push({
                title: 'Process selected row(s)',
                click: function () {
                    // e.cell.value contains the cell's value
                    // e.cell.data contains the row values
                    myProcess(e.cell.value, e.cell.data);
                }
            });
        });

The `title` property can be an HTML node reference instead of a string.
The `click` property is optional.  See [contextmenu](https://tonygermaneri.github.io/canvas-datagrid/#tutorial--Simple-context-menu) complete information.
