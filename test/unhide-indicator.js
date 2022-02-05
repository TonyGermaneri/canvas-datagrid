import {
  click,
  assertPxColorFn,
  g,
  mousemove,
  mousedown,
  mouseup,
  c,
  savePartOfCanvasToString,
} from './util.js';

export default function () {
  const assert = chai.assert;
  const getData = () => [
    { A: 'Lorem', B: 'ipsum', C: 'dolor', D: 'sit', E: 'amet' },
    { A: 'consectetur', B: 'adipiscing', C: 'elit', D: 'Vivamus', E: 'sit' },
    { A: 'amet', B: 'ex', C: 'quis', D: 'metus', E: 'cursus' },
    { A: 'tincidunt', B: 'Curabitur', C: 'vitae', D: 'elit', E: 'nisi' },
    { A: 'Praesent', B: 'ultrices', C: 'tortor', D: 'id', E: 'purus' },
    { A: 'porta', B: 'pharetra', C: 'Ut', D: 'pretium', E: 'magna' },
  ];
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

  it('Should contain methods to hide columns', async function () {
    const grid = g({ test: this.test, data: getData() });
    shouldContainCell(grid, 'Lorem');

    grid.hideColumns(0, 1);
    await delay(15);
    shouldNotContainCell(grid, 'Lorem');
    shouldContainCell(grid, 'dolor');
  });

  it('Should contain methods to hide rows', async function () {
    const grid = g({ test: this.test, data: getData() });
    shouldContainCell(grid, 'Lorem');

    grid.hideRows(0, 2);
    await delay(15);
    shouldNotContainCell(grid, 'Lorem');
    shouldNotContainCell(grid, 'dolor');

    shouldContainCell(grid, 'tincidunt');
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
    await assertColor(grid, rowHeaderWidth - 8, cellHeight + 8, c.y); // on row header
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
    mousemove(document.body, x, y, grid.canvas);
    await assertColor(grid, x, y, c.y);
    await assertColor(grid, x - 6, y, c.r);
    await assertColor(grid, x + 6, y, c.r);

    x = rowHeaderWidth - 8;
    y = cellHeight + 8;
    mousemove(document.body, x, y, grid.canvas);
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
    shouldContainCell(grid, 'tincidunt');
    shouldNotContainCell(grid, 'Lorem');

    x = rowHeaderWidth - 8;
    y = cellHeight + 8;
    click(grid.canvas, x, y);
    shouldContainCell(grid, 'Lorem');
  });

  function shouldContainCell(grid, text) {
    const cell = findCell(grid, text);
    assert.ok(cell, `the grid should contain cell with text "${text}"`);
  }
  function shouldNotContainCell(grid, text) {
    const cell = findCell(grid, text);
    assert.ok(!cell, `the grid should not contain cell with text "${text}"`);
  }
  function findCell(grid, text) {
    return grid.visibleCells.find(
      (it) =>
        (it.style === 'cell' || it.style === 'activeCell') &&
        it.formattedValue === text,
    );
  }
  function delay(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
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
