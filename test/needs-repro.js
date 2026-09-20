import {
  g,
  smallData,
  makeData,
  doAssert,
  keydown,
  mousedown,
  mouseup,
  mousemove,
  click,
  delay,
} from './util.js';

// Phase 4 of the 2026-09 backlog plan: reports that could not be confirmed
// or refuted from source alone. Each test states the expected behaviour;
// a passing test means the report is fixed or invalid on master.
export default function () {
  it('#506: pasting a single cell targets the clicked cell when an earlier column is hidden', async function () {
    const grid = g({
      test: this.test,
      data: [
        { c1: 'a', c2: 'b', c3: 'c' },
        { c1: 'd', c2: 'e', c3: 'f' },
      ],
    });
    grid.hideColumns(0);
    grid.draw();
    grid.focus();
    // click the first visible data cell of row 0 (c2, since c1 is hidden)
    const headerWidth = grid.sizes.columns[-1] || 50;
    mousemove(window, headerWidth + 10, 36, grid.canvas);
    mousedown(grid.canvas, headerWidth + 10, 36);
    mouseup(grid.canvas, headerWidth + 10, 36);
    click(grid.canvas, headerWidth + 10, 36);
    grid.paste({
      clipboardData: {
        items: [
          { type: 'text/plain', getAsString: (callback) => callback('Z') },
        ],
      },
    });
    await delay(10);
    doAssert(
      grid.data[0].c2 === 'Z' && grid.data[0].c3 === 'c',
      'Expected the paste to land in c2, got ' + JSON.stringify(grid.data[0]),
    );
  });

  it('#98: height auto with a horizontal scroll bar does not add a vertical scroll bar', async function () {
    const grid = g({
      test: this.test,
      data: makeData(5, 8),
      style: { cellWidth: 120 },
    });
    grid.style.width = '300px';
    grid.style.height = 'auto';
    await delay(50);
    doAssert(grid.scrollWidth > 0, 'Expected horizontal overflow');
    doAssert(
      grid.scrollHeight <= 0,
      'Expected no vertical scrolling in auto height mode, scrollHeight is ' +
        grid.scrollHeight,
    );
  });

  it('#253: gotoCell scrolls the target column and row into view', function () {
    const grid = g({
      test: this.test,
      data: makeData(100, 30),
      style: { cellWidth: 100 },
    });
    grid.gotoCell(25, 80);
    const rect = grid.scrollIndexRect;
    doAssert(
      rect.left <= 25 && rect.right >= 25,
      'Expected column 25 in view, columns in view are ' +
        rect.left +
        '-' +
        rect.right,
    );
    doAssert(
      rect.top <= 80 && rect.bottom >= 80,
      'Expected row 80 in view, rows in view are ' +
        rect.top +
        '-' +
        rect.bottom,
    );
  });

  it('#228: arrow keys move the active cell back to the first row and scroll to the top', function () {
    const grid = g({ test: this.test, data: makeData(100, 3) });
    grid.focus();
    grid.scrollTop = 240;
    grid.setActiveCell(0, 12);
    for (let i = 0; i < 12; i++) {
      keydown(grid.controlInput, 'ArrowUp');
    }
    doAssert(grid.activeCell.rowIndex === 0, 'Expected row 0 to be active');
    doAssert(
      grid.scrollIndexRect.top === 0 && grid.scrollTop === 0,
      'Expected the grid to be scrolled to the top, top row is ' +
        grid.scrollIndexRect.top +
        ', scrollTop ' +
        grid.scrollTop,
    );
  });

  it('#116: columnOrder survives setting new data with the same schema', function () {
    const schema = [{ name: 'col1' }, { name: 'col2' }, { name: 'col3' }];
    const grid = g({ test: this.test, data: smallData(), schema });
    grid.columnOrder = [2, 1, 0];
    grid.data = smallData().reverse();
    doAssert(
      JSON.stringify(grid.columnOrder) === '[2,1,0]',
      'Expected the column order to survive, got ' +
        JSON.stringify(grid.columnOrder),
    );
  });

  it('#127: editing a cell with non-Latin text works', function () {
    const grid = g({ test: this.test, data: smallData() });
    grid.focus();
    grid.beginEditAt(0, 0);
    grid.input.value = 'Спартак чемпион! 日本語';
    grid.endEdit();
    grid.draw();
    doAssert(
      grid.data[0].col1 === 'Спартак чемпион! 日本語',
      'Expected the value to be stored, got ' + grid.data[0].col1,
    );
  });

  it('#272: getCellAt over a frozen row returns the frozen row, not the row underneath', function () {
    const grid = g({
      test: this.test,
      data: makeData(100, 3),
      allowFreezingRows: true,
    });
    grid.draw();
    grid.frozenRow = 2;
    grid.scrollTop = 480;
    grid.draw();
    const cell = grid.getCellAt(100, 36);
    doAssert(
      cell && cell.rowIndex === 0,
      'Expected frozen row 0 under the pointer, got row ' +
        (cell && cell.rowIndex),
    );
  });

  it('#313: the edit input follows the grid when it scrolls', async function () {
    const grid = g({ test: this.test, data: makeData(100, 3) });
    grid.focus();
    grid.beginEditAt(0, 5);
    await delay(30); // let the scroll-into-view settle (row 5 is now at the top)
    const before = parseFloat(grid.input.style.top);
    grid.scrollTop = grid.scrollTop - 48; // scroll up: the edited row moves down
    await delay(50);
    if (!grid.input) return; // closing the editor on scroll is acceptable too
    const after = parseFloat(grid.input.style.top);
    doAssert(
      Math.abs(after - before - 48) <= 2,
      'Expected the input to move down by 48px, it moved by ' +
        (after - before),
    );
  });

  it('#254: an auto-height grid with thousands of rows stays within the canvas size limit and scrolls', async function () {
    const grid = g({ test: this.test, data: makeData(1000, 3) });
    grid.style.height = 'auto';
    await delay(50);
    doAssert(
      grid.canvas.offsetHeight <= 16384,
      'Expected the canvas to be capped, height is ' + grid.canvas.offsetHeight,
    );
    doAssert(
      grid.scrollHeight > 0,
      'Expected the remaining rows to be reachable by scrolling',
    );
  });

  it('#248: overflowX and overflowY hidden hide the scroll bars', function () {
    const grid = g({
      test: this.test,
      data: makeData(100, 30),
      style: { cellWidth: 100, overflowX: 'hidden', overflowY: 'hidden' },
    });
    grid.draw();
    const bottom = grid.getCellAt(
      grid.canvas.offsetWidth / 2,
      grid.canvas.offsetHeight - 5,
    );
    const right = grid.getCellAt(
      grid.canvas.offsetWidth - 5,
      grid.canvas.offsetHeight / 2,
    );
    doAssert(
      !/horizontal-scroll/.test(bottom.context || '') &&
        !/vertical-scroll/.test(right.context || ''),
      'Expected no scroll bars, got ' + bottom.context + ' / ' + right.context,
    );
  });
}
