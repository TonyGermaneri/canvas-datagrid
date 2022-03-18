import { mouseup, mousedown, mousemove, contextmenu, g, marker, click, dblclick } from './util.js';

export default function () {
  it('Hide columns by context menu item after reordering', async function () {
    const baseWidth = 60;
    const halfBaseWidth = baseWidth * 0.5;
    const data = [{ c1: 'c1', c2: 'c2', c3: 'c3', c4: 'c4', c5: 'c5' }];
    const schema = Object.keys(data[0]).map((name) => ({ name, width: baseWidth }));
    for (let i = 0; i < 3; i++) data.push(Object.assign({}, data[0]));

    const test = this.test;
    const grid = g({
      test: test,
      schema,
      data,
      allowRowReordering: true,
      showFilter: false,
    });
    const headerWidth = grid.sizes.columns[-1] || baseWidth;

    const dnd = (x1, y1, x2, y2) => {
      mousemove(window, x1, y1, grid.canvas);
      mousedown(grid.canvas, x1, y1);
      mousemove(window, x2, y2, grid.canvas);
      mouseup(window, x2, y2, grid.canvas);
    };
    let contextMenuItems = [];
    grid.addEventListener('contextmenu', function (e) {
      contextMenuItems = e.items;
    });

    grid.focus();
    // c1, c2, c3, c4, c5 => c2, c1, c3, c4, c5
    dnd(headerWidth + halfBaseWidth, 10, headerWidth + baseWidth + halfBaseWidth, 10);
    await delay();

    grid.selectColumn(0);
    grid.draw();
    await delay();
    contextmenu(grid.canvas, headerWidth + halfBaseWidth, 10);
    await delay();

    const hideColumnItem = contextMenuItems.find((it) =>
      it.title.startsWith('Hide '),
    );
    if (!hideColumnItem) throw new Error(`No menu item for hidding column`);
    hideColumnItem.click(new Event('keyup'));
    await delay(30);

    const cells = getVisibleCells(grid);
    cells.forEach((it) => {
      if (it.header.name === 'c2')
        throw new Error(`There is column c2 after hidding first column`);
    });
  });
}

function delay(ms = 1) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** @returns {any[]} */
function getVisibleCells(grid) {
  return grid.visibleCells.filter(
    (it) => it.style === 'cell' || it.style === 'activeCell',
  );
}
