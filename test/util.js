export var blocks = '██████████████████';
// Template colors, for pixel tests
export var c = {
  b: 'rgb(0, 0, 255)',
  y: 'rgb(255, 255, 0)',
  r: 'rgb(255, 0, 0)',
  fu: 'rgb(255, 0, 255)',
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
};
// Marker colors, for visually identifying test points
export var markerColors = [
  '#a50026',
  '#d73027',
  '#f46d43',
  '#fdae61',
  '#fee090',
  '#e0f3f8',
  '#abd9e9',
  '#74add1',
  '#4575b4',
  '#313695',
];
// Sample data
export var smallData = function () {
  return [
    { col1: 'foo', col2: 0, col3: 'a' },
    { col1: 'bar', col2: 1, col3: 'b' },
    { col1: 'baz', col2: 2, col3: 'c' },
  ];
};

export const dataForGrouping = function () {
  return [
    { name: 'Mike', age: 40, sex: 'M', weight: 80 },
    { name: 'Janet', age: 20, sex: 'F', weight: 50 },
    { name: 'Wali', age: 30, sex: 'F', weight: 60 },
    { name: 'John', age: 50, sex: 'M', weight: 77 },
  ];
};

// Get color `c` of rgb vector `v`
//  Note: See c = {...} above for color options
export function getC(v) {
  return (
    Object.keys(c).filter(function (k) {
      return c[k] === v;
    })[0] || v
  );
}

// Convert number `n` to 'spreadsheet-style' column label `s`
//  Note: Zero-index, so 0 = A, 27 = AB, etc.
export function itoa(n) {
  var ordA = 'a'.charCodeAt(0),
    ordZ = 'z'.charCodeAt(0),
    len = ordZ - ordA + 1,
    s = '';
  while (n >= 0) {
    s = String.fromCharCode((n % len) + ordA) + s;
    n = Math.floor(n / len) - 1;
  }
  return s;
}

// Create data grid with `r` rows, `c` columns, and cell contents derived
// by the function `dFn`.
//  Note: If dFn does not exist, each cell is left blank.
export function makeData(r, c, dFn) {
  var y,
    x,
    d = [];
  for (y = 0; y < r; y += 1) {
    d[y] = {};
    for (x = 0; x < c; x += 1) {
      d[y][itoa(x)] = dFn ? dFn(y, x) : '';
    }
  }
  return d;
}

// Reset test environment
export function cleanup(done) {
  var m = document.getElementById('mocha');
  m.scrollTop = m.scrollHeight;
  if (this.currentTest && this.currentTest.grid) {
    this.currentTest.grid.disposeContextMenu();
  }
  done();
}

// Draws a 'crosshairs' marker at coordinates (x,y).
// The marker includes:
//  - A 1px vertical line at x
//  - A 1px horizontal line at y
//  - A 3px central marker centered at (x,y)
// Note: markerColors[...] selection ensures contrast between lines and
//  central marker
export function marker(grid, x, y) {
  grid.markerCount = grid.markerCount || 0;
  grid.markerCount += 1;
  grid.addEventListener('afterdraw', function () {
    grid.ctx.fillStyle =
      markerColors[
        (grid.markerCount + markerColors.length / 2) % markerColors.length
      ];
    grid.ctx.fillRect(0, y, grid.canvas.width, 1);
    grid.ctx.fillRect(x, 0, 1, grid.canvas.height);
    grid.ctx.fillStyle = markerColors[grid.markerCount % markerColors.length];
    grid.ctx.fillRect(x - 1, y - 1, 3, 3);
  });
}

export function assertPxColorFn(grid, x, y, expected) {
  var d, d2, match, e;
  x = x * window.devicePixelRatio;
  y = y * window.devicePixelRatio;
  return function (callback) {
    function f() {
      d = grid.ctx.getImageData(x, y, 1, 1).data;
      d2 = 'rgba(' + [d['0'], d['1'], d['2'], '1'].join(', ') + ')';
      d = 'rgb(' + [d['0'], d['1'], d['2']].join(', ') + ')';
      match = d === expected || d2 === expected;
      if (expected !== undefined) {
        e = new Error(
          'Expected color ' + getC(expected) + ' but got color ' + getC(d),
        );
        if (expected && !match) {
          console.error(e);
        }
        if (callback) {
          marker(grid, x, y);
          return callback(expected && !match ? e : undefined);
        }
      }
      requestAnimationFrame(grid.draw);
      return d;
    }
    if (!callback) {
      return f();
    }
    f();
  };
}
export function assertPxColor(grid, x, y, expected, callback) {
  return assertPxColorFn(grid, x, y, expected)(callback);
}
export function de(el, event, args) {
  var e = new Event(event);
  Object.keys(args).forEach(function (key) {
    e[key] = args[key];
  });
  el.dispatchEvent(e);
}
export function keydown(el, key, args) {
  args = args || {};
  args.key = key;
  de(el, 'keydown', args);
}
export function bb(el) {
  return el.getBoundingClientRect();
}
export function mouseup(el, x, y, bbEl) {
  var p = bb(bbEl || el);
  de(el, 'mouseup', { clientX: x + p.left, clientY: y + p.top });
}
export function mousemove(el, x, y, bbEl) {
  var p = bb(bbEl || el);
  de(el, 'mousemove', { clientX: x + p.left, clientY: y + p.top });
}
export function mousedown(el, x, y, bbEl) {
  var p = bb(bbEl || el);
  de(el, 'mousedown', { clientX: x + p.left, clientY: y + p.top });
}
export function contextmenu(el, x, y, bbEl) {
  var p = bb(bbEl || el);
  de(el, 'contextmenu', { clientX: x + p.left, clientY: y + p.top });
}
export function touchstart(el, x, y, bbEl) {
  var p = bb(bbEl || el);
  de(el, 'touchstart', {
    touches: [{ clientX: x + p.left, clientY: y + p.top }],
    changedTouches: [{ x: 0, y: 0 }],
  });
}
export function touchend(el, x, y, bbEl) {
  var p = bb(bbEl || el);
  de(el, 'touchend', {
    touches: [{ clientX: x + p.left, clientY: y + p.top }],
    changedTouches: [{ x: 0, y: 0 }],
  });
}
export function touchcancel(el, x, y, bbEl) {
  var p = bb(bbEl || el);
  de(el, 'touchcancel', {
    touches: [{ clientX: x + p.left, clientY: y + p.top }],
    changedTouches: [{ x: 0, y: 0 }],
  });
}
export function touchmove(el, x, y, bbEl) {
  var p = bb(bbEl || el);
  de(el, 'touchmove', {
    touches: [{ clientX: x + p.left, clientY: y + p.top }],
    changedTouches: [{ x: 0, y: 0 }],
  });
}
export function click(el, x, y, bbEl, ev) {
  var p = bb(bbEl || el);
  ev = ev || {};
  ev.clientX = x + p.left;
  ev.clientY = y + p.top;
  de(el, 'click', ev);
}
export function dblclick(el, x, y, bbEl) {
  var p = bb(bbEl || el);
  de(el, 'dblclick', { clientX: x + p.left, clientY: y + p.top });
}
export function g(args) {
  var grid,
    i = document.getElementById('grid'),
    a = document.createElement('div'),
    t = document.createElement('div'),
    d = document.createElement('div');
  a.className = 'test-container';
  d.className = 'grid-container';
  t.className = 'grid-test-title';
  t.innerHTML = args.test.title;
  function poll() {
    setTimeout(function () {
      if (args.test.state === 'failed') {
        t.classList.add('grid-test-failed');
        grid.draw();
      } else if (args.test.state === 'passed') {
        t.classList.add('grid-test-passed');
        grid.draw();
      } else {
        poll();
      }
    }, 10);
  }
  poll();
  delete args.testTitle;
  a.appendChild(t);
  a.appendChild(d);
  // i.appendChild(a);
  i.insertBefore(a, i.firstChild);
  args = args || {};
  args.parentNode = d;
  if (args.component) {
    grid = document.createElement('canvas-datagrid');
    d.appendChild(grid);
    Object.keys(args).forEach(function (arg) {
      if (arg === 'parentNode') {
        return;
      }
      grid[arg] = args[arg];
    });
  } else {
    grid = canvasDatagrid(args);
  }
  grid.style.height = '100%';
  grid.style.width = '100%';
  args.test.grid = grid;
  return grid;
}
export function assertIf(cond, msg) {
  var x;
  for (x = 2; x < arguments.length; x += 1) {
    msg = msg.replace(/%s|%n/, arguments[x]);
  }
  if (cond) {
    return new Error(msg);
  }
}
// This is a temporary assert, until we migrate
// testing libraries
export function doAssert(assertion, message) {
  if (!assertion) throw new Error(message);
}
