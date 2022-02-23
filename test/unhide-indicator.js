import {
  click,
  assertPxColorFn,
  g,
  mousemove,
  shouldContainCell,
  shouldNotContainCell,
  delay,
  c,
  makeData,
  itoa,
  savePartOfCanvasToString,
  doAssert,
} from './util.js';

export default function () {
  const getData = () =>
    makeData(10, 10, (y, x) => [itoa(x).toUpperCase(), y + 1].join(''));
  const cellHeight = 25;
  const cellHalfHeight = 12;
  const rowHeaderWidth = 45;
  const setupStyles = (grid) => {
    grid.style.unhideIndicatorColor = c.y;
    grid.style.unhideIndicatorBackgroundColor = c.r;
    grid.style.rowHeaderCellBackgroundColor = c.white;
    grid.style.columnHeaderCellBackgroundColor = c.white;
    grid.style.activeRowHeaderCellBackgroundColor = c.white;
    grid.style.activeColumnHeaderCellBackgroundColor = c.white;
  };

  describe('hide/unhide column', () => {
    it('fires columnhide event', function (done) {
      const grid = g({ test: this.test, data: getData() });
      grid.addEventListener('columnhide', function (event) {
        try {
          doAssert(event.columnIndex === 0, 'columnIndex is 0');
        } catch (error) {
          done(error);
        }

        done();
      });
      grid.hideColumns(0, 1);
    });

    it('fires columnunhide event', function (done) {
      const grid = g({ test: this.test, data: getData() });
      grid.addEventListener('columnunhide', function (event) {
        try {
          doAssert(event.columnIndex === 0, 'columnIndex is 0');
        } catch (error) {
          done(error);
        }

        done();
      });
      grid.hideColumns(0, 1);
      grid.unhideColumns(0, 1);
    });
  });

  it('Should contain methods to hide columns', async function () {
    const grid = g({ test: this.test, data: getData() });
    shouldContainCell(grid, 'A1');

    grid.hideColumns(0, 1);
    await delay(15);
    shouldNotContainCell(grid, 'A1');
    shouldNotContainCell(grid, 'B1');
    shouldContainCell(grid, 'C1');
  });

  it('Should contain methods to hide rows', async function () {
    const grid = g({ test: this.test, data: getData() });
    shouldContainCell(grid, 'A1');

    grid.hideRows(0, 2);
    await delay(15);
    shouldNotContainCell(grid, 'A1');
    shouldNotContainCell(grid, 'A2');
    shouldNotContainCell(grid, 'A3');

    shouldContainCell(grid, 'A4');
  });

  it('Should not show unhide indicators by default', async function () {
    const grid = g({ test: this.test, data: getData() });
    setupStyles(grid);
    grid.style.columnHeaderCellHorizontalAlignment = 'center';
    grid.hideColumns(0, 1);
    grid.hideRows(0, 2);
    await delay(15);

    await assertColor(grid, rowHeaderWidth + 6, cellHalfHeight, c.white); // on column header
  });

  it('Should show unhide indicators for columns if `showUnhideColumnsIndicator` is true', async function () {
    const grid = g({
      test: this.test,
      data: getData(),
      showUnhideColumnsIndicator: true,
    });
    setupStyles(grid);
    grid.style.columnHeaderCellHorizontalAlignment = 'center';
    grid.hideColumns(0, 1);
    grid.hideRows(0, 2);
    await delay(15);

    await assertColor(grid, rowHeaderWidth + 6, cellHalfHeight, c.y); // on column header
    await assertColor(grid, rowHeaderWidth - 8, cellHeight + 8, c.white); // on row header
  });

  it('Should show unhide indicators for rows if `showUnhideRowsIndicator` is true', async function () {
    const grid = g({
      test: this.test,
      data: getData(),
      showUnhideRowsIndicator: true,
    });
    setupStyles(grid);
    grid.style.columnHeaderCellHorizontalAlignment = 'center';
    grid.hideColumns(0, 1);
    grid.hideRows(0, 2);
    await delay(15);

    await assertColor(grid, rowHeaderWidth + 6, cellHalfHeight, c.white); // on column header
    await assertColor(grid, rowHeaderWidth - 9, cellHeight + 7, c.y); // on row header
  });

  it('Should display unhide indicators in active mode when the cursor hovers', async function () {
    const grid = g({
      test: this.test,
      data: getData(),
      showUnhideColumnsIndicator: true,
      showUnhideRowsIndicator: true,
    });
    setupStyles(grid);
    grid.style.columnHeaderCellHorizontalAlignment = 'center';
    grid.hideColumns(0, 1);
    grid.hideRows(0, 2);

    let x, y;

    x = rowHeaderWidth + 6;
    y = cellHalfHeight;
    mousemove(window.body, x, y, grid.canvas);
    await assertColor(grid, x, y, c.y);
    await assertColor(grid, x - 6, y, c.r);
    await assertColor(grid, x + 6, y, c.r);

    x = rowHeaderWidth - 9;
    y = cellHeight + 7;
    mousemove(window.body, x, y, grid.canvas);
    await assertColor(grid, x, y, c.y);
    await assertColor(grid, x, y - 6, c.r);
    await assertColor(grid, x, y + 6, c.r);
  });

  it('Should unhide columns after the indicator is clicked', async function () {
    const grid = g({
      test: this.test,
      data: getData(),
      showUnhideColumnsIndicator: true,
      showUnhideRowsIndicator: true,
    });
    setupStyles(grid);
    grid.style.columnHeaderCellHorizontalAlignment = 'center';
    grid.hideColumns(0, 1);
    grid.hideRows(0, 2);

    let x, y;
    x = rowHeaderWidth + 6;
    y = cellHalfHeight;
    click(grid.canvas, x, y);
    shouldNotContainCell(grid, 'A1');
    shouldContainCell(grid, 'A4');

    x = rowHeaderWidth - 8;
    y = cellHeight + 8;
    click(grid.canvas, x, y);
    shouldContainCell(grid, 'A1');
  });

  function assertColor(grid, x, y, color, debugContext = false) {
    return new Promise((resolve, reject) => {
      assertPxColorFn(
        grid,
        x,
        y,
        color,
        false,
      )((err) => {
        if (err) {
          printContext();
          return reject(err);
        }
        if (debugContext) printContext();
        return setTimeout(resolve, 15);
      });
    });
    function printContext() {
      x--;
      y--;
      const w = 51;
      const h = 51;
      const dpr = ` DPR=${window.devicePixelRatio}`;
      console.error(`Color context at [${[x, y, w, h].join(', ')}]${dpr}`);
      console.error(savePartOfCanvasToString(grid, x, y, w, h));
    }
  }
}
