import { makeData, g, smallData, assertIf } from './util.js';

export default function () {
  it('Arrow down should move active cell down one', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.focus();
    ev = new Event('keydown');
    ev.key = 'ArrowDown';
    grid.controlInput.dispatchEvent(ev);
    done(
      assertIf(
        grid.activeCell.rowIndex !== 1,
        'Expected the active cell to move.',
      ),
    );
  });
  it('Arrow right should move active cell right one', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.focus();
    ev = new Event('keydown');
    ev.key = 'ArrowRight';
    grid.controlInput.dispatchEvent(ev);
    done(
      assertIf(
        grid.activeCell.columnIndex !== 1,
        'Expected the active cell to move.',
      ),
    );
  });
  it('Arrow right, then left should move active cell right one, then left one', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.focus();
    ev = new Event('keydown');
    ev.key = 'ArrowRight';
    grid.controlInput.dispatchEvent(ev);
    ev = new Event('keydown');
    ev.key = 'ArrowLeft';
    grid.controlInput.dispatchEvent(ev);
    done(
      assertIf(
        grid.activeCell.columnIndex !== 0,
        'Expected the active cell to move.',
      ),
    );
  });
  it('Arrow down, then up should move active cell down one, then up one', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.focus();
    ev = new Event('keydown');
    ev.key = 'ArrowDown';
    grid.controlInput.dispatchEvent(ev);
    ev = new Event('keydown');
    ev.key = 'ArrowUp';
    grid.controlInput.dispatchEvent(ev);
    done(
      assertIf(
        grid.activeCell.columnIndex !== 0,
        'Expected the active cell to move.',
      ),
    );
  });
  it('Shift and Arrow down should add the selection down one', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });

    grid.focus();
    grid.selectArea({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    });

    var ev = new Event('keydown');
    ev.shiftKey = true;
    ev.key = 'ArrowDown';

    grid.controlInput.dispatchEvent(ev);

    done(
      assertIf(
        grid.selectedRows.length !== 2,
        'Expected the active cell to move.',
      ),
    );
  });
  it('Shift and Arrow right should add the selection right one', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });

    grid.focus();
    grid.selectArea({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    });

    var ev = new Event('keydown');
    ev.shiftKey = true;
    ev.key = 'ArrowRight';

    grid.controlInput.dispatchEvent(ev);

    done(
      assertIf(
        grid.selectedRows.length !== 1 || grid.selections[0].col3 !== undefined,
        'Expected the active cell to move.',
      ),
    );
  });
  it('Shift and Arrow left should add the selection to the left one', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });

    grid.focus();
    grid.selectArea({
      top: 0,
      left: 1,
      bottom: 0,
      right: 1,
    });

    var ev = new Event('keydown');
    ev.shiftKey = true;
    ev.key = 'ArrowRight';

    grid.controlInput.dispatchEvent(ev);

    ev = new Event('keydown');
    ev.shiftKey = true;
    ev.key = 'ArrowLeft';

    grid.controlInput.dispatchEvent(ev);

    done(
      assertIf(
        grid.selectedRows.length !== 1 || grid.selections[0].col3 !== undefined,
        'Expected the active cell to move.',
      ),
    );
  });
  it('Shift and Arrow up should add the selection up one', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });

    grid.focus();
    grid.selectArea({
      top: 1,
      left: 0,
      bottom: 1,
      right: 0,
    });

    var ev = new Event('keydown');
    ev.shiftKey = true;
    ev.key = 'ArrowDown';

    grid.controlInput.dispatchEvent(ev);

    ev = new Event('keydown');
    ev.shiftKey = true;
    ev.key = 'ArrowUp';

    grid.controlInput.dispatchEvent(ev);

    done(
      assertIf(
        grid.selectedRows.length !== 2 || grid.selections[0].col2 !== undefined,
        'Expected the active cell to move.',
      ),
    );
  });
  it('Shift tab should behave like left arrow', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.focus();
    ev = new Event('keydown');
    ev.key = 'ArrowRight';
    grid.controlInput.dispatchEvent(ev);
    ev = new Event('keydown');
    ev.key = 'Tab';
    ev.shiftKey = true;
    grid.controlInput.dispatchEvent(ev);
    done(
      assertIf(
        grid.activeCell.columnIndex !== 0,
        'Expected the active cell to move.',
      ),
    );
  });
  it('Tab should behave like right arrow', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.focus();
    ev = new Event('keydown');
    ev.key = 'Tab';
    grid.controlInput.dispatchEvent(ev);
    done(
      assertIf(
        grid.activeCell.columnIndex !== 1,
        'Expected the active cell to move.',
      ),
    );
  });
  it('Tab should behave like right arrow', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.focus();
    ev = new Event('keydown');
    ev.key = 'Tab';
    grid.controlInput.dispatchEvent(ev);
    done(
      assertIf(
        grid.activeCell.columnIndex !== 1,
        'Expected the active cell to move.',
      ),
    );
  });
  it('Keyup and keypress', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.focus();
    grid.addEventListener('keyup', function () {
      grid.addEventListener('keypress', function () {
        done();
      });
      ev = new Event('keypress');
      grid.controlInput.dispatchEvent(ev);
    });
    ev = new Event('keyup');
    grid.controlInput.dispatchEvent(ev);
  });
  it('Page down should move down a page', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: makeData(50, 50),
      });
    grid.focus();
    ev = new Event('keydown');
    ev.key = 'PageDown';
    grid.controlInput.dispatchEvent(ev);
    done(
      assertIf(
        grid.activeCell.rowIndex === 0,
        'Expected the active cell to move.',
      ),
    );
  });
  it('Page up should move up a page', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: makeData(50, 50),
      });
    grid.focus();
    ev = new Event('keydown');
    ev.key = 'PageDown';
    grid.controlInput.dispatchEvent(ev);
    ev = new Event('keydown');
    ev.key = 'PageUp';
    grid.controlInput.dispatchEvent(ev);
    done(
      assertIf(
        grid.activeCell.rowIndex !== 0,
        'Expected the active cell to move.',
      ),
    );
  });
}
