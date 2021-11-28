---
title: Drawing on the canvas
---

Extending behavior is done using event handlers just like a regular HTML element.
You can alter the content of a rendered cell by attaching to such an event handler.
Below is an example of drawing an image into a cell:

This example attaches to two events. `rendertext` to prevent the rendering of text into the cell...

```js
grid.addEventListener('rendertext', function (e) {
  if (e.cell.rowIndex > -1) {
    if (e.cell.header.name === 'MyImageColumnName') {
      e.cell.formattedValue = e.cell.value ? '' : 'No Image';
    }
  }
});
```

... and `afterrendercell` to draw an image into the cell after the background and borders are drawn.
Because the image is loaded asynchronously, you need to attach to the load event to actually draw
the image.

```js
var imgs = {};

grid.addEventListener('afterrendercell', function (e) {
  var i,
    contextGrid = this;

  if (
    e.cell.header.name === 'MyImageColumnName' &&
    e.cell.value &&
    e.cell.rowIndex > -1
  ) {
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
```
