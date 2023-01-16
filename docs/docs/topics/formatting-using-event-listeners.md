---
title: Formatting using event listeners
---

You can format the data in your cells without altering the data in two ways.

The first and fastest method is grid formatters.
Grid formatters allow you to pass your values though a function to format them as they are drawn onto the grid.
Data type is defined in the [schema](https://canvas-datagrid.js.org/#schema) that you can optionally pass to describe your data.

This method is slightly faster due to the O(1) hash map employed in the value formatters.

In the following example, the type `date` is given a formatter function.

```js
grid.formatters.date = function (e) {
  return new Date(e.cell.value).toISOString();
};
```

The return value of the formatter function will be displayed in the cell instead of the value
in the data without altering the data.

The second method is the `rendertext` event. By subscribing to the `rendertext` event listener
we can intercept the value in the context of the [cell](https://canvas-datagrid.js.org/#canvasDatagrid.cell) being drawn and alter it.

This method is slightly slower due to the O(n) loop employed in the event handler class.

This method is not dependent on values in the schema. This methods overrides `grid.formatters`.

```js
grid.addEventListener('rendertext', function (e) {
  if (e.cell.rowIndex > -1) {
    if (e.cell.header.name === 'MyDateColumnName') {
      e.cell.formattedValue = new Date(e.cell.value).toISOString();
    }
  }
});
```
