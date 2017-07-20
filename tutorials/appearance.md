canvas-datagrid can be extended in many ways.  This section covers all of the
methods of extending the canvas.

Extending the visual appearance
-------------------------------
All visual elements of the canvas are dependent on the values of the style object.
You can change the dimensions and appearance of any element of the grid.

This example changes the fill style of the cell when the cell is a certain value.

    grid.addEventListener('rendercell', function (e) {
        if (e.cell.header.name === 'MyStatusCell' && /blah/.test(e.cell.value)) {
            e.ctx.fillStyle = '#AEEDCF';
        }
    });

For a complete list of all style properties visit the [styles](https://tonygermaneri.github.io/canvas-datagrid/docs/canvasDataGrid.style.html) section.

Drawing on the canvas
-------------------------------------------
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
                ctx.drawImage(i, e.cell.x, e.cell.y, i.targetWidth, i.targetHeight);
            }
        }
    });
