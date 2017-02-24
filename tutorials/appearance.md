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
