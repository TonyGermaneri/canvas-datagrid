// Compile-only check that dist/types.d.ts is a usable module (#567).
import canvasDatagrid, {
  canvasDatagrid as CanvasDatagrid,
  CanvasDatagridArgs,
} from 'canvas-datagrid';

const args: CanvasDatagridArgs = {
  parentNode: document.body,
  data: [{ col1: 'a', col2: 1 }],
  editable: false,
};

const grid = canvasDatagrid(args);
const typed: CanvasDatagrid = grid;
typed.data = [{ col1: 'b', col2: 2 }];
grid.addEventListener('activecellchanged', (e: unknown) => {
  void e;
});
grid.draw();

const fromGlobal = window.canvasDatagrid({ data: [] });
void fromGlobal;

export {};
