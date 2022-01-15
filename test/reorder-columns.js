import { mouseup, mousedown, mousemove, contextmenu, g } from './util.js';

export default function () {
  it('Hide columns by context menu item after reordering', function (done) {
    const data = [{ c1: 'c1', c2: 'c2', c3: 'c3', c4: 'c4', c5: 'c5' }];
    const schema = Object.keys(data[0]).map((name) => ({ name, width: 50 }));
    for (let i = 0; i < 3; i++) data.push(Object.assign({}, data[0]));

    const test = this.test;
    const grid = g({
      test: test,
      schema,
      data,
      showFilter: false,
    });
    const dnd = (x1, y1, x2, y2) => {
      mousemove(document.body, x1, y1, grid.canvas);
      mousedown(grid.canvas, x1, y1);
      mousemove(document.body, x2, y2, grid.canvas);
      mouseup(document.body, x2, y2, grid.canvas);
    };
    const delay = (ms = 1) => new Promise((resolve) => setTimeout(resolve, ms));
    let error;
    testFlows()
      .catch((e) => {
        error = e;
        console.error(e.message);
      })
      .then(() => done(error));

    async function testFlows() {
      let contextMenuItems = [];
      grid.addEventListener('contextmenu', function (e) {
        contextMenuItems = e.items;
      });

      grid.focus();
      // c1, c2, c3, c4, c5 => c2, c1, c3, c4, c5
      dnd(85, 15, 125, 15);
      await delay();

      contextmenu(grid.canvas, 85, 10);
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
          throw new Error(`There are column c2 after hidding first column`);
      });
    }
  });
}

/** @returns {any[]} */
function getVisibleCells(grid) {
  return grid.visibleCells.filter(
    (it) => it.style === 'cell' || it.style === 'activeCell',
  );
}
