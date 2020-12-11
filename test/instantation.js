import { assertPxColor, g, smallData, assertIf, c } from './util.js';

export default function () {
  it('Should be callable without arguments.', function (done) {
    canvasDatagrid();
    done();
  });
  it('Should create an instance of datagrid', function (done) {
    var grid = g({ test: this.test });
    assertIf(!grid, 'Expected a grid instance, instead got something false');
    grid.style.gridBackgroundColor = c.y;
    assertPxColor(grid, 80, 32, c.y, done);
  });
  it('Should create, then completely annihilate the grid.', function (done) {
    var grid = g({ test: this.test });
    grid.dispose();
    done(
      assertIf(!grid.parentNode, 'Expected to see the grid gone, it is not.'),
    );
  });
  it('Should create a grid and set data, data should be visible.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    grid.style.activeCellBackgroundColor = c.b;
    assertIf(grid.data.length !== 3, 'Expected to see data in the interface.');
    assertPxColor(grid, 80, 32, c.b, done);
  });
}
