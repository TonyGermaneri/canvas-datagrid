import { SelectionType } from '../lib/selections/util.js';
import { makeData, g, smallData, assertIf, doAssert } from './util.js';

export default function () {
  it('Changing active cell should fire an event', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: smallData(),
      });
    grid.focus();
    ev = new Event('keydown');
    ev.key = 'ArrowRight';
    var columnIndex = null;
    var rowIndex = null;
    var calls = 0;
    grid.addEventListener("activecellchanged", function (e) {
      calls += 1;
      columnIndex = e.cell.columnIndex;
      rowIndex = e.cell.rowIndex;
    });
    var previousActiveCell = grid.activeCell;
    grid.controlInput.dispatchEvent(ev);
    grid.controlInput.dispatchEvent(ev);    
    try {
      doAssert(previousActiveCell.columnIndex === 0, 'Expected proper columnIndex before move.');
      doAssert(previousActiveCell.rowIndex === 0, 'Expected proper rowIndex before move.');

      doAssert(calls === 2, 'Expected to receive 2 events.');
      doAssert(columnIndex === 2, 'Expected an event with proper columnIndex.');
      doAssert(rowIndex === 0, 'Expected an event with proper rowIndex.');

      doAssert(grid.activeCell.columnIndex === 2, 'Expected proper columnIndex after move.');
      doAssert(grid.activeCell.rowIndex === 0, 'Expected proper rowIndex after move.');
    }
    catch (error) {
      return done(error);
    }
    done();
  });
}
