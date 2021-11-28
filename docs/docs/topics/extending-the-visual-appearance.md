---
title: Extending the visual appearance
---

All visual elements of the canvas are dependent on the values of the style object.
Using the style object, you can change the dimensions and appearance of any element of the grid.

There are two types of styles, styles built into the DOM element, such as width and margin, and there
are styles related to the drawing of the grid on the canvas, these are listed in the style section.

This example changes the fill style of the cell when the cell is a certain value.

```js
grid.addEventListener('rendercell', function (e) {
  if (e.cell.header.name === 'MyStatusCell' && /blah/.test(e.cell.value)) {
    e.ctx.fillStyle = '#AEEDCF';
  }
});
```
