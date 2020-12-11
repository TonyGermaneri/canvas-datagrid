import {
  makeData,
  touchend,
  touchmove,
  touchstart,
  g,
  smallData,
  assertIf,
} from './util.js';

export default function () {
  it.skip('Touch and drag should scroll the grid vertically and horizontally', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    setTimeout(function () {
      grid.focus();
      touchstart(grid.canvas, 200, 37);
      touchmove(document.body, 90, 37, grid.canvas);
      setTimeout(function () {
        // simulate very slow movement of humans
        touchmove(document.body, 60, 66, grid.canvas);
        touchend(document.body, 60, 66, grid.canvas);
        setTimeout(function () {
          done(
            assertIf(
              grid.scrollLeft === 0,
              'Expected the grid to scroll some.',
            ),
          );
        }, 1500);
      }, 200);
    }, 1);
  });
  it.skip('Touch and drag should scroll the inner grid', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      tree: true,
    });
    grid.addEventListener('expandtree', function (e) {
      setTimeout(function () {
        e.treeGrid.focus();
        touchstart(grid.canvas, 200, 80);
        touchmove(document.body, 90, 80, grid.canvas);
        setTimeout(function () {
          // simulate very slow movement of humans
          touchmove(document.body, 60, 80, grid.canvas);
          touchend(document.body, 60, 80, grid.canvas);
          setTimeout(function () {
            done(
              assertIf(
                e.treeGrid.scrollLeft === 0,
                'Expected the grid to scroll some.',
              ),
            );
          }, 1500);
        }, 200);
      }, 1);
      e.treeGrid.data = [{ a: 'b', c: 'd', e: 'f', g: 'h' }];
    });
    grid.expandTree(0);
  });
  it.skip('Touch and drag on the scroll bar should engage fast scrolling', function (done) {
    var grid = g({
      test: this.test,
      data: makeData(30, 500),
    });
    setTimeout(function () {
      grid.focus();
      touchstart(grid.canvas, 50, 113);
      touchmove(document.body, 50, 113, grid.canvas);
      setTimeout(function () {
        // simulate very slow movement of humans
        touchmove(document.body, 100, 113, grid.canvas);
        touchend(document.body, 100, 113, grid.canvas);
        setTimeout(function () {
          done(
            assertIf(
              grid.scrollLeft < 400,
              'Expected the scroll bar to be further along.',
            ),
          );
        }, 100);
      }, 200);
    }, 1);
  });
  it('Use touchstart event to prevent touch events using e.preventDefault.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    grid.addEventListener('touchstart', function (e) {
      return e.preventDefault();
    });
    setTimeout(function () {
      grid.focus();
      touchstart(grid.canvas, 200, 37);
      setTimeout(function () {
        // simulate very slow movement of humans
        grid.focus();
        touchmove(document.body, 320, 90, grid.canvas);
        touchend(document.body, 320, 90, grid.canvas);
        setTimeout(function () {
          done(assertIf(grid.scrollLeft !== 0, 'Expected no movement.'));
        }, 1);
      }, 1000);
    }, 1);
  });
  it.skip('Use touchend event to prevent touch events using e.preventDefault.', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    grid.addEventListener('touchend', function (e) {
      return e.preventDefault();
    });
    setTimeout(function () {
      grid.focus();
      touchstart(grid.canvas, 200, 37);
      setTimeout(function () {
        // simulate very slow movement of humans
        grid.focus();
        touchmove(document.body, 320, 90, grid.canvas);
        touchend(document.body, 320, 90, grid.canvas);
        setTimeout(function () {
          done(assertIf(grid.scrollLeft !== 0, 'Expected no movement.'));
        }, 1);
      }, 1000);
    }, 1);
  });
  it.skip('Touch and hold should not start selecting or moving if very little movement before touchEnd', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
    });
    setTimeout(function () {
      grid.focus();
      touchstart(grid.canvas, 200, 37);
      setTimeout(function () {
        // simulate very slow movement of humans
        grid.focus();
        touchmove(document.body, 200, 38, grid.canvas);
        touchend(document.body, 200, 38, grid.canvas);
        setTimeout(function () {
          done(assertIf(grid.scrollLeft !== 0, 'Expected no movement.'));
        }, 1);
      }, 1000);
    }, 1);
  });
}
