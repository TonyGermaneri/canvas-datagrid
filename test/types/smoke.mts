// Compile-only check of the ES module declarations (dist/types.d.mts), as
// seen by an ES module importer under node16/nodenext (#613).
import canvasDatagrid, {
  type canvasDatagrid as CanvasDatagrid,
  type CanvasDatagridArgs,
} from 'canvas-datagrid';

const args: CanvasDatagridArgs = { parentNode: document.body, data: [] };
const grid: CanvasDatagrid = canvasDatagrid(args);
grid.draw();

export {};
