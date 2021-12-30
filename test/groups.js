import { click, assertPxColor, g, dataForGrouping, c } from './util.js';

export default function () {
  const assert = chai.assert;
  it('Arguments for groupColumns should be existing column names.', async function () {
    const grid = g({
      test: this.test,
      data: dataForGrouping(),
    });
    assert.throws(() => {
      grid.groupColumns('col0', 'col1');
    }, /No such column name/);
  });
  it('Arguments for groupRows should be existing row indexes.', async function () {
    const grid = g({
      test: this.test,
      data: dataForGrouping(),
    });
    assert.throws(() => {
      grid.groupRows(-1, 5);
    }, /No such row/);
  });

  it('Should draw group area and trigger event. (columns)', async function () {
    const grid = g({
      test: this.test,
      data: dataForGrouping(),
    });
    grid.style.groupingAreaBackgroundColor = c.y;
    await assertColor(grid, 1, 1, grid.style.cornerCellBackgroundColor);

    let listener;
    listener = (ev) =>
      assert.deepEqual(ev.group, { type: 'columns', from: 0, to: 2 });
    grid.addEventListener('aftercreategroup', listener);
    grid.groupColumns('name', 'sex');
    grid.removeEventListener('aftercreategroup', listener);
    await assertColor(grid, 1, 1, c.y);
    await assertColor(
      grid,
      1,
      1 + 25 + 3,
      grid.style.cornerCellBackgroundColor,
    );

    listener = (ev) =>
      assert.deepEqual(ev.error.message, "Can't group these columns");
    grid.addEventListener('aftercreategroup', listener);
    grid.groupColumns('age', 'weight');
    grid.removeEventListener('aftercreategroup', listener);
    await assertColor(grid, 1, 1, c.y);
    await assertColor(
      grid,
      1,
      1 + 25 + 3,
      grid.style.cornerCellBackgroundColor,
    );

    listener = (ev) =>
      assert.deepEqual(ev.group, { type: 'columns', from: 0, to: 3 });
    grid.addEventListener('aftercreategroup', listener);
    grid.groupColumns('name', 'weight');
    grid.removeEventListener('aftercreategroup', listener);
    await assertColor(grid, 1, 1, c.y);
    await assertColor(grid, 1, 1 + 25 + 1, c.y);
    await assertColor(
      grid,
      1,
      1 + 25 + 25 + 3,
      grid.style.cornerCellBackgroundColor,
    );
  });

  it('Should draw group area and trigger event. (rows)', async function () {
    const grid = g({
      test: this.test,
      data: dataForGrouping(),
    });
    grid.style.groupingAreaBackgroundColor = c.y;
    await assertColor(grid, 1, 1, grid.style.cornerCellBackgroundColor);

    let listener;
    listener = (ev) =>
      assert.deepEqual(ev.group, { type: 'rows', from: 0, to: 2 });
    grid.addEventListener('aftercreategroup', listener);
    grid.groupRows(0, 2);
    grid.removeEventListener('aftercreategroup', listener);
    await assertColor(grid, 1, 1, c.y);
    await assertColor(
      grid,
      1 + 25 + 3,
      1,
      grid.style.cornerCellBackgroundColor,
    );

    listener = (ev) =>
      assert.deepEqual(ev.error.message, "Can't group these rows");
    grid.addEventListener('aftercreategroup', listener);
    grid.groupRows(1, 3);
    grid.removeEventListener('aftercreategroup', listener);
    await assertColor(grid, 1, 1, c.y);
    await assertColor(
      grid,
      1 + 25 + 3,
      1,
      grid.style.cornerCellBackgroundColor,
    );

    listener = (ev) =>
      assert.deepEqual(ev.group, { type: 'rows', from: 0, to: 3 });
    grid.addEventListener('aftercreategroup', listener);
    grid.groupRows(0, 3);
    grid.removeEventListener('aftercreategroup', listener);
    await assertColor(grid, 1, 1, c.y);
    await assertColor(grid, 1 + 25 + 1, 1, c.y);
    await assertColor(
      grid,
      1 + 25 + 25 + 3,
      1,
      grid.style.cornerCellBackgroundColor,
    );
  });

  it('Click group lines/indicators to toggle group state. (columns)', async function () {
    const grid = g({
      test: this.test,
      data: dataForGrouping(),
    });

    let x, y;
    const cc = grid.visibleCells.find((it) => it.style === 'cornerCell');
    const ccw = cc.width;
    const cch = cc.height;

    let cells;
    let cellsLength = grid.visibleCells.length;

    grid.groupColumns('name', 'sex');
    grid.groupColumns('name', 'weight');

    x = ccw + 1;
    y = 12;
    // collapse all
    click(grid.canvas, x, y);
    cells = getVisibleCells(grid);
    assert.deepEqual(cells.length, 0);

    // expand all
    x -= 12;
    click(grid.canvas, x, y);
    assert.deepEqual(
      grid.visibleCells.length,
      cellsLength,
      'visible cells after expand all',
    );

    // collapse column name to column sex;
    x += 12;
    y = 25 + 12;
    click(grid.canvas, x, y);
    cells = grid.visibleCells.filter((it) => it.style === 'cell');
    // only column weight
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      assert.deepEqual(cell.header.name, 'weight');
    }

    click(grid.canvas, x, y);
    assert.deepEqual(
      grid.visibleCells.length,
      cellsLength,
      'visible cells after expand all',
    );
  });

  it('Click group lines/indicators to toggle group state. (rows)', async function () {
    const grid = g({
      test: this.test,
      data: dataForGrouping(),
    });

    let x, y;
    const cc = grid.visibleCells.find((it) => it.style === 'cornerCell');
    const ccw = cc.width;
    const cch = cc.height;

    let cells;
    let cellsLength = grid.visibleCells.length;

    grid.groupRows(1, 2);
    grid.groupRows(1, 3);

    x = 12;
    y = cch + 1 + 25;
    // collapse
    click(grid.canvas, x, y);
    cells = getVisibleCells(grid);
    assert.deepEqual(cells.length, 2);

    // expand
    x -= 12;
    click(grid.canvas, x, y);
    assert.deepEqual(
      grid.visibleCells.length,
      cellsLength,
      'visible cells after expand all',
    );
    // debugger
  });

  function getVisibleCells(grid) {
    return grid.visibleCells.filter(
      (it) => it.style === 'cell' || it.style === 'activeCell',
    );
  }
  function assertColor(grid, x, y, color) {
    return new Promise((resolve, reject) => {
      assertPxColor(grid, x, y, color, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }
}
