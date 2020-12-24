import {
  mouseup,
  mousedown,
  mousemove,
  assertPxColor,
  g,
  smallData,
  c,
} from './util.js';

export default function () {
  it('Should draw row selections.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      selectionMode: 'row',
      style: {
        activeCellSelectedBackgroundColor: c.b,
        cellSelectedBackgroundColor: c.b,
      },
    });
    mousemove(grid.canvas, 45, 37);
    mousedown(grid.canvas, 45, 37);
    mouseup(grid.canvas, 45, 37);
    mousemove(grid.canvas, 45, 37);
    setTimeout(function () {
      assertPxColor(grid, 80, 37, c.b, done);
    }, 1);
  });
  it('Should draw a debug message.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      debug: true,
      style: {
        debugFont: '200px sans-serif',
        debugColor: c.b,
      },
    });
    mousemove(grid.canvas, 100, 113);
    assertPxColor(grid, 90, 10, c.b, done);
  });
  // phantom throws a nonsense error due to the way the data url is constructed in the html function
  it('Should draw HTML.', function (done) {
    var grid = g({
      test: this.test,
      data: [
        {
          a:
            '<span style="background: ' +
            c.b +
            ';color: ' +
            c.b +
            '">blah</span>',
        },
      ],
      schema: [{ name: 'a', type: 'html' }],
    });
    setTimeout(function () {
      assertPxColor(grid, 50, 32, c.b, done);
    }, 100);
  });
}
