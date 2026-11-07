import { makeData, smallData, delay, doAssert } from './util.js';

// The test page sizes every grid to 100% of its container through CSS custom
// properties. These tests are about the default, so they build their own
// container and put the grid back into auto mode.
function makeContainer(test, style) {
  var i = document.getElementById('grid'),
    a = document.createElement('div'),
    t = document.createElement('div'),
    d = document.createElement('div');
  a.className = 'test-container';
  t.className = 'grid-test-title';
  t.innerHTML = test.title;
  a.appendChild(t);
  a.appendChild(d);
  i.insertBefore(a, i.firstChild);
  Object.assign(d.style, style);
  return d;
}

function autoGrid(test, container, args) {
  var grid = canvasDatagrid(Object.assign({ parentNode: container }, args));
  // narrow columns, so a few of them fit the containers used here
  grid.style.cellWidth = 80;
  grid.style.height = 'auto';
  grid.style.width = 'auto';
  test.grid = grid;
  return grid;
}

function hasScrollBar(grid, direction) {
  return grid.visibleCells.some(function (cell) {
    return cell.style === direction + '-scroll-bar';
  });
}

function near(a, b, tolerance) {
  return Math.abs(a - b) <= (tolerance === undefined ? 1 : tolerance);
}

export default function () {
  it('Fills a container that has a size of its own', async function () {
    var container = makeContainer(this.test, {
      display: 'block',
      width: '350px',
      height: '300px',
    });
    var grid = autoGrid(this.test, container, { data: smallData() });
    await delay(50);
    doAssert(
      near(grid.canvas.offsetWidth, 350),
      'Expected the grid to fill the container width, got ' +
        grid.canvas.offsetWidth,
    );
    doAssert(
      near(grid.canvas.offsetHeight, 300),
      'Expected the grid to fill the container height, got ' +
        grid.canvas.offsetHeight,
    );
    doAssert(
      !hasScrollBar(grid, 'vertical') && !hasScrollBar(grid, 'horizontal'),
      'Expected no scroll bars when the data fits',
    );
  });

  it('Fits its rows when the container has no height of its own', async function () {
    var container = makeContainer(this.test, {
      display: 'block',
      width: '350px',
      height: 'auto',
    });
    var grid = autoGrid(this.test, container, { data: smallData() });
    await delay(50);
    var rows = grid.style.cellHeight * 4; // header + 3 rows
    doAssert(
      grid.canvas.offsetHeight >= rows &&
        grid.canvas.offsetHeight < rows + grid.style.cellHeight,
      'Expected the grid height to follow its rows, got ' +
        grid.canvas.offsetHeight,
    );
    doAssert(
      near(grid.canvas.offsetWidth, 350),
      'Expected the grid to fill the container width, got ' +
        grid.canvas.offsetWidth,
    );
    doAssert(
      near(container.offsetHeight, grid.canvas.offsetHeight),
      'Expected the container to wrap the grid, got ' + container.offsetHeight,
    );
    doAssert(grid.scrollHeight <= 0, 'Expected nothing to scroll');
    doAssert(!hasScrollBar(grid, 'vertical'), 'Expected no vertical bar');
  });

  it('Stops at the viewport height when the container has no height of its own', async function () {
    var container = makeContainer(this.test, {
      display: 'block',
      width: '350px',
      height: 'auto',
    });
    var grid = autoGrid(this.test, container, { data: makeData(2000, 3) });
    await delay(50);
    doAssert(
      near(grid.canvas.offsetHeight, window.innerHeight),
      'Expected the grid to stop at the viewport height ' +
        window.innerHeight +
        ', got ' +
        grid.canvas.offsetHeight,
    );
    doAssert(grid.scrollHeight > 0, 'Expected the rest of the rows to scroll');
    doAssert(hasScrollBar(grid, 'vertical'), 'Expected a vertical scroll bar');
  });

  it('Fits its columns when the container has no width of its own', async function () {
    var container = makeContainer(this.test, {
      display: 'inline-block',
      width: 'auto',
      height: 'auto',
    });
    var grid = autoGrid(this.test, container, { data: smallData() });
    await delay(50);
    var available = container.parentNode.clientWidth;
    doAssert(
      grid.canvas.offsetWidth < available - 10,
      'Expected the grid width to follow its columns, got ' +
        grid.canvas.offsetWidth +
        ' of ' +
        available,
    );
    doAssert(grid.scrollWidth <= 0, 'Expected nothing to scroll');
    doAssert(
      near(container.offsetWidth, grid.canvas.offsetWidth),
      'Expected the container to wrap the grid, got ' + container.offsetWidth,
    );
  });

  it('Leaves room for siblings in a container with a size of its own', async function () {
    var container = makeContainer(this.test, {
      display: 'block',
      width: '350px',
      height: '300px',
    });
    var toolbar = document.createElement('div');
    toolbar.style.height = '40px';
    container.appendChild(toolbar);
    var grid = autoGrid(this.test, container, { data: smallData() });
    await delay(50);
    doAssert(
      near(grid.canvas.offsetHeight, 260),
      'Expected the grid to take the height left by the toolbar, got ' +
        grid.canvas.offsetHeight,
    );
    doAssert(
      container.scrollHeight <= container.clientHeight,
      'Expected the grid not to overflow the container',
    );
  });

  it('Fills a flex column container next to a toolbar', async function () {
    var container = makeContainer(this.test, {
      display: 'flex',
      flexDirection: 'column',
      width: '350px',
      height: '300px',
    });
    var toolbar = document.createElement('div');
    toolbar.style.height = '40px';
    toolbar.style.flex = '0 0 40px';
    container.appendChild(toolbar);
    var grid = autoGrid(this.test, container, { data: smallData() });
    await delay(50);
    doAssert(
      near(grid.canvas.offsetHeight, 260),
      'Expected the grid to take the flex space left by the toolbar, got ' +
        grid.canvas.offsetHeight,
    );
    doAssert(
      near(grid.canvas.offsetWidth, 350),
      'Expected the grid to fill the flex container width, got ' +
        grid.canvas.offsetWidth,
    );
  });

  it('Follows the container when it is resized', async function () {
    var container = makeContainer(this.test, {
      display: 'block',
      width: '350px',
      height: '300px',
    });
    var grid = autoGrid(this.test, container, { data: smallData() });
    await delay(50);
    container.style.width = '250px';
    container.style.height = '200px';
    await delay(100);
    doAssert(
      near(grid.canvas.offsetWidth, 250) && near(grid.canvas.offsetHeight, 200),
      'Expected the grid to follow the container to 250x200, got ' +
        grid.canvas.offsetWidth +
        'x' +
        grid.canvas.offsetHeight,
    );
    // a container that switches to an auto height keeps the grid's height,
    // so there is no size change for the ResizeObserver to report; this one
    // needs an explicit resize()
    container.style.height = 'auto';
    grid.resize();
    await delay(50);
    doAssert(
      grid.canvas.offsetHeight < 200,
      'Expected the grid to shrink to its rows once the container height is auto, got ' +
        grid.canvas.offsetHeight,
    );
  });

  it('Sizes itself when a hidden container is shown', async function () {
    var container = makeContainer(this.test, {
      display: 'none',
      width: '350px',
      height: '300px',
    });
    var grid = autoGrid(this.test, container, { data: smallData() });
    await delay(50);
    container.style.display = 'block';
    await delay(100);
    doAssert(
      near(grid.canvas.offsetWidth, 350) && near(grid.canvas.offsetHeight, 300),
      'Expected the grid to fill the container once shown, got ' +
        grid.canvas.offsetWidth +
        'x' +
        grid.canvas.offsetHeight,
    );
  });

  it('Keeps an explicit size over the container size', async function () {
    var container = makeContainer(this.test, {
      display: 'block',
      width: '350px',
      height: '300px',
    });
    var grid = autoGrid(this.test, container, { data: smallData() });
    grid.style.height = '100px';
    grid.style.width = '200px';
    await delay(50);
    doAssert(
      near(grid.canvas.offsetWidth, 200) && near(grid.canvas.offsetHeight, 100),
      'Expected the explicit 200x100 size, got ' +
        grid.canvas.offsetWidth +
        'x' +
        grid.canvas.offsetHeight,
    );
    grid.style.height = 'auto';
    await delay(50);
    doAssert(
      near(grid.canvas.offsetHeight, 300),
      'Expected the grid to fill the container again, got ' +
        grid.canvas.offsetHeight,
    );
  });

  it('Shows a scroll bar in a tree grid whose rows overflow it', async function () {
    var child;
    var container = makeContainer(this.test, {
      display: 'block',
      width: '350px',
      height: '400px',
    });
    var grid = autoGrid(this.test, container, {
      data: makeData(3, 3),
      tree: true,
    });
    grid.addEventListener('expandtree', function (e) {
      child = e.treeGrid;
      child.data = makeData(60, 3);
    });
    grid.expandTree(0);
    await delay(100);
    doAssert(
      hasScrollBar(child, 'vertical'),
      'Expected the tree grid to show a vertical scroll bar',
    );
  });
}
