import {
  mouseup,
  mousedown,
  makeData,
  mousemove,
  g,
  assertIf,
  marker,
  delay,
  doAssert,
} from './util.js';

function wheel(canvas, deltaY) {
  var ev = new Event('wheel', { cancelable: true });
  ev.deltaX = 0;
  ev.deltaY = deltaY;
  ev.deltaMode = 0;
  canvas.dispatchEvent(ev);
}

export default function () {
  it('Scroll horizontally via box drag', function (done) {
    var grid = g({
      test: this.test,
      data: makeData(30, 50),
      scrollPointerLock: false,
    });
    setTimeout(function () {
      grid.focus();
      mousedown(grid.canvas, 53, 113);
      marker(grid, 53, 113);
      mousemove(window, 50, 113, grid.canvas);
      setTimeout(function () {
        // simulate very slow movement of humans
        marker(grid, 100, 113);
        mousemove(window, 100, 113, grid.canvas);
        mouseup(document, 100, 113, grid.canvas);
        done(
          assertIf(
            grid.scrollLeft < 100,
            'Expected the scroll bar to be further along.',
          ),
        );
      }, 200);
    }, 1);
  });
  it('Scroll horizontally right via margin click', function (done) {
    var grid = g({
      test: this.test,
      data: makeData(30, 500),
      scrollPointerLock: false,
    });
    setTimeout(function () {
      grid.focus();
      mousemove(grid.canvas, 100, 113);
      mousedown(grid.canvas, 100, 113);
      setTimeout(function () {
        mouseup(document, 100, 113, grid.canvas);
        done(
          assertIf(
            grid.scrollLeft < 1,
            'Expected the scroll bar to be further along.',
          ),
        );
      }, 500);
    }, 1);
  }).timeout(5000);
  it('Scroll horizontally right via margin click until box capture', function (done) {
    var grid = g({
      test: this.test,
      data: makeData(30, 10),
      scrollPointerLock: false,
    });
    setTimeout(function () {
      grid.focus();
      marker(grid, 100, 113);
      mousemove(grid.canvas, 100, 113);
      mousedown(grid.canvas, 100, 113);
      setTimeout(function () {
        mouseup(document, 100, 113, grid.canvas);
        done(
          assertIf(
            grid.scrollLeft < 1,
            'Expected the scroll bar to be further along.',
          ),
        );
      }, 500);
    }, 1);
  }).timeout(5000);
  it('Scroll horizontally left via margin click', function (done) {
    var grid = g({
      test: this.test,
      data: makeData(30, 500),
      scrollPointerLock: false,
    });
    marker(grid, 60, 113);
    grid.scrollLeft = grid.scrollWidth;
    setTimeout(function () {
      grid.focus();
      mousemove(grid.canvas, 60, 113);
      mousedown(grid.canvas, 60, 113);
      setTimeout(function () {
        mouseup(document, 60, 113, grid.canvas);
        done(
          assertIf(
            grid.scrollLeft === grid.scrollWidth,
            'Expected the scroll bar to be further along.',
          ),
        );
      }, 2000);
    }, 1);
  }).timeout(5000);
  it.skip('Scroll vertically via box drag', function (done) {
    var grid = g({
      test: this.test,
      data: makeData(30, 500),
      scrollPointerLock: false,
    });
    marker(grid, 395, 35);
    setTimeout(function () {
      grid.focus();
      mousedown(grid.canvas, 395, 35);
      mousemove(document, 395, 35, grid.canvas);
      setTimeout(function () {
        // simulate very slow movement of humans
        //marker(grid, 100, 113);
        mousemove(document, 395, 100, grid.canvas);
        mouseup(document, 395, 100, grid.canvas);
        done(
          assertIf(
            grid.scrollTop < 100,
            'Expected the scroll bar to be further along.',
          ),
        );
      }, 200);
    }, 1);
  });
  it('Scroll vertically down via margin click', function (done) {
    var grid = g({
      test: this.test,
      data: makeData(30, 500),
      scrollPointerLock: false,
    });
    setTimeout(function () {
      grid.focus();
      mousemove(grid.canvas, 395, 100);
      mousedown(grid.canvas, 395, 100);
      setTimeout(function () {
        mouseup(document, 395, 100, grid.canvas);
        done(
          assertIf(
            grid.scrollTop < 1,
            'Expected the scroll bar to be further along.',
          ),
        );
      }, 2000);
    }, 1);
  }).timeout(5000);
  it('Scroll vertically down via margin click until box capture', function (done) {
    var grid = g({
      test: this.test,
      data: makeData(30, 20),
      scrollPointerLock: false,
    });
    setTimeout(function () {
      grid.focus();
      marker(grid, 395, 70);
      mousemove(grid.canvas, 395, 70);
      mousedown(grid.canvas, 395, 70);
      setTimeout(function () {
        mouseup(document, 395, 70, grid.canvas);
        done(
          assertIf(
            grid.scrollTop < 1,
            'Expected the scroll bar to be further along.',
          ),
        );
      }, 2000);
    }, 1);
  }).timeout(5000);
  it('Scroll vertically up via margin click', function (done) {
    var grid = g({
      test: this.test,
      data: makeData(30, 500),
      scrollPointerLock: false,
    });
    grid.scrollTop = grid.scrollHeight;
    setTimeout(function () {
      grid.focus();
      marker(grid, 393, 75);
      mousemove(grid.canvas, 393, 75);
      mousedown(grid.canvas, 393, 75);
      setTimeout(function () {
        mouseup(document, 395, 75, grid.canvas);
        done(
          assertIf(
            grid.scrollTop === grid.scrollHeight,
            'Expected the scroll bar to be further along.',
          ),
        );
      }, 2000);
    }, 1);
  }).timeout(5000);
  it.skip('Scroll horizontally via wheel', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: makeData(30, 500),
      });
    grid.focus();
    ev = new Event('wheel');
    ev.deltaX = 10;
    ev.deltaY = 0;
    ev.deltaMode = 0;
    grid.canvas.dispatchEvent(ev);
    setTimeout(function () {
      done(
        assertIf(
          grid.scrollLeft < 1,
          'Expected the scroll bar to be further along.',
        ),
      );
    }, 100);
  });
  it.skip('Scroll vertically via wheel', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: makeData(30, 500),
      });
    grid.focus();
    ev = new Event('wheel');
    ev.deltaX = 0;
    ev.deltaY = 10;
    ev.deltaMode = 0;
    grid.canvas.dispatchEvent(ev);
    setTimeout(function () {
      done(
        assertIf(
          grid.scrollTop < 1,
          'Expected the scroll bar to be further along.',
        ),
      );
    }, 100);
  });
  it('Scroll vertically via wheel honoring deltaMode 0x01 DOM_DELTA_LINE', function (done) {
    var ev,
      grid = g({
        test: this.test,
        data: makeData(30, 500),
      });
    grid.focus();
    ev = new Event('wheel');
    ev.deltaX = 0;
    ev.deltaY = 1;
    ev.deltaMode = 1;
    grid.canvas.dispatchEvent(ev);
    setTimeout(function () {
      done(
        assertIf(
          grid.scrollTop < 1,
          'Expected the scroll bar to be further along.',
        ),
      );
    }, 100);
  });
  it('Wheel over a tree grid scrolls only the tree grid', async function () {
    var child;
    var grid = g({ test: this.test, data: makeData(60, 5), tree: true });
    grid.parentNode.style.height = '600px';
    grid.addEventListener('expandtree', function (e) {
      child = e.treeGrid;
      child.data = makeData(60, 5);
    });
    grid.expandTree(0);
    await delay(100);
    var x = child.parentNode.offsetLeft + 100,
      y = child.parentNode.offsetTop + 100;
    mousemove(window, x, y, grid.canvas);
    doAssert(
      !grid.hasFocus && child.hasFocus,
      'Expected only the tree grid to count as hovered',
    );
    wheel(grid.canvas, 40);
    await delay(60);
    doAssert(child.scrollTop > 0, 'Expected the tree grid to scroll');
    doAssert(grid.scrollTop === 0, 'The parent must not scroll');
    // a hovered tree grid with nothing left to scroll keeps the wheel too
    child.data = makeData(2, 5);
    await delay(60);
    mousemove(window, x, y, grid.canvas);
    wheel(grid.canvas, 40);
    await delay(60);
    doAssert(
      grid.scrollTop === 0,
      'The parent must not scroll when the hovered tree grid cannot',
    );
    // the parent still scrolls when it is the hovered grid
    mousemove(
      window,
      100,
      child.parentNode.offsetTop + child.parentNode.offsetHeight + 60,
      grid.canvas,
    );
    wheel(grid.canvas, 40);
    await delay(60);
    doAssert(grid.scrollTop > 0, 'Expected the parent to scroll when hovered');
  });
  it('Wheel over a nested tree grid scrolls only the innermost grid', async function () {
    var child, grandchild;
    var grid = g({
      test: this.test,
      data: makeData(60, 5),
      tree: true,
      treeGridAttributes: { tree: true, style: { treeGridHeight: 200 } },
    });
    grid.parentNode.style.height = '800px';
    grid.style.treeGridHeight = 500;
    grid.addEventListener('expandtree', function (e) {
      child = e.treeGrid;
      child.data = makeData(60, 5);
      child.addEventListener('expandtree', function (e2) {
        grandchild = e2.treeGrid;
        grandchild.data = makeData(60, 5);
      });
    });
    grid.expandTree(0);
    await delay(100);
    child.expandTree(0);
    await delay(100);
    var x = grandchild.parentNode.offsetLeft + 100,
      y = grandchild.parentNode.offsetTop + 100;
    mousemove(window, x, y, grid.canvas);
    wheel(grid.canvas, 40);
    await delay(60);
    doAssert(grandchild.scrollTop > 0, 'Expected the innermost grid to scroll');
    doAssert(child.scrollTop === 0, 'The middle grid must not scroll');
    doAssert(grid.scrollTop === 0, 'The outer grid must not scroll');
    grandchild.data = makeData(2, 5);
    await delay(60);
    mousemove(window, x, y, grid.canvas);
    wheel(grid.canvas, 40);
    await delay(60);
    doAssert(
      child.scrollTop === 0 && grid.scrollTop === 0,
      'No ancestor may scroll when the hovered grid cannot',
    );
  });
  it('Collapsing a tree grid stops it from taking the wheel', async function () {
    var child;
    var grid = g({ test: this.test, data: makeData(60, 5), tree: true });
    grid.parentNode.style.height = '600px';
    grid.addEventListener('expandtree', function (e) {
      child = e.treeGrid;
      child.data = makeData(60, 5);
    });
    grid.expandTree(0);
    await delay(100);
    var x = child.parentNode.offsetLeft + 100,
      y = child.parentNode.offsetTop + 100;
    mousemove(window, x, y, grid.canvas);
    grid.collapseTree(0);
    await delay(60);
    mousemove(window, x, y, grid.canvas);
    wheel(grid.canvas, 40);
    await delay(60);
    doAssert(
      grid.scrollTop > 0,
      'Expected the parent to scroll where the tree grid used to be',
    );
  });
}
