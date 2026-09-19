import {
  g,
  smallData,
  doAssert,
  de,
  keydown,
  mousedown,
  mousemove,
  mouseup,
  contextmenu,
  click,
  delay,
} from './util.js';

function dataCell(grid, rowIndex, columnIndex) {
  // the active cell is drawn with style 'activeCell', so match on isNormal
  return grid.visibleCells.find(
    (cell) =>
      cell.isNormal &&
      cell.rowIndex === rowIndex &&
      cell.columnIndex === columnIndex,
  );
}

function contextMenuItemTitles() {
  return Array.from(
    document.querySelectorAll('.canvas-datagrid-context-menu-item'),
  ).map((el) => el.textContent.trim());
}

function fakeClipboardEvent() {
  return {
    clipboardData: {
      setData: function () {},
      getData: function () {
        return '';
      },
    },
    preventDefault: function () {},
  };
}

// One regression test per GitHub issue. The issue number is in the title so
// a failure points straight at the report.
export default function () {
  it('#587/#458: Delete and Backspace do not clear data when editable is false', function () {
    const readOnly = g({
      test: this.test,
      data: smallData(),
      editable: false,
      selectionMode: 'row',
    });
    readOnly.focus();
    readOnly.selectRow(0);
    keydown(readOnly.controlInput, 'Delete');
    keydown(readOnly.controlInput, 'Backspace');
    doAssert(
      readOnly.data[0].col1 === 'foo' && readOnly.data[0].col2 === 0,
      'Row data must not be cleared on a read-only grid',
    );

    // control: the same keys do clear an editable grid
    const editable = g({
      test: this.test,
      data: smallData(),
      selectionMode: 'row',
    });
    editable.focus();
    editable.selectRow(0);
    keydown(editable.controlInput, 'Delete');
    doAssert(
      editable.data[0].col1 === '',
      'Delete should clear the selected row on an editable grid',
    );
  });

  it('#587: cut on a read-only grid leaves the data intact', function () {
    const grid = g({ test: this.test, data: smallData(), editable: false });
    grid.focus();
    grid.selectArea({ top: 0, left: 0, bottom: 0, right: 0 });
    grid.cut(fakeClipboardEvent());
    doAssert(grid.data[0].col1 === 'foo', 'cut must not clear read-only data');
  });

  it('#583: deleting the edited row in beforeendedit does not re-add it', function () {
    const grid = g({ test: this.test, data: smallData() });
    grid.focus();
    grid.beginEditAt(0, 2);
    grid.input.value = 'changed';
    grid.addEventListener('beforeendedit', function () {
      grid.deleteRow(2);
    });
    grid.endEdit();
    doAssert(
      grid.data.length === 2,
      'Expected 2 rows after deleting the edited row, got ' + grid.data.length,
    );
  });

  it('#444: treeGridAttributes are applied to child tree grids', function (done) {
    const grid = g({
      test: this.test,
      data: smallData(),
      tree: true,
      treeGridAttributes: { editable: false, showNewRow: true },
    });
    grid.addEventListener('expandtree', function (e) {
      try {
        doAssert(
          e.treeGrid.attributes.editable === false,
          'treeGridAttributes.editable was not applied',
        );
        doAssert(
          e.treeGrid.attributes.showNewRow === true,
          'treeGridAttributes.showNewRow was not applied',
        );
      } catch (err) {
        return done(err);
      }
      done();
    });
    grid.expandTree(0);
  });

  it('#448: getColumnWidth and getRowHeight are public methods', function () {
    const grid = g({ test: this.test, data: smallData() });
    doAssert(
      typeof grid.getColumnWidth === 'function',
      'getColumnWidth missing',
    );
    doAssert(typeof grid.getRowHeight === 'function', 'getRowHeight missing');
    doAssert(
      grid.getColumnWidth(0) > 0,
      'getColumnWidth(0) should be positive',
    );
    doAssert(grid.getRowHeight(0) > 0, 'getRowHeight(0) should be positive');
  });

  it('#193: fitColumnToValues() without a name fits every column and never throws', function () {
    const grid = g({ test: this.test, data: smallData() });
    grid.fitColumnToValues();
    grid.fitColumnToValues('no-such-column');
    doAssert(
      [0, 1, 2].every((i) => typeof grid.sizes.columns[i] === 'number'),
      'Expected every column to receive a fitted width',
    );
  });

  it('#160: setting columnOrder redraws the grid', function () {
    const grid = g({ test: this.test, data: smallData() });
    grid.draw();
    grid.columnOrder = [2, 1, 0];
    const headers = grid.visibleCells
      .filter((cell) => cell.isColumnHeader)
      .sort((a, b) => a.x - b.x);
    doAssert(
      headers[0].header.name === 'col3',
      'Expected a redraw with col3 first, first header is ' +
        headers[0].header.name,
    );
  });

  it('#530: bottom vertical alignment places the baseline on the bottom padding', function () {
    const grid = g({
      test: this.test,
      data: smallData(),
      style: { cellVerticalAlignment: 'bottom', cellHeight: 40 },
    });
    grid.draw();
    // (0,0) is the active cell and uses activeCellVerticalAlignment; use (1,1)
    const cell = dataCell(grid, 1, 1);
    const line = cell.text.lines[0];
    const expected = cell.y + cell.height - cell.paddingBottom;
    doAssert(
      Math.abs(line.y - expected) < 1,
      'Expected baseline at ' + expected + ', got ' + line.y,
    );
  });

  it('#503: resizerow always carries height, rowIndex and the legacy aliases', function (done) {
    const grid = g({
      test: this.test,
      data: smallData(),
      style: { cellWidth: 50 },
    });
    const events = [];
    grid.addEventListener('resizerow', function (e) {
      events.push(e);
    });
    setTimeout(function () {
      grid.focus();
      mousemove(window, 10, 48, grid.canvas);
      mousedown(grid.canvas, 10, 48);
      mousemove(window, 10, 100, grid.canvas);
      mouseup(window, 10, 100, grid.canvas);
      try {
        doAssert(events.length > 0, 'Expected resizerow events');
        events.forEach(function (e) {
          doAssert(typeof e.height === 'number', 'height missing');
          doAssert(e.rowIndex === 0, 'rowIndex missing, got ' + e.rowIndex);
          doAssert(
            e.cellHeight === e.height && e.row === e.height,
            'legacy aliases cellHeight/row must equal height',
          );
        });
      } catch (err) {
        return done(err);
      }
      done();
    }, 1);
  });

  it('#431: the number filter matches numeric cell values', function () {
    const grid = g({
      test: this.test,
      data: [{ n: 1 }, { n: 2 }, { n: 3 }],
      schema: [{ name: 'n', type: 'number' }],
    });
    grid.setFilter('n', '2');
    doAssert(
      grid.viewData.length === 1 && grid.viewData[0].n === 2,
      'Expected one row with n === 2, got ' + JSON.stringify(grid.viewData),
    );
  });

  it('#460: rendertext lines without a width still lay out when right-aligned', function () {
    const grid = g({
      test: this.test,
      data: smallData(),
      style: { cellHorizontalAlignment: 'right' },
    });
    grid.addEventListener('rendertext', function (e) {
      if (e.cell.isNormal) {
        e.cell.text = { lines: [{ value: '%' + e.cell.value }] };
      }
    });
    grid.draw();
    const cell = dataCell(grid, 0, 0);
    const line = cell.text.lines[0];
    doAssert(Number.isFinite(line.x), 'line.x is ' + line.x);
    doAssert(Number.isFinite(line.y), 'line.y is ' + line.y);
    doAssert(line.x > cell.x, 'right-aligned text must start inside the cell');
  });

  it('#263: assigning a new array to e.items in the contextmenu event replaces the menu', async function () {
    const grid = g({ test: this.test, data: smallData() });
    grid.addEventListener('contextmenu', function (e) {
      e.items = [{ title: 'Only item' }];
    });
    grid.focus();
    // other tests may leave their menus in the document; only count new items
    const before = contextMenuItemTitles().length;
    contextmenu(grid.canvas, 60, 37);
    await delay(20);
    const titles = contextMenuItemTitles().slice(before);
    grid.disposeContextMenu();
    doAssert(
      titles.length === 1 && titles[0] === 'Only item',
      'Expected exactly the replaced item, got ' + JSON.stringify(titles),
    );
  });

  it('#418: grid.changes is keyed by the bound row index, not the view index', function () {
    const grid = g({ test: this.test, data: smallData() });
    grid.order('col1', 'desc'); // view order: foo, baz, bar
    grid.beginEditAt(0, 1); // "baz", bound index 2
    grid.input.value = 'edited';
    grid.endEdit();
    doAssert(
      grid.changes[2] && grid.changes[2].col1 === 'edited',
      'Expected changes[2] for "baz", got ' + JSON.stringify(grid.changes),
    );
    doAssert(grid.changes[1] === undefined, 'The view index must not be used');
  });

  it('#226: scrollIndexRect is fully populated', function () {
    const grid = g({ test: this.test, data: smallData() });
    const rect = grid.scrollIndexRect;
    ['top', 'bottom', 'left', 'right'].forEach(function (key) {
      doAssert(typeof rect[key] === 'number', key + ' is ' + rect[key]);
    });
  });

  it('#554: a touch sequence without a starting cell does not throw', function () {
    const grid = g({ test: this.test, data: smallData() });
    grid.draw();
    de(grid.canvas, 'touchstart', {
      touches: [{ clientX: 10, clientY: 10 }],
      changedTouches: [],
    });
    de(document.body, 'touchmove', {
      touches: [{ clientX: 20, clientY: 20 }],
      changedTouches: [],
    });
    de(document.body, 'touchend', { touches: [], changedTouches: [] });
  });

  it('#566: copy with an active cell but no selection does not throw', function () {
    const grid = g({ test: this.test, data: smallData() });
    grid.focus();
    grid.setActiveCell(1, 1);
    grid.selectNone();
    grid.copy(fakeClipboardEvent());
  });

  it('#256: string sorting keeps blanks and numbers in a consistent order', function () {
    const grid = g({
      test: this.test,
      data: [{ a: 'b' }, { a: 2 }, { a: 'a' }, { a: null }],
    });
    grid.order('a', 'asc');
    const asc = grid.viewData.map((r) => r.a);
    doAssert(
      JSON.stringify(asc) === JSON.stringify([null, 2, 'a', 'b']),
      'ascending order was ' + JSON.stringify(asc),
    );
    grid.order('a', 'desc');
    const desc = grid.viewData.map((r) => r.a);
    doAssert(
      JSON.stringify(desc) === JSON.stringify(['b', 'a', 2, null]),
      'descending order was ' + JSON.stringify(desc),
    );
  });

  it('#215: filters stay applied when data is replaced', function () {
    const grid = g({ test: this.test, data: [{ a: 'x' }, { a: 'y' }] });
    grid.setFilter('a', 'x');
    grid.data = [{ a: 'x' }, { a: 'y' }, { a: 'x' }];
    doAssert(
      grid.viewData.length === 2 && grid.viewData.every((r) => r.a === 'x'),
      'Expected the filter to apply to the new data, got ' +
        JSON.stringify(grid.viewData),
    );
  });

  it('#241: rows hidden by a filter reappear after appending data and clearing it', function () {
    const grid = g({ test: this.test, data: [{ a: 'x' }, { a: 'y' }] });
    grid.setFilter('a', 'x');
    grid.data = grid.data.concat([{ a: 'z' }]);
    grid.setFilter();
    doAssert(
      grid.viewData.length === 3,
      'Expected 3 rows after clearing the filter, got ' + grid.viewData.length,
    );
  });
  it('#514: columns can be reordered while allowRowReordering is false, and a header click still sorts', async function () {
    const baseWidth = 60;
    const data = [{ c1: 'c1', c2: 'c2', c3: 'c3' }];
    const schema = Object.keys(data[0]).map((name) => ({
      name,
      width: baseWidth,
    }));
    const grid = g({
      test: this.test,
      schema,
      data,
      allowColumnReordering: true,
      allowRowReordering: false,
      showFilter: false,
    });
    grid.focus();
    const headerWidth = grid.sizes.columns[-1] || baseWidth;
    // a plain click on a header (also a reorder grab zone) sorts
    click(grid.canvas, headerWidth + 30, 10);
    await delay();
    doAssert(
      grid.orderBy === 'c1',
      'Expected a header click to sort by c1, orderBy is ' + grid.orderBy,
    );
    // drag the c1 header onto c2
    mousemove(window, headerWidth + 30, 10, grid.canvas);
    mousedown(grid.canvas, headerWidth + 30, 10);
    mousemove(window, headerWidth + baseWidth + 30, 10, grid.canvas);
    mouseup(window, headerWidth + baseWidth + 30, 10, grid.canvas);
    await delay();
    const headers = grid.visibleCells
      .filter((cell) => cell.isColumnHeader)
      .sort((a, b) => a.x - b.x)
      .map((cell) => cell.header.name);
    doAssert(
      headers[0] === 'c2' && headers[1] === 'c1',
      'Expected c2, c1, c3 after reordering, got ' + headers.join(','),
    );
  });

  it('#472: singleSelectionMode limits drag, ctrl-click and shift-click to one row', function () {
    const grid = g({
      test: this.test,
      data: smallData(),
      selectionMode: 'row',
      singleSelectionMode: true,
    });
    grid.focus();
    const selectedRowCount = () => grid.selectedRows.filter(Boolean).length;
    // drag from row 0 to row 2
    mousemove(window, 100, 36, grid.canvas);
    mousedown(grid.canvas, 100, 36);
    mousemove(window, 100, 84, grid.canvas);
    mouseup(window, 100, 84, grid.canvas);
    doAssert(
      selectedRowCount() === 1,
      'Expected one selected row after a drag, got ' + selectedRowCount(),
    );
    // ctrl-click another row
    const p = grid.canvas.getBoundingClientRect();
    de(grid.canvas, 'mousedown', {
      clientX: 100 + p.left,
      clientY: 36 + p.top,
      ctrlKey: true,
    });
    de(window, 'mouseup', {
      clientX: 100 + p.left,
      clientY: 36 + p.top,
      ctrlKey: true,
    });
    doAssert(
      selectedRowCount() === 1,
      'Expected one selected row after ctrl-click, got ' + selectedRowCount(),
    );
    // shift-click another row
    de(grid.canvas, 'mousedown', {
      clientX: 100 + p.left,
      clientY: 84 + p.top,
      shiftKey: true,
    });
    de(window, 'mouseup', {
      clientX: 100 + p.left,
      clientY: 84 + p.top,
      shiftKey: true,
    });
    doAssert(
      selectedRowCount() === 1,
      'Expected one selected row after shift-click, got ' + selectedRowCount(),
    );
  });

  it('#473: allowColumnSelection false keeps the row selection when a header is clicked to sort', async function () {
    const grid = g({
      test: this.test,
      data: smallData(),
      selectionMode: 'row',
      allowColumnSelection: false,
    });
    grid.focus();
    grid.selectRow(1);
    mousemove(window, 100, 10, grid.canvas);
    mousedown(grid.canvas, 100, 10);
    mouseup(grid.canvas, 100, 10);
    click(grid.canvas, 100, 10);
    await delay();
    doAssert(grid.orderBy === 'col1', 'Expected the click to sort by col1');
    const selectedRowCount = grid.selectedRows.filter(Boolean).length;
    doAssert(
      selectedRowCount === 1,
      'Expected the single row selection to survive, got ' + selectedRowCount,
    );
  });

  it('#338/#455: dispose removes the control input and is idempotent', function () {
    const countInputs = () =>
      document.querySelectorAll('.canvas-datagrid-control-input').length;
    const before = countInputs();
    const grid = g({ test: this.test, data: smallData() });
    doAssert(countInputs() === before + 1, 'Expected one new control input');
    grid.dispose();
    doAssert(countInputs() === before, 'dispose must remove the control input');
    grid.dispose();
    doAssert(countInputs() === before, 'a second dispose must be a no-op');
  });

  it('#289: the grid follows its parent element size without an explicit resize()', async function () {
    const grid = g({ test: this.test, data: smallData() });
    const container = grid.parentNode;
    container.style.width = '333px';
    await delay(100);
    doAssert(
      Math.abs(grid.canvas.offsetWidth - 333) <= 2,
      'Expected the grid to resize to 333px, width is ' +
        grid.canvas.offsetWidth,
    );
    container.style.width = '444px';
    await delay(100);
    doAssert(
      Math.abs(grid.canvas.offsetWidth - 444) <= 2,
      'Expected the grid to resize to 444px, width is ' +
        grid.canvas.offsetWidth,
    );
  });

  it('#250/#512: datachanged fires with a source for edits and pastes', async function () {
    const grid = g({ test: this.test, data: smallData() });
    const events = [];
    grid.addEventListener('datachanged', (e) => events.push(e));
    grid.focus();
    grid.beginEditAt(0, 0);
    grid.input.value = 'edited';
    grid.endEdit();
    doAssert(
      events.length === 1 &&
        events[0].source === 'edit' &&
        events[0].value === 'edited',
      'Expected one datachanged with source edit, got ' +
        JSON.stringify(events.map((e) => e.source)),
    );
    let pasted;
    grid.addEventListener('afterpaste', (e) => (pasted = e));
    grid.setActiveCell(1, 1);
    grid.selectArea({ top: 1, left: 1, bottom: 1, right: 1 });
    grid.paste({
      clipboardData: {
        items: [
          {
            type: 'text/plain',
            getAsString: (callback) => callback('99'),
          },
        ],
      },
    });
    await delay(10);
    doAssert(
      pasted && pasted.cells.length === 1 && pasted.cells[0][4] === '99',
      'Expected afterpaste cells to carry the pasted value (#549), got ' +
        JSON.stringify(pasted && pasted.cells),
    );
    doAssert(
      events.some((e) => e.source === 'paste'),
      'Expected a datachanged event with source paste',
    );
  });

  it('#157: CSS font shorthand with a weight is honoured', function () {
    const grid = g({
      test: this.test,
      data: smallData(),
      style: { cellFont: 'bold 20px sans-serif' },
    });
    let font;
    grid.addEventListener('rendertext', (e) => {
      if (e.cell.isNormal && e.cell.rowIndex === 1) font = e.ctx.font;
    });
    grid.draw();
    const cell = dataCell(grid, 1, 1);
    doAssert(
      cell.fontHeight === 20,
      'fontHeight should be 20, got ' + cell.fontHeight,
    );
    doAssert(
      typeof font === 'string' && /^bold 20px/.test(font),
      'Expected the canvas font to start with "bold 20px", got ' + font,
    );
  });

  it('#521: a ctrl-click right after opening the context menu does not close it', async function () {
    const grid = g({ test: this.test, data: smallData() });
    grid.focus();
    const before = contextMenuItemTitles().length;
    contextmenu(grid.canvas, 60, 37);
    await delay(20);
    doAssert(contextMenuItemTitles().length > before, 'menu should be open');
    de(document, 'click', { ctrlKey: true, clientX: 0, clientY: 0 });
    doAssert(
      contextMenuItemTitles().length > before,
      'a ctrl-click immediately after opening must not close the menu',
    );
    grid.disposeContextMenu();
    await delay(150); // hide animation
    doAssert(
      contextMenuItemTitles().length === before,
      'menu should be closed',
    );
  });
}
