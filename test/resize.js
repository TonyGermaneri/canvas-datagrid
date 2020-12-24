import {
  mouseup,
  mousedown,
  mousemove,
  assertPxColor,
  g,
  smallData,
  c,
} from './util.js';

export default function () {
  it('Resize a column from a column header.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      style: {
        cellWidth: 50,
      },
    });
    grid.addEventListener('rendercell', function (e) {
      if (e.cell.columnIndex === 0) {
        e.ctx.fillStyle = c.b;
      }
    });
    grid.focus();
    mousemove(grid.canvas, 94, 10);
    mousedown(grid.canvas, 94, 10);
    mousemove(grid.canvas, 190, 10, grid.canvas);
    mousemove(document.body, 190, 10, grid.canvas);
    mouseup(document.body, 190, 10, grid.canvas);
    setTimeout(function () {
      assertPxColor(grid, 100, 36, c.b, done);
    }, 10);
  });
  it('Resize a column from a cell.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      borderDragBehavior: 'resize',
      allowColumnResizeFromCell: true,
      style: {
        cellWidth: 50,
      },
    });
    grid.addEventListener('rendercell', function (e) {
      if (e.cell.columnIndex === 0) {
        e.ctx.fillStyle = c.b;
      }
    });
    setTimeout(function () {
      grid.focus();
      mousemove(grid.canvas, 94, 36);
      mousedown(grid.canvas, 94, 36);
      mousemove(grid.canvas, 190, 36, grid.canvas);
      mousemove(document.body, 190, 36, grid.canvas);
      mouseup(document.body, 190, 36, grid.canvas);
      assertPxColor(grid, 110, 36, c.b, done);
    }, 1);
  });
  it('Resize a row.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      style: {
        cellWidth: 50,
      },
    });
    grid.addEventListener('rendercell', function (e) {
      if (e.cell.columnIndex === -1 && e.cell.rowIndex === 0) {
        e.ctx.fillStyle = c.b;
      }
    });
    setTimeout(function () {
      grid.focus();
      mousemove(grid.canvas, 10, 48);
      mousedown(grid.canvas, 10, 48);
      mousemove(grid.canvas, 10, 100, grid.canvas);
      mousemove(document.body, 10, 100, grid.canvas);
      mouseup(document.body, 10, 100, grid.canvas);
      assertPxColor(grid, 10, 90, c.b, done);
    }, 1);
  });
  it('Resize a row from a cell.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      allowRowResizeFromCell: true,
      borderDragBehavior: 'resize',
      style: {
        cellWidth: 50,
      },
    });
    grid.addEventListener('rendercell', function (e) {
      if (e.cell.columnIndex === -1 && e.cell.rowIndex === 0) {
        e.ctx.fillStyle = c.b;
      }
    });
    setTimeout(function () {
      grid.focus();
      mousemove(grid.canvas, 40, 48);
      mousedown(grid.canvas, 40, 48);
      mousemove(grid.canvas, 40, 100, grid.canvas);
      mousemove(document.body, 40, 100, grid.canvas);
      mouseup(document.body, 40, 100, grid.canvas);
      assertPxColor(grid, 10, 90, c.b, done);
    }, 1);
  });
}
