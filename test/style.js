import { assertPxColor, g, smallData, c } from './util.js';

export default function () {
  it('Should set the active cell color to black.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    grid.style.activeCellBackgroundColor = c.black;
    assertPxColor(grid, 100, 32, c.black, done);
  });
}
