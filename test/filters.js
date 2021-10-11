import { g, assertIf, doAssert  } from './util.js';

export default function () {
  it('Should filter for given value', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: 'abcd' }, { d: 'edfg' }],
    });
    grid.setFilter('d', 'edfg');
    done(
      assertIf(
        grid.viewData.length === 0 && grid.viewData[0].d === 'edfg',
        'Expected filter to remove all but 1 row.',
      ),
    );
  });
  it('Should filter for blank values', function (done) {
    var grid = g({
      test: this.test,
      data: [
        { d: 'abcd' },
        { d: null },
        { d: undefined },
        { d: '' },
        { d: '       ' },
        { d: 'edfg' },
      ],
    });
    grid.setFilter('d', '(Blanks)');
    var filteredValuesOnly = grid.viewData.map((obj) => obj.d);
    var onlyBlanks =
      filteredValuesOnly.length === 4 &&
      filteredValuesOnly.every((item) =>
        [undefined, null, '', '       '].includes(item),
      );
    done(assertIf(!onlyBlanks, 'Expected filter remove non-null/empty values'));
  });
  it('Should filter for blank values (numbers)', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: 1 }, { d: null }, { d: undefined }, { d: '' }, { d: 2 }],
      schema: [{ name: 'd', type: 'number' }],
    });
    grid.setFilter('d', '(Blanks)');
    var filteredValuesOnly = grid.viewData.map((obj) => obj.d);
    var onlyBlanks =
      filteredValuesOnly.length === 3 &&
      filteredValuesOnly.every((item) => [undefined, null, ''].includes(item));
    done(assertIf(!onlyBlanks, 'Expected filter remove non-null/empty values'));
  });
  it('Should remove all filters', function (done) {
    var grid = g({
      test: this.test,
      data: [
        { d: 'abcd', e: 'qwert' },
        { d: 'edfg', e: 'asdfg' },
      ],
    });
    grid.setFilter('d', 'edfg');
    grid.setFilter('e', 'asdfg');
    grid.setFilter();
    done(
      assertIf(
        grid.viewData.length !== 2,
        'Expected to see all the records return.',
      ),
    );
  });
  it('Should remove a specific filter by passing empty string', function (done) {
    var grid = g({
      test: this.test,
      data: [
        { d: 'abcd', e: 'qwert' },
        { d: 'edfg', e: 'asdfg' },
      ],
    });
    grid.setFilter('d', 'edfg');
    grid.setFilter('e', 'asdfg');
    grid.setFilter('e', '');
    done(
      assertIf(grid.viewData.length !== 1, 'Expected to see 1 of the records.'),
    );
  });
  it('Should remove a specific filter by passing undefined', function (done) {
    var grid = g({
      test: this.test,
      data: [
        { d: 'abcd', e: 'qwert' },
        { d: 'edfg', e: 'asdfg' },
      ],
    });
    grid.setFilter('d', 'edfg');
    grid.setFilter('e', 'asdfg');
    grid.setFilter('e');
    done(
      assertIf(grid.viewData.length !== 1, 'Expected to see 1 of the records.'),
    );
  });
  it('Should use RegExp as a filter', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: 'abcd' }, { d: 'edfg' }],
    });
    grid.setFilter('d', '/\\w/');
    done(
      assertIf(
        grid.viewData.length === 0 && grid.viewData[0].d === 'edfg',
        'Expected to see a row after a RegExp value.',
      ),
    );
  });
  it('Should tolerate RegExp errors', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: 'abcd' }, { d: 'edfg' }],
    });
    grid.setFilter('d', '/{1}/');
    done();
  });
  it('Should not reset filter when non-existant columns passed to setFilter', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: 'abcd' }, { d: 'edfg' }],
    });
    grid.setFilter('d', 'a');
    grid.setFilter('x', 'a');
    done(
      assertIf(grid.viewData.length !== 1, 'Expected to see only 1 record.'),
    );
  });
  it('Should apply correct type filtering method when column filter not set', function (done) {
    var grid = g({
      test: this.test,
      data: [{ num: 1234 }, { num: 1 }],
      schema: [{ name: 'num', type: 'int' }],
      filters: {
        int: function (value, filterFor) {
          return !filterFor || value.toString() === filterFor;
        },
      },
    });
    delete grid.schema[0].filter;
    grid.setFilter('num', '1');
    done(
      assertIf(grid.viewData.length !== 1, 'Expected to see only 1 record.'),
    );
  });
  it('Should apply filter to new data when data is set', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: 'abcd' }, { d: 'edfg' }],
    });
    grid.setFilter('d', 'a');
    grid.data = [{ d: 'gfde' }, { d: 'dcba' }];
    done(
      assertIf(grid.viewData.length !== 1, 'Expected to see only 1 record.'),
    );
  });
  it('Should retain filters of columns not in new data when data is set', function (done) {
    var grid = g({
      test: this.test,
      data: [{ d: 'abcd' }, { d: 'edfg' }],
    });
    grid.setFilter('d', 'a');

    grid.data = [{ x: 'aaaa' }, { x: 'aaaa' }];
    grid.data = [{ d: 'gfde' }, { d: 'dcba' }];

    done(
      assertIf(grid.viewData.length !== 1, 'Expected to see only 1 record.'),
    );
  });
  it('filter ignores row on and above frozen row', function (done) {
    var grid = g({
      test: this.test,
      data: [
        { d: 'baz' },
        { d: 'foo frozen row' },
        { d: 'foo1' },
        { d: 'foo2' },
        { d: 'bar' },
      ],
      allowFreezingRows: true,
      filterFrozenRows: false,
      frozenRow: 1,
    });
    grid.frozenRow = 2;
    grid.setFilter('d', 'bar');

    done(
      doAssert(
        grid.viewData.length === 3 &&
          grid.viewData[0].d === 'baz' &&
          grid.viewData[1].d === 'foo frozen row' &&
          grid.viewData[2].d === 'bar',
        'Expected filter to filter ignore rows on and above frozen row.',
      ),
    );
  });  
}
