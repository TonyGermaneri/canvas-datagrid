---
title: Cell grids
---

Cell grids are child instances of canvas-datagrid inside of a cell. A column renders cell grids when its schema `type` is `canvas-datagrid`; the value of each cell in that column, itself an array of rows, becomes the data of the cell grid.

The type has to be set in the schema. An array value on its own does not create a cell grid: a generated schema treats every column as `string` and the array is formatted as text.

```js
var grid = canvasDatagrid({
  parentNode: document.getElementById('grid'),
  schema: [{ name: 'name' }, { name: 'orders', type: 'canvas-datagrid' }],
  data: [
    {
      name: 'Alice',
      orders: [
        { item: 'Pen', quantity: 2 },
        { item: 'Notebook', quantity: 1 },
      ],
    },
    {
      name: 'Bob',
      orders: [{ item: 'Stapler', quantity: 1 }],
    },
  ],
  // settings for every cell grid; a style here is applied to each one
  cellGridAttributes: {
    showRowHeaders: false,
    style: {
      cellHeight: 20,
    },
  },
  style: {
    // the height of the rows that hold cell grids
    cellGridHeight: 80,
  },
});
```

See the [Create a cell grid](/examples/create-a-cell-grid) example.

Cell grids are created the first time their cell is drawn and are listed in `grid.childGrids`. The attributes in `cellGridAttributes` are passed to every cell grid when it is created, so set them before the data is drawn; the `style.cellGridHeight` of the parent sets the height of the rows that hold cell grids.

Cell grids scroll on their own: the mouse wheel over a cell grid scrolls the cell grid, and once it reaches the end of its rows the wheel moves on to the parent grid, like nested scrolling elements in HTML. Tree grids behave the same way.

You can hook into the events [`beforerendercellgrid`](/reference/events#beforerendercellgrid) or [`beforecreatecellgrid`](/reference/events#beforecreatecellgrid) to prevent the cell grid from being drawn by calling `e.preventDefault();`. You can manipulate the parameters used to instantiate the cell grid by hooking into `beforecreatecellgrid` and manipulating `e.cellGridAttributes`. Cells that are grid cells have the property `cell.isGrid` set to the value `true` and `cell.grid` set to the cell grid once it exists.

Cell grids are different from tree grids, the grids that open under a row when its drill-in arrow is clicked. Tree grids span the whole row, are created by the `tree` attribute and the `expandtree` event, and use `treeGridAttributes`. See [Allow users to open trees](/examples/allow-users-to-open-trees).
