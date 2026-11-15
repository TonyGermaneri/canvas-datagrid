// Compile-only check of the CommonJS declarations (dist/types.d.cts): the UMD
// bundle sets `module.exports` to the factory, so `require()` returns it
// directly (#613).
import canvasDatagrid = require('canvas-datagrid');

const args: canvasDatagrid.CanvasDatagridArgs = {
  parentNode: document.body,
  data: [],
};
const grid: canvasDatagrid.canvasDatagrid = canvasDatagrid(args);
grid.draw();

export {};
