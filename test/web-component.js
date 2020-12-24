import { assertPxColor, blocks, g, smallData, assertIf, c } from './util.js';

export default function () {
  if (!window.customElements) return;

  it('Should create a web component, set a style', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      component: true,
    });
    grid.style.activeCellBackgroundColor = c.b;
    assertIf(grid.data.length !== 3, 'Expected to see data in the interface.');
    assertPxColor(grid, 80, 32, c.b, done);
  });
  it('Should create a web component and set a hyphenated style', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      component: true,
    });
    grid.style['active-cell-background-color'] = c.b;
    assertIf(grid.data.length !== 3, 'Expected to see data in the interface.');
    assertPxColor(grid, 80, 32, c.b, done);
  });
  it('Should create a web component and set a hyphenated style with a custom prefix', function (done) {
    var grid = g({
      test: this.test,
      data: smallData(),
      component: true,
    });
    grid.style['--cdg-active-cell-background-color'] = c.b;
    assertIf(grid.data.length !== 3, 'Expected to see data in the interface.');
    assertPxColor(grid, 80, 32, c.b, done);
  });
  it('Should create a web component and set a schema', function (done) {
    var grid = g({
      test: this.test,
      data: [{ a: blocks }],
      component: true,
    });
    grid.style.gridBackgroundColor = c.b;
    grid.schema = [{ name: 'a', width: 30 }];
    assertIf(grid.data.length !== 1, 'Expected to see data in the interface.');
    assertPxColor(grid, 80, 32, c.b, done);
  });
}
