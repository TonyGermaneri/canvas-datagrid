import {
  mouseup,
  mousedown,
  mousemove,
  assertPxColor,
  g,
  smallData,
  c,
  doAssert,
  dblclick,
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
    mousemove(document.body, 94, 10, grid.canvas);
    mousedown(grid.canvas, 94, 10);
    mousemove(document.body, 190, 10, grid.canvas);
    mouseup(document.body, 190, 10, grid.canvas);
    setTimeout(function () {
      assertPxColor(grid, 100, 36, c.b, done);
    }, 10);
  });
  it('Resizes all selected columns.', function () {
    var grid = g({
      test: this.test,
      data: smallData(),
      style: {
        cellWidth: 50,
      },
    });
    grid.focus();
    grid.selectColumn(0);
    grid.selectColumn(1, true);

    const columnSizes = Object.keys(grid.sizes.columns);
    doAssert(
      columnSizes.length === 1 && columnSizes[0] === '-1',
      'No column widths set',
    );

    mousemove(document.body, 94, 10, grid.canvas);
    mousedown(grid.canvas, 94, 10);
    mousemove(document.body, 190, 10, grid.canvas);
    mouseup(document.body, 190, 10, grid.canvas);

    doAssert(
      grid.sizes.columns[0] === grid.sizes.columns[1],
      'Columns have same width',
    );

    mousemove(document.body, 190, 10, grid.canvas);
    mousedown(grid.canvas, 190, 10);
    mousemove(document.body, 94, 10, grid.canvas);
    mouseup(document.body, 94, 10, grid.canvas);

    doAssert(
      grid.sizes.columns[0] === 50 && grid.sizes.columns[1] === 50,
      'Columns have been set back to original width',
    );
  });
  it('Resize a column by double clicking a column header.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      style: {
        cellWidth: 50,
      },
    });

    grid.addEventListener('resizecolumn', function (e) {
      doAssert(e.x === grid.sizes.columns[0], 'x matches width of column 0');
      done();
    });
    grid.focus();
    mousemove(document.body, 94, 10, grid.canvas);
    dblclick(grid.canvas, 94, 10);
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
      mousemove(document.body, 94, 36, grid.canvas);
      mousedown(grid.canvas, 94, 36);
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
      mousemove(document.body, 10, 48, grid.canvas);
      mousedown(grid.canvas, 10, 48);
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
      mousemove(document.body, 40, 48, grid.canvas);
      mousedown(grid.canvas, 40, 48);
      mousemove(document.body, 40, 100, grid.canvas);
      mouseup(document.body, 40, 100, grid.canvas);
      assertPxColor(grid, 10, 90, c.b, done);
    }, 1);
  });
}
