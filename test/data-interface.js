import { g, assertIf } from './util.js';

export default function () {
  it('Pass array of objects.', function (done) {
    var grid = g({
      test: this.test,
    });
    grid.data = [
      { a: 0, b: 1, c: 2 },
      { a: 4, b: 5, c: 6 },
      { a: 7, b: 8, c: 9 },
    ];
    done(
      assertIf(
        grid.viewData[2].c !== 9,
        'Expected grid to be able to import and export this format',
      ),
    );
  });
  it('Pass array that contain other arrays of objects.', function (done) {
    var grid = g({
      test: this.test,
    });
    grid.data = [
      { a: 0, b: 1, c: 2 },
      {
        a: 4,
        b: [
          { a: 0, b: 1, c: 2 },
          { a: 4, b: 5, c: 6 },
          { a: 7, b: 8, c: 9 },
        ],
        c: 6,
      },
      { a: 7, b: 8, c: 9 },
    ];
    //TODO: this test cannot work until cell grids are fixed https://github.com/TonyGermaneri/canvas-datagrid/issues/35
    // so this test success is false
    done();
  });
  it('Pass array that contains an array of objects with mixed object/primitives as values.', function (done) {
    var grid = g({
      test: this.test,
    });
    grid.data = [
      { a: 0, b: 1, c: 2 },
      { a: 4, b: { a: 0, b: 1, c: 2 }, c: 6 },
      { a: 7, b: 8, c: 9 },
    ];
    //TODO: this test cannot work until cell grids are fixed https://github.com/TonyGermaneri/canvas-datagrid/issues/35
    // so this test success is false
    done();
  });
  it('Pass jagged data', function (done) {
    var grid = g({
      test: this.test,
    });
    grid.data = [['a', 'b', 'c'], ['1', '2'], ['q']];
    done(
      assertIf(
        grid.viewData[0][0] !== 'a',
        'Expected grid to be able to import and export this format',
      ),
    );
  });
}
